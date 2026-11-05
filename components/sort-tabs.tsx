"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = searchParams.get("sort") || "default";

  const SORTS = [
    { id: "default", label: "Default" },
    { id: "evidence", label: "Evidence" },
    { id: "cost", label: "Cost (low → high)" },
    { id: "name", label: "Name (A→Z)" },
  ];

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "default") {
      params.delete("sort");
    } else {
      params.set("sort", id);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs defaultValue={currentSort} onValueChange={handleSelect}>
      <TabsList className="grid w-full grid-cols-2 gap-1 text-xs border-b border-input/50 pb-1">
        {SORTS.map((s) => (
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
