const { chromium } = require('playwright-core');
const BASE = 'http://127.0.0.1:' + (process.env.PORT || '8080');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errs = [], failed = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  p.on('requestfailed', r => failed.push(r.url().replace(BASE, '') + ' :: ' + (r.failure() || {}).errorText));
  p.on('response', r => { if (r.status() >= 400) failed.push(r.url().replace(BASE, '') + ' :: HTTP ' + r.status()); });

  /* start from a clean install so a stale service-worker cache can't mask a bug */
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister()));
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
  }).catch(() => {});
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);

  const boot = await p.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return {
      title: document.title,
      hero: document.querySelector('#view-home h1')?.textContent.trim(),
      lede: document.querySelector('#view-home .hero-lede')?.textContent.trim().slice(0, 60) + '…',
      images: document.images.length,
      imagesDecoded: [...document.images].every(i => i.complete && i.naturalWidth > 0),
      hooks: !!window.GLOWUP_COPY,
      counts: window.GLOWUP_DATA.meta.counts,
      sw: !!(reg && reg.active),
      caches: await caches.keys()
    };
  });

  const views = {};
  for (const v of ['learn', 'fuel', 'shop']) {
    await p.click(`[data-nav="${v}"]`); await p.waitForTimeout(400);
    views[v] = await p.evaluate(() => document.querySelectorAll('#view-' + (window.GLOWUP_STATE||{}).view + ' article, #view-' + (window.GLOWUP_STATE||{}).view + ' [data-product]').length).catch(() => null);
  }
  for (const v of ['plan', 'home']) {
    await p.click(`[data-nav="${v}"]`); await p.waitForTimeout(350);
    views[v] = await p.evaluate(() => document.querySelectorAll('#view-' + (window.GLOWUP_STATE||{}).view + ' .card').length).catch(() => null);
  }
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(250);
  await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(250);
  await p.locator('#articles-list [data-article]').first().click();
  await p.waitForSelector('#reader', { timeout: 4000 });
  const sheet = await p.evaluate(() => ({
    title: document.querySelector('#sheet-title')?.textContent.slice(0, 40),
    hook: document.querySelector('#sheet-body p.border-l-2')?.textContent.slice(0, 50),
    sentences: document.querySelectorAll('#reader-content .s').length,
    artLoaded: document.querySelector('.art-sheet')?.naturalWidth > 0
  }));
  await p.evaluate(() => document.querySelector('#sheet-close').click());

  // offline still works from cache
  await ctx.setOffline(true);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(2600);
  const offline = await p.evaluate(() => ({
    title: document.title,
    route: (location.hash || '#home').slice(1),
    rendered: [...document.querySelectorAll('[id^="view-"]')]
      .filter((v) => !v.hidden && v.offsetParent !== null)
      .some((v) => (v.innerHTML || '').length > 500),
    banner: !document.querySelector('#offline-banner')?.hidden
  }));
  await ctx.setOffline(false);

  console.log('BOOT   ', JSON.stringify(boot, null, 1));
  console.log('SHEET  ', JSON.stringify(sheet));
  console.log('OFFLINE', JSON.stringify(offline));
  console.log('failed requests:', failed.length ? failed : 'none');
  console.log('console/page errors:', errs.length ? errs : 'none');
  await b.close();
})();
