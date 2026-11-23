#!/usr/bin/env python3
"""WTP LIVE v113: rozkłady dzienne i pełny katalog geometrii GTFS."""
import csv, datetime as dt, hashlib, io, json, os, pathlib, sqlite3, tempfile, urllib.request, zipfile
from zoneinfo import ZoneInfo


ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / 'gtfs'
SOURCES = [os.environ.get('GTFS_URL', 'https://mkuran.pl/gtfs/warsaw.zip'), 'https://gtfs.ztm.waw.pl/last']

def file_sha256(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
    return h.digest()

def download():
    for url in dict.fromkeys(SOURCES):
        try:
            print('Pobieram', url, flush=True)
            req=urllib.request.Request(url,headers={'User-Agent':'FWTP-WTPLive/20 (+https://fwtpkom.github.io/FWTP/)'})
            with urllib.request.urlopen(req, timeout=180) as response, tempfile.NamedTemporaryFile(delete=False,suffix='.zip') as tmp:
                while True:
                    chunk=response.read(1024*1024)
                    if not chunk:break
                    tmp.write(chunk)
                name=tmp.name
            with zipfile.ZipFile(name) as z:
                names={p.split('/')[-1] for p in z.namelist()}
                if not {'stops.txt','trips.txt','stop_times.txt','routes.txt','shapes.txt'}.issubset(names):raise ValueError('Brak wymaganych tabel GTFS, w tym shapes.txt')
            print('Pobrano z',url)
            return name,url
        except Exception as e:
            print('Źródło niedostępne:',type(e).__name__,str(e)[:180],flush=True)
    raise RuntimeError('Żadne źródło GTFS nie działa; pozostawiam poprzednie dane')

def main():
    path,source=download()
    today=dt.datetime.now(ZoneInfo('Europe/Warsaw')).date()
    day=today.strftime('%Y%m%d')
    with zipfile.ZipFile(path) as z:
        members={p.split('/')[-1]:p for p in z.namelist()}
        def rows(name):
            if name not in members:return iter(())
            def it():
                with z.open(members[name]) as stream,io.TextIOWrapper(stream,encoding='utf-8-sig',newline='') as f:
                    yield from csv.DictReader(f)
            return it()
        stops={}
        for r in rows('stops.txt'):
            sid=r.get('stop_id')
            if not sid:continue
            try:
                lat=float(r.get('stop_lat') or 0)
                lon=float(r.get('stop_lon') or 0)
            except (ValueError,TypeError):continue
            if not (51 < lat < 53 and 19 < lon < 23):continue
            stops[sid]=(r.get('stop_name',''),lat,lon,r.get('stop_desc',''))
        route_rows=list(rows('routes.txt'))
        routes={r['route_id']:r.get('route_short_name','') for r in route_rows}
        route_types={r['route_id']:int(r['route_type']) for r in route_rows if str(r.get('route_type','')).isdigit()}
        line_types={}
        for r in route_rows:
            line=r.get('route_short_name','')
            if line and r['route_id'] in route_types:line_types.setdefault(line,set()).add(route_types[r['route_id']])
        services=set()
        weekday=['monday','tuesday','wednesday','thursday','friday','saturday','sunday'][today.weekday()]
        for r in rows('calendar.txt'):
            if r.get('start_date','')<=day<=r.get('end_date','') and r.get(weekday)=='1':services.add(r['service_id'])
        for r in rows('calendar_dates.txt'):
            if r.get('date')==day:
                (services.add if r.get('exception_type')=='1' else services.discard)(r['service_id'])
        trips={}
        all_trips={}  # Wszystkie kursy, niezależnie od dnia; katalog geometrii nie może znikać.
        for r in rows('trips.txt'):
            if r.get('route_id') in routes and r.get('trip_id'):
                all_trips[r['trip_id']]=(routes[r['route_id']],r.get('shape_id') or '')
        for r in rows('trips.txt'):
            if r.get('service_id') in services and r.get('route_id') in routes:
                line=routes[r['route_id']]
                if line:trips[r['trip_id']]=(line,r.get('trip_headsign') or '',r.get('block_id') or '')
        trip_shapes={tid:shape for tid,(_,shape) in all_trips.items() if tid in trips and shape}
        if not trips:raise RuntimeError('Brak aktywnych kursów na '+day+'; nie nadpisuję danych')
        # Dyskowa baza tymczasowa: duże tabele nie zajmują RAM.
        workdir=tempfile.TemporaryDirectory(prefix='wtp-gtfs-',dir=ROOT)
        conn=sqlite3.connect(str(pathlib.Path(workdir.name)/'work.sqlite'))
        conn.execute('PRAGMA journal_mode=OFF')
        conn.execute('PRAGMA synchronous=OFF')
        conn.execute('PRAGMA cache_size=-4096')
        conn.execute('PRAGMA temp_store=FILE')
        conn.execute('CREATE TABLE times(trip TEXT, seq INT, stop TEXT, tm TEXT)')
        batch=[]
        for r in rows('stop_times.txt'):
            if r.get('trip_id') not in all_trips:continue
            tm=r.get('arrival_time') or r.get('departure_time') or ''
            if not tm:continue
            batch.append((r['trip_id'],int(r.get('stop_sequence') or 0),r['stop_id'],tm[:5]))
            if len(batch)>=20000:conn.executemany('INSERT INTO times VALUES(?,?,?,?)',batch);batch=[]
        if batch:conn.executemany('INSERT INTO times VALUES(?,?,?,?)',batch)
        del batch
        print('Przetworzono stop_times.txt',flush=True)
        result={}
        previous=None; sequence=[]
        def flush():
            if previous is None or len(sequence)<2:return
            line,headsign,block=trips[previous]
            item={'id':previous,'headsign':headsign,'block_id':block,'stops':sequence.copy()}
            # v108: shape_id pozwala stronie narysować dokładny przebieg po drogach (shapes.txt).
            if trip_shapes.get(previous):item['shape_id']=trip_shapes[previous]
            result.setdefault(line,[]).append(item)
        for trip,seq,sid,tm in conn.execute('SELECT trip,seq,stop,tm FROM times WHERE trip IN (SELECT trip FROM times) ORDER BY trip,seq'):
            if trip not in trips:continue
            if trip!=previous:flush();previous=trip;sequence=[]
            if sid in stops:
                name,lat,lon,*additional=stops[sid]
                sequence.append([sid,name,lat,lon,tm])
        flush()
        if not result:raise RuntimeError('Brak kompletnych tras; nie nadpisuję danych')
        # v44: lokalny styczny kierunek toru/jezdni z shapes.txt.
        # Segment musi przechodzić BLISKO słupka, nie łączyć dwa odległe przystanki.
        import math, collections
        def bearing(a,b):
            la,lo=a;lb,lob=b;r=math.pi/180
            y=math.sin((lob-lo)*r)*math.cos(lb*r)
            x=math.cos(la*r)*math.sin(lb*r)-math.sin(la*r)*math.cos(lb*r)*math.cos((lob-lo)*r)
            return (math.degrees(math.atan2(y,x))+360)%360
        def dominant(angles):
            angles=[a for a in angles if a is not None]
            if not angles:return None
            # Najliczniejszy klaster +/- 35 stopni; jeden główny kierunek na słupek.
            center=max(angles,key=lambda a:sum(abs((a-b+180)%360-180)<=35 for b in angles))
            cluster=[a for a in angles if abs((a-center+180)%360-180)<=35]
            return round((math.degrees(math.atan2(sum(math.sin(math.radians(a)) for a in cluster),sum(math.cos(math.radians(a)) for a in cluster)))+360)%360,1)
        # Wzorce wszystkich dni zapisujemy na dysku, bez wielkich zbiorów w RAM.
        conn.execute('CREATE TABLE patterns(line TEXT, shape TEXT, ids TEXT, UNIQUE(line,shape,ids))')
        conn.execute('CREATE TABLE representatives(line TEXT, shape TEXT, ids TEXT, UNIQUE(line,shape))')
        last_trip=None
        last_stops=[]
        def save_pattern(tid, ids):
            if tid not in all_trips or len(ids)<2:return
            line,shape=all_trips[tid]
            if not line or not shape:return
            packed=json.dumps(ids,ensure_ascii=False,separators=(',',':'))
            conn.execute('INSERT OR IGNORE INTO patterns VALUES (?,?,?)',(line,shape,packed))
            conn.execute('INSERT OR IGNORE INTO representatives VALUES (?,?,?)',(line,shape,packed))
        for tid, sid in conn.execute('SELECT trip,stop FROM times ORDER BY trip,seq'):
            if tid!=last_trip:
                if last_trip is not None:save_pattern(last_trip,last_stops)
                last_trip=tid;last_stops=[]
            if sid in stops:last_stops.append(sid)
        if last_trip is not None:save_pattern(last_trip,last_stops)
        # Geometrie również na dysku; wczytujemy tylko jedną na raz.
        conn.execute('CREATE TABLE shape_points(shape TEXT, seq INTEGER, lat REAL, lon REAL)')
        shape_ids={r[0] for r in conn.execute('SELECT DISTINCT shape FROM representatives')}
        batch=[]
        for r in rows('shapes.txt'):
            shape=r.get('shape_id')
            if shape not in shape_ids:continue
            try:batch.append((shape,int(r['shape_pt_sequence']),float(r['shape_pt_lat']),float(r['shape_pt_lon'])))
            except (ValueError,KeyError):continue
            if len(batch)>=10000:
                conn.executemany('INSERT INTO shape_points VALUES (?,?,?,?)',batch);batch.clear()
        if batch:conn.executemany('INSERT INTO shape_points VALUES (?,?,?,?)',batch)
        del batch,shape_ids
        conn.execute('CREATE INDEX idx_shape_points ON shape_points(shape,seq)')
        def get_shape(shape):
            return [(lat,lon) for lat,lon in conn.execute('SELECT lat,lon FROM shape_points WHERE shape=? ORDER BY seq',(shape,))]
        shape_count=conn.execute('SELECT COUNT(DISTINCT shape) FROM shape_points').fetchone()[0]
        print('Wczytano geometrie:',shape_count,flush=True)
        headings=collections.defaultdict(set)
        def tangent_at(stop,pts):
            if len(pts)<2:return None
            lat,lon=stop
            # Wyszukaj najbliższy punkt na odcinku polilinii, w metrach.
            scale=111195*math.cos(math.radians(lat));unit=111195
            best=(float('inf'),None,None)
            for i,(a,b) in enumerate(zip(pts,pts[1:])):
                ax=(a[1]-lon)*scale;ay=(a[0]-lat)*unit
                bx=(b[1]-lon)*scale;by=(b[0]-lat)*unit
                dx=bx-ax;dy=by-ay;den=dx*dx+dy*dy
                if den<0.04:continue
                t=max(0,min(1,-(ax*dx+ay*dy)/den))
                d2=(ax+t*dx)**2+(ay+t*dy)**2
                if d2<best[0]:best=(d2,i,t)
            d2,i,t=best
            if i is None or d2>55**2:return None
            # Kierunek styczny w pobliżu słupka; bierzemy ok. 15 m w obie strony
            # (na krótkich odcinkach zapobiega to skokom kąta).
            a=pts[i];b=pts[i+1]
            if t<0.25 and i>0:a=pts[i-1]
            if t>0.75 and i+2<len(pts):b=pts[i+2]
            return bearing(a,b)
        for line,shape,ids_json in conn.execute('SELECT line,shape,ids FROM representatives'):
            seq=json.loads(ids_json)
            pts=get_shape(shape)
            if not pts:continue
            kinds=line_types.get(line,set())
            modes=(['tram'] if 0 in kinds else [])+(['bus'] if 3 in kinds or 700 in kinds else [])
            for sid in set(seq):
                if sid not in stops:continue
                _,lat,lon,*_=stops[sid]
                ang=tangent_at((lat,lon),pts)
                if ang is not None:
                    for mode in modes:headings[sid,mode].add(round(ang,1))
        # Fallback tylko dla tras bez shapes.txt: wektor między sąsiednimi słupkami.
        # Typ przystanku pozostaje rozpoznawany także wtedy, gdy brak geometrii.
        fallback=collections.defaultdict(set)
        for line,items in result.items():
            kinds=line_types.get(line,set())
            modes=(['tram'] if 0 in kinds else [])+(['bus'] if 3 in kinds or 700 in kinds else [])
            for trip in items:
                seq=trip['stops']
                for j,cur in enumerate(seq):
                    sid=cur[0]
                    if sid not in stops:continue
                    other=seq[j+1] if j+1<len(seq) else (seq[j-1] if j else None)
                    if other is None or other[0] not in stops:continue
                    lat,lon=stops[sid][1:3];lat2,lon2=stops[other[0]][1:3]
                    angle=bearing((lat,lon),(lat2,lon2)) if j+1<len(seq) else bearing((lat2,lon2),(lat,lon))
                    for mode in modes:
                        if (sid,mode) not in headings:fallback[sid,mode].add(round(angle,1))
        metadata={}
        for (sid,mode),angles in headings.items():metadata.setdefault(sid,{})[mode]=dominant(angles)
        for (sid,mode),angles in fallback.items():
            if mode not in metadata.get(sid,{}):metadata.setdefault(sid,{})[mode]=dominant(angles)
        stop_meta=[[stops[sid][1],stops[sid][2],data.get('bus'),data.get('tram'),(1 if __import__('re').search(r'(?:\bNŻ\b|\bNZ\b|na żądanie|na zadanie)', str(stops[sid][3])+' '+str(stops[sid][0]),__import__('re').I) else None)] for sid,data in metadata.items() if sid in stops]
        print('Kierunki v45:',len(stop_meta),'przystanków;',shape_count,'geometrii shapes.txt',flush=True)

        OUT.mkdir(exist_ok=True)
        # Zapisuj każdy rozkład oddzielnie; nie trzymaj JSON wszystkich linii w RAM.
        desired=set()
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            stage=pathlib.Path(tmp)
            for line,items in result.items():
                filename=''.join(c if c.isalnum() or c in '-_' else '_' for c in line)+'.json'
                desired.add(filename)
                with (stage/filename).open('w',encoding='utf-8') as f:
                    json.dump({'date':day,'line':line,'trips':items},f,ensure_ascii=False,separators=(',',':'))
                    f.write('\n')
            for name in desired:os.replace(stage/name,OUT/name)
        trip_total=sum(map(len,result.values()))
        line_total=len(result)
        del result
        # Usuwamy wyłącznie stare pliki rozkładów linii, nie pliki metadanych.
        protected={'stops_meta.json','status.json'}
        for old in OUT.glob('*.json'):
            if old.name not in desired and old.name not in protected:old.unlink()
        # v108: katalogi geometrii tras (gtfs/shapes/<linia>.json) czytane przez app.js.
        # Zawierają WYŁĄCZNIE dane stabilne między dniami (geometria, wzorce słupków),
        # więc plik zmienia się tylko przy realnej zmianie trasy — repozytorium nie puchnie.
        SHAPES_OUT=OUT/'shapes'
        SHAPES_OUT.mkdir(exist_ok=True)
        def clean_shape(pts):
            out=[]
            for lat,lon in pts:
                p=[round(lat,6),round(lon,6)]
                if not out or out[-1]!=p:out.append(p)
            return out
        shape_files_count=0
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            stage=pathlib.Path(tmp)
            lines=[r[0] for r in conn.execute('SELECT DISTINCT line FROM patterns ORDER BY line')]
            for line in lines:
                valid=[]
                used=set()
                stop_ids=set()
                for sid,ids_json in conn.execute('SELECT shape,ids FROM patterns WHERE line=? ORDER BY shape,ids',(line,)):
                    # Nie trzymaj jednocześnie wszystkich geometrii w RAM.
                    n=conn.execute('SELECT COUNT(*) FROM shape_points WHERE shape=?',(sid,)).fetchone()[0]
                    if n<2:continue
                    ids=json.loads(ids_json)
                    valid.append((sid,ids))
                    used.add(sid)
                    stop_ids.update(s for s in ids if s in stops)
                if not valid:continue
                catalog={
                    'version':2,'line':line,
                    'shapes':{sid:clean_shape(get_shape(sid)) for sid in sorted(used)},
                    'patterns':[{'shape_id':sid,'stop_ids':ids} for sid,ids in sorted(valid)],
                    'stops':{sid:[stops[sid][1],stops[sid][2],stops[sid][0]] for sid in sorted(stop_ids)},
                }
                filename=''.join(c if c.isalnum() or c in '-_' else '_' for c in line)+'.json'
                target=SHAPES_OUT/filename
                content=json.dumps(catalog,ensure_ascii=False,separators=(',',':'),sort_keys=True)+'\n'
                # Porównuj skróty, bez wczytywania istniejącego pliku do RAM.
                if not target.is_file() or file_sha256(target)!=hashlib.sha256(content.encode('utf-8')).digest():
                    (stage/filename).write_text(content,encoding='utf-8')
                    os.replace(stage/filename,target)
                shape_files_count+=1
                del catalog,content,valid
                if shape_files_count%50==0:print('Geometrie:',shape_files_count,'linii',flush=True)
        # Nie usuwamy katalogów, których brak w bieżącym źródle;
        # inne źródło może mieć mniej linii, np. cmentarne.
        print('Geometrie tras (wszystkie dni):',shape_files_count,'linii',flush=True)
        (OUT/'stops_meta.json').write_text(json.dumps({'version':45,'date':day,'stops':stop_meta},ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
        (OUT/'status.json').write_text(json.dumps({'date':day,'source':source,'updated_at':dt.datetime.now(dt.timezone.utc).isoformat(),'lines':line_total},ensure_ascii=False)+'\n',encoding='utf-8')
        print('Gotowe:',day,line_total,'linii',trip_total,'kursów',flush=True)
        conn.close()
        workdir.cleanup()
    os.unlink(path)

if __name__=='__main__':main()
