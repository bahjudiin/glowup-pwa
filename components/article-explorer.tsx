"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Article } from "@/lib/types";
import { CATEGORY_BY_ID } from "@/lib/data/categories";
import { filterArticles, sortArticles, type SortKey } from "@/lib/data/queries";
import { ArticleCard } from "@/components/article-card";
import { SubTabs } from "@/components/sub-tabs";
import { Card, CardDescription } from "@/components/ui/card";

/**
 * The article list. This is a client component so it can read the live query
 * string and apply category + sub-tab + sort + filters + search together.
 *
 * `categoryId` locks the list to one category (used by /categories/[slug]).
 * Without it the list follows `?category=`, which is what the home page uses.
 */
export function ArticleExplorer({
  articles,
  categoryId,
  showSubTabs = true,
}: {
  articles: Article[];
  categoryId?: string;
  showSubTabs?: boolean;
}) {
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const paramCategory = searchParams.get("category") ?? "";
  const tabParam = searchParams.get("tab") ?? "";
  const sort = (searchParams.get("sort") ?? "default") as SortKey;
  const evidence = searchParams.get("evidence") ?? "";
  const cost = searchParams.get("cost") ?? "";
  const verified = searchParams.get("verified") === "true";

  const effectiveCategory = categoryId ?? paramCategory;
  const category = effectiveCategory ? CATEGORY_BY_ID.get(effectiveCategory) : undefined;

  // A sub-tab only applies while it belongs to the active category.
  const subTab = category?.subTabs?.some((s) => s.id === tabParam) ? tabParam : "";

  const visible = useMemo(() => {
    const filtered = filterArticles(articles, {
      q,
      category: effectiveCategory,
      subTab,
      evidence,
      cost,
      verified,
    });
    return sortArticles(filtered, sort, q);
  }, [articles, effectiveCategory, subTab, sort, q, evidence, cost, verified]);

  const activeSubTab = category?.subTabs?.find((s) => s.id === subTab);

  return (
    <div className="w-full">
      {showSubTabs && category ? (
        <div className="mb-4">
          <SubTabs categoryId={category.id} subTabs={category.subTabs} />
        </div>
      ) : null}

      <div
        role={activeSubTab ? "tabpanel" : undefined}
        id={activeSubTab ? `panel-${activeSubTab.id}` : undefined}
        aria-labelledby={activeSubTab ? `tab-${activeSubTab.id}` : undefined}
      >
        {visible.length === 0 ? (
          <Card className="border border-input/50 p-12 text-center">
            <CardDescription>
              {q
                ? `No articles match “${q}” with the current filters.`
                : "No articles match the current filters."}
            </CardDescription>
          </Card>
        ) : (
          <div className="grid gap-3">
            {visible.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
