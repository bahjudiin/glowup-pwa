import Link from "next/link";
import { CATEGORIES } from "@/lib/data/categories";
import { ARTICLES } from "@/lib/data/articles";
import { PRODUCTS } from "@/lib/data/products";
import { SearchBar } from "@/components/search-bar";
import { CategoryTabs } from "@/components/category-tabs";
import { Filters } from "@/components/filters";
import { SortTabs } from "@/components/sort-tabs";
import { ArticleCard } from "@/components/article-card";
import { ProductCard } from "@/components/product-card";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Dumbbell, Apple, Capsule, ShoppingCart, Sparkles, Moon, Heart, ShieldCheck } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  "fat-loss": Flame,
  "muscle-training": Dumbbell,
  "nutrition-foods": Apple,
  supplements: Capsule,
  products: ShoppingCart,
  "skincare-grooming": Sparkles,
  "sleep-recovery": Moon,
  "health-longevity": Heart,
  maintenance: ShieldCheck,
  "myths-evidence": Flame,
  "master-summary": Flame,
};

export default function HomePage() {
  const featuredArticles = ARTICLES.filter((a) => a.fileId === "00" || a.fileId === "02" || a.fileId === "16");
  const featuredProducts = PRODUCTS.filter((p) => p.essential === "essential" || p.essential === "high-value").slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SearchBar className="mx-auto" />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Category tabs */}
        <CategoryTabs />

        {/* Hero / quick actions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {CATEGORIES.slice(0, 6).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Flame;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="group rounded-2xl border border-input bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" style={{ color: "currentColor" }} />
                </div>
                <CardTitle className="text-sm">{cat.title}</CardTitle>
                <CardDescription className="text-xs">{cat.subtitle}</CardDescription>
              </Link>
            );
          })}
        </div>

        {/* Featured articles */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Featured articles</h2>
            <Link href="/" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-3">
            {featuredArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
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

      <Navbar />
    </div>
  );
}
