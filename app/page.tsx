import Link from "next/link";
import { Suspense } from "react";
import { CATEGORIES, CATEGORY_BY_ID } from "@/lib/data/categories";
import { ARTICLES } from "@/lib/data/articles";
import { PRODUCTS } from "@/lib/data/products";
import { SearchBar } from "@/components/search-bar";
import { CategoryTabs } from "@/components/category-tabs";
import { Filters } from "@/components/filters";
import { SortTabs } from "@/components/sort-tabs";
import { ProductCard } from "@/components/product-card";
import { HomeExplorer } from "@/components/home-explorer";
import { SearchSection } from "@/components/search-section";
import { SearchModeFlag } from "@/components/search-mode-flag";
import { Navbar } from "@/components/navbar";
import { CategoryIcon } from "@/components/category-icon";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

/** Categories that get first-class placement on the home screen. */
const FEATURED_CATEGORY_IDS = ["mens-vitality", "sleep-recovery"];

function ExplorerFallback() {
  return (
    <div className="space-y-3" aria-busy="true">
      <div className="h-20 rounded-xl border border-input/40 bg-muted/30 animate-pulse" />
      <div className="h-20 rounded-xl border border-input/40 bg-muted/30 animate-pulse" />
      <div className="h-20 rounded-xl border border-input/40 bg-muted/30 animate-pulse" />
    </div>
  );
}

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter(
    (p) => p.essential === "essential" || p.essential === "high-value"
  ).slice(0, 4);

  const featuredCategories = FEATURED_CATEGORY_IDS.map((id) => CATEGORY_BY_ID.get(id)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <SearchModeFlag />
      </Suspense>

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

        {/* Sort + filters apply to the search results too, so they stay put */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 mb-4">
          <Suspense fallback={<div className="h-10 w-full max-w-md" />}>
            <Filters />
          </Suspense>
          <div className="flex-1">
            <Suspense fallback={<div className="h-10 w-full" />}>
              <SortTabs />
            </Suspense>
          </div>
        </div>

        {/* Search results take over the page when ?q= is set */}
        <Suspense fallback={null}>
          <SearchSection />
        </Suspense>

        <div className="home-chrome">
          {/* Featured decks — the newest and most important sections first */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Featured decks</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-input bg-card p-5 hover:border-primary/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${cat.color}`}
                    >
                      <CategoryIcon name={cat.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-tight">{cat.title}</CardTitle>
                      <CardDescription className="mt-0.5">{cat.subtitle}</CardDescription>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(cat.subTabs ?? []).map((sub) => (
                      <Badge key={sub.id} variant="outline" className="text-[10px] px-2 py-0.5">
                        {sub.title}
                      </Badge>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Open deck
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* All categories */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All categories</h2>
              <Link href="/categories" className="text-xs text-primary hover:underline">
                Index
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="group rounded-2xl border border-input bg-card p-4 hover:border-primary/50 transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${cat.color}`}
                  >
                    <CategoryIcon name={cat.icon} className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm">{cat.title}</CardTitle>
                  <CardDescription className="text-xs">{cat.subtitle}</CardDescription>
                </Link>
              ))}
            </div>
          </section>

          {/* Article feed — honours ?category= and ?tab= */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Library</h2>
            <Suspense fallback={<ExplorerFallback />}>
              <HomeExplorer articles={ARTICLES} />
            </Suspense>
          </section>

          {/* Featured products */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Top products</h2>
              <Link href="/products" className="text-xs text-primary hover:underline">
                View directory
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
