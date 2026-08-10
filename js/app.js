/* ===================== HELPERS ===================== */
function $(sel,root=document){return root.querySelector(sel);}
function $all(sel,root=document){return [...root.querySelectorAll(sel)];}
function openOverlay(id){ $("#"+id).classList.add("show"); }
function closeOverlay(id){ $("#"+id).classList.remove("show"); }
$all("[data-close]").forEach(b=>b.addEventListener("click",()=>closeOverlay(b.dataset.close)));
$all(".overlay").forEach(o=>o.addEventListener("click",e=>{ if(e.target===o) closeOverlay(o.id); }));

/* ===================== DATABASE WRITES ===================== */
// All of these are fire-and-forget: the UI updates instantly from local state,
// and the real number lands in Supabase in the background. If Supabase isn't
// configured yet (js/config.js still has placeholder keys), window.sb is
// undefined and these quietly no-op — the site still works either way.
async function recordView(w){
  if(!window.sb) return;
  try{ await window.sb.rpc('increment_view', { p_wallpaper_id: w.slug }); }
  catch(e){ console.warn('Could not record view', e); }
}
async function recordDownload(w){
  if(!window.sb) return;
  try{ await window.sb.rpc('increment_download', { p_wallpaper_id: w.slug }); }
  catch(e){ console.warn('Could not record download', e); }
}
async function recordFeedback(w, vote){
  if(!window.sb) return;
  try{ await window.sb.rpc('submit_feedback', { p_wallpaper_id: w.slug, p_vote: vote }); }
  catch(e){ console.warn('Could not record feedback', e); }
}
async function recordCustomRequest(name, email, type, description){
  if(!window.sb) return;
  try{ await window.sb.rpc('submit_custom_request', { p_name:name, p_email:email, p_type:type, p_description:description }); }
  catch(e){ console.warn('Could not save custom request', e); }
}

function switchView(view){
  $all(".navlinks button").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
  ["browse","categories","room","devices","puzzle","stats"].forEach(v=>{
    $("#view-"+v).classList.toggle("hidden", v!==view);
  });
  if(view==="stats") renderStats();
  if(view==="room") renderRoom();
  if(view==="devices") renderDevices();
  if(view==="puzzle") renderPuzzlePickers();
  window.scrollTo({top: $("header.site").offsetHeight+40, behavior:"smooth"});
}
$all(".navlinks button").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
$("#heroStart").addEventListener("click",()=>switchView("browse"));
$("#heroAsk").addEventListener("click",()=>openOverlay("askOverlay"));

/* ===================== HERO ===================== */
function renderHero(){
  $("#heroCountWalls").textContent = WALLPAPERS.length;
  let catCount = 0; CATEGORY_GROUPS.forEach(g=>catCount+=g.cats.length);
  $("#heroCountCats").textContent = catCount;
  $("#heroCountViews").textContent = WALLPAPERS.reduce((a,w)=>a+w.views,0).toLocaleString();
  const hv = $("#heroVisual"); hv.innerHTML="";
  [12,28,4].forEach((seed,i)=>{
    const w = WALLPAPERS[seed % WALLPAPERS.length];
    const d = document.createElement("div"); d.className="stack-card"; d.style.background=w.bg;
    hv.appendChild(d);
  });
}

/* ===================== FILTER PANEL ===================== */
function renderFilterPanel(){
  const mf = $("#moodFilters"); mf.innerHTML="";
  MOODS.forEach(m=>{
    const c = document.createElement("button"); c.className="chip"; c.textContent=m;
    c.addEventListener("click",()=>{ toggleSetItem(state.filters.moods,m); c.classList.toggle("on"); renderGallery(); });
    mf.appendChild(c);
  });
  const cf = $("#colorFilters"); cf.innerHTML="";
  COLOR_SWATCHES.forEach(cs=>{
    const s = document.createElement("div"); s.className="swatch"; s.style.background=cs.hex; s.title=cs.id;
    s.addEventListener("click",()=>{ toggleSetItem(state.filters.colors,cs.id); s.classList.toggle("on"); renderGallery(); });
    cf.appendChild(s);
  });
  const ds = $("#dimFilter");
  DIMENSIONS.forEach(d=>{ const o=document.createElement("option"); o.value=d.id; o.textContent=`${d.label} (${d.w}×${d.h})`; ds.appendChild(o); });
  ds.addEventListener("change",()=>{ state.filters.dim = ds.value; renderGallery(); });
  const cSel = $("#catFilter");
  cSel.addEventListener("change",()=>{ state.filters.cat = cSel.value; renderGallery(); });
  refreshCategoryDropdown();
  $("#clearFilters").addEventListener("click",()=>{
    state.filters = {moods:new Set(),colors:new Set(),dim:"",cat:""};
    $all(".chip").forEach(c=>c.classList.remove("on"));
    $all(".swatch").forEach(c=>c.classList.remove("on"));
    ds.value=""; cSel.value="";
    renderGallery();
  });
}
// Rebuilds just the category dropdown options — safe to call again after real
// photos load in, without re-adding chip/swatch listeners or duplicating <option>s.
function refreshCategoryDropdown(){
  const cSel = $("#catFilter"); const prev = cSel.value;
  cSel.innerHTML = `<option value="">All categories</option>`;
  CATEGORY_GROUPS.forEach(g=>{
    const og = document.createElement("optgroup"); og.label=g.name;
    g.cats.filter(c=>WALLPAPERS.some(w=>w.catId===c.id)).forEach(c=>{ const o=document.createElement("option"); o.value=c.id; o.textContent=c.label; og.appendChild(o); });
    if(og.children.length) cSel.appendChild(og);
  });
  cSel.value = prev;
}
function toggleSetItem(set,item){ set.has(item)?set.delete(item):set.add(item); }

function filteredWallpapers(){
  return WALLPAPERS.filter(w=>{
    if(state.filters.moods.size && !state.filters.moods.has(w.mood)) return false;
    if(state.filters.colors.size && !w.colors.some(c=>state.filters.colors.has(c))) return false;
    if(state.filters.dim && w.nativeDim !== state.filters.dim) return false;
    if(state.filters.cat && w.catId !== state.filters.cat) return false;
    return true;
  });
}

function wCardHTML(w){
  return `<div class="wcard" data-id="${w.id}">
    <div class="thumb" style="background:${w.bg}">
      <div class="badge">${w.nativeDim}</div>
      <div class="stats-pill">👁 ${w.views.toLocaleString()}</div>
    </div>
    <div class="meta"><div class="name">${w.name}</div><div class="sub">${w.mood} · ${w.catLabel}</div></div>
  </div>`;
}
function renderGallery(){
  const list = filteredWallpapers();
  $("#resultCount").textContent = `${list.length} wallpaper${list.length!==1?"s":""}`;
  const grid = $("#galleryGrid");
  grid.innerHTML = list.length ? list.map(wCardHTML).join("") : `<div class="empty-note" style="grid-column:1/-1">No matches. Try clearing a filter — new wallpapers land in every niche regularly.</div>`;
  $all(".wcard",grid).forEach(el=>el.addEventListener("click",()=>openPreview(+el.dataset.id)));
}

/* ===================== CATEGORIES VIEW ===================== */
function renderCategoryGroups(){
  const wrap = $("#catGroups"); wrap.innerHTML="";
  CATEGORY_GROUPS.forEach(g=>{
    const div = document.createElement("div"); div.className="cat-group";
    div.innerHTML = `<h3>${g.name} <span class="n">${g.cats.length} niches</span></h3>
      <div class="cat-tiles">${g.cats.map(c=>{
        const count = WALLPAPERS.filter(w=>w.catId===c.id).length;
        return `<button class="cat-tile ${count?'':'soon'}" data-cat="${c.id}">
          <div class="t">${c.label}</div><div class="c">${count? count+" wallpapers":"Coming soon"}</div>
        </button>`;
      }).join("")}</div>`;
    wrap.appendChild(div);
  });
  $all(".cat-tile").forEach(t=>t.addEventListener("click",()=>{
    const id = t.dataset.cat;
    if(!WALLPAPERS.some(w=>w.catId===id)){ return; }
    state.filters = {moods:new Set(),colors:new Set(),dim:"",cat:id};
    $("#catFilter").value=id;
    switchView("browse");
    renderGallery();
  }));
}

/* ===================== PREVIEW MODAL ===================== */
function openPreview(id){
  const w = WALLPAPERS.find(x=>x.id===id); if(!w) return;
  w.views++; state.currentWallpaper = w; state.currentDim = w.nativeDim; state.currentDeviceTab="phone";
  recordView(w); // fire-and-forget write to the real database
  $("#pvTitle").textContent = w.name;
  $("#pvTags").innerHTML = [w.mood, w.catLabel, ...w.colors].map(t=>`<span class="tag">${t}</span>`).join("");
  $("#pvViews").textContent = w.views.toLocaleString();
  $("#pvDownloads").textContent = w.downloads.toLocaleString();
  if(w.photo && w.photographer){
    $("#pvCreditField").style.display = "";
    $("#pvCreditLink").textContent = w.photographer;
    $("#pvCreditLink").href = w.photographerUrl || w.sourceUrl || "#";
  } else {
    $("#pvCreditField").style.display = "none";
  }
  renderDeviceTabs(); renderDeviceFrame();
  renderDimPick();
  openOverlay("previewOverlay");
}
function renderDeviceTabs(){
  const tabs = [["phone","Phone"],["laptop","Laptop"],["desktop","Desktop"],["tablet","Tablet"]];
  $("#deviceTabs").innerHTML = tabs.map(([id,l])=>`<button class="chip ${state.currentDeviceTab===id?'on':''}" data-tab="${id}">${l}</button>`).join("");
  $all("#deviceTabs .chip").forEach(b=>b.addEventListener("click",()=>{ state.currentDeviceTab=b.dataset.tab; renderDeviceTabs(); renderDeviceFrame(); }));
}
function renderDeviceFrame(){
  const w = state.currentWallpaper; const wrap = $("#deviceFrameWrap");
  if(state.currentDeviceTab==="phone") wrap.innerHTML = `<div class="frame-phone" style="background-image:${w.bg}"></div>`;
  else if(state.currentDeviceTab==="tablet") wrap.innerHTML = `<div class="frame-tablet" style="background-image:${w.bg}"></div>`;
  else if(state.currentDeviceTab==="laptop") wrap.innerHTML = `<div class="frame-laptop"><div class="screen" style="background-image:${w.bg}"></div><div class="base"></div></div>`;
  else wrap.innerHTML = `<div class="frame-desktop"><div class="screen" style="background-image:${w.bg}"></div><div class="stand"></div><div class="base"></div></div>`;
}
function renderDimPick(){
  $("#dimPick").innerHTML = DIMENSIONS.map(d=>`<button class="chip ${state.currentDim===d.id?'on':''}" data-dim="${d.id}">${d.label}</button>`).join("");
  $all("#dimPick .chip").forEach(b=>b.addEventListener("click",()=>{ state.currentDim=b.dataset.dim; renderDimPick(); }));
}
$("#downloadBtn").addEventListener("click", async ()=>{
  const w = state.currentWallpaper; const dim = DIMENSIONS.find(d=>d.id===state.currentDim);
  await downloadWallpaperPNG(w, dim.w, dim.h, `${w.name.replace(/\s+/g,'-').toLowerCase()}-${dim.id}.png`);
  w.downloads++; $("#pvDownloads").textContent = w.downloads.toLocaleString();
  recordDownload(w);
});
$("#ppBtn").addEventListener("click",()=>{ openOverlay("ppOverlay"); renderPPCanvas(); });

// Loads an actual photo (real wallpapers) or falls back to painting a gradient
// (placeholder niches that don't have real photos yet).
function loadPhotoImage(url){
  return new Promise((resolve,reject)=>{
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = ()=>resolve(img); img.onerror = reject;
    img.src = url;
  });
}
async function paintWallpaperToCanvas(ctx, w, cw, ch){
  if(w.photo && w.photoUrl){
    try{
      const img = await loadPhotoImage(w.photoUrl);
      const scale = Math.max(cw/img.width, ch/img.height);
      const dw = img.width*scale, dh = img.height*scale;
      ctx.drawImage(img, (cw-dw)/2, (ch-dh)/2, dw, dh);
      return;
    }catch(e){
      // Photo failed to load (offline/CORS) and there's no gradient behind a real
      // photo entry — fill a flat neutral tone rather than crashing.
      if(!w.stops){ ctx.fillStyle = "#3a3d4a"; ctx.fillRect(0,0,cw,ch); return; }
    }
  }
  let grad;
  if(w.gradType==="radial"){
    grad = ctx.createRadialGradient(cw*0.4,ch*0.35,10, cw*0.5,ch*0.5, Math.max(cw,ch)*0.75);
    grad.addColorStop(0, w.stops[3]); grad.addColorStop(0.4, w.stops[2]); grad.addColorStop(0.7, w.stops[1]); grad.addColorStop(1, w.stops[0]);
  } else {
    const rad = (w.gradAngle||45) * Math.PI/180;
    const x0 = cw/2 - Math.cos(rad)*cw/2, y0 = ch/2 - Math.sin(rad)*ch/2;
    const x1 = cw/2 + Math.cos(rad)*cw/2, y1 = ch/2 + Math.sin(rad)*ch/2;
    grad = ctx.createLinearGradient(x0,y0,x1,y1);
    grad.addColorStop(0, w.stops[0]); grad.addColorStop(0.35, w.stops[1]); grad.addColorStop(0.7, w.stops[2]); grad.addColorStop(1, w.stops[3]);
  }
  ctx.fillStyle = grad; ctx.fillRect(0,0,cw,ch);
}
async function downloadWallpaperPNG(w, targetW, targetH, filename){
  const scale = Math.min(1, 1600/Math.max(targetW,targetH));
  const cw = Math.round(targetW*scale), ch = Math.round(targetH*scale);
  const canvas = document.createElement("canvas"); canvas.width=cw; canvas.height=ch;
  const ctx = canvas.getContext("2d");
  await paintWallpaperToCanvas(ctx, w, cw, ch);
  canvas.toBlob(blob=>{
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  });
}

/* ===================== PROFILE PICTURE ===================== */
const SHAPES = ["circle","square","star","hexagon","heart","triangle","rounded"];
function renderShapeRow(){
  $("#shapeRow").innerHTML = SHAPES.map(s=>`<button class="shape-btn ${state.ppShape===s?'on':''}" data-shape="${s}" title="${s}">${shapeIcon(s)}</button>`).join("");
  $all(".shape-btn").forEach(b=>b.addEventListener("click",()=>{ state.ppShape=b.dataset.shape; renderShapeRow(); renderPPCanvas(); }));
}
function shapeIcon(s){
  const icons={circle:"●",square:"■",star:"★",hexagon:"⬡",heart:"♥",triangle:"▲",rounded:"▢"};
  return icons[s]||"?";
}
function shapePath(ctx,shape,size){
  const c=size/2;
  ctx.beginPath();
  if(shape==="circle"){ ctx.arc(c,c,c,0,Math.PI*2); }
  else if(shape==="square"){ ctx.rect(0,0,size,size); }
  else if(shape==="rounded"){ const r=size*0.18; ctx.moveTo(r,0); ctx.arcTo(size,0,size,size,r); ctx.arcTo(size,size,0,size,r); ctx.arcTo(0,size,0,0,r); ctx.arcTo(0,0,size,0,r); }
  else if(shape==="triangle"){ ctx.moveTo(c,4); ctx.lineTo(size-4,size-4); ctx.lineTo(4,size-4); ctx.closePath(); }
  else if(shape==="hexagon"){ for(let i=0;i<6;i++){ const a=Math.PI/3*i - Math.PI/2; const x=c+c*0.95*Math.cos(a), y=c+c*0.95*Math.sin(a); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);} ctx.closePath(); }
  else if(shape==="star"){ const spikes=5, outer=c*0.95, inner=c*0.42; let rot=Math.PI/2*3;
    ctx.moveTo(c, c-outer);
    for(let i=0;i<spikes;i++){ let x=c+Math.cos(rot)*outer, y=c+Math.sin(rot)*outer; ctx.lineTo(x,y); rot+=Math.PI/spikes;
      x=c+Math.cos(rot)*inner; y=c+Math.sin(rot)*inner; ctx.lineTo(x,y); rot+=Math.PI/spikes; }
    ctx.closePath();
  } else if(shape==="heart"){
    ctx.moveTo(c, size*0.28);
    ctx.bezierCurveTo(c, size*0.05, size*0.1, size*0.05, size*0.1, size*0.3);
    ctx.bezierCurveTo(size*0.1, size*0.55, c, size*0.7, c, size*0.95);
    ctx.bezierCurveTo(c, size*0.7, size*0.9, size*0.55, size*0.9, size*0.3);
    ctx.bezierCurveTo(size*0.9, size*0.05, c, size*0.05, c, size*0.28);
    ctx.closePath();
  }
}
async function renderPPCanvas(){
  const w = state.currentWallpaper; if(!w) return;
  const canvas = $("#ppCanvas"); const ctx = canvas.getContext("2d"); const size=320;
  ctx.clearRect(0,0,size,size);
  ctx.save(); shapePath(ctx,state.ppShape,size); ctx.clip();
  await paintWallpaperToCanvas(ctx,w,size,size);
  ctx.restore();
}
$("#ppDownload").addEventListener("click",()=>{
  const canvas = $("#ppCanvas");
  canvas.toBlob(blob=>{ const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`profile-${state.ppShape}.png`; a.click(); });
});

/* ===================== HELP ME CHOOSE ===================== */
const QUIZ = [
  {q:"What's your vibe right now?", key:"mood", opts:["Calm","Energetic","Dark & Moody","Playful","Epic","Dreamy"]},
  {q:"Pick a color family", key:"colors", opts:[
    {label:"Cool blues & teals",v:["blue","teal"]},{label:"Warm sunset tones",v:["orange","red","gold"]},
    {label:"Pastels",v:["pink","white"]},{label:"Black & neutrals",v:["black","gray"]},{label:"Vibrant neon",v:["neon","purple"]}
  ]},
  {q:"Where will it live?", key:"dim", opts:["phone","desktop","tablet","square","ultrawide"]},
  {q:"Which pulls you in more?", key:"group", opts:["Nature & Landscapes","Abstract & Patterns","Space & Sci-Fi","Minimal & Aesthetic","Dark & Moody","Anime & Illustration"]}
];
let quizAnswers = {};
function renderQuiz(){
  quizAnswers = {};
  const body = $("#chooseBody");
  body.innerHTML = QUIZ.map((q,qi)=>`
    <div class="quiz-q" data-qi="${qi}">
      <h4>${qi+1}. ${q.q}</h4>
      <div class="quiz-options">${q.opts.map((o,oi)=>{
        const label = typeof o==="string"?o:o.label;
        return `<button class="chip" data-qi="${qi}" data-oi="${oi}">${label}</button>`;
      }).join("")}</div>
    </div>`).join("") + `<button class="btn primary" style="width:100%;margin-top:10px" id="quizSubmit">Show me matches</button><div id="quizResults"></div>`;
  $all(".quiz-options .chip").forEach(b=>b.addEventListener("click",()=>{
    const qi=+b.dataset.qi;
    $all(`.quiz-options .chip[data-qi="${qi}"]`).forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    quizAnswers[qi] = +b.dataset.oi;
  }));
  $("#quizSubmit").addEventListener("click",runQuiz);
}
function runQuiz(){
  const scored = WALLPAPERS.map(w=>{
    let score = 0;
    if(quizAnswers[0]!==undefined){ const mood=QUIZ[0].opts[quizAnswers[0]]; if(w.mood===mood) score+=3; }
    if(quizAnswers[1]!==undefined){ const colors=QUIZ[1].opts[quizAnswers[1]].v; if(w.colors.some(c=>colors.includes(c))) score+=3; }
    if(quizAnswers[2]!==undefined){ const dim=QUIZ[2].opts[quizAnswers[2]]; if(w.nativeDim===dim) score+=2; }
    if(quizAnswers[3]!==undefined){ const grp=QUIZ[3].opts[quizAnswers[3]]; if(w.group===grp) score+=3; }
    score += seededRand(w.id*4.4)*1.2;
    return {w,score};
  }).sort((a,b)=>b.score-a.score).slice(0,3);
  $("#quizResults").innerHTML = `<h4 style="margin-top:24px">Your matches</h4><div class="rec-grid">${scored.map(({w})=>wCardHTML(w)).join("")}</div>`;
  $all("#quizResults .wcard").forEach(el=>el.addEventListener("click",()=>{ closeOverlay("chooseOverlay"); openPreview(+el.dataset.id); }));
}
$("#btnHelpChoose").addEventListener("click",()=>{ renderQuiz(); openOverlay("chooseOverlay"); });

/* ===================== HELP US IMPROVE ===================== */
function renderImprove(){
  const picks = [];
  const used = new Set();
  while(picks.length<5){ const w = WALLPAPERS[Math.floor(Math.random()*WALLPAPERS.length)]; if(!used.has(w.id)){ used.add(w.id); picks.push(w); } }
  $("#improveList").innerHTML = picks.map(w=>`
    <div class="improve-card" data-id="${w.id}">
      <div class="thumb" style="background:${w.bg}"></div>
      <div>
        <div style="font-weight:600">${w.name}</div>
        <div style="font-family:var(--mono);font-size:11px;color:var(--ink-faint)">${w.mood} · ${w.catLabel}</div>
        <div class="improve-actions">
          <button class="yn yes" data-id="${w.id}" data-v="yes">👍 Good</button>
          <button class="yn no" data-id="${w.id}" data-v="no">👎 Not for me</button>
        </div>
      </div>
    </div>`).join("");
  $all(".yn").forEach(b=>b.addEventListener("click",()=>{
    const id=+b.dataset.id, v=b.dataset.v;
    const w = WALLPAPERS.find(x=>x.id===id);
    state.feedback[id] = state.feedback[id]||{yes:0,no:0};
    state.feedback[id][v]++;
    recordFeedback(w, v);
    b.parentElement.querySelectorAll(".yn").forEach(x=>x.style.opacity=.4);
    b.style.opacity=1; b.style.borderColor = v==="yes"?"#7fbf7f":"#e08080";
    renderImproveLog();
  }));
  renderImproveLog();
}
function renderImproveLog(){
  const entries = Object.entries(state.feedback);
  $("#improveLog").innerHTML = entries.length ? `Saved${window.sb?" to the database":" this session"}: ` + entries.map(([id,v])=>{
    const w = WALLPAPERS.find(x=>x.id==id);
    return `${w.name} (👍${v.yes} 👎${v.no})`;
  }).join(" · ") : "";
}
$("#btnImprove").addEventListener("click",()=>{ renderImprove(); openOverlay("improveOverlay"); });

/* ===================== ASK FOR WALLPAPER ===================== */
$("#askSend").addEventListener("click",()=>{
  const name = $("#askName").value || "—";
  const email = $("#askEmail").value || "—";
  const type = $("#askType").value;
  const desc = $("#askDesc").value || "—";
  recordCustomRequest(name, email, type, desc); // saved to the database as a backup even if the mailto below doesn't go through
  const subject = encodeURIComponent("Custom wallpaper request — "+name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nRequest type: ${type}\n\nDescription:\n${desc}`);
  window.location.href = `mailto:requests@wallrank.club?subject=${subject}&body=${body}`;
});

/* ===================== ROOM DEMO ===================== */
function renderRoom(){
  const w = state.roomList[state.roomIndex];
  $("#roomScreen").style.backgroundImage = w.bg;
  $("#roomGlow").style.backgroundImage = w.bg;
  $("#roomLabel").textContent = w.name;
}
$("#roomPrev").addEventListener("click",()=>{ state.roomIndex = (state.roomIndex-1+state.roomList.length)%state.roomList.length; renderRoom(); });
$("#roomNext").addEventListener("click",()=>{ state.roomIndex = (state.roomIndex+1)%state.roomList.length; renderRoom(); });
$("#roomLight").addEventListener("click",()=>{ $("#roomScene").classList.remove("dark"); $("#roomLight").classList.add("on"); $("#roomDark").classList.remove("on"); });
$("#roomDark").addEventListener("click",()=>{ $("#roomScene").classList.add("dark"); $("#roomDark").classList.add("on"); $("#roomLight").classList.remove("on"); });

/* ===================== ON A DEVICE ===================== */
function renderDevices(){
  if(!state.deviceSelected) state.deviceSelected = DEVICES[0];
  $("#deviceList").innerHTML = DEVICES.map(d=>`<button class="chip ${state.deviceSelected.id===d.id?'on':''}" data-id="${d.id}">${d.label}</button>`).join("");
  $all("#deviceList .chip").forEach(b=>b.addEventListener("click",()=>{ state.deviceSelected = DEVICES.find(d=>d.id===b.dataset.id); renderDevices(); }));
  const d = state.deviceSelected; const w = state.deviceSelectedWallpaper;
  let frameHTML;
  if(d.kind==="phone") frameHTML = `<div class="frame-phone" style="width:180px;height:370px;background-image:${w.bg}"></div>`;
  else if(d.kind==="tablet") frameHTML = `<div class="frame-tablet" style="width:260px;height:340px;background-image:${w.bg}"></div>`;
  else if(d.kind==="laptop") frameHTML = `<div class="frame-laptop" style="width:420px"><div class="screen" style="height:230px;background-image:${w.bg}"></div><div class="base"></div></div>`;
  else frameHTML = `<div class="frame-desktop" style="width:${d.id==='ultrawide34'?520:420}px"><div class="screen" style="height:${d.id==='ultrawide34'?150:230}px;background-image:${w.bg}"></div><div class="stand"></div><div class="base"></div></div>`;
  $("#deviceStage").innerHTML = `<div style="text-align:center"><div>${frameHTML}</div><div style="margin-top:16px;font-family:var(--mono);font-size:12px;color:var(--ink-dim)">${d.label} · ${w.name}</div></div>`;
  const pg = $("#devicePickerGrid");
  pg.innerHTML = WALLPAPERS.slice(0,24).map(wCardHTML).join("");
  $all(".wcard",pg).forEach(el=>el.addEventListener("click",()=>{ state.deviceSelectedWallpaper = WALLPAPERS.find(w2=>w2.id==+el.dataset.id); renderDevices(); }));
}

/* ===================== PUZZLE ===================== */
function renderPuzzlePickers(){
  const pg = $("#puzzlePickerGrid");
  pg.innerHTML = WALLPAPERS.slice(0,18).map(w=>`<div class="wcard" data-id="${w.id}"><div class="thumb" style="background:${w.bg};aspect-ratio:1/1"></div><div class="meta"><div class="name" style="font-size:12px">${w.name}</div></div></div>`).join("");
  $all(".wcard",pg).forEach(el=>el.addEventListener("click",()=>{ state.puzzleWallpaper = WALLPAPERS.find(w=>w.id==+el.dataset.id); shufflePuzzle(); }));
  if(!state.puzzleOrder.length) shufflePuzzle();
}
async function puzzleBg(){
  const canvas = document.createElement("canvas"); canvas.width=360; canvas.height=360;
  const ctx = canvas.getContext("2d"); await paintWallpaperToCanvas(ctx, state.puzzleWallpaper, 360,360);
  return canvas.toDataURL();
}
let puzzleImgCache = null;
async function shufflePuzzle(){
  puzzleImgCache = await puzzleBg();
  let order = [...Array(16).keys()];
  // shuffle via random valid swaps starting from solved to guarantee solvability
  let blank = 15;
  for(let i=0;i<200;i++){
    const neighbors = validMoves(blank);
    const pick = neighbors[Math.floor(Math.random()*neighbors.length)];
    [order[blank],order[pick]] = [order[pick],order[blank]];
    blank = pick;
  }
  state.puzzleOrder = order; state.puzzleMoves = 0;
  $("#puzzleWin").textContent="";
  renderPuzzleBoard();
}
function validMoves(blankIdx){
  const row = Math.floor(blankIdx/4), col = blankIdx%4; const moves=[];
  if(row>0) moves.push(blankIdx-4); if(row<3) moves.push(blankIdx+4);
  if(col>0) moves.push(blankIdx-1); if(col<3) moves.push(blankIdx+1);
  return moves;
}
function renderPuzzleBoard(){
  const board = $("#puzzleBoard"); board.innerHTML="";
  state.puzzleOrder.forEach((tileVal, idx)=>{
    const div = document.createElement("div");
    if(tileVal===15){ div.className="ptile blank"; }
    else{
      div.className="ptile";
      const tr = Math.floor(tileVal/4), tc = tileVal%4;
      div.style.backgroundImage = `url(${puzzleImgCache})`;
      div.style.backgroundPosition = `-${tc*90}px -${tr*90}px`;
      div.addEventListener("click",()=>tryMove(idx));
    }
    board.appendChild(div);
  });
  $("#puzzleMoves").textContent = `${state.puzzleMoves} moves`;
}
function tryMove(idx){
  const blank = state.puzzleOrder.indexOf(15);
  if(validMoves(blank).includes(idx)){
    [state.puzzleOrder[blank], state.puzzleOrder[idx]] = [state.puzzleOrder[idx], state.puzzleOrder[blank]];
    state.puzzleMoves++;
    renderPuzzleBoard();
    if(state.puzzleOrder.every((v,i)=>v===i)){
      $("#puzzleWin").textContent = `Solved in ${state.puzzleMoves} moves! 🎉`;
    }
  }
}
$("#puzzleShuffle").addEventListener("click", shufflePuzzle);

/* ===================== STATS ===================== */
async function renderStats(){
  await loadRealStats(); // pull the latest real numbers before showing the leaderboard
  const anyActivity = WALLPAPERS.some(w=>w.views>0 || w.downloads>0);
  const byViews = [...WALLPAPERS].sort((a,b)=>b.views-a.views).slice(0,6);
  const byDownloads = [...WALLPAPERS].sort((a,b)=>b.downloads-a.downloads).slice(0,6);
  const byHot = [...WALLPAPERS].sort((a,b)=>hotScore(b)-hotScore(a)).slice(0,6);
  function rows(list,valFn,label){
    if(!anyActivity) return `<div class="empty-note">No activity yet — be the first to browse.</div>`;
    return list.map((w,i)=>`<div class="stat-row" data-id="${w.id}">
      <span class="rank">${i+1}</span>
      <div class="thumb" style="background:${w.bg}"></div>
      <div class="info"><div class="n">${w.name}</div><div class="v">${valFn(w).toLocaleString()} ${label}</div></div>
    </div>`).join("");
  }
  $("#statsViewed").innerHTML = rows(byViews, w=>w.views, "views");
  $("#statsDownloaded").innerHTML = rows(byDownloads, w=>w.downloads, "downloads");
  $("#statsHot").innerHTML = rows(byHot, hotScore, "hot score");
  $all(".stat-row").forEach(el=>el.addEventListener("click",()=>openPreview(+el.dataset.id)));
}

/* ===================== INIT ===================== */
async function initApp(){
  // Paint immediately with gradient placeholders so the site never looks empty while loading...
  renderHero();
  renderFilterPanel();
  renderGallery();
  renderCategoryGroups();
  renderShapeRow();
  // ...then layer in real photos (if data/photos.json exists) and real database stats.
  const gotPhotos = await mergeRealPhotos();
  const gotStats = await loadRealStats();
  if(gotPhotos || gotStats){
    renderHero();
    if(gotPhotos) refreshCategoryDropdown();
    renderGallery();
    if(gotPhotos) renderCategoryGroups();
  }
}
initApp();