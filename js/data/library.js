// ─────────────────────────────────────────────────────────────
// LIBRARY — the one ordered index of every piece of content.
//
// To add / rename / reorder a section you edit ONLY this file.
//   PLAN_GROUPS  -> rendered from js/data/blueprint.js
//   HOME_GROUPS  -> mounted onto existing markup by pane id
// ─────────────────────────────────────────────────────────────
import { PLAN_SECTIONS, DAILY_CHECKLIST } from './blueprint.js';
import { PRODUCTS, PRODUCT_CATS, PRODUCT_TIERS } from './products.js';

// Daily checklist gets promoted to a first-class section
const DAILY_SECTION = {
  id: 'daily',
  n: 0,
  icon: DAILY_CHECKLIST.icon,
  label: DAILY_CHECKLIST.title,
  tone: DAILY_CHECKLIST.tone,
  keywords: 'daily checklist consistency habits protein vegetables walk sleep medication',
  priority: 90,
  blocks: [
    {
      type: 'note', tone: 'green',
      title: '✅ DAILY CHECKLIST FOR CONSISTENCY',
      text: 'Resets automatically each day. Tick items as you complete them — progress is saved on this device.'
    },
    {
      type: 'checklist', key: DAILY_CHECKLIST.key, scope: 'daily',
      title: DAILY_CHECKLIST.title, icon: DAILY_CHECKLIST.icon, tone: 'green',
      items: DAILY_CHECKLIST.items
    }
  ]
};

// ── Top-level Plan deck (its own main nav screen) ───────────
export const PLAN_GROUPS = [
  {
    id: 'plan',
    label: 'Plan',
    icon: '\u{1F4CB}',
    sections: [DAILY_SECTION, ...PLAN_SECTIONS]
  }
];

// ── Home deck: existing static content, now indexed + sortable ──
export const HOME_GROUPS = [
  {
    id: 'health',
    label: 'Health',
    icon: '\u{1F49A}',
    dom: '#cat-health',
    map: {
      'h-eyes': { label: 'Eyes', icon: '\u{1F441}\uFE0F', tone: 'accent', n: 1, keywords: 'vision screen strain blue light 20-20-20 sunlight supplement lutein' },
      'h-face': { label: 'Face', icon: '\u{1F9CD}', tone: 'gold', n: 2, keywords: 'jawline symmetry skin brows mewing debloat routine score' },
      'h-lips': { label: 'Lips', icon: '\u{1F444}', tone: 'pink', n: 3, keywords: 'lip balm exfoliate protect hydrate chapped' },
      'h-teeth': { label: 'Teeth', icon: '\u{1F9B7}', tone: 'blue', n: 4, keywords: 'brush floss mouthwash whitening tongue coffee' },
      'h-bigd': { label: 'Vitality', icon: '\u{1F4D8}', tone: 'red', n: 5, priority: 60, keywords: 'testosterone ed pe fertility sperm herbs attraction pheromones shilajit ashwagandha tongkat' }
    }
  },
  {
    id: 'grooming',
    label: 'Grooming',
    icon: '\u{2728}',
    dom: '#cat-skincare',
    map: {
      's-hair': { label: 'Hair', icon: '\u{1F487}', tone: 'green', n: 1, keywords: 'growth minoxidil rosemary biotin scalp curls microneedling' },
      's-beard': { label: 'Beard', icon: '\u{1F9D4}', tone: 'gold', n: 2, keywords: 'dermaroller beard oil growth week protein sleep' },
      's-skin': { label: 'Skin', icon: '\u{1F9F4}', tone: 'accent', n: 3, keywords: 'hydration collagen massage matcha seaweed hara hachi bu anti aging' },
      's-body': { label: 'Body Care', icon: '\u{1F6CB}\uFE0F', tone: 'orange', n: 4, keywords: 'body wash lotion exfoliate deodorant odor' },
      's-style': { label: 'Style', icon: '\u{1F457}', tone: 'blue', n: 5, keywords: 'clothing colours fit fragrance haircut barber taper fade' },
      's-products': { label: 'Products', icon: '\u{1F6CD}\uFE0F', tone: 'pink', n: 6, keywords: 'shopping skincare hair fasting supplies shop' }
    }
  }
];

// ── Products deck: one catalogue, filterable by category + tier ──
const ALL_CATS = [{ id: 'all', label: 'All', icon: '\u{1F6D2}', tone: 'accent' }, ...PRODUCT_CATS];

export const PRODUCT_GROUPS = [
  {
    id: 'shop',
    label: 'Products',
    icon: '\u{1F6D2}',
    sections: ALL_CATS.map((c, i) => ({
      id: 'p-' + c.id,
      n: i,
      icon: c.icon,
      label: c.label,
      tone: c.tone,
      keywords: (PRODUCTS.filter(p => c.id === 'all' || p.cat === c.id)
        .map(p => p.name + ' ' + p.benefit).join(' ')).toLowerCase(),
      blocks: [{
        type: 'products',
        deck: 'products',
        cat: c.id,
        items: PRODUCTS,
        tiers: PRODUCT_TIERS
      }]
    }))
  }
];

// ── Toolbar options (shared by both decks) ──────────────────
export const SORTS = [
  { id: 'order', label: 'Blueprint order' },
  { id: 'priority', label: 'Priority first' },
  { id: 'az', label: 'A → Z' },
  { id: 'za', label: 'Z → A' },
  { id: 'reverse', label: 'Reverse' }
];
