/* ============================================================
   FARM MRL PORTAL — features.js
   Language, Weather, Quick Notes, Print
   ============================================================ */

// ── i18n Translations ────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    language:'Language', logout:'Logout', dashboard:'Dashboard',
    recent_logs:'Recent Logs', active_alerts:'Active Alerts',
    mrl_compliance:'MRL Compliance Overview', usage_trend:'Usage Trend (7 days)',
    quick_notes:'Quick Notes', note_placeholder:'Type a quick note…',
    loading_weather:'Loading weather…', detecting_location:'Detecting location…',
    weather_tip_default:'Farm Tip: Check weather before spraying chemicals',
    print:'Print', no_logs_yet:'No logs yet', add_first_log:'Add your first chemical usage log',
    farm_health:'Farm Health Score', signed_in:'Signed in as',
  },
  hi: {
    language:'भाषा', logout:'लॉगआउट', dashboard:'डैशबोर्ड',
    recent_logs:'हाल के लॉग', active_alerts:'सक्रिय अलर्ट',
    mrl_compliance:'MRL अनुपालन अवलोकन', usage_trend:'उपयोग प्रवृत्ति (7 दिन)',
    quick_notes:'त्वरित नोट्स', note_placeholder:'एक त्वरित नोट लिखें…',
    loading_weather:'मौसम लोड हो रहा है…', detecting_location:'स्थान पहचाना जा रहा है…',
    weather_tip_default:'खेती सुझाव: रसायन छिड़कने से पहले मौसम जांचें',
    print:'प्रिंट', no_logs_yet:'अभी कोई लॉग नहीं', add_first_log:'पहला रासायनिक उपयोग लॉग जोड़ें',
    farm_health:'खेत स्वास्थ्य स्कोर', signed_in:'साइन इन है',
  },
  pa: {
    language:'ਭਾਸ਼ਾ', logout:'ਲੌਗਆਉਟ', dashboard:'ਡੈਸ਼ਬੋਰਡ',
    recent_logs:'ਹਾਲੀਆ ਲੌਗ', active_alerts:'ਸਰਗਰਮ ਚੇਤਾਵਨੀਆਂ',
    mrl_compliance:'MRL ਅਨੁਪਾਲਨ', usage_trend:'ਵਰਤੋਂ ਰੁਝਾਨ (7 ਦਿਨ)',
    quick_notes:'ਤੁਰੰਤ ਨੋਟਸ', note_placeholder:'ਇੱਕ ਨੋਟ ਲਿਖੋ…',
    loading_weather:'ਮੌਸਮ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…', detecting_location:'ਟਿਕਾਣਾ ਖੋਜਿਆ ਜਾ ਰਿਹਾ ਹੈ…',
    weather_tip_default:'ਖੇਤੀ ਸੁਝਾਅ: ਰਸਾਇਣ ਛਿੜਕਣ ਤੋਂ ਪਹਿਲਾਂ ਮੌਸਮ ਜਾਂਚੋ',
    print:'ਪ੍ਰਿੰਟ', no_logs_yet:'ਕੋਈ ਲੌਗ ਨਹੀਂ', add_first_log:'ਪਹਿਲਾ ਲੌਗ ਸ਼ਾਮਲ ਕਰੋ',
    farm_health:'ਖੇਤ ਸਿਹਤ ਸਕੋਰ', signed_in:'ਸਾਈਨ ਇਨ ਹੈ',
  },
  ta: {
    language:'மொழி', logout:'வெளியேறு', dashboard:'டாஷ்போர்டு',
    recent_logs:'சமீபத்திய பதிவுகள்', active_alerts:'செயலில் உள்ள எச்சரிக்கைகள்',
    mrl_compliance:'MRL இணக்கம்', usage_trend:'பயன்பாட்டு போக்கு (7 நாட்கள்)',
    quick_notes:'விரைவு குறிப்புகள்', note_placeholder:'ஒரு குறிப்பை உள்ளிடவும்…',
    loading_weather:'வானிலை ஏற்றுகிறது…', detecting_location:'இடம் கண்டறிகிறது…',
    weather_tip_default:'பண்ணை குறிப்பு: இரசாயனம் தெளிக்கும் முன் வானிலை சரிபார்க்கவும்',
    print:'அச்சிடு', no_logs_yet:'பதிவுகள் இல்லை', add_first_log:'முதல் பதிவை சேர்க்கவும்',
    farm_health:'பண்ணை ஆரோக்கிய மதிப்பெண்', signed_in:'உள்நுழைந்துள்ளீர்கள்',
  },
  te: {
    language:'భాష', logout:'లాగ్అవుట్', dashboard:'డాష్‌బోర్డ్',
    recent_logs:'ఇటీవలి లాగ్‌లు', active_alerts:'క్రియాశీల హెచ్చరికలు',
    mrl_compliance:'MRL సమ్మతి', usage_trend:'వినియోగ ధోరణి (7 రోజులు)',
    quick_notes:'త్వరిత నోట్స్', note_placeholder:'ఒక నోట్ రాయండి…',
    loading_weather:'వాతావరణం లోడ్ అవుతోంది…', detecting_location:'స్థానాన్ని గుర్తిస్తోంది…',
    weather_tip_default:'పొలం చిట్కా: రసాయనాలు పిచికారీ చేయడానికి ముందు వాతావరణం తనిఖీ చేయండి',
    print:'ముద్రించు', no_logs_yet:'లాగ్‌లు లేవు', add_first_log:'మొదటి లాగ్‌ను జోడించండి',
    farm_health:'పొలం ఆరోగ్య స్కోర్', signed_in:'సైన్ ఇన్ అయ్యారు',
  },
  kn: {
    language:'ಭಾಷೆ', logout:'ಲಾಗ್ಔಟ್', dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    recent_logs:'ಇತ್ತೀಚಿನ ಲಾಗ್‌ಗಳು', active_alerts:'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು',
    mrl_compliance:'MRL ಅನುಸರಣೆ', usage_trend:'ಬಳಕೆ ಪ್ರವೃತ್ತಿ (7 ದಿನಗಳು)',
    quick_notes:'ತ್ವರಿತ ಟಿಪ್ಪಣಿಗಳು', note_placeholder:'ಒಂದು ಟಿಪ್ಪಣಿ ಬರೆಯಿರಿ…',
    loading_weather:'ಹವಾಮಾನ ಲೋಡ್ ಆಗುತ್ತಿದೆ…', detecting_location:'ಸ್ಥಳ ಪತ್ತೆ ಆಗುತ್ತಿದೆ…',
    weather_tip_default:'ಕೃಷಿ ಸಲಹೆ: ರಾಸಾಯನಿಕ ಸಿಂಪಡಿಸುವ ಮೊದಲು ಹವಾಮಾನ ಪರೀಕ್ಷಿಸಿ',
    print:'ಮುದ್ರಿಸಿ', no_logs_yet:'ಯಾವುದೇ ಲಾಗ್‌ಗಳಿಲ್ಲ', add_first_log:'ಮೊದಲ ಲಾಗ್ ಸೇರಿಸಿ',
    farm_health:'ಕೃಷಿ ಆರೋಗ್ಯ ಸ್ಕೋರ್', signed_in:'ಸೈನ್ ಇನ್ ಆಗಿದ್ದಾರೆ',
  },
  ml: {
    language:'ഭാഷ', logout:'ലോഗൗട്ട്', dashboard:'ഡാഷ്‌ബോർഡ്',
    recent_logs:'സമീപകാല ലോഗുകൾ', active_alerts:'സജീവ മുന്നറിയിപ്പുകൾ',
    mrl_compliance:'MRL അനുരൂപത', usage_trend:'ഉപയോഗ പ്രവണത (7 ദിവസം)',
    quick_notes:'ദ്രുത കുറിപ്പുകൾ', note_placeholder:'ഒരു കുറിപ്പ് ടൈപ്പ് ചെയ്യൂ…',
    loading_weather:'കാലാവസ്ഥ ലോഡ് ആകുന്നു…', detecting_location:'സ്ഥാനം കണ്ടെത്തുന്നു…',
    weather_tip_default:'കൃഷി നുറുങ്ങ്: രാസവസ്തുക്കൾ തളിക്കുന്നതിന് മുൻപ് കാലാവസ്ഥ പരിശോധിക്കുക',
    print:'പ്രിന്റ്', no_logs_yet:'ലോഗുകൾ ഇല്ല', add_first_log:'ആദ്യ ലോഗ് ചേർക്കുക',
    farm_health:'ഫാം ആരോഗ്യ സ്കോർ', signed_in:'സൈൻ ഇൻ ചെയ്തിരിക്കുന്നു',
  },
  bn: {
    language:'ভাষা', logout:'লগআউট', dashboard:'ড্যাশবোর্ড',
    recent_logs:'সাম্প্রতিক লগ', active_alerts:'সক্রিয় সতর্কতা',
    mrl_compliance:'MRL সম্মতি', usage_trend:'ব্যবহারের প্রবণতা (৭ দিন)',
    quick_notes:'দ্রুত নোট', note_placeholder:'একটি নোট লিখুন…',
    loading_weather:'আবহাওয়া লোড হচ্ছে…', detecting_location:'অবস্থান খোঁজা হচ্ছে…',
    weather_tip_default:'কৃষি টিপস: রাসায়নিক স্প্রে করার আগে আবহাওয়া পরীক্ষা করুন',
    print:'প্রিন্ট', no_logs_yet:'কোনো লগ নেই', add_first_log:'প্রথম লগ যোগ করুন',
    farm_health:'ফার্ম স্বাস্থ্য স্কোর', signed_in:'সাইন ইন করা আছেন',
  },
  mr: {
    language:'भाषा', logout:'लॉगआउट', dashboard:'डॅशबोर्ड',
    recent_logs:'अलीकडील लॉग', active_alerts:'सक्रिय अलर्ट',
    mrl_compliance:'MRL अनुपालन', usage_trend:'वापर कल (7 दिवस)',
    quick_notes:'जलद नोट्स', note_placeholder:'एक नोट लिहा…',
    loading_weather:'हवामान लोड होत आहे…', detecting_location:'स्थान ओळखले जात आहे…',
    weather_tip_default:'शेती टीप: रसायने फवारण्यापूर्वी हवामान तपासा',
    print:'मुद्रित करा', no_logs_yet:'कोणतेही लॉग नाहीत', add_first_log:'पहिला लॉग जोडा',
    farm_health:'शेत आरोग्य स्कोर', signed_in:'साइन इन आहे',
  },
};

let currentLang = localStorage.getItem('fmrl_lang') || 'en';

function t(key) {
  return (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || (TRANSLATIONS.en[key] || key);
}

function applyTranslations() {
  // Google Translate handles all DOM translations automatically now
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('fmrl_lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  
  // Trigger Google Translate widget
  const gtCombo = document.querySelector('.goog-te-combo');
  if (gtCombo) {
    gtCombo.value = lang === 'en' ? 'en' : lang;
    gtCombo.dispatchEvent(new Event('change'));
  } else {
    setTimeout(() => switchLanguage(lang), 500);
  }

  const names = { en:'English', hi:'हिन्दी', pa:'ਪੰਜਾਬੀ', ta:'தமிழ்', te:'తెలుగు', kn:'ಕನ್ನಡ', ml:'മലയാളം', bn:'বাংলা', mr:'मराठी' };
  if (typeof toast === 'function') toast('Language: ' + names[lang], 'info');
}

// ── Weather Widget ───────────────────────────────────────────
const WEATHER_ICONS = {
  0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️',
  45:'🌫️', 48:'🌫️',
  51:'🌦️', 53:'🌦️', 55:'🌧️',
  61:'🌧️', 63:'🌧️', 65:'🌧️',
  71:'🌨️', 73:'🌨️', 75:'❄️',
  80:'🌦️', 81:'🌦️', 82:'⛈️',
  95:'⛈️', 96:'⛈️', 99:'⛈️'
};
const WEATHER_DESCS = {
  0:'Clear sky', 1:'Mainly clear', 2:'Partly cloudy', 3:'Overcast',
  45:'Foggy', 48:'Icy fog', 51:'Light drizzle', 53:'Drizzle', 55:'Heavy drizzle',
  61:'Light rain', 63:'Moderate rain', 65:'Heavy rain',
  71:'Light snow', 73:'Moderate snow', 75:'Heavy snow',
  80:'Rain showers', 81:'Rain showers', 82:'Violent showers',
  95:'Thunderstorm', 96:'Thunderstorm', 99:'Thunderstorm'
};
const SPRAY_TIPS = [
  '🚿 Avoid spraying when wind > 15 km/h',
  '🌡️ Spray early morning or late evening for best results',
  '🌧️ Do not spray before expected rain within 6 hours',
  '☀️ High temp & humidity can degrade chemical efficacy',
  '💧 Humid conditions may increase fungal disease risk',
  '🌬️ Always check wind direction before spraying',
];

function initWeather() {
  if (!navigator.geolocation) {
    showWeatherError('Geolocation not available');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
    () => fetchWeather(28.6139, 77.2090) // Default: New Delhi
  );
}

async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
    const res = await fetch(url);
    const data = await res.json();
    renderWeather(data, lat, lon);
    // Reverse geocode for city name
    fetchCityName(lat, lon);
  } catch(e) {
    showWeatherError('Weather unavailable');
  }
}

async function fetchCityName(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const d = await res.json();
    const city = d.address?.city || d.address?.town || d.address?.village || d.address?.state || 'Your Location';
    const locEl = document.getElementById('weatherLocation');
    if (locEl) locEl.innerHTML = `<span>📍</span> <span>${city}, ${d.address?.country||''}</span>`;
  } catch(e) {}
}

function renderWeather(data, lat, lon) {
  const c = data.current;
  const wc = c.weather_code;
  document.getElementById('weatherIcon').textContent = WEATHER_ICONS[wc] || '🌤️';
  document.getElementById('weatherTemp').textContent = Math.round(c.temperature_2m) + '°C';
  document.getElementById('weatherDesc').textContent = WEATHER_DESCS[wc] || 'Clear';
  document.getElementById('weatherHumidity').textContent = c.relative_humidity_2m + '%';
  document.getElementById('weatherWind').textContent = Math.round(c.wind_speed_10m) + ' km/h';

  // Forecast
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const fc = document.getElementById('weatherForecast');
  if (fc && data.daily) {
    fc.innerHTML = data.daily.time.slice(1,6).map((d,i) => {
      const day = days[new Date(d).getDay()];
      const wcode = data.daily.weather_code[i+1];
      const max = Math.round(data.daily.temperature_2m_max[i+1]);
      const min = Math.round(data.daily.temperature_2m_min[i+1]);
      return `<div class="weather-forecast-item">
        <div class="weather-forecast-day">${day}</div>
        <div class="weather-forecast-icon">${WEATHER_ICONS[wcode]||'🌤️'}</div>
        <div class="weather-forecast-temp">${max}°/${min}°</div>
      </div>`;
    }).join('');
  }

  // Farm tip based on conditions
  const tipEl = document.getElementById('weatherTip');
  if (tipEl) {
    let tip = SPRAY_TIPS[Math.floor(Math.random() * SPRAY_TIPS.length)];
    if (c.wind_speed_10m > 15) tip = '🌬️ Wind is too high (>15 km/h) — avoid spraying!';
    else if (wc >= 51) tip = '🌧️ Rain/wet conditions — do NOT spray chemicals today!';
    else if (c.relative_humidity_2m > 85) tip = '💧 Very humid — fungal disease risk is HIGH today';
    tipEl.innerHTML = `<span>💡</span> <span>${tip}</span>`;
  }
}

function showWeatherError(msg) {
  const w = document.getElementById('weatherWidget');
  if (w) w.querySelector('.weather-desc') && (w.querySelector('.weather-desc').textContent = msg);
}

// ── Quick Notes ──────────────────────────────────────────────
const NOTE_COLORS = ['#22c55e','#60a5fa','#fbbf24','#f87171','#c084fc','#fb923c'];

function loadQuickNotes() {
  try { return JSON.parse(localStorage.getItem('fmrl_notes') || '[]'); } catch { return []; }
}
function saveQuickNotes(notes) { localStorage.setItem('fmrl_notes', JSON.stringify(notes)); }

function renderQuickNotes() {
  const el = document.getElementById('quickNotesList');
  if (!el) return;
  const notes = loadQuickNotes();
  if (!notes.length) {
    el.innerHTML = `<div class="quick-notes-empty"><div class="quick-notes-empty-icon">📝</div>No notes yet — add one below!</div>`;
    return;
  }
  el.innerHTML = notes.slice().reverse().map(n => `
    <div class="quick-note-item">
      <div class="quick-note-color" style="background:${n.color};"></div>
      <div class="quick-note-content">
        <div class="quick-note-text">${n.text}</div>
        <div class="quick-note-time">${new Date(n.ts).toLocaleDateString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
      </div>
      <button class="quick-note-delete" onclick="deleteNote('${n.id}')">✕</button>
    </div>`).join('');
}

function addQuickNote() {
  const inp = document.getElementById('quickNoteInput');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  const notes = loadQuickNotes();
  const color = NOTE_COLORS[notes.length % NOTE_COLORS.length];
  notes.push({ id: '_'+Math.random().toString(36).slice(2,8), text, ts: Date.now(), color });
  saveQuickNotes(notes);
  inp.value = '';
  renderQuickNotes();
  if (typeof toast === 'function') toast('Note saved!', 'success');
}

function deleteNote(id) {
  saveQuickNotes(loadQuickNotes().filter(n => n.id !== id));
  renderQuickNotes();
}

// ── Print Report ─────────────────────────────────────────────
function printReport() {
  if (typeof navigate === 'function') navigate('reports');
  setTimeout(() => {
    const element = document.querySelector('.main-content');
    const opt = {
      margin:       0.5,
      filename:     'Farm_MRL_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    if (typeof html2pdf !== 'undefined') {
      html2pdf().set(opt).from(element).save().then(() => toast('PDF Report generated', 'success'));
    } else {
      window.print();
    }
  }, 400);
}

// ── Login page language support ──────────────────────────────
const LOGIN_TRANSLATIONS = {
  en: { signin:'Sign In', register:'Register', username:'Username', password:'Password',
        quick_signin:'Quick Sign In (Demo)', create_account:'Create Account →', signin_btn:'Sign In →' },
  hi: { signin:'साइन इन', register:'रजिस्टर', username:'यूज़रनेम', password:'पासवर्ड',
        quick_signin:'त्वरित साइन इन (डेमो)', create_account:'खाता बनाएं →', signin_btn:'साइन इन →' },
  pa: { signin:'ਸਾਈਨ ਇਨ', register:'ਰਜਿਸਟਰ', username:'ਯੂਜ਼ਰਨੇਮ', password:'ਪਾਸਵਰਡ',
        quick_signin:'ਤੁਰੰਤ ਸਾਈਨ ਇਨ (ਡੈਮੋ)', create_account:'ਖਾਤਾ ਬਣਾਓ →', signin_btn:'ਸਾਈਨ ਇਨ →' },
  ta: { signin:'உள்நுழை', register:'பதிவு செய்', username:'பயனர்பெயர்', password:'கடவுச்சொல்',
        quick_signin:'விரைவு உள்நுழைவு (டெமோ)', create_account:'கணக்கு உருவாக்கு →', signin_btn:'உள்நுழை →' },
  te: { signin:'సైన్ ఇన్', register:'నమోదు', username:'యూజర్‌నేమ్', password:'పాస్‌వర్డ్',
        quick_signin:'త్వరిత సైన్ ఇన్ (డెమో)', create_account:'ఖాతా సృష్టించు →', signin_btn:'సైన్ ఇన్ →' },
  kn: { signin:'ಸೈನ್ ಇನ್', register:'ನೋಂದಣಿ', username:'ಬಳಕೆದಾರರ ಹೆಸರು', password:'ಪಾಸ್‌ವರ್ಡ್',
        quick_signin:'ತ್ವರಿತ ಸೈನ್ ಇನ್ (ಡೆಮೋ)', create_account:'ಖಾತೆ ರಚಿಸಿ →', signin_btn:'ಸೈನ್ ಇನ್ →' },
  ml: { signin:'സൈൻ ഇൻ', register:'രജിസ്റ്റർ', username:'ഉപയോക്തൃനാമം', password:'പാസ്‌വേഡ്',
        quick_signin:'ദ്രുത സൈൻ ഇൻ (ഡെമോ)', create_account:'അക്കൗണ്ട് ഉണ്ടാക്കൂ →', signin_btn:'സൈൻ ഇൻ →' },
  bn: { signin:'সাইন ইন', register:'নিবন্ধন', username:'ব্যবহারকারীর নাম', password:'পাসওয়ার্ড',
        quick_signin:'দ্রুত সাইন ইন (ডেমো)', create_account:'অ্যাকাউন্ট তৈরি করুন →', signin_btn:'সাইন ইন →' },
  mr: { signin:'साइन इन', register:'नोंदणी', username:'वापरकर्तानाव', password:'पासवर्ड',
        quick_signin:'जलद साइन इन (डेमो)', create_account:'खाते तयार करा →', signin_btn:'साइन इन →' },
};

// ── Init ─────────────────────────────────────────────────────
(function initFeatures() {
  // Restore language
  const saved = localStorage.getItem('fmrl_lang') || 'en';
  currentLang = saved;
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = saved;
  applyTranslations();

  // Weather (only on main app, not login)
  if (document.getElementById('weatherWidget')) {
    initWeather();
    renderQuickNotes();
  }
  
  // Init new features if present
  if (document.getElementById('page-tasks')) {
    initTaskBoard();
    renderInventory();
    renderFinances();
  }
})();

// ── NEW FEATURES ───────────────────────────────────────────────

// Scanner
let html5QrcodeScanner = null;
function openScanner() {
  document.getElementById('scannerModal').classList.add('open');
  if (!html5QrcodeScanner) {
    html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
  }
  html5QrcodeScanner.render((decodedText, decodedResult) => {
    html5QrcodeScanner.clear();
    closeScanner();
    const sel = document.getElementById('logChem');
    if (sel) {
      // Mock barcode lookup: select random chemical if barcode doesn't match exactly
      const opt = Array.from(sel.options).find(o => o.text.toLowerCase().includes(decodedText.toLowerCase()));
      if (opt) sel.value = opt.value;
      else if (sel.options.length > 2) sel.selectedIndex = 2; // Default mock selection
      toast('Scanned: ' + decodedText, 'success');
    }
  }, (err) => { /* ignore */ });
}
function closeScanner() {
  document.getElementById('scannerModal').classList.remove('open');
  if (html5QrcodeScanner) { html5QrcodeScanner.clear(); }
}

// Tasks (Kanban)
function initTaskBoard() {
  const tDo = document.getElementById('tasksTodo'), tProg = document.getElementById('tasksProgress'), tDone = document.getElementById('tasksDone');
  if(!tDo) return;
  new Sortable(tDo, { group: 'shared', animation: 150, onEnd: saveTasksState });
  new Sortable(tProg, { group: 'shared', animation: 150, onEnd: saveTasksState });
  new Sortable(tDone, { group: 'shared', animation: 150, onEnd: saveTasksState });
  loadTasksState();
}
function loadTasksState() {
  const tasks = JSON.parse(localStorage.getItem('fmrl_tasks') || '[]');
  if (!tasks.length) {
    tasks.push({id:'1', text:'Spray fungicide on Field A1', status:'todo'}, {id:'2', text:'Check withdrawal period for Herd B', status:'progress'}, {id:'3', text:'Harvest tomatoes', status:'done'});
  }
  document.getElementById('tasksTodo').innerHTML = ''; document.getElementById('tasksProgress').innerHTML = ''; document.getElementById('tasksDone').innerHTML = '';
  tasks.forEach(t => {
    const el = document.createElement('div');
    el.className = 'activity-item';
    el.style.cursor = 'grab';
    el.innerHTML = `<div class="activity-content"><div class="activity-title">${t.text}</div></div>`;
    el.dataset.id = t.id;
    if (t.status==='todo') document.getElementById('tasksTodo').appendChild(el);
    else if (t.status==='progress') document.getElementById('tasksProgress').appendChild(el);
    else document.getElementById('tasksDone').appendChild(el);
  });
}
function saveTasksState() {
  const tasks = [];
  document.querySelectorAll('#tasksTodo .activity-item').forEach(el => tasks.push({id:el.dataset.id, text:el.querySelector('.activity-title').textContent, status:'todo'}));
  document.querySelectorAll('#tasksProgress .activity-item').forEach(el => tasks.push({id:el.dataset.id, text:el.querySelector('.activity-title').textContent, status:'progress'}));
  document.querySelectorAll('#tasksDone .activity-item').forEach(el => tasks.push({id:el.dataset.id, text:el.querySelector('.activity-title').textContent, status:'done'}));
  localStorage.setItem('fmrl_tasks', JSON.stringify(tasks));
}

// Inventory
function renderInventory() {
  const inv = JSON.parse(localStorage.getItem('fmrl_inventory') || '[]');
  const tb = document.getElementById('inventoryTableBody');
  if(!tb) return;
  if (!inv.length) {
    inv.push({id:'i1', name:'Roundup Pro', cat:'Herbicide', qty:45, unit:'L', updated:new Date().toISOString()});
    inv.push({id:'i2', name:'Amoxicillin', cat:'Medicine', qty:5, unit:'kg', updated:new Date().toISOString()});
    localStorage.setItem('fmrl_inventory', JSON.stringify(inv));
  }
  tb.innerHTML = inv.map(i => {
    const isLow = i.qty < 10;
    return `<tr>
      <td><strong>${i.name}</strong></td>
      <td><span class="tag">${i.cat}</span></td>
      <td><span style="font-weight:600;color:${isLow?'var(--danger)':'var(--safe)'}">${i.qty} ${i.unit}</span></td>
      <td><span class="risk-badge risk-${isLow?'danger':'safe'}">${isLow?'LOW STOCK':'OK'}</span></td>
      <td class="text-xs text-muted">${new Date(i.updated).toLocaleDateString()}</td>
    </tr>`;
  }).join('');
}

// Finances
function renderFinances() {
  const fin = JSON.parse(localStorage.getItem('fmrl_finances') || '[]');
  if (!fin.length) {
    fin.push({cat:'Herbicides', amt:450}, {cat:'Fertilizers', amt:1200}, {cat:'Medicines', amt:300});
    localStorage.setItem('fmrl_finances', JSON.stringify(fin));
  }
  const total = fin.reduce((sum, item) => sum + item.amt, 0);
  const pageFin = document.getElementById('page-finances');
  if(pageFin) {
    const sumEl = pageFin.querySelector('.card:first-child div:last-child');
    if(sumEl) sumEl.textContent = '$' + total.toFixed(2);
    const brkEl = pageFin.querySelector('.card:last-child div:last-child');
    if(brkEl) {
      brkEl.innerHTML = fin.map(i => `<div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border);">
        <span style="color:var(--text-primary);">${i.cat}</span>
        <span style="font-weight:600;">$${i.amt.toFixed(2)}</span>
      </div>`).join('');
    }
  }
}

