"use client";

import { useEffect, useState } from "react";
import ArticleCard from "@/components/feed/ArticleCard";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles, SlidersHorizontal, ArrowUpDown, Shuffle } from "lucide-react";

interface Article {
  article_id: number;
  title: string;
  slug: string;
  content: string;
  author_name?: string;
  tags?: string[];
}

export default function FeedPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [feedMode, setFeedMode] = useState<"standard" | "diversity">("standard");
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const tagsList = ["All", "Technology", "Philosophy", "Politics-Left", "Politics-Right", "Economy", "General"];

  const loadFeed = async (mode: "standard" | "diversity") => {
    setLoading(true);
    const activeUserId = user ? user.user_id : 3;

    try {
      // Build API request URL. 
      // If diversity mode is selected, query the recommendations endpoint.
      // Otherwise, query the standard articles list.
      const url = mode === "diversity" 
        ? `/api/recommendations/diversity?user_id=${activeUserId}`
        : `/api/articles`;

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        // If the diversity endpoint returns 404 or fails, fallback to standard feed
        // but perform a client-side algorithmic diversity shuffle!
        console.warn(`Feed endpoint returned status ${response.status}. Attempting standard endpoint fallback...`);
        const fallbackResponse = await fetch("/api/articles");
        if (fallbackResponse.ok) {
          const standardData: Article[] = await fallbackResponse.json();
          
          if (mode === "diversity") {
            // Apply Track B Contrarian Diversity Routing Shuffle
            // This balances tags and forces opposing viewpoints to bubble up!
            const shuffled = clientSideDiversityRouting(standardData);
            setArticles(shuffled);
            toast.info("Showing Algorithmic Diversity Discovery Feed (Client Shuffle)", {
              description: "Opposing viewpoints and diverse content have been balanced.",
              duration: 4000,
            });
          } else {
            setArticles(standardData);
          }
        } else {
          throw new Error("Failed fetching both primary and fallback feeds");
        }
      }
    } catch (err) {
      console.error("Error connecting network to platform api endpoints:", err);
      toast.error("Connectivity Bottleneck Detected", {
        description: "Unable to retrieve real-time article seed. Check backend CORS and connectivity.",
      });
      // Set some beautiful high-quality fallback mock data so the app NEVER feels broken!
      setArticles(getMockArticles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed(feedMode);
  }, [feedMode, user]);

  // Track B Contrarian Tag balancing algorithm
  const clientSideDiversityRouting = (data: Article[]): Article[] => {
    if (data.length <= 1) return data;
    
    // Group by primary tag
    const groups: { [key: string]: Article[] } = {};
    data.forEach(article => {
      const tag = article.tags && article.tags[0] ? article.tags[0] : "General";
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(article);
    });

    const diverseList: Article[] = [];
    const keys = Object.keys(groups);
    let hasMore = true;
    let index = 0;

    // Pull round-robin from each category group to maximize viewpoint contrast
    while (hasMore) {
      hasMore = false;
      keys.forEach(tag => {
        if (groups[tag][index]) {
          diverseList.push(groups[tag][index]);
          hasMore = true;
        }
      });
      index++;
    }

    return diverseList;
  };

  // Beautiful placeholder seed articles so the page is always visually gorgeous
  const getMockArticles = (): Article[] => [
    {
      article_id: 101,
      title: "The Silent Rise of Decentralized AI Agents",
      slug: "silent-rise-decentralized-ai",
      content: "As artificial intelligence scales, a pivotal debate emerges around centralized corporate clusters vs. public-domain edge weights. In this deep dive, we explore how running localized models at home creates digital hubs that resist singular data silos.",
      author_name: "Eleanor Vance",
      tags: ["Technology", "Philosophy"]
    },
    {
      article_id: 102,
      title: "Why Economic Equilibrium Requires Constant Chaos",
      slug: "economic-equilibrium-chaos",
      content: "Modern monetary frameworks strive for predictive stability, yet historically, progress occurs at the edge of systemic friction. By examining historical boom-bust metrics, we analyze whether controlled volatility is healthy.",
      author_name: "Prof. Marcus Thorne",
      tags: ["Economy", "Philosophy"]
    },
    {
      article_id: 103,
      title: "Restructuring Local Governance through Algorithmic Participation",
      slug: "restructuring-local-governance",
      content: "Direct representation has hit bottlenecks in scaling metropolitan grids. We evaluate custom voting protocols that dynamically weigh citizen engagement points according to actual domain contributions.",
      author_name: "Aria Sterling",
      tags: ["Politics-Left", "Technology"]
    },
    {
      article_id: 104,
      title: "The Case for Traditional Monetary Anchors in a Digital Era",
      slug: "traditional-monetary-anchors",
      content: "While decentralization offers theoretical liberty, physical currency backings provide historical anti-fragility. This comparative report explores gold and land reserves as stable points of trust in highly liquid financial systems.",
      author_name: "Julian Vance",
      tags: ["Politics-Right", "Economy"]
    }
  ];

  // Filtering articles based on user-selected tags
  const filteredArticles = selectedTag === "All" 
    ? articles 
    : articles.filter(art => art.tags?.includes(selectedTag));

  return (
    <main className="container mx-auto px-6 py-10 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-8 border-b border-border/60">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Your Publishing Feed
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl font-light leading-relaxed">
            Pivot Algorithmic Routing: Alternate viewpoints and balanced tag groups are seamlessly blended using dynamic contrarian mapping.
          </p>
        </div>

        {/* Feed Mode Toggle Tabs */}
        <div className="flex items-center p-1 bg-violet-100/50 dark:bg-violet-950/20 border border-violet-200/40 rounded-xl self-start md:self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFeedMode("standard")}
            className={`rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200 ${
              feedMode === "standard" 
                ? "bg-white dark:bg-background shadow-sm text-violet-700 dark:text-violet-300" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Standard Feed
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFeedMode("diversity")}
            className={`rounded-lg text-xs font-semibold px-4 py-2 flex items-center gap-1.5 transition-all duration-200 ${
              feedMode === "diversity" 
                ? "bg-violet-600 shadow-md text-white hover:bg-violet-700" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Diversity Discovery
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-muted/20 px-4 py-3 rounded-xl border border-border/40">
        <div className="flex items-center gap-1.5 mr-2 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5 text-violet-500" />
          Filter Tags:
        </div>
        {tagsList.map(tag => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            onClick={() => setSelectedTag(tag)}
            className={`cursor-pointer px-3 py-1 text-xs font-medium transition-all ${
              selectedTag === tag 
                ? "bg-violet-600 text-white hover:bg-violet-700 border-none" 
                : "hover:bg-accent border-border/80"
            }`}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col justify-between h-[280px] rounded-2xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden relative">
              <div className="h-6 w-1/3 rounded-lg bg-muted animate-pulse mb-4" />
              <div className="h-8 w-3/4 rounded-lg bg-muted animate-pulse mb-3" />
              <div className="h-4 w-full rounded-lg bg-muted animate-pulse mb-2" />
              <div className="h-4 w-5/6 rounded-lg bg-muted animate-pulse mb-8" />
              <div className="h-8 w-full rounded-lg bg-muted animate-pulse mt-auto" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl border-dashed border-border/80 bg-muted/10">
          <div className="mx-auto w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950/20 flex items-center justify-center mb-4">
            <Shuffle className="h-6 w-6 text-violet-500 animate-pulse" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No Matching Articles</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Try adjusting your category filter, or switch feed mode to pull new records from the seeded database tables.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.article_id}
              id={article.article_id}
              title={article.title}
              slug={article.slug}
              content={article.content}
              author={article.author_name || "Anonymous User"}
              tags={article.tags || ["General"]}
            />
          ))}
        </div>
      )}
    </main>
  );
}
