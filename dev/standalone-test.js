// Standalone-build verification.
//
// Loads the single-file build from file:// and asserts that everything the
// hosted app does, it also does — with zero external requests.
//
//   node dev/standalone-test.js [pathOrUrl]
const { chromium } = require('playwright-core');
const { target } = require('./target');

let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? '  — ' + detail : ''}`);
};

(async () => {
const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const errs = [], reqs = [];
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
p.on('request', (r) => { if (!r.url().startsWith('file://')) reqs.push(r.url().slice(0, 80)); });

try {
  await p.goto(target(), { waitUntil: 'load' });
  await p.waitForTimeout(600);

  const boot = await p.evaluate(() => ({
    title: document.title,
    standalone: window.GLOWUP_STANDALONE === true,
    counts: window.GLOWUP_DATA.meta.counts,
    heroText: document.querySelector('#view-home h1')?.textContent,
    cssApplied: getComputedStyle(document.body).backgroundColor,
    dark: document.documentElement.classList.contains('dark'),
    swSkipped: !navigator.serviceWorker || !navigator.serviceWorker.controller,
    inter: document.fonts.check('14px Inter'),
    mono: document.fonts.check('700 32px "JetBrains Mono"'),
    ls: (() => { try { localStorage.setItem('t', '1'); localStorage.removeItem('t'); return 'ok'; } catch (e) { return 'BLOCKED: ' + e.name; } })(),
  }));

  console.log('BOOT', JSON.stringify(boot, null, 1));
  console.log('');

  check('the standalone flag is set', boot.standalone === true);
  check('the app booted', !!boot.heroText, boot.heroText || 'no hero');
  check('the stylesheet applied', boot.cssApplied !== 'rgba(0, 0, 0, 0)', boot.cssApplied);
  check('it starts dark by default', boot.dark === true);
  check('the webfonts loaded', boot.inter && boot.mono, `Inter=${boot.inter} mono=${boot.mono}`);
  check('the service worker is skipped on file://', boot.swSkipped === true);
  check('localStorage works on file://', boot.ls === 'ok', boot.ls);

  // --- Learn -> Articles, and count what is really rendered ---------------
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(300);
  await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(500);
  const articles = await p.evaluate(() => document.querySelectorAll('#articles-list article').length);
  check('all articles render', articles === (boot.counts?.articles ?? 38), String(articles));

  // --- Fuel -> Foods ------------------------------------------------------
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(400);
  const foods = await p.evaluate(() => document.querySelectorAll('#view-food article, #view-food .card').length);
  check('the food library renders', foods > 0, String(foods));

  // --- Shop -> products + a product sheet ---------------------------------
  await p.click('[data-nav="shop"]'); await p.waitForTimeout(400);
  const prods = await p.evaluate(() => document.querySelectorAll('#view-products [data-product]').length);
  check('the product catalogue renders', prods === (boot.counts?.products ?? 18), String(prods));

  await p.click('[data-product]'); await p.waitForTimeout(400);
  const sheet = await p.evaluate(() => ({
    open: !document.querySelector('#sheet').hidden,
    title: document.querySelector('#sheet-title')?.textContent.slice(0, 40),
  }));
  check('a product sheet opens', sheet.open === true, sheet.title || '');
  await p.click('#sheet-close'); await p.waitForTimeout(250);

  // --- search --------------------------------------------------------------
  await p.click('#search-open'); await p.fill('#search-input', 'sleep'); await p.waitForTimeout(400);
  const search = await p.evaluate(() => document.querySelector('#search-status').textContent);
  check('search works', /results? for/i.test(search), search);
  await p.click('#search-close'); await p.waitForTimeout(250);

  // --- theme toggle + persistence across a reload --------------------------
  await p.click('[data-nav="home"]'); await p.waitForTimeout(250);
  await p.click('#theme-toggle'); await p.waitForTimeout(350);
  const th1 = await p.evaluate(() => document.documentElement.classList.contains('dark'));
  check('the theme toggles', th1 === false);
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(500);
  const th2 = await p.evaluate(() => document.documentElement.classList.contains('dark'));
  check('the theme persists across a reload', th2 === false);

  // --- shopping list persistence ------------------------------------------
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(300);
  await p.click('[data-subnav="meals"]:visible'); await p.waitForTimeout(350);
  await p.click('.shop-item'); await p.waitForTimeout(300);
  const label = await p.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((x) => /shopping/i.test(x.textContent));
    return h ? h.parentElement.textContent.replace(/\s+/g, ' ').trim() : '';
  });
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(500);
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(300);
  await p.click('[data-subnav="meals"]:visible'); await p.waitForTimeout(350);
  const label2 = await p.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((x) => /shopping/i.test(x.textContent));
    return h ? h.parentElement.textContent.replace(/\s+/g, ' ').trim() : '';
  });
  check('the shopping list persists across a reload', label === label2 && /1\/27/.test(label), label2);

  // --- the whole point: zero external requests ----------------------------
  check('zero external requests', reqs.length === 0, reqs.join(' | '));
  check('no page exceptions', errs.length === 0, errs.slice(0, 3).join(' | '));
} finally {
  await p.evaluate(() => localStorage.clear()).catch(() => {});
  await b.close();
}

console.log(failures ? `\nFAILED: ${failures} check(s)` : '\nAll standalone checks passed.');
process.exit(failures ? 1 : 0);
})();
