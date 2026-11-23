
#!/usr/bin/env python3
# WTP LIVE ETA API — WERSJA: 189 (trwałe poprawki odcinków; API v67 zachowane)
import os
import json
import threading
from collections import defaultdict
import re
import sqlite3
from contextlib import contextmanager
from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import FastAPI, HTTPException, Query

DB_PATH = os.environ.get("ETA_DB_PATH", "/opt/wtp-live/data/eta_v2.db")
TZ = ZoneInfo("Europe/Warsaw")
app = FastAPI(title="WTP LIVE ETA", version="1.189")

@contextmanager
def database():
    if not os.path.isfile(DB_PATH):
        raise HTTPException(503, "ETA database unavailable")
    db = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True, timeout=15)
    db.row_factory = sqlite3.Row
    try:
        yield db
    finally:
        db.close()

def rows(db, sql, params=()):
    return [dict(r) for r in db.execute(sql, params).fetchall()]

def seconds(value):
    if value is None:
        return None
    m = re.search(r"(\d{1,3}):(\d{2})(?::(\d{2}))?", str(value))
    if not m:
        return None
    if int(m.group(2)) > 59 or int(m.group(3) or 0) > 59:
        return None
    return int(m.group(1))*3600 + int(m.group(2))*60 + int(m.group(3) or 0)

# v58: oznaczenia NŻ z ETA / odcinki, a nie ze zgadywania po współrzędnych.
# Cache odtwarzany przy wymianie codziennej bazy; nie wykonuje 52 tys. skanów na kurs.
_odcinki_lock = threading.Lock()
_odcinki_cache = {"signature": None, "by_key": {}}

# v66: role przystanków odczytywane z bieżącej bazy ETA, sekcja odcinki.
# Nie korzystamy z żadnego zewnętrznego CSV.
_ODCINKI_FLAGS = ('slupek_na_zadanie', 'tras_dla_wysiadajacych',
                  'tras_dla_wsiadajacych', 'tras_kraniec',
                  'slupek_nie_dla_pasazera', 'tras_objazdowy')

def _eta_bool(value):
    if value in (True, 1, '1', 'true', 'True', 'TAK', 'tak'):
        return 1
    if value in (False, 0, '0', 'false', 'False', 'NIE', 'nie'):
        return 0
    return None

def _odcinki_index(db):
    try:
        st = os.stat(DB_PATH)
        signature = (st.st_dev, st.st_ino, st.st_size, st.st_mtime_ns)
    except OSError:
        return {}
    if _odcinki_cache['signature'] == signature:
        return _odcinki_cache['by_key']
    with _odcinki_lock:
        if _odcinki_cache['signature'] == signature:
            return _odcinki_cache['by_key']
        indexed = defaultdict(list)
        for (raw,) in db.execute("SELECT payload FROM eta_rows WHERE section='odcinki'"):
            try:
                d = json.loads(raw)
                key = (str(int(d['id_wariantu'])), str(int(d['id_slupka'])))
                seq = int(d['numer_trasy'])
                flags = {k: _eta_bool(d.get(k)) for k in _ODCINKI_FLAGS}
                indexed[key].append((seq, flags))
            except (TypeError, ValueError, KeyError, json.JSONDecodeError):
                continue
        for key in indexed:
            indexed[key].sort(key=lambda x: x[0])
        _odcinki_cache.update(signature=signature, by_key=dict(indexed))
        return _odcinki_cache['by_key']

# v260: indeks metadanych słupków wyłącznie z oryginalnego ETA / odcinki.
# Łączenie po (wariant, id_slupka), bez dopasowania po czasie do GTFS.
_eta_stop_lock = threading.Lock()
_eta_stop_cache = {'signature': None, 'index': {}}
_ETA_NAME_FIELDS = ('nazwa_slupka', 'nazwa_przystanku', 'nazwa_zespolu',
                    'nazwa_punktu', 'nazwa_postoju', 'nazwa', 'stop_name',
                    'name', 'oznaczenie_slupka', 'symbol_slupka',
                    'oznaczenie_przystanku', 'symbol', 'kod')
_ETA_PLATFORM_FIELDS = ('numer_slupka', 'nr_slupka', 'slupek', 'stop_no')

def _eta_stop_index(db):
    st = os.stat(DB_PATH)
    signature = (st.st_ino, st.st_size, st.st_mtime_ns)
    if _eta_stop_cache['signature'] == signature:
        return _eta_stop_cache['index']
    with _eta_stop_lock:
        if _eta_stop_cache['signature'] == signature:
            return _eta_stop_cache['index']
        index = defaultdict(list)
        for (raw,) in db.execute("SELECT payload FROM eta_rows WHERE section='odcinki'"):
            try:
                data = json.loads(raw)
                variant = str(int(data['id_wariantu']))
                stop = str(int(data['id_slupka']))
                index[(variant, stop)].append(data)
            except (ValueError, TypeError, KeyError, json.JSONDecodeError):
                continue
        _eta_stop_cache.update(signature=signature, index=dict(index))
        return _eta_stop_cache['index']

def _eta_enrich_stop(item, data, index):
    try:
        key = (str(int(data['id_wariantu'])), str(int(data.get('id_slupka', item['stop_id']))))
    except (ValueError, TypeError, KeyError):
        return
    candidates = [data] + index.get(key, [])
    for field in _ETA_NAME_FIELDS + _ETA_PLATFORM_FIELDS:
        values = {str(row[field]).strip() for row in candidates
                  if row.get(field) is not None and str(row[field]).strip()}
        if len(values) == 1:
            item.setdefault(field, next(iter(values)))
    # Nie tworzymy nazw z identyfikatorów, jeśli ETA ich nie udostępnia.
    for field in ('gps_n', 'gps_e', 'lat', 'lon', 'latitude', 'longitude'):
        values = {str(row[field]).strip() for row in candidates
                  if row.get(field) is not None and str(row[field]).strip()}
        if len(values) == 1:
            item.setdefault(field, next(iter(values)))
    item['eta_source'] = 'kursy_przejazdy+odcinki'

# v261: nazwy, numery i współrzędne wyłącznie ze słowników ETA.
# Oddzielna baza nie znika podczas codziennej atomowej wymiany eta_v2.db.
ETA_DICTIONARY_DB = os.getenv('ETA_DICTIONARY_DB', '/opt/wtp-live/data/eta_slowniki.db')

def _dictionary_connection():
    if not os.path.isfile(ETA_DICTIONARY_DB):
        return None
    try:
        con = sqlite3.connect('file:' + ETA_DICTIONARY_DB + '?mode=ro', uri=True, timeout=5)
        con.row_factory = sqlite3.Row
        return con
    except sqlite3.Error:
        return None

def _eta_dictionary_enrich(result):
    con = _dictionary_connection()
    if con is None: return
    try:
        ids = list(dict.fromkeys(str(item['stop_id']) for item in result if item.get('stop_id') is not None))
        records = {}
        for start in range(0,len(ids),400):
            batch=ids[start:start+400]
            if not batch: continue
            query = """SELECT s.id_slupka,s.id_przystanku,s.nazwa_slupka,s.numer_slupka,
                s.symbol_slupka,s.gps_s,s.gps_n,p.nazwa_przystanku
                FROM slupki s LEFT JOIN przystanki p ON p.id_przystanku=s.id_przystanku
                WHERE s.id_slupka IN (""" + ','.join('?' for _ in batch) + ')'
            for row in con.execute(query,batch): records[str(row['id_slupka'])]=dict(row)
        for item in result:
            rec=records.get(str(item.get('stop_id')))
            if not rec:continue
            for key,value in rec.items():
                if value is not None and str(value).strip():
                    item[key]=value
            # Nazwa przystanku to nazwa zespołu, nie numer słupka ani symbol.
            name=rec.get('nazwa_przystanku') or rec.get('nazwa_slupka')
            if name:item['nazwa_przystanku']=name
            # W słowniku ETA nazwa_slupka='01' jest numerem słupka;
            # numer_slupka w kursy_przejazdy jest pozycją na trasie.
            platform=str(rec.get('numer_slupka') or rec.get('nazwa_slupka') or '').strip()
            if platform:item['eta_platform_number']=platform;item['numer_slupka']=platform
            item['eta_source']='kursy_przejazdy+slowniki'
    except sqlite3.Error:
        pass
    finally:con.close()

def stop_data(db, course_id):
    result = rows(db, """SELECT seq,stop_id,arrival,departure,payload
                       FROM course_stops WHERE course_id=? ORDER BY seq""", (course_id,))
    index = _odcinki_index(db)
    eta_index = _eta_stop_index(db)
    for item in result:
        payload = item.pop('payload', None)
        # v259: ETA course stop metadata must reach the browser. Keep the
        # original stop_id, expose only scalar source fields; do not invent names.
        try:
            source = json.loads(payload or '{}')
            if isinstance(source, dict):
                _eta_enrich_stop(item, source, eta_index)
                for key, val in source.items():
                    if key not in item and isinstance(val, (str, int, float, bool)):
                        item[key] = val
                item['eta_source'] = 'kursy_przejazdy'
        except (ValueError, TypeError, json.JSONDecodeError):
            pass
        for k in _ODCINKI_FLAGS:
            item[k] = None
        item['stop_role'] = None
        try:
            data = json.loads(payload or '{}')
            variant = str(int(data['id_wariantu']))
            stop = str(int(data.get('id_slupka', item['stop_id'])))
            options = index.get((variant, stop), [])
            # Gdy ten sam słupek występuje wielokrotnie w wariancie,
            # nie zgadujemy roli, jeśli rekordy mają sprzeczne flagi.
            for flag in _ODCINKI_FLAGS:
                values = {flags[flag] for _, flags in options if flags[flag] is not None}
                if len(values) == 1:
                    item[flag] = next(iter(values))
            if item['tras_dla_wysiadajacych'] == 1 and item['tras_dla_wsiadajacych'] != 1:
                item['stop_role'] = 'wys'
            elif item['tras_dla_wsiadajacych'] == 1 and item['tras_dla_wysiadajacych'] != 1:
                item['stop_role'] = 'ws'
            elif item['slupek_nie_dla_pasazera'] == 1:
                item['stop_role'] = 'tech'
            item['id_wariantu'] = variant
        except (ValueError, TypeError, KeyError, json.JSONDecodeError):
            pass
    _eta_dictionary_enrich(result)
    return result

@app.get("/health")
def health():
    with database() as db:
        count = db.execute("SELECT COUNT(*) FROM courses").fetchone()[0]
        metadata = rows(db, "SELECT key,value FROM metadata WHERE key IN ('date','version')")
        return {"ok": True, "courses": count,
                "metadata": {r["key"]: r["value"] for r in metadata},
                "api_version": 186}

@app.get("/lines")
def lines():
    with database() as db:
        return {"lines": rows(db, """
          SELECT b.line_name AS line, COUNT(*) AS courses
          FROM courses c JOIN boards b ON b.schedule_id=c.schedule_id
          WHERE b.line_name IS NOT NULL AND b.line_name != ''
          GROUP BY b.line_name ORDER BY b.line_name""")}

def service_date(at: str | None = None) -> str:
    """Warsaw service date; optional ISO timestamp/date for historical diagnostics."""
    if not at:
        return datetime.now(TZ).date().isoformat()
    try:
        instant = datetime.fromisoformat(at)
        if instant.tzinfo is None:
            instant = instant.replace(tzinfo=TZ)
        return instant.astimezone(TZ).date().isoformat()
    except ValueError:
        raise HTTPException(400, "Use ISO 8601 for at")

@app.get("/courses")
def courses(line: str = Query(min_length=1, max_length=30),
            brigade: str | None = Query(default=None, max_length=30),
            limit: int = Query(default=100, ge=1, le=5000),
            at: str | None = None):
    service_day = service_date(at)
    sql = """SELECT c.course_id,c.task_id,c.schedule_id,c.brigade,
                    c.departure,b.line_name AS line
             FROM courses c JOIN boards b ON b.schedule_id=c.schedule_id
             WHERE b.line_name=?
                AND (b.valid_from IS NULL OR b.valid_from="" OR b.valid_from<=?)
                AND (b.valid_to IS NULL OR b.valid_to="" OR b.valid_to>=?)"""
    params = [line, service_day, service_day]
    if brigade is not None:
        sql += " AND TRIM(CAST(c.brigade AS TEXT))=?"
        params.append(brigade.strip())
    sql += " ORDER BY c.departure LIMIT ?"
    params.append(limit)
    with database() as db:
        return {"line":line,"brigade":brigade,"courses":rows(db,sql,params)}

@app.get("/courses/{course_id}/stops")
def course_stops(course_id: str):
    if not re.fullmatch(r"\d{1,20}",course_id):
        raise HTTPException(400,"Invalid course ID")
    with database() as db:
        course = rows(db, """SELECT c.course_id,c.task_id,c.schedule_id,
                                    c.brigade,c.departure,b.line_name AS line
                             FROM courses c LEFT JOIN boards b
                             ON b.schedule_id=c.schedule_id
                             WHERE c.course_id=?""",(course_id,))
        if not course:
            raise HTTPException(404,"Course not found")
        return {"course":course[0],"stops":stop_data(db,course_id)}

@app.get("/match")
def match(line: str = Query(min_length=1,max_length=30),
          brigade: str = Query(min_length=1,max_length=30),
          at: str | None = None,
          stop_id: str | None = None,
          include_stops: bool = True):
    try:
        now = datetime.fromisoformat(at) if at else datetime.now(TZ)
        if now.tzinfo is None:
            now = now.replace(tzinfo=TZ)
        now = now.astimezone(TZ)
    except ValueError:
        raise HTTPException(400,"Use ISO 8601 for at")
    day_seconds = now.hour*3600+now.minute*60+now.second
    service_day = now.date().isoformat()

    sql = """SELECT c.course_id,c.task_id,c.schedule_id,c.brigade,
                    c.departure,b.line_name AS line
             FROM courses c JOIN boards b ON b.schedule_id=c.schedule_id
             WHERE b.line_name=?
               AND TRIM(CAST(c.brigade AS TEXT))=?
               AND (b.valid_from IS NULL OR b.valid_from="" OR b.valid_from<=?)
               AND (b.valid_to IS NULL OR b.valid_to="" OR b.valid_to>=?)"""

    with database() as db:
        metadata = dict((r["key"],r["value"]) for r in
                        rows(db,"SELECT key,value FROM metadata WHERE key IN ('date','version')"))
        db_date = metadata.get("date")
        # metadata.date oznacza datę archiwum, nie dzień obowiązywania każdej tabliczki.
        # Rozkłady filtrujemy po indywidualnym okresie ważności tabliczki.
        candidates = rows(db,sql,(line,brigade.strip(),service_day,service_day))
        ranked = []
        for c in candidates:
            stops = stop_data(db,c["course_id"])
            times = []
            for s in stops:
                t = seconds(s["arrival"])
                if t is None:
                    t = seconds(s["departure"])
                if t is not None:
                    times.append(t)

            start = seconds(c["departure"])
            if start is None and times:
                start = min(times)
            if start is None:
                continue

            end = max(times) if times else start+3600
            if end < start:
                end += 86400

            best = None
            for current in (day_seconds,day_seconds+86400):
                if start-900 <= current <= end+1800:
                    distance = 0 if start <= current <= end else min(abs(current-start),abs(current-end))
                    if best is None or distance < best:
                        best = distance
            if best is None:
                continue

            if stop_id is not None and not any(str(s["stop_id"]) == stop_id for s in stops):
                continue

            ranked.append((best,c,stops))

        ranked.sort(key=lambda x:(x[0], seconds(x[1]["departure"]) or 0))

        if not ranked:
            return {"status":"no_match","line":line,"brigade":brigade,
                    "database_date":db_date,"course":None}

        # All active courses score zero in the old algorithm. Never silently
        # select one when multiple courses overlap in time.
        best_matches = [r for r in ranked if r[0] == ranked[0][0]]
        selected = ranked[0]
        status = "candidate" if len(best_matches)==1 else "ambiguous"

        return {
            "status":status,
            "line":line,
            "brigade":brigade,
            "at":now.isoformat(),
            "database_date":db_date,
            "course":selected[1] if status=="candidate" else None,
            "stops":selected[2] if include_stops and status=="candidate" else [],
            "candidates":[{"course":r[1],"time_distance_seconds":r[0]}
                          for r in ranked[:10]],
            "verified_by_gps": False,
            "message":"Temporal match only; GPS confirmation not implemented"
        }



@app.get("/vehicle-match")
def vehicle_match(line: str = Query(min_length=1,max_length=30),
                  brigade: str = Query(min_length=1,max_length=30),
                  lat: float = Query(ge=51,le=53), lon: float = Query(ge=19,le=23),
                  at: str | None = None):
    """Combines GPS observation with timetable candidates; does not falsely verify GPS."""
    result = match(line=line, brigade=brigade, at=at, include_stops=False)
    return {**result, "gps": {"lat":lat,"lon":lon},
            "verified_by_gps":False,
            "message":"GPS position attached. Spatial route verification requires validated ETA geometry and stop mapping; do not present this as a confirmed course."}

# v60: server-side GPS data; shared by all clients, persisted independently of UI.
GPS_DB_PATH = os.environ.get('WTP_GPS_DB', '/opt/wtp-live/data/gps_history.db')

@app.get('/vehicle-state')
def vehicle_state(type: int = Query(ge=1, le=2),
                  vehicle: str = Query(min_length=1, max_length=32)):
    if not os.path.isfile(GPS_DB_PATH):
        raise HTTPException(503, 'GPS database unavailable')
    db = sqlite3.connect(f'file:{GPS_DB_PATH}?mode=ro', uri=True, timeout=10)
    db.row_factory = sqlite3.Row
    try:
        try:
            state = db.execute('SELECT * FROM tracker_state WHERE type=? AND vehicle=?', (type, vehicle)).fetchone()
        except sqlite3.OperationalError:
            return {'type':type,'vehicle':vehicle,'status':'tracker_not_started'}
        if not state or not state['course_id']:
            return {'type':type,'vehicle':vehicle,'status':'unmatched'}
        # Nie pokazuj starego dopasowania pojazdu jako aktualnego.
        import time
        if int(time.time()*1000)-int(state['last_stamp'])>15*60*1000:
            return {'type':type,'vehicle':vehicle,'status':'stale_gps','last_gps_stamp':state['last_stamp']}
        cid=state['course_id']
        events=[dict(r) for r in db.execute('''SELECT stop_seq,stop_id,event,stamp,source FROM stop_events
            WHERE type=? AND vehicle=? AND course_id=? ORDER BY stamp''',(type,vehicle,cid))]
        predictions=[dict(r) for r in db.execute('''SELECT stop_seq,predicted_stamp,updated_stamp,source FROM vehicle_predictions
            WHERE type=? AND vehicle=? AND course_id=? ORDER BY stop_seq''',(type,vehicle,cid))]
        assignments=[dict(r) for r in db.execute('''SELECT course_id,line,brigade,start_stamp,end_stamp,source FROM vehicle_courses
            WHERE type=? AND vehicle=? ORDER BY start_stamp DESC LIMIT 20''',(type,vehicle))]
        return {'type':type,'vehicle':vehicle,'status':'matched','course_id':cid,
                'line':state['line'],'brigade':state['brigade'],'last_gps_stamp':state['last_stamp'],
                'route_point':state['progress'],'events':events,'predictions':predictions,
                'assignments':assignments,'verified_by_gps':False,
                'note':'Schedule candidate with GPS route proximity; stop events are GPS geofence estimates.'}
    finally:
        db.close()


# v61: rzeczywiste punkty geometrii ETA; nie łączymy przystanków prostymi.
_route_cache_lock = threading.Lock()
_route_cache = {'signature': None, 'variants': {}}

def _route_shapes(db):
    st = os.stat(DB_PATH)
    signature = (st.st_ino, st.st_mtime_ns, st.st_size)
    if _route_cache['signature'] == signature:
        return _route_cache['variants']
    with _route_cache_lock:
        if _route_cache['signature'] == signature:
            return _route_cache['variants']
        result = defaultdict(list)
        for (raw,) in db.execute("SELECT payload FROM eta_rows WHERE section='kształt_trasy_GPS'"):
            try:
                item = json.loads(raw)
                variant = str(item['id_wariantu'])
                seq = int(item['numer_punktu'])
                lat, lon = float(item['gps_n']), float(item['gps_e'])
                if 51 < lat < 53 and 19 < lon < 23:
                    result[variant].append((seq, lat, lon, str(item.get('id_slupka') or '')))
            except (ValueError, TypeError, KeyError, json.JSONDecodeError):
                continue
        for points in result.values():
            points.sort(key=lambda x: x[0])
        _route_cache.update(signature=signature, variants=dict(result))
        return _route_cache['variants']

# v64: opcjonalna geometria v4 z plików linii; awaryjnie oryginalne ETA.
# JSON v4: coordinates w kolejności [lat, lon], stop_anchors wskazują punkty ETA.
GEOMETRY_DIR = os.environ.get('WTP_GEOMETRY_DIR', '/opt/wtp-live/geometry-v4')
_geometry_lock = threading.Lock()
_geometry_files = {}  # line -> (mtime_ns, size, parsed JSON)

def _geometry_file(line):
    if not line or not re.fullmatch(r'[A-Za-z0-9_-]{1,30}', str(line)):
        return None
    path = os.path.join(GEOMETRY_DIR, str(line) + '.json')
    try:
        st = os.stat(path)
        signature = (st.st_mtime_ns, st.st_size)
        with _geometry_lock:
            cached = _geometry_files.get(str(line))
            if cached and cached[0] == signature:
                return cached[1]
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
        if not isinstance(data, dict) or str(data.get('line')) != str(line):
            return None
        if data.get('coordinates_order') not in ('lat_lon', 'lat,lon', 'lat-lon'):
            # Wymagamy jawnego porządku współrzędnych.
            return None
        if not isinstance(data.get('variants'), dict):
            return None
        with _geometry_lock:
            _geometry_files[str(line)] = (signature, data)
        return data
    except (OSError, ValueError, TypeError, json.JSONDecodeError):
        return None

def _distance_sq(a, b):
    # Dla dopasowania punktów w Warszawie wystarczy lokalne przybliżenie.
    dy = (a[0] - b[0]) * 111_200
    dx = (a[1] - b[1]) * 67_700
    return dx * dx + dy * dy

def _v4_course_points(line, variant, entries):
    data = _geometry_file(line)
    if not data:
        return None
    item = data['variants'].get(str(variant))
    if not isinstance(item, dict):
        return None
    raw = item.get('coordinates')
    anchors = item.get('stop_anchors')
    if not isinstance(raw, list) or len(raw) < 2 or not isinstance(anchors, list):
        return None
    try:
        coords = [(float(p[0]), float(p[1])) for p in raw]
        if any(not (51 < lat < 53 and 19 < lon < 23) for lat, lon in coords):
            return None
    except (TypeError, ValueError, IndexError):
        return None

    # Punkty słupków znajdujemy po ID i kolejności, a następnie dopasowujemy
    # do najbliższego punktu zagęszczonej geometrii. Nie używamy starych indeksów ETA.
    by_stop = defaultdict(list)
    for a in anchors:
        try:
            sid = str(a['id_slupka'])
            lat, lon = float(a['lat']), float(a['lon'])
            if 51 < lat < 53 and 19 < lon < 23:
                by_stop[sid].append((lat, lon))
        except (TypeError, ValueError, KeyError):
            continue
    ordered = []
    previous = -1
    for entry in entries:
        sid = str(entry['stop_id'])
        candidates = by_stop.get(sid, [])
        if not candidates:
            continue
        best = None
        for anchor in candidates:
            # Zakotwiczenie musi znajdować się blisko przebiegu, nie po drugiej stronie miasta.
            for idx in range(previous + 1, len(coords)):
                dist = _distance_sq(anchor, coords[idx])
                if best is None or dist < best[0]:
                    best = (dist, idx, anchor)
        if best is None or best[0] > 150 * 150:
            continue
        _, idx, anchor = best
        previous = idx
        ordered.append({'seq': entry['seq'], 'stop_id': sid, 'point_index': idx,
                        'lat': anchor[0], 'lon': anchor[1]})
    if len(ordered) < 2 or ordered[-1]['point_index'] <= ordered[0]['point_index']:
        return None
    start, end = ordered[0]['point_index'], ordered[-1]['point_index']
    sliced = coords[start:end + 1]
    for stop in ordered:
        stop['point_index'] -= start
    return {'points': [[lat, lon] for lat, lon in sliced], 'stops': ordered}

@app.get('/courses/{course_id}/geometry')
def course_geometry(course_id: str):
    if not re.fullmatch(r'\d{1,20}', course_id):
        raise HTTPException(400, 'Invalid course ID')
    with database() as db:
        entries = rows(db, 'SELECT seq,stop_id,payload FROM course_stops WHERE course_id=? ORDER BY seq', (course_id,))
        if not entries:
            raise HTTPException(404, 'Course not found')
        variants = set()
        for entry in entries:
            try:
                variant = json.loads(entry['payload'] or '{}').get('id_wariantu')
                if variant is not None and str(variant):
                    variants.add(str(variant))
            except (ValueError, TypeError):
                continue
        if len(variants) != 1:
            return {'course_id': course_id, 'status': 'ambiguous_variant', 'points': [], 'stops': []}
        variant = next(iter(variants))

        course_line = rows(db, """SELECT b.line_name AS line FROM courses c
            LEFT JOIN boards b ON b.schedule_id=c.schedule_id
            WHERE c.course_id=? LIMIT 1""", (course_id,))
        line = course_line[0]['line'] if course_line else None
        v4 = _v4_course_points(line, variant, entries)
        if v4:
            return {'course_id': course_id, 'variant': variant, 'status': 'ok',
                    'points': v4['points'], 'stops': v4['stops']}

        # Bezpieczny fallback v63, gdy brakuje geometrii v4 albo kotwic.
        points = _route_shapes(db).get(variant, [])
        if len(points) < 2:
            return {'course_id': course_id, 'variant': variant, 'status': 'no_geometry', 'points': [], 'stops': []}
        ordered = []
        previous = -1
        for entry in entries:
            sid = str(entry['stop_id'])
            match = next((i for i, pt in enumerate(points) if i > previous and pt[3] == sid), None)
            if match is not None:
                previous = match
                ordered.append({'seq': entry['seq'], 'stop_id': sid, 'point_index': match,
                                'lat': points[match][1], 'lon': points[match][2]})
        if len(ordered) >= 2 and ordered[-1]['point_index'] > ordered[0]['point_index']:
            start, end = ordered[0]['point_index'], ordered[-1]['point_index']
            selected = points[start:end+1]
            for stop in ordered:
                stop['point_index'] -= start
        else:
            selected = points
        return {'course_id': course_id, 'variant': variant, 'status': 'ok',
                'points': [[pt[1], pt[2]] for pt in selected], 'stops': ordered}


# v67 — geometrie edytowane przez administratora, poza bazą ETA.
# Nigdy nie zapisujemy tokenu w kodzie ani w przeglądarce na stałe.
import hmac
from fastapi import Header, Body
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
                   allow_methods=["GET", "PUT", "POST", "DELETE"], allow_headers=["Content-Type", "X-Admin-Token"])
OVERRIDE_DB = os.environ.get("WTP_ROUTE_OVERRIDES_DB", "/opt/wtp-live/data/route_overrides.db")
_override_lock = threading.RLock()

def _override_db():
    con = sqlite3.connect(OVERRIDE_DB, timeout=15)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA busy_timeout=15000")
    con.execute("CREATE TABLE IF NOT EXISTS route_overrides (line TEXT NOT NULL, shape_id TEXT NOT NULL, points TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(line,shape_id))")
    con.commit()
    return con

def _check_route_admin(token):
    expected = os.environ.get("WTP_ROUTE_ADMIN_TOKEN", "")
    if len(expected) < 24 or not token or not hmac.compare_digest(expected, token):
        raise HTTPException(status_code=403, detail="Brak uprawnień administratora")

def _validate_route_key(value, shape=False):
    pattern = r"[A-Za-z0-9_.:-]{1,80}" if shape else r"[A-Za-z0-9_.-]{1,80}"
    if not isinstance(value,str) or not re.fullmatch(pattern, value):
        raise HTTPException(422, "Nieprawidłowy identyfikator linii/wariantu")
    return value

@app.get("/route-overrides")
def route_overrides(line: str = Query(min_length=1, max_length=30)):
    _validate_route_key(line)
    with _override_lock:
        with _override_db() as db:
            result = {r['shape_id']: json.loads(r['points']) for r in db.execute(
                "SELECT shape_id,points FROM route_overrides WHERE line=?", (line,))}
    return {"line": line, "shapes": result}

@app.put("/admin/route-overrides/{line}/{shape_id}")
def save_route_override(line: str, shape_id: str, body: dict = Body(...), x_admin_token: str | None = Header(default=None)):
    _check_route_admin(x_admin_token)
    _validate_route_key(line); _validate_route_key(shape_id, shape=True)
    points = body.get('points')
    if not isinstance(points,list) or not 2 <= len(points) <= 20000:
        raise HTTPException(422, "Trasa musi mieć 2–20000 punktów")
    validated = []
    for p in points:
        if not isinstance(p,list) or len(p)!=2 or any(isinstance(x,bool) or not isinstance(x,(int,float)) for x in p):
            raise HTTPException(422, "Punkt musi mieć postać [lat,lon]")
        lat,lon = p
        if not (50 <= lat <= 55 and 18 <= lon <= 24):
            raise HTTPException(422, "Punkt poza obszarem Polski centralnej")
        validated.append([round(float(lat),7),round(float(lon),7)])
    with _override_lock:
        with _override_db() as db:
            db.execute("INSERT INTO route_overrides(line,shape_id,points) VALUES(?,?,?) ON CONFLICT(line,shape_id) DO UPDATE SET points=excluded.points, updated_at=CURRENT_TIMESTAMP",
                       (line,shape_id,json.dumps(validated,separators=(',',':'))))
            db.commit()
    return {"ok": True, "line": line, "shape_id": shape_id, "points": len(validated)}

@app.delete("/admin/route-overrides/{line}/{shape_id}")
def delete_route_override(line: str, shape_id: str, x_admin_token: str | None = Header(default=None)):
    _check_route_admin(x_admin_token)
    _validate_route_key(line);_validate_route_key(shape_id, shape=True)
    with _override_lock:
        with _override_db() as db:
            cur=db.execute("DELETE FROM route_overrides WHERE line=? AND shape_id=?",(line,shape_id))
            db.commit()
    return {"ok": True, "deleted":cur.rowcount}


# v185: poprawki ODCINKÓW, niezależne od shape_id i daty rozkładu.
# Oryginalne route_overrides pozostają dostępne dla zgodności i migracji.
import math

PATCH_MAX_POINTS = 4000

def _segment_db():
    con = _override_db()
    con.execute("""CREATE TABLE IF NOT EXISTS route_segment_patches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      line TEXT NOT NULL,
      start_lat REAL NOT NULL, start_lon REAL NOT NULL,
      end_lat REAL NOT NULL, end_lon REAL NOT NULL,
      points TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )""")
    con.commit()
    return con

def _patch_points(raw):
    if not isinstance(raw, list) or not 2 <= len(raw) <= PATCH_MAX_POINTS:
        raise HTTPException(422, 'Odcinek musi mieć od 2 do 4000 punktów')
    result = []
    for p in raw:
        if (not isinstance(p, list) or len(p) != 2 or
            any(isinstance(x, bool) or not isinstance(x, (int, float)) or not math.isfinite(x) for x in p)):
            raise HTTPException(422, 'Punkt musi mieć postać [lat,lon]')
        lat, lon = map(float, p)
        if not (50 <= lat <= 55 and 18 <= lon <= 24):
            raise HTTPException(422, 'Punkt poza dozwolonym obszarem')
        result.append([round(lat, 7), round(lon, 7)])
    return result

def _meters(a, b):
    y = (a[0] - b[0]) * 111195
    x = (a[1] - b[1]) * 111195 * math.cos(math.radians((a[0] + b[0])/2))
    return math.hypot(x, y)

@app.get('/route-segment-patches')
def list_route_segment_patches(line: str = Query(min_length=1, max_length=30)):
    _validate_route_key(line)
    with _override_lock:
        with _segment_db() as db:
            patches = [dict(r) for r in db.execute('SELECT * FROM route_segment_patches WHERE line=? AND enabled=1 ORDER BY id', (line,))]
    for p in patches:
        p['points'] = json.loads(p['points'])
    return {'line': line, 'patches': patches, 'version': 185}

@app.post('/admin/route-segment-patches/{line}')
def create_route_segment_patch(line: str, body: dict = Body(...), x_admin_token: str | None = Header(default=None)):
    _check_route_admin(x_admin_token)
    _validate_route_key(line)
    points = _patch_points(body.get('points'))
    if sum(_meters(a,b) for a,b in zip(points,points[1:])) > 12000:
        raise HTTPException(422, 'Poprawiany fragment jest zbyt długi (maks. 12 km)')
    if _meters(points[0],points[-1]) < 12:
        raise HTTPException(422, 'Początek i koniec odcinka są zbyt blisko siebie')
    with _override_lock:
        with _segment_db() as db:
            cur = db.execute('INSERT INTO route_segment_patches(line,start_lat,start_lon,end_lat,end_lon,points) VALUES (?,?,?,?,?,?)',
              (line,*points[0],*points[-1],json.dumps(points,separators=(',',':'))))
            db.commit()
            patch_id=cur.lastrowid
    return {'ok':True,'id':patch_id,'line':line,'points':len(points)}

@app.delete('/admin/route-segment-patches/{line}/{patch_id}')
def delete_route_segment_patch(line: str, patch_id: int, x_admin_token: str | None = Header(default=None)):
    _check_route_admin(x_admin_token)
    _validate_route_key(line)
    with _override_lock:
        with _segment_db() as db:
            cur=db.execute('UPDATE route_segment_patches SET enabled=0,updated_at=CURRENT_TIMESTAMP WHERE id=? AND line=? AND enabled=1',(patch_id,line))
            db.commit()
    return {'ok':True,'disabled':bool(cur.rowcount)}
