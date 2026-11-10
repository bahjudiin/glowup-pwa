/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/app.js"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
      },
      borderRadius: {
        none: "0px",
        sm: "8px",           /* compact utility */
        md: "12px",          /* inner surfaces, tiles */
        lg: "var(--radius)", /* cards — 16px */
        pill: "9999px",      /* CTAs, chips, inputs */
      },
      fontSize: {
        /* WattVision: body 14px, titles 24px, labels 11-13px.
           The scale is 8px-grid friendly at the surfaces that matter. */
        micro: ["11px", { lineHeight: "1.35", letterSpacing: "0.02em" }],
        xs: ["12px", { lineHeight: "1.45", letterSpacing: "0" }],
        sm: ["13px", { lineHeight: "1.5", letterSpacing: "0" }],
        base: ["14px", { lineHeight: "1.55", letterSpacing: "0" }],
        lg: ["16px", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        xl: ["24px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "2xl": ["28px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "3xl": ["32px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "4xl": ["40px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      fontFamily: {
        /* Inter for everything; JetBrains Mono for numbers (KPIs, prices,
           dosages, tables). Both self-hosted in assets/fonts/. */
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      letterSpacing: { tightest: "-0.022em", apple: "-0.374px" },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "sheet-in": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-in": "fade-in .18s ease-out both",
        "slide-up": "slide-up .22s cubic-bezier(.22,1,.36,1) both",
        "sheet-in": "sheet-in .26s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
};
