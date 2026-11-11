/* Round-8 QA: the six guide pages must render, link every citation, show their
   images, and stay inside 390 px with no console errors. */
const { chromium } = require('playwright-core');
const { target } = require('./target');;
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(target(), { waitUntil: 'load' });
  await p.waitForTimeout(700);

  await p.click('[data-nav="learn"]');
  await p.click('[data-subnav="guides"]:visible'); await p.waitForTimeout(250);
  await p.waitForTimeout(500);

  const tabs = await p.$$eval('.subtab', (n) => n.map((x) => x.textContent.trim()));
  const pages = {};
  for (const id of ['fasting', 'refeed', 'insulin', 'baseline', 'antiaging', 'younger']) {
    await p.click(`.subtab[data-tab="${id}"]`);
    await p.waitForTimeout(350);
    pages[id] = await p.evaluate(() => {
      const v = document.querySelector('#view-guides');
      const imgs = [...v.querySelectorAll('img')];
      return {
        h1: v.querySelector('h1')?.textContent.trim(),
        words: v.innerText.split(/\s+/).filter(Boolean).length,
        tables: v.querySelectorAll('.guide-table').length,
        cites: v.querySelectorAll('a.cite').length,
        deadCites: [...v.querySelectorAll('a.cite')].filter((a) => !/^https:\/\/pubmed/.test(a.href)).length,
        refs: v.querySelectorAll('ol li a[href*="pubmed"]').length,
        imgs: imgs.length,
        brokenImgs: imgs.filter((i) => !i.naturalWidth).length,
        callouts: v.querySelectorAll('.callout').length,
        doCards: v.querySelectorAll('.do-card').length,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        selected: v.querySelector('.subtab[aria-selected="true"]')?.dataset.tab,
      };
    });
    if (['insulin', 'younger'].includes(id)) {
      await p.screenshot({ path: `docs/guide-${id}.jpg`, type: 'jpeg', quality: 82, fullPage: false });
    }
  }
  // sticky sub-tabs still usable after scrolling
  await p.click('.subtab[data-tab="insulin"]');
  await p.waitForTimeout(300);
  await p.evaluate(() => window.scrollTo(0, 1400));
  await p.waitForTimeout(400);
  const stickyTop = await p.evaluate(() => Math.round(document.querySelector('.subtabs').getBoundingClientRect().top));

  // a citation opens a real PubMed page (host check, no navigation)
  const firstCite = await p.evaluate(() => document.querySelector('#view-guides a.cite')?.href);

  console.log(JSON.stringify({ tabs, pages, stickyTop, firstCite, errors: errs.length ? errs : 'none' }, null, 1));
  await b.close();
})();
