import type { Category } from '@/lib/types';

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
    subtitle: 'Sunscreen, retinoids, hair, posture & fragrance',
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
    articleCount: 2,
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
];

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export const FILE_TO_CATEGORY = new Map<string, string>();
CATEGORIES.forEach((c) => {
  c.fileIds.forEach((f) => FILE_TO_CATEGORY.set(f, c.id));
});
