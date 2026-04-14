/* ============================================================
   FARM MRL PORTAL — server.js
   Backend: Express + JWT + bcryptjs + JSON file storage
   Run: node server.js  (then open http://localhost:3000)
   ============================================================ */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'farm-mrl-portal-jwt-secret-2024-secure';

// ── Middleware ─────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── File-based Data Store ──────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readData(name) {
  const fp = path.join(DATA_DIR, name + '.json');
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return []; }
}
function writeData(name, data) {
  fs.writeFileSync(path.join(DATA_DIR, name + '.json'), JSON.stringify(data, null, 2));
}
function readSettings() {
  const fp = path.join(DATA_DIR, 'settings.json');
  if (!fs.existsSync(fp)) return {};
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return {}; }
}
function writeSettings(data) {
  fs.writeFileSync(path.join(DATA_DIR, 'settings.json'), JSON.stringify(data, null, 2));
}

// ── Auth Middleware ────────────────────────────────────────────
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(h.split(' ')[1], JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid or expired token' }); }
}
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}
function notReadOnly(req, res, next) {
  if (req.user.role === 'agronomist') return res.status(403).json({ error: 'Agronomists have read-only access' });
  next();
}

// ── Seed Default Users ─────────────────────────────────────────
function seedUsers() {
  if (readData('users').length > 0) return;
  const users = [
    { id:'user_admin',    username:'admin',      password:bcrypt.hashSync('admin123',10),  name:'Super Administrator', role:'admin',      email:'admin@farmportal.com',    farmName:'Platform Administration', avatar:'👨‍💼', phone:'', joined:new Date().toISOString() },
    { id:'user_farmer1',  username:'farmer1',    password:bcrypt.hashSync('farmer123',10), name:'Ravi Kumar',          role:'farmer',     email:'ravi@farmportal.com',     farmName:'Kumar Farms - Punjab',    avatar:'👨‍🌾', phone:'+91 98765 43210', joined:new Date().toISOString() },
    { id:'user_farmer2',  username:'farmer2',    password:bcrypt.hashSync('farmer123',10), name:'Priya Singh',         role:'farmer',     email:'priya@farmportal.com',    farmName:'Singh Agro - Haryana',    avatar:'👩‍🌾', phone:'+91 87654 32109', joined:new Date().toISOString() },
    { id:'user_agro1',    username:'agronomist', password:bcrypt.hashSync('agro123',10),   name:'Dr. Anil Sharma',     role:'agronomist', email:'anil@farmportal.com',     farmName:'AgriConsult India',       avatar:'👨‍🔬', phone:'+91 76543 21098', joined:new Date().toISOString() },
  ];
  writeData('users', users);
  console.log('  ✅ Default users seeded');
}

function seedDemoData() {
  if (readData('logs').length > 0) return;
  const now = new Date();
  const dp = (d) => { const x=new Date(now); x.setDate(x.getDate()-d); return x.toISOString().split('T')[0]; };
  const uid = () => '_'+Math.random().toString(36).slice(2,9);
  const ts = new Date().toISOString();

  writeData('logs', [
    {id:uid(),chemId:'chlorpyrifos',chemName:'Chlorpyrifos',dose:'0.03',unit:'mg/kg',date:dp(3),logType:'crop',target:'Wheat Field A',batch:'WF-A1',notes:'Aphid control',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
    {id:uid(),chemId:'imidacloprid',chemName:'Imidacloprid',dose:'0.6',unit:'mg/kg',date:dp(5),logType:'crop',target:'Tomato Greenhouse',batch:'TG-01',notes:'Whitefly - slightly over limit',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
    {id:uid(),chemId:'mancozeb',chemName:'Mancozeb',dose:'3',unit:'mg/kg',date:dp(14),logType:'crop',target:'Potato Field C',batch:'PF-C1',notes:'Late blight prevention',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
    {id:uid(),chemId:'amoxicillin',chemName:'Amoxicillin',dose:'8',unit:'ppb',date:dp(10),logType:'animal',target:'Cattle Herd-1',batch:'CH-01',notes:'Respiratory infection',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
    {id:uid(),chemId:'glyphosate',chemName:'Glyphosate',dose:'18',unit:'mg/kg',date:dp(7),logType:'crop',target:'Soybean Plot B',batch:'SP-B2',notes:'Pre-harvest weed control',userId:'user_farmer2',userName:'Priya Singh',createdAt:ts},
    {id:uid(),chemId:'cypermethrin',chemName:'Cypermethrin',dose:'0.08',unit:'mg/kg',date:dp(20),logType:'crop',target:'Rice Paddy-1',batch:'RP-01',notes:'Stem borer',userId:'user_farmer2',userName:'Priya Singh',createdAt:ts},
    {id:uid(),chemId:'ivermectin',chemName:'Ivermectin',dose:'7',unit:'ppb',date:dp(2),logType:'animal',target:'Sheep Flock-A',notes:'Parasite control',userId:'user_farmer2',userName:'Priya Singh',createdAt:ts},
    {id:uid(),chemId:'oxytet',chemName:'Oxytetracycline',dose:'180',unit:'ppb',date:dp(4),logType:'animal',target:'Poultry House-B',batch:'PH-B2',notes:'Bacterial infection',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
  ]);
  writeData('crops', [
    {id:uid(),name:'Wheat',variety:'HD-2967',area:'5.2 acres',plantDate:dp(60),harvestDate:dp(-30),stage:'maturing',fieldId:'North-Field-A',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
    {id:uid(),name:'Tomato',variety:'Hybrid-Cherry',area:'1.8 acres',plantDate:dp(45),harvestDate:dp(-45),stage:'fruit',fieldId:'Greenhouse-1',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
    {id:uid(),name:'Soybean',variety:'JS-335',area:'3.0 acres',plantDate:dp(30),harvestDate:dp(-60),stage:'flowering',fieldId:'South-Plot-B',userId:'user_farmer2',userName:'Priya Singh',createdAt:ts},
  ]);
  writeData('animals', [
    {id:uid(),name:'Herd-1 Cattle',species:'cattle',age:'2-4 years',count:12,medId:'amoxicillin',medDose:'10 mg/kg',medDate:dp(10),notes:'3 males, 9 females',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
    {id:uid(),name:'Flock-A Sheep',species:'sheep',age:'1-3 years',count:28,medId:'ivermectin',medDose:'0.2 mg/kg',medDate:dp(2),notes:'Annual deworming',userId:'user_farmer2',userName:'Priya Singh',createdAt:ts},
    {id:uid(),name:'Poultry House-B',species:'poultry',age:'6 weeks',count:200,medId:'oxytet',medDose:'10 mg/L',medDate:dp(4),notes:'Broiler batch',userId:'user_farmer1',userName:'Ravi Kumar',createdAt:ts},
  ]);
  writeData('events', [
    {id:uid(),title:'Organic Fertilizer Application',date:dp(-2),type:'manual',icon:'🌱',notes:'Applying compost to North Field',userId:'user_farmer1',createdAt:ts},
    {id:uid(),title:'Soil Sample Collection',date:dp(-5),type:'manual',icon:'🧪',notes:'Sending samples to KV Ag-Lab',userId:'user_farmer1',createdAt:ts},
  ]);
  console.log('  ✅ Demo data seeded');
}

seedUsers();
seedDemoData();

// ══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const users = readData('users');
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid username or password' });
  const token = jwt.sign({ id:user.id, username:user.username, role:user.role, name:user.name }, JWT_SECRET, { expiresIn:'7d' });
  const { password:_, ...safe } = user;
  res.json({ token, user:safe });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, name, email, farmName, phone, role } = req.body;
  if (!username || !password || !name) return res.status(400).json({ error: 'Username, password, and name are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const users = readData('users');
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
    return res.status(409).json({ error: 'Username already taken' });
  const allowedRole = ['farmer','agronomist'].includes(role) ? role : 'farmer';
  const newUser = {
    id: 'user_' + Date.now(),
    username: username.toLowerCase(), password: bcrypt.hashSync(password, 10),
    name, email: email||'', farmName: farmName||'', phone: phone||'',
    role: allowedRole, avatar: allowedRole==='agronomist'?'👨‍🔬':'👨‍🌾',
    joined: new Date().toISOString()
  };
  users.push(newUser);
  writeData('users', users);
  const token = jwt.sign({ id:newUser.id, username:newUser.username, role:newUser.role, name:newUser.name }, JWT_SECRET, { expiresIn:'7d' });
  const { password:_, ...safe } = newUser;
  res.json({ token, user:safe });
});

app.get('/api/auth/me', auth, (req, res) => {
  const users = readData('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password:_, ...safe } = user;
  res.json(safe);
});

app.patch('/api/auth/profile', auth, (req, res) => {
  const users = readData('users');
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  const { password, role, id, username, ...allowed } = req.body; // Prevent changing these via profile
  if (allowed.newPassword) {
    allowed.password = bcrypt.hashSync(allowed.newPassword, 10);
    delete allowed.newPassword;
  }
  users[idx] = { ...users[idx], ...allowed };
  writeData('users', users);
  const { password:_, ...safe } = users[idx];
  res.json(safe);
});

// ══════════════════════════════════════════════════════════════
// LOGS
// ══════════════════════════════════════════════════════════════

app.get('/api/logs', auth, (req, res) => {
  const logs = readData('logs');
  if (req.user.role === 'admin' || req.user.role === 'agronomist') return res.json(logs);
  res.json(logs.filter(l => l.userId === req.user.id));
});

app.post('/api/logs', auth, notReadOnly, (req, res) => {
  const logs = readData('logs');
  const log = { ...req.body, userId:req.user.id, userName:req.user.name, createdAt:new Date().toISOString() };
  logs.push(log);
  writeData('logs', logs);
  res.json(log);
});

app.delete('/api/logs/:id', auth, notReadOnly, (req, res) => {
  let logs = readData('logs');
  const item = logs.find(l => l.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  if (item.userId !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Not authorized' });
  writeData('logs', logs.filter(l => l.id !== req.params.id));
  res.json({ ok:true });
});

// ══════════════════════════════════════════════════════════════
// CROPS
// ══════════════════════════════════════════════════════════════

app.get('/api/crops', auth, (req, res) => {
  const crops = readData('crops');
  if (req.user.role === 'admin' || req.user.role === 'agronomist') return res.json(crops);
  res.json(crops.filter(c => c.userId === req.user.id));
});

app.post('/api/crops', auth, notReadOnly, (req, res) => {
  const crops = readData('crops');
  const crop = { ...req.body, userId:req.user.id, userName:req.user.name, createdAt:new Date().toISOString() };
  crops.push(crop);
  writeData('crops', crops);
  res.json(crop);
});

app.delete('/api/crops/:id', auth, notReadOnly, (req, res) => {
  let crops = readData('crops');
  const item = crops.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  if (item.userId !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Not authorized' });
  writeData('crops', crops.filter(c => c.id !== req.params.id));
  res.json({ ok:true });
});

// ══════════════════════════════════════════════════════════════
// ANIMALS
// ══════════════════════════════════════════════════════════════

app.get('/api/animals', auth, (req, res) => {
  const animals = readData('animals');
  if (req.user.role === 'admin' || req.user.role === 'agronomist') return res.json(animals);
  res.json(animals.filter(a => a.userId === req.user.id));
});

app.post('/api/animals', auth, notReadOnly, (req, res) => {
  const animals = readData('animals');
  const animal = { ...req.body, userId:req.user.id, userName:req.user.name, createdAt:new Date().toISOString() };
  animals.push(animal);
  writeData('animals', animals);
  res.json(animal);
});

app.delete('/api/animals/:id', auth, notReadOnly, (req, res) => {
  let animals = readData('animals');
  const item = animals.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  if (item.userId !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Not authorized' });
  writeData('animals', animals.filter(a => a.id !== req.params.id));
  res.json({ ok:true });
});

// ══════════════════════════════════════════════════════════════
// CHECKS (MRL check history)
// ══════════════════════════════════════════════════════════════

app.get('/api/checks', auth, (req, res) => {
  res.json(readData('checks').filter(c => c.userId === req.user.id));
});

app.post('/api/checks', auth, (req, res) => {
  const checks = readData('checks');
  const check = { ...req.body, userId:req.user.id, createdAt:new Date().toISOString() };
  checks.unshift(check);
  writeData('checks', checks.slice(0, 200));
  res.json(check);
});
// ══════════════════════════════════════════════════════════════
// EVENTS (Manual calendar events)
// ══════════════════════════════════════════════════════════════

app.get('/api/events', auth, (req, res) => {
  const events = readData('events');
  if (req.user.role === 'admin' || req.user.role === 'agronomist') return res.json(events);
  res.json(events.filter(e => e.userId === req.user.id));
});

app.post('/api/events', auth, notReadOnly, (req, res) => {
  const events = readData('events');
  const event = { ...req.body, userId:req.user.id, createdAt:new Date().toISOString() };
  events.push(event);
  writeData('events', events);
  res.json(event);
});

app.patch('/api/events/:id', auth, notReadOnly, (req, res) => {
  const events = readData('events');
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  if (events[idx].userId !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Not authorized' });
  events[idx] = { ...events[idx], ...req.body };
  writeData('events', events);
  res.json(events[idx]);
});

app.delete('/api/events/:id', auth, notReadOnly, (req, res) => {
  let events = readData('events');
  const item = events.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  if (item.userId !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Not authorized' });
  writeData('events', events.filter(e => e.id !== req.params.id));
  res.json({ ok:true });
});

// ══════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════════════════════════

app.get('/api/admin/users', auth, adminOnly, (req, res) => {
  res.json(readData('users').map(({ password:_, ...u }) => u));
});

app.get('/api/admin/stats', auth, adminOnly, (req, res) => {
  const users = readData('users');
  const logs = readData('logs');
  const crops = readData('crops');
  const animals = readData('animals');
  res.json({
    totalUsers: users.length,
    totalLogs: logs.length,
    totalCrops: crops.length,
    totalAnimals: animals.length,
    userStats: users.map(u => ({
      id:u.id, name:u.name, username:u.username, role:u.role,
      farmName:u.farmName, avatar:u.avatar,
      logCount: logs.filter(l=>l.userId===u.id).length,
      cropCount: crops.filter(c=>c.userId===u.id).length,
      animalCount: animals.filter(a=>a.userId===u.id).length,
      lastActive: [...logs].filter(l=>l.userId===u.id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0]?.createdAt || u.joined
    }))
  });
});

app.patch('/api/admin/users/:id', auth, adminOnly, (req, res) => {
  const users = readData('users');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'User not found' });
  const { password, ...allowed } = req.body;
  if (allowed.newPassword) { allowed.password = bcrypt.hashSync(allowed.newPassword, 10); delete allowed.newPassword; }
  users[idx] = { ...users[idx], ...allowed };
  writeData('users', users);
  const { password:_, ...safe } = users[idx];
  res.json(safe);
});

app.delete('/api/admin/users/:id', auth, adminOnly, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
  let users = readData('users');
  if (!users.find(u => u.id === req.params.id)) return res.status(404).json({ error: 'Not found' });
  writeData('users', users.filter(u => u.id !== req.params.id));
  res.json({ ok:true });
});

// ── Serve login.html as default page ──────────────────────────
app.get('/', (req, res) => res.redirect('/login.html'));

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   🌿 Farm MRL Portal — Server Running    ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  URL: http://localhost:${PORT}              ║`);
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Default Login Credentials:              ║');
  console.log('║  admin       / admin123  (Admin)         ║');
  console.log('║  farmer1     / farmer123 (Ravi Kumar)    ║');
  console.log('║  farmer2     / farmer123 (Priya Singh)   ║');
  console.log('║  agronomist  / agro123   (Dr. Sharma)    ║');
  console.log('╚══════════════════════════════════════════╝\n');
});
