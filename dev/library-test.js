/* Round-11 QA: the merged Library (4 sections × sub-tabs) renders, the reader
   mounts on every topic, links resolve, and nothing overflows on a phone.
   Usage: node dev/library-test.js [http://127.0.0.1:8080 | file://<repo>/dist/glowup-standalone.html] */
const { chromium } = require('playwright-core');
const URL_ARG = process.argv[2] || 'http://127.0.0.1:8080/index.html';
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  /* headless chromium ships no speech voices: install a tiny mock engine
     before the app boots so the reader path can be exercised */
  await ctx.addInitScript(() => {
    const voices = [{ name: 'Mock English', lang: 'en-US', default: true, localService: true, voiceURI: 'mock' }];
    const fake = {
      getVoices: () => voices,
      speak: (u) => {
        try { u.onstart && u.onstart(); } catch (e) {}
        setTimeout(() => { try { u.onend && u.onend(); } catch (e) {} }, 90);
      },
      cancel: () => {}, pause: () => {}, resume: () => {},
      speaking: false, paused: false, pending: false, onvoiceschanged: null,
      addEventListener: () => {}, removeEventListener: () => {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
    window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; this.voice = null; this.lang = 'en-US'; this.rate = 1; } };
  });
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(URL_ARG, { waitUntil: 'load' });
  await p.evaluate(async () => {
    try {
      if (location.protocol.startsWith('http') && 'serviceWorker' in navigator) {
        const rs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(rs.map((r) => r.unregister()));
      }
      if (window.caches) { const ks = await caches.keys(); await Promise.all(ks.map((k) => caches.delete(k))); }
    } catch (e) {}
  });
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(600);

  await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  const out = { url: URL_ARG, sections: {}, errors: errs, problems: [] };
  const nav = async (name) => {
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(120);
    await p.click(`[data-nav="${name}"]`);
    await p.waitForTimeout(300);
  };
  /* Real pointer clicks where possible; near the end of a short page the fixed
     tab bar covers the target, so fall back to a synthetic click there. */
  const tap = async (sel) => {
    await p.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'center', behavior: 'instant' }); }, sel);
    await p.waitForTimeout(140);
    try {
      await p.click(sel, { timeout: 2500 });
    } catch (e) {
      await p.evaluate((s) => document.querySelector(s).click(), sel);
    }
    await p.waitForTimeout(260);
  };

  await nav('learn');

  const tabs = await p.$$eval('.lib-tab', (n) => n.map((x) => x.textContent.trim()));
  out.tabs = tabs;
  if (tabs.length !== 4) out.problems.push(`expected 4 section tabs, got ${tabs.length}`);

  const secs = await p.$$eval('.lib-tab', (n) => n.map((x) => x.dataset.section));
  for (const id of secs) {
    await tap(`.lib-tab[data-section="${id}"]`);
    const topics = await p.$$eval('.subtab[data-topic]', (n) => n.map((x) => x.dataset.topic));
    const pages = {};
    for (const t of topics) {
      await tap(`.subtab[data-topic="${t}"]`);
      pages[t] = await p.evaluate(() => {
        const v = document.querySelector('#view-library');
        const links = [...v.querySelectorAll('[data-openguide],[data-article]')];
        return {
          h1: v.querySelector('.t-hero')?.textContent.trim(),
          words: v.querySelector('#topic-content')?.innerText.split(/\s+/).filter(Boolean).length,
          blocks: v.querySelectorAll('#topic-content > p, #topic-content > h3, #topic-content li, #topic-content .callout').length,
          tables: v.querySelectorAll('.guide-table').length,
          reader: !!v.querySelector('#topic-reader .reader'),
          readerRows: v.querySelectorAll('#topic-reader .reader-row').length,
          deeper: links.length,
          kit: v.querySelectorAll('[data-product]').length,
          selected: v.querySelector('.subtab[aria-selected="true"]')?.dataset.topic,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        };
      });
      if (!pages[t].h1) out.problems.push(`${id}/${t}: no h1`);
      if (!pages[t].reader) out.problems.push(`${id}/${t}: reader missing`);
      if (pages[t].overflow) out.problems.push(`${id}/${t}: horizontal overflow`);
      if (pages[t].selected !== t) out.problems.push(`${id}/${t}: sub-tab not marked selected`);
      if ((pages[t].words || 0) < 90) out.problems.push(`${id}/${t}: only ${pages[t].words} words`);
    }
    out.sections[id] = { topics, pages };
  }

  // deep links out of a topic still work
  await tap('.lib-tab[data-section="health"]');
  await tap('.subtab[data-topic="sleep"]');
  let opened = null;
  if (await p.$('#view-library [data-openguide]')) {
    opened = await p.$eval('#view-library [data-openguide]', (n) => n.dataset.openguide);
    await tap('#view-library [data-openguide]');
    out.guideFromTopic = await p.evaluate(() => ({
      view: document.querySelector('section:not(.hidden)[id^="view-"]')?.id,
      h1: document.querySelector('#view-guides h1')?.textContent.trim(),
    }));
    if (out.guideFromTopic.view !== 'view-guides') out.problems.push('guide link from a topic did not open the guide');
  }
  out.openedGuide = opened;

  // reader works on the topic page
  await nav('learn');
  await tap('.subtabs .subtab[data-topic="sleep"]');
  const playBtn = await p.$('#topic-reader .reader button');
  if (playBtn) {
    await tap('#topic-reader #reader-play');
    await p.waitForTimeout(1400);
    out.readerAfterPlay = await p.evaluate(() => {
      const v = document.querySelector('#view-library');
      return {
        playing: v.querySelector('#topic-reader .reader').className,
        marked: v.querySelectorAll('#topic-content .tts-current').length,
        count: v.querySelector('#topic-reader #reader-count')?.textContent,
        text: v.querySelector('#topic-content')?.innerText.slice(0, 60),
      };
    });
  } else {
    out.problems.push('no reader button on the topic page');
  }

  // search finds a library topic
  await nav('home');
  const searchBtn = await p.$('[data-search-open], #search-open, [data-open-search]');
  if (searchBtn) {
    await p.evaluate(() => document.querySelector('#search-open').click());
    await p.waitForTimeout(300);
    await p.fill('#search-input', 'sleep');
    await p.waitForTimeout(400);
    out.search = await p.evaluate(() => {
      const groups = [...document.querySelectorAll('#search-results [data-group], #search-results h3')].map((n) => n.textContent.trim());
      return { groups, topics: document.querySelectorAll('[data-opentopic]').length };
    });
  }

  await p.goto(URL_ARG, { waitUntil: 'load' });
  await p.waitForTimeout(400);
  await nav('learn');
  await p.screenshot({ path: 'docs/library-health.jpg', type: 'jpeg', quality: 82 });
  await tap('.lib-tab[data-section="fitness"]');
  await p.screenshot({ path: 'docs/library-fitness.jpg', type: 'jpeg', quality: 82 });

  out.errors = errs;
  if (errs.length) out.problems.push(`console errors: ${errs.length}`);
  console.log(JSON.stringify(out, null, 2));
  await b.close();
  process.exit(out.problems.length ? 1 : 0);
})();
