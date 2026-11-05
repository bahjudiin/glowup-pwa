import { FOODS, FOOD_GROUPS } from "@/lib/data/foods";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { FoodRow } from "@/components/food-row";
import { Filters } from "@/components/filters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Apple, Flame, Egg } from "lucide.react";

const ICONS: Record<string, React.ComponentType<any>> = {
  all: Apple,
  vegetables: Flame,
  fruits: Flame,
  protein: Egg,
};

export default function FoodsPage() {
  const [activeGroup, setActiveGroup] = useState("all");

  const filtered =
    activeGroup === "all"
      ? FOODS
      : FOODS.filter((f) => f.group.toLowerCase() === activeGroup);

  return (
    <div className="min-h-screen bg-background">
      <SearchBar className="mx-auto" />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Card className="border border-input/50 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">High-volume, low-calorie foods</CardTitle>
            <CardDescription>
              Foods ranked by volume per calorie, with satiety evidence and Mogadishu cost/availability.
              Values are per 100 g from USDA FoodData Central SR Legacy.
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="all" onValueChange={setActiveGroup}>
          <TabsList className="grid w-full grid-cols-2 gap-1 text-xs border-b border-input/50 pb-1 mb-4">
            {FOOD_GROUPS.map((g) => {
              const Icon = ICONS[g.id] || Apple;
              return (
                <TabsTrigger
                  key={g.id}
                  value={g.id}
                  className="px-3 py-2"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {g.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {FOOD_GROUPS.map((g) => (
            <TabsContent
              key={g.id}
              value={g.id}
              className="space-y-0"
            >
              {filtered.length > 0 ? (
                <div>
                  {filtered.map((f) => (
                    <FoodRow key={f.id} food={f} />
                  ))}
                </div>
              ) : (
                <Card className="border border-input/50 p-8 text-center">
                  <CardDescription>No foods in this group.</CardDescription>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Navbar />
    </div>
  );
}
