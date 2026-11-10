// Runtime smoke test: loads the built app, exercises every tab /
// control, and fails loudly on any console error or page exception.
// e2e smoke test — run `npm run test:install` once to fetch Playwright,
// then `npm run build && npm test`.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\//, '');
if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/index.html not found - run `npm run build` first.');
  process.exit(1);
}
const ROOT = DIST;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  try {
    const buf = await readFile(join(ROOT, normalize(p).replace(/^([/\\])+/, '')));
    res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('nope'); }
});
await new Promise(r => server.listen(4173, r));

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
page.on('console', m => { if (m.type() === 'error') { errors.push('CONSOLE: ' + m.text()); console.log('!! CONSOLE: ' + m.text()); } });
page.on('pageerror', e => { errors.push('PAGEERROR: ' + e.message); console.log('!! PAGEERROR: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')); });

const results = [];
const check = (name, cond, extra = '') => {
  const line = (cond ? 'PASS  ' : 'FAIL  ') + name + (extra ? '  [' + extra + ']' : '');
  results.push(line);
  console.log(line);
  if (!cond) errors.push('ASSERT: ' + name + ' ' + extra);
};

await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

// ── global engine present ──
check('window.Engine exposed', await page.evaluate(() => !!window.Engine));

// ── nav: 5 buttons incl. Plan ──
const navs = await page.$$eval('.nav-btn span', els => els.map(e => e.textContent));
check('nav has 5 items incl Plan', navs.length === 5 && navs.includes('Plan'), navs.join(','));

// ── old conflicting content is gone ──
// These are the AFFIRMATIVE claims from the old app. The new plan mentions the
// same topics only to refute them, and the Body screen keeps one explicit
// "Superseded Guidance" table, so we assert on exact strings, not term counts.
const body = await page.textContent('body');
const AFFIRMATIVE_LEAKS = [
  'Fasting unlocks autophagy',
  'recycle skin tissue from inside out',
  'Himalayan salt during fasting',
  'Zone 2 cardio 4x/week',
  'Zone 2 Cardio</strong>',
  'Atomic 36-Hour',
  '120kg',
  '75kg',
  'Chest + Triceps',
  'Back + Biceps',
  'Legs + Core',
  'OMAD',
  '1.6-2.2g',
  '1.6–2.2 g/kg protein daily'
];
const leaks = AFFIRMATIVE_LEAKS.filter(t => body.includes(t));
check('no affirmative superseded claims in DOM', leaks.length === 0, 'leaked: ' + leaks.join(' | '));
check('old fitness category gone', !(await page.$('#cat-fitness')));
check('no switchCatTab leftovers', !body.includes('switchCatTab'));

// the "Superseded Guidance" table lived on the now-removed Body screen;
// the corrections themselves are asserted against the Plan further down

// grooming / settings must not contradict the new plan
const groom = await page.textContent('#cat-skincare');
check('skin pane no longer claims fasting fixes skin', !/Fasting unlocks autophagy/.test(groom));
check('skin pane credits resistance training', /Resistance Training/.test(groom));
await page.click('.nav-btn[data-screen="settings"]');
await page.waitForTimeout(250);
const tips = await page.textContent('#res-tips');
check('quick tips no longer say Zone 2 4x', !/Zone 2/.test(tips));
check('quick tips no longer say pink/himalayan salt', !/pink salt|Himalayan/i.test(tips));
check('quick tips aligned to new plan', /150\+ min\/week/.test(tips) && /Protein at all 3 meals/.test(tips));
await page.click('.nav-btn[data-screen="plan"]');
await page.waitForTimeout(250);

// ── go to Plan ──
await page.click('.nav-btn:nth-child(2)');
await page.waitForTimeout(300);
check('Plan screen active', await page.evaluate(() => document.getElementById('screen-plan').classList.contains('active')));
check('Plan title rendered', (await page.textContent('#plan-title')) === "Body-Fat Loss Blueprint");
check('Plan principles rendered', (await page.$$('#plan-principles span')).length === 5);
check('Plan dashboard rendered', (await page.$$('#plan-dash .dash-card')).length === 3);
check('Disclaimer rendered', ((await page.textContent('#plan-disclaimer')) || '').includes('sustainable habits'));

// ── sub-tabs: daily + 11 blueprint sections ──
const stabs = await page.$$eval('#screen-plan .stab', els => els.map(e => e.textContent.trim()));
check('12 plan sub-tabs (daily + 11)', stabs.length === 12, stabs.length + ': ' + stabs.join(' | '));
check('every sub-tab has a text label', stabs.every(s => s.replace(/[^A-Za-z]/g, '').length > 1), stabs.map(s => s.replace(/[^A-Za-z]/g, '')).join(','));
if (!stabs.length) {
  console.log('DEBUG deck:', await page.evaluate(() => {
    const d = window.Engine && window.Engine.deck('plan');
    const host = document.querySelector('#screen-plan [data-deck-group="plan"]');
    return JSON.stringify({
      hasDeck: !!d,
      groups: d ? d.groups.map(g => g.id + ':' + g.sections.length) : null,
      root: d ? (d.root && d.root.id) : null,
      hostFound: !!host,
      hostChildren: host ? host.children.length : -1,
      activeGroup: d ? d.activeGroup : null
    }, null, 1);
  }));
  throw new Error('no sub-tabs rendered');
}

// ── active pane renders summary cards + table ──
check('default pane has stat cards', (await page.$$('#screen-plan .tab-pane .bp-stat')).length >= 9);
check('default pane has a table', (await page.$$('#screen-plan .tab-pane .bp-table')).length >= 1);

// ── every sub-tab renders without throwing ──
let paneOk = 0;
const paneStats = [];
for (let i = 0; i < stabs.length; i++) {
  await page.click(`#screen-plan .stab:nth-child(${i + 1})`);
  await page.waitForTimeout(60);
  const n = await page.$$eval('#screen-plan .tab-pane', els =>
    els.filter(e => e.style.display !== 'none').map(e => e.innerHTML.length));
  const vis = n.filter(x => x > 200);
  if (vis.length === 1) paneOk++;
  paneStats.push(stabs[i].slice(0, 14) + '=' + (n.join('/')));
}
check('each sub-tab shows exactly 1 populated pane', paneOk === 12, paneOk + '/12');

// helper: text of the currently visible plan pane
const visPaneText = () => page.$$eval('#screen-plan .tab-pane',
  els => els.filter(e => e.style.display !== 'none').map(e => e.textContent).join('\n'));
const visPane = sel => page.locator('#screen-plan .tab-pane').filter({ visible: true }).locator(sel);

async function paneText(label) {
  await page.click(`#screen-plan .stab:has-text("${label}")`);
  await page.waitForTimeout(80);
  return visPaneText();
}
const overview = await paneText('Overview');
check('Overview: 500-750 deficit', overview.includes('500') && overview.includes('750'));
check('Overview: 1.2-1.6 protein', overview.includes('1.2') && overview.includes('1.6'));
check('Overview: 12h fast', overview.includes('12h'));
check('Overview: 150+ min cardio', overview.includes('150'));
const nutrition = await paneText('Nutrition');
check('Nutrition: example meal table', nutrition.includes('Greek yogurt') && nutrition.includes('salmon'));
check('Nutrition: salmon dinner row', nutrition.includes('200 g potato'));
check('Nutrition: plate ratio', nutrition.includes('Non-starchy vegetables'));
const training = await paneText('Training');
check('Training: full-body A/B/C', training.includes('workout A') && training.includes('workout C'));
check('Training: no Mon/Tue body split', !/Chest \+ Triceps|Back \+ Biceps/.test(training));
check('Training: 150-300 min target', training.includes('150'));
const risks = await paneText('Risks');
check('Risks: SGLT2 present', risks.includes('SGLT2'));
check('Risks: ketoacidosis stop sign', risks.includes('ketoacidosis'));
check('Risks: gallstones', risks.includes('gallstone'));
const timing = await paneText('Timing');
check('Timing: 14h optional', timing.includes('14h'));
check('Timing: warns 24h+', timing.includes('24'));
const sleep = await paneText('Sleep');
check('Sleep: caffeine 8h rule', sleep.includes('8+ hours'));
check('Sleep: apnoea screening', sleep.includes('apnoea'));
const auto = await paneText('Automation');
check('Automation: grocery + batch prep', auto.includes('grocery') && auto.includes('Batch'));
// the plan must actively refute the claims the old app made
const exp = await paneText('Expectations');
check('plan refutes autophagy / loose-skin claims',
  /not solidly supported|preliminary/i.test(exp) && /loose skin/i.test(exp), exp.replace(/\s+/g, ' ').slice(0, 90));
const tim = await paneText('Timing');
check('plan refutes pink salt / ACV hacks', /pink salt/i.test(tim) && /Do not rely/i.test(tim));
const lim = await paneText('Foods to Limit');
check('plan says limit-not-ban', /not ban/i.test(lim));

// ── accordion toggle persists ──
await paneText('Preparation');
const accBefore = await page.$$eval('#screen-plan .tab-pane', els =>
  els.filter(e => e.style.display !== 'none')[0].querySelectorAll('.bp-acc.open').length);
await visPane('.bp-acc-head').first().click();
await page.waitForTimeout(120);
const accAfter = await page.$$eval('#screen-plan .tab-pane', els =>
  els.filter(e => e.style.display !== 'none')[0].querySelectorAll('.bp-acc.open').length);
check('accordion toggles', accAfter !== accBefore, accBefore + ' -> ' + accAfter);

// ── checklist toggle ──
await paneText('Daily');
const meterBefore = await visPane('.bp-meter-lbl').textContent();
const dashBefore = (await page.textContent('#plan-dash .dash-val'));
await visPane('.bp-check-row').first().click();
await page.waitForTimeout(150);
const meterAfter = await visPane('.bp-meter-lbl').textContent();
check('daily checklist ticks', meterBefore !== meterAfter, meterBefore + ' -> ' + meterAfter);
const dashAfter = (await page.textContent('#plan-dash .dash-val'));
check('dashboard syncs with checklist', dashBefore !== dashAfter, dashBefore + ' -> ' + dashAfter);

// two accordions in the same section must not share open state
await paneText('Expectations');
const preAcc = await page.evaluate(() => {
  const raw = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.indexOf('bpAcc_') === 0) raw[k] = localStorage.getItem(k);
  }
  return Object.keys(raw);
});
check('accordion state keys are per-block', new Set(preAcc.map(k => k.replace(/_\d+$/, ''))).size === preAcc.length, preAcc.join(', '));

await paneText('Daily');
await visPane('.bp-check-row').first().click(); // untick
await page.waitForTimeout(120);

// ── search ──
await page.fill('#plan-search', 'ketoacidosis');
await page.waitForTimeout(300);
const hits = await page.$$eval('#screen-plan .bp-res', e => e.map(x => x.textContent));
check('search finds ketoacidosis', hits.length > 0 && hits.some(h => /Risks/i.test(h)), hits.join(' | '));
await page.click('#screen-plan .bp-res');
await page.waitForTimeout(200);
check('search result navigates', await page.evaluate(() => document.getElementById('screen-plan').getAttribute('data-active-section') === 'risks'));
await page.fill('#plan-search', '');
await page.waitForTimeout(250);

// ── sort ──
const barCount = () => page.$$eval('#screen-plan .stabs', e => e.length);
check('exactly one sub-tab bar', (await barCount()) === 1, String(await barCount()));
const order0 = await page.$$eval('#screen-plan .stab', e => e.map(x => x.textContent.trim()));
await page.selectOption('#plan-sort', 'az');
await page.waitForTimeout(200);
check('no duplicate bars after sort', (await barCount()) === 1, String(await barCount()));
const orderAZ = await page.$$eval('#screen-plan .stab', e => e.map(x => x.textContent.trim()));
check('sort A-Z reorders', JSON.stringify(order0) !== JSON.stringify(orderAZ), orderAZ.slice(0, 3).join(' | '));
const sortedOk = orderAZ.map(s => s.replace(/[^A-Za-z]/g, '')).slice().sort().join() === orderAZ.map(s => s.replace(/[^A-Za-z]/g, '')).join();
check('A-Z order is actually alphabetical', sortedOk);
await page.selectOption('#plan-sort', 'priority');
await page.waitForTimeout(200);
check('no duplicate bars after 2nd sort', (await barCount()) === 1, String(await barCount()));
const orderP = await page.$$eval('#screen-plan .stab', e => e.map(x => x.textContent.trim()));
check('priority sort puts Risks first', /Risks/.test(orderP[0]), orderP.slice(0, 3).join(' | '));
await page.selectOption('#plan-sort', 'order');
await page.waitForTimeout(200);
check('no duplicate bars after 3rd sort', (await barCount()) === 1, String(await barCount()));
// health bar exists from boot; the grooming bar is built lazily on first visit
check('home health group has exactly one bar', (await page.$$eval('#cat-health .stabs', e => e.length)) === 1,
  String(await page.$$eval('#cat-health .stabs', e => e.length)));
// scroll affordance is wired
check('tab bar reports scroll position', ['start', 'mid', 'end', 'none'].includes(
  await page.$eval('#screen-plan .stabs', e => e.dataset.pos)));

// ── expand all / density ──
await page.click('#plan-expand');
await page.waitForTimeout(300);
const openAcc = await page.$$eval('#screen-plan .bp-acc.open', e => e.length);
check('expand-all opens accordions', openAcc > 3, openAcc + ' open');
await page.click('#plan-expand');
await page.waitForTimeout(250);

const rowH = () => page.evaluate(() => {
  const el = document.querySelector('#screen-plan .tab-pane[style*="display: block"] .bp-kv-row');
  return el ? el.getBoundingClientRect().height : 0;
});
await paneText('Overview');           // a section that uses key/value rows
await page.click('#plan-expand');     // open accordions so rows are measurable
await page.waitForTimeout(300);
const comfyH = await rowH();
await page.click('#plan-density');
await page.waitForTimeout(250);
check('density -> compact', await page.evaluate(() => document.documentElement.getAttribute('data-density') === 'compact'));
const compactH = await rowH();
check('compact is denser than comfortable', compactH > 0 && compactH < comfyH, compactH.toFixed(1) + 'px vs ' + comfyH.toFixed(1) + 'px');
await page.click('#plan-density');
await page.waitForTimeout(250);
check('density -> comfortable', await page.evaluate(() => document.documentElement.getAttribute('data-density') === 'comfortable'));
await page.click('#plan-expand');
await page.waitForTimeout(250);

// ── persistence across reload ──
await page.selectOption('#plan-sort', 'za');
await page.waitForTimeout(150);
await page.click('#screen-plan .stab:has-text("Sleep")');
await page.waitForTimeout(200);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
check('active screen persists after reload', await page.evaluate(() => document.getElementById('screen-plan').classList.contains('active')));
check('active nav button persists', await page.evaluate(() => document.querySelector('.nav-btn[data-screen="plan"]').classList.contains('active')));
check('tab state persists after reload', await page.evaluate(() => document.getElementById('screen-plan').getAttribute('data-active-section') === 'sleep'));
check('sort state persists', (await page.inputValue('#plan-sort')) === 'za');
await page.selectOption('#plan-sort', 'order');
await page.waitForTimeout(200);
await page.click('.nav-btn[data-screen="home"]');
await page.waitForTimeout(300);

// ── HOME deck: existing content, now engine-driven ──
await page.click('.nav-btn:nth-child(1)');
await page.waitForTimeout(300);
const catTabs = await page.$$eval('#screen-home .cat-tab', e => e.map(x => x.textContent.trim()));
check('home has 2 category tabs', catTabs.length === 2 && /Health/.test(catTabs[0]) && /Grooming/.test(catTabs[1]), catTabs.join(' | '));
const hStabs = await page.$$eval('#cat-health .stab', e => e.map(x => x.textContent.trim()));
check('health has 5 sub-tabs', hStabs.length === 5, hStabs.join(' | '));
check('Big D sub-tab is labelled and reachable', hStabs.some(s => /Big D/i.test(s)), hStabs.join(' | '));
check('only one pane visible on home', (await page.$$eval('#screen-home .tab-pane', e => e.filter(x => x.style.display !== 'none').length)) === 1);

// click every home sub-tab
const hGroups = await page.$$eval('#screen-home .cat-tab', e => e.map(x => x.dataset.cat));
let homeOk = 0, homeTotal = 0;
for (const g of hGroups) {
  await page.click(`#screen-home .cat-tab[data-cat="${g}"]`);
  await page.waitForTimeout(150);
  const n = await page.$$eval(`[data-deck-group="${g}"] .tab-pane`, els => els.length);
  const bars = await page.$$eval(`[data-deck-group="${g}"] .stabs`, els => els.length);
  if (bars !== 1) errors.push('ASSERT: duplicate tab bars in ' + g);
  if (n === 0) errors.push('ASSERT: no panes in ' + g);
  for (let i = 0; i < n; i++) {
    await page.click(`[data-deck-group="${g}"] .stab:nth-child(${i + 1})`);
    await page.waitForTimeout(60);
    const vis = await page.$$eval(`[data-deck-group="${g}"] .tab-pane`, els => els.filter(e => e.style.display !== 'none').length);
    homeTotal++;
    if (vis === 1) homeOk++;
  }
}
check('every home sub-tab shows exactly 1 pane', homeOk === homeTotal, homeOk + '/' + homeTotal);

// existing home content intact
const homeTxt = await page.textContent('#screen-home');
check('existing eyes content intact', homeTxt.includes('20-20-20') && homeTxt.includes('Digital Eye Strain'));
check('existing big-d content intact', homeTxt.includes('Shilajit') && homeTxt.includes('Tongkat'));
// the fragrance/hair tables moved into the Products catalogue
check('existing hair content intact', homeTxt.includes('Minoxidil') && homeTxt.includes('Rosemary'));
const links = await page.$$eval('#screen-home a.shop-btn', a => a.length);
check('shop links preserved', links > 20, links + ' links');

// ── PRODUCTS screen ─────────────────────────────────────────
await page.click('.nav-btn[data-screen="products"]');
await page.waitForTimeout(350);
check('products screen active', await page.evaluate(() => document.getElementById('screen-products').classList.contains('active')));
const prodSub = await page.$$eval('#screen-products .stab', e => e.map(x => x.textContent.trim()));
check('9 product categories (All + 8)', prodSub.length === 9, prodSub.length + ': ' + prodSub.join(' | '));
const prodPane = sel => page.locator('#screen-products .tab-pane').filter({ visible: true }).locator(sel);
const allCount = (await prodPane('.bp-count').textContent()) || '';
const totalShown = parseInt(allCount, 10);
check('All shows the whole catalogue', totalShown > 60, allCount.trim());
const tiers = (await prodPane('.bp-tier').allTextContents()).map(t => t.trim());
check('tier filters present', tiers.join(',') === 'All,Budget,Mid,Premium', tiers.join(','));

// every category renders and respects its filter
let catOk = 0;
const catCounts = [];
for (let i = 1; i < prodSub.length; i++) {
  await page.click(`#screen-products .stab:nth-child(${i + 1})`);
  await page.waitForTimeout(90);
  const n = await prodPane('.bp-prod').count();
  catCounts.push(prodSub[i].replace(/[^A-Za-z& ]/g, '') + '=' + n);
  if (n > 0) catOk++;
  else errors.push('ASSERT: empty product category ' + prodSub[i]);
}
check('every product category has items', catOk === 8, catOk + '/8  ' + catCounts.join(' '));
const catSum = catCounts.reduce((a, s) => a + parseInt(s.split('=')[1], 10), 0);
check('categories partition the catalogue', catSum === totalShown, catSum + ' vs ' + totalShown);

// tier filter narrows results
await page.click('#screen-products .stab:has-text("All")');
await page.waitForTimeout(120);
const beforeTier = await prodPane('.bp-prod').count();
await prodPane('.bp-tier:has-text("Budget")').click();
await page.waitForTimeout(200);
const afterTier = await prodPane('.bp-prod').count();
check('tier filter narrows the list', afterTier > 0 && afterTier < beforeTier, beforeTier + ' -> ' + afterTier);
const tiersShown = [...new Set((await prodPane('.bp-prod-tier').allTextContents()).map(t => t.trim()))];
check('tier filter shows only that tier', tiersShown.length === 1 && tiersShown[0] === 'budget', tiersShown.join(','));
await prodPane('.bp-tier:has-text("All")').click();
await page.waitForTimeout(200);
check('tier filter resets', await prodPane('.bp-prod').count() === beforeTier);

// item-level search inside the catalogue
await page.fill('#prod-search', 'rosemary');
await page.waitForTimeout(350);
const searched = (await prodPane('.bp-prod-name').allTextContents()).map(t => t.trim());
check('product search filters items', searched.length > 0 && searched.every(n => /rosemary/i.test(n)), searched.join(' | '));
await page.fill('#prod-search', 'zzzznope');
await page.waitForTimeout(350);
check('empty state shown for no matches', await prodPane('.bp-empty').count() === 1);
await page.fill('#prod-search', '');
await page.waitForTimeout(320);

const shopLinks = await prodPane('.bp-prod .shop-btn').count();
check('products have shop links', shopLinks > 60, shopLinks + ' links');
const allNames = (await prodPane('.bp-prod-name').allTextContents()).map(t => t.trim());
const dupeCount = allNames.length - new Set(allNames).size;
check('no duplicate products in the catalogue', dupeCount === 0, dupeCount + ' dupes');
check('catalogue is fully rendered', allNames.length === totalShown, allNames.length + '/' + totalShown);

// pointers from tips -> products
await page.click('.nav-btn[data-screen="home"]');
await page.waitForTimeout(300);
await page.click('#screen-home .cat-tab[data-cat="grooming"]');
await page.waitForTimeout(200);
await page.click('[data-deck-group="grooming"] .stab:has-text("Products")');
await page.waitForTimeout(200);
const groomPane = page.locator('[data-deck-group="grooming"] .tab-pane').filter({ visible: true });
const groomTxt = await groomPane.textContent();
check('grooming Products pane points to catalogue', /Open Products/.test(groomTxt),
  (groomTxt || '').replace(/\s+/g, ' ').slice(0, 80));
await page.click('.nav-btn[data-screen="settings"]');
await page.waitForTimeout(250);
check('settings shopping list points to catalogue', /Open the Products tab/.test(await page.textContent('#res-shopping')));
const measurementIds = ['weight-input', 'cal-age', 'proto-weight', 'waist-input', 'bmi-value', 'avg7-display'];
const leftover = [];
for (const id of measurementIds) if (await page.$('#' + id)) leftover.push(id);
check('no leftover measurement UI', leftover.length === 0, leftover.join(','));
// ── settings ──
await page.click('.nav-btn:nth-child(5)');
await page.waitForTimeout(300);
const sTxt = await page.textContent('#screen-settings');
check('settings: density toggle present', sTxt.includes('Compact Layout'));
check('settings: research links updated', sTxt.includes('SGLT2 Inhibitors & Fasting Risk') && sTxt.includes('Waist vs BMI'));
check('settings: no autophagy-skin research claim', !sTxt.includes('Autophagy & Skin'));
check('settings: version bumped', sTxt.includes('v5.0'));
check('density label reflects state', (await page.textContent('#density-label')).startsWith('Currently:'));

// ── a11y: tabs are real tabs, toggles are keyboard-operable ──
await page.click('.nav-btn[data-screen="plan"]');
await page.waitForTimeout(300);
check('cat-tabs has role=tablist', await page.getAttribute('#screen-home .cat-tabs', 'role') === 'tablist');
check('sub-tabs have role=tablist', await page.getAttribute('#screen-plan .stabs', 'role') === 'tablist');
const stabRoles = await page.$$eval('#screen-plan .stab', e => e.map(x => x.getAttribute('role')));
check('all sub-tabs role=tab', stabRoles.every(r => r === 'tab'));
const sel = await page.$$eval('#screen-plan .stab', e => e.filter(x => x.classList.contains('active')).map(x => x.getAttribute('aria-selected')));
check('exactly one sub-tab aria-selected=true', sel.length === 1 && sel[0] === 'true', sel.join());
check('panes have role=tabpanel', (await page.$$eval('#screen-plan .tab-pane', e => e.every(x => x.getAttribute('role') === 'tabpanel'))));

// keyboard toggle an accordion
await paneText('Preparation');
const kbBefore = await visPane('.bp-acc.open').count();
await visPane('.bp-acc-head').first().focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(150);
const kbAfter = await visPane('.bp-acc.open').count();
check('accordion opens via keyboard', kbAfter !== kbBefore, kbBefore + ' -> ' + kbAfter);
check('accordion role=button + tabindex', await visPane('.bp-acc-head').first().getAttribute('role') === 'button'
  && await visPane('.bp-acc-head').first().getAttribute('tabindex') === '0');
// keyboard toggle a checklist row
await paneText('Daily');
const cBefore = await visPane('.bp-meter-lbl').textContent();
await visPane('.bp-check-row').first().focus();
await page.keyboard.press(' ');
await page.waitForTimeout(150);
check('checklist toggles via keyboard', (await visPane('.bp-meter-lbl').textContent()) !== cBefore);
await visPane('.bp-check-row').first().click();
await page.waitForTimeout(100);

// "/" shortcut focuses search
await page.keyboard.press('/');
await page.waitForTimeout(150);
check('"/" focuses search', await page.evaluate(() => document.activeElement && document.activeElement.id === 'plan-search'));
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

// ── scroll resets (the window is the scroller, not .scroll) ──
const winY = () => page.evaluate(() => window.scrollY);
await paneText('Nutrition');           // a long section, guaranteed scrollable
await page.waitForTimeout(200);
const scrollable = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight + 50);
check('plan section is scrollable', scrollable);
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(150);
check('page actually scrolls', (await winY()) > 100, String(await winY()));
await page.click('.nav-btn[data-screen="home"]');
await page.waitForTimeout(250);
check('screen switch resets scroll', (await winY()) === 0, String(await winY()));
await page.click('.nav-btn[data-screen="plan"]');
await page.waitForTimeout(250);
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(150);
await page.click('#screen-plan .stab:has-text("Nutrition")');
await page.waitForTimeout(250);
check('sub-tab change resets scroll', (await winY()) === 0, String(await winY()));
await page.click('#screen-plan .stab:has-text("Overview")');
await page.waitForTimeout(200);

// ── no horizontal overflow anywhere ──
for (const s of ['home', 'plan', 'products', 'tasks', 'settings']) {
  await page.click(`.nav-btn[data-screen="${s}"]`);
  await page.waitForTimeout(220);
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no h-overflow on ' + s, ov <= 1, ov + 'px');
}

await browser.close();
server.close();

const fails = results.filter(r => r.startsWith('FAIL')).length;
console.log('\n' + (results.length - fails) + '/' + results.length + ' passed');
if (errors.length) { console.log('\n--- ERRORS ---'); console.log([...new Set(errors)].join('\n')); process.exit(1); }
