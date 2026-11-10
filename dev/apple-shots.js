/* Round-6 visual QA: capture every primary surface at 390×844 @2x from the
   standalone build (identical CSS/JS/data to the hosted one). */
const { chromium } = require('playwright-core');
const SHOT = { path: 'docs/', type: 'jpeg', quality: 82 };
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/user/glowup-standalone.html', { waitUntil: 'load' });
  await p.waitForTimeout(700);

  // home — viewport + full page
  await p.screenshot({ ...SHOT, path: 'docs/apple-home.jpg' });
  await p.screenshot({ ...SHOT, path: 'docs/apple-home-full.jpg', fullPage: true });

  // light mode home
  await p.click('#theme-toggle'); await p.waitForTimeout(350);
  await p.screenshot({ ...SHOT, path: 'docs/apple-home-light.jpg' });
  await p.click('#theme-toggle'); await p.waitForTimeout(350);

  // articles list
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(400);
  await p.screenshot({ ...SHOT, path: 'docs/apple-articles.jpg' });

  // article sheet
  await p.click('#view-articles [data-article]'); await p.waitForTimeout(600);
  await p.screenshot({ ...SHOT, path: 'docs/apple-article.jpg' });
  await p.click('#sheet-close'); await p.waitForTimeout(250);

  // food + a filtered group photo
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(400);
  await p.screenshot({ ...SHOT, path: 'docs/apple-food.jpg' });
  const proteinChip = await p.$('[data-group="protein"], [data-chip="protein"]');
  if (proteinChip) { await proteinChip.click(); await p.waitForTimeout(400); }
  const art = await p.evaluate(() => {
    const im = document.querySelector('#view-food .art-sheet');
    return im ? { w: im.naturalWidth, h: im.naturalHeight } : null;
  });

  // products — buy list, then the supplement ledger
  await p.click('[data-nav="shop"]'); await p.waitForTimeout(400);
  await p.screenshot({ ...SHOT, path: 'docs/apple-products.jpg' });
  await p.click('[data-mode="ledger"]'); await p.waitForTimeout(400);
  await p.screenshot({ ...SHOT, path: 'docs/apple-ledger.jpg' });
  await p.click('[data-mode="list"]'); await p.waitForTimeout(300);

  // meals
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(400);
  await p.screenshot({ ...SHOT, path: 'docs/apple-meals.jpg' });

  // search overlay
  await p.click('#search-open'); await p.fill('#search-input', 'creatine');
  await p.waitForTimeout(400);
  await p.screenshot({ ...SHOT, path: 'docs/apple-search.jpg' });
  await p.click('#search-close');
  await p.waitForTimeout(200);

  // food table view
  await p.click('[data-nav="fuel"]'); await p.waitForTimeout(300);
  await p.click('[data-mode="table"]'); await p.waitForTimeout(350);
  await p.screenshot({ ...SHOT, path: 'docs/apple-food-table.jpg' });
  await p.click('[data-mode="cards"]');

  const audit = await p.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return {
      imgs: imgs.length,
      broken: imgs.filter((i) => !i.naturalWidth).length,
      minSquare: Math.min(...imgs.filter((i) => i.classList.contains('art-square')).map((i) => i.naturalWidth)),
      squareCount: imgs.filter((i) => i.classList.contains('art-square')).length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      fonts: getComputedStyle(document.body).fontFamily.slice(0, 60),
      radius: getComputedStyle(document.documentElement).getPropertyValue('--radius').trim()
    };
  });
  console.log({ foodGroupArt: art, ...audit, errors: errs.length ? errs : 'none' });
  await b.close();
})();
