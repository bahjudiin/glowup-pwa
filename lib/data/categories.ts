import type { Category, SubTab } from '@/lib/types';
import { VITALITY_CATEGORY, VITALITY_SUBTABS } from '@/lib/data/vitality';
import { SLEEP_SUBTABS } from '@/lib/data/sleep';

/**
 * Tier-3 sub-tabs for every category.
 *
 * A category without sub-tabs is a dead end: the reader lands on a flat list with
 * no way to narrow it. Each category now declares its own sub-tabs, and every
 * article id must appear in exactly one of them.
 */
const SUBTABS: Record<string, SubTab[]> = {
  'fat-loss': [
    { id: 'deficit', title: 'Deficit & Rate', icon: 'Flame', description: 'Energy deficit, expected rate of loss, plateaus', articleIds: ['fast-fat-loss', 'aggressive-transformation'] },
    { id: 'fasting', title: 'Fasting', icon: 'Clock', description: '16:8 vs 14:10, autophagy myths', articleIds: ['intermittent-fasting'] },
  ],
  'muscle-training': [
    { id: 'recomposition', title: 'Recomposition', icon: 'Dumbbell', description: 'Keeping muscle while in a deficit', articleIds: ['body-recomposition', 'muscle-preservation'] },
    { id: 'training', title: 'Exercise & NEAT', icon: 'Activity', description: 'Steps, programmes, cardio, daily movement', articleIds: ['exercise-neat'] },
  ],
  'nutrition-foods': [
    { id: 'volume', title: 'Volume & Fibre', icon: 'Apple', description: 'Cheapest calories, satiety, fibre', articleIds: ['high-volume-foods', 'fiber-low-cost-foods'] },
    { id: 'protein', title: 'Protein', icon: 'Beef', description: 'Targets, patterns, cost per gram', articleIds: ['nutrition-protein'] },
    { id: 'meals', title: 'Meals', icon: 'Utensils', description: 'Templates, rotation, shopping list', articleIds: ['meal-templates'] },
  ],
  supplements: [
    { id: 'evidence', title: 'Evidence Review', icon: 'Capsule', description: 'Creatine, vitamin D, omega-3 — what is worth it', articleIds: ['supplements-review'] },
    { id: 'alternatives', title: 'Drugs & Alternatives', icon: 'Pill', description: 'GLP-1, bariatric surgery, lifestyle routes', articleIds: ['expensive-drugs-alternatives'] },
  ],
  products: [
    { id: 'catalogue', title: 'Catalogue', icon: 'ShoppingCart', description: 'Verified links, prices, cost per serving', articleIds: ['product-directory'] },
    { id: 'shopping', title: 'Shopping Order', icon: 'ListOrdered', description: 'What to buy first, cheap to premium', articleIds: ['amazon-iherb-products'] },
  ],
  'skincare-grooming': [
    { id: 'skincare', title: 'Skincare', icon: 'Sparkles', description: 'Sunscreen, retinoids, acne', articleIds: ['skincare-glow-up'] },
    { id: 'hair', title: 'Hair', icon: 'Scissors', description: 'Androgenetic alopecia, finasteride, minoxidil', articleIds: ['hair-loss-scalp'] },
    { id: 'grooming', title: 'Grooming', icon: 'Shirt', description: 'Face, teeth, posture, clothing, fragrance', articleIds: ['mens-grooming'] },
  ],
  'sleep-recovery': SLEEP_SUBTABS,
  'health-longevity': [
    { id: 'mens-health', title: "Men's Health", icon: 'Heart', description: 'Mortality levers, blood pressure, screening, testosterone', articleIds: ['mens-health-longevity'] },
    { id: 'anti-aging', title: 'Anti-Aging', icon: 'Flame', description: 'Every popular longevity intervention, graded', articleIds: ['anti-aging-interventions'] },
    { id: 'tracking', title: 'Bloodwork', icon: 'Activity', description: 'What to measure, when, how to read it', articleIds: ['bloodwork-tracking'] },
  ],
  maintenance: [
    { id: 'biology', title: 'Why You Regain', icon: 'Dna', description: 'The biology of regain', articleIds: ['permanent-weight-maintenance'] },
    { id: 'prevention', title: 'Prevention', icon: 'ShieldCheck', description: 'Early-warning system, disruption plans', articleIds: ['weight-regain-prevention'] },
    { id: 'transition', title: 'After the Diet', icon: 'Route', description: '12-week post-diet transition playbook', articleIds: ['maintenance-after-weight-loss'] },
  ],
  'myths-evidence': [
    { id: 'myths', title: 'Myths', icon: 'ShieldAlert', description: 'Myth-by-myth verdicts with evidence grades', articleIds: ['unsupported-claims-myths'] },
    { id: 'references', title: 'References', icon: 'BookMarked', description: 'Master index — 141 PMIDs and 45 URLs', articleIds: ['research-references'] },
    { id: 'method', title: 'Method', icon: 'Microscope', description: 'How claims are graded and verified', articleIds: ['evidence-research-method'] },
  ],
  'master-summary': [
    { id: 'protocol', title: 'The Protocol', icon: 'FileText', description: 'The full ranked list and synthesis', articleIds: ['master-summary'] },
  ],
  'mens-vitality': VITALITY_SUBTABS,
};

export const CATEGORIES: Category[] = [
  {
    id: 'fat-loss',
    title: 'Fat Loss',
    subtitle: 'Deficits, rates, plateaus, fasting & adherence',
    icon: 'Flame',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    fileIds: ['02', '04', '20'],
    articleCount: 3,
  },
  {
    id: 'muscle-training',
    title: 'Muscle & Training',
    subtitle: 'Protein, resistance training & recomposition',
    icon: 'Dumbbell',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    fileIds: ['03', '10', '06'],
    articleCount: 3,
  },
  {
    id: 'nutrition-foods',
    title: 'Nutrition & Foods',
    subtitle: 'Volume eating, protein targets & meal templates',
    icon: 'Apple',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    fileIds: ['01', '08', '26', '09'],
    articleCount: 4,
  },
  {
    id: 'supplements',
    title: 'Supplements',
    subtitle: 'Creatine, vitamin D, omega-3 & what to skip',
    icon: 'Capsule',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    fileIds: ['16', '17'],
    articleCount: 2,
  },
  {
    id: 'products',
    title: 'Product Directory',
    subtitle: 'Verified links, prices & cost-per-serving',
    icon: 'ShoppingCart',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    fileIds: ['18', '09'],
    articleCount: 2,
  },
  {
    id: 'skincare-grooming',
    title: 'Skincare & Grooming',
    subtitle: 'Sunscreen, retinoids, hair & appearance',
    icon: 'Sparkles',
    color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    fileIds: ['14', '15', '24'],
    articleCount: 3,
  },
  {
    id: 'sleep-recovery',
    title: 'Sleep & Recovery',
    subtitle: 'Sleep protocol, caffeine, OSA & appetite',
    icon: 'Moon',
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    fileIds: ['11', '05'],
    articleCount: 3,
  },
  {
    // VITALITY_CATEGORY.id is already 'mens-vitality'
    ...VITALITY_CATEGORY,
  },
  {
    id: 'health-longevity',
    title: 'Health & Longevity',
    subtitle: 'Blood pressure, screening & anti-aging',
    icon: 'Heart',
    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    fileIds: ['12', '13', '25'],
    articleCount: 3,
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    subtitle: 'Weight regain prevention & the 2-kg rule',
    icon: 'ShieldCheck',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    fileIds: ['06', '07', '21'],
    articleCount: 3,
  },
  {
    id: 'myths-evidence',
    title: 'Myths & Evidence',
    subtitle: 'Unsupported claims, references & method',
    icon: 'ShieldAlert',
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    fileIds: ['22', '23', '01'],
    articleCount: 3,
  },
  {
    id: 'master-summary',
    title: 'Master Summary',
    subtitle: 'The full protocol & ranked intervention list',
    icon: 'FileText',
    color: 'bg-slate-900 text-slate-300 border-slate-700',
    fileIds: ['00'],
    articleCount: 1,
  },
].map((c) => ({ ...c, subTabs: SUBTABS[c.id] }));

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export const FILE_TO_CATEGORY = new Map<string, string>();
CATEGORIES.forEach((c) => {
  c.fileIds.forEach((f) => FILE_TO_CATEGORY.set(f, c.id));
});

export const SUBTABS_BY_CATEGORY = new Map<string, SubTab[]>(
  CATEGORIES.filter((c) => c.subTabs?.length).map((c) => [c.id, c.subTabs!])
);
