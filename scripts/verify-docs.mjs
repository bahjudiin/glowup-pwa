// Docs-consistency check.
//
// The README quotes hard numbers (article counts, category counts, sizes) and
// links to screenshot files. Every one of those is checked against the real
// build, so the docs cannot drift from the app.
//
//   node scripts/verify-docs.mjs
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? '  — ' + detail : ''}`);
};

const read = (f) => readFileSync(f, 'utf8');

// --- the real numbers, straight from the built data layer -----------------
const src = read('data.js');
const marker = 'window.GLOWUP_DATA =';
const data = eval('(' + src.slice(src.indexOf(marker) + marker.length, src.lastIndexOf(';')) + ')');

const articles = (data.articles || []).length;
const categories = (data.categories || []).length;
const products = (data.products || []).length;
const nutrition = (data.nutrition || []).length;
const meals = (data.meals || []).length;

// --- every count the README states ----------------------------------------
const readme = read('README.md');
const rootReadme = existsSync(join('..', 'README.md')) ? read(join('..', 'README.md')) : '';

const claims = [
  ['README states the article count', `${articles}, across ${categories} categories`],
  ['README states the product count', `${products} products`],
  ['README states the nutrition count', `${nutrition} USDA`],
  ['README states the meal count', `${meals} meal`],
];

for (const [label, needle] of claims) {
  check(label, readme.includes(needle), needle);
}

// --- the standalone build size the README quotes --------------------------
let standalone = 0;
if (existsSync('dist/glowup-standalone.html')) {
  standalone = statSync('dist/glowup-standalone.html').size;
}
const mb = (standalone / 1024 / 1024).toFixed(2);
check(
  'README quotes the real standalone size',
  readme.includes(`**${mb} MB**`),
  `${mb} MB`,
);

// --- every screenshot the README links must exist -------------------------
const linked = [...readme.matchAll(/\]\((docs\/[^)]+)\)/g)].map((m) => m[1]);
const uniq = [...new Set(linked)];
check('README links at least one screenshot', uniq.length > 0, `${uniq.length} links`);
for (const rel of uniq) {
  check(`  ${rel}`, existsSync(rel));
}

// --- no screenshot may reference a file that does not exist ---------------
const named = [...readme.matchAll(/`(docs\/[a-z0-9\-]+\.(?:jpg|png))`/gi)].map((m) => m[1]);
for (const rel of [...new Set(named)]) {
  check(`  named ${rel}`, existsSync(rel));
}

// --- the docs must not name a deleted screenshot --------------------------
check(
  'no README reference to the removed apple-*.jpg screenshots',
  !/apple-[a-z]+\.jpg/.test(readme),
);

// --- the project-root README must not quote a stale article count ---------
if (rootReadme) {
  const stale = [...rootReadme.matchAll(/(\d+)\s+articles/g)].map((m) => Number(m[1]));
  const wrong = stale.filter((n) => n !== articles);
  check(
    'root README article counts match the build',
    wrong.length === 0,
    wrong.length ? `says ${wrong.join(', ')}` : `${articles}`,
  );
}

// --- the design system the README promises must be the one in the CSS -----
const css = read('src/input.css');
for (const hex of ['#121212', '#1E1E1E', '#00E5FF', '#FF453A', '#32D74B', '#2C2C2E', '#3A1C1C', '#98989D', '#252525']) {
  check(`token ${hex} is in the stylesheet`, css.includes(hex));
}

console.log(failures ? `\nFAILED: ${failures} check(s)` : '\nAll docs checks passed.');
process.exit(failures ? 1 : 0);
