const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto('http://127.0.0.1:' + (process.env.PORT || '8080') + '/index.html', { waitUntil: 'networkidle' });

  // service worker + cache
  await p.waitForTimeout(1200);
  const sw = await p.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    const keys = await caches.keys();
    const c = await caches.open(keys[0] || 'none');
    const reqs = await c.keys();
    return { scope: reg && reg.scope, active: !!(reg && reg.active), caches: keys, cached: reqs.length,
             manifest: (await fetch('manifest.webmanifest')).ok };
  });
  console.log('SW:', sw);

  // offline reload
  await ctx.setOffline(true);
  const offline = await p.reload({ waitUntil: 'domcontentloaded' }).then(async () => {
    await p.waitForTimeout(700);
    return await p.evaluate(() => ({
      title: document.title,
      articlesRendered: !!document.querySelector('#view-home').innerHTML.length,
      banner: !document.querySelector('#offline-banner').classList.contains('hidden')
    }));
  }).catch(e => 'RELOAD FAILED: ' + e.message);
  console.log('offline:', offline);
  await ctx.setOffline(false);

  // theme persistence
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('#theme-toggle');
  const t1 = await p.evaluate(() => document.documentElement.classList.contains('dark'));
  await p.reload({ waitUntil: 'networkidle' });
  const t2 = await p.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log('theme toggle ->', t1, 'persisted after reload ->', t2);

  // shopping list persistence
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(200);
  await p.click('[data-subnav="meals"]:visible'); await p.waitForTimeout(250);
  await p.evaluate(() => document.querySelector('.shop-item').click());
  const checked1 = await p.evaluate(() => JSON.parse(localStorage.getItem('glowup:shopping') || '{}'));
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(200);
  await p.click('[data-subnav="meals"]:visible'); await p.waitForTimeout(250);
  const checked2 = await p.evaluate(() => document.querySelector('.shop-item').checked);
  console.log('shopping saved:', Object.keys(checked1).length, 'persisted checkbox:', checked2);

  // search + filters + deep counts
  await p.click('#search-open');
  await p.fill('#search-input', 'creatine');
  await p.waitForTimeout(300);
  const res = await p.evaluate(() => ({
    status: document.querySelector('#search-status').textContent,
    groups: [...document.querySelectorAll('#search-results p')].map(n => n.textContent)
  }));
  console.log('search:', res);
  await p.click('#search-close');
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(250);
  await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(250);
  const counts = await p.evaluate(() => ({
    cards: document.querySelectorAll('#articles-list article').length,
    chips: document.querySelectorAll('[data-chip]').length,
    segs: document.querySelectorAll('[data-seg]').length
  }));
  console.log('articles view:', counts);
  await p.click('[data-grade="High"]');
  await p.waitForTimeout(200);
  console.log('after grade=High filter:', await p.evaluate(() => document.querySelectorAll('#articles-list article').length));
  await p.click('[data-nav="shop"]');
  await p.waitForTimeout(200);
  console.log('products listed:', await p.evaluate(() => document.querySelectorAll('#view-products [data-product]').length));
  await p.click('#verified-toggle'); await p.waitForTimeout(150);
  console.log('verified only:', await p.evaluate(() => document.querySelectorAll('#view-products [data-product]').length));

  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})();
