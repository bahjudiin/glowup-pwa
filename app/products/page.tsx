import { Suspense } from "react";
import { ProductsBrowser } from "@/components/products-browser";

export const metadata = {
  title: "Product Directory — GlowUp",
  description:
    "Verified supplement, food and tool prices with cost-per-serving math, best budget options and a do-not-buy list.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductsBrowser />
    </Suspense>
  );
}
