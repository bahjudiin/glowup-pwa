// Design-system regression check for the WattVision tokens.
// Runs in a fresh browser context so the HTTP cache can never mask a change.
//
//   node scripts/verify-design.mjs [baseUrl]
import { chromium } from 'playwright-core';

const BASE = process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:8080';
let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? '  — ' + detail : ''}`);
};

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.GLOWUP_DATA);

  const read = async () =>
    page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const v = (n) => cs.getPropertyValue(n).trim();
      const body = getComputedStyle(document.body);
      const card = document.querySelector('.card, .row-card, .check-row');
      const cardCs = card ? getComputedStyle(card) : null;
      const kpi = document.querySelector('.kpi b, .progress-ring-val b, .stat-val');
      const kpiCs = kpi ? getComputedStyle(kpi) : null;
      const h1 = document.querySelector('.page-title, .t-hero, .t-display');
      const h1Cs = h1 ? getComputedStyle(h1) : null;
      return {
        theme: document.documentElement.className,
        tokens: {
          background: v('--background'),
          card: v('--card'),
          foreground: v('--foreground'),
          primary: v('--primary'),
          muted: v('--muted-foreground'),
          border: v('--border'),
          destructive: v('--destructive'),
          gradeHigh: v('--grade-high'),
          rowHover: v('--row-hover'),
          alertBg: v('--alert-bg'),
          chart1: v('--chart-1'),
        },
        bodyBg: body.backgroundColor,
        bodyColor: body.color,
        bodyFont: body.fontFamily,
        bodySize: body.fontSize,
        cardRadius: cardCs ? cardCs.borderRadius : null,
        cardBorder: cardCs ? cardCs.borderColor : null,
        kpiFont: kpiCs ? kpiCs.fontFamily : null,
        kpiSize: kpiCs ? kpiCs.fontSize : null,
        kpiWeight: kpiCs ? kpiCs.fontWeight : null,
        titleSize: h1Cs ? h1Cs.fontSize : null,
        titleWeight: h1Cs ? h1Cs.fontWeight : null,
      };
    });

  console.log('\n--- dark mode (primary) ---');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(200);
  const dark = await read();

  check('dark theme active', dark.theme.includes('dark'), dark.theme);
  check('canvas is #121212', dark.bodyBg === 'rgb(18, 18, 18)', dark.bodyBg);
  check('text is #FFFFFF', dark.bodyColor === 'rgb(255, 255, 255)', dark.bodyColor);
  check('body is Inter', /Inter/.test(dark.bodyFont), dark.bodyFont);
  check('body is 14px', dark.bodySize === '14px', dark.bodySize);
  check('card radius is 16px', dark.cardRadius === '16px', dark.cardRadius);
  check('card border is the #2C2C2E hairline', dark.cardBorder === 'rgb(44, 44, 46)', dark.cardBorder);
  check('KPI numerals are JetBrains Mono', /JetBrains Mono/.test(dark.kpiFont || ''), dark.kpiFont || 'n/a');
  check('KPI numerals are bold', dark.kpiWeight === '700', dark.kpiWeight);
  check('KPI hero numeral is 32px', dark.kpiSize === '32px', dark.kpiSize);
  check('title is 24px semibold', dark.titleSize === '24px' && dark.titleWeight === '600', `${dark.titleSize}/${dark.titleWeight}`);

  console.log('\n--- accent semantics (dark) ---');
  const acc = dark.tokens;
  check('primary accent is cyan #00E5FF', acc.primary === '186.12 100% 50%', acc.primary);
  check('live/normal is lime #32D74B', acc.gradeHigh === '129.09 67.35% 51.96%', acc.gradeHigh);
  check('alert is red #FF453A', acc.destructive === '3.35 100% 61.37%', acc.destructive);
  check('row hover is #252525', acc.rowHover === '0 0% 14.51%', acc.rowHover);
  check('alert background is #3A1C1C', acc.alertBg === '0 34.88% 16.86%', acc.alertBg);
  check('chart data is cyan', acc.chart1 === '186.12 100% 50%', acc.chart1);
  check('border token is #2C2C2E', acc.border === '240 2.22% 17.65%', acc.border);
  check('card token is #1E1E1E', acc.card === '0 0% 11.76%', acc.card);

  console.log('\n--- light mode (white mode) ---');
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(200);
  const light = await read();
  check('light theme active', !light.theme.includes('dark'), light.theme || '(no class)');
  check('canvas is #FFFFFF', light.bodyBg === 'rgb(255, 255, 255)', light.bodyBg);
  check('text is #121212', light.bodyColor === 'rgb(18, 18, 18)', light.bodyColor);
  check('body is still Inter 14px', /Inter/.test(light.bodyFont) && light.bodySize === '14px', light.bodySize);
  check('KPI numerals still mono', /JetBrains Mono/.test(light.kpiFont || ''), light.kpiFont || 'n/a');
  check('primary accent is the darkened cyan', light.tokens.primary === '189.1 100% 34.9%', light.tokens.primary);
  check('light border is #E2E2E6', light.tokens.border === '240 7.41% 89.41%', light.tokens.border);

  console.log('\n--- webfonts ---');
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      inter: document.fonts.check('14px Inter'),
      inter600: document.fonts.check('600 14px Inter'),
      mono: document.fonts.check('700 32px "JetBrains Mono"'),
    };
  });
  check('Inter is loaded', fonts.inter === true);
  check('Inter 600 is loaded', fonts.inter600 === true);
  check('JetBrains Mono 700 is loaded', fonts.mono === true);
} finally {
  await browser.close();
}

console.log(failures ? `\nFAILED: ${failures} check(s)` : '\nAll design checks passed.');
process.exit(failures ? 1 : 0);
