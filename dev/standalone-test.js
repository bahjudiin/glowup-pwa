const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errs = [], reqs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  p.on('request', r => { if (!r.url().startsWith('file://')) reqs.push(r.url().slice(0,80)); });

  await p.goto('file:///home/user/glowup-standalone.html', { waitUntil: 'load' });
  await p.waitForTimeout(600);

  const boot = await p.evaluate(() => ({
    title: document.title,
    standalone: window.GLOWUP_STANDALONE === true,
    counts: window.GLOWUP_DATA.meta.counts,
    heroText: document.querySelector('#view-home h1')?.textContent,
    cssApplied: getComputedStyle(document.body).backgroundColor,
    dark: document.documentElement.classList.contains('dark'),
    swSkipped: !navigator.serviceWorker || !navigator.serviceWorker.controller,
    ls: (() => { try { localStorage.setItem('t','1'); localStorage.removeItem('t'); return 'ok'; } catch (e) { return 'BLOCKED: ' + e.name; } })()
  }));
  console.log('BOOT', JSON.stringify(boot, null, 1));

  // interactions
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(250);
  await p.click('[data-subnav="guides"]:visible'); await p.waitForTimeout(250);
  const articles = await p.evaluate(() => document.querySelectorAll('#articles-list article').length);
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(200);
  const foods = await p.evaluate(() => document.querySelectorAll('#view-food article, #view-food .card').length);
  await p.click('[data-nav="shop"]'); await p.waitForTimeout(200);
  const prods = await p.evaluate(() => document.querySelectorAll('#view-products [data-product]').length);
  await p.click('[data-product]'); await p.waitForTimeout(300);
  const sheet = await p.evaluate(() => !document.querySelector('#sheet').hidden && document.querySelector('#sheet-title').textContent.slice(0,40));
  await p.click('#sheet-close');
  await p.click('#search-open'); await p.fill('#search-input','sleep'); await p.waitForTimeout(300);
  const search = await p.evaluate(() => document.querySelector('#search-status').textContent);
  await p.click('#search-close');
  // theme toggle + persistence across reload
  await p.click('[data-nav="home"]');
  await p.click('#theme-toggle');
  const th1 = await p.evaluate(() => document.documentElement.classList.contains('dark'));
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(400);
  const th2 = await p.evaluate(() => document.documentElement.classList.contains('dark'));
  // shopping persistence
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(200);
  await p.click('[data-subnav="meals"]:visible'); await p.waitForTimeout(250);
  await p.click('.shop-item'); await p.waitForTimeout(200);
  const label = await p.evaluate(() => { const h=[...document.querySelectorAll('h2')].find(x=>/shopping/i.test(x.textContent)); return h.parentElement.textContent.replace(/\s+/g,' ').trim(); });
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(400);
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(200);
  await p.click('[data-subnav="meals"]:visible'); await p.waitForTimeout(250);
  const label2 = await p.evaluate(() => { const h=[...document.querySelectorAll('h2')].find(x=>/shopping/i.test(x.textContent)); return h.parentElement.textContent.replace(/\s+/g,' ').trim(); });

  console.log({ articles, foods, prods, sheet, search, themeToggle: th1, themePersisted: th2, shopping: label, shoppingAfterReload: label2 });
  console.log('external requests:', reqs.length ? reqs : 'none');
  console.log('errors:', errs.length ? errs : 'none');
  await p.evaluate(() => localStorage.clear());
  await b.close();
})();
