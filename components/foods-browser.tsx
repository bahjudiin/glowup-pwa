"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FOODS, FOOD_GROUPS } from "@/lib/data/foods";
import { filterFoods, sortFoods, type SortKey } from "@/lib/data/queries";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { FoodRow } from "@/components/food-row";
import { Filters } from "@/components/filters";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Flame, Egg } from "lucide-react";

const ICONS: Record<string, React.ComponentType<any>> = {
  all: Apple,
  vegetables: Flame,
  fruits: Flame,
  protein: Egg,
};

export function FoodsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const group = searchParams.get("group") ?? "";
  const q = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ?? "default") as SortKey;

  const visible = useMemo(() => sortFoods(filterFoods(FOODS, { q, group }), sort), [q, group, sort]);

  const setGroup = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!id || id === "all") params.delete("group");
    else params.set("group", id);
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
            <CardTitle className="text-xl">High-volume, low-calorie foods</CardTitle>
            <CardDescription>
              Foods ranked by volume per calorie, with satiety evidence and Mogadishu
              cost/availability. Values are per 100 g from USDA FoodData Central SR Legacy.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-4">
          <div role="tablist" aria-label="Food groups" className="flex gap-2 min-w-max">
            {FOOD_GROUPS.map((g) => {
              const Icon = ICONS[g.id] || Apple;
              const isActive = g.id === "all" ? !group : group === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setGroup(g.id)}
                  className={
                    isActive
                      ? "flex items-center rounded-xl border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground whitespace-nowrap"
                      : "flex items-center rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
                  }
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <Suspense fallback={<div className="h-10 w-full max-w-md" />}>
            <Filters />
          </Suspense>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          Showing {visible.length} of {FOODS.length} foods
        </p>

        <Card className="border border-input/50 overflow-hidden">
          {visible.length > 0 ? (
            visible.map((f) => <FoodRow key={f.id} food={f} />)
          ) : (
            <div className="p-8 text-center">
              <CardDescription>No foods match your search.</CardDescription>
            </div>
          )}
        </Card>

        <div className="mt-8">
          <Link href="/categories/nutrition-foods" className="text-xs text-primary hover:underline">
            Read the nutrition articles →
          </Link>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
