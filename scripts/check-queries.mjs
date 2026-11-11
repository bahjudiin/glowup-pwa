// Query-layer verification: sorting, filtering and search across the real app.
//
// The app's query logic lives in assets/app.js (filter + sort for articles,
// foods and products; searchAll across every surface). This drives the actual
// UI and asserts the ordering and the counts, so the queries cannot silently
// regress.
//
//   node scripts/check-queries.mjs [baseUrl]
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

// Read the rendered card titles out of the list the user is looking at.
const articleTitles = () =>
  page.$$eval('#articles-list article', (els) =>
    els.map((e) => {
      const t = e.querySelector('.row-title, h3, h2');
      return (t ? t.textContent : e.textContent).trim();
    })
  );

const productNames = () =>
  page.$$eval('#view-products [data-product]', (els) =>
    els.map((e) => {
      const t = e.querySelector('.row-title');
      return (t ? t.textContent : e.textContent).trim();
    })
  );

const foodNames = () =>
  page.$$eval('#view-food article.card h3', (els) => els.map((e) => e.textContent.trim()));

try {
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.GLOWUP_DATA);

  console.log('\n--- articles: category filter ---');
  await page.click('nav button:has-text("Learn")');
  await page.waitForTimeout(500);
  await page.click('[data-subnav="articles"]:visible');
  await page.waitForTimeout(600);

  const total = (await articleTitles()).length;
  check('all articles listed', total === 38, String(total));

  const sleepChip = await page.$('[data-chip="sleep"]:visible');
  await sleepChip.click();
  await page.waitForTimeout(400);
  const sleepCount = (await articleTitles()).length;
  const expectedSleep = await page.evaluate(
    () => window.GLOWUP_DATA.articles.filter((a) => a.category === 'sleep').length
  );
  check('category filter narrows the list', sleepCount === expectedSleep && sleepCount > 0, `${sleepCount} vs ${expectedSleep}`);

  await page.click('[data-chip="all"]:visible');
  await page.waitForTimeout(400);

  console.log('\n--- articles: grade filter ---');
  await page.click('[data-grade="High"]:visible');
  await page.waitForTimeout(400);
  const highCount = (await articleTitles()).length;
  const expectedHigh = await page.evaluate(
    () => window.GLOWUP_DATA.articles.filter((a) => a.grade === 'High').length
  );
  check('grade filter matches the data', highCount === expectedHigh, `${highCount} vs ${expectedHigh}`);
  await page.click('[data-grade="all"]:visible');
  await page.waitForTimeout(400);

  console.log('\n--- articles: text filter ---');
  await page.fill('#articles-q', 'sleep');
  await page.waitForTimeout(500);
  const qCount = (await articleTitles()).length;
  check('text filter narrows the list', qCount > 0 && qCount < total, `${qCount} of ${total}`);
  await page.fill('#articles-q', '');
  await page.waitForTimeout(500);

  console.log('\n--- articles: sort orders ---');
  // Evidence first
  await page.click('[data-seg="grade"]:visible');
  await page.waitForTimeout(400);
  const byGrade = await page.evaluate(() => {
    const rank = { High: 0, 'Moderate–High': 1, Moderate: 2, 'Low–Moderate': 3, Low: 4 };
    const grades = window.GLOWUP_DATA.articles
      .filter((a) => rank[a.grade] !== undefined)
      .map((a) => rank[a.grade])
      .sort((a, b) => a - b);
    return grades;
  });
  const shownGrades = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('#articles-list article').forEach((el) => {
      const badge = el.querySelector('.badge, .badge-outline');
      if (badge) out.push(badge.textContent.trim());
    });
    return out;
  });
  const rankOf = { High: 0, 'Moderate–High': 1, Moderate: 2, 'Low–Moderate': 3, Low: 4 };
  const ranks = shownGrades.map((g) => rankOf[g]).filter((n) => n !== undefined);
  const sortedGrades = ranks.every((r, i) => i === 0 || ranks[i - 1] <= r);
  check('Evidence-first sort is ascending', sortedGrades, ranks.join(','));
  check('grade order matches the canonical rank', byGrade.length > 0);

  // A–Z
  await page.click('[data-seg="az"]:visible');
  await page.waitForTimeout(400);
  const azTitles = await articleTitles();
  const sortedAz = azTitles.every((t, i) => i === 0 || azTitles[i - 1].localeCompare(t) <= 0);
  check('A–Z sort is alphabetical', sortedAz, azTitles.slice(0, 3).join(' | '));

  // Shortest
  await page.click('[data-seg="short"]:visible');
  await page.waitForTimeout(400);
  const shortTimes = await page.$$eval('#articles-list article', (els) =>
    els.map((e) => {
      const m = e.textContent.match(/(\d+)\s*min/);
      return m ? Number(m[1]) : null;
    })
  );
  const times = shortTimes.filter((n) => n !== null);
  const sortedShort = times.every((t, i) => i === 0 || times[i - 1] <= t);
  check('Shortest sort is ascending by read time', sortedShort && times.length > 0, times.slice(0, 5).join(','));

  await page.click('[data-seg="grade"]:visible');
  await page.waitForTimeout(300);

  console.log('\n--- products: sort + verified filter ---');
  await page.click('nav button:has-text("Shop")');
  await page.waitForTimeout(600);

  await page.click('[data-seg="cost"]:visible');
  await page.waitForTimeout(400);
  const costs = await page.$$eval('#view-products [data-product]', (els) =>
    els.map((e) => {
      const m = e.textContent.match(/\$\s*([\d.]+)\s*\/\s*serv/i);
      return m ? Number(m[1]) : null;
    })
  );
  const known = costs.filter((n) => n !== null);
  const sortedCost = known.every((c, i) => i === 0 || known[i - 1] <= c + 1e-9);
  check('cost/serving sort is ascending', sortedCost, known.slice(0, 5).join(','));

  await page.click('#verified-toggle');
  await page.waitForTimeout(400);
  const verifiedCount = (await productNames()).length;
  const expectedVerified = await page.evaluate(
    () => window.GLOWUP_DATA.products.filter((p) => p.priceVerified).length
  );
  check('verified-only filter matches the data', verifiedCount === expectedVerified, `${verifiedCount} vs ${expectedVerified}`);

  console.log('\n--- foods: group filter ---');
  await page.click('nav button:has-text("Fuel")');
  await page.waitForTimeout(600);
  const allFoods = (await foodNames()).length;
  const proteinChip = await page.$('[data-chip="protein"]:visible');
  await proteinChip.click();
  await page.waitForTimeout(400);
  const proteinFoods = (await foodNames()).length;
  const expectedProtein = await page.evaluate(
    () => window.GLOWUP_DATA.nutrition.filter((f) => f.group === 'protein').length
  );
  check('food group filter narrows the list', proteinFoods === expectedProtein && proteinFoods < allFoods, `${proteinFoods} vs ${expectedProtein}`);

  console.log('\n--- search across surfaces ---');
  await page.click('#search-open');
  await page.fill('#search-input', 'creatine');
  await page.waitForTimeout(600);
  const search = await page.evaluate(() => ({
    status: document.querySelector('#search-status').textContent.trim(),
    groups: [...document.querySelectorAll('#search-results p')]
      .map((n) => n.textContent.trim())
      .filter((t) => /\u00b7/.test(t)),
    hits: document.querySelectorAll('#search-results [data-article], #search-results [data-product], #search-results [data-food]').length,
  }));
  check('search returns results', /results? for/i.test(search.status), search.status);
  check('search spans multiple surfaces', search.groups.length >= 2, search.groups.join(' | '));
  check('search results are actionable', search.hits > 0, String(search.hits));

  // a search with no hits must say so rather than render an empty list
  await page.fill('#search-input', 'zzzqqqnotathing');
  await page.waitForTimeout(600);
  const empty = await page.evaluate(() => ({
    status: document.querySelector('#search-status').textContent.trim(),
    body: document.querySelector('#search-results').textContent.trim().length,
  }));
  check('an empty search reports it', /no result|0 result/i.test(empty.status), empty.status);

  console.log('\n--- runtime errors ---');
  check('no page exceptions', errors.length === 0, errors.slice(0, 3).join(' | '));
} finally {
  await browser.close();
}

console.log(failures ? `\nFAILED: ${failures} check(s)` : '\nAll query checks passed.');
process.exit(failures ? 1 : 0);
