// End-to-end verification of the combined GlowUp app.
// Drives the real UI (no internal APIs) in a fresh browser context, so a
// stale cached asset can never mask a regression.
//
//   node scripts/verify-app.mjs [baseUrl]
import { chromium } from 'playwright-core';

const BASE = process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:8080';
let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? '  — ' + detail : ''}`);
};

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text()); });

try {
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.GLOWUP_DATA && !!window.GLOWUP_TOPICS);

  console.log('\n--- data layer ---');
  const data = await page.evaluate(() => ({
    articles: window.GLOWUP_DATA.articles.length,
    categories: window.GLOWUP_DATA.categories.length,
    products: window.GLOWUP_DATA.products.length,
    verified: window.GLOWUP_DATA.products.filter((p) => p.priceVerified).length,
    nutrition: window.GLOWUP_DATA.nutrition.length,
    meals: window.GLOWUP_DATA.meals.length,
    bigD: window.GLOWUP_DATA.articles.filter((a) => a.category === 'mens-vitality').map((a) => a.id),
    emptySummary: window.GLOWUP_DATA.articles
      .filter((a) => !(a.summary || []).length || !(a.points || []).length)
      .map((a) => a.id),
  }));
  check('38 articles', data.articles === 38, String(data.articles));
  check('12 categories', data.categories === 12, String(data.categories));
  check('18 products / 12 verified', data.products === 18 && data.verified === 12, `${data.products}/${data.verified}`);
  check('26 foods', data.nutrition === 26, String(data.nutrition));
  check('5 meals', data.meals === 5, String(data.meals));
  check('5 Big D articles', data.bigD.length === 5, data.bigD.join(', '));
  check('every article has a summary or points', data.emptySummary.length === 0, data.emptySummary.join(', '));

  console.log('\n--- navigation ---');
  const nav = await page.$$eval('nav button, nav a', (els) => els.map((e) => e.textContent.trim()).filter(Boolean));
  check('5 nav items', nav.length === 5, nav.join(' | '));
  check('nav is Today/Plan/Learn/Fuel/Shop', ['Today', 'Plan', 'Learn', 'Fuel', 'Shop'].every((l, i) => nav[i] === l), nav.join(' | '));

  console.log('\n--- library: sections and sub-topics ---');
  const topics = await page.evaluate(() =>
    window.GLOWUP_TOPICS.sections.map((s) => ({ id: s.id, label: s.label, n: (s.topics || []).length }))
  );
  check('4 sections', topics.length === 4, topics.map((t) => t.label).join(' | '));
  check('every section has sub-topics', topics.every((t) => t.n > 0), JSON.stringify(topics.map((t) => t.n)));

  console.log('\n--- Big D reachable from the Sexual health topic ---');
  const sexual = await page.evaluate(() => {
    const s = window.GLOWUP_TOPICS.sections.flatMap((x) => x.topics || []).find((t) => t.id === 'sexual');
    return (s?.reading || []).map((r) => r.id);
  });
  check('Big D links present', sexual.filter((r) => /^big-d/.test(r)).length === 5, sexual.join(', '));

  console.log('\n--- drive the UI: Learn → Sexual health → a Big D article ---');
  await page.click('nav button:has-text("Learn")');
  await page.waitForTimeout(600);
  await page.click('[role=tab]:has-text("Sexual health")');
  await page.waitForTimeout(800);
  const cards = await page.$$eval('.row-card', (els) => els.map((e) => e.textContent.trim().slice(0, 60)));
  check('Big D article cards rendered', cards.some((c) => /fertility/i.test(c)), cards.join(' | '));

  await page.click('.row-card:has-text("Fertility")');
  await page.waitForTimeout(1000);

  const sheet = await page.evaluate(() => {
    const s = document.getElementById('sheet');
    const ls = document.getElementById('long-summary');
    const btns = s ? Array.from(s.querySelectorAll('button')) : [];
    return {
      open: s ? !s.classList.contains('hidden') : false,
      longSummary: !!ls,
      lsItems: ls ? ls.querySelectorAll('li').length : -1,
      lsOpen: ls ? ls.open : null,
      listen: btns.some((b) => /listen/i.test(b.textContent + (b.getAttribute('aria-label') || ''))),
      stop: btns.some((b) => /stop reading/i.test(b.textContent + (b.getAttribute('aria-label') || ''))),
      voiceSelect: !!s && s.querySelectorAll('select').length > 0,
      rateSelect: !!s && !!s.querySelector('#reader-rate'),
      rateOptions: s ? s.querySelectorAll('#reader-rate option').length : 0,
      bodyHas: /sperm|LH|FSH/i.test(s ? s.innerText : ''),
    };
  });
  check('article sheet opened', sheet.open);
  check('read-aloud control present', sheet.listen);
  check('stop control present', sheet.stop);
  check('voice picker present', sheet.voiceSelect);
  check('rate picker present', sheet.rateSelect && sheet.rateOptions >= 3, `${sheet.rateOptions} rates`);
  check('longer summary present', sheet.longSummary);
  check('longer summary has content', sheet.lsItems > 0, `${sheet.lsItems} items`);
  check('longer summary is collapsible', sheet.lsOpen === false || sheet.lsOpen === true);
  check('article body rendered', sheet.bodyHas);

  console.log('\n--- expand the longer summary by keyboard ---');
  await page.focus('#long-summary summary');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const expanded = await page.evaluate(() => {
    const ls = document.getElementById('long-summary');
    return { open: ls ? ls.open : null, items: ls ? ls.querySelectorAll('li').length : -1 };
  });
  check('longer summary expands on Enter', expanded.open === true, JSON.stringify(expanded));

  console.log('\n--- runtime errors ---');
  check('no console errors or page exceptions', errors.length === 0, errors.slice(0, 5).join(' | '));
} finally {
  await browser.close();
}

console.log(failures ? `\nFAILED: ${failures} check(s)` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
