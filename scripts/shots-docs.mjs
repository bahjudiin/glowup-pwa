// Capture the README screenshots from the live app surface.
// Every shot the README references is produced here, so the docs can never
// drift from the shipped UI.
//
//   node scripts/shots-docs.mjs [baseUrl] [outDir]
//
// baseUrl defaults to the local static server; outDir defaults to docs/.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:8080';
const OUT = process.argv[3] || join(process.cwd(), 'docs');
mkdirSync(OUT, { recursive: true });

const SHOT = { path: OUT, type: 'jpeg', quality: 82 };
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });

const shot = async (name) => {
  await page.screenshot({ ...SHOT, path: join(OUT, name) });
  console.log('  ' + name);
};

// Switch theme through the app's own toggle so localStorage stays consistent.
const setTheme = async (theme) => {
  await page.evaluate((t) => {
    const dark = document.documentElement.classList.contains('dark');
    if ((t === 'dark') !== dark) document.querySelector('#theme-toggle').click();
  }, theme);
  await page.waitForTimeout(400);
};

const click = async (sel, wait = 450) => {
  // only the visible instance counts — the app renders one seg group per view
  const el = await page.$(sel + ':visible') || await page.$(sel);
  if (!el) { console.log('  ! missing ' + sel); return false; }
  await el.click();
  await page.waitForTimeout(wait);
  return true;
};

try {
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.GLOWUP_DATA);

  // ---- dark mode is the primary theme ----
  await setTheme('dark');

  await shot('glowup-home.jpg');

  // Learn -> Articles
  await click('[data-nav="learn"]');
  await click('[data-subnav="articles"]');
  await shot('glowup-articles.jpg');

  // an article sheet (Big D fertility, to show the new content)
  await click('#articles-list [data-article="big-d-fertility"]', 800);
  await shot('glowup-article.jpg');
  await click('#sheet-close', 300);

  // Learn -> Library (the 19 topics with sub-tabs)
  await click('[data-nav="learn"]');
  await click('[data-subnav="library"]');
  await shot('glowup-library.jpg');

  // Learn -> Guides
  await click('[data-nav="learn"]');
  await click('[data-subnav="guides"]');
  await shot('glowup-guides.jpg');

  // Fuel -> Foods
  await click('[data-nav="fuel"]');
  await click('[data-subnav="food"]');
  await shot('glowup-food.jpg');

  // Foods -> table
  await click('#food-mode-toggle');
  await shot('glowup-food-table.jpg');
  await click('#food-mode-toggle', 300);

  // Fuel -> Meals
  await click('[data-nav="fuel"]');
  await click('[data-subnav="meals"]');
  await shot('glowup-meals.jpg');

  // Shop -> buy list
  await click('[data-nav="shop"]');
  await shot('glowup-products.jpg');

  // Shop -> supplement ledger
  await click('[data-mode="ledger"]');
  await shot('glowup-ledger.jpg');
  await click('[data-mode="list"]', 300);

  // search overlay
  await click('#search-open');
  await page.fill('#search-input', 'sleep');
  await page.waitForTimeout(450);
  await shot('glowup-search.jpg');
  await click('#search-close', 250);

  // supplements article
  await click('[data-nav="learn"]');
  await click('[data-subnav="articles"]');
  await click('#articles-list [data-article="supplements"]', 800);
  await shot('glowup-supplements.jpg');
  await click('#sheet-close', 300);

  // fasting claims article
  await click('#articles-list [data-article="fasting-claims"]', 800);
  await shot('glowup-fasting-claims.jpg');
  await click('#sheet-close', 300);

  // Blueprint / Plan
  await click('[data-nav="plan"]');
  await shot('glowup-plan.jpg');

  // ---- light mode (white mode) ----
  await setTheme('light');
  await click('[data-nav="home"]');
  await shot('glowup-home-light.jpg');

  await click('[data-nav="learn"]');
  await click('[data-subnav="articles"]');
  await shot('glowup-articles-light.jpg');

  await click('[data-nav="shop"]');
  await shot('glowup-products-light.jpg');
} finally {
  await browser.close();
}

console.log('errors: ' + (errs.length ? errs.join(' | ') : 'none'));
