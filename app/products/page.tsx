import Link from "next/link";
import { PRODUCTS, FILTER_CATEGORIES, ESSENTIAL_FILTERS } from "@/lib/data/products";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { Filters } from "@/components/filters";
import { SortTabs } from "@/components/sort-tabs";
import { ProductCard } from "@/components/product-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { DollarSign, ShoppingCart, ShieldCheck, X, Capsule } from "lucide.react";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const ICONS: Record<string, React.ComponentType<any>> = {
    all: DollarSign,
    Fibre: Capsule,
    Ergogenic: Capsule,
    Micronutrient: Capsule,
    Protein: ShoppingCart,
    Skincare: ShieldCheck,
    Tool: ShieldCheck,
    Equipment: ShieldCheck,
    "Health Device": ShieldCheck,
    Footwear: ShieldCheck,
  };

  const filtered = PRODUCTS.filter((p) => activeTab === "all" || p.category === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <SearchBar className="mx-auto" />
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

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            {FILTER_CATEGORIES.map((c) => {
              const Icon = ICONS[c.id] || DollarSign;
              return (
                <TabsTrigger key={c.id} value={c.id} className="px-3 py-2">
                  <Icon className="mr-2 h-4 w-4" />
                  {c.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Filters />
          </TabsContent>
          {FILTER_CATEGORIES.slice(1).map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-4">
              <Filters />
            </TabsContent>
          ))}
        </Tabs>

        <SortTabs />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filtered.length === 0 && (
            <Card className="col-span-full border border-input/50 p-12 text-center">
              <CardDescription>No products match your filters.</CardDescription>
            </Card>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
}
