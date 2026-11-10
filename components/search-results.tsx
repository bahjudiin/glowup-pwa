"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ARTICLES } from "@/lib/data/articles";
import { PRODUCTS } from "@/lib/data/products";
import { FOODS } from "@/lib/data/foods";
import { MEAL_TEMPLATES } from "@/lib/data/meal-templates";
import { searchEverything, type SortKey } from "@/lib/data/queries";
import { ArticleCard } from "@/components/article-card";
import { ProductCard } from "@/components/product-card";
import { FoodRow } from "@/components/food-row";
import { MealCard } from "@/components/meal-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Global search across every content type: articles, products, foods and meals.
 * The search bar promises all four, so the results view has to deliver all four.
 */
export function SearchResults({ query }: { query: string }) {
  const searchParams = useSearchParams();
  const evidence = searchParams.get("evidence") ?? "";
  const cost = searchParams.get("cost") ?? "";
  const verified = searchParams.get("verified") === "true";
  const sort = (searchParams.get("sort") ?? "default") as SortKey;

  const results = useMemo(
    () =>
      searchEverything(
        query,
        {
          articles: ARTICLES,
          products: PRODUCTS,
          foods: FOODS,
          meals: MEAL_TEMPLATES,
        },
        { evidence, cost, verified, sort }
      ),
    [query, evidence, cost, verified, sort]
  );

  if (!query.trim()) return null;

  return (
    <section className="w-full" aria-live="polite">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Results for “{query}”
        </h2>
        <Badge variant="outline" className="text-[10px] px-2 py-1">
          {results.total} {results.total === 1 ? "result" : "results"}
        </Badge>
      </div>

      {results.total === 0 ? (
        <Card className="border border-input/50 p-12 text-center">
          <CardDescription>
            Nothing matched “{query}”. Try a shorter term, or browse the categories.
          </CardDescription>
        </Card>
      ) : null}

      {results.articles.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Articles ({results.articles.length})
          </h3>
          <div className="grid gap-3">
            {results.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ) : null}

      {results.products.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Products ({results.products.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : null}

      {results.foods.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Foods ({results.foods.length})
          </h3>
          <Card className="border border-input/50 overflow-hidden">
            {results.foods.map((food) => (
              <FoodRow key={food.id} food={food} />
            ))}
          </Card>
        </div>
      ) : null}

      {results.meals.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Meals ({results.meals.length})
          </h3>
          <div className="grid gap-3">
            {results.meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
