// ── GlowUp Blueprint v5.0 ──

import { Engine } from './engine.js';
import { PLAN_GROUPS, HOME_GROUPS, PRODUCT_GROUPS, SORTS } from './data/library.js';
import { PLAN_META, DAILY_CHECKLIST } from './data/blueprint.js';
import { PRODUCTS, PRODUCT_CATS } from './data/products.js';

// ── UTILITIES ──
const DB = {
  get(k, d) {
    try { return JSON.parse(localStorage.getItem('gu_' + k)) || d } catch { return d }
  },
  set(k, v) { localStorage.setItem('gu_' + k, JSON.stringify(v)) }
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function shopLink(url) {
  try { window.open(url, '_blank') } catch { window.location.href = url }
}

const APP_VERSION = 'v5.0';

// ── SERVICE WORKER & PWA ──
const storedVersion = DB.get('appVersion', null);
if (storedVersion && storedVersion !== APP_VERSION) {
  document.getElementById('update-banner').style.display = 'flex';
}
DB.set('appVersion', APP_VERSION);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (nw) {
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            document.getElementById('update-banner').style.display = 'flex';
          }
        });
      }
    });
  }).catch(() => {});

  let _deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _deferredPrompt = e;
    const btn = document.getElementById('install-btn');
    if (btn) btn.style.display = 'flex';
  });
  window.addEventListener('appinstalled', () => {
    _deferredPrompt = null;
    const btn = document.getElementById('install-btn');
    if (btn) btn.style.display = 'none';
  });

  window.installPWA = function () {
    if (!_deferredPrompt) { alert('To install: tap browser menu > Install app.'); return; }
    _deferredPrompt.prompt();
    _deferredPrompt.userChoice.then(() => { _deferredPrompt = null; });
  };
}

window.applyUpdate = function () {
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('SKIP_WAITING');
    }
  } catch (e) { console.warn('SW update:', e); }
  window.location.reload();
};

window.dismissUpdate = function () {
  const el = document.getElementById('update-banner');
  if (el) el.style.display = 'none';
};

// ── GREETING ──
(function () {
  const h = new Date().getHours();
  const g = document.getElementById('greeting');
  if (g) g.textContent = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
})();

// ── STREAK ──
let streakData = DB.get('streak', { count: 0, lastDate: null });
function updateStreak() {
  const t = new Date().toDateString();
  if (streakData.lastDate === t) return;
  const y = new Date(Date.now() - 86400000).toDateString();
  if (streakData.lastDate === y) { streakData.count++; streakData.lastDate = t; }
  else if (streakData.lastDate !== t) { streakData.count = 1; streakData.lastDate = t; }
  DB.set('streak', streakData);
  renderStreak();
}
function renderStreak() {
  const sd = document.getElementById('streak-display');
  const sm = document.getElementById('streak-msg');
  if (sd) sd.textContent = streakData.count + '-Day Streak';
  if (sm) sm.textContent = streakData.count > 7 ? 'Unstoppable!' : streakData.count > 3 ? 'Keep going!' : 'Start today!';
}
updateStreak();
renderStreak();

// ── WEEK GRID ──
function renderWeekGrid() {
  const g = document.getElementById('week-grid');
  if (!g) return;
  const d = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const now = new Date();
  const dow = now.getDay();
  const c = DB.get('weekCompleted', {});
  let h = '';
  for (let i = 0; i < 7; i++) {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - dow + i);
    const k = dt.toDateString();
    h += '<div class="week-day ' + (i === dow ? 'today' : '') + ' ' + (c[k] ? 'complete' : '') + '"><div class="day-name">' + d[i] + '</div><div class="day-num">' + dt.getDate() + '</div><div class="day-dot"></div></div>';
  }
  g.innerHTML = h;
}
function markDayComplete() {
  const c = DB.get('weekCompleted', {});
  c[new Date().toDateString()] = true;
  DB.set('weekCompleted', c);
  renderWeekGrid();
}
renderWeekGrid();

// ── DAILY GOALS ──
const defaultGoals = [
  { id: 'water', icon: '\u{1F4A7}', bg: 'rgba(46,204,113,.15)', name: 'Drink 2L Water', sub: 'Hydration for skin & hair', done: false },
  { id: 'skincare', icon: '\u{1F9F4}', bg: 'rgba(124,92,252,.15)', name: 'Apply Skincare', sub: 'Cleanse + Moisturize + SPF', done: false },
  { id: 'sun', icon: '\u2600\uFE0F', bg: 'rgba(245,200,66,.15)', name: '10 min Sunlight', sub: 'Vitamin D boost', done: false },
  { id: 'move', icon: '\u{1F3C3}', bg: 'rgba(231,76,60,.15)', name: '30 min Movement', sub: 'Fat loss + circulation', done: false },
  { id: 'sleep', icon: '\u{1F634}', bg: 'rgba(79,195,247,.15)', name: 'Sleep by 10PM', sub: 'Growth hormone + recovery', done: false }
];
let goals = DB.get('goals', defaultGoals);

function renderGoals() {
  const c = document.getElementById('goals-container');
  if (!c) return;
  c.innerHTML = goals.map((g, i) =>
    '<div class="goal-item" onclick="toggleGoal(' + i + ')"><div class="goal-icon" style="background:' + g.bg + '">' + g.icon + '</div><div class="goal-info"><div class="goal-name">' + escapeHtml(g.name) + '</div><div class="goal-sub">' + escapeHtml(g.sub) + '</div></div><div class="checkbox ' + (g.done ? 'checked' : '') + '" style="margin-left:auto"></div></div>'
  ).join('');
  const done = goals.filter(g => g.done).length;
  const gc = document.getElementById('goal-count');
  if (gc) gc.textContent = done + '/' + goals.length + ' done';
  renderStepDots(done, goals.length);
  if (done === goals.length) markDayComplete();
  updateGlowScore(done, goals.length);
  DB.set('goals', goals);
}

window.toggleGoal = function (i) {
  goals[i].done = !goals[i].done;
  renderGoals();
};

function renderStepDots(done, total) {
  const c = document.getElementById('step-dots');
  if (!c) return;
  let h = '';
  for (let i = 0; i < total; i++) {
    const s = i < done ? 'done' : i === done ? 'active' : '';
    h += '<div class="step-dot ' + s + '">' + (i < done ? '\u2713' : (i + 1)) + '</div>';
    if (i < total - 1) h += '<div class="step-line ' + (i < done ? 'done' : '') + '"></div>';
  }
  c.innerHTML = h;
}

function updateGlowScore(done, total) {
  const p = done / total;
  const s = Math.min(100, Math.round(60 + p * 40));
  const gs = document.getElementById('glow-score');
  if (gs) gs.textContent = s;
  const gt = document.getElementById('glow-title');
  const gd = document.getElementById('glow-desc');
  const gp = document.getElementById('glow-pill');
  if (s >= 90) { if (gt) gt.textContent = 'Legendary'; if (gd) gd.textContent = 'You are absolutely crushing it!'; }
  else if (s >= 75) { if (gt) gt.textContent = 'Rising Star'; if (gd) gd.textContent = 'Great progress, keep pushing!'; }
  else if (s >= 60) { if (gt) gt.textContent = 'Getting Started'; if (gd) gd.textContent = 'Complete your daily goals to improve your score!'; }
  else { if (gt) gt.textContent = 'Begin'; if (gd) gd.textContent = 'Start your first goal to begin your glow up!'; }
  if (gp) gp.textContent = '+' + Math.round(p * 40) + ' pts this week';
}

renderGoals();

// ── TODOs ──
let todos = DB.get('todos', []);
let todoFilter = 'all';

window.renderTodos = function () {
  const list = document.getElementById('todo-list-tasks');
  if (!list) return;
  const filtered = todoFilter === 'all' ? todos : todos.filter(t => t.cat === todoFilter);
  const priColor = { high: 'var(--red)', med: 'var(--gold)', low: 'var(--green2)' };
  const catColor = { face: 'var(--pink)', hair: 'var(--green2)', body: 'var(--orange)' };
  list.innerHTML = filtered.map(t => {
    const timeHtml = t.time ? '<span class="todo-time">' + escapeHtml(t.time) + '</span>' : '';
    return '<div class="todo-item ' + (t.done ? 'done' : '') + '" onclick="toggleTodo(' + t.id + ')">' +
      '<div class="checkbox ' + (t.done ? 'checked' : '') + '"></div>' +
      '<div class="todo-main"><div class="todo-name">' + escapeHtml(t.name) + '</div><div class="todo-meta"><span style="color:' + catColor[t.cat] + ';font-weight:700;text-transform:capitalize">' + escapeHtml(t.cat) + '</span> &middot; <span style="color:' + priColor[t.pri] + ';font-weight:700;text-transform:capitalize">' + escapeHtml(t.pri) + '</span></div></div>' +
      timeHtml + '</div>';
  }).join('');
  DB.set('todos', todos);
};

window.toggleTodo = function (id) {
  const t = todos.find(x => x.id === id);
  if (t) t.done = !t.done;
  renderTodos();
};

window.filterTodos = function (btn, cat) {
  document.querySelectorAll('.todo-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  todoFilter = cat;
  renderTodos();
};

let addTodoOpen = false;
window.toggleAddTodo = function () {
  addTodoOpen = !addTodoOpen;
  const el = document.getElementById('add-todo-panel');
  if (el) el.style.display = addTodoOpen ? 'block' : 'none';
};

window.addTodo = function () {
  const inp = document.getElementById('new-todo-name');
  const name = inp ? inp.value.trim() : '';
  if (!name) return;
  const catEl = document.getElementById('new-todo-cat');
  const priEl = document.getElementById('new-todo-pri');
  todos.unshift({ id: Date.now(), name: name, cat: catEl ? catEl.value : 'face', pri: priEl ? priEl.value : 'high', done: false });
  if (inp) inp.value = '';
  renderTodos();
};

window.quickAddTodo = function (name, cat, pri) {
  todos.unshift({ id: Date.now(), name: name, cat: cat, pri: pri, done: false });
  renderTodos();
};

renderTodos();

// ── CHECKLISTS (persisted) ──
let checklists = DB.get('checklists', {});

window.toggleChecklist = function (key, idx) {
  if (!checklists[key]) checklists[key] = {};
  checklists[key][idx] = !checklists[key][idx];
  DB.set('checklists', checklists);
  renderChecklists();
};

function renderChecklists() {
  document.querySelectorAll('.checklist[data-key]').forEach(cl => {
    const key = cl.dataset.key;
    cl.querySelectorAll('.checklist-item').forEach((item, idx) => {
      const cb = item.querySelector('.checkbox');
      if (cb) {
        if (checklists[key] && checklists[key][idx]) {
          cb.classList.add('checked');
        } else {
          cb.classList.remove('checked');
        }
      }
    });
  });
}

// ── SETTINGS ──
window.renderSettings = function () {
  try {
    const ss = document.getElementById('sp-streak');
    if (ss) ss.textContent = streakData.count;
    const gd = goals.filter(g => g.done).length;
    const sg = document.getElementById('sp-goals');
    if (sg) sg.textContent = gd;
    const ge = document.getElementById('glow-score');
    const sp = document.getElementById('sp-score');
    if (sp && ge) sp.textContent = ge.textContent;
    const sv = document.getElementById('settings-version');
    if (sv) sv.textContent = APP_VERSION;

    // Username
    const username = DB.get('username', 'GlowUp User');
    const nameEl = document.getElementById('settings-username');
    if (nameEl) nameEl.textContent = username;
    const nameInput = document.getElementById('profile-name-input');
    if (nameInput) nameInput.value = username;

    // Theme
    const isDark = !document.documentElement.classList.contains('light');
    const tg = document.getElementById('theme-toggle');
    const tl = document.getElementById('theme-label');
    if (isDark) {
      if (tg) tg.classList.add('on');
      if (tl) tl.textContent = 'Currently: Dark';
    } else {
      if (tg) tg.classList.remove('on');
      if (tl) tl.textContent = 'Currently: Light';
    }

    // Notifications
    const no = DB.get('notifications', true);
    const ng = document.getElementById('notif-toggle');
    const nl = document.getElementById('notif-label');
    if (no) {
      if (ng) ng.classList.add('on');
      if (nl) nl.textContent = 'Reminders on';
    } else {
      if (ng) ng.classList.remove('on');
      if (nl) nl.textContent = 'Reminders off';
    }

    // Transformation photo
    renderTransformPhoto();
  } catch (e) { console.error('renderSettings:', e); }
};

// ── THEME ──
window.toggleTheme = function () {
  document.documentElement.classList.toggle('light');
  DB.set('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
  renderSettings();
};

(function () {
  const saved = DB.get('theme', null);
  if (saved) {
    if (saved === 'light') document.documentElement.classList.add('light');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.classList.add('light');
  }
})();

// ── NOTIFICATIONS ──
let _notifTimers = [];

function sendNotif(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body: body, icon: '/icon-192.png', tag: 'glowup-' + Date.now() });
}

function scheduleNotifications() {
  clearScheduledNotifications();
  const now = new Date();
  const schedules = [
    { h: 7, m: 0, t: 'Plan Check', b: 'Log your morning weight - it feeds your 7-day average' },
    { h: 8, m: 0, t: 'First Meal', b: '30-45 g protein + fibre + vegetables' },
    { h: 12, m: 0, t: 'Hydration Check', b: 'Drink 500ml water, then a 10-min walk' },
    { h: 17, m: 0, t: 'Training Time', b: 'Full-body strength session + 30-min brisk walk' },
    { h: 19, m: 30, t: 'Close Your Window', b: 'Last meal now = 12h overnight fast' },
    { h: 21, m: 0, t: 'Wind Down', b: 'No caffeine, screen-free hour, cool dark room' },
    { h: 22, m: 30, t: 'Sleep Window', b: 'Lights out - 7-9 hours, consistent schedule' }
  ];
  schedules.forEach(s => {
    const target = new Date();
    target.setHours(s.h, s.m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const ms = target - now;
    const timer = setTimeout(() => {
      sendNotif(s.t, s.b);
      const next = new Date();
      next.setDate(next.getDate() + 1);
      next.setHours(s.h, s.m, 0, 0);
      const t2 = setTimeout(() => sendNotif(s.t, s.b), next - new Date());
      _notifTimers.push(t2);
    }, ms);
    _notifTimers.push(timer);
  });
}

function clearScheduledNotifications() {
  _notifTimers.forEach(t => clearTimeout(t));
  _notifTimers = [];
}

window.toggleNotifications = async function () {
  let on = !DB.get('notifications', true);
  if (on && 'Notification' in window) {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') on = false;
  }
  DB.set('notifications', on);
  renderSettings();
  if (on) scheduleNotifications(); else clearScheduledNotifications();
};

// ── EXPORT / IMPORT ──
window.exportData = function () {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith('gu_')) data[k] = JSON.parse(localStorage.getItem(k));
  }
  data._version = APP_VERSION;
  data._exported = new Date().toISOString();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'glowup-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
};

window.importDataClick = function () {
  const el = document.getElementById('import-file');
  if (el) el.click();
};

window.importData = function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const data = JSON.parse(ev.target.result);
      Object.keys(data).forEach(k => {
        if (k.startsWith('gu_')) localStorage.setItem(k, JSON.stringify(data[k]));
      });
      alert('Data imported! Reloading...');
      window.location.reload();
    } catch (ex) { alert('Invalid backup file.'); }
  };
  reader.readAsText(file);
};

window.clearCache = function () {
  if ('caches' in window) caches.keys().then(ks => ks.forEach(k => caches.delete(k)));
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('SKIP_WAITING');
    }
  } catch (e) { console.warn('SW cache clear:', e); }
  alert('Cache cleared! Reloading...');
  window.location.reload();
};

// ── USERNAME ──
window.saveUsername = function () {
  const inp = document.getElementById('profile-name-input');
  const name = inp ? inp.value.trim() : '';
  if (!name) return;
  DB.set('username', name);
  renderSettings();
};

// ── FACE SCORES ──
let faceScores = DB.get('faceScores', { symmetry: 82, jawline: 70, skin: 65, eyes: 88, brows: 58 });

window.updateFaceScore = function (key, val) {
  const v = Math.max(0, Math.min(100, parseInt(val) || 0));
  faceScores[key] = v;
  DB.set('faceScores', faceScores);
  renderFaceScores();
};

function renderFaceScores() {
  const total = Math.round((faceScores.symmetry + faceScores.jawline + faceScores.skin + faceScores.eyes + faceScores.brows) / 5);
  const scorePill = document.querySelector('#h-face .pill-gold');
  if (scorePill) scorePill.textContent = 'Score: ' + total;
  const scoreRing = document.querySelector('#h-face .score-ring svg circle:nth-child(2)');
  if (scoreRing) {
    const offset = 239 - (total / 100 * 239);
    scoreRing.setAttribute('stroke-dashoffset', offset);
  }
  const scoreNum = document.querySelector('#h-face .score-ring div div');
  if (scoreNum) scoreNum.textContent = total;

  const keys = ['symmetry', 'jawline', 'skin', 'eyes', 'brows'];
  const colors = ['var(--green2)', 'var(--gold)', 'var(--orange)', 'var(--accent2)', 'var(--red)'];
  const rows = document.querySelectorAll('#h-face .attr-row');
  rows.forEach((row, i) => {
    if (keys[i]) {
      const fill = row.querySelector('.progress-fill');
      const val = row.querySelector('.attr-val');
      if (fill) { fill.style.width = faceScores[keys[i]] + '%'; fill.style.background = colors[i]; }
      if (val) { val.textContent = faceScores[keys[i]]; val.style.color = colors[i]; }
    }
  });
}

// ── TRANSFORMATION PHOTO ──
window.uploadTransformPhoto = function () {
  const input = document.getElementById('transform-upload-input');
  if (input) input.click();
};

window.handleTransformUpload = function (e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB.'); return; }
  const reader = new FileReader();
  reader.onload = function (ev) {
    DB.set('transformPhoto', ev.target.result);
    renderTransformPhoto();
  };
  reader.readAsDataURL(file);
};

window.removeTransformPhoto = function () {
  DB.set('transformPhoto', null);
  renderTransformPhoto();
};

function renderTransformPhoto() {
  const container = document.getElementById('transform-container');
  if (!container) return;
  const photo = DB.get('transformPhoto', null);
  if (photo) {
    container.innerHTML =
      '<div class="tc-header"><div class="tc-title">My Transformation</div><div class="tc-badge">Before & After</div></div>' +
      '<img class="tc-img" src="' + photo + '" alt="Transformation">' +
      '<div class="tc-footer" style="display:flex;justify-content:space-between;align-items:center">The glow up is real. Consistency + discipline = results.<button class="btn-ghost" style="padding:4px 10px;font-size:10px;margin:0" onclick="removeTransformPhoto()">Remove</button></div>';
  } else {
    container.innerHTML =
      '<div class="tc-header"><div class="tc-title">My Transformation</div><div class="tc-badge">Before & After</div></div>' +
      '<div class="transform-upload" onclick="uploadTransformPhoto()">' +
      '<span style="font-size:32px">&#x1F4F7;</span>' +
      '<div class="transform-upload-text">Tap to upload your photo</div></div>' +
      '<div class="tc-footer">Track your progress. Upload a before & after photo.</div>' +
      '<input type="file" id="transform-upload-input" accept="image/*" style="display:none" onchange="handleTransformUpload(event)">';
  }
}

// ── INIT ──
renderSettings();
renderChecklists();
renderFaceScores();

if (DB.get('notifications', true) && 'Notification' in window && Notification.permission === 'granted') {
  scheduleNotifications();
}

// ══════════════════════════════════════════════════════════════
// v5 — PLAN DECK, TOOLBAR, DASHBOARD, TRACKERS
// ══════════════════════════════════════════════════════════════

// ── plan header ─────────────────────────────────────────────
(function renderPlanHead() {
  const k = document.getElementById('plan-kicker');
  const t = document.getElementById('plan-title');
  const s = document.getElementById('plan-sub');
  const p = document.getElementById('plan-principles');
  const d = document.getElementById('plan-disclaimer');
  if (k) k.textContent = PLAN_META.kicker;
  if (t) t.textContent = PLAN_META.title;
  if (s) s.textContent = PLAN_META.sub;
  if (p) p.innerHTML = PLAN_META.principles.map(x => '<span>' + escapeHtml(x) + '</span>').join('');
  if (d) d.textContent = PLAN_META.disclaimer;
})();

// ── decks ───────────────────────────────────────────────────
const planDeck = Engine.create('plan', '#screen-plan', {
  stateKey: 'planDeck',
  sort: 'order',
  groups: PLAN_GROUPS,
  onChange: () => renderPlanDash()
});

const homeDeck = Engine.create('home', '#screen-home .scroll', {
  stateKey: 'homeDeck',
  sort: 'order',
  groups: HOME_GROUPS
});

// ── products header + deck ──────────────────────────────────
(function renderProductsHead() {
  const sub = document.getElementById('prod-sub');
  if (!sub) return;
  const cats = PRODUCT_CATS.length;
  const budget = PRODUCTS.filter(p => p.tier === 'budget').length;
  sub.textContent = PRODUCTS.length + ' products across ' + cats + ' categories \u00b7 ' +
    budget + ' of them budget tier';
})();

const productDeck = Engine.create('products', '#screen-products', {
  stateKey: 'prodDeck',
  sort: 'order',
  groups: PRODUCT_GROUPS
});

// products toolbar: search filters items within the open category
(function wireProductToolbar() {
  const input = document.getElementById('prod-search');
  const x = document.getElementById('prod-search-x');
  if (input) {
    let t = null;
    input.oninput = () => {
      x.classList.toggle('on', !!input.value);
      clearTimeout(t);
      t = setTimeout(() => Engine.setQuery('products', input.value), 130);
    };
    if (x) x.onclick = () => {
      input.value = ''; x.classList.remove('on');
      Engine.setQuery('products', '');
    };
  }
  const den = document.getElementById('prod-density');
  if (den) {
    den.onclick = () => {
      const next = Engine.density() === 'compact' ? 'comfortable' : 'compact';
      Engine.setDensity(next);
      den.classList.toggle('on', next === 'compact');
      renderSettings();
    };
    den.classList.toggle('on', Engine.density() === 'compact');
  }
})();

// handy for debugging in the console
window.decks = { plan: planDeck, home: homeDeck, products: productDeck };

// ── plan dashboard (live) ───────────────────────────────────
function renderPlanDash() {
  const el = document.getElementById('plan-dash');
  if (!el) return;
  const chk = Engine.checkProgress('daily', DAILY_CHECKLIST.key, DAILY_CHECKLIST.items.length);
  const tasks = DB.get('todos', []);
  const open = tasks.filter(t => !t.done).length;

  const cards = [
    {
      v: chk.on + '/' + chk.total, c: chk.pct === 100 ? 'var(--green2)' : chk.pct > 0 ? 'var(--gold)' : 'var(--text3)',
      l: 'Daily check', s: chk.pct + '% today'
    },
    {
      v: streakData.count, c: streakData.count > 0 ? 'var(--accent2)' : 'var(--text3)',
      l: 'Streak', s: streakData.count > 7 ? 'unstoppable' : streakData.count > 0 ? 'keep going' : 'start today'
    },
    {
      v: String(open), c: open === 0 ? 'var(--green2)' : open ? 'var(--blue)' : 'var(--text3)',
      l: 'Open tasks', s: open === 0 && tasks.length ? 'all clear' : tasks.length + ' total'
    }
  ];
  el.innerHTML = cards.map(c =>
    '<div class="dash-card"><div class="dash-val" style="color:' + c.c + '">' + escapeHtml(String(c.v)) + '</div>' +
    '<div class="dash-lbl">' + c.l + '</div><div class="dash-sub">' + escapeHtml(c.s) + '</div></div>'
  ).join('');
}

// ── toolbar ─────────────────────────────────────────────────
(function wireToolbar() {
  const sel = document.getElementById('plan-sort');
  if (sel) {
    sel.innerHTML = SORTS.map(o => '<option value="' + o.id + '">' + o.label + '</option>').join('');
    sel.value = DB.get('planDeck_sort', 'order');
    sel.onchange = () => { Engine.sort('plan', sel.value); renderPlanDash(); };
  }

  const input = document.getElementById('plan-search');
  const x = document.getElementById('plan-search-x');
  if (input) {
    let t = null;
    input.oninput = () => {
      x.classList.toggle('on', !!input.value);
      clearTimeout(t);
      t = setTimeout(() => Engine.search('plan', input.value), 120);
    };
    if (x) x.onclick = () => { input.value = ''; x.classList.remove('on'); Engine.search('plan', ''); };

    // "/" focuses search, Escape closes results
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus(); }
      if (e.key === 'Escape') { Engine.search('plan', ''); input.value = ''; x.classList.remove('on'); input.blur(); }
    });
  }

  const exp = document.getElementById('plan-expand');
  if (exp) {
    let open = false;
    exp.onclick = () => { open = !open; Engine.toggleAll('plan', open); exp.classList.toggle('on', open); };
  }

  const den = document.getElementById('plan-density');
  if (den) {
    den.onclick = () => {
      const next = Engine.density() === 'compact' ? 'comfortable' : 'compact';
      Engine.setDensity(next);
      den.classList.toggle('on', next === 'compact');
      renderSettings();
    };
    den.classList.toggle('on', Engine.density() === 'compact');
  }
})();

Engine.density();

// ── density in settings ─────────────────────────────────────
window.toggleDensity = function () {
  const next = Engine.density() === 'compact' ? 'comfortable' : 'compact';
  Engine.setDensity(next);
  const d = document.getElementById('plan-density');
  if (d) d.classList.toggle('on', next === 'compact');
  renderSettings();
};

window.resetPlanNav = function () {
  localStorage.removeItem('gu_planDeck');
  localStorage.removeItem('gu_homeDeck');
  alert('Tab positions reset.');
  window.location.reload();
};

// reflect density in settings
(function patchRenderSettings() {
  const base = window.renderSettings;
  window.renderSettings = function () {
    base();
    const compact = Engine.density() === 'compact';
    const t = document.getElementById('density-toggle');
    const l = document.getElementById('density-label');
    if (t) t.classList.toggle('on', compact);
    if (l) l.textContent = 'Currently: ' + (compact ? 'Compact' : 'Comfortable');
  };
})();

// ── restore last screen ─────────────────────────────────────
(function restoreScreen() {
  const id = DB.get('screen', null);
  if (id && id !== 'home' && document.getElementById('screen-' + id)) {
    window.switchScreen(id);
  }
})();
