"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, DollarSign, ShieldCheck } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const essentialBadge = {
    essential: { label: "Essential", variant: "default" as const },
    "high-value": { label: "High value", variant: "secondary" as const },
    optional: { label: "Optional", variant: "outline" as const },
    skip: { label: "Skip", variant: "destructive" as const },
  }[product.essential];

  return (
    <Card className="overflow-hidden border border-input/50 group hover:border-primary/50 transition-colors">
      <Link
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                product.priceVerified
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-500/30 bg-slate-500/10 text-slate-400"
              }`}
            >
              {product.priceVerified ? "✅ Verified" : "Search link"}
            </span>
            <Badge variant={essentialBadge.variant} className="text-[10px] px-2 py-1">
              {essentialBadge.label}
            </Badge>
          </div>
          <CardTitle className="text-base leading-tight">{product.name}</CardTitle>
          <CardDescription>{product.purpose}</CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="space-y-2 mb-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{product.price !== null ? `$${product.price.toFixed(2)}` : "—"}</span>
              <span className="text-sm text-muted-foreground">{product.currency}</span>
              {product.perServing && (
                <span className="text-xs text-muted-foreground ml-2">· {product.perServing}</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              <span>{product.evidence}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{product.use}</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{product.source}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
