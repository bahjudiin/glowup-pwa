import { Suspense } from "react";
import { FoodsBrowser } from "@/components/foods-browser";

export const metadata = {
  title: "Foods — GlowUp",
  description:
    "High-volume, low-calorie foods ranked by volume per calorie with satiety evidence, cost and availability.",
};

export default function FoodsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <FoodsBrowser />
    </Suspense>
  );
}
