// WTP LIVE v295 — grey boarding stop after alighting; next label inside row
// WTP LIVE v291 — prepared brigade recovery and complete panel rendering
// WTP LIVE v288 — trwałe pakiety i niezależne znaczniki GPS.
// WTP LIVE v287 — atomowa publikacja sieci i przygotowanie paneli.
// WTP LIVE v286 — pełne dzienne pakiety, panel wyłącznie z pamięci.
// WTP LIVE v285 — zbiorcze przygotowanie geometrii i rozkładów przed wyborem pojazdu.
// WTP LIVE v284 — przygotowanie paneli całej sieci, priorytet kliknięcia i cache kursów.
// WTP LIVE v281 — zbiorcze przystanki kursów, ograniczona kolejka ETA.
// WTP LIVE v280 — pełne przygotowanie paneli w tle.
// WTP LIVE v279 — niezależne kolory kropek i odcinków technicznych.
// WTP LIVE v266 — zmiana kursu po 5 s na krańcu; korekta po rzeczywistym odjeździe GPS; pobieranie GPS do 3 s.
// WTP LIVE v263 — korekty słupków ETA, przełączania, kolorów i dymków
// WTP LIVE v262 — wymuszenie aktualnego kodu nazw ETA po imporcie słowników; bez zmian logiki i wyglądu.
// WTP LIVE v260: ETA jest źródłem nazw, słupków i kursów; GTFS tylko pomocniczo.
// WTP LIVE v257 — przełączenie tylko po potwierdzonym krańcu + 5 s; groty w środku kropek
// WTP LIVE v270 — synchronizacja odliczania listy i mapy, stabilny znacznik, szybsze ETA
// WTP LIVE v254 — wspólny status >>> listy i chmurki; reset nieaktualnego opóźnienia; chmurki ponad pojazdem
// WTP LIVE v249 — przywrócone odliczanie minut z lewej strony listy niezależnie od dymków mapy; bez zmian układu
// WTP LIVE v248 — przywrócone kolory godzin i minut; jednakowe odstępy: koniec minut → kropka i kropka → początek nazwy; pozostały układ bez zmian
// WTP LIVE v253 — kolory aktywnego kursu, wczesne pobieranie geometrii i stabilna trasa
// WTP LIVE v247 — wspólna oś 13px/4px, synchronizacja >>> listy i dymków
// WTP LIVE v245 — pełnoszerokie wiersze, wspólna oś kropek i linii, zawartość 10 px w lewo
// WTP LIVE v244 — bez dodatkowego lewego marginesu, poprawne rozmieszczenie minut i osi oraz podświetlenie całego wiersza
// WTP LIVE v243 — przywrócona kolejność: minuty, oś przystanków, nazwa; bez zmian logiki
// WTP LIVE v242 — pełna szerokość podświetlenia, większe kolorowe minuty, pełna minuta odjazdu, trwałe godziny przy odświeżaniu
// WTP LIVE v241 — pełna widoczność minut przed kropkami listy; pozostałe funkcje bez zmian
// WTP LIVE v240 — minuty przy osi listy, zielone godziny w dymkach, migające >>>; pozostałe funkcje bez zmian
// WTP LIVE v239 — naprawa danych geo przy wstępnym wyborze kursu; wygląd bez zmian
// WTP LIVE v238 — odzyskiwanie kursu brygady po pominięciu kursów, właściwy kraniec, przełączenie 5 s; wygląd bez zmian
// WTP LIVE v237 — nie naliczaj opóźnienia za niezaliczony przystanek; przejazd tylko z kolejnych GPS; wygląd bez zmian
// WTP LIVE v236 — przywrócony wygląd i sposób wyświetlania listy oraz dymków z v233; GPS co 2 s
// WTP LIVE v233 — odczyt GPS co 2 s i aktualizacja panelu co 8 s przy nowym pomiarze; bez zmian wyglądu
// WTP LIVE v232 — synchronizacja prognoz mapy i listy, sekundy odjazdu, bez zmian wyglądu
// WTP LIVE v231 — przyjazd <1 min / >>>; odjechał + godziny; bez zmian innych funkcji
// WTP LIVE v226 — potwierdzony przyjazd na kraniec, zmiana po 5 s, zachowanie istniejących stylów ETA.
// WTP LIVE v224 — prognoza opóźnienia już na krańcu, bez oczekiwania na odjazd; bez zmian wyglądu
// WTP LIVE v223 — przywrócenie wyglądu opóźnień; pierwszy render bez czekania na GTFS
// WTP LIVE v222 — przełączenie tylko po GPS krańca, 15 s, opóźnienie po odjeździe
// WTP LIVE v221 — 15 sekund potwierdzenia krańca
// WTP LIVE v220 — pierwszy render z GTFS, bez fikcyjnego oczekiwania, GPS startu
// WTP LIVE v212 — weryfikacja słupków, >>> 100 m, <1 na mapie
// WTP LIVE v211 — geometria ETA/GTFS bez automatycznej zamiany na OSRM
// WTP LIVE v208 — usunięto >>> z listy; pozostaje wyłącznie na mapie
// WTP LIVE v207 — wspólny status GPS mapy i listy, >>> do 50 m, bez opóźnienia przenoszonego wstecz
// WTP LIVE v206: natychmiastowa zmiana pojazdu i odliczanie do odjazdu
// WTP LIVE v205 — postój na przystanku, wygasanie kierunku GPS, przełączanie kursu po 20 s
// WTP LIVE v204: kurs co nowy GPS, wcześniejsze rzeczywiste odjazdy, bez migania listy
// WTP LIVE v203 — wspólny postęp GPS dla listy i mapy; ruchoma ikonka, napis następnego przystanku
// WTP LIVE v202 — wspólny postęp trasy GPS, statusy przystanków i ETA
// WTP LIVE v201 — synchronizacja stanu przystanków i stabilne warstwy
// WTP LIVE v199 — trwała trasa przy odświeżaniu GPS i spójny postęp przystanków
// WTP LIVE v200 — synchronizacja wyszarzania listy z mapą
// WTP LIVE v197 — stabilny kierunek GPS na postojach, bez znaku ?
// WTP LIVE v198 — przystanek bieżący do potwierdzenia odjazdu GPS
// WTP LIVE v195 — nie pokazuj „Za chwilę” po upływie planowanej godziny
// WTP LIVE v194 — poprawki przełączania kursów na krańcu
// WTP LIVE v193 — 30 s na krańcu + istnienie następnego kursu, bez okna -3 min
// WTP LIVE v191 — korekty kursów i odsunięcia geometrii
// WTP LIVE v190 — poprawka przełączania kursów po zakończeniu poprzedniego
// WTP LIVE v177 — ręcznie zatwierdzone geometrie mają pierwszeństwo przed ETA/GTFS
// WTP LIVE v176 — próba drogowego wyznaczenia zawrotki na początku kursu
// WTP LIVE v175 — dojazd do krańców i nawroty po OSM (eksperymentalne)
// WTP LIVE v174 — kolor wg typu linii, poprawa przejścia między kursami
// WTP LIVE v173 — warunkowa korekta nawrotów na podstawie routingu OSM
// WTP LIVE v172 — wyszarzanie etykiet miniętych przystanków na mapie
// WTP LIVE v171 — pełna szara oś wys→ws i przywrócone wyszarzanie miniętych przystanków
// WTP LIVE v170 — kierunek pojazdu z aktualnego ruchu GPS, bez przestarzałych strzałek
// WTP LIVE v169 — szybki cache ETA, klikane przystanki, stan kursu i szary odcinek wys→ws
// WTP LIVE v168 — przełączanie kursów, role przystanków, szare odcinki techniczne
// WTP LIVE — WERSJA: v158 — niezależne daty ETA/GTFS, dopasowanie wariantów i GPS
// WTP LIVE — WERSJA: 150
// WTP LIVE v63 – walidacja świeżości GPS, aktualności GTFS i bezpieczne dopasowanie kursu.
const $=id=>document.getElementById(id);
const PROXY=String(window.WTP_API_PROXY||'').replace(/\/$/,'');
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let map,layer,vehicles=[],stops=[];
let stopPaneRequest=0, hoveredStopLine="", pinnedStopLine="", pinnedStopVehicle=null;
let focusedVehicle=null; let wtpSelectedVehicleOnly=false; let wtpMapUserExploring=false; let wtpRouteStopCoords=new Map(); let wtpHoveredRouteStop=null; const ROUTE_API='/route';
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
async function request(path,params={}){if(!PROXY)throw Error('Nie skonfigurowano adresu Cloudflare Workera w config.js.');const url=new URL(PROXY+path);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),path==='/live'?25000:params.bundle==='prepared'?90000:20000);let response;try{response=await fetch(url,{cache:'no-store',signal:controller.signal})}finally{clearTimeout(timeout)};if(!response.ok)throw Error('Serwer API: HTTP '+response.status);const data=await response.json();if(data.error)throw Error(typeof data.error==='string'?data.error:'Błąd API');return data;}
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
// v127: bez przystanków na dalekim zoomie, nazwy od zoom 15.
const STOP_DOT_ZOOM=15,STOP_ARROW_ZOOM=16,STOP_NAME_ZOOM=15;
function wtpUpdateZoomVisibility(){
 if(!map)return;
 const z=map.getZoom(),el=map.getContainer();
 el.classList.toggle('wtp-zoom-hide-stops',z<STOP_DOT_ZOOM);
 el.classList.toggle('wtp-zoom-show-names',z>=STOP_NAME_ZOOM);
}

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
let stopRetryAt=0,stopFetchPromise=null;
function fetchStopsOnce(){
 if(!stopFetchPromise)stopFetchPromise=request('/stops').then(normalizedRows).finally(()=>{stopFetchPromise=null});
 return stopFetchPromise;
}
async function toggleStopMap(){
 showStopMarkers=$('showStops')?.checked??true;
 if(!showStopMarkers){stopLayer?.clearLayers();return}
 if(!stops.length&&!stopMapLoading&&Date.now()>=stopRetryAt){
  stopMapLoading=true;$('stopStatus').textContent='Pobieranie przystanków…';
  try{stops=await fetchStopsOnce()}catch(e){stopRetryAt=Date.now()+10000;$('stopStatus').textContent='Błąd przystanków: '+e.message;setTimeout(()=>{if(showStopMarkers&&!stops.length)void toggleStopMap()},10000)}
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
// v130: rzeczywiste słupki z kierunkiem + obrys ZP, bez znacznika środka.
function wtpStopGroupName(row){return String(value(row,'nazwa_zespolu')||value(row,'nazwa')||'').trim();}
function wtpStopMetaHeadings(meta){
 if(!meta)return [];
 return [Number(meta[2]),Number(meta[3])].filter(x=>Number.isFinite(x)&&x>=0&&x<360);
}
function wtpStopColor(meta){
 const bus=meta&&Number.isFinite(Number(meta[2]))&&meta[2]!==null;
 const tram=meta&&Number.isFinite(Number(meta[3]))&&meta[3]!==null;
 return bus&&tram?'#ed8b00':tram?'#e00000':bus?'#820082':'#64748b';
}
function wtpStopMarkerIcon(color,request,bearings,zoom){
 const size=zoom>=17?26:22;
 const heading=bearings.length?bearings[0]:null;
 // Kierunek jest na środku słupka, nie w środku zespołu.
 const arrow=heading===null?'':`<svg class="wtp-stop-heading" viewBox="0 0 24 24" style="transform:rotate(${heading}deg)" aria-hidden="true"><path d="M12 2 L20 20 L12 16 L4 20 Z" fill="${request?color:'#fff'}" stroke="${request?'#fff':color}" stroke-width="1.3"/></svg>`;
 const html=`<span class="wtp-stop-point" style="--stop-color:${color};--stop-fill:${request?'#fff':color};width:${size}px;height:${size}px">${arrow}</span>`;
 return L.divIcon({className:'wtp-stop-icon wtp-v130-stop',html,iconSize:[size,size],iconAnchor:[size/2,size/2]});
}
function renderStopMarkers(){
 if(!stopLayer)return;
 stopLayer.clearLayers();if(!showStopMarkers || wtpSelectedVehicleOnly)return;
 const zoom=map.getZoom();
 if(zoom<STOP_DOT_ZOOM){$('stopStatus').textContent='Przystanki ukryte — przybliż mapę.';return}
 if(!stops.length){if(!stopMapLoading&&Date.now()>=stopRetryAt)void toggleStopMap();return}
 const bounds=map.getBounds();let shown=0,withDirection=0;
 const labelGrid=new Set();
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
  // Stała nazwa na zwykłym przybliżeniu. Siatka ogranicza nakładanie etykiet.
  const px=map.latLngToContainerPoint(coords),gridX=Math.floor(px.x/115),gridY=Math.floor(px.y/46);
  const labelKey=gridX+':'+gridY;
  const showName=false; // v132: bez stale wyswietlanych nazw na mapie ogolnej
  if(showName)labelGrid.add(labelKey);
  marker.bindTooltip(escapeHTML(name)+' '+escapeHTML(n),{
   direction:'top',permanent:showName,opacity:showName?.92:1,offset:[0,-6],
   className:'wtp-stop-tooltip wtp-stop-name '+(bus&&tram?'wtp-stop-tip-mixed':tram?'wtp-stop-tip-tram':bus?'wtp-stop-tip-bus':'wtp-stop-tip-unknown')
  });
  marker.on('click',()=>openStopPanel(z,n,name,color));
  marker.addTo(stopLayer);shown++;
 }
 $('stopStatus').textContent=`Przystanki: ${shown}; strzałki: ${withDirection}. Fioletowy: autobus · czerwony: tramwaj · pomarańczowy: oba.`+(stopMetaReady?'':' Trwa wczytywanie danych GTFS.');
}
// WTP LIVE v42: historia pomiarów GPS; nie myli czasu GPS z czasem pobrania.
const lastLocations=new Map();
const HISTORY_KEY='wtp-live-v199-gps';
try { const saved=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]'); for(const [k,v] of saved){if(Date.now()-v.seen<24*60*60*1000)lastLocations.set(k,v)} }catch{}
function gpsMs(raw){const s=String(raw||'').trim().replace(' ','T');return Date.parse(s+(/(?:Z|[+-]\d\d:?\d\d)$/.test(s)?'':'Z'))}
function direction(lat1,lon1,lat2,lon2){const r=Math.PI/180,y=Math.sin((lon2-lon1)*r)*Math.cos(lat2*r),x=Math.cos(lat1*r)*Math.sin(lat2*r)-Math.sin(lat1*r)*Math.cos(lat2*r)*Math.cos((lon2-lon1)*r);return(Math.atan2(y,x)*180/Math.PI+360)%360}
function vehicleKey(v){return String(v.kind)+':'+String(v.VehicleNumber??'')}
let historySave=0;
// v98: kierunki z Cloudflare KV są źródłem głównym; lokalne GPS to awaryjny fallback.
let serverHeadings={};
let serverHeadingsAt=0;
async function fetchServerHeadings(){
 try{
  const data=await request('/headings');
  if(data&&data.headings&&typeof data.headings==='object'){
   serverHeadings=data.headings;
   serverHeadingsAt=Date.now();
  }
 }catch(e){console.warn('Kierunki z serwera niedostępne:',e.message)}
}
function applyServerHeadings(rows,type){
 if(Date.now()-serverHeadingsAt>120000)return;
 for(const v of rows){
  const key=String(type)+':'+String(v.VehicleNumber);
  const hit=serverHeadings[key]||serverHeadings[key+':'+String(v.Lines)+':'+String(v.Brigade||'')];
  const bearing=Number(hit?.bearing);
  if(hit&&Number.isFinite(bearing)&&bearing>=0&&bearing<360 && !Number.isFinite(v._bearing)){
   v._bearing=bearing;
   v._serverBearing=true;
  }
 }
}
// v170: kierunek wyłącznie z rzeczywistego, chronologicznego ruchu pojazdu.
// Nie traktuj historycznego bearing jako aktualnego po zmianie kursu lub długim postoju.
// v211: 1 m GPS movement resets the stationary clock; '?' only after 5 min.
// Keep the last meaningful direction while the vehicle is stopped briefly.
function updateHeadings(rows){
 const now=Date.now();
 for(const v of rows){
  const key=vehicleKey(v),lat=Number(v.Lat),lon=Number(v.Lon),stamp=gpsMs(v.Time);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||!Number.isFinite(stamp))continue;
  const prev=lastLocations.get(key);
  const duty=String(v.Lines||'')+':'+String(v.Brigade||'');
  let bearing=prev&&prev.duty===duty&&Number.isFinite(prev.bearing)?prev.bearing:null;
  let movedAt=prev&&prev.duty===duty?Number(prev.movedAt||prev.seen||now):now;
  let movedStamp=prev&&prev.duty===duty?Number(prev.movedStamp||0):0;
  // Compare only new GPS fixes, not repeated polling of the same fix.
  if(prev&&stamp>prev.stamp&&prev.duty===duty){
   const metres=geoDistance(prev.lat,prev.lon,lat,lon);
   if(metres>=1){
    movedAt=now;
    movedStamp=stamp;
    const seconds=(stamp-prev.stamp)/1000;
    if(seconds>0&&seconds<=600&&metres/seconds<=35){
     bearing=direction(prev.lat,prev.lon,lat,lon);
    }
   }
  }
  // A new duty/vehicle starts a fresh five-minute observation window.
  if(!prev||prev.duty!==duty){movedAt=now;movedStamp=0;}
  // A server bearing is useful for direction, but cannot prove movement.
  const server=serverHeadings[key]||serverHeadings[key+':'+String(v.Lines)+':'+String(v.Brigade||'')];
  const serverBearing=Number(server?.bearing);
  if(!Number.isFinite(bearing)&&now-serverHeadingsAt<45000&&Number.isFinite(serverBearing)&&serverBearing>=0&&serverBearing<360){
   bearing=serverBearing;
  }
  const stationary=now-movedAt>=300000;
  v._stationary=stationary;
  v._bearing=Number.isFinite(bearing)&&!stationary?bearing:null;
  // Do not overwrite newer stored GPS with an older response.
  if(!prev||stamp>=prev.stamp){
   lastLocations.set(key,{lat,lon,stamp,seen:now,duty,bearing,movedStamp,movedAt});
  }else{
   v._stationary=now-Number(prev.movedAt||prev.seen||now)>=300000;
   v._bearing=!v._stationary&&Number.isFinite(prev.bearing)?prev.bearing:null;
  }
 }
 for(const [key,p] of lastLocations)if(now-p.seen>6*60*60*1000)lastLocations.delete(key);
 if(now-historySave>10000){historySave=now;try{localStorage.setItem(HISTORY_KEY,JSON.stringify([...lastLocations]))}catch{}}
}

function draw(){
  if(!layer)return;
  layer.clearLayers();let count=0;
  const filter=$('line').value.trim().toUpperCase();
  const zoom=map.getZoom(), bounds=map.getBounds(), mobile=window.matchMedia('(max-width:700px)').matches;
  let rendered=0; const markerLimit=mobile?300:3000;
  for(const v of vehicles){
    if(wtpSelectedVehicleOnly && focusedVehicle && vehicleKey(v)!==vehicleKey(focusedVehicle))continue;
    if((v.kind===1&&!$('bus').checked)||(v.kind===2&&!$('tram').checked))continue;
    const line=String(v.Lines||v.lines||'').toUpperCase();
    if(filter&&line!==filter)continue;
    const lat=Number(v.Lat??v.lat),lon=Number(v.Lon??v.lon);
    if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<51||lat>53||lon<19||lon>23)continue;
    if(!bounds.contains([lat,lon]))continue;
    if(rendered>=markerLimit)continue; rendered++;
    const brigade=String(v.Brigade??'?'),number=String(v.VehicleNumber??'?');
    // Zwarta, jednorzędowa etykieta jak na wzorze: kierunek, typ, linia/brygada/numer.
    // Kierunek GPS jest znany dopiero po wykryciu ruchu pomiędzy kolejnymi odczytami.
    const arrow=(!v._stationary && Math.abs(Date.now()-gpsMs(v.Time))<=90000 && Number.isFinite(v._bearing))
      ? `<span class="badge-direction" title="Kierunek z ostatniego wiarygodnego ruchu GPS"><svg viewBox="0 0 24 24" style="transform:rotate(${v._bearing}deg)" aria-hidden="true"><path d="M12 3 5 15l7-3 7 3z" fill="currentColor"/><path d="M12 11v10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></span>`
      : `<span class="badge-direction unknown" title="Brak aktualnego, wiarygodnego ruchu GPS">?</span>`;
    const vehicleSymbol=`<img class="badge-vehicle wtp-custom-vehicle" src="${v.kind===2?'icons/WTP-tramwaj.svg':'icons/WTP-autobus.svg'}" alt="" aria-hidden="true">`;
    const content=zoom<11?'<span class="vehicle-dot"></span>':zoom<14?`<span class="vehicle-mini">${escapeHTML(line)}</span>`:`<div class="vehicle-badge">${arrow}${vehicleSymbol}<span class="badge-line">${escapeHTML(line)}</span><span class="badge-divider">/</span><span class="badge-brigade">${escapeHTML(brigade)}</span><span class="badge-divider">/</span><span class="badge-number">${escapeHTML(number)}</span></div>`;
    const icon=L.divIcon({className:'vehicle-icon'+(v.kind===2?' tram':'')+(zoom<11?' dot-mode':zoom<14?' mini-mode':''),html:content,iconSize:[1,1],iconAnchor:[0,0]});
    const marker=L.marker([lat,lon],{icon,pane:'vehiclesPane',zIndexOffset:1000});
    if(hoveredStopLine||pinnedStopLine)marker.getElement()?.classList.toggle('wtp-line-highlight',line===(hoveredStopLine||pinnedStopLine));
    const gps=String(v.Time??'');
    marker.on('click',()=>{selectedLine=line;selectedBrigade=brigade;wtpMapUserExploring=false;void openVehiclePanel(v);});
    marker.addTo(layer);
    if(hoveredStopLine||pinnedStopLine){const active=hoveredStopLine||pinnedStopLine;const el=marker.getElement();if(el)el.classList.toggle('wtp-line-highlight',line===active);if(el)el.classList.toggle('wtp-line-dimmed',line!==active)}
    count++;
  }
  $('count').textContent='Widoczne pojazdy: '+count+' / '+vehicles.length;
}
let selectedLine='',selectedBrigade='';
const gpsBusy={1:false,2:false};
const received={1:[],2:[]};
const sourceInfo={1:{total:0,fresh:0,newest:0},2:{total:0,fresh:0,newest:0}};
const fetchedAt={1:0,2:0};
const SNAPSHOT_KEY='wtp-live-v221-last-good';
// v265: zachowuj ostatni aktualny GPS również po zamknięciu karty.
// Cache służy tylko do natychmiastowego pierwszego rysowania; /live nadal jest źródłem prawdy.
const SNAPSHOT_PERSIST_KEY='wtp-live-v265-vehicle-snapshot';
const SNAPSHOT_MAX_AGE_MS=15*60*1000;
let lastSnapshotPersist=0,wtpLastSavedTypes=0;
function wtpReadVehicleSnapshot(){
 for(const storage of [sessionStorage,localStorage]){
  try{
   const saved=JSON.parse(storage.getItem(storage===localStorage?SNAPSHOT_PERSIST_KEY:SNAPSHOT_KEY)||'{}');
   let loaded=0;
   for(const type of [1,2]){
    if(received[type].length)continue;
    const item=saved[type];
    if(!item||!Number.isFinite(Number(item.at))||Date.now()-Number(item.at)>SNAPSHOT_MAX_AGE_MS)continue;
    const rows=(Array.isArray(item.rows)?item.rows:[]).map(normalizeVehicle).filter(v=>{
     const ms=gpsMs(v.Time);
     return Number.isFinite(ms)&&Date.now()-ms<=SNAPSHOT_MAX_AGE_MS&&ms-Date.now()<=5*60000;
    });
    if(rows.length){received[type]=rows;fetchedAt[type]=Number(item.at);loaded+=rows.length;}
   }
   if(loaded)return;
  }catch(e){/* pamięć może być zablokowana — pobieranie GPS działa niezależnie */}
 }
}
function wtpPersistVehicleSnapshot(){
 const now=Date.now();
 if(now-lastSnapshotPersist<12000 && received[1].length && received[2].length && wtpLastSavedTypes===3)return;
 wtpLastSavedTypes=(received[1].length?1:0)+(received[2].length?2:0);
 lastSnapshotPersist=now;
 const snapshot={1:{rows:received[1],at:fetchedAt[1]},2:{rows:received[2],at:fetchedAt[2]}};
 try{sessionStorage.setItem(SNAPSHOT_KEY,JSON.stringify(snapshot))}catch(e){}
 try{localStorage.setItem(SNAPSHOT_PERSIST_KEY,JSON.stringify(snapshot))}catch(e){}
}
wtpReadVehicleSnapshot();
let lastPanelAutoRefresh=0;
function publishVehicles(){
 vehicles=[...received[1].map(v=>({...v,kind:1})),...received[2].map(v=>({...v,kind:2}))];for(const v of vehicles)rememberGps(v);draw();
 if(focusedVehicle && !$('vehiclePanel')?.hidden && Date.now()-lastPanelAutoRefresh>1000){
  const current=vehicles.find(v=>vehicleKey(v)===vehicleKey(focusedVehicle));
  if(current && gpsMs(current.Time)>gpsMs(focusedVehicle.Time)){
   focusedVehicle={...current};lastPanelAutoRefresh=Date.now();
   // v128: GPS aktualizuje tylko marker. Nie otwieraj panelu ponownie,
   // nie kasuj geometrii i nie pobieraj ponownie ETA przy każdym ruchu.
   // v153: aktualizuj panel również po zmianie GPS, bez ciągłego restartu ETA.
   // v204: kurs oceniamy przy każdym nowym GPS, nie dopiero po ponownym kliknięciu.
   // Nie przebudowujemy DOM przy niezmienionym kursie (brak migania trasy).
   const ready=etaPanelReady.get(vehicleKey(current));
   if(ready?.match&&ready?.trips){
    const before=String(ready.match.selected?.course?.course_id||'');
    chooseLiveEtaCourse(ready.match,current,ready.trips);
    const after=String(ready.match.selected?.course?.course_id||'');
    if(before&&after&&before!==after){
     etaPanelMatches.delete(vehicleKey(current));
     const scroll=$('vehicleBody')?.scrollTop||0;
     void openVehiclePanel(current);
    }
   }
   const heading=$('vehicleHeading');
   if(heading)heading.textContent=`${current.Lines} · ${current.kind===2?'Tramwaj':'Autobus'} · brygada ${current.Brigade} · tabor ${current.VehicleNumber}`;
   if(Date.now()-(window.wtpLastFullPanelUpdate||0)>8000){
    window.wtpLastFullPanelUpdate=Date.now();
    const scroll=$('vehicleBody')?.scrollTop||0;
    void openVehiclePanel(current,{keepScroll:scroll});
   }
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
// v275: nie zastępuj całej floty niepełną lub starszą odpowiedzią GPS.
function wtpMergeGps(previous,incoming,now){
 const byId=new Map();
 for(const v of [...previous,...incoming]){
  const id=String(v.VehicleNumber||'').trim(),t=gpsMs(v.Time);
  if(!id||!Number.isFinite(t)||now-t>15*60000||t-now>5*60000||!Number.isFinite(v.Lat)||!Number.isFinite(v.Lon)||v.Lat<51||v.Lat>53||v.Lon<19||v.Lon>23)continue;
  const old=byId.get(id);
  if(!old||t>gpsMs(old.Time))byId.set(id,v);
 }
 return [...byId.values()];
}
async function refresh(){
 if(gpsBusy[1]&&gpsBusy[2])return;
 const status=$('status');status.classList.remove('error');
 if(!vehicles.length)status.textContent='Pobieranie pojazdów…';
 const errors=[];let ok=0;
 // Pobierz kierunki z KV zanim zostaną narysowane pojazdy.
 // v170: Worker nie udostępnia /headings; nie opóźniaj pobierania GPS.
 const fetchType=async type=>{
  if(gpsBusy[type])return;
  gpsBusy[type]=true;
  try{
   const data=unpack(await request('/live',{type}));
   const all=data.map(normalizeVehicle).filter(v=>Number.isFinite(v.Lat)&&Number.isFinite(v.Lon));
    const rows=all.filter(v=>{const ms=gpsMs(v.Time);return Number.isFinite(ms)&&Date.now()-ms<=15*60000&&ms-Date.now()<=5*60000});
    sourceInfo[type]={total:all.length,fresh:rows.length,newest:all.reduce((a,v)=>Math.max(a,gpsMs(v.Time)||0),0)};
   const merged=wtpMergeGps(received[type],rows,Date.now());
   updateHeadings(merged.map(v=>Object.assign(v,{kind:type})));
   // v170: nie nadpisuj kierunku wyliczonego z bieżącego GPS starym bearing.
   received[type]=merged;fetchedAt[type]=Date.now();ok++;
   wtpPersistVehicleSnapshot();
   publishVehicles();
   wtpRefreshCourseStopTimes();
   status.textContent='Pobrano '+new Date().toLocaleTimeString('pl-PL')+' · '+gpsAgeDescription();
  }catch(e){errors.push((type===1?'Autobusy':'Tramwaje')+': '+e.message)}finally{gpsBusy[type]=false}
 };
 try{
  await Promise.allSettled([fetchType(1),fetchType(2)]);
  status.textContent=(ok?'Odczyt '+new Date().toLocaleTimeString('pl-PL'):'Nie udało się odświeżyć')+' · '+gpsAgeDescription()+' · GPS: '+[1,2].map(t=>(t===1?'A':'T')+' '+sourceInfo[t].fresh+'/'+sourceInfo[t].total+(sourceInfo[t].newest?' (ostatni '+new Date(sourceInfo[t].newest).toLocaleString('pl-PL')+')':'')).join(', ')+(errors.length?' · '+errors.join('; '):'');
   if(ok&&!vehicles.length)status.classList.add('error');
  if(!ok)status.classList.add('error');
 }finally{}
}
async function searchStops(){const q=$('stop').value.trim().toLowerCase();if(q.length<2){$('results').textContent='Wpisz co najmniej dwa znaki.';return}$('results').textContent='Wyszukiwanie…';$('timetable').replaceChildren();try{if(!stops.length)stops=await fetchStopsOnce();const matching=stops.filter(s=>String(value(s,'nazwa_zespolu')).toLowerCase().includes(q)).slice(0,60);$('results').replaceChildren();if(!matching.length)$('results').textContent='Nie znaleziono przystanku.';for(const s of matching){const z=value(s,'zespol'),n=value(s,'slupek'),name=value(s,'nazwa_zespolu');const d=document.createElement('div');d.className='item';d.textContent=`${name} — ${z}/${n}`;d.onclick=()=>showLines(z,n,name);$('results').append(d)}}catch(e){$('results').textContent=e.message}}
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
const wtp294DayFormat=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Warsaw',year:'numeric',month:'2-digit',day:'2-digit'});
function todayWarsaw(){return wtp294DayFormat.format(new Date()).replaceAll('-','')}
const wtp294TimeFormat=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function nowWarsaw(date){const parts=wtp294TimeFormat.formatToParts(date);return Number(parts.find(p=>p.type==='hour').value)*60+Number(parts.find(p=>p.type==='minute').value)}
async function loadGtfs(line){
 const day=todayWarsaw();const cached=gtfsCache.get(line);if(cached&&cached.day!==day)gtfsCache.delete(line);
 if(!gtfsCache.has(line))gtfsCache.set(line,{day,promise:fetch('gtfs/'+encodeURIComponent(line.replaceAll('/','_'))+'.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Brak GTFS dla linii '+line);return r.json()}).catch(e=>{gtfsCache.delete(line);throw e})});
 return gtfsCache.get(line).promise;
}

// WTP LIVE v56: ETA z Mikrusa przez chroniony Cloudflare Worker.
// Dopasowanie kursu: linia + brygada + czas + zgodność przystanków.
const etaCache=new Map();
// v132: krótkie awarie Workera nie powinny od razu kasować ETA.
// Retry dotyczy tylko błędów przejściowych; błędy 4xx nie są ponawiane.
const etaLastGood=new Map();
const etaDelay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const wtpEtaQueue=[];let wtpEtaActive=0;
function wtpEtaRequest(path,params){return new Promise((resolve,reject)=>{const q={path,params,resolve,reject};if(focusedVehicle&&((String(params?.line||'')===String(focusedVehicle.Lines)&&params?.bundle!=='live')||path==='courses/'+encodeURIComponent(etaPanelReady.get(vehicleKey(focusedVehicle))?.match?.selected?.course?.course_id)+'/geometry'))wtpEtaQueue.unshift(q);else wtpEtaQueue.push(q);wtpEtaDrain();});}
function wtpEtaDrain(){while(wtpEtaActive<3&&wtpEtaQueue.length){const q=wtpEtaQueue.shift();wtpEtaActive++;request('/eta/'+q.path,q.params).then(q.resolve,q.reject).finally(()=>{wtpEtaActive--;wtpEtaDrain();});}}
async function etaGet(path,params={}) {
 const key=path+'?'+new URLSearchParams(params);
 const old=etaCache.get(key);
 const ttl=path==='route-overrides'?60000:path==='health'?60000:path==='courses'&&params.bundle==='live'?300000:86400000;
 if(old&&old.day===todayWarsaw()&&Date.now()-old.at<ttl)return old.promise;
 const promise=(async()=>{
  let error;
  for(let attempt=0;attempt<2;attempt++){
   try{
    const data=await wtpEtaRequest(path,params);
    etaLastGood.set(key,{at:Date.now(),data});
    return data;
   }catch(e){
    error=e;
    const msg=String(e?.message||e);
    if(!/HTTP (502|503|504)|Failed to fetch|NetworkError|abort|timeout/i.test(msg))break;
    if(attempt<1)await etaDelay(450);
   }
  }
  const previous=etaLastGood.get(key);
  // Rozkład z tego samego dnia jest lepszy od pustego panelu.
  if(previous&&Date.now()-previous.at<10*60*1000){
   console.warn('ETA: używam ostatniej odpowiedzi po błędzie',error);
   return previous.data;
  }
  throw error;
 })().catch(e=>{etaCache.delete(key);throw e});
 etaCache.set(key,{at:Date.now(),day:todayWarsaw(),promise});
 return promise;
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
// v164: Typ słupka jest niezależny od nazwy i numeru. Zachowujemy oznaczenia
// z danych ETA/GTFS; nigdy nie wyprowadzamy "wys/ws" z samej lokalizacji.
function wtpStopRole(stop,mapped){
 // Priorytet: role jednoznacznie odczytane z sekcji odcinki w aktualnej bazie ETA.
 const explicit=String(stop?.stop_role||'').toLowerCase();
 const pole=String(stop?.eta_platform_number??stop?.numer_slupka??'').trim();
 if(pole==='99'&&/^R\d+\s*\([A-Z]+\)$/i.test(wtpEtaSourceStopLabel(stop)))return 'zaj';
 if(['wys','ws','zaj','tech'].includes(explicit))return explicit;
 const etaFlag=(k)=>stop?.[k]===1||stop?.[k]==='1'||stop?.[k]===true;
 if(etaFlag('tras_dla_wysiadajacych')&&!etaFlag('tras_dla_wsiadajacych'))return 'wys';
 if(etaFlag('tras_dla_wsiadajacych')&&!etaFlag('tras_dla_wysiadajacych'))return 'ws';
 if(etaFlag('slupek_nie_dla_pasazera'))return 'tech';
 const fields=['typ_przystanku','rodzaj_przystanku','nazwa_typu','stop_type','stop_role',
  'opis_przystanku','description','typ_slupka','rodzaj_slupka','typ','rodzaj',
  'oznaczenie','status','charakter','typ_kursu'];
 const values=[stop,mapped].filter(Boolean).flatMap(o=>fields.map(k=>o?.[k])).filter(x=>x!=null);
 const txt=values.map(x=>String(x).trim().toLowerCase()).join(' | ');
 if(/(?:^|[^a-ząćęłńóśźż])wys(?:\.|[^a-ząćęłńóśźż]|$)|dla\s+wysiadaj|wysiadani|alighting|drop.?off/.test(txt))return 'wys';
 if(/(?:^|[^a-ząćęłńóśźż])ws(?:\.|[^a-ząćęłńóśźż]|$)|dla\s+wsiadaj|wsiadani|boarding|pick.?up/.test(txt))return 'ws';
 if(/(?:^|[^a-ząćęłńóśźż])zaj(?:\.|[^a-ząćęłńóśźż]|$)|zajezdni|depot/.test(txt))return 'zaj';
 if(/techniczn|technical|deadhead/.test(txt))return 'tech';
 return '';
}
function wtpStopRoleLabel(role){return ({wys:'Dla wysiadających',ws:'Dla wsiadających',zaj:'Zajezdnia',tech:'Przystanek techniczny'})[role]||'';}
function wtpIsTechnicalCourse(course,stops,mapping,trip){
 const type=[course?.course_type,course?.type,course?.rodzaj_kursu,course?.typ_kursu,course?.description].filter(x=>typeof x==='string').join(' ').toLowerCase();
 if(/techniczn|technical|deadhead/.test(type))return true;
 const roles=stops.map((stop,i)=>wtpStopRole(stop,trip?.stops?.[mapping?.[i]]));
 return roles.length>=2&&roles.slice(1).every(r=>r==='tech'||r==='zaj')&&roles[0]!=='ws';
}
function wtpTechnicalIntervals(stops,mapping,trip,course){
 const roles=stops.map((stop,i)=>wtpStopRole(stop,trip?.stops?.[mapping?.[i]]));
 if(wtpIsTechnicalCourse(course,stops,mapping,trip))return [[0,roles.length-1]];
 const intervals=[];let active=false;
 for(let i=0;i<roles.length-1;i++){
  const a=roles[i],b=roles[i+1];
  if(a==='wys'||a==='zaj'||a==='tech')active=true;
  if(a==='ws')active=false;
  const technical=active&&(b==='ws'||b==='tech'||b==='zaj'||(a==='wys'&&roles.slice(i+1).some(r=>r==='zaj'||r==='tech')));
  if(!technical){active=false;continue;}
  if(intervals.length&&intervals.at(-1)[1]===i)intervals.at(-1)[1]=i+1;
  else intervals.push([i,i+1]);
 }
 return intervals;
}
// v80: kandydaci tej samej brygady oceniani po przebiegu GPS i czasie.
// Nie zakładamy, że najnowszy planowo kurs jest wykonywany przy opóźnieniu.
async function etaMatchVehicle(v,gtfsTrips=[],preparedPack=null){
 const line=String(v.Lines||'').trim(),brigade=normalizeBrigade(v.Brigade);
 if(!line||!brigade)throw Error('Brak linii lub brygady');
 const pack=preparedPack||wtpLineData.get(line);
 if(!pack)throw Error('Brak przygotowanego pakietu linii');
 const courses=(pack.courses||[]).filter(c=>normalizeBrigade(c.brigade)===brigade);
 const stamp=gpsMs(v.Time),now=nowWarsaw(Number.isFinite(stamp)?new Date(stamp):new Date());
 const evaluated=[];
 for(const course of courses){
  const stops=pack.details[String(course.course_id)]?.stops;
  if(!stops||stops.length<2)continue;
  const bounds=etaCourseTimeBounds(stops,course),distance=etaCourseDistance(bounds,now);
  evaluated.push({course,etaStops:stops,bounds,distance,score:distance});
 }
 const matches=evaluated.filter(Boolean).sort((a,b)=>a.score-b.score||a.bounds.start-b.bounds.start);
 if(!matches.length)throw Error('Brak dostępnych szczegółów kursów ETA');
 const current=activeCourseByVehicle.get(vehicleKey(v))?.id;
 const candidates=matches.filter(x=>x.distance<=120||String(x.course.course_id)===current);
 const pool=candidates.length?candidates:matches.slice(0,1);
 return {selected:pool[0],alternatives:pool.slice(1),line,brigade,now};
}
// Najbliższy odcinek polilinii przystanków dla danego kursu.
function etaSpatialFit(choice,v,trips){
 const named=wtpCompleteEtaMapping(choice.etaStops,etaNameMatch(choice.etaStops,trips,choice.course));
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
// v191: zapamiętanie zakończenia kursu także przy braku mapowania słupka GTFS.
const WTP_COMPLETED_COURSES_KEY='wtp-live-v271-completed-courses';
const wtpCompletedCourses=new Map();
// Utrzymuj zakończone kursy także po ponownym otwarciu panelu i strony.
try{
 const stored=JSON.parse(localStorage.getItem(WTP_COMPLETED_COURSES_KEY)||'[]');
 for(const [key,entry] of stored){
  if(entry&&Date.now()-Number(entry.at)<6*3600000&&Array.isArray(entry.ids))
   wtpCompletedCourses.set(key,{at:Number(entry.at),ids:new Set(entry.ids.map(String))});
 }
}catch(_){ }
function wtpMarkCourseCompleted(key,id){
 const old=wtpCompletedCourses.get(key),now=Date.now();
 const ids=new Set(old&&now-old.at<6*3600000?old.ids:[]);
 ids.add(String(id));
 wtpCompletedCourses.set(key,{ids,at:now});
 try{
  const recent=[...wtpCompletedCourses].filter(([,r])=>now-r.at<6*3600000)
   .slice(-300).map(([k,r])=>[k,{at:r.at,ids:[...r.ids]}]);
  localStorage.setItem(WTP_COMPLETED_COURSES_KEY,JSON.stringify(recent));
 }catch(_){ }
}

// Dowód dojazdu do krańca musi pochodzić z kolejnych świeżych pomiarów
// tego samego pojazdu, a nie z samego zegara lub najbliższego słupka.
const wtpTerminalArrivalEvidence=new Map();
function wtpTerminalArrivalConfirmed(key,choice,trips,v){
 const stamp=gpsMs(v.Time),now=Date.now();
 if(!Number.isFinite(stamp)||Math.abs(now-stamp)>180000)return false;
 const last=choice.etaStops.length-1;
 const courseId=String(choice.course.course_id);
 const previous=wtpTerminalArrivalEvidence.get(key);
 // Użyj dokładnie tego samego stanu GPS, który pogrubia ostatni
 // przystanek na liście. Tylko geometria bieżącego kursu.
 const routeKey=wtpCourseMapLayer?._wtpRouteKey||'';
 const sameRoute=wtpActiveCourseVehicle===key&&routeKey.startsWith(key+'|'+courseId+'|');
 const progress=sameRoute?wtpRouteProgress():null;
 const marker=sameRoute?wtpActiveCourseStopMarkers.find(m=>m.index===last):null;
 const status=marker&&progress?wtpCourseStopStatus(last,marker.coords,NaN,progress):null;
 const confirmed=sameRoute&&status?.gpsFresh?progress.next===last&&status.distance<=35&&status.remaining>=-35&&status.remaining<=100:wtpEndProximity(choice,trips,v);
 if(!confirmed){
  if(previous?.courseId===courseId)wtpTerminalArrivalEvidence.delete(key);
  return false;
 }
 if(!previous||previous.courseId!==courseId||stamp<previous.lastStamp){
  wtpTerminalArrivalEvidence.set(key,{courseId,firstSeenAt:now,lastStamp:stamp});
  return false;
 }
 if(stamp>previous.lastStamp)previous.lastStamp=stamp;
 return now-previous.firstSeenAt>=5000;
}

function wtpEndProximity(choice,trips,v){
 // v218: Tylko ostatni SŁUPEK danego kursu, nie najbliższy punkt
 // na trasie ani przystanek początkowy następnego kursu.
 const pos=coursePosition(choice,trips,v);
 if(!pos||!pos.matched)return false;
 const last=choice.etaStops.length-1;
 const j=pos.matched.mapping[last];
 const stop=j>=0?pos.matched.trip.stops[j]:null;
 if(!stop)return false; // brak pewnej geometrii: nie przełączaj
 const lat=Number(stop[2]),lon=Number(stop[3]);
 if(!Number.isFinite(lat)||!Number.isFinite(lon))return false;
 const d=geoDistance(Number(v.Lat),Number(v.Lon),lat,lon);
 return Number.isFinite(d)&&d<=35&&pos.index===last;
}
// v238: W przypadku opuszczonych kursów porównujemy także oba krańce,
// rzeczywisty przebieg GPS i czas kursu. Nie przyjmujemy kursu wyłącznie
// dlatego, że pojazd znajduje się na wspólnym odcinku trasy.
function wtpRecoveryCourse(candidates,v,trips,now,old){
 const lat=Number(v.Lat),lon=Number(v.Lon);
 if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;
 const stamp=gpsMs(v.Time);
 if(!Number.isFinite(stamp)||Math.abs(Date.now()-stamp)>90000)return null;
 const key=vehicleKey(v),trace=(gpsTraces.get(key)||[]).filter(p=>p.line===String(v.Lines||'')&&p.brigade===normalizeBrigade(v.Brigade)&&stamp-p.t<=180000).slice(-10);
 const scored=[];
 for(const choice of candidates){
  if(String(choice.course.course_id)===old?.id)continue;
  // Wybór według aktualnego rozkładu brygady, a nie kursów sprzed kilku godzin.
  if(choice.bounds.start>now+12||choice.bounds.end<now-35)continue;
  const pos=coursePosition(choice,trips,v),fit=etaSpatialFit(choice,v,trips);
  if(!pos?.matched||!fit||fit.distance>140)continue;
  const firstIndex=pos.matched.mapping[0],lastIndex=pos.matched.mapping[choice.etaStops.length-1];
  const first=firstIndex>=0?pos.matched.trip.stops[firstIndex]:null;
  const last=lastIndex>=0?pos.matched.trip.stops[lastIndex]:null;
  if(!first||!last)continue;
  const dStart=geoDistance(lat,lon,Number(first[2]),Number(first[3]));
  const dEnd=geoDistance(lat,lon,Number(last[2]),Number(last[3]));
  const atStart=dStart<=110,atEnd=dEnd<=80;
  // Przed startem tylko właściwy kraniec; w czasie jazdy zgodność
  // położenia na trasie i godziny odpowiadającej temu fragmentowi.
  if(now<choice.bounds.start-2&&!atStart)continue;
  if(now>choice.bounds.end+12&&!atEnd)continue;
  let clockGap=Infinity;
  if(Number.isFinite(fit.time))for(const shift of [-1440,0,1440])clockGap=Math.min(clockGap,Math.abs(now+shift-fit.time));
  if(!atStart&&!atEnd&&clockGap>30)continue;
  // Potwierdź kierunek, jeśli dostępne są kolejne próbki GPS.
  let directionPenalty=0;
  if(trace.length>=2){
   const prev=trace[0],moved=geoDistance(prev.lat,prev.lon,lat,lon);
   if(moved>=35){
    const prevToStart=geoDistance(prev.lat,prev.lon,Number(first[2]),Number(first[3]));
    const prevToEnd=geoDistance(prev.lat,prev.lon,Number(last[2]),Number(last[3]));
    if(!atStart&&prevToEnd+35<dEnd)directionPenalty+=80;
    if(atStart&&prevToStart+35<dStart)directionPenalty+=25;
   }
  }
  const score=fit.distance*.7+Math.min(clockGap,60)*2+directionPenalty+(atStart? -45:0)
   +(atEnd&&now>=choice.bounds.end?-12:0)+Math.abs(now-Math.max(choice.bounds.start,Math.min(now,choice.bounds.end)))*2;
  scored.push({choice,score,atStart,atEnd,fit});
 }
 scored.sort((a,b)=>a.score-b.score);
 if(!scored.length)return null;
 // Wspólny odcinek dwóch kursów: nie wybieraj przypadkowego kierunku.
 if(scored.length>1&&scored[1].score-scored[0].score<12&&!scored[0].atStart)return null;
 return scored[0];
}
// v269: odzyskiwanie kursu po pominiętym kółku, gdy nie zarejestrowano
// pięciosekundowego postoju na krańcu. Nie wystarcza sama godzina ani
// bliskość trasy: wymagamy świeżego, rzeczywistego ruchu GPS zgodnego
// z postępem nowego kursu tej samej linii i brygady.
function wtpRecoverMovingCourse(candidates,current,v,trips,now){
 const stamp=gpsMs(v.Time);
 if(!Number.isFinite(stamp)||Math.abs(Date.now()-stamp)>90000)return null;
 const trace=(gpsTraces.get(vehicleKey(v))||[]).filter(p=>
  p.line===String(v.Lines||'')&&p.brigade===normalizeBrigade(v.Brigade)&&
  p.t<=stamp&&stamp-p.t<=180000);
 if(trace.length<2)return null;
 const last=trace.at(-1);
 const previous=[...trace].reverse().find(p=>p.t<last.t-10000&&
  geoDistance(p.lat,p.lon,last.lat,last.lon)>=65);
 if(!previous)return null;
 const oldId=String(current.course.course_id);
 const oldFit=etaSpatialFit(current,v,trips);
 const possible=[];
 for(const choice of candidates){
  if(String(choice.course.course_id)===oldId)continue;
  // Pomijamy wyłącznie kursy wcześniejsze niż obecnie przypisany.
  if(choice.bounds.start<=current.bounds.start||choice.bounds.start>now+2||choice.bounds.end<now-35)continue;
  const fit=etaSpatialFit(choice,v,trips);
  if(!fit||fit.distance>85||!Number.isFinite(fit.time))continue;
  const prevVehicle={...v,Lat:previous.lat,Lon:previous.lon};
  const before=etaSpatialFit(choice,prevVehicle,trips);
  if(!before||before.distance>130||!Number.isFinite(before.time))continue;
  // Obie pozycje muszą wskazywać jazdę w kolejności przystanków,
  // nie tylko przebywanie na wspólnym odcinku w odwrotnym kierunku.
  const progress=fit.index+fit.f-(before.index+before.f);
  if(progress<0.12||fit.time-before.time<0.15)continue;
  const clockGap=Math.min(...[-1440,0,1440].map(shift=>Math.abs(now+shift-fit.time)));
  if(clockGap>25)continue;
  // Nie zmieniaj kursu, jeżeli dotychczasowy nadal odpowiada
  // świeżej pozycji i jego planowany koniec nie minął.
  if(oldFit&&oldFit.distance<=90&&now<=current.bounds.end+5){
   const oldBefore=etaSpatialFit(current,prevVehicle,trips);
   if(!oldBefore||oldBefore.distance>130||oldFit.index+oldFit.f-(oldBefore.index+oldBefore.f)>-0.12)continue;
  }
  const score=fit.distance+clockGap*2+(before.distance*.2);
  possible.push({choice,score});
 }
 possible.sort((a,b)=>a.score-b.score);
 if(!possible.length||possible.length>1&&possible[1].score-possible[0].score<15)return null;
 return possible[0].choice;
}
// v266: odjazd z krańca wykrywany z dwóch kolejnych pomiarów GPS.
// Sam upływ czasu podczas postoju nie pomija kursu.
function wtpActualTerminalDeparture(choice,v,trips){
 const stamp=gpsMs(v.Time);
 if(!Number.isFinite(stamp)||Math.abs(Date.now()-stamp)>90000)return false;
 const startStop=choice.etaStops?.[0];
 const pole=wtpEtaPoleCoords(startStop);
 const pos=pole?null:coursePosition(choice,trips,v);
 const j=pos?.matched?.mapping?.[0]??-1;
 const st=j>=0?pos.matched.trip.stops[j]:null;
 if(!pole&&!st)return false;
 const lat=pole?pole[0]:Number(st[2]),lon=pole?pole[1]:Number(st[3]);
 const nowDist=geoDistance(Number(v.Lat),Number(v.Lon),lat,lon);
 if(!Number.isFinite(nowDist)||nowDist<110||nowDist>1800)return false;
 const trace=(gpsTraces.get(vehicleKey(v))||[]).filter(p=>
  p.line===String(v.Lines||'')&&p.brigade===normalizeBrigade(v.Brigade)&&
  p.t<=stamp&&stamp-p.t<=12*60000);
 return trace.some(p=>p.t<stamp&&geoDistance(p.lat,p.lon,lat,lon)<=TERMINAL_RADIUS_M);
}
function etaSelectCourse(match,v,trips){
 match.terminalPreselected=false;
 const key=vehicleKey(v),old=activeCourseByVehicle.get(key),now=match.now=nowWarsaw(new Date(gpsMs(v.Time)||Date.now()));
 const candidates=[match.selected,...match.alternatives];
 // v271: zapamiętany kurs wyznacza dolną granicę kolejności brygady.
 // Gdy odzyskano późniejsze kółko, ponowne dopasowanie ETA nie może
 // cofnąć pojazdu do kursu zakończonego przed jego rozpoczęciem.
 const oldChoice=old&&candidates.find(c=>String(c.course.course_id)===old.id);
 const oldStart=oldChoice?.bounds.start??(Number.isFinite(old?.start)?old.start:null);
 // Zakończony kurs nie może ponownie wygrać punktacją po przełączeniu.
 const completed=wtpCompletedCourses.get(key);
 if(completed&&Date.now()-completed.at>6*3600000)wtpCompletedCourses.delete(key);
 const blocked=wtpCompletedCourses.get(key);
 const available=candidates.filter(c=>
  !blocked?.ids?.has(String(c.course.course_id))&&
  (oldStart===null||c.bounds.start>=oldStart-0.01));
 // Nie odblokowuj zakończonych kursów, gdy nie ma jeszcze danych
 // kolejnego: zachowaj bieżące przypisanie zamiast cofać historię.
 const pool=available.length?available:(oldChoice?[oldChoice]:candidates.filter(c=>!blocked?.ids?.has(String(c.course.course_id))));
 // v276: inicjalizacja panelu nie jest zdarzeniem przyjazdu.
 if(match.initialTerminalCheck){
  const stamp=gpsMs(v.Time);
  const distance=(c,i)=>{
   const stop=c.etaStops[i];
   let pole=wtpEtaPoleCoords(stop)||wtpEtaOfficialStop(stop)?.coords;
   if(!pole&&trips.length){const m=wtpCompleteEtaMapping(c.etaStops,etaNameMatch(c.etaStops,trips,c.course));const st=m?.trip?.stops?.[m.mapping[i]];if(st)pole=[Number(st[2]),Number(st[3])];}
   return pole?geoDistance(Number(v.Lat),Number(v.Lon),...pole):Infinity;
  };
  if(Number.isFinite(stamp)&&Math.abs(Date.now()-stamp)<=90000){
   const arrivals=pool.filter(c=>c.bounds.end<=now+5&&c.bounds.end>=now-120&&distance(c,c.etaStops.length-1)<=35).sort((a,b)=>b.bounds.end-a.bounds.end);
   const arrival=arrivals[0];
   const next=arrival&&pool.filter(c=>c.bounds.start>arrival.bounds.start&&c.bounds.start>=arrival.bounds.end-2).sort((a,b)=>a.bounds.start-b.bounds.start)[0];
   const waiting=pool.filter(c=>c.bounds.start>=now&&distance(c,0)<=35).sort((a,b)=>a.bounds.start-b.bounds.start)[0];
   const chosen=waiting||next;
   if(chosen&&(!oldChoice||chosen.bounds.start>=oldChoice.bounds.start)){
    const id=String(chosen.course.course_id);
    if(arrival&&arrival!==chosen)wtpMarkCourseCompleted(key,arrival.course.course_id);
    match.selected=chosen;match.alternatives=candidates.filter(c=>c!==chosen);
    match.terminalPreselected=true;match.gpsVerified=false;match.matchWarning='';
    wtpSaveActiveCourse(key,{id,start:chosen.bounds.start,end:chosen.bounds.end,terminalSeenAt:0,at:Date.now(),preselected:true});
    match.initialTerminalCheck=false;return match;
   }
  }
  if(trips.length)match.initialTerminalCheck=false;
 }
 // v238: 5 sekund od wykrycia GPS na przystanku krańcowym.
 // Jedyny dodatkowy warunek: istnieje następny kurs tej samej brygady.
 // Nie wymagamy początku następnego kursu blisko GPS ani jego godziny odjazdu.
 if(old && Date.now()-old.at<3*3600000){
  const current=candidates.find(c=>String(c.course.course_id)===old.id);
  if(current){
   const stamp=gpsMs(v.Time);
   const fresh=Number.isFinite(stamp)&&Math.abs(Date.now()-stamp)<=180000;
   const atTerminal=fresh&&wtpTerminalArrivalConfirmed(key,current,trips,v);
   if(atTerminal){
    if(!old.terminalSeenAt)old.terminalSeenAt=Date.now();
    const upcoming=candidates.filter(c=>String(c.course.course_id)!==old.id)
     .filter(c=>Number.isFinite(c.bounds.start)&&c.bounds.start>current.bounds.start)
     .sort((a,b)=>a.bounds.start-b.bounds.start);
    const next=upcoming[0];
    if(next){
     // v266: po pięciu sekundach zawsze wybierz bezpośrednio
     // następny kurs tej samej brygady, niezależnie od godziny.
     wtpMarkCourseCompleted(key,old.id);
     match.selected=next;
     match.alternatives=candidates.filter(c=>String(c.course.course_id)!==String(next.course.course_id));
     match.gpsVerified=false;
     match.matchWarning='';
     wtpSaveActiveCourse(key,{id:String(next.course.course_id),start:next.bounds.start,end:next.bounds.end,terminalSeenAt:0,at:Date.now(),preselected:true});
     return match;
    }
   }else {old.terminalSeenAt=0;const e=wtpTerminalArrivalEvidence.get(key);if(e&&e.courseId!==String(current.course.course_id))wtpTerminalArrivalEvidence.delete(key);}
  }
  // v238: kurs mógł zostać pominięty. Po znacznym przekroczeniu
  // jego planowego końca nie utrzymuj go w nieskończoność przez GPS.
  // Zmiana wymaga jednoznacznego dopasowania innego kursu tej brygady
  // do czasu, właściwego krańca i kierunku ruchu.
  // v258: nie przełączaj na podstawie samego czasu lub punktacji GPS.
  // Podczas rzeczywistego dojazdu do krańca utrzymuj dotychczasowy kurs.
  if(current){
   // v269: niezależne odzyskanie kursu po wypadniętym kółku.
   // Działa także wtedy, gdy poprzedniego przyjazdu na kraniec nie
   // udało się wykryć. Wymaga zgodnego kierunku z historii GPS.
   const recovered=wtpRecoverMovingCourse(pool,current,v,trips,now);
   if(recovered){
    const id=String(recovered.course.course_id);
    wtpMarkCourseCompleted(key,old.id);
    match.selected=recovered;
    match.alternatives=candidates.filter(c=>String(c.course.course_id)!==id);
    match.gpsVerified=true;match.matchWarning='';
    wtpSaveActiveCourse(key,{id,start:recovered.bounds.start,end:recovered.bounds.end,terminalSeenAt:0,at:Date.now(),preselected:false});
    return match;
   }
   // Gdy kurs został wybrany po przyjeździe, a pojazd rzeczywiście
   // ruszył dopiero o godzinie kolejnego kółka, pomiń wypadnięte kursy.
   if(old.preselected&&wtpActualTerminalDeparture(current,v,trips)){
    const stamp=gpsMs(v.Time),departure=nowWarsaw(new Date(stamp));
    const later=candidates.filter(c=>c.bounds.start>current.bounds.start)
     .sort((a,b)=>a.bounds.start-b.bounds.start);
    const eligible=later.filter(c=>Math.abs(c.bounds.start-departure)<Math.abs(current.bounds.start-departure));
    const chosen=eligible.sort((a,b)=>Math.abs(a.bounds.start-departure)-Math.abs(b.bounds.start-departure))[0];
    if(chosen){
     const id=String(chosen.course.course_id);
     wtpMarkCourseCompleted(key,old.id);
     match.selected=chosen;
     match.alternatives=candidates.filter(c=>String(c.course.course_id)!==id);
     match.gpsVerified=true;match.matchWarning='';
     wtpSaveActiveCourse(key,{id,start:chosen.bounds.start,end:chosen.bounds.end,terminalSeenAt:0,at:Date.now(),preselected:false});
     return match;
    }
    old.preselected=false;
   }
   match.selected=current;
   match.alternatives=candidates.filter(c=>String(c.course.course_id)!==old.id);
   match.terminalPreselected=!!old.preselected&&!wtpActualTerminalDeparture(current,v,trips);
   match.gpsVerified=!!etaSpatialFit(current,v,trips);
   match.matchWarning='';
   old.at=Date.now();wtpSaveActiveCourse(key,old);
   return match;
  }
  if(old.preselected&&current&&now<current.bounds.start){
   match.selected=current;
   match.alternatives=candidates.filter(c=>String(c.course.course_id)!==old.id);
   match.gpsVerified=false;
   match.matchWarning='Następny kurs brygady — oczekiwanie na odjazd';
   old.at=Date.now();wtpSaveActiveCourse(key,old);return match;
  }
 }
 // Przy pierwszym otwarciu panelu nie zakładaj, że kurs rozpoczęty planowo
 // został już przejęty. Jeśli GPS nadal dojeżdża do krańca poprzedniego
 // kursu, zachowaj go aż do potwierdzonego przyjazdu.
 if(!old){
  const trace=(gpsTraces.get(key)||[]).filter(p=>p.line===String(v.Lines||'')&&p.brigade===normalizeBrigade(v.Brigade)).slice(-12);
  const previous=pool.filter(c=>c.bounds.start<=now&&c.bounds.end<=now+5&&now-c.bounds.end<=45)
   .map(c=>({choice:c,pos:coursePosition(c,trips,v)}))
   .filter(x=>x.pos?.matched&&x.pos.distance<=180)
   .filter(x=>{
    const last=x.choice.etaStops.length-1,j=x.pos.matched.mapping[last],st=j>=0?x.pos.matched.trip.stops[j]:null;
    if(!st)return false;
    const lat=Number(st[2]),lon=Number(st[3]);
    const d=geoDistance(Number(v.Lat),Number(v.Lon),lat,lon);
    const approach=trace.some(t=>{const td=geoDistance(t.lat,t.lon,lat,lon);return td>=d+60&&td<=900;});
    return d<=180&&approach;
   }).sort((a,b)=>b.choice.bounds.start-a.choice.bounds.start);
  if(previous.length){
   const choice=previous[0].choice,id=String(choice.course.course_id);
   match.selected=choice;match.alternatives=candidates.filter(c=>String(c.course.course_id)!==id);
   match.gpsVerified=true;match.matchWarning='';
   wtpSaveActiveCourse(key,{id,start:choice.bounds.start,end:choice.bounds.end,terminalSeenAt:0,at:Date.now()});
   return match;
  }
 }
 const scored=pool.map(choice=>{
  const fit=etaSpatialFit(choice,v,trips);
  if(!fit||fit.distance>240)return null;
  // Kurs przyszły może zostać wybrany wyłącznie po potwierdzonym dojeździe na kraniec.
  if(choice.bounds.start>now+0.5)return null;
  // Dopuszczamy do 120 minut opóźnienia, ale nie kurs w przyszłości.
  let lateness=Infinity;
  if(Number.isFinite(fit.time))for(const shift of [-1440,0,1440]){
   const delta=now+shift-fit.time;
   if(delta>=-5&&delta<=35)lateness=Math.min(lateness,delta);
  }
  if(!Number.isFinite(lateness))return null;
  // Zmniejszamy premię dla starego kursu po jego planowym zakończeniu.
  // Nie blokuj kolejnego kursu wyłącznie z powodu wcześniejszego dopasowania.
  const oldFinished=old&&Number.isFinite(old.end)&&now>old.end+2;
  const continuity=old?.id===String(choice.course.course_id)?(oldFinished?-8:-65):0;
  return {choice,fit,score:fit.distance+lateness*1.8+continuity,lateness};
 }).filter(Boolean).sort((a,b)=>a.score-b.score);
 if(!scored.length){
  if(blocked&&blocked.ids.size){match.matchWarning='Zakończony kurs — brak potwierdzonego następnego kursu';}
  match.gpsVerified=false;match.matchWarning='Brak pewnego dopasowania GPS — historia pomiarów pozostaje zachowana';return match;}
 let first=scored[0],second=scored[1];
 // v218: Usunięto wszystkie historyczne przełączniki oparte tylko na
 // godzinie końca kursu, bliskości początku następnego kursu i punktacji GPS.
 // Jedyną drogą zmiany zapamiętanego kursu jest potwierdzenie ostatniego
 // słupka w etaSelectCourse (5 sekund, świeży GPS), albo odzyskanie pominiętego kursu.
 match.gpsVerified=!first.terminalPreselected&&first.fit.distance<=110&&(!second||second.score-first.score>=15||old?.id===String(first.choice.course.course_id));
 match.selected=first.choice;
 match.alternatives=candidates.filter(c=>String(c.course.course_id)!==String(first.choice.course.course_id));
 match.matchWarning=match.gpsVerified?'':'Dopasowanie kursu niejednoznaczne';
 if(match.gpsVerified||first.terminalPreselected){
  const id=String(first.choice.course.course_id);
  wtpSaveActiveCourse(key,{id,start:first.choice.bounds.start,end:first.choice.bounds.end,terminalSeenAt:old?.id===id?old.terminalSeenAt||0:0,at:Date.now()});
 }
 return match;
}
// WTP LIVE v63: nazwy przystanków ETA nie są identyfikatorami GTFS.
// Mapujemy je po uporządkowanym przebiegu i godzinach, bez fikcyjnego utożsamiania ID.
const wtpNameMatchCache=new WeakMap();
function etaNameMatch(etaStops,gtfsTrips,course){
 if(!Array.isArray(etaStops)||!Array.isArray(gtfsTrips)||!gtfsTrips.length)return etaNameMatchImpl(etaStops,gtfsTrips,course);
 let cache=wtpNameMatchCache.get(etaStops);if(!cache){cache=new WeakMap();wtpNameMatchCache.set(etaStops,cache);}
 if(cache.has(gtfsTrips))return cache.get(gtfsTrips);
 const result=etaNameMatchImpl(etaStops,gtfsTrips,course);cache.set(gtfsTrips,result);return result;
}
function etaNameMatchImpl(etaStops,gtfsTrips,course){
 const eta=etaMonotonicStops(etaStops), candidates=[];
 for(const trip of gtfsTrips||[]){
  const ss=trip.stops||[];if(ss.length<2)continue;
  const ts=ss.map(s=>minutes(s[4]));
  if(!ts.every(Number.isFinite))continue;
  const eTimes=eta.map(s=>s._time);
  const a=eTimes.find(Number.isFinite),z=[...eTimes].reverse().find(Number.isFinite);
  if(!Number.isFinite(a)||!Number.isFinite(z))continue;
  // v158: porownuj przebieg i CZASY WZGLEDNE. GTFS moze pochodzic
  // z wczoraj i miec inne godziny odjazdu tego samego wariantu.
  const eBase=a, gBase=ts[0];
  const eRel=eTimes.map(t=>Number.isFinite(t)?t-eBase:NaN);
  const gRel=ts.map(t=>Number.isFinite(t)?t-gBase:NaN);
  const durationGap=Math.abs((z-a)-(ts.at(-1)-ts[0]));
  if(durationGap>Math.max(8,Math.ceil((z-a)*.18)))continue;
  const startGap=0,endGap=durationGap;
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
   const delta=Number.isFinite(eRel[i-1])&&Number.isFinite(gRel[j-1])?Math.abs(eRel[i-1]-gRel[j-1]):10;
   const same=dp[i-1][j-1]+Math.min(18,delta)*1.8;
   const del=dp[i-1][j]+skip,ins=dp[i][j-1]+skip;
   if(same<=del&&same<=ins){dp[i][j]=same;back[i][j]=0}
   else if(del<=ins){dp[i][j]=del;back[i][j]=1}
   else{dp[i][j]=ins;back[i][j]=2}
  }
  const mapping=new Array(n).fill(-1);let i=n,j=m,matched=0,errors=0;
  while(i>0||j>0){const op=back[i][j];if(i>0&&j>0&&op===0){
   const delta=Math.abs(eRel[i-1]-gRel[j-1]);
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
   candidates[0].trip.stops.map(s=>s[0]).join()!==candidates[1].trip.stops.map(s=>s[0]).join()){
  // Różne numery słupków nie wykluczają identycznych nazw w tym samym porządku.
  // Nie odrzucaj całej listy, jeżeli każdy z konkurencyjnych przebiegów
  // przypisuje dokładnie te same nazwy do pozycji ETA.
  const signature=c=>eta.map((_,i)=>{
   const j=c.mapping[i];return j>=0?String(c.trip.stops[j]?.[1]||'').trim():'';
  }).join('\u0001');
  const best=signature(candidates[0]);
  if(candidates.filter(c=>c.score-candidates[0].score<3).some(c=>signature(c)!==best))return null;
 }
 return candidates[0]||null;
}
// v258: ETA is the source of the course and stop order. Resolve stop identity
// from its actual metadata, then official pole data / a uniquely matched GTFS stop.
// Never invent a technical stop just because the ETA identifier is internal.
// v266: współrzędne konkretnego słupka ETA; wartości GPS_s/GPS_n
// rozpoznawane po polskich zakresach, nie po mylących nazwach pól.
function wtpEtaPoleCoords(stop){
 const valid=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=48&&lat<=56&&lon>=13&&lon<=26;
 const directLat=Number(stop?.lat??stop?.latitude),directLon=Number(stop?.lon??stop?.longitude);
 if(valid(directLat,directLon))return [directLat,directLon];
 const a=Number(stop?.gps_s),b=Number(stop?.gps_n);
 if(valid(a,b))return [a,b];
 if(valid(b,a))return [b,a];
 const c=Number(stop?.gps_e);
 if(valid(a,c))return [a,c];
 if(valid(b,c))return [b,c];
 return null;
}
function wtpEtaOfficialStop(stop){
 const sid=String(stop?.stop_id??stop?.stopId??'').trim();
 const pole=String(stop?.slupek??stop?.stop_no??stop?.nr_slupka??'').trim();
 const group=String(stop?.zespol??stop?.id_zespolu??'').trim();
 const code=String(stop?.stop_code??stop?.kod_przystanku??'').trim();
 const lat=Number(stop?.lat??stop?.latitude??stop?.szer_geo);
 const lon=Number(stop?.lon??stop?.longitude??stop?.dlug_geo);
 const candidates=[];
 for(const row of stopsGlobalForEtaNames()){
  const g=String(value(row,'zespol')||value(row,'id_zespolu')||'').trim();
  const n=String(value(row,'slupek')||'').trim();
  const full=g.padStart(4,'0')+n.padStart(2,'0');
  const byCode=(code&&code===full)||(sid.length===6&&sid===full)||
   (group&&pole&&Number(group)===Number(g)&&Number(pole)===Number(n));
  const c=stopCoordinates(row);
  const byCoords=Number.isFinite(lat)&&Number.isFinite(lon)&&c&&
   geoDistance(lat,lon,c[0],c[1])<=8;
  if(byCode||byCoords)candidates.push({row,coords:c,byCode:!!byCode});
 }
 if(!candidates.length)return null;
 const exact=candidates.filter(x=>x.byCode);
 const matches=exact.length?exact:candidates;
 const names=[...new Set(matches.map(x=>wtpStopGroupName(x.row)).filter(Boolean))];
 return names.length===1?{name:names[0],coords:matches[0].coords}:null;
}
// v259: Source ETA stop metadata is authoritative for non-GTFS depot/technical stops.
function wtpEtaSourceStopLabel(stop){
 const fields=['nazwa_przystanku','nazwa_slupka','nazwa_zespolu','nazwa_punktu',
  'nazwa_postoju','nazwa','stop_name','name','oznaczenie_slupka',
  'symbol_slupka','kod_slupka','oznaczenie_przystanku'];
 for(const field of fields){
  const value=String(stop?.[field]??'').trim();
  if(value&&!/^Przystanek\s+\d+$/i.test(value)&&
     !/^Przystanek techniczny \(ETA /i.test(value)&&
     value!=='Nieustalona nazwa przystanku')return value;
 }
 return '';
}
function wtpResolveEtaStopName(stop, matchedStop, tripList){
 const source=wtpEtaSourceStopLabel(stop);
 if(source)return source;
 // ETA ID to identyfikator techniczny, nie nazwa słupka. Nie używaj
 // nazwy z dopasowania GTFS, zwłaszcza przy zjazdach do zajezdni.
 const code=String(stop?.symbol??stop?.kod??stop?.oznaczenie??stop?.stop_label??'').trim();
 if(code)return code;
 const sid=String(stop?.stop_id??stop?.id_slupka??'').trim();
 return sid?'ETA '+sid:'Brak nazwy w ETA';
}
function stopsGlobalForEtaNames(){return typeof stops!=='undefined'&&Array.isArray(stops)?stops:[];}
// v156: uzupełniaj wyłącznie jednoznaczne słupki z tego samego wariantu.
// Luki w wyrównaniu godzin nie oznaczają automatycznie innego przystanku.
function wtpCompleteEtaMapping(etaStops,matched){
 if(!matched)return null;
 const mapping=matched.mapping.slice(),gtfs=matched.trip.stops||[];
 const eta=etaMonotonicStops(etaStops);
 const candidates=[];
 for(let i=0;i<mapping.length;i++){
  if(mapping[i]>=0)continue;
  let left=i-1,right=i+1;
  while(left>=0&&mapping[left]<0)left--;
  while(right<mapping.length&&mapping[right]<0)right++;
  const low=left>=0?mapping[left]+1:0;
  const high=right<mapping.length?mapping[right]-1:gtfs.length-1;
  if(low>high)continue;
  const t=eta[i]._time;
  if(!Number.isFinite(t))continue;
  const anchor=mapping.findIndex(x=>x>=0);
  if(anchor<0)continue;
  const eAnchor=eta[anchor]._time,gAnchor=minutes(gtfs[mapping[anchor]]?.[4]);
  if(!Number.isFinite(eAnchor)||!Number.isFinite(gAnchor))continue;
  const viable=[];
  for(let j=low;j<=high;j++){
   const gt=minutes(gtfs[j]?.[4]);
   const gap=Math.abs((t-eAnchor)-(gt-gAnchor));
   if(Number.isFinite(gap)&&gap<=1.1)viable.push({j,gap});
  }
  viable.sort((a,b)=>a.gap-b.gap);
  // Dwa przystanki o tej samej godzinie: rozstrzygaj tylko gdy oba
  // mają identyczną nazwę; nie wybieraj przypadkowego słupka.
  if(viable.length===1)mapping[i]=viable[0].j;
  else if(viable.length>1){
   const names=new Set(viable.map(x=>String(gtfs[x.j]?.[1]||'').trim()));
   if(names.size===1&&[...names][0].length>0)mapping[i]=viable[0].j;
  }
 }
 return {...matched,mapping};
}
function wtpOfficialNameAtCoords(coords){
 if(!Array.isArray(coords)||coords.length<2||!Array.isArray(stops)||!stops.length)return '';
 const lat=Number(coords[0]),lon=Number(coords[1]);
 if(!Number.isFinite(lat)||!Number.isFinite(lon))return '';
 const matches=[];
 for(const row of stops){
  const p=stopCoordinates(row);
  if(!p||Math.abs(p[0]-lat)>.00013||Math.abs(p[1]-lon)>.0002)continue;
  const d=geoDistance(lat,lon,p[0],p[1]);
  if(d<=10){const name=wtpStopGroupName(row);if(name)matches.push({name,d});}
 }
 if(!matches.length)return '';
 matches.sort((a,b)=>a.d-b.d);
 const nearest=matches.filter(x=>x.d<=Math.max(3,matches[0].d+2));
 return nearest.every(x=>x.name===nearest[0].name)?nearest[0].name:'';
}
function etaNamesForCourse(stops,gtfsTrips,course){
 const matched=wtpCompleteEtaMapping(stops,etaNameMatch(stops,gtfsTrips,course));
 return {matched:!!matched,mapping:matched?.mapping,trip:matched?.trip,names:stops.map((s,i)=>{
  const j=matched?.mapping[i];
  return wtpResolveEtaStopName(s,j>=0?matched.trip.stops[j]:null,gtfsTrips);
 })};
}
// WERSJA 65: dopasowanie postępu pojazdu na trasie i zmiana kursu na pętli.
// 90 m to próg weryfikacji terminala; 30 m było zbyt małe przy GPS w ruchu.
const TERMINAL_RADIUS_M=90;
// v229: trwałe przypisanie kursu po odświeżeniu przeglądarki.
const WTP_ACTIVE_COURSES_KEY='wtp-live-v229-active-courses';
const activeCourseByVehicle=new Map();
try{
 const saved=JSON.parse(localStorage.getItem(WTP_ACTIVE_COURSES_KEY)||'[]');
 for(const [key,record] of saved){
  if(record&&record.id&&Date.now()-record.at<3*3600000)activeCourseByVehicle.set(key,record);
 }
}catch{}
function wtpSaveActiveCourse(key,record){
 const previous=activeCourseByVehicle.get(key);
 if(previous&&Date.now()-previous.at<3*3600000&&
    Number.isFinite(previous.start)&&Number.isFinite(record.start)&&
    record.start<previous.start-0.01)return;
 activeCourseByVehicle.set(key,record);
 try{
  const recent=[...activeCourseByVehicle].filter(([,r])=>r&&Date.now()-r.at<3*3600000).slice(-300);
  localStorage.setItem(WTP_ACTIVE_COURSES_KEY,JSON.stringify(recent));
 }catch{}
}

function coursePosition(choice,trips,v){
 const named=wtpCompleteEtaMapping(choice.etaStops,etaNameMatch(choice.etaStops,trips,choice.course));
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
// v137: dane do etykiet wybranego kursu, pochodzą z tego samego obliczenia co lista.
const wtpCourseStopDisplay=new Map();
const GPS_TRACE_KEY='wtp-live-v88-gps-traces';
const gpsTraces=new Map();
try{const saved=JSON.parse(localStorage.getItem(GPS_TRACE_KEY)||'{}');for(const [k,arr] of Object.entries(saved))if(Array.isArray(arr))gpsTraces.set(k,arr.filter(p=>Date.now()-p.t<24*60*60000).slice(-100));}catch{}
let gpsTraceSaveAt=0;
function rememberGps(v){
 const t=gpsMs(v.Time),lat=Number(v.Lat),lon=Number(v.Lon),key=vehicleKey(v);
 if(!Number.isFinite(t)||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(Date.now()-t)>5*60000)return;
 const arr=gpsTraces.get(key)||[];
 if(arr.length&&t<=arr[arr.length-1].t)return;
 arr.push({t,lat,lon,line:String(v.Lines||''),brigade:normalizeBrigade(v.Brigade)});
 while(arr.length>100||arr.length&&t-arr[0].t>90*60000)arr.shift();
 gpsTraces.set(key,arr);
 if(Date.now()-gpsTraceSaveAt>30000){gpsTraceSaveAt=Date.now();try{const entries=[...gpsTraces].filter(([k,a])=>a.length&&Date.now()-a.at(-1).t<24*60*60000).slice(-400);localStorage.setItem(GPS_TRACE_KEY,JSON.stringify(Object.fromEntries(entries)));}catch{}}
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
 const named=wtpCompleteEtaMapping(choice.etaStops,etaNameMatch(choice.etaStops,trips,choice.course));
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

 // v237: Oddalenie się od słupka (również o 95 m) NIE jest
 // potwierdzeniem obsługi przystanku ani dowodem opóźnienia.
 // Pomiędzy dwoma odczytami autobus może ominąć promień słupka.
 // Potwierdzenie przejazdu jest ustalane niżej z chronologicznej
 // historii GPS i postępu wzdłuż trasy, a nie z samej odległości.
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
const WTP_FORECAST_KEY='wtp-live-v87-last-forecasts';
let wtpLastForecasts={};
try{wtpLastForecasts=JSON.parse(localStorage.getItem(WTP_FORECAST_KEY)||'{}')||{}}catch{}
function wtpSaveForecasts(){
 const keys=Object.keys(wtpLastForecasts);
 if(keys.length>600){for(const k of keys.slice(0,keys.length-600))delete wtpLastForecasts[k]}
 try{localStorage.setItem(WTP_FORECAST_KEY,JSON.stringify(wtpLastForecasts))}catch{}
}
let wtpActualDepartures={};
try{wtpActualDepartures=JSON.parse(localStorage.getItem(WTP_ACTUAL_KEY)||'{}')||{}}catch{}
function wtpActualKey(v,choice){return [todayWarsaw(),v.kind,v.VehicleNumber,choice.course.course_id].join(':')}
function wtpPersistActual(v,choice,events){
 const key=wtpActualKey(v,choice),existing=wtpActualDepartures[key]||{};
 for(const [i,event] of events){
  if(!Number.isFinite(event.time)||!Number.isFinite(event.stamp))continue;
  const previous=existing[i];
  if(!previous || (event.stamp<previous.stamp && event.dist<=previous.dist+20))existing[i]={time:event.time,stamp:event.stamp,dist:event.dist};
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
 const traversals=[];
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
  traversals.push({stamp:p.stamp,progress,dist:match.dist,lat:p.lat,lon:p.lon});
  const a=points[match.j],b=points[match.j+1];
  if(!Number.isFinite(a.time)||!Number.isFinite(b.time))continue;
  const plan=a.time+(b.time-a.time)*match.f;
  const observed=etaObservedMinutes(p.stamp,plan);
  const delta=observed-plan;
  // WERSJA 83: interpolacja miedzy przystankami wymaga kilku zgodnych pomiarow.
  // Nie uznajemy pojedynczego punktu GPS za dowod opoznienia.
  if(delta>=-3&&delta<=120&&match.dist<=85)
   projectedSamples.push({stamp:p.stamp,delta,progress,dist:match.dist});
  // v237: sam pomiar w promieniu 35 m oznacza zbliżenie,
  // nie odjazd. Nie zapisuj go jako rzeczywistego przejazdu.

 }
 // v87: wykrywanie minięcia przystanku z dwóch kolejnych punktów GPS.
 // Nie traktujemy prognozy jako rzeczywistego przejazdu. Dwa punkty muszą
 // przecinać pozycję przystanku w kolejności kursu i w krótkim odstępie.
 for(let k=1;k<traversals.length;k++){
  const before=traversals[k-1],after=traversals[k];
  const gap=after.stamp-before.stamp;
  if(gap<=0||gap>150000||after.progress<before.progress+0.04)continue;
  if(before.dist>55||after.dist>55)continue;
  for(let j=Math.ceil(before.progress);j<=Math.floor(after.progress);j++){
   const pt=points[j];
   if(!pt||events.has(pt.i)||!Number.isFinite(pt.time))continue;
   const fraction=(j-before.progress)/(after.progress-before.progress);
   if(fraction<0||fraction>1)continue;
   const distance=Math.min(geoDistance(before.lat,before.lon,pt.lat,pt.lon),geoDistance(after.lat,after.lon,pt.lat,pt.lon));
   if(distance>110)continue;
   const crossingStamp=Math.round(before.stamp+fraction*gap);
   const crossingTime=etaObservedMinutes(crossingStamp,pt.time);
   if(crossingTime<pt.time-3||crossingTime>pt.time+120)continue;
   events.set(pt.i,{time:crossingTime,stamp:crossingStamp,dist:Math.min(35,distance),method:'crossing'});
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
 if(delta< -15||delta>120)return null;
 return {delay:Math.round(delta),confirmedIndex:pt.i,reason:'Postoj potwierdzony kolejnymi pomiarami GPS'};
}
function renderEtaRoute(match,v,body,gtfsTrips=[]){
 const choice=match.selected;
 // v242: zachowaj godziny i odliczanie podczas ponownego renderu TEGO SAMEGO kursu.
 const previousList=body.querySelector('ol.route-stops');
 const previousCourse=previousList?.dataset.wtpCourseId;
 const sameRenderedCourse=previousCourse===String(choice.course.course_id);
 const previousTimes=new Map();
 const previousProgress=previousList?{icon:previousList.querySelector(':scope > .wtp-vehicle-on-route'),label:previousList.querySelector(':scope > .wtp-live-next-label')}:null;
 if(sameRenderedCourse){
  previousList.querySelectorAll('li.route-stop[data-route-stop-index]').forEach(row=>{
   previousTimes.set(Number(row.dataset.routeStopIndex),{
    clock:row.querySelector('.route-stop-time')?.innerHTML||'',
    countdown:row.querySelector('.wtp-list-countdown')?.textContent||'',
    color:row.querySelector('.wtp-list-countdown')?.style.color||'',
    actual:row.dataset.wtpActualClock||'',confirmed:row.dataset.wtpConfirmedDeparture||'',passed:row.dataset.wtpV251Passed||'',wasPassed:row.classList.contains('passed')
   });
  });
 }
 body.replaceChildren();
 const names=etaNamesForCourse(choice.etaStops,gtfsTrips,choice.course);
 let prediction=match.terminalPreselected?{geo:etaGpsObservations(choice,v,gtfsTrips),delay:null,confirmedIndex:-1,reason:'Następny kurs brygady'}:etaGpsPrediction(choice,v,gtfsTrips);
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
 // v214: kurs oczekujący na odjazd z pierwszego przystanku nie może
 // odziedziczyć historycznych przejazdów ani prognoz z poprzedniego kursu.
 const firstPlanned=etaServiceMinutes(choice.etaStops?.[0]?.departure||choice.etaStops?.[0]?.arrival);
 const nowService=etaObservedMinutes(Date.now(),firstPlanned);
 // v215: nie przenos zdarzen z poprzedniego kursu na nowy. Sam uplyw
 // godziny rozkladowej NIE dowodzi rozpoczecia kursu. Rozpoczecie
 // potwierdza GPS na dalszym odcinku albo zapisany odjazd pierwszego slupka.
 const firstDepartureObserved=!!server&&[...server.events.entries()].some(([i,e])=>
   i===0&&Number.isFinite(e.time)&&Number.isFinite(firstPlanned)&&
   e.time>=firstPlanned-15&&e.time<=nowService+1&&e.dist<=35);
 // v216: etaSpatialFit.index is the START index of the segment, not a
 // fractional stop index. On segment 0->1 it stays 0 even near stop 1.
 // A GPS position well beyond the first stop proves route progress without
 // treating mere waiting at the terminus as a departure.
 const gpsStamp=gpsMs(v.Time);
 const gpsFreshAtStart=Number.isFinite(gpsStamp)&&Math.abs(Date.now()-gpsStamp)<=90000;
 const firstStopCoord=choice.etaStops?.[0];
 const firstLat=Number(firstStopCoord?.lat??firstStopCoord?.latitude??firstStopCoord?.stop_lat);
 const firstLon=Number(firstStopCoord?.lon??firstStopCoord?.longitude??firstStopCoord?.stop_lon);
 const firstMapped=etaNameMatch(choice.etaStops,gtfsTrips,choice.course);
 const firstMappedStop=firstMapped?.trip?.stops?.[firstMapped?.mapping?.[0]];
 const firstPointLat=Number.isFinite(firstLat)&&firstLat!==0?firstLat:Number(firstMappedStop?.[2]);
 const firstPointLon=Number.isFinite(firstLon)&&firstLon!==0?firstLon:Number(firstMappedStop?.[3]);
 const distanceFromStart=Number.isFinite(firstPointLat)&&Number.isFinite(firstPointLon)?
   geoDistance(Number(v.Lat),Number(v.Lon),firstPointLat,firstPointLon):NaN;
 const progress=fit?fit.index+fit.f:NaN;
 const fitStarted=!!fit&&gpsFreshAtStart&&fit.distance<=85&&
   Number.isFinite(progress)&&Number.isFinite(distanceFromStart)&&
   (progress>=1.05||(progress>=0.12&&distanceFromStart>=105))&&
   Number.isFinite(firstPlanned)&&etaObservedMinutes(gpsStamp,firstPlanned)>=firstPlanned-15;
 const waitingAtOrigin=gpsFreshAtStart&&Number.isFinite(distanceFromStart)&&distanceFromStart<=70;
 const beforeFirstDeparture=waitingAtOrigin||!!match.terminalPreselected || (!firstDepartureObserved&&!fitStarted);
 if(beforeFirstDeparture){
  const originNearby=gpsFreshAtStart&&Number.isFinite(distanceFromStart)&&distanceFromStart<=70;
  const elapsed=Number.isFinite(firstPlanned)?etaObservedMinutes(Date.now(),firstPlanned)-firstPlanned:NaN;
  if(originNearby&&Number.isFinite(elapsed)&&elapsed>0){
   prediction={...prediction,delay:Math.max(0,Math.floor(elapsed)),confirmedIndex:0,reason:'Prognoza GPS na przystanku początkowym'};
  }else prediction={...prediction,delay:null,confirmedIndex:-1};
 }
 const actualEvents=wtpPersistActual(v,choice,coursePlausible&&!beforeFirstDeparture&&server?server.events:new Map());
 if(!coursePlausible){
  prediction={...prediction,delay:null,confirmedIndex:-1,
   reason:match.matchWarning||'Brak pewnego dopasowania kursu i GPS'};
 }else if(server&&!beforeFirstDeparture){
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
   if(diff>=-15&&diff<=120){confirmed={delay:Math.round(diff),confirmedIndex:i};break;}
  }
  if(confirmed){
   prediction={...prediction,...confirmed,reason:'Pomiar GPS przy przystanku'};
  }else if(Number.isFinite(server.delay)&&server.delay>=-15&&server.delay<=120){
   // Wczesniej ten wynik byl kasowany przez !match.gpsVerified i events.size.
   prediction={...prediction,delay:Math.round(server.delay),
    confirmedIndex:Math.max(-1,server.currentIndex),
    reason:'Prognoza z dwoch zgodnych pomiarow GPS'};
  }
 }
 // v237: nie twórz opóźnienia z jednego GPS i czasu na
 // najbliższym odcinku. Jeśli system nie zaliczył słupka,
 // pojedynczy pomiar nie może sztucznie przesunąć rozkładu.
 // Potwierdzony postoj jako dodatkowe zrodlo, kiedy serwerowa historia
 // jeszcze nie zawiera wystarczajacych obserwacji.
 // v237: sam postój w pobliżu słupka nie dowodzi odjazdu;
 // nie przypisuj opóźnienia kolejnym przystankom na tej podstawie.
 const previous=etaRenderedCache.get(vehicleKey(v));
 if(coursePlausible&&!beforeFirstDeparture&&prediction.delay===null&&previous&&previous.courseId===courseId&&
    previous.confirmedIndex>=0&&Date.now()-previous.at<90000&&
    gpsMs(v.Time)>=previous.stamp-90000){
  prediction={...prediction,delay:previous.delay,confirmedIndex:previous.confirmedIndex,
   reason:'Ostatnia wiarygodna prognoza GPS'};
 }
 if(coursePlausible&&Number.isFinite(prediction.delay)&&prediction.delay>=-30&&
    prediction.confirmedIndex>=0){
  etaRenderedCache.set(vehicleKey(v),{courseId,delay:prediction.delay,
   confirmedIndex:prediction.confirmedIndex,currentIndex:prediction.currentIndex,
   stamp:gpsMs(v.Time),at:Date.now()});
 }
 const note=document.createElement('p');note.className='route-note';
 note.textContent='ETA: linia '+choice.course.line+', brygada '+choice.course.brigade+'. '+
  (names.matched?'Kolejność i nazwy według ETA. ':'Nazwy i kolejność według ETA. ')+
  (prediction.delay!==null?'Szacowane odchylenie '+(prediction.delay>=0?'+':'')+prediction.delay+' min; '+prediction.reason+'.':'Godziny rozkładowe; '+prediction.reason+'.'+(server?' GPS: '+server.samples+' próbek w ostatnich 5 min.':' Brak dostępnej historii GPS dla tego przebiegu.'))+' Historia GPS jest zbierana na serwerze.';
 note.classList.add('wtp-route-diagnostics');note.hidden=true;body.append(note);
 const list=document.createElement('ol');list.className='route-stops kind-'+(v.kind===2?'tram':'bus');list.dataset.wtpCourseId=String(choice.course.course_id);
 list.dataset.wtpWaitingOrigin=waitingAtOrigin?'1':'0';
 const nearest=prediction.geo?.near??null;
 const current=-1; // status przystanku wyznaczamy dopiero z położenia na odcinku
 wtpCourseStopDisplay.clear();
 wtpActiveCourseProgress=Number.isInteger(prediction.confirmedIndex)?prediction.confirmedIndex:-1;
  // v167: oznacz fragment osi listy pomiędzy "wys" i "ws" na podstawie ETA.
  const technicalListIntervals=wtpTechnicalIntervals(choice.etaStops||[],names.mapping,names.trip,choice.course);
  if(wtpIsTechnicalCourse(choice.course,choice.etaStops||[],names.mapping,names.trip))list.classList.add("wtp-all-technical");
  choice.etaStops.forEach((stop,i)=>{
  const li=document.createElement('li');li.dataset.etaStopIndex=String(i);li.className='route-stop'+(i===current?' current':'')+(current>=0&&i<current?' passed':'');
  for(const [a,b] of technicalListIntervals){
   if(i===a)li.classList.add('wtp-tech-start');
   if(i===b)li.classList.add('wtp-tech-end');
   if(i>a&&i<b)li.classList.add('wtp-tech-middle');
  }
  const j=names.mapping?.[i],mapped=Number.isInteger(j)&&j>=0?names.trip?.stops?.[j]:null;
  // v73: dla ETA priorytet ma jawna flaga z odcinków tego samego wariantu.
  // null = nieustalony; nie zastępuj go typem przypadkowego pobliskiego słupka.
  const stopFlag=stop.slupek_na_zadanie??stop.na_zadanie??stop.request_stop??mapped?.slupek_na_zadanie??null;
  if(stopFlag===1 || stopFlag==='1' || stopFlag===true)li.classList.add('request-stop');
  else if(stopFlag===0 || stopFlag==='0' || stopFlag===false)li.classList.add('fixed-stop');
  else {const known=requestStopNear(Number(stop.lat),Number(stop.lon));li.classList.add(known===true?'request-stop':known===false?'fixed-stop':'unknown-stop');}

  const dot=document.createElement('span');dot.className='route-dot';
  const name=document.createElement('span');name.className='route-stop-name';name.textContent=names.names[i];
  // Numer slupka pochodzi z dopasowanego GTFS; wewnetrzne ETA ID nie jest numerem slupka.
  // ETA stop_id jest wewnętrznym identyfikatorem, a NIE numerem peronu.
  const etaPlatform=String(stop.eta_platform_number??stop.nazwa_slupka??stop.numer_slupka??stop.nr_slupka??stop.slupek??stop.stop_no??'').trim();
  const platform=etaPlatform||null;
  const number=document.createElement('small');number.className='wtp-stop-number';
  if(platform){number.textContent=platform;number.title='Numer słupka według ETA';}
  else{number.hidden=true;}
  // Typ przystanku tylko z jawnych metadanych, nie z numeru ETA.
  const rawRole=wtpStopRole(stop,mapped);
  const boardingAfterAlighting=rawRole==='ws'&&i>0&&wtpStopRole(choice.etaStops[i-1],names.trip?.stops?.[names.mapping?.[i-1]])==='wys';
  if(['tech','zaj'].includes(rawRole)||boardingAfterAlighting)li.classList.add('wtp-tech-node');
  if(['wys','ws'].includes(rawRole)&&!boardingAfterAlighting)li.classList.add('wtp-passenger-node');
  const role=wtpStopRoleLabel(rawRole);
  const stopText=document.createElement('span');stopText.className='wtp-route-stop-text';stopText.append(name,number);
  if(role){const tag=document.createElement('span');tag.className='wtp-stop-role';tag.textContent=role;stopText.append(tag);li.classList.add('wtp-stop-special');}
  const raw=(stop.departure||stop.arrival)||'';
  const time=document.createElement('time');time.className='route-stop-time';
  const planned=etaServiceMinutes(raw);
  const pastEvent=coursePlausible&&!beforeFirstDeparture?actualEvents.get(i):null;
  const forecastKey=wtpActualKey(v,choice)+':'+i;
  const previousForecast=wtpLastForecasts[forecastKey];
  const measured=pastEvent&&Number.isFinite(planned)?pastEvent.time:null;
  // Początek kursu: nie traktuj pozycji na pętli jako opóźnionego przyjazdu.
  // Planowy odjazd z pierwszego słupka pozostaje podstawą porównania.
  const safeMeasured=Number.isFinite(measured)&&measured>=planned-15&&measured<=planned+90?measured:null;
  // v87: prognoza nie znika natychmiast po przejechaniu przystanku.
  // Dopóki nie ma obserwacji GPS, pozostaje jawnie oznaczoną prognozą,
  // NIGDY nie jest przedstawiana jako potwierdzony rzeczywisty odjazd.
  // v216: if the vehicle is already travelling, predict the upcoming stops
  // from fresh GPS interpolation, even before two server history samples exist.
  // This is a forecast, never a confirmed historical departure.
  const liveDelay=coursePlausible&&!beforeFirstDeparture&&gpsFreshAtStart&&fit&&fit.distance<=85&&
   Number.isFinite(fit.time)&&Number.isFinite(progress)&&Number.isFinite(planned)?
   etaObservedMinutes(gpsStamp,fit.time)-fit.time:NaN;
  const reliableLiveDelay=Number.isFinite(liveDelay)&&liveDelay>=-15&&liveDelay<=90?liveDelay:null;
  const appliedDelay=prediction.delay!==null?prediction.delay:reliableLiveDelay;
  // A delayed bus at the starting stop is already late for its onward stops.
  // The estimate is provisional until GPS confirms actual departure.
  const originDelay=beforeFirstDeparture&&coursePlausible&&gpsFreshAtStart&&
   Number.isFinite(distanceFromStart)&&distanceFromStart<=70&&
   Number.isFinite(firstPlanned)?Math.max(0,Math.floor(nowService-firstPlanned)):null;
  const propagatedDelay=originDelay!==null?originDelay:appliedDelay;
  const currentEstimate=((propagatedDelay!==null&&
   (!beforeFirstDeparture||originDelay!==null)&&
   Number.isFinite(planned)&&i>=(Number.isFinite(progress)?Math.floor(progress):prediction.confirmedIndex)&&
   i>=0?planned+propagatedDelay:null));
  // v215: nie odtwarzaj z localStorage starych prognoz, gdy aktualny
  // GPS nie potwierdza postepu tego kursu. Prognozy sa ulotne.
  const firstStopEstimate=i===0&&coursePlausible&&gpsFreshAtStart&&Number.isFinite(planned)&&
   Number.isFinite(propagatedDelay)&&propagatedDelay>=1&&propagatedDelay<=90&&
   (!beforeFirstDeparture||Number.isFinite(distanceFromStart)&&distanceFromStart<=70)
   ?planned+propagatedDelay:null;
  const estimate=safeMeasured!==null?safeMeasured:(i===0?firstStopEstimate:currentEstimate);
  // v215: nie zapisuj prognoz na wiele godzin; nowy odczyt GPS przelicza je od nowa.
  if(safeMeasured!==null&&wtpLastForecasts[forecastKey]){delete wtpLastForecasts[forecastKey];wtpSaveForecasts();}
  if(safeMeasured!==null){li.dataset.wtpActualClock=displayClock(safeMeasured);li.dataset.wtpActualEarly=safeMeasured<planned?'1':'0';}
  if(estimate!==null&&Number.isFinite(estimate)&&Number.isFinite(planned)){
   const old=document.createElement('span');old.className='wtp-planned-time';old.textContent=displayClock(planned);
   old.style.cssText='display:block;text-decoration:line-through;color:#9299a0;font-size:12px;line-height:1.2;text-align:right';
   const next=document.createElement('strong');next.className='wtp-estimated-time';next.textContent=displayClock(estimate);
   next.style.cssText='display:block;color:'+(estimate<planned?'#1976d2':estimate>planned?'#c9221c':'#137044')+';font-weight:750;line-height:1.3;text-align:right';
   if(safeMeasured===null&&currentEstimate===null)next.style.color=Math.abs(estimate-planned)<1?'#16834b':(estimate<planned?'#1976d2':'#c9221c');
   if(Math.abs(estimate-planned)<0.5){
    next.style.color='#19734b';
    time.append(next);
    time.title='Szacowany czas zgodny z rozkładem (GPS)';
   }else{
    if(safeMeasured===null)next.style.color=estimate<planned?'#1976d2':'#c9221c';
    time.append(old,next);
    time.title=safeMeasured!==null?'Historyczna godzina przejazdu oszacowana z GPS (nie jest odczytem drzwi)':(currentEstimate===null?'Zachowana wcześniejsza prognoza; brak potwierdzenia GPS':'Szacowana godzina przyjazdu z GPS');
   }
  }else{
   time.textContent=displayClock(raw);
   // v162: kurs dopasowany do GPS nie jest tym samym co potwierdzona
   // punktualność. Oznaczamy takie godziny osobno, zamiast mylić je
   // z brakiem jakiegokolwiek dopasowania pojazdu.
   const freshGps=Number.isFinite(gpsMs(v.Time)) &&
     Math.abs(Date.now()-gpsMs(v.Time))<=90000;
   const matchedGps=coursePlausible && freshGps && fit && fit.distance<=85;
   if(matchedGps){
    time.classList.add('wtp-gps-matched-schedule','wtp-v253-active-schedule');
    time.title='Kurs rozpoznany na podstawie GPS; godzina rozkładowa, brak potwierdzonej prognozy';
   }else{
    time.title='Godzina rozkładowa; brak wiarygodnego potwierdzenia GPS';
   }
  }
  // Dane wyłącznie informacyjne; ETA jest szacunkiem, nie potwierdzonym przejazdem.
  const expected=Number.isFinite(estimate)?estimate:planned;
  const nowMinutes=nowWarsaw(new Date());
  const remaining=Number.isFinite(expected)?Math.ceil(expected-nowMinutes):null;
  wtpCourseStopDisplay.set(i,{
   planned:Number.isFinite(planned)?displayClock(planned):displayClock(raw),
   expected:Number.isFinite(expected)?displayClock(expected):null,
   delayed:Number.isFinite(estimate)&&Number.isFinite(planned)&&Math.abs(estimate-planned)>=1,
   deltaMinutes:Number.isFinite(estimate)&&Number.isFinite(planned)?estimate-planned:0,
   remaining:remaining!==null&&remaining>=0&&remaining<24*60?remaining:null,
   estimated:Number.isFinite(estimate),
   expectedMinutes:Number.isFinite(expected)?expected:null
  });
  if(i===choice.etaStops.length-1)li.classList.add('wtp-terminal-stop');
  li.dataset.routeStopIndex=String(i);li.tabIndex=0;li.title="Kliknij, aby przybliżyć przystanek na mapie";
  li.addEventListener("click",()=>wtpFocusRouteStop(i,li));
  li.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();wtpFocusRouteStop(i,li);}});
  // Nie pozwalaj, aby przejściowy brak GPS/ETA usuwał wcześniej widoczną godzinę.
  const saved=previousTimes.get(i);
  if(saved&&!waitingAtOrigin){
   const newlyKnown=!!time.querySelector('.wtp-estimated-time,.wtp-server-actual,.wtp-server-forecast');
   const oldHadLive=/(wtp-estimated-time|wtp-server-actual|wtp-server-forecast)/.test(saved.clock);
   if(oldHadLive&&!newlyKnown)time.innerHTML=saved.clock;
   if(saved.actual&&!li.dataset.wtpActualClock)li.dataset.wtpActualClock=saved.actual;
   if(saved.confirmed&&!li.dataset.wtpConfirmedDeparture)li.dataset.wtpConfirmedDeparture=saved.confirmed;
   if(saved.passed)li.dataset.wtpV251Passed=saved.passed;
   if(saved.wasPassed)li.classList.add('passed','wtp-server-passed');
   if(saved.countdown){const badge=document.createElement('span');badge.className='wtp-list-countdown';badge.textContent=saved.countdown;badge.style.color=saved.color;li.prepend(badge);}
  }
  li.append(dot,stopText,time);list.append(li);
 });
 // v251: zachowaj ikone i etykiete przy przebudowie tego samego kursu.
 // Aktualizacja GPS pozniej skoryguje ich pozycje; nie migaj pustym stanem.
 // v268: nie kopiuj starej ikony i etykiety. Nowe pozycje są rysowane
 // w tym samym cyklu, a kopie tworzyły podwójny cień przy odświeżaniu.
 // v76: ustalaj położenie na ODCINKU między kolejnymi słupkami, nie na podstawie
 // samego najbliższego punktu (przy powtórzonych nazwach jest to niejednoznaczne).
 let geoPoints=prediction.geo?.points||[];
 // v156: geometria przystanków z narysowanego kursu może uzupełnić
 // brakujące współrzędne ETA, ale nigdy nie zgadujemy z samego czasu.
 if(geoPoints.length<2&&wtpRouteStopCoords.size>=2){
  geoPoints=[...wtpRouteStopCoords.entries()].map(([i,c])=>({i,lat:Number(c[0]),lon:Number(c[1]),time:etaServiceMinutes(choice.etaStops[i]?.departure||choice.etaStops[i]?.arrival)}))
   .filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)).sort((a,b)=>a.i-b.i);
 }
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
  // Wcześniejsze słupki są już za pozycją pojazdu na trasie.
  for(let i=0;i<a.i;i++)list.children[i]?.classList.add('passed');
  // v78: rozdziel dwa stany: przy słupku i w drodze do następnego.
  // Promień 35 m ogranicza fałszywe zaliczenia przystanku z odległości 65 m.
  const distanceA=geoDistance(gpsLat,gpsLon,a.lat,a.lon);
  const distanceB=geoDistance(gpsLat,gpsLon,b.lat,b.lon);
  // v198: bliskość przystanku nie oznacza automatycznie odjazdu.
  // GPS potrafi być przesunięty o kilkadziesiąt metrów; w pobliżu
  // przystanku zachowujemy jego status, aż kolejne pomiary potwierdzą
  // oddalanie się w kierunku następnego słupka.
  const STOP_AT_RADIUS=70;
  const trace=(gpsTraces.get(vehicleKey(v))||[]).filter(p=>
   p.line===String(v.Lines||'')&&p.brigade===normalizeBrigade(v.Brigade)&&
   Number.isFinite(p.t)&&gpsMs(v.Time)-p.t>=0&&gpsMs(v.Time)-p.t<=120000);
  const previous=trace.length>=2?trace[trace.length-2]:null;
  const departing=(lat,lon)=>{
   if(!previous)return false;
   const before=geoDistance(previous.lat,previous.lon,lat,lon);
   const after=geoDistance(gpsLat,gpsLon,lat,lon);
   const moved=geoDistance(previous.lat,previous.lon,gpsLat,gpsLon);
   return moved>=18&&after-before>=18&&after>STOP_AT_RADIUS;
  };
  const nearA=distanceA<=STOP_AT_RADIUS && (distanceA<=distanceB || f<0.5) && !departing(a.lat,a.lon);
  const nearB=distanceB<=STOP_AT_RADIUS && (distanceB<distanceA || f>=0.5) && !departing(b.lat,b.lon);
  const stopIndex=nearB?b.i:(nearA?a.i:-1);
  const fromIndex=a.i;
  const nextIndex=b.i;
  // v89: przy przystanku pokazujemy wyłącznie pogrubioną nazwę.
  // Między przystankami umieszczamy samą etykietę na odcinku osi.
  let nextLabel=null;
  if(stopIndex>=0){
   for(let i=0;i<stopIndex;i++)list.children[i]?.classList.add('passed');
   list.children[stopIndex]?.classList.add('current','wtp-next-row');
  }else{
   list.children[nextIndex]?.classList.add('wtp-next-row');
   nextLabel=document.createElement('span');
   nextLabel.className='wtp-next-stop wtp-between-stops';
   nextLabel.textContent='Następny przystanek:';
   list.append(nextLabel);
  }
  const marker=document.createElement('span');marker.className='wtp-vehicle-on-route';
  const img=document.createElement('img');img.src=v.kind===2?'icons/WTP-tramwaj.svg':'icons/WTP-autobus.svg';
  img.alt=v.kind===2?'Tramwaj':'Autobus';marker.append(img);
  marker.title=stopIndex>=0?'Pojazd przy przystanku (GPS)':'Przybliżona pozycja GPS między przystankami';
  list.append(marker);
  const positionMarker=()=>{
   const first=list.children[a.i],second=list.children[b.i];
   if(!first||!second)return;
   // Wszystkie współrzędne względem tego samego kontenera <ol>.
   // offsetTop i offsetLeft są zawodne przy zagnieżdżonych elementach.
   const bounds=list.getBoundingClientRect();
   const dotA=first.querySelector('.route-dot');
   const dotB=second.querySelector('.route-dot');
   if(!dotA||!dotB)return;
   const rectA=dotA.getBoundingClientRect(),rectB=dotB.getBoundingClientRect();
   const x1=(rectA.left+rectA.right)/2-bounds.left;
   const x2=(rectB.left+rectB.right)/2-bounds.left;
   const y1=(rectA.top+rectA.bottom)/2-bounds.top;
   const y2=(rectB.top+rectB.bottom)/2-bounds.top;
   const ratio=stopIndex===a.i?0:stopIndex===b.i?1:Math.max(0,Math.min(1,f));
   const y=y1+(y2-y1)*ratio;
   const x=x1+(x2-x1)*ratio;
   marker.style.setProperty('left',Math.round(x)+'px','important');
   marker.style.top=y+'px';
   if(nextLabel){
    // v92: jak w v89 — napis w połowie odcinka, niezależnie od znacznika.
    const textRect=second.querySelector('.wtp-route-stop-text')?.getBoundingClientRect();
    nextLabel.style.setProperty('top',Math.round(Math.max(second.getBoundingClientRect().top+14,(textRect?.top??rectB.top)-3)-bounds.top)+'px','important');
    nextLabel.style.setProperty('left',((textRect?.left??(bounds.left+44))-bounds.left)+'px','important');
   }
  };
  requestAnimationFrame(()=>{
   positionMarker();

  });
 }

 // v171: jeśli GPS potwierdził postęp kursu, oznacz wcześniejsze przystanki
 // również wtedy, gdy nie udało się dopasować pozycji do odcinka geometrii.
 // Nie opieramy tego wyłącznie na godzinie rozkładowej.
 if(coursePlausible && gpsFresh && Number.isInteger(prediction.confirmedIndex) && prediction.confirmedIndex>0){
  const until=Math.min(prediction.confirmedIndex,choice.etaStops.length);
  for(let i=0;i<until;i++)list.children[i]?.classList.add('passed');
 }
 body.append(list);
 requestAnimationFrame(()=>wtpScrollInitialCourse(body,list));

}
function wtpScrollInitialCourse(body,list){
 if(!body||!list||!body.contains(list))return;
 const id=list.dataset.wtpCourseId;
 if(!id||body.dataset.wtpAutoScrolledCourse===id)return;
 const row=list.querySelector('li.wtp-next-row:not(.passed),li.wtp-at-stop:not(.passed)')||[...list.querySelectorAll('li.route-stop')].find(r=>!r.classList.contains('passed'));
 if(!row)return;
 const explicit=row.classList.contains('wtp-next-row')||row.classList.contains('wtp-at-stop');
 if(!explicit&&!row.previousElementSibling)return;
 body.scrollTop=Math.max(0,body.scrollTop+row.getBoundingClientRect().top-body.getBoundingClientRect().top);
 body.dataset.wtpAutoScrolledCourse=id;
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
  next.textContent=displayClock(minutes(item[4])+delayInfo.delay);next.style.cssText='display:block;color:'+(delayInfo.delay<0?'#1976d2':'#cf271e')+';font-weight:750;line-height:1.3;text-align:right';
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
  li.tabIndex=0;li.addEventListener("click",()=>{if(Number.isFinite(Number(item[2]))&&Number.isFinite(Number(item[3])))wtpFocusRouteStop(i,li)});
  li.append(dot,name,t);list.append(li);
 });body.append(list);
}

// WTP LIVE v90: wspolny stan pojazdu z Mikrusa (GPS Tracker v60).
const wtpServerStateCache=new Map();
async function wtpLoadVehicleState(v){
 const key=vehicleKey(v),old=wtpServerStateCache.get(key);
 if(old&&Date.now()-old.at<2000)return old.promise;
 const params={type:String(v.kind),vehicle:String(v.VehicleNumber)};
 const promise=request('/eta/vehicle-state',params).catch(err=>{
  wtpServerStateCache.delete(key);console.warn('WTP GPS Tracker:',err.message);return null;
 });
 wtpServerStateCache.set(key,{at:Date.now(),promise});return promise;
}
function wtpStateCourseId(data){
 const state=data?.state||data?.tracker_state||data?.vehicle||{};
 return String(state.course_id??data?.course_id??data?.assignment?.course_id??'');
}
function wtpServerClock(stamp){
 const ms=Number(stamp);if(!Number.isFinite(ms)||ms<=0)return null;
 const date=new Date(ms<1e11?ms*1000:ms);
 if(!Number.isFinite(date.getTime()))return null;
 return new Intl.DateTimeFormat('pl-PL',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(date);
}
function wtpApplyServerState(body,data,choice){
 if(!data||!choice?.course||!body)return;
 const cid=String(choice.course.course_id),serverCid=wtpStateCourseId(data);
 if(!serverCid||serverCid!==cid)return;
 const rawEvents=Array.isArray(data.events)?data.events:Array.isArray(data.stop_events)?data.stop_events:[];
 const rawPredictions=Array.isArray(data.predictions)?data.predictions:Array.isArray(data.vehicle_predictions)?data.vehicle_predictions:[];
 const events=new Map(),predictions=new Map();
 for(const e of rawEvents){
  if(e.course_id!=null&&String(e.course_id)!==cid)continue;
  const seq=Number(e.stop_seq),clock=wtpServerClock(e.stamp??e.event_stamp);
  const eventMs=Number(e.stamp??e.event_stamp);
  const normalizedMs=eventMs>0&&eventMs<1e11?eventMs*1000:eventMs;
  const firstPlannedMs=etaServiceMinutes(choice.etaStops?.[0]?.departure||choice.etaStops?.[0]?.arrival);
  const observedEvent=etaObservedMinutes(normalizedMs,firstPlannedMs);
  if(!Number.isFinite(seq)||!clock||!Number.isFinite(observedEvent)||
     !Number.isFinite(firstPlannedMs)||observedEvent<firstPlannedMs-15||normalizedMs>Date.now()+30000)continue;
  const previous=events.get(seq);
  if(!previous||String(e.event)==='departure')events.set(seq,{clock,event:String(e.event||'arrival')});
 }
 for(const p of rawPredictions){
  if(p.course_id!=null&&String(p.course_id)!==cid)continue;
  const seq=Number(p.stop_seq),clock=wtpServerClock(p.predicted_stamp??p.prediction_stamp);
  if(Number.isFinite(seq)&&clock)predictions.set(seq,clock);
 }
  const rows=[...body.querySelectorAll('ol.route-stops > li.route-stop')];
  if(!rows.length)return;
  // GPS at the origin takes precedence over stale server forecasts/events.
  if(body.querySelector('ol.route-stops')?.dataset.wtpWaitingOrigin==='1')return;
  const firstPlan=etaServiceMinutes(choice.etaStops?.[0]?.departure||choice.etaStops?.[0]?.arrival);
  const currentService=etaObservedMinutes(Date.now(),firstPlan);
  const firstSeq=Number(choice.etaStops?.[0]?.seq);
  const firstDeparture=events.get(firstSeq);
  const firstDeparted=firstDeparture?.event==='departure';
  // v215: prognozy serwera nie moga oznaczac kolejnych przystankow
  // jako obsłużonych, dopoki nie potwierdzono startu kursu.
  const serverState=data?.state||data?.tracker_state||{};
  const confirmedProgress=Number(serverState.current_stop_seq??serverState.last_passed_seq??-1);
  const hasStarted=firstDeparted || (Number.isFinite(confirmedProgress)&&confirmedProgress>Number(firstSeq));
  // Forecasts can be shown before GPS-confirmed departure; no stop is marked passed by a forecast.
  // v161: Przy potwierdzonym, świeżym przypisaniu GPS nie pozostawiaj
  // wszystkich planowych godzin czarnych tylko dlatego, że tracker nie
  // wygenerował jeszcze indywidualnych prognoz.
  const state=data?.state||data?.tracker_state||{};
  const rawStamp=Number(state.last_stamp??state.updated_stamp??0);
  const stateMs=rawStamp>0&&rawStamp<1e11?rawStamp*1000:rawStamp;
  const assignedFresh=stateMs>0&&Math.abs(Date.now()-stateMs)<180000;
  if(assignedFresh){
   rows.forEach(row=>{
    if(row.classList.contains('passed')||row.classList.contains('wtp-server-passed'))return;
    const cell=row.querySelector('.route-stop-time');
    if(!cell||cell.querySelector('.wtp-server-actual,.wtp-server-forecast'))return;
    cell.classList.add('wtp-gps-assigned');
    cell.title='Kurs potwierdzony przez aktualne przypisanie GPS; godzina planowa, bez osobnej prognozy';
   });
  }
 let changed=0;
 rows.forEach((row,index)=>{
  const stop=choice.etaStops[index];if(!stop)return;
  const seq=Number(stop.seq),recorded=events.get(seq),actual=recorded?.event==='departure'?recorded:null,forecast=predictions.get(seq);
  if(!actual&&!forecast)return;
  const cell=row.querySelector('.route-stop-time');if(!cell)return;
  const raw=stop.departure||stop.arrival;
  const planned=displayClock(raw),newClock=actual?.clock||forecast;
  if(!newClock)return;
  cell.replaceChildren();
  if(newClock!==planned){
   const old=document.createElement('span');old.className='wtp-server-planned';old.textContent=planned;old.style.textDecoration='line-through';old.style.color='#9299a0';old.style.display='block';cell.append(old);
  }
  const real=document.createElement('strong');real.className=actual?'wtp-server-actual':'wtp-server-forecast';real.textContent=newClock;
  const toMin=t=>{const m=/^(\d{1,2}):(\d{2})$/.exec(String(t));return m?Number(m[1])*60+Number(m[2]):NaN;};
  let delta=toMin(newClock)-toMin(planned);
  if(delta>720)delta-=1440;if(delta< -720)delta+=1440;
  if(delta<0)real.classList.add('wtp-time-early');
  else if(delta>0)real.classList.add('wtp-time-late');
  else if(actual)real.classList.add('wtp-on-time');
  cell.append(real);cell.title=actual?'Odjazd oszacowany z zapisanej historii GPS':'Prognoza GPS — nie jest potwierdzonym odjazdem';
  if(actual?.event==='departure'){row.dataset.wtpConfirmedDeparture='1';row.dataset.wtpActualClock=newClock;row.dataset.wtpActualEarly=delta<0?'1':'0';row.classList.add('wtp-server-passed','passed');}
  changed++;
 });
 if(changed){
  const note=document.createElement('p');note.className='wtp-server-note';
  note.textContent='Dane wspolne z serwera GPS: '+events.size+' zdarzen, '+predictions.size+' prognoz. Godziny rzeczywiste sa szacowane na podstawie GPS.';
  body.querySelectorAll('.wtp-server-note').forEach(n=>n.remove());body.prepend(note);
 }
}
function wtpPreferServerCourse(match,data){
 const cid=wtpStateCourseId(data);
 if(!cid||!match?.selected)return;
 const state=data?.state||data?.tracker_state||{};
 const rawLast=Number(state.last_stamp??state.updated_stamp??0);
 const last=rawLast>0&&rawLast<1e11?rawLast*1000:rawLast;
 if(!last||Math.abs(Date.now()-last)>180000)return;
 const choices=[match.selected,...(match.alternatives||[])];
 const candidate=choices.find(c=>String(c.course?.course_id)===cid);
 if(candidate&&String(match.selected.course?.course_id)===cid){
  match.selected=candidate;match.alternatives=choices.filter(c=>c!==candidate);
 }
}

let wtpCourseMapLayer=null;
let wtpActiveCourseVehicle=null;
let wtpActiveCourseProgress=-1;
let wtpActiveCourseStopMarkers=[];
function wtpCurrentVehicle(){
 const key=wtpActiveCourseVehicle;
 return key?vehicles.find(v=>vehicleKey(v)===key)||focusedVehicle:null;
}
// Status jest oparty na rzeczywistym GPS oraz czasie. Sam zegar nie jest
// dowodem przejazdu: gdy GPS jest blisko, pokazujemy migające >>>.
// v202: Pozycja na polilinii wyznaczana z rzutowania GPS na odcinek.
// Wspólne źródło prawdy dla listy i znaczników na mapie.
let wtpCourseGeometry=[];
const wtpProgressMemory=new Map();
function wtpProjectOnRoute(coord,points,minAlong=0){
 if(!coord||!Array.isArray(points)||points.length<2)return null;
 const lat=Number(coord[0]),lon=Number(coord[1]);
 if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;
 const ky=111195,kx=ky*Math.cos(lat*Math.PI/180);
 let along=0,best=null;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i];
  const dx=(b[1]-a[1])*kx,dy=(b[0]-a[0])*ky,seg=Math.hypot(dx,dy);
  if(seg<0.01)continue;
  const px=(lon-a[1])*kx,py=(lat-a[0])*ky;
  const t=Math.max(0,Math.min(1,(px*dx+py*dy)/(seg*seg)));
  const pos=along+t*seg,dist=Math.hypot(px-t*dx,py-t*dy);
  // Na trasach z pętlą odrzuć poprzedni przejazd po tym samym odcinku.
  const backward=Math.max(0,minAlong-pos);
  const score=dist+Math.min(backward,500)*2;
  if(!best||score<best.score)best={along:pos,distance:dist,score};
  along+=seg;
 }
 return best;
}
function wtpStoredCourseProgress(key){
 try{
  const raw=sessionStorage.getItem('wtp-course-progress-v230:'+key);
  const data=raw?JSON.parse(raw):null;
  return data&&Date.now()-data.saved<6*3600000&&data.day===new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Warsaw'})?data:null;
 }catch(_){return null;}
}
function wtpSaveCourseProgress(p){
 try{sessionStorage.setItem('wtp-course-progress-v230:'+p.key,JSON.stringify({along:p.along,next:p.next,stamp:p.stamp,saved:Date.now(),day:new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Warsaw'})}));}catch(_){}
}
function wtpRouteProgress(){
 const v=wtpCurrentVehicle(),lat=Number(v?.Lat),lon=Number(v?.Lon),stamp=gpsMs(v?.Time);
 if(!v||!Number.isFinite(lat)||!Number.isFinite(lon)||!Number.isFinite(stamp)||Math.abs(Date.now()-stamp)>180000)return null;
 if(wtpCourseGeometry.length<2||!wtpActiveCourseStopMarkers.length)return null;
 const key=wtpCourseMapLayer?._wtpRouteKey||'';
 if(!key)return null;
 const previous=wtpProgressMemory.get(key)||wtpStoredCourseProgress(key);
 const projected=wtpProjectOnRoute([lat,lon],wtpCourseGeometry,previous?.along||0);
 if(!projected||projected.distance>95)return null;
 const ordered=[...wtpActiveCourseStopMarkers].sort((a,b)=>a.index-b.index);
 let floor=0;
 const stops=[];
 for(const stop of ordered){
  const p=wtpProjectOnRoute(stop.coords,wtpCourseGeometry,floor);
  if(!p||p.distance>125)continue;
  // Przystanki są uporządkowane zgodnie z kursem, nawet na odcinkach wspólnych.
  floor=Math.max(floor,p.along);
  stops.push({index:stop.index,along:floor});
 }
 if(!stops.length)return null;
 const along=previous&&stamp>=previous.stamp&&projected.along<previous.along&&previous.along-projected.along<140
  ?previous.along:projected.along;
 let next=stops.find(stop=>stop.along+25>=along)?.index;
 if(next==null)next=stops.at(-1).index;
 if(previous&&stamp>=previous.stamp&&next<previous.next)next=previous.next;
 const result={key,along,next,stamp,stops,gpsLat:lat,gpsLon:lon};
 if(!previous||stamp>=previous.stamp){wtpProgressMemory.set(key,result);wtpSaveCourseProgress(result);}
 return result;
}
function wtpCourseStopStatus(index,coords,expected,progress){
 const v=wtpCurrentVehicle(),stamp=gpsMs(v?.Time),lat=Number(v?.Lat),lon=Number(v?.Lon);
 const gpsFresh=Number.isFinite(stamp)&&Math.abs(Date.now()-stamp)<180000&&Number.isFinite(lat)&&Number.isFinite(lon);
 const distance=gpsFresh&&coords?geoDistance(lat,lon,coords[0],coords[1]):Infinity;
 const p=progress||wtpRouteProgress();
 const stopProgress=p?.stops?.find(st=>st.index===index);
 const remaining=stopProgress?stopProgress.along-p.along:Infinity;
 const firstStop=p?.stops?.[0];
 const fromStart=firstStop?Math.max(0,p.along-firstStop.along):0;
 const origin=p?.stops?.[0];
 const originMarker=wtpActiveCourseStopMarkers.find(item=>item.index===origin?.index);
 const originDistance=gpsFresh&&originMarker?geoDistance(lat,lon,originMarker.coords[0],originMarker.coords[1]):Infinity;
 const atOrigin=originDistance<=70&&fromStart<=100;
 const terminal=index===p?.stops?.at(-1)?.index;
 const passed=!!p&&!terminal&&index<p.next&&fromStart>=75&&!atOrigin;
 // v213: Jedna decyzja GPS dla mapy i listy: 100 m wzdłuż wariantu.
 // Bliskość geometryczna słupka chroni przed pomyleniem sąsiedniej jezdni.
 const approaching=!!p&&gpsFresh&&!passed&&index===p.next&&remaining>=-18&&remaining<=100&&distance<=110&&!(index===origin?.index&&Number.isFinite(expected)&&nowWarsaw(new Date())<expected);
 const atStop=approaching&&distance<=25;
 return {distance,remaining,gpsFresh,passed,approaching,atStop,next:p?.next};
}
// v154: wszystkie etykiety widocznych przystanków, bez pomijania co N-ty.
// Pozycje przeliczane w pikselach Leaflet przy każdej zmianie widoku.
let wtpCourseLabelLayoutQueued=false;
let wtpLabelConnectors=null;
function wtpScheduleCourseLabelLayout(){
 if(wtpCourseLabelLayoutQueued)return;
 wtpCourseLabelLayoutQueued=true;
 requestAnimationFrame(()=>{wtpCourseLabelLayoutQueued=false;wtpLayoutCourseLabels();});
}
// v154: chmurka zawsze styka się z kropką własnym trójkątem.
// Przesuwamy ją tylko w poziomie; grot jest przesuwany wewnątrz jej szerokości.
function wtpLayoutCourseLabels(){
 if(!map||!wtpCourseMapLayer||!map.hasLayer(wtpCourseMapLayer))return;
 const size=map.getSize(),occupied=[];
 const items=wtpActiveCourseStopMarkers.filter(x=>map.hasLayer(x.marker));
 if(wtpLabelConnectors){wtpLabelConnectors.remove();wtpLabelConnectors=null;}
 const candidates=items.map(item=>({item,p:map.latLngToContainerPoint(item.marker.getLatLng())}));
 candidates.sort((a,b)=>a.p.y-b.p.y||a.p.x-b.p.x);
 for(const {item,p} of candidates){
  const tip=item.marker.getTooltip();if(!tip)continue;
  if(!item.marker.isTooltipOpen())item.marker.openTooltip();
  const el=tip.getElement();if(!el)continue;
  if(p.x<0||p.x>size.x||p.y<0||p.y>size.y){el.style.display='none';continue;}
  el.style.display='';
  const w=el.offsetWidth,h=el.offsetHeight;
  const options=[];
  for(const dir of ['top','bottom','right','left']){
   const shifts=(dir==='top'||dir==='bottom')?[0,12,-12,24,-24,36,-36,48,-48,64,-64]:[0,-12,12,-24,24,-36,36];
   for(const shift of shifts){
    let dx=0,dy=0,box;
    if(dir==='top'||dir==='bottom'){
     dx=Math.max(13-w/2,Math.min(w/2-13,shift));dy=dir==='top'?-9:9;
     box={left:p.x+dx-w/2,right:p.x+dx+w/2,top:dir==='top'?p.y+dy-h:p.y+dy,bottom:dir==='top'?p.y+dy:p.y+dy+h};
    }else{
     dx=dir==='right'?9:-9;dy=shift;
     box={left:dir==='right'?p.x+dx:p.x+dx-w,right:dir==='right'?p.x+dx+w:p.x+dx,top:p.y+dy-h/2,bottom:p.y+dy+h/2};
    }
    const outside=Math.max(0,8-box.left)+Math.max(0,box.right-size.x+8)+Math.max(0,8-box.top)+Math.max(0,box.bottom-size.y+8);
    const overlap=occupied.reduce((sum,b)=>sum+Math.max(0,Math.min(box.right,b.right+3)-Math.max(box.left,b.left-3))*Math.max(0,Math.min(box.bottom,b.bottom+3)-Math.max(box.top,b.top-3)),0);
    options.push({dir,dx,dy,box,score:outside*10000+overlap*100+(dir==='top'?0:15)+Math.abs(shift)});
   }
  }
  options.sort((a,b)=>a.score-b.score);
  const best=options.find(o=>o.box.left>=3&&o.box.right<=size.x-3&&o.box.top>=3&&o.box.bottom<=size.y-3&&o.score<100);if(!best){el.style.display='none';continue;}
  // Nie pokazuj dymka, gdy nie da się umieścić go z grotem na krawędzi.
  if(best.box.left<3||best.box.right>size.x-3||best.box.top<3||best.box.bottom>size.y-3){el.style.display='none';continue;}
  occupied.push(best.box);
  tip.options.direction=best.dir;
  tip.options.offset=L.point(best.dx,best.dy);
  tip.setLatLng(item.marker.getLatLng());
  const node=tip.getElement();if(!node)continue;
  node.style.display='';
  node.style.setProperty('--wtp-arrow-shift',(best.dir==='top'||best.dir==='bottom')?-best.dx+'px':-best.dy+'px');
  node.classList.toggle('wtp-label-displaced',Math.abs((best.dir==='top'||best.dir==='bottom')?best.dx:best.dy)>2);
 }
}

function wtpUpdateCourseLabelZoom(){
 if(map)map.getContainer().classList.remove('wtp-course-labels-far');
}

// Przystanki wybranego kursu pozostają widoczne także po ukryciu przystanków ogólnych.
function wtpOfficialStopNear(lat,lon,limit=55){
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||!Array.isArray(stops))return null;
 let best=null,bestDistance=limit,second=Infinity;
 for(const row of stops){
  const p=stopCoordinates(row);if(!p)continue;
  if(Math.abs(p[0]-lat)>.001||Math.abs(p[1]-lon)>.0015)continue;
  const d=geoDistance(lat,lon,p[0],p[1]);
  if(d<bestDistance){second=bestDistance;bestDistance=d;best=p;}
  else if(d<second)second=d;
 }
 // Przy blisko położonych słupkach po przeciwnych stronach ulicy nie zgaduj.
 return best && (second-bestDistance>8 || bestDistance<9)?best:null;
}

// v117: pełna geometria źródłowa, bez sztucznego przesuwania i strzałek.
// Nie wolno rysować obcego wariantu tylko dlatego, że jest blisko GPS.
// v117: łagodne narożniki bez przesuwania całej trasy.
// Zaokrąglamy tylko pojedyncze ostre załamania (maks. 2.8 m od wierzchołka).
// To efekt wizualny, NIE korekta błędnej geometrii GTFS/OSM.
const wtpRoundedCache=new Map();
function wtpRoundCorners(points){
 if(!Array.isArray(points)||points.length<3)return points;
 const out=[points[0]];
 for(let i=1;i<points.length-1;i++){
  const p=points[i],prev=points[i-1],next=points[i+1];
  const ky=110540,kx=111320*Math.cos(p[0]*Math.PI/180);
  const ax=(prev[1]-p[1])*kx,ay=(prev[0]-p[0])*ky;
  const bx=(next[1]-p[1])*kx,by=(next[0]-p[0])*ky;
  const la=Math.hypot(ax,ay),lb=Math.hypot(bx,by);
  if(la<5||lb<5){out.push(p);continue;}
  const cosine=Math.max(-1,Math.min(1,(ax*bx+ay*by)/(la*lb)));
  const angle=Math.acos(cosine)*180/Math.PI;
  // Wewnątrz prostego odcinka kąt ~180°, nawrotu 0° nie wolno wygładzać.
  if(angle>145||angle<48){out.push(p);continue;}
  const radius=Math.min(2.8,la*.20,lb*.20);
  const from=[p[0]+ay/la*radius/ky,p[1]+ax/la*radius/kx];
  const to=[p[0]+by/lb*radius/ky,p[1]+bx/lb*radius/kx];
  out.push(from);
  // Kwadratowa krzywa Béziera, 3 próbki w obrębie kilku metrów.
  for(const t of [.25,.5,.75]){
   const s=1-t;
   out.push([s*s*from[0]+2*s*t*p[0]+t*t*to[0],s*s*from[1]+2*s*t*p[1]+t*t*to[1]]);
  }
  out.push(to);
 }
 out.push(points.at(-1));return out;
}
// v121: groty wyśrodkowane na osi linii, nie nad nią.
// v120: prawdziwe groty (nie kreski), animowane wzdłuż krzywizny SVG.
// SVG textPath orientuje każdy grot według stycznej do przebiegu kursu.
// Nie przesuwamy geometrii ani nie tworzymy osobnych markerów.
// v126: odsunięcie o 2,5 m po prawej stronie jazdy w układzie metrycznym.
// Wspólne wierzchołki są uśredniane, a przesunięcie na ciasnych łukach ograniczane.
const WTP_ROUTE_OFFSET_METERS=2.5;
function wtpOffsetRight(points,meters=WTP_ROUTE_OFFSET_METERS){
 if(!Array.isArray(points)||points.length<2)return points;
 const lat0=points.reduce((v,p)=>v+p[0],0)/points.length;
 const kx=111320*Math.cos(lat0*Math.PI/180),ky=110540;
 const normals=[];
 for(let i=0;i<points.length-1;i++){
  const dx=(points[i+1][1]-points[i][1])*kx,dy=(points[i+1][0]-points[i][0])*ky;
  const len=Math.hypot(dx,dy);normals.push(len>.01?[dy/len,-dx/len]:null);
 }
 return points.map((p,i)=>{
  const n0=normals[i-1],n1=normals[i];let nx=0,ny=0,scale=1;
  if(n0&&n1){nx=n0[0]+n1[0];ny=n0[1]+n1[1];const len=Math.hypot(nx,ny);
   if(len>.2){nx/=len;ny/=len;const dot=nx*n1[0]+ny*n1[1];scale=Math.min(1.35,1/Math.max(.75,dot));}
   else{nx=n1[0];ny=n1[1];}
  }else{const n=n0||n1;if(!n)return p;nx=n[0];ny=n[1];}
  return [p[0]+ny*meters*scale/ky,p[1]+nx*meters*scale/kx];
 });
}
// Zaokrąglanie wyłącznie geometrii wyświetlania; nie poprawia brakujących zawrotek GTFS.
function wtpSoftRoute(points){
 if(!Array.isArray(points)||points.length<3)return points;
 const out=[points[0]];
 for(let i=1;i<points.length-1;i++){
  const p=points[i],a=points[i-1],b=points[i+1];
  const kx=111320*Math.cos(p[0]*Math.PI/180),ky=110540;
  const ax=(a[1]-p[1])*kx,ay=(a[0]-p[0])*ky,bx=(b[1]-p[1])*kx,by=(b[0]-p[0])*ky;
  const la=Math.hypot(ax,ay),lb=Math.hypot(bx,by);
  if(la<4||lb<4){out.push(p);continue;}
  const cosine=Math.max(-1,Math.min(1,(ax*bx+ay*by)/(la*lb)));
  const angle=Math.acos(cosine)*180/Math.PI;
  if(angle>160||angle<42){out.push(p);continue;}
  const r=Math.min(5,la*.28,lb*.28);
  const from=[p[0]+ay/la*r/ky,p[1]+ax/la*r/kx];
  const to=[p[0]+by/lb*r/ky,p[1]+bx/lb*r/kx];
  out.push(from);
  for(const t of [.2,.4,.6,.8]){const u=1-t;out.push([u*u*from[0]+2*u*t*p[0]+t*t*to[0],u*u*from[1]+2*u*t*p[1]+t*t*to[1]]);}
  out.push(to);
 }
 out.push(points[points.length-1]);return out;
}

// v136: Rozpoznawanie dwukrotnego przejazdu po TYM SAMYM odcinku kursu.
// Rozdzielamy tylko niemal równoległe segmenty w promieniu 7 m, odległe
// w kolejności kursu o >= 80 m. Przecięcia ulic pod kątem nie są rozdzielane.
function wtpSeparateRepeatedPasses(points){
 if(!Array.isArray(points)||points.length<4)return wtpOffsetRight(points,WTP_ROUTE_OFFSET_METERS);
 const ky=110540,kx=111320*Math.cos(points[0][0]*Math.PI/180);
 const xy=points.map(p=>[p[1]*kx,p[0]*ky]);
 const cumulative=[0],segments=[];const cells=new Map(),size=8;
 const cell=(x,y)=>Math.floor(x/size)+','+Math.floor(y/size);
 for(let i=0;i<xy.length-1;i++){
  const a=xy[i],b=xy[i+1],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
  cumulative.push(cumulative[i]+len);
  segments.push({i,x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,dx:len?dx/len:0,dy:len?dy/len:0,len});
 }
 const pair=new Map();
 for(const seg of segments){
  if(seg.len<.5)continue;
  const gx=Math.floor(seg.x/size),gy=Math.floor(seg.y/size);
  for(let ix=gx-1;ix<=gx+1;ix++)for(let iy=gy-1;iy<=gy+1;iy++){
   const list=cells.get(ix+','+iy)||[];
   for(const other of list){
    if(Math.abs(cumulative[seg.i]-cumulative[other.i])<80)continue;
    if(Math.hypot(seg.x-other.x,seg.y-other.y)>7)continue;
    if(Math.abs(seg.dx*other.dx+seg.dy*other.dy)<.92)continue;
    const key=other.i+','+seg.i;
    pair.set(key,[other.i,seg.i]);
   }
  }
  const key=cell(seg.x,seg.y);if(!cells.has(key))cells.set(key,[]);cells.get(key).push(seg);
 }
 if(!pair.size)return wtpOffsetRight(points,WTP_ROUTE_OFFSET_METERS);
 const target=new Array(points.length).fill(WTP_ROUTE_OFFSET_METERS);
 // Pierwszy przejazd w prawo, powtórzony w lewo względem przebiegu.
 // Dla przeciwnych kierunków prawa strona każdego kierunku już rozdziela osie.
 for(const [a,b] of pair.values()){
  const first=segments[a],second=segments[b];
  if(first.dx*second.dx+first.dy*second.dy>.92){
   target[b]=-WTP_ROUTE_OFFSET_METERS;target[b+1]=-WTP_ROUTE_OFFSET_METERS;
  }
 }
 // Łagodne przejście odsunięcia: ważona średnia po 18 m geometrii.
 const smoothed=target.map((_,i)=>{
  let sum=0,weights=0;
  for(let j=i;j>=0&&cumulative[i]-cumulative[j]<18;j--){const w=1-(cumulative[i]-cumulative[j])/18;sum+=target[j]*w;weights+=w;}
  for(let j=i+1;j<target.length&&cumulative[j]-cumulative[i]<18;j++){const w=1-(cumulative[j]-cumulative[i])/18;sum+=target[j]*w;weights+=w;}
  return weights?sum/weights:target[i];
 });
 const normals=segments.map(seg=>seg.len>.5?[seg.dy,-seg.dx]:null);
 return points.map((p,i)=>{
  const n0=normals[i-1],n1=normals[i];let nx=0,ny=0;
  if(n0&&n1){nx=n0[0]+n1[0];ny=n0[1]+n1[1];const len=Math.hypot(nx,ny);if(len>.2){nx/=len;ny/=len;}else{nx=n1[0];ny=n1[1];}}
  else {const n=n0||n1;if(!n)return p;nx=n[0];ny=n[1];}
  return [p[0]+ny*smoothed[i]/ky,p[1]+nx*smoothed[i]/kx];
 });
}

// v136: SVG overlay przeliczany tylko przy zmianie skali, nie podczas odświeżania GPS.
// Odległość grotów jest liczona po geometrii trasy, nie po liczbie segmentów.
let wtpRouteArrowSerial=0;
const wtpRenderedGeometryCache=new WeakMap();
function wtpDrawDirectionalRoute(group,points,color,shapeId){
 // v253: wygładzanie geometrii jest kosztowne; dla tego samego shape
 // nie wykonuj go ponownie przy odświeżeniu kursu.
 let renderPoints=wtpRenderedGeometryCache.get(points);
 if(!renderPoints){
  renderPoints=wtpSoftRoute(wtpSeparateRepeatedPasses(points));
  wtpRenderedGeometryCache.set(points,renderPoints);
 }
 const route=L.polyline(renderPoints,{color,weight:5,opacity:.96,smoothFactor:0,interactive:false,lineCap:'round',lineJoin:'round'});
 const ns='http://www.w3.org/2000/svg';
 const arrowId='wtp-route-arrow-'+(++wtpRouteArrowSerial);
 let overlay=null;
 const arrowStart=performance.now();
 const detach=()=>{if(overlay){overlay.remove();overlay=null;}};
 const refreshArrows=()=>{
  const path=route._path;if(!path||!path.parentNode||!map)return;
  path.id=arrowId;detach();
  const zoom=map.getZoom();
  route.setStyle({weight:zoom<=11?2.6:zoom<=13?3.4:zoom<=15?4.3:5.2});
  const mpp=40075016.686*Math.cos(map.getCenter().lat*Math.PI/180)/(256*Math.pow(2,zoom));
  // W oddaleniu minimalny odstęp ekranowy, żeby groty nie tworzyły plamy.
  const spacing=zoom<=11?64:zoom<=13?58:zoom<=15?51:46;
  const length=path.getTotalLength?.()||0;
  if(length<3){return;}
  const count=Math.min(1500,Math.ceil(length/spacing)+2);
  const text=document.createElementNS(ns,'text');
  text.setAttribute('class','wtp-route-moving-arrows wtp-route-arrows-v136');
  text.setAttribute('aria-hidden','true');
  text.setAttribute('dominant-baseline','central');
  text.setAttribute('font-size',String(zoom<=11?5.5:zoom<=13?7:zoom<=15?9:10.5));
  const tp=document.createElementNS(ns,'textPath');
  tp.setAttribute('href','#'+arrowId);
  tp.setAttributeNS('http://www.w3.org/1999/xlink','href','#'+arrowId);
  tp.setAttribute('startOffset','0');
  // Tspan z dx: nie korzystamy ze spacji SVG, które są zwijane.
  for(let i=0;i<count;i++){
   const span=document.createElementNS(ns,'tspan');
   span.textContent='›';
   span.setAttribute('dx',i===0?'0':String(Math.max(0,spacing-(zoom<=12?3.5:5.5))));
   tp.appendChild(span);
  }
  const anim=document.createElementNS(ns,'animate');
  anim.setAttribute('attributeName','startOffset');
  anim.setAttribute('from',String(-spacing));
  anim.setAttribute('to','0');
  anim.setAttribute('dur','5s');
  anim.setAttribute('begin',String(-((performance.now()-arrowStart)/1000%5))+'s');
  anim.setAttribute('repeatCount','indefinite');
  tp.appendChild(anim);text.appendChild(tp);path.parentNode.appendChild(text);overlay=text;
 };
 // Leaflet sam przesuwa SVG wraz z mapą; ponowne tworzenie przy GPS niepotrzebne.
 let redrawFrame=0;
 const scheduleArrows=()=>{
  if(redrawFrame)cancelAnimationFrame(redrawFrame);
  redrawFrame=requestAnimationFrame(()=>{redrawFrame=0;refreshArrows();});
 };
 route.on('add',()=>{scheduleArrows();map.on('zoomend',scheduleArrows);map.on('moveend',scheduleArrows)});
 route.on('remove',()=>{map.off('zoomend',scheduleArrows);map.off('moveend',scheduleArrows);if(redrawFrame)cancelAnimationFrame(redrawFrame);redrawFrame=0;detach()});
route._wtpRenderedPoints=renderPoints;
 route.addTo(group);return route;
}
// Rzut przystanku na najbliższy fragment rzeczywistej trasy. Nie zmieniamy
// geometrii jezdni ani nie łączymy punktów odległych od siebie.
function wtpStopRouteProjection(lat,lon,shape){
 if(!Array.isArray(shape)||shape.length<2)return null;
 const kx=111320*Math.cos(lat*Math.PI/180),ky=110540;
 let best=Infinity,result=null;
 for(let i=0;i<shape.length-1;i++){
  const a=shape[i],b=shape[i+1];
  const ax=(a[1]-lon)*kx,ay=(a[0]-lat)*ky;
  const dx=(b[1]-a[1])*kx,dy=(b[0]-a[0])*ky;
  const d2=dx*dx+dy*dy;
  const t=d2?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/d2)):0;
  const x=ax+t*dx,y=ay+t*dy,dist=x*x+y*y;
  if(dist<best){best=dist;result=[lat+y/ky,lon+x/kx];}
 }
 return result?{coords:result,distance:Math.sqrt(best)}:null;
}
function wtpClearCourseMap(){
 
 wtpRouteStopCoords.clear();wtpCourseGeometry=[];wtpActiveCourseStopMarkers=[];wtpActiveCourseVehicle=null;wtpActiveCourseProgress=-1;if(wtpHoveredRouteStop){map?.removeLayer(wtpHoveredRouteStop);wtpHoveredRouteStop=null;}
 if(wtpCourseMapLayer&&map){map.removeLayer(wtpCourseMapLayer)}
 wtpCourseMapLayer=null;
}
// v106: niezależny katalog geometrii GTFS (shapes.txt) z dokładnymi słupkami stops.txt.
// Geometria jest pokazywana wyłącznie po dopasowaniu kursu GTFS do ETA po godzinach.
const wtpShapeCache=new Map();
async function wtpLoadShapeCatalog(line){
 const key=String(line).replaceAll('/','_');
 if(!wtpShapeCache.has(key))wtpShapeCache.set(key,fetch('gtfs/shapes/'+encodeURIComponent(key)+'.json',{cache:'default'}).then(r=>r.ok?r.json():null).catch(()=>null));
 return wtpShapeCache.get(key);
}
// v108: odległość punktu od polilinii (metry, rzut lokalny) — do dopasowania kształtu.
function wtpDistToShape(lat,lon,shape){
 const kx=111320*Math.cos(lat*Math.PI/180),ky=110540;let best=Infinity,bestIdx=-1;
 for(let i=0;i<shape.length-1;i++){
  const a=shape[i],b=shape[i+1];
  const ax=(a[1]-lon)*kx,ay=(a[0]-lat)*ky,bx=(b[1]-lon)*kx,by=(b[0]-lat)*ky;
  const dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy;
  const t=den>0?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/den)):0;
  const x=ax+t*dx,y=ay+t*dy,d=x*x+y*y;
  if(d<best){best=d;bestIdx=i+t}
 }
 return {d:Math.sqrt(best),pos:bestIdx};
}
// WTP LIVE v109 — kontrolowany dobór geometrii GTFS: przystanki, kierunek,
// kolejność, początek/koniec oraz ślad ETA. Bez zgadywania nawrotów na rondach.
function wtpValidPoints(points){
 return (Array.isArray(points)?points:[]).map(p=>[Number(p?.[0]),Number(p?.[1])])
  .filter(p=>Number.isFinite(p[0])&&Number.isFinite(p[1])&&p[0]>50&&p[0]<55&&p[1]>18&&p[1]<24);
}
function wtpEtaStopPoints(eta){
 return (Array.isArray(eta?.stops)?eta.stops:[]).map(s=>[Number(s.lat),Number(s.lon)])
  .filter(p=>Number.isFinite(p[0])&&Number.isFinite(p[1]));
}
function wtpRouteTrace(points){
 const src=wtpValidPoints(points);if(src.length<=26)return src;
 const out=[src[0]],step=(src.length-1)/25;
 for(let i=1;i<25;i++)out.push(src[Math.round(i*step)]);
 out.push(src[src.length-1]);return out;
}
// v110: dopasowanie monotoniczne. Na pętlach ten sam punkt drogi może
// występować wielokrotnie: nie wolno wybierać wyłącznie najbliższego segmentu.
function wtpOrderedMatch(points,shape){
 if(!points.length)return {avg:0,far:0,back:0};
 const full=wtpValidPoints(shape);
 const step=Math.max(1,Math.floor(full.length/450));
 const route=step===1?full:full.filter((_,i)=>i%step===0||i===full.length-1);
 const n=route.length-1;
 if(n<1)return null;
 let previous=0,total=0,far=0,back=0;
 for(let k=0;k<points.length;k++){
  const pt=points[k];let best=null;
  // Ograniczamy cofanie, ale pozwalamy przejechać ten sam obszar dwukrotnie
  // w kolejnych fragmentach pełnego kształtu (np. rondo, pętla).
  const start=k===0?0:Math.max(0,Math.floor(previous)-2);
  const kx=111320*Math.cos(pt[0]*Math.PI/180),ky=110540;
  for(let i=start;i<n;i++){
   const a=route[i],b=route[i+1];
   const ax=(a[1]-pt[1])*kx,ay=(a[0]-pt[0])*ky;
   const dx=(b[1]-a[1])*kx,dy=(b[0]-a[0])*ky;
   const den=dx*dx+dy*dy,t=den?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/den)):0;
   const dist=Math.hypot(ax+t*dx,ay+t*dy),pos=i+t;
   // Minimalna preferencja ciągłości, bez blokowania dużych odległości.
   const cost=dist+Math.max(0,pos-previous)*.002;
   if(!best||cost<best.cost)best={cost,dist,pos};
  }
  if(!best)return null;
  if(k&&best.pos+1<previous)back++;
  previous=Math.max(previous,best.pos);
  total+=Math.min(best.dist,400);
  if(best.dist>125)far++;
 }
 return {avg:total/points.length,far,back};
}
function wtpShapeScore(shape,stops,trace){
 const route=wtpValidPoints(shape);if(route.length<2)return null;
 const orderedStops=wtpOrderedMatch(stops,route);
 const orderedTrace=wtpOrderedMatch(trace,route);
 if(!orderedStops||!orderedTrace)return null;
 const start=stops[0]||trace[0],finish=stops.at(-1)||trace.at(-1);
 const startGap=start?geoDistance(start[0],start[1],route[0][0],route[0][1]):0;
 const endGap=finish?geoDistance(finish[0],finish[1],route.at(-1)[0],route.at(-1)[1]):0;
 // Kursy skrócone / techniczne mogą być tylko fragmentem kształtu GTFS.
 // Wtedy nie zakładamy, że cały shape jest poprawną trasą.
 const endpointBad=startGap>650||endGap>650;
 const stopBad=stops.length>=2&&orderedStops.far>Math.max(2,Math.ceil(stops.length*.25));
 const traceBad=trace.length>=5&&orderedTrace.far>Math.ceil(trace.length*.55);
 if(endpointBad||stopBad||traceBad)return null;
 return {score:orderedStops.avg*.75+orderedTrace.avg*.85+(startGap+endGap)*.15,
  stopAvg:orderedStops.avg,traceAvg:orderedTrace.avg,startGap,endGap,
  stopFar:orderedStops.far,traceFar:orderedTrace.far,
  stopCount:stops.length,traceCount:trace.length};
}
// v111: wybór warstwowy: potwierdzony kurs -> kolejność przystanków ->
// bliskość pojazdu -> bezpieczny GTFS. Nie odrzucamy wszystkich tras przy braku ETA.
// v117: bez zgadywania wariantu przy braku wiarygodnego dopasowania.
// Najpierw shape_id konkretnego kursu; inaczej wymagamy zgodności ETA.
// v117: dopasowanie geometrii na podstawie IDENTYFIKATORÓW słupków,
// a nie samego GPS. Bez zgodności wariantu nie pokazujemy obcego podjazdu.
function wtpPatternMatch(catalog,etaStops,etaGeometry){
 const patterns=Array.isArray(catalog?.patterns)?catalog.patterns:[];
 const etaIds=(etaStops||[]).map(s=>String(s.stop_id??s.stopId??s.id??'')).filter(Boolean);
 const anchors=(etaGeometry?.stops||[]).map(s=>String(s.stop_id??s.stopId??s.id??'')).filter(Boolean);
 const target=etaIds.length>=2?etaIds:anchors;
 if(target.length<2)return null;
 const scored=[];
 for(const pattern of patterns){
  const ids=(pattern.stop_ids||[]).map(String);if(ids.length<2)continue;
  let matched=0,pos=0;
  for(const id of target){const j=ids.indexOf(id,pos);if(j>=0){matched++;pos=j+1}}
  const coverage=matched/Math.max(target.length,ids.length);
  if(coverage>=.86 && matched>=Math.min(4,target.length))scored.push({pattern,coverage,matched});
 }
 scored.sort((a,b)=>b.coverage-a.coverage||b.matched-a.matched);
 if(!scored.length)return null;
 if(scored[1]&&scored[0].coverage-scored[1].coverage<.035&&
    String(scored[0].pattern.shape_id)!==String(scored[1].pattern.shape_id))return null;
 return scored[0].pattern;
}
const wtp294ShapeCache=new WeakMap();
function wtpChooseShape(catalog,choice,trips,vehicle,eta){
 if(!choice||!catalog)return wtpChooseShapeImpl(catalog,choice,trips,vehicle,eta);
 const key=choice.etaStops;
 if(!Array.isArray(key))return wtpChooseShapeImpl(catalog,choice,trips,vehicle,eta);
 const old=wtp294ShapeCache.get(key);
 if(old&&old.catalog===catalog&&old.trips===trips&&old.eta===eta)return old.result;
 const result=wtpChooseShapeImpl(catalog,choice,trips,vehicle,eta);
 wtp294ShapeCache.set(key,{catalog,trips,eta,result});return result;
}
function wtpChooseShapeImpl(catalog,choice,trips,vehicle,eta){
 if(!catalog?.shapes)return null;
 const named=choice?.etaStops?.length&&trips?.length?wtpCompleteEtaMapping(choice.etaStops,etaNameMatch(choice.etaStops,trips,choice.course)):null;
 const trip=named?.trip||null;
 const tripId=String(trip?.trip_id??trip?.tripId??trip?.id??'');
 const confirmedId=trip?.shape_id||(tripId?catalog.trip_shapes?.[tripId]:null);
 const pattern=wtpPatternMatch(catalog,choice?.etaStops,eta);
 const stops=wtpEtaStopPoints(eta),trace=wtpRouteTrace(eta?.status==='ok'?eta.points:[]);
 const id=confirmedId&&catalog.shapes[confirmedId]?String(confirmedId):
   pattern&&catalog.shapes[pattern.shape_id]?String(pattern.shape_id):null;
 if(id){
  const shape=wtpValidPoints(catalog.shapes[id]);
  if(shape.length>=2){
   const metrics=wtpShapeScore(shape,stops,trace);
   // ID kursu z GTFS jest rozstrzygające. Dopasowanie wzorca po
   // identyfikatorach ETA nie jest rozstrzygające bez kontroli przebiegu.
   if(confirmedId || (metrics && (stops.length<3 || (metrics.stopAvg<=65 && metrics.stopFar<=1))))
    return {shape,trip,named,shapeId:id,metrics,pattern,ambiguous:false};
  }
 }
 // Brak rozkładowego ID: wybieramy wyłącznie JEDNOZNACZNY wariant
 // potwierdzony przystankami ETA i ich kolejnością.
 if(stops.length<2)return null;
 const candidates=[];
 for(const [shapeId,raw] of Object.entries(catalog.shapes)){
  const shape=wtpValidPoints(raw);if(shape.length<2)continue;
  const metrics=wtpShapeScore(shape,stops,trace);if(!metrics)continue;
  if(metrics.stopAvg>55||metrics.stopFar>0)continue;
  candidates.push({shapeId,shape,metrics,rank:metrics.score});
 }
 candidates.sort((a,b)=>a.rank-b.rank);
 if(!candidates.length)return null;
 if(candidates[1]&&candidates[1].rank-candidates[0].rank<35){
  // Bliskie wyniki nie oznaczają sprzecznych wariantów: sprawdź geometrię.
  const a=candidates[0].shape,b=candidates[1].shape;
  const same=a.length===b.length && a.every((p,i)=>Math.abs(p[0]-b[i][0])<.000005&&Math.abs(p[1]-b[i][1])<.000005);
  if(!same)return null;
 }
 const best=candidates[0];
 return {...best,trip,named,pattern:null,ambiguous:false};
}
// Przy braku GTFS nie łączymy dalekich punktów ETA przez budynki.
// Krótkie odcinki pozostają widoczne jako przybliżenie (linia przerywana).
function wtpEtaSafeSegments(points){
 const src=wtpValidPoints(points),segments=[];let current=[];
 for(const p of src){
  if(current.length){const q=current.at(-1);
   if(geoDistance(q[0],q[1],p[0],p[1])>110){
    if(current.length>1)segments.push(current);current=[];
   }
  }
  current.push(p);
 }
 if(current.length>1)segments.push(current);
 return segments;
}

// WTP LIVE v175 — korekta końcowych nawrotów z sieci dróg OSM.
// ETA/GTFS są podstawą; OSRM wyznacza objazd z uwzględnieniem strony dojazdu.
// Nie zastępuj geometrii, jeśli router nie zweryfikuje połączenia.
const WTP_OSM_ROUTING_URL='https://router.project-osrm.org/route/v1/driving/';
const wtpRoadRepairCache=new Map();
function wtpBearingDeg(a,b){
 const lat1=a[0]*Math.PI/180,lat2=b[0]*Math.PI/180,dl=(b[1]-a[1])*Math.PI/180;
 return (Math.atan2(Math.sin(dl)*Math.cos(lat2),Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dl))*180/Math.PI+360)%360;
}
function wtpAngleDifference(a,b){return Math.abs((a-b+540)%360-180);}
function wtpRouteLength(p){let n=0;for(let i=1;i<p.length;i++)n+=geoDistance(p[i-1][0],p[i-1][1],p[i][0],p[i][1]);return n;}
function wtpRouteStopAnchors(choice,selected,eta,catalog){
 const result=[];
 const etaStops=choice?.etaStops||[];
 for(let i=0;i<etaStops.length;i++){
  const stop=etaStops[i],j=selected?.named?.mapping?.[i];
  const tripStop=Number.isInteger(j)&&j>=0?selected?.named?.trip?.stops?.[j]:null;
  const sid=String(stop.stop_id??stop.id_slupka??stop.stopId??'');
  const etaPole=wtpEtaPoleCoords(stop);
  const directLat=etaPole?.[0];
  const directLon=Number(stop.lon??stop.longitude??stop.gps_e);
  let coord=Number.isFinite(directLat)&&Number.isFinite(directLon)&&directLat>50&&directLon>18?[directLat,directLon]:null;
  if(!coord&&eta?.stops){const exact=eta.stops.filter(x=>String(x.stop_id??x.id_slupka??'')===sid);if(exact.length===1)coord=[Number(exact[0].lat),Number(exact[0].lon)];}
  if(!coord&&tripStop)coord=catalog?.stops?.[String(tripStop[0])];
  if(!coord){const a=eta?.stops?.find(x=>String(x.seq)===String(stop.seq??i+1));
   if(a&&Number.isFinite(Number(a.lat))&&Number.isFinite(Number(a.lon)))coord=[Number(a.lat),Number(a.lon)];
  }
  if(Array.isArray(coord)&&Number.isFinite(Number(coord[0]))&&Number.isFinite(Number(coord[1])))
   result.push({index:i,point:[Number(coord[0]),Number(coord[1])]});
 }
 return result;
}
function wtpUTurnCandidates(points,anchors){
 const result=[];
 // 1. Szukamy faktycznego nawrotu w okolicy przystanku, także przy końcu shape.
 for(let i=1;i<points.length-1;i++){
  const a=points[Math.max(0,i-2)],b=points[i],c=points[Math.min(points.length-1,i+2)];
  if(geoDistance(a[0],a[1],b[0],b[1])<8||geoDistance(b[0],b[1],c[0],c[1])<8)continue;
  if(wtpAngleDifference(wtpBearingDeg(a,b),wtpBearingDeg(b,c))<145)continue;
  if(anchors.some(p=>geoDistance(p.point[0],p.point[1],b[0],b[1])<85))result.push({index:i,kind:'turn'});
 }
 // 2. Krańce: na błędnej geometrii ETA może nie być nawrotu w ogóle.
 // Spróbuj dojechać do ostatniego słupka od strony jezdni, a nie przeciąć ulicę.
 const last=anchors.at(-1);
 if(last&&points.length>=5&&geoDistance(last.point[0],last.point[1],points.at(-1)[0],points.at(-1)[1])<75)
  result.push({index:points.length-1,kind:'terminal',stop:last.point});
 return result.filter((c,i,a)=>a.findIndex(x=>x.kind===c.kind&&x.index===c.index)===i).slice(-4);
}
async function wtpOsrmRoute(coords,approaches,signal,startBearing=null){
 const loc=coords.map(p=>p[1].toFixed(6)+','+p[0].toFixed(6)).join(';');
 const params=new URLSearchParams({overview:'full',geometries:'geojson',steps:'false',continue_straight:'true',approaches});
 if(Number.isFinite(startBearing))params.set('bearings',startBearing+',55;');
 const response=await fetch(WTP_OSM_ROUTING_URL+loc+'?'+params,{signal,cache:'default'});
 if(!response.ok)return null;
 const data=await response.json();if(data?.code!=='Ok')return null;
 const route=data?.routes?.[0];
 const pts=(route?.geometry?.coordinates||[]).map(p=>[Number(p[1]),Number(p[0])]);
 if(pts.length<4||pts.length>1500||!pts.every(p=>p.every(Number.isFinite)))return null;
 return {points:pts,waypoints:data.waypoints||[],distance:Number(route.distance)};
}
async function wtpRepairRoadGeometry(raw,anchors,routeKey=''){
 const points=wtpValidPoints(raw);
 if(points.length<5||!Array.isArray(anchors)||!anchors.length)return points;
 const candidates=wtpUTurnCandidates(points,anchors);
 if(!candidates.length)return points;
 const key=routeKey+':'+points.length+':'+points[0].join(',')+':'+points.at(-1).join(',');
 if(wtpRoadRepairCache.has(key))return wtpRoadRepairCache.get(key);
 const job=(async()=>{
  let result=points.slice();
  for(const candidate of candidates.slice().reverse()){
   const isStart=candidate.kind==='start-turn';
   const isEnd=candidate.kind==='terminal';
   const i=candidate.index;
   let from,to;
   if(isStart){
    from=0;to=1;let dist=0;
    while(to<result.length-1&&dist<Math.min(450,geoDistance(candidate.stop[0],candidate.stop[1],candidate.next[0],candidate.next[1])*.8)){
     dist+=geoDistance(result[to-1][0],result[to-1][1],result[to][0],result[to][1]);to++;
    }
    if(dist<60)continue;
   }else if(isEnd){
    to=result.length-1;from=to-1;let dist=0;
    while(from>0&&dist<230){dist+=geoDistance(result[from][0],result[from][1],result[from+1][0],result[from+1][1]);from--;}
    if(dist<85)continue;
   }else{
    from=Math.max(0,i-3);to=Math.min(result.length-1,i+3);
   }
   const before=result.slice(from,to+1),oldLength=wtpRouteLength(before);
   if(oldLength<20||oldLength>900)continue;
   const start=isStart?candidate.stop:result[from],end=isEnd?candidate.stop:result[to];
   const via=(isEnd||isStart)?null:result[i];
   const coords=via?[start,via,end]:[start,end];
   const approach=isStart?'curb;unrestricted':isEnd?'unrestricted;curb':'unrestricted;curb;unrestricted';
   // W kursie zaczynającym się na krańcu wymagamy, by router sprawdził
   // odjazd w kierunku przeciwnym do prostego skrótu ETA.
   const directHeading=wtpBearingDeg(start,end);
   const startBearing=isStart?Math.round((directHeading+180)%360):null;
   try{
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),4500);
    let candidateRoute;
    try{candidateRoute=await wtpOsrmRoute(coords,approach,controller.signal,startBearing)}finally{clearTimeout(timeout)}
    if(!candidateRoute)continue;
    const road=candidateRoute.points,newLength=wtpRouteLength(road);
    if(newLength>3500||newLength>oldLength+2400)continue;
    if(geoDistance(start[0],start[1],road[0][0],road[0][1])>35||
       geoDistance(end[0],end[1],road.at(-1)[0],road.at(-1)[1])>35)continue;
    if(candidateRoute.waypoints.some(w=>Number(w.distance)>35))continue;
    // Akceptujemy tylko istotną korektę, nie szum/inną stronę tej samej jezdni.
    if(newLength<oldLength+(isStart?120:75))continue;
    if(isStart&&newLength<250)continue;
    if(isEnd){
     // Dla krańca nowy przebieg musi kończyć się blisko rzeczywistego słupka.
     if(geoDistance(candidate.stop[0],candidate.stop[1],road.at(-1)[0],road.at(-1)[1])>35)continue;
    }else if(!road.some(p=>geoDistance(p[0],p[1],result[i][0],result[i][1])>45))continue;
    result.splice(from,to-from+1,start,...road.slice(1,-1),end);
    console.info('[WTP v176] Korekta po drogach OSM',candidate.kind,'dodano metrów:',Math.round(newLength-oldLength));
   }catch(e){console.debug('[WTP v176] Routing niedostępny',e?.message)}
  }
  return result;
 })();
 wtpRoadRepairCache.set(key,job);
 if(wtpRoadRepairCache.size>120)wtpRoadRepairCache.delete(wtpRoadRepairCache.keys().next().value);
 return job;
}

let wtpStopCatalogPromise=null;
async function wtpShowCourseMap(match,vehicle,serial,trips=[]){
 const id=match?.selected?.course?.course_id;
 if(!id)return;
 try{
  const line=String(vehicle.Lines||match.selected.course.line||'').trim();
  // v252: katalog shape, geometria ETA i nadpisania startują równolegle
  // z katalogiem przystanków; nie czekają na jego pobranie.
  const pack=match.preparedPack||wtpLineData.get(line);
  if(!pack)return;
  const catalog=pack.catalog,eta=pack.geometries[pack.geometry_refs[String(id)]],overrides=pack.overrides;
  if(serial!==vehiclePanelRequest||$('vehiclePanel')?.hidden)return;
  const selected=wtpChooseShape(catalog,match.selected,trips,vehicle,eta);
  // ETA jest wyłącznie wariantem awaryjnym, gdy brak potwierdzonego GTFS.
  const etaValid=eta?.status==='ok'&&Array.isArray(eta.points)&&eta.points.length>=2;
  if(!selected){
   // Surowe ETA to punkty kontrolne, a nie geometria ulic. Nie rysujemy
   // połączeń prostych przez ronda, budynki i drogi jednokierunkowe.
   console.info('[WTP v140] Brak wiarygodnej trasy po ulicach; pominięto linię ETA',{line,course_id:id,etaValid});
  }
  const overrideRaw=selected?.shapeId && overrides?.shapes?.[String(selected.shapeId)];
  const overridePoints=wtpValidPoints(overrideRaw);
  const hasOverride=overridePoints.length>=2;
  const overrideVersion=hasOverride?(overridePoints.length+':'+overridePoints[0].join(',')+':'+overridePoints.at(-1).join(',')):'';
  const newRouteKey=[vehicleKey(vehicle),String(id),String(selected?.shapeId||''),overrideVersion].join('|');
  if(wtpCourseMapLayer&&wtpCourseMapLayer._wtpRouteKey===newRouteKey){wtpActiveCourseVehicle=vehicleKey(vehicle);wtpRefreshCourseStopTimes();return;}
  // Szary wyłącznie dla kursów jawnie oznaczonych jako techniczne.
  // Nie wyznaczamy fikcyjnych przejazdów technicznych pomiędzy pętlami.
  const technicalCourse=wtpIsTechnicalCourse(match.selected.course,match.selected.etaStops||[],selected?.named?.mapping,selected?.named?.trip);
  const color=technicalCourse?'#858b92':vehicle.kind===2?'#ec0000':'#820082';
  let points=hasOverride?overridePoints:(selected?.shape||null);
  // Kierunek GTFS jest weryfikowany kolejnością słupków kursu.
  // Dla dwukierunkowego shape odwracamy geometrię, a nie obracamy same groty.
  if(points&&!hasOverride&&selected?.named?.trip?.stops?.length>=2){
   const list=selected.named.trip.stops;
   const first=list[0],last=list[list.length-1];
   const a=[Number(first[2]),Number(first[3])],b=[Number(last[2]),Number(last[3])];
   if(a.every(Number.isFinite)&&b.every(Number.isFinite)){
    const normal=geoDistance(a[0],a[1],points[0][0],points[0][1])+geoDistance(b[0],b[1],points.at(-1)[0],points.at(-1)[1]);
    const reverse=geoDistance(a[0],a[1],points.at(-1)[0],points.at(-1)[1])+geoDistance(b[0],b[1],points[0][0],points[0][1]);
    if(reverse+100<normal)points=points.slice().reverse();
   }
  }
  // v173: OSM służy tylko do potwierdzonego objazdu nieprawidłowego nawrotu.
  // Jeżeli routing nie odpowie, nie rysujemy wymyślonej drogi.
  // v209: Nie nadpisuj geometrii ETA/GTFS routingiem OSM.
  // OSRM generował błędne prostokątne objazdy na pętlach (np. Os. Górczewska).
  // Zachowaj oryginalne punkty potwierdzonego wariantu.
  if(points&&!hasOverride){
   points=wtpValidPoints(points);
   if(serial!==vehiclePanelRequest||$('vehiclePanel')?.hidden)return;
  }
  const group=L.layerGroup();
  const nextCourseMarkers=[];
  // Nie udawaj przebiegu po jezdni, jeśli posiadamy wyłącznie przybliżone punkty ETA.
  if(points){
   const baseRoute=wtpDrawDirectionalRoute(group,points,color,selected?.shapeId);
   // Ten sam zestaw wygładzonych i odsuniętych punktów co fioletowa linia.
   // Nie wolno ponownie rysować szarej części z surowego shape.
   // v164: szary przejazd od "wys" do "ws" tylko po rzeczywistym shape.
   // Nie łączymy słupków prostą linią i nie zgadujemy przebiegu ulic.
   const segments=wtpTechnicalIntervals(match.selected.etaStops||[],selected?.named?.mapping,selected?.named?.trip,match.selected.course);
   const tripStops=selected?.named?.trip?.stops||[];
   // v168: indeksy wyznaczamy na *tej samej* polilinii, którą rysuje Leaflet.
   // W v167 indeks surowego shape był używany do wygładzonej linii,
   // co przesuwało szary fragment na wcześniejsze przystanki.
   const drawn=baseRoute._wtpRenderedPoints||points;
   group._wtpGeometry=drawn.map(p=>[Number(p[0]),Number(p[1])]);
   const candidatesNear=(coord,limit=95)=>{
    if(!coord.every(Number.isFinite))return [];
    const result=[];
    for(let k=0;k<drawn.length;k++){
     const d=geoDistance(coord[0],coord[1],Number(drawn[k][0]),Number(drawn[k][1]));
     if(d<=limit)result.push({index:k,dist:d});
    }
    return result;
   };
   for(const [a,b] of segments){
    const ia=selected?.named?.mapping?.[a],ib=selected?.named?.mapping?.[b];
    const sa=tripStops[ia],sb=tripStops[ib];
    const coord=(i,st)=>wtpEtaPoleCoords(match.selected.etaStops[i])||wtpEtaOfficialStop(match.selected.etaStops[i])?.coords||(st?[Number(st[2]),Number(st[3])]:null);
    const ca=coord(a,sa),cb=coord(b,sb);
    if(!ca||!cb)continue;
    const starts=candidatesNear(ca);
    const ends=candidatesNear(cb);
    if(!starts.length||!ends.length)continue;
    // Dla ostatniego słupka wybierz jego późniejsze wystąpienie na trasie.
    // To ważne na pętlach, gdzie ulica przebiega dwa razy blisko słupka.
    const endIsTerminal=b===match.selected.etaStops.length-1;
    let best=null;
    for(const start of starts){
     for(const end of ends){
      if(end.index<=start.index+1)continue;
      const span=end.index-start.index;
      
      // Długość samego fragmentu, nie różnica indeksów po wygładzaniu.
      let length=0;
      for(let k=start.index;k<end.index;k++){
       length+=geoDistance(drawn[k][0],drawn[k][1],drawn[k+1][0],drawn[k+1][1]);
       
      }
      if(length<1)continue;
      const terminalPenalty=endIsTerminal?(drawn.length-1-end.index)*1.2:0;
      const score=start.dist+end.dist+length*.05+terminalPenalty;
      if(!best||score<best.score)best={score,start:start.index,end:end.index};
     }
    }
    if(!best)continue;
    L.polyline(drawn.slice(best.start,best.end+1),{
     color:'#858b92',weight:5.3,opacity:1,smoothFactor:0,
     interactive:false,lineCap:'round',lineJoin:'round'
    }).addTo(group);
   }
   console.info('[WTP v140] Pełna geometria bez przesunięcia',{line,shape_id:selected?.shapeId||null});
  }
  else if(etaValid){
   console.warn('[WTP v140] Nie rysuję przybliżonej trasy ETA bez potwierdzenia',{line,course_id:id});
  }
  const orderedStops=match.selected.etaStops||[];
  const mapping=selected?.named?.mapping||[];

  // Słupki GTFS są źródłem głównym. Gdy nie ma potwierdzonego GTFS,
  // wykorzystaj jedynie jednoznacznie rozpoznany oficjalny słupek z /stops.
  const addStop=(i,coords)=>{
   if(!Array.isArray(coords)||coords.length<2)return;
   const lat=Number(coords[0]),lon=Number(coords[1]);
   if(!Number.isFinite(lat)||!Number.isFinite(lon))return;
   wtpRouteStopCoords.set(i,[lat,lon]);
   const stop=orderedStops[i]||{};
   const requestFlag=stop.slupek_na_zadanie??stop.na_zadanie??stop.request_stop;
   const nearby=requestStopNear(lat,lon);
   const onRequest=requestFlag===true||requestFlag===1||requestFlag==='1'||
     (requestFlag==null&&nearby===true);
   const unknown=requestFlag==null&&nearby==null;
   // v137: brak łącznika od przystanku do osi jezdni. Lokalizacja słupka pozostaje rzeczywista.
   const markerRole=wtpStopRole(stop,selected?.named?.trip?.stops?.[mapping[i]]);
   const boardingAfterAlighting=markerRole==='ws'&&i>0&&wtpStopRole(orderedStops[i-1],selected?.named?.trip?.stops?.[mapping[i-1]])==='wys';
   const markerColor=technicalCourse||boardingAfterAlighting||['tech','zaj'].includes(markerRole)?'#858b92':vehicle.kind===2?'#ec0000':'#820082';
   const marker=L.circleMarker([lat,lon],{className:'wtp-course-stop',radius:7,color:markerColor,weight:2.5,
    fillColor:onRequest&&!technicalCourse&&!boardingAfterAlighting?'#fff':markerColor,fillOpacity:1,pane:'stopsPane'});
   const poleName=String(stop.eta_platform_number||stop.nazwa_slupka||stop.numer_slupka||stop.nr_slupka||stop.slupek||stop.stop_no||'').trim();
   const official=Array.isArray(stops)?stops.find(r=>{const p=stopCoordinates(r);return p&&geoDistance(lat,lon,p[0],p[1])<7;}):null;
   const mappedIndex=selected?.named?.mapping?.[i];
   const mappedStop=Number.isInteger(mappedIndex)&&mappedIndex>=0?selected.named.trip?.stops?.[mappedIndex]:null;
   const etaName=wtpResolveEtaStopName(stop,mappedStop,trips);
   const routeName=String(wtpEtaSourceStopLabel(stop)||etaName);
   // Ta sama potwierdzona nazwa w mapie i panelu kursu.
   const listName=document.querySelector('#vehicleBody .route-stop[data-route-stop-index="'+i+'"] .route-stop-name');
   if(listName&&routeName)listName.textContent=routeName;
   const info=wtpCourseStopDisplay.get(i);
   // v139: wartości czasu są odczytywane dynamicznie; nie utrwalamy 'Za 4 min' w HTML.
   const timeLine=info&&Number.isFinite(info.expectedMinutes)
    ?'<span class="wtp-course-stop-eta" data-expected-minutes="'+info.expectedMinutes+'" data-planned="'+escapeHTML(info.planned)+'" data-expected="'+escapeHTML(info.expected)+'" data-delayed="'+(info.delayed?'1':'0')+'" data-delta="'+(Number(info.deltaMinutes)||0)+'" data-estimated="'+(info.estimated?'1':'0')+'"></span>':'';
   marker.bindTooltip('<span class="wtp-course-stop-title">'+escapeHTML(routeName+(poleName&&!new RegExp('(?:^|\\s)'+poleName+'$').test(routeName)?' '+poleName:''))+'</span>'+timeLine,
    {direction:'top',permanent:true,sticky:false,interactive:false,offset:L.point(0,-9),pane:'wtpCourseTooltipsPane',className:'wtp-stop-tooltip wtp-course-stop-name '+(technicalCourse||boardingAfterAlighting||['tech','zaj'].includes(markerRole)?'wtp-course-technical':vehicle.kind===2?'wtp-course-tram':'wtp-course-bus')});
   marker.on('click',()=>{
    const row=document.querySelector('#vehicleBody .route-stop[data-route-stop-index="'+i+'"]');
    row?.scrollIntoView({block:'nearest',behavior:'smooth'});
    wtpFocusRouteStop(i,row);
   });
   // Leaflet keeps tooltip anchored to the circleMarker geographic position.
   // Recompute on zoom/pan via Leaflet; no pixel-positioned HTML overlays.
   marker.addTo(group);
   nextCourseMarkers.push({index:i,marker,coords:[lat,lon]});
  };
  // v213: seq to kolejność w kursie, NIE identyfikator słupka.
  // Zgodność wymaga numeru słupka i nazwy lub dokładnego ID ETA/GTFS.
  const sameStop=(stop,anchor)=>{
   if(!stop||!anchor)return false;
   const id=String(stop.stop_id??stop.stopId??'').trim();
   const aid=String(anchor.stop_id??anchor.stopId??'').trim();
   if(id&&aid)return id===aid;
   const name=String(stop.name??stop.nazwa??'').trim().toLocaleLowerCase('pl');
   const aname=String(anchor.name??anchor.nazwa??'').trim().toLocaleLowerCase('pl');
   const pole=String(stop.slupek??stop.stop_no??stop.nr_slupka??stop.stop_number??'').trim();
   const apole=String(anchor.slupek??anchor.stop_no??anchor.nr_slupka??anchor.stop_number??'').trim();
   return !!(name&&aname&&pole&&apole&&name===aname&&pole===apole);
  };
  orderedStops.forEach((stop,i)=>{
   let coords=wtpEtaPoleCoords(stop);
   if(!coords)coords=wtpEtaOfficialStop(stop)?.coords||null;
   if(selected){
    const j=mapping[i],st=Number.isInteger(j)&&j>=0?selected.trip?.stops?.[j]:null;
    const sid=String(st?.[0]??'');
    const wanted=String(stop.name??stop.nazwa??'').trim().toLocaleLowerCase('pl');
    const mapped=String(st?.[1]??'').trim().toLocaleLowerCase('pl');
    const pole=String(stop.slupek??stop.stop_no??stop.nr_slupka??stop.stop_number??'').trim();
    if(!coords&&(!wanted||!mapped||wanted===mapped)&&(!pole||sid.endsWith(pole)))coords=catalog.stops?.[sid]||null;
   }
   // Przede wszystkim przypisany słupek z dopasowanego kursu GTFS.
   // Dopasowanie po samym numerze seq jest awaryjne: numeracja ETA może
   // zaczynać się od zera, mieć pominięte przystanki lub odcinki techniczne.
   if(!coords&&selected?.named?.trip?.stops?.length){
    const j=selected.named.mapping?.[i];
    const sid=Number.isInteger(j)&&j>=0?String(selected.named.trip.stops[j]?.[0]??''):'';
    if(sid&&catalog?.stops?.[sid]){
     const mapped=selected.named.trip.stops[j];
     const wanted=String(stop.name??stop.nazwa??'').trim().toLocaleLowerCase('pl');
     const name=String(mapped?.[1]??'').trim().toLocaleLowerCase('pl');
     if(!wanted||!name||wanted===name)coords=catalog.stops[sid];
    }
   }
   if(!coords&&eta?.status==='ok'&&Array.isArray(eta.stops)){
    const anchor=eta.stops.find(x=>sameStop(stop,x));
    if(anchor){
     const lat=Number(anchor.lat),lon=Number(anchor.lon);
     const sid=String(anchor.stop_id??anchor.stopId??'');
     if(sid&&catalog?.stops?.[sid])coords=catalog.stops[sid];
     else coords=wtpOfficialStopNear(lat,lon,25);
    }
   }
   if(!coords&&selected?.pattern){
    const sid=String(stop.stop_id??stop.stopId??(selected.pattern.stop_ids?.length===orderedStops.length?selected.pattern.stop_ids?.[i]:'')??'');
    if(sid&&catalog?.stops?.[sid])coords=catalog.stops[sid];
   }
   if(!coords&&eta?.status==='ok'&&Array.isArray(eta.stops)){
    const anchor=eta.stops.find(x=>sameStop(stop,x));
    if(anchor){
     const sid=String(anchor.stop_id??anchor.stopId??'');
     if(sid&&catalog?.stops?.[sid])coords=catalog.stops[sid];
     else if(Number.isFinite(Number(anchor.lat))&&Number.isFinite(Number(anchor.lon)))
      coords=wtpOfficialStopNear(Number(anchor.lat),Number(anchor.lon),30);
    }
   }
   // Fallback: pełna nazwa zespołu + numer słupka z oficjalnego API.
   // Nigdy nie dobieramy tylko najbliższego słupka (może być po przeciwnej stronie).
   if(!coords&&Array.isArray(stops)){
    const nm=String(stop.name||stop.nazwa||'').trim().toLocaleLowerCase('pl');
    const pole=String(stop.slupek||stop.stop_no||stop.nr_slupka||stop.stop_number||'').trim();
    if(nm&&pole){
     const found=stops.find(r=>wtpStopGroupName(r).toLocaleLowerCase('pl')===nm&&String(value(r,'slupek')||'').trim()===pole);
     if(found)coords=stopCoordinates(found);
    }
   }
   // Gdy dopasowanie dynamiczne odrzuci pojedynczy słupek, szukaj
   // jego jednoznacznego identyfikatora w danych GTFS tego samego kursu.
   if(!coords&&catalog?.stops){
    const sid=String(stop.stop_id??stop.stopId??stop.stop_code??'').trim();
    if(sid&&catalog.stops[sid])coords=catalog.stops[sid];
   }
   // Wersja awaryjna: ten sam zespół i numer słupka z GTFS.
   // Nie wybieraj przystanku wyłącznie po podobnej nazwie.
   if(!coords&&Array.isArray(trips)&&catalog?.stops){
    const nm=String(stop.name||stop.nazwa||'').trim().toLocaleLowerCase('pl');
    const pole=String(stop.slupek||stop.stop_no||stop.nr_slupka||stop.stop_number||'').trim();
    if(nm&&pole){
     const matches=[];
     for(const trip of trips)for(const st of trip.stops||[]){
      const name=String(st[1]||'').trim().toLocaleLowerCase('pl');
      const sid=String(st[0]??'');
      if(name===nm&&sid.endsWith(pole)&&catalog.stops[sid])matches.push(catalog.stops[sid]);
     }
     if(matches.length){
      const first=matches[0];
      if(matches.every(c=>geoDistance(first[0],first[1],c[0],c[1])<8))coords=first;
     }
    }
   }
   // Ostateczna lokalizacja: słupek z pełnej listy GTFS dla tej linii.
   // Wykorzystujemy jednocześnie nazwę, numer słupka i rzeczywiste GPS,
   // nigdy samą nazwę zespołu ani sztuczny punkt na linii.
   if(!coords&&Array.isArray(trips)){
    const nm=String(stop.name||stop.nazwa||'').trim().toLocaleLowerCase('pl');
    const pole=String(stop.slupek||stop.stop_no||stop.nr_slupka||stop.stop_number||'').trim();
    const found=[];
    for(const trip of trips){
     for(const st of trip.stops||[]){
      const name=String(st[1]||'').trim().toLocaleLowerCase('pl');
      const id=String(st[0]??'');
      const lat=Number(st[2]),lon=Number(st[3]);
      if(name===nm&&pole&&id.endsWith(pole)&&Number.isFinite(lat)&&Number.isFinite(lon)&&lat>49&&lat<55&&lon>13&&lon<25)found.push([lat,lon]);
     }
    }
    if(found.length&&found.every(c=>geoDistance(c[0],c[1],found[0][0],found[0][1])<12))coords=found[0];
   }
   // ETA podaje współrzędne słupka wprost; jeśli jest jednoznaczny
   // identyfikator i pozycja w Warszawie, zachowaj go bez odrzucania.
   if(!coords&&eta?.status==='ok'&&Array.isArray(eta.stops)){
    const sid=String(stop.stop_id??stop.stopId??'');
    const candidates=eta.stops.filter(x=>sid&&String(x.stop_id??x.stopId??'')===sid);
    if(candidates.length===1){
     const lat=Number(candidates[0].lat),lon=Number(candidates[0].lon);
     if(Number.isFinite(lat)&&Number.isFinite(lon)&&lat>49&&lat<55&&lon>13&&lon<25)coords=[lat,lon];
    }
   }
   // Nie pokazuj słupka o błędnej nazwie / numerze tylko dlatego,
   // że algorytm dopasował sąsiedni przystanek GTFS.
   if(coords&&Array.isArray(stops)&&stops.length){
    const wanted=String(stop.name||stop.nazwa||'').trim().toLocaleLowerCase('pl');
    const pole=String(stop.slupek||stop.stop_no||stop.nr_slupka||stop.stop_number||'').trim();
    const correct=stops.find(r=>wtpStopGroupName(r).toLocaleLowerCase('pl')===wanted&&String(value(r,'slupek')||'').trim()===pole);
    if(correct){
     const officialCoords=stopCoordinates(correct);
     if(officialCoords)coords=officialCoords;
    }
   }
   addStop(i,coords);
  });
  if(!selected)console.info('[WTP v140] Wyświetlono wyłącznie potwierdzone przystanki — brak poprawnego shape_id.');
  group._wtpRouteKey=newRouteKey;
  group.addTo(map);
  wtpUpdateCourseLabelZoom();
  const previous=wtpCourseMapLayer;
  wtpCourseMapLayer=group;
  wtpActiveCourseVehicle=vehicleKey(vehicle);
  wtpActiveCourseStopMarkers=nextCourseMarkers;
  wtpCourseGeometry=group._wtpGeometry||[];
  requestAnimationFrame(wtpRefreshCourseStopTimes);
  if(previous&&map.hasLayer(previous))map.removeLayer(previous);
  wtpScheduleCourseLabelLayout();
 }catch(e){console.warn('Geometria kursu:',e.message)}
}
// v139: odświeżanie zegara bez ponownego tworzenia markerów i całej trasy.

// v251: serwerowy odjazd nie moze wyprzedzac potwierdzonej pozycji GPS.
// Ten sam wynik obowiazuje dla chmurki, listy i odliczania.
function wtpStopPassedUnified(index,progress,row){
 const stop=progress?.stops?.find(st=>st.index===index);
 const marker=wtpActiveCourseStopMarkers.find(item=>item.index===index);
 const gps=marker?wtpCourseStopStatus(index,marker.coords,NaN,progress):null;
 const server=row?.dataset.wtpConfirmedDeparture==='1';
 if(progress&&stop){
  // Pozycja na trasie jest wazniejsza niz godzina zdarzenia w historii.
  // Dopiero faktyczne miniecie przystanku potwierdza odjazd.
  return !!gps?.passed;
 }
 // Bez wiarygodnego postepu GPS nie zmieniaj stanu na podstawie zegara.
 // Zachowaj tylko stan juz zatwierdzony w widoku.
 return !!row?.dataset.wtpV251Passed;
}
// v201: jedna mapa statusów dla znaczników i listy, bez prognozy z zegara.
const wtpConfirmedPassedByCourse=new Map();
function wtpSyncPanelPassedStops(){
 const body=$('vehicleBody'),list=body?.querySelector('ol.route-stops');
 if(!list||$('vehiclePanel')?.hidden||!focusedVehicle)return;
 const rows=[...list.querySelectorAll(':scope > li.route-stop')];
 if(!rows.length)return;
 const progress=wtpRouteProgress();
 if(!progress||!progress.stops?.length)return;
 const key=progress.key;
 const saved=wtpConfirmedPassedByCourse.get(key)||new Set();
 for(const stop of progress.stops){
  const marker=wtpActiveCourseStopMarkers.find(item=>item.index===stop.index);
  if(marker&&wtpCourseStopStatus(stop.index,marker.coords,NaN,progress).passed)saved.add(stop.index);
 }
 wtpConfirmedPassedByCourse.set(key,saved);
 const next=progress.stops.find(stop=>!saved.has(stop.index))?.index??progress.next;
 const nextStopMarker=wtpActiveCourseStopMarkers.find(item=>item.index===next);
 const nextStatus=nextStopMarker?wtpCourseStopStatus(next,nextStopMarker.coords,NaN,progress):null;
 // v252: przy przystanku nie pokazujemy napisu 'Następny przystanek:'.
 // Rozpoznanie musi korzystać z aktualnego GPS, a nie z godziny odjazdu.
 const atStop=!!nextStatus?.gpsFresh&&nextStatus.distance<=35&&
  nextStatus.remaining>=-35&&nextStatus.remaining<=100;
 for(const row of rows){
  const index=Number(row.dataset.routeStopIndex??row.dataset.etaStopIndex);
  if(!Number.isInteger(index))continue;
  const passed=saved.has(index)||wtpStopPassedUnified(index,progress,row);
  if(passed)row.dataset.wtpV251Passed='1';
  row.classList.toggle('passed',passed);
  row.classList.toggle('wtp-server-passed',passed);
  // Nie używamy klasy current, bo w CSS tworzy ona białą obwódkę kropki.
  row.classList.remove('current');
  row.classList.toggle('wtp-next-row',index===next&&!passed);
  row.classList.toggle('wtp-live-next',index===next&&!passed&&!atStop);
  row.classList.toggle('wtp-at-stop',index===next&&!passed&&atStop);
  if(passed)row.querySelector(':scope > .wtp-list-countdown')?.remove();
  // v254: status >>> jest aktualizowany wspólnie z dymkiem w odliczaniu.
  row.querySelectorAll('.wtp-near-stop-badge').forEach(badge=>badge.remove());
 }
 // Etykieta następnego przystanku nie jest metadanymi typu przystanku.
 let label=list.querySelector(':scope > .wtp-live-next-label');
 if(!label){
  label=document.createElement('span');
  label.className='wtp-live-next-label';
  label.textContent='Następny przystanek:';
  list.append(label);
 }
 // Usuń dawny napis, żeby nie pojawiał się dwa razy.
 list.querySelectorAll(':scope > .wtp-next-stop').forEach(el=>{if(el!==label)el.remove()});
 // v252: zachowujemy tylko jeden znacznik (render listy i synchronizacja
 // mogły wcześniej utworzyć po jednym).
 const vehicleMarkers=[...list.querySelectorAll(':scope > .wtp-vehicle-on-route')];
 let marker=vehicleMarkers[0]||null;
 vehicleMarkers.slice(1).forEach(extra=>extra.remove());
 // v211: geometry can be temporarily unavailable at first render. Always
 // recreate the vehicle icon from live progress, rather than silently return.
 if(!marker){
  marker=document.createElement('span');marker.className='wtp-vehicle-on-route';
  const img=document.createElement('img');
  img.src=focusedVehicle.kind===2?'icons/WTP-tramwaj.svg':'icons/WTP-autobus.svg';
  img.alt=focusedVehicle.kind===2?'Tramwaj':'Autobus';
  marker.append(img);list.append(marker);
 }
 const valid=progress.stops;
 const prev=[...valid].reverse().find(st=>st.along<=progress.along)||valid[0];
 const following=valid.find(st=>st.along>=progress.along)||valid[valid.length-1];
 const prevRow=rows.find(r=>Number(r.dataset.routeStopIndex??r.dataset.etaStopIndex)===prev.index);
 const nextRow=rows.find(r=>Number(r.dataset.routeStopIndex??r.dataset.etaStopIndex)===following.index);
 const target=rows.find(r=>Number(r.dataset.routeStopIndex??r.dataset.etaStopIndex)===next);
 if(!prevRow||!nextRow||!target)return;
 marker.hidden=false;
 const box=list.getBoundingClientRect();
 const dotA=prevRow.querySelector('.route-dot')?.getBoundingClientRect();
 const dotB=nextRow.querySelector('.route-dot')?.getBoundingClientRect();
 const dotTarget=target.querySelector('.route-dot')?.getBoundingClientRect();
 if(!dotA||!dotB||!dotTarget)return;
 const fraction=following.along>prev.along?
  Math.max(0,Math.min(1,(progress.along-prev.along)/(following.along-prev.along))):0;
 const y=((dotA.top+dotA.bottom)/2)*(1-fraction)+((dotB.top+dotB.bottom)/2)*fraction-box.top;
 const x=((dotA.left+dotA.right)/2)*(1-fraction)+((dotB.left+dotB.right)/2)*fraction-box.left;
 marker.style.setProperty('left',Math.round(x)+'px','important');
 marker.style.setProperty('top',Math.round(y)+'px','important');
 const targetY=(dotTarget.top+dotTarget.bottom)/2-box.top;
 const labelX=target.querySelector('.wtp-route-stop-text')?.getBoundingClientRect().left??(box.left+45);
 const targetText=target.querySelector('.wtp-route-stop-text')?.getBoundingClientRect();
 label.style.setProperty('top',Math.round(Math.max(target.getBoundingClientRect().top+14,(targetText?.top??dotTarget.top)-3)-box.top)+'px','important');
 label.style.setProperty('left',Math.round(labelX-box.left)+'px','important');
 // Na pierwszym słupku przed faktycznym odjazdem nie ma 'Następny przystanek'.
 const origin=valid[0];
 const originMarker=wtpActiveCourseStopMarkers.find(item=>item.index===origin?.index);
 const originDistance=originMarker&&progress.gpsLat!=null?
  geoDistance(progress.gpsLat,progress.gpsLon,originMarker.coords[0],originMarker.coords[1]):Infinity;
 const startRow=rows.find(r=>Number(r.dataset.routeStopIndex??r.dataset.etaStopIndex)===origin?.index);
 const hasConfirmedStart=startRow?.dataset.wtpConfirmedDeparture==='1';
 const atOrigin=!hasConfirmedStart&&originDistance<=70&&progress.along<=origin.along+100;
 label.hidden=atOrigin||atStop;
}
// v231: forecast is a moving estimate until arrival, not a historical observation.
// The same DOM time is read by both the map bubble and the route list.
function wtpClockNearService(clock,reference){
 const m=/^(\d{1,2}):(\d{2})$/.exec(String(clock||''));
 if(!m||!Number.isFinite(reference))return NaN;
 let value=Number(m[1])*60+Number(m[2]);
 while(value-reference>720)value-=1440;
 while(reference-value>720)value+=1440;
 return value;
}
function wtpCurrentRowForecastClock(index){
 const row=$('vehicleBody')?.querySelector('ol.route-stops > li.route-stop[data-route-stop-index="'+index+'"]');
 const cell=row?.querySelector('.route-stop-time');
 const node=cell?.querySelector('.wtp-server-forecast,.wtp-estimated-time');
 return node?.textContent?.trim()||null;
}
function wtpRefreshPendingForecasts(){
 const body=$('vehicleBody');
 if(!body||$('vehiclePanel')?.hidden||!focusedVehicle)return;
 const nowDate=new Date();
 const now=nowWarsaw(nowDate);
 const seconds=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',second:'2-digit'}).format(nowDate));
 const nowPrecise=now+seconds/60;
 const progress=wtpRouteProgress();
 const fresh=Number.isFinite(gpsMs(focusedVehicle.Time))&&Math.abs(Date.now()-gpsMs(focusedVehicle.Time))<=90000;
 const rows=body.querySelectorAll('ol.route-stops > li.route-stop');
 for(const row of rows){
  if(row.classList.contains('passed')||row.classList.contains('wtp-server-passed')||row.dataset.wtpConfirmedDeparture==='1'||row.dataset.wtpActualClock)continue;
  const index=Number(row.dataset.routeStopIndex);
  const marker=wtpActiveCourseStopMarkers.find(item=>item.index===index);
  const status=marker?wtpCourseStopStatus(index,marker.coords,NaN,progress):null;
  if(status?.passed)continue;
  const cell=row.querySelector('.route-stop-time');
  if(!cell)continue;
  let forecast=cell.querySelector('.wtp-server-forecast,.wtp-estimated-time');
  const planned=cell.querySelector('.wtp-server-planned,.wtp-planned-time');
  const baseClock=planned?.textContent?.trim()||(!forecast?cell.textContent.trim():'');
  const planMinutes=wtpClockNearService(baseClock,now);
  const previous=forecast?wtpClockNearService(forecast.textContent,now):planMinutes;
  if(!Number.isFinite(previous))continue;
  // Dopiero świeży GPS przy danym słupku potwierdza, że pojazd
  // nadal nie odjechał. Nie opóźniaj całej trasy samym zegarem.
  const waitingHere=fresh&&!!status?.atStop;
  const alreadyForecast=!!forecast;
  if(!waitingHere&&!alreadyForecast)continue;
  // v242: 22:25 trwa do 22:25:59. Sam upływ sekund nie oznacza spóźnienia.
  const completedMinute=Math.floor(nowPrecise);
  if(previous>=completedMinute)continue;
  const newMinutes=completedMinute;
  if(!forecast){
   const old=document.createElement('span');old.className='wtp-planned-time';old.textContent=displayClock(planMinutes);
   old.style.cssText='display:block;text-decoration:line-through;color:#9299a0;font-size:12px;line-height:1.2;text-align:right';
   forecast=document.createElement('strong');forecast.className='wtp-estimated-time';
   forecast.style.cssText='display:block;color:#c9221c;font-weight:750;line-height:1.3;text-align:right';
   cell.replaceChildren(old,forecast);
  }
  forecast.textContent=displayClock(newMinutes);
  if(newMinutes>planMinutes){
   forecast.classList.remove('wtp-on-time','wtp-time-early');
   forecast.classList.add('wtp-time-late');forecast.style.color='#c9221c';
  }
 }
}
// v249: odliczanie na liście nie zależy od obecności dymków na mapie.
// Korzystamy z istniejących godzin i prognoz w wierszach (bez zgadywania opóźnienia).
function wtpRefreshListCountdowns(progress=wtpRouteProgress()){
 const body=$('vehicleBody');
 if(!body||$('vehiclePanel')?.hidden)return;
 const nowDate=new Date();
 const now=nowWarsaw(nowDate)+Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',second:'2-digit'}).format(nowDate))/60;
 const current=wtpCurrentVehicle()||focusedVehicle;
 const active=!!current&&Number.isFinite(gpsMs(current.Time))&&Math.abs(Date.now()-gpsMs(current.Time))<180000;
 body.querySelectorAll('ol.route-stops > li.route-stop[data-route-stop-index]').forEach(row=>{
  let badge=row.querySelector(':scope > .wtp-list-countdown');
  const index=Number(row.dataset.routeStopIndex);
  const marker=wtpActiveCourseStopMarkers.find(item=>item.index===index);
  const status=marker?wtpCourseStopStatus(index,marker.coords,NaN,progress):null;
  if(wtpStopPassedUnified(index,progress,row)){
   badge?.remove();row.dataset.wtpV251Passed='1';return;
  }
  const cell=row.querySelector('.route-stop-time');if(!cell)return;
  const live=cell.querySelector('.wtp-server-forecast,.wtp-estimated-time,.wtp-server-actual');
  const planned=cell.querySelector('.wtp-server-planned,.wtp-planned-time');
  const liveClock=live?.textContent?.trim();
  const planClock=planned?.textContent?.trim()||(!live?cell.textContent.trim():'');
  const clock=/^\d{1,2}:\d{2}$/.test(liveClock||'')?liveClock:planClock;
  if(!/^\d{1,2}:\d{2}$/.test(clock||''))return;
  const expected=wtpClockNearService(clock,now);
  if(!Number.isFinite(expected))return;
  const diff=expected-now;
  // Gdy GPS nadal wskazuje ten przystanek, godzina w przeszlosci
  // nie oznacza odjazdu: odliczanie pozostaje <1 min.
  const atCurrent=!!progress&&index===progress.next;
  if(diff<0&&!atCurrent&&!status?.approaching&&!status?.atStop){badge?.remove();return;}
  if(!badge){badge=document.createElement('span');badge.className='wtp-list-countdown';row.prepend(badge);}
  const approaching=!!status?.approaching&&diff<1;
  badge.textContent=approaching?'>>>':diff<1?'<1 min':Math.ceil(diff)+' min';
  badge.classList.toggle('wtp-list-approaching-blink',approaching);
  const planMin=wtpClockNearService(planClock,now);
  const deviation=Number.isFinite(planMin)?expected-planMin:0;
  badge.style.setProperty('color',!active?'#9299a0':deviation>=1?'#cf271e':deviation<=-1?'#1976d2':'#168044','important');
  if(!live){cell.classList.toggle('wtp-v253-active-schedule',active);cell.classList.toggle('wtp-v248-scheduled',!active);}
  cell.style.setProperty('font-weight',active?'750':'400','important');
 });
}

function wtpRefreshCourseStopTimes(){
 if(!map||!wtpCourseMapLayer||!map.hasLayer(wtpCourseMapLayer)){
  wtpRefreshListCountdowns();return;
 }
 // v251: najpierw jeden stan przejazdu GPS dla listy i mapy.
 wtpSyncPanelPassedStops();
 wtpScrollInitialCourse($('vehicleBody'),$('vehicleBody')?.querySelector('ol.route-stops'));
 wtpRefreshPendingForecasts();
 const nowDate=new Date();
 const now=nowWarsaw(nowDate);
 const nowSeconds=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',second:'2-digit'}).format(nowDate));
 const nowPrecise=now+nowSeconds/60;
 const progress=wtpRouteProgress();
 const rows=$('vehicleBody')?.querySelectorAll('ol.route-stops > li.route-stop[data-route-stop-index]')||[];
 const rowByIndex=new Map([...rows].map(row=>[Number(row.dataset.routeStopIndex),row]));
 const saved=progress?wtpConfirmedPassedByCourse.get(progress.key):null;
 for(const item of wtpActiveCourseStopMarkers){
  const tooltip=item.marker.getTooltip()?.getElement();
  const el=tooltip?.querySelector('.wtp-course-stop-eta[data-expected-minutes]');
  const row=rowByIndex.get(item.index);
  const expected=el?Number(el.dataset.expectedMinutes):NaN;
  const status=wtpCourseStopStatus(item.index,item.coords,expected,progress);
  const isTerminal=item.index===wtpActiveCourseStopMarkers.at(-1)?.index;
  const passedByGps=!isTerminal&&(!!saved?.has(item.index)||!!status.passed);
  const passedByServer=!!row?.dataset.wtpConfirmedDeparture&&wtpStopPassedUnified(item.index,progress,row);
  const passed=progress?passedByGps:wtpStopPassedUnified(item.index,progress,row);
  if(passed&&row)row.dataset.wtpV251Passed='1';
  if(passed&&progress){
   let set=wtpConfirmedPassedByCourse.get(progress.key);
   if(!set){set=new Set();wtpConfirmedPassedByCourse.set(progress.key,set);}
   set.add(item.index);
  }
  item.marker.options.wtpPassed=passed;
  tooltip?.classList.toggle('wtp-map-stop-passed',passed);
  tooltip?.setAttribute('data-passed',passed?'1':'0');
  if(row){
   row.classList.toggle('passed',passed);
   row.classList.toggle('wtp-server-passed',passed);
   if(passed){
    row.classList.remove('wtp-next-row','wtp-live-next','wtp-at-stop');
    row.querySelector(':scope > .wtp-list-countdown')?.remove();
   }
  }
  if(!el)continue;
  if(!Number.isFinite(expected))continue;
  const planned=el.dataset.planned||'';
  const listCell=row?.querySelector('.route-stop-time');
  const listLive=listCell?.querySelector('.wtp-server-actual,.wtp-server-forecast,.wtp-estimated-time');
  const liveClock=listLive?.textContent?.trim();
  const fallbackClock=el.dataset.expected||'';
  // v254: gdy aktualna ETA nie zawiera opóźnienia, nie trzymaj historycznej
  // prognozy wyłącznie z wcześniej wyrenderowanej chmurki.
  const plainClock=listCell?.textContent?.trim();
  const currentClock=/^\d{1,2}:\d{2}$/.test(liveClock||'')?liveClock:/^\d{1,2}:\d{2}$/.test(plainClock||'')?plainClock:fallbackClock;
  const currentMinutes=wtpClockNearService(currentClock,expected);
  // v254: nie zachowuj starej prognozy z dymka, jeśli lista ma już aktualną godzinę.
  const displayExpected=Number.isFinite(currentMinutes)?currentMinutes:expected;
  const diff=displayExpected-nowPrecise;
  const plannedMinutes=wtpClockNearService(planned,displayExpected);
  const delta=Number.isFinite(plannedMinutes)?displayExpected-plannedMinutes:Number(el.dataset.delta||0);
  const delayed=!!planned&&!!currentClock&&Math.abs(delta)>=0.5;
  el.classList.toggle('wtp-early',delayed&&delta<0);
  el.classList.toggle('wtp-late',delayed&&delta>0);
  const onTime=status.gpsFresh&&!delayed&&(passed||status.approaching||status.atStop);
  const confirmedClock=passedByServer?row?.dataset.wtpActualClock:null;
  const clock=delayed?'<s>'+escapeHTML(planned)+'</s> <b class="'+(delta<0?'wtp-time-early':'wtp-time-late')+'">'+escapeHTML(currentClock)+'</b>':
   '<span class="'+(onTime?'wtp-on-time':'')+'">'+escapeHTML(currentClock)+'</span>';
  const departedTime=confirmedClock||currentClock;
  const departedClock=planned&&departedTime&&planned!==departedTime?
   '<s>'+escapeHTML(planned)+'</s> <b>'+escapeHTML(departedTime)+'</b>':escapeHTML(departedTime||planned);
  // v254: >>> musi pojawiać się jednocześnie w chmurce i na liście.
  const remaining=diff<1?'&lt;1 min':Math.ceil(diff)+' min';
  const text=passed?'Odjechał':status.approaching&&diff<1?'&gt;&gt;&gt;':diff>=1?'Za '+Math.ceil(diff)+' min':'&lt;1 min';
  const html=text+' · '+(passed?departedClock:clock);
  const rendered=status.approaching&&diff<1&&!passed?
   html.replace('&gt;&gt;&gt;','<span class="wtp-map-approaching-blink">&gt;&gt;&gt;</span>'):html;
  if(el.innerHTML!==rendered)el.innerHTML=rendered;
  if(row){
   // v253: kolor planowej godziny aktywnego, dopasowanego kursu
   // uaktualnia się natychmiast po GPS. Czerwone/niebieskie prognozy
   // pozostają nadrzędne; zielony nie oznacza tu potwierdzonej punktualności.
   if(listCell){
    const liveForecast=!!listCell.querySelector('.wtp-server-forecast,.wtp-estimated-time,.wtp-server-actual');
    const gpsMatched=!!status.gpsFresh&&!!progress&&!!progress.stops?.some(st=>st.index===item.index);
    listCell.classList.toggle('wtp-v253-active-schedule',!passed&&!liveForecast&&gpsMatched);
    if(!liveForecast&&gpsMatched)listCell.title='Aktywny kurs GPS; wyświetlana godzina rozkładowa (brak osobnej prognozy)';
   }
   let badge=row.querySelector(':scope > .wtp-list-countdown');
   if(passed){badge?.remove();continue;}
   // Nie odliczaj z przeszłego planu. Przy świeżym GPS i braku
   // potwierdzenia przejazdu przystanek nadal jest przed pojazdem.
   const show=Number.isFinite(diff)&&(diff>=0||status.approaching||status.atStop);
   if(show){
    if(!badge){badge=document.createElement('span');badge.className='wtp-list-countdown';row.prepend(badge);}
    const value=status.approaching&&diff<1?'>>>':diff<1?'<1 min':Math.ceil(diff)+' min';
    if(badge.textContent!==value)badge.textContent=value;
    badge.classList.toggle('wtp-list-approaching-blink',!!status.approaching&&diff<1);
    const color=!status.gpsFresh?'#9299a0':delta>=1?'#cf271e':delta<=-1?'#1976d2':'#168044';
    badge.style.setProperty('color',color,'important');
    if(listCell&&!listLive){
     listCell.classList.toggle('wtp-v248-on-time',onTime);
     listCell.classList.toggle('wtp-v248-scheduled',!onTime&&!status.gpsFresh);
    }
   }else{badge?.remove();}
  }
 }
 // Drugi przebieg: po ustaleniu minięć przesuń napis i ikonę
 // w tym samym odświeżeniu, a nie dopiero po kolejnym cyklu.
 wtpSyncPanelPassedStops();
 wtpRefreshListCountdowns(progress);
 wtpScheduleCourseLabelLayout();
}

function wtpFocusRouteStop(index,row){
 if(!map)return;
 const coords=wtpRouteStopCoords.get(index);
 if(!coords)return;
 document.querySelectorAll('#vehicleBody .route-stop.wtp-hovered-stop').forEach(el=>el.classList.remove('wtp-hovered-stop'));
 row?.classList.add('wtp-hovered-stop');
 // Wyróżnienie wyłącznie w liście; na mapie pozostaje zwykła kropka przystanku.
 if(wtpHoveredRouteStop){map.removeLayer(wtpHoveredRouteStop);wtpHoveredRouteStop=null;}
 const targetZoom=Math.max(16,map.getZoom());
 // Punkt na środku WIDOCZNEJ części mapy, a nie pod dolnym panelem.
 const panel=$('vehiclePanel');const rect=panel?.getBoundingClientRect();
 const mapRect=map.getContainer().getBoundingClientRect();
 const overlap=rect?Math.max(0,Math.min(mapRect.bottom,rect.bottom)-Math.max(mapRect.top,rect.top)):0;
 const offset=overlap/2;
 const projected=map.project(coords,targetZoom);
 const target=map.unproject([projected.x,projected.y+offset],targetZoom);
 wtpMapUserExploring=true;map.flyTo(target,targetZoom,{animate:true,duration:.45});
}
let vehiclePanelRequest=0;
const etaPanelMatches=new Map();
const etaPanelReady=new Map();
// v285: all scheduled lines, independent of map bounds and active vehicles.
const wtpLineWarm=new Map(),wtpLineData=new Map(),wtpWarmBusy=new Set();
let wtpNetworkLines=[],wtpManifestAt=0,wtpManifestBusy=false,wtpRevision='';
function wtpWarmIdentity(v){return todayWarsaw()+'|'+v.Lines+'|'+normalizeBrigade(v.Brigade)}
const wtpLineRequests=new Map();
async function wtpWarmLine(line, staged){
 line=String(line).trim();
 let task=wtpLineRequests.get(line);
 if(!task){
  wtpWarmBusy.add(line);
  task=(async()=>{
   const [pack,gtfs,catalog]=await Promise.all([request('/eta/courses',{line,bundle:'prepared'}),loadGtfs(line).catch(()=>null),wtpLoadShapeCatalog(line)]);
   if(!pack?.details||!pack?.geometry_refs||!Array.isArray(pack.courses))throw Error('Niepełny pakiet');
   pack.trips=gtfs?.trips||[];pack.catalog=catalog;
   return pack;
  })();
  wtpLineRequests.set(line,task);
  task.finally(()=>{wtpLineRequests.delete(line);wtpWarmBusy.delete(line);}).catch(()=>{});
 }
 try{const pack=await task;staged.set(line,pack);return pack;}catch(e){console.warn('ETA przygotowanie',line,e.message);return null;}
}
const wtpBrigadeRequests=new Map(),wtpBrigadeData=new Map();
async function wtpGetBrigade(v){
 const line=String(v.Lines).trim(),brigade=normalizeBrigade(v.Brigade),key=wtpWarmIdentity(v);
 const full=wtpLineData.get(line);
 if(full?.courses?.some(c=>normalizeBrigade(c.brigade)===brigade))return full;
 const cached=wtpBrigadeData.get(key);
 if(cached&&cached.revision===wtpRevision)return cached.pack;
 if(!wtpBrigadeRequests.has(key)){
  const revision=wtpRevision;
  const job=(async()=>{
   const [pack,gtfs,catalog]=await Promise.all([request('/eta/courses',{line,brigade,bundle:'prepared'}),loadGtfs(line).catch(()=>null),wtpLoadShapeCatalog(line)]);
   if(!pack?.details||!pack?.geometry_refs||!pack.courses?.length)throw Error('Brak kursów brygady '+line+'/'+brigade);
   pack.trips=gtfs?.trips||[];pack.catalog=catalog;
   wtpBrigadeData.set(key,{pack,revision});return pack;
  })();
  wtpBrigadeRequests.set(key,job);job.finally(()=>wtpBrigadeRequests.delete(key)).catch(()=>{});
 }
 return wtpBrigadeRequests.get(key);
}
async function wtpMatchPrepared(v,pack){
 const match=await etaMatchVehicle(v,pack.trips,pack);match.preparedPack=pack;return match;
}
let wtpWarmRunning=false;
async function wtpWarmSchedules(){
 if(wtpWarmRunning)return;wtpWarmRunning=true;
 try{
  if(Date.now()-wtpManifestAt>5000){
   const data=await request('/eta/courses',{line:'network',bundle:'network'});
   wtpManifestAt=Date.now();wtpRevision=data.revision;wtpNetworkLines=Array.isArray(data.ready)?data.ready:[];
  }
  const active=new Set(vehicles.map(v=>String(v.Lines)));
  const pending=wtpNetworkLines.filter(l=>wtpLineWarm.get(l)!==wtpRevision&&!wtpWarmBusy.has(l)).sort((a,b)=>Number(active.has(b))-Number(active.has(a)));
  // Every line is downloaded; workers limit transport load, not coverage.
  const revision=wtpRevision;
  await Promise.all(Array.from({length:Math.min(8,pending.length)},async()=>{while(pending.length){
   const index=pending.findIndex(l=>vehicles.some(v=>String(v.Lines).trim()===l));
   const line=pending.splice(index<0?0:index,1)[0], staged=new Map();
   await wtpWarmLine(line,staged);
   if(staged.has(line)&&revision===wtpRevision){wtpLineData.set(line,staged.get(line));wtpLineWarm.set(line,revision);}
  }}));
 }catch(e){console.warn('ETA network',e.message)}finally{wtpWarmRunning=false;}
}
setInterval(wtpWarmSchedules,1000);
let wtpVehicleWarmRunning=false;
async function wtpWarmVehicles(){
 if(wtpVehicleWarmRunning)return;wtpVehicleWarmRunning=true;
 try{
  for(const v of [...vehicles].sort((a,b)=>Number(!!focusedVehicle&&vehicleKey(b)===vehicleKey(focusedVehicle))-Number(!!focusedVehicle&&vehicleKey(a)===vehicleKey(focusedVehicle)))){
   const k=vehicleKey(v),pack=wtpLineData.get(String(v.Lines).trim()),old=etaPanelReady.get(k);
   if(!v.Brigade)continue;
   if(old?.identity===wtpWarmIdentity(v)&&(!pack||old.pack===pack)){
    const evidence=wtpTerminalArrivalEvidence.get(k);
    if(old.gps!==v.Time||evidence&&Date.now()-evidence.firstSeenAt>=5000){
     chooseLiveEtaCourse(old.match,v,old.trips);old.gps=v.Time;
    }
    continue;
   }
   if(!pack)continue;
   try{
    const match=await wtpMatchPrepared(v,pack);
    match.initialTerminalCheck=!old;
    chooseLiveEtaCourse(match,v,pack.trips);
    const entry={match,trips:pack.trips,pack,at:Date.now(),identity:wtpWarmIdentity(v),gps:v.Time};
    etaPanelReady.set(k,entry);etaPanelMatches.set(k,entry);
   }catch(e){console.warn('ETA dopasowanie',v.Lines,v.Brigade,e.message);}
   await new Promise(resolve=>setTimeout(resolve,0));
  }

 }finally{wtpVehicleWarmRunning=false;}
}
setInterval(wtpWarmVehicles,500);
let wtpBrigadeWarmRunning=false;
async function wtpWarmActiveBrigades(){
 if(wtpBrigadeWarmRunning)return;wtpBrigadeWarmRunning=true;
 try{
  const pending=vehicles.filter(v=>v.Brigade&&!wtpLineData.has(String(v.Lines).trim())&&!etaPanelReady.has(vehicleKey(v)));
  const unique=[...new Map(pending.map(v=>[wtpWarmIdentity(v),v])).values()];
  await Promise.all(Array.from({length:Math.min(3,unique.length)},async()=>{while(unique.length){const v=unique.shift();try{const pack=await wtpGetBrigade(v),match=await wtpMatchPrepared(v,pack);match.initialTerminalCheck=true;chooseLiveEtaCourse(match,v,pack.trips);const entry={match,trips:pack.trips,pack,at:Date.now(),identity:wtpWarmIdentity(v),gps:v.Time};etaPanelReady.set(vehicleKey(v),entry);etaPanelMatches.set(vehicleKey(v),entry);}catch(e){console.debug('ETA brygada',v.Lines,v.Brigade,e.message);}}}));
 }finally{wtpBrigadeWarmRunning=false;}
}
setInterval(wtpWarmActiveBrigades,1500);
let wtpStateBusy=false;
setInterval(async()=>{
 const v=focusedVehicle;if(!v||wtpStateBusy)return;
 wtpStateBusy=true;
 try{const [state]=await Promise.all([wtpLoadVehicleState(v),fetchServerGps(v).catch(()=>null)]);
 const entry=etaPanelReady.get(vehicleKey(v));if(entry)entry.state=state;
 if(entry&&focusedVehicle&&vehicleKey(focusedVehicle)===vehicleKey(v)){wtpApplyServerState($('vehicleBody'),state,entry.match.selected);wtpRefreshCourseStopTimes();}
 }finally{wtpStateBusy=false;}
},3000);

// v270: jedna operacja ładowania panelu na pojazd; ponowne odświeżenie
// w czasie pobierania nie tworzy kolejnych żądań ani komunikatów.
const wtpPanelInFlight=new Map();
let wtpClickSerial=0;
let wtpPendingSelection=null;
function openVehiclePanel(v,options={}){
 const key=vehicleKey(v);
 const pending=wtpPanelInFlight.get(key);
 if(pending)return pending;
 const task=Promise.resolve().then(()=>openVehiclePanelImpl(v,options));
 wtpPanelInFlight.set(key,task);
 void task.finally(()=>{if(wtpPanelInFlight.get(key)===task)wtpPanelInFlight.delete(key)}).catch(()=>{});
 return task;
}
async function openVehiclePanelImpl(v,options={}){
 let ready=etaPanelReady.get(vehicleKey(v));
 const click=++wtpClickSerial;
 if(!options.retry) wtpPendingSelection=null;
 if(!ready||ready.identity!==wtpWarmIdentity(v)){
  const line=String(v.Lines).trim();
  const panel=$('vehiclePanel'),body=$('vehicleBody');
  if(!focusedVehicle||vehicleKey(focusedVehicle)!==vehicleKey(v)){wtpClearCourseMap();body.replaceChildren();focusedVehicle={...v};}
  panel.hidden=false;
  $('vehicleHeading').textContent=`${v.Lines} · ${v.kind===2?'Tramwaj':'Autobus'} · brygada ${v.Brigade} · tabor ${v.VehicleNumber}`;
  wtpPendingSelection=v;
  try{
   let pack=wtpLineData.get(line);
   let match;
   if(pack){try{match=await wtpMatchPrepared(v,pack);}catch(e){console.warn('ETA pełna linia',line,e.message);}}
   if(!match){pack=await wtpGetBrigade(v);match=await wtpMatchPrepared(v,pack);}
   if(click!==wtpClickSerial)return;
   match.initialTerminalCheck=true;chooseLiveEtaCourse(match,v,pack.trips);
   ready={match,trips:pack.trips,pack,at:Date.now(),identity:wtpWarmIdentity(v),gps:v.Time};
   etaPanelReady.set(vehicleKey(v),ready);etaPanelMatches.set(vehicleKey(v),ready);
  }catch(e){console.warn('ETA panel',e.message);return;}
 }
 if(click!==wtpClickSerial||$('vehiclePanel').hidden&&wtpPendingSelection)return;
 const sameVehicle=focusedVehicle&&vehicleKey(focusedVehicle)===vehicleKey(v);
 focusedVehicle={...v};wtpSelectedVehicleOnly=true;renderStopMarkers();draw();
 const serial=++vehiclePanelRequest,panel=$('vehiclePanel'),body=$('vehicleBody');panel.hidden=false;
 document.getElementById('mapFilters')?.classList.remove('wtp-mobile-open');
 const toggle=document.getElementById('mobileFilters');if(toggle){toggle.setAttribute('aria-expanded','false');toggle.textContent='Filtry mapy';}
 $('vehicleHeading').textContent=`${v.Lines} · ${v.kind===2?'Tramwaj':'Autobus'} · brygada ${v.Brigade} · tabor ${v.VehicleNumber}`;
 if(!sameVehicle){wtpClearCourseMap();body.replaceChildren();delete body.dataset.wtpAutoScrolledCourse;body.scrollTop=0;}
 const matched=ready.match;
 chooseLiveEtaCourse(matched,v,ready.trips);
 const previousRendered=body.querySelector('ol.route-stops')?.dataset.wtpCourseId;
 const changedCourse=previousRendered!==String(matched.selected?.course?.course_id);
 if(changedCourse)delete body.dataset.wtpAutoScrolledCourse;
 try{renderEtaRoute(matched,v,body,ready.trips);}catch(e){console.error("ETA render",v.Lines,v.Brigade,e);etaPanelReady.delete(vehicleKey(v));wtpPendingSelection=v;return;}
 wtpPendingSelection=null;
 if(!changedCourse&&Number.isFinite(options.keepScroll))body.scrollTop=options.keepScroll;
 void wtpShowCourseMap(matched,v,serial,ready.trips);
 if(ready.state)wtpApplyServerState(body,ready.state,matched.selected);
}
setInterval(()=>{const v=wtpPendingSelection;if(v&&!$('vehiclePanel').hidden&&focusedVehicle&&vehicleKey(focusedVehicle)===vehicleKey(v)&&!wtpPanelInFlight.has(vehicleKey(v)))void openVehiclePanel(vehicles.find(x=>vehicleKey(x)===vehicleKey(v))||v,{retry:true});},2000);
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
 focusedVehicle=null;wtpSelectedVehicleOnly=false;wtpClearCourseMap();renderStopMarkers();
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

window.addEventListener('DOMContentLoaded',()=>{const mobileToggle=$('mobileFilters');if(mobileToggle){mobileToggle.onclick=()=>{const panel=document.querySelector('#mapa > aside');const open=panel?.classList.toggle('wtp-mobile-open');mobileToggle.setAttribute('aria-expanded',String(!!open));mobileToggle.textContent=open?'Zamknij filtry':'Filtry mapy';setTimeout(()=>map?.invalidateSize(),100);};}if(typeof L!=='undefined'){map=L.map('map').setView([52.2297,21.0122],11);map.createPane('stopsPane');map.getPane('stopsPane').style.zIndex='410';map.createPane('vehiclesPane');map.getPane('vehiclesPane').style.zIndex='650';map.createPane('wtpCourseTooltipsPane');map.getPane('wtpCourseTooltipsPane').style.zIndex='720';map.getPane('wtpCourseTooltipsPane').style.pointerEvents='none';L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layer=L.layerGroup().addTo(map);stopLayer=L.layerGroup().addTo(map);map.on('moveend',()=>{wtpUpdateZoomVisibility();renderStopMarkers();draw()});map.on('zoomend',()=>{wtpUpdateZoomVisibility();renderStopMarkers();wtpUpdateCourseLabelZoom();wtpScheduleCourseLabelLayout()});map.on('moveend',wtpScheduleCourseLabelLayout);map.on('resize',wtpScheduleCourseLabelLayout);wtpUpdateZoomVisibility();map.on('click',()=>{if(!$('vehiclePanel').hidden){wtpClickSerial++;wtpPendingSelection=null;stopPaneRequest++;vehiclePanelRequest++;$('vehiclePanel').hidden=true;focusedVehicle=null;wtpSelectedVehicleOnly=false;wtpClearCourseMap();renderStopMarkers();hoveredStopLine='';draw();}})}else{$('status').textContent='Nie udało się załadować biblioteki mapy Leaflet.'}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));window.addEventListener('popstate',()=>setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false));setTab(location.hash==='#odjazdy'?'odjazdy':'mapa',false);$('closeVehicle').onclick=()=>{wtpClickSerial++;wtpPendingSelection=null;vehiclePanelRequest++;stopPaneRequest++;hoveredStopLine='';pinnedStopLine='';pinnedStopVehicle=null;$('vehiclePanel').hidden=true;focusedVehicle=null;wtpSelectedVehicleOnly=false;wtpClearCourseMap();renderStopMarkers();draw()};$('refresh').onclick=refresh;$('showStops').checked=true;$('showStops').onchange=toggleStopMap;setTimeout(toggleStopMap,3000);for(const id of ['line','bus','tram'])$(id).addEventListener(id==='line'?'input':'change',draw);$('find').onclick=searchStops;$('stop').onkeydown=e=>{if(e.key==='Enter')searchStops()};if(PROXY){publishVehicles();$('status').textContent='Łączenie z API Warszawy…';refresh()}else $('status').textContent='Brak adresu Workera w config.js.';setInterval(()=>{
 if(document.hidden)return;
 wtpRefreshCourseStopTimes();
 const v=focusedVehicle,ready=v&&etaPanelReady.get(vehicleKey(v));
 if(!v||$('vehiclePanel')?.hidden||!ready?.match||!ready?.trips)return;
 const before=String(ready.match.selected?.course?.course_id||'');
 chooseLiveEtaCourse(ready.match,v,ready.trips);
 const after=String(ready.match.selected?.course?.course_id||'');
 if(after&&$('vehicleBody')?.querySelector('ol.route-stops')?.dataset.wtpCourseId!==after){
  etaPanelMatches.delete(vehicleKey(v));
  void openVehiclePanel(v);
 }
},1000);setInterval(()=>{if(PROXY && !document.hidden){refresh();wtpRefreshCourseStopTimes()}},2000)});

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
// v100: usuń trasę po zamknięciu panelu, także gdy panel jest zamykany innym przyciskiem.
const wtpPanelObserver=new MutationObserver(()=>{if($('vehiclePanel')?.hidden){wtpClearCourseMap();wtpLabelConnectors?.remove();wtpLabelConnectors=null;}});
if($('vehiclePanel'))wtpPanelObserver.observe($('vehiclePanel'),{attributes:true,attributeFilter:['hidden']});


// v149: ręczne przesuwanie górnej krawędzi panelu rozkładu.
function wtpInstallPanelResize(){
 const panel=document.getElementById('vehiclePanel');if(!panel||panel.querySelector('.wtp-panel-grip'))return;
 const grip=document.createElement('div');grip.className='wtp-panel-grip';grip.title='Przeciągnij, aby zmienić wysokość rozkładu';grip.setAttribute('role','separator');grip.setAttribute('aria-label','Zmień wysokość panelu rozkładu');
 panel.prepend(grip);let startY=0,startH=0;
 grip.addEventListener('pointerdown',e=>{if(e.button!==0)return;startY=e.clientY;startH=panel.getBoundingClientRect().height;grip.setPointerCapture(e.pointerId);e.preventDefault();});
 grip.addEventListener('pointermove',e=>{if(!grip.hasPointerCapture(e.pointerId))return;const max=Math.max(180,window.innerHeight-36);const height=Math.max(140,Math.min(max,startH+startY-e.clientY));panel.style.setProperty('height',height+'px','important');panel.style.setProperty('max-height',max+'px','important');panel.style.setProperty('top','auto','important');panel.style.setProperty('bottom','0px','important');map?.invalidateSize();});
 grip.addEventListener('pointerup',e=>{if(grip.hasPointerCapture(e.pointerId))grip.releasePointerCapture(e.pointerId);});
 grip.addEventListener('pointercancel',e=>{if(grip.hasPointerCapture(e.pointerId))grip.releasePointerCapture(e.pointerId);});
}
window.addEventListener('DOMContentLoaded',wtpInstallPanelResize);

// WTP LIVE v167: niezależny od wersji style.css zestaw korekt panelu.
(function(){
 const style=document.createElement("style");style.id="wtp-v168-layout";style.textContent='/* WTP LIVE v168 — układ wiersza i szara oś przejazdu technicznego */\n#vehicleBody .route-stops > li.route-stop .wtp-route-stop-text{\n display:flex!important;flex-direction:row!important;align-items:center!important;\n flex-wrap:nowrap!important;gap:8px!important;min-width:0!important;\n flex:1 1 auto!important;max-width:none!important;width:auto!important;\n}\n#vehicleBody .route-stops > li.route-stop .route-stop-name{\n display:inline-block!important;flex:0 0 auto!important;min-width:0!important;\n white-space:nowrap!important;overflow-wrap:normal!important;word-break:normal!important;\n}\n#vehicleBody .route-stops > li.route-stop .wtp-stop-number,\n#vehicleBody .route-stops > li.route-stop .wtp-stop-role{\n display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;\n align-self:center!important;margin:0!important;line-height:1.25!important;\n white-space:nowrap!important;vertical-align:middle!important;\n}\n#vehicleBody .route-stops > li.route-stop .route-stop-time{\n flex:0 0 68px!important;min-width:68px!important;margin-left:auto!important;\n}\n/* Pseudo-element ::before jest pionową osią przechodzącą przez kropkę. */\n#vehicleBody .route-stops > li.route-stop.wtp-tech-middle::before{\n background:#858b92!important;\n}\n#vehicleBody .route-stops > li.route-stop.wtp-tech-start::before{\n background:linear-gradient(to bottom,var(--route-color,#820082) 0%,var(--route-color,#820082) 50%,#858b92 50%,#858b92 100%)!important;\n}\n#vehicleBody .route-stops > li.route-stop.wtp-tech-end::before{\n background:linear-gradient(to bottom,#858b92 0%,#858b92 50%,var(--route-color,#820082) 50%,var(--route-color,#820082) 100%)!important;\n}\n/* Odcinek techniczny również na kropkach, ale NŻ pozostaje puste. */\n#vehicleBody .route-stops > li.route-stop.wtp-tech-middle .route-dot,\n#vehicleBody .route-stops > li.route-stop.wtp-tech-start .route-dot,\n#vehicleBody .route-stops > li.route-stop.wtp-tech-end .route-dot{\n border-color:#858b92!important;\n}\n@media(max-width:700px){\n #vehicleBody .route-stops > li.route-stop .wtp-route-stop-text{gap:5px!important;}\n #vehicleBody .route-stops > li.route-stop .wtp-stop-role{font-size:10px!important;}\n}\n';
 style.textContent += `
 /* v246: wiersz bez marginesów; jedna współrzędna środka osi. */
 #vehicleBody ol.route-stops{
  padding-left:0!important;margin-left:0!important;margin-right:0!important;
 }
 #vehicleBody ol.route-stops > li.route-stop{
  margin-left:-20px!important;margin-right:-20px!important;
  width:calc(100% + 40px)!important;max-width:none!important;
  --wtp-row-axis:75px;
  padding-left:92px!important;padding-right:20px!important;
  box-sizing:border-box!important;border-left:0!important;
  box-shadow:none!important;
 }
 /* Środek linii 4 px i kropki 13 px wyliczany z tej samej osi. */
 #vehicleBody ol.route-stops > li.route-stop::before{
  left:calc(var(--wtp-row-axis) - 2px)!important;width:4px!important;
 }
 #vehicleBody ol.route-stops > li.route-stop .route-dot{
  left:calc(var(--wtp-row-axis) - 6.5px)!important;width:13px!important;height:13px!important;box-sizing:border-box!important;
 }
 /* v248: te same barwy dla minut i godzin, bez zmiany wymiarów. */
 /* v253: aktywna godzina planowa ma zielony kolor, ale nie jest prognozą. */
 #vehicleBody ol.route-stops > li.route-stop:not(.passed):not(.wtp-server-passed) .route-stop-time.wtp-v253-active-schedule:not(:has(.wtp-server-forecast,.wtp-estimated-time,.wtp-server-actual)){color:#168044!important;}
 #vehicleBody ol.route-stops > li.route-stop:not(.passed):not(.wtp-server-passed) .route-stop-time.wtp-v248-on-time{color:#168044!important;}
 #vehicleBody ol.route-stops > li.route-stop:not(.passed):not(.wtp-server-passed) .route-stop-time.wtp-v248-scheduled:not(.wtp-gps-assigned):not(.wtp-gps-matched-schedule){color:#9299a0!important;}
 #vehicleBody ol.route-stops > li.route-stop .wtp-list-countdown{
  position:absolute!important;left:15px!important;width:43px!important;
  top:50%!important;transform:translateY(-50%)!important;
  text-align:right!important;white-space:nowrap!important;
  font-size:14px!important;font-weight:800!important;line-height:1.2!important;
  color:#9299a0;pointer-events:none!important;z-index:4!important;
 }
 #vehicleBody ol.route-stops > li.route-stop:hover,
 #vehicleBody ol.route-stops > li.route-stop.wtp-hovered-stop,
 #vehicleBody ol.route-stops > li.route-stop:focus-visible{
  background:#e7eaed!important;box-shadow:none!important;
 }
 #vehicleBody ol.route-stops > .wtp-vehicle-on-route{left:55px!important;}
 @media(max-width:700px){
  #vehicleBody ol.route-stops > li.route-stop{
   margin-left:-12px!important;margin-right:-12px!important;
   width:calc(100% + 24px)!important;padding-right:12px!important;
  }
  #vehicleBody ol.route-stops > .wtp-vehicle-on-route{left:63px!important;}
 }
 #vehicleBody ol.route-stops > li.route-stop .wtp-list-approaching-blink{
  animation:wtp-v240-chevron-blink .75s steps(1,end) infinite!important;
 }
 /* v240: dymki używają zieleni jak panel, także dla planowej godziny GPS. */
 .leaflet-tooltip-top.wtp-course-stop-name::before{
  left:calc(50% + var(--wtp-arrow-shift,0px))!important;
  margin-left:-6px!important;
 }
 .leaflet-tooltip-bottom.wtp-course-stop-name::before{
  left:calc(50% + var(--wtp-arrow-shift,0px))!important;
  margin-left:-6px!important;
 }
 .leaflet-tooltip-left.wtp-course-stop-name::before,
 .leaflet-tooltip-right.wtp-course-stop-name::before{
  top:calc(50% + var(--wtp-arrow-shift,0px))!important;
  margin-top:-6px!important;
 }
 /* v264: grot Leaflet dziedziczy dokładnie kolor ramki dla każdej strony. */
 .leaflet-tooltip-top.wtp-course-stop-name::before{border-top-color:currentColor!important;}
 .leaflet-tooltip-bottom.wtp-course-stop-name::before{border-bottom-color:currentColor!important;}
 .leaflet-tooltip-left.wtp-course-stop-name::before{border-left-color:currentColor!important;}
 .leaflet-tooltip-right.wtp-course-stop-name::before{border-right-color:currentColor!important;}
 .leaflet-tooltip.wtp-course-stop-name.wtp-map-stop-passed::before,
 .leaflet-tooltip.wtp-course-stop-name[data-passed="1"]::before{border-color:transparent!important;}
 .leaflet-tooltip-top.wtp-course-stop-name.wtp-map-stop-passed::before,
 .leaflet-tooltip-top.wtp-course-stop-name[data-passed="1"]::before{border-top-color:#bfc3c9!important;}
 .leaflet-tooltip-bottom.wtp-course-stop-name.wtp-map-stop-passed::before,
 .leaflet-tooltip-bottom.wtp-course-stop-name[data-passed="1"]::before{border-bottom-color:#bfc3c9!important;}
 .leaflet-tooltip-left.wtp-course-stop-name.wtp-map-stop-passed::before,
 .leaflet-tooltip-left.wtp-course-stop-name[data-passed="1"]::before{border-left-color:#bfc3c9!important;}
 .leaflet-tooltip-right.wtp-course-stop-name.wtp-map-stop-passed::before,
 .leaflet-tooltip-right.wtp-course-stop-name[data-passed="1"]::before{border-right-color:#bfc3c9!important;}
 .leaflet-tooltip.wtp-course-stop-name .wtp-course-stop-eta .wtp-on-time{
  color:#16834b!important;font-weight:800!important;
 }
 @keyframes wtp-v240-chevron-blink{0%,49%{opacity:1}50%,100%{opacity:.18}}
 .leaflet-tooltip.wtp-course-stop-name .wtp-map-approaching-blink{
  display:inline-block;animation:wtp-v240-chevron-blink 1s steps(1,end) infinite;
 }
 .wtp-course-stop-eta .wtp-time-early{color:#1976d2!important;}
 #vehicleBody .route-stop-time .wtp-time-early{color:#1976d2!important;}
 #vehicleBody .route-stops > li.route-stop.wtp-live-next .route-dot{
   outline:none!important;box-shadow:none!important;
 }
 #vehicleBody .route-stops > li.route-stop.wtp-live-next .route-dot::after{
   content:none!important;
 }
 #vehicleBody .route-stops > .wtp-live-next-label{
   position:absolute!important;z-index:8!important;
   color:#820082;font-size:11px;font-weight:750;white-space:nowrap;
   pointer-events:none;
 }


 #vehicleBody .wtp-near-stop-badge{display:none!important;}
 #vehicleBody .route-stop.wtp-at-stop .route-stop-name{font-weight:800!important}
 #vehicleBody .route-stops > li.route-stop.wtp-at-stop .route-stop-name{font-weight:800!important;color:#252d39!important}
 #vehicleBody .route-stops > li.route-stop.wtp-at-stop .route-dot{outline:none!important;box-shadow:none!important}
 #vehicleBody .route-stops > li.route-stop.wtp-at-stop .route-dot::after{content:none!important}
 #vehicleBody .route-stops > li.route-stop.wtp-at-stop{background:rgba(130,0,130,.035)!important}
 #vehicleBody .route-stops > .wtp-vehicle-on-route{
   z-index:10!important;pointer-events:none;
 }
 `;
 (document.head||document.documentElement).appendChild(style);
})();


// WTP LIVE v169: odcinek wys->ws: pierwszy punkt fioletowy, drugi szary.
// Zmiana koloru dotyczy osi między nimi, bez zmiany pozostałych przystanków.
(function(){
 const style=document.createElement('style');
 style.id='wtp-v169-technical-and-passed';
 style.textContent=`
 #vehicleBody .route-stops > li.route-stop.wtp-tech-start .route-dot{
   border-color:var(--route-color,#820082)!important;background:var(--route-color,#820082)!important;
 }
 #vehicleBody .route-stops > li.route-stop.wtp-tech-end .route-dot{
   border-color:#858b92!important;background:#858b92!important;
 }
 #vehicleBody .route-stops > li.route-stop.wtp-tech-start::before{
   background:linear-gradient(to bottom,#820082 0%,#820082 50%,#858b92 50%,#858b92 100%)!important;
 }
 #vehicleBody .route-stops > li.route-stop.wtp-tech-end::before{
   background:linear-gradient(to bottom,#858b92 0%,#858b92 50%,#820082 50%,#820082 100%)!important;
 }
 #vehicleBody .route-stops > li.route-stop.passed,
 #vehicleBody .route-stops > li.route-stop.wtp-server-passed{
   color:#929aa4!important;
 }
 #vehicleBody .route-stops > li.route-stop.passed .route-stop-name,
 #vehicleBody .route-stops > li.route-stop.passed .wtp-stop-number,
 #vehicleBody .route-stops > li.route-stop.passed .wtp-stop-role{
   color:#929aa4!important;
 }
 #vehicleBody .route-stops > li.route-stop{cursor:pointer}
 `;
 (document.head||document.documentElement).appendChild(style);
})();

// WTP LIVE v171: techniczny przejazd zaczyna się dokładnie w środku kropki "wys"
// i kończy w środku kropki "ws". Pseudoelement ::before ma własny kolor,
// dlatego ustawienie samego koloru kropek nie wystarczało.
(function(){
 const style=document.createElement('style');style.id='wtp-v171-axis-and-passed';
 style.textContent=`
 #vehicleBody .route-stops > li.route-stop.wtp-tech-start::before {
   background:linear-gradient(to bottom,var(--route-color,#820082) 0 50%,#858b92 50% 100%)!important;
 }
 #vehicleBody .route-stops > li.route-stop.wtp-tech-middle::before {
   background:#858b92!important;
 }
 #vehicleBody .route-stops > li.route-stop.wtp-tech-end::before {
   background:linear-gradient(to bottom,#858b92 0 50%,var(--route-color,#820082) 50% 100%)!important;
 }
 /* Koniec listy: żadnego fioletowego odcinka poniżej "ws". */
 #vehicleBody .route-stops > li.route-stop.wtp-tech-end:last-of-type::before {
   background:#858b92!important;
 }
 #vehicleBody .route-stops > li.route-stop.wtp-tech-start .route-dot {
   background:var(--route-color,#820082)!important;border-color:var(--route-color,#820082)!important;opacity:1!important;
 }
 #vehicleBody .route-stops > li.route-stop.wtp-tech-end .route-dot {
   background:#858b92!important;border-color:#858b92!important;opacity:1!important;
 }
 /* Minione: tekst i godziny szare, ale oś pozostaje w kolorze przebiegu. */
 #vehicleBody .route-stops > li.route-stop.passed .route-stop-name,
 #vehicleBody .route-stops > li.route-stop.passed .wtp-stop-number,
 #vehicleBody .route-stops > li.route-stop.passed .wtp-stop-role,
 #vehicleBody .route-stops > li.route-stop.passed .route-stop-time,
 #vehicleBody .route-stops > li.route-stop.passed .route-stop-time *,
 #vehicleBody .route-stops > li.route-stop.wtp-server-passed .route-stop-time,
 #vehicleBody .route-stops > li.route-stop.wtp-server-passed .route-stop-time * {
   color:#949ba4!important;
 }
 #vehicleBody .route-stops > li.route-stop.passed .route-stop-name {font-weight:400!important;}
 `;
 (document.head||document.documentElement).appendChild(style);
})();

/* WTP LIVE v174: barwa węzła wys jest barwą środka transportu. */
(function(){
 const style=document.createElement('style');
 style.id='wtp-v174-technical-colors';
 style.textContent=`
 .vehicle-panel .route-stops .route-stop.wtp-tech-start .route-dot {
   background:var(--route-color)!important;border-color:var(--route-color)!important;
 }
 .vehicle-panel .route-stops .route-stop.wtp-tech-end .route-dot {
   background:#858b92!important;border-color:#858b92!important;
 }
 .vehicle-panel .route-stops .route-stop.wtp-tech-start::before {
   background:linear-gradient(to bottom,var(--route-color) 0 50%,#858b92 50% 100%)!important;
 }
 .vehicle-panel .route-stops .route-stop.wtp-tech-end::before {
   background:linear-gradient(to bottom,#858b92 0 50%,var(--route-color) 50% 100%)!important;
 }
 `;document.head.appendChild(style);
})();

/* v279: oś dzielona w środku wiersza, niezależnie od koloru kropki. */
(function(){const style=document.createElement('style');style.id='wtp-v279-technical-axis';style.textContent=`
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-start::before,
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-end::before,
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-middle::before {
 top:0!important;bottom:0!important;height:auto!important;
}
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-start::before {background:linear-gradient(to bottom,var(--route-color) 0 50%,#858b92 50% 100%)!important;}
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-end::before {background:linear-gradient(to bottom,#858b92 0 50%,var(--route-color) 50% 100%)!important;}
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-middle::before {background:#858b92!important;}
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-start:first-of-type::before {top:50%!important;background:#858b92!important;}
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-end:last-of-type::before {bottom:50%!important;background:#858b92!important;}
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-node .route-dot {background:#858b92!important;border-color:#858b92!important;}
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-start:not(.wtp-tech-node) .route-dot,
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-end:not(.wtp-tech-node) .route-dot,
#vehicleBody ol.route-stops > li.route-stop.wtp-tech-middle:not(.wtp-tech-node) .route-dot,
#vehicleBody ol.route-stops > li.route-stop.wtp-passenger-node .route-dot {background:var(--route-color)!important;border-color:var(--route-color)!important;opacity:1!important;}
#vehicleBody ol.route-stops > li.route-stop.request-stop:not(.wtp-tech-node) .route-dot {background:#fff!important;}
`;document.head.appendChild(style);})();

(function(){const style=document.createElement('style');style.id='wtp-v294-colors';style.textContent=`
#vehicleBody .route-stops.kind-tram > .wtp-live-next-label,#vehicleBody .route-stops.kind-tram > .wtp-next-stop{color:#ec0000!important;}
#vehicleBody ol.route-stops.wtp-all-technical{--route-color:#858b92!important;}
#vehicleBody ol.route-stops.wtp-all-technical > li.route-stop::before{background:#858b92!important;}
#vehicleBody ol.route-stops.wtp-all-technical > li.route-stop .route-dot{background:#858b92!important;border-color:#858b92!important;}
#vehicleBody ol.route-stops.wtp-all-technical > .wtp-live-next-label,#vehicleBody ol.route-stops.wtp-all-technical > .wtp-next-stop{color:#858b92!important;}
.wtp-course-stop-name.wtp-course-technical{color:#858b92!important;border-color:#858b92!important;}
`;document.head.appendChild(style);})();

// v295: label coordinates refer to its bottom edge, just above the stop name.
(function(){const style=document.createElement('style');style.id='wtp-v295-next-label';style.textContent=`
#vehicleBody .route-stops > .wtp-live-next-label,#vehicleBody .route-stops > .wtp-next-stop {transform:translateY(-100%)!important;margin:0!important;line-height:12px!important;}
`;document.head.appendChild(style);})();
