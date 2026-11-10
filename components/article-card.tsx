"use client";

import Link from "next/link";
import { Article } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/category-icon";
import { Clock } from "lucide-react";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="overflow-hidden border border-input/50 group hover:border-primary/50 transition-colors">
      <Link href={`/articles/${article.id}`} className="block h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                article.evidenceGrade === "High"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : article.evidenceGrade === "Moderate" ||
                      article.evidenceGrade === "Moderate-High"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-slate-500/30 bg-slate-500/10 text-slate-400"
              }`}
            >
              {article.evidenceGrade}
            </span>
            <Badge variant="outline" className="text-[10px] px-2 py-1">
              {article.readTime}
            </Badge>
          </div>
          <CardTitle className="text-base leading-tight flex items-center gap-2">
            <CategoryIcon name={article.icon} className="h-4 w-4 shrink-0 text-primary" />
            {article.title}
          </CardTitle>
          <CardDescription>{article.summary}</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-input/50">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}</span>
              <span className="opacity-60">·</span>
              <span>{article.costTier}</span>
            </div>
            <span className="font-medium text-primary">File {article.fileId}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
