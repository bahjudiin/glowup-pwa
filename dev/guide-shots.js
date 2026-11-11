/* Screenshots of all six guide pages, top of page + one mid-page table. */
const { chromium } = require('playwright-core');
const { target } = require('./target');;
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(target(), { waitUntil: 'load' });
  await p.waitForTimeout(600);
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(300);
  await p.click('[data-subnav="guides"]:visible'); await p.waitForTimeout(250);
  for (const id of ['fasting', 'refeed', 'insulin', 'baseline', 'antiaging', 'younger']) {
    await p.evaluate(() => scrollTo(0, 0));
    await p.click(`.subtab[data-tab="${id}"]`);
    await p.waitForTimeout(420);
    await p.screenshot({ path: `docs/guide-${id}.jpg`, type: 'jpeg', quality: 82 });
  }
  // mid-page: the diabetes remission table
  await p.click('.subtab[data-tab="insulin"]'); await p.waitForTimeout(350);
  const y = await p.evaluate(() => {
    const t = [...document.querySelectorAll('#view-guides table')].pop();
    return Math.round(t.getBoundingClientRect().top + scrollY - 190);
  });
  await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(300);
  await p.screenshot({ path: 'docs/guide-insulin-table.jpg', type: 'jpeg', quality: 82 });
  await b.close();
})();
