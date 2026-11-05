"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CATEGORIES } from "@/lib/data/categories";
import { cn } from "@/components/ui/button";

export function CategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCategory = searchParams.get("category") || "all";

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("category");
    } else {
      params.set("category", id);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2 scrollbar-hide custom-scrollbar">
      <div className="flex gap-2 px-4 min-w-max">
        <button
          onClick={() => handleSelect("all")}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-input bg-background text-muted-foreground hover:text-primary hover:bg-accent"
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleSelect(cat.id);
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "border-input bg-background text-muted-foreground hover:text-primary hover:bg-accent"
            )}
          >
            <span className={`h-2 w-2 rounded-full ${cn(
              activeCategory === cat.id ? "bg-primary-foreground" : "bg-muted"
            )}`} />
            {cat.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
