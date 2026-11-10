import { Suspense } from "react";
import { MealsBrowser } from "@/components/meals-browser";

export const metadata = {
  title: "Meals — GlowUp",
  description:
    "Ready-to-eat breakfast, lunch/dinner and snack templates hitting 35–55 g protein and 8–15 g fibre, plus a one-page weekly shopping list.",
};

export default function MealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <MealsBrowser />
    </Suspense>
  );
}
