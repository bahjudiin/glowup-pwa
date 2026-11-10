export interface SubTab {
  id: string;
  title: string;
  icon?: string;
  description?: string;
  articleIds: string[];
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  fileIds: string[]; // MD file numbers that map here
  articleCount: number;
  subTabs?: SubTab[]; // tier-3 tabs inside the category
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  categoryId: string;
  subTabId?: string; // tier-3 tab this article belongs to
  fileId: string;
  evidenceGrade: 'High' | 'Moderate' | 'Moderate-High' | 'Low' | 'Very low' | 'Insufficient';
  costTier: 'Free' | 'Very low' | 'Low' | 'Moderate' | 'High' | 'Very high';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  readTime: string;
  tags: string[];
  icon: string;
  content: string; // raw markdown
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number | null;
  priceVerified: boolean;
  priceDate: string;
  perServing: string | null;
  currency: string;
  url: string;
  source: 'iHerb' | 'Amazon' | 'Search';
  evidence: string;
  purpose: string;
  use: string;
  risks: string[];
  contraindications: string[];
  essential: 'essential' | 'high-value' | 'optional' | 'skip';
  tier: string;
  tags: string[];
  image: string;
}

export interface Food {
  id: string;
  name: string;
  group: 'Vegetables' | 'Fruits' | 'Protein';
  kcal: number;
  protein: number;
  fibre: number;
  water: number;
  satietyEvidence: 'Direct RCT' | 'Indirect' | 'None';
  cost: string;
  availability: string;
  fdcId: string;
  notes: string;
}

export interface MealTemplate {
  id: string;
  title: string;
  type: 'Breakfast' | 'Lunch/Dinner' | 'Snack';
  protein: string;
  fibre: string;
  notes: string;
  ingredients: string[];
}

export interface ShoppingItem {
  id: string;
  item: string;
  quantity: string;
  category: 'Protein' | 'Fibre/Veg' | 'Fats/Flavour';
}

export interface FilterState {
  query: string;
  category: string;
  evidence: string;
  cost: string;
  verifiedOnly: boolean;
  sort: 'default' | 'evidence' | 'cost' | 'name';
}
