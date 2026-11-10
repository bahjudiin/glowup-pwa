#!/usr/bin/env node
/**
 * Data-consistency check for the standalone app (index.html).
 *
 * The standalone app ships its catalogue inline in index.html, so this script
 * extracts the <script> block and evaluates it in a sandbox with the DOM
 * stubbed out. It then asserts the invariants that the UI depends on.
 *
 * Run: node scripts/check-standalone-data.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const indexPath = join(here, '..', 'public', 'standalone', 'index.html');
const html = readFileSync(indexPath, 'utf8');

const failures = [];
const check = (name, cond, extra = '') => {
  if (!cond) failures.push(name + (extra ? `  [${extra}]` : ''));
  const line = (cond ? 'PASS  ' : 'FAIL  ') + name + (extra ? `  [${extra}]` : '');
  console.log(line);
};

// ── Structural checks on the document itself ────────────────────
check('index.html has a <style> block', /<style[\s>]/.test(html));
check('index.html has a closing </style>', /<\/style>/.test(html));
check('head is not duplicated', (html.match(/<meta name="viewport"/g) || []).length === 1);
check('--primary is defined', /--primary\s*:/.test(html));
check('--indigo is defined', /--indigo\s*:/.test(html));
check('--rose is defined', /--rose\s*:/.test(html));
check('tier-3 sub-tab renderer exists', /function renderSubTabs/.test(html));
check('article reader exists', /function openArticle/.test(html));
check('search results view exists', /function renderSearch/.test(html));

// ── Evaluate the data layer ─────────────────────────────────────
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
if (scriptStart < 0 || scriptEnd < 0) {
  console.error('FAIL  could not locate the <script> block');
  process.exit(1);
}
const source = html.slice(scriptStart + '<script>'.length, scriptEnd);

const sandbox = {
  document: {
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    documentElement: { classList: { add() {}, remove() {}, toggle() {} } },
  },
  window: {},
  localStorage: { getItem: () => null, setItem: () => {} },
  console,
  setTimeout,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

try {
  vm.runInContext(source, sandbox, { filename: 'index.html#script' });
} catch (err) {
  console.error('FAIL  the inline script threw while evaluating: ' + err.message);
  process.exit(1);
}

// `const` declarations live in the script's lexical scope, not on the sandbox
// object, so pull them out by evaluating the identifier in the same context.
const read = (name) => vm.runInContext(name, sandbox);
const CATEGORIES = read('CATEGORIES');
const ARTICLES = read('ARTICLES');
const PRODUCTS = read('PRODUCTS');

check('catalogue parsed', Array.isArray(CATEGORIES) && Array.isArray(ARTICLES), `${CATEGORIES?.length} categories / ${ARTICLES?.length} articles`);

// ── Category / sub-tab invariants ───────────────────────────────
const catById = new Map(CATEGORIES.map((c) => [c.id, c]));
const artById = new Map(ARTICLES.map((a) => [a.id, a]));

check('article ids are unique', artById.size === ARTICLES.length, `${ARTICLES.length} articles / ${artById.size} unique`);
check('category ids are unique', catById.size === CATEGORIES.length, `${CATEGORIES.length} categories / ${catById.size} unique`);

const catsWithoutSubTabs = CATEGORIES.filter((c) => !Array.isArray(c.subTabs) || c.subTabs.length === 0);
check('every category has at least one sub-tab', catsWithoutSubTabs.length === 0, catsWithoutSubTabs.map((c) => c.id).join(', '));

const unknownSubTabId = [];
const subTabIdsInCategory = new Map();
for (const c of CATEGORIES) {
  const ids = new Set();
  for (const s of c.subTabs || []) {
    if (ids.has(s.id)) unknownSubTabId.push(`${c.id}: duplicate sub-tab ${s.id}`);
    ids.add(s.id);
    for (const aid of s.ids || []) {
      if (!artById.has(aid)) unknownSubTabId.push(`${c.id}/${s.id} references missing article ${aid}`);
    }
  }
  subTabIdsInCategory.set(c.id, ids);
}
check('sub-tab ids are unique and reference real articles', unknownSubTabId.length === 0, unknownSubTabId.join('; '));

const badMembership = [];
const coverage = new Map();
for (const a of ARTICLES) {
  const cat = catById.get(a.categoryId);
  if (!cat) { badMembership.push(`${a.id} has unknown category ${a.categoryId}`); continue; }
  if (!a.subTabId) { badMembership.push(`${a.id} has no subTabId`); continue; }
  const ids = subTabIdsInCategory.get(a.categoryId) || new Set();
  if (!ids.has(a.subTabId)) badMembership.push(`${a.id} has subTabId ${a.subTabId} not in category ${a.categoryId}`);
  const key = `${a.categoryId}/${a.subTabId}`;
  coverage.set(key, (coverage.get(key) || 0) + 1);
}
check('every article belongs to a sub-tab of its own category', badMembership.length === 0, badMembership.join('; '));

// Every article must appear in exactly one sub-tab's id list, and every
// sub-tab id list must cover the articles that claim to be in it.
const counted = new Map();
for (const c of CATEGORIES) {
  for (const s of c.subTabs || []) {
    for (const aid of s.ids || []) counted.set(aid, (counted.get(aid) || 0) + 1);
  }
}
const multi = ARTICLES.filter((a) => (counted.get(a.id) || 0) !== 1);
check('every article appears in exactly one sub-tab list', multi.length === 0, multi.map((a) => `${a.id} x${counted.get(a.id)}`).join(', '));

const uncovered = [];
for (const [key, n] of coverage) {
  const [catId, subId] = key.split('/');
  const cat = catById.get(catId);
  const sub = (cat.subTabs || []).find((s) => s.id === subId);
  if (!sub) { uncovered.push(`${key} has no sub-tab`); continue; }
  if ((sub.ids || []).length !== n) uncovered.push(`${key} lists ${(sub.ids || []).length} but ${n} articles claim it`);
}
check('sub-tab lists match the articles that claim them', uncovered.length === 0, uncovered.join('; '));

// ── Feature requirements ────────────────────────────────────────
const vitality = catById.get('mens-vitality');
check('Big D category exists', !!vitality, vitality ? `${vitality.subTabs.length} sub-tabs` : 'missing');
check('Big D has 5 sub-tabs', vitality && vitality.subTabs.length === 5, vitality ? String(vitality.subTabs.length) : 'n/a');
const bigD = ARTICLES.filter((a) => a.categoryId === 'mens-vitality');
check('Big D has 5 articles', bigD.length === 5, String(bigD.length));
check('Big D articles all have content', bigD.every((a) => a.content && a.content.length > 200), bigD.map((a) => `${a.id}:${(a.content || '').length}`).join(' '));
check('Big D mentions shilajit + tongkat', bigD.some((a) => /shilajit/i.test(a.content)) && bigD.some((a) => /tongkat/i.test(a.content)));

const sleep = catById.get('sleep-recovery');
check('Sleep category exists', !!sleep);
check('Sleep has at least 3 sub-tabs', sleep && sleep.subTabs.length >= 3, sleep ? String(sleep.subTabs.length) : 'n/a');
const sleepArts = ARTICLES.filter((a) => a.categoryId === 'sleep-recovery');
check('Sleep has at least 3 articles', sleepArts.length >= 3, String(sleepArts.length));
check('Sleep articles all have content', sleepArts.every((a) => a.content && a.content.length > 200), sleepArts.map((a) => `${a.id}:${(a.content || '').length}`).join(' '));

const home = html.match(/const cats=CATEGORIES\.slice\(0,\d+\)/);
check('home does not truncate the category grid', !home, home ? home[0] : 'ok');
check('every category is reachable from the home grid', CATEGORIES.length >= 12, String(CATEGORIES.length));

// ── Result ──────────────────────────────────────────────────────
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:`);
  failures.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log(`\nAll ${'standalone data'} checks passed.`);
