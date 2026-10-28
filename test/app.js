// WTP LIVE — WERSJA: 86
// WTP LIVE — WERSJA: 58
// WTP LIVE v63 – walidacja świeżości GPS, aktualności GTFS i bezpieczne dopasowanie kursu.
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
// WERSJA 70: typ przystanku pobierany wyłącznie z jawnych danych źródłowych.
function requestStopNear(lat,lon){
 if(!Array.isArray(stops)||!stops.length||!Number.isFinite(lat)||!Number.isFinite(lon))return null;
 let closest=null,best=16;
 for(const row of stops){
  const p=stopCoordinates(row);if(!p||Math.abs(p[0]-lat)>.0004||Math.abs(p[1]-lon)>.0006)continue;
  const d=geoDistance(lat,lon,p[0],p[1]);
  if(d<best){best=d;closest=row;}
 }
 if(!closest)return null;
 return isRequestStop(closest,stopMetaAt(lat,lon));
}
function decorateRouteStop(li,lat,lon){
 const request=requestStopNear(Number(lat),Number(lon));
 if(request===true)li.classList.add('request-stop');
 else if(request===false)li.classList.add('fixed-stop');
 else li.classList.add('unknown-stop'); // GTFS nie zawiera typu NŻ: nie zgaduj
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
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||!Number.isFinite(stamp))continue;
  const prev=lastLocations.get(key);
  // Zachowuj ostatni wiarygodny kierunek również podczas postoju.
  let bearing=Number.isFinite(v._bearing)?v._bearing:(prev&&Number.isFinite(prev.bearing)?prev.bearing:null);
  if(prev&&stamp>prev.stamp){
   const metres=geoDistance(prev.lat,prev.lon,lat,lon);
   const seconds=(stamp-prev.stamp)/1000;
   if(metres>=7&&metres<=1200&&seconds>0&&seconds<=600){
    bearing=direction(prev.lat,prev.lon,lat,lon);
   }else if(metres>1200){bearing=null;}
  }
  if(Number.isFinite(bearing))v._bearing=bearing;
  // Nie zastępuj nowszej pozycji starszą odpowiedzią API.
  if(!prev||stamp>=prev.stamp){
   lastLocations.set(key,{lat,lon,stamp,seen:now,bearing:Number.isFinite(bearing)?bearing:null});
  }
 }
 for(const [key,p] of lastLocations)if(now-p.seen>6*60*60*1000)lastLocations.delete(key);
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
    const vehicleSymbol=`<img class="badge-vehicle wtp-custom-vehicle" src="${v.kind===2?'icons/WTP-tramwaj.svg':'icons/WTP-autobus.svg'}" alt="" aria-hidden="true">`;
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
let lastPanelAutoRefresh=0;
function publishVehicles(){
 vehicles=[...received[1].map(v=>({...v,kind:1})),...received[2].map(v=>({...v,kind:2}))];for(const v of vehicles)rememberGps(v);draw();
 if(focusedVehicle && !$('vehiclePanel')?.hidden && Date.now()-lastPanelAutoRefresh>3000){
  const current=vehicles.find(v=>vehicleKey(v)===vehicleKey(focusedVehicle));
  if(current && gpsMs(current.Time)>gpsMs(focusedVehicle.Time)){
   focusedVehicle={...current};lastPanelAutoRefresh=Date.now();
   void openVehiclePanel(current);
  }
 }
}
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
 if(old&&Date.now()-old.at<(path==='health'?60000:path==='courses'?180000:600000))return old.promise;
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
function etaMinutesAt(st){return etaAbsoluteMinutes(st.departure||st.arrival)}
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
// WTP LIVE v65 — najpierw dosłowne powiązanie linia + brygada w ETA.
// GPS i GTFS nie mogą blokować odczytu rozkładu brygady.
function etaServiceMinutes(raw){
 const m=String(raw??'').match(/(\d{1,3}):(\d{2})/);
 return m?Number(m[1])*60+Number(m[2]):NaN;
}
function etaCourseTimeBounds(stops,course){
 const times=stops.map((x,i)=>etaServiceMinutes(i===0?(x.departure||x.arrival):(i===stops.length-1?(x.arrival||x.departure):(x.departure||x.arrival)))).filter(Number.isFinite);
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
// v80: kandydaci tej samej brygady oceniani po przebiegu GPS i czasie.
// Nie zakładamy, że najnowszy planowo kurs jest wykonywany przy opóźnieniu.
async function etaMatchVehicle(v,gtfsTrips=[]){
 const line=String(v.Lines||'').trim(),brigade=normalizeBrigade(v.Brigade);
 if(!line||!brigade)throw Error('Brak linii lub brygady');
 const health=await etaGet('health');
 if(!health.ok||etaDay(health.metadata?.date)!==todayWarsaw())throw Error('Nieaktualna baza ETA: '+(health.metadata?.date||'brak'));
 const response=await etaGet('courses',{line,limit:5000});
 const courses=(response.courses||[]).filter(c=>normalizeBrigade(c.brigade)===brigade);
 if(!courses.length)throw Error('Brak kursów ETA tej brygady');
 const stamp=gpsMs(v.Time),now=nowWarsaw(Number.isFinite(stamp)?new Date(stamp):new Date());
 // Zakres obejmuje kursy planowo rozpoczęte do 120 min temu i zbliżające się kursy.
 const likely=courses.map(course=>({course,departure:etaServiceMinutes(course.departure)}))
  .filter(x=>Number.isFinite(x.departure))
  .map(x=>({...x,preDistance:Math.min(...[-1440,0,1440].map(d=>Math.abs(now+d-x.departure-35)))}))
  .sort((a,b)=>a.preDistance-b.preDistance).slice(0,24);
 const evaluated=[];
 for(let batch=0;batch<likely.length;batch+=6){
  const results=await Promise.all(likely.slice(batch,batch+6).map(async x=>{
   try{const detail=await etaGet('courses/'+encodeURIComponent(x.course.course_id)+'/stops');
    const stops=(detail.stops||[]).slice().sort((a,b)=>Number(a.seq)-Number(b.seq));
    if(stops.length<2)return null;
    const bounds=etaCourseTimeBounds(stops,x.course),distance=etaCourseDistance(bounds,now);
    return {course:x.course,etaStops:stops,bounds,distance,score:distance};
   }catch(e){console.warn('ETA kurs',x.course.course_id,e.message);return null}
  }));evaluated.push(...results);
 }
 const matches=evaluated.filter(Boolean).sort((a,b)=>a.score-b.score||a.bounds.start-b.bounds.start);
 if(!matches.length)throw Error('Brak dostępnych szczegółów kursów ETA');
 return {selected:matches[0],alternatives:matches.slice(1),line,brigade,now};
}
// Najbliższy odcinek polilinii przystanków dla danego kursu.
function etaSpatialFit(choice,v,trips){
 const named=etaNameMatch(choice.etaStops,trips,choice.course);
 if(!named||!Number.isFinite(Number(v.Lat))||!Number.isFinite(Number(v.Lon)))return null;
 const points=[];
 for(let i=0;i<choice.etaStops.length;i++){
  const j=named.mapping[i],st=j>=0?named.trip.stops[j]:null;
  if(st&&Number.isFinite(Number(st[2]))&&Number.isFinite(Number(st[3])))points.push({i,lat:Number(st[2]),lon:Number(st[3]),time:etaServiceMinutes(choice.etaStops[i].departure||choice.etaStops[i].arrival)});
 }
 if(points.length<3)return null;
 const lat=Number(v.Lat),lon=Number(v.Lon),cos=Math.cos(lat*Math.PI/180);
 let best=null;
 for(let k=0;k<points.length-1;k++){
  const a=points[k],b=points[k+1];const ax=a.lon*111195*cos,ay=a.lat*111195,bx=b.lon*111195*cos,by=b.lat*111195;
  const px=lon*111195*cos,py=lat*111195,dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy;
  if(den<1)continue;
  const f=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/den));
  const distance=Math.hypot(px-ax-f*dx,py-ay-f*dy);
  const result={distance,index:a.i,f,time:Number.isFinite(a.time)&&Number.isFinite(b.time)?a.time+(b.time-a.time)*f:NaN};
  if(!best||distance<best.distance)best=result;
 }
 return best;
}
function etaSelectCourse(match,v,trips){
 const key=vehicleKey(v),old=activeCourseByVehicle.get(key),now=match.now;
 const candidates=[match.selected,...match.alternatives];
 const scored=candidates.map(choice=>{
  const fit=etaSpatialFit(choice,v,trips);
  if(!fit||fit.distance>180)return null;
  // Dopuszczamy do 120 minut opóźnienia, ale nie kurs w przyszłości.
  let lateness=Infinity;
  if(Number.isFinite(fit.time))for(const shift of [-1440,0,1440]){
   const delta=now+shift-fit.time;
   if(delta>=-3&&delta<=120)lateness=Math.min(lateness,delta);
  }
  if(!Number.isFinite(lateness))return null;
  const continuity=old?.id===String(choice.course.course_id)?-90:0;
  return {choice,fit,score:fit.distance+lateness*1.8+continuity,lateness};
 }).filter(Boolean).sort((a,b)=>a.score-b.score);
 if(!scored.length){match.gpsVerified=false;match.matchWarning='Nie potwierdzono kursu położeniem GPS';return match;}
 const first=scored[0],second=scored[1];
 // Bliskie wyniki nie dają pewności identyfikacji; nie pokazuj wtedy prognoz.
 match.gpsVerified=first.fit.distance<=100&&(!second||second.score-first.score>=15||old?.id===String(first.choice.course.course_id));
 match.selected=first.choice;
 match.alternatives=candidates.filter(c=>String(c.course.course_id)!==String(first.choice.course.course_id));
 match.matchWarning=match.gpsVerified?'':'Dopasowanie kursu niejednoznaczne';
 if(match.gpsVerified)activeCourseByVehicle.set(key,{id:String(first.choice.course.course_id),end:first.choice.bounds.end,terminal:false,at:Date.now()});
 return match;
}
// WTP LIVE v63: nazwy przystanków ETA nie są identyfikatorami GTFS.
// Mapujemy je po uporządkowanym przebiegu i godzinach, bez fikcyjnego utożsamiania ID.
function etaNameMatch(etaStops,gtfsTrips,course){
 const eta=etaMonotonicStops(etaStops), candidates=[];
 for(const trip of gtfsTrips||[]){
  const ss=trip.stops||[];if(ss.length<2)continue;
  const ts=ss.map(s=>minutes(s[4]));
  if(!ts.every(Number.isFinite))continue;
  const eTimes=eta.map(s=>s._time);
  const a=eTimes.find(Number.isFinite),z=[...eTimes].reverse().find(Number.isFinite);
  if(!Number.isFinite(a)||!Number.isFinite(z))continue;
  const startGap=etaTimeNear(a,ts[0]),endGap=etaTimeNear(z,ts.at(-1));
  if(startGap>8||endGap>12)continue;
  // Dynamiczne wyrównanie list przystanków. Wymagamy zgodności godzin
  // i zachowania kolejności, aby nie podpisać kursu obcą trasą.
  const n=eta.length,m=ss.length;
  if(Math.abs(n-m)>Math.max(6,Math.ceil(n*.22)))continue;
  const dp=Array.from({length:n+1},()=>new Float64Array(m+1));
  const back=Array.from({length:n+1},()=>new Uint8Array(m+1));
  const skip=4.5;
  for(let i=1;i<=n;i++){dp[i][0]=i*skip;back[i][0]=1}
  for(let j=1;j<=m;j++){dp[0][j]=j*skip;back[0][j]=2}
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){
   const et=eTimes[i-1],gt=ts[j-1];
   const delta=Number.isFinite(et)?etaTimeNear(et,gt):10;
   const same=dp[i-1][j-1]+Math.min(18,delta)*1.8;
   const del=dp[i-1][j]+skip,ins=dp[i][j-1]+skip;
   if(same<=del&&same<=ins){dp[i][j]=same;back[i][j]=0}
   else if(del<=ins){dp[i][j]=del;back[i][j]=1}
   else{dp[i][j]=ins;back[i][j]=2}
  }
  const mapping=new Array(n).fill(-1);let i=n,j=m,matched=0,errors=0;
  while(i>0||j>0){const op=back[i][j];if(i>0&&j>0&&op===0){
   const delta=etaTimeNear(eTimes[i-1],ts[j-1]);
   if(delta<=2){mapping[i-1]=j-1;matched++;errors+=delta}
   i--;j--;
  }else if(i>0&&(j===0||op===1))i--;else j--}
  const coverage=matched/Math.max(n,m);
  if(coverage<.78||errors/Math.max(1,matched)>1.2)continue;
  const score=dp[n][m]+startGap+endGap;
  candidates.push({trip,mapping,score,coverage});
 }
 candidates.sort((a,b)=>a.score-b.score);
 // Jeżeli dwa różne przebiegi pasują równie dobrze, nie zgadujemy nazw.
 if(candidates.length>1 && candidates[1].score-candidates[0].score<3 &&
   candidates[0].trip.stops.map(s=>s[0]).join()!==candidates[1].trip.stops.map(s=>s[0]).join())return null;
 return candidates[0]||null;
}
function etaNamesForCourse(stops,gtfsTrips,course){
 const matched=etaNameMatch(stops,gtfsTrips,course);
 return {matched:!!matched,mapping:matched?.mapping,trip:matched?.trip,names:stops.map((s,i)=>{
  const j=matched?.mapping[i];
  return j>=0?String(matched.trip.stops[j][1]||'Przystanek'):'Przystanek '+String(s.stop_id??'?');
 })};
}
// WERSJA 65: dopasowanie postępu pojazdu na trasie i zmiana kursu na pętli.
// 90 m to próg weryfikacji terminala; 30 m było zbyt małe przy GPS w ruchu.
const TERMINAL_RADIUS_M=90;
const activeCourseByVehicle=new Map();
function coursePosition(choice,trips,v){
 const named=etaNameMatch(choice.etaStops,trips,choice.course);
 if(!named)return null;
 const coords=named.trip.stops;
 let nearest={distance:Infinity,index:-1};
 for(let i=0;i<choice.etaStops.length;i++){
  const j=named.mapping[i],st=j>=0?coords[j]:null;
  if(!st)continue;
  const d=geoDistance(Number(v.Lat),Number(v.Lon),Number(st[2]),Number(st[3]));
  if(Number.isFinite(d)&&d<nearest.distance)nearest={distance:d,index:i};
 }
 const last=choice.etaStops.length-1;
 return {...nearest,atTerminal:nearest.index===last&&nearest.distance<=TERMINAL_RADIUS_M,matched:named};
}
function chooseLiveEtaCourse(match,v,trips){
 return etaSelectCourse(match,v,trips);
}
// WTP LIVE v68: natychmiastowa prognoza i cache panelu
// WTP LIVE v66: ciągła obserwacja GPS, stan kursu i prognoza ETA.
// Tylko kurs ETA wybranej linii i brygady; nie zastępuj godzin planowych GTFS.
const GPS_STOP_RADIUS_M=65;       // próg wejścia w rejon przystanku
const GPS_STOP_EXIT_M=95;         // histereza wyjazdu z przystanku
const GPS_MAX_AGE_MS=90000;
const gpsProgress=new Map();
const etaRenderedCache=new Map();
const GPS_TRACE_KEY='wtp-live-v66-gps-traces';
const gpsTraces=new Map();
try{const saved=JSON.parse(localStorage.getItem(GPS_TRACE_KEY)||'{}');for(const [k,arr] of Object.entries(saved))if(Array.isArray(arr))gpsTraces.set(k,arr.filter(p=>Date.now()-p.t<90*60000).slice(-100));}catch{}
let gpsTraceSaveAt=0;
function rememberGps(v){
 const t=gpsMs(v.Time),lat=Number(v.Lat),lon=Number(v.Lon),key=vehicleKey(v);
 if(!Number.isFinite(t)||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(Date.now()-t)>5*60000)return;
 const arr=gpsTraces.get(key)||[];
 if(arr.length&&t<=arr[arr.length-1].t)return;
 arr.push({t,lat,lon,line:String(v.Lines||''),brigade:normalizeBrigade(v.Brigade)});
 while(arr.length>100||arr.length&&t-arr[0].t>90*60000)arr.shift();
 gpsTraces.set(key,arr);
 if(Date.now()-gpsTraceSaveAt>30000){gpsTraceSaveAt=Date.now();try{const entries=[...gpsTraces].filter(([k,a])=>a.length&&Date.now()-a.at(-1).t<90*60000).slice(-400);localStorage.setItem(GPS_TRACE_KEY,JSON.stringify(Object.fromEntries(entries)));}catch{}}
}
function routeProgressFromTrace(geo,v){
 if(!geo.points.length)return null;
 const trace=(gpsTraces.get(vehicleKey(v))||[]).filter(p=>p.line===String(v.Lines||'')&&p.brigade===normalizeBrigade(v.Brigade));
 if(!trace.length)return null;
 const last=trace.at(-1);let best=null;
 for(let k=0;k<geo.points.length;k++){
  const pt=geo.points[k],dist=geoDistance(last.lat,last.lon,pt.lat,pt.lon);
  if(Number.isFinite(dist)&&(!best||dist<best.distance))best={i:pt.i,distance:dist,point:pt};
 }
 if(!best||best.distance>160)return null;
 // Odczyty kolejnych pozycji: nie cofaj aktualnego przystanku bez zmiany kursu.
 return {...best,trace};
}

function etaGpsObservations(choice,v,trips){
 const named=etaNameMatch(choice.etaStops,trips,choice.course);
 if(!named)return {named:null,near:null,points:[]};
 const points=[];
 for(let i=0;i<choice.etaStops.length;i++){
  const j=named.mapping[i];if(j<0)continue;
  const st=named.trip.stops[j],lat=Number(st[2]),lon=Number(st[3]);
  if(Number.isFinite(lat)&&Number.isFinite(lon))points.push({i,lat,lon,time:etaServiceMinutes(i===choice.etaStops.length-1?(choice.etaStops[i].arrival||choice.etaStops[i].departure):(choice.etaStops[i].departure||choice.etaStops[i].arrival))});
 }
 let near=null;
 for(const pt of points){const d=geoDistance(Number(v.Lat),Number(v.Lon),pt.lat,pt.lon);
  if(Number.isFinite(d)&&(!near||d<near.distance))near={...pt,distance:d};}
 return {named,near,points};
}
function etaGpsPrediction(choice,v,trips){
 const stamp=gpsMs(v.Time),age=Date.now()-stamp;
 const geo=etaGpsObservations(choice,v,trips);
 if(!Number.isFinite(stamp)||age< -30000||age>GPS_MAX_AGE_MS||!geo.named||!geo.near)
  return {geo,delay:null,reason:'Brak aktualnego GPS lub wiarygodnego przypisania współrzędnych przystanków'};
 const key=vehicleKey(v),courseId=String(choice.course.course_id),old=gpsProgress.get(key);
 const now=nowWarsaw(new Date(stamp));
 const progress=routeProgressFromTrace(geo,v);
 const closest=geo.near,inside=closest.distance<=GPS_STOP_RADIUS_M;
 let history=old&&old.courseId===courseId&&stamp>=old.stamp&&stamp-old.stamp<25*60000?old:null;
 let delay=null,confirmedIndex=-1;
 let currentIndex=progress?.i??-1;
 if(history&&history.currentIndex>=0&&currentIndex>=0)currentIndex=Math.max(history.currentIndex,currentIndex);
 if(currentIndex<0&&history?.currentIndex>=0)currentIndex=history.currentIndex;
 // v70: rozpoznaj dojazd już w promieniu 110 m, nie dopiero po minięciu.
 // Dopuszczamy tylko następny przystanek w kolejności kursu.
 const nextPoint=geo.points.find(pt=>pt.i===currentIndex+1);
 if(nextPoint){
  const d=geoDistance(Number(v.Lat),Number(v.Lon),nextPoint.lat,nextPoint.lon);
  /* v76: zbliżenie do następnego przystanku nie oznacza jego minięcia. */
 }

 // Zaliczenie postoju wymaga zbliżenia do przystanku, a najlepiej kolejnego
 // odczytu wskazującego odjazd. Pojedynczy GPS oznacza tylko obserwację.
 if(history?.nearIndex>=0 && history.nearIndex<geo.points.length+100){
  const previousPoint=geo.points.find(pt=>pt.i===history.nearIndex);
  if(previousPoint){
   const away=geoDistance(Number(v.Lat),Number(v.Lon),previousPoint.lat,previousPoint.lon);
   if(away>=GPS_STOP_EXIT_M&&history.nearIndex>=confirmedIndex&&stamp>history.stamp){
    const plan=previousPoint.time;
    const departureClock=nowWarsaw(new Date(stamp));
    let delta=departureClock-plan;
    if(delta< -720)delta+=1440;if(delta>720)delta-=1440;
    // Odjazd rozpoznany pomiędzy dwoma pomiarami, dokładność ograniczona
    // interwałem GPS. Ujemne i skrajne wartości pozostają bez prognozy.
    // Samo oddalenie od słupka nie dowodzi faktycznego odjazdu ani spóźnienia.
    // Nie naliczaj opóźnienia z przybliżonego GPS.
    if(false && Number.isFinite(plan)&&delta>=2&&delta<=90){delay=delta;confirmedIndex=history.nearIndex;}
   }
  }
 }
 // Jeśli pojazd jest przy przystanku, użyj czasu obserwacji tylko jako
 // wstępnego szacunku; nie przypisuj go do minionych przystanków.
 // v76: Samo zbliżenie GPS do przystanku nie potwierdza jego obsłużenia.
 const nearIndex=inside?closest.i:(history?.nearIndex??-1);
 // Po oddaleniu od obserwowanego przystanku nie utrzymuj go w stanie 'near'.
 gpsProgress.set(key,{courseId,stamp,delay,confirmedIndex,currentIndex,nearIndex:inside?closest.i:-1,seen:Date.now()});
 if(gpsProgress.size>1000)for(const [k,x] of gpsProgress)if(Date.now()-x.seen>30*60000)gpsProgress.delete(k);
 // Jeżeli GPS wskazuje przystanek, opóźnienie obejmuje także TEN przystanek.
 // Przy przejściowym braku świeżego potwierdzenia użyj poprzedniej prognozy
 // tego samego kursu (nigdy innej brygady ani innego kursu).
 // Wjazd w promień przystanku nie jest potwierdzeniem jego obsłużenia.
 const result={geo,delay:Number.isFinite(delay)?delay:null,confirmedIndex,currentIndex,reason:inside?'GPS w pobliżu przystanku':'Prognoza z ostatniego potwierdzonego przystanku'};
 if(result.delay!==null)etaRenderedCache.set(key,{courseId,delay:result.delay,confirmedIndex:result.confirmedIndex,currentIndex:result.currentIndex,stamp,at:Date.now()});
 return result;
}
// v69: centralna historia GPS z Mikrusa; pobierana rownolegle do rozkladu.
const serverGpsHistory=new Map();
async function fetchServerGps(v){
 const key=vehicleKey(v),old=serverGpsHistory.get(key);
 if(old&&Date.now()-old.at<25000)return old.positions;
 const r=await request('/gps-history',{type:v.kind,vehicle:v.VehicleNumber});
 const positions=(r.positions||[]).filter(p=>p.line===String(v.Lines)&&normalizeBrigade(p.brigade)===normalizeBrigade(v.Brigade)&&Number.isFinite(Number(p.stamp))&&Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lon)))
   .map(p=>({...p,stamp:Number(p.stamp),lat:Number(p.lat),lon:Number(p.lon)}))
   .sort((a,b)=>a.stamp-b.stamp);
 serverGpsHistory.set(key,{at:Date.now(),positions});
 return positions;
}
// Czas obserwacji GPS względem godzin kursu ETA, także po północy.
function etaObservedMinutes(stamp,planned){
 const date=new Date(Number(stamp));
 if(!Number.isFinite(date.getTime())||!Number.isFinite(planned))return NaN;
 const local=nowWarsaw(date)+date.getSeconds()/60;
 const shifts=[-2880,-1440,0,1440,2880];
 return shifts.map(shift=>local+shift).sort((a,b)=>Math.abs(a-planned)-Math.abs(b-planned))[0];
}
// v86: utrwalone obserwacje odjazdow dla konkretnego kursu i slupka.
// Zdarzenia sa wyznaczane z serwerowej historii GPS, nie z prognoz.
const WTP_ACTUAL_KEY='wtp-live-v86-actual-departures';
let wtpActualDepartures={};
try{wtpActualDepartures=JSON.parse(localStorage.getItem(WTP_ACTUAL_KEY)||'{}')||{}}catch{}
function wtpActualKey(v,choice){return [todayWarsaw(),v.kind,v.VehicleNumber,choice.course.course_id].join(':')}
function wtpPersistActual(v,choice,events){
 const key=wtpActualKey(v,choice),existing=wtpActualDepartures[key]||{};
 for(const [i,event] of events){
  if(!Number.isFinite(event.time)||!Number.isFinite(event.stamp))continue;
  const previous=existing[i];
  if(!previous||event.dist<previous.dist)existing[i]={time:event.time,stamp:event.stamp,dist:event.dist};
 }
 wtpActualDepartures[key]=existing;
 const keys=Object.keys(wtpActualDepartures);
 if(keys.length>450){for(const k of keys.slice(0,keys.length-450))delete wtpActualDepartures[k]}
 try{localStorage.setItem(WTP_ACTUAL_KEY,JSON.stringify(wtpActualDepartures))}catch{}
 return new Map(Object.entries(existing).map(([i,e])=>[Number(i),e]));
}
function historyEstimate(choice,v,trips){
 const saved=serverGpsHistory.get(vehicleKey(v));
 if(!saved||!saved.positions.length)return null;
 const geo=etaGpsObservations(choice,v,trips);
 if(!geo.named||geo.points.length<2)return null;
 const points=geo.points,history=saved.positions;
 const events=new Map();let currentIndex=-1,latestDelay=null;
 const projectedSamples=[];
 const currentStamp=gpsMs(v.Time);
 // Przyporzadkuj GPS do odcinka trasy, takze miedzy przystankami.
 // Punkt najblizszy jest wiarygodny tylko, gdy pojazd lezy blisko przebiegu.
 const project=(p)=>{
  let best=null;
  for(let j=0;j<points.length-1;j++){
   const a=points[j],b=points[j+1],cos=Math.cos(a.lat*Math.PI/180);
   const ax=a.lon*111195*cos,ay=a.lat*111195,bx=b.lon*111195*cos,by=b.lat*111195;
   const px=p.lon*111195*cos,py=p.lat*111195;
   const dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy;
   if(den<1)continue;
   const f=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/den));
   const dist=Math.hypot(px-(ax+f*dx),py-(ay+f*dy));
   if(!best||dist<best.dist)best={j,f,dist};
  }
  return best&&best.dist<=125?best:null;
 };
 let lastProgress=-1;
 for(const p of history){
  if(p.stamp>currentStamp+60000||p.stamp<currentStamp-4*3600000)continue;
  const match=project(p);if(!match)continue;
  const progress=match.j+match.f;
  // Nie dopuszczaj cofania po trasie wskutek niedokladnosci GPS.
  if(lastProgress>=0&&progress<lastProgress-0.65)continue;
  lastProgress=Math.max(lastProgress,progress);
  const a=points[match.j],b=points[match.j+1];
  if(!Number.isFinite(a.time)||!Number.isFinite(b.time))continue;
  const plan=a.time+(b.time-a.time)*match.f;
  const observed=etaObservedMinutes(p.stamp,plan);
  const delta=observed-plan;
  // WERSJA 83: interpolacja miedzy przystankami wymaga kilku zgodnych pomiarow.
  // Nie uznajemy pojedynczego punktu GPS za dowod opoznienia.
  if(delta>=-3&&delta<=120&&match.dist<=85)
   projectedSamples.push({stamp:p.stamp,delta,progress,dist:match.dist});
  if(match.dist<=35){
   for(const pt of [a,b]){
    const d=geoDistance(p.lat,p.lon,pt.lat,pt.lon);
    if(d<=35&&!events.has(pt.i)&&observed>=pt.time-3&&observed<=pt.time+120)events.set(pt.i,{time:observed,stamp:p.stamp,dist:d});
   }
  }
 }
 const live=project({lat:Number(v.Lat),lon:Number(v.Lon)});
 if(live)currentIndex=points[live.j].i;
 else if(lastProgress>=0)currentIndex=points[Math.floor(lastProgress)].i;
 if(live&&Number.isFinite(points[live.j].time)&&Number.isFinite(points[live.j+1].time)){
  const a=points[live.j],b=points[live.j+1];
  const plan=a.time+(b.time-a.time)*live.f;
  const delta=etaObservedMinutes(currentStamp,plan)-plan;
  if(delta>=-3&&delta<=120&&live.dist<=85)
   projectedSamples.push({stamp:currentStamp,delta,progress:live.j+live.f,dist:live.dist});
 }
 // Potwierdz prognoze tylko gdy co najmniej 2 odczyty GPS sa zgodne
 // (rozstep minimum 12 s, rozbieznosc <= 4 min). To takze dziala
 // miedzy przystankami i po polnocy (plan ETA moze miec godziny >24).
 const recent=projectedSamples.filter(p=>currentStamp-p.stamp<=300000 && currentStamp-p.stamp>=-30000)
  .sort((a,b)=>a.stamp-b.stamp);
 const last=recent.at(-1);
 if(last){
  const pair=recent.slice(0,-1).reverse().find(p=>last.stamp-p.stamp>=12000 &&
   last.stamp-p.stamp<=300000 && Math.abs(last.delta-p.delta)<=7 &&
   last.progress>=p.progress-0.20);
  if(pair)latestDelay=Math.round((last.delta+pair.delta)/2);
 }
 return {events,currentIndex,delay:Number.isFinite(latestDelay)?latestDelay:null,
  samples:recent.length,source:Number.isFinite(latestDelay)?'Dwa zgodne pomiary GPS':'Brak dwoch zgodnych pomiarow'};
}
// v83: potwierdzony postoj GPS: co najmniej dwa niezalezne pomiary
// przy tym samym slupku, bez zgadywania z samego rozkladu.
const etaLiveStopEvidence=new Map();
function etaObservedStopDelay(choice,v,geo){
 const stamp=gpsMs(v.Time),now=Date.now();
 if(!Number.isFinite(stamp)||Math.abs(now-stamp)>GPS_MAX_AGE_MS||!geo?.near)return null;
 const pt=geo.near;
 if(pt.distance>32||!Number.isFinite(pt.time))return null;
 const key=vehicleKey(v),courseId=String(choice.course.course_id);
 let record=etaLiveStopEvidence.get(key);
 if(!record||record.courseId!==courseId||record.stopIndex!==pt.i||stamp-record.lastStamp>180000||stamp<record.lastStamp){
  record={courseId,stopIndex:pt.i,firstStamp:stamp,lastStamp:stamp,count:1};
 }else if(stamp>record.lastStamp){record.lastStamp=stamp;record.count++;}
 etaLiveStopEvidence.set(key,record);
 if(record.count<2||record.lastStamp-record.firstStamp<8000)return null;
 const observed=etaObservedMinutes(record.firstStamp,pt.time);
 const delta=observed-pt.time;
 if(delta< -3||delta>120)return null;
 return {delay:Math.max(0,Math.round(delta)),confirmedIndex:pt.i,reason:'Postoj potwierdzony kolejnymi pomiarami GPS'};
}
function renderEtaRoute(match,v,body,gtfsTrips=[]){
 const choice=match.selected;
 body.replaceChildren();
 const names=etaNamesForCourse(choice.etaStops,gtfsTrips,choice.course);
 let prediction=etaGpsPrediction(choice,v,gtfsTrips);
 const server=historyEstimate(choice,v,gtfsTrips);
 const fit=etaSpatialFit(choice,v,gtfsTrips);
 const courseId=String(choice.course.course_id);
 const oldCourse=activeCourseByVehicle.get(vehicleKey(v));
 // WERSJA 83: brak gpsVerified nie moze bezwarunkowo zerowac prognozy.
 // Dopuszczamy estymacje dla dopasowania GPS albo stabilnego kursu,
 // ktorego pozycja lezy blisko trasy. Bez geometrii nie zgadujemy.
 // Stabilny kurs dopasowany do brygady i przebiegu trasy.
 // Nie wymagamy niezaimplementowanego w API v58 verified_by_gps.
 const coursePlausible=!!fit && fit.distance<=125 &&
  (match.gpsVerified || oldCourse?.id===courseId ||
   (match.alternatives||[]).every(other=>{
    const otherFit=etaSpatialFit(other,v,gtfsTrips);
    return !otherFit || otherFit.distance>fit.distance+20;
   }));
 const actualEvents=wtpPersistActual(v,choice,coursePlausible&&server?server.events:new Map());
 if(!coursePlausible){
  prediction={...prediction,delay:null,confirmedIndex:-1,
   reason:match.matchWarning||'Brak pewnego dopasowania kursu i GPS'};
 }else if(server){
  // Zdarzenia na slupkach maja pierwszenstwo przed interpolacja.
  const verified=[...server.events.entries()].filter(([i,e])=>{
   const st=choice.etaStops[i];
   const plan=etaServiceMinutes(st?.departure||st?.arrival);
   return Number.isFinite(plan)&&Number.isFinite(e.time)&&e.dist<=35;
  }).sort((a,b)=>b[0]-a[0]);
  let confirmed=null;
  for(const [i,e] of verified){
   const st=choice.etaStops[i],plan=etaServiceMinutes(st.departure||st.arrival);
   const diff=e.time-plan;
   if(diff>=-3&&diff<=120){confirmed={delay:Math.max(0,Math.round(diff)),confirmedIndex:i};break;}
  }
  if(confirmed){
   prediction={...prediction,...confirmed,reason:'Pomiar GPS przy przystanku'};
  }else if(Number.isFinite(server.delay)&&server.delay>=-3&&server.delay<=120){
   // Wczesniej ten wynik byl kasowany przez !match.gpsVerified i events.size.
   prediction={...prediction,delay:Math.max(0,server.delay),
    confirmedIndex:Math.max(-1,server.currentIndex),
    reason:'Prognoza z dwoch zgodnych pomiarow GPS'};
  }
 }
 // v85: awaryjna, jawnie oznaczona estymacja z aktualnej pozycji GPS.
 // Nie udajemy potwierdzonego przejazdu przez przystanek: to prognoza,
 // tylko gdy kurs jest wiarygodny, GPS swiezy i blisko przebiegu.
 if(coursePlausible && prediction.delay===null && fit &&
    fit.distance<=55 && Number.isFinite(fit.time) &&
    Number.isFinite(gpsMs(v.Time)) &&
    Math.abs(Date.now()-gpsMs(v.Time))<=90000){
  const observed=etaObservedMinutes(gpsMs(v.Time),fit.time);
  const delta=observed-fit.time;
  if(delta>=-2 && delta<=120){
   const geoIndex=prediction.geo?.points?.findLast(p=>p.i<=fit.index)?.i ?? fit.index;
   prediction={...prediction,delay:Math.max(0,Math.round(delta)),
    confirmedIndex:Math.max(0,geoIndex),
    reason:'Szacunkowa prognoza z aktualnego położenia GPS (bez potwierdzenia przejazdu)'};
  }
 }
 // Potwierdzony postoj jako dodatkowe zrodlo, kiedy serwerowa historia
 // jeszcze nie zawiera wystarczajacych obserwacji.
 if(coursePlausible && prediction.delay===null){
  const live=etaObservedStopDelay(choice,v,prediction.geo);
  if(live)prediction={...prediction,...live};
 }
 const previous=etaRenderedCache.get(vehicleKey(v));
 if(coursePlausible&&prediction.delay===null&&previous&&previous.courseId===courseId&&
    previous.confirmedIndex>=0&&Date.now()-previous.at<300000&&
    gpsMs(v.Time)>=previous.stamp-90000){
  prediction={...prediction,delay:previous.delay,confirmedIndex:previous.confirmedIndex,
   reason:'Ostatnia wiarygodna prognoza GPS'};
 }
 if(coursePlausible&&Number.isFinite(prediction.delay)&&prediction.delay>=0&&
    prediction.confirmedIndex>=0){
  etaRenderedCache.set(vehicleKey(v),{courseId,delay:prediction.delay,
   confirmedIndex:prediction.confirmedIndex,currentIndex:prediction.currentIndex,
   stamp:gpsMs(v.Time),at:Date.now()});
 }
 const note=document.createElement('p');note.className='route-note';
 note.textContent='ETA: linia '+choice.course.line+', brygada '+choice.course.brigade+'. '+
  (names.matched?'Nazwy przystanków według dopasowanego GTFS. ':'Brak pewnego dopasowania nazw GTFS. ')+
  (prediction.delay!==null?'Szacowane odchylenie '+(prediction.delay>=0?'+':'')+prediction.delay+' min; '+prediction.reason+'.':'Godziny rozkładowe; '+prediction.reason+'.'+(server?' GPS: '+server.samples+' próbek w ostatnich 5 min.':' Brak dostępnej historii GPS dla tego przebiegu.'))+' Historia GPS jest zbierana na serwerze.';
 body.append(note);
 const list=document.createElement('ol');list.className='route-stops kind-'+(v.kind===2?'tram':'bus');
 const nearest=prediction.geo.near;
 const current=-1; // status przystanku wyznaczamy dopiero z położenia na odcinku
 choice.etaStops.forEach((stop,i)=>{
  const li=document.createElement('li');li.className='route-stop'+(i===current?' current':'')+(current>=0&&i<current?' passed':'');
  const j=names.mapping?.[i],mapped=Number.isInteger(j)&&j>=0?names.trip?.stops?.[j]:null;
  // v73: dla ETA priorytet ma jawna flaga z odcinków tego samego wariantu.
  // null = nieustalony; nie zastępuj go typem przypadkowego pobliskiego słupka.
  const stopFlag=stop.slupek_na_zadanie??stop.na_zadanie??stop.request_stop??mapped?.slupek_na_zadanie??null;
  if(stopFlag===1 || stopFlag==='1' || stopFlag===true)li.classList.add('request-stop');
  else if(stopFlag===0 || stopFlag==='0' || stopFlag===false)li.classList.add('fixed-stop');
  else li.classList.add('unknown-stop');

  const dot=document.createElement('span');dot.className='route-dot';
  const name=document.createElement('span');name.className='route-stop-name';name.textContent=names.names[i];
  const stopText=document.createElement('span');stopText.className='wtp-route-stop-text';stopText.append(name);
  const raw=(i===0 ? (stop.departure||stop.arrival) : (i===choice.etaStops.length-1 ? (stop.arrival||stop.departure) : (stop.departure||stop.arrival)))||'';
  const time=document.createElement('time');time.className='route-stop-time';
  const planned=etaServiceMinutes(raw);
  const pastEvent=coursePlausible?actualEvents.get(i):null; // v82: zdarzenia tylko dla wiarygodnie dopasowanego kursu
  const measured=pastEvent&&Number.isFinite(planned)?pastEvent.time:null;
  // Początek kursu: nie traktuj pozycji na pętli jako opóźnionego przyjazdu.
  // Planowy odjazd z pierwszego słupka pozostaje podstawą porównania.
  const safeMeasured=Number.isFinite(measured)&&measured>=planned-2&&measured<=planned+90?measured:null;
  const estimate=(i===0 ? null : (safeMeasured!==null?safeMeasured:(prediction.delay!==null&&prediction.confirmedIndex>=0&&prediction.delay>=0&&Number.isFinite(planned)&&i>=prediction.confirmedIndex?planned+prediction.delay:null)));
  if(estimate!==null&&Number.isFinite(estimate)&&Number.isFinite(planned)){
   const old=document.createElement('span');old.className='wtp-planned-time';old.textContent=displayClock(planned);
   old.style.cssText='display:block;text-decoration:line-through;color:#9299a0;font-size:12px;line-height:1.2;text-align:right';
   const next=document.createElement('strong');next.className='wtp-estimated-time';next.textContent=displayClock(estimate);
   next.style.cssText='display:block;color:#c9221c;font-weight:750;line-height:1.3;text-align:right';
   if(Math.abs(estimate-planned)<1){
    next.style.color='#19734b';
    time.append(next);
    time.title='Szacowany czas zgodny z rozkładem (GPS)';
   }else{
    time.append(old,next);
    time.title=safeMeasured!==null?'Godzina zaobserwowania GPS przy przystanku (niepotwierdzony odjazd)':'Szacowana godzina przyjazdu z GPS';
   }
  }else time.textContent=displayClock(raw);
  li.append(dot,stopText,time);list.append(li);
 });
 // v76: ustalaj położenie na ODCINKU między kolejnymi słupkami, nie na podstawie
 // samego najbliższego punktu (przy powtórzonych nazwach jest to niejednoznaczne).
 const geoPoints=prediction.geo?.points||[];
 const gpsLat=Number(v.Lat),gpsLon=Number(v.Lon);
 const gpsFresh=Number.isFinite(gpsMs(v.Time))&&Math.abs(Date.now()-gpsMs(v.Time))<90000;
 let location=null;
 if(gpsFresh && geoPoints.length>1){
  const candidates=[];
  for(let k=0;k<geoPoints.length-1;k++){
   const a=geoPoints[k],b=geoPoints[k+1],cos=Math.cos(gpsLat*Math.PI/180);
   const ax=a.lon*111195*cos,ay=a.lat*111195,bx=b.lon*111195*cos,by=b.lat*111195;
   const px=gpsLon*111195*cos,py=gpsLat*111195;
   const dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy;
   if(den<1)continue;
   const f=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/den));
   const distance=Math.hypot(px-ax-f*dx,py-ay-f*dy);
   // Chronologia kursu rozstrzyga powtarzające się odcinki i słupki.
   const t=nowWarsaw(new Date(gpsMs(v.Time)));
   const mid=(a.time+b.time)/2;
   const timePenalty=Number.isFinite(mid)?Math.min(900,Math.abs(t-mid)*18):0;
   const progressPenalty=prediction.currentIndex>=0&&a.i+1<prediction.currentIndex?250:0;
   candidates.push({a,b,f,distance,score:distance+timePenalty+progressPenalty});
  }
  candidates.sort((a,b)=>a.score-b.score);
  if(candidates[0]&&candidates[0].distance<=125)location=candidates[0];
 }
 if(location){
  const {a,b,f}=location;
  // v78: rozdziel dwa stany: przy słupku i w drodze do następnego.
  // Promień 35 m ogranicza fałszywe zaliczenia przystanku z odległości 65 m.
  const distanceA=geoDistance(gpsLat,gpsLon,a.lat,a.lon);
  const distanceB=geoDistance(gpsLat,gpsLon,b.lat,b.lon);
  const STOP_AT_RADIUS=35;
  // Przy skrzyżowaniach i powtórzonych słupkach rozstrzygaj chronologią kursu.
  const nearA=distanceA<=STOP_AT_RADIUS && (distanceA<=distanceB || f<0.5);
  const nearB=distanceB<=STOP_AT_RADIUS && (distanceB<distanceA || f>=0.5);
  const stopIndex=nearB?b.i:(nearA?a.i:-1);
  const fromIndex=a.i;
  const nextIndex=b.i;
  const label=document.createElement('span');label.className='wtp-next-stop';
  if(stopIndex>=0){
   label.textContent='Przystanek: '+names.names[stopIndex];
   list.children[stopIndex]?.querySelector('.wtp-route-stop-text')?.append(label);
   list.children[stopIndex]?.classList.add('current');
  }else{
   // Opis następnego przystanku zawsze POD PRZYSTANKIEM WYJAZDOWYM.
   label.textContent='Następny przystanek: '+names.names[nextIndex];
   list.children[fromIndex]?.querySelector('.wtp-route-stop-text')?.append(label);
  }
  const marker=document.createElement('span');marker.className='wtp-vehicle-on-route';
  const img=document.createElement('img');img.src=v.kind===2?'icons/WTP-tramwaj.svg':'icons/WTP-autobus.svg';
  img.alt=v.kind===2?'Tramwaj':'Autobus';marker.append(img);
  marker.title=stopIndex>=0?'Pojazd przy przystanku (GPS)':'Przybliżona pozycja GPS między przystankami';
  list.append(marker);
  const positionMarker=()=>{
   const first=list.children[a.i],second=list.children[b.i];
   if(!first||!second)return;
   const y1=first.offsetTop+first.offsetHeight/2;
   const y2=second.offsetTop+second.offsetHeight/2;
   const y=stopIndex===a.i?y1:stopIndex===b.i?y2:y1+(y2-y1)*Math.max(0.06,Math.min(0.94,f));
   marker.style.top=y+'px';
  };
  requestAnimationFrame(()=>{
   positionMarker();
   // v81: otwieraj panel w miejscu pojazdu; również po odświeżeniu GPS.
   if(body.contains(marker)){
    const target=marker.offsetTop + marker.offsetHeight/2;
    body.scrollTop=Math.max(0,target-body.clientHeight/2);
   }
  });
 }

 body.append(list);
 if(current>=0&&list.children[current]?.classList.contains('current')){const active=list.children[current];if(active)requestAnimationFrame(()=>{if(body.contains(active))body.scrollTop=Math.max(0,active.offsetTop-list.offsetTop-body.clientHeight/2)});}
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
  decorateRouteStop(li,item[2],item[3]);
  const dot=document.createElement('span');dot.className='route-dot';
  const name=document.createElement('span');name.className='route-stop-name';name.textContent=item[1];
  const t=displayTimeCell(item,i,observed);
  li.append(dot,name,t);list.append(li);
 });body.append(list);
}
let vehiclePanelRequest=0;
const etaPanelMatches=new Map();
const etaPanelReady=new Map();
async function openVehiclePanel(v){
 const serial=++vehiclePanelRequest,panel=$('vehiclePanel');panel.hidden=false;
 const line=String(v.Lines||'?'),brigade=String(v.Brigade||'?'),number=String(v.VehicleNumber||'?');
 $('vehicleHeading').textContent=`${line} · ${v.kind===2?'Tramwaj':'Autobus'} · brygada ${brigade} · tabor ${number}`;
 const body=$('vehicleBody');body.replaceChildren();
 const cacheKey=vehicleKey(v);
 const ready=etaPanelReady.get(cacheKey);
 if(ready && Date.now()-ready.at<45000){
  // Pokaż ostatnio znany rozkład od razu, bez czekania na sieć.
  chooseLiveEtaCourse(ready.match,v,ready.trips);
  renderEtaRoute(ready.match,v,body,ready.trips);
 }else{
  const note=document.createElement('p');note.className='route-note';note.textContent='Pobieranie rozkładu ETA linii '+line+', brygady '+brigade+'…';body.append(note);
 }
 try{
  // Nie uzależniaj rozkładu brygady od zgodności GPS/GTFS.
  const gpsFetch=fetchServerGps(v).catch(e=>{console.warn('Historia GPS:',e.message);return null});
  const cached=etaPanelMatches.get(cacheKey);
  const matchPromise=cached&&Date.now()-cached.at<45000?Promise.resolve(cached.match):etaMatchVehicle(v);
  const tripsPromise=ready&&Date.now()-ready.at<45000?Promise.resolve(ready.trips):loadGtfs(line).then(data=>data.date===todayWarsaw()?(data.trips||[]):[]).catch(e=>{console.warn('GTFS: brak nazw przystanków',e.message);return []});
  const [matched,trips]=await Promise.all([matchPromise,tripsPromise]);
  if(!cached||Date.now()-cached.at>=45000)etaPanelMatches.set(cacheKey,{at:Date.now(),match:matched});
  if(serial!==vehiclePanelRequest||panel.hidden)return;
  if(serial!==vehiclePanelRequest||panel.hidden)return;
  if(serial!==vehiclePanelRequest||panel.hidden)return;
  chooseLiveEtaCourse(matched,v,trips);
  etaPanelReady.set(cacheKey,{match:matched,trips,at:Date.now()});
  renderEtaRoute(matched,v,body,trips);
  gpsFetch.then(positions=>{if(positions?.length && serial===vehiclePanelRequest&&!panel.hidden){chooseLiveEtaCourse(matched,v,trips);renderEtaRoute(matched,v,body,trips)}});
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

window.addEventListener('DOMContentLoaded',()=>{const mobileToggle=$('mobileFilters');if(mobileToggle){mobileToggle.onclick=()=>{const panel=document.querySelector('#mapa > aside');const open=panel?.classList.toggle('wtp-mobile-open');mobileToggle.setAttribute('aria-expanded',String(!!open));mobileToggle.textContent=open?'Zamknij filtry':'Filtry mapy';setTimeout(()=>map?.invalidateSize(),100);};}if(typeof L!=='undefined'){map=L.map('map').setView([52.2297,21.0122],11);map.createPane('stopsPane');map.getPane('stopsPane').style.zIndex='410';map.createPane('vehiclesPane');map.getPane('vehiclesPane').style.zIndex='650';L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layer=L.layerGroup().addTo(map);stopLayer=L.layerGroup().addTo(map);map.on('moveend',()=>{renderStopMarkers();draw()});map.on('click',()=>{if(!$('vehiclePanel').hidden){stopPaneRequest++;vehiclePanelRequest++;$('vehiclePanel').hidden=true;hoveredStopLine='';draw();}})}else{$('status').textContent='Nie udało się załadować biblioteki mapy Leaflet.'}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));window.addEventListener('popstate',()=>setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false));setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false);$('closeVehicle').onclick=()=>{vehiclePanelRequest++;stopPaneRequest++;hoveredStopLine='';pinnedStopLine='';pinnedStopVehicle=null;$('vehiclePanel').hidden=true;draw()};$('refresh').onclick=refresh;$('showStops').checked=true;$('showStops').onchange=toggleStopMap;toggleStopMap();for(const id of ['line','bus','tram'])$(id).addEventListener(id==='line'?'input':'change',draw);$('find').onclick=searchStops;$('stop').onkeydown=e=>{if(e.key==='Enter')searchStops()};if(PROXY){publishVehicles();$('status').textContent='Łączenie z API Warszawy…';refresh()}else $('status').textContent='Brak adresu Workera w config.js.';setInterval(()=>{if(PROXY && !document.hidden)refresh()},8000)});

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