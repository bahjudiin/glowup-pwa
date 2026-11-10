"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SubTab } from "@/lib/types";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";

/**
 * Tier-3 navigation: the sub-tabs of the currently selected category.
 *
 * - The selected sub-tab is mirrored into the `?tab=` query parameter so the
 *   state is shareable and survives a reload.
 * - Switching category clears `?tab=` (the category handler deletes it), because
 *   a sub-tab id from another category is meaningless here.
 * - Full ARIA tab semantics + roving focus: arrow keys move focus, Enter and
 *   Space activate the focused tab.
 */
export function SubTabs({
  categoryId,
  subTabs,
}: {
  categoryId: string | null | undefined;
  subTabs: SubTab[] | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const listRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabParam = searchParams.get("tab");
  const activeTab =
    categoryId && subTabs?.some((s) => s.id === tabParam) ? (tabParam as string) : "";

  // If the URL points at a sub-tab that does not belong to the active
  // category, drop it so the URL never lies about what is on screen.
  useEffect(() => {
    if (!tabParam) return;
    if (!categoryId || !subTabs?.some((s) => s.id === tabParam)) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("tab");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam, categoryId]);

  const selectTab = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id === activeTab) {
        params.delete("tab");
      } else {
        params.set("tab", id);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [activeTab, pathname, router, searchParams]
  );

  // Keep the active sub-tab visible in the horizontally scrollable bar.
  useEffect(() => {
    if (!subTabs) return;
    const index = subTabs.findIndex((s) => s.id === activeTab);
    if (index >= 0) {
      tabRefs.current[index]?.scrollIntoView({ block: "nearest", inline: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, categoryId]);

  if (!categoryId || !subTabs || subTabs.length === 0) return null;

  const focusIndex = (index: number) => {
    const count = subTabs.length;
    const next = ((index % count) + count) % count;
    tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLButtonElement | null;
    const index = tabRefs.current.indexOf(target);
    if (index < 0) return;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusIndex(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusIndex(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusIndex(0);
        break;
      case "End":
        event.preventDefault();
        focusIndex(subTabs.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      <div
        ref={listRef}
        role="tablist"
        aria-label={`${categoryId} sub-sections`}
        onKeyDown={handleKeyDown}
        className="w-full overflow-x-auto no-scrollbar pb-1"
      >
        <div className="flex gap-2 min-w-max">
          {subTabs.map((sub, index) => {
            const isActive = activeTab === sub.id;
            return (
              <button
                key={sub.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${sub.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${sub.id}`}
                tabIndex={isActive || (!activeTab && index === 0) ? 0 : -1}
                onClick={() => selectTab(sub.id)}
                className={cn(
                  "flex flex-col items-start gap-0.5 rounded-xl border px-3.5 py-2 text-left whitespace-nowrap transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-input bg-background text-muted-foreground hover:text-primary hover:bg-accent"
                )}
              >
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <CategoryIcon name={sub.icon} className="h-3.5 w-3.5" />
                  {sub.title}
                </span>
                {sub.description ? (
                  <span
                    className={cn(
                      "text-[11px] leading-tight font-normal",
                      isActive ? "text-primary/80" : "text-muted-foreground/80"
                    )}
                  >
                    {sub.description}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
