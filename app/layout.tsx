import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "GlowUp — Men's Transformation Research Library",
  description:
    "Evidence-based men's transformation: fat loss, muscle, nutrition, supplements, sleep, Big D vitality, skincare and a verified product directory.",
  openGraph: {
    title: "GlowUp — Men's Transformation Research Library",
    description:
      "Evidence-based men's transformation guide with categories, sub-sections, filters, products, foods and meal templates.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased selection:bg-primary selection:text-primary-foreground pb-24">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
