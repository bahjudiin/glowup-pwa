import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "GlowUp — Men's Transformation Research Library",
  description: "Evidence-based men's transformation, fat loss, muscle, nutrition, supplements, skincare and product directory.",
  openGraph: {
    title: "GlowUp — Men's Transformation Research Library",
    description: "Evidence-based men's transformation guide with categories, filters, products, foods and meal templates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased selection:bg-primary selection:text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
