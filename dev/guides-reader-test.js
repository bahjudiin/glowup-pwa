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


/* Guides reader QA: listen bar on every guide page, narration, highlighting,
   persistence per page, and no cross-talk with the article reader. */
const { chromium } = require('playwright-core');
const { target } = require('./target');;
const APP = target();

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.addInitScript(MOCK);
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });

  await p.goto(APP, { waitUntil: 'load' });
  await p.waitForTimeout(400);
  await p.click('[data-nav="learn"]');
  await p.click('[data-subnav="guides"]:visible'); await p.waitForTimeout(250);
  await p.waitForSelector('#guide-reader #reader-play', { timeout: 5000 });
  await p.waitForTimeout(200);

  const per = {};
  for (const id of ['fasting', 'refeed', 'insulin', 'baseline', 'antiaging', 'younger']) {
    await p.click(`.subtab[data-tab="${id}"]`);
    await p.waitForTimeout(220);
    per[id] = await p.evaluate(() => ({
      bar: !!document.querySelector('#guide-reader #reader'),
      sentences: document.querySelectorAll('#guide-content .s').length,
      tablesSkipped: document.querySelectorAll('#guide-content table .s').length === 0,
      refsSkipped: document.querySelectorAll('ol[data-noread] .s').length === 0,
      firstSentence: (document.querySelector('#guide-content .s') || {}).textContent?.trim().slice(0, 60),
      voiceOptions: document.querySelectorAll('#reader-voice option').length,
    }));
  }

  /* narration on the fasting page */
  await p.click('.subtab[data-tab="fasting"]');
  await p.waitForTimeout(250);
  await p.click('#reader-play');
  await p.waitForTimeout(260);
  const playing = await p.evaluate(() => ({
    spoken: window.__tts.spoken.length,
    first: window.__tts.spoken[0],
    countsUp: (document.querySelector('#reader-count') || {}).textContent,
    current: document.querySelectorAll('#guide-content .tts-current').length,
    label: document.querySelector('#reader-play').textContent.trim(),
  }));
  await p.click('#reader-play');                       // pause
  await p.waitForTimeout(150);
  const paused = await p.evaluate(() => ({
    paused: window.__tts.paused, label: document.querySelector('#reader-play').textContent.trim() }));
  await p.click('#reader-stop');
  await p.waitForTimeout(150);
  const stopped = await p.evaluate(() => ({
    current: document.querySelectorAll('#guide-content .tts-current').length,
    label: document.querySelector('#reader-play').textContent.trim() }));

  /* highlight a sentence via selection */
  const hl = await p.evaluate(() => {
    const s = document.querySelectorAll('#guide-content .s')[2];
    const r = document.createRange(); r.selectNodeContents(s);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    return s.textContent.trim().slice(0, 40);
  });
  await p.evaluate(() => {
    const s = document.querySelectorAll('#guide-content .s')[2];
    s.dispatchEvent(new Event('selectionchange', { bubbles: true }));
  });
  await p.evaluate(() => document.dispatchEvent(new MouseEvent('selectionchange', { bubbles: true })));
  // the app listens for selectionchange/pointerup; drive the FAB directly
  await p.evaluate(() => {
    window.dispatchEvent(new Event('selectionchange'));
  });
  await p.waitForTimeout(120);

  /* highlight FAB appears on selection, marks the sentence, and survives a tab switch */
  await p.waitForTimeout(400);
  const fab = await p.evaluate(() => {
    const btn = document.querySelector('#hl-fab');
    return { visibleFab: !!btn && !btn.hidden, fabLabel: btn ? btn.textContent : null };
  });
  if (fab.visibleFab) { await p.click('#hl-fab'); await p.waitForTimeout(250); }
  const afterHl = await p.evaluate(() => ({
    highlighted: document.querySelectorAll('#guide-content .s.hl').length,
    count: (document.querySelector('#reader-hl') || {}).textContent.trim(),
    stored: Object.keys(localStorage).filter(k => k.indexOf('glowup:hl.guide:') === 0).map(k => k + '=' + localStorage[k]),
  }));
  await p.click('.subtab[data-tab="refeed"]'); await p.waitForTimeout(250);
  await p.click('.subtab[data-tab="fasting"]'); await p.waitForTimeout(320);
  const persist = await p.evaluate(() => ({
    highlightedAfterReturn: document.querySelectorAll('#guide-content .s.hl').length,
    count: (document.querySelector('#reader-hl') || {}).textContent.trim(),
  }));

  /* open an article from the guide, then come back: no duplicate ids, reader still alive */
  await p.click('#view-guides [data-article]');
  await p.waitForTimeout(400);
  const inSheet = await p.evaluate(() => ({
    readers: document.querySelectorAll('#reader').length,
    plays: document.querySelectorAll('#reader-play').length,
    sheetOpen: !document.querySelector('#sheet').hidden,
  }));
  await p.click('#sheet-close');
  await p.waitForTimeout(450);
  const back = await p.evaluate(() => ({
    readers: document.querySelectorAll('#reader').length,
    bar: !!document.querySelector('#guide-reader #reader-play'),
    highlighted: document.querySelectorAll('#guide-content .s.hl').length,
    count: (document.querySelector('#reader-hl') || {}).textContent.trim(),
  }));

  await b.close();
  console.log(JSON.stringify({ per, playing, paused, stopped, hlText: hl, fab, afterHl, persist,
    inSheet, back, per, playing, paused, stopped, hlText: hl, fab, afterHl, persist,
    errors: errs.length ? errs : 'none' }, null, 1));
})();
