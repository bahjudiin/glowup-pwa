"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SORT_OPTIONS, type SortKey } from "@/lib/data/queries";

/**
 * Tier-2 sort control. The selection lives in `?sort=` so it survives a
 * reload and every other query parameter (filters, search, sub-tab) is kept.
 */
export function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = (searchParams.get("sort") || "default") as SortKey;

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <Tabs value={currentSort} onValueChange={handleSelect}>
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 text-xs border-b border-input/50 pb-1">
        {SORT_OPTIONS.map((s) => (
          <TabsTrigger
            key={s.id}
            value={s.id}
            className="px-2 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {s.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
