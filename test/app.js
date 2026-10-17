const LIVE_RESOURCE="f2e5503e-927d-4ad3-9500-4ab9e55deb59";
const STOP_LIST_ID="ab75c33d-3a26-4342-b36a-6e5fef0a3ac3";
const STOP_LINES_ID="88cd555f-6f31-43ca-9de4-66c479ad5942";
const STOP_TIMES_ID="e923fa0e-d96c-43f9-ae6e-60518c9f3238";
const API="https://api.um.warszawa.pl/api/action/";

let apiKey="";
let vehicles=[];
let stops=[];
let refreshTimer=null;

const map=L.map("map").setView([52.2297,21.0122],11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
  maxZoom:19,
  attribution:"&copy; OpenStreetMap contributors"
}).addTo(map);
const markerLayer=L.layerGroup().addTo(map);

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}

function directValue(obj,key){
  if(!obj || typeof obj!=="object") return "";
  if(Object.prototype.hasOwnProperty.call(obj,key)) return obj[key];
  const real=Object.keys(obj).find(k=>k.toLowerCase()===key.toLowerCase());
  return real ? obj[real] : "";
}

function field(row,key){
  if(Array.isArray(row?.values)){
    const item=row.values.find(x=>String(x.key).toLowerCase()===key.toLowerCase());
    return item?.value ?? "";
  }
  return directValue(row,key);
}

function unwrap(data){
  const r=data?.result;
  if(Array.isArray(r)) return r;
  if(Array.isArray(r?.result)) return r.result;
  if(Array.isArray(r?.records)) return r.records;
  return [];
}

async function apiFetch(url){
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok) throw new Error("HTTP "+response.status);
  const json=await response.json();
  if(json?.error) throw new Error(typeof json.error==="string" ? json.error : "Błąd API");
  if(typeof json?.result==="string" && /klucz|error|błąd/i.test(json.result)) throw new Error(json.result);
  return json;
}

async function fetchLive(type){
  const url=API+"busestrams_get/?resource_id="+encodeURIComponent(LIVE_RESOURCE)
    +"&apikey="+encodeURIComponent(apiKey)+"&type="+type;
  return unwrap(await apiFetch(url)).map(v=>({...v,_type:type}));
}

function renderVehicles(){
  markerLayer.clearLayers();
  const filter=document.querySelector("#lineFilter").value.trim().toUpperCase();
  const bus=document.querySelector("#showBus").checked;
  const tram=document.querySelector("#showTram").checked;
  let shown=0;

  for(const v of vehicles){
    if(v._type===1 && !bus) continue;
    if(v._type===2 && !tram) continue;
    const line=String(directValue(v,"Lines")).trim().toUpperCase();
    if(filter && line!==filter) continue;

    const lat=Number(directValue(v,"Lat"));
    const lon=Number(directValue(v,"Lon"));
    if(!Number.isFinite(lat)||!Number.isFinite(lon)) continue;
    if(lat<51 || lat>53 || lon<19 || lon>23) continue;

    const icon=L.divIcon({
      className:"vehicle-marker"+(v._type===2?" tram":""),
      html:escapeHtml(line||"?"),
      iconSize:[32,32],
      iconAnchor:[16,16]
    });

    const marker=L.marker([lat,lon],{icon});
    const kind=v._type===1?"Autobus":"Tramwaj";
    marker.bindPopup(
      "<b>"+kind+" "+escapeHtml(line)+"</b><br>"+
      "Brygada: <b>"+escapeHtml(directValue(v,"Brigade"))+"</b><br>"+
      "Numer taborowy: <b>"+escapeHtml(directValue(v,"VehicleNumber"))+"</b><br>"+
      "Czas GPS: "+escapeHtml(directValue(v,"Time"))
    );
    marker.addTo(markerLayer);
    shown++;
  }

  document.querySelector("#stats").innerHTML=
    "Pobrano pojazdów: <b>"+vehicles.length+"</b><br>"+
    "Widocznych na mapie: <b>"+shown+"</b>";
}

async function refreshVehicles(){
  if(!apiKey) return;
  const status=document.querySelector("#status");
  status.textContent="Pobieranie pozycji pojazdów…";
  try{
    const [buses,trams]=await Promise.all([fetchLive(1),fetchLive(2)]);
    vehicles=[...buses,...trams];
    renderVehicles();
    status.textContent="Ostatnie pobranie: "+new Date().toLocaleTimeString("pl-PL");
  }catch(error){
    status.textContent="Nie udało się pobrać danych: "+error.message;
  }
}

document.querySelector("#keyForm").addEventListener("submit",event=>{
  event.preventDefault();
  apiKey=document.querySelector("#apiKey").value.trim();
  if(!apiKey) return;
  document.querySelector("#keyModal").classList.add("hidden");
  refreshVehicles();
  clearInterval(refreshTimer);
  refreshTimer=setInterval(refreshVehicles,10000);
});

document.querySelector("#refreshBtn").addEventListener("click",refreshVehicles);
document.querySelector("#lineFilter").addEventListener("input",renderVehicles);
document.querySelector("#showBus").addEventListener("change",renderVehicles);
document.querySelector("#showTram").addEventListener("change",renderVehicles);

document.querySelectorAll(".nav").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
    document.querySelector("#"+button.dataset.view).classList.add("active");
    if(button.dataset.view==="mapa") setTimeout(()=>map.invalidateSize(),50);
  });
});

async function loadStops(){
  if(stops.length) return stops;
  const url=API+"dbtimetable_get?id="+encodeURIComponent(STOP_LIST_ID)
    +"&apikey="+encodeURIComponent(apiKey);
  stops=unwrap(await apiFetch(url));
  return stops;
}

document.querySelector("#findStop").addEventListener("click",searchStops);
document.querySelector("#stopSearch").addEventListener("keydown",e=>{
  if(e.key==="Enter") searchStops();
});

async function searchStops(){
  const query=document.querySelector("#stopSearch").value.trim().toLowerCase();
  const output=document.querySelector("#stopResults");
  document.querySelector("#departures").innerHTML="";
  if(query.length<2){
    output.textContent="Wpisz co najmniej 2 znaki.";
    return;
  }
  output.textContent="Pobieranie listy przystanków…";
  try{
    const all=await loadStops();
    const found=all.filter(row=>
      String(field(row,"nazwa_zespolu")).toLowerCase().includes(query)
    ).slice(0,50);

    output.innerHTML="";
    if(!found.length){
      output.textContent="Brak pasujących przystanków.";
      return;
    }

    for(const row of found){
      const group=field(row,"zespol");
      const post=field(row,"slupek");
      const name=field(row,"nazwa_zespolu");
      const div=document.createElement("div");
      div.className="stop-result";
      div.innerHTML="<b>"+escapeHtml(name)+"</b> — "+escapeHtml(group)+" / "+escapeHtml(post);
      div.addEventListener("click",()=>showLines(group,post,name));
      output.appendChild(div);
    }
  }catch(error){
    output.textContent="Błąd pobierania przystanków: "+error.message;
  }
}

async function showLines(group,post,name){
  const output=document.querySelector("#departures");
  output.textContent="Pobieranie linii…";
  try{
    const url=API+"dbtimetable_get?id="+encodeURIComponent(STOP_LINES_ID)
      +"&busstopId="+encodeURIComponent(group)
      +"&busstopNr="+encodeURIComponent(post)
      +"&apikey="+encodeURIComponent(apiKey);
    const rows=unwrap(await apiFetch(url));
    const lines=[...new Set(rows.map(r=>field(r,"linia")||field(r,"line")).filter(Boolean))];

    output.innerHTML="<h2>"+escapeHtml(name)+" "+escapeHtml(post)+"</h2><p>Wybierz linię:</p>";
    const box=document.createElement("div");
    box.className="line-buttons";
    for(const line of lines){
      const button=document.createElement("button");
      button.textContent=line;
      button.addEventListener("click",()=>showDepartures(group,post,name,line));
      box.appendChild(button);
    }
    output.appendChild(box);
    if(!lines.length) output.insertAdjacentHTML("beforeend","<p>Brak linii dla tego słupka.</p>");
  }catch(error){
    output.textContent="Błąd pobierania linii: "+error.message;
  }
}

async function showDepartures(group,post,name,line){
  const output=document.querySelector("#departures");
  output.textContent="Pobieranie rozkładu…";
  try{
    const url=API+"dbtimetable_get?id="+encodeURIComponent(STOP_TIMES_ID)
      +"&busstopId="+encodeURIComponent(group)
      +"&busstopNr="+encodeURIComponent(post)
      +"&line="+encodeURIComponent(line)
      +"&apikey="+encodeURIComponent(apiKey);
    const rows=unwrap(await apiFetch(url));
    rows.sort((a,b)=>String(field(a,"czas")).localeCompare(String(field(b,"czas")));

    output.innerHTML="<h2>"+escapeHtml(name)+" "+escapeHtml(post)+" — linia "+escapeHtml(line)+"</h2>";
    if(!rows.length){
      output.insertAdjacentHTML("beforeend","<p>Brak odjazdów.</p>");
      return;
    }

    for(const row of rows){
      const div=document.createElement("div");
      div.className="dep";
      div.innerHTML=
        '<div class="dep-line">'+escapeHtml(line)+'</div>'+
        '<div class="dep-time">'+escapeHtml(field(row,"czas"))+'</div>'+
        '<div>'+escapeHtml(field(row,"kierunek"))+'</div>'+
        '<div class="dep-brig">bryg. '+escapeHtml(field(row,"brygada"))+'</div>';
      output.appendChild(div);
    }
  }catch(error){
    output.textContent="Błąd pobierania odjazdów: "+error.message;
  }
}
