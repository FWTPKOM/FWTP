// WTP LIVE v8 – kolory znaczników i rogi 7px; logika danych bez zmian.
const $=id=>document.getElementById(id);
const PROXY=String(window.WTP_API_PROXY||'').replace(/\/$/,'');
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let map,layer,vehicles=[],stops=[];
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
function value(row,key){if(Array.isArray(row?.values))return row.values.find(v=>v.key===key)?.value??'';return row?.[key]??'';}
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
  for(const v of vehicles){
    if((v.kind===1&&!$('bus').checked)||(v.kind===2&&!$('tram').checked))continue;
    const line=String(v.Lines||v.lines||'').toUpperCase();
    if(filter&&line!==filter)continue;
    const lat=Number(v.Lat??v.lat),lon=Number(v.Lon??v.lon);
    if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<51||lat>53||lon<19||lon>23)continue;
    const brigade=String(v.Brigade??'?'),number=String(v.VehicleNumber??'?');
    // Zwarta, jednorzędowa etykieta jak na wzorze: kierunek, typ, linia/brygada/numer.
    // Kierunek GPS jest znany dopiero po wykryciu ruchu pomiędzy kolejnymi odczytami.
    const arrow=Number.isFinite(v._bearing)
      ? `<span class="badge-direction" title="Kierunek ruchu wyliczony z GPS"><svg viewBox="0 0 24 24" style="transform:rotate(${v._bearing}deg)" aria-hidden="true"><path d="M12 3 5 15l7-3 7 3z" fill="currentColor"/><path d="M12 11v10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></span>`
      : `<span class="badge-direction unknown" title="Brak danych do wyznaczenia kierunku">·</span>`;
    const vehicleSymbol=`<svg class="badge-vehicle" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="16" rx="3" fill="currentColor"/><rect x="7.5" y="5" width="9" height="6" rx=".8" fill="#fff"/><circle cx="8.5" cy="19" r="1.8" fill="currentColor"/><circle cx="15.5" cy="19" r="1.8" fill="currentColor"/></svg>`;
    const content=`<div class="vehicle-badge">${arrow}${vehicleSymbol}<span class="badge-line">${escapeHTML(line)}</span><span class="badge-divider">/</span><span class="badge-brigade">${escapeHTML(brigade)}</span><span class="badge-divider">/</span><span class="badge-number">${escapeHTML(number)}</span></div>`;
    const icon=L.divIcon({className:'vehicle-icon'+(v.kind===2?' tram':''),html:content,iconSize:[1,1],iconAnchor:[0,0]});
    const marker=L.marker([lat,lon],{icon});
    const gps=String(v.Time??'');
    marker.bindPopup(`<b>${v.kind===1?'Autobus':'Tramwaj'} ${escapeHTML(line)}</b><br>Brygada: ${escapeHTML(brigade)}<br>Numer taborowy: ${escapeHTML(number)}<br>Ostatnia pozycja GPS: ${escapeHTML(gps)}<br><small>Kierunek strzałki ustalany z kolejnych pozycji GPS.</small><br><button class="popup-timetable">Znajdź odjazdy tej brygady</button>`);
    marker.on('popupopen',()=>{
      const btn=marker.getPopup()?.getElement()?.querySelector('.popup-timetable');
      if(btn)btn.onclick=()=>{
        selectedLine=line;selectedBrigade=brigade;
        $('stop').placeholder='Wpisz przystanek obsługiwany przez linię '+line;
        document.querySelector('[data-tab="odjazdy"]').click();
        $('results').textContent='Wyszukaj przystanek, aby zobaczyć odjazdy linii '+line+' i brygady '+brigade+'.';
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
async function searchStops(){const q=$('stop').value.trim().toLowerCase();if(q.length<2){$('results').textContent='Wpisz co najmniej dwa znaki.';return}$('results').textContent='Wyszukiwanie…';$('timetable').replaceChildren();try{if(!stops.length)stops=unpack(await request('/stops'));const matching=stops.filter(s=>String(value(s,'nazwa_zespolu')).toLowerCase().includes(q)).slice(0,60);$('results').replaceChildren();if(!matching.length)$('results').textContent='Nie znaleziono przystanku.';for(const s of matching){const z=value(s,'zespol'),n=value(s,'slupek'),name=value(s,'nazwa_zespolu');const d=document.createElement('div');d.className='item';d.textContent=`${name} — ${z}/${n}`;d.onclick=()=>showLines(z,n,name);$('results').append(d)}}catch(e){$('results').textContent=e.message}}
async function showLines(z,n,name){
  $('timetable').textContent='Pobieranie linii…';
  try{
    const rows=unpack(await request('/lines',{busstopId:z,busstopNr:n}));
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
  $('timetable').textContent='Pobieranie godzin odjazdów…';
  try{
    const rows=unpack(await request('/departures',{busstopId:z,busstopNr:n,line}));
    rows.sort((a,b)=>normalizeTime(value(a,'czas')).localeCompare(normalizeTime(value(b,'czas'))));
    const wrap=$('timetable');wrap.replaceChildren();
    const title=document.createElement('h3');title.textContent=`${name} ${n} — linia ${line}`;wrap.append(title);
    const note=document.createElement('p');note.textContent='Godziny planowe z API Warszawy (nie prognoza GPS). Dane mogą dotyczyć różnych rodzajów dni.';wrap.append(note);
    const controls=document.createElement('div');controls.className='departure-controls';
    const brigade=document.createElement('input');brigade.placeholder='Filtr brygady, np. 2';brigade.value=selectedBrigade;
    const day=document.createElement('select');
    day.innerHTML='<option value="">Wszystkie oznaczenia dni</option>';
    const days=[...new Set(rows.map(r=>String(value(r,'symbol_2')||value(r,'symbol_1')||'').trim()).filter(Boolean))].sort();
    for(const d of days){const opt=document.createElement('option');opt.value=d;opt.textContent=d;day.append(opt)}
    controls.append(brigade,day);wrap.append(controls);
    const count=document.createElement('p');wrap.append(count);
    const list=document.createElement('div');wrap.append(list);
    function render(){
      list.replaceChildren();let shown=0;
      for(const r of rows){
        const b=String(value(r,'brygada')).trim();
        const d=String(value(r,'symbol_2')||value(r,'symbol_1')||'').trim();
        if(brigade.value.trim()&&b.toLowerCase()!==brigade.value.trim().toLowerCase())continue;
        if(day.value&&d!==day.value)continue;
        const div=document.createElement('div');div.className='departure';
        for(const item of [normalizeTime(value(r,'czas'))||'—',String(value(r,'kierunek')||'—'),b||'—',d||'—']){
          const span=document.createElement('span');span.textContent=item;div.append(span)
        }
        list.append(div);shown++;
      }
      count.textContent=`Odjazdy: ${shown} z ${rows.length}. Kolumny: godzina · kierunek · brygada · oznaczenie dnia.`;
      if(!shown)list.textContent='Brak odjazdów dla wybranych filtrów.';
    }
    brigade.oninput=()=>{selectedBrigade=brigade.value;render()};day.onchange=render;render();
  }catch(e){$('timetable').textContent='Błąd pobierania odjazdów: '+e.message}
}
window.addEventListener('DOMContentLoaded',()=>{if(typeof L!=='undefined'){map=L.map('map').setView([52.2297,21.0122],11);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layer=L.layerGroup().addTo(map)}else{$('status').textContent='Nie udało się załadować biblioteki mapy Leaflet.'}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('selected',x===b));document.querySelectorAll('main section').forEach(x=>x.classList.toggle('active',x.id===b.dataset.tab));if(b.dataset.tab==='mapa'&&map)setTimeout(()=>map.invalidateSize(),100)});$('refresh').onclick=refresh;for(const id of ['line','bus','tram'])$(id).addEventListener(id==='line'?'input':'change',draw);$('find').onclick=searchStops;$('stop').onkeydown=e=>{if(e.key==='Enter')searchStops()};if(PROXY)refresh();else $('status').textContent='Mapa jest gotowa. Aby wyświetlać dane LIVE, ustaw adres Workera w config.js.';setInterval(()=>{if(PROXY)refresh()},15000)});
