// ─────────────────────────────────────────────────────────────
// GLOWUP ENGINE v5 — generic, data-driven content deck
//
// One ordered registry drives everything: category tabs, sub-tabs,
// panes, search, sort and density. Adding / reordering content is a
// one-line change in js/data/library.js.
//
// Deck groups come in two flavours:
//   dom:   '#selector'  -> sections are existing .tab-pane nodes inside
//                          the selector; engine rebuilds the tab row,
//                          owns visibility. Existing markup preserved.
//   data:  [sections]    -> engine renders the pane from the block model.
// ─────────────────────────────────────────────────────────────

const DB = {
  get(k, d) { try { const v = localStorage.getItem('gu_' + k); return v ? JSON.parse(v) : d } catch { return d } },
  set(k, v) { try { localStorage.setItem('gu_' + k, JSON.stringify(v)) } catch { } }
};

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ── accent lookup ────────────────────────────────────────────
const TONES = {
  accent: 'var(--accent2)', gold: 'var(--gold)', green: 'var(--green2)',
  red: '#ff6b6b', blue: 'var(--blue)', pink: 'var(--pink)',
  orange: 'var(--orange)', indigo: '#818cf8',
  text2: 'var(--text2)', text3: 'var(--text3)'
};
const TONE_BG = {
  accent: 'rgba(124,92,252,.15)', gold: 'rgba(245,200,66,.15)', green: 'rgba(46,204,113,.15)',
  red: 'rgba(231,76,60,.15)', blue: 'rgba(79,195,247,.15)', pink: 'rgba(244,114,182,.15)',
  orange: 'rgba(251,146,60,.15)', indigo: 'rgba(129,140,248,.15)',
  text2: 'rgba(144,144,176,.15)', text3: 'rgba(90,90,122,.15)'
};
const tone = t => TONES[t] || TONES.accent;
const toneBg = t => TONE_BG[t] || TONE_BG.accent;

// ─────────────────────────────────────────────────────────────
// CHECKLIST STATE
// scope 'daily'      -> resets when the calendar date changes
// scope 'persistent' -> survives until cleared
// ─────────────────────────────────────────────────────────────
function checklistState(scope, key) {
  const raw = DB.get('bpChecks', {});
  const id = scope + ':' + key;
  if (scope === 'daily') {
    const rec = raw[id];
    if (rec && rec.date === todayKey()) return { date: rec.date, done: rec.done };
    return { date: todayKey(), done: [] };
  }
  return { date: null, done: (raw[id] && raw[id].done) || [] };
}
function toggleChecklistItem(scope, key, idx) {
  const raw = DB.get('bpChecks', {});
  const id = scope + ':' + key;
  const st = checklistState(scope, key);
  st.done[idx] = !st.done[idx];
  raw[id] = st;
  DB.set('bpChecks', raw);
}
function resetChecklist(scope, key) {
  const raw = DB.get('bpChecks', {});
  raw[scope + ':' + key] = { date: todayKey(), done: [] };
  DB.set('bpChecks', raw);
}

// ─────────────────────────────────────────────────────────────
// BLOCK RENDERERS
// each returns an HTML string; blocks never contain <script>
// ─────────────────────────────────────────────────────────────
const R = {

  // callout banner
  note(b) {
    return '<div class="bp-note bp-t-' + (b.tone || 'accent') + '">' +
      '<div class="bp-note-title">' + esc(b.title || '') + '</div>' +
      '<div class="bp-note-text">' + esc(b.text || '') + '</div>' +
      '</div>';
  },

  // callout with optional bullet list
  callout(b) {
    const t = b.tone || 'accent';
    let body = '<div class="bp-note-text">' + esc(b.text || '') + '</div>';
    if (b.list && b.list.length) {
      body += '<ul class="bp-cal-list">' + b.list.map(i =>
        '<li><span class="bp-cal-dot"></span><span>' + esc(i) + '</span></li>').join('') + '</ul>';
    }
    return '<div class="bp-note bp-t-' + t + '">' +
      '<div class="bp-note-title">' + (b.icon ? '<span class="bp-ic">' + esc(b.icon) + '</span>' : '') + esc(b.title || '') + '</div>' +
      body + '</div>';
  },

  // stat-card grid
  summary(b) {
    const cols = b.cols || 3;
    let h = b.title ? '<div class="section-title">' + esc(b.title) + '</div>' : '';
    h += '<div class="bp-stats" style="grid-template-columns:repeat(' + cols + ',1fr)">';
    for (const it of b.items || []) {
      const t = it.tone || 'accent';
      h += '<div class="bp-stat" style="border-color:' + toneBg(t) + '">' +
        '<div class="bp-stat-val" style="color:' + tone(t) + '">' + esc(it.val) +
        (it.unit ? '<span class="bp-stat-unit">' + esc(it.unit) + '</span>' : '') + '</div>' +
        '<div class="bp-stat-lbl">' + esc(it.lbl) + '</div>' +
        (it.note ? '<div class="bp-stat-note">' + esc(it.note) + '</div>' : '') +
        '</div>';
    }
    return h + '</div>';
  },

  // dense table. row[tone] optional 4th field colours the first cell
  table(b) {
    let h = b.title
      ? '<div class="section-title">' + (b.icon ? '<span class="bp-ic">' + esc(b.icon) + '</span>' : '') + esc(b.title) + '</div>'
      : '';
    h += '<div class="bp-tablewrap' + (b.scroll ? ' bp-scroll' : '') + '"><table class="bp-table">';
    h += '<thead><tr>' + b.cols.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>';
    for (const r of b.rows || []) {
      const rt = r[3] || null;
      h += '<tr>' + r.slice(0, b.cols.length).map((c, i) =>
        '<td' + (i === 0 ? ' class="bp-td-key"' : '') + (i === 0 && rt ? ' style="color:' + tone(rt) + '"' : '') + '>' + esc(c) + '</td>'
      ).join('') + '</tr>';
    }
    h += '</tbody></table></div>';
    if (b.caption) h += '<div class="bp-caption">' + esc(b.caption) + '</div>';
    return h;
  },

  // key / value rows — the workhorse for bullet lists
  list(b) {
    let h = b.title
      ? '<div class="section-title">' + (b.icon ? '<span class="bp-ic">' + esc(b.icon) + '</span>' : '') + esc(b.title) + '</div>'
      : '';
    h += '<div class="bp-kv">';
    for (const it of b.items || []) {
      h += '<div class="bp-kv-row"><div class="bp-kv-k">' + esc(it.k) + '</div>' +
        '<div class="bp-kv-v">' + esc(it.v) + '</div></div>';
    }
    return h + '</div>';
  },

  // numbered key / value
  steps(b) {
    let h = b.title
      ? '<div class="section-title">' + (b.icon ? '<span class="bp-ic">' + esc(b.icon) + '</span>' : '') + esc(b.title) + '</div>'
      : '';
    h += '<div class="bp-kv">';
    (b.items || []).forEach((it, i) => {
      h += '<div class="bp-kv-row bp-kv-num"><div class="bp-num">' + (i + 1) + '</div>' +
        '<div><div class="bp-kv-k">' + esc(it.k) + '</div>' +
        '<div class="bp-kv-v">' + esc(it.v) + '</div></div></div>';
    });
    return h + '</div>';
  },

  // inline chip cloud
  chips(b) {
    let h = b.title
      ? '<div class="section-title">' + (b.icon ? '<span class="bp-ic">' + esc(b.icon) + '</span>' : '') + esc(b.title) + '</div>'
      : '';
    h += '<div class="bp-chips">';
    for (const c of b.items || []) {
      h += '<div class="bp-chip bp-chip-' + (b.tone || 'accent') + '">' + esc(c) + '</div>';
    }
    return h + '</div>';
  },

  // collapsible groups — persisted open state
  accordion(b) {
    const state = DB.get('bpAcc_' + b._k, {});
    let h = b.title
      ? '<div class="section-title">' + (b.icon ? '<span class="bp-ic">' + esc(b.icon) + '</span>' : '') + esc(b.title) + '</div>'
      : '';
    (b.items || []).forEach((g, i) => {
      const open = !!state[i];
      const t = g.tone || 'accent';
      h += '<div class="bp-acc' + (open ? ' open' : '') + '">' +
        '<div class="bp-acc-head" onclick="Engine.toggleAcc(\'' + b._k + '\',' + i + ',this)">' +
        (g.n ? '<span class="bp-acc-n" style="background:' + toneBg(t) + ';color:' + tone(t) + '">' + esc(g.n) + '</span>' : '') +
        '<h4>' + esc(g.title) + '</h4><span class="bp-acc-arrow">&#x25BC;</span></div>' +
        '<div class="bp-acc-body"><ul>';
      for (const li of g.items || []) {
        h += '<li><span class="bp-li-ic">' + esc(li.i || '\u{2022}') + '</span><span' +
          (li.strong ? ' class="bp-strong"' : '') + '>' + esc(li.t) + '</span></li>';
      }
      h += '</ul></div></div>';
    });
    return h;
  },

  // ── product catalogue: tier filter + item-level search ────
  products(b) {
    const all = b.items || [];
    const secId = b._sec ? b._sec.id : 'products';
    const deckId = b.deck || 'products';
    const tier = DB.get('prodTier_' + secId, 'all');
    const q = (b._q || '').toLowerCase().trim();
    const terms = q.split(/\s+/).filter(Boolean);

    const scoped = (b.cat && b.cat !== 'all') ? all.filter(p => p.cat === b.cat) : all;
    let list = scoped;
    if (tier !== 'all') list = list.filter(p => p.tier === tier);
    if (terms.length) {
      list = list.filter(p => {
        const hay = (p.name + ' ' + p.benefit + ' ' + (p.from || '')).toLowerCase();
        return terms.every(t => hay.includes(t));
      });
    }

    const tiers = b.tiers || [];
    let h = tiers.length ? '<div class="bp-tier-row">' + tiers.map(t =>
      '<button class="bp-tier' + (t.id === tier ? ' on' : '') + '" onclick="Engine.setTier(\'' +
      deckId + '\',\'' + secId + '\',\'' + t.id + '\')">' + esc(t.label) + '</button>').join('') + '</div>' : '';

    h += '<div class="bp-count">' + list.length + ' of ' + scoped.length + ' products' +
      (q ? ' matching "' + esc(q) + '"' : '') + '</div>';

    if (!list.length) {
      return h + '<div class="bp-empty">Nothing matches. Clear the search or pick another tier.</div>';
    }

    h += '<div class="bp-prods">';
    for (const p of list) {
      const t = p.tier === 'premium' ? 'gold' : p.tier === 'mid' ? 'accent' : 'green';
      h += '<div class="bp-prod">' +
        '<div class="bp-prod-top"><div class="bp-prod-name">' + esc(p.name) + '</div>' +
        '<span class="bp-chip bp-prod-tier bp-chip-' + t + '">' + esc(p.tier) + '</span></div>' +
        '<div class="bp-prod-ben">' + esc(p.benefit) + '</div>' +
        (p.from ? '<div class="bp-prod-from">From ' + esc(p.from) + '</div>' : '') +
        '<div class="shop-btns">' + (p.shop || []).map(l =>
          '<a class="shop-btn ' + (l.label === 'iHerb' ? 'shop-btn-iherb' : 'shop-btn-amazon') +
          '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>').join('') + '</div>' +
        '</div>';
    }
    return h + '</div>';
  },

  // persisted checkable list
  checklist(b) {
    const scope = b.scope || (b.persistent ? 'persistent' : 'daily');
    const st = checklistState(scope, b.key);
    const done = st.done;
    let h = b.title
      ? '<div class="section-title">' + (b.icon ? '<span class="bp-ic">' + esc(b.icon) + '</span>' : '') + esc(b.title) +
      '<button class="btn-mini" onclick="Engine.resetCheck(\'' + scope + '\',\'' + esc(b.key) + '\')">Reset</button></div>'
      : '';
    h += '<div class="bp-check">';
    (b.items || []).forEach((it, i) => {
      const on = !!done[i];
      h += '<div class="bp-check-row' + (on ? ' on' : '') + '" onclick="Engine.toggleCheck(\'' + scope + '\',\'' + esc(b.key) + '\',' + i + ',this)">' +
        '<div class="bp-box' + (on ? ' on' : '') + '">\u2713</div>' +
        '<div class="bp-check-txt"><div>' + (it.icon ? '<span class="bp-li-ic">' + esc(it.icon) + '</span>' : '') + esc(it.label) + '</div>' +
        (it.note ? '<div class="bp-check-note">' + esc(it.note) + '</div>' : '') +
        '</div></div>';
    });
    h += '</div>';
    const n = (b.items || []).length, c = (b.items || []).filter((_, i) => done[i]).length;
    h += '<div class="bp-check-meter"><div class="bp-meter"><div class="bp-meter-fill" style="width:' +
      (n ? Math.round(c / n * 100) : 0) + '%;background:linear-gradient(90deg,var(--green),var(--green2))"></div></div>' +
      '<span class="bp-meter-lbl">' + c + '/' + n + '</span></div>';
    return h;
  }
};

// ─────────────────────────────────────────────────────────────
// DECK — tabs + sub-tabs + panes + search + sort
// ─────────────────────────────────────────────────────────────
const decks = new Map();

class Deck {
  constructor(root, opts) {
    this.root = typeof root === 'string' ? document.querySelector(root) : root;
    this.o = opts;
    this.stateKey = opts.stateKey;
    this.sort = DB.get(this.stateKey + '_sort', opts.sort || 'order');
    this.groups = [];
    this.sections = [];
    this.index = [];
  }

  // ---- registration ----------------------------------------
  addGroup(g) {
    const group = {
      id: g.id, label: g.label, icon: g.icon || '', tone: g.tone || 'accent',
      sections: []
    };
    if (g.dom) {
      const host = document.querySelector(g.dom);
      if (host) {
        const panes = Array.from(host.querySelectorAll(':scope > .tab-pane'));
        panes.forEach((pane, i) => {
          const meta = (g.map && g.map[pane.id]) || {};
          group.sections.push({
            id: meta.id || pane.id, label: meta.label || pane.id,
            icon: meta.icon || '', tone: meta.tone || group.tone,
            n: meta.n, keywords: meta.keywords || '', priority: meta.priority,
            el: pane, group: group.id, data: false
          });
          pane.setAttribute('data-pane', group.id + '/' + (meta.id || pane.id));
          pane.setAttribute('role', 'tabpanel');
          pane.classList.add('tab-pane');
        });
        host.setAttribute('data-deck-group', group.id);
      }
    } else {
      (g.sections || []).forEach(s => {
        // blueprint data uses `title`; the engine addresses sections by `label`
        group.sections.push(Object.assign({}, s, {
          label: s.label || s.title || s.id,
          group: group.id,
          data: true
        }));
      });
    }
    this.groups.push(group);
    group.sections.forEach(s => this.sections.push(s));
    return this;
  }

  // ---- index for search ------------------------------------
  buildIndex() {
    this.index = this.sections.map(s => {
      const text = s.data
        ? JSON.stringify(Object.assign({}, s, { el: undefined })).replace(/\\u\{([0-9a-f]+)\}/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        : (s.el ? s.el.textContent : '');
      return {
        sec: s,
        group: this.groups.find(g => g.id === s.group),
        hay: ((s.label || '') + ' ' + (s.keywords || '') + ' ' + text).toLowerCase()
      };
    });
  }

  // ---- sort ------------------------------------------------
  applySort() {
    const mode = this.sort;
    const num = s => (s.n == null ? 999 : s.n);
    for (const g of this.groups) {
      if (mode === 'az') g.sections.sort((a, b) => String(a.label).localeCompare(String(b.label)));
      else if (mode === 'za') g.sections.sort((a, b) => String(b.label).localeCompare(String(a.label)));
      else if (mode === 'priority') g.sections.sort((a, b) => (b.priority || 0) - (a.priority || 0) || num(a) - num(b));
      else if (mode === 'reverse') g.sections.sort((a, b) => num(b) - num(a));
      else g.sections.sort((a, b) => num(a) - num(b));
    }
    this.buildIndex();
  }

  setSort(mode) {
    this.sort = mode;
    DB.set(this.stateKey + '_sort', mode);
    this.applySort();
    this.renderTabs();
    for (const g of this.groups) {
      const bar = this.barFor(g.id);
      if (bar) bar.dataset.built = '';
    }
    const st = DB.get(this.stateKey, {});
    this.show(st.cat || (this.groups[0] && this.groups[0].id), st.sec || null, true);
    this.flushFades();
  }

  // ---- chrome ---------------------------------------------
  renderChrome() {
    this.tabsEl = this.root.querySelector('[data-deck-tabs]');
    if (this.tabsEl) this.renderTabs();
  }

  renderTabs() {
    if (!this.tabsEl) return;
    if (this.groups.length < 2) { this.tabsEl.innerHTML = ''; this.tabsEl.style.display = 'none'; return; }
    this.tabsEl.style.display = '';
    this.tabsEl.setAttribute('role', 'tablist');
    this.tabsEl.setAttribute('aria-label', 'Categories');
    this.tabsEl.innerHTML = this.groups.map(g =>
      '<button class="cat-tab" role="tab" data-cat="' + g.id + '" aria-selected="false">' +
      (g.icon ? '<span class="bp-ic">' + g.icon + '</span>' : '') + esc(g.label) + '</button>'
    ).join('');
    this.tabsEl.querySelectorAll('.cat-tab').forEach(b => {
      b.onclick = () => this.show(b.dataset.cat, null, true);
    });
  }

  // ---- sub-tab row: one per group, lives inside the group --
  barFor(groupId) {
    const host = this.root.querySelector('[data-deck-group="' + groupId + '"]');
    if (!host) return null;
    let wrap = host.querySelector(':scope > .stabs-wrap[data-deck-wrap]');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'stabs-wrap';
      wrap.setAttribute('data-deck-wrap', groupId);
      host.insertBefore(wrap, host.firstChild);
    }
    let bar = wrap.querySelector(':scope > .stabs[data-deck-bar]');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'stabs';
      bar.setAttribute('data-deck-bar', groupId);
      wrap.appendChild(bar);
    }
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', 'Sections');
    if (!bar.dataset.fadeBound) {
      bar.dataset.fadeBound = '1';
      const sync = () => {
        const max = bar.scrollWidth - bar.clientWidth;
        if (max <= 2) bar.dataset.pos = 'none';
        else if (bar.scrollLeft <= 2) bar.dataset.pos = 'start';
        else if (bar.scrollLeft >= max - 2) bar.dataset.pos = 'end';
        else bar.dataset.pos = 'mid';
      };
      bar.addEventListener('scroll', sync, { passive: true });
      this._pendingSync = this._pendingSync || [];
      this._pendingSync.push(sync);
    }
    return bar;
  }

  // run the scroll-position syncs after layout settles
  flushFades() {
    if (!this._pendingSync) return;
    const fns = this._pendingSync;
    this._pendingSync = [];
    requestAnimationFrame(() => fns.forEach(f => f()));
  }

  renderBar(groupId) {
    const g = this.groups.find(x => x.id === groupId);
    const bar = this.barFor(groupId);
    if (!g || !bar) return;
    bar.innerHTML = g.sections.map(s =>
      '<button class="stab" role="tab" data-sec="' + s.id + '" data-group="' + g.id + '" aria-selected="false">' +
      (s.n ? '<span class="bp-stab-n">' + s.n + '</span>' : '') +
      (s.icon ? '<span class="bp-ic">' + s.icon + '</span>' : '') + esc(s.label) + '</button>'
    ).join('');
    bar.querySelectorAll('.stab').forEach(b => {
      b.onclick = () => this.show(b.dataset.group, b.dataset.sec, true);
    });
  }

  // ---- data panes -----------------------------------------
  mountDataPanes() {
    for (const s of this.sections) {
      if (!s.data) continue;
      const host = this.root.querySelector('[data-deck-group="' + s.group + '"]');
      if (!host) continue;
      let pane = host.querySelector('[data-pane="' + s.group + '/' + s.id + '"]');
      if (!pane) {
        pane = document.createElement('div');
        pane.className = 'tab-pane';
        pane.setAttribute('data-pane', s.group + '/' + s.id);
        host.appendChild(pane);
      }
      pane.id = pane.id || ('pane-' + s.group + '-' + s.id);
      pane.setAttribute('role', 'tabpanel');
      pane.style.display = 'none';
      s.el = pane;
    }
  }

  // keyboard activation for the custom div-based toggles
  a11y(pane) {
    pane.querySelectorAll('.bp-acc-head, .bp-check-row').forEach(el => {
      if (el.dataset.a11y) return;
      el.dataset.a11y = '1';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-expanded', el.classList.contains('open') ? 'true' : 'false');
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          el.click();
        }
      });
    });
  }

  renderPane(s) {
    if (!s.data || !s.el) return;
    s._key = this.stateKey + '_' + s.id;
    s.el.innerHTML = (s.blocks || []).map((b, bi) => {
      const fn = R[b.type];
      // unique state key per block, so two accordions in one section
      // never share their open/closed state
      return fn ? fn.call(R, Object.assign({
        _k: s._key + '_b' + bi,
        _q: this.searchTerm || '',
        _sec: s
      }, b)) : '';
    }).join('');
    this.a11y(s.el);
  }

  // ---- navigation -----------------------------------------
  groupHost(gid) {
    return this.root.querySelector('[data-deck-group="' + gid + '"]');
  }

  show(catId, secId, write) {
    const g = this.groups.find(x => x.id === catId) || this.groups[0];
    if (!g) return;
    this.activeGroup = g.id;

    // only the active group container is visible
    for (const other of this.groups) {
      const host = this.groupHost(other.id);
      if (host) host.style.display = other.id === g.id ? '' : 'none';
    }

    if (this.tabsEl) this.tabsEl.querySelectorAll('.cat-tab').forEach(b => {
      const on = b.dataset.cat === g.id;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    const bar = this.barFor(g.id);
    if (bar && bar.dataset.built !== g.id) { bar.dataset.built = g.id; this.renderBar(g.id); }

    const s = secId ? g.sections.find(x => x.id === secId) : g.sections[0];
    if (!s) return;
    const prev = this.active;

    for (const other of this.sections) {
      if (!other.el) continue;
      const on = other === s;
      if (on) this.renderPane(other);
      other.el.style.display = on ? 'block' : 'none';
    }

    if (bar) bar.querySelectorAll('.stab').forEach(b => {
      const on = b.dataset.sec === s.id;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center' });
    });

    this.active = s;
    this.root.setAttribute('data-active-section', s.id);
    if (write) DB.set(this.stateKey, { cat: g.id, sec: s.id });
    if (this.o.onChange) this.o.onChange(s, g);
    // switching sections should land at the top of the deck, but the very
    // first render (restoring state) must not fight the browser
    if (prev && prev !== s && typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  // ---- search ---------------------------------------------
  query(q) {
    this.buildIndex();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return null;
    return this.index
      .map(e => {
        let score = 0;
        for (const t of terms) {
          const inLabel = e.sec.label.toLowerCase().includes(t) ? 3 : 0;
          const inKw = (e.sec.keywords || '').toLowerCase().includes(t) ? 2 : 0;
          if (!e.hay.includes(t)) return null;
          score += inLabel + inKw + 1;
        }
        return { e, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
  }

  setQuery(q) {
    // NB: field is `searchTerm`, NOT `query` — `query()` is the search method
    this.searchTerm = q || '';
    if (this.active) this.renderPane(this.active);
    this.renderResults(this.searchTerm);
  }

  renderResults(q) {
    const box = this.root.querySelector('[data-deck-results]');
    if (!box) return;
    const hits = this.query(q);
    if (!hits) { box.innerHTML = ''; box.classList.remove('on'); return; }
    box.classList.add('on');
    box.innerHTML = '<div class="bp-res-h">' + hits.length + ' result' + (hits.length === 1 ? '' : 's') + '</div>' +
      hits.map(h => {
        const s = h.e.sec;
        return '<button class="bp-res" data-g="' + s.group + '" data-s="' + s.id + '">' +
          (s.n ? '<span class="bp-res-n">' + s.n + '</span>' : (s.icon ? '<span class="bp-ic">' + s.icon + '</span>' : '')) +
          '<span class="bp-res-t">' + esc(s.label) + '</span>' +
          '<span class="bp-res-g">' + esc(h.e.group.label) + '</span></button>';
      }).join('');
    box.querySelectorAll('.bp-res').forEach(b => {
      b.onclick = () => {
        this.show(b.dataset.g, b.dataset.s, true);
        box.classList.remove('on');
        box.innerHTML = '';
        const sc = this.root.querySelector('.scroll') || this.root;
        if (sc.scrollTo) sc.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
  }

  // re-render a section after its tier filter changes
  setTier(secId, tier) {
    DB.set('prodTier_' + secId, tier);
    const s = this.sections.find(x => x.id === secId);
    if (s) this.renderPane(s);
  }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────
export const Engine = {
  decks: new Map(),

  create(id, root, opts) {
    const d = new Deck(root, opts);
    (opts.groups || []).forEach(g => d.addGroup(g));
    this.decks.set(id, d);
    d.applySort();
    d.mountDataPanes();
    d.renderChrome();
    d.sections.filter(s => s.data).forEach(s => d.renderPane(s));
    const st = DB.get(d.stateKey, {});
    d.show(st.cat || (d.groups[0] && d.groups[0].id), st.sec || null, true);
    d.flushFades();
    return d;
  },

  deck(id) { return this.decks.get(id) },

  toggleAcc(key, idx, head) {
    const st = DB.get('bpAcc_' + key, {});
    st[idx] = !st[idx];
    DB.set('bpAcc_' + key, st);
    const acc = head.parentElement;
    if (acc) acc.classList.toggle('open', !!st[idx]);
  },

  toggleCheck(scope, key, idx, el) {
    toggleChecklistItem(scope, key, idx);
    el.classList.toggle('on');
    const box = el.querySelector('.bp-box');
    if (box) box.classList.toggle('on');
    const list = el.parentElement;
    const total = list.querySelectorAll('.bp-check-row').length;
    let on = 0;
    list.querySelectorAll('.bp-check-row').forEach(r => r.classList.contains('on') && on++);
    const wrap = list.parentElement;
    const fill = wrap.querySelector('.bp-meter-fill');
    const lbl = wrap.querySelector('.bp-meter-lbl');
    if (fill) fill.style.width = (total ? Math.round(on / total * 100) : 0) + '%';
    if (lbl) lbl.textContent = on + '/' + total;
    // keep the deck's live summary in sync with the checklist
    for (const d of this.decks.values()) {
      if (d.o && d.o.onChange) d.o.onChange(d.active, d.groups.find(g => g.id === d.activeGroup));
    }
  },

  resetCheck(scope, key) { resetChecklist(scope, key) },

  checkProgress(scope, key, len) {
    const st = checklistState(scope, key);
    let on = 0;
    for (let i = 0; i < len; i++) if (st.done[i]) on++;
    return { on, total: len, pct: len ? Math.round(on / len * 100) : 0 };
  },

  sort(id, mode) { const d = this.decks.get(id); if (d) d.setSort(mode) },

  search(id, q) { const d = this.decks.get(id); if (d) d.renderResults(q) },

  // item-level search: re-renders the open pane with the term applied
  setQuery(id, q) { const d = this.decks.get(id); if (d) d.setQuery(q) },

  // product tier filter
  setTier(id, secId, tier) { const d = this.decks.get(id); if (d) d.setTier(secId, tier); },

  // expand / collapse every accordion in a deck
  toggleAll(id, open) {
    const d = this.decks.get(id);
    if (!d) return;
    d.sections.forEach(s => {
      if (!s.data) return;
      (s.blocks || []).forEach((b, bi) => {
        if (b.type !== 'accordion') return;
        const key = d.stateKey + '_' + s.id + '_b' + bi;
        const st = {};
        (b.items || []).forEach((_, ai) => { st[ai] = open; });
        DB.set('bpAcc_' + key, st);
      });
    });
    d.sections.filter(s => s.data && s.el).forEach(s => d.renderPane(s));
    d.show(d.activeGroup, d.active && d.active.id, false);
  },

  // ── density ───────────────────────────────────────────
  density() {
    const d = DB.get('density', 'comfortable');
    document.documentElement.setAttribute('data-density', d);
    return d;
  },
  setDensity(d) {
    DB.set('density', d);
    document.documentElement.setAttribute('data-density', d);
  },

  utils: { esc, slug, todayKey, tone, toneBg }
};

// inline onclick handlers in rendered markup need a global handle
if (typeof window !== 'undefined') window.Engine = Engine;
