import type { Article, Food, MealTemplate, Product } from "@/lib/types";
import { markdownToPlainText } from "@/lib/markdown";

/* -------------------------------------------------------------------------- */
/*  Ordering tables                                                           */
/* -------------------------------------------------------------------------- */

/** Evidence grades, strongest first. */
export const EVIDENCE_ORDER: Record<string, number> = {
  High: 0,
  "Moderate-High": 1,
  Moderate: 2,
  Low: 3,
  "Very low": 4,
  Insufficient: 5,
};

/** Cost tiers, cheapest first. */
export const COST_ORDER: Record<string, number> = {
  Free: 0,
  "Very low": 1,
  Low: 2,
  Moderate: 3,
  High: 4,
  "Very high": 5,
};

export const EVIDENCE_GRADES = Object.keys(EVIDENCE_ORDER);
export const COST_TIERS = Object.keys(COST_ORDER);

export type SortKey = "default" | "evidence" | "cost" | "name" | "relevance";

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "evidence", label: "Evidence" },
  { id: "cost", label: "Cost (low → high)" },
  { id: "name", label: "Name (A→Z)" },
];

/* -------------------------------------------------------------------------- */
/*  Shared helpers                                                            */
/* -------------------------------------------------------------------------- */

export function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function includesTerm(haystack: string, needle: string): boolean {
  return haystack.includes(needle);
}

/** Split a free-text query into lowercase terms. */
export function queryTerms(q: string | null | undefined): string[] {
  return normalize(q).split(/\s+/).filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/*  Articles                                                                  */
/* -------------------------------------------------------------------------- */

export interface ArticleQuery {
  q?: string | null;
  category?: string | null;
  subTab?: string | null;
  evidence?: string | null;
  cost?: string | null;
  verified?: boolean;
}

/**
 * Filter articles by category, sub-tab, evidence grade, cost tier and free text.
 *
 * `verified` means "only entries whose price was verified". Articles do not
 * carry a price of their own, so the flag narrows the list to the price-bearing
 * part of the library — the Product Directory category.
 */
export function filterArticles(articles: Article[], options: ArticleQuery = {}): Article[] {
  const {
    q,
    category,
    subTab,
    evidence,
    cost,
    verified = false,
  } = options;

  const terms = queryTerms(q);
  const wantedEvidence = normalize(evidence);
  const wantedCost = normalize(cost);
  const wantedCategory = normalize(category);
  const wantedSubTab = normalize(subTab);

  return articles.filter((article) => {
    if (wantedCategory && normalize(article.categoryId) !== wantedCategory) return false;
    if (wantedSubTab && normalize(article.subTabId) !== wantedSubTab) return false;
    if (wantedEvidence && normalize(article.evidenceGrade) !== wantedEvidence) return false;
    if (wantedCost && normalize(article.costTier) !== wantedCost) return false;
    if (verified && article.categoryId !== "products") return false;

    if (terms.length) {
      const haystack = [
        article.title,
        article.summary,
        article.tags.join(" "),
        article.fileId,
        article.evidenceGrade,
        article.costTier,
        markdownToPlainText(article.content),
      ]
        .join(" ")
        .toLowerCase();
      if (!terms.every((term) => includesTerm(haystack, term))) return false;
    }

    return true;
  });
}

/**
 * Score an article against the query terms — used by the `relevance` sort.
 * Title matches beat tag matches beat body matches.
 */
export function scoreArticle(article: Article, terms: string[]): number {
  if (!terms.length) return 0;
  const title = article.title.toLowerCase();
  const summary = article.summary.toLowerCase();
  const tags = article.tags.join(" ").toLowerCase();
  const body = markdownToPlainText(article.content).toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 10;
    if (tags.includes(term)) score += 5;
    if (summary.includes(term)) score += 3;
    if (body.includes(term)) score += 1;
  }
  return score;
}

/**
 * Sort articles. `default` keeps the curated data order; `relevance` needs the
 * query so it can rank by match strength.
 */
export function sortArticles(articles: Article[], sort: SortKey = "default", q?: string | null): Article[] {
  const list = [...articles];

  switch (sort) {
    case "evidence":
      return list.sort(
        (a, b) =>
          (EVIDENCE_ORDER[a.evidenceGrade] ?? 99) - (EVIDENCE_ORDER[b.evidenceGrade] ?? 99) ||
          a.title.localeCompare(b.title)
      );
    case "cost":
      return list.sort(
        (a, b) =>
          (COST_ORDER[a.costTier] ?? 99) - (COST_ORDER[b.costTier] ?? 99) ||
          a.title.localeCompare(b.title)
      );
    case "name":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "relevance": {
      const terms = queryTerms(q);
      return list.sort(
        (a, b) => scoreArticle(b, terms) - scoreArticle(a, terms) || a.title.localeCompare(b.title)
      );
    }
    default:
      return list;
  }
}

/* -------------------------------------------------------------------------- */
/*  Products                                                                  */
/* -------------------------------------------------------------------------- */

export interface ProductQuery {
  q?: string | null;
  category?: string | null;
  essential?: string | null;
  evidence?: string | null;
  cost?: string | null;
  verified?: boolean;
}

/** Upper price bound (USD) for each cost tier, used when filtering products. */
export const COST_PRICE_BANDS: Record<string, number> = {
  Free: 0,
  "Very low": 10,
  Low: 20,
  Moderate: 40,
  High: 80,
  "Very high": Number.POSITIVE_INFINITY,
};

/** Case-insensitive lookup for the price bands. */
export function priceBandForCost(cost: string | null | undefined): number | undefined {
  const wanted = normalize(cost);
  if (!wanted) return undefined;
  const match = Object.keys(COST_PRICE_BANDS).find((tier) => tier.toLowerCase() === wanted);
  return match === undefined ? undefined : COST_PRICE_BANDS[match];
}

export function filterProducts(products: Product[], options: ProductQuery = {}): Product[] {
  const { q, category, essential, evidence, cost, verified = false } = options;

  const terms = queryTerms(q);
  const wantedCategory = normalize(category);
  const wantedEssential = normalize(essential);
  const wantedEvidence = normalize(evidence);
  const wantedCost = normalize(cost);
  const priceBand = priceBandForCost(wantedCost);

  return products.filter((product) => {
    if (wantedCategory && wantedCategory !== "all" && normalize(product.category) !== wantedCategory) {
      return false;
    }
    if (wantedEssential && wantedEssential !== "all" && normalize(product.essential) !== wantedEssential) {
      return false;
    }
    // Product evidence strings carry a qualifier ("High (deficiency correction)"),
    // so match on the grade prefix rather than the whole string.
    if (wantedEvidence && !normalize(product.evidence).startsWith(wantedEvidence)) return false;
    if (priceBand !== undefined) {
      if (product.price === null) return false;
      if (product.price > priceBand) return false;
    }
    if (verified && !product.priceVerified) return false;

    if (terms.length) {
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.purpose,
        product.use,
        product.evidence,
        product.tier,
        product.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!terms.every((term) => includesTerm(haystack, term))) return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sort: SortKey = "default", q?: string | null): Product[] {
  const list = [...products];

  switch (sort) {
    case "evidence":
      return list.sort(
        (a, b) =>
          (EVIDENCE_ORDER[a.evidence] ?? 99) - (EVIDENCE_ORDER[b.evidence] ?? 99) ||
          a.name.localeCompare(b.name)
      );
    case "cost":
      return list.sort((a, b) => {
        // Products with an unknown price sort last.
        if (a.price === null && b.price === null) return a.name.localeCompare(b.name);
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return a.price - b.price;
      });
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "relevance": {
      const terms = queryTerms(q);
      const score = (p: Product) => {
        const title = p.name.toLowerCase();
        const rest = `${p.brand} ${p.purpose} ${p.tags.join(" ")}`.toLowerCase();
        return terms.reduce(
          (acc, term) => acc + (title.includes(term) ? 10 : 0) + (rest.includes(term) ? 3 : 0),
          0
        );
      };
      return list.sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
    }
    default:
      return list;
  }
}

/* -------------------------------------------------------------------------- */
/*  Foods                                                                     */
/* -------------------------------------------------------------------------- */

export interface FoodQuery {
  q?: string | null;
  group?: string | null;
}

export function filterFoods(foods: Food[], options: FoodQuery = {}): Food[] {
  const { q, group } = options;
  const terms = queryTerms(q);
  const wantedGroup = normalize(group);

  return foods.filter((food) => {
    if (wantedGroup && wantedGroup !== "all" && normalize(food.group) !== wantedGroup) return false;
    if (terms.length) {
      const haystack = [food.name, food.group, food.notes, food.cost, food.availability]
        .join(" ")
        .toLowerCase();
      if (!terms.every((term) => includesTerm(haystack, term))) return false;
    }
    return true;
  });
}

export function sortFoods(foods: Food[], sort: SortKey = "default"): Food[] {
  const list = [...foods];
  if (sort === "name") return list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "cost") return list.sort((a, b) => a.kcal - b.kcal);
  if (sort === "evidence") {
    return list.sort((a, b) => a.satietyEvidence.localeCompare(b.satietyEvidence) || a.kcal - b.kcal);
  }
  return list;
}

/* -------------------------------------------------------------------------- */
/*  Meals                                                                     */
/* -------------------------------------------------------------------------- */

export interface MealQuery {
  q?: string | null;
  type?: string | null;
}

export function filterMeals(meals: MealTemplate[], options: MealQuery = {}): MealTemplate[] {
  const { q, type } = options;
  const terms = queryTerms(q);
  const wantedType = normalize(type);

  return meals.filter((meal) => {
    if (wantedType && wantedType !== "all" && normalize(meal.type) !== wantedType) return false;
    if (terms.length) {
      // "protein" / "fibre" are the dimensions a template is described by, so
      // they are searchable even though the stored values are only amounts.
      const haystack = [
        meal.title,
        meal.type,
        meal.notes,
        meal.protein,
        meal.fibre,
        "protein",
        "fibre",
        meal.ingredients.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!terms.every((term) => includesTerm(haystack, term))) return false;
    }
    return true;
  });
}

export function sortMeals(meals: MealTemplate[], sort: SortKey = "default"): MealTemplate[] {
  const list = [...meals];
  if (sort === "name") return list.sort((a, b) => a.title.localeCompare(b.title));
  return list;
}

/* -------------------------------------------------------------------------- */
/*  Cross-entity search                                                       */
/* -------------------------------------------------------------------------- */

export interface SearchResults {
  articles: Article[];
  products: Product[];
  foods: Food[];
  meals: MealTemplate[];
  total: number;
}

export interface SearchOptions {
  verified?: boolean;
  evidence?: string | null;
  cost?: string | null;
  sort?: SortKey;
}

/**
 * Search across every content type at once — the search bar promises
 * "articles, products, foods…", so it has to deliver all of them.
 */
export function searchEverything(
  q: string,
  sources: {
    articles: Article[];
    products: Product[];
    foods: Food[];
    meals: MealTemplate[];
  },
  options: SearchOptions = {}
): SearchResults {
  const { verified = false, evidence, cost } = options;
  // Relevance is the sensible default for a result list; an explicit sort wins.
  const sort: SortKey = options.sort && options.sort !== "default" ? options.sort : "relevance";

  const articles = sortArticles(
    filterArticles(sources.articles, { q, evidence, cost, verified }),
    sort,
    q
  );
  const products = sortProducts(
    filterProducts(sources.products, { q, evidence, cost, verified }),
    sort,
    q
  );
  const foods = sortFoods(filterFoods(sources.foods, { q }), sort);
  const meals = sortMeals(filterMeals(sources.meals, { q }), sort);

  return {
    articles,
    products,
    foods,
    meals,
    total: articles.length + products.length + foods.length + meals.length,
  };
}
