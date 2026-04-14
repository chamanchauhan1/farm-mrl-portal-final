/* ============================================================
   FARM MRL PORTAL — api-client.js
   Replaces localStorage DB with server API calls.
   Maintains in-memory AppData cache for synchronous rendering.
   ============================================================ */

const API_BASE = '';  // Same origin (served by Express)

// ── In-memory data cache ──────────────────────────────────────
const AppData = {
  logs: [], crops: [], animals: [], checks: [], events: [], alerts: [], user: null
};

// ── Current user (set after auth check) ───────────────────────
let currentUser = null;

// ── Auth helpers ───────────────────────────────────────────────
function getToken() { return localStorage.getItem('fmrl_token'); }

function logout() {
  localStorage.removeItem('fmrl_token');
  localStorage.removeItem('fmrl_user');
  window.location.href = 'login.html';
}

async function checkAuth() {
  const token = getToken();
  if (!token) { window.location.href = 'login.html'; return false; }
  try {
    const res = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + token } });
    if (!res.ok) { logout(); return false; }
    currentUser = await res.json();
    AppData.user = currentUser;
    return true;
  } catch {
    // Server unreachable — show error
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;background:#060d0a;color:#f0fdf4;">
        <div style="text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:16px;">🔌</div>
          <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Server Not Running</h2>
          <p style="color:#4b7a5a;font-size:14px;max-width:320px;">
            Please start the server first:<br><br>
            <code style="background:#111f16;padding:8px 16px;border-radius:8px;display:inline-block;">node server.js</code><br><br>
            Then refresh this page.
          </p>
          <button onclick="window.location.reload()" style="margin-top:20px;padding:10px 24px;background:#22c55e;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">↺ Retry</button>
        </div>
      </div>`;
    return false;
  }
}

// ── API fetch wrapper ──────────────────────────────────────────
async function apiFetch(method, endpoint, body) {
  const token = getToken();
  const opts = {
    method,
    headers: { Authorization: 'Bearer ' + token }
  };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(API_BASE + endpoint, opts);
  if (res.status === 401) { logout(); return null; }
  return res.json();
}

// ── Load all data from API into AppData ────────────────────────
async function loadAllData() {
  const [logs, crops, animals, checks, events] = await Promise.all([
    apiFetch('GET', '/api/logs'),
    apiFetch('GET', '/api/crops'),
    apiFetch('GET', '/api/animals'),
    apiFetch('GET', '/api/checks'),
    apiFetch('GET', '/api/events'),
  ]);
  AppData.logs    = logs    || [];
  AppData.crops   = crops   || [];
  AppData.animals = animals || [];
  AppData.checks  = checks  || [];
  AppData.events  = events  || [];
}

// ── DB shim — same interface as original localStorage DB ───────
// Rendering code calls DB.logs(), DB.crops() etc. synchronously.
// These return from the in-memory cache populated via loadAllData().
window.DB_SHIM = {
  logs:    ()      => AppData.logs,
  crops:   ()      => AppData.crops,
  animals: ()      => AppData.animals,
  checks:  ()      => AppData.checks,
  events:  ()      => AppData.events,
  alerts:  ()      => AppData.alerts || [],

  // Save methods that update the cache
  saveLogs(v)    { AppData.logs = v; },
  saveCrops(v)   { AppData.crops = v; },
  saveAnimals(v) { AppData.animals = v; },
  saveAlerts(v)  { AppData.alerts = v; },
  saveChecks(v)  { AppData.checks = v; },
  saveEvents(v)  { AppData.events = v; },

  // Direct API save methods
  async addLog(log) {
    const saved = await apiFetch('POST', '/api/logs', log);
    if (saved) AppData.logs.push(saved);
    return saved;
  },
  async deleteLog(id) {
    await apiFetch('DELETE', '/api/logs/' + id);
    AppData.logs = AppData.logs.filter(l => l.id !== id);
  },
  async addCrop(crop) {
    const saved = await apiFetch('POST', '/api/crops', crop);
    if (saved) AppData.crops.push(saved);
    return saved;
  },
  async deleteCrop(id) {
    await apiFetch('DELETE', '/api/crops/' + id);
    AppData.crops = AppData.crops.filter(c => c.id !== id);
  },
  async addAnimal(animal) {
    const saved = await apiFetch('POST', '/api/animals', animal);
    if (saved) AppData.animals.push(saved);
    return saved;
  },
  async deleteAnimal(id) {
    await apiFetch('DELETE', '/api/animals/' + id);
    AppData.animals = AppData.animals.filter(a => a.id !== id);
  },
  async addCheck(check) {
    const saved = await apiFetch('POST', '/api/checks', check);
    if (saved) AppData.checks.unshift(saved);
    return saved;
  },
  async saveEvent(event) {
    // Check if update or new
    const existing = AppData.events.find(e => e.id === event.id);
    if (existing) {
      const saved = await apiFetch('PATCH', '/api/events/' + event.id, event);
      if (saved) {
        const idx = AppData.events.findIndex(e => e.id === event.id);
        if (idx >= 0) AppData.events[idx] = saved;
      }
      return saved;
    } else {
      const saved = await apiFetch('POST', '/api/events', event);
      if (saved) AppData.events.push(saved);
      return saved;
    }
  },
  async deleteEvent(id) {
    const res = await apiFetch('DELETE', '/api/events/' + id);
    AppData.events = AppData.events.filter(e => e.id !== id);
    return res;
  },
  get() { return []; },     // legacy compat
  set() {},                  // legacy compat
};

// ── Patch save functions to use API ───────────────────────────
function patchSaveFunctions() {
  // saveLog — override the one in app.js
  window.saveLog = async function() {
    const chemId = document.getElementById('logChem')?.value;
    const isCustom = chemId === '__custom__';
    const chemName = isCustom
      ? (document.getElementById('logCustomChem')?.value || '').trim()
      : (MRL_DB.find(c => c.id === chemId)?.name || chemId);
    const dose = document.getElementById('logDose')?.value;
    if (!dose || (!chemId && !chemName)) { toast('Please fill in required fields', 'warning'); return; }
    const target = logType === 'crop'
      ? (document.getElementById('logCropType')?.value || 'Unknown crop')
      : (document.getElementById('logAnimalId')?.value || 'Unknown animal');
    const log = {
      id: uid(), chemId: isCustom ? '' : chemId, chemName, dose,
      unit: document.getElementById('logUnit')?.value || 'mg/kg',
      date: document.getElementById('logDate')?.value || today(),
      logType, target,
      batch: document.getElementById('logBatch')?.value || '',
      notes: document.getElementById('logNotes')?.value || ''
    };
    await DB.addLog(log);
    closeModal('logModal');
    toast('Log saved — ' + chemName, 'success');
    generateAlerts(); updateScoreBadge();
    if (currentPage === 'logger') renderLogger();
    if (currentPage === 'dashboard') renderDashboard();
    ['logChem','logDose','logBatch','logCropType','logAnimalId','logNotes'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    document.getElementById('logRiskPreview').style.display = 'none';
  };

  window.deleteLog = async function(id) {
    await DB.deleteLog(id);
    generateAlerts(); updateScoreBadge();
    filterLogs();
    toast('Log deleted', 'info');
  };

  window.saveCrop = async function() {
    const name = document.getElementById('cropName')?.value.trim();
    if (!name) { toast('Please enter a crop name', 'warning'); return; }
    const crop = {
      id: uid(), name,
      variety: document.getElementById('cropVariety')?.value || '',
      area: document.getElementById('cropArea')?.value || '',
      plantDate: document.getElementById('cropPlantDate')?.value || '',
      harvestDate: document.getElementById('cropHarvestDate')?.value || '',
      stage: document.getElementById('cropStage')?.value || 'vegetative',
      fieldId: document.getElementById('cropFieldId')?.value || ''
    };
    await DB.addCrop(crop);
    closeModal('cropModal');
    toast('Crop added — ' + name, 'success');
    renderCrops();
    ['cropName','cropVariety','cropArea','cropPlantDate','cropHarvestDate','cropFieldId'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  };

  window.deleteCrop = async function(id) {
    await DB.deleteCrop(id);
    renderCrops();
    toast('Crop removed', 'info');
  };

  window.saveAnimal = async function() {
    const name = document.getElementById('animalId')?.value.trim();
    if (!name) { toast('Please enter an animal ID', 'warning'); return; }
    const animal = {
      id: uid(), name,
      species: document.getElementById('animalSpecies')?.value || 'cattle',
      age: document.getElementById('animalAge')?.value || '',
      count: document.getElementById('animalCount')?.value || 1,
      medId: document.getElementById('animalMed')?.value || '',
      medDose: document.getElementById('animalMedDose')?.value || '',
      medDate: document.getElementById('animalMedDate')?.value || today(),
      notes: document.getElementById('animalNotes')?.value || ''
    };
    await DB.addAnimal(animal);
    closeModal('animalModal');
    toast('Animal added — ' + name, 'success');
    generateAlerts(); renderAnimals();
    ['animalId','animalAge','animalCount','animalMedDose','animalNotes'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  };

  window.deleteAnimal = async function(id) {
    await DB.deleteAnimal(id);
    generateAlerts(); renderAnimals();
    toast('Animal removed', 'info');
  };

  window.saveCheckToHistory = async function(chemId, dose, unit) {
    const chem = MRL_DB.find(c => c.id === chemId);
    const risk = calcMRLRisk(chemId, dose, unit);
    await DB.addCheck({ id: uid(), chemId, chemName: chem?.name || chemId, dose, unit, date: today(), status: risk?.status || 'safe' });
    renderCheckHistory();
    toast('Check saved to history', 'success');
  };

  window.saveUser = async function() {
    const username = document.getElementById('addUserName')?.value.trim();
    const name = document.getElementById('addUserFullName')?.value.trim();
    const role = document.getElementById('addUserRole')?.value || 'farmer';
    const email = document.getElementById('addUserEmail')?.value.trim();
    const farmName = document.getElementById('addUserFarmName')?.value.trim();
    const password = document.getElementById('addUserPwd')?.value;

    if (!username || !name || !password) {
      toast('Username, Full Name, and Password are required', 'warning');
      return;
    }

    const res = await apiFetch('POST', '/api/auth/register', { username, name, role, email, farmName, password });
    if (res && res.user) {
      if (role === 'admin') {
         await apiFetch('PATCH', '/api/admin/users/' + res.user.id, { role: 'admin' });
      }
      toast('User added successfully', 'success');
      closeModal('addUserModal');
      ['addUserName','addUserFullName','addUserRole','addUserEmail','addUserFarmName','addUserPwd'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      if (typeof renderAdmin === 'function') await renderAdmin();
    } else {
      toast(res?.error || 'Failed to add user', 'danger');
    }
  };

  // ── Calendar Events (API-backed) ──
  window.saveCalendarEvent = async function() {
    const existingId = document.getElementById('calEventId')?.value;
    const title = document.getElementById('calEventTitle')?.value.trim();
    const date = document.getElementById('calEventDate')?.value;
    const type = document.getElementById('calEventType')?.value || 'other';
    const iconMap = { harvest:'🌾', withdraw:'⏳', task:'🚜', other:'📅' };
    const icon = iconMap[type] || '📅';

    if (!title || !date) { toast('Please fill in title and date', 'warning'); return; }

    if (existingId) {
      // Update via API
      const res = await apiFetch('PATCH', '/api/events/' + existingId, { title, date, type, icon, label: title });
      if (res) {
        const idx = AppData.events.findIndex(e => e.id === existingId);
        if (idx >= 0) AppData.events[idx] = res;
        toast('Event updated', 'success');
      }
    } else {
      // Create new via API
      const id = '_'+Math.random().toString(36).slice(2, 9);
      const res = await DB.saveEvent({ id, title, date, type, icon, label: title });
      if (res) {
        toast('Event added', 'success');
      } else {
        toast('Failed to save event', 'danger');
      }
    }
    
    closeModal('calEventModal');
    renderCalendar();
  };

  window.deleteCalendarEvent = async function(id) {
    if (!confirm('Delete this event?')) return;
    const res = await DB.deleteEvent(id);
    if (res) {
      toast('Event deleted', 'info');
      renderCalendar();
    }
  };
}

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const authed = await checkAuth();
  if (!authed) return;
  
  // Load all data from API
  await loadAllData();
  
  // Now call init() which will skip re-loading since data is already present
  if (typeof window.init === 'function') await window.init();
});
