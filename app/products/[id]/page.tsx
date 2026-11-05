import { notFound } from "next/navigation";
import { PRODUCT_BY_ID } from "@/lib/data/products";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, DollarSign, ShieldCheck, Clock } from "lucide.react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCT_BY_ID.get(id);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-background">
      <SearchBar className="mx-auto" />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mb-6"
        >
          <X className="h-3 w-3" /> Back to directory
        </Link>

        <Card className="border border-input/50 overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                      product.priceVerified
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-500/30 bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {product.priceVerified ? "✅ Price verified" : "Marketplace search"}
                  </span>
                  <Badge variant="outline" className="text-[10px] px-2 py-1">
                    {product.source}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription>{product.brand} · {product.category}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {product.price !== null ? `$${product.price.toFixed(2)}` : "Price varies"}
                </div>
                {product.perServing && (
                  <p className="text-sm text-muted-foreground">{product.perServing}</p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 pb-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Purpose</h3>
                <p className="text-sm">{product.purpose}</p>

                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">How to use</h3>
                <p className="text-sm">{product.use}</p>

                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Evidence</h3>
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {product.evidence}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Risks</h3>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  {product.risks.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>

                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contraindications</h3>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  {product.contraindications.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-input/50">
            <div className="flex items-center justify-between gap-4">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-input bg-background hover:bg-accent transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">Open on {product.source}</span>
              </a>
              <span className="text-xs text-muted-foreground">
                Price date: {product.priceDate}
              </span>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-6 text-xs text-muted-foreground">
          Disclaimer: Prices change constantly. Treat listed prices as a cost ranking, not a quote.
          Supplements are not medicines; consult a clinician before starting new supplements.
        </p>
      </div>
      <Navbar />
    </div>
  );
}
