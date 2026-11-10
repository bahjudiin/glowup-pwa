# Deploying GlowUp

**Live:** https://glowup-pwa.vercel.app

## One-command deploy

```bash
git checkout main
npm install
vercel --prod --yes
```

The Vercel CLI is already authenticated on this machine as `bahjudiin1-2344`, and the
project is linked to this repository with **`main` as the production branch** — so a
`git push` to `main` also triggers a deploy.

## What is deployed

| Route | What it is |
|---|---|
| `/` | The Next.js 15 app — categories → sub-tabs, sort tabs, filters, search, article reader |
| `/categories`, `/categories/[slug]` | Category index and per-category view with tier-3 sub-tabs |
| `/articles/[id]` | Full article, rendered from markdown |
| `/products`, `/foods`, `/meals` | Catalogue, USDA food tables, meal templates |
| `/standalone` | The zero-dependency single-file build (no npm install needed) |
| `/manifest.json`, `/icon-*.png` | PWA manifest and icons, served from `public/` |

## Configuration

- `vercel.json` sets `"framework": "nextjs"` plus security headers. It does **not**
  declare `builds`/`routes` — those would override framework detection and break the
  Next.js build.
- `.vercelignore` excludes `node_modules`, `.next`, `.env` and logs only. It must not
  exclude `app/`, `components/` or `lib/`.
- `next.config.ts` must not require network access at build time. The app uses a local
  font stack rather than `next/font/google` for exactly this reason.
- Node 26.x is selected for the project.

## Traps hit before

**Vercel Authentication (SSO protection).** Projects in the `bahjudiin1-2344s-projects`
scope get `ssoProtection` enabled by default. The deployment reports `Ready` but every
request redirects to a Vercel login page. Clear it:

```bash
# PATCH /v9/projects/glowup-pwa?teamId=<team>  body: {"ssoProtection": null, "passwordProtection": null}
```

**Static assets 404.** The PWA manifest and icons must live in `public/` so Next.js serves
them at the root. Copies at the repository root are never served.

**`npm install` blocked locally.** That was a limitation of the machine that first built
this, not of Vercel. Vercel runs a normal `npm install` in its own build container.

## Verifying a deploy

```bash
npm run test:all        # catalogue invariants
npx tsc --noEmit        # types
npm run build           # 55 static pages

node scripts/verify-ui.mjs   # needs: npm i --no-save puppeteer-core, a server on :3000
```

`scripts/verify-ui.mjs` also accepts `BASE_URL=https://glowup-pwa.vercel.app` to check the
live site.
