/* Round 9 QA — five-tab shell, Today dashboard, Blueprint progress, filters.
   Checks every view at six widths for overflow, plus persistence + interactions. */
const { chromium } = require('playwright-core');
const APP = 'file:///home/user/glowup-standalone.html';
const VIEWS = ['home', 'plan', 'guides', 'articles', 'food', 'meals', 'products'];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const out = { responsive: {}, flows: {}, errors: [] };

  /* ---------- 1. every view at every width ---------- */
  for (const [w, h] of [[320, 800], [360, 800], [375, 812], [390, 844], [430, 932], [768, 1024], [1280, 900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => out.errors.push(`${w}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error') out.errors.push(`${w}: ${m.text()}`); });
    await p.goto(APP, { waitUntil: 'load' });
    await p.waitForTimeout(350);
    const row = {};
    for (const v of VIEWS) {
      await p.evaluate((view) => { location.hash = '#' + view; }, v);
      await p.waitForTimeout(180);
      await p.evaluate((view) => {
        const nav = document.querySelector('[data-nav="' + ({ guides: 'learn', articles: 'learn', food: 'fuel', meals: 'fuel', products: 'shop' }[view] || view) + '"]');
        if (nav) nav.click();
        const seg = document.querySelector('[data-subnav="' + view + '"]');
        if (seg) seg.click();
      }, v);
      await p.waitForTimeout(220);
      row[v] = await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        nodes: document.querySelectorAll('#view-' + (window.GLOWUP_STATE||{}).view + ' *').length,
        tabbarFits: (() => {
          const items = [...document.querySelectorAll('.tabbar-item')];
          return items.length === 5 && items.every(i => i.scrollWidth <= i.clientWidth + 1);
        })(),
        clipped: [...document.querySelectorAll('#view-' + (window.GLOWUP_STATE||{}).view + ' .row-title, #view-' + (window.GLOWUP_STATE||{}).view + ' .tile-title')]
          .filter(n => n.scrollWidth > n.clientWidth + 2).length,
      }));
    }
    out.responsive[w] = row;
    await p.close();
  }

  /* ---------- 2. flows at 390 ---------- */
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', e => out.errors.push('flow: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') out.errors.push('flow: ' + m.text()); });
  await p.goto(APP, { waitUntil: 'load' });
  await p.waitForTimeout(400);

  /* today: tick 3 checks, ring + bar must move, survives reload */
  await p.click('[data-check="protein"]');
  await p.click('[data-check="steps"]');
  await p.click('[data-check="sleep"]');
  await p.waitForTimeout(250);
  out.flows.today = await p.evaluate(() => ({
    done: document.querySelectorAll('#view-home .check-row[data-done="true"]').length,
    ring: document.querySelector('#view-home .progress-ring').style.getPropertyValue('--p'),
    counter: document.querySelector('#view-home .sec-note').textContent,
  }));
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(450);
  out.flows.todayAfterReload = await p.evaluate(() =>
    document.querySelectorAll('#view-home .check-row[data-done="true"]').length);

  /* plan: tick a step, switch phase, check progress % moves */
  await p.click('[data-nav="plan"]'); await p.waitForTimeout(350);
  await p.click('#view-plan .plan-step'); await p.waitForTimeout(250);
  out.flows.planStep = await p.evaluate(() => ({
    done: document.querySelectorAll('#view-plan .plan-step[data-done="true"]').length,
    pct: document.querySelector('#view-plan .card .text-lg')?.textContent,
    overview: document.querySelector('#view-plan .card p')?.textContent,
  }));
  await p.click('[data-phase="2"]'); await p.waitForTimeout(300);
  out.flows.phase3 = await p.evaluate(() => ({
    title: document.querySelectorAll('#view-plan h2')[0]?.textContent,
    active: document.querySelector('.step-chip[aria-current="true"]')?.textContent.trim(),
  }));
  await p.click('[data-phase="0"]'); await p.waitForTimeout(250);

  /* shop: budget + sort filters run on real data */
  await p.click('[data-nav="shop"]'); await p.waitForTimeout(350);
  const all = await p.evaluate(() => document.querySelectorAll('#view-products [data-product]').length);
  await p.click('[data-budget="0-15"]'); await p.waitForTimeout(250);
  const budget = await p.evaluate(() => document.querySelectorAll('#view-products [data-product]').length);
  await p.click('[data-budget="all"]'); await p.waitForTimeout(200);
  await p.click('[data-seg="az"]'); await p.waitForTimeout(250);
  const firstAz = await p.evaluate(() => document.querySelector('#view-products .row-title')?.textContent);
  out.flows.shop = { all, budget, firstAz };

  /* learn: grade chips + article sheet + reader */
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(250);
  await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(300);
  await p.click('[data-grade="High"]'); await p.waitForTimeout(300);
  out.flows.gradeFilter = await p.evaluate(() => document.querySelectorAll('#articles-list [data-article]').length);
  await p.locator('#articles-list [data-article]').first().click();
  await p.waitForSelector('#reader', { timeout: 5000 });
  out.flows.reader = await p.evaluate(() => document.querySelectorAll('#reader-content .s').length);
  await p.click('#sheet-close'); await p.waitForTimeout(250);

  /* fuel: table mode toggle */
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(300);
  await p.click('#food-mode-toggle'); await p.waitForTimeout(300);
  out.flows.foodTable = await p.evaluate(() => !!document.querySelector('#view-food table'));
  await p.click('#food-mode-toggle'); await p.waitForTimeout(250);

  /* back button + hash routing */
  await p.evaluate(() => { location.hash = '#plan'; });
  await p.waitForTimeout(250);
  out.flows.hash = await p.evaluate(() => (window.GLOWUP_STATE||{}).view);

  await p.evaluate(() => localStorage.clear());
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
