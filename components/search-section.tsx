"use client";

import { useSearchParams } from "next/navigation";
import { SearchResults } from "@/components/search-results";

/**
 * The home page's search view. Renders nothing unless `?q=` is set, so the
 * home page can show the results at the top instead of below the fold.
 */
export function SearchSection() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) return null;

  return <SearchResults query={q} />;
}
