"use client";

import Link from "next/link";
import { Food } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function FoodRow({ food }: { food: Food }) {
  const satietyColor = {
    "Direct RCT": "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    Indirect: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    None: "border-slate-500/30 bg-slate-500/10 text-slate-400",
  }[food.satietyEvidence];

  return (
    <Link
      href={`https://fdc.nal.usda.gov/food-search?query=${food.fdcId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
    <div className="border-b border-input/50 px-4 py-3 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-3 group-hover:bg-accent/50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-medium">{food.name}</span>
          <Badge variant="outline" className="text-[10px] px-2 py-1">
            {food.group}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground md:flex-1">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-blue-500/20" /> {food.kcal} kcal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-emerald-500/20" /> {food.protein}g P
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-purple-500/20" /> {food.fibre}g F
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-cyan-500/20" /> {food.water}% W
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-2 w-full md:w-auto text-right md:text-left">
        <Badge variant="outline" className="text-[10px] px-2 py-1">
          {satietyColor}
          {food.satietyEvidence}
        </Badge>
        <div className="text-sm text-muted-foreground mt-1 md:mt-0">
          {food.cost}
        </div>
      </div>
    </div>
    </Link>
  );
}
