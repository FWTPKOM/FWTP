#!/usr/bin/env python3
"""Download Warsaw GPS from GitHub Actions. Requires secret WTP_API_KEY.
Writes only fresh, normalized positions; no fake live positions.
"""
import os,json,datetime,urllib.request,urllib.parse,pathlib,sys,time
API='https://api.um.warszawa.pl/api/action/busestrams_get/'
RESOURCE='f2e5503e-927d-4ad3-9500-4ab9e55deb59'
ROOT=pathlib.Path(__file__).resolve().parent/'gps'
NOW=datetime.datetime.now(datetime.timezone.utc)
TZ=datetime.timezone(datetime.timedelta(hours=2)) # UTC is preferred for Warsaw API; auto-detect below

def parse(s,mode):
 s=str(s or '').strip().replace(' ','T')
 try:
  if s.endswith('Z') or '+' in s[10:] or '-' in s[10:]: return datetime.datetime.fromisoformat(s.replace('Z','+00:00')).astimezone(datetime.timezone.utc)
  d=datetime.datetime.fromisoformat(s)
  if mode=='utc': return d.replace(tzinfo=datetime.timezone.utc)
  from zoneinfo import ZoneInfo
  return d.replace(tzinfo=ZoneInfo('Europe/Warsaw')).astimezone(datetime.timezone.utc)
 except Exception:return None

def rows_of(obj):
 for _ in range(5):
  if isinstance(obj,list):return obj
  if isinstance(obj,str):obj=json.loads(obj)
  elif isinstance(obj,dict):obj=obj.get('result',obj.get('data',obj.get('records')))
  else:break
 return []

def norm(v):
 def get(*names):
  for k in names:
   if k in v and v[k] is not None:return v[k]
  return ''
 try:return dict(Lines=str(get('Lines','Linie')),Lat=float(get('Lat','Szer. geogr.')),Lon=float(get('Lon','Dł. geogr.')),VehicleNumber=str(get('VehicleNumber','Numer pojazdu')),Brigade=str(get('Brigade','Brygada')),Time=str(get('Time','Czas')))
 except (ValueError,TypeError):return None

def main():
 key=os.environ.get('WTP_API_KEY')
 if not key:raise RuntimeError('Ustaw GitHub Actions secret WTP_API_KEY')
 ROOT.mkdir(exist_ok=True)
 success=0
 for typ in (1,2):
  params=urllib.parse.urlencode({'resource_id':RESOURCE,'apikey':key,'type':typ,'_':int(time.time())})
  req=urllib.request.Request(API+'?'+params,headers={'Accept':'application/json','Cache-Control':'no-cache','User-Agent':'WTP-LIVE-GitHub/1.0'})
  try:
   with urllib.request.urlopen(req,timeout=30) as r:data=json.load(r)
   raw=[norm(v) for v in rows_of(data) if isinstance(v,dict)]
   raw=[v for v in raw if v and 51<v['Lat']<53 and 19<v['Lon']<23]
   if not raw:raise RuntimeError('Brak prawidłowych rekordów')
   scores={mode:sum(1 for v in raw[:400] if (t:=parse(v['Time'],mode)) and -90<=(NOW-t).total_seconds()<=600) for mode in ('utc','warsaw')}
   mode=max(scores,key=scores.get)
   fresh=[]
   for v in raw:
    t=parse(v['Time'],mode)
    if t and -90<=(NOW-t).total_seconds()<=600:
     v['Time']=t.isoformat(timespec='seconds').replace('+00:00','Z');fresh.append(v)
   if not fresh:raise RuntimeError(f'Brak świeżych GPS (rekordy={len(raw)}, tryb={mode})')
   payload={'version':36,'updatedAt':NOW.isoformat().replace('+00:00','Z'),'source':'github-actions-api-um-warszawa','timeMode':mode,'result':fresh}
   (ROOT/f'{typ}.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
   print(f'Typ {typ}: zapisano {len(fresh)} świeżych pozycji, interpretacja czasu: {mode}')
   success+=1
  except Exception as e:print(f'Typ {typ}: błąd: {e}',file=sys.stderr)
 if not success:sys.exit('Nie udało się pobrać świeżego GPS żadnego typu')

if __name__=='__main__':main()
