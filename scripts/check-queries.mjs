#!/usr/bin/env node
/**
 * Verifies the sort / filter / search logic in lib/data/queries.ts.
 *
 * Run with `npm run test:queries`. Exits non-zero on the first failed
 * expectation so the behaviour cannot silently regress.
 */
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const base = path.join(ROOT, specifier.slice(2));
      const candidates = [
        `${base}.ts`,
        `${base}.tsx`,
        path.join(base, "index.ts"),
        path.join(base, "index.tsx"),
      ];
      const found = candidates.find((candidate) => fs.existsSync(candidate));
      if (found) return nextResolve(pathToFileURL(found).href, context);
    }
    return nextResolve(specifier, context);
  },
});

const queries = await import("../lib/data/queries.ts");
const { ARTICLES } = await import("../lib/data/articles.ts");
const { CATEGORIES } = await import("../lib/data/categories.ts");
const { PRODUCTS } = await import("../lib/data/products.ts");
const { FOODS } = await import("../lib/data/foods.ts");
const { MEAL_TEMPLATES } = await import("../lib/data/meal-templates.ts");
const { renderMarkdown } = await import("../lib/markdown.ts");

let failures = 0;
let checks = 0;

function expect(label, condition, detail = "") {
  checks += 1;
  if (condition) {
    process.stdout.write(`  ok   ${label}\n`);
  } else {
    failures += 1;
    process.stdout.write(`  FAIL ${label}${detail ? ` — ${detail}` : ""}\n`);
  }
}

const ids = (list) => list.map((a) => a.id);

process.stdout.write("\nfilterArticles\n");
expect(
  "category filter narrows to one category",
  queries.filterArticles(ARTICLES, { category: "mens-vitality" }).length === 5
);
expect(
  "sub-tab filter narrows to one sub-tab",
  ids(queries.filterArticles(ARTICLES, { category: "mens-vitality", subTab: "fertility" })).join() ===
    "big-d-fertility"
);
expect(
  "evidence filter narrows to one grade",
  queries.filterArticles(ARTICLES, { evidence: "High" }).every((a) => a.evidenceGrade === "High")
);
expect(
  "cost filter narrows to one tier",
  queries.filterArticles(ARTICLES, { cost: "Free" }).every((a) => a.costTier === "Free")
);
expect(
  "verified-prices filter narrows to the price-bearing section",
  queries.filterArticles(ARTICLES, { verified: true }).every((a) => a.categoryId === "products") &&
    queries.filterArticles(ARTICLES, { verified: true }).length > 0
);
expect(
  "free-text search matches article body text",
  queries.filterArticles(ARTICLES, { q: "shilajit" }).some((a) => a.id === "big-d-fertility")
);
expect(
  "free-text search matches tags",
  queries.filterArticles(ARTICLES, { q: "apnea" }).some((a) => a.id === "sleep-recovery")
);
expect(
  "search + category + sub-tab compose",
  ids(
    queries.filterArticles(ARTICLES, {
      q: "sperm",
      category: "mens-vitality",
      subTab: "fertility",
    })
  ).join() === "big-d-fertility"
);

process.stdout.write("\nsortArticles\n");
const evidenceOrder = ids(queries.sortArticles(ARTICLES, "evidence"));
expect(
  "evidence sort puts a High-evidence article first",
  ARTICLES.find((a) => a.id === evidenceOrder[0]).evidenceGrade === "High"
);
const evidenceRanks = evidenceOrder.map((id) => queries.EVIDENCE_ORDER[ARTICLES.find((a) => a.id === id).evidenceGrade]);
expect(
  "evidence sort is monotonic",
  evidenceRanks.every((r, i) => i === 0 || evidenceRanks[i - 1] <= r)
);
const costOrder = ids(queries.sortArticles(ARTICLES, "cost"));
const costRanks = costOrder.map((id) => queries.COST_ORDER[ARTICLES.find((a) => a.id === id).costTier]);
expect(
  "cost sort is monotonic (Free first)",
  costRanks.every((r, i) => i === 0 || costRanks[i - 1] <= r)
);
expect(
  "name sort is alphabetical by title",
  queries.sortArticles(ARTICLES, "name").every(
    (a, i, arr) => i === 0 || arr[i - 1].title.localeCompare(a.title) <= 0
  )
);
expect(
  "relevance sort puts the title match first",
  queries.sortArticles(queries.filterArticles(ARTICLES, { q: "shilajit" }), "relevance", "shilajit")[0]
    .id === "big-d-fertility"
);
expect(
  "default sort keeps the curated order",
  ids(queries.sortArticles(ARTICLES, "default")).join() === ids(ARTICLES).join()
);

process.stdout.write("\nproducts / foods / meals\n");
expect(
  "product category filter works",
  queries.filterProducts(PRODUCTS, { category: "Fibre" }).every((p) => p.category === "Fibre") &&
    queries.filterProducts(PRODUCTS, { category: "Fibre" }).length > 0
);
expect(
  "verified-price filter works",
  queries.filterProducts(PRODUCTS, { verified: true }).every((p) => p.priceVerified) &&
    queries.filterProducts(PRODUCTS, { verified: true }).length <
      queries.filterProducts(PRODUCTS, { verified: false }).length
);
expect(
  "product cost band filter works",
  queries.filterProducts(PRODUCTS, { cost: "Very low" }).every((p) => p.price !== null && p.price <= 10)
);
expect(
  "food group filter works",
  queries.filterFoods(FOODS, { group: "vegetables" }).every((f) => f.group === "Vegetables")
);
expect(
  "meal type filter works",
  queries.filterMeals(MEAL_TEMPLATES, { type: "Breakfast" }).every((m) => m.type === "Breakfast")
);

process.stdout.write("\ncross-entity search\n");
const results = queries.searchEverything("shilajit", {
  articles: ARTICLES,
  products: PRODUCTS,
  foods: FOODS,
  meals: MEAL_TEMPLATES,
});
expect("search finds the article", results.articles.some((a) => a.id === "big-d-fertility"));
expect("search reports a total", results.total === results.articles.length + results.products.length + results.foods.length + results.meals.length);
const proteinResults = queries.searchEverything("protein", {
  articles: ARTICLES,
  products: PRODUCTS,
  foods: FOODS,
  meals: MEAL_TEMPLATES,
});
expect("search spans articles, products, foods and meals",
  proteinResults.articles.length > 0 &&
  proteinResults.products.length > 0 &&
  proteinResults.foods.length > 0 &&
  proteinResults.meals.length > 0
);

process.stdout.write("\nmarkdown renderer\n");
const html = renderMarkdown("## Heading\n\nSome **bold** and *italic* and `code`.\n\n- one\n- two\n\n> quote\n\n---\n\n1. first\n2. second\n");
expect("renders headings", html.includes("<h2>Heading</h2>"));
expect("renders bold", html.includes("<strong>bold</strong>"));
expect("renders italic", html.includes("<em>italic</em>"));
expect("renders code", html.includes("<code>code</code>"));
expect("renders unordered lists", html.includes("<ul><li>one</li><li>two</li></ul>"));
expect("renders ordered lists", html.includes("<ol><li>first</li><li>second</li></ol>"));
expect("renders blockquotes", html.includes("<blockquote>"));
expect("renders horizontal rules", html.includes("<hr />"));
const escaped = renderMarkdown("<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>");
expect("escapes raw html", !escaped.includes("<script>") && !escaped.includes("<img"));
expect("escapes quotes", escaped.includes("&lt;script&gt;"));

process.stdout.write("\n" + "-".repeat(64) + "\n");
if (failures) {
  process.stdout.write(`FAILED — ${failures} of ${checks} expectations failed.\n`);
  process.exit(1);
}
process.stdout.write(`PASSED — ${checks} expectations, no failures.\n`);
process.exit(0);
