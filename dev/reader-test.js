const { chromium } = require('playwright-core');
const { target } = require('./target');;

const MOCK = `
  (function () {
    const voices = [
      { name: 'Google US English', lang: 'en-US', voiceURI: 'g-us', localService: false, default: false },
      { name: 'Microsoft Guy - English (United States)', lang: 'en-US', voiceURI: 'ms-guy', localService: true },
      { name: 'Microsoft Aria Online (Natural) - English', lang: 'en-US', voiceURI: 'ms-aria', localService: false },
      { name: 'Daniel', lang: 'en-GB', voiceURI: 'dan', localService: true },
      { name: 'Ting-Ting', lang: 'zh-CN', voiceURI: 'zh', localService: true }
    ];
    const log = { spoken: [], cancelled: 0, paused: 0, resumed: 0, rates: [], usedVoices: [] };
    window.__tts = log;
    class Utt {
      constructor(text) { this.text = text; this.rate = 1; this.pitch = 1; this.lang = 'en'; }
    }
    window.SpeechSynthesisUtterance = Utt;
    const synth = {
      speaking: false, paused: false, _t: null,
      getVoices: () => voices,
      addEventListener: (ev, fn) => { if (ev === 'voiceschanged') setTimeout(fn, 10); },
      speak(u) {
        this.speaking = true;
        log.spoken.push(u.text.slice(0, 40));
        log.rates.push(u.rate);
        log.usedVoices.push(u.voice ? u.voice.name : 'auto');
        if (u.onstart) u.onstart();
        const dur = window.__ttsDelay || 25;
        this._t = setTimeout(() => { this.speaking = false; if (u.onend) u.onend(); }, dur);
      },
      cancel() { log.cancelled++; clearTimeout(this._t); this.speaking = false; this.paused = false; },
      pause() { log.paused++; this.paused = true; clearTimeout(this._t); },
      resume() { log.resumed++; this.paused = false; const self = this; clearTimeout(this._t); }
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  })();
`;

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.addInitScript(MOCK);
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });

  await p.goto(target(), { waitUntil: 'load' });
  await p.waitForTimeout(300);
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(200);
  await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(250);
  await p.locator('#articles-list [data-article]').first().click();
  await p.waitForSelector('#reader-voice', { timeout: 5000 });
  await p.waitForTimeout(200);

  // reader bar mounted?
  const bar = await p.evaluate(() => {
    const r = document.querySelector('#reader');
    return {
      mounted: !!r,
      sentences: document.querySelectorAll('#reader-content .s').length,
      playLabel: document.querySelector('#reader-play')?.textContent.trim(),
      voiceOptions: document.querySelectorAll('#reader-voice option').length,
      firstVoices: [...document.querySelectorAll('#reader-voice option')].slice(0,4).map(o => o.textContent.trim()),
      preselected: document.querySelector('#reader-voice').value,
      rate: document.querySelector('#reader-rate').value,
      hint: !!document.querySelector('.reader-hint')
    };
  });
  console.log('BAR', bar);

  // play a few sentences
  await p.click('#reader-play'); await p.waitForTimeout(260);
  const playing = await p.evaluate(() => ({
    state: document.querySelector('#reader-play').textContent.trim(),
    spoken: window.__tts.spoken.length,
    current: document.querySelector('.tts-current')?.textContent.slice(0, 40),
    counter: document.querySelector('#reader-count').textContent,
    voiceUsed: window.__tts.usedVoices[0]
  }));
  console.log('PLAYING', playing);

  await p.click('#reader-play'); await p.waitForTimeout(80);
  const paused = await p.evaluate(() => ({ label: document.querySelector('#reader-play').textContent.trim(), paused: window.__tts.paused }));
  await p.click('#reader-play'); await p.waitForTimeout(80);
  const resumed = await p.evaluate(() => ({ label: document.querySelector('#reader-play').textContent.trim(), resumed: window.__tts.resumed }));
  console.log('PAUSE/RESUME', paused, resumed);

  // rate change mid-flight
  await p.selectOption('#reader-rate', '1.3'); await p.waitForTimeout(120);
  const rate = await p.evaluate(() => ({ rates: [...new Set(window.__tts.rates)], spoken: window.__tts.spoken.length }));
  console.log('RATE', rate);

  await p.click('#reader-stop'); await p.waitForTimeout(80);
  const stopped = await p.evaluate(() => ({ label: document.querySelector('#reader-play').textContent.trim(), current: !!document.querySelector('.tts-current'), cancelled: window.__tts.cancelled }));
  console.log('STOPPED', stopped);

  // highlight a sentence by selecting text across spans
  await p.evaluate(() => {
    const spans = document.querySelectorAll('#reader-content .s');
    const sel = window.getSelection(); sel.removeAllRanges();
    const r = document.createRange();
    r.setStart(spans[2].firstChild, 0);
    r.setEnd(spans[4].firstChild, Math.min(12, spans[4].firstChild.length));
    sel.addRange(r);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await p.waitForTimeout(250);
  const fab = await p.evaluate(() => { const f = document.querySelector('#hl-fab'); return { visible: f && !f.hidden, text: f && f.textContent.trim() }; });
  await p.click('#hl-fab'); await p.waitForTimeout(200);
  const hl = await p.evaluate(() => ({
    marked: document.querySelectorAll('#reader-content .s.hl').length,
    countLabel: document.querySelector('#reader-hl').textContent.trim(),
    stored: JSON.parse(localStorage.getItem('glowup:hl:' + window.__openId) || 'null') || 'see-reload'
  }));
  console.log('FAB', fab, 'HIGHLIGHT', hl);

  // persistence across reload
  const id = await p.evaluate(() => document.querySelector('#reader-hl').getAttribute('data-article') || null);
  await p.screenshot({ path: 'docs/preview-reader.png' });

  // tap a highlighted sentence to remove it
  await p.evaluate(() => document.querySelector('#reader-content .s.hl').click()); await p.waitForTimeout(200);
  const after = await p.evaluate(() => ({ marked: document.querySelectorAll('#reader-content .s.hl').length, label: document.querySelector('#reader-hl').textContent.trim() }));
  console.log('AFTER TAP-REMOVE', after);

  // re-add two, check list panel + persistence across close/reopen
  await p.evaluate(() => {
    const spans = document.querySelectorAll('#reader-content .s');
    const sel = window.getSelection(); sel.removeAllRanges();
    const r = document.createRange();
    r.setStart(spans[6].firstChild, 0);
    r.setEnd(spans[7].firstChild, spans[7].firstChild.length);
    sel.addRange(r); document.dispatchEvent(new Event('selectionchange'));
  });
  await p.waitForTimeout(200); await p.click('#hl-fab'); await p.waitForTimeout(200);
  await p.evaluate(() => document.querySelector('#reader-hl').click()); await p.waitForTimeout(150);
  const list = await p.evaluate(() => ({ items: document.querySelectorAll('.hl-item').length, visible: !document.querySelector('#hl-list').hidden }));
  console.log('HL PANEL', list);
  await p.evaluate(() => document.querySelector('#sheet-close').click()); await p.waitForTimeout(250);
  const fabGone = await p.evaluate(() => document.querySelector('#hl-fab').hidden);
  console.log('fab hidden after close:', fabGone);

  // reopen same article -> highlights restored
  await p.locator('#articles-list [data-article]').first().click();
  await p.waitForSelector('#reader-voice', { timeout: 5000 });
  await p.waitForTimeout(200);
  const restored = await p.evaluate(() => ({ marked: document.querySelectorAll('#reader-content .s.hl').length, label: document.querySelector('#reader-hl').textContent.trim() }));
  console.log('RESTORED', restored);

  console.log('errors:', errs.length ? errs : 'none');
  await p.evaluate(() => localStorage.clear());
  await b.close();
})();
