const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
  for (const w of [320, 360, 390, 430]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto('file:///home/user/glowup-standalone.html', { waitUntil: 'load' });
    await p.click('[data-nav="learn"]'); await p.waitForTimeout(180);
    await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(220);
    await p.locator('#articles-list [data-article]').first().click();
    await p.waitForSelector('#reader');
    await p.waitForTimeout(150);
    const r = await p.evaluate(() => {
      const bar = document.querySelector('#reader');
      const row = document.querySelector('.reader-row');
      return { barW: bar.clientWidth, rowScroll: row.scrollWidth, rowClient: row.clientWidth,
               docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    console.log(w, JSON.stringify(r), r.rowScroll > r.rowClient + 1 ? '<-- ROW OVERFLOW' : 'ok');
    if (w === 320) await p.screenshot({ path: 'docs/preview-reader-320.png' });
    await p.close();
  }
  await b.close();
})();
