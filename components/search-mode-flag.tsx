"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Flags the document as "searching" while `?q=` is set.
 *
 * The home page keeps its featured decks, category grid and library in the
 * server-rendered HTML (good for crawlers and first paint). This flag lets CSS
 * collapse them once a search is running, so the results sit at the top
 * without the page becoming client-rendered.
 */
export function SearchModeFlag() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  useEffect(() => {
    document.documentElement.dataset.search = q ? "1" : "0";
  }, [q]);

  return null;
}
