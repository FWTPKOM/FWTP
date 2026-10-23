#!/usr/bin/env python3
"""Automatyczna aktualizacja rozkładów WTP LIVE z GTFS (bez klucza API)."""
import csv, datetime as dt, hashlib, io, json, os, pathlib, sqlite3, tempfile, urllib.request, zipfile
from zoneinfo import ZoneInfo

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / 'gtfs'
SOURCES = [os.environ.get('GTFS_URL', 'https://gtfs.ztm.waw.pl/last'), 'https://mkuran.pl/gtfs/warsaw.zip']

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
                if not {'stops.txt','trips.txt','stop_times.txt','routes.txt'}.issubset(names):raise ValueError('Brak wymaganych tabel GTFS')
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
        stops={r['stop_id']:(r.get('stop_name',''),float(r.get('stop_lat') or 0),float(r.get('stop_lon') or 0)) for r in rows('stops.txt')}
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
        for r in rows('trips.txt'):
            if r.get('service_id') in services and r.get('route_id') in routes:
                line=routes[r['route_id']]
                if line:trips[r['trip_id']]=(line,r.get('trip_headsign') or '',r.get('block_id') or '')
        if not trips:raise RuntimeError('Brak aktywnych kursów na '+day+'; nie nadpisuję danych')
        conn=sqlite3.connect(':memory:')
        conn.execute('CREATE TABLE times(trip TEXT, seq INT, stop TEXT, tm TEXT)')
        batch=[]
        for r in rows('stop_times.txt'):
            if r.get('trip_id') not in trips:continue
            tm=r.get('arrival_time') or r.get('departure_time') or ''
            if not tm:continue
            batch.append((r['trip_id'],int(r.get('stop_sequence') or 0),r['stop_id'],tm[:5]))
            if len(batch)>=20000:conn.executemany('INSERT INTO times VALUES(?,?,?,?)',batch);batch=[]
        if batch:conn.executemany('INSERT INTO times VALUES(?,?,?,?)',batch)
        result={}
        previous=None; sequence=[]
        def flush():
            if previous is None or len(sequence)<2:return
            line,headsign,block=trips[previous]
            result.setdefault(line,[]).append({'id':previous,'headsign':headsign,'block_id':block,'stops':sequence.copy()})
        for trip,seq,sid,tm in conn.execute('SELECT trip,seq,stop,tm FROM times ORDER BY trip,seq'):
            if trip!=previous:flush();previous=trip;sequence=[]
            if sid in stops:
                name,lat,lon=stops[sid]
                sequence.append([sid,name,lat,lon,tm])
        flush()
        if not result:raise RuntimeError('Brak kompletnych tras; nie nadpisuję danych')
        # v43: kierunki i typy WSZYSTKICH przystanków z GTFS.
        # Unikalne odcinki, aby częstotliwość kursowania nie wypaczała kierunku.
        import math, collections
        edges=collections.defaultdict(set)
        incoming=collections.defaultdict(set)
        for line,items in result.items():
            kinds=line_types.get(line,set())
            modes=(["tram"] if 0 in kinds else [])+(["bus"] if 3 in kinds or 700 in kinds else [])
            for trip in items:
                seq=trip['stops']
                for a,b in zip(seq,seq[1:]):
                    if a[0]==b[0]:continue
                    for mode in modes:
                        edges[(a[0],mode)].add(b[0]);incoming[(b[0],mode)].add(a[0])
        def bearing(a,b):
            if a not in stops or b not in stops:return None
            _,la,lo=stops[a];_,lb,lob=stops[b];r=math.pi/180
            y=math.sin((lob-lo)*r)*math.cos(lb*r)
            x=math.cos(la*r)*math.sin(lb*r)-math.sin(la*r)*math.cos(lb*r)*math.cos((lob-lo)*r)
            return (math.degrees(math.atan2(y,x))+360)%360
        def dominant(angles):
            angles=[a for a in angles if a is not None]
            if not angles:return None
            center=max(angles,key=lambda a:sum(abs((a-b+180)%360-180)<=45 for b in angles))
            cluster=[a for a in angles if abs((a-center+180)%360-180)<=45]
            return round((math.degrees(math.atan2(sum(math.sin(math.radians(a)) for a in cluster),sum(math.cos(math.radians(a)) for a in cluster)))+360)%360,1)
        metadata={}
        for (sid,mode),targets in edges.items():metadata.setdefault(sid,{})[mode]=dominant(bearing(sid,b) for b in targets)
        # Dla końcowych, bez odjazdu w GTFS, zachowaj orientację dojazdu.
        for (sid,mode),sources in incoming.items():
            if mode not in metadata.get(sid,{}):metadata.setdefault(sid,{})[mode]=dominant(bearing(a,sid) for a in sources)
        stop_meta=[[stops[sid][1],stops[sid][2],data.get('bus'),data.get('tram')] for sid,data in metadata.items() if sid in stops]

        OUT.mkdir(exist_ok=True)
        desired={}
        for line,items in result.items():
            filename=line.replace('/','_')+'.json'
            desired[filename]=json.dumps({'date':day,'line':line,'trips':items},ensure_ascii=False,separators=(',',':'))+'\n'
        # Najpierw generujemy komplet plików, a dopiero później podmieniamy poprzednie.
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            stage=pathlib.Path(tmp)
            for name,content in desired.items():(stage/name).write_text(content,encoding='utf-8')
            for name in desired:os.replace(stage/name,OUT/name)
        for old in OUT.glob('*.json'):
            if old.name not in desired:old.unlink()
        (OUT/'stops_meta.json').write_text(json.dumps({'version':43,'date':day,'stops':stop_meta},ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
        (OUT/'status.json').write_text(json.dumps({'date':day,'source':source,'updated_at':dt.datetime.now(dt.timezone.utc).isoformat(),'lines':len(result)},ensure_ascii=False)+'\n',encoding='utf-8')
        print('Gotowe:',day,len(result),'linii',sum(map(len,result.values())),'kursów')
    os.unlink(path)

if __name__=='__main__':main()
