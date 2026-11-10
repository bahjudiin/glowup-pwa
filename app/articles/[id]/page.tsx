import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ARTICLE_BY_ID, ARTICLES } from "@/lib/data/articles";
import { CATEGORY_BY_ID } from "@/lib/data/categories";
import { renderMarkdown } from "@/lib/markdown";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { CategoryIcon } from "@/components/category-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, FileText, Tag } from "lucide-react";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLE_BY_ID.get(id);
  if (!article) return { title: "Article — GlowUp" };
  return {
    title: `${article.title} — GlowUp`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLE_BY_ID.get(id);

  if (!article) {
    notFound();
  }

  const category = CATEGORY_BY_ID.get(article.categoryId);
  const subTab = category?.subTabs?.find((s) => s.id === article.subTabId);
  const html = renderMarkdown(article.content);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-4">
        <Suspense fallback={<div className="mx-auto h-10 max-w-md" />}>
          <SearchBar className="mx-auto" />
        </Suspense>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          href={category ? `/categories/${category.id}` : "/"}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {category ? `Back to ${category.title}` : "Back to home"}
        </Link>

        <Card className="border border-input/50 overflow-hidden">
          <CardHeader className="pb-5">
            <div className="flex items-start gap-3 mb-3">
              <span
                className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
                  category?.color ?? "bg-primary/20 text-primary border-primary/30"
                }`}
              >
                <CategoryIcon name={article.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl leading-tight">{article.title}</CardTitle>
                <CardDescription className="mt-1">{article.summary}</CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={
                  article.evidenceGrade === "High"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : article.evidenceGrade === "Moderate" ||
                        article.evidenceGrade === "Moderate-High"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-slate-500/30 bg-slate-500/10 text-slate-400"
                }
              >
                Evidence: {article.evidenceGrade}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-2 py-1">
                Cost: {article.costTier}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-2 py-1">
                Difficulty: {article.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-[10px] px-2 py-1">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-[10px] px-2 py-1">
                <FileText className="h-3 w-3" />
                File {article.fileId}
              </Badge>
              {category ? (
                <Badge variant="outline" className="text-[10px] px-2 py-1">
                  {category.title}
                </Badge>
              ) : null}
              {subTab ? (
                <Badge variant="outline" className="text-[10px] px-2 py-1">
                  {subTab.title}
                </Badge>
              ) : null}
            </div>

            {article.tags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-input/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </CardHeader>

          <CardContent className="pt-0 pb-8">
            {html ? (
              <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-sm text-muted-foreground">
                The full text of this section has not been imported into the library yet — the
                summary above is the complete record for now.
              </p>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-xs text-muted-foreground">
          Disclaimer: this is educational research material, not medical advice. See a clinician
          before starting any supplement or treatment.
        </p>
      </div>

      <Navbar />
    </div>
  );
}
