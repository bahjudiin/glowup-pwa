"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS, FILTER_CATEGORIES, ESSENTIAL_FILTERS } from "@/lib/data/products";
import { filterProducts, sortProducts, type SortKey } from "@/lib/data/queries";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { Filters } from "@/components/filters";
import { SortTabs } from "@/components/sort-tabs";
import { ProductCard } from "@/components/product-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, ShieldCheck, X, Pill } from "lucide-react";

const ICONS: Record<string, React.ComponentType<any>> = {
  all: DollarSign,
  Fibre: Pill,
  Ergogenic: Pill,
  Micronutrient: Pill,
  Protein: ShoppingCart,
  Skincare: ShieldCheck,
  Tool: ShieldCheck,
  Equipment: ShieldCheck,
  "Health Device": ShieldCheck,
  Footwear: ShieldCheck,
};

export function ProductsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const essential = searchParams.get("essential") ?? "";
  const q = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ?? "default") as SortKey;
  const evidence = searchParams.get("evidence") ?? "";
  const cost = searchParams.get("cost") ?? "";
  const verified = searchParams.get("verified") === "true";

  const visible = useMemo(
    () =>
      sortProducts(
        filterProducts(PRODUCTS, { q, category, essential, evidence, cost, verified }),
        sort,
        q
      ),
    [q, category, essential, evidence, cost, verified, sort]
  );

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-4">
        <Suspense fallback={<div className="mx-auto h-10 max-w-md" />}>
          <SearchBar className="mx-auto" />
        </Suspense>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <Card className="border border-input/50 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Product Directory</CardTitle>
            <CardDescription>
              Verified links, prices &amp; cost-per-serving. Prices marked ✅ were checked live on
              1 Nov 2026 from iHerb; everything else is a marketplace search link.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Product-category tabs */}
        <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-4">
          <div role="tablist" aria-label="Product categories" className="flex gap-2 min-w-max">
            {FILTER_CATEGORIES.map((c) => {
              const Icon = ICONS[c.id] || DollarSign;
              const isActive = c.id === "all" ? !category : category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setParam("category", c.id)}
                  className={
                    isActive
                      ? "flex items-center rounded-xl border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground whitespace-nowrap"
                      : "flex items-center rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
                  }
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Value tier tabs */}
        <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-4">
          <div role="tablist" aria-label="Value tiers" className="flex gap-2 min-w-max">
            {ESSENTIAL_FILTERS.map((f) => {
              const isActive = f.id === "all" ? !essential : essential === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setParam("essential", f.id)}
                  className={
                    isActive
                      ? "rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      : "rounded-full border border-input bg-background px-3 py-1 text-xs font-medium text-muted-foreground hover:text-primary"
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

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

        <p className="mb-3 text-xs text-muted-foreground">
          Showing {visible.length} of {PRODUCTS.length} products
          {verified ? " (verified prices only)" : ""}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {visible.length === 0 && (
            <Card className="col-span-full border border-input/50 p-12 text-center">
              <CardDescription>No products match your filters.</CardDescription>
            </Card>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between rounded-xl border border-input/50 p-4">
          <Badge variant="outline" className="text-xs">
            Prices are a cost ranking, not a quote
          </Badge>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <X className="h-3 w-3" /> Reset directory
          </Link>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
