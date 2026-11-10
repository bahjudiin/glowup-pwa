import Link from "next/link";
import { Suspense } from "react";
import { CATEGORIES } from "@/lib/data/categories";
import { ARTICLES_BY_CATEGORY } from "@/lib/data/articles";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { CategoryIcon } from "@/components/category-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Categories — GlowUp",
  description:
    "Every category in the GlowUp research library: fat loss, muscle, nutrition, supplements, sleep, Big D vitality, longevity, maintenance, myths and the master summary.",
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-4">
        <Suspense fallback={<div className="mx-auto h-10 max-w-md" />}>
          <SearchBar className="mx-auto" />
        </Suspense>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {CATEGORIES.length} sections, each split into sub-sections you can filter, sort and
            search.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((category) => {
            const articleCount = (ARTICLES_BY_CATEGORY.get(category.id) ?? []).length;
            return (
              <Card
                key={category.id}
                className="border border-input/50 hover:border-primary/50 transition-colors"
              >
                <Link href={`/categories/${category.id}`} className="block">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${category.color}`}
                      >
                        <CategoryIcon name={category.icon} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-base leading-tight">{category.title}</CardTitle>
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </div>
                        <CardDescription className="mt-1">{category.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>

                <div className="px-6 pb-5">
                  <div className="flex flex-wrap gap-1.5">
                    {(category.subTabs ?? []).map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/categories/${category.id}?tab=${sub.id}`}
                        className="inline-flex"
                      >
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5 hover:text-primary hover:border-primary/50 transition-colors"
                        >
                          {sub.title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {articleCount} {articleCount === 1 ? "article" : "articles"} ·{" "}
                    {(category.subTabs ?? []).length} sub-sections
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Navbar />
    </div>
  );
}
