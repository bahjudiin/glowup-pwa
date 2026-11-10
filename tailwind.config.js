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
        sm: "8px",          /* compact utility — Apple {rounded.sm} */
        md: "11px",         /* pearl capsule */
        lg: "var(--radius)",/* utility cards — 18px */
        pill: "9999px",     /* CTAs, chips, inputs */
      },
      fontSize: {
        /* Apple's reading pace: 17px body, 14px caption, tight display */
        micro: ["11px", { lineHeight: "1.3", letterSpacing: "-0.08px" }],
        xs: ["13px", { lineHeight: "1.42", letterSpacing: "-0.12px" }],
        sm: ["15px", { lineHeight: "1.45", letterSpacing: "-0.224px" }],
        base: ["17px", { lineHeight: "1.47", letterSpacing: "-0.374px" }],
        lg: ["21px", { lineHeight: "1.19", letterSpacing: "0.231px" }],
        xl: ["24px", { lineHeight: "1.16", letterSpacing: "-0.2px" }],
        "2xl": ["28px", { lineHeight: "1.12", letterSpacing: "-0.374px" }],
        "3xl": ["34px", { lineHeight: "1.1", letterSpacing: "-0.5px" }],
        "4xl": ["40px", { lineHeight: "1.08", letterSpacing: "-0.6px" }],
      },
      fontFamily: {
        /* SF Pro on Apple hardware; system-ui everywhere else (see DESIGN.md) */
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "SF Pro Display", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
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
