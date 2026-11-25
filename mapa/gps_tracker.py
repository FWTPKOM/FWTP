#!/usr/bin/env python3
# WTP LIVE GPS TRACKER v2.2 — GPS observations -> server-side assignments/events/predictions
# No external dependencies. Uses SQLite ETA geometry and GPS history.
import os, sqlite3, json, time, math, logging, signal
from datetime import datetime
from zoneinfo import ZoneInfo
from collections import defaultdict
from functools import lru_cache
from bisect import bisect_right
import pickle

ETA=os.getenv('ETA_DB_PATH','/opt/wtp-live/data/eta_v2.db')
GPS=os.getenv('WTP_GPS_DB','/opt/wtp-live/data/gps_history.db')
CACHE=os.getenv('WTP_ETA_CACHE','/opt/wtp-live/data/eta_tracker_cache_v19.pkl')
CACHE_MAX_AGE=int(os.getenv('WTP_ETA_CACHE_MAX_AGE','1800'))
INTERVAL=int(os.getenv('GPS_TRACKER_INTERVAL','2'))
# GPS evidence thresholds for changing to a successor course.
SWITCH_EARLY_SECONDS=int(os.getenv('GPS_SWITCH_EARLY_SECONDS','180'))  # retained for compatibility
SWITCH_CONFIRM_MS=int(os.getenv('GPS_SWITCH_CONFIRM_MS','20000'))
SWITCH_MIN_METRES=float(os.getenv('GPS_SWITCH_MIN_METRES','0'))  # terminal dwell confirms switch; movement is optional
MATCH_WINDOW_MS=int(os.getenv('GPS_MATCH_WINDOW_MS','240000'))
MATCH_MIN_OBSERVATIONS=int(os.getenv('GPS_MATCH_MIN_OBSERVATIONS','3'))
TZ=ZoneInfo('Europe/Warsaw')
LOG=logging.getLogger('gps_tracker')
RUN=True

def stop(signum,frame):
    global RUN
    LOG.warning('Received shutdown signal %s; finishing current batch',signum)
    RUN=False
signal.signal(signal.SIGTERM,stop)
signal.signal(signal.SIGINT,stop)

def dist(a,b,c,d):
    x=math.radians(d-b)*math.cos(math.radians((a+c)/2))
    y=math.radians(c-a)
    return 6371000*math.hypot(x,y)

def secs(s):
    if s is None:return None
    try:
        h,m,*ss=str(s).split(':');return int(h)*3600+int(m)*60+(int(ss[0]) if ss else 0)
    except (ValueError,TypeError):return None

def midnight_ms(stamp):
    dt=datetime.fromtimestamp(stamp/1000,TZ)
    return int(dt.replace(hour=0,minute=0,second=0,microsecond=0).timestamp()*1000)

def open_gps():
    db=sqlite3.connect(GPS,timeout=20)
    db.row_factory=sqlite3.Row
    db.execute('PRAGMA journal_mode=WAL')
    db.execute('PRAGMA busy_timeout=20000')
    db.executescript('''
    CREATE TABLE IF NOT EXISTS tracker_state (
      type INTEGER NOT NULL,vehicle TEXT NOT NULL,course_id TEXT,
      line TEXT,brigade TEXT,last_stamp INTEGER NOT NULL DEFAULT 0,
      progress INTEGER NOT NULL DEFAULT -1,near_seq INTEGER,
      near_since INTEGER,first_seen INTEGER,
       switch_candidate TEXT,switch_since INTEGER,
       switch_lat REAL,switch_lon REAL,
      PRIMARY KEY(type,vehicle));
    CREATE TABLE IF NOT EXISTS stop_events (
      type INTEGER NOT NULL,vehicle TEXT NOT NULL,line TEXT NOT NULL,brigade TEXT NOT NULL,
      course_id TEXT NOT NULL,stop_seq INTEGER NOT NULL,stop_id TEXT NOT NULL,
      event TEXT NOT NULL,stamp INTEGER NOT NULL,source TEXT NOT NULL,
      PRIMARY KEY(type,vehicle,course_id,stop_seq,event));
    CREATE TABLE IF NOT EXISTS vehicle_courses (
      type INTEGER NOT NULL,vehicle TEXT NOT NULL,course_id TEXT NOT NULL,line TEXT NOT NULL,
      brigade TEXT NOT NULL,start_stamp INTEGER NOT NULL,end_stamp INTEGER,source TEXT NOT NULL,
      PRIMARY KEY(type,vehicle,course_id,start_stamp));
    CREATE TABLE IF NOT EXISTS vehicle_headings (
      type INTEGER NOT NULL,vehicle TEXT NOT NULL,bearing REAL,
      moved_stamp INTEGER,last_stamp INTEGER NOT NULL,lat REAL,lon REAL,
      PRIMARY KEY(type,vehicle));
    CREATE TABLE IF NOT EXISTS vehicle_delays (
      type INTEGER NOT NULL,vehicle TEXT NOT NULL,course_id TEXT NOT NULL,
      stamp INTEGER NOT NULL,delay_ms INTEGER NOT NULL,progress INTEGER NOT NULL,
      PRIMARY KEY(type,vehicle,course_id,stamp));
    CREATE TABLE IF NOT EXISTS vehicle_predictions (
      type INTEGER NOT NULL,vehicle TEXT NOT NULL,course_id TEXT NOT NULL,stop_seq INTEGER NOT NULL,
      predicted_stamp INTEGER NOT NULL,updated_stamp INTEGER NOT NULL,source TEXT NOT NULL,
      PRIMARY KEY(type,vehicle,course_id,stop_seq));
    ''')
    # Safe migration for existing v1.0 databases.
    columns={r[1] for r in db.execute('PRAGMA table_info(tracker_state)')}
    for name,typ in [('switch_candidate','TEXT'),('switch_since','INTEGER'),('switch_lat','REAL'),('switch_lon','REAL')]:
        if name not in columns:
            db.execute(f'ALTER TABLE tracker_state ADD COLUMN {name} {typ}')
    db.execute('CREATE INDEX IF NOT EXISTS idx_observations_tracker ON observations(type,vehicle,stamp)')
    db.commit()
    return db

def save_stage(path, payload):
    """Atomic, restart-safe ETA checkpoint (locally generated data only)."""
    tmp=path+'.tmp.'+str(os.getpid())
    try:
        os.makedirs(os.path.dirname(path),exist_ok=True)
        with open(tmp,'wb') as f:
            pickle.dump(payload,f,protocol=pickle.HIGHEST_PROTOCOL)
        os.replace(tmp,path)
    except OSError as e:
        LOG.warning('ETA checkpoint could not be saved: %s',e)
        try:os.unlink(tmp)
        except OSError:pass

# v2.0: disk-backed ETA geometry, bounded memory; no giant pickle loads.
INDEX=os.getenv('WTP_ETA_INDEX','/opt/wtp-live/data/eta_tracker_index_v20.db')
BUILD_BATCH=max(1000,int(os.getenv('WTP_ETA_INDEX_BATCH','5000')))

class LazyCourses:
    def __init__(self,tt):self.tt=tt
    def get(self,key,default=None):return self.tt.course(key) if key else default

class LazyShapes:
    def __init__(self,tt):self.tt=tt
    def get(self,key,default=None):return self.tt.shape(key) if key else (default if default is not None else [])
    def __contains__(self,key):return self.tt.has_shape(key)

class LazyLines:
    def __init__(self,tt):self.tt=tt
    def get(self,key,default=None):return self.tt.line_courses(*key) if key else (default or [])

class Timetable:
    def __init__(self):
        self.signature=None;self.date=None;self.ready=False
        self.source=None;self.idx=None
        self.courses=LazyCourses(self);self.shapes=LazyShapes(self);self.by_line=LazyLines(self)
        self.course_cache={};self.shape_cache={};self.line_cache={}

    def close(self):
        for name in ('source','idx'):
            conn=getattr(self,name)
            if conn:
                try:conn.close()
                except Exception:pass
                setattr(self,name,None)

    def reload(self):
        st=os.stat(ETA)
        signature='%s:%s:%s'%(st.st_ino,st.st_mtime_ns,st.st_size)
        today=datetime.now(TZ).date().isoformat()
        if signature==self.signature and self.date==today and self.ready:return
        if signature!=self.signature:
            self.close();self.course_cache.clear();self.shape_cache.clear();self.line_cache.clear()
            self.source=sqlite3.connect('file:'+ETA+'?mode=ro',uri=True,timeout=30)
            self.source.row_factory=sqlite3.Row
            meta=dict(self.source.execute("SELECT key,value FROM metadata WHERE key IN ('date','version')"))
            self.date=meta.get('date')
            self.signature=signature
            self.idx=sqlite3.connect(INDEX,timeout=30)
            self.idx.execute('PRAGMA busy_timeout=30000')
            self.idx.execute('PRAGMA journal_mode=WAL')
            self.idx.execute('PRAGMA synchronous=NORMAL')
            self.idx.execute('CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT)')
            self.idx.execute('CREATE TABLE IF NOT EXISTS shape_points(variant TEXT NOT NULL,n INTEGER NOT NULL,lat REAL NOT NULL,lon REAL NOT NULL,stop_id TEXT)')
            self.idx.execute('CREATE INDEX IF NOT EXISTS idx_shape_points ON shape_points(variant,n)')
            previous=self.idx.execute("SELECT value FROM meta WHERE key='signature'").fetchone()
            if previous is None or previous[0]!=signature:
                LOG.info('New ETA file; resetting disk geometry index')
                self.idx.execute('DELETE FROM shape_points')
                self.idx.execute('DELETE FROM meta')
                self.idx.execute("INSERT INTO meta(key,value) VALUES('signature',?)",(signature,))
                self.idx.execute("INSERT INTO meta(key,value) VALUES('cursor','0')")
                self.idx.execute("INSERT INTO meta(key,value) VALUES('complete','0')")
                self.idx.commit()
        if self.date!=today:
            self.ready=False
            LOG.warning('ETA timetable date %s differs from current date %s',self.date,today)
            return
        complete=self.idx.execute("SELECT value FROM meta WHERE key='complete'").fetchone()
        if complete and complete[0]=='1':
            self.ready=True
            LOG.info('ETA geometry disk index ready; loading courses and shapes on demand')
            return
        LOG.info('Building ETA disk geometry index in batches; no large in-memory pickle')
        while RUN:
            cursor=int(self.idx.execute("SELECT value FROM meta WHERE key='cursor'").fetchone()[0])
            rows=self.source.execute("SELECT rowid,payload FROM eta_rows WHERE section='kształt_trasy_GPS' AND rowid>? ORDER BY rowid LIMIT ?",(cursor,BUILD_BATCH)).fetchall()
            if not rows:
                self.idx.execute("UPDATE meta SET value='1' WHERE key='complete'")
                self.idx.commit();self.ready=True
                LOG.info('ETA disk index complete: %s geometry points',self.idx.execute('SELECT COUNT(*) FROM shape_points').fetchone()[0])
                return
            points=[]
            for row in rows:
                try:
                    p=json.loads(row['payload'])
                    v=str(p['id_wariantu']);lat=float(p['gps_n']);lon=float(p['gps_e']);n=int(p['numer_punktu'])
                    if 51<lat<53 and 19<lon<23:
                        points.append((v,n,lat,lon,str(p['id_slupka']) if p.get('id_slupka') is not None else None))
                except (ValueError,TypeError,KeyError):continue
            self.idx.executemany('INSERT INTO shape_points(variant,n,lat,lon,stop_id) VALUES(?,?,?,?,?)',points)
            self.idx.execute("UPDATE meta SET value=? WHERE key='cursor'",(str(rows[-1]['rowid']),))
            self.idx.commit()
            LOG.info('ETA disk checkpoint rowid=%s, added=%s points',rows[-1]['rowid'],len(points))
        LOG.warning('ETA index interrupted; saved checkpoint will resume')

    def has_shape(self,variant):
        if not variant:return False
        return self.idx.execute('SELECT 1 FROM shape_points WHERE variant=? LIMIT 1',(variant,)).fetchone() is not None

    def shape(self,variant):
        if not variant:return []
        if variant in self.shape_cache:return self.shape_cache[variant]
        rows=self.idx.execute('SELECT n,lat,lon,stop_id FROM shape_points WHERE variant=? ORDER BY n',(variant,)).fetchall()
        pts=[(n,lat,lon,sid) for n,lat,lon,sid in rows]
        if len(self.shape_cache)>=24:self.shape_cache.pop(next(iter(self.shape_cache)))
        self.shape_cache[variant]=pts
        return pts

    def course(self,cid):
        cid=str(cid)
        if cid in self.course_cache:return self.course_cache[cid]
        row=self.source.execute('''SELECT c.course_id,b.line_name,c.brigade,c.departure
            FROM courses c JOIN boards b ON b.schedule_id=c.schedule_id WHERE c.course_id=? LIMIT 1''',(cid,)).fetchone()
        if row is None:return None
        course={'id':str(row[0]),'line':str(row[1] or ''),'brigade':str(row[2] or '').strip(),'start':secs(row[3])}
        stops=[]
        for r in self.source.execute('SELECT seq,stop_id,arrival,departure,payload FROM course_stops WHERE course_id=? ORDER BY seq',(cid,)):
            try:variant=str(json.loads(r[4] or '{}').get('id_wariantu') or '')
            except (ValueError,TypeError):variant=''
            stops.append({'seq':int(r[0]),'id':str(r[1]),'arrival':secs(r[2]),'departure':secs(r[3]),'variant':variant})
        course['stops']=stops
        course['end']=max([t for x in stops for t in (x['arrival'],x['departure']) if t is not None] or [course['start'] or 0])
        if course['start'] is None:course['start']=min([x['departure'] for x in stops if x['departure'] is not None] or [0])
        if course['end']<course['start']:course['end']+=86400
        variants={x['variant'] for x in stops if x['variant']}
        course['variant']=stops[0]['variant'] if len(variants)==1 and stops else ''
        pts=self.shape(course['variant']);lookup=defaultdict(list)
        for i,pt in enumerate(pts):
            if pt[3] is not None:lookup[pt[3]].append(i)
        last=-1
        for stop in stops:
            indices=lookup.get(stop['id'],())
            j=bisect_right(indices,last)
            if j<len(indices):stop['point']=indices[j];last=indices[j]
            else:stop['point']=None
        if len(self.course_cache)>=384:self.course_cache.pop(next(iter(self.course_cache)))
        self.course_cache[cid]=course
        return course

    def line_courses(self,line,brigade):
        key=(line,brigade)
        if key in self.line_cache:return [self.course(cid) for cid in self.line_cache[key]]
        ids=[str(r[0]) for r in self.source.execute('''SELECT c.course_id FROM courses c
            JOIN boards b ON b.schedule_id=c.schedule_id
            WHERE b.line_name=? AND TRIM(c.brigade)=?''',(line,brigade))]
        if len(self.line_cache)>=80:self.line_cache.pop(next(iter(self.line_cache)))
        self.line_cache[key]=ids
        return [self.course(cid) for cid in ids]

    def successors(self,line,brigade,current,stamp):
        if self.date!=datetime.fromtimestamp(stamp/1000,TZ).date().isoformat():return []
        return sorted((c for c in self.by_line.get((line,brigade),[])
                       if c and c['id']!=current['id'] and c['start']>current['start']
                       and c['start']<=current['start']+12*3600),key=lambda c:c['start'])

    def candidates(self,line,brigade,stamp):
        if self.date!=datetime.fromtimestamp(stamp/1000,TZ).date().isoformat():return []
        t=(stamp-midnight_ms(stamp))/1000
        return [c for c in self.by_line.get((line,brigade),[]) if c and c['start']-3600<=t<=c['end']+7200 and c['variant'] in self.shapes]

    def nearest(self,course,lat,lon,progress=-1):
        if not course:return None
        pts=self.shapes.get(course['variant'],[])
        if not pts:return None
        lo=max(0,progress-8) if progress>=0 else 0
        hi=min(len(pts),progress+65) if progress>=0 else len(pts)
        if hi<=lo:lo=0;hi=len(pts)
        best=min(range(lo,hi),key=lambda i:dist(lat,lon,pts[i][1],pts[i][2]))
        return best,dist(lat,lon,pts[best][1],pts[best][2])

def update_predictions(db,kind,vehicle,course,progress,stamp,delay):
    base=midnight_ms(stamp)
    for s in course['stops']:
        if s['point'] is None or s['point']<progress:continue
        t=s['arrival'] if s['arrival'] is not None else s['departure']
        if t is None:continue
        predicted=int(base+t*1000+delay)
        db.execute('''INSERT INTO vehicle_predictions(type,vehicle,course_id,stop_seq,predicted_stamp,updated_stamp,source)
            VALUES(?,?,?,?,?,?,?) ON CONFLICT(type,vehicle,course_id,stop_seq) DO UPDATE SET
            predicted_stamp=excluded.predicted_stamp,updated_stamp=excluded.updated_stamp,source=excluded.source''',
            (kind,vehicle,course['id'],s['seq'],predicted,stamp,'gps_projection'))

def bearing_between(a,b,c,d):
    a,b,c,d=map(math.radians,(a,b,c,d))
    y=math.sin(d-b)*math.cos(c)
    x=math.cos(a)*math.sin(c)-math.sin(a)*math.cos(c)*math.cos(d-b)
    return (math.degrees(math.atan2(y,x))+360)%360

def record_heading(db,kind,vehicle,stamp,lat,lon):
    old=db.execute('SELECT * FROM vehicle_headings WHERE type=? AND vehicle=?',(kind,vehicle)).fetchone()
    bearing=old['bearing'] if old else None
    moved=old['moved_stamp'] if old else None
    if old and stamp>old['last_stamp']:
        delta=dist(old['lat'],old['lon'],lat,lon)
        seconds=(stamp-old['last_stamp'])/1000
        if 15<=delta<=min(1800,max(100,seconds*40)):
            bearing=bearing_between(old['lat'],old['lon'],lat,lon)
            moved=stamp
    db.execute('''INSERT INTO vehicle_headings(type,vehicle,bearing,moved_stamp,last_stamp,lat,lon)
        VALUES(?,?,?,?,?,?,?) ON CONFLICT(type,vehicle) DO UPDATE SET
        bearing=excluded.bearing,moved_stamp=excluded.moved_stamp,
        last_stamp=excluded.last_stamp,lat=excluded.lat,lon=excluded.lon''',
        (kind,vehicle,bearing,moved,stamp,lat,lon))

def route_heading(tt,course,point):
    """Direction from the assigned ETA variant; valid even while stopped."""
    if not course or point is None:return None
    pts=tt.shapes.get(course['variant'],[])
    if len(pts)<2:return None
    i=max(0,min(int(point),len(pts)-1))
    origin=pts[i]
    # Prefer the forward tangent, but ignore nearly coincident GPS graph nodes.
    for j in range(i+1,min(len(pts),i+16)):
        if dist(origin[1],origin[2],pts[j][1],pts[j][2])>=12:
            return bearing_between(origin[1],origin[2],pts[j][1],pts[j][2])
    for j in range(i-1,max(-1,i-16),-1):
        if dist(pts[j][1],pts[j][2],origin[1],origin[2])>=12:
            return bearing_between(pts[j][1],pts[j][2],origin[1],origin[2])
    return None

def persist_route_heading(db,tt,kind,vehicle,course,point,stamp,metres):
    """Keep the route-based arrow on the server; never infer '?' from a stop."""
    if metres>65:return
    direction=route_heading(tt,course,point)
    if direction is None:return
    # Do not replace GPS observation coordinates or its last movement timestamp.
    db.execute("""UPDATE vehicle_headings SET bearing=?
                  WHERE type=? AND vehicle=? AND last_stamp=?""",
               (direction,kind,vehicle,stamp))

def recent_track(db, kind, vehicle, stamp, line, brigade):
    """Chronological recent GPS fixes for the same vehicle and duty."""
    data=db.execute("""SELECT stamp,lat,lon FROM observations
        WHERE type=? AND vehicle=? AND line=? AND brigade=?
          AND stamp BETWEEN ? AND ? ORDER BY stamp DESC LIMIT 24""",
        (kind,vehicle,line,brigade,stamp-MATCH_WINDOW_MS,stamp)).fetchall()
    result=[]
    for r in reversed(data):
        item=(int(r['stamp']),float(r['lat']),float(r['lon']))
        if not result or item[0]>result[-1][0]:result.append(item)
    return result


def rank_track(tt, course, track):
    """Use ordered GPS progress, not a single spatial coincidence.

    Returns (score, evidence). Geometry is directional; large backwards jumps
    and out-of-route fixes disqualify a candidate.
    """
    if len(track)<MATCH_MIN_OBSERVATIONS:return None
    pts=tt.shapes.get(course['variant'],[])
    if not pts:return None
    samples=[]
    for stamp,lat,lon in track:
        near=tt.nearest(course,lat,lon)
        if near is None:continue
        point,metres=near
        if metres>125:continue
        samples.append((stamp,point,metres))
    if len(samples)<MATCH_MIN_OBSERVATIONS:return None
    # Require observations over time, and a measurable distance of actual travel.
    if samples[-1][0]-samples[0][0]<20000:return None
    travel=sum(dist(a[1],a[2],b[1],b[2]) for a,b in zip(track,track[1:]))
    if travel<45:return None
    reversals=sum(1 for a,b in zip(samples,samples[1:]) if b[1]<a[1]-6)
    if reversals:return None
    forward=samples[-1][1]-samples[0][1]
    if forward<3:return None
    average=sum(p[2] for p in samples)/len(samples)
    coverage=len(samples)/len(track)
    if coverage<0.70:return None
    # Stronger evidence when movement follows a significant number of route points.
    score=average+max(0,1-coverage)*100+max(0,8-forward)*3
    return score, (samples[-1][1],samples[-1][2])


def process(db,tt,obs,state):
    kind,vehicle,line,brigade,stamp,lat,lon=obs
    if state and stamp<=state['last_stamp']:return
    record_heading(db,kind,vehicle,stamp,lat,lon)
    current=tt.courses.get(state['course_id']) if state and state['course_id'] else None
    if current and (current['line']!=line or current['brigade']!=brigade):current=None
    progress=state['progress'] if state and current else -1
    nearest=tt.nearest(current,lat,lon,progress) if current else None
    if current and nearest and nearest[1]>160:
        # Allow a vehicle to temporarily leave route, but do not fabricate stop events.
        nearest=None
    # A new trip must be confirmed by repeated GPS fixes near its starting
    # point. Do not rely on the timetable end alone: vehicles can be early/late.
    switch_candidate=None
    switch_since=None
    switch_lat=None
    switch_lon=None
    if current:
        now_s=(stamp-midnight_ms(stamp))/1000
        old_pts=tt.shapes.get(current['variant'],[])
        mapped=[s for s in current['stops'] if s['point'] is not None]
        last_stop=max((s['point'] for s in mapped),default=len(old_pts)-1)
        terminal=old_pts[last_stop] if 0<=last_stop<len(old_pts) else None
        terminal_distance=dist(lat,lon,terminal[1],terminal[2]) if terminal else 1e9
        at_end=(progress>=max(0,last_stop-8) or
                (progress>=max(0,last_stop-35) and terminal_distance<75))
        # Confirm arrival at the old terminal, not timetable departure of successor.
        # Allow long layovers; switch into a WAITING course without claiming departure.
        possible=[]
        if terminal and terminal_distance<=65 and at_end:
            successors=tt.successors(line,brigade,current,stamp)
            if successors:
                next_course=successors[0]
                first_mapped=next((x for x in next_course['stops'] if x['point'] is not None),None)
                next_pts=tt.shapes.get(next_course['variant'],[])
                if first_mapped and next_pts:
                    start_point=next_pts[first_mapped['point']]
                    start_distance=dist(lat,lon,start_point[1],start_point[2])
                    # A terminal can also be an interchange: demand spatial match.
                    if start_distance<=90:
                        possible=[(start_distance,next_course,(first_mapped['point'],start_distance))]
        if possible:
            best=possible[0]
            switch_candidate=best[1]['id']
            if state and state['switch_candidate']==switch_candidate and state['switch_since']:
                switch_since=state['switch_since']
                switch_lat=state['switch_lat'];switch_lon=state['switch_lon']
            else:
                switch_since=stamp;switch_lat=lat;switch_lon=lon
            # Confirm a terminal dwell; requiring 75m movement here prevented
            # course changes while a bus waited at the terminus.
            # Do not switch hours before the next scheduled departure.
            local_s=(stamp-midnight_ms(stamp))/1000
            next_start=best[1]['start']
            if (stamp-switch_since>=SWITCH_CONFIRM_MS
                    and local_s>=next_start-600
                    and (SWITCH_MIN_METRES<=0 or
                         (switch_lat is not None and switch_lon is not None
                          and dist(switch_lat,switch_lon,lat,lon)>=SWITCH_MIN_METRES))):
                db.execute('''UPDATE vehicle_courses SET end_stamp=? WHERE type=? AND vehicle=?
                    AND course_id=? AND end_stamp IS NULL''',(stamp,kind,vehicle,current['id']))
                current=best[1];nearest=best[2];progress=-1
                state=None
                switch_candidate=None;switch_since=None
                switch_lat=None;switch_lon=None
                db.execute('''INSERT OR IGNORE INTO vehicle_courses(type,vehicle,course_id,line,brigade,start_stamp,end_stamp,source)
                    VALUES(?,?,?,?,?,?,NULL,?)''',(kind,vehicle,current['id'],line,brigade,stamp,'gps_terminal_waiting'))
    if not current:
        track=recent_track(db,kind,vehicle,stamp,line,brigade)
        ranked=[]
        for c in tt.candidates(line,brigade,stamp):
            evidence=rank_track(tt,c,track)
            if evidence is None:continue
            score,near=evidence
            # Penalize only impossible schedule displacement, not normal delays.
            t=(stamp-midnight_ms(stamp))/1000
            if t<c['start']-3600 or t>c['end']+7200:continue
            ranked.append((score,c,near))
        # Spatially identical variants can correspond to several scheduled
        # courses. Use departure proximity only as a weak tie-breaker,
        # and refuse to guess when scores remain indistinguishable.
        now_s=(stamp-midnight_ms(stamp))/1000
        ranked.sort(key=lambda x:(x[0]+min(90,abs(now_s-x[1]['start'])/120),abs(now_s-x[1]['start'])))
        def effective(item):
            return item[0]+min(90,abs(now_s-item[1]['start'])/120)
        if ranked and (len(ranked)==1 or effective(ranked[1])-effective(ranked[0])>=12):
            current=ranked[0][1];nearest=ranked[0][2];progress=-1
            db.execute('''INSERT OR IGNORE INTO vehicle_courses(type,vehicle,course_id,line,brigade,start_stamp,end_stamp,source)
                VALUES(?,?,?,?,?,?,NULL,?)''',(kind,vehicle,current['id'],line,brigade,stamp,'schedule_candidate'))
    if current and nearest:
        point,metres=nearest
        # Prevent GPS jitter from rewinding the stop sequence.
        progress=max(progress,point)
        # Persist ETA route direction independently of any open browser tab.
        persist_route_heading(db,tt,kind,vehicle,current,point,stamp,metres)
        close=[s for s in current['stops'] if s['point'] is not None and abs(s['point']-point)<=3]
        close.sort(key=lambda s:abs(s['point']-point))
        near=close[0] if close and metres<=45 else None
        prev_seq=state['near_seq'] if state and state['course_id']==current['id'] else None
        since=state['near_since'] if state and prev_seq is not None else None
        if near and (prev_seq!=near['seq']):
            prev_seq=near['seq'];since=stamp
            # Geofence observation is an estimate, not an onboard door event.
            db.execute('''INSERT OR IGNORE INTO stop_events(type,vehicle,line,brigade,course_id,stop_seq,stop_id,event,stamp,source)
                VALUES(?,?,?,?,?,?,?,?,?,?)''',(kind,vehicle,line,brigade,current['id'],near['seq'],near['id'],'arrival',stamp,'gps_geofence'))
        elif not near and prev_seq is not None:
            previous=next((s for s in current['stops'] if s['seq']==prev_seq),None)
            # Departure needs spatial evidence *beyond* the stop, not just
            # leaving a 45 m geofence or the scheduled departure time.
            stop_point=previous['point'] if previous else None
            route_pts=tt.shapes.get(current['variant'],[])
            beyond=False
            if stop_point is not None and point>stop_point and point<len(route_pts):
                beyond=(dist(route_pts[stop_point][1],route_pts[stop_point][2],
                             route_pts[point][1],route_pts[point][2])>=45)
            if previous and since and stamp-since>=5000 and beyond and metres<=65:
                db.execute('''INSERT OR IGNORE INTO stop_events(type,vehicle,line,brigade,course_id,stop_seq,stop_id,event,stamp,source)
                    VALUES(?,?,?,?,?,?,?,?,?,?)''',(kind,vehicle,line,brigade,current['id'],previous['seq'],previous['id'],'departure',stamp,'gps_geofence'))
            if beyond and metres<=65:
                prev_seq=None;since=None
        # Estimate delay by interpolating scheduled time between adjacent mapped stops.
        mapped=[s for s in current['stops'] if s['point'] is not None and s['arrival'] is not None]
        before=max((s for s in mapped if s['point']<=progress),key=lambda s:s['point'],default=None)
        after=min((s for s in mapped if s['point']>=progress),key=lambda s:s['point'],default=None)
        sched=None
        if before and after:
            if before['point']==after['point']:sched=before['arrival']
            else:
                frac=(progress-before['point'])/(after['point']-before['point'])
                sched=before['arrival']+frac*(after['arrival']-before['arrival'])
        elif before:sched=before['arrival']
        # While waiting for the scheduled start, do not fabricate a delay.
        if sched is not None and not (stamp < midnight_ms(stamp)+current['start']*1000 and progress<=max(5, (current['stops'][0]['point'] if current['stops'] and current['stops'][0]['point'] is not None else 0)+5)):
            elapsed=(stamp-midnight_ms(stamp))/1000
            delay=max(-600000,min(3600000,int((elapsed-sched)*1000)))
            update_predictions(db,kind,vehicle,current,progress,stamp,delay)
            db.execute('''INSERT OR IGNORE INTO vehicle_delays(type,vehicle,course_id,stamp,delay_ms,progress)
                VALUES(?,?,?,?,?,?)''',(kind,vehicle,current['id'],stamp,delay,progress))
        # Do not auto-close the course on timetable end; wait for next confirmed course.
        db.execute('''INSERT INTO tracker_state(type,vehicle,course_id,line,brigade,last_stamp,progress,near_seq,near_since,first_seen,switch_candidate,switch_since,switch_lat,switch_lon)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(type,vehicle) DO UPDATE SET
            course_id=excluded.course_id,line=excluded.line,brigade=excluded.brigade,last_stamp=excluded.last_stamp,
            progress=excluded.progress,near_seq=excluded.near_seq,near_since=excluded.near_since,
            switch_candidate=excluded.switch_candidate,switch_since=excluded.switch_since,
            switch_lat=excluded.switch_lat,switch_lon=excluded.switch_lon''',
            (kind,vehicle,current['id'],line,brigade,stamp,progress,prev_seq,since,stamp,switch_candidate,switch_since,switch_lat,switch_lon))
    else:
        # Keep last reliable route progress when GPS briefly leaves the route.
        # Otherwise the vehicle can never satisfy the end-of-course condition.
        db.execute('''INSERT INTO tracker_state(type,vehicle,course_id,line,brigade,last_stamp,progress,near_seq,near_since,first_seen,switch_candidate,switch_since,switch_lat,switch_lon)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(type,vehicle) DO UPDATE SET
            course_id=excluded.course_id,line=excluded.line,brigade=excluded.brigade,
            last_stamp=excluded.last_stamp,progress=excluded.progress,
            switch_candidate=excluded.switch_candidate,switch_since=excluded.switch_since,
            switch_lat=excluded.switch_lat,switch_lon=excluded.switch_lon''',
            (kind,vehicle,current['id'] if current else None,line,brigade,stamp,
             progress if current else -1,None,None,stamp,switch_candidate,switch_since,switch_lat,switch_lon))

def run():
    tt=Timetable(); db=open_gps()
    while RUN:
        try:
            tt.reload()
            if not RUN:break
            if not tt.ready:
                time.sleep(INTERVAL)
                continue
            # Prioritize live observations; older raw history remains in SQLite.
            cutoff=int(time.time()*1000)-120000
            observations=db.execute('''SELECT o.type,o.vehicle,o.line,o.brigade,o.stamp,o.lat,o.lon
                FROM observations o LEFT JOIN tracker_state s ON s.type=o.type AND s.vehicle=o.vehicle
                WHERE o.stamp>? AND o.stamp>COALESCE(s.last_stamp,0)
                ORDER BY o.stamp LIMIT 2500''',(cutoff,)).fetchall()
            states={(r['type'],r['vehicle']):r for r in db.execute('SELECT * FROM tracker_state')}
            processed=0
            for r in observations:
                if not RUN:break
                key=(r['type'],r['vehicle'])
                process(db,tt,tuple(r),states.get(key))
                states[key]=db.execute('SELECT * FROM tracker_state WHERE type=? AND vehicle=?',key).fetchone()
                processed+=1
            db.commit()
            if processed:LOG.info('Processed %d observations; newest=%s',processed,datetime.fromtimestamp(observations[-1]['stamp']/1000,TZ).isoformat())
        except Exception:LOG.exception('GPS tracker iteration failed');db.rollback()
        for _ in range(INTERVAL):
            if not RUN:break
            time.sleep(1)
    LOG.warning('Tracker loop ended; RUN=%s',RUN)
    db.close()
    tt.close()

if __name__=='__main__':
    logging.basicConfig(level=logging.INFO,format='%(asctime)s %(levelname)s %(message)s')
    run()
