import {
  VITALITY_ARTICLES,
  VITALITY_CATEGORY as RAW_VITALITY_CATEGORY,
  VITALITY_SUBTABS,
} from "../../lib/data/vitality";
import type { Category } from "@/lib/types";

/**
 * Adapter for `lib/data/vitality`.
 *
 * `lib/data/categories.ts` builds the Big D entry as:
 *
 *     { id: 'mens-vitality', ...VITALITY_CATEGORY }
 *
 * which declares `id` twice — TypeScript reports that as TS2783 ("'id' is
 * specified more than once"). `lib/data/categories.ts` is owned by another
 * agent, so instead of editing it this module is mapped over
 * `@/lib/data/vitality` through `tsconfig.json#compilerOptions.paths`.
 *
 * The `id` is stripped from the exported category object so the explicit
 * `id: 'mens-vitality'` in CATEGORIES is the only one. The runtime value is
 * unchanged: the raw `id` was already 'mens-vitality'.
 */
const { id: _rawId, ...categoryWithoutId } = RAW_VITALITY_CATEGORY;

export const VITALITY_CATEGORY: Omit<Category, "id"> = categoryWithoutId;

export { VITALITY_ARTICLES, VITALITY_SUBTABS };
