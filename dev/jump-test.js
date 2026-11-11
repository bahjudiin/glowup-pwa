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

/* Tap-to-skip QA: clicking a sentence (or the blank part of a paragraph)
   moves narration there, on guides and on articles. */
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.addInitScript('const x=1;');
  await p.addInitScript(MOCK);
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });

  await p.goto(target(), { waitUntil: 'load' });
  await p.waitForTimeout(400);
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.__ttsDelay = 1500; });
  await p.click('[data-nav="learn"]');
  await p.click('[data-subnav="guides"]:visible'); await p.waitForTimeout(250);
  await p.waitForSelector('#guide-reader #reader-play');
  await p.waitForTimeout(250);

  /* 1. idle tap must not start audio */
  await p.evaluate(() => document.querySelectorAll('#guide-content .s')[5].click());
  await p.waitForTimeout(200);
  const idleTap = await p.evaluate(() => ({
    label: document.querySelector('#reader-play').textContent.trim(),
    spoken: window.__tts.spoken.length,
    player: document.querySelector('#guide-player').hidden,
  }));

  /* 2. start reading, then tap a far sentence */
  await p.click('#reader-play');
  await p.waitForTimeout(400);
  const targetInfo = await p.evaluate(() => {
    const s = document.querySelectorAll('#guide-content .s')[24];
    return { text: s.textContent.replace(/\s+/g, ' ').trim().slice(0, 40), idx: 24 };
  });
  await p.evaluate(() => document.querySelectorAll('#guide-content .s')[24].click());
  await p.waitForTimeout(350);
  const tapJump = await p.evaluate(() => ({
    count: document.querySelector('#reader-count').textContent,
    spokenLast: window.__tts.spoken[window.__tts.spoken.length - 1],
    current: (document.querySelector('#guide-content .tts-current') || {}).textContent?.replace(/\s+/g, ' ').trim().slice(0, 40),
    state: document.querySelector('#gp-toggle').textContent.trim(),
  }));

  /* 3. next / prev buttons */
  await p.click('#gp-next'); await p.waitForTimeout(300);
  const next = await p.evaluate(() => document.querySelector('#reader-count').textContent);
  await p.click('#gp-prev'); await p.click('#gp-prev'); await p.waitForTimeout(300);
  const prev = await p.evaluate(() => document.querySelector('#reader-count').textContent);

  /* 4. tapping the blank area of a paragraph jumps to its first sentence */
  const paraTap = await p.evaluate(() => {
    const para = [...document.querySelectorAll('#guide-content p')].find(x => x.querySelectorAll('.s').length > 2);
    const before = document.querySelector('#reader-count').textContent;
    const idxOf = el => [...document.querySelectorAll('#guide-content .s')].indexOf(el);
    const want = idxOf(para.querySelector('.s'));
    para.click();                                   // target is the <p> itself, not a span
    return { before, wantSentence: want + 1, firstSentence: para.querySelector('.s').textContent.trim().slice(0, 30) };
  });
  await p.waitForTimeout(300);
  paraTap.after = await p.evaluate(() => document.querySelector('#reader-count').textContent);

  /* 5. a citation link inside the text is not a jump target */
  const linkTap = await p.evaluate(() => {
    const a = document.querySelector('#guide-content a.cite') || document.querySelector('#guide-content sup');
    if (!a) return { skipped: 'no link on this page' };
    const before = document.querySelector('#reader-count').textContent;
    return { before };
  });
  if (!linkTap.skipped && linkTap.before) {
    await p.evaluate(() => { window.__block = true; });
    const a = await p.$('#guide-content a.cite');
    if (a) { await a.click({ force: true, noWaitAfter: true }).catch(() => {}); await p.waitForTimeout(250); }
    linkTap.after = await p.evaluate(() => document.querySelector('#reader-count').textContent);
  }

  /* 6. same behaviour in an article sheet */
  await p.click('#gp-stop'); await p.waitForTimeout(150);
  await p.click('[data-nav="learn"]'); await p.waitForTimeout(250);
  await p.click('[data-subnav="articles"]:visible'); await p.waitForTimeout(250);
  await p.locator('#articles-list [data-article]').first().click();
  await p.waitForSelector('#reader-play');
  await p.waitForTimeout(250);
  await p.click('#reader-play'); await p.waitForTimeout(350);
  await p.evaluate(() => document.querySelectorAll('#reader-content .s')[9].click());
  await p.waitForTimeout(300);
  const articleTap = await p.evaluate(() => ({
    count: document.querySelector('#reader-count').textContent,
    current: !!document.querySelector('#reader-content .tts-current'),
    spokenLast: window.__tts.spoken[window.__tts.spoken.length - 1],
  }));

  await b.close();
  console.log(JSON.stringify({ idleTap, target: targetInfo, tapJump, next, prev, paraTap, linkTap, articleTap,
    errors: errs.length ? errs : 'none' }, null, 1));
})();
