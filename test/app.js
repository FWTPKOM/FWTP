// WTP LIVE v44 – walidacja świeżości GPS, aktualności GTFS i bezpieczne dopasowanie kursu.
const $=id=>document.getElementById(id);
const PROXY=String(window.WTP_API_PROXY||'').replace(/\/$/,'');
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let map,layer,vehicles=[],stops=[];
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
// WTP LIVE v44 — przystanki: metadane wszystkich tras GTFS, nie tylko pojazdów w kadrze.
let stopLayer,showStopMarkers=true,stopMapLoading=false;
const STOP_DOT_ZOOM=13,STOP_ARROW_ZOOM=16;
let stopMeta=[],stopMetaLoading=false,stopMetaReady=false;
function stopCoordinates(row){
 const lat=Number(value(row,'szer_geo')||value(row,'lat')||value(row,'latitude'));
 const lon=Number(value(row,'dlug_geo')||value(row,'lon')||value(row,'longitude'));
 return Number.isFinite(lat)&&Number.isFinite(lon)&&lat>51&&lat<53&&lon>19&&lon<23?[lat,lon]:null;
}
function stopDirectionSvg(deg,color){return `<svg width="18" height="18" viewBox="0 0 24 24" style="transform:rotate(${Math.round(deg)}deg)" aria-hidden="true"><path d="M12 2 L21 21 L12 17 L3 21 Z" fill="${color}" stroke="white" stroke-width="1.6"/></svg>`}
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
  let marker;
  if(Number.isFinite(bearing)){
   marker=L.marker(coords,{icon:L.divIcon({className:'wtp-stop-icon',html:`<span class="wtp-stop-arrow" style="border-color:${color}">${stopDirectionSvg(bearing,color)}</span>`,iconSize:[23,23],iconAnchor:[11,11]})});withDirection++;
  }else marker=L.circleMarker(coords,{radius:zoom>=STOP_ARROW_ZOOM?5:3.5,color,weight:2,fillColor:'#fff',fillOpacity:1});
  const mode=bus&&tram?'Autobusowo-tramwajowy':tram?'Tramwajowy':bus?'Autobusowy':'Rodzaj nieustalony';
  marker.bindTooltip(escapeHTML(name)+' '+escapeHTML(n)+' · '+mode,{direction:'top'});
  marker.bindPopup(`<b>${escapeHTML(name)} ${escapeHTML(n)}</b><br>${mode}<br><button class="open-stop">Zobacz odjazdy</button>`);
  marker.on('popupopen',()=>{const btn=marker.getPopup()?.getElement()?.querySelector('.open-stop');if(btn)btn.onclick=()=>{document.querySelector('[data-tab="odjazdy"]').click();$('stop').value=name;$('results').textContent=`Wybrano ${name} ${n}`;showLines(z,n,name)}});
  marker.addTo(stopLayer);shown++;if(shown>=650)break;
 }
 $('stopStatus').textContent=`Przystanki: ${shown}; strzałki: ${withDirection}. Fioletowy: autobus · czerwony: tramwaj · pomarańczowy: oba.`+(stopMetaReady?'':' Trwa wczytywanie danych GTFS.');
}
// WTP LIVE v42: historia pomiarów GPS; nie myli czasu GPS z czasem pobrania.
const lastLocations=new Map();
const HISTORY_KEY='wtp-live-v44-gps';
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
    const marker=L.marker([lat,lon],{icon,zIndexOffset:0});
    const gps=String(v.Time??'');
    marker.on('click',()=>{selectedLine=line;selectedBrigade=brigade;focusedVehicle={...v};openVehiclePanel(v);});
    marker.addTo(layer);count++;
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
function chooseGtfsTrip(trips,v){
 const lat=Number(v.Lat),lon=Number(v.Lon),when=new Date(gpsMs(v.Time));
 if(!Number.isFinite(when.getTime()))return null;
 // Porównanie GPS jako UTC z lokalnym czasem rozkładu w Warszawie.
 const age=Math.abs(Date.now()-when.getTime());if(age>10*60*1000)return null;
 const time=nowWarsaw(when);
 const choices=[];
 for(const trip of trips){const ss=trip.stops;if(!ss||ss.length<2)continue;
  const first=minutes(ss[0][4]),last=minutes(ss.at(-1)[4]);
  if(!Number.isFinite(first)||!Number.isFinite(last)||time<first-12||time>last+12)continue;
  let best=Infinity,index=-1;
  for(let i=0;i<ss.length;i++){
   const t=minutes(ss[i][4]);const dt=Math.abs(t-time);if(dt>40)continue;
   const dist=geoDistance(lat,lon,ss[i][2],ss[i][3]);
   // Dopasowanie nie utożsamia najbliższego przystanku z potwierdzoną lokalizacją pojazdu.
   const score=dist+dt*95;
   if(score<best){best=score;index=i}
  }
  if(index>=0)choices.push({trip,index,score:best,distance:geoDistance(lat,lon,ss[index][2],ss[index][3])});
 }
 choices.sort((a,b)=>a.score-b.score);
 if(!choices.length||choices[0].distance>900)return null;
 // Zbliżone kursy są pokazywane jako orientacyjne, nie jako potwierdzone.
 return {choice:choices[0],ambiguous:choices.length>1&&choices[1].score-choices[0].score<300};
}
let vehiclePanelRequest=0;
async function openVehiclePanel(v){
 const serial=++vehiclePanelRequest,panel=$('vehiclePanel');panel.hidden=false;
 const line=String(v.Lines||'?'),brigade=String(v.Brigade||'?'),number=String(v.VehicleNumber||'?');
 $('vehicleHeading').textContent=`${line} · ${v.kind===2?'Tramwaj':'Autobus'} · brygada ${brigade} · tabor ${number}`;
 const body=$('vehicleBody');body.replaceChildren();
 const note=document.createElement('p');note.className='route-note';note.textContent='Dopasowywanie kursu do rozkładu GTFS i pozycji GPS…';body.append(note);
 try{
  const data=await loadGtfs(line);if(serial!==vehiclePanelRequest||panel.hidden)return;
  const dateWarsaw=todayWarsaw();
  if(dateWarsaw!==data.date){note.textContent='Rozkład GTFS pochodzi z '+data.date+'. Automatyczna aktualizacja GTFS jest opóźniona. Nie wyświetlamy nieaktualnych godzin.';return}
  const match=chooseGtfsTrip(data.trips,v);
  if(!match){
    note.textContent='Nie można potwierdzić bieżącego kursu z GPS. Poniżej możesz wybrać planową trasę linii '+line+' (bez oznaczania aktualnego przystanku).';
    const options=document.createElement('div');options.className='lines';body.append(options);
    const byRoute=new Map();for(const trip of (data.trips||[])){if(!Array.isArray(trip.stops)||trip.stops.length<2)continue;const key=(trip.headsign||'Kierunek nieznany')+'|'+trip.stops.map(s=>s[0]).join(',');if(!byRoute.has(key))byRoute.set(key,trip)}
    for(const trip of [...byRoute.values()].slice(0,25)){
      const btn=document.createElement('button');btn.textContent=trip.headsign||'Trasa bez nazwy';btn.onclick=()=>{
        body.querySelectorAll('.route-stops').forEach(x=>x.remove());const list=document.createElement('ol');list.className='route-stops kind-'+(v.kind===2?'tram':'bus');
        trip.stops.forEach(item=>{const li=document.createElement('li');li.className='route-stop';const dot=document.createElement('span');dot.className='route-dot';const name=document.createElement('span');name.className='route-stop-name';name.textContent=item[1];const time=document.createElement('time');time.className='route-stop-time';time.textContent=item[4];li.append(dot,name,time);list.append(li)});body.append(list);
      };options.append(btn)
    }
    if(!byRoute.size)note.textContent+=' Brak tras w pliku GTFS.';
    return;
   }
  const {trip,index,distance}=match.choice;
  body.replaceChildren();
  const heading=document.createElement('p');heading.className='route-note';heading.textContent='Kierunek: '+(trip.headsign||'nieustalony')+' · godziny planowe · kurs dobrany orientacyjnie na podstawie GPS i czasu'+(match.ambiguous?' (kilka możliwych kursów)':'')+'. Brygada nie jest powiązana bezpośrednio z GTFS.';body.append(heading);
  const list=document.createElement('ol');list.className='route-stops kind-'+(v.kind===2?'tram':'bus');
  trip.stops.forEach((item,i)=>{
   const li=document.createElement('li');li.className='route-stop'+(i===index?' current':'')+(i<index?' passed':'');
   const dot=document.createElement('span');dot.className='route-dot';
   const name=document.createElement('span');name.className='route-stop-name';name.textContent=item[1];
   const t=document.createElement('time');t.className='route-stop-time';t.textContent=item[4];
   li.append(dot,name,t);list.append(li);
  });body.append(list);
  const active=list.children[index];if(active)active.scrollIntoView({block:'nearest',behavior:'smooth'});
 }catch(e){if(serial===vehiclePanelRequest)note.textContent='Nie udało się wczytać GTFS: '+e.message}
}
function setTab(tab,record=true){
 document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('selected',x.dataset.tab===tab));
 document.querySelectorAll('main section').forEach(x=>x.classList.toggle('active',x.id===tab));
 if(record && location.hash!=='#'+tab)history.pushState({tab},'', '#'+tab);
 if(tab==='mapa'&&map)setTimeout(()=>map.invalidateSize(),100);
}

window.addEventListener('DOMContentLoaded',()=>{if(typeof L!=='undefined'){map=L.map('map').setView([52.2297,21.0122],11);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layer=L.layerGroup().addTo(map);stopLayer=L.layerGroup().addTo(map);map.on('moveend',()=>{renderStopMarkers();draw()})}else{$('status').textContent='Nie udało się załadować biblioteki mapy Leaflet.'}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));window.addEventListener('popstate',()=>setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false));setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false);$('closeVehicle').onclick=()=>{vehiclePanelRequest++;$('vehiclePanel').hidden=true};$('refresh').onclick=refresh;$('showStops').checked=true;$('showStops').onchange=toggleStopMap;toggleStopMap();for(const id of ['line','bus','tram'])$(id).addEventListener(id==='line'?'input':'change',draw);$('find').onclick=searchStops;$('stop').onkeydown=e=>{if(e.key==='Enter')searchStops()};if(PROXY){publishVehicles();$('status').textContent='Łączenie z API Warszawy…';refresh()}else $('status').textContent='Brak adresu Workera w config.js.';setInterval(()=>{if(PROXY)refresh()},15000)});

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
