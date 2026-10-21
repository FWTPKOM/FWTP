// WTP LIVE v22 – walidacja świeżości GPS, aktualności GTFS i bezpieczne dopasowanie kursu.
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
async function request(path,params={}){if(!PROXY)throw Error('Nie skonfigurowano adresu Cloudflare Workera w config.js.');const url=new URL(PROXY+path);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('Serwer API: HTTP '+response.status);const data=await response.json();if(data.error)throw Error(typeof data.error==='string'?data.error:'Błąd API');return data;}
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
function validTime(t){return /^\d{1,2}:\d{2}(?::\d{2})?$/.test(String(t??'').trim())}
let stopLayer,showStopMarkers=false,stopMapLoading=false;
function stopCoordinates(row){
  const lat=Number(value(row,'szer_geo')||value(row,'lat')||value(row,'latitude'));
  const lon=Number(value(row,'dlug_geo')||value(row,'lon')||value(row,'longitude'));
  return Number.isFinite(lat)&&Number.isFinite(lon)&&lat>51&&lat<53&&lon>19&&lon<23?[lat,lon]:null;
}
async function toggleStopMap(){
  showStopMarkers=$('showStops').checked;
  if(!showStopMarkers){stopLayer.clearLayers();return}
  if(stopMapLoading)return;
  stopMapLoading=true;
  $('stopStatus').textContent='Pobieranie przystanków…';
  try{
    if(!stops.length)stops=normalizedRows(await request('/stops'));
    renderStopMarkers();
  }catch(e){$('stopStatus').textContent='Błąd przystanków: '+e.message}
  finally{stopMapLoading=false}
}
function renderStopMarkers(){
  if(!showStopMarkers||!stopLayer)return;
  stopLayer.clearLayers();
  const bounds=map.getBounds();let shown=0;
  // Ograniczenie liczby punktów przy małym przybliżeniu.
  if(map.getZoom()<13){$('stopStatus').textContent='Przybliż mapę do poziomu 13, aby zobaczyć przystanki.';return}
  for(const row of stops){
    const coords=stopCoordinates(row);if(!coords||!bounds.contains(coords))continue;
    const z=String(value(row,'zespol')),n=String(value(row,'slupek')),name=String(value(row,'nazwa_zespolu'));
    if(!z||!n)continue;
    const marker=L.circleMarker(coords,{radius:6,color:'#075e54',weight:2,fillColor:'#fff',fillOpacity:1});
    marker.bindTooltip(escapeHTML(name)+' '+escapeHTML(n),{direction:'top'});
    marker.bindPopup(`<b>${escapeHTML(name)} ${escapeHTML(n)}</b><br>Sprawdź linie i kierunki odjazdów.<br><button class="open-stop">Zobacz odjazdy</button>`);
    marker.on('popupopen',()=>{
      const btn=marker.getPopup()?.getElement()?.querySelector('.open-stop');
      if(btn)btn.onclick=()=>{
        document.querySelector('[data-tab="odjazdy"]').click();
        $('stop').value=name;
        $('results').textContent=`Wybrano ${name} ${n}`;
        showLines(z,n,name);
      };
    });
    marker.addTo(stopLayer);shown++;
    if(shown>=450)break;
  }
  $('stopStatus').textContent=`Przystanki w widoku: ${shown}. Kierunki sprawdzisz po wybraniu przystanku i linii.`;
}
const lastLocations=new Map();
function direction(lat1,lon1,lat2,lon2){
  const rad=Math.PI/180;
  const y=Math.sin((lon2-lon1)*rad)*Math.cos(lat2*rad);
  const x=Math.cos(lat1*rad)*Math.sin(lat2*rad)-Math.sin(lat1*rad)*Math.cos(lat2*rad)*Math.cos((lon2-lon1)*rad);
  return (Math.atan2(y,x)*180/Math.PI+360)%360;
}
function vehicleKey(v){return v.kind+':'+String(v.VehicleNumber??'')+':'+String(v.Lines??'')+':'+String(v.Brigade??'')}
function updateHeadings(rows){
  const now=Date.now();
  for(const v of rows){
    const key=vehicleKey(v),lat=Number(v.Lat),lon=Number(v.Lon),stamp=Date.parse(String(v.Time||'').replace(' ','T'));
    if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
    const prev=lastLocations.get(key);
    if(prev && Number.isFinite(stamp) && stamp>prev.stamp && stamp-prev.stamp<180000 && now-prev.seen<180000){
      const meters=Math.hypot((lat-prev.lat)*111000,(lon-prev.lon)*68000);
      if(meters>=12 && meters<2000)v._bearing=direction(prev.lat,prev.lon,lat,lon);
      else v._bearing=prev.bearing;
    }else if(prev)v._bearing=prev.bearing;
    if(!prev || !Number.isFinite(stamp) || stamp>=prev.stamp)lastLocations.set(key,{lat,lon,stamp,bearing:v._bearing,seen:now});
  }
  for(const [k,v] of lastLocations)if(now-v.seen>600000)lastLocations.delete(k);
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
    const arrow=Number.isFinite(v._bearing)
      ? `<span class="badge-direction" title="Kierunek ruchu wyliczony z GPS"><svg viewBox="0 0 24 24" style="transform:rotate(${v._bearing}deg)" aria-hidden="true"><path d="M12 3 5 15l7-3 7 3z" fill="currentColor"/><path d="M12 11v10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></span>`
      : `<span class="badge-direction unknown" title="Kierunek oczekuje na drugi aktualny odczyt GPS">?</span>`;
    const vehicleSymbol=`<svg class="badge-vehicle" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="16" rx="3" fill="currentColor"/><rect x="7.5" y="5" width="9" height="6" rx=".8" fill="#fff"/><circle cx="8.5" cy="19" r="1.8" fill="currentColor"/><circle cx="15.5" cy="19" r="1.8" fill="currentColor"/></svg>`;
    const directionName=v._headsign;
    const directionTitle=directionName ? 'Kierunek: '+directionName : (Number.isFinite(v._bearing)?'Kierunek ruchu GPS':'Kierunek jeszcze nieustalony');
    const content=zoom<11?'<span class="vehicle-dot"></span>':zoom<14?`<span class="vehicle-mini">${escapeHTML(line)}</span>`:`<div class="vehicle-badge">${arrow}${vehicleSymbol}<span class="badge-line">${escapeHTML(line)}</span><span class="badge-divider">/</span><span class="badge-brigade">${escapeHTML(brigade)}</span><span class="badge-divider">/</span><span class="badge-number">${escapeHTML(number)}</span>${directionName?`<span class="badge-headsign"> → ${escapeHTML(directionName)}</span>`:''}</div>`;
    const icon=L.divIcon({className:'vehicle-icon'+(v.kind===2?' tram':'')+(zoom<11?' dot-mode':zoom<14?' mini-mode':''),html:content,iconSize:[1,1],iconAnchor:[0,0]});
    const marker=L.marker([lat,lon],{icon,zIndexOffset:0,title:directionTitle});
    if(directionName)marker.bindTooltip(escapeHTML('Kierunek: '+directionName),{direction:'top'});
    const gps=String(v.Time??'');
    marker.on('click',()=>{selectedLine=line;selectedBrigade=brigade;focusedVehicle={...v};openVehiclePanel(v);});
    marker.addTo(layer);count++;
  }
  $('count').textContent='Widoczne pojazdy: '+count+' / '+vehicles.length;
}
let selectedLine='',selectedBrigade='';
let busy=false;
// Każdy typ pojazdu pobieramy osobno: awaria 522 nie blokuje drugiego.
// Przechowujemy ostatni udany odczyt, ale nie udajemy, że jest bieżący.
const lastSuccessful={1:null,2:null};
const MAX_SNAPSHOT_AGE=120000;
async function fetchFleet(type){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  try{
    const url=new URL(PROXY+'/live');url.searchParams.set('type',String(type));
    const response=await fetch(url,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw Error('HTTP '+response.status);
    const body=await response.json();
    const rows=unpack(body);
    const normalized=rows.filter(v=>v&&typeof v==='object').map(v=>({...v,kind:type}));
    lastSuccessful[type]={at:Date.now(),rows:normalized};
    return {rows:normalized,error:null,stale:false};
  }catch(e){
    const cache=lastSuccessful[type];
    if(cache&&Date.now()-cache.at<MAX_SNAPSHOT_AGE)
      return {rows:cache.rows,error:e.message,stale:true};
    return {rows:[],error:e.name==='AbortError'?'przekroczono 12 s':e.message,stale:false};
  }finally{clearTimeout(timeout)}
}
async function refresh(){
  if(busy)return;
  busy=true;
  $('status').classList.remove('error');
  $('status').textContent=vehicles.length?'Aktualizowanie pojazdów…':'Pobieranie pojazdów (maks. 12 sekund)…';
  try{
    const [b,t]=await Promise.all([fetchFleet(1),fetchFleet(2)]);
    const next=[...b.rows,...t.rows];
    // Nie usuwamy dotychczasowej mapy w przypadku krótkotrwałego błędu serwera.
    if(next.length||!vehicles.length){
      const previous=new Map(vehicles.map(v=>[vehicleIdentity(v),v]));
      vehicles=next;
      for(const v of vehicles){
        const old=previous.get(vehicleIdentity(v));
        if(old){if(old._headsign)v._headsign=old._headsign;if(Number.isFinite(old._bearing))v._bearing=old._bearing}
      }
      updateHeadings(vehicles);
      applyKnownDirections();
      draw();
      // Dopasowanie GTFS nie może blokować odświeżania pojazdów.
      queueDirections().catch(err=>console.warn('GTFS:',err));
      fetchServerHeadings().catch(()=>{});
    }
    const errors=[b.error&&'autobusy: '+b.error,t.error&&'tramwaje: '+t.error].filter(Boolean);
    $('status').textContent='Ostatnia próba: '+new Date().toLocaleTimeString('pl-PL')+
      ' | Autobusy: '+b.rows.length+', tramwaje: '+t.rows.length+
      (errors.length?' | Problem API: '+errors.join('; '):'')+
      (b.stale||t.stale?' | część pozycji z poprzedniego odczytu':'');
    if(errors.length)$('status').classList.add('error');
  }catch(e){$('status').textContent='Błąd mapy: '+e.message;$('status').classList.add('error');console.error(e)}
  finally{busy=false}
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
 const lat=Number(v.Lat),lon=Number(v.Lon),when=new Date(String(v.Time||'').replace(' ','T'));
 if(!Number.isFinite(when.getTime()))return null;
 // API podaje czas lokalny Warszawy bez strefy. Nie interpretujemy go jako UTC.
 const age=Math.abs(Date.now()-when.getTime());if(age>10*60*1000)return null;
 const time=when.getHours()*60+when.getMinutes();
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
 if(choices.length>1&&choices[1].score-choices[0].score<120)return null;
 return {choice:choices[0],ambiguous:choices.length>1&&choices[1].score-choices[0].score<300};
}

// v21: wyznaczanie kierunku od pierwszego pobrania z dziennego GTFS.
// Kierunek tekstowy oznacza przystanek docelowy kursu, nie kierunek kompasowy.
const directionMemo=new Map();
const directionLoading=new Set();
let directionGeneration=0;
function vehicleIdentity(v){return v.kind+':'+String(v.VehicleNumber||'')+':'+String(v.Lines||'')+':'+String(v.Brigade||'')}
function parseGpsLocal(t){
 const m=String(t||'').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
 if(!m)return null;
 // Czas z API bywa UTC albo lokalny. Ustalamy wariant bliższy teraz.
 const utc=Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6]);
 const localCandidates=[utc-3600000,utc-7200000];
 const now=Date.now();
 return [utc,...localCandidates].sort((a,b)=>Math.abs(now-a)-Math.abs(now-b))[0];
}
function applyKnownDirections(){
 for(const v of vehicles){
  const d=directionMemo.get(vehicleIdentity(v));
  if(d && Date.now()-d.saved<180000){v._headsign=d.name;v._tripMatch=d.match}
 }
}
function chooseDirectionFromGtfs(trips,v){
 const lat=Number(v.Lat),lon=Number(v.Lon),epoch=parseGpsLocal(v.Time);
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||!Number.isFinite(epoch)||Math.abs(Date.now()-epoch)>12*60000)return null;
 const tm=nowWarsaw(new Date(epoch));
 const bearing=Number.isFinite(v._bearing)?v._bearing:null;
 const options=[];
 for(const trip of trips){
  const ss=trip.stops;if(!Array.isArray(ss)||ss.length<2)continue;
  const first=minutes(ss[0][4]),last=minutes(ss[ss.length-1][4]);
  if(!Number.isFinite(first)||!Number.isFinite(last))continue;
  const timeCandidates=[tm,tm+1440];
  if(!timeCandidates.some(x=>x>=first-15&&x<=last+15))continue;
  let best=Infinity,idx=-1,distBest=Infinity;
  for(let i=0;i<ss.length;i++){
   const s=ss[i],t=minutes(s[4]);if(!Number.isFinite(t))continue;
   const delta=Math.min(...timeCandidates.map(x=>Math.abs(t-x)));
   if(delta>28)continue;
   const dist=geoDistance(lat,lon,Number(s[2]),Number(s[3]));
   if(!Number.isFinite(dist)||dist>1100)continue;
   let score=dist+delta*85;
   if(bearing!==null&&i<ss.length-1){
    const a=ss[i],b=ss[i+1];const dir=direction(Number(a[2]),Number(a[3]),Number(b[2]),Number(b[3]));
    const diff=Math.abs(((dir-bearing+540)%360)-180);
    if(diff>100)score+=400;
   }
   if(score<best){best=score;idx=i;distBest=dist}
  }
  if(idx>=0)options.push({trip,index:idx,score:best,distance:distBest});
 }
 options.sort((a,b)=>a.score-b.score);
 if(!options.length||options[0].distance>650)return null;
 const winner=options[0];
 // Różne kierunki o zbliżonej punktacji: nie pokazuj fałszywego celu.
 const competing=options.find(x=>x.trip.headsign!==winner.trip.headsign && x.score-winner.score<200);
 if(competing)return null;
 const name=String(winner.trip.headsign||winner.trip.stops.at(-1)?.[1]||'').trim();
 if(!name)return null;
 return {name,match:winner};
}
async function queueDirections(){
 const gen=++directionGeneration;
 const visible=vehicles.filter(v=>map&&map.getBounds().contains([Number(v.Lat),Number(v.Lon)]));
 const lines=[...new Set(visible.map(v=>String(v.Lines||'')).filter(Boolean))];
 // Limit równoległości chroni GitHub Pages i przeglądarkę przed setkami żądań.
 let cursor=0;
 async function worker(){while(cursor<lines.length){
  const line=lines[cursor++];if(directionLoading.has(line))continue;
  directionLoading.add(line);
  try{
   const data=await loadGtfs(line);
   if(data.date!==todayWarsaw())continue;
   let changed=false;
   for(const v of vehicles){if(String(v.Lines)!==line)continue;
    const key=vehicleIdentity(v),old=directionMemo.get(key);
    if(old&&Date.now()-old.saved<90000)continue;
    const matched=chooseDirectionFromGtfs(data.trips,v);
    if(matched){v._headsign=matched.name;v._tripMatch=matched.match;directionMemo.set(key,{...matched,saved:Date.now()});changed=true}
   }
   if(changed&&gen===directionGeneration)draw();
  }catch(e){/* pojedyncza linia nie może zatrzymać całej mapy */}
  finally{directionLoading.delete(line)}
 }}
 await Promise.all(Array.from({length:Math.min(4,lines.length)},worker));
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
  if(!match){note.textContent='Nie można potwierdzić kursu na podstawie aktualnego GPS i GTFS (pozycja może być nieaktualna albo kurs niejednoznaczny). Nie wyświetlamy przypadkowej trasy.';return}
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

window.addEventListener('DOMContentLoaded',()=>{if(typeof L!=='undefined'){map=L.map('map').setView([52.2297,21.0122],11);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layer=L.layerGroup().addTo(map);stopLayer=L.layerGroup().addTo(map);map.on('moveend',()=>{if(showStopMarkers)renderStopMarkers();draw()})}else{$('status').textContent='Nie udało się załadować biblioteki mapy Leaflet.'}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));window.addEventListener('popstate',()=>setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false));setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false);$('closeVehicle').onclick=()=>{vehiclePanelRequest++;$('vehiclePanel').hidden=true};$('refresh').onclick=refresh;$('showStops').onchange=toggleStopMap;for(const id of ['line','bus','tram'])$(id).addEventListener(id==='line'?'input':'change',draw);$('find').onclick=searchStops;$('stop').onkeydown=e=>{if(e.key==='Enter')searchStops()};if(PROXY){$('status').textContent='Łączenie z API Warszawy…';refresh()}else $('status').textContent='Brak adresu Workera w config.js.';setInterval(()=>{if(PROXY)refresh()},15000)});

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

// Kierunek GPS z historii KV Workera; działa od pierwszego otwarcia, gdy Worker ma pomiary.
async function fetchServerHeadings(){try{const data=await request('/headings');const h=data.headings||{};let changed=false;for(const v of vehicles){const key=v.kind+':'+String(v.VehicleNumber||'');const x=h[key]||h[vehicleIdentity(v)];if(x&&Number.isFinite(Number(x.bearing))){v._bearing=Number(x.bearing);changed=true}}if(changed)draw()}catch(e){/* bez historii nadal działa GTFS */}}
