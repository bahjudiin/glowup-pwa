import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORY_BY_ID } from "@/lib/data/categories";
import { ARTICLES_BY_CATEGORY } from "@/lib/data/articles";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { CategoryTabs } from "@/components/category-tabs";
import { Filters } from "@/components/filters";
import { SortTabs } from "@/components/sort-tabs";
import { ArticleExplorer } from "@/components/article-explorer";
import { CategoryIcon } from "@/components/category-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return Array.from(CATEGORY_BY_ID.keys()).map((slug) => ({ slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORY_BY_ID.get(slug);

  if (!category) {
    notFound();
  }

  const articles = ARTICLES_BY_CATEGORY.get(category.id) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-4">
        <Suspense fallback={<div className="mx-auto h-10 max-w-md" />}>
          <SearchBar className="mx-auto" />
        </Suspense>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tier 2 — category tabs */}
        <Suspense fallback={<div className="h-10 w-full" />}>
          <CategoryTabs />
        </Suspense>

        <Card className="overflow-hidden border border-input/50 mb-6 mt-4">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${category.color} shadow-lg`}
              >
                <CategoryIcon name={category.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-xl leading-tight">{category.title}</CardTitle>
                <CardDescription>{category.subtitle}</CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.fileIds.map((fid) => (
                <Badge key={fid} variant="outline" className="text-[10px] px-2 py-1">
                  File {fid}
                </Badge>
              ))}
              <Badge variant="outline" className="text-[10px] px-2 py-1">
                {articles.length} {articles.length === 1 ? "article" : "articles"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <Suspense fallback={<div className="h-10 w-full max-w-md" />}>
            <Filters />
          </Suspense>
          <div className="flex-1">
            <Suspense fallback={<div className="h-10 w-full" />}>
              <SortTabs />
            </Suspense>
          </div>
        </div>

        {/* Tier 3 — sub-tabs + the live article list */}
        <Suspense
          fallback={
            <div className="space-y-3" aria-busy="true">
              <div className="h-20 rounded-xl border border-input/40 bg-muted/30 animate-pulse" />
              <div className="h-20 rounded-xl border border-input/40 bg-muted/30 animate-pulse" />
            </div>
          }
        >
          <ArticleExplorer articles={articles} categoryId={category.id} />
        </Suspense>
      </div>

      <Navbar />
    </div>
  );
}
