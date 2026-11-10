"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MEAL_TEMPLATES, SHOPPING_LIST } from "@/lib/data/meal-templates";
import { filterMeals } from "@/lib/data/queries";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { MealCard } from "@/components/meal-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, List } from "lucide-react";

const TABS = [
  { id: "all", label: "All" },
  { id: "Breakfast", label: "Breakfast" },
  { id: "Lunch/Dinner", label: "Lunch / Dinner" },
  { id: "Snack", label: "Snacks" },
] as const;

export function MealsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") ?? "";
  const q = searchParams.get("q") ?? "";

  const visible = useMemo(() => filterMeals(MEAL_TEMPLATES, { q, type }), [q, type]);

  const setType = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!id || id === "all") params.delete("type");
    else params.set("type", id);
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
            <CardTitle className="text-xl">Meal templates &amp; food list</CardTitle>
            <CardDescription>
              Ready-to-eat templates hitting 35–55 g protein and 8–15 g fibre per meal. Pick one
              breakfast, two lunches/dinners and one snack; rotate weekly.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-4">
          <div role="tablist" aria-label="Meal types" className="flex gap-2 min-w-max">
            {TABS.map((t) => {
              const isActive = t.id === "all" ? !type : type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setType(t.id)}
                  className={
                    isActive
                      ? "flex items-center rounded-xl border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground whitespace-nowrap"
                      : "flex items-center rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
                  }
                >
                  <Utensils className="mr-2 h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          Showing {visible.length} of {MEAL_TEMPLATES.length} templates
        </p>

        <div className="grid gap-3">
          {visible.map((m) => (
            <MealCard key={m.id} meal={m} />
          ))}
          {visible.length === 0 && (
            <Card className="col-span-full border border-input/50 p-12 text-center">
              <CardDescription>No meals match your search.</CardDescription>
            </Card>
          )}
        </div>

        {/* Shopping list */}
        <Card className="border border-input/50 mt-10 overflow-hidden">
          <CardHeader className="pb-4 flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Weekly shopping list</CardTitle>
              <CardDescription>
                The 4-item rule: protein, frozen vegetables, fruit, fibre base.
              </CardDescription>
            </div>
            <List className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Protein", "Fibre/Veg", "Fats/Flavour"].map((cat) => (
                <div
                  key={cat}
                  className="rounded-xl border border-input/50 p-4 bg-background/30"
                >
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {cat}
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    {SHOPPING_LIST.filter((i) => i.category === cat).map((i) => (
                      <li key={i.id} className="flex justify-between items-center">
                        <span>{i.item}</span>
                        <span className="font-medium">{i.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-input/50">
            <Badge variant="outline" className="text-xs px-2.5 py-1">
              Repetition is a feature — eat a small rotation, vary one item per week
            </Badge>
          </CardFooter>
        </Card>
      </div>

      <Navbar />
    </div>
  );
}
