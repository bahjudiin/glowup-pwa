"use client";

import { useSearchParams } from "next/navigation";
import type { Article } from "@/lib/types";
import { CATEGORY_BY_ID } from "@/lib/data/categories";
import { ArticleExplorer } from "@/components/article-explorer";
import { CategoryIcon } from "@/components/category-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * The home page's article feed. It follows `?category=` so the category tab bar
 * filters the library in place. The cross-entity search view lives in
 * components/search-section.tsx.
 */
export function HomeExplorer({ articles }: { articles: Article[] }) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") ?? "";
  const category = categoryId ? CATEGORY_BY_ID.get(categoryId) : undefined;

  return (
    <section className="w-full">
      {category ? (
        <Card className="overflow-hidden border border-input/50 mb-4">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <span
                className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${category.color}`}
              >
                <CategoryIcon name={category.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-lg leading-tight">{category.title}</CardTitle>
                <CardDescription>{category.subtitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : null}

      <ArticleExplorer articles={articles} />
    </section>
  );
}
