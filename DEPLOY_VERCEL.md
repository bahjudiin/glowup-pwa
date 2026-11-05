# Deploy GlowUp to Vercel

## Option A: GitHub + Vercel Dashboard (Recommended — no CLI needed)

Since `npm install` is blocked in this environment, deploy the **standalone static site** (`index.html`) via the Vercel web dashboard:

1. **Push to GitHub**
   ```bash
   cd glowup-app
   git init
   git add .
   git commit -m "Initial GlowUp app"
   # Create a repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/glowup.git
   git branch -M main
   git push -u origin main
   ```

2. **Import in Vercel**
   - Go to https://vercel.com/dashboard
   - Click **"Add New Project"**
   - Import your `glowup` repository
   - Framework preset: **"Other"**
   - Build command: (leave blank / none)
   - Output directory: `.` (root)
   - Click **Deploy**

3. **Done** — your app is live at `https://glowup.vercel.app`

## Option B: Vercel CLI (if you have network access locally)

If you can run npm on your own machine:

```bash
cd glowup-app
npm install -g vercel
vercel login
vercel --prod
```

## What gets deployed

The standalone `index.html` version — a full mobile-first app with:
- Category tabs, sort tabs, filters, toggles
- Search across articles, products, foods, meals
- Product directory with verified iHerb prices
- USDA food nutrition tables
- Meal templates + weekly shopping list
- PWA manifest (installable on Android/iOS)
- Dark mode

## Notes

- The Next.js 15 version in `/app`, `/components`, `/lib` requires `npm install` to build — deploy it to Vercel via the Next.js framework preset if you can run `npm install` locally.
- The static `index.html` is what's configured in `vercel.json` above and works immediately on Vercel's free Hobby tier.
