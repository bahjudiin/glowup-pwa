# GlowUp — Men's Transformation Research Library

A mobile-first research library and PWA. Category tabs → sub-tabs, sort tabs, filters and
live search across articles, products, foods and meals.

**Live:** https://glowup-pwa.vercel.app

---

## Two apps, one repo

| Path | What it is | How to run |
|---|---|---|
| `app/`, `components/`, `lib/` | **Next.js 15 app** — the primary site. React 19, TypeScript, Tailwind. | `npm install && npm run dev` |
| `public/standalone/index.html` | **Standalone build** — one self-contained file, zero dependencies, no build step. Served at `/standalone`. | open it in a browser |

The standalone build is a real deployment target, not a leftover: it works offline after the
first load, installs as a PWA, and needs no npm install.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # next build — 55 static pages
npm start          # serve the production build
```

### The standalone build

Open `public/standalone/index.html` directly in any browser. No install, no server, no build.

---

## Scripts

| Script | What it checks |
|---|---|
| `npm test` | Catalogue invariants: every category has sub-tabs, every article sits in exactly one sub-tab of its own category, sub-tab lists match the articles claiming them, every icon resolves to a real lucide export. **291 assertions.** |
| `npm run test:queries` | The filter/sort/search layer. **32 expectations.** |
| `node scripts/check-standalone-data.mjs` | The standalone build's catalogue and shell — that the stylesheet is intact, the CSS tokens are defined, and the same sub-tab invariants hold. |
| `node scripts/verify-ui.mjs` | End-to-end UI check in headless Edge against a running server: category tab filters the list, `?tab=` narrows to one article, ArrowRight/Enter move and select sub-tabs, `?sort=`/`?evidence=`/`?q=` apply, switching category clears `?tab=` but keeps sort and filters, exactly one nav item is active per route. Needs `npm i --no-save puppeteer-core` and a server on `:3000` (`BASE_URL` overrides it). |

---

## Navigation model

```
Tier 1   bottom nav      Home · Categories · Products · Foods · Meals
Tier 2   category tabs   13 categories, horizontally scrollable
Tier 3   sub-tabs        per category, from Category.subTabs in lib/data/categories.ts
Tier 4   sort / filter   evidence grade, cost tier, verified prices, 4 sort orders
```

Sub-tabs are data, not markup — add one to `lib/data/categories.ts` and it appears in the UI.
Every article carries a `subTabId`, and `npm test` fails if an article is orphaned or claimed
twice.

### Categories

Fat Loss · Muscle & Training · Nutrition & Foods · Supplements · Product Directory ·
Skincare & Grooming · **Sleep & Recovery** · **Big D — Men's Vitality** · Health & Longevity ·
Maintenance · Myths & Evidence · Master Summary

**Big D** is the men's vitality guide: sexual function, premature ejaculation, fertility,
attraction and low testosterone, each with its own sub-tab and a full article body. It was
ported from the GlowUp PWA ebook (`index.html#h-bigd` on the `master` branch).

---

## Adding content

Articles live in `lib/data/articles.ts`; the Big D and Sleep articles are in
`lib/data/vitality.ts` and `lib/data/sleep.ts`. Each article carries a `subTabId` pointing at
a sub-tab of its own category.

The narrative source for every section is the research library in `research_library_md/`
(`00`–`27`), including `27_BIG_D_MENS_VITALITY.md` — the Big D guide with per-section
evidence grading and an explicit list of claims that are **not verified** in that library.

---

## Deployment

`vercel.json` declares `"framework": "nextjs"` with security headers only, so Vercel runs a
normal Next.js build. `.vercelignore` excludes `node_modules`, `.next`, `.env` and logs.

The standalone build is served from `public/standalone/`, with the PWA manifest and icons at
the root.

> **Note:** Vercel Authentication (SSO protection) is enabled by default on projects in the
> `bahjudiin1-2344s-projects` scope. If a deployment comes back `Ready` but every request
> redirects to a Vercel login page, clear it:
> `PATCH /v9/projects/glowup-pwa` with `{"ssoProtection": null, "passwordProtection": null}`.

---

## Evidence conventions

- Nutrition values are USDA FoodData Central SR Legacy, per 100 g. Values are ±10–15% versus
  local Somali produce.
- iHerb prices marked ✅ were checked live on **1 Nov 2026**; they exclude international
  shipping, customs and local markup. Marketplace **search** links are labelled as such — no
  product URLs were invented.
- Every important claim links to PubMed. Mechanistic findings are never presented as proof
  of real-world outcomes. Claims that could not be verified are labelled as such.

---

## Disclaimer

Research synthesis for information only — not medical advice. Persistent sexual-function
problems, fertility questions and hormone concerns need a clinician; erectile dysfunction
and low libido are frequently the first presentation of diabetes, hypertension, cardiovascular
disease, endocrine disease or sleep apnoea.
