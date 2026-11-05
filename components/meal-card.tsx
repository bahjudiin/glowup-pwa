"use client";

import { MealTemplate } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils } from "lucide-react";

export function MealCard({ meal }: { meal: MealTemplate }) {
  return (
    <Card className="overflow-hidden border border-input/50 group hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Utensils className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {meal.type}
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] px-2 py-1">
          {meal.protein} P
        </Badge>
      </CardHeader>
      <CardTitle className="text-lg leading-tight">{meal.title}</CardTitle>
      <CardContent className="pt-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-emerald-500/20" /> {meal.protein} P
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-purple-500/20" /> {meal.fibre} F
          </span>
        </div>
        {meal.notes && <p className="text-sm">{meal.notes}</p>}
        {meal.ingredients.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {meal.ingredients.map((ing) => (
              <span key={ing} className="text-[10px] rounded-full border border-input/50 bg-background/50 px-2 py-0.5 text-muted-foreground">
                {ing}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
