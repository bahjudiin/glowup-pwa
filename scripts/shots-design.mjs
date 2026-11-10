// Capture screenshots of the main views in both themes.
//   node scripts/shots-design.mjs [baseUrl] [outDir]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:8080';
const OUT = process.argv[3] || join(process.cwd(), 'shots');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

async function shoot(name, theme) {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle('dark', t === 'dark');
    localStorage.setItem('glowup:theme', t);
  }, theme);
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, `${name}-${theme}.png`) });
  console.log(`  ${name}-${theme}.png`);
}

try {
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.GLOWUP_DATA);

  for (const theme of ['dark', 'light']) {
    await shoot('today', theme);

    // Learn -> Sexual health -> a Big D article
    await page.click('nav button:has-text("Learn")');
    await page.waitForTimeout(600);
    await page.click('[role=tab]:has-text("Sexual health")');
    await page.waitForTimeout(700);
    await shoot('library', theme);

    await page.click('.row-card:has-text("Fertility")');
    await page.waitForTimeout(900);
    await shoot('article', theme);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // Fuel -> food table (the spec table styling)
    await page.click('nav button:has-text("Fuel")');
    await page.waitForTimeout(800);
    await shoot('fuel', theme);
  }
} finally {
  await browser.close();
}
console.log('shots written to ' + OUT);
