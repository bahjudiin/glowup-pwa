const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto('file:///home/user/glowup-standalone.html', { waitUntil: 'load' });
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(200);
  await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(250);
  await p.locator('#articles-list [data-article]').first().click();
  await p.waitForSelector('#reader'); await p.waitForTimeout(250);
  const before = await p.evaluate(() => {
    const sel = document.querySelector('#reader-voice');
    return {
      voices: sel ? sel.options.length : 0,
      first: sel ? sel.options[0].textContent : (document.querySelector('.reader-status') || {}).textContent,
      label: document.querySelector('#reader-play').textContent.trim()
    };
  });
  await p.evaluate(() => document.querySelector('#reader-play').click()); await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ label: document.querySelector('#reader-play').textContent.trim(), toast: document.querySelector('#toast')?.textContent.trim() }));
  // highlights still work with no speech engine
  await p.evaluate(() => {
    const s = document.querySelectorAll('#reader-content .s');
    const sel = window.getSelection(); sel.removeAllRanges();
    const r = document.createRange(); r.setStart(s[0].firstChild,0); r.setEnd(s[1].firstChild, 10);
    sel.addRange(r); document.dispatchEvent(new Event('selectionchange'));
  });
  await p.waitForTimeout(250);
  await p.evaluate(() => document.querySelector('#hl-fab').click()); await p.waitForTimeout(200);
  const hl = await p.evaluate(() => ({ marked: document.querySelectorAll('.s.hl').length, label: document.querySelector('#reader-hl').textContent.trim() }));
  console.log('NO-VOICE before:', before);
  console.log('NO-VOICE after click:', after);
  console.log('highlights without a speech engine:', hl);
  console.log('errors:', errs.length ? errs : 'none');
  await p.evaluate(() => localStorage.clear());
  await b.close();
})();
