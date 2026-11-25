// WTP LIVE — WERSJA: 55 — ETA segment patches

const VERSION=56;



const NEW_API_BASE='https://dane.um.warszawa.pl/api/action/';



const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};



const respond=(x,s=200)=>Response.json(x,{status:s,headers:{...CORS,'Cache-Control':'no-store'}});



const FRESH=600000, MAX_GAP=600000, DIRECTION_TTL=86400000, TTL=900;



const dtf=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});



function localAt(t){const p=Object.fromEntries(dtf.formatToParts(new Date(t)).filter(x=>x.type!=='literal').map(x=>[x.type,+x.value]));return `${p.year}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')} ${String(p.hour).padStart(2,'0')}:${String(p.minute).padStart(2,'0')}:${String(p.second).padStart(2,'0')}`;}



function parseTime(s,now){s=String(s??'').trim();if(/[zZ]$|[+-]\d\d:?\d\d$/.test(s))return Date.parse(s.replace(' ','T'));const m=s.match(/^(\d{4}-\d\d-\d\d) (\d\d:\d\d:\d\d)$/);if(!m)return NaN;const wall=Date.parse(`${m[1]}T${m[2]}Z`);const matches=[wall-3600000,wall-7200000].filter(t=>localAt(t)===s);return matches.length?matches.sort((a,b)=>Math.abs(a-now)-Math.abs(b-now))[0]:NaN;}



function unpack(d){for(let i=0;i<6;i++){if(Array.isArray(d))return d;if(typeof d==='string'){try{d=JSON.parse(d);continue}catch{return []}}if(d&&typeof d==='object'){d=d.result??d.records??d.data;continue}break}return []}



function parseUtc(s){const t=String(s??'').trim();return Date.parse(t.includes('T')?t:t.replace(' ','T')+'Z');}



function classifyTimes(rows,now){



 const samples=rows.map(v=>String(v.Time??'')).filter(x=>/^\d{4}-\d\d-\d\d /.test(x)).slice(0,300);



 const modes=['warsaw','utc'];const scores={};



 for(const mode of modes){const ages=samples.map(x=>now-(mode==='utc'?parseUtc(x):parseTime(x,now))).filter(Number.isFinite);



 scores[mode]={fresh:ages.filter(a=>a>=-30000&&a<=FRESH).length,near:ages.filter(a=>a>=-30000&&a<=900000).length,medianAgeSec:ages.length?Math.round(ages.sort((a,b)=>a-b)[Math.floor(ages.length/2)]/1000):null};}

// Preferuj interpretacje z wieksza liczba pomiarow w poblizu czasu serwera; diagnostyka pozostaje jawna.

 const mode=(scores.utc.near>scores.warsaw.near || (scores.utc.near===scores.warsaw.near && scores.utc.fresh>scores.warsaw.fresh))?'utc':'warsaw';



 return {mode,scores,samples:samples.slice(0,3)};



}



function position(v,now,mode){const lat=Number(v.Lat),lon=Number(v.Lon),stamp=/[zZ]$|[+-]\d\d:?\d\d$/.test(String(v.Time||''))?Date.parse(String(v.Time).replace(' ','T')):(mode==='utc'?parseUtc(v.Time):parseTime(v.Time,now));if(!(lat>51&&lat<53&&lon>19&&lon<23&&Number.isFinite(stamp)&&stamp<=now+90000&&now-stamp<=FRESH))return null;return {lat,lon,stamp};}

// Numer pojazdu jest stabilniejszy od brygady; format klucza pozostaje zgodny z v22.

function id(v,t){return `${t}:${v.VehicleNumber??''}:${v.Lines??''}:${v.Brigade??''}`;}



function stableId(v,t){return `${t}:${String(v.VehicleNumber??'').trim()}`;}



function validVehicle(v){return v&&String(v.VehicleNumber??'').trim()!==''&&String(v.Lines??'').trim()!=='';}



function distance(a,b){const r=(a.lat+b.lat)*Math.PI/360;return Math.hypot((a.lat-b.lat)*111195,(a.lon-b.lon)*111195*Math.cos(r));}



function angle(a,b){const r=Math.PI/180,y=Math.sin((b.lon-a.lon)*r)*Math.cos(b.lat*r),x=Math.cos(a.lat*r)*Math.sin(b.lat*r)-Math.sin(a.lat*r)*Math.cos(b.lat*r)*Math.cos((b.lon-a.lon)*r);return (Math.atan2(y,x)/r+360)%360;}



async function getGps(env,type){const d=await newPortalGps(env,type);return {raw:d,rows:d.result};}

// Osobne klucze KV dla autobusów i tramwajów: awaria jednego nie nadpisuje drugiego.// Historia obejmuje dwie ostatnie rozne pozycje oraz czas odbioru przez Worker.// Nie wyznaczamy kierunku z nieruchomego pojazdu ani z nieaktualnych pomiarow.

async function ingest(env,type,rows,source){



 if(!env.GPS_HISTORY)return;



 const now=Date.now(),slot=`gps:${type}`,previous=await env.GPS_HISTORY.get(slot,'json')||{};



 const positions={};let accepted=0,moved=0,unchanged=0,rejected=0,older=0,smallMove=0,largeMove=0,repeatStamp=0;



 const diagnostic=classifyTimes(rows,now);

// Nie gubimy poprzedniego punktu, kiedy biezacy pomiar jest identyczny.

 for(const [k,p] of Object.entries(previous.positions||{})){



   if(p&&Number.isFinite(p.stamp)&&now-p.stamp<MAX_GAP&&p.stamp<=now+90000)positions[k]=p;



 }

// Dla danego numeru pojazdu wybieramy najnowszy pomiar z odpowiedzi.

 const latest=new Map();



 for(const v of rows){



   if(!validVehicle(v)){rejected++;continue;}



   const p=position(v,now,diagnostic.mode);



   if(!p){rejected++;continue;}



   accepted++;



   const k=stableId(v,type),old=latest.get(k);



   if(!old||p.stamp>old.p.stamp)latest.set(k,{v,p});



 }



 for(const [k,{v,p}] of latest){



   const prev=positions[k];



   if(prev&&p.stamp<prev.stamp){older++;continue;}



   let direction=Number.isFinite(prev?.bearing)?prev.bearing:null;



   let computed=Number.isFinite(prev?.computed)?prev.computed:null;



   let anchor=prev?.anchor&&Number.isFinite(prev.anchor.stamp)?prev.anchor:null;



   if(prev){



     // Anchor to ostatni punkt istotnie rozny od obecnego; przy postoju go zachowujemy.



     const dist=distance(prev,p);



     if(dist<8){unchanged++;if(p.stamp===prev.stamp)repeatStamp++;}



     else if(dist>1800){largeMove++;anchor=null;}



     else if(p.stamp===prev.stamp){



       // Zmienione wspolrzedne z identycznym znacznikiem czasu: nie zgadujemy predkosci/kierunku.



       repeatStamp++;



     }else if(p.stamp>prev.stamp){



       const from=anchor&&anchor.stamp<prev.stamp&&p.stamp-anchor.stamp<=MAX_GAP?anchor:prev;



       const displacement=distance(from,p);



       if(displacement>=12&&displacement<=1800&&p.stamp-from.stamp<=MAX_GAP){



         direction=angle(from,p);computed=now;moved++;



         anchor={lat:from.lat,lon:from.lon,stamp:from.stamp};



       }else{smallMove++;}



     }



   }



   if(!Number.isFinite(direction)||!Number.isFinite(computed)||now-computed>DIRECTION_TTL){direction=null;computed=null;}



   positions[k]={...p,anchor,bearing:direction,computed,line:String(v.Lines),brigade:String(v.Brigade??''),vehicle:String(v.VehicleNumber),receivedAt:now};



 }



 const payload={updatedAt:now,source,received:rows.length,accepted,moved,unchanged,rejected,older,smallMove,largeMove,repeatStamp,unique:latest.size,diagnostic,positions};



 await env.GPS_HISTORY.put(slot,JSON.stringify(payload),{expirationTtl:TTL});



 console.log(`GPS ${type}: ${source}, rows=${rows.length}, accepted=${accepted}, unique=${latest.size}, moved=${moved}, unchanged=${unchanged}, repeatedTime=${repeatStamp}, rejected=${rejected}, mode=${diagnostic.mode}`);



}



async function cronType(env,type){try{const {rows}=await getGps(env,type);await ingest(env,type,rows,'cron');await env.GPS_HISTORY.put(`gps:error:${type}`,JSON.stringify({at:Date.now(),ok:true}),{expirationTtl:TTL});}catch(e){const message=String(e?.message??e);console.error(`GPS type ${type}: ${message}`);if(env.GPS_HISTORY)await env.GPS_HISTORY.put(`gps:error:${type}`,JSON.stringify({at:Date.now(),ok:false,error:message}),{expirationTtl:TTL});}}



async function headings(env){if(!env.GPS_HISTORY)return respond({error:'Brak bindingu GPS_HISTORY'},503);const now=Date.now();const [a,b,ea,eb]=await Promise.all([env.GPS_HISTORY.get('gps:1','json'),env.GPS_HISTORY.get('gps:2','json'),env.GPS_HISTORY.get('gps:error:1','json'),env.GPS_HISTORY.get('gps:error:2','json')]);const out={},types={};let vehicles=0;for(const [type,rec,err] of [['1',a,ea],['2',b,eb]]){let directions=0,active=0;for(const [k,p] of Object.entries(rec?.positions||{})){if(now-p.stamp>FRESH||p.stamp>now+90000)continue;active++;if(Number.isFinite(p.bearing)&&Number.isFinite(p.computed)){out[k]={bearing:p.bearing,computed:p.computed};if(p.vehicle&&p.line)out[`${type}:${p.vehicle}:${p.line}:${p.brigade??''}`]={bearing:p.bearing,computed:p.computed};directions++;}}vehicles+=active;types[type]={updatedAt:rec?.updatedAt??null,source:rec?.source??null,active,directions,received:rec?.received??null,accepted:rec?.accepted??null,moved:rec?.moved??null,unchanged:rec?.unchanged??null,repeatStamp:rec?.repeatStamp??null,older:rec?.older??null,smallMove:rec?.smallMove??null,largeMove:rec?.largeMove??null,unique:rec?.unique??null,rejected:rec?.rejected??null,diagnostic:rec?.diagnostic??null,lastAttempt:err??null};}return respond({version:VERSION,updatedAt:Math.max(a?.updatedAt||0,b?.updatedAt||0)||null,headings:out,types,vehicles});}



// Diagnostyka surowych odpowiedzi źródła GPS; brak zapisu w KV i brak przechowywania odpowiedzi.



// Nowy portal: endpoint musi byc podany jawnie przez administratora po sprawdzeniu dokumentacji.



// NEW_GPS_URL = adres HTTPS endpointu (opcjonalnie {type}), NEW_API_TOKEN = sekret JWT.



// Nie publikujemy JWT w repozytorium, URL ani diagnostyce.



const NEW_GPS_ENDPOINT='https://dane.um.warszawa.pl/api/action/get_ztm_lokalizacja_pojazdow';



function normalizeNewGps(row){



 const v=row||{};



 return {Lat:v.Lat??v.lat??v.latitude??v['Szer. geogr.']??v.szerokosc,



 Lon:v.Lon??v.lon??v.lng??v.longitude??v['Dł. geogr.']??v.dlugosc,



 Time:v.Time??v.time??v.timestamp??v['Czas']??v.gps_time,



 Lines:v.Lines??v.Linie??v.line??v.linia??v['Linia'],



 Brigade:v.Brigade??v.brigade??v.brygada??v['Brygada']??'',



 VehicleNumber:v.VehicleNumber??v.vehicleNumber??v.vehicle_id??v.numer_pojazdu??v['Numer pojazdu']??v['NumerPojazdu']};



}



function extractNewRows(raw){



 let d=raw;



 for(let i=0;i<8;i++){



  if(Array.isArray(d))return d;



  if(typeof d==='string'){try{d=JSON.parse(d);continue;}catch{return [];}}



  if(!d||typeof d!=='object')break;



  const next=d.result??d.data??d.records??d.items??d.pojazdy??d.vehicles??d.przystanki;



  if(next===undefined)break;



  d=next;



 }



 return [];



}



async function newPortalGps(env,type){



 if(!env.NEW_API_TOKEN)throw Error('Brak sekretu NEW_API_TOKEN');



 const response=await fetch(NEW_GPS_ENDPOINT,{



  method:'POST',headers:{'Authorization':String(env.NEW_API_TOKEN).trim(),'Content-Type':'application/json','Accept':'application/json','Cache-Control':'no-store'},



  body:JSON.stringify({type}),cf:{cacheTtl:0,cacheEverything:false}



 });



 if(!response.ok)throw Error('Nowe API: HTTP '+response.status);



 const raw=await response.json();



 const rows=extractNewRows(raw).map(normalizeNewGps);



 if(!rows.length)throw Error('Nowe API: brak listy pojazdów w odpowiedzi');



 const now=Date.now(),mode=classifyTimes(rows,now).mode;



 const normalized=rows.map(v=>{



  const stamp=mode==='utc'?parseUtc(v.Time):parseTime(v.Time,now);



  return {...v,TimeRaw:v.Time,Time:Number.isFinite(stamp)?new Date(stamp).toISOString():v.Time};



 });



 const fresh=normalized.filter(v=>{



  const t=Date.parse(v.Time),lat=Number(v.Lat),lon=Number(v.Lon);



  return Number.isFinite(t)&&now-t<=FRESH&&t<=now+90000&&lat>51&&lat<53&&lon>19&&lon<23&&String(v.Lines??'').trim();



 });



 if(!fresh.length){



  const times=normalized.map(v=>Date.parse(v.Time)).filter(Number.isFinite);



  const newest=times.length?new Date(Math.max(...times)).toISOString():null;



  throw Error('Nowe API: '+rows.length+' rekordów, brak świeżych GPS; ostatni='+newest);



 }



 return {result:fresh,meta:{version:VERSION,source:'dane.um.warszawa.pl',receivedAt:new Date(now).toISOString(),total:rows.length,rows:fresh.length,timeInterpretation:mode}};



}



async function newPortalDiagnostic(env){



 if(!env.NEW_API_TOKEN)return respond({version:VERSION,configured:false,required:['NEW_API_TOKEN'],message:'Dodaj NEW_API_TOKEN jako sekret Workera'});



 const checks=await Promise.all([1,2].map(async type=>{



  try{const data=await newPortalGps(env,type);return {type,ok:true,rows:data.result.length,total:data.meta.total,timeInterpretation:data.meta.timeInterpretation};}



  catch(e){return {type,ok:false,error:String(e.message)};}



 }));



 return respond({version:VERSION,configured:true,endpoint:NEW_GPS_ENDPOINT,method:'POST',checks});



}



// Wszystkie dane miejskie pochodzą wyłącznie z nowego API.



const ACTIONS={stops:'get_ztm_przystanki_komunikacji_miejskiej',lines:'get_ztm_lista_linii_na_przystanku',departures:'get_ztm_odjazdy_linii_z_przystanku'};



async function portalCall(env,action,body){



 if(!env.NEW_API_TOKEN)throw Error('Brak sekretu NEW_API_TOKEN');



 const response=await fetch(NEW_API_BASE+action,{method:'POST',headers:{Authorization:String(env.NEW_API_TOKEN).trim(),'Content-Type':'application/json',Accept:'application/json','Cache-Control':'no-store'},body:JSON.stringify(body),cf:{cacheTtl:0,cacheEverything:false}});



 if(!response.ok)throw Error('Nowe API '+action+': HTTP '+response.status);



 const raw=await response.json();



 if(raw?.error)throw Error('Nowe API '+action+': '+String(raw.error));



 if(typeof raw?.result==='string'&&!raw.result.trim().startsWith('[')&&!raw.result.trim().startsWith('{'))throw Error('Nowe API '+action+': '+raw.result.slice(0,150));



 return raw;



}



function pickField(o,...names){for(const n of names){const key=Object.keys(o||{}).find(k=>k.toLowerCase()===n.toLowerCase());if(key!==undefined&&o[key]!==null)return o[key];}return undefined;}



function flattenRow(row){



 if(Array.isArray(row)){if(row.every(x=>x&&typeof x==='object'&&('key'in x||'name'in x)))return Object.fromEntries(row.map(x=>[x.key??x.name,x.value??x.val??'']));return row;}



 if(!row||typeof row!=='object')return row;



 const vals=row.values??row.data;



 if(Array.isArray(vals)&&vals.every(x=>x&&typeof x==='object'&&('key'in x||'name'in x)))return {...row,...Object.fromEntries(vals.map(x=>[x.key??x.name,x.value??x.val??'']))};



 if(vals&&!Array.isArray(vals)&&typeof vals==='object')return {...row,...vals};



 return row;



}



function normalizedPortalRows(raw){return extractNewRows(raw).map(flattenRow);}



function stopsOutput(raw){return normalizedPortalRows(raw).map(r=>{



 if(!r||typeof r!=='object')return r;



 return {...r,zespol:pickField(r,'zespol','zespol_przystankowy','busstopId','stop_group','stop_id')??'',slupek:pickField(r,'slupek','nr_slupka','busstopNr','stop_number','stop_code')??'',nazwa_zespolu:pickField(r,'nazwa_zespolu','nazwa','nazwa_przystanku','stop_name','name')??'',szer_geo:pickField(r,'szer_geo','szerokosc','szerokosc_geograficzna','lat','latitude','stop_lat')??'',dlug_geo:pickField(r,'dlug_geo','dlugosc','dlugosc_geograficzna','lon','longitude','stop_lon')??''};



 });}



const gpsInflight=new Map();
const gpsLocalSnapshots=new Map();
async function refreshGpsSnapshot(env,type){
 if(gpsInflight.has(type))return gpsInflight.get(type);
 const task=(async()=>{
  const data=await newPortalGps(env,type);
  if(data.result.length)gpsLocalSnapshots.set(type,{at:Date.now(),data});
  if(env.GPS_HISTORY && data.result.length){try{await env.GPS_HISTORY.put(`live-snapshot:${type}`,JSON.stringify({at:Date.now(),data}),{expirationTtl:900})}catch(e){console.error('GPS snapshot:',String(e))}}
  return data;
 })();
 gpsInflight.set(type,task);
 try{return await task}finally{gpsInflight.delete(type)}
}
async function readGpsSnapshot(env,type){
 const local=gpsLocalSnapshots.get(type);
 if(local&&Date.now()-local.at<600000)return local;
 try{const x=await env.GPS_HISTORY?.get(`live-snapshot:${type}`,'json');if(x?.data?.result?.length && Date.now()-x.at<600000)return x}catch(e){}
 return null;
}
async function cityRoute(env,ctx,route,url){



 if(route==='live'){



  const type=Number(url.searchParams.get('type'));



  if(type!==1&&type!==2)return respond({error:'Nieprawidłowy typ'},400);



  const cached=await readGpsSnapshot(env,type);
  const update=async()=>{const data=await refreshGpsSnapshot(env,type);await Promise.allSettled([ingest(env,type,data.result,'new-api'),sendGpsHistory(env,type,data.result)]);return data};
  if(cached){if(Date.now()-cached.at>2000)ctx.waitUntil(update().catch(e=>console.error('GPS refresh:',String(e))));return respond(cached.data)}
  const data=await refreshGpsSnapshot(env,type);



  ctx.waitUntil(Promise.allSettled([ingest(env,type,data.result,'new-api'),sendGpsHistory(env,type,data.result)]));



  return respond(data);



 }



 const body={};



 if(route==='lines'||route==='departures'){



  for(const key of ['busstopId','busstopNr']){



   const v=url.searchParams.get(key);



   if(!v||!/^[a-zA-Z0-9-]{1,20}$/.test(v))return respond({error:'Nieprawidłowy '+key},400);



   body[key]=v;



  }



 }



 if(route==='departures'){



  const line=url.searchParams.get('line');



  if(!line||!/^[a-zA-Z0-9-]{1,12}$/.test(line))return respond({error:'Nieprawidłowa linia'},400);



  body.line=line;



 }



 const raw=await portalCall(env,ACTIONS[route],body);



 const rows=route==='stops'?stopsOutput(raw):normalizedPortalRows(raw);



 return respond({result:rows,meta:{version:VERSION,source:'dane.um.warszawa.pl',action:ACTIONS[route],rows:rows.length}});



}



// ETA bridge: proxy serwer-serwer. Token nigdy nie jest zwracany przegladarce.



// Cloudflare Secrets: ETA_BRIDGE_TOKEN; zmienna ETA_BRIDGE_URL (HTTPS zalecane).



// Bez publicznego HTTPS lacze HTTP ujawnia token w transmisji - tylko etap testowy.



const ETA_ALLOWED = new Set(['health','lines','courses','match','vehicle-match','vehicle-state','route-overrides','route-segment-patches']);



async function etaProxy(env,url){



 const parts=url.pathname.split('/').filter(Boolean);



 if(parts[0]!=='eta' || !((parts.length===2 && ETA_ALLOWED.has(parts[1])) || (parts.length===4 && parts[1]==='courses' && /^\d{1,20}$/.test(parts[2]) && (parts[3]==='stops' || parts[3]==='geometry'))))



   return respond({error:'Nieznana sciezka ETA'},404);



 if(!env.ETA_BRIDGE_URL || !env.ETA_BRIDGE_TOKEN)



   return respond({error:'Brak konfiguracji ETA_BRIDGE_URL lub ETA_BRIDGE_TOKEN',version:VERSION},503);



 let base;



 try{base=new URL(String(env.ETA_BRIDGE_URL));}



 catch{return respond({error:'Nieprawidlowy ETA_BRIDGE_URL'},503);}



 if(!['https:','http:'].includes(base.protocol) || base.username || base.password || base.search || base.hash)



   return respond({error:'Nieprawidlowy adres mostu ETA'},503);



 // URL powinien wskazywac sam host z portem, np. https://eta.example.com



 if(base.pathname!=='/' && base.pathname!=='')return respond({error:'ETA_BRIDGE_URL musi wskazywac katalog glowny'},503);



 const target=new URL('/eta/'+parts.slice(1).join('/'),base);



 for(const [key,value] of url.searchParams){



   if(!/^[a-zA-Z_][a-zA-Z0-9_]{0,31}$/.test(key) || value.length>120)



     return respond({error:'Nieprawidlowy parametr ETA'},400);



   target.searchParams.append(key,value);



 }



 try{



   const res=await fetch(target.toString(),{



     method:'GET',headers:{'x-bridge-token':String(env.ETA_BRIDGE_TOKEN).trim(),Accept:'application/json'},



     redirect:'manual',signal:AbortSignal.timeout(url.searchParams.get('bundle')==='prepared'?60000:12000),cf:{cacheTtl:0,cacheEverything:false}



   });



   if(res.status>=300 && res.status<400)return respond({error:'Most ETA zwrocil przekierowanie'},502);



   const ct=res.headers.get('content-type')||'';



   if(!ct.toLowerCase().includes('json'))return respond({error:'Most ETA nie zwrocil JSON',status:res.status},502);



   if(url.searchParams.get('bundle')==='prepared')return new Response(res.body,{status:res.status,headers:{...CORS,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
 const body=await res.text();



   if(url.searchParams.get('bundle')!=='prepared' && body.length>3000000)return respond({error:'Odpowiedz ETA zbyt duza'},502);



   return new Response(body,{status:res.status,headers:{...CORS,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});



 }catch(e){



   console.error('ETA proxy:',String(e?.message||e));



   return respond({error:'Most ETA niedostepny',version:VERSION},502);



 }



}







// v45: utrwala kolejne pomiary na Mikrusie, niezaleznie od otwartej przegladarki.



// Token i URL sa juz ustawione dla mostu ETA; nie ujawniamy ich klientowi.



async function sendGpsHistory(env,type,rows){



 if(!env.ETA_BRIDGE_URL||!env.ETA_BRIDGE_TOKEN)return;



 const now=Date.now(),mode=classifyTimes(rows,now).mode;



 const latest=new Map();



 for(const v of rows){



  if(!validVehicle(v))continue;



  const p=position(v,now,mode);



  if(!p)continue;



  const key=stableId(v,type),old=latest.get(key);



  if(!old||p.stamp>old.stamp)latest.set(key,{type,vehicle:String(v.VehicleNumber),line:String(v.Lines),brigade:String(v.Brigade??''),lat:p.lat,lon:p.lon,stamp:p.stamp});



 }



 if(!latest.size)return;



 const endpoint=new URL('/gps/ingest',env.ETA_BRIDGE_URL);



 const r=await fetch(endpoint.toString(),{method:'POST',headers:{'x-bridge-token':String(env.ETA_BRIDGE_TOKEN).trim(),'Content-Type':'application/json'},body:JSON.stringify({positions:[...latest.values()]}),signal:AbortSignal.timeout(15000),cf:{cacheTtl:0,cacheEverything:false}});



 if(!r.ok)throw Error('GPS history ingest HTTP '+r.status);



}



async function gpsHistoryProxy(env,url){



 if(!env.ETA_BRIDGE_URL||!env.ETA_BRIDGE_TOKEN)return respond({error:'Brak konfiguracji mostu'},503);



 const type=Number(url.searchParams.get('type')),vehicle=String(url.searchParams.get('vehicle')||'').trim();



 if(![1,2].includes(type)||!/^[a-zA-Z0-9_-]{1,32}$/.test(vehicle))return respond({error:'Nieprawidlowy type/vehicle'},400);



 const endpoint=new URL('/gps/history',env.ETA_BRIDGE_URL);



 endpoint.searchParams.set('type',String(type));endpoint.searchParams.set('vehicle',vehicle);



 try{



  const r=await fetch(endpoint.toString(),{headers:{'x-bridge-token':String(env.ETA_BRIDGE_TOKEN).trim(),Accept:'application/json'},signal:AbortSignal.timeout(12000),cf:{cacheTtl:0,cacheEverything:false}});



  const body=await r.text();



  if(body.length>400000)return respond({error:'Historia zbyt duza'},502);



  return new Response(body,{status:r.status,headers:{...CORS,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});



 }catch(e){return respond({error:'Historia GPS niedostepna'},502)}



}







export default {



 async scheduled(_event,env,ctx){



  if(!env.NEW_API_TOKEN)return;



  ctx.waitUntil(Promise.allSettled([1,2].map(async type=>{



   try{const data=await refreshGpsSnapshot(env,type);await Promise.allSettled([ingest(env,type,data.result,'cron-new-api'),sendGpsHistory(env,type,data.result)]);}



   catch(e){console.error('Cron GPS '+type+': '+String(e?.message??e));}



  })));



 },



 async fetch(request,env,ctx){



  if(request.method==='OPTIONS')return new Response(null,{headers:CORS});



  if(request.method!=='GET')return respond({error:'Tylko GET dla klienta mapy'},405);



  const url=new URL(request.url),route=url.pathname.replace(/\/$/,'').split('/').pop();



  if(url.pathname.startsWith('/eta/'))return etaProxy(env,url);



  if(route==='headings')return headings(env);



   if(route==='gps-history')return gpsHistoryProxy(env,url);



  if(route==='new-api-test'||route==='gps-diagnostics')return newPortalDiagnostic(env);



  if(route==='route'){



   const type=Number(url.searchParams.get('type'));



   const vehicle=String(url.searchParams.get('vehicle')||'').trim();



   if(![1,2].includes(type)||!/^[a-zA-Z0-9_-]{1,32}$/.test(vehicle))return respond({error:'Podaj type=1|2 i vehicle=numer'},400);



   if(!env.ETA_BRIDGE_URL||!env.ETA_BRIDGE_TOKEN)return respond({error:'Brak konfiguracji mostu ETA'},503);



   try{



     const gps=await newPortalGps(env,type);



     const found=gps.result.filter(v=>String(v.VehicleNumber).trim()===vehicle).sort((a,b)=>Date.parse(b.Time)-Date.parse(a.Time))[0];



     if(!found)return respond({status:'gps_unavailable',vehicle,type},404);



     const q=new URLSearchParams({line:String(found.Lines),brigade:String(found.Brigade||''),lat:String(found.Lat),lon:String(found.Lon),at:String(found.Time)});



     const endpoint=new URL('/eta/vehicle-match?'+q,env.ETA_BRIDGE_URL);



     const r=await fetch(endpoint.toString(),{headers:{'x-bridge-token':String(env.ETA_BRIDGE_TOKEN).trim(),Accept:'application/json'},signal:AbortSignal.timeout(15000),cf:{cacheTtl:0,cacheEverything:false}});



     const result=await r.json();



     return respond({version:VERSION,vehicle,type,gps:{lat:found.Lat,lon:found.Lon,time:found.Time,line:found.Lines,brigade:found.Brigade},eta:result},r.status);



   }catch(e){console.error('route:',String(e));return respond({error:'Nie udało się połączyć GPS z ETA',details:String(e.message||e)},502);}



  }



  if(!['live','stops','lines','departures'].includes(route))return respond({error:'Nieznana ścieżka API',routes:['/live?type=1','/live?type=2','/stops','/lines','/departures','/new-api-test']},404);



  if(!env.NEW_API_TOKEN)return respond({error:'Brak sekretu NEW_API_TOKEN'},503);



  try{return await cityRoute(env,ctx,route,url);}



  catch(e){console.error('Nowe API '+route+': '+String(e?.message??e));return respond({error:'Błąd nowego API',details:String(e?.message??e),version:VERSION},502);}



 }



};
