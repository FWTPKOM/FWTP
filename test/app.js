// WTP LIVE — WERSJA: 58
// WTP LIVE v60 – walidacja świeżości GPS, aktualności GTFS i bezpieczne dopasowanie kursu.
const $=id=>document.getElementById(id);
const PROXY=String(window.WTP_API_PROXY||'').replace(/\/$/,'');
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let map,layer,vehicles=[],stops=[];
let stopPaneRequest=0, hoveredStopLine="", pinnedStopLine="", pinnedStopVehicle=null;
let focusedVehicle=null; const ROUTE_API='/route';
function unpack(payload){
  // API Warszawy może zwrócić result jako tablicę, obiekt albo tekst JSON.
  let data=payload;
  for(let i=0;i<5;i++){
    if(Array.isArray(data))return data;
    if(typeof data==='string'){
      try{data=JSON.parse(data);continue}catch{throw Error('API zwróciło tekst zamiast listy: '+data.slice(0,140))}
    }
    if(data && typeof data==='object'){
      if(data.error)throw Error(String(data.error));
      if(data.result!==undefined){data=data.result;continue}
      if(data.records!==undefined){data=data.records;continue}
      if(data.data!==undefined){data=data.data;continue}
    }
    break;
  }
  throw Error('Nieznany format odpowiedzi API (brak listy pojazdów).');
}
async function request(path,params={}){if(!PROXY)throw Error('Nie skonfigurowano adresu Cloudflare Workera w config.js.');const url=new URL(PROXY+path);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);let response;try{response=await fetch(url,{cache:'no-store',signal:controller.signal})}finally{clearTimeout(timeout)};if(!response.ok)throw Error('Serwer API: HTTP '+response.status);const data=await response.json();if(data.error)throw Error(typeof data.error==='string'?data.error:'Błąd API');return data;}
function value(row,key){
  if(!row)return '';
  const target=key.toLowerCase();
  function fromObject(o){
    if(!o||typeof o!=='object')return undefined;
    const k=Object.keys(o).find(x=>x.toLowerCase()===target);
    return k===undefined?undefined:o[k];
  }
  let found=fromObject(row);
  if(found!==undefined)return found;
  let cells=Array.isArray(row)?row:Array.isArray(row.values)?row.values:Array.isArray(row.data)?row.data:[];
  const cell=cells.find(x=>String(x?.key??x?.name??'').toLowerCase()===target);
  return cell?.value??cell?.val??'';
}
function normalizedRows(payload){
  const rows=unpack(payload);
  // Warszawa zwraca czasem obiekty z values, czasem rekordy key/value.
  return rows.map(row=>{
    if(Array.isArray(row))return {values:row};
    if(row?.values && !Array.isArray(row.values) && typeof row.values==='object')return {...row,...row.values};
    return row;
  });
}
function normalizeVehicle(v){
 const pick=(...names)=>{for(const name of names){const x=value(v,name);if(x!==undefined&&x!==null&&String(x).trim()!=='')return x}return ''};
 return {...v,Lines:String(pick('Lines','Linie','line','linia')).trim(),Lat:Number(pick('Lat','Szer. geogr.','latitude','lat')),Lon:Number(pick('Lon','Dł. geogr.','longitude','lon')),Time:String(pick('Time','Czas','time')).trim(),VehicleNumber:String(pick('VehicleNumber','Numer pojazdu','vehicleNumber')).trim(),Brigade:String(pick('Brigade','Brygada','brigade')).trim(),_bearing:v._bearing!==null&&v._bearing!==undefined&&Number.isFinite(Number(v._bearing))?Number(v._bearing):null};
}
function validTime(t){return /^\d{1,2}:\d{2}(?::\d{2})?$/.test(String(t??'').trim())}
// WTP LIVE v45 — przystanki: metadane wszystkich tras GTFS, nie tylko pojazdów w kadrze.
let stopLayer,showStopMarkers=true,stopMapLoading=false;
const STOP_DOT_ZOOM=13,STOP_ARROW_ZOOM=16;
let stopMeta=[],stopMetaLoading=false,stopMetaReady=false;
function stopCoordinates(row){
 const lat=Number(value(row,'szer_geo')||value(row,'lat')||value(row,'latitude'));
 const lon=Number(value(row,'dlug_geo')||value(row,'lon')||value(row,'longitude'));
 return Number.isFinite(lat)&&Number.isFinite(lon)&&lat>51&&lat<53&&lon>19&&lon<23?[lat,lon]:null;
}
function stopDirectionSvg(deg,color){return `<svg width="19" height="19" viewBox="0 0 24 24" style="transform:rotate(${Math.round(deg)}deg)" aria-hidden="true"><path d="M12 2 L21 21 L12 17 L3 21 Z" fill="${color}" stroke="white" stroke-width="1.3"/></svg>`}
async function loadStopMeta(){
 if(stopMetaLoading||stopMetaReady)return;
 stopMetaLoading=true;
 try{
  const r=await fetch('gtfs/stops_meta.json',{cache:'no-cache'});
  if(!r.ok)throw Error('Brak gtfs/stops_meta.json (HTTP '+r.status+')');
  const json=await r.json();if(!Array.isArray(json.stops))throw Error('Nieprawidłowy format metadanych');
  stopMeta=json.stops;stopMetaReady=true;
 }catch(e){console.warn('Metadane kierunków przystanków:',e.message)}
 finally{stopMetaLoading=false;renderStopMarkers()}
}
function stopMetaAt(lat,lon){
 let closest=null,d=Infinity;
 for(const m of stopMeta){
  if(Math.abs(m[0]-lat)>.00023||Math.abs(m[1]-lon)>.00035)continue;
  const metres=Math.hypot((m[0]-lat)*111195,(m[1]-lon)*111195*Math.cos(lat*Math.PI/180));
  if(metres<d){d=metres;closest=m}
 }
 return d<=22?closest:null;
}
async function toggleStopMap(){
 showStopMarkers=$('showStops')?.checked??true;
 if(!showStopMarkers){stopLayer?.clearLayers();return}
 if(!stops.length&&!stopMapLoading){
  stopMapLoading=true;$('stopStatus').textContent='Pobieranie przystanków…';
  try{stops=normalizedRows(await request('/stops'))}catch(e){$('stopStatus').textContent='Błąd przystanków: '+e.message}
  finally{stopMapLoading=false}
 }
 if(!stopMetaReady)void loadStopMeta();
 renderStopMarkers();
}
// Rozpoznaj NŻ wyłącznie z jawnego oznaczenia w API lub GTFS.
function isRequestStop(row,meta){
 const flagNames=['na_zadanie','na_żądanie','nz','n_z','request_stop','stop_on_request','on_request','is_request_stop','czy_na_zadanie','typ_przystanku','rodzaj_przystanku','charakter_przystanku','stop_type','stop_kind','stop_category','request','is_on_demand','on_demand','nazwa_typu','status_przystanku'];
 for(const key of flagNames){
  const raw=value(row,key);if(raw===undefined||raw===null||String(raw).trim()==='')continue;
  const s=String(raw).trim().toLowerCase();
  if(['true','tak','yes','nż','nz','na żądanie','na zadanie','request','1','n/z','na życzenie'].includes(s)||/na\s+żądanie|na\s+zadanie/i.test(s))return true;
  if(['false','nie','no','stały','staly','fixed','0'].includes(s))return false;
 }
 if(meta&&meta.length>4&&meta[4]!==null){return meta[4]===1||meta[4]===true;}
 const name=String(value(row,'nazwa_zespolu')||'');
 return /(?:\(|\[|\s)(?:NŻ|NZ|na żądanie)(?:\)|\]|$)/i.test(name);
}
function renderStopMarkers(){
 if(!stopLayer)return;
 stopLayer.clearLayers();if(!showStopMarkers)return;
 const zoom=map.getZoom();
 if(zoom<STOP_DOT_ZOOM){$('stopStatus').textContent='Przystanki ukryte — przybliż mapę.';return}
 if(!stops.length){if(!stopMapLoading)void toggleStopMap();return}
 const bounds=map.getBounds();let shown=0,withDirection=0;
 for(const row of stops){
  const coords=stopCoordinates(row);if(!coords||!bounds.contains(coords))continue;
  const z=String(value(row,'zespol')),n=String(value(row,'slupek')),name=String(value(row,'nazwa_zespolu'));
  if(!z||!n)continue;
  const meta=stopMetaAt(coords[0],coords[1]);
  const bus=meta&&Number.isFinite(meta[2]),tram=meta&&Number.isFinite(meta[3]);
  const color=bus&&tram?'#ed8b00':tram?'#e00000':bus?'#820082':'#64748b';
  const bearing=zoom>=STOP_ARROW_ZOOM?(bus&&tram?(meta[2]??meta[3]):tram?meta[3]:bus?meta[2]:null):null;
  const requestStop=isRequestStop(row,meta);
  const fill=requestStop?'#fff':color;
  const arrowColor=requestStop?color:'#fff';
  let marker;
  if(Number.isFinite(bearing)){
   marker=L.marker(coords,{pane:'stopsPane',icon:L.divIcon({className:'wtp-stop-icon',html:`<span class="wtp-stop-arrow" style="border-color:${color};background:${fill}">${stopDirectionSvg(bearing,arrowColor)}</span>`,iconSize:[25,25],iconAnchor:[12.5,12.5]})});withDirection++;
  }else marker=L.circleMarker(coords,{pane:'stopsPane',radius:zoom>=STOP_ARROW_ZOOM?6:4.5,color,weight:2,fillColor:fill,fillOpacity:1});
  const mode=bus&&tram?'Autobusowo-tramwajowy':tram?'Tramwajowy':bus?'Autobusowy':'Rodzaj nieustalony';
  marker.bindTooltip(escapeHTML(name)+' '+escapeHTML(n),{direction:'top',className:'wtp-stop-tooltip '+(bus&&tram?'wtp-stop-tip-mixed':tram?'wtp-stop-tip-tram':bus?'wtp-stop-tip-bus':'wtp-stop-tip-unknown')});
  marker.on('click',()=>openStopPanel(z,n,name,color));
  marker.addTo(stopLayer);shown++;if(shown>=650)break;
 }
 $('stopStatus').textContent=`Przystanki: ${shown}; strzałki: ${withDirection}. Fioletowy: autobus · czerwony: tramwaj · pomarańczowy: oba.`+(stopMetaReady?'':' Trwa wczytywanie danych GTFS.');
}
// WTP LIVE v42: historia pomiarów GPS; nie myli czasu GPS z czasem pobrania.
const lastLocations=new Map();
const HISTORY_KEY='wtp-live-v45-gps';
try { const saved=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]'); for(const [k,v] of saved){if(Date.now()-v.seen<30*60*1000)lastLocations.set(k,v)} }catch{}
function gpsMs(raw){const s=String(raw||'').trim().replace(' ','T');return Date.parse(s+(/(?:Z|[+-]\d\d:?\d\d)$/.test(s)?'':'Z'))}
function direction(lat1,lon1,lat2,lon2){const r=Math.PI/180,y=Math.sin((lon2-lon1)*r)*Math.cos(lat2*r),x=Math.cos(lat1*r)*Math.sin(lat2*r)-Math.sin(lat1*r)*Math.cos(lat2*r)*Math.cos((lon2-lon1)*r);return(Math.atan2(y,x)*180/Math.PI+360)%360}
function vehicleKey(v){return String(v.kind)+':'+String(v.VehicleNumber??'')}
let historySave=0;
function updateHeadings(rows){
 const now=Date.now();
 for(const v of rows){
  const key=vehicleKey(v),lat=Number(v.Lat),lon=Number(v.Lon),stamp=gpsMs(v.Time);
  if(Number.isFinite(v._bearing)){lastLocations.set(key,{lat,lon,stamp,seen:now,bearing:v._bearing});continue;}
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||!Number.isFinite(stamp))continue;
  const prev=lastLocations.get(key);
  if(prev && Number.isFinite(prev.bearing) && now-prev.seen<3*60*1000 && stamp-prev.stamp<3*60*1000)v._bearing=prev.bearing;
  // Stare lub przyszłe GPS nie jest dowodem aktualnego kierunku.
  if(stamp<now-15*60*1000 || stamp>now+5*60*1000)continue;
  if(!prev){lastLocations.set(key,{lat,lon,stamp,seen:now,bearing:null});continue}
  if(stamp<=prev.stamp)continue;
  const meters=Math.hypot((lat-prev.lat)*111000,(lon-prev.lon)*68000);
  if(meters>=10 && meters<1800 && stamp-prev.stamp<=15*60*1000){
    v._bearing=direction(prev.lat,prev.lon,lat,lon);
    lastLocations.set(key,{lat,lon,stamp,seen:now,bearing:v._bearing});
  }else if(meters>=1800 || stamp-prev.stamp>15*60*1000){
    lastLocations.set(key,{lat,lon,stamp,seen:now,bearing:null});
    delete v._bearing;
  }else{prev.seen=now}
 }
 for(const [key,p] of lastLocations)if(now-p.seen>30*60*1000)lastLocations.delete(key);
 if(now-historySave>10000){historySave=now;try{localStorage.setItem(HISTORY_KEY,JSON.stringify([...lastLocations]))}catch{}}
}
function draw(){
  if(!layer)return;
  layer.clearLayers();let count=0;
  const filter=$('line').value.trim().toUpperCase();
  const zoom=map.getZoom(), bounds=map.getBounds();
  for(const v of vehicles){
    if((v.kind===1&&!$('bus').checked)||(v.kind===2&&!$('tram').checked))continue;
    const line=String(v.Lines||v.lines||'').toUpperCase();
    if(filter&&line!==filter)continue;
    const lat=Number(v.Lat??v.lat),lon=Number(v.Lon??v.lon);
    if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<51||lat>53||lon<19||lon>23)continue;
    if(!bounds.contains([lat,lon]))continue;
    const brigade=String(v.Brigade??'?'),number=String(v.VehicleNumber??'?');
    // Zwarta, jednorzędowa etykieta jak na wzorze: kierunek, typ, linia/brygada/numer.
    // Kierunek GPS jest znany dopiero po wykryciu ruchu pomiędzy kolejnymi odczytami.
    const arrow=(Math.abs(Date.now()-gpsMs(v.Time))<=15*60*1000 && Number.isFinite(v._bearing))
      ? `<span class="badge-direction" title="Kierunek ruchu wyliczony z GPS"><svg viewBox="0 0 24 24" style="transform:rotate(${v._bearing}deg)" aria-hidden="true"><path d="M12 3 5 15l7-3 7 3z" fill="currentColor"/><path d="M12 11v10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></span>`
      : `<span class="badge-direction unknown" title="Kierunek oczekuje na drugi aktualny odczyt GPS">?</span>`;
    const vehicleSymbol=`<svg class="badge-vehicle" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="16" rx="3" fill="currentColor"/><rect x="7.5" y="5" width="9" height="6" rx=".8" fill="#fff"/><circle cx="8.5" cy="19" r="1.8" fill="currentColor"/><circle cx="15.5" cy="19" r="1.8" fill="currentColor"/></svg>`;
    const content=zoom<11?'<span class="vehicle-dot"></span>':zoom<14?`<span class="vehicle-mini">${escapeHTML(line)}</span>`:`<div class="vehicle-badge">${arrow}${vehicleSymbol}<span class="badge-line">${escapeHTML(line)}</span><span class="badge-divider">/</span><span class="badge-brigade">${escapeHTML(brigade)}</span><span class="badge-divider">/</span><span class="badge-number">${escapeHTML(number)}</span></div>`;
    const icon=L.divIcon({className:'vehicle-icon'+(v.kind===2?' tram':'')+(zoom<11?' dot-mode':zoom<14?' mini-mode':''),html:content,iconSize:[1,1],iconAnchor:[0,0]});
    const marker=L.marker([lat,lon],{icon,pane:'vehiclesPane',zIndexOffset:1000});
    if(hoveredStopLine||pinnedStopLine)marker.getElement()?.classList.toggle('wtp-line-highlight',line===(hoveredStopLine||pinnedStopLine));
    const gps=String(v.Time??'');
    marker.on('click',()=>{selectedLine=line;selectedBrigade=brigade;focusedVehicle={...v};openVehiclePanel(v);});
    marker.addTo(layer);
    if(hoveredStopLine||pinnedStopLine){const active=hoveredStopLine||pinnedStopLine;const el=marker.getElement();if(el)el.classList.toggle('wtp-line-highlight',line===active);if(el)el.classList.toggle('wtp-line-dimmed',line!==active)}
    count++;
  }
  $('count').textContent='Widoczne pojazdy: '+count+' / '+vehicles.length;
}
let selectedLine='',selectedBrigade='';
let busy=false;
const received={1:[],2:[]};
const sourceInfo={1:{total:0,fresh:0,newest:0},2:{total:0,fresh:0,newest:0}};
const fetchedAt={1:0,2:0};
const SNAPSHOT_KEY='wtp-live-v36-last-good';
try {const saved=JSON.parse(sessionStorage.getItem(SNAPSHOT_KEY)||'{}');for(const type of [1,2])if(Date.now()-saved[type]?.at<3*60*1000){received[type]=(saved[type].rows||[]).map(normalizeVehicle).filter(v=>Number.isFinite(gpsMs(v.Time))&&Date.now()-gpsMs(v.Time)<15*60000);fetchedAt[type]=saved[type].at}}catch{}
function publishVehicles(){vehicles=[...received[1].map(v=>({...v,kind:1})),...received[2].map(v=>({...v,kind:2}))];draw()}
function gpsAgeDescription(){
 const now=Date.now(),times=vehicles.map(v=>gpsMs(v.Time)).filter(Number.isFinite);
 if(!times.length)return 'Brak znacznika czasu GPS';
 const newest=Math.max(...times),mins=Math.round((now-newest)/60000);
 if(mins>15)return 'UWAGA: dane GPS sprzed około '+mins+' min — nie są aktualne';
 if(mins< -5)return 'UWAGA: czas GPS wyprzedza zegar o '+(-mins)+' min';
 return 'Najnowszy GPS: '+Math.max(0,mins)+' min temu';
}
async function refresh(){
 if(busy)return;busy=true;
 const status=$('status');status.classList.remove('error');
 if(!vehicles.length)status.textContent='Pobieranie pojazdów…';
 const errors=[];let ok=0;
 const fetchType=async type=>{
  try{
   const data=unpack(await request('/live',{type}));
   const all=data.map(normalizeVehicle).filter(v=>Number.isFinite(v.Lat)&&Number.isFinite(v.Lon));
    const rows=all.filter(v=>{const ms=gpsMs(v.Time);return Number.isFinite(ms)&&Date.now()-ms<=15*60000&&ms-Date.now()<=5*60000});
    sourceInfo[type]={total:all.length,fresh:rows.length,newest:all.reduce((a,v)=>Math.max(a,gpsMs(v.Time)||0),0)};
   updateHeadings(rows.map(v=>Object.assign(v,{kind:type})));
   received[type]=rows;fetchedAt[type]=Date.now();ok++;
   try{sessionStorage.setItem(SNAPSHOT_KEY,JSON.stringify({1:{rows:received[1],at:fetchedAt[1]},2:{rows:received[2],at:fetchedAt[2]}}))}catch{}
   publishVehicles();
   status.textContent='Pobrano '+new Date().toLocaleTimeString('pl-PL')+' · '+gpsAgeDescription();
  }catch(e){errors.push((type===1?'Autobusy':'Tramwaje')+': '+e.message)}
 };
 try{
  await Promise.allSettled([fetchType(1),fetchType(2)]);
  status.textContent=(ok?'Odczyt '+new Date().toLocaleTimeString('pl-PL'):'Nie udało się odświeżyć')+' · '+gpsAgeDescription()+' · GPS: '+[1,2].map(t=>(t===1?'A':'T')+' '+sourceInfo[t].fresh+'/'+sourceInfo[t].total+(sourceInfo[t].newest?' (ostatni '+new Date(sourceInfo[t].newest).toLocaleString('pl-PL')+')':'')).join(', ')+(errors.length?' · '+errors.join('; '):'');
   if(ok&&!vehicles.length)status.classList.add('error');
  if(!ok)status.classList.add('error');
 }finally{busy=false}
}
async function searchStops(){const q=$('stop').value.trim().toLowerCase();if(q.length<2){$('results').textContent='Wpisz co najmniej dwa znaki.';return}$('results').textContent='Wyszukiwanie…';$('timetable').replaceChildren();try{if(!stops.length)stops=normalizedRows(await request('/stops'));const matching=stops.filter(s=>String(value(s,'nazwa_zespolu')).toLowerCase().includes(q)).slice(0,60);$('results').replaceChildren();if(!matching.length)$('results').textContent='Nie znaleziono przystanku.';for(const s of matching){const z=value(s,'zespol'),n=value(s,'slupek'),name=value(s,'nazwa_zespolu');const d=document.createElement('div');d.className='item';d.textContent=`${name} — ${z}/${n}`;d.onclick=()=>showLines(z,n,name);$('results').append(d)}}catch(e){$('results').textContent=e.message}}
async function showLines(z,n,name){
  $('timetable').textContent='Pobieranie linii…';
  try{
    const rows=normalizedRows(await request('/lines',{busstopId:z,busstopNr:n}));
    const lines=[...new Set(rows.map(r=>String(value(r,'linia')).trim()).filter(Boolean))];
    $('timetable').replaceChildren();
    const h=document.createElement('h3');h.textContent=`${name} ${n} — wybierz linię`;$('timetable').append(h);
    const wrap=document.createElement('div');wrap.className='lines';
    for(const line of lines){const b=document.createElement('button');b.textContent=line;b.onclick=()=>{selectedLine=line;showDepartures(z,n,name,line)};wrap.append(b)}
    $('timetable').append(wrap);
    if(selectedLine&&lines.includes(selectedLine))showDepartures(z,n,name,selectedLine);
    else if(!lines.length)$('timetable').append('Brak linii dla słupka.');
  }catch(e){$('timetable').textContent='Błąd pobierania linii: '+e.message}
}
function normalizeTime(raw){return String(raw??'').trim().replace(/^(\d{1,2}):(\d{2}):(\d{2})$/,(_,h,m,sec)=>h.padStart(2,'0')+':'+m+':'+sec)}
async function showDepartures(z,n,name,line){
  const wrap=$('timetable');wrap.textContent='Pobieranie odjazdów…';
  try{
    const rows=normalizedRows(await request('/departures',{busstopId:z,busstopNr:n,line}));
    const entries=rows.map(r=>({
      time:String(value(r,'czas')||value(r,'time')||'').trim(),
      direction:String(value(r,'kierunek')||value(r,'direction')||'').trim(),
      brigade:String(value(r,'brygada')||value(r,'brigade')||'').trim(),
      day:String(value(r,'symbol_2')||value(r,'symbol_1')||'').trim(),
      raw:r
    }));
    entries.sort((a,b)=>normalizeTime(a.time).localeCompare(normalizeTime(b.time)));
    wrap.replaceChildren();
    const h=document.createElement('h2');h.textContent=`${name} ${n} · linia ${line}`;wrap.append(h);
    const back=document.createElement('button');back.textContent='← Wybierz inną linię';back.className='secondary';back.onclick=()=>showLines(z,n,name);wrap.append(back);
    const intro=document.createElement('p');intro.textContent='Rozkład planowy — wybierz kierunek i brygadę. Dane nie są prognozą przyjazdu.';wrap.append(intro);
    if(focusedVehicle && String(focusedVehicle.Lines).toUpperCase()===String(line).toUpperCase()){
      const selected=document.createElement('div');selected.className='vehicle-context';selected.textContent='Wybrany pojazd: '+focusedVehicle.VehicleNumber+' · brygada '+focusedVehicle.Brigade+' · GPS '+(focusedVehicle.Time||'brak czasu');wrap.append(selected);
    }
    addRoutePanel(wrap,z,n,name,line);
    const controls=document.createElement('div');controls.className='departure-controls';
    const dirs=[...new Set(entries.map(x=>x.direction).filter(Boolean))].sort();
    const dir=document.createElement('select');dir.innerHTML='<option value="">Wszystkie kierunki</option>';
    for(const d of dirs){const o=document.createElement('option');o.value=d;o.textContent=d;dir.append(o)}
    const brigade=document.createElement('select');brigade.innerHTML='<option value="">Wszystkie brygady</option>';
    const brigades=[...new Set(entries.map(x=>x.brigade).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
    for(const b of brigades){const o=document.createElement('option');o.value=b;o.textContent='Brygada '+b;brigade.append(o)}
    if(brigades.includes(selectedBrigade))brigade.value=selectedBrigade;
    const day=document.createElement('select');day.innerHTML='<option value="">Wszystkie oznaczenia</option>';
    for(const d of [...new Set(entries.map(x=>x.day).filter(Boolean))].sort()){
      const o=document.createElement('option');o.value=d;o.textContent='Oznaczenie '+d;day.append(o)
    }
    controls.append(dir,brigade,day);wrap.append(controls);
    const summary=document.createElement('p');summary.className='dep-summary';wrap.append(summary);
    const list=document.createElement('div');list.className='departure-list';wrap.append(list);
    function render(){
      list.replaceChildren();const filtered=entries.filter(x=>(!dir.value||x.direction===dir.value)&&(!brigade.value||x.brigade===brigade.value)&&(!day.value||x.day===day.value));
      summary.textContent=`Odjazdy: ${filtered.length} z ${entries.length}`;
      const good=filtered.filter(x=>validTime(x.time));
      if(!good.length){
        const msg=document.createElement('div');msg.className='dep-warning';
        msg.textContent=entries.length && !entries.some(x=>validTime(x.time))?'API zwróciło rekordy, ale nie rozpoznano pola z godziną. Nie wyświetlam fikcyjnych odjazdów.':'Brak odjazdów dla wybranych filtrów.';
        list.append(msg);
        if(entries.length && !entries.some(x=>validTime(x.time))){
          const detail=document.createElement('details');const caption=document.createElement('summary');caption.textContent='Pokaż strukturę pierwszego rekordu (diagnostyka)';detail.append(caption);
          const pre=document.createElement('pre');pre.textContent=JSON.stringify(entries[0].raw,null,2).slice(0,3500);detail.append(pre);list.append(detail)
        }
        return;
      }
      for(const e of good){
        const item=document.createElement('div');item.className='departure-card';
        const time=document.createElement('strong');time.className='dep-clock';time.textContent=e.time.slice(0,5);
        const content=document.createElement('div');content.className='dep-details';
        const direction=document.createElement('b');direction.textContent=e.direction||'Kierunek niepodany';
        const info=document.createElement('small');info.textContent='Brygada: '+(e.brigade||'brak danych')+(e.day?' · Oznaczenie: '+e.day:'');
        content.append(direction,info);item.append(time,content);list.append(item)
      }
    }
    dir.onchange=render;brigade.onchange=()=>{selectedBrigade=brigade.value;render()};day.onchange=render;render();
  }catch(e){wrap.textContent='Błąd pobierania odjazdów: '+e.message}
}

// GTFS Warszawa: lokalne pliki dzienne. Kurs dobierany na podstawie czasu i GPS.
// Data jest odczytywana z aktualizowanych automatycznie plików GTFS, nie z kodu strony.
const gtfsCache=new Map();
function minutes(t){const m=String(t||'').match(/^(\d+):(\d+)/);return m?Number(m[1])*60+Number(m[2]):NaN}
function geoDistance(a,b,c,d){const r=Math.PI/180,dy=(c-a)*r,dx=(d-b)*r;return 6371000*Math.sqrt(dy*dy+Math.cos(a*r)*Math.cos(c*r)*dx*dx)}
function todayWarsaw(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Warsaw',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).replaceAll('-','')}
function nowWarsaw(date){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);return Number(parts.find(p=>p.type==='hour').value)*60+Number(parts.find(p=>p.type==='minute').value)}
async function loadGtfs(line){
 const day=todayWarsaw();const cached=gtfsCache.get(line);if(cached&&cached.day!==day)gtfsCache.delete(line);
 if(!gtfsCache.has(line))gtfsCache.set(line,{day,promise:fetch('gtfs/'+encodeURIComponent(line.replaceAll('/','_'))+'.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Brak GTFS dla linii '+line);return r.json()}).catch(e=>{gtfsCache.delete(line);throw e})});
 return gtfsCache.get(line).promise;
}

// WTP LIVE v56: ETA z Mikrusa przez chroniony Cloudflare Worker.
// Dopasowanie kursu: linia + brygada + czas + zgodność przystanków.
const etaCache=new Map();
async function etaGet(path,params={}) {
 const key=path+'?'+new URLSearchParams(params);
 const old=etaCache.get(key);
 if(old&&Date.now()-old.at<30000)return old.promise;
 const promise=request('/eta/'+path,params).catch(e=>{etaCache.delete(key);throw e});
 etaCache.set(key,{at:Date.now(),promise});return promise;
}
function etaDay(s){const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})/);return m?m[1]+m[2]+m[3]:String(s||'').replace(/\D/g,'').slice(0,8)}
function etaClock(t){const m=String(t??'').match(/(\d{1,2}):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):NaN}
function etaStopCode(x){return String(x??'').replace(/\D/g,'').replace(/^0+(?=\d)/,'')}
// v54: dopasowanie kursu ETA do brygady, czasu i GPS.
// Identyfikatory słupków ETA i GTFS nie są automatycznie utożsamiane.
function etaTimeNear(a,b){
 if(!Number.isFinite(a)||!Number.isFinite(b))return Infinity;
 return Math.min(...[-1440,0,1440].map(d=>Math.abs(a+d-b)));
}
// v57: ETA jest źródłem brygady i kursu, GTFS dostarcza współrzędnych.
// Nie wolno podmieniać godzin na podstawie niezgodnych identyfikatorów słupków.
function etaAbsoluteMinutes(raw){
 const m=String(raw??'').match(/(\d{1,3}):(\d{2})/);
 return m?Number(m[1])*60+Number(m[2]):NaN;
}
function etaMinutesAt(st){return etaAbsoluteMinutes(st.arrival||st.departure)}
function etaClockDistance(a,b){return etaTimeNear(a,b)}
function etaMonotonicStops(es){
 let prev=-Infinity;
 return es.map(st=>{let t=etaMinutesAt(st);if(Number.isFinite(t)){while(t<prev-180)t+=1440;prev=t}return {...st,_time:t}});
}
function etaMapStops(gtfsStops,etaStops){
 const out=new Array(gtfsStops.length).fill(null);
 const exact=new Map();
 etaStops.forEach((s,j)=>{const k=etaStopCode(s.stop_id);if(k){if(!exact.has(k))exact.set(k,[]);exact.get(k).push(j)}});
 let exactCount=0,last=-1;
 gtfsStops.forEach((s,i)=>{const possible=exact.get(etaStopCode(s[0]))||[];const j=possible.find(k=>k>last);if(j!==undefined){out[i]=j;last=j;exactCount++}});
 // Gdy identyfikatory są z innych systemów, uzgadniamy kolejność i czasy
 // przejazdu. Nie zakładamy, że numer ETA = numer GTFS.
 if(exactCount<Math.max(2,Math.ceil(gtfsStops.length*.25))){
  const a=etaStops.map(x=>x._time),b=gtfsStops.map(x=>minutes(x[4]));
  if(!a.length||!b.length)return {mapped:out,exactCount,coverage:0,error:Infinity};
  const baseA=a.find(Number.isFinite),baseB=b.find(Number.isFinite);
  if(!Number.isFinite(baseA)||!Number.isFinite(baseB))return {mapped:out,exactCount,coverage:0,error:Infinity};
  const used=new Set();let lastJ=-1;
  for(let i=0;i<b.length;i++){
   if(!Number.isFinite(b[i]))continue;
   const target=b[i]-baseB;let best=-1,bestGap=Infinity;
   for(let j=lastJ+1;j<a.length;j++){
    if(!Number.isFinite(a[j])||used.has(j))continue;
    const gap=Math.abs((a[j]-baseA)-target);
    if(gap<bestGap){bestGap=gap;best=j}
   }
   if(best>=0&&bestGap<=4){out[i]=best;used.add(best);lastJ=best}
  }
 }else{
  // Przy potwierdzonych identyfikatorach nie uzupełniamy luk na ślepo.
 }
 let n=0,totalError=0;
 for(let i=0;i<out.length;i++)if(out[i]!==null){
  const t=etaStops[out[i]]._time,g=minutes(gtfsStops[i][4]);
  if(Number.isFinite(t)&&Number.isFinite(g)){n++;totalError+=etaClockDistance(t,g)}
 }
 return {mapped:out,exactCount,coverage:n/Math.max(1,gtfsStops.length),error:n?totalError/n:Infinity};
}
// WTP LIVE v60 — najpierw dosłowne powiązanie linia + brygada w ETA.
// GPS i GTFS nie mogą blokować odczytu rozkładu brygady.
function etaServiceMinutes(raw){
 const m=String(raw??'').match(/(\d{1,3}):(\d{2})/);
 return m?Number(m[1])*60+Number(m[2]):NaN;
}
function etaCourseTimeBounds(stops,course){
 const times=stops.map(x=>etaServiceMinutes(x.arrival||x.departure)).filter(Number.isFinite);
 let start=etaServiceMinutes(course.departure);
 if(!Number.isFinite(start))start=times[0];
 let end=times.at(-1);
 if(!Number.isFinite(end))end=start+60;
 while(end<start)end+=1440;
 return {start,end};
}
function etaCourseDistance(bounds,now){
 let best=Infinity;
 for(const shift of [-1440,0,1440]){
  const t=now+shift;
  const dist=t<bounds.start?bounds.start-t:t>bounds.end? t-bounds.end:0;
  best=Math.min(best,dist);
 }
 return best;
}
async function etaMatchVehicle(v,gtfsTrips=[]){
 const line=String(v.Lines||'').trim(),brigade=normalizeBrigade(v.Brigade);
 if(!line||!brigade)throw Error('Brak numeru linii lub brygady');
 const health=await etaGet('health');
 if(!health.ok||etaDay(health.metadata?.date)!==todayWarsaw())
  throw Error('Baza ETA nie zawiera rozkładu na dzisiaj: '+(health.metadata?.date||'brak daty'));
 const response=await etaGet('courses',{line,limit:5000});
 const courses=(response.courses||[]).filter(c=>normalizeBrigade(c.brigade)===brigade);
 if(!courses.length)throw Error('Brak kursów ETA dla linii '+line+' i brygady '+brigade+' (API zwróciło '+(response.courses||[]).length+' kursów linii)');
 const stamp=gpsMs(v.Time),now=nowWarsaw(Number.isFinite(stamp)?new Date(stamp):new Date());
 // Wyszukaj kursy na podstawie czasu rozkładowego. Opóźnienie nie zmienia brygady.
 const likely=courses.map(c=>({course:c,departure:etaServiceMinutes(c.departure)}))
  .filter(x=>Number.isFinite(x.departure))
  .map(x=>({...x,preDistance:Math.min(...[-1440,0,1440].map(d=>Math.abs(now+d-x.departure-35)))}))
  .sort((a,b)=>a.preDistance-b.preDistance).slice(0,24);
 if(!likely.length)throw Error('Kursy brygady nie mają rozpoznawalnych godzin');
 const evaluated=await Promise.all(likely.map(async x=>{
  try{
   const detail=await etaGet('courses/'+encodeURIComponent(x.course.course_id)+'/stops');
   const stops=(detail.stops||[]).slice().sort((a,b)=>Number(a.seq)-Number(b.seq));
   if(stops.length<2)return null;
   const bounds=etaCourseTimeBounds(stops,x.course);
   const distance=etaCourseDistance(bounds,now);
   return {course:x.course,etaStops:stops,bounds,distance,score:distance};
  }catch(e){console.warn('ETA: nie można pobrać przystanków kursu',x.course.course_id,e.message);return null}
 }));
 const matches=evaluated.filter(Boolean).sort((a,b)=>a.score-b.score||a.bounds.start-b.bounds.start);
 if(!matches.length)throw Error('Nie udało się pobrać przystanków żadnego kursu brygady');
 // Zwracamy także inne kursy tej samej brygady; żadnego kursu innej brygady.
 return {selected:matches[0],alternatives:matches.slice(1,12),line,brigade,now};
}
function etaNamesForCourse(stops,gtfsTrips){
 const names=new Map();
 for(const trip of gtfsTrips||[])for(const s of trip.stops||[]){
  const id=etaStopCode(s[0]);if(id&&!names.has(id))names.set(id,String(s[1]||''));
 }
 return stops.map(s=>names.get(etaStopCode(s.stop_id))||('Przystanek '+String(s.stop_id??'?')));
}
function renderEtaRoute(match,v,body,gtfsTrips=[]){
 const {selected,alternatives}=match;
 const all=[selected,...alternatives];
 function render(choice){
  body.replaceChildren();
  const note=document.createElement('p');note.className='route-note';
  note.textContent='ETA: linia '+choice.course.line+', brygada '+choice.course.brigade+', kurs '+choice.course.course_id+'. Godziny rozkładowe tej brygady; bez prognozy GPS.';
  body.append(note);
  if(all.length>1){
   const label=document.createElement('p');label.className='route-note';
   label.textContent='Brygada ma kilka kursów. Wybrano kurs najbliższy czasowo; można wybrać inny kurs tej samej brygady:';body.append(label);
   const options=document.createElement('div');options.className='wtp-route-options';
   for(const candidate of all){const button=document.createElement('button');
    button.textContent=displayClock(candidate.course.departure)+' · kurs '+candidate.course.course_id;
    button.disabled=String(candidate.course.course_id)===String(choice.course.course_id);
    button.onclick=()=>render(candidate);options.append(button)}
   body.append(options);
  }
  const names=etaNamesForCourse(choice.etaStops,gtfsTrips);
  const list=document.createElement('ol');list.className='route-stops kind-'+(v.kind===2?'tram':'bus');
  choice.etaStops.forEach((stop,i)=>{
   const li=document.createElement('li');li.className='route-stop';
   const dot=document.createElement('span');dot.className='route-dot';
   const name=document.createElement('span');name.className='route-stop-name';name.textContent=names[i];
   const time=document.createElement('time');time.className='route-stop-time';
   time.textContent=displayClock(stop.arrival||stop.departure||'');
   li.append(dot,name,time);list.append(li);
  });body.append(list);
 }
 render(selected);
}

// v50: kurs wolno powiązać z brygadą dopiero po potwierdzeniu
// w odjazdach konkretnego słupka. Samo podobieństwo GPS nie wystarcza.
const brigadeProofCache=new Map();
function normalizeBrigade(x){return String(x??'').trim().replace(/^0+(?=\d)/,'').toUpperCase()}
function tripStopId(stop){return String(stop?.[0]??'').replace(/[^0-9]/g,'')}
function stopParts(stop){
 const raw=tripStopId(stop);
 if(raw.length<6)return null;
 return {z:raw.slice(0,-2),n:raw.slice(-2)};
}
async function confirmTripBrigade(trip,v){
 const line=String(v.Lines||'').trim(),brigade=normalizeBrigade(v.Brigade);
 if(!line||!brigade||!Array.isArray(trip.stops))return false;
 const now=Date.now(),key=[todayWarsaw(),line,brigade,trip.stops.map(x=>tripStopId(x)).join('|')].join(':');
 const cached=brigadeProofCache.get(key);if(cached&&now-cached.at<120000)return cached.ok;
 const when=nowWarsaw(new Date(gpsMs(v.Time)));
 const candidates=trip.stops.map((stop,i)=>({stop,i,parts:stopParts(stop)}))
  .filter(x=>x.parts&&Math.abs(minutes(x.stop[4])-when)<65)
  .sort((a,b)=>Math.abs(minutes(a.stop[4])-when)-Math.abs(minutes(b.stop[4])-when)).slice(0,5);
 let ok=false;
 for(const x of candidates){
  try{
   const rows=normalizedRows(await request('/departures',{busstopId:x.parts.z,busstopNr:x.parts.n,line}));
   if(rows.some(r=>normalizeBrigade(value(r,'brygada')||value(r,'brigade'))===brigade &&
       Math.abs(minutes(value(r,'czas')||value(r,'time'))-minutes(x.stop[4]))<=1)){ok=true;break}
  }catch(e){console.warn('Nie udało się potwierdzić brygady na słupku',x.parts,e.message)}
 }
 brigadeProofCache.set(key,{at:now,ok});return ok;
}
function chooseGtfsTrip(trips,v){
 const lat=Number(v.Lat),lon=Number(v.Lon),when=new Date(gpsMs(v.Time));
 if(!Number.isFinite(when.getTime())||Math.abs(Date.now()-when.getTime())>10*60000)return [];
 const time=nowWarsaw(when),choices=[];
 for(const trip of trips){const ss=trip.stops;if(!ss||ss.length<2)continue;
  const first=minutes(ss[0][4]),last=minutes(ss.at(-1)[4]);
  if(!Number.isFinite(first)||!Number.isFinite(last)||time<first-35||time>last+100)continue;
  let best=Infinity,index=-1,distBest=Infinity;
  for(let i=0;i<ss.length;i++){
   const dt=Math.abs(minutes(ss[i][4])-time);if(dt>100)continue;
   const dist=geoDistance(lat,lon,ss[i][2],ss[i][3]);
   const score=dist+dt*24;if(score<best){best=score;index=i;distBest=dist}
  }
  if(index>=0&&distBest<650)choices.push({trip,index,score:best,distance:distBest});
 }
 return choices.sort((a,b)=>a.score-b.score).slice(0,12);
}
// v52: wyłącznie ostrożna estymacja opóźnienia z rzeczywistego GPS.
// Brak GPS blisko słupka = brak prognozy, a nie zmyślona godzina.
function estimateObservedDelay(trip,v){
 const stamp=gpsMs(v.Time),age=Date.now()-stamp;
 if(!Number.isFinite(stamp)||age< -30000||age>90000)return null;
 const lat=Number(v.Lat),lon=Number(v.Lon),clock=nowWarsaw(new Date(stamp));
 let best=null;
 for(let i=0;i<trip.stops.length;i++){
  const st=trip.stops[i],d=geoDistance(lat,lon,Number(st[2]),Number(st[3]));
  const scheduled=minutes(st[4]);
  if(!Number.isFinite(d)||!Number.isFinite(scheduled)||d>30)continue;
  let delta=clock-scheduled;
  if(delta< -720)delta+=1440;
  if(delta>720)delta-=1440;
  // Ujemny wynik może oznaczać oczekiwanie na odjazd; nie traktuj go jako przyspieszenia.
  if(delta<2||delta>45)continue;
  if(!best||d<best.distance)best={delay:delta,at:i,distance:d};
 }
 return best;
}
function displayClock(t){const m=typeof t==='number'?t:minutes(t);if(!Number.isFinite(m))return String(t||'');const normalized=((Math.round(m)%1440)+1440)%1440;return String(Math.floor(normalized/60)).padStart(2,'0')+':'+String(normalized%60).padStart(2,'0')}
function displayTimeCell(item,i,delayInfo){
 const t=document.createElement('time');t.className='route-stop-time';
 const planned=item[4]?displayClock(item[4]):'—';
 if(delayInfo&&i>delayInfo.at&&Number.isFinite(minutes(item[4]))){
  const old=document.createElement('span');old.className='wtp-planned-time';old.textContent=planned;old.style.cssText='display:block;text-decoration:line-through;color:#91979d;font-size:12px;line-height:1.15;text-align:right';
  const next=document.createElement('strong');next.className='wtp-estimated-time';
  next.textContent=displayClock(minutes(item[4])+delayInfo.delay);next.style.cssText='display:block;color:#cf271e;font-weight:750;line-height:1.3;text-align:right';
  t.append(old,next);t.title='Prognoza +'+Math.round(delayInfo.delay)+' min na podstawie '+(delayInfo.source||'GPS')+'; nie jest to oficjalny odjazd';
 }else{t.textContent=planned}
 return t;
}
function renderVehicleRoute(trip,index,body,description,kind,v=null,knownDelay=null){
 const observed=knownDelay;
 body.replaceChildren();
 const note=document.createElement('p');note.className='route-note';note.textContent=description;body.append(note);
 const list=document.createElement('ol');list.className='route-stops kind-'+(kind===2?'tram':'bus');
 trip.stops.forEach((item,i)=>{
  const li=document.createElement('li');li.className='route-stop'+(i===index?' current':'')+(i<index?' passed':'');
  const dot=document.createElement('span');dot.className='route-dot';
  const name=document.createElement('span');name.className='route-stop-name';name.textContent=item[1];
  const t=displayTimeCell(item,i,observed);
  li.append(dot,name,t);list.append(li);
 });body.append(list);
}
let vehiclePanelRequest=0;
async function openVehiclePanel(v){
 const serial=++vehiclePanelRequest,panel=$('vehiclePanel');panel.hidden=false;
 const line=String(v.Lines||'?'),brigade=String(v.Brigade||'?'),number=String(v.VehicleNumber||'?');
 $('vehicleHeading').textContent=`${line} · ${v.kind===2?'Tramwaj':'Autobus'} · brygada ${brigade} · tabor ${number}`;
 const body=$('vehicleBody');body.replaceChildren();
 const note=document.createElement('p');note.className='route-note';note.textContent='Pobieranie rozkładu ETA linii '+line+', brygady '+brigade+'…';body.append(note);
 try{
  // Nie uzależniaj rozkładu brygady od zgodności GPS/GTFS.
  const matched=await etaMatchVehicle(v);
  if(serial!==vehiclePanelRequest||panel.hidden)return;
  let trips=[];
  try{const data=await loadGtfs(line);if(data.date===todayWarsaw())trips=data.trips||[]}catch(e){console.warn('GTFS: brak nazw przystanków',e.message)}
  if(serial!==vehiclePanelRequest||panel.hidden)return;
  renderEtaRoute(matched,v,body,trips);
 }catch(e){if(serial===vehiclePanelRequest&&!panel.hidden){body.replaceChildren();const warning=document.createElement('p');warning.className='route-note';warning.textContent='Nie udało się pobrać rozkładu ETA: '+e.message;body.append(warning)}}
}
function setTab(tab,record=true){
 document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('selected',x.dataset.tab===tab));
 document.querySelectorAll('main section').forEach(x=>x.classList.toggle('active',x.id===tab));
 if(record && location.hash!=='#'+tab)history.pushState({tab},'', '#'+tab);
 if(tab==='mapa'&&map)setTimeout(()=>map.invalidateSize(),100);
}


// v48: dopasowanie pojazdu do kursu wymaga zgodności linii i brygady.
// Brak brygady w odjeździe oznacza brak wiarygodnego przypisania.
function vehicleForDeparture(e){
 if(!e.brigade)return null;
 const matches=vehicles.filter(v=>String(v.Lines||'').trim().toUpperCase()===String(e.line).trim().toUpperCase()&&String(v.Brigade||'').trim().toUpperCase()===String(e.brigade).trim().toUpperCase()&&Number.isFinite(Number(v.Lat))&&Number.isFinite(Number(v.Lon)));
 return matches.length===1?matches[0]:null;
}
// Przewidywany czas pokazujemy tylko, jeśli nowe API poda go jawnie.
// Sam GPS i numer brygady nie wystarczają do obliczenia opóźnienia.
function apiPredictedTime(row){
 for(const k of ['predicted_departure','predictedDeparture','estimated_departure','estimatedDeparture','realtime_departure','realtimeDeparture','prognoza_odjazdu','czas_prognozowany','godzina_prognozowana']){
  const raw=value(row,k);if(raw!==undefined&&raw!==null&&validTime(String(raw).trim()))return String(raw).trim().slice(0,5);
 }
 return null;
}
// v47: panel przystanku — bez dymka Leaflet. API odjazdów pozostaje źródłem godzin.
function setStopLineHover(line){
 hoveredStopLine=String(line||'').trim().toUpperCase();
 document.querySelectorAll('.vehicle-icon').forEach(el=>{
  // Warstwy pojazdów są odtwarzane przez draw(); nie ruszamy danych GPS.
 });
 draw();
}
function stopDepartureMinutes(raw){
 const m=String(raw||'').match(/^(\d{1,2}):(\d{2})/);if(!m)return Infinity;
 const now=new Date();const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
 const hh=Number(parts.find(x=>x.type==='hour')?.value||0),mm=Number(parts.find(x=>x.type==='minute')?.value||0);
 let delta=Number(m[1])*60+Number(m[2])-(hh*60+mm);
 if(delta<0)delta+=1440;
 return delta;
}
async function openStopPanel(z,n,name,color){
 const serial=++stopPaneRequest;vehiclePanelRequest++;
 hoveredStopLine='';pinnedStopLine='';pinnedStopVehicle=null;draw();
 const panel=$('vehiclePanel'),body=$('vehicleBody');panel.hidden=false;
 $('vehicleHeading').textContent=`${name} ${n} · odjazdy`;
 body.replaceChildren();
 const status=document.createElement('p');status.className='route-note wtp-stop-status';status.textContent='Pobieranie odjazdów…';body.append(status);
 const list=document.createElement('div');list.className='wtp-stop-departures';body.append(list);
 const controls=document.createElement('div');controls.className='wtp-stop-panel-controls';body.insertBefore(controls,list);
 const locate=document.createElement('button');locate.className='secondary';locate.textContent='Pokaż pojazdy wybranej linii';locate.disabled=true;
 const selectedText=document.createElement('span');selectedText.className='route-note';controls.append(locate,selectedText);controls.hidden=true;
 let selected='';
 locate.onclick=()=>{
  const matches=vehicles.filter(v=>String(v.Lines||'').toUpperCase()===selected && Number.isFinite(Number(v.Lat)) && Number.isFinite(Number(v.Lon)));
  if(!matches.length){selectedText.textContent='Brak aktualnych pojazdów tej linii.';return}
  const bounds=L.latLngBounds(matches.map(v=>[Number(v.Lat),Number(v.Lon)]));
  map.fitBounds(bounds.pad(.15),{maxZoom:16});setStopLineHover(selected);
  selectedText.textContent=`Pojazdy na mapie: ${matches.length}`;
 };
 try{
  const lineRows=normalizedRows(await request('/lines',{busstopId:z,busstopNr:n}));
  if(serial!==stopPaneRequest)return;
  const lines=[...new Set(lineRows.map(r=>String(value(r,'linia')||value(r,'line')||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pl',{numeric:true}));
  if(!lines.length){status.textContent='Brak linii dla tego słupka.';return}
  status.textContent='Pobieranie odjazdów…';
  const all=[];let failures=0,completed=0;
  // Ograniczamy współbieżność, aby nie przeciążyć API Warszawy.
  let cursor=0;
  async function worker(){while(cursor<lines.length){
   const line=lines[cursor++];
   try{
    const rows=normalizedRows(await request('/departures',{busstopId:z,busstopNr:n,line}));
    for(const r of rows){const time=String(value(r,'czas')||value(r,'time')||'').trim();if(!validTime(time))continue;
     all.push({line,time,direction:String(value(r,'kierunek')||value(r,'direction')||'').trim(),brigade:String(value(r,'brygada')||value(r,'brigade')||'').trim(),predicted:apiPredictedTime(r)});}
   }catch(e){failures++}completed++;
   if(serial===stopPaneRequest){renderEntries();status.hidden=all.length>0; if(!all.length)status.textContent=completed===lines.length?'Brak dostępnych odjazdów.':'Pobieranie odjazdów…';}
  }}
  function renderEntries(){
   if(serial!==stopPaneRequest)return;
   list.replaceChildren();
   const entries=all.slice().sort((a,b)=>stopDepartureMinutes(a.time)-stopDepartureMinutes(b.time)||a.line.localeCompare(b.line,'pl',{numeric:true})).slice(0,70);
   if(!entries.length){list.textContent=completed===lines.length?'Brak rozpoznanych godzin odjazdów.':'Oczekiwanie na odjazdy…';return}
   for(const e of entries){
    const item=document.createElement('div');item.className='wtp-stop-departure';item.style.setProperty('--stop-color',color);
    const time=document.createElement('div');time.className='wtp-stop-departure-time';
    const planned=document.createElement('strong');planned.textContent=e.time.slice(0,5);
    if(e.predicted&&e.predicted!==e.time.slice(0,5)){
      planned.className='wtp-stop-planned-changed';planned.title='Godzina rozkładowa';
      const predicted=document.createElement('strong');predicted.className='wtp-stop-predicted';predicted.textContent=e.predicted;predicted.title='Prognoza podana przez API';
      time.append(planned,predicted);
    }else time.append(planned);
    const badge=document.createElement('button');badge.className='wtp-stop-line';badge.textContent=e.line;badge.title='Najedź, aby pokazać pojazdy linii '+e.line;
    badge.onmouseenter=()=>setStopLineHover(e.line);
    badge.onmouseleave=()=>setStopLineHover('');
    badge.onfocus=()=>setStopLineHover(e.line);
    badge.onblur=()=>setStopLineHover('');
    badge.onclick=()=>{
      selected=e.line;
      pinnedStopLine=String(e.line).toUpperCase();
      const matching=vehicles.filter(v=>String(v.Lines||v.lines||'').toUpperCase()===pinnedStopLine&&Number.isFinite(Number(v.Lat??v.lat))&&Number.isFinite(Number(v.Lon??v.lon)));
      const exact=vehicleForDeparture(e);
      const pool=exact?[exact]:[];
      const stopLat=Number.isFinite(Number(window._selectedStopLat))?Number(window._selectedStopLat):map.getCenter().lat;
      const stopLon=Number.isFinite(Number(window._selectedStopLon))?Number(window._selectedStopLon):map.getCenter().lng;
      pool.sort((a,b)=>map.distance([Number(a.Lat??a.lat),Number(a.Lon??a.lon)],[stopLat,stopLon])-map.distance([Number(b.Lat??b.lat),Number(b.Lon??b.lon)],[stopLat,stopLon]));
      pinnedStopVehicle=pool[0]||null;
      hoveredStopLine='';draw();
      if(pinnedStopVehicle){map.setView([Number(pinnedStopVehicle.Lat??pinnedStopVehicle.lat),Number(pinnedStopVehicle.Lon??pinnedStopVehicle.lon)],Math.max(map.getZoom(),15));}
      else {status.hidden=false;status.textContent=e.brigade?'Nie można jednoznacznie przypisać pojazdu do brygady '+e.brigade+'.':'Brak numeru brygady w odjeździe — nie przypisuję przypadkowego pojazdu.';}
    };
    const info=document.createElement('div');info.className='wtp-stop-departure-direction';info.textContent=e.direction||'Kierunek niepodany';
    const sub=document.createElement('small');const linked=vehicleForDeparture(e);
    sub.textContent=e.brigade?'Brygada '+e.brigade+(linked?' · pojazd '+linked.VehicleNumber:' · pojazd nieustalony'):'Brygada nieustalona';info.append(sub);
    item.append(time,badge,info);list.append(item);
   }
  }
  await Promise.all(Array.from({length:Math.min(4,lines.length)},()=>worker()));
  if(serial===stopPaneRequest&&failures===lines.length)status.textContent='Nie udało się pobrać odjazdów z API. Sprawdź endpoint /departures.';
 }catch(e){if(serial===stopPaneRequest)status.textContent='Nie udało się pobrać linii: '+e.message}
}

window.addEventListener('DOMContentLoaded',()=>{if(typeof L!=='undefined'){map=L.map('map').setView([52.2297,21.0122],11);map.createPane('stopsPane');map.getPane('stopsPane').style.zIndex='410';map.createPane('vehiclesPane');map.getPane('vehiclesPane').style.zIndex='650';L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layer=L.layerGroup().addTo(map);stopLayer=L.layerGroup().addTo(map);map.on('moveend',()=>{renderStopMarkers();draw()});map.on('click',()=>{if(!$('vehiclePanel').hidden){stopPaneRequest++;vehiclePanelRequest++;$('vehiclePanel').hidden=true;hoveredStopLine='';draw();}})}else{$('status').textContent='Nie udało się załadować biblioteki mapy Leaflet.'}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));window.addEventListener('popstate',()=>setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false));setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false);$('closeVehicle').onclick=()=>{vehiclePanelRequest++;stopPaneRequest++;hoveredStopLine='';pinnedStopLine='';pinnedStopVehicle=null;$('vehiclePanel').hidden=true;draw()};$('refresh').onclick=refresh;$('showStops').checked=true;$('showStops').onchange=toggleStopMap;toggleStopMap();for(const id of ['line','bus','tram'])$(id).addEventListener(id==='line'?'input':'change',draw);$('find').onclick=searchStops;$('stop').onkeydown=e=>{if(e.key==='Enter')searchStops()};if(PROXY){publishVehicles();$('status').textContent='Łączenie z API Warszawy…';refresh()}else $('status').textContent='Brak adresu Workera w config.js.';setInterval(()=>{if(PROXY)refresh()},15000)});

// Trasa wymaga kolejności przystanków z wiarygodnego źródła.
// /route jest opcjonalnym rozszerzeniem Workera, nie częścią dotychczasowych 4 endpointów.
function addRoutePanel(container,z,n,name,line){
 const details=document.createElement('details');details.className='route-panel';
 const summary=document.createElement('summary');summary.textContent='Trasa i pozycja pojazdu · linia '+line;details.append(summary);
 const area=document.createElement('div');area.className='route-body';details.append(area);container.append(details);
 details.addEventListener('toggle',async()=>{
  if(!details.open || details.dataset.loaded)return;
  details.dataset.loaded='1';area.textContent='Sprawdzanie dostępności przebiegu trasy…';
  try{
   const response=await fetch(PROXY+ROUTE_API+'?'+new URLSearchParams({line}),{cache:'no-store'});
   if(!response.ok)throw Error('Brak endpointu trasy');
   const json=await response.json();const items=Array.isArray(json)?json:Array.isArray(json.result)?json.result:[];
   if(!items.length)throw Error('Brak uporządkowanej listy przystanków');
   area.replaceChildren();const list=document.createElement('ol');list.className='route-stops kind-'+(selectedVehicleKind(line)||'bus');
   const selected=focusedVehicle && String(focusedVehicle.Lines).toUpperCase()===String(line).toUpperCase()?focusedVehicle:null;
   let currentIndex=-1;
   // Pozycję na trasie wolno określić tylko gdy źródło udostępnia jawny identyfikator bieżącego przystanku.
   const currentStop=selected?.CurrentStopId||selected?.currentStopId;
   if(currentStop)currentIndex=items.findIndex(x=>String(x.id)===String(currentStop));
   items.forEach((item,i)=>{const li=document.createElement('li');li.className='route-stop'+(i===currentIndex?' current':'')+(currentIndex>=0&&i<currentIndex?' passed':'');
     const dot=document.createElement('span');dot.className='route-dot';
     const label=document.createElement('span');label.className='route-stop-name';label.textContent=String(item.name||item.nazwa||'Nieznany przystanek');li.append(dot,label);
     // Wyświetlamy wyłącznie godzinę rzeczywiście przypisaną do tego przystanku w danych trasy.
     const rawTime=item.departureTime??item.arrivalTime??item.czas??item.time??null;
     if(rawTime!==null && rawTime!==''){const time=document.createElement('time');time.className='route-stop-time';time.textContent=String(rawTime).slice(0,5);li.append(time)}
     if(i===currentIndex){li.title='Pozycja pojazdu';}
     list.append(li)});
   area.append(list);
   if(currentIndex<0){const note=document.createElement('p');note.className='route-note';note.textContent='API GPS nie wskazuje bieżącego przystanku. Nie oznaczamy przystanków jako minięte na podstawie zgadywania.';area.prepend(note)}
  }catch(e){area.textContent='Pełna lista przystanków nie jest jeszcze dostępna. Obecny Worker udostępnia pozycje GPS, słupki, linie i odjazdy, ale nie uporządkowany przebieg trasy. Aby pokazać kropki, bieżący i minięte przystanki, trzeba dodać wiarygodne dane tras i dopasowanie GPS do trasy.'}
 });
}

function selectedVehicleKind(line){
 if(!focusedVehicle||String(focusedVehicle.Lines).toUpperCase()!==String(line).toUpperCase())return 'bus';
 const n=Number(focusedVehicle.kind??focusedVehicle.Kind??focusedVehicle.type);
 return n===2?'tram':'bus';
}