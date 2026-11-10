const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const errs = [];
  for (const [label, url, w] of [['standalone-file','file:///home/user/glowup-standalone.html',390], ['hosted','http://127.0.0.1:8080/index.html',390]]) {
    const p = await b.newPage({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2 });
    p.on('pageerror', e => errs.push(label + ' PAGEERROR ' + e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push(label + ' CONSOLE ' + m.text()); });
    const reqs = [];
    p.on('request', r => { if (!/^(file|data):/.test(r.url()) && !r.url().startsWith('http://127.0.0.1')) reqs.push(r.url().slice(0,60)); });
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(700);
    const home = await p.evaluate(() => {
      const imgs = [...document.images];
      return {
        images: imgs.length,
        allDecoded: imgs.every(i => i.complete && i.naturalWidth > 0),
        hero: document.querySelector('.art-hero') ? document.querySelector('.art-hero').naturalWidth : null,
        thumbs: document.querySelectorAll('.art-thumb').length,
        dataUris: imgs.every(i => i.src.startsWith('data:'))
      };
    });
    await p.click('[data-nav="learn"]'); await p.waitForTimeout(300);
    await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(250);
    const art = await p.evaluate(() => ({ banner: !!document.querySelector('#view-articles .art-banner'), src: document.querySelector('#view-articles .art-banner')?.src.slice(0, 30) }));
    await p.click('[data-nav="fuel"]'); await p.waitForTimeout(250);
    const food = await p.evaluate(() => !!document.querySelector('#view-food .art-banner'));
    await p.click('[data-nav="shop"]'); await p.waitForTimeout(250);
    const prods = await p.evaluate(() => !!document.querySelector('#view-products .art-banner'));
    await p.click('[data-nav="fuel"]'); await p.waitForTimeout(250);
    const meals = await p.evaluate(() => !!document.querySelector('#view-meals .art-banner'));
    await p.click('[data-nav="learn"]'); await p.waitForTimeout(200);
    await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(300);
    await p.locator('#articles-list [data-article]').first().click();
    await p.waitForSelector('#reader'); await p.waitForTimeout(300);
    const sheet = await p.evaluate(() => ({ art: !!document.querySelector('.art-sheet'), w: document.querySelector('.art-sheet')?.naturalWidth }));
    console.log(label, JSON.stringify({ home, articles: art, food, prods, meals, sheet }), 'extReqs:', reqs.length ? reqs : 'none');
    await p.close();
  }
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})();
