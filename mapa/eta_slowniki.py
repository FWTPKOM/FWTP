#!/usr/bin/env python3
"""WTP LIVE v261: niezależny import słowników ETA; nie nadpisuje rozkładów.
Uruchamiaj w środowisku z ETA_API_KEY (np. systemd eta-update.service).
"""
import datetime as dt
import json
import os
from pathlib import Path
import re
import sqlite3
import sys
import tempfile
import unicodedata
from urllib.parse import quote
import zipfile
import requests
import ijson

ROOT = Path('/opt/wtp-live')
BASE = os.getenv('ETA_BASE_URL', 'https://eta.ztm.waw.pl').rstrip('/')
TARGET = Path(os.getenv('ETA_DICTIONARY_DB', str(ROOT / 'data/eta_slowniki.db')))

def norm(s):
    s = unicodedata.normalize('NFKD', str(s)).lower().replace('ł', 'l')
    return ''.join(c for c in s if not unicodedata.combining(c))

def entries(obj):
    if isinstance(obj, list): return [x for x in obj if isinstance(x, dict)]
    if isinstance(obj, dict):
        for k in ('result','data','files','timetables','items'):
            if k in obj:
                found = entries(obj[k])
                if found: return found
    return []

def run():
    key = os.getenv('ETA_API_KEY','').strip()
    if not key: raise RuntimeError('Brak ETA_API_KEY (uruchom przez środowisko eta-update.service)')
    s = requests.Session(); s.trust_env = False
    s.headers['X-api-key'] = key
    if os.getenv('ETA_USER') and os.getenv('ETA_PASSWORD'):
        s.auth=(os.environ['ETA_USER'],os.environ['ETA_PASSWORD'])
    response=s.get(BASE+'/timetable1',timeout=(15,90)); response.raise_for_status()
    candidates=[]
    for item in entries(response.json()):
        name=str(item.get('name') or item.get('fileName') or item.get('filename') or '')
        if re.match(r'^Slowniki_.*\.json\.zip$',name,re.I) and 'zmienione' not in name.lower():
            candidates.append((name,item))
    if not candidates: raise RuntimeError('Brak Slowniki_*.json.zip w /timetable1; baza bez zmian')
    name,item=max(candidates,key=lambda x:x[0])
    if TARGET.exists():
        con=sqlite3.connect('file:'+str(TARGET)+'?mode=ro',uri=True)
        try:
            current=con.execute("SELECT value FROM metadata WHERE key='archive'").fetchone()
            if current and current[0]==name:
                print('Słowniki aktualne:',name);return
        finally: con.close()
    url=item.get('url') or item.get('downloadUrl') or BASE+'/timetable1/'+quote(name)
    if not str(url).startswith(BASE+'/timetable1/'):
        raise RuntimeError('Nieoczekiwany URL słownika')
    TARGET.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(dir=TARGET.parent,prefix='.slowniki-') as tmp:
        archive_path=Path(tmp)/'slowniki.zip'
        print('Pobieranie słowników:',name,flush=True)
        with s.get(url,stream=True,timeout=(15,180)) as r:
            r.raise_for_status()
            with archive_path.open('wb') as f:
                for chunk in r.iter_content(1024*1024):
                    if chunk:f.write(chunk)
        with zipfile.ZipFile(archive_path) as z:
            members=[n for n in z.namelist() if n.lower().endswith('.json')]
            if len(members)!=1:raise RuntimeError('Archiwum słowników musi zawierać jeden JSON')
            member=members[0]
            with z.open(member) as f:
                keys=[v for prefix,event,v in ijson.parse(f) if prefix=='' and event=='map_key']
            lookup={norm(k):k for k in keys}
            if 'slupki' not in lookup or 'przystanki' not in lookup:
                raise RuntimeError('Brak slupki/przystanki w archiwum: '+str(keys))
            tempdb=Path(tmp)/'dictionary.db'
            db=sqlite3.connect(tempdb)
            try:
                db.executescript("""CREATE TABLE metadata(key TEXT PRIMARY KEY,value TEXT);
CREATE TABLE slupki(id_slupka TEXT PRIMARY KEY,id_przystanku TEXT,nazwa_slupka TEXT,numer_slupka TEXT,symbol_slupka TEXT,gps_s REAL,gps_n REAL,payload TEXT);
CREATE TABLE przystanki(id_przystanku TEXT PRIMARY KEY,nazwa_przystanku TEXT,payload TEXT);
CREATE INDEX ix_slupki_przystanek ON slupki(id_przystanku);""")
                def field(row,*names):
                    d={norm(k):v for k,v in row.items()}
                    for n in names:
                        v=d.get(norm(n))
                        if v is not None:return str(v)
                    return None
                counts={}
                for sec in ('przystanki','slupki'):
                    count=0
                    with z.open(member) as f:
                        for row in ijson.items(f,lookup[sec]+'.item',use_float=True):
                            if not isinstance(row,dict):continue
                            raw=json.dumps(row,ensure_ascii=False,separators=(',',':'))
                            if sec=='przystanki':
                                id_=field(row,'id_przystanku')
                                if id_:db.execute('INSERT OR REPLACE INTO przystanki VALUES (?,?,?)',(id_,field(row,'nazwa_przystanku'),raw));count+=1
                            else:
                                id_=field(row,'id_slupka')
                                if id_:
                                    def coord(v):
                                        try:return float(v) if v is not None else None
                                        except (ValueError,TypeError):return None
                                    db.execute('INSERT OR REPLACE INTO slupki VALUES (?,?,?,?,?,?,?,?)',
                                        (id_,field(row,'id_przystanku'),field(row,'nazwa_slupka'),field(row,'numer_slupka'),
                                         field(row,'symbol_slupka'),coord(field(row,'GPS_s')),coord(field(row,'GPS_n')),raw))
                                    count+=1
                            if count%5000==0:db.commit()
                    counts[sec]=count;db.commit()
                if not counts['slupki'] or not counts['przystanki']:
                    raise RuntimeError('Pusty słownik; stara baza bez zmian')
                db.execute('INSERT INTO metadata VALUES (?,?)',('archive',name))
                db.execute('INSERT INTO metadata VALUES (?,?)',('updated_utc',dt.datetime.now(dt.timezone.utc).isoformat()))
                db.commit()
                if db.execute('PRAGMA quick_check').fetchone()[0]!='ok':raise RuntimeError('Niepoprawna baza słowników')
            finally:db.close()
            os.replace(tempdb,TARGET)
            print('OK słowniki:',counts,'->',TARGET,flush=True)

if __name__=='__main__':
    try:run()
    except Exception as exc:
        print('BŁĄD SŁOWNIKÓW:',exc,file=sys.stderr);sys.exit(1)
