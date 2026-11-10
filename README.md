# GlowUp — Men's Transformation Research Library

A mobile-first, modern web app assembled from the Men's Transformation Research Library MD files. Features categories, sort tabs, filters, toggles, products, foods, meal templates, and search — all free and fast.

## What's in this folder

| File | Purpose |
|------|---------|
| `index.html` | **Standalone zero-dependency version** — open this directly in any browser, no install needed. PWA-ready. |
| `app/`, `components/`, `lib/` | **Next.js 15 version** — modern React stack (requires `npm install`). |
| `package.json` | Next.js project manifest. |
| `manifest.json` | PWA manifest (installable on Android/iOS). |

## Quick start — use right now (no install)

Open `index.html` in any browser. It works offline after first load (PWA) and includes:

- **Category tabs** — horizontal scrollable tabs for Fat Loss, Muscle & Training, Nutrition & Foods, Supplements, Product Directory, Skincare & Grooming, Sleep & Recovery, Health & Longevity, Maintenance, Myths & Evidence, Master Summary.
- **Sort tabs** — Default / Evidence / Cost (low→high) / Name (A→Z).
- **Filters** — category, evidence grade, cost tier, and a "Verified prices only" toggle.
- **Search** — live search across articles, products, foods, and meals.
- **Products** — verified iHerb prices (✅ checked 1 Nov 2026) with cost-per-serving, evidence, purpose, usage, risks, contraindications, and essential/high-value/optional tags.
- **Foods** — USDA FoodData Central nutrition tables (kcal, protein, fibre, water per 100 g) with satiety evidence and Mogadishu cost/availability.
- **Meals** — breakfast / lunch-dinner / snack templates with protein & fibre, ingredients, and a weekly shopping list.
- **Dark mode toggle** — persists your preference.

## Next.js version (modern stack)

The `app/`, `components/`, and `lib/` folders contain a full Next.js 15 + TypeScript + Tailwind app. To run it:

```bash
cd glowup-app
npm install        # requires network access to the npm registry
npm run dev        # starts dev server on http://localhost:3000
npm run build      # production build
npm start          # serve production build
npm test           # data-consistency check (categories / sub-tabs / icons)
npm run test:queries  # sort / filter / search / markdown renderer checks
```

### Tech stack
- **Next.js 15** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** primitives (Radix UI based)
- **Lucide React** icons
- **next-themes** (dark mode)

### Navigation hierarchy

| Tier | Control | State |
|------|---------|-------|
| 1 | Bottom nav: Home, Categories, Products, Foods, Meals + theme toggle | route path |
| 2 | Category tab bar (`components/category-tabs.tsx`) | `?category=<id>` |
| 3 | Sub-tab bar (`components/sub-tabs.tsx`) | `?tab=<id>` |

All list state lives in the query string, so every view is shareable and survives a reload:

- `?category=` — category (tier 2)
- `?tab=` — sub-tab within a category (tier 3); cleared automatically when the category changes
- `?sort=` — `default` · `evidence` · `cost` · `name`
- `?evidence=` — evidence grade
- `?cost=` — cost tier
- `?verified=true` — verified prices only
- `?q=` — free-text search across articles, products, foods and meals

### Routes
- `/` — Home: featured decks (Big D, Sleep & Recovery), all 12 categories, sortable/filterable library, and a cross-entity search view when `?q=` is set
- `/categories` — index of all 12 categories with their sub-sections
- `/categories/[slug]` — Category detail: sub-tabs + live article list
- `/articles/[id]` — Article reader (markdown rendered by `lib/markdown.ts`)
- `/products` — Product directory with filters & sort
- `/products/[id]` — Product detail page
- `/foods` — High-volume low-calorie food tables
- `/meals` — Meal templates + weekly shopping list

## Data sources

All content is assembled from the MD files in `research_library_md/`:

- **Articles** — 39 files (00–26 Phase 1 + Phase 2 modules)
- **Products** — File 18 (Product Directory) with verified iHerb prices from 1 Nov 2026
- **Foods** — File 01 (High-Volume Low-Calorie Foods) USDA FDC nutrition tables
- **Meals** — File 26 (Meal Templates & Food List)

## Deploy (free)

- **Vercel**: push to GitHub, import repo, deploy (free tier). Note: the repo still ships a
  legacy `vercel.json` that builds the standalone `index.html` — delete it (or drop the
  `builds`/`routes` blocks) so Vercel uses the Next.js build output in `.next/`.
- **Netlify / GitHub Pages**: serve the standalone `index.html` build.

> Before committing, add `node_modules/`, `.next/`, `.next-env.d.ts`, `tsconfig.tsbuildinfo`
> and `.shots/` to `.gitignore` — the current file only ignores `.vercel`.

## Android (Capacitor) — optional

The standalone `index.html` can be wrapped with Capacitor (per `GLOWUP_BUILD_INSTRUCTIONS.md`) to produce a real APK. The Next.js build output (`npm run build` → `.next`) can also be served as a PWA.

---

Built from the Men's Transformation Research Library — evidence-graded, no supplements sold, no affiliate links. Prices are cost rankings, not quotes.