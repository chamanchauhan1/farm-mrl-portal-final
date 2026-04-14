/* ============================================================
   FARM MRL PORTAL — app.js
   Part 1: Data Store, MRL Database, Router
   ============================================================ */

// ── MRL Database ──────────────────────────────────────────────
const MRL_DB = [
  // CROP PESTICIDES
  { id:'chlorpyrifos',  name:'Chlorpyrifos',      type:'crop',   target:'Cereal / Wheat',    mrl:0.05,  unit:'mg/kg', withdrawal:21, category:'Organophosphate',  risk:'high',    icon:'🌾', alternatives:['Dimethoate','Malathion'], notes:'Neurotoxic — use with full PPE.' },
  { id:'glyphosate',   name:'Glyphosate',         type:'crop',   target:'Soybean / Corn',    mrl:20,    unit:'mg/kg', withdrawal:7,  category:'Herbicide',        risk:'moderate',icon:'🌱', alternatives:['Clethodim','Fluazifop'],  notes:'Pre-harvest use only.' },
  { id:'imidacloprid', name:'Imidacloprid',        type:'crop',   target:'Tomato / Vegetable',mrl:0.5,   unit:'mg/kg', withdrawal:14, category:'Neonicotinoid',    risk:'moderate',icon:'🍅', alternatives:['Spinosad','Azadirachtin'],notes:'Avoid during flowering — bee toxicity.' },
  { id:'cypermethrin', name:'Cypermethrin',        type:'crop',   target:'Rice / Paddy',      mrl:0.1,   unit:'mg/kg', withdrawal:14, category:'Pyrethroid',       risk:'moderate',icon:'🌾', alternatives:['Lambda-cyhalothrin'],     notes:'Highly toxic to aquatic organisms.' },
  { id:'mancozeb',     name:'Mancozeb',            type:'crop',   target:'Potato / Tomato',   mrl:5,     unit:'mg/kg', withdrawal:10, category:'Fungicide',        risk:'low',     icon:'🥔', alternatives:['Copper hydroxide'],       notes:'ETU metabolite monitored separately.' },
  { id:'carbendazim',  name:'Carbendazim',         type:'crop',   target:'Fruits / Grapes',   mrl:0.2,   unit:'mg/kg', withdrawal:14, category:'Fungicide',        risk:'moderate',icon:'🍇', alternatives:['Tebuconazole'],           notes:'Potential endocrine disruptor.' },
  { id:'malathion',    name:'Malathion',           type:'crop',   target:'General Crops',     mrl:8,     unit:'mg/kg', withdrawal:3,  category:'Organophosphate',  risk:'moderate',icon:'🌿', alternatives:['Spinosad','Bacillus'],    notes:'Short residual life — safer option.' },
  { id:'lambda',       name:'Lambda-cyhalothrin',  type:'crop',   target:'Cotton / Corn',     mrl:0.1,   unit:'mg/kg', withdrawal:21, category:'Pyrethroid',       risk:'high',    icon:'🌽', alternatives:['Emamectin benzoate'],     notes:'Very toxic to fish and bees.' },
  { id:'thiamethoxam', name:'Thiamethoxam',        type:'crop',   target:'Vegetables',        mrl:0.3,   unit:'mg/kg', withdrawal:14, category:'Neonicotinoid',    risk:'moderate',icon:'🥦', alternatives:['Spinosad'],               notes:'Banned in EU for outdoor use.' },
  { id:'propiconazole',name:'Propiconazole',       type:'crop',   target:'Banana / Citrus',   mrl:1.0,   unit:'mg/kg', withdrawal:14, category:'Triazole Fungicide',risk:'low',    icon:'🍌', alternatives:['Azoxystrobin'],           notes:'Systemic — absorbed into plant tissue.' },

  // ANIMAL MEDICINES
  { id:'amoxicillin',  name:'Amoxicillin',         type:'animal', target:'Cattle / Swine',    mrl:10,    unit:'ppb',   withdrawal:28, category:'Antibiotic',       risk:'low',     icon:'🐄', alternatives:['Penicillin G'],           notes:'Milk: 4-day withdrawal. Meat: 28 days.' },
  { id:'oxytet',       name:'Oxytetracycline',     type:'animal', target:'Poultry / Cattle',  mrl:200,   unit:'ppb',   withdrawal:5,  category:'Antibiotic',       risk:'low',     icon:'🐔', alternatives:['Doxycycline'],            notes:'High residue in liver — test before slaughter.' },
  { id:'ivermectin',   name:'Ivermectin',          type:'animal', target:'Cattle / Sheep',    mrl:10,    unit:'ppb',   withdrawal:49, category:'Antiparasitic',    risk:'moderate',icon:'🐑', alternatives:['Doramectin','Levamisole'],notes:'Long withdrawal — 49 days meat, 28 days milk.' },
  { id:'doxycycline',  name:'Doxycycline',         type:'animal', target:'Poultry / Swine',   mrl:100,   unit:'ppb',   withdrawal:7,  category:'Antibiotic',       risk:'low',     icon:'🐷', alternatives:['Chlortetracycline'],      notes:'Do not use in laying hens — egg residues.' },
  { id:'enrofloxacin', name:'Enrofloxacin',        type:'animal', target:'Poultry / Cattle',  mrl:100,   unit:'ppb',   withdrawal:10, category:'Fluoroquinolone',  risk:'moderate',icon:'🐔', alternatives:['Doxycycline'],            notes:'Banned in US food animals. Monitor carefully.' },
  { id:'sulfadiazine', name:'Sulfadiazine',        type:'animal', target:'Cattle / Swine',    mrl:100,   unit:'ppb',   withdrawal:10, category:'Sulfonamide',      risk:'moderate',icon:'🐄', alternatives:['Amoxicillin'],            notes:'Combination with trimethoprim common.' },
  { id:'tilmicosin',   name:'Tilmicosin',          type:'animal', target:'Cattle / Sheep',    mrl:50,    unit:'ppb',   withdrawal:30, category:'Macrolide',        risk:'moderate',icon:'🐑', alternatives:['Tylosin','Tulathromycin'],notes:'Fatal to humans if injected — handle carefully.' },
  { id:'tylosin',      name:'Tylosin',             type:'animal', target:'Swine / Poultry',   mrl:200,   unit:'ppb',   withdrawal:21, category:'Macrolide',        risk:'low',     icon:'🐷', alternatives:['Lincomycin'],             notes:'Growth-promoting use restricted in EU.' },
  { id:'levamisole',   name:'Levamisole',          type:'animal', target:'Sheep / Cattle',    mrl:10,    unit:'ppb',   withdrawal:7,  category:'Antiparasitic',    risk:'low',     icon:'🐑', alternatives:['Ivermectin','Fenbendazole'],notes:'Immunostimulant properties noted.' },
  { id:'fenbendazole', name:'Fenbendazole',        type:'animal', target:'Cattle / Poultry',  mrl:50,    unit:'ppb',   withdrawal:14, category:'Antiparasitic',    risk:'low',     icon:'🐄', alternatives:['Albendazole','Ivermectin'],notes:'Safe in pregnancy. Broad-spectrum anthelmintic.' },

  // MULTI-PURPOSE
  { id:'copper_sulf',  name:'Copper Sulfate',      type:'both',   target:'Crops / Fish Ponds',mrl:50,    unit:'mg/kg', withdrawal:0,  category:'Fungicide / Algaecide',risk:'low', icon:'🔵', alternatives:['Neem extract'],           notes:'Used in aquaculture and viticulture.' },
  { id:'zinc_oxide',   name:'Zinc Oxide',          type:'both',   target:'Crops / Livestock', mrl:150,   unit:'mg/kg', withdrawal:0,  category:'Micronutrient',    risk:'low',     icon:'⚪', alternatives:['Zinc Sulfate'],           notes:'Essential micronutrient — toxicity at high doses.' },
];

// ── Species avatar map ──
const SPECIES_ICONS = { cattle:'🐄', buffalo:'🐃', poultry:'🐔', goat:'🐐', sheep:'🐑', pig:'🐷', fish:'🐟', other:'🦙' };
const STAGE_ICONS = { seeding:'🌱', vegetative:'🌿', flowering:'🌸', fruit:'🍅', maturing:'🌾', harvest:'✂️' };
const STAGE_PROGRESS = { seeding:8, vegetative:25, flowering:45, fruit:65, maturing:82, harvest:100 };
const CROP_ICONS = { wheat:'🌾', tomato:'🍅', rice:'🌾', corn:'🌽', potato:'🥔', soybean:'🌱', cotton:'🌿', banana:'🍌', mango:'🥭', grapes:'🍇', vegetables:'🥦', onion:'🧅', default:'🌿' };

// ── DataStore ──────────────────────────────────────────────────
let DB = {
  get(key, def=[]) {
    try { return JSON.parse(localStorage.getItem('fmrl_'+key)) ?? def; } catch { return def; }
  },
  set(key, val) { localStorage.setItem('fmrl_'+key, JSON.stringify(val)); },
  logs()    { return this.get('logs', []); },
  crops()   { return this.get('crops', []); },
  animals() { return this.get('animals', []); },
  alerts()  { return this.get('alerts', []); },
  checks()  { return this.get('checks', []); },
  events()  { return this.get('events', []); },
  saveLogs(v)    { this.set('logs', v); },
  saveCrops(v)   { this.set('crops', v); },
  saveAnimals(v) { this.set('animals', v); },
  saveAlerts(v)  { this.set('alerts', v); },
  saveChecks(v)  { this.set('checks', v); },
  saveEvents(v)  { this.set('events', v); },
};

// ── Helpers ────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' });
const today = () => new Date().toISOString().split('T')[0];
const daysDiff = (a,b) => Math.round((new Date(a)-new Date(b))/(1000*60*60*24));
const uid = () => '_'+Math.random().toString(36).slice(2,9);

function toast(msg, type='info') {
  const icons = { success:'✅', danger:'❌', warning:'⚠️', info:'💡' };
  const c = document.createElement('div');
  c.className = 'toast';
  c.innerHTML = `<span style="font-size:16px;">${icons[type]||'💡'}</span><span>${msg}</span>`;
  $('toastContainer').appendChild(c);
  setTimeout(()=>{ c.classList.add('removing'); setTimeout(()=>c.remove(),300); }, 3200);
}

// ── MRL Risk Calculator ────────────────────────────────────────
function calcMRLRisk(chemId, dosage, unit) {
  const chem = MRL_DB.find(c=>c.id===chemId);
  if (!chem || !dosage) return null;
  const dose = parseFloat(dosage);
  if (isNaN(dose)) return null;
  // Normalize units roughly for comparison
  let normDose = dose;
  if (unit==='ppm' && chem.unit==='ppb') normDose = dose * 1000;
  if (unit==='ppb' && chem.unit==='ppm') normDose = dose / 1000;
  const ratio = normDose / chem.mrl;
  if (ratio <= 0.5) return { status:'safe',    ratio, chem, label:'✅ Safe',    css:'safe' };
  if (ratio <= 1.0) return { status:'warning', ratio, chem, label:'⚠️ Warning', css:'warning' };
  return            { status:'danger',  ratio, chem, label:'❌ Unsafe',  css:'danger' };
}

// ── Alert Engine ───────────────────────────────────────────────
function generateAlerts() {
  const alerts = [];
  const now = new Date();

  // From logs
  DB.logs().forEach(log => {
    const chem = MRL_DB.find(c=>c.id===log.chemId);
    if (!chem) return;
    const risk = calcMRLRisk(log.chemId, log.dose, log.unit);
    if (risk && risk.status === 'danger') {
      alerts.push({
        id: uid(), type:'danger', priority:'high',
        title:'MRL Exceeded — ' + log.chemName,
        body:'Dosage ' + log.dose + ' ' + log.unit + ' exceeds safe limit of ' + chem.mrl + ' ' + chem.unit + ' on ' + log.target + '.',
        date: now.toISOString(), dismissed:false, source:'log'
      });
    }
    if (risk && risk.status === 'warning') {
      alerts.push({
        id: uid(), type:'warning', priority:'medium',
        title:'Near MRL Limit — ' + log.chemName,
        body:'Dosage is at ' + Math.round(risk.ratio*100) + '% of safe limit. Consider reducing.',
        date: now.toISOString(), dismissed:false, source:'log'
      });
    }
    // Withdrawal check
    if (chem.withdrawal > 0) {
      const appDate = new Date(log.date);
      const safeDate = new Date(appDate); safeDate.setDate(safeDate.getDate()+chem.withdrawal);
      const daysLeft = Math.ceil((safeDate-now)/(1000*60*60*24));
      if (daysLeft > 0 && daysLeft <= 5) {
        alerts.push({
          id: uid(), type:'warning', priority:'high',
          title:'Withdrawal Ending Soon — ' + log.chemName,
          body: daysLeft + ' day(s) left before product is safe. Safe date: ' + fmtDate(safeDate) + '.',
          date: now.toISOString(), dismissed:false, source:'withdrawal'
        });
      }
    }
  });

  // From animals
  DB.animals().forEach(animal => {
    if (!animal.medId) return;
    const chem = MRL_DB.find(c=>c.id===animal.medId);
    if (!chem) return;
    const treatDate = new Date(animal.medDate);
    const safeDate = new Date(treatDate); safeDate.setDate(safeDate.getDate()+chem.withdrawal);
    const daysLeft = Math.ceil((safeDate-now)/(1000*60*60*24));
    if (daysLeft > 0 && daysLeft <= 7) {
      alerts.push({
        id: uid(), type:'warning', priority:'high',
        title:'Animal Withdrawal Active — ' + animal.name,
        body: animal.name + ' treated with ' + chem.name + '. ' + daysLeft + ' days until milk/meat is safe. Safe date: ' + fmtDate(safeDate) + '.',
        date: now.toISOString(), dismissed:false, source:'animal'
      });
    }
    if (daysLeft <= 0 && daysLeft > -3) {
      alerts.push({
        id: uid(), type:'safe', priority:'low',
        title:'Animal Product Now Safe — ' + animal.name,
        body:'Withdrawal period complete for ' + chem.name + '. ' + animal.name + "'s products are safe to use.",
        date: now.toISOString(), dismissed:false, source:'animal'
      });
    }
  });

  // Overuse detection
  const logs = DB.logs();
  const chemCount = {};
  logs.forEach(l => {
    if (!l.chemId) return;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-30);
    if (new Date(l.date) >= cutoff) chemCount[l.chemId] = (chemCount[l.chemId]||0)+1;
  });
  Object.entries(chemCount).forEach(([chemId,count])=>{
    if (count >= 3) {
      const chem = MRL_DB.find(c=>c.id===chemId);
      alerts.push({
        id: uid(), type:'warning', priority:'medium',
        title:'Overuse Detected — ' + (chem?.name||chemId),
        body:'Applied ' + count + ' times in the last 30 days. Resistance risks increase.',
        date: now.toISOString(), dismissed:false, source:'overuse'
      });
    }
  });

  // Add new alerts, keep dismissed state
  const saved = DB.alerts();
  const dismissedIds = new Set(saved.filter(a=>a.dismissed).map(a=>a.title));
  alerts.forEach(a=>{
    if (dismissedIds.has(a.title)) a.dismissed = true;
  });
  DB.saveAlerts(alerts);
  updateAlertBadge();
}

function updateAlertBadge() {
  const active = DB.alerts().filter(a=>!a.dismissed).length;
  const badge = $('alertBadge');
  if (badge) { badge.textContent = active; badge.style.display = active ? '' : 'none'; }
}

// ── Router ─────────────────────────────────────────────────────
const PAGE_META = {
  dashboard:    { title:'Dashboard',            sub:'Welcome back — here\'s your farm at a glance' },
  alerts:       { title:'Alert Center',         sub:'Prioritized safety reminders' },
  logger:       { title:'Usage Logger',         sub:'Log and track all chemical applications' },
  checker:      { title:'MRL Risk Checker',     sub:'Instant compliance check against safe limits' },
  advisor:      { title:'Safety Advisor',    sub:'Rule-based recommendations & guidance' },
  encyclopedia: { title:'Chemical Encyclopedia',sub:'Complete MRL reference database' },
  crops:        { title:'Crop Manager',         sub:'Track growth, pesticide history, and harvest safety' },
  animals:      { title:'Animal Tracker',       sub:'Monitor livestock health and withdrawal periods' },
  calendar:     { title:'Harvest Calendar',     sub:'Safe harvest and withdrawal timeline' },
  reports:      { title:'Reports & Analytics',  sub:'Compliance trends and usage summaries' },
  admin:        { title:'Admin Panel',          sub:'Manage users and platform-wide data' },
  profile:      { title:'My Profile',           sub:'Update your account and farm details' },
};

let currentPage = 'dashboard';
function navigate(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const el = $('page-'+page);
  if (el) el.classList.add('active');
  const nav = document.querySelector(`[data-page="${page}"]`);
  if (nav) nav.classList.add('active');
  const meta = PAGE_META[page] || { title:page, sub:'' };
  $('pageTitle').textContent = meta.title;
  $('pageSubtitle').textContent = meta.sub;
  currentPage = page;
  closeSidebar();
  renderPage(page);
}

function renderPage(page) {
  switch(page) {
    case 'dashboard':    renderDashboard(); break;
    case 'alerts':       renderAlerts(); break;
    case 'logger':       renderLogger(); break;
    case 'checker':      renderChecker(); break;
    case 'advisor':      renderAdvisor(); break;
    case 'encyclopedia': renderEncyclopedia(); break;
    case 'crops':        renderCrops(); break;
    case 'animals':      renderAnimals(); break;
    case 'calendar':     renderCalendar(); break;
    case 'reports':      renderReports(); break;
    case 'admin':        renderAdmin(); break;
    case 'profile':      renderProfile(); break;
  }
}

// ── Sidebar helpers ────────────────────────────────────────────
function toggleSidebar() {
  const s = $('sidebar'), o = $('sidebarOverlay');
  s.classList.toggle('open'); o.classList.toggle('open');
}
function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('sidebarOverlay').classList.remove('open');
}

// ── Theme toggle ───────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  $('themeBtn').innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
  localStorage.setItem('fmrl_theme', isDark ? 'light' : 'dark');
  // Re-render charts
  setTimeout(()=>renderPage(currentPage), 100);
}

// ── Modal helpers ──────────────────────────────────────────────
function openModal(id) {
  const m = $(id); if (!m) return;
  m.classList.add('open');
  // Set default date
  const dateInput = m.querySelector('input[type="date"]');
  if (dateInput && !dateInput.value) dateInput.value = today();
}
function closeModal(id) { $(id)?.classList.remove('open'); }
function closeModalOverlay(e, id) { if(e.target === $(id)) closeModal(id); }

// Populate chemical selects
function populateChemSelects() {
  const selects = ['logChem','checkChem','advisorChem','animalMed'];
  selects.forEach(selId => {
    const sel = $(selId); if (!sel) return;
    // Preserve first option(s)
    while(sel.options.length > 1) sel.remove(1);
    MRL_DB.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id; opt.textContent = `${c.icon} ${c.name} (${c.target})`;
      sel.appendChild(opt);
    });
  });
}

/* ============================================================
   FARM MRL PORTAL — app.js Part 2: Page Renderers
   ============================================================ */

// -- Farm Health Score ------------------------------------------
function calcHealthScore() {
  const logs = DB.logs();
  if (!logs.length) return { score:100, grade:'A+', color:'#22c55e' };
  let safe=0, warn=0, danger=0;
  logs.forEach(l => {
    const r = calcMRLRisk(l.chemId, l.dose, l.unit);
    if (!r) { safe++; return; }
    if (r.status==='safe') safe++;
    else if (r.status==='warning') warn++;
    else danger++;
  });
  const total = logs.length;
  const score = Math.max(0, Math.round(100 - (danger/total)*60 - (warn/total)*20));
  let grade='A+', color='#22c55e';
  if (score<50) { grade='F'; color='#ef4444'; }
  else if (score<60) { grade='D'; color='#f87171'; }
  else if (score<70) { grade='C'; color='#fb923c'; }
  else if (score<80) { grade='B'; color='#fbbf24'; }
  else if (score<90) { grade='A'; color='#4ade80'; }
  return { score, grade, color };
}

function updateScoreBadge() {
  const { score, grade, color } = calcHealthScore();
  $('scoreNum').textContent = score;
  $('scoreGrade').textContent = 'Grade ' + grade;
  const circle = $('scoreCircle');
  if (circle) {
    circle.style.stroke = color;
    circle.style.strokeDasharray = Math.round((score/100)*107) + ' 107';
  }
}

// -- DASHBOARD --------------------------------------------------
function renderDashboard() {
  generateAlerts();
  updateScoreBadge();
  renderUrgentBanner();
  renderStatGrid();
  renderRecentActivity();
  renderAlertSummary();
  renderDashCharts();
}

function renderUrgentBanner() {
  const alerts = DB.alerts().filter(a=>!a.dismissed && a.priority==='high');
  const el = $('urgentBanner'); if (!el) return;
  if (!alerts.length) { el.innerHTML=''; return; }
  const a = alerts[0];
  const icon = a.type === 'danger' ? '❌' : a.type === 'warning' ? '⚠️' : '💡';
  el.innerHTML = `<div class="alert-banner alert-${a.type}" style="margin-bottom:20px;"><div style="font-size:20px;flex-shrink:0;">${icon}</div><div class="alert-body"><strong>${a.title}</strong><span>${a.body}</span></div><button class="alert-dismiss" onclick="dismissAlert('${a.id}');renderDashboard();">✕</button></div>`;
}

function renderStatGrid() {
  const logs = DB.logs();
  const crops = DB.crops();
  const animals = DB.animals();
  const activeAlerts = DB.alerts().filter(a=>!a.dismissed).length;
  const { score } = calcHealthScore();
  let safe=0, danger=0;
  logs.forEach(l=>{ const r=calcMRLRisk(l.chemId,l.dose,l.unit); if(r && r.status==='danger') danger++; else safe++; });
  const stats = [
    { label:'Total Log Entries', value:logs.length, icon:'📊', accent:'#22c55e', iconBg:'rgba(34,197,94,0.1)', trend:logs.length>0?'+'+logs.length:'0', trendType:'up', sub:'All time records', page:'logger' },
    { label:'Active Alerts', value:activeAlerts, icon:'🔔', accent:'#f59e0b', iconBg:'rgba(245,158,11,0.1)', trend:activeAlerts>0?'action needed':'clear', trendType:activeAlerts>0?'down':'up', sub:'Requires attention', page:'alerts' },
    { label:'Crops Tracked', value:crops.length, icon:'🌾', accent:'#4ade80', iconBg:'rgba(74,222,128,0.1)', trend:crops.length+' fields', trendType:'neutral', sub:'Active fields', page:'crops' },
    { label:'Animals Monitored', value:animals.length, icon:'🐄', accent:'#fbbf24', iconBg:'rgba(251,191,36,0.1)', trend:animals.length+' heads', trendType:'neutral', sub:'Livestock tracked', page:'animals' },
    { label:'MRL Violations', value:danger, icon:'⚠️', accent:'#ef4444', iconBg:'rgba(239,68,68,0.1)', trend:danger>0?'high risk':'none', trendType:danger>0?'down':'up', sub:'Last 30 days', page:'checker' },
    { label:'Compliance Rate', value:logs.length>0?Math.round(safe/logs.length*100)+'%':'--', icon:'🛡️', accent:'#22d3ee', iconBg:'rgba(34,211,238,0.1)', trend:score+'pts', trendType:score>=80?'up':'down', sub:'Farm health score', page:'reports' },
  ];
  $('statGrid').innerHTML = stats.map(s=>`<div class="stat-card" style="--card-accent:${s.accent};--card-icon-bg:${s.iconBg}; cursor:pointer;" onclick="navigate('${s.page}')"><div class="stat-card-top"><div class="stat-icon">${s.icon}</div><div class="stat-trend trend-${s.trendType}">${s.trend}</div></div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div><div class="stat-sub">${s.sub}</div></div>`).join('');
}

function renderRecentActivity() {
  const logs = DB.logs().slice().reverse().slice(0,8);
  const el = $( 'recentActivity' ); if (!el) return;
  if (!logs.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">📂</div><div class="empty-title">No logs yet</div><div class="empty-sub">Add your first chemical usage log</div></div>'; return; }
  el.innerHTML = logs.map(l=>{
    const risk = calcMRLRisk(l.chemId,l.dose,l.unit);
    const rIcon  = risk ? ({safe:'✅',warning:'⚠️',danger:'❌'}[risk.status]) : '📋';
    return `<div class="activity-item">
      <div class="activity-dot" style="background:var(--${risk?.status||'safe'}-bg)">${rIcon}</div>
      <div class="activity-content">
        <div class="activity-title">${l.chemName || l.chemId}</div>
        <div class="activity-meta">${l.dose} ${l.unit} • ${l.target} • ${fmtDate(l.date)}</div>
      </div>
      <div class="activity-badge">
        <span class="risk-badge risk-${risk?.status || 'safe'}">${(risk ? risk.status.toUpperCase() : 'LOGGED')}</span>
      </div>
    </div>`;
  }).join('');
}

function renderAlertSummary() {
  const alerts = DB.alerts().filter(a=>!a.dismissed).slice(0,5);
  const el = $('alertSummaryList'); if (!el) return;
  if (!alerts.length) {
    el.innerHTML='<div class="empty-state" style="padding:30px 0;"><div class="empty-icon">🔔</div><div class="empty-title">All Clear!</div><div class="empty-sub">No active alerts on your farm</div></div>';
    return;
  }
  el.innerHTML = alerts.map(a=>`
    <div class="alert-banner alert-${a.type}" style="margin-bottom:8px;">
      <div class="alert-body">
        <strong>${a.title}</strong>
        <span>${a.body.substring(0,80)}${a.body.length>80?'…':''}</span>
      </div>
      <button class="alert-dismiss" onclick="dismissAlert('${a.id}');renderDashboard();">✕</button>
    </div>`).join('');
}

let dashPie=null, dashLine=null;
function renderDashCharts() {
  const logs = DB.logs();
  let safe=0,warn=0,danger=0;
  logs.forEach(l=>{ const r=calcMRLRisk(l.chemId,l.dose,l.unit); if(!r||r.status==='safe') safe++; else if(r.status==='warning') warn++; else danger++; });
  const pcv=$('dashPieChart');
  if(pcv){ if(dashPie) dashPie.destroy(); dashPie=new Chart(pcv,{type:'doughnut',data:{labels:['Safe','Warning','Unsafe'],datasets:[{data:[safe||1,warn,danger],backgroundColor:['rgba(34,197,94,0.8)','rgba(251,191,36,0.8)','rgba(239,68,68,0.8)'],borderWidth:0,hoverOffset:6}]},options:{cutout:'70%',plugins:{legend:{position:'bottom',labels:{color:'#86efac',font:{size:11},padding:12}}}}}); }
  const now=new Date(); const labels=[],counts=[];
  for(let i=6;i>=0;i--){ const d=new Date(now); d.setDate(d.getDate()-i); const ds=d.toISOString().split('T')[0]; labels.push(d.toLocaleDateString('en-IN',{weekday:'short'})); counts.push(logs.filter(l=>l.date===ds).length); }
  const lcv=$('dashLineChart');
  if(lcv){ if(dashLine) dashLine.destroy(); dashLine=new Chart(lcv,{type:'line',data:{labels,datasets:[{label:'Logs per day',data:counts,borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,0.1)',fill:true,tension:0.4,pointBackgroundColor:'#22c55e',pointRadius:4}]},options:{plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(34,197,94,0.06)'},ticks:{color:'#4b7a5a'}},y:{grid:{color:'rgba(34,197,94,0.06)'},ticks:{color:'#4b7a5a',stepSize:1},beginAtZero:true}}}}); }
}

// -- ALERT CENTER -----------------------------------------------
function renderAlerts() {
  generateAlerts();
  const alerts = DB.alerts();
  const el = $( 'alertCenterList' ); if (!el) return;
  if (!alerts.length) {
    el.innerHTML=`<div class="empty-state">
        <div class="empty-icon">📢</div>
        <div class="empty-title">No alerts generated</div>
        <div class="empty-sub">Add usage logs to start receiving safety alerts</div>
      </div>`;
    return;
  }
  const priority={high:0,medium:1,low:2};
  const sorted=alerts.slice().sort((a,b)=>priority[a.priority]-priority[b.priority]);
  const priLabel={high:'🔴 High Priority',medium:'🟠 Medium',low:'🔵 Low'};
  let html='',prevPri=null;
  sorted.forEach(a=>{
    if(a.priority!==prevPri){ html+=`<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);padding:16px 0 8px;">${priLabel[a.priority]}</div>`; prevPri=a.priority; }
    html+=`<div class="alert-banner alert-${a.type}" style="opacity:${(a.dismissed?'0.4':'1')};margin-bottom:10px;">
        <div class="alert-body">
          <strong>${a.title}</strong>
          <span>${a.body}</span>
          <div style="margin-top:4px;font-size:10px;color:var(--text-muted);">${fmtDate(a.date)} • ${a.source}</div>
        </div>
        ${(!a.dismissed?`<button class="alert-dismiss" onclick="dismissAlert('${a.id}');renderAlerts();">✕</button>`:'<span style="font-size:11px;color:var(--text-muted);">Dismissed</span>')}
      </div>`;
  });
  el.innerHTML=html;
}

function dismissAlert(id) { const alerts=DB.alerts().map(a=>a.id===id?{...a,dismissed:true}:a); DB.saveAlerts(alerts); updateAlertBadge(); }
function dismissAllAlerts() { DB.saveAlerts(DB.alerts().map(a=>({...a,dismissed:true}))); updateAlertBadge(); renderAlerts(); toast('All alerts dismissed','success'); }

// -- USAGE LOGGER -----------------------------------------------
let logType='crop';
function setLogType(t) {
  logType=t;
  $('logTypeCrop').classList.toggle('active',t==='crop');
  $('logTypeAnimal').classList.toggle('active',t==='animal');
  $('logCropGroup').style.display=t==='crop'?'':'none';
  $('logAnimalGroup').style.display=t==='animal'?'':'none';
}
function renderLogger() { filterLogs(); }
function filterLogs() {
  const q=($('logSearch')?.value||'').toLowerCase();
  const type=$('logFilterType')?.value||'';
  const status=$('logFilterStatus')?.value||'';
  let logs=DB.logs().slice().reverse();
  if(q) logs=logs.filter(l=>(l.chemName||'').toLowerCase().includes(q)||(l.target||'').toLowerCase().includes(q));
  if(type) logs=logs.filter(l=>l.logType===type);
  if(status) logs=logs.filter(l=>{ const r=calcMRLRisk(l.chemId,l.dose,l.unit); return r?.status===status||(status==='safe'&&!r); });
  const tbody=$('logTableBody'); if(!tbody) return;
  const empty=$('logEmptyState');
  if(!logs.length){ tbody.innerHTML=''; if(empty) empty.classList.remove('hidden'); return; }
  if(empty) empty.classList.add('hidden');
  tbody.innerHTML=logs.map(l=>{
    const risk=calcMRLRisk(l.chemId,l.dose,l.unit);
    const chem=MRL_DB.find(c=>c.id===l.chemId);
    const typeIcon = l.logType==='crop' ? '🌾' : '🐄';
    return `<tr>
      <td class="mono">${fmtDate(l.date)}</td>
      <td><div class="chem-name">${l.chemName||l.chemId}</div><div class="text-xs text-muted">${l.batch||''}</div></td>
      <td class="mono">${l.dose} ${l.unit}</td>
      <td>${typeIcon} <span class="text-sm">${l.target}</span></td>
      <td><span class="risk-badge risk-${risk?.status||'safe'}">${risk?.label||'✅ Safe'}</span></td>
      <td class="mono">${chem?chem.withdrawal:'--'} days</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteLog('${l.id}')">🗑</button></td>
    </tr>`;
  }).join('');
}
function previewLogRisk() {
  const chemId=$('logChem')?.value, dose=$('logDose')?.value, unit=$('logUnit')?.value, preview=$('logRiskPreview'); if(!preview) return;
  if(!chemId||chemId==='__custom__'||!dose){ preview.style.display='none'; return; }
  const risk=calcMRLRisk(chemId,dose,unit); if(!risk){ preview.style.display='none'; return; }
  const chem=MRL_DB.find(c=>c.id===chemId);
  preview.style.display='';
  preview.innerHTML='<div class="alert-banner alert-'+risk.status+'"><div class="alert-body"><strong>Risk Preview: '+risk.label+'</strong><span>Your dose is '+Math.round(risk.ratio*100)+'% of MRL limit ('+chem.mrl+' '+chem.unit+'). Withdrawal: '+chem.withdrawal+' days.</span></div></div>';
}
function saveLog() {
  const chemId=$('logChem')?.value; const isCustom=chemId==='__custom__';
  const chemName=isCustom?($('logCustomChem')?.value||'').trim():(MRL_DB.find(c=>c.id===chemId)?.name||chemId);
  const dose=$('logDose')?.value;
  if(!dose||(!chemId&&!chemName)){ toast('Please fill in required fields','warning'); return; }
  const target=logType==='crop'?($('logCropType')?.value||'Unknown crop'):($('logAnimalId')?.value||'Unknown animal');
  const log={ id:uid(), chemId:isCustom?'':chemId, chemName, dose, unit:$('logUnit')?.value||'mg/kg', date:$('logDate')?.value||today(), logType, target, batch:$('logBatch')?.value||'', notes:$('logNotes')?.value||'' };
  const logs=DB.logs(); logs.push(log); DB.saveLogs(logs);
  closeModal('logModal'); toast('Log saved — '+chemName,'success');
  generateAlerts(); updateScoreBadge();
  if(currentPage==='logger') renderLogger();
  if(currentPage==='dashboard') renderDashboard();
  ['logChem','logDose','logBatch','logCropType','logAnimalId','logNotes'].forEach(id=>{ const el=$(id); if(el) el.value=''; });
  $('logRiskPreview').style.display='none';
}
function deleteLog(id) { DB.saveLogs(DB.logs().filter(l=>l.id!==id)); generateAlerts(); updateScoreBadge(); filterLogs(); toast('Log deleted','info'); }

// -- MRL RISK CHECKER -------------------------------------------
let checkType='crop';
function setCheckType(t){ checkType=t; $('checkTypeCrop').classList.toggle('active',t==='crop'); $('checkTypeAnimal').classList.toggle('active',t==='animal'); }
function renderChecker() {
  const tbody=$('mrlRefBody'); if(!tbody) return;
  tbody.innerHTML=MRL_DB.map(c=>`<tr><td><div class="chem-name">${c.icon} ${c.name}</div><div class="text-xs text-muted">${c.category}</div></td><td><span class="tag tag-${c.type==='crop'?'crop':c.type==='animal'?'medicine':'chemical'}">${c.type}</span></td><td class="mono">${c.mrl} ${c.unit}</td><td class="mono">${c.withdrawal}d</td></tr>`).join('');
  renderCheckHistory();
}
function runQuickScan() {
  const chemId=$('checkChem')?.value, dose=$('checkDose')?.value, unit=$('checkUnit')?.value;
  const display=$('riskDisplay'), icon=$('riskIcon'), label=$('riskLabel'), details=$('riskDetails');
  if(!chemId||!dose){ display.className='risk-display risk-neutral-display'; icon.textContent='❓'; label.textContent='Enter Details'; details.innerHTML=''; return; }
  const risk=calcMRLRisk(chemId,dose,unit); const chem=MRL_DB.find(c=>c.id===chemId);
  if(!risk){ display.className='risk-display risk-neutral-display'; icon.textContent='❓'; label.textContent='No Data'; return; }
  const icons={safe:'✅',warning:'⚠️',danger:'❌'};
  const cssMap={safe:'risk-safe-display',warning:'risk-warning-display',danger:'risk-danger-display'};
  display.className='risk-display '+cssMap[risk.status]; icon.textContent=icons[risk.status]; label.textContent=risk.status.toUpperCase();
  const pct=Math.round(risk.ratio*100); const barColor=risk.status==='safe'?'var(--safe)':risk.status==='warning'?'var(--warning)':'var(--danger)';
  details.innerHTML=`<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:4px;"><span>Dosage vs MRL limit</span><span class="font-mono">${pct}%</span></div><div class="risk-meter"><div class="risk-meter-fill" style="width:${Math.min(pct,100)}%;background:${barColor};"></div></div></div><div style="font-size:12px;color:var(--text-muted);"><div>💉 Your dose: <span style="color:var(--text-primary);font-weight:600;">${dose} ${unit}</span></div><div>📏 Safe limit: <span style="color:var(--text-primary);font-weight:600;">${chem.mrl} ${chem.unit}</span></div><div>⏳ Withdrawal: <span style="color:var(--text-primary);font-weight:600;">${chem.withdrawal} days</span></div></div><button class="btn btn-secondary btn-sm w-full" style="margin-top:12px;" onclick="saveCheckToHistory('${chemId}','${dose}','${unit}')">📋 Save to History</button>`;
}
function saveCheckToHistory(chemId,dose,unit) {
  const checks=DB.checks(); const chem=MRL_DB.find(c=>c.id===chemId); const risk=calcMRLRisk(chemId,dose,unit);
  checks.unshift({id:uid(),chemId,chemName:chem?.name||chemId,dose,unit,date:today(),status:risk?.status||'safe'});
  DB.saveChecks(checks.slice(0,20)); renderCheckHistory(); toast('Check saved to history','success');
}
function renderCheckHistory() {
  const el=$('checkHistory'); if(!el) return;
  const checks=DB.checks();
  if(!checks.length){ el.innerHTML='<div class="empty-state" style="padding:24px 0;"><div class="empty-icon">🔍</div><div class="empty-title">No checks yet</div><div class="empty-sub">Run a quick scan above to build history</div></div>'; return; }
  el.innerHTML=checks.slice(0,8).map(c=>{
    const statusIcon = c.status==='safe'?'✅':c.status==='warning'?'⚠️':'❌';
    return `<div class="activity-item"><div class="activity-dot" style="background:var(--${c.status==='safe'?'safe':c.status==='warning'?'warning':'danger'}-bg)">${statusIcon}</div><div class="activity-content"><div class="activity-title">${c.chemName}</div><div class="activity-meta">${c.dose} ${c.unit} — ${fmtDate(c.date)}</div></div><span class="risk-badge risk-${c.status}">${c.status}</span></div>`;
  }).join('');
}

// -- SAFETY ADVISOR -------------------------------------------------
let advisorType='crop';
function setAdvisorType(t){ advisorType=t; $('advTypeCrop').classList.toggle('active',t==='crop'); $('advTypeAnimal').classList.toggle('active',t==='animal'); }
function renderAdvisor() { renderOveruseDetection(); }
function runAdvisor() {
  const chemId=$('advisorChem')?.value, concern=$('advisorConcern')?.value||'general', el=$('advisorOutput');
  if(!chemId){ toast('Please select a chemical first','warning'); return; }
  const chem=MRL_DB.find(c=>c.id===chemId); if(!chem) return;
  el.innerHTML='<div class="card" style="text-align:center;padding:48px;"><div style="font-size:36px;margin-bottom:12px;">🧠</div><div class="thinking-dots"><span></span><span></span><span></span></div><div style="font-size:13px;color:var(--text-muted);margin-top:10px;">Analyzing safety parameters...</div></div>';
  setTimeout(()=>buildAdvisorResponse(chem,concern),1200);
}
function buildAdvisorResponse(chem,concern) {
  const logs=DB.logs().filter(l=>l.chemId===chem.id);
  const recentCount=logs.filter(l=>daysDiff(today(),l.date)<=30).length;
  const safeDate=new Date(); safeDate.setDate(safeDate.getDate()+chem.withdrawal);
  const sections=[
    {title:'⏳ Withdrawal & Safety Window',items:['Safe withdrawal period: <strong>'+chem.withdrawal+' days</strong> after last application.','Earliest safe '+(chem.type==='animal'?'slaughter/milk':'harvest')+' date from today: <strong>'+fmtDate(safeDate)+'</strong>.',chem.withdrawal>30?'⚠️ Long withdrawal detected — plan crop/livestock cycles accordingly.':'Short withdrawal — relatively flexible scheduling.',]},
    {title:'💉 Dosage Guidance',items:['Approved MRL limit: <strong>'+chem.mrl+' '+chem.unit+'</strong> for '+chem.target+'.','Always measure with calibrated equipment. Avoid estimating dosage.','Environmental factors (rain, heat) can affect residue levels — apply 20% buffer margin.',recentCount>=2?'⚡ Applied '+recentCount+'x in last 30 days — consider rotation.':'Usage frequency is within acceptable range.',]},
  ];
  if(chem.alternatives.length) sections.push({title:'🌿 Safer Alternatives',items:[...chem.alternatives.map(alt=>'<strong>'+alt+'</strong> — generally lower residue profile than '+chem.name+'.'), 'Rotate between alternatives to prevent resistance development.','Biological controls (neem, Bt sprays) where applicable.']});
  const concernAdvice={overdose:['If overdose suspected, flush treated area with water immediately.','Do not harvest for at least '+(chem.withdrawal*1.5)+' days after overdose.','Notify local agricultural extension officer.'],combination:['Avoid mixing '+chem.name+' with alkaline compounds — reduces efficacy.','Wait 5-7 days between different chemical applications.','Check tank-mix compatibility charts before combining.'],withdrawal:['Strictly observe '+chem.withdrawal+'-day withdrawal before market.','Test a sample batch before bulk sale if unsure.','MRL violations can result in legal penalties and crop rejection.'],alternatives:['Consider Integrated Pest Management (IPM) approach.','Pheromone traps can reduce insecticide needs by 40%.','Crop rotation disrupts pest life cycles naturally.'],general:['Store '+chem.name+' in cool, dry, locked storage.','Use full PPE: gloves, mask, goggles during application.','Dispose of empty containers at approved hazardous waste sites.']};
  if(concernAdvice[concern]) sections.push({title:'🎯 Specific Guidance',items:concernAdvice[concern]});
  if(chem.notes) sections.push({title:'📌 Expert Note',items:[chem.notes]});
  $('advisorOutput').innerHTML='<div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;"><div style="font-size:24px;">'+chem.icon+'</div><div><div style="font-size:17px;font-weight:700;">'+chem.name+'</div><div style="font-size:12px;color:var(--text-muted);">'+chem.category+' — '+chem.target+'</div></div><span class="risk-badge risk-'+(chem.risk==='low'?'safe':chem.risk==='moderate'?'warning':'danger')+'" style="margin-left:auto;">'+chem.risk.toUpperCase()+' RISK</span></div><div class="advisor-response" style="margin-top:16px;">'+sections.map(s=>'<div class="advisor-section"><div class="advisor-section-title">'+s.title+'</div>'+s.items.map(i=>'<div class="advisor-item">'+i+'</div>').join('')+'</div>').join('<div class="divider"></div>')+'</div>';
}
function renderOveruseDetection() {
  const el=$('overuseList'); if(!el) return;
  const logs=DB.logs(); const chemCount={};
  logs.forEach(l=>{ if(!l.chemId) return; const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-30); if(new Date(l.date)>=cutoff) chemCount[l.chemId]=(chemCount[l.chemId]||0)+1; });
  const overused=Object.entries(chemCount).filter(([,c])=>c>=2);
  if(!overused.length){ el.innerHTML='<div class="empty-state" style="padding:24px 0;"><div class="empty-icon">✅</div><div class="empty-title">No overuse detected</div><div class="empty-sub">Chemical usage frequency is within normal range</div></div>'; return; }
  el.innerHTML=overused.map(([chemId,count])=>{ const chem=MRL_DB.find(c=>c.id===chemId); const severity=count>=4?'danger':count>=3?'warning':'safe'; const sevIcon=count>=4?'❌':count>=3?'⚠️':'✅'; return '<div class="activity-item"><div class="activity-dot" style="background:var(--'+severity+'-bg)">'+sevIcon+'</div><div class="activity-content"><div class="activity-title">'+(chem?.name||chemId)+'</div><div class="activity-meta">Used <strong>'+count+'x</strong> in last 30 days</div></div><span class="risk-badge risk-'+severity+'">'+(count>=4?'HIGH':count>=3?'WATCH':'OK')+'</span></div>'; }).join('');
}



// ── ENCYCLOPEDIA ───────────────────────────────────────────────
let encTypeFilter = 'all';
function renderEncyclopedia() {
  filterEncyclopedia();
}
function filterEncByType(type, btn) {
  encTypeFilter = type;
  document.querySelectorAll('#page-encyclopedia .chart-period-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  filterEncyclopedia();
}
function filterEncyclopedia() {
  const q = ($('encSearch')?.value||'').toLowerCase();
  let items = MRL_DB;
  if (encTypeFilter !== 'all') items = items.filter(c=>c.type===encTypeFilter);
  if (q) items = items.filter(c=>c.name.toLowerCase().includes(q)||c.category.toLowerCase().includes(q)||c.target.toLowerCase().includes(q));
  const el = $('encyclopediaGrid'); if (!el) return;
  if (!items.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">🔬</div><div class="empty-title">No chemicals found</div></div>'; return; }
  el.innerHTML = items.map(c=>`
    <div class="enc-card">
      <div class="enc-icon">${c.icon}</div>
      <div>
        <div class="enc-name">${c.name}</div>
        <div class="enc-target">${c.category} · ${c.target}</div>
        <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
          <span class="tag tag-${c.type==='crop'?'crop':c.type==='animal'?'medicine':'chemical'}">${c.type}</span>
          <span class="tag" style="background:var(--${c.risk==='low'?'safe':c.risk==='moderate'?'warning':'danger'}-bg);color:var(--${c.risk==='low'?'safe':c.risk==='moderate'?'warning':'danger'});">${c.risk} risk</span>
        </div>
        ${c.notes?`<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">📌 ${c.notes}</div>`:''}
        ${c.alternatives.length?`<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">🌿 Alt: ${c.alternatives.join(', ')}</div>`:''}
      </div>
      <div style="text-align:right;margin-left:auto;flex-shrink:0;">
        <div class="enc-limit">${c.mrl} ${c.unit}</div>
        <div style="font-size:10px;color:var(--text-muted);">MRL Limit</div>
        <div style="font-size:12px;font-weight:600;color:var(--amber-400);margin-top:4px;">${c.withdrawal}d</div>
        <div style="font-size:10px;color:var(--text-muted);">Withdrawal</div>
      </div>
    </div>`).join('');
}

// ── CROP MANAGER ───────────────────────────────────────────────
function renderCrops() {
  const crops = DB.crops();
  const grid = $('cropGrid');
  const empty = $('cropEmpty');
  if (!grid) return;
  if (!crops.length) { grid.innerHTML=''; if(empty) empty.classList.remove('hidden'); return; }
  if(empty) empty.classList.add('hidden');
  const now = new Date();
  grid.innerHTML = crops.map(crop=>{
    const icon = Object.entries(CROP_ICONS).find(([k])=>crop.name.toLowerCase().includes(k))?.[1] || CROP_ICONS.default;
    const progress = STAGE_PROGRESS[crop.stage] || 20;
    const stageIcon = STAGE_ICONS[crop.stage] || '🌿';
    const cropLogs = DB.logs().filter(l=>l.logType==='crop'&&(l.target||'').toLowerCase().includes(crop.name.toLowerCase()));
    const lastSpray = cropLogs.length ? cropLogs.slice(-1)[0] : null;
    let harvestStatus = '', harvestColor='var(--safe)';
    if (lastSpray) {
      const chem = MRL_DB.find(c=>c.id===lastSpray.chemId);
      if (chem) {
        const sprayDate = new Date(lastSpray.date);
        const safeHarvestDate = new Date(sprayDate); safeHarvestDate.setDate(safeHarvestDate.getDate()+chem.withdrawal);
        const daysLeft = Math.ceil((safeHarvestDate - now)/(1000*60*60*24));
        if (daysLeft > 0) { harvestStatus = daysLeft+'d until safe harvest'; harvestColor='var(--warning)'; }
        else { harvestStatus = 'Safe to harvest now'; harvestColor='var(--safe)'; }
      }
    }
    const expectedHarvest = crop.harvestDate ? fmtDate(crop.harvestDate) : 'Not set';
    const daysToHarvest = crop.harvestDate ? Math.ceil((new Date(crop.harvestDate)-now)/(1000*60*60*24)) : null;
    return `<div class="crop-card">
      <div class="crop-header">
        <div class="crop-icon">${icon}</div>
        <div>
          <div class="crop-name">${crop.name}</div>
          <div class="crop-variety">${crop.variety||'—'} · ${crop.area||'—'}</div>
        </div>
        <div style="margin-left:auto;text-align:right;">
          <div style="font-size:20px;">${stageIcon}</div>
          <div style="font-size:10px;color:var(--text-muted);">${crop.stage}</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Growth Progress</div>
      <div class="growth-bar"><div class="growth-fill" style="width:${progress}%;"></div></div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">${progress}% complete · ${crop.fieldId||'No field ID'}</div>
      <div class="crop-stats">
        <div class="crop-stat">
          <div class="crop-stat-label">Planted</div>
          <div class="crop-stat-value">${crop.plantDate?fmtDate(crop.plantDate):'—'}</div>
        </div>
        <div class="crop-stat">
          <div class="crop-stat-label">Expected Harvest</div>
          <div class="crop-stat-value">${expectedHarvest}</div>
        </div>
        <div class="crop-stat">
          <div class="crop-stat-label">Treatments</div>
          <div class="crop-stat-value">${cropLogs.length} logged</div>
        </div>
        <div class="crop-stat">
          <div class="crop-stat-label">Days to Harvest</div>
          <div class="crop-stat-value">${daysToHarvest!==null?(daysToHarvest>0?daysToHarvest+'d':'Ready!'):'—'}</div>
        </div>
      </div>
      ${harvestStatus?`<div style="margin-top:10px;font-size:12px;font-weight:600;color:${harvestColor};background:rgba(0,0,0,0.15);padding:6px 10px;border-radius:6px;">🌾 ${harvestStatus}</div>`:''}
      <div style="display:flex;gap:6px;margin-top:12px;">
        <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="openModal('logModal')">+ Log Treatment</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCrop('${crop.id}')">🗑</button>
      </div>
    </div>`;
  }).join('');
}

function saveCrop() {
  const name = $('cropName')?.value.trim();
  if (!name) { toast('Please enter a crop name','warning'); return; }
  const crop = {
    id:uid(), name, variety:$('cropVariety')?.value||'', area:$('cropArea')?.value||'',
    plantDate:$('cropPlantDate')?.value||'', harvestDate:$('cropHarvestDate')?.value||'',
    stage:$('cropStage')?.value||'vegetative', fieldId:$('cropFieldId')?.value||''
  };
  const crops = DB.crops(); crops.push(crop); DB.saveCrops(crops);
  closeModal('cropModal'); toast('Crop added — '+name,'success');
  renderCrops();
  ['cropName','cropVariety','cropArea','cropPlantDate','cropHarvestDate','cropFieldId'].forEach(id=>{ const el=$(id); if(el) el.value=''; });
}
function deleteCrop(id) { DB.saveCrops(DB.crops().filter(c=>c.id!==id)); renderCrops(); toast('Crop removed','info'); }

// ── ANIMAL TRACKER ─────────────────────────────────────────────
function renderAnimals() {
  const animals = DB.animals();
  const grid = $('animalGrid');
  const empty = $('animalEmpty');
  if (!grid) return;
  if (!animals.length) { grid.innerHTML=''; if(empty) empty.classList.remove('hidden'); return; }
  if(empty) empty.classList.add('hidden');
  const now = new Date();
  grid.innerHTML = animals.map(animal=>{
    const icon = SPECIES_ICONS[animal.species] || '🐾';
    let withdrawalHtml = '';
    if (animal.medId && animal.medDate) {
      const chem = MRL_DB.find(c=>c.id===animal.medId);
      if (chem) {
        const treatDate = new Date(animal.medDate);
        const safeDate = new Date(treatDate); safeDate.setDate(safeDate.getDate()+chem.withdrawal);
        const daysLeft = Math.ceil((safeDate-now)/(1000*60*60*24));
        const cls = daysLeft<=0?'countdown-safe':daysLeft<=7?'countdown-warning':'countdown-safe';
        const label = daysLeft<=0?'✅ Safe Now':`⏳ ${daysLeft}d left`;
        withdrawalHtml = `<div class="countdown-pill ${cls}">${label}</div>`;
      }
    }
    return `<div class="animal-card">
      <div class="animal-card-header">
        <div class="animal-avatar">${icon}</div>
        <div class="animal-info">
          <div class="animal-name">${animal.name}</div>
          <div class="animal-type">${animal.species} · ${animal.count||1} head · ${animal.age||'—'}</div>
        </div>
        <div class="animal-status">${withdrawalHtml}</div>
      </div>
      ${animal.medId?`<div class="animal-meds"><div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">💊 Treatment History</div>
        <div class="med-item">
          <div class="med-name">${MRL_DB.find(c=>c.id===animal.medId)?.name||animal.medId}</div>
          <div class="med-details">${animal.medDose||'—'} · ${fmtDate(animal.medDate)}</div>
        </div>
      </div>`:'<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">No treatments logged</div>'}
      ${animal.notes?`<div style="font-size:11px;color:var(--text-muted);margin-top:6px;border-top:1px solid var(--border);padding-top:8px;">📝 ${animal.notes}</div>`:''}
      <div style="display:flex;gap:6px;margin-top:12px;">
        <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="openModal('animalModal')">+ Add Treatment</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAnimal('${animal.id}')">🗑</button>
      </div>
    </div>`;
  }).join('');
}

function saveAnimal() {
  const name = $('animalId')?.value.trim();
  if (!name) { toast('Please enter an animal ID','warning'); return; }
  const animal = {
    id:uid(), name, species:$('animalSpecies')?.value||'cattle',
    age:$('animalAge')?.value||'', count:$('animalCount')?.value||1,
    medId:$('animalMed')?.value||'', medDose:$('animalMedDose')?.value||'',
    medDate:$('animalMedDate')?.value||today(), notes:$('animalNotes')?.value||''
  };
  const animals = DB.animals(); animals.push(animal); DB.saveAnimals(animals);
  closeModal('animalModal'); toast('Animal added — '+name,'success');
  generateAlerts(); renderAnimals();
  ['animalId','animalAge','animalCount','animalMedDose','animalNotes'].forEach(id=>{ const el=$(id); if(el) el.value=''; });
}
function deleteAnimal(id) { DB.saveAnimals(DB.animals().filter(a=>a.id!==id)); generateAlerts(); renderAnimals(); toast('Animal removed','info'); }

// ── HARVEST CALENDAR ───────────────────────────────────────────
let calDate = new Date();
function renderCalendar() {
  renderCalendarGrid();
  renderCalendarEvents();
}
function prevCalMonth() { calDate.setMonth(calDate.getMonth()-1); renderCalendar(); }
function nextCalMonth() { calDate.setMonth(calDate.getMonth()+1); renderCalendar(); }

function getCalendarEvents() {
  const events = [];
  const now = new Date();
  
  // 1. Derived events (Logs)
  DB.logs().forEach(log=>{
    const chem = MRL_DB.find(c=>c.id===log.chemId);
    if (!chem || !chem.withdrawal) return;
    const appDate = new Date(log.date);
    const safeDate = new Date(appDate); safeDate.setDate(safeDate.getDate()+chem.withdrawal);
    events.push({ date:safeDate, type:'harvest', label:'Safe harvest: '+(log.chemName||log.chemId)+' on '+log.target, icon:'🌾' });
    // Mark withdrawal window
    for (let i=1; i<chem.withdrawal; i++) {
      const d = new Date(appDate); d.setDate(d.getDate()+i);
      events.push({ date:d, type:'withdraw', label:'Withdrawal period: '+(log.chemName||log.chemId), icon:'⏳' });
    }
  });

  // 2. Animal Withdrawal events
  DB.animals().forEach(animal=>{
    if (!animal.medId || !animal.medDate) return;
    const chem = MRL_DB.find(c=>c.id===animal.medId);
    if (!chem) return;
    const treatDate = new Date(animal.medDate);
    const safeDate = new Date(treatDate); safeDate.setDate(safeDate.getDate()+chem.withdrawal);
    events.push({ date:safeDate, type:'harvest', label:`${animal.name} — Safe product use (${chem.name})`, icon:'🐄' });
  });

  // 3. Crop Harvest events
  DB.crops().forEach(crop=>{
    if (!crop.harvestDate) return;
    events.push({ date:new Date(crop.harvestDate), type:'harvest', label:`${crop.name} — Expected harvest`, icon:'✂️' });
  });

  // 4. Manual Events
  DB.events().forEach(e => {
    events.push({ ...e, date: new Date(e.date), isManual: true });
  });

  return events;
}

function renderCalendarGrid() {
  const el = $('calendarGrid'); if (!el) return;
  const label = $('calMonthLabel');
  if (label) label.textContent = calDate.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  const events = getCalendarEvents();
  const eventMap = {};
  events.forEach(e=>{ const k=e.date.toISOString().split('T')[0]; if(!eventMap[k]) eventMap[k]=[]; eventMap[k].push(e); });
  const year = calDate.getFullYear(), month = calDate.getMonth();
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = days.map(d=>`<div class="cal-day cal-day-header">${d}</div>`).join('');
  for (let i=0;i<firstDay;i++) html+=`<div class="cal-day cal-day-empty"></div>`;
  for (let d=1;d<=daysInMonth;d++) {
    const dateStr = year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const evs = eventMap[dateStr]||[];
    const isToday = dateStr===todayStr;
    let cls = isToday?'cal-day-today':'cal-day-normal';
    if (!isToday && evs.length) { const types=evs.map(e=>e.type); if(types.includes('unsafe')) cls='cal-day-unsafe'; else if(types.includes('harvest')) cls='cal-day-harvest'; else if(types.includes('withdraw')) cls='cal-day-withdraw'; }
    const tip = evs.map(e=>e.label||e.title||'').join(' | ');
    html+=`<div class="cal-day ${cls}" title="${tip}" onclick="openCalEventForDate('${dateStr}')">${d}${evs.length?`<span style="font-size:7px;display:block;line-height:1;">${evs[0].icon}</span>`:''}`;
    html+='</div>';
  }
  el.innerHTML = html;
}

function renderCalendarEvents() {
  const el = $('calendarEvents'); if (!el) return;
  const events = getCalendarEvents();
  const now = new Date();
  // Show upcoming events AND manual events
  const upcoming = events.filter(e=>e.date>=now || e.isManual).sort((a,b)=>a.date-b.date).slice(0,12);
  
  // Add event button at top
  let html = `<div style="margin-bottom:12px;"><button class="btn btn-primary btn-sm w-full" onclick="openAddCalEvent()">+ Add Calendar Event</button></div>`;
  
  if (!upcoming.length) { 
    html += '<div class="empty-state" style="padding:30px 0;"><div class="empty-icon">📅</div><div class="empty-title">No upcoming events</div><div class="empty-sub">Add logs and crops or create manual events</div></div>'; 
    el.innerHTML = html;
    return; 
  }
  html += upcoming.map(e=>{
    const deleteBtn = e.isManual ? `<button class="btn btn-danger btn-sm" style="padding:4px 8px;font-size:10px;" onclick="deleteCalendarEvent('${e.id}')">🗑</button>` : '';
    const editBtn = e.isManual ? `<button class="btn btn-secondary btn-sm" style="padding:4px 8px;font-size:10px;margin-right:4px;" onclick="editCalendarEvent('${e.id}')">✏️</button>` : '';
    return `<div class="activity-item">
      <div class="activity-dot" style="background:var(--${e.type==='harvest'?'safe':'warning'}-bg);">${e.icon||'📅'}</div>
      <div class="activity-content">
        <div class="activity-title">${e.label||e.title||'Event'}</div>
        <div class="activity-meta">${fmtDate(e.date)}${e.isManual?' · Manual event':''}</div>
      </div>
      <div style="display:flex;align-items:center;">${editBtn}${deleteBtn}</div>
    </div>`;
  }).join('');
  el.innerHTML = html;
}

// Calendar CRUD helpers
function openAddCalEvent() {
  $('calEventId').value = '';
  $('calEventTitle').value = '';
  $('calEventDate').value = today();
  $('calEventType').value = 'other';
  openModal('calEventModal');
}

function openCalEventForDate(dateStr) {
  $('calEventId').value = '';
  $('calEventTitle').value = '';
  $('calEventDate').value = dateStr;
  $('calEventType').value = 'other';
  openModal('calEventModal');
}

function editCalendarEvent(id) {
  const events = DB.events();
  const ev = events.find(e => e.id === id);
  if (!ev) return;
  $('calEventId').value = ev.id;
  $('calEventTitle').value = ev.title || '';
  $('calEventDate').value = ev.date || today();
  $('calEventType').value = ev.type || 'other';
  openModal('calEventModal');
}

function saveCalendarEvent() {
  const existingId = $('calEventId')?.value;
  const title = $('calEventTitle')?.value.trim();
  const date = $('calEventDate')?.value;
  const type = $('calEventType')?.value || 'other';
  const iconMap = { harvest:'🌾', withdraw:'⏳', task:'🚜', other:'📅' };
  const icon = iconMap[type] || '📅';

  if (!title || !date) { toast('Please fill in title and date', 'warning'); return; }

  const events = DB.events();
  
  if (existingId) {
    // Update existing
    const idx = events.findIndex(e => e.id === existingId);
    if (idx >= 0) {
      events[idx] = { ...events[idx], title, date, type, icon, label: title };
    }
  } else {
    // Add new
    events.push({ id: uid(), title, date, type, icon, label: title });
  }
  
  DB.saveEvents(events);
  closeModal('calEventModal');
  toast(existingId ? 'Event updated' : 'Event added', 'success');
  renderCalendar();
}

function deleteCalendarEvent(id) {
  if (!confirm('Delete this event?')) return;
  DB.saveEvents(DB.events().filter(e => e.id !== id));
  toast('Event deleted', 'info');
  renderCalendar();
}

// ── REPORTS ────────────────────────────────────────────────────
let reportPeriod = '30d';
let usageTrendChart=null, compliancePieChart=null, topChemChart=null;

function setPeriod(p, btn) {
  reportPeriod = p;
  document.querySelectorAll('#page-reports .chart-period-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderReports();
}

function getLogsInPeriod() {
  const days = reportPeriod==='7d'?7:reportPeriod==='30d'?30:90;
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-days);
  return DB.logs().filter(l=>new Date(l.date)>=cutoff);
}

function renderReports() {
  const logs = getLogsInPeriod();
  let safe=0,warn=0,danger=0;
  logs.forEach(l=>{ const r=calcMRLRisk(l.chemId,l.dose,l.unit); if(!r||r.status==='safe') safe++; else if(r.status==='warning') warn++; else danger++; });
  const total = logs.length;
  const compRate = total>0?Math.round(safe/total*100):100;
  const rsg = $('reportStatGrid');
  if(rsg) rsg.innerHTML=[
    {label:'Logs This Period',value:total,icon:'📋',accent:'#22c55e',iconBg:'rgba(34,197,94,0.1)',trend:reportPeriod,trendType:'neutral',sub:'Total entries'},
    {label:'Compliant',value:safe,icon:'✅',accent:'#22c55e',iconBg:'rgba(34,197,94,0.1)',trend:compRate+'%',trendType:'up',sub:'Safe applications'},
    {label:'Warnings',value:warn,icon:'⚠️',accent:'#fbbf24',iconBg:'rgba(251,191,36,0.1)',trend:warn>0?'review needed':'clear',trendType:warn>0?'down':'up',sub:'Near MRL limit'},
    {label:'Violations',value:danger,icon:'❌',accent:'#ef4444',iconBg:'rgba(239,68,68,0.1)',trend:danger>0?'action required':'none',trendType:danger>0?'down':'up',sub:'Exceeded MRL'},
  ].map(s=>`<div class="stat-card" style="--card-accent:${s.accent};--card-icon-bg:${s.iconBg};"><div class="stat-card-top"><div class="stat-icon">${s.icon}</div><div class="stat-trend trend-${s.trendType}">${s.trend}</div></div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div><div class="stat-sub">${s.sub}</div></div>`).join('');

  renderUsageTrendChart(logs);
  renderCompliancePieChart(safe,warn,danger);
  renderTopChemChart(logs);
  renderReportTable(logs);
  renderHeatmap();
}

function renderUsageTrendChart(logs) {
  const days = reportPeriod==='7d'?7:reportPeriod==='30d'?30:90;
  const now = new Date(); const labels=[],data=[];
  const step = days>30?7:1;
  for(let i=days;i>=0;i-=step){
    const d=new Date(now); d.setDate(d.getDate()-i);
    if(step===7) labels.push(d.toLocaleDateString('en-IN',{month:'short',day:'2-digit'}));
    else if(days<=30) labels.push(d.toLocaleDateString('en-IN',{month:'short',day:'2-digit'}));
    const ds=d.toISOString().split('T')[0];
    if(step===1) data.push(logs.filter(l=>l.date===ds).length);
    else { const week=logs.filter(l=>{ const ld=new Date(l.date); return ld>=new Date(d).setDate(d.getDate()-7)&&ld<=d; }).length; data.push(week); }
  }
  const cv=$('usageTrendChart');
  if(cv){ if(usageTrendChart) usageTrendChart.destroy(); usageTrendChart=new Chart(cv,{type:'line',data:{labels,datasets:[{label:'Applications',data,borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,0.08)',fill:true,tension:0.4,pointBackgroundColor:'#22c55e',pointRadius:3,pointHoverRadius:6}]},options:{plugins:{legend:{labels:{color:'#86efac'}}},scales:{x:{grid:{color:'rgba(34,197,94,0.06)'},ticks:{color:'#4b7a5a',maxTicksLimit:8}},y:{grid:{color:'rgba(34,197,94,0.06)'},ticks:{color:'#4b7a5a',stepSize:1},beginAtZero:true}}}}); }
}

function renderCompliancePieChart(safe,warn,danger) {
  const cv=$('compliancePieChart');
  if(cv){ if(compliancePieChart) compliancePieChart.destroy(); compliancePieChart=new Chart(cv,{type:'doughnut',data:{labels:['Safe','Warning','Unsafe'],datasets:[{data:[safe||0,warn||0,danger||0],backgroundColor:['rgba(34,197,94,0.85)','rgba(251,191,36,0.85)','rgba(239,68,68,0.85)'],borderWidth:2,borderColor:'transparent',hoverOffset:8}]},options:{cutout:'65%',plugins:{legend:{position:'bottom',labels:{color:'#86efac',font:{size:12},padding:16}}}}}); }
}

function renderTopChemChart(logs) {
  const chemCount={};
  logs.forEach(l=>{ chemCount[l.chemName||l.chemId]=(chemCount[l.chemName||l.chemId]||0)+1; });
  const top=Object.entries(chemCount).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const cv=$('topChemChart');
  if(cv){ if(topChemChart) topChemChart.destroy(); topChemChart=new Chart(cv,{type:'bar',data:{labels:top.map(([n])=>n),datasets:[{label:'Applications',data:top.map(([,c])=>c),backgroundColor:'rgba(34,197,94,0.7)',borderColor:'#22c55e',borderWidth:1,borderRadius:6,hoverBackgroundColor:'rgba(34,197,94,0.9)'}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(34,197,94,0.06)'},ticks:{color:'#4b7a5a',stepSize:1},beginAtZero:true},y:{grid:{display:false},ticks:{color:'#86efac'}}}}}); }
}

function renderReportTable(logs) {
  const tbody=$('reportSummaryBody'); if(!tbody) return;
  const chemMap={};
  logs.forEach(l=>{ if(!chemMap[l.chemId||l.chemName]) chemMap[l.chemId||l.chemName]={name:l.chemName||l.chemId,doses:[],statuses:[]}; chemMap[l.chemId||l.chemName].doses.push(parseFloat(l.dose)||0); const r=calcMRLRisk(l.chemId,l.dose,l.unit); chemMap[l.chemId||l.chemName].statuses.push(r?.status||'safe'); });
  tbody.innerHTML=Object.values(chemMap).map(c=>{ const avg=(c.doses.reduce((a,b)=>a+b,0)/c.doses.length).toFixed(2); const safeCount=c.statuses.filter(s=>s==='safe').length; const compRate=Math.round(safeCount/c.statuses.length*100); const cls=compRate===100?'safe':compRate>=70?'warning':'danger'; return `<tr><td class="chem-name">${c.name}</td><td>${c.doses.length}</td><td class="mono">${avg}</td><td><span class="risk-badge risk-${cls}">${compRate}%</span></td></tr>`; }).join('');
}

function renderHeatmap() {
  const el=$('heatmapGrid'); if(!el) return;
  const logs=DB.logs(); const now=new Date();
  const dateMap={};
  logs.forEach(l=>{ dateMap[l.date]=(dateMap[l.date]||0)+1; });
  let html='';
  for(let w=51;w>=0;w--){
    const weekStart=new Date(now); weekStart.setDate(weekStart.getDate()-w*7);
    for(let d=0;d<7;d++){
      const day=new Date(weekStart); day.setDate(day.getDate()-weekStart.getDay()+d);
      const ds=day.toISOString().split('T')[0]; const count=dateMap[ds]||0;
      const opacity=count===0?0:count===1?0.25:count===2?0.5:count===3?0.75:1;
      html+=`<div title="${ds}: ${count} log(s)" style="aspect-ratio:1;border-radius:2px;background:rgba(34,197,94,${opacity});cursor:default;min-height:10px;"></div>`;
    }
  }
  el.innerHTML=html;
}

// ── CSV EXPORT ─────────────────────────────────────────────────
function exportCSV() {
  const logs = DB.logs();
  if (!logs.length) { toast('No logs to export','warning'); return; }
  const header = 'Date,Chemical,Dosage,Unit,Type,Target,Batch,Status,Notes';
  const rows = logs.map(l=>{
    const r=calcMRLRisk(l.chemId,l.dose,l.unit);
    return [l.date,`"${l.chemName||l.chemId}"`,l.dose,l.unit,l.logType,`"${l.target}"`,`"${l.batch||''}"`,r?.status||'safe',`"${(l.notes||'').replace(/"/g,'""')}"`].join(',');
  });
  const csv = [header,...rows].join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='farm-mrl-report-'+today()+'.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('CSV exported successfully','success');
}

// ── CUSTOM CHEM INPUT ──────────────────────────────────────────
document.addEventListener('change', function(e) {
  if (e.target.id === 'logChem') {
    const isCustom = e.target.value === '__custom__';
    $('logCustomChemGroup').style.display = isCustom ? '' : 'none';
    previewLogRisk();
  }
});

function suggestCrop(val) {
  const el = $('cropSuggestions');
  if (!el) return;
  const q = val.toLowerCase().trim();
  if (!q) { el.style.display = 'none'; return; }
  const crops = DB.crops().filter(c => c.name.toLowerCase().includes(q) || (c.fieldId && c.fieldId.toLowerCase().includes(q)));
  if (!crops.length) { el.style.display = 'none'; return; }
  
  el.innerHTML = crops.slice(0, 5).map(c => `
    <div style="padding:8px 12px; cursor:pointer; background:var(--bg-card); margin-bottom:2px; border-radius:4px; font-size:13px; border:1px solid var(--border);" 
         onclick="document.getElementById('logCropType').value='${c.name} (${c.fieldId || 'No field ID'})'; document.getElementById('cropSuggestions').style.display='none';">
      <span style="font-weight:600;">${c.name}</span> <span style="color:var(--text-muted)">(${c.fieldId || 'No field ID'})</span>
    </div>
  `).join('');
  el.style.display = 'block';
}

document.addEventListener('click', (e) => {
  const el = $('cropSuggestions');
  if (el && e.target.id !== 'logCropType') {
    el.style.display = 'none';
  }
});


// ── SEED SAMPLE DATA ───────────────────────────────────────────
function seedSampleData() {
  if (DB.logs().length > 0) return; // Don't overwrite existing data
  const now = new Date();
  const dPast = (days) => { const d=new Date(now); d.setDate(d.getDate()-days); return d.toISOString().split('T')[0]; };
  const dFuture = (days) => { const d=new Date(now); d.setDate(d.getDate()+days); return d.toISOString().split('T')[0]; };
  const logs = [
    {id:uid(),chemId:'chlorpyrifos',chemName:'Chlorpyrifos',dose:'0.03',unit:'mg/kg',date:dPast(3),logType:'crop',target:'Wheat Field A',batch:'WF-A1',notes:'Aphid control'},
    {id:uid(),chemId:'glyphosate',chemName:'Glyphosate',dose:'18',unit:'mg/kg',date:dPast(7),logType:'crop',target:'Soybean Plot B',batch:'SP-B2',notes:'Pre-harvest weed control'},
    {id:uid(),chemId:'imidacloprid',chemName:'Imidacloprid',dose:'0.6',unit:'mg/kg',date:dPast(5),logType:'crop',target:'Tomato Greenhouse',batch:'TG-01',notes:'Whitefly control - slightly over limit'},
    {id:uid(),chemId:'amoxicillin',chemName:'Amoxicillin',dose:'8',unit:'ppb',date:dPast(10),logType:'animal',target:'Cattle Herd-1',batch:'CH-01',notes:'Respiratory infection treatment'},
    {id:uid(),chemId:'ivermectin',chemName:'Ivermectin',dose:'7',unit:'ppb',date:dPast(2),logType:'animal',target:'Sheep Flock-A',batch:'SF-A',notes:'Parasite control'},
    {id:uid(),chemId:'mancozeb',chemName:'Mancozeb',dose:'3',unit:'mg/kg',date:dPast(14),logType:'crop',target:'Potato Field C',batch:'PF-C1',notes:'Late blight prevention'},
    {id:uid(),chemId:'oxytet',chemName:'Oxytetracycline',dose:'180',unit:'ppb',date:dPast(4),logType:'animal',target:'Poultry House-B',batch:'PH-B2',notes:'Bacterial infection'},
    {id:uid(),chemId:'cypermethrin',chemName:'Cypermethrin',dose:'0.08',unit:'mg/kg',date:dPast(20),logType:'crop',target:'Rice Paddy-1',batch:'RP-01',notes:'Stem borer control'},
  ];
  const crops = [
    {id:uid(),name:'Wheat',variety:'HD-2967',area:'5.2 acres',plantDate:dPast(60),harvestDate:dFuture(30),stage:'maturing',fieldId:'North-Field-A'},
    {id:uid(),name:'Tomato',variety:'Hybrid-Cherry',area:'1.8 acres',plantDate:dPast(45),harvestDate:dFuture(45),stage:'fruit',fieldId:'Greenhouse-1'},
    {id:uid(),name:'Soybean',variety:'JS-335',area:'3.0 acres',plantDate:dPast(30),harvestDate:dFuture(60),stage:'flowering',fieldId:'South-Plot-B'},
  ];
  const animals = [
    {id:uid(),name:'Herd-1 Cattle',species:'cattle',age:'2-4 years',count:12,medId:'amoxicillin',medDose:'10 mg/kg',medDate:dPast(10),notes:'Routine treatment - 3 males, 9 females'},
    {id:uid(),name:'Flock-A Sheep',species:'sheep',age:'1-3 years',count:28,medId:'ivermectin',medDose:'0.2 mg/kg',medDate:dPast(2),notes:'Annual deworming program'},
    {id:uid(),name:'Poultry House-B',species:'poultry',age:'6 weeks',count:200,medId:'oxytet',medDose:'10 mg/L in water',medDate:dPast(4),notes:'Broiler batch - respiratory infection'},
  ];
  const events = [
    {id:uid(),title:'Organic Fertilizer Application',date:dFuture(2),type:'task',icon:'🌱',label:'Organic Fertilizer Application'},
    {id:uid(),title:'Soil Sample Collection',date:dFuture(5),type:'task',icon:'🧪',label:'Soil Sample Collection'},
  ];
  DB.saveLogs(logs); DB.saveCrops(crops); DB.saveAnimals(animals); DB.saveEvents(events);
}

// ── ADMIN PANEL ────────────────────────────────────────────────
let _adminStats = null;
async function renderAdmin() {
  if (!currentUser || currentUser.role !== 'admin') {
    const adminPage = $('page-admin');
    if (adminPage) adminPage.innerHTML = '<div class="empty-state"><div class="empty-icon">🔒</div><div class="empty-title">Access Denied</div><div class="empty-sub">Admin access required</div></div>';
    return;
  }
  // Fetch fresh stats
  _adminStats = await apiFetch('GET', '/api/admin/stats');
  if (!_adminStats) return;
  renderAdminStats(_adminStats);
  renderAdminUsers(_adminStats.userStats);
}

function renderAdminStats(stats) {
  const grid = $('adminStatGrid');
  if (!grid) return;
  const cards = [
    { label:'Total Users',   value:stats.totalUsers,   icon:'👥', accent:'#22c55e', iconBg:'rgba(34,197,94,0.1)',  trend:'registered', trendType:'up',     sub:'Platform accounts' },
    { label:'Total Logs',    value:stats.totalLogs,    icon:'📊', accent:'#60a5fa', iconBg:'rgba(96,165,250,0.1)', trend:'all time',   trendType:'neutral', sub:'Usage entries' },
    { label:'Total Crops',   value:stats.totalCrops,   icon:'🌾', accent:'#4ade80', iconBg:'rgba(74,222,128,0.1)', trend:'tracked',    trendType:'neutral', sub:'Active fields' },
    { label:'Total Animals', value:stats.totalAnimals, icon:'🐄', accent:'#fbbf24', iconBg:'rgba(251,191,36,0.1)', trend:'monitored',  trendType:'neutral', sub:'Livestock records' },
  ];
  grid.innerHTML = cards.map(s =>
    `<div class="stat-card" style="--card-accent:${s.accent};--card-icon-bg:${s.iconBg};">
      <div class="stat-card-top"><div class="stat-icon">${s.icon}</div><div class="stat-trend trend-${s.trendType}">${s.trend}</div></div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-sub">${s.sub}</div>
    </div>`).join('');
}

let _adminAllUsers = [];
function renderAdminUsers(users) {
  _adminAllUsers = users;
  filterAdminUsers();
}

function filterAdminUsers() {
  const q = ($('adminUserSearch')?.value || '').toLowerCase();
  const users = _adminAllUsers.filter(u => !q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  const tbody = $('adminUsersBody');
  if (!tbody) return;
  const roleColors = { admin:'var(--danger)', farmer:'var(--safe)', agronomist:'var(--info)' };
  tbody.innerHTML = users.map(u => {
    const isSelf = u.id === currentUser?.id;
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">${u.avatar||'👤'}</span>
        <div><div class="chem-name">${u.name}</div><div class="text-xs text-muted">${u.email||'—'}</div></div>
      </div></td>
      <td class="mono">${u.username}</td>
      <td><span style="color:${roleColors[u.role]||'var(--text-muted)'};font-weight:700;font-size:11px;text-transform:uppercase;">${u.role}</span></td>
      <td style="font-size:12px;">${u.farmName||'—'}</td>
      <td class="mono">${u.logCount}</td>
      <td class="mono">${u.cropCount}</td>
      <td class="mono">${u.animalCount}</td>
      <td class="mono text-xs">${fmtDate(u.lastActive)}</td>
      <td>
        ${!isSelf ? `
          <select class="form-select" style="font-size:11px;padding:4px 8px;width:auto;" onchange="changeUserRole('${u.id}',this.value)">
            <option value="farmer" ${u.role==='farmer'?'selected':''}>Farmer</option>
            <option value="agronomist" ${u.role==='agronomist'?'selected':''}>Agronomist</option>
            <option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>
          </select>
          <button class="btn btn-danger btn-sm" style="margin-left:4px;" onclick="deleteUser('${u.id}','${u.name}')">🗑</button>
        ` : '<span class="text-xs text-muted">(You)</span>'}
      </td>
    </tr>`;
  }).join('');
}

async function changeUserRole(userId, newRole) {
  const res = await apiFetch('PATCH', '/api/admin/users/' + userId, { role: newRole });
  if (res) { toast('Role updated', 'success'); await renderAdmin(); }
  else toast('Failed to update role', 'danger');
}

async function deleteUser(userId, name) {
  if (!confirm('Delete user "' + name + '"? This cannot be undone.')) return;
  const res = await apiFetch('DELETE', '/api/admin/users/' + userId);
  if (res?.ok) { toast('User deleted', 'info'); await renderAdmin(); }
  else toast('Failed to delete user', 'danger');
}

// ── USER PROFILE ───────────────────────────────────────────────
function renderProfile() {
  if (!currentUser) return;
  const roleLabels = { admin:'System Administrator', farmer:'Farmer', agronomist:'Agronomist / Expert' };
  const setEl = (id, v) => { const el=$(id); if(el) el[el.tagName==='INPUT'?'value':'textContent']=v; };
  setEl('profileAvatar', currentUser.avatar||'👤');
  setEl('profileName', currentUser.name);
  setEl('profileRole', roleLabels[currentUser.role]||currentUser.role);
  setEl('profileJoined', 'Member since ' + fmtDate(currentUser.joined||new Date().toISOString()));
  setEl('profileEditName', currentUser.name);
  setEl('profileEditFarm', currentUser.farmName||'');
  setEl('profileEditEmail', currentUser.email||'');
  setEl('profileEditPhone', currentUser.phone||'');
}

async function saveProfile() {
  const name = $('profileEditName')?.value.trim();
  const farmName = $('profileEditFarm')?.value.trim();
  const email = $('profileEditEmail')?.value.trim();
  const phone = $('profileEditPhone')?.value.trim();
  if (!name) { toast('Name cannot be empty', 'warning'); return; }
  const res = await apiFetch('PATCH', '/api/auth/profile', { name, farmName, email, phone });
  if (res && !res.error) {
    currentUser = { ...currentUser, ...res };
    AppData.user = currentUser;
    setupUserUI();
    toast('Profile updated successfully!', 'success');
    renderProfile();
  } else {
    toast(res?.error || 'Failed to save profile', 'danger');
  }
}

async function savePassword() {
  const pwd = $('profileNewPwd')?.value;
  const confirmPwd = $('profileConfirmPwd')?.value;
  if (!pwd || pwd.length < 6) { toast('Password must be at least 6 characters', 'warning'); return; }
  if (pwd !== confirmPwd) { toast('Passwords do not match', 'warning'); return; }
  const res = await apiFetch('PATCH', '/api/auth/profile', { newPassword: pwd });
  if (res && !res.error) {
    toast('Password updated! Please log in again.', 'success');
    $('profileNewPwd').value = '';
    $('profileConfirmPwd').value = '';
  } else {
    toast(res?.error || 'Failed to update password', 'danger');
  }
}

// ── Setup User UI ──────────────────────────────────────────────
function setupUserUI() {
  if (!currentUser) return;

  const roleColors = { admin:'#ef4444', farmer:'#22c55e', agronomist:'#60a5fa' };
  const roleLabels = { admin:'System Admin', farmer:'Farmer', agronomist:'Agronomist' };
  const color = roleColors[currentUser.role] || '#22c55e';

  // Topbar
  const av = $('topbarAvatar');
  if (av) av.textContent = currentUser.avatar || '👤';
  const nm = $('topbarUserName');
  if (nm) nm.textContent = currentUser.name;
  const rl = $('topbarUserRole');
  if (rl) rl.innerHTML = `<span style="color:${color};font-weight:600;">${roleLabels[currentUser.role]||currentUser.role}</span>`;

  // Sidebar
  const sideAvatar = $('userAvatarSidebar');
  if (sideAvatar) sideAvatar.textContent = currentUser.avatar || '👤';
  const sideName = $('userNameSidebar');
  if (sideName) sideName.textContent = currentUser.name;

  // Farm health score badge (keep existing)
  updateScoreBadge();

  // Show admin-only nav items
  if (currentUser.role === 'admin') {
    document.querySelectorAll('.nav-admin-only').forEach(el => { el.style.display = ''; });
  }

  // Hide Log Usage button for agronomists (read-only)
  if (currentUser.role === 'agronomist') {
    const logBtn = $('topbarLogBtn');
    if (logBtn) logBtn.style.display = 'none';
  }
}

// ── INIT ───────────────────────────────────────────────────────
async function init() {
  // Restore theme
  const savedTheme = localStorage.getItem('fmrl_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeBtn = $('themeBtn');
  if (themeBtn) themeBtn.innerHTML = savedTheme === 'dark' ? '🌙 Dark' : '☀️ Light';

  // Date in topbar
  const topbarDate = $('topbarDate');
  if (topbarDate) topbarDate.textContent = new Date().toLocaleDateString('en-IN', {weekday:'short',day:'2-digit',month:'short',year:'numeric'});

  // Auth check (skip if already authed by api-client.js)
  if (typeof checkAuth === 'function' && !currentUser) {
    const ok = await checkAuth();
    if (!ok) return;
  }

  // Link DB shim (from api-client.js)
  if (window.DB_SHIM) Object.assign(DB, window.DB_SHIM);

  // Load all data from API (skip if already loaded)
  if (typeof loadAllData === 'function' && (!AppData.logs || !AppData.logs.length)) {
    await loadAllData();
  }

  // Patch save functions (skip if already patched)
  if (typeof patchSaveFunctions === 'function') {
    patchSaveFunctions();
  }

  // Set up user UI
  if (currentUser) setupUserUI();

  // Populate selects
  populateChemSelects();

  // Seed sample data (only for local/standalone mode)
  if (!window.DB_SHIM) {
    seedSampleData();
  }

  // Generate alerts
  generateAlerts();

  // Render dashboard
  renderDashboard();

  // Default form dates
  const logDateEl = document.getElementById('logDate'); if(logDateEl) logDateEl.value = today();
  const animalMedDateEl = document.getElementById('animalMedDate'); if(animalMedDateEl) animalMedDateEl.value = today();
  
  // Mouse Chaser Logic (Main App)
  if (!document.querySelector('.mouse-chaser')) {
    const chaser = document.createElement('div');
    chaser.className = 'mouse-chaser';
    document.body.appendChild(chaser);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let chaserX = mouseX, chaserY = mouseY;
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    function animateChaser() {
      chaserX += (mouseX - chaserX) * 0.15;
      chaserY += (mouseY - chaserY) * 0.15;
      chaser.style.left = chaserX + 'px';
      chaser.style.top = chaserY + 'px';
      requestAnimationFrame(animateChaser);
    }
    animateChaser();

    document.body.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, input, select, .auth-tab, .quick-btn, .nav-item, .card, .stat-card')) {
        chaser.style.transform = 'translate(-50%, -50%) scale(1.5)';
        chaser.style.opacity = '0.5';
      }
    });
    document.body.addEventListener('mouseout', (e) => {
      if (e.target.closest('button, input, select, .auth-tab, .quick-btn, .nav-item, .card, .stat-card')) {
        chaser.style.transform = 'translate(-50%, -50%) scale(1)';
        chaser.style.opacity = '1';
      }
    });
  }
}
