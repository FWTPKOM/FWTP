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
        routes={r['route_id']:r.get('route_short_name','') for r in rows('routes.txt')}
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
        (OUT/'status.json').write_text(json.dumps({'date':day,'source':source,'updated_at':dt.datetime.now(dt.timezone.utc).isoformat(),'lines':len(result)},ensure_ascii=False)+'\n',encoding='utf-8')
        print('Gotowe:',day,len(result),'linii',sum(map(len,result.values())),'kursów')
    os.unlink(path)

if __name__=='__main__':main()
