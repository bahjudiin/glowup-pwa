/* ============================================================================
   GlowUp — app.js
   Vanilla ES2019. No framework, no build step at runtime. Data comes from
   data.js (window.GLOWUP_DATA), which is generated from the Phase-1 Markdown
   library by extract.py.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.GLOWUP_DATA;
  if (!D) {
    console.error("GlowUp: data.js did not load");
    return;
  }

  /* ---------------------------------------------------------------- helpers */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var store = {
    get: function (k, def) {
      try { var v = localStorage.getItem("glowup:" + k); return v === null ? def : JSON.parse(v); }
      catch (e) { return def; }
    },
    set: function (k, v) {
      try { localStorage.setItem("glowup:" + k, JSON.stringify(v)); } catch (e) {}
    }
  };
  var money = function (n) { return n == null ? "—" : "$" + n.toFixed(2); };
  var perServe = function (n) { return n == null ? "—" : "$" + n.toFixed(3).replace(/0$/, ""); };
  var gradeKey = function (g) {
    return "grade-" + String(g || "Moderate").replace(/[^A-Za-z]/g, "").replace("ModerateHigh", "ModerateHigh");
  };
  var gradeClass = function (g) {
    var k = String(g || "").replace(/–/g, "-");
    if (k === "High") return "grade-High";
    if (k === "Moderate-High") return "grade-ModerateHigh";
    if (k === "Moderate") return "grade-Moderate";
    if (k === "Low-Moderate") return "grade-LowModerate";
    return "grade-Low";
  };
  var gradeBg = function (g) {
    var k = String(g || "").replace(/–/g, "-");
    if (k === "High") return "bg-grade-High";
    if (k === "Moderate-High") return "bg-grade-ModerateHigh";
    if (k === "Moderate") return "bg-grade-Moderate";
    if (k === "Low-Moderate") return "bg-grade-LowModerate";
    return "bg-grade-Low";
  };
  var GRADE_RANK = { "High": 0, "Moderate–High": 1, "Moderate": 2, "Low–Moderate": 3, "Low": 4 };
  /* Product destinations are limited to two vendors: iHerb (verified prices)
     and Amazon (search links only — prices never claimed). */
  /* Editorial copy (copy.js) — human voice, kept separate from the research data. */
  var C = window.GLOWUP_COPY || { ui: {}, hooks: {}, intros: {} };
  var copyTxt = function (key, fallback) {
    var v = C.ui ? C.ui[key] : null;
    return (v === undefined || v === null || v === "") ? fallback : v;
  };
  var hookFor = function (id) { return (C.hooks && C.hooks[id]) || ""; };
  var pick = function (map, key, fallback) {
    var m = C[map];
    return (m && m[key]) || fallback || "";
  };

  /* Illustrations are inlined as data URIs (art.js) so no image is ever fetched. */
  var ART = (window.GLOWUP_ART && window.GLOWUP_ART.img) ? window.GLOWUP_ART : { img: {}, alt: {} };
  var artSrc = function (id) {
    var a = (window.GLOWUP_ART && window.GLOWUP_ART.alias) || {};
    return ART.img[id] || ART.img[a[id]] || "";
  };
  var art = function (id, cls, extra) {
    var src = artSrc(id);
    if (!src) return "";
    return '<img class="' + cls + '" src="' + src + '" alt="' + esc(ART.alt[id] || "") +
      '" loading="lazy" decoding="async"' + (extra || "") + " />";
  };
  var artBanner = function (id, cls) {
    return artSrc(id) ? '<div class="art-wrap">' + art(id, cls || "art-banner") + "</div>" : "";
  };
  var linkFor = function (p, vendor) {
    var ls = p && p.links ? p.links : [], i;
    for (i = 0; i < ls.length; i++) if (ls[i].vendor === vendor) return ls[i];
    return null;
  };
  var vendorAnchor = function (p, vendor, cls) {
    var l = linkFor(p, vendor);
    if (!l) return "";
    var label = vendor === "iHerb"
      ? (l.kind === "product" ? "iHerb" : "iHerb search")
      : "Amazon search";
    var title = l.kind === "product"
      ? "Opens the iHerb product page (price verified " + D.meta.priceVerifiedOn + ")"
      : "Opens a " + vendor + " search — not a product page, price not checked";
    return '<a class="' + (cls || "vendor-link") + '" href="' + esc(l.url) + '" target="_blank" ' +
      'rel="noopener noreferrer nofollow" title="' + esc(title) + '">' + ICON.ext + label + "</a>";
  };
  var catName = function (id) {
    var c = D.categories.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : id;
  };
  var debounce = function (fn, ms) {
    var t; return function () {
      var a = arguments, self = this;
      clearTimeout(t); t = setTimeout(function () { fn.apply(self, a); }, ms || 140);
    };
  };
  var norm = function (s) { return String(s == null ? "" : s).toLowerCase(); };
  var toastMsg = function (msg) {
    var host = $("#toast");
    if (!host) return;
    host.innerHTML = '<div class="animate-slide-up rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">' + esc(msg) + "</div>";
    clearTimeout(toastMsg._t);
    toastMsg._t = setTimeout(function () { host.innerHTML = ""; }, 2200);
  };

  /* ---------------------------------------------------------------- state */
  var state = {
    view: "home",
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    articles: { q: "", cat: "all", grade: "all", sort: "grade" },
    food: { q: "", group: "all", sort: "protein", mode: "cards" },
    products: { q: "", cat: "all", verifiedOnly: false, sort: "cost", mode: "list", budget: "all" },
    guides: { tab: "fasting" },
    learn: "library",     /* last Learn subview: library | guides | articles */
    library: { section: "health", topic: "sleep" },
    fuel: "food",         /* last Fuel subview   */
    plan: { open: null }, /* blueprint UI state  */
    search: { q: "", scope: "all" },
    shopping: store.get("shopping", {})
  };

  /* ================================================================ ICONS */
  var ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-3.5 w-3.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m4 12.5 5 5L20 6.5"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><path d="M14 4h6v6M20 4 10 14M18 14v6H4V6h6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-4 w-4"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M12 3 2.5 20h19z"/><path d="M12 9v5M12 17h.01"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M4 9v6h3.5L13 20V4L7.5 9H4z"/><path d="M17 8.5a5 5 0 0 1 0 7"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M9 5v14M15 5v14"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 6 8 12l10 6zM6 5v14"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M6 6l10 6-10 6zM18 5v14"/></svg>'
  };

  /* ============================================================ HOME VIEW */
  /* ============================================================== PLAN STATE
     The blueprint (phases, steps, daily check) lives in plan.js so the copy
     stays editable. Everything here is progress *on top of* that data, kept in
     localStorage next to the existing keys and never touching the data layer:
       plan.start      ISO date of day 1
       plan.steps      { stepId: true }      steps + weekly tasks ticked
       plan.setup      { setupId: true }     one-time setup items
       plan.phase      last phase the user opened
       plan.history    { "YYYY-MM-DD": checkedCount }
       check.<date>    [checkIds]  (same pattern as the existing shopping key)
  */
  var P = (window.GLOWUP_PLAN && window.GLOWUP_PLAN.phases ? window.GLOWUP_PLAN : { phases: [], dailyCheck: [], setup: [] });
  var PLAN_STREAK_MIN = 4;                 /* strength is not a daily thing */

  function isoDay(d) {
    var x = d || new Date();
    return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2);
  }
  function planStart() {
    var s = store.get("plan.start", "");
    if (!s) { s = isoDay(); store.set("plan.start", s); }
    return s;
  }
  function dayNumber() {
    var a = planStart().split("-"), b = isoDay().split("-");
    var d1 = new Date(+a[0], +a[1] - 1, +a[2]), d2 = new Date(+b[0], +b[1] - 1, +b[2]);
    return Math.max(1, Math.round((d2 - d1) / 86400000) + 1);
  }
  function phaseForDay(n) {
    /* weeks are indicative: phase 1 = 1–14, 2 = 15–56, 3 = 57–112, 4 = 113+ */
    if (n <= 14) return 0;
    if (n <= 56) return 1;
    if (n <= 112) return 2;
    return 3;
  }
  function stepMap() { return store.get("plan.steps", {}) || {}; }
  function setupMap() { return store.get("plan.setup", {}) || {}; }
  function todayChecks() { return store.get("check." + isoDay(), []) || []; }
  function phaseSteps(ph) {
    var out = (ph.steps || []).concat(ph.weekly || []);
    return out;
  }
  function phaseDone(ph) {
    var m = stepMap(), done = 0, all = phaseSteps(ph);
    all.forEach(function (s) { if (m[s.id]) done++; });
    return { done: done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  }
  function totalDone() {
    var m = stepMap(), done = 0, all = 0;
    P.phases.forEach(function (ph) { all += phaseSteps(ph).length; });
    Object.keys(m).forEach(function (k) { if (m[k]) done++; });
    return { done: done, total: all, pct: all ? Math.round((done / all) * 100) : 0 };
  }
  function history() { return store.get("plan.history", {}) || {}; }
  function toggleCheck(id) {
    var key = "check." + isoDay();
    var list = todayChecks().slice();
    var i = list.indexOf(id);
    if (i > -1) list.splice(i, 1); else list.push(id);
    store.set(key, list);
    var h = history(); h[isoDay()] = list.length; store.set("plan.history", h);
    return list;
  }
  function streakDays() {
    var h = history(), n = 0, d = new Date();
    for (var i = 0; i < 400; i++) {
      var k = isoDay(d), count = (k === isoDay()) ? todayChecks().length : (h[k] || 0);
      if (count >= PLAN_STREAK_MIN) { n++; d.setDate(d.getDate() - 1); continue; }
      if (i === 0) { d.setDate(d.getDate() - 1); continue; }   /* today can still be finished */
      break;
    }
    return n;
  }
  function currentPhaseIndex() {
    var saved = store.get("plan.phase", null);
    return (saved === null || saved === undefined) ? phaseForDay(dayNumber()) : Math.max(0, Math.min(P.phases.length - 1, saved | 0));
  }
  function nextStep() {
    var ph = P.phases[currentPhaseIndex()], m = stepMap();
    if (!ph) return null;
    var list = ph.steps || [];
    for (var i = 0; i < list.length; i++) if (!m[list[i].id]) return { step: list[i], phase: ph, index: i };
    return null;
  }
  function planLink(target) {
    /* every plan row can point at a guide page or an article sheet */
    if (!target) return "";
    if (target.type === "guide") return ' data-openguide="' + target.id + '"';
    return ' data-article="' + target.id + '"';
  }
  function planLinkLabel(target) {
    if (!target) return "";
    if (target.type === "guide") {
      var g = (window.GLOWUP_GUIDES.tabs || []).filter(function (t) { return t.id === target.id; })[0];
      return g ? g.title : "Guide";
    }
    var a = byId(target.id);
    return a ? a.title : "Article";
  }

  /* ============================================================ SEGMENTS */
  function segBtn(view, label, active) {
    return '<button type="button" data-subnav="' + view + '" aria-pressed="' + (active ? "true" : "false") + '">' + esc(label) + "</button>";
  }
  function fuelSeg(active) {
    return '<div class="seg mb-3" role="group" aria-label="Fuel">' +
      segBtn("food", "Foods", active === "food") + segBtn("meals", "Meals & list", active === "meals") + "</div>";
  }

  /* ============================================================== TODAY */
  function greeting() {
    var h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }

  function renderToday() {
    var checks = todayChecks();
    var list = P.dailyCheck || [];
    var done = checks.length, total = list.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    var dn = dayNumber(), pi = currentPhaseIndex(), ph = P.phases[pi];
    var tot = totalDone(), streak = streakDays(), ns = nextStep();
    var html = "";

    html += '<div class="page-head"><div>' +
      '<h1 class="page-title">' + greeting() + "</h1>" +
      '<p class="page-sub">' + new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" }) +
      " · day " + dn + " of the plan</p></div>" +
      (streak ? '<span class="badge badge-success shrink-0">' + streak + " day streak</span>" : "") +
      "</div>";

    /* today card */
    html += '<div class="card mt-3 flex items-center gap-4 p-4">' +
      '<div class="progress-ring" style="--p:' + pct + '" role="img" aria-label="' + done + ' of ' + total + ' checks done today">' +
        '<div class="progress-ring-val"><b>' + done + "/" + total + "</b><span>Today</span></div></div>" +
      '<div class="min-w-0 flex-1">' +
        '<p class="text-sm font-semibold leading-tight">' + (ph ? "Phase " + ph.n + " · " + esc(ph.title) : "Blueprint") + "</p>" +
        '<p class="mt-0.5 text-xs text-muted-foreground">' + (ph ? esc(ph.weeks) + " · " + esc(ph.tagline) : "") + "</p>" +
        '<div class="bar mt-2.5"><i style="width:' + tot.pct + '%"></i></div>' +
        '<p class="mt-1.5 text-[11px] text-muted-foreground">' + tot.done + " of " + tot.total + " steps done · " +
          (done === total && total ? "day complete" : Math.max(0, total - done) + " left today") + "</p>" +
      "</div></div>";

    /* daily check */
    html += '<div class="sec"><h2>Daily check</h2><span class="sec-note">' + done + "/" + total + "</span></div>";
    html += list.map(function (c) {
      var on = checks.indexOf(c.id) > -1;
      return '<button class="check-row" data-check="' + esc(c.id) + '" data-done="' + on + '" aria-pressed="' + on + '">' +
        '<span class="check-box" aria-hidden="true">' + ICON.check + "</span>" +
        '<span class="min-w-0 flex-1"><span class="check-label">' + esc(c.label) + "</span>" +
        '<span class="check-hint block">' + esc(c.hint) + "</span></span></button>";
    }).join("");

    /* next step */
    if (ns) {
      html += '<div class="sec"><h2>Next step</h2><button class="sec-note" data-goto="plan" style="color:hsl(var(--primary))">Open plan</button></div>';
      html += '<div class="card p-4">' +
        '<p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phase ' + ns.phase.n + " · step " + (ns.index + 1) + " of " + (ns.phase.steps || []).length + "</p>" +
        '<p class="mt-1.5 text-[15px] font-semibold leading-snug">' + esc(ns.step.title) + "</p>" +
        '<p class="mt-1 text-[12.5px] leading-snug text-muted-foreground">' + esc(ns.step.detail) + "</p>" +
        '<button class="btn btn-default btn-sm mt-3" data-step="' + esc(ns.step.id) + '">' + ICON.check + " Mark done</button>" +
        "</div>";
    } else {
      html += '<div class="sec"><h2>Next step</h2></div>';
      html += '<div class="card p-4"><p class="text-sm font-semibold">Every step is ticked.</p>' +
        '<p class="mt-1 text-xs text-muted-foreground">Now the job is just maintenance: weekly weigh-in, two strength sessions, protein high.</p></div>';
    }

    /* where to go next */
    html += '<div class="sec"><h2>Go to</h2></div><div class="tiles">';
    html += tile("plan", "Blueprint", "Phases, steps, tasks", '<path d="M9 4h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9"/><path d="M5 4h2v16H5z"/>');
    html += tile("library", "Library", "Health, fitness, lifestyle, mind", '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>');
    html += tile("food", "Foods & meals", "26 foods, 5 templates", '<path d="M12 21c4-3.2 7-6.4 7-10a7 7 0 1 0-14 0c0 3.6 3 6.8 7 10Z"/>');
    html += tile("products", "Products", "18 checked, cost per serving", '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>');
    html += "</div>";

    /* the numbers */
    var facts = [
      ["0.5–1.0%", "body weight lost per week is the fastest reasonably safe rate", "fast-fat-loss"],
      ["1.62 g/kg", "protein intake where the muscle benefit plateaus", "protein"],
      ["25–29 g", "fibre per day tied to the largest risk reduction", "fibre"],
      ["−4.7% vs −2.1%", "8-year weight change, intensive programme vs control", "maintenance"]
    ];
    html += '<div class="sec"><h2>The numbers</h2></div>';
    html += facts.map(function (f) {
      return '<button class="row-card" data-article="' + f[2] + '">' +
        '<span class="row-meta" style="min-width:5.6rem;text-align:left"><b style="font-size:13px;color:hsl(var(--primary))">' + f[0] + "</b></span>" +
        '<span class="row-main"><span class="row-sub block">' + f[1] + "</span></span></button>";
    }).join("");

    /* safety */
    html += '<section class="mt-5 rounded-[14px] border border-border bg-secondary/40 p-4">' +
      '<div class="flex items-start gap-2 ' + gradeClass("Moderate") + '">' + ICON.warn +
        '<p class="text-xs font-semibold leading-snug">' + esc(copyTxt("disclaimerTitle", "Safety first")) + "</p></div>" +
      '<p class="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">' + esc(copyTxt("disclaimer", D.meta.disclaimer)) + "</p>" +
      '<p class="mt-2 text-[11px] leading-relaxed text-muted-foreground">Not medical advice. If you take medication for diabetes or blood pressure, are pregnant or breastfeeding, have kidney disease, or have a history of disordered eating, speak to a clinician before fasting or restricting intake.</p>' +
      "</section>";

    $("#view-home").innerHTML = html;
    syncPlanBar("Today");
  }

  function tile(view, title, sub, path) {
    return '<button class="tile" data-goto="' + view + '">' +
      '<span class="tile-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="h-[18px] w-[18px]">' + path + "</svg></span>" +
      '<span class="tile-title">' + esc(title) + "</span>" +
      '<span class="tile-sub">' + esc(sub) + "</span></button>";
  }

  function syncPlanBar(label) {
    var el = $("#app-bar-sub");
    if (el) el.textContent = label;
  }

  /* ================================================================= PLAN */
  function renderPlan() {
    if (!P.phases.length) { $("#view-plan").innerHTML = emptyState("The plan did not load."); return; }
    var pi = currentPhaseIndex(), ph = P.phases[pi];
    var checks = todayChecks(), daily = P.dailyCheck || [];
    var tot = totalDone(), streak = streakDays(), dn = dayNumber();
    var sm = stepMap(), setm = setupMap();

    var html = "";
    html += '<div class="page-head"><div>' +
      '<h1 class="page-title">Blueprint</h1>' +
      '<p class="page-sub">' + esc(P.intro) + "</p></div></div>";

    /* overview */
    html += '<div class="card mt-3 p-4">' +
      '<div class="flex items-center justify-between gap-3">' +
        '<div class="min-w-0">' +
          '<p class="text-sm font-semibold">Day ' + dn + " · phase " + ph.n + " of " + P.phases.length + "</p>" +
          '<p class="mt-0.5 text-xs text-muted-foreground">' + tot.done + " of " + tot.total + " steps ticked" +
            (streak ? " · " + streak + " day streak" : "") + "</p>" +
        "</div>" +
        '<span class="text-lg font-semibold" style="color:hsl(var(--primary))">' + tot.pct + "%</span>" +
      "</div>" +
      '<div class="bar mt-2.5"><i style="width:' + tot.pct + '%"></i></div>' +
      '<div class="kpis mt-3">' +
        kpi(dn, "day in") + kpi(checks.length + "/" + daily.length, "today") + kpi(streak, "day streak") +
      "</div></div>";

    /* stepper */
    html += '<div class="stepper mt-3" role="tablist" aria-label="Phases">' + P.phases.map(function (x, i) {
      return '<button role="tab" class="step-chip" data-phase="' + i + '" aria-current="' + (i === pi) + '">' +
        '<span class="step-chip-n">' + (i + 1) + "</span>" + esc(x.title) + "</button>";
    }).join("") + "</div>";

    /* phase card */
    var pd = phaseDone(ph);
    html += '<div class="card mt-3 p-4">' +
      '<p class="t-eyebrow">' + esc(ph.weeks) + "</p>" +
      '<h2 class="mt-1 text-[19px] font-semibold leading-tight">' + esc(ph.title) + "</h2>" +
      '<p class="mt-1 text-[13px] font-medium" style="color:hsl(var(--primary))">' + esc(ph.tagline) + "</p>" +
      '<p class="mt-2 text-[13px] leading-relaxed text-muted-foreground">' + esc(ph.goal) + "</p>" +
      '<div class="bar mt-3"><i style="width:' + pd.pct + '%"></i></div>' +
      '<p class="mt-1.5 text-[11px] text-muted-foreground">' + pd.done + " of " + pd.total + " steps in this phase</p>" +
      "</div>";

    /* steps */
    html += '<div class="sec"><h2>Steps</h2><span class="sec-note">tap to tick</span></div>';
    html += (ph.steps || []).map(function (s, i) {
      var on = !!sm[s.id];
      return '<button class="plan-step" data-step="' + esc(s.id) + '" data-done="' + on + '" aria-pressed="' + on + '">' +
        '<span class="num">' + (on ? "✓" : i + 1) + "</span>" +
        '<span class="min-w-0 flex-1"><span class="plan-step-title block">' + esc(s.title) + "</span>" +
        '<span class="plan-step-detail block">' + esc(s.detail) + "</span></span></button>";
    }).join("");

    /* daily focus */
    var focus = (ph.daily || []).map(function (id) {
      return daily.filter(function (c) { return c.id === id; })[0];
    }).filter(Boolean);
    if (focus.length) {
      html += '<div class="sec"><h2>Every day in this phase</h2></div>';
      html += focus.map(function (c) {
        var on = checks.indexOf(c.id) > -1;
        return '<button class="check-row" data-check="' + esc(c.id) + '" data-done="' + on + '" aria-pressed="' + on + '">' +
          '<span class="check-box" aria-hidden="true">' + ICON.check + "</span>" +
          '<span class="min-w-0 flex-1"><span class="check-label">' + esc(c.label) + "</span>" +
          '<span class="check-hint block">' + esc(c.hint) + "</span></span></button>";
      }).join("");
    }

    /* weekly tasks */
    if ((ph.weekly || []).length) {
      html += '<div class="sec"><h2>This week</h2><span class="sec-note">tick when done</span></div>';
      html += ph.weekly.map(function (s) {
        var on = !!sm[s.id];
        return '<button class="plan-step" data-step="' + esc(s.id) + '" data-done="' + on + '" aria-pressed="' + on + '">' +
          '<span class="num">' + (on ? "✓" : "•") + "</span>" +
          '<span class="min-w-0 flex-1"><span class="plan-step-title block">' + esc(s.title) + "</span>" +
          '<span class="plan-step-detail block">' + esc(s.detail) + "</span></span></button>";
      }).join("");
    }

    /* reading */
    if ((ph.reading || []).length) {
      html += '<div class="sec"><h2>Read this phase</h2></div>';
      html += ph.reading.map(function (r) {
        return '<button class="row-card" ' + (r.type === "guide" ? 'data-openguide="' + r.id + '"' : 'data-article="' + r.id + '"') + ">" +
          '<span class="tile-ico" style="margin:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="h-4 w-4"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/></svg></span>' +
          '<span class="row-main"><span class="row-title block">' + esc(planLinkLabel(r)) + "</span>" +
          '<span class="row-sub block">' + (r.type === "guide" ? "Guide" : "Article") + "</span></span>" +
          '<span class="row-meta">' + ICON.arrow + "</span></button>";
      }).join("");
    }

    /* kit */
    if ((ph.kit || []).length) {
      html += '<div class="sec"><h2>Kit for this phase</h2></div>';
      html += ph.kit.map(function (k) {
        var p = D.products.filter(function (x) { return x.id === k.id; })[0];
        if (!p) return "";
        return '<button class="row-card" data-product="' + esc(p.id) + '">' +
          '<span class="row-main"><span class="row-title block">' + esc(p.name) + "</span>" +
          '<span class="row-sub block">' + esc(k.why) + "</span></span>" +
          '<span class="row-meta"><b>' + (p.costPerServing != null ? perServe(p.costPerServing) : "—") + "</b>/serving</span></button>";
      }).join("");
    }

    /* setup checklist — only meaningful in phase 1 */
    if (pi === 0 && (P.setup || []).length) {
      html += '<div class="sec"><h2>Before you start</h2><span class="sec-note">once only</span></div>';
      html += P.setup.map(function (s) {
        var on = !!setm[s.id];
        return '<button class="plan-step" data-setup="' + esc(s.id) + '" data-done="' + on + '" aria-pressed="' + on + '">' +
          '<span class="num">' + (on ? "✓" : "○") + "</span>" +
          '<span class="min-w-0 flex-1"><span class="plan-step-title block">' + esc(s.title) + "</span>" +
          '<span class="plan-step-detail block">' + esc(s.detail) + "</span></span></button>";
      }).join("");
    }

    /* done-when + warning */
    html += '<div class="card mt-4 p-4">' +
      '<p class="t-eyebrow">You can move on when</p>' +
      '<p class="mt-1 text-[13px] leading-relaxed">' + esc(ph.doneWhen) + "</p></div>";
    if (ph.warn) {
      html += '<div class="callout callout-warn mt-2"><p class="callout-title">Read this twice</p>' +
        '<p class="mt-1 text-[12.5px] leading-snug">' + esc(ph.warn) + "</p></div>";
    }

    /* controls */
    html += '<div class="sec"><h2>This plan</h2></div>' +
      '<div class="card p-4 text-[12px] leading-relaxed text-muted-foreground">' +
        "Started " + esc(planStart()) + ". Progress is saved on this device only. The content is unchanged — " +
        "the same guides, articles, foods and products as before, just organised into an order." +
        '<div class="mt-3 flex flex-wrap gap-2">' +
          '<button class="btn btn-outline btn-sm" id="plan-reset-day">Clear today’s tick marks</button>' +
          '<button class="btn btn-ghost btn-sm" id="plan-restart">Start the plan again today</button>' +
        "</div></div>";

    $("#view-plan").innerHTML = html;
    syncPlanBar("Blueprint");
  }

  /* re-render whichever screen owns the control that was just tapped */
  function rerenderCurrent() {
    if (state.view === "home") renderToday();
    else if (state.view === "plan") renderPlan();
  }

  function kpi(v, label) {
    return '<div class="kpi"><b>' + esc(String(v)) + "</b><span>" + esc(label) + "</span></div>";
  }

  function statTile(n, label) {
    return '<div class="text-center">' +
      '<dd class="text-lg font-semibold leading-none text-foreground">' + n + "</dd>" +
      '<dt class="mt-1 text-micro uppercase tracking-[0.08em] text-muted-foreground">' + label + "</dt></div>";
  }
  /* jump to the shopping list from the home quick links */
  function scrollShopIntoView() {
    var el = document.querySelector("#view-meals [data-shop-head]") ||
             document.querySelector("#view-meals h2");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function sectionHead(title, badge, attr) {
    return '<div ' + (attr || "") + ' class="mt-6 flex items-baseline justify-between gap-3">' +
      '<h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">' + esc(title) + "</h2>" +
      (badge ? '<span class="text-micro text-muted-foreground">' + esc(badge) + "</span>" : "") +
      "</div>";
  }
  function byId(id) {
    return D.articles.filter(function (a) { return a.id === id; })[0];
  }

  /* ========================================================= ARTICLE CARDS */
  function articleCard(a) {
    var thumb = artSrc(a.category) ? art(a.category, "art-square card-photo") : "";
    return '<article class="card w-full overflow-hidden">' +
      '<button class="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-secondary/60" data-article="' + a.id + '">' +
        thumb +
        '<div class="min-w-0 flex-1">' +
          '<div class="mb-1 flex flex-wrap items-center gap-1.5">' +
            '<span class="badge badge-secondary">' + esc(catName(a.category)) + "</span>" +
            '<span class="badge ' + gradeBg(a.grade) + " " + gradeClass(a.grade) + '">' + esc(a.grade) + "</span>" +
            '<span class="badge badge-outline">' + a.readMinutes + " min</span>" +
          "</div>" +
          '<h3 class="text-base font-semibold leading-snug">' + esc(a.title) + "</h3>" +
          (hookFor(a.id)
            ? '<p class="mt-1 text-sm leading-snug text-muted-foreground">' + esc(hookFor(a.id)) + "</p>"
            : '<p class="mt-1 text-sm leading-snug text-muted-foreground line-clamp-2">' + esc(a.subtitle) + "</p>") +
          '<div class="mt-2 flex items-center justify-between gap-2 text-micro text-muted-foreground">' +
            "<span>" + a.references.length + " sources</span>" +
            '<span class="inline-flex items-center gap-1 text-primary">Read ' + ICON.arrow + "</span>" +
          "</div>" +
        "</div>" +
      "</button></article>";
  }

  /* ======================================================= ARTICLES VIEW */
  function renderArticles() {
    var s = state.articles;
    var list = D.articles.filter(function (a) {
      if (s.cat !== "all" && a.category !== s.cat) return false;
      if (s.grade !== "all" && a.grade !== s.grade) return false;
      if (s.q) {
        var hay = norm(a.title + " " + a.subtitle + " " + a.summary.join(" ") + " " + a.points.join(" "));
        if (hay.indexOf(norm(s.q)) === -1) return false;
      }
      return true;
    });
    var sorters = {
      grade: function (x, y) { return (GRADE_RANK[x.grade] - GRADE_RANK[y.grade]) || x.title.localeCompare(y.title); },
      az: function (x, y) { return x.title.localeCompare(y.title); },
      short: function (x, y) { return x.readMinutes - y.readMinutes; },
      cat: function (x, y) { return catName(x.category).localeCompare(catName(y.category)) || x.title.localeCompare(y.title); }
    };
    list.sort(sorters[s.sort] || sorters.grade);

    var html = "";
    html += artBanner(s.cat !== "all" && ART.img[s.cat] ? s.cat : "library");
    html += '<div class="flex items-end justify-between gap-2">' +
      '<div><h2 class="t-title">' + esc(copyTxt("articlesTitle", "Articles")) + "</h2>" +
      '<p class="text-xs text-muted-foreground">' + esc(copyTxt("articlesIntro", "")) + "</p></div>" +
      '<span class="badge badge-outline shrink-0">' + list.length + " of " + D.articles.length + "</span></div>";

    html += '<div class="filter-dock">' +
      '<label class="sr-only" for="articles-q">Filter articles</label>' +
      '<input id="articles-q" class="input" type="search" placeholder="' + esc(copyTxt("filterPlaceholder", "Filter articles…")) + '" value="' + esc(s.q) + '" />' +
      '<div class="chip-row mt-2" role="group" aria-label="Filter by category">' +
        chip("all", s.cat, "All", D.articles.length) +
        D.categories.map(function (c) {
          var n = D.articles.filter(function (a) { return a.category === c.id; }).length;
          return chip(c.id, s.cat, c.name, n);
        }).join("") + "</div>" +
      '<div class="chip-row mt-1.5" role="group" aria-label="Evidence grade">' +
        [["all", "Any grade"], ["High", "High"], ["Moderate–High", "Mod-high"], ["Moderate", "Moderate"], ["Low–Moderate", "Low-mod"], ["Low", "Low"]]
          .map(function (g) { return gradeChip(g[0], s.grade, g[1]); }).join("") + "</div>" +
      '<div class="chip-row mt-1.5" role="group" aria-label="Sort articles">' +
        [["grade", "Evidence first"], ["az", "A–Z"], ["short", "Shortest"], ["cat", "Category"]]
          .map(function (o) { return sortChip(o[0], s.sort, o[1]); }).join("") + "</div>" +
      "</div>";

    html += '<div class="mt-3 space-y-2" id="articles-list">';
    if (!list.length) html += emptyState(copyTxt("articlesEmpty", "No articles match those filters."));
    list.forEach(function (a) { html += articleCard(a); });
    html += "</div>";
    $("#view-articles").innerHTML = librarySeg("articles") + html;
  }
  function chip(value, current, label, count) {
    return '<button class="chip" data-chip="' + value + '" aria-pressed="' + (current === value) + '">' +
      esc(label) + (count != null ? ' <span class="opacity-60">' + count + "</span>" : "") + "</button>";
  }
  function segMode(value, current, label) {
    return '<button data-mode="' + value + '" aria-pressed="' + (current === value) + '">' + esc(label) + "</button>";
  }
  function seg(value, current, label) {
    return '<button data-seg="' + value + '" aria-pressed="' + (current === value) + '">' + esc(label) + "</button>";
  }
  function emptyState(msg) {
    return '<div class="card p-6 text-center"><p class="text-sm text-muted-foreground">' + esc(msg) + "</p></div>";
  }

  /* =========================================================== FOOD VIEW */
  function renderFood() {
    var s = state.food;
    var groups = [
      ["all", "All foods"], ["protein", "Protein"], ["carb", "Starch & grain"],
      ["vegetable", "Vegetable"], ["fruit", "Fruit"]
    ];
    var list = D.nutrition.filter(function (f) {
      if (s.group !== "all" && f.group !== s.group) return false;
      if (s.q) {
        var hay = norm(f.name + " " + f.satiety);
        if (hay.indexOf(norm(s.q)) === -1) return false;
      }
      return true;
    });
    var sorters = {
      protein: function (x, y) { return (y.proteinPer100kcal || 0) - (x.proteinPer100kcal || 0); },
      fibre: function (x, y) { return (y.fibrePer100kcal || 0) - (x.fibrePer100kcal || 0); },
      volume: function (x, y) { return y.gPer100kcal - x.gPer100kcal; },
      kcal: function (x, y) { return x.kcal - y.kcal; },
      az: function (x, y) { return x.name.localeCompare(y.name); }
    };
    list.sort(sorters[s.sort] || sorters.protein);

    var html = "";
    html += artBanner("nutrition");
    html += '<div class="flex items-start justify-between gap-3"><div class="min-w-0">' +
      '<h2 class="t-title">' + esc(copyTxt("foodTitle", "Food")) + "</h2>" +
      '<p class="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">' + esc(copyTxt("foodIntro", "")) + "</p></div>" +
      '<button class="chip shrink-0" id="food-mode-toggle" aria-pressed="' + (s.mode === "table") + '">' +
        (s.mode === "table" ? "Cards" : "Table") + "</button></div>";
    if (s.group !== "all" && artSrc(s.group)) {
      html += '<div class="art-wrap mt-3">' + art(s.group, "art-sheet") + "</div>";
    }

    html += '<div class="filter-dock">' +
      '<label class="sr-only" for="food-q">Search foods</label>' +
      '<input id="food-q" class="input" type="search" placeholder="Search foods…" value="' + esc(s.q) + '" />' +
      '<div class="chip-row mt-2" role="group" aria-label="Filter by food group">' +
        groups.map(function (g) { return chip(g[0], s.group, g[1]); }).join("") + "</div>" +
      '<div class="chip-row mt-1.5" role="group" aria-label="Sort foods">' +
        [["protein", "Protein"], ["fibre", "Fibre"], ["volume", "Volume"], ["kcal", "Low kcal"], ["az", "A–Z"]]
          .map(function (o) { return sortChip(o[0], s.sort, o[1]); }).join("") +
      "</div></div>";

    if (s.mode === "table") {
      html += list.length ? foodTable(list) : emptyState(copyTxt("foodEmpty", "No foods match."));
      $("#view-food").innerHTML = fuelSeg("food") + html;
      return;
    }

    html += '<div class="mt-3 space-y-2">';
    if (!list.length) html += emptyState(copyTxt("foodEmpty", "No foods match."));
    list.forEach(function (f) {
      var prow = Math.min(100, Math.round(((f.proteinPer100kcal || 0) / 25) * 100));
      var frow = Math.min(100, Math.round(((f.fibrePer100kcal || 0) / 12) * 100));
      var vrow = Math.min(100, Math.round((f.gPer100kcal / 700) * 100));
      html +=
        '<article class="card p-3">' +
          '<div class="flex items-start gap-3">' +
            '<div class="min-w-0 flex-1">' +
              '<div class="flex items-start justify-between gap-2">' +
                '<h3 class="text-base font-semibold leading-tight">' + esc(f.name) + "</h3>" +
                '<span class="badge badge-secondary shrink-0">' + f.kcal + " kcal</span>" +
              "</div>" +
              '<div class="mt-2 grid grid-cols-3 gap-2 text-micro text-muted-foreground">' +
                metric("Protein", (f.protein || 0).toFixed(1) + " g", prow) +
                metric("Fibre", (f.fibre || 0).toFixed(1) + " g", frow) +
                metric("g / 100 kcal", String(f.gPer100kcal), vrow) +
              "</div>" +
              '<dl class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-micro text-muted-foreground">' +
                '<div><dt class="inline">Water </dt><dd class="inline font-medium text-foreground">' +
                  (f.water == null ? "&mdash;" : Math.round(f.water) + "%") + "</dd></div>" +
                '<div><dt class="inline">Protein/100 kcal </dt><dd class="inline font-medium text-foreground">' +
                  (f.proteinPer100kcal == null ? "&mdash;" : f.proteinPer100kcal) + "</dd></div>" +
                '<div><dt class="inline">Fibre/100 kcal </dt><dd class="inline font-medium text-foreground">' +
                  (f.fibrePer100kcal == null ? "&mdash;" : f.fibrePer100kcal) + "</dd></div>" +
              "</dl>" +
            "</div>" +
          "</div>" +
          '<p class="mt-2 text-sm leading-snug text-muted-foreground">' + esc(f.satiety) + "</p>" +
          '<a class="mt-1.5 inline-flex items-center gap-1 text-micro text-primary" href="https://fdc.nal.usda.gov/food-search?query=' + f.fdcId + '" target="_blank" rel="noopener noreferrer">FDC #' + f.fdcId + " " + ICON.ext + "</a>" +
        "</article>";
    });
    html += "</div>";
    html += '<p class="mt-4 text-micro leading-relaxed text-muted-foreground">Values are per 100 g, as-sold or raw, from the USDA SR Legacy dataset. Real food varies by ±10–15%. Satiety notes reference the Holt satiety index and appetite trials cited in the articles.</p>';
    $("#view-food").innerHTML = fuelSeg("food") + html;
  }
  function metric(label, value, pct) {
    return '<div class="min-w-0"><div class="truncate text-micro uppercase tracking-wide">' + esc(label) + "</div>" +
      '<div class="font-mono text-xs text-foreground">' + esc(value) + "</div>" +
      '<div class="bar mt-1"><span style="width:' + pct + '%"></span></div></div>';
  }

  /* ======================================================== PRODUCTS VIEW */
  /* ====================================================== PRODUCTS / SUPPLEMENTS
     Two presentations of the same 18 rows:
       · Buy list  — every SKU as a detailed card (price, servings, dose, risks)
       · Ledger    — supplements grouped by category, ranked by cost per serving
     Prices are only ever the iHerb ones verified on D.meta.priceVerifiedOn.      */

  function tierLabel(t) {
    return t === "budget" ? "Budget" : t === "value" ? "Value" : t === "premium" ? "Premium" : "Tool";
  }

  function specRow(label, value) {
    if (!value) return "";
    return '<div class="spec-row"><dt>' + esc(label) + "</dt><dd>" + value + "</dd></div>";
  }

  function sortChip(id, active, label) {
    return '<button class="chip" data-seg="' + id + '" aria-pressed="' + (id === active) + '">' + esc(label) + "</button>";
  }
  function gradeChip(id, active, label) {
    return '<button class="chip" data-grade="' + esc(id) + '" aria-pressed="' + (id === active) + '">' + esc(label) + "</button>";
  }
  function budgetChip(id, active, label) {
    return '<button class="chip" data-budget="' + id + '" aria-pressed="' + (id === active) + '">' + esc(label) + "</button>";
  }

  function productCard(p) {
    var unit = p.category === "vitamin-d" ? "softgels" : "g";
    var pack = p.sizeG ? Math.round(p.sizeG) + " " + unit + (p.category === "vitamin-d" ? "" : " pack") +
      (p.serveG && p.category !== "vitamin-d" ? " · " + p.serveG + " g per serving" : "")
      : "Equipment · nothing to re-buy";
    var grade = p.evidence.split(/[ (]/)[0];
    return '<button class="row-card" data-product="' + p.id + '">' +
      '<span class="row-main">' +
        '<span class="row-title block line-clamp-2">' + esc(p.name) + "</span>" +
        '<span class="row-sub block">' + esc(p.brand) + " · " + esc(pack) + "</span>" +
        '<span class="mt-1.5 flex flex-wrap items-center gap-1.5">' +
          '<span class="badge ' + gradeBg(grade) + " " + gradeClass(grade) + '">' + esc(grade) + "</span>" +
          '<span class="badge badge-outline">' + esc(tierLabel(p.tier)) + "</span>" +
          (p.priceVerified ? "" : '<span class="badge badge-warning">Not price-verified</span>') +
        "</span>" +
        '<span class="row-sub mt-1.5 block line-clamp-1">' + esc(p.purpose) + "</span>" +
      "</span>" +
      '<span class="row-meta">' +
        '<b>' + (p.priceVerified ? money(p.price) : "—") + "</b>" +
        (p.costPerServing != null ? perServe(p.costPerServing) + "/serv" : (p.priceVerified ? "iHerb" : "no price")) +
      "</span></button>";
  }

  var LEDGER_ORDER = ["creatine", "protein", "fibre", "vitamin-d"];

  function ledgerGroup(cat) {
    var rows = D.products.filter(function (p) { return p.category === cat; })
      .slice().sort(function (a, b) {
        var x = a.costPerServing == null ? Infinity : a.costPerServing;
        var y = b.costPerServing == null ? Infinity : b.costPerServing;
        return x - y;
      });
    if (!rows.length) return "";
    var best = rows[0];
    var verdict = (pick("ledgerVerdicts", cat) || "");
    var evidence = rows[0].evidence;

    var html = '<section class="mt-3 card overflow-hidden">' +
      '<div class="border-b border-border p-3.5">' +
        '<div class="flex items-start justify-between gap-2">' +
          "<div>" +
            '<h3 class="text-base font-semibold leading-tight">' + esc(copyTxt("cat_" + cat, cat)) + "</h3>" +
            '<p class="mt-1 text-sm leading-snug text-muted-foreground">' +
              esc(pick("ledgerPurposes", cat, rows[0].purpose)) + "</p>" +
          "</div>" +
          '<span class="badge ' + gradeBg(evidence.split(/[ (]/)[0]) + " " + gradeClass(evidence.split(/[ (]/)[0]) + ' shrink-0">' +
            esc(evidence) + "</span>" +
        "</div>" +
        (verdict ? '<p class="mt-2 text-sm leading-snug"><span class="font-semibold">' + esc(copyTxt("verdictLabel", "Verdict")) +
          ":</span> " + esc(verdict) + "</p>" : "") +
      "</div>" +
      '<ol class="divide-y divide-border">' +
      rows.map(function (p) {
        var isBest = p.id === best.id;
        return '<li class="ledger-row" data-product="' + p.id + '">' +
          '<div class="min-w-0 flex-1">' +
            '<p class="text-sm font-semibold leading-snug">' + esc(p.name) + "</p>" +
            '<p class="mt-0.5 text-micro text-muted-foreground">' + esc(tierLabel(p.tier)) +
              (p.sizeG ? " · " + Math.round(p.sizeG) + (p.category === "vitamin-d" ? " softgels" : " g") : "") +
              (p.servings ? " · " + Math.round(p.servings) + " servings" : "") + "</p>" +
          "</div>" +
          '<div class="shrink-0 text-right">' +
            '<p class="text-sm font-semibold leading-none">' + perServe(p.costPerServing) + "</p>" +
            '<p class="mt-1 text-micro text-muted-foreground">' + (p.priceVerified ? money(p.price) : "—") + " / pack</p>" +
          "</div>" +
          (isBest ? '<span class="ledger-best">' + esc(copyTxt("bestValue", "Best value")) + "</span>" : "") +
        "</li>";
      }).join("") +
      "</ol>" +
      (rows[0].risks || rows[0].contra
        ? '<div class="border-t border-border p-3.5">' +
            '<p class="text-xs leading-relaxed text-muted-foreground"><span class="font-semibold text-foreground">' +
            esc(copyTxt("watchOut", "Watch out")) + ":</span> " + esc(rows[0].risks) +
            (rows[0].contra ? " " + esc(copyTxt("notFor", "Not for")) + ": " + esc(rows[0].contra) + "." : "") + "</p></div>"
        : "") +
      "</section>";
    return html;
  }

  function supplementLedger() {
    var html = "";
    html += '<div class="mt-3 flex items-start justify-between gap-2">' +
      '<p class="text-sm leading-relaxed text-muted-foreground">' + esc(copyTxt("ledgerIntro", "")) + "</p></div>";
    LEDGER_ORDER.forEach(function (cat) { html += ledgerGroup(cat); });
    html += '<p class="mt-3 text-micro leading-relaxed text-muted-foreground">' + esc(copyTxt("ledgerFoot", "")) + "</p>";
    html += '<button class="btn btn-outline btn-sm mt-3" data-article="supplements">' +
      esc(copyTxt("ledgerReadOn", "Read the supplements review")) + " " + ICON.arrow + "</button>";
    return html;
  }

  function renderProducts() {
    var s = state.products;
    var cats = [["all", "All"], ["fibre", "Fibre"], ["creatine", "Creatine"], ["vitamin-d", "Vitamin D"], ["protein", "Protein"], ["device", "Tools"]];
    var list = D.products.filter(function (p) {
      if (s.cat !== "all" && p.category !== s.cat) return false;
      if (s.verifiedOnly && !p.priceVerified) return false;
      if (s.budget && s.budget !== "all") {
        if (p.price == null) return false;
        if (s.budget === "0-15" && !(p.price < 15)) return false;
        if (s.budget === "15-30" && !(p.price >= 15 && p.price <= 30)) return false;
        if (s.budget === "30-" && !(p.price > 30)) return false;
      }
      if (s.q) {
        var hay = norm(p.name + " " + p.brand + " " + p.purpose + " " + (p.use || "") + " " + (p.note || ""));
        if (hay.indexOf(norm(s.q)) === -1) return false;
      }
      return true;
    });
    var sorters = {
      cost: function (x, y) {
        var a = x.costPerServing == null ? Infinity : x.costPerServing;
        var b = y.costPerServing == null ? Infinity : y.costPerServing;
        return a - b;
      },
      price: function (x, y) {
        var a = x.price == null ? Infinity : x.price;
        var b = y.price == null ? Infinity : y.price;
        return a - b;
      },
      evidence: function (x, y) { return norm(x.evidence).localeCompare(norm(y.evidence)); },
      az: function (x, y) { return x.name.localeCompare(y.name); }
    };
    list.sort(sorters[s.sort] || sorters.cost);

    var verified = D.products.filter(function (p) { return p.priceVerified; }).length;
    var html = "";
    html += artBanner("supplements");
    html += '<div><h2 class="t-title">' + esc(copyTxt("productsTitle", "Products")) + "</h2>" +
      '<p class="mt-1 text-sm leading-relaxed text-muted-foreground">' + verified + " of " + D.products.length +
      " with prices checked on iHerb (" + esc(D.meta.priceVerifiedOn) + "). Cost per serving is calculated, never claimed.</p></div>";

    /* mode toggle: buy list ⇄ supplement ledger */
    html += '<div class="segmented mt-3 w-full" role="group" aria-label="Products view">' +
      segMode("list", s.mode, copyTxt("modeList", "Buy list")) +
      segMode("ledger", s.mode, copyTxt("modeLedger", "Supplement ledger")) +
      "</div>";

    if (s.mode === "ledger") {
      html += supplementLedger();
    } else {
      /* one sticky dock holds every filter, so the list never scrolls them away */
      html += '<div class="filter-dock">' +
        '<label class="sr-only" for="products-q">Search products</label>' +
        '<input id="products-q" class="input" type="search" placeholder="Search products, doses, brands…" value="' + esc(s.q) + '" />' +
        '<div class="chip-row mt-2" role="group" aria-label="Filter by product category">' +
          cats.map(function (c) { return chip(c[0], s.cat, c[1]); }).join("") +
        "</div>" +
        '<div class="chip-row mt-1.5" role="group" aria-label="Filter by budget">' +
          [["all", "Any budget"], ["0-15", "Under $15"], ["15-30", "$15–30"], ["30-", "$30 and up"]]
            .map(function (c) { return budgetChip(c[0], s.budget || "all", c[1]); }).join("") +
        "</div>" +
        '<div class="chip-row mt-1.5" role="group" aria-label="Sort products">' +
          [["cost", "Cost/serving"], ["price", "Price"], ["evidence", "Evidence"], ["az", "A–Z"]]
            .map(function (o) { return sortChip(o[0], s.sort, o[1]); }).join("") +
          '<button class="chip" id="verified-toggle" aria-pressed="' + s.verifiedOnly + '">Verified only</button>' +
        "</div></div>";

      html += '<div class="mt-1">';
      if (!list.length) html += emptyState(copyTxt("productsEmpty", "No products match."));
      list.forEach(function (p) { html += productCard(p); });
      html += "</div>";
      html += '<p class="mt-2 text-[11px] text-muted-foreground">Showing ' + list.length + " of " + D.products.length + " products</p>";
      html += '<p class="mt-3 text-micro leading-relaxed text-muted-foreground">' + esc(copyTxt("productsFootnote", "")) + "</p>";
      html += '<p class="mt-2 text-micro leading-relaxed text-muted-foreground">' +
        esc(copyTxt("productsFootnote2", "").replace("{date}", D.meta.priceVerifiedOn)) + "</p>";
    }
    $("#view-products").innerHTML = html;
  }

  /* ============================================================== FOOD TABLE */
  function foodTable(list) {
    return '<div class="table-wrap mt-3">' +
      '<table class="spec-table">' +
        "<thead><tr>" +
          '<th scope="col">Food</th>' +
          '<th scope="col">kcal</th>' +
          '<th scope="col">Protein</th>' +
          '<th scope="col">Fibre</th>' +
          '<th scope="col">g/100 kcal</th>' +
        "</tr></thead><tbody>" +
        list.map(function (f) {
          return '<tr data-food="' + esc(f.id) + '">' +
            '<th scope="row">' + esc(f.name) +
              '<span class="cell-sub">water ' + (f.water == null ? "&mdash;" : Math.round(f.water) + "%") +
              " · " + esc(copyTxt("cat_" + f.group, f.group)) + "</span></th>" +
            "<td>" + Math.round(f.kcal) + "</td>" +
            "<td>" + (f.protein || 0).toFixed(1) + " g</td>" +
            "<td>" + (f.fibre == null ? "&mdash;" : f.fibre.toFixed(1) + " g") + "</td>" +
            "<td>" + f.gPer100kcal + " g</td>" +
          "</tr>";
        }).join("") +
      "</tbody></table></div>" +
      '<p class="mt-2 text-micro leading-relaxed text-muted-foreground">' +
        "Per 100 g, USDA SR Legacy. g/100 kcal is the volume you get per calorie. Tap any row for the satiety note and the FDC ID.</p>";
  }

  /* =========================================================== GUIDES VIEW
     Six long-form pages (fasting, refeed, insulin, baseline, anti-ageing,
     looking younger). Copy lives in guides.js so the words stay editable without
     touching code; every page carries its own PubMed reference list, and inline
     [[n]] tokens become linked footnote numbers.                            */

  var G = (window.GLOWUP_GUIDES && window.GLOWUP_GUIDES.tabs) || [];
  var LIB = (window.GLOWUP_TOPICS && window.GLOWUP_TOPICS.sections) || [];

  function guideTab(id) {
    for (var i = 0; i < G.length; i++) if (G[i].id === id) return G[i];
    return G[0] || null;
  }

  /* **bold** + [[n]] -> markup. Escapes first, so the source text can stay plain. */
  function gTxt(str, refs) {
    var out = esc(str || "");
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\[\[(\d+)\]\]/g, function (m, n) {
      var r = (refs || []).filter(function (x) { return String(x.n) === n; })[0];
      if (!r) return "";
      return '<a class="cite" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer" ' +
        'aria-label="Source ' + n + ": " + esc(r.label) + '">' + n + "</a>";
    });
    return out;
  }

  function guideBlock(b, refs) {
    if (b.t === "p") return '<p class="mt-3 text-base leading-[1.55]">' + gTxt(b.text, refs) + "</p>";
    if (b.t === "h") return '<h3 class="mt-6 text-lg font-semibold leading-snug">' + gTxt(b.text, refs) + "</h3>";

    if (b.t === "list") {
      return '<ul class="mt-2 space-y-2">' + b.items.map(function (i) {
        return '<li class="flex gap-2 text-base leading-[1.5]"><span class="bullet-dot"></span><span>' +
          gTxt(i, refs) + "</span></li>";
      }).join("") + "</ul>";
    }

    if (b.t === "steps") {
      return '<ol class="mt-2 space-y-2">' + b.items.map(function (i, n) {
        return '<li class="flex gap-2.5 text-base leading-[1.5]"><span class="step-num">' + (n + 1) +
          "</span><span>" + gTxt(i, refs) + "</span></li>";
      }).join("") + "</ol>";
    }

    if (b.t === "table") {
      return '<div class="table-wrap mt-3" data-noread><table class="guide-table"><thead><tr>' +
        b.head.map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        b.rows.map(function (r) {
          return "<tr>" + r.map(function (cell, i) {
            return i === 0 ? '<th scope="row">' + gTxt(cell, refs) + "</th>" : "<td>" + gTxt(cell, refs) + "</td>";
          }).join("") + "</tr>";
        }).join("") +
        "</tbody></table></div>" +
        (b.note ? '<p class="mt-1.5 t-fine">' + gTxt(b.note, refs) + "</p>" : "");
    }

    if (b.t === "do") {
      return '<div class="mt-3 grid gap-2 sm:grid-cols-2">' +
        '<div class="do-card do-good"><p class="do-head">Eat this</p><ul>' +
          b.good.map(function (i) { return "<li>" + gTxt(i, refs) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="do-card do-bad"><p class="do-head">Skip this</p><ul>' +
          b.bad.map(function (i) { return "<li>" + gTxt(i, refs) + "</li>"; }).join("") + "</ul></div>" +
        "</div>";
    }

    if (b.t === "facts") {
      return '<dl class="mt-4 grid grid-cols-3 gap-2">' + b.items.map(function (f) {
        return '<div class="rounded-md bg-secondary/60 px-2 py-2.5 text-center">' +
          '<dd class="text-base font-semibold leading-none">' + esc(f[0]) + "</dd>" +
          '<dt class="mt-1 text-micro leading-tight text-muted-foreground">' + esc(f[1]) + "</dt></div>";
      }).join("") + "</dl>";
    }

    if (b.t === "img") {
      return '<figure class="mt-4">' + art(b.id, "art-banner", ' alt="' + esc(artAlt(b.id)) + '"') +
        (b.caption ? '<figcaption class="mt-1.5 t-fine">' + esc(b.caption) + "</figcaption>" : "") + "</figure>";
    }

    if (b.t === "callout") {
      return '<div class="callout callout-' + esc(b.kind || "tip") + '">' +
        '<p class="callout-title">' + esc(b.title) + "</p>" +
        '<p class="mt-1 text-sm leading-[1.5]">' + gTxt(b.text, refs) + "</p></div>";
    }
    return "";
  }

  function artAlt(id) {
    return (window.GLOWUP_ART && window.GLOWUP_ART.alt && window.GLOWUP_ART.alt[id]) || "";
  }

  function renderGuides() {
    var host = $("#view-guides");
    if (!host) return;
    if (!G.length) { host.innerHTML = emptyState("Guides did not load."); return; }
    var tab = guideTab(state.guides.tab) || G[0];
    state.guides.tab = tab.id;
    var refs = tab.refs || [];

    var html = "";

    /* sub-tabs — one row, scrolls sideways on a phone */
    html += '<div class="subtabs" role="tablist" aria-label="Guide topics">' +
      G.map(function (t) {
        return '<button role="tab" class="subtab" data-tab="' + t.id + '" aria-selected="' +
          (t.id === tab.id) + '">' + esc(t.label) + "</button>";
      }).join("") + "</div>";

    /* listen-to-this-page bar — same reader as articles, inline instead of in a sheet */
    html += '<div id="guide-reader" class="guide-reader"></div>';

    /* page */
    html += '<article class="guide" role="tabpanel" aria-label="' + esc(tab.label) + '">';
    html += '<div id="guide-content">';
    html += art(tab.hero, "art-guide-hero", ' alt="' + esc(tab.heroAlt || artAlt(tab.hero)) + '"');
    html += '<div class="px-1">';
    html += '<p class="t-eyebrow mt-4" data-noread>' + esc(tab.kicker) + "</p>";
    html += '<h1 class="t-hero mt-1.5">' + esc(tab.title) + "</h1>";
    html += '<p class="mt-3 text-base leading-[1.55] text-muted-foreground">' + esc(tab.lede) + "</p>";
    if (tab.facts) html += guideBlock({ t: "facts", items: tab.facts }, refs);
    tab.blocks.forEach(function (b) { html += guideBlock(b, refs); });
    html += "</div></div>";          /* end #guide-content */
    html += '<div class="px-1">';    /* related + sources + disclaimer: not read aloud */

    /* related reading */
    if (tab.related && tab.related.length) {
      html += '<h3 class="mt-6 text-lg font-semibold" data-noread>Read the evidence in full</h3>' +
        '<div class="mt-2 space-y-2">' + tab.related.map(function (id) {
          var a = byId(id);
          if (!a) return "";
          return '<button class="card w-full p-3 text-left hover:bg-secondary/60" data-article="' + a.id + '">' +
            '<span class="text-base font-semibold leading-snug">' + esc(a.title) + "</span>" +
            '<span class="mt-0.5 block text-micro text-muted-foreground">' + esc(a.grade) +
            " evidence · " + a.readMinutes + " min · " + a.references.length + " sources</span></button>";
        }).join("") + "</div>";
    }

    /* references */
    if (refs.length) {
      html += '<h3 class="mt-6 t-eyebrow">Sources on this page</h3>' +
        '<ol class="mt-2 space-y-1.5" data-noread>' + refs.map(function (r) {
          return '<li class="flex gap-2 text-xs leading-snug">' +
            '<span class="shrink-0 font-semibold text-muted-foreground">' + r.n + "</span>" +
            '<a class="text-primary hover:underline" href="' + esc(r.url) +
            '" target="_blank" rel="noopener noreferrer">' + esc(r.label) + "</a></li>";
        }).join("") + "</ol>";
    }

    html += '<p class="mt-6 text-micro leading-relaxed text-muted-foreground">' +
      "General information, not a diagnosis. Anything involving diabetes medication, blood pressure " +
      "drugs or a long fast belongs in a conversation with a doctor who can examine you.</p>";
    html += "</div></article>";

    host.innerHTML = librarySeg("guides") + html;
    mountGuideReader(tab);
  }

  /* ============================================================ LIBRARY
     Health · Fitness · Lifestyle · Mind, each with topic sub-tabs. A topic is a
     short page with its own reader, links into the deep guides/articles and the
     real products. This is the merged, de-duplicated index for the whole app. */

  function libSection(id) {
    for (var i = 0; i < LIB.length; i++) if (LIB[i].id === id) return LIB[i];
    return LIB[0] || null;
  }
  function libTopic(section, id) {
    if (!section) return null;
    for (var i = 0; i < section.topics.length; i++) if (section.topics[i].id === id) return section.topics[i];
    return section.topics[0] || null;
  }
  function libTxt(str, refs) {
    var out = esc(str || "");
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return out;
  }

  function librarySeg(active) {
    return '<div class="seg mb-3" role="group" aria-label="Learn">' +
      segBtn("library", "Library", active === "library") +
      segBtn("guides", "Guides", active === "guides") +
      segBtn("articles", "Articles", active === "articles") + "</div>";
  }

  function topicBlock(b) {
    if (b.t === "p") return '<p class="mt-3 text-base leading-[1.55]">' + libTxt(b.text) + "</p>";
    if (b.t === "h") return '<h3 class="mt-6 text-lg font-semibold leading-snug">' + libTxt(b.text) + "</h3>";
    if (b.t === "list") {
      return '<ul class="mt-2 space-y-2">' + b.items.map(function (i) {
        return '<li class="flex gap-2 text-base leading-[1.5]"><span class="bullet-dot"></span><span>' + libTxt(i) + "</span></li>";
      }).join("") + "</ul>";
    }
    if (b.t === "table") {
      return '<div class="table-wrap mt-3" data-noread><table class="guide-table"><thead><tr>' +
        b.head.map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        b.rows.map(function (r) {
          return "<tr>" + r.map(function (cell, i) {
            return i === 0 ? '<th scope="row">' + esc(cell) + "</th>" : "<td>" + esc(cell) + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>";
    }
    if (b.t === "callout") {
      return '<div class="callout callout-' + esc(b.kind || "tip") + '">' +
        '<p class="callout-title">' + esc(b.title) + "</p>" +
        '<p class="mt-1 text-sm leading-[1.5]">' + libTxt(b.text) + "</p></div>";
    }
    return "";
  }

  function renderLibrary() {
    var host = $("#view-library");
    if (!host) return;
    if (!LIB.length) { host.innerHTML = librarySeg("library") + emptyState("The library did not load."); return; }
    var sec = libSection(state.library.section) || LIB[0];
    var topic = libTopic(sec, state.library.topic);
    state.library.section = sec.id;
    state.library.topic = topic.id;

    var html = librarySeg("library");

    /* top-level sections */
    html += '<div class="lib-tabs" role="tablist" aria-label="Library sections">' + LIB.map(function (x) {
      return '<button role="tab" class="lib-tab" data-section="' + x.id + '" aria-selected="' + (x.id === sec.id) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="h-[17px] w-[17px]">' + x.icon + "</svg>" +
        esc(x.label) + "</button>";
    }).join("") + "</div>";
    html += '<p class="mt-2 text-[12px] leading-snug text-muted-foreground">' + esc(sec.blurb) + "</p>";

    /* sub-tabs */
    html += '<div class="subtabs subtabs--inline" role="tablist" aria-label="' + esc(sec.label) + ' topics">' +
      sec.topics.map(function (t) {
        return '<button role="tab" class="subtab" data-topic="' + t.id + '" aria-selected="' + (t.id === topic.id) + '">' +
          esc(t.label) + "</button>";
      }).join("") + "</div>";

    /* reader bar + page */
    html += '<div id="topic-reader" class="guide-reader"></div>';
    html += '<article class="topic"><div id="topic-content">' +
      '<p class="t-eyebrow mt-3" data-noread>' + esc(topic.kicker) + "</p>" +
      '<h1 class="t-hero mt-1.5">' + esc(topic.title) + "</h1>" +
      '<p class="mt-3 text-base leading-[1.55] text-muted-foreground">' + esc(topic.lede) + "</p>" +
      topic.blocks.map(topicBlock).join("") +
      "</div>";

    /* deeper reading */
    if ((topic.reading || []).length) {
      html += '<h3 class="mt-6 text-lg font-semibold" data-noread>Read deeper</h3><div class="mt-2 space-y-2">' +
        topic.reading.map(function (r) {
          var label = r.type === "guide" ? planLinkLabel(r) : (byId(r.id) ? byId(r.id).title : r.id);
          var meta = r.type === "guide" ? "Guide" : ((byId(r.id) ? byId(r.id).grade + " evidence · " + byId(r.id).readMinutes + " min" : "Article"));
          return '<button class="row-card" ' + (r.type === "guide" ? 'data-openguide="' + r.id + '"' : 'data-article="' + r.id + '">') + ">" +
            '<span class="row-main"><span class="row-title block">' + esc(label) + "</span>" +
            '<span class="row-sub block">' + esc(meta) + "</span></span>" +
            '<span class="row-meta">' + ICON.arrow + "</span></button>";
        }).join("") + "</div>";
    }

    /* kit */
    if ((topic.kit || []).length) {
      html += '<h3 class="mt-6 text-lg font-semibold" data-noread>Kit for this</h3><div class="mt-2 space-y-2">' +
        topic.kit.map(function (k) {
          var p = D.products.filter(function (x) { return x.id === k.id; })[0];
          if (!p) return "";
          return '<button class="row-card" data-product="' + esc(p.id) + '">' +
            '<span class="row-main"><span class="row-title block">' + esc(p.name) + "</span>" +
            '<span class="row-sub block">' + esc(k.why) + "</span></span>" +
            '<span class="row-meta"><b>' + (p.costPerServing != null ? perServe(p.costPerServing) : "—") + "</b>/serving</span></button>";
        }).join("") + "</div>";
    }

    html += "</article>";
    host.innerHTML = html;
    mountInlineReader("topic:" + topic.id, "#topic-reader", "#topic-content");
  }

  /* =========================================================== MEALS VIEW */
  function renderMeals() {
    var html = artBanner("meals");
    html += '<div><h2 class="t-title">' + esc(copyTxt("mealsTitle", "Meals")) + "</h2>" +
      '<p class="mt-1 text-sm leading-relaxed text-muted-foreground">' + esc(copyTxt("mealsIntro", "")) + "</p></div>";

    html += '<div class="mt-3 space-y-3">';
    D.meals.forEach(function (m) {
      var mid = "meal-" + m.id;
      html +=
        '<article class="card overflow-hidden">' +
          (artSrc(mid) ? '<div class="art-wrap">' + art(mid, "art-banner") + "</div>" : "") +
          '<div class="p-3.5">' +
            '<div class="flex items-start justify-between gap-2">' +
              '<h3 class="text-base font-semibold leading-snug">' + esc(m.name) + "</h3>" +
              '<span class="badge badge-secondary shrink-0">' + esc(m.slot) + "</span>" +
            "</div>" +
            '<div class="mt-2 flex gap-1.5">' +
              '<span class="badge badge-default">' + m.protein + " g protein</span>" +
              '<span class="badge badge-outline">' + m.fibre + " g fibre</span>" +
            "</div>" +
            '<ul class="mt-2 space-y-1 text-sm leading-snug text-muted-foreground">' +
              m.items.map(function (i) { return "<li class=\"flex gap-1.5\"><span class=\"text-primary\">•</span><span>" + esc(i) + "</span></li>"; }).join("") +
            "</ul>" +
            '<p class="mt-2 text-xs leading-relaxed text-muted-foreground">' + esc(m.note) + "</p>" +
          "</div>" +
        "</article>";
    });
    html += "</div>";

    /* rotation — stacked day cards (no horizontal scrolling on mobile) */
    html += sectionHead("The 7-day rotation", "example week");
    html += '<div class="mt-2 space-y-1.5">';
    D.rotation.forEach(function (r) {
      html +=
        '<div class="card p-2.5">' +
          '<div class="flex items-center gap-2">' +
            '<span class="inline-flex h-7 w-9 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs font-semibold text-foreground">' + esc(r[0]) + "</span>" +
            '<div class="min-w-0 flex-1 space-y-0.5">' +
              rotLine("Breakfast", r[1]) + rotLine("Lunch", r[2]) + rotLine("Dinner", r[3]) +
            "</div>" +
          "</div>" +
        "</div>";
    });
    html += "</div>";

    /* shopping list */
    var total = 0, done = 0;
    D.shopping.forEach(function (g, gi) {
      g[1].forEach(function (item) { total++; if (state.shopping[gi + "|" + item]) done++; });
    });
    html += sectionHead(copyTxt("shoppingTitle", "Weekly shopping list"), done + "/" + total + " checked", "data-shop-head");
    html += '<div class="card mt-2 p-3">' +
      '<div class="bar mb-3"><span id="shop-progress" style="width:' + Math.round((done / total) * 100) + '%"></span></div>';
    D.shopping.forEach(function (g, gi) {
      html += '<div class="mb-3 last:mb-0">' +
        '<p class="mb-1 text-micro font-semibold uppercase tracking-wide text-muted-foreground">' + esc(g[0]) + "</p>" +
        '<ul class="space-y-0.5">';
      g[1].forEach(function (item) {
        var key = gi + "|" + item, checked = !!state.shopping[key];
        html += '<li><label class="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1 text-xs hover:bg-secondary/60">' +
          '<input type="checkbox" class="shop-item h-4 w-4 shrink-0 accent-[hsl(var(--primary))]" data-key="' + esc(key) + '"' + (checked ? " checked" : "") + " />" +
          '<span class="' + (checked ? "text-muted-foreground line-through" : "") + '">' + esc(item) + "</span></label></li>";
      });
      html += "</ul></div>";
    });
    html += '<button class="btn btn-outline btn-sm mt-1 w-full" id="shop-clear">Clear list</button></div>';

    html += '<p class="mt-4 text-micro leading-relaxed text-muted-foreground">Quantities assume one adult for one week and scale with body size. For Mogadishu, substitute freely: cassava or sweet potato for potato, local fish for canned fish, camel milk for cow milk. Prices are not quoted here — verify locally.</p>';
    $("#view-meals").innerHTML = fuelSeg("meals") + html;
  }

  function rotLine(label, value) {
    return '<div class="flex gap-1.5 text-micro leading-snug">' +
      '<span class="w-[4.5rem] shrink-0 text-muted-foreground">' + esc(label) + "</span>" +
      '<span class="min-w-0">' + esc(value) + "</span></div>";
  }

  /* ================================================================ SHEETS */
  var lastFocus = null;
  function openSheet(html, label) {
    /* any previously mounted reader belongs to the sheet being replaced */
    try { stopReader(true); } catch (e) {}
    /* the guides view keeps its own listen bar on the page — empty it while a
       sheet is open so the sheet's #reader-* ids stay unique */
    var gbar = $("#guide-reader");
    if (gbar) gbar.innerHTML = "";
    R.content = null; R.seq = []; R.idx = 0; R.state = "idle";
    if (R.fab) R.fab.hidden = true;
    lastFocus = document.activeElement;
    var sheet = $("#sheet"), ov = $("#sheet-overlay");
    $("#sheet-body").innerHTML = html;
    sheet.hidden = false; ov.hidden = false;
    sheet.classList.remove("hidden"); ov.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    $("#sheet-title");
    if (label) sheet.setAttribute("aria-label", label);
    var close = $("#sheet-close"); if (close) close.focus();
  }
  function closeSheet() {
    try { stopReader(true); } catch (e) {}
    R.sheet = false;
    if (R.fab) { R.fab.hidden = true; }
    var sheet = $("#sheet"), ov = $("#sheet-overlay");
    sheet.hidden = true; ov.hidden = true;
    sheet.classList.add("hidden"); ov.classList.add("hidden");
    $("#sheet-body").innerHTML = "";   /* keep #reader-* ids unique after closing */
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    try { remountGuideReader(); } catch (e) {}
  }

  /* ==================================================== LONGER SUMMARY
     An article sheet already shows a short summary, a key-points list and a
     per-claim evidence table. The "longer summary" is a collapsed, prose
     briefing built at render time from those same fields: what the article
     says, what its evidence grade means in practice, and what it tells you
     to do.

     Rules this code obeys:
       * Nothing is invented. Every sentence comes from the article's own
         summary, points, evidence table, grade and safety list.
       * Uncertainty is preserved. A claim graded Low, Low-Moderate or Very
         low is never written as established fact.
       * The grading vocabulary is read back out of the library's own "how
         this library grades evidence" article, so the wording can never drift
         from the method the library documents.
     --------------------------------------------------------------- */

  /* The data layer stores bullets as short HTML (<b>, <i>, <a>). Prose needs
     the words only, so tags come out and entities come back in. */
  var LS_ENT = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#39;": "'",
    "&nbsp;": " ", "&middot;": "·", "&mdash;": "—", "&ndash;": "–",
    "&hellip;": "…", "&rsquo;": "’", "&lsquo;": "‘",
    "&ldquo;": "“", "&rdquo;": "”", "&times;": "×",
    "&ge;": "≥", "&le;": "≤", "&rarr;": "→", "&deg;": "°",
    "&plusmn;": "±", "&alpha;": "α", "&beta;": "β",
    "&sect;": "§", "&minus;": "−"
  };
  var LS_ENT_RE = /&(?:amp|lt|gt|quot|nbsp|middot|mdash|ndash|hellip|rsquo|lsquo|ldquo|rdquo|times|ge|le|rarr|deg|plusmn|alpha|beta|sect|minus);|&#39;/g;

  function plainText(html) {
    var s = String(html == null ? "" : html);
    s = s.replace(/<br\s*\/?>/gi, " ");
    s = s.replace(/<\/(?:p|li|div|h[1-6]|tr|td)>/gi, " ");
    s = s.replace(/<[^>]*>/g, "");
    s = s.replace(LS_ENT_RE, function (m) { return LS_ENT[m] !== undefined ? LS_ENT[m] : m; });
    return s.replace(/\s+/g, " ").trim();
  }

  function asSentence(s) {
    s = String(s == null ? "" : s).trim();
    if (!s) return "";
    return /[.!?…]$/.test(s) ? s : s + ".";
  }

  /* The library documents its own grading scale in one article. Read the
     definitions back out of it, so this code can never describe a grade in
     words the library does not use. */
  var LS_GRADES = null;
  function gradeDefs() {
    if (LS_GRADES) return LS_GRADES;
    LS_GRADES = {};
    var method = D.articles.filter(function (a) { return a.id === "evidence-method"; })[0];
    if (method) {
      (method.points || []).forEach(function (p) {
        var t = plainText(p);
        var i = t.search(/\s(?:—|–|-)\s/);
        if (i === -1) return;
        var name = t.slice(0, i).trim();
        if (!/^(High|Moderate|Low|Very low)$/.test(name)) return;
        var rest = t.slice(i).replace(/^\s(?:—|–|-)\s/, "");
        var j = rest.search(/\s·\s/);
        if (j > -1) rest = rest.slice(0, j);
        LS_GRADES[name] = rest.replace(/\s+$/, "").replace(/\.$/, "");
      });
    }
    /* fallbacks use the same wording as the method article */
    if (!LS_GRADES.High) LS_GRADES.High = "consistent findings across multiple large RCTs or meta-analyses of RCTs, directly measuring the outcome of interest, in relevant populations";
    if (!LS_GRADES.Moderate) LS_GRADES.Moderate = "RCTs exist but are small, short, single-site, or measure surrogate endpoints; or meta-analyses are heterogeneous";
    if (!LS_GRADES.Low) LS_GRADES.Low = "observational cohorts, small uncontrolled trials, indirect populations, or large risk of bias";
    if (!LS_GRADES["Very low"]) LS_GRADES["Very low"] = "case reports, mechanistic extrapolation, marketing-derived claims";
    return LS_GRADES;
  }

  function lowerFirst(s) {
    s = String(s == null ? "" : s);
    return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  }

  /* A plain-English reading of a grade on this library's scale. */
  function gradeMeaning(g) {
    var d = gradeDefs();
    var name = String(g == null ? "" : g).trim();
    if (d[name]) return lowerFirst(d[name]);
    if (/^Moderate[–-]?High$/.test(name)) {
      return "halfway between this library's High tier (" + lowerFirst(d.High) +
        ") and its Moderate tier (" + lowerFirst(d.Moderate) + ")";
    }
    if (/^Low[–-]?Moderate$/.test(name)) {
      return "halfway between this library's Moderate tier (" + lowerFirst(d.Moderate) +
        ") and its Low tier (" + lowerFirst(d.Low) + ")";
    }
    return "graded " + name + " on this library's scale";
  }

  /* Grades that must never be dressed up as established fact. */
  function weakGrade(grade) {
    var g = String(grade == null ? "" : grade).trim();
    return g === "Low" || g === "Very low" || g === "Low–Moderate" || g === "Low-Moderate";
  }

  /* The three parts of the briefing. */
  function longSummaryBlocks(a) {
    var out = [];
    if (!a) return out;
    var summary = a.summary || [];
    var points = a.points || [];
    var ev = a.evidenceTable || [];
    var safety = a.safety || [];

    /* 1 — what it says */
    var say = [];
    var sub = plainText(a.subtitle);
    if (sub) say.push(asSentence(sub));
    if (summary.length) {
      say.push("In short: " + summary.map(function (s) { return asSentence(plainText(s)); }).join(" "));
    } else if (points.length) {
      say.push("This article carries no separate summary block, so the key points do the work the summary would otherwise do.");
    }
    out.push({ label: "What it says", text: say.join(" ") });

    /* 2 — what the evidence grade means in practice */
    var g = String(a.grade == null ? "" : a.grade).trim();
    var evd = [];
    if (g) evd.push("This article is graded " + g + " overall, which means " + gradeMeaning(g) + ".");
    if (weakGrade(g)) {
      evd.push("That is a weak grade, so read the whole article as provisional: a set of directions worth testing on yourself rather than established fact.");
    }
    if (ev.length) {
      evd.push("The claims are graded one at a time: " + ev.map(function (r) {
        return plainText(r.claim) + " (" + String(r.grade == null ? "" : r.grade).trim() + ")";
      }).join("; ") + ".");
      var weakN = 0, i;
      for (i = 0; i < ev.length; i++) if (weakGrade(ev[i].grade)) weakN++;
      if (weakN) {
        evd.push(weakN + " of those claims " + (weakN === 1 ? "is" : "are") +
          " graded Low, Low-Moderate or below. Treat " + (weakN === 1 ? "it" : "them") +
          " as a direction of travel, not as settled fact.");
      } else {
        evd.push("None of the claims in this article's evidence table is graded below Moderate.");
      }
    } else {
      evd.push("This article does not publish a per-claim evidence table, so its overall grade is the only quality signal it gives.");
    }
    out.push({ label: "How strong the evidence is", text: evd.join(" ") });

    /* 3 — what to do */
    var todo = [];
    todo.push(points.length
      ? "The article's own key points, gathered as a checklist:"
      : "This article does not publish a separate key-points list.");
    if (safety.length) {
      todo.push("Safety and contraindications are listed separately in this article — read them before you change anything.");
    }
    out.push({
      label: "What to do",
      text: todo.join(" "),
      items: points.map(function (p) { return plainText(p); })
    });

    return out;
  }

  function longSummaryHTML(a) {
    var blocks;
    try { blocks = longSummaryBlocks(a); } catch (e) { return ""; }
    if (!blocks || !blocks.length) return "";
    var html = '<details id="long-summary" class="ls mt-4">' +
      '<summary class="ls-summary" data-noread>Longer summary</summary>' +
      '<div class="ls-body">';
    blocks.forEach(function (b) {
      html += '<div class="ls-block"><p class="ls-label">' + esc(b.label) + "</p>";
      if (b.text) html += "<p>" + esc(b.text) + "</p>";
      if (b.items && b.items.length) {
        html += '<ol class="ls-list">' + b.items.map(function (it) {
          return "<li>" + esc(it) + "</li>";
        }).join("") + "</ol>";
      }
      html += "</div>";
    });
    html += '<p class="ls-note">This briefing restates what the article already says. ' +
      "It adds no new claims, and it keeps the article's own uncertainty intact.</p>";
    html += "</div></details>";
    return html;
  }

  function openArticle(id) {
    var a = byId(id);
    if (!a) return;
    var html = "";
    html += art(a.category, "art-sheet");
    html += '<div class="pr-10">' +
      '<div class="flex flex-wrap items-center gap-1.5" data-noread>' +
        '<span class="badge badge-secondary">' + esc(catName(a.category)) + "</span>" +
        '<span class="badge ' + gradeBg(a.grade) + " " + gradeClass(a.grade) + '">' + esc(a.grade) + " evidence</span>" +
        '<span class="badge badge-outline">' + ICON.clock + a.readMinutes + " min</span>" +
      "</div>" +
      '<h2 id="sheet-title" class="t-display mt-2">' + esc(a.title) + "</h2>" +
      (hookFor(a.id)
        ? '<p class="mt-2 text-base leading-[1.47] text-foreground">' + esc(hookFor(a.id)) + "</p>"
        : "") +
      '<p class="mt-2 text-sm leading-relaxed text-muted-foreground">' + esc(a.subtitle) + "</p>" +
      (a.mergedFrom && a.mergedFrom.length &&
        a.mergedFrom.some(function (m) { return a.subtitle.indexOf(m) === -1; })
        ? '<p class="mt-2 t-fine">' + esc(copyTxt("mergedNote", "Includes")) + ": " +
          esc(a.mergedFrom.filter(function (m) { return a.subtitle.indexOf(m) === -1; }).join(", ")) + "</p>"
        : "") +
      "</div>";

    if (a.summary.length) {
      html += '<h3 class="mt-4 text-micro font-semibold uppercase tracking-wide text-muted-foreground">' + esc(copyTxt("sheetWhatEvidence", "What the evidence establishes")) + '</h3>' +
        '<ul class="mt-1 space-y-2">' + a.summary.map(function (s) {
          return '<li class="flex gap-2 text-sm leading-relaxed"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span><span>' + s + "</span></li>";
        }).join("") + "</ul>";
    }
    if (a.points.length) {
      html += '<h3 class="mt-5 text-micro font-semibold uppercase tracking-wide text-muted-foreground">' + esc(copyTxt("sheetKeyPoints", "Key points")) + '</h3>' +
        '<ul class="mt-1 space-y-2">' + a.points.map(function (s) {
          return '<li class="flex gap-2 text-sm leading-relaxed"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50"></span><span>' + s + "</span></li>";
        }).join("") + "</ul>";
    }
    html += longSummaryHTML(a);
    if (a.evidenceTable && a.evidenceTable.length) {
      html += '<h3 class="mt-5 text-micro font-semibold uppercase tracking-wide text-muted-foreground">' + esc(copyTxt("sheetEvidenceQuality", "Evidence quality")) + '</h3>' +
        '<div class="mt-1 overflow-hidden rounded-md border border-border">' +
        a.evidenceTable.map(function (r, i) {
          return '<div class="flex gap-2 border-b border-border px-2.5 py-2 last:border-0 ' + (i % 2 ? "bg-secondary/40" : "") + '">' +
            '<span class="badge ' + gradeBg(r.grade) + " " + gradeClass(r.grade) + ' shrink-0 self-start">' + esc(r.grade) + "</span>" +
            '<div class="min-w-0"><p class="text-xs font-medium leading-snug">' + esc(r.claim) + "</p>" +
            (r.why ? '<p class="mt-0.5 text-micro leading-snug text-muted-foreground">' + esc(r.why) + "</p>" : "") +
            "</div></div>";
        }).join("") + "</div>";
    }
    if (a.safety.length) {
      html += '<div class="mt-5 rounded-md border border-border bg-secondary/50 p-3">' +
        '<div class="flex items-center gap-1.5 ' + gradeClass("Low") + '">' + ICON.warn +
        '<h3 class="text-micro font-semibold uppercase tracking-wide">' + esc(copyTxt("sheetSafety", "Safety & contraindications")) + '</h3></div>' +
        '<ul class="mt-1.5 space-y-1.5 text-xs leading-relaxed text-muted-foreground">' +
        a.safety.map(function (s) { return '<li class="flex gap-1.5"><span>•</span><span>' + s + "</span></li>"; }).join("") +
        "</ul></div>";
    }
    if (!a.safety.length && a.safetyRef) {
      var sa = byId(a.safetyRef);
      if (sa) {
        html += '<div class="mt-5 rounded-md bg-secondary p-3">' +
          '<p class="text-xs leading-relaxed text-muted-foreground">' + esc(copyTxt("safetyRefNote", "Safety and contraindications are shared with")) + " " +
          '<button class="link-inline" data-article="' + sa.id + '">' + esc(sa.title) + "</button>.</p></div>";
      }
    }
    if (a.references.length) {
      html += '<h3 class="mt-5 t-eyebrow">' + esc(copyTxt("sheetCited", "Cited sources")) + " (" + a.references.length + ")</h3>" +
        '<ol class="mt-1 space-y-1.5" data-noread>' + a.references.map(function (r) {
          var label = r.author + (r.year ? ", " + r.year : "") + (r.journal ? " · " + r.journal : "");
          return '<li class="text-micro leading-snug"><a class="inline-flex items-start gap-1 text-primary hover:underline" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' +
            ICON.ext + "<span>" + esc(label) + "</span></a>" +
            (r.title ? '<span class="block pl-4 text-muted-foreground">' + esc(r.title) + "</span>" : "") + "</li>";
        }).join("") + "</ol>";
    }
    html += '<p class="mt-4 border-t border-border pt-2 text-micro text-muted-foreground" data-noread>Source: ' + esc(a.source) + " · research synthesis, not medical advice.</p>";
    openSheet(html, a.title);
    mountReader(a);
  }

  /* ---------------------------- food detail sheet (table rows open here) */
  function openFood(id) {
    var f = D.nutrition.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    var facts = [
      ["Energy", Math.round(f.kcal) + " kcal"],
      ["Protein", (f.protein || 0).toFixed(1) + " g"],
      ["Fibre", f.fibre == null ? "—" : f.fibre.toFixed(1) + " g"],
      ["Water", f.water == null ? "—" : Math.round(f.water) + " g"],
      ["Protein per 100 kcal", f.proteinPer100kcal == null ? "—" : f.proteinPer100kcal + " g"],
      ["Fibre per 100 kcal", f.fibrePer100kcal == null ? "—" : f.fibrePer100kcal + " g"],
      ["Grams per 100 kcal", f.gPer100kcal + " g"]
    ];
    var html = "";
    html += artSrc(f.group) ? art(f.group, "art-sheet") : "";
    html += '<div class="pr-10">' +
      '<div class="flex flex-wrap items-center gap-1.5">' +
        '<span class="badge badge-secondary">' + esc(copyTxt("cat_" + f.group, f.group)) + "</span>" +
        '<span class="badge badge-outline">per 100 g</span>' +
      "</div>" +
      '<h2 id="sheet-title" class="t-display mt-2">' + esc(f.name) + "</h2>" +
      '<p class="mt-2 text-base leading-snug">' + esc(f.satiety) + "</p></div>";

    html += '<div class="mt-4 grid grid-cols-2 gap-2">' +
      facts.map(function (r) {
        return '<div class="rounded-md bg-secondary/60 px-2.5 py-2">' +
          '<div class="text-base font-semibold leading-none">' + esc(r[1]) + "</div>" +
          '<div class="mt-1 text-micro uppercase tracking-[0.08em] text-muted-foreground">' + esc(r[0]) + "</div></div>";
      }).join("") + "</div>";

    html += '<p class="mt-3 text-micro leading-relaxed text-muted-foreground">USDA FoodData Central SR Legacy, per 100 g as sold or raw. Real food varies by ±10–15%.</p>';
    html += '<a class="btn btn-outline btn-sm mt-3" href="https://fdc.nal.usda.gov/food-search?query=' + f.fdcId +
      '" target="_blank" rel="noopener noreferrer">FDC #' + f.fdcId + " " + ICON.ext + "</a>";
    openSheet(html, f.name);
  }

  function openProduct(id) {
    var p = D.products.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var rows = [
      ["Purpose", p.purpose], ["How to use", p.use], ["Evidence", p.evidence],
      ["Risks", p.risks], ["Contraindications", p.contra]
    ];
    var html = '<div class="pr-10">' +
      '<div class="flex flex-wrap items-center gap-1.5">' +
        '<span class="badge badge-secondary">' + esc(p.category) + "</span>" +
        (p.priceVerified ? '<span class="badge badge-success">Verified price</span>' : '<span class="badge badge-warning">Not price-verified</span>') +
        '<span class="badge badge-outline">' + esc(p.tier) + "</span>" +
      "</div>" +
      '<h2 id="sheet-title" class="mt-2 text-lg font-semibold leading-tight">' + esc(p.name) + "</h2>" +
      '<p class="text-xs text-muted-foreground">' + esc(p.brand) + "</p></div>";

    html += '<div class="mt-3 grid grid-cols-3 gap-2 rounded-md border border-border p-3 text-center">' +
      '<div><div class="font-mono text-sm font-semibold">' + (p.priceVerified ? money(p.price) : "—") + '</div><div class="text-micro text-muted-foreground">price</div></div>' +
      '<div><div class="font-mono text-sm font-semibold">' + (p.servings ? p.servings : "—") + '</div><div class="text-micro text-muted-foreground">servings</div></div>' +
      '<div><div class="font-mono text-sm font-semibold">' + perServe(p.costPerServing) + '</div><div class="text-micro text-muted-foreground">per serving</div></div>' +
      "</div>";
    if (p.costMath) {
      html += '<p class="mt-2 rounded-sm bg-secondary px-2 py-1.5 font-mono text-micro text-muted-foreground">' + esc(p.costMath) + "</p>";
    }
    html += '<dl class="mt-3 space-y-2">' + rows.map(function (r) {
      return '<div><dt class="text-micro font-semibold uppercase tracking-wide text-muted-foreground">' + esc(r[0]) + "</dt>" +
        '<dd class="text-sm leading-snug">' + esc(r[1]) + "</dd></div>";
    }).join("") + "</dl>";
    html += '<p class="mt-3 text-micro leading-relaxed text-muted-foreground">' + esc(p.note) + "</p>";
    html += '<div class="mt-3 grid grid-cols-2 gap-2">' +
      (function () {
        var ih = linkFor(p, "iHerb");
        if (!ih) return "";
        return '<a class="btn ' + (ih.kind === "product" ? "btn-default" : "btn-outline") + ' btn-sm" href="' + esc(ih.url) +
          '" target="_blank" rel="noopener noreferrer nofollow">' + ICON.ext +
          (ih.kind === "product" ? "iHerb · product" : "iHerb · search") + "</a>";
      })() +
      (function () {
        var am = linkFor(p, "Amazon");
        if (!am) return "";
        return '<a class="btn btn-outline btn-sm" href="' + esc(am.url) + '" target="_blank" rel="noopener noreferrer nofollow">' +
          ICON.ext + "Amazon · search</a>";
      })() +
      "</div>";
    html += '<p class="mt-2 text-micro leading-relaxed text-muted-foreground">Only iHerb and Amazon are linked. The iHerb price above was verified on ' +
      esc(D.meta.priceVerifiedOn) + "; Amazon is a search link and no Amazon price is claimed. No affiliate links, prices exclude shipping and customs.</p>";
    openSheet(html, p.name);
  }


  /* ============================================ READER: TEXT-TO-SPEECH + HIGHLIGHTS
     Narration uses the device's own speech engine (window.speechSynthesis):
     free, no key, no server, works offline. "Premium" sound comes from the
     OS voices — Microsoft Natural/Neural, Google, Apple Enhanced/Siri — which
     are ranked first and marked "premium" in the voice list. Nothing is
     streamed and no text ever leaves the device.                              */
  var synth = window.speechSynthesis || null;
  var R = {
    seq: [], idx: 0, state: "idle", rate: 1, voiceURI: "",
    id: null, hl: [], content: null, utter: null, fab: null,
    sheet: false   /* true while the reader is mounted inside the article sheet */
  };
  var RATES = [0.85, 1, 1.15, 1.3, 1.5];

  /* --- sentence splitting (keeps abbreviations like "e.g." together) --- */
  function splitSentences(text) {
    var cands = text.match(/[^.!?]+[.!?]+["”’)\]]*\s*|[^.!?]+$/g) || [text];
    var out = [], buf = "";
    for (var i = 0; i < cands.length; i++) {
      buf += cands[i];
      var t = buf.replace(/\s+$/, "");
      if (!t) continue;
      var abbr = /(?:^|\s)(?:e\.g\.|i\.e\.|vs\.|approx\.|cf\.|et al\.|etc\.|[A-Z])\.$/.test(t);
      if (abbr && i < cands.length - 1) continue;
      out.push(buf);
      buf = "";
    }
    if (buf.trim()) out.push(buf);
    return out;
  }

  /* Turn every run of body text into <span class="s" data-s="n"> sentences.
     Splitting in place keeps inline <b>/<em> formatting intact. */
  function markSentences(root) {
    var seq = [], nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.replace(/\s+/g, "")) return NodeFilter.FILTER_REJECT;
        var pn = n.parentNode;
        if (!pn || /^(SCRIPT|STYLE|A|SELECT|OPTION|BUTTON|INPUT)$/.test(pn.nodeName)) return NodeFilter.FILTER_REJECT;
        if (pn.closest && pn.closest("[data-noread]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    var blocks = [];                       // paragraph / list-item / heading identity per sentence
    nodes.forEach(function (node) {
      var parts = splitSentences(node.nodeValue);
      if (!parts.length) return;
      var blk = (node.parentNode.closest && node.parentNode.closest("li,h2,h3,h4,p,dd,td,figcaption")) || node.parentNode;
      var isHead = /^H[1-6]$/.test(blk.nodeName);
      var frag = document.createDocumentFragment();
      parts.forEach(function (t) {
        if (!t) return;
        if (!t.replace(/\s+/g, "")) { frag.appendChild(document.createTextNode(t)); return; }
        var sp = document.createElement("span");
        sp.className = "s";
        sp.setAttribute("data-s", String(seq.length));
        sp.textContent = t;
        frag.appendChild(sp);
        seq.push(sp);
        blocks.push({ ref: blk, head: isHead });
      });
      node.parentNode.replaceChild(frag, node);
    });
    /* how long to breathe after each sentence: comma-length inside a paragraph,
       a proper beat between bullets, a full stop before a heading */
    for (var i = 0; i < seq.length; i++) {
      var a = blocks[i], b = blocks[i + 1];
      var gap = 130;
      if (b && b.ref !== a.ref) gap = b.head ? 620 : 380;
      if (b && b.head && b.ref !== a.ref) gap = 620;
      seq[i].__gap = gap;
      seq[i].__head = a.head;
    }
    return seq;
  }

  /* --- make written prose sound spoken: expand abbreviations, spell out units --- */
  var SPEAK = [
    [/\be\.g\.?\s*/gi, "for example, "], [/\bi\.e\.?\s*/gi, "that is, "],
    [/\bvs\.?\b/gi, "versus"], [/\bet al\.?/gi, "and colleagues"],
    [/\bapprox\.?/gi, "approximately"], [/\bcf\.?\b/gi, "compare"],
    [/\bkg\b/g, "kilograms"], [/\bg\/kg\b/gi, "grams per kilogram"],
    [/\bkcal\b/gi, "kilocalories"], [/\bmg\b/g, "milligrams"],
    [/\b(µg|mcg)\b/g, "micrograms"], [/\bml\b/g, "millilitres"],
    [/\bIU\b/g, "international units"], [/\bBMI\b/g, "B M I"],
    [/\bPSA\b/g, "P S A"], [/\bHbA1c\b/g, "H B A one C"],
    [/\bApoB\b/g, "Appo B"], [/\bGLP-1\b/g, "G L P one"],
    [/\bD3\b/g, "D three"], [/\bB12\b/g, "B twelve"],
    [/\bNEAT\b/g, "neat"], [/\bsatiety\b/gi, "satiety"],
    [/%/g, " percent"], [/~/g, "about "], [/→/g, " to "],
    [/[–—]/g, ", "], [/\s\/\s/g, " or "], [/\//g, " per "],
    [/&/g, " and "], [/[•·▪]/g, ", "], [/\s*\|\s*/g, ", "]
  ];
  function speechText(t) {
    var out = String(t || "");
    for (var i = 0; i < SPEAK.length; i++) out = out.replace(SPEAK[i][0], SPEAK[i][1]);
    return out.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
  }

  /* --- long sentences are broken at commas into breath groups (<= 150 chars) --- */
  function breathGroups(text, max) {
    max = max || 150;
    if (text.length <= max) return [text];
    var parts = text.split(/(?<=[,;:—])\s+/), out = [], buf = "";
    for (var i = 0; i < parts.length; i++) {
      var piece = parts[i];
      if (buf && (buf + " " + piece).length > max) { out.push(buf.trim()); buf = piece; }
      else buf = buf ? buf + " " + piece : piece;
    }
    if (buf.trim()) out.push(buf.trim());
    return out.length ? out : [text];
  }

  /* --- voice ranking: local + premium-sounding voices first --- */
  function voiceScore(v) {
    if (!v) return -1;
    var n = String(v.name || ""), s = 0;
    if (/^en/i.test(v.lang || "")) s += 100;
    if (/natural|neural|premium|enhanced|siri/i.test(n)) s += 45;
    if (/google/i.test(n)) s += 35;
    if (/microsoft/i.test(n)) s += 18;
    if (/samantha|aria|jenny|guy|ryan|sonia|daniel|karen|serena|ava|alex/i.test(n)) s += 8;
    if (v.localService) s += 12; else s -= 6;
    if (!v.localService && navigator.onLine === false) s -= 200;   // offline: only device voices can speak
    return s;
  }
  function sortedVoices() {
    var vs = (synth && synth.getVoices ? synth.getVoices() : []).slice();
    vs.sort(function (a, b) { return voiceScore(b) - voiceScore(a) || String(a.name).localeCompare(String(b.name)); });
    return vs;
  }
  function currentVoice() {
    var vs = sortedVoices(), i;
    for (i = 0; i < vs.length; i++) if (vs[i].voiceURI === R.voiceURI) return vs[i];
    return vs.length ? vs[0] : null;
  }
  function voiceOptionsHTML() {
    var vs = sortedVoices();
    if (!vs.length) return '<option value="">No device voices in this browser</option>';
    var html = '<option value="">Best available (auto)</option>';
    vs.forEach(function (v) {
      var premium = /natural|neural|premium|enhanced|siri|google/i.test(v.name);
      html += '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === R.voiceURI ? " selected" : "") + ">" +
        esc(v.name) + " · " + esc(v.lang) + (premium ? " · premium" : "") + (v.localService ? "" : " · online") + "</option>";
    });
    return html;
  }

  /* --- reader bar ---
     The voice picker is always rendered, even when the browser has not
     published its voices yet: getVoices() is empty on the first call on most
     browsers and only fills in later, so a picker that only appears when
     voices already exist would never show up on a cold load. */
  function readerHTML() {
    var rateOpts = RATES.map(function (r) {
      return '<option value="' + r + '"' + (r === R.rate ? " selected" : "") + ">" + r + "×</option>";
    }).join("");
    var noVoices = !sortedVoices().length;
    var hint = noVoices
      ? copyTxt("readerHintNoVoice", "This browser exposes no speech voices — highlights still work.")
      : copyTxt("readerHintVoice", "Pick a voice, hit listen. Select any sentence to highlight it.");
    return '<div class="reader" id="reader">' +
      '<div class="reader-row">' +
        '<button type="button" class="btn btn-default btn-sm" id="reader-play">' + ICON.speaker + '<span>Listen</span></button>' +
        '<button type="button" class="btn btn-outline btn-sm btn-icon" id="reader-stop" aria-label="Stop reading">' + ICON.stop + "</button>" +
        '<select id="reader-rate" class="select reader-select" aria-label="Reading speed">' + rateOpts + "</select>" +
        '<span id="reader-count" class="reader-count" aria-hidden="true"></span>' +
        '<button type="button" class="btn btn-ghost btn-sm ml-auto" id="reader-hl" aria-expanded="false">Highlighted ' + R.hl.length + "</button>" +
      "</div>" +
      '<select id="reader-voice" class="select reader-select reader-voice" aria-label="Voice">' + voiceOptionsHTML() + "</select>" +
      (noVoices
        ? '<p class="reader-status" id="reader-voice-status">' + esc(copyTxt("readerNoVoiceStatus", "No device voices available")) + "</p>"
        : "") +
      '<p class="reader-hint" id="reader-hint">' + esc(hint) + "</p>" +
      '<div id="hl-list" class="hl-list" hidden></div>' +
      "</div>";
  }

  /* Repaint the voice picker once the browser publishes its voices (and
     again if they change). Keeps the "no voices" note honest. */
  function refreshVoicePicker() {
    var sel = $("#reader-voice");
    if (!sel) return;
    sel.innerHTML = voiceOptionsHTML();
    var noVoices = !sortedVoices().length;
    var st = $("#reader-voice-status");
    if (noVoices && !st) {
      st = document.createElement("p");
      st.className = "reader-status";
      st.id = "reader-voice-status";
      st.textContent = copyTxt("readerNoVoiceStatus", "No device voices available");
      if (sel.parentNode) sel.parentNode.insertBefore(st, sel.nextSibling);
    } else if (!noVoices && st && st.parentNode) {
      st.parentNode.removeChild(st);
    }
    var hint = $("#reader-hint");
    if (hint) {
      hint.textContent = noVoices
        ? copyTxt("readerHintNoVoice", "This browser exposes no speech voices — highlights still work.")
        : copyTxt("readerHintVoice", "Pick a voice, hit listen. Select any sentence to highlight it.");
    }
  }

  function setPlayLabel() {
    try { syncGuidePlayer(); } catch (e) {}
    var b = $("#reader-play");
    if (!b) return;
    var label = R.state === "playing" ? "Pause" : R.state === "paused" ? "Resume" : "Listen";
    var icon = R.state === "playing" ? ICON.pause : ICON.speaker;
    b.innerHTML = icon + "<span>" + label + "</span>";
    b.setAttribute("aria-pressed", R.state === "playing" ? "true" : "false");
  }

  function mountReader(a) {
    var body = $("#sheet-body");
    if (!body) return;
    stopReader(true);
    R.id = a.id;
    R.sheet = true;
    R.hl = (store.get("hl." + a.id, []) || []).filter(function (n) { return typeof n === "number"; });
    R.rate = store.get("reader.rate", 1) || 1;
    R.voiceURI = store.get("reader.voice", "") || "";
    var inner = body.innerHTML;
    body.innerHTML = readerHTML() + '<div id="reader-content">' + inner + "</div>";
    clearOtherReaders(body);
    R.content = $("#reader-content");
    R.seq = markSentences(R.content);
    applyHighlights();
    setPlayLabel();
    ensureFab();
  }

  /* One listening bar in the DOM at a time. Articles mount theirs inside the
     sheet and guides/library mount one inline; without this a stale hidden bar
     keeps the same ids (#reader, #reader-voice…) and the visible controls
     start talking to the wrong element. */
  function clearOtherReaders(keep) {
    $$(".reader").forEach(function (n) {
      if (!keep || !keep.contains(n)) { if (n.parentNode) n.parentNode.removeChild(n); }
    });
  }

  function ensureFab() {
    if (R.fab) return R.fab;
    R.fab = document.createElement("button");
    R.fab.id = "hl-fab";
    R.fab.type = "button";
    R.fab.className = "btn btn-default btn-sm hl-fab";
    R.fab.hidden = true;
    R.fab.textContent = "Highlight";
    document.body.appendChild(R.fab);
    return R.fab;
  }

  /* Guides live in a normal view rather than a sheet, so they get their own
     mount: the listen bar sits above the page and the readable content is
     #guide-content. Everything else (voices, speed, highlights, storage) is
     shared with the article reader. */
  function guideReaderKey(tab) { return "guide:" + tab.id; }

  function mountGuideReader(tab) {
    if (!tab) return;
    mountInlineReader(guideReaderKey(tab), "#guide-reader", "#guide-content");
  }

  function mountInlineReader(key, barSel, contentSel) {
    var bar = $(barSel), content = $(contentSel);
    if (!bar || !content) return;
    stopReader(true);
    R.id = key;
    R.sheet = false;
    R.hl = (store.get("hl." + R.id, []) || []).filter(function (n) { return typeof n === "number"; });
    R.rate = store.get("reader.rate", 1) || 1;
    R.voiceURI = store.get("reader.voice", "") || "";
    bar.innerHTML = readerHTML();
    clearOtherReaders(bar);
    R.content = content;
    /* re-mounting over the same DOM (sheet closed, tab returned to) must not
       split the text a second time — reuse the sentence spans already there */
    if (content.dataset.marked === "1") {
      R.seq = Array.prototype.slice.call(content.querySelectorAll(".s"));
    } else {
      R.seq = markSentences(content);
      content.dataset.marked = "1";
    }
    applyHighlights();
    setPlayLabel();
    ensureFab();
  }

  function ensureGuidePlayer() {
    var el = $("#guide-player");
    if (el) return el;
    el = document.createElement("div");
    el.id = "guide-player";
    el.className = "guide-player";
    el.hidden = true;
    el.innerHTML = '<button type="button" class="btn btn-outline btn-sm btn-icon" id="gp-prev" aria-label="Previous sentence">' + ICON.prev + "</button>" +
      '<button type="button" class="btn btn-default btn-sm" id="gp-toggle"></button>' +
      '<button type="button" class="btn btn-outline btn-sm btn-icon" id="gp-next" aria-label="Next sentence">' + ICON.next + "</button>" +
      '<button type="button" class="btn btn-ghost btn-sm" id="gp-stop" aria-label="Stop reading">' + ICON.stop + "</button>";
    document.body.appendChild(el);
    return el;
  }

  function syncGuidePlayer() {
    var el = ensureGuidePlayer();
    var onGuide = state.view === "guides";
    if (!onGuide || R.state === "idle" || !R.seq.length) { el.hidden = true; return; }
    el.hidden = false;
    var t = $("#gp-toggle");
    if (t) {
      t.innerHTML = (R.state === "playing" ? ICON.pause : ICON.speaker) +
        "<span>" + (R.state === "playing" ? "Pause" : "Resume") + "</span>";
    }
    if (R.fab) R.fab.hidden = true;       /* one floating control at a time */
  }

  /* called when a sheet closes over a guide, so highlighting and the
     "Highlighted N" count point at live nodes again */
  function remountGuideReader() {
    if (state.view === "guides") {
      var t = guideTab(state.guides.tab);
      if (t && $("#guide-content")) mountGuideReader(t);
    } else if (state.view === "library") {
      var sec = libSection(state.library.section), topic = libTopic(sec, state.library.topic);
      if (topic && $("#topic-content")) mountInlineReader("topic:" + topic.id, "#topic-reader", "#topic-content");
    }
  }

  function highlightCurrent(i) {
    if (R.content) {
      var prev = R.content.querySelector(".tts-current");
      if (prev) prev.classList.remove("tts-current");
    }
    var el = R.seq[i];
    var counter = $("#reader-count");
    if (counter) counter.textContent = (i + 1) + "/" + R.seq.length;
    if (!el) return;
    el.classList.add("tts-current");
    try { el.scrollIntoView({ block: "center", behavior: "smooth" }); }
    catch (e) { try { el.scrollIntoView(); } catch (e2) {} }
  }

  function wait(ms) {
    R.pauseTimer = setTimeout(function () { R.pauseTimer = null; }, ms);
    return ms;
  }

  /* Speaks one sentence, broken into breath groups, then waits a natural beat
     before the next one (short inside a paragraph, longer between bullets,
     longest before a heading). */
  function speakFrom(i) {
    if (!synth || R.state !== "playing") return;
    if (i >= R.seq.length) { stopReader(); toastMsg("Finished reading"); return; }
    var el = R.seq[i];
    var raw = el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    if (!raw) { speakFrom(i + 1); return; }
    R.idx = i;
    var chunks = breathGroups(speechText(raw));
    var ci = 0, started = 0;

    function afterSentence() {
      if (R.state !== "playing") return;
      if (!started) {
        R.instantFails = (R.instantFails || 0) + 1;
        if (R.instantFails >= 3) { stopReader(); toastMsg("Speech engine did not start — try a normal browser tab"); return; }
      }
      var gap = el.__gap || 130;
      R.pauseTimer = setTimeout(function () { R.pauseTimer = null; if (R.state === "playing") speakFrom(i + 1); }, gap);
    }

    function nextChunk() {
      if (R.state !== "playing") return;
      if (ci >= chunks.length) { afterSentence(); return; }
      var u = new SpeechSynthesisUtterance(chunks[ci++]);
      var v = currentVoice();
      if (v) { u.voice = v; u.lang = v.lang || "en-US"; } else { u.lang = "en-US"; }
      u.rate = R.rate;
      u.pitch = 1;
      u.volume = 1;
      u.onstart = function () { started = 1; if (ci === 1) highlightCurrent(i); };
      u.onend = function () {
        if (R.state !== "playing") return;
        if (ci < chunks.length) R.pauseTimer = setTimeout(function () { R.pauseTimer = null; nextChunk(); }, 90);
        else afterSentence();
      };
      u.onerror = function (e) {
        var err = (e && (e.error || e.name)) || "";
        if (/interrupted|canceled|cancelled|paused/i.test(err)) return;
        if (R.state === "playing") afterSentence();
      };
      R.utter = u;
      try { synth.speak(u); } catch (e) { afterSentence(); }
    }
    nextChunk();
  }

  /* Skip narration to sentence i. Used by tap-on-text and by the ⏮ / ⏭
     buttons: if the page is being read it jumps and carries on, if nothing is
     playing yet it starts reading from that sentence. */
  function jumpTo(i) {
    if (!R.seq.length) return;
    i = Math.max(0, Math.min(R.seq.length - 1, i | 0));
    var idle = R.state === "idle";
    if (idle) {
      if (!synth || typeof SpeechSynthesisUtterance === "undefined") { toastMsg("This browser has no speech engine"); return; }
      if (!sortedVoices().length) { toastMsg("No speech voices available here — highlights still work"); return; }
      R.instantFails = 0;
    }
    openLongSummary();
    try { synth.cancel(); } catch (e) {}
    R.state = "playing";
    R.idx = i;
    highlightCurrent(i);
    setPlayLabel();
    speakFrom(i);
    toastMsg((idle ? "Reading from " : "Jumped to ") + "sentence " + (i + 1) + " of " + R.seq.length);
  }

  /* The sentence element under a tap, or null when the tap hit a link,
     a control, or nothing readable. */
  function sentenceAt(t) {
    if (!R.content || !t || !t.closest) return null;
    if (t.closest("a,button,select,input,textarea,summary,#hl-fab,#guide-player")) return null;
    var el = t.closest(".s");
    if (el && R.content.contains(el)) return el;
    /* tapped the blank part of a paragraph, list item or heading: treat it as
       "start of that block" so the whole paragraph is a target */
    var block = t.closest("p,li,h1,h2,h3,figcaption,dt,dd");
    if (!block || !R.content.contains(block)) return null;
    var first = block.querySelector(".s");
    return first || null;
  }

  function togglePlay() {
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      toastMsg("This browser has no speech engine");
      return;
    }
    if (!R.seq.length) { toastMsg("Nothing to read on this screen"); return; }
    if (R.state === "playing") { try { synth.pause(); } catch (e) {} R.state = "paused"; setPlayLabel(); return; }
    if (R.state === "paused") { try { synth.resume(); } catch (e) {} R.state = "playing"; setPlayLabel(); return; }
    if (!sortedVoices().length) {
      toastMsg("No speech voices available here — highlights still work");
      return;
    }
    R.state = "playing";
    R.instantFails = 0;
    setPlayLabel();
    openLongSummary();
    try { synth.cancel(); } catch (e) {}
    speakFrom(R.idx < R.seq.length ? R.idx : 0);
  }

  /* The article's longer summary sits in the reading order, so while the
     narration is running it is opened — otherwise the sentence being spoken
     would be inside a collapsed block and the highlight would be invisible. */
  function openLongSummary() {
    var ls = document.getElementById("long-summary");
    if (ls && !ls.open) { try { ls.open = true; } catch (e) {} }
  }

  function stopReader(quiet) {
    R.state = "idle";
    R.idx = 0;
    if (R.pauseTimer) { clearTimeout(R.pauseTimer); R.pauseTimer = null; }
    if (synth) { try { synth.cancel(); } catch (e) {} }
    if (R.content) {
      var cur = R.content.querySelector(".tts-current");
      if (cur) cur.classList.remove("tts-current");
    }
    var counter = $("#reader-count");
    if (counter) counter.textContent = "";
    if (!quiet) setPlayLabel();
  }

  /* --- highlights --- */
  function hasHl(i) { return R.hl.indexOf(i) > -1; }
  function saveHl() { if (R.id) store.set("hl." + R.id, R.hl); }
  function applyHighlights() {
    R.seq.forEach(function (el, i) { el.classList.toggle("hl", hasHl(i)); });
    var b = $("#reader-hl");
    if (b) b.textContent = "Highlighted " + R.hl.length;
    renderHlList();
  }
  function addHl(i) { if (!hasHl(i)) R.hl.push(i); }
  function removeHighlight(i) {
    R.hl = R.hl.filter(function (x) { return x !== i; });
    saveHl(); applyHighlights();
  }
  function renderHlList() {
    var list = $("#hl-list");
    if (!list) return;
    if (!R.hl.length) { list.hidden = true; list.innerHTML = ""; return; }
    var sorted = R.hl.slice().sort(function (a, b) { return a - b; });
    list.innerHTML = sorted.map(function (i) {
      var t = R.seq[i] ? R.seq[i].textContent.replace(/\s+/g, " ").trim() : "";
      return '<div class="hl-item"><span>' + esc(t.length > 150 ? t.slice(0, 150) + "…" : t) + "</span>" +
        '<button type="button" class="btn btn-ghost btn-icon btn-xs" data-hl-remove="' + i + '" aria-label="Remove highlight">✕</button></div>';
    }).join("") +
      '<button type="button" class="btn btn-outline btn-sm mt-1 w-full" data-hl-clear="1">Clear all highlights</button>';
  }
  function toggleHlPanel() {
    var list = $("#hl-list"), btn = $("#reader-hl");
    if (!list) return;
    if (!R.hl.length) { toastMsg("Select text first, then tap Highlight"); list.hidden = true; return; }
    list.hidden = !list.hidden;
    if (btn) btn.setAttribute("aria-expanded", list.hidden ? "false" : "true");
  }
  function selectionIndices() {
    var sel = window.getSelection ? window.getSelection() : null;
    if (!sel || sel.isCollapsed || !sel.rangeCount || !R.content) return [];
    var range = sel.getRangeAt(0);
    if (!R.content.contains(range.commonAncestorContainer) && !range.intersectsNode) return [];
    var idx = [];
    R.seq.forEach(function (el, i) {
      try { if (range.intersectsNode(el)) idx.push(i); } catch (e) {}
    });
    return idx;
  }
  function highlightSelection() {
    var idx = selectionIndices();
    if (!idx.length) { toastMsg("Select some text first"); return; }
    idx.forEach(addHl);
    saveHl(); applyHighlights();
    if (R.fab) R.fab.hidden = true;
    try { window.getSelection().removeAllRanges(); } catch (e) {}
    toastMsg(idx.length + (idx.length > 1 ? " sentences" : " sentence") + " highlighted");
  }

  /* --- one set of global listeners --- */
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;

    if (t.closest("#hl-fab")) { highlightSelection(); return; }

    var rm = t.closest("[data-hl-remove]");
    if (rm) { removeHighlight(parseInt(rm.getAttribute("data-hl-remove"), 10)); return; }
    if (t.closest("[data-hl-clear]")) { R.hl = []; saveHl(); applyHighlights(); return; }

    if (!R.content) return;
    if (t.closest("#gp-prev")) { jumpTo(R.idx - 1); return; }
    if (t.closest("#gp-next")) { jumpTo(R.idx + 1); return; }
    if (t.closest("#gp-toggle")) { togglePlay(); return; }
    if (t.closest("#gp-stop")) { stopReader(); toastMsg("Stopped"); return; }
    if (t.closest("#reader-play")) { togglePlay(); return; }
    if (t.closest("#reader-stop")) { stopReader(); toastMsg("Stopped"); return; }
    if (t.closest("#reader-hl")) { toggleHlPanel(); return; }

    /* tap a sentence while it is being read -> skip to it */
    var tapped = sentenceAt(t);
    if (tapped && (R.state === "playing" || R.state === "paused")) {
      var selNow = window.getSelection ? window.getSelection() : null;
      if (!(selNow && !selNow.isCollapsed)) {
        ev.preventDefault();
        jumpTo(R.seq.indexOf(tapped));
        return;
      }
    }

    var hit = t.closest("#reader-content .s.hl, #guide-content .s.hl");
    if (hit) {
      var sel = window.getSelection ? window.getSelection() : null;
      if (sel && !sel.isCollapsed) return;
      removeHighlight(parseInt(hit.getAttribute("data-s"), 10));
      toastMsg("Highlight removed");
    }
  }, true);

  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (!t || !t.id) return;
    if (t.id === "reader-rate") {
      R.rate = parseFloat(t.value) || 1;
      store.set("reader.rate", R.rate);
      if (R.state !== "idle" && R.idx < R.seq.length) {
        var restart = R.idx;
        try { synth.cancel(); } catch (e) {}
        R.state = "playing";
        speakFrom(restart);
      }
    }
    if (t.id === "reader-voice") {
      R.voiceURI = t.value || "";
      store.set("reader.voice", R.voiceURI);
      if (R.state !== "idle") {
        var at = R.idx;
        try { synth.cancel(); } catch (e) {}
        R.state = "playing";
        speakFrom(at);
      }
    }
  });

  if (synth && synth.addEventListener) {
    synth.addEventListener("voiceschanged", function () {
      try { refreshVoicePicker(); } catch (e) {}
    });
  }

  document.addEventListener("selectionchange", debounce(function () {
    if (!R.fab || !R.content) return;
    var idx = selectionIndices();
    if (idx.length) {
      R.fab.hidden = false;
      R.fab.textContent = idx.length > 1 ? "Highlight " + idx.length + " sentences" : "Highlight sentence";
    } else {
      R.fab.hidden = true;
    }
  }, 140));

  /* =============================================================== SEARCH */
  function searchAll(q, scope) {
    var out = [];
    var query = norm(q).trim();
    if (!query) return out;
    var terms = query.split(/\s+/);

    function score(text) {
      var t = norm(text), s = 0;
      for (var i = 0; i < terms.length; i++) {
        var idx = t.indexOf(terms[i]);
        if (idx === -1) return 0;
        s += terms[i].length * (idx === 0 ? 3 : t.indexOf(" " + terms[i]) > -1 ? 2 : 1);
      }
      return s;
    }

    if (scope === "all" || scope === "articles") {
      D.articles.forEach(function (a) {
        var hay = a.title + " " + a.subtitle + " " + catName(a.category) + " " + a.summary.join(" ") + " " + a.points.join(" ");
        var s = score(hay);
        if (s) out.push({ type: "article", score: s + 10, item: a, title: a.title, sub: a.subtitle, meta: catName(a.category) + " · " + a.grade });
      });
    }
    if (scope === "all" || scope === "guides") {
      (window.GLOWUP_GUIDES && window.GLOWUP_GUIDES.tabs ? window.GLOWUP_GUIDES.tabs : []).forEach(function (g) {
        var body = (g.blocks || []).map(function (b) {
          return [b.text || "", (b.items || []).join(" "), (b.rows || []).map(function (r) { return r.join(" "); }).join(" "),
                  (b.good || []).join(" "), (b.bad || []).join(" "), b.title || "", b.caption || ""].join(" ");
        }).join(" ");
        var s = score(g.title + " " + g.kicker + " " + g.lede + " " + body);
        if (s) out.push({ type: "guide", score: s + 12, item: g, title: g.title, sub: g.lede, meta: "Guide · " + g.label });
      });
    }
    if (scope === "all" || scope === "library") {
      LIB.forEach(function (sec) {
        sec.topics.forEach(function (t) {
          var body = (t.blocks || []).map(function (b) {
            return [b.text || "", (b.items || []).join(" "), (b.rows || []).map(function (r) { return r.join(" "); }).join(" "), b.title || ""].join(" ");
          }).join(" ");
          var sc = score(t.title + " " + t.label + " " + t.kicker + " " + t.lede + " " + body + " " + sec.label);
          if (sc) out.push({ type: "topic", score: sc + 11, item: { section: sec.id, topic: t.id }, title: t.title, sub: t.lede, meta: sec.label + " · " + t.label });
        });
      });
    }
    if (scope === "all" || scope === "food") {
      D.nutrition.forEach(function (f) {
        var s = score(f.name + " " + f.satiety);
        if (s) out.push({ type: "food", score: s + 4, item: f, title: f.name, sub: f.satiety, meta: f.kcal + " kcal · " + (f.protein || 0).toFixed(1) + " g protein / 100 g" });
      });
    }
    if (scope === "all" || scope === "products") {
      D.products.forEach(function (p) {
        var s = score(p.name + " " + p.brand + " " + p.purpose + " " + p.category);
        if (s) out.push({ type: "product", score: s + 6, item: p, title: p.name, sub: p.purpose, meta: p.priceVerified ? money(p.price) + " · " + perServe(p.costPerServing) + "/serving" : "price not verified" });
      });
    }
    if (scope === "all" || scope === "meals") {
      D.meals.forEach(function (m) {
        var s = score(m.name + " " + m.slot + " " + m.items.join(" "));
        if (s) out.push({ type: "meal", score: s + 3, item: m, title: m.name, sub: m.items.join(" · "), meta: m.slot + " · " + m.protein + " g protein" });
      });
      D.shopping.forEach(function (g) {
        g[1].forEach(function (item) {
          var s = score(item);
          if (s) out.push({ type: "shopping", score: s + 1, item: { name: item }, title: item, sub: "Weekly shopping list · " + g[0], meta: "Shopping" });
        });
      });
    }
    return out.sort(function (a, b) { return b.score - a.score; }).slice(0, 40);
  }

  function renderSearch() {
    var s = state.search;
    var results = searchAll(s.q, s.scope);
    var host = $("#search-results");
    var status = $("#search-status");

    host.innerHTML = renderSearchBody(results, s.q);
    if (!s.q.trim()) {
      status.textContent = copyTxt("searchHint", "Type to search across articles, foods, products and meals.");
    } else {
      status.textContent = results.length + " result" + (results.length === 1 ? "" : "s") + " for “" + s.q + "”";
    }
    $("#search-scope").innerHTML = [["all", "Everything"], ["library", "Library"], ["guides", "Guides"], ["articles", "Articles"], ["food", "Food"], ["products", "Products"], ["meals", "Meals"]]
      .map(function (c) { return chip(c[0], s.scope, c[1]); }).join("");
  }
  function renderSearchBody(results, q) {
    if (!q.trim()) {
      var tips = ["protein", "sleep", "fibre", "psyllium", "creatine", "fasting", "maintain", "hair"];
      return '<div class="pt-2"><p class="mb-2 text-micro font-semibold uppercase tracking-wide text-muted-foreground">Try</p>' +
        '<div class="flex flex-wrap gap-2">' + tips.map(function (t) {
          return '<button class="chip" data-search-tip="' + t + '">' + t + "</button>";
        }).join("") + "</div>" +
        '<p class="mt-4 text-micro leading-relaxed text-muted-foreground">Searches the 19 library topics, 6 guides, 38 articles, 26 USDA foods, 18 products (with cost per serving), the 5 meal templates and the shopping list.</p></div>';
    }
    if (!results.length) return '<div class="card mt-2 p-6 text-center text-sm text-muted-foreground">Nothing matched. Try a shorter word.</div>';
    var groups = { topic: "Library", guide: "Guides", article: "Articles", food: "Food (USDA)", product: "Products", meal: "Meals", shopping: "Shopping list" };
    var order = ["topic", "guide", "article", "product", "food", "meal", "shopping"];
    var html = "";
    order.forEach(function (type) {
      var items = results.filter(function (r) { return r.type === type; });
      if (!items.length) return;
      html += '<p class="mb-1 mt-3 text-micro font-semibold uppercase tracking-wide text-muted-foreground">' + groups[type] + " · " + items.length + "</p>" +
        '<div class="space-y-1.5">';
      items.forEach(function (r) {
        var action = r.type === "topic" ? 'data-opentopic="' + r.item.section + ":" + r.item.topic + '"'
          : r.type === "guide" ? 'data-openguide="' + r.item.id + '"'
          : r.type === "article" ? 'data-article="' + r.item.id + '"'
          : r.type === "product" ? 'data-product="' + r.item.id + '"'
          : 'data-search-meal="' + esc(r.title) + '"';
        html += '<button class="card w-full p-2.5 text-left hover:bg-secondary/60" ' + action + ">" +
          '<div class="flex items-start justify-between gap-2">' +
            '<span class="text-sm font-medium leading-snug">' + esc(r.title) + "</span>" +
            '<span class="shrink-0 text-micro text-muted-foreground">' + esc(r.meta) + "</span>" +
          "</div>" +
          '<p class="mt-0.5 text-micro leading-snug text-muted-foreground line-clamp-2">' + esc(r.sub) + "</p>" +
        "</button>";
      });
      html += "</div>";
    });
    return html;
  }

  function openSearch() {
    lastFocus = document.activeElement;
    var ov = $("#search-overlay");
    ov.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    renderSearch();
    setTimeout(function () { $("#search-input").focus(); }, 30);
  }
  function closeSearch() {
    $("#search-overlay").classList.add("hidden");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* =============================================================== ROUTER */
  /* ---------------------------------------------------------------- NAV
     Five tabs, but the underlying views are unchanged. Learn remembers whether
     you were on Guides or Articles, Fuel remembers Foods or Meals & list, and
     the Shop tab is the products view.                                    */
  var NAV_OF = { home: "home", plan: "plan", library: "learn", guides: "learn", articles: "learn", food: "fuel", meals: "fuel", products: "shop" };
  var NAV_LABEL = { home: "Today", plan: "Blueprint", learn: "Learn", fuel: "Fuel", shop: "Shop" };
  var NAV_TARGET = { home: "home", plan: "plan", learn: "learn", fuel: "fuel", shop: "products",
                     library: "library", guides: "guides", articles: "articles", food: "food", meals: "meals", products: "products" };
  var VIEWS = ["home", "plan", "library", "guides", "articles", "food", "meals", "products"];

  function resolveNav(id) {
    if (id === "learn") return VIEWS.indexOf(state.learn) > -1 ? state.learn : "library";
    if (id === "fuel") return state.fuel === "meals" ? "meals" : "food";
    if (id === "shop") return "products";
    return NAV_TARGET[id] || "home";
  }

  function setView(view, opts) {
    /* Leaving an article stops the narration. The guides and library readers
       live inside their own views, but the article reader lives in a sheet:
       close it, so the speech stops and it cannot be left behind over a
       different view. */
    if (R.sheet) {
      try { closeSheet(); } catch (e) { try { stopReader(true); } catch (e2) {} }
    }
    if (view !== "guides" && view !== "library") {
      try { stopReader(true); } catch (e) {}
      if (R.fab) R.fab.hidden = true;
      var gp = $("#guide-player");
      if (gp) gp.hidden = true;
    }
    if (view === "guides" || view === "articles" || view === "library") state.learn = view;
    if (view === "food" || view === "meals") state.fuel = view;

    state.view = view;
    store.set("view", view);
    VIEWS.forEach(function (v) {
      var node = $("#view-" + v);
      if (!node) return;
      node.classList.toggle("hidden", v !== view);
    });
    var active = NAV_OF[view] || "home";
    $$(".tabbar-item, .bottom-nav-item").forEach(function (b) {
      if (b.dataset.nav === active) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    if (view === "home") renderToday();
    if (view === "plan") renderPlan();
    if (view === "library") renderLibrary();
    if (view === "articles") renderArticles();
    if (view === "guides") renderGuides();
    if (view === "food") renderFood();
    if (view === "products") renderProducts();
    if (view === "meals") renderMeals();
    syncPlanBar(NAV_LABEL[active] || "Today");
    if (!opts || opts.scroll !== false) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (location.hash !== "#" + view && (!opts || !opts.silent)) {
      try { history.replaceState(null, "", "#" + view); } catch (e) {}
    }
  }

  /* QA/debug handle: read-only window onto the UI state. The data layer is
     separate (window.GLOWUP_DATA) and is never written to. */
  try {
    window.GLOWUP_STATE = state;
    window.GLOWUP_PLAN_STATE = {
      day: function () { return dayNumber(); },
      checks: function () { return todayChecks(); },
      steps: function () { return stepMap(); },
      streak: function () { return streakDays(); },
      progress: function () { return totalDone(); }
    };
  } catch (e) {}

  /* ================================================================ THEME */
  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    store.set("theme", theme);
    var btn = $("#theme-toggle");
    if (btn) btn.setAttribute("aria-pressed", String(theme === "dark"));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0e0c16" : "#faf8f4");
  }

  /* ============================================================== EVENTS */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-nav],[data-subnav],[data-section],[data-topic],[data-budget],[data-grade],[data-check],[data-step],[data-setup],[data-phase],[data-goto],[data-article],[data-product],[data-food],[data-quick],[data-openguide],[data-opentopic],[data-tab],[data-cat],[data-chip],[data-seg],[data-mode],[data-search-tip],[data-search-meal],#plan-reset-day,#plan-restart,#food-mode-toggle,#theme-toggle,#search-open,#search-close,#sheet-close,#sheet-overlay,#install-btn,#shop-clear,#verified-toggle");
    if (!t) return;

    if (t.dataset.nav) { setView(resolveNav(t.dataset.nav)); return; }
    if (t.dataset.subnav) { setView(t.dataset.subnav); return; }
    if (t.dataset.section) {
      state.library.section = t.dataset.section;
      var sec0 = libSection(t.dataset.section);
      state.library.topic = (sec0 && sec0.topics[0] ? sec0.topics[0].id : null);
      renderLibrary(); window.scrollTo(0, 0);
      return;
    }
    if (t.dataset.topic) {
      state.library.topic = t.dataset.topic;
      renderLibrary(); window.scrollTo(0, 0);
      return;
    }
    if (t.dataset.check) { toggleCheck(t.dataset.check); rerenderCurrent(); return; }
    if (t.dataset.step) {
      var sm = stepMap(), id = t.dataset.step;
      if (sm[id]) delete sm[id]; else sm[id] = true;
      store.set("plan.steps", sm);
      rerenderCurrent();
      return;
    }
    if (t.dataset.setup) {
      var su = setupMap(), sid = t.dataset.setup;
      if (su[sid]) delete su[sid]; else su[sid] = true;
      store.set("plan.setup", su);
      rerenderCurrent();
      return;
    }
    if (t.dataset.phase) {
      store.set("plan.phase", parseInt(t.dataset.phase, 10) || 0);
      renderPlan();
      return;
    }
    if (t.dataset.goto) { setView(resolveNav(t.dataset.goto)); return; }
    if (t.dataset.article) { e.preventDefault(); openArticle(t.dataset.article); return; }
    if (t.dataset.product) { e.preventDefault(); openProduct(t.dataset.product); return; }
    if (t.dataset.food) { e.preventDefault(); openFood(t.dataset.food); return; }
    if (t.dataset.opentopic) {
      e.preventDefault();
      closeSearch();
      var parts = t.dataset.opentopic.split(":");
      state.library.section = parts[0];
      state.library.topic = parts[1];
      setView("library");
      return;
    }
    if (t.dataset.openguide) {
      e.preventDefault();
      closeSearch();
      state.guides.tab = t.dataset.openguide;
      setView("guides");
      return;
    }
    if (t.dataset.tab) {
      state.guides.tab = t.dataset.tab;
      renderGuides();
      var vg = $("#view-guides");
      if (vg) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      return;
    }
    if (t.dataset.quick) {
      var q = t.dataset.quick;
      if (q === "guides") { setView("guides"); }
      else if (q === "food-table") { state.food.mode = "table"; setView("food"); }
      else if (q === "supplement-ledger") { state.products.mode = "ledger"; setView("products"); }
      else if (q === "shopping") { setView("meals"); setTimeout(function () { scrollShopIntoView(); }, 120); }
      return;
    }
    if (t.dataset.cat) {
      state.articles.cat = t.dataset.cat;
      state.articles.q = "";
      setView("articles");
      return;
    }
    if (t.dataset.grade) { state.articles.grade = t.dataset.grade; renderArticles(); return; }
    if (t.dataset.budget) { state.products.budget = t.dataset.budget; renderProducts(); return; }
    if (t.dataset.chip) {
      if (state.view === "articles") { state.articles.cat = t.dataset.chip; renderArticles(); }
      else if (state.view === "food") { state.food.group = t.dataset.chip; renderFood(); }
      else if (state.view === "products") { state.products.cat = t.dataset.chip; renderProducts(); }
      else if ($("#search-overlay") && !$("#search-overlay").classList.contains("hidden")) {
        state.search.scope = t.dataset.chip; renderSearch();
      }
      return;
    }
    if (t.dataset.mode) {
      if (state.view === "products") { state.products.mode = t.dataset.mode; renderProducts(); }
      else if (state.view === "food") { state.food.mode = t.dataset.mode; renderFood(); }
      return;
    }
    if (t.dataset.seg) {
      if (state.view === "articles") { state.articles.sort = t.dataset.seg; renderArticles(); }
      else if (state.view === "food") { state.food.sort = t.dataset.seg; renderFood(); }
      else if (state.view === "products") { state.products.sort = t.dataset.seg; renderProducts(); }
      return;
    }
    if (t.dataset.searchTip) {
      state.search.q = t.dataset.searchTip;
      $("#search-input").value = t.dataset.searchTip;
      renderSearch();
      return;
    }
    if (t.dataset.searchMeal) { closeSearch(); setView("meals"); toastMsg("Open the Meals tab — that item is in the list"); return; }

    if (t.id === "theme-toggle") { setTheme(state.theme === "dark" ? "light" : "dark"); return; }
    if (t.id === "search-open") { openSearch(); return; }
    if (t.id === "search-close") { closeSearch(); return; }
    if (t.id === "sheet-close" || t.id === "sheet-overlay") { closeSheet(); return; }
    if (t.id === "food-mode-toggle") {
      state.food.mode = state.food.mode === "table" ? "cards" : "table";
      renderFood(); return;
    }
    if (t.id === "verified-toggle") {
      state.products.verifiedOnly = !state.products.verifiedOnly;
      renderProducts(); return;
    }
    if (t.id === "shop-clear") {
      state.shopping = {}; store.set("shopping", {}); renderMeals(); toastMsg("Shopping list cleared"); return;
    }
    if (t.id === "plan-reset-day") {
      store.set("check." + isoDay(), []);
      var h = history(); h[isoDay()] = 0; store.set("plan.history", h);
      renderPlan(); toastMsg("Today's ticks cleared");
      return;
    }
    if (t.id === "plan-restart") {
      if (!confirm("Start the blueprint again from day 1? Your tick marks are kept.")) return;
      store.set("plan.start", isoDay());
      store.set("plan.phase", 0);
      renderPlan(); toastMsg("Day 1 starts today");
      return;
    }
    if (t.id === "install-btn") { promptInstall(); return; }
  });

  /* inline filter inputs (live) */
  document.addEventListener("input", debounce(function (e) {
    var id = e.target.id;
    if (id === "articles-q") { state.articles.q = e.target.value; renderArticles(); refocus("articles-q"); }
    else if (id === "food-q") { state.food.q = e.target.value; renderFood(); refocus("food-q"); }
    else if (id === "products-q") { state.products.q = e.target.value; renderProducts(); refocus("products-q"); }
    else if (id === "search-input") { state.search.q = e.target.value; renderSearch(); }
  }, 120));

  document.addEventListener("change", function (e) {
    if (e.target.id === "grade-filter") { state.articles.grade = e.target.value; renderArticles(); }
    if (e.target.classList.contains("shop-item")) {
      state.shopping[e.target.dataset.key] = e.target.checked;
      store.set("shopping", state.shopping);
      renderMeals();
    }
  });

  function refocus(id) {
    var elx = document.getElementById(id);
    if (!elx) return;
    elx.focus();
    try { elx.setSelectionRange(elx.value.length, elx.value.length); } catch (err) {}
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!$("#sheet").hidden) { closeSheet(); return; }
      if (!$("#search-overlay").classList.contains("hidden")) { closeSearch(); }
    }
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault(); openSearch(); return;
    }
    if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault(); openSearch(); return;
    }
    if (e.key === "Tab") { trapFocus(e); }
  });

  function trapFocus(e) {
    var container = !$("#sheet").hidden ? $("#sheet")
      : !$("#search-overlay").classList.contains("hidden") ? $("#search-overlay") : null;
    if (!container) return;
    var focusable = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', container)
      .filter(function (n) { return n.offsetParent !== null; });
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  window.addEventListener("hashchange", function () {
    var v = location.hash.replace("#", "");
    if (VIEWS.indexOf(v) > -1 && v !== state.view) setView(v, { silent: true });
  });

  /* ======================================================= PWA plumbing */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var btn = $("#install-btn");
    if (btn) btn.hidden = false;
  });
  function promptInstall() {
    if (!deferredPrompt) { toastMsg("Use your browser menu → “Add to Home Screen”"); return; }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (choice) {
      if (choice.outcome === "accepted") toastMsg("GlowUp installed");
      deferredPrompt = null;
      var btn = $("#install-btn"); if (btn) btn.hidden = true;
    });
  }
  function updateOnline() {
    var b = $("#offline-banner");
    if (!b) return;
    b.classList.toggle("hidden", navigator.onLine);
  }
  window.addEventListener("online", updateOnline);
  window.addEventListener("offline", updateOnline);

  if ("serviceWorker" in navigator && location.protocol !== "file:" && !window.GLOWUP_STANDALONE) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (err) {
        console.warn("GlowUp: service worker registration failed", err);
      });
    });
  }

  /* ================================================================= INIT */
  function init() {
    var savedTheme = store.get("theme", null);
    setTheme(savedTheme || (document.documentElement.classList.contains("dark") ? "dark" : "light"));
    var startView = location.hash.replace("#", "");
    if (VIEWS.indexOf(startView) === -1) {
      startView = store.get("view", "home");
      if (VIEWS.indexOf(startView) === -1) startView = "home";
    }
    setView(startView, { silent: true, scroll: false });
    updateOnline();
    if ("requestIdleCallback" in window) requestIdleCallback(function () { console.info("GlowUp ready", D.meta.counts); });
  }
  init();
})();
