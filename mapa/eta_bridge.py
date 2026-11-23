# WTP LIVE ETA BRIDGE — WERSJA 3.7
import os, secrets, urllib.error, urllib.request, sqlite3, time, math, threading
from fastapi import FastAPI, Header, HTTPException, Request, Query
from fastapi.responses import Response
app=FastAPI(docs_url=None,redoc_url=None,openapi_url=None)
TOKEN=os.environ.get('ETA_BRIDGE_TOKEN','').strip()
# Token musi byc taki sam jak sekret ETA_BRIDGE_TOKEN w Cloudflare.
ALLOWED={'health','lines','courses','match','vehicle-match','vehicle-state',
         'route-overrides','route-segment-patches'}
@app.get('/eta/{path:path}')
def bridge(path:str,request:Request,x_bridge_token:str|None=Header(default=None)):
    if not TOKEN or not x_bridge_token or not secrets.compare_digest(TOKEN,x_bridge_token.strip()):
        raise HTTPException(403,'Forbidden')
    parts=path.split('/')
    if not (path in ALLOWED or (len(parts)==3 and parts[0]=='courses' and parts[1].isdigit() and parts[2] in ('stops','geometry'))):
        raise HTTPException(404,'Not found')
    url=os.environ.get('ETA_BACKEND_URL','http://127.0.0.1:8000').rstrip('/')+'/'+path+('?' + str(request.url.query) if request.url.query else '')
    try:
        with urllib.request.urlopen(url,timeout=20) as r:
            return Response(content=r.read(2000000),status_code=r.status,media_type='application/json',headers={'Cache-Control':'no-store'})
    except urllib.error.HTTPError as e:
        return Response(content=e.read(100000),status_code=e.code,media_type='application/json')
    except Exception:
        raise HTTPException(502,'ETA backend unavailable')


# v3: osobna baza GPS; aktualizacja bazy ETA nie usuwa historii.
GPS_DB=os.environ.get('WTP_GPS_DB','/opt/wtp-live/data/gps_history.db')
GPS_LOCK=threading.Lock()
def gps_db():
    os.makedirs(os.path.dirname(GPS_DB),exist_ok=True)
    db=sqlite3.connect(GPS_DB,timeout=15)
    db.execute('PRAGMA journal_mode=WAL')
    db.execute('CREATE TABLE IF NOT EXISTS observations (type INTEGER NOT NULL, vehicle TEXT NOT NULL, line TEXT NOT NULL, brigade TEXT NOT NULL, stamp INTEGER NOT NULL, lat REAL NOT NULL, lon REAL NOT NULL, PRIMARY KEY(type,vehicle,stamp))')
    db.execute('CREATE INDEX IF NOT EXISTS obs_lookup ON observations(type,vehicle,stamp)')
    db.execute('CREATE INDEX IF NOT EXISTS obs_cleanup ON observations(stamp)')
    db.execute('''CREATE TABLE IF NOT EXISTS stop_events (
        type INTEGER NOT NULL, vehicle TEXT NOT NULL, line TEXT NOT NULL,
        brigade TEXT NOT NULL, course_id TEXT NOT NULL, stop_seq INTEGER NOT NULL,
        stop_id TEXT NOT NULL, event TEXT NOT NULL CHECK(event IN ('arrival','departure')),
        stamp INTEGER NOT NULL, source TEXT NOT NULL,
        PRIMARY KEY(type,vehicle,course_id,stop_seq,event))''')
    db.execute('CREATE INDEX IF NOT EXISTS stop_events_vehicle ON stop_events(type,vehicle,stamp)')
    db.execute('''CREATE TABLE IF NOT EXISTS vehicle_courses (
        type INTEGER NOT NULL, vehicle TEXT NOT NULL, course_id TEXT NOT NULL,
        line TEXT NOT NULL, brigade TEXT NOT NULL, start_stamp INTEGER NOT NULL,
        end_stamp INTEGER, source TEXT NOT NULL,
        PRIMARY KEY(type,vehicle,course_id,start_stamp))''')
    db.execute('CREATE INDEX IF NOT EXISTS vehicle_courses_lookup ON vehicle_courses(type,vehicle,start_stamp)')
    db.execute('''CREATE TABLE IF NOT EXISTS vehicle_predictions (
        type INTEGER NOT NULL, vehicle TEXT NOT NULL, course_id TEXT NOT NULL,
        stop_seq INTEGER NOT NULL, predicted_stamp INTEGER NOT NULL,
        updated_stamp INTEGER NOT NULL, source TEXT NOT NULL,
        PRIMARY KEY(type,vehicle,course_id,stop_seq))''')
    return db

def authorized(token):
    if not TOKEN or not token or not secrets.compare_digest(TOKEN,token):
        raise HTTPException(403,'Forbidden')

@app.post('/gps/ingest')
async def gps_ingest(request:Request,x_bridge_token:str|None=Header(default=None)):
    authorized(x_bridge_token)
    data=await request.json()
    records=data.get('positions',[]) if isinstance(data,dict) else []
    if not isinstance(records,list) or len(records)>6000:
        raise HTTPException(400,'Invalid positions')
    now=int(time.time()*1000)
    accepted=[]
    for p in records:
        try:
            kind=int(p['type']);vehicle=str(p['vehicle']).strip();line=str(p['line']).strip();brigade=str(p.get('brigade','')).strip()
            stamp=int(p['stamp']);lat=float(p['lat']);lon=float(p['lon'])
            if kind not in (1,2) or not vehicle or len(vehicle)>32 or not line or len(line)>20 or len(brigade)>32:continue
            if not (math.isfinite(lat) and math.isfinite(lon) and 51<lat<53 and 19<lon<23):continue
            if not (now-600000<=stamp<=now+90000):continue
            accepted.append((kind,vehicle,line,brigade,stamp,lat,lon))
        except (KeyError,TypeError,ValueError,OverflowError):continue
    with GPS_LOCK:
        with gps_db() as db:
            db.executemany('INSERT INTO observations(type,vehicle,line,brigade,stamp,lat,lon) VALUES(?,?,?,?,?,?,?) ON CONFLICT(type,vehicle,stamp) DO UPDATE SET line=excluded.line,brigade=excluded.brigade,lat=excluded.lat,lon=excluded.lon',accepted)
            # Retencja 48 godzin; nie przechowujemy GPS bez ograniczen.
            db.execute('DELETE FROM observations WHERE stamp<?',(now-48*3600000,))
    return {'ok':True,'received':len(records),'accepted':len(accepted)}

@app.get('/gps/history')
def gps_history(type:int=Query(ge=1,le=2),vehicle:str=Query(min_length=1,max_length=32),x_bridge_token:str|None=Header(default=None)):
    authorized(x_bridge_token)
    now=int(time.time()*1000)
    with gps_db() as db:
        rows=db.execute('SELECT line,brigade,stamp,lat,lon FROM observations WHERE type=? AND vehicle=? AND stamp>? ORDER BY stamp DESC LIMIT 3000',(type,vehicle,now-48*3600000)).fetchall()
    return {'type':type,'vehicle':vehicle,'positions':[{'line':r[0],'brigade':r[1],'stamp':r[2],'lat':r[3],'lon':r[4]} for r in reversed(rows)]}


# v3.2: współdzielone, trwałe dane operacyjne. Zapisy tylko z zaufanego
# procesu serwerowego posiadającego X-Bridge-Token (nigdy z publicznego JS).
def _identity(p):
    kind=int(p['type']); vehicle=str(p['vehicle']).strip()
    if kind not in (1,2) or not (1<=len(vehicle)<=32):
        raise ValueError('Invalid vehicle identity')
    return kind,vehicle

def _short(p,key,limit=40):
    v=str(p[key]).strip()
    if not v or len(v)>limit: raise ValueError('Invalid '+key)
    return v

def _stamp(p,key):
    value=int(p[key])
    now=int(time.time()*1000)
    if not (now-7*86400000 <= value <= now+86400000):
        raise ValueError('Timestamp outside allowed window')
    return value

@app.post('/gps/stop-events')
async def save_stop_events(request:Request,x_bridge_token:str|None=Header(default=None)):
    authorized(x_bridge_token)
    data=await request.json()
    events=data.get('events',[]) if isinstance(data,dict) else None
    if not isinstance(events,list) or len(events)>2000:
        raise HTTPException(400,'Invalid events')
    values=[]
    for p in events:
        try:
            kind,vehicle=_identity(p)
            event=_short(p,'event',10)
            source=_short(p,'source',40)
            if event not in ('arrival','departure') or source not in ('gps_geofence','manual','telemetry'):
                raise ValueError('Invalid event/source')
            seq=int(p['stop_seq'])
            if not 0<=seq<=1000: raise ValueError('Invalid sequence')
            values.append((kind,vehicle,_short(p,'line',30),str(p.get('brigade',''))[:32],
                           _short(p,'course_id'),seq,_short(p,'stop_id'),event,
                           _stamp(p,'stamp'),source))
        except (KeyError,ValueError,TypeError,OverflowError) as e:
            raise HTTPException(400,str(e))
    with GPS_LOCK:
        with gps_db() as db:
            db.executemany('''INSERT INTO stop_events
              (type,vehicle,line,brigade,course_id,stop_seq,stop_id,event,stamp,source)
              VALUES (?,?,?,?,?,?,?,?,?,?)
              ON CONFLICT(type,vehicle,course_id,stop_seq,event) DO UPDATE SET
              stamp=excluded.stamp,source=excluded.source''',values)
    return {'ok':True,'saved':len(values)}

@app.get('/gps/stop-events')
def get_stop_events(type:int=Query(ge=1,le=2),vehicle:str=Query(min_length=1,max_length=32),
                    course_id:str|None=None,x_bridge_token:str|None=Header(default=None)):
    authorized(x_bridge_token)
    sql='SELECT line,brigade,course_id,stop_seq,stop_id,event,stamp,source FROM stop_events WHERE type=? AND vehicle=?'
    params=[type,vehicle]
    if course_id is not None:
        sql+=' AND course_id=?';params.append(course_id)
    sql+=' ORDER BY stamp DESC LIMIT 1000'
    with gps_db() as db:
        result=[dict(zip(('line','brigade','course_id','stop_seq','stop_id','event','stamp','source'),r)) for r in db.execute(sql,params)]
    return {'type':type,'vehicle':vehicle,'events':list(reversed(result))}

@app.post('/gps/course-assignment')
async def save_course_assignment(request:Request,x_bridge_token:str|None=Header(default=None)):
    authorized(x_bridge_token)
    p=await request.json()
    try:
        kind,vehicle=_identity(p)
        course_id=_short(p,'course_id')
        line=_short(p,'line',30)
        brigade=str(p.get('brigade',''))[:32]
        start=_stamp(p,'start_stamp')
        end=_stamp(p,'end_stamp') if p.get('end_stamp') is not None else None
        source=_short(p,'source',40)
        if source not in ('gps_verified','manual','schedule_candidate') or (end is not None and end<start):
            raise ValueError('Invalid assignment')
    except (KeyError,ValueError,TypeError,OverflowError) as e:
        raise HTTPException(400,str(e))
    with GPS_LOCK:
        with gps_db() as db:
            db.execute('''INSERT INTO vehicle_courses
              (type,vehicle,course_id,line,brigade,start_stamp,end_stamp,source)
              VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(type,vehicle,course_id,start_stamp)
              DO UPDATE SET end_stamp=excluded.end_stamp,source=excluded.source''',
              (kind,vehicle,course_id,line,brigade,start,end,source))
    return {'ok':True}

@app.get('/gps/course-assignments')
def get_course_assignments(type:int=Query(ge=1,le=2),vehicle:str=Query(min_length=1,max_length=32),
                           x_bridge_token:str|None=Header(default=None)):
    authorized(x_bridge_token)
    cols=('course_id','line','brigade','start_stamp','end_stamp','source')
    with gps_db() as db:
        data=[dict(zip(cols,r)) for r in db.execute('''SELECT course_id,line,brigade,start_stamp,end_stamp,source
            FROM vehicle_courses WHERE type=? AND vehicle=? ORDER BY start_stamp DESC LIMIT 100''',(type,vehicle))]
    return {'type':type,'vehicle':vehicle,'assignments':data}

@app.post('/gps/predictions')
async def save_predictions(request:Request,x_bridge_token:str|None=Header(default=None)):
    authorized(x_bridge_token)
    p=await request.json()
    values=p.get('predictions',[]) if isinstance(p,dict) else None
    if not isinstance(values,list) or len(values)>1000:raise HTTPException(400,'Invalid predictions')
    out=[];now=int(time.time()*1000)
    for item in values:
        try:
            kind,vehicle=_identity(item)
            seq=int(item['stop_seq'])
            if not 0<=seq<=1000:raise ValueError('Invalid stop_seq')
            source=_short(item,'source',40)
            if source not in ('gps_projection','schedule','telemetry'):raise ValueError('Invalid source')
            out.append((kind,vehicle,_short(item,'course_id'),seq,_stamp(item,'predicted_stamp'),now,source))
        except (KeyError,ValueError,TypeError,OverflowError) as e:
            raise HTTPException(400,str(e))
    with GPS_LOCK:
        with gps_db() as db:
            db.executemany('''INSERT INTO vehicle_predictions
              (type,vehicle,course_id,stop_seq,predicted_stamp,updated_stamp,source)
              VALUES (?,?,?,?,?,?,?) ON CONFLICT(type,vehicle,course_id,stop_seq)
              DO UPDATE SET predicted_stamp=excluded.predicted_stamp,
              updated_stamp=excluded.updated_stamp,source=excluded.source''',out)
    return {'ok':True,'saved':len(out)}

@app.get('/gps/predictions')
def get_predictions(type:int=Query(ge=1,le=2),vehicle:str=Query(min_length=1,max_length=32),
                    course_id:str=Query(min_length=1,max_length=40),
                    x_bridge_token:str|None=Header(default=None)):
    authorized(x_bridge_token)
    cols=('stop_seq','predicted_stamp','updated_stamp','source')
    with gps_db() as db:
        data=[dict(zip(cols,r)) for r in db.execute('''SELECT stop_seq,predicted_stamp,updated_stamp,source
            FROM vehicle_predictions WHERE type=? AND vehicle=? AND course_id=? ORDER BY stop_seq''',
            (type,vehicle,course_id))]
    return {'type':type,'vehicle':vehicle,'course_id':course_id,'predictions':data}
