"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/data/categories";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";

/**
 * Tier-2 navigation: the category tab bar.
 *
 * It behaves differently depending on where it is mounted, but always shows
 * the same thing:
 *   - On `/` the tab bar filters the home list via `?category=<id>`.
 *   - On `/categories/[slug]` the tab bar navigates to the sibling category
 *     route and the route drives the active state.
 *
 * Switching category always clears `?tab=` (a sub-tab id from another category
 * is meaningless) and keeps every other query parameter — sort, filters and
 * search must survive a category change.
 */
export function CategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const routeCategory = pathname.startsWith("/categories/")
    ? pathname.split("/")[2] ?? ""
    : "";
  const paramCategory = searchParams.get("category") ?? "";

  const activeCategory = routeCategory || paramCategory || "all";

  // Keep the active category visible in the horizontally scrollable bar.
  const activeRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeCategory]);

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // A sub-tab belongs to exactly one category — drop it on every change.
    params.delete("tab");

    if (id === "all") {
      params.delete("category");
      if (routeCategory) {
        // Leaving a category route: go back to the home feed.
        router.push(params.toString() ? `/?${params.toString()}` : "/", { scroll: false });
        return;
      }
    } else {
      params.set("category", id);
    }

    if (routeCategory) {
      // On a category route the path is the source of truth.
      params.delete("category");
      const query = params.toString();
      router.push(query ? `/categories/${id}?${query}` : `/categories/${id}`, { scroll: false });
      return;
    }

    const query = params.toString();
    router.push(query ? `/?${query}` : "/", { scroll: false });
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div role="tablist" aria-label="Categories" className="flex gap-2 px-4 min-w-max">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "all"}
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
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeRef : undefined}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(cat.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-input bg-background text-muted-foreground hover:text-primary hover:bg-accent"
              )}
            >
              <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
              {cat.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
