import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Article {
  article_id: number;
  title: string;
  slug: string;
  content: string;
  author_name?: string;
  tags?: string[];
}

const mockArticles: Article[] = [
  {
    article_id: 101,
    title: "The Silent Rise of Decentralized AI Agents",
    slug: "silent-rise-decentralized-ai",
    content:
      "As artificial intelligence scales, a pivotal debate emerges around centralized corporate clusters vs. public-domain edge weights. In this deep dive, we explore how running localized models at home creates digital hubs that resist singular data silos.",
    author_name: "Eleanor Vance",
    tags: ["Technology", "Philosophy"],
  },
  {
    article_id: 102,
    title: "Why Economic Equilibrium Requires Constant Chaos",
    slug: "economic-equilibrium-chaos",
    content:
      "Modern monetary frameworks strive for predictive stability, yet historically, progress occurs at the edge of systemic friction. By examining historical boom-bust metrics, we analyze whether controlled volatility is healthy.",
    author_name: "Prof. Marcus Thorne",
    tags: ["Economy", "Philosophy"],
  },
  {
    article_id: 103,
    title: "Restructuring Local Governance through Algorithmic Participation",
    slug: "restructuring-local-governance",
    content:
      "Direct representation has hit bottlenecks in scaling metropolitan grids. We evaluate custom voting protocols that dynamically weigh citizen engagement points according to actual domain contributions.",
    author_name: "Aria Sterling",
    tags: ["Politics-Left", "Technology"],
  },
  {
    article_id: 104,
    title: "The Case for Traditional Monetary Anchors in a Digital Era",
    slug: "traditional-monetary-anchors",
    content:
      "While decentralization offers theoretical liberty, physical currency backings provide historical anti-fragility. This comparative report explores gold and land reserves as stable points of trust in highly liquid financial systems.",
    author_name: "Julian Vance",
    tags: ["Politics-Right", "Economy"],
  },
];

type Params = { slug: string } | Promise<{ slug: string }>;

interface FetchedArticle {
  article_id?: number;
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  author?: { username?: string };
  author_name?: string;
  author_username?: string;
  tags?: string[];
}

async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Try proxy first
    const proxyRes = await fetch(`/api/articles/trending`);
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const arr = Array.isArray(data) ? (data as FetchedArticle[]) : ([data] as FetchedArticle[]);
      const found = arr.find((a: FetchedArticle) => a.slug === slug);
      if (found) {
        return {
          article_id: found.article_id ?? found.id ?? 0,
          title: found.title ?? "",
          slug: found.slug ?? "",
          content: found.content ?? "",
          author_name: found.author?.username ?? found.author_name ?? found.author_username ?? "Anonymous",
          tags: found.tags ?? ["General"],
        };
      }
    }
  } catch (err) {
    // keep a debug log in development to help diagnose proxy/backend issues
    console.debug("fetchArticleBySlug error:", err);
  }

  // Fallback: search local mock articles
  const local = mockArticles.find((item) => item.slug === (slug ?? ""));
  return local ?? null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.content.slice(0, 140),
  };
}

export default async function ArticleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 py-10 max-w-4xl">
      <Card className="rounded-3xl border border-border/80 bg-card/95 shadow-xl">
        <CardHeader className="space-y-4 px-8 py-8">
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-semibold tracking-wide">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-foreground">
            {article.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            By <span className="font-semibold text-foreground">{article.author_name || "Anonymous"}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-10 text-base leading-8 text-foreground">
          <p>{article.content}</p>
        </CardContent>
      </Card>
    </main>
  );
}
