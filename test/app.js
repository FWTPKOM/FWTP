// WTP LIVE v10 – kolory znaczników i rogi 7px; logika danych bez zmian.
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
    const content=`<div class="vehicle-badge">${arrow}${vehicleSymbol}<span class="badge-line">${escapeHTML(line)}</span><span class="badge-divider">/</span><span class="badge-brigade">${escapeHTML(brigade)}</span><span class="badge-divider">/</span><span class="badge-number">${escapeHTML(number)}</span></div>`;
    const icon=L.divIcon({className:'vehicle-icon'+(v.kind===2?' tram':''),html:content,iconSize:[1,1],iconAnchor:[0,0]});
    const marker=L.marker([lat,lon],{icon,zIndexOffset:0});
    const gps=String(v.Time??'');
    marker.bindPopup(`<b>${v.kind===1?'Autobus':'Tramwaj'} ${escapeHTML(line)}</b><br>Brygada: ${escapeHTML(brigade)}<br>Numer taborowy: ${escapeHTML(number)}<br>Ostatnia pozycja GPS: ${escapeHTML(gps)}<br><small>Kierunek strzałki ustalany z kolejnych pozycji GPS.</small><br><button class="popup-timetable">Rozkład i trasa pojazdu</button>`);
    marker.on('popupopen',()=>{
      const btn=marker.getPopup()?.getElement()?.querySelector('.popup-timetable');
      if(btn)btn.onclick=()=>{
        selectedLine=line;selectedBrigade=brigade;focusedVehicle={...v};
        $('stop').placeholder='Wpisz przystanek obsługiwany przez linię '+line;
        document.querySelector('[data-tab="odjazdy"]').click();
        $('results').textContent='Linia '+line+', brygada '+brigade+', pojazd '+number+'. Wyszukaj przystanek, aby zobaczyć odjazdy i pozycję pojazdu.';
        $('stop').focus();
      };
    });
    marker.addTo(layer);count++;
  }
  $('count').textContent='Widoczne pojazdy: '+count+' / '+vehicles.length;
}
let selectedLine='',selectedBrigade='';
let busy=false;
async function refresh(){if(busy)return;busy=true;$('status').classList.remove('error');$('status').textContent='Pobieranie pojazdów…';try{const [b,t]=await Promise.all([request('/live',{type:1}),request('/live',{type:2})]);const buses=unpack(b),trams=unpack(t);vehicles=[...buses.map(v=>({...v,kind:1})),...trams.map(v=>({...v,kind:2}))];updateHeadings(vehicles);draw();$('status').textContent='Ostatnie pobranie: '+new Date().toLocaleTimeString('pl-PL')+' | Autobusy: '+buses.length+', tramwaje: '+trams.length;}catch(e){$('status').textContent='Błąd: '+e.message;$('status').classList.add('error')}finally{busy=false}}
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
window.addEventListener('DOMContentLoaded',()=>{if(typeof L!=='undefined'){map=L.map('map').setView([52.2297,21.0122],11);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layer=L.layerGroup().addTo(map);stopLayer=L.layerGroup().addTo(map);map.on('moveend',()=>{if(showStopMarkers)renderStopMarkers();draw()})}else{$('status').textContent='Nie udało się załadować biblioteki mapy Leaflet.'}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('selected',x===b));document.querySelectorAll('main section').forEach(x=>x.classList.toggle('active',x.id===b.dataset.tab));if(b.dataset.tab==='mapa'&&map)setTimeout(()=>map.invalidateSize(),100)});$('refresh').onclick=refresh;$('showStops').onchange=toggleStopMap;for(const id of ['line','bus','tram'])$(id).addEventListener(id==='line'?'input':'change',draw);$('find').onclick=searchStops;$('stop').onkeydown=e=>{if(e.key==='Enter')searchStops()};if(PROXY)refresh();else $('status').textContent='Mapa jest gotowa. Aby wyświetlać dane LIVE, ustaw adres Workera w config.js.';setInterval(()=>{if(PROXY)refresh()},15000)});

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
