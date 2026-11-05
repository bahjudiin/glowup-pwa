import { MEAL_TEMPLATES, MEALS_BY_TYPE, SHOPPING_LIST } from "@/lib/data/meal-templates";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { MealCard } from "@/components/meal-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Utensils, List, ShoppingCart } from "lucide.react";

const TABS = [
  { id: "all", label: "All", icon: Utensils },
  { id: "Breakfast", label: "Breakfast", icon: Utensils },
  { id: "Lunch/Dinner", label: "Lunch / Dinner", icon: Utensils },
  { id: "Snack", label: "Snacks", icon: Utensils },
] as const;

export default function MealsPage() {
  const [activeType, setActiveType] = useState("all");

  const meals =
    activeType === "all"
      ? MEAL_TEMPLATES
      : MEALS_BY_TYPE.get(activeType) || [];

  return (
    <div className="min-h-screen bg-background">
      <SearchBar className="mx-auto" />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Card className="border border-input/50 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Meal templates &amp; food list</CardTitle>
            <CardDescription>
              Ready-to-eat templates hitting 35–55 g protein and 8–15 g fibre per meal.
              Pick one breakfast, two lunches/dinners and one snack; rotate weekly.
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="all" onValueChange={setActiveType}>
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="px-4 py-2">
                <t.icon className="mr-2 h-4 w-4" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-3 mt-6">
          {meals.map((m) => (
            <MealCard key={m.id} meal={m} />
          ))}
          {meals.length === 0 && (
            <Card className="col-span-full border border-input/50 p-12 text-center">
              <CardDescription>No meals in this category.</CardDescription>
            </Card>
          )}
        </div>

        {/* Shopping list */}
        <Card className="border border-input/50 mt-10 overflow-hidden">
          <CardHeader className="pb-4 flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Weekly shopping list</CardTitle>
              <CardDescription>The 4-item rule: protein, frozen vegetables, fruit, fibre base.</CardDescription>
            </div>
            <List className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Protein", "Fibre/Veg", "Fats/Flavour"].map((cat) => (
                <div key={cat} className="rounded-xl border border-input/50 p-4 bg-background/30">
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
