#!/usr/bin/env node
/**
 * GlowUp data-consistency check.
 *
 * Run with `npm test`. Exits non-zero as soon as any invariant is violated so
 * CI can rely on the exit code.
 *
 * The data files are TypeScript, so they are loaded through Node's native
 * type stripping. A module-resolution hook maps the `@/…` path alias (used all
 * over the data files) onto real files on disk.
 */
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";
import * as lucide from "lucide-react";

const ROOT = path.resolve(import.meta.dirname, "..");

/* -------------------------------------------------------------------------- */
/*  Module resolution for the `@/` alias                                      */
/* -------------------------------------------------------------------------- */

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
      if (found) {
        return nextResolve(pathToFileURL(found).href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

/* -------------------------------------------------------------------------- */
/*  Tiny assertion harness                                                    */
/* -------------------------------------------------------------------------- */

const failures = [];
const notes = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function section(title) {
  process.stdout.write(`\n${title}\n`);
}

/* -------------------------------------------------------------------------- */
/*  Load the data                                                             */
/* -------------------------------------------------------------------------- */

const categoriesModule = await import("../lib/data/categories.ts");
const articlesModule = await import("../lib/data/articles.ts");
const iconMapModule = await import("../components/icon-map.ts");

const CATEGORIES = categoriesModule.CATEGORIES;
const CATEGORY_BY_ID = categoriesModule.CATEGORY_BY_ID;
const SUBTABS_BY_CATEGORY = categoriesModule.SUBTABS_BY_CATEGORY;
const ARTICLES = articlesModule.ARTICLES;
const ARTICLE_BY_ID = articlesModule.ARTICLE_BY_ID;
const ICON_ALIASES = iconMapModule.ICON_ALIASES ?? {};

section("Loading data");
process.stdout.write(
  `  ${CATEGORIES.length} categories, ${ARTICLES.length} articles, ${SUBTABS_BY_CATEGORY.size} categories with sub-tabs\n`
);

/* -------------------------------------------------------------------------- */
/*  1. Every category has at least one sub-tab                                */
/* -------------------------------------------------------------------------- */

section("1. Every category has at least one sub-tab");
for (const category of CATEGORIES) {
  check(
    Array.isArray(category.subTabs) && category.subTabs.length > 0,
    `Category "${category.id}" has no sub-tabs`
  );
}
process.stdout.write(
  `  checked ${CATEGORIES.length} categories (${failures.length} failure(s) so far)\n`
);

/* -------------------------------------------------------------------------- */
/*  2. An article's subTabId belongs to its own category                       */
/* -------------------------------------------------------------------------- */

section("2. Article subTabId belongs to its own category");
for (const article of ARTICLES) {
  if (!article.subTabId) {
    check(false, `Article "${article.id}" has no subTabId`);
    continue;
  }
  const category = CATEGORY_BY_ID.get(article.categoryId);
  check(
    Boolean(category),
    `Article "${article.id}" points at unknown category "${article.categoryId}"`
  );
  if (!category) continue;
  const subTabIds = (category.subTabs ?? []).map((s) => s.id);
  check(
    subTabIds.includes(article.subTabId),
    `Article "${article.id}" has subTabId "${article.subTabId}" which is not a sub-tab of category "${article.categoryId}"`
  );
}
process.stdout.write(`  checked ${ARTICLES.length} articles\n`);

/* -------------------------------------------------------------------------- */
/*  3. Every articleId referenced by a sub-tab exists                          */
/* -------------------------------------------------------------------------- */

section("3. Sub-tab articleIds exist");
for (const category of CATEGORIES) {
  for (const subTab of category.subTabs ?? []) {
    check(Array.isArray(subTab.articleIds), `Sub-tab "${subTab.id}" has no articleIds array`);
    for (const articleId of subTab.articleIds ?? []) {
      check(
        ARTICLE_BY_ID.has(articleId),
        `Sub-tab "${category.id}/${subTab.id}" references unknown article "${articleId}"`
      );
    }
  }
}
process.stdout.write("  checked every sub-tab reference\n");

/* -------------------------------------------------------------------------- */
/*  4. Every article appears in exactly one sub-tab of its category            */
/* -------------------------------------------------------------------------- */

section("4. Every article is in exactly one sub-tab of its category");
for (const category of CATEGORIES) {
  const subTabs = category.subTabs ?? [];
  const counts = new Map();

  for (const subTab of subTabs) {
    for (const articleId of subTab.articleIds ?? []) {
      counts.set(articleId, (counts.get(articleId) ?? 0) + 1);
    }
  }

  for (const [articleId, count] of counts) {
    check(
      count === 1,
      `Article "${articleId}" appears ${count} time(s) across the sub-tabs of category "${category.id}" (expected exactly 1)`
    );
    const article = ARTICLE_BY_ID.get(articleId);
    if (article) {
      check(
        article.categoryId === category.id,
        `Article "${articleId}" is listed under category "${category.id}" but declares categoryId "${article.categoryId}"`
      );
    }
  }

  const categoryArticles = ARTICLES.filter((a) => a.categoryId === category.id);
  for (const article of categoryArticles) {
    check(
      counts.has(article.id),
      `Article "${article.id}" (category "${category.id}") is not covered by any sub-tab of that category`
    );
  }
}
process.stdout.write("  checked coverage in both directions\n");

/* -------------------------------------------------------------------------- */
/*  5. Every icon name resolves to a real lucide-react export                  */
/* -------------------------------------------------------------------------- */

section("5. Icon names resolve to lucide-react exports");
const iconNames = new Set();
for (const category of CATEGORIES) {
  if (category.icon) iconNames.add(category.icon);
  for (const subTab of category.subTabs ?? []) {
    if (subTab.icon) iconNames.add(subTab.icon);
  }
}
for (const article of ARTICLES) {
  if (article.icon) iconNames.add(article.icon);
}

const aliased = [];
for (const name of iconNames) {
  if (name in lucide) continue;
  const alias = ICON_ALIASES[name];
  if (alias && Object.values(lucide).includes(alias)) {
    aliased.push(name);
    continue;
  }
  check(false, `Icon "${name}" is not a lucide-react export and has no valid alias`);
}

if (aliased.length) {
  notes.push(
    `lucide-react ships no "${aliased.join('" / "')}" icon — mapped via ICON_ALIASES to a real lucide component.`
  );
  process.stdout.write(`  ${aliased.length} icon(s) resolve through documented aliases: ${aliased.join(", ")}\n`);
}
process.stdout.write(`  checked ${iconNames.size} distinct icon names\n`);

/* -------------------------------------------------------------------------- */
/*  6. SUBTABS_BY_CATEGORY matches CATEGORIES[].subTabs                        */
/* -------------------------------------------------------------------------- */

section("6. SUBTABS_BY_CATEGORY is consistent with CATEGORIES[].subTabs");
for (const category of CATEGORIES) {
  const fromMap = SUBTABS_BY_CATEGORY.get(category.id);
  const fromCategory = category.subTabs ?? [];
  check(
    Array.isArray(fromMap),
    `SUBTABS_BY_CATEGORY is missing category "${category.id}"`
  );
  if (!fromMap) continue;
  check(
    fromMap.length === fromCategory.length,
    `SUBTABS_BY_CATEGORY["${category.id}"] has ${fromMap.length} entries but the category has ${fromCategory.length}`
  );
  check(
    fromMap.every((s, i) => s.id === fromCategory[i]?.id),
    `SUBTABS_BY_CATEGORY["${category.id}"] does not match the category's sub-tabs`
  );
}
check(
  SUBTABS_BY_CATEGORY.size === CATEGORIES.filter((c) => (c.subTabs ?? []).length > 0).length,
  `SUBTABS_BY_CATEGORY has ${SUBTABS_BY_CATEGORY.size} entries but ${CATEGORIES.filter((c) => (c.subTabs ?? []).length > 0).length} categories have sub-tabs`
);
process.stdout.write("  checked the index against the source of truth\n");

/* -------------------------------------------------------------------------- */
/*  Report                                                                     */
/* -------------------------------------------------------------------------- */

process.stdout.write("\n" + "-".repeat(64) + "\n");

if (notes.length) {
  for (const note of notes) process.stdout.write(`note: ${note}\n`);
}

if (failures.length) {
  process.stdout.write(`FAILED — ${failures.length} problem(s) across ${checks} assertions:\n`);
  for (const failure of failures) process.stdout.write(`  x ${failure}\n`);
  process.exit(1);
}

process.stdout.write(`PASSED — ${checks} assertions, no problems found.\n`);
process.exit(0);
