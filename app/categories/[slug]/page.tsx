import { notFound } from "next/navigation";
import { CATEGORIES, CATEGORY_BY_ID } from "@/lib/data/categories";
import { ARTICLES, ARTICLES_BY_CATEGORY } from "@/lib/data/articles";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { Filters } from "@/components/filters";
import { SortTabs } from "@/components/sort-tabs";
import { ArticleCard } from "@/components/article-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/button";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORY_BY_ID.get(slug);

  if (!category) {
    notFound();
  }

  // Read search params from the page via a client component approach:
  // We pass through to a client component that handles filtering/sorting.
  return (
    <div className="min-h-screen bg-background">
      <SearchBar className="mx-auto" />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <CategoryHeader category={category} />
        <Filters />
        <SortTabs />
        <ArticlesList categoryId={category.id} />
      </div>
      <Navbar />
    </div>
  );
}

function CategoryHeader({ category }: { category: typeof CATEGORIES[number] }) {
  return (
    <Card className="overflow-hidden border border-input/50 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${category.color} shadow-lg`}
          >
            {/* icon rendered via text fallback */}
            {category.title.charAt(0)}
          </span>
          <div>
            <CardTitle className="text-xl">{category.title}</CardTitle>
            <CardDescription>{category.subtitle}</CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.fileIds.map((fid) => (
            <Badge key={fid} variant="outline" className="text-[10px] px-2 py-1">
              File {fid}
            </Badge>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}

function ArticlesList({ categoryId }: { categoryId: string }) {
  const articles = ARTICLES_BY_CATEGORY.get(categoryId) || [];

  if (articles.length === 0) {
    return (
      <Card className="border border-input/50 p-12 text-center">
        <CardDescription>No articles in this category yet.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
