"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Bookmark, Clock, Heart, User } from "lucide-react";
import { loadLikedArticles, loadLikedArticleIds, loadSavedArticles, saveLikedArticleIds, saveLikedArticles, saveSavedArticles } from "@/lib/bookmarks";

interface ArticleProps {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  tags: string[];
}

export default function ArticleCard({ id, title, content, author, tags, slug }: ArticleProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const articleUrl = `/feed/${slug}`;

  const isBookmarked = useMemo(() => {
    if (!user) return false;
    // Refresh when the user clicks save/unsave.
    void refreshKey;
    return loadSavedArticles(user.user_id).some((item) => item.slug === slug);
  }, [user, slug, refreshKey]);

  const isLiked = useMemo(() => {
    if (!user) return false;
    void refreshKey;
    return loadLikedArticleIds(user.user_id).includes(id);
  }, [user, id, refreshKey]);

  const handleInteraction = async () => {
    const activeUserId = user ? user.user_id : 3; // Use logged-in user or default mock user

    setIsSending(true);
    try {
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: activeUserId,
          article_id: id,
          interaction_type: "click",
          reading_time_seconds: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register interaction");
      }

      console.log(`[Interaction Recorded] User: ${activeUserId}, Article: ${id}`);
    } catch (error) {
      console.error("Failed recording backend interaction metric:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCardClick = async () => {
    await handleInteraction();
    router.push(articleUrl);
  };

  const handleBookmark = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!user) {
      toast.error("Sign in to save bookmarks.");
      return;
    }

    const saved = loadSavedArticles(user.user_id);
    const isSaved = saved.some((item) => item.slug === slug);
    const updated = isSaved
      ? saved.filter((item) => item.slug !== slug)
      : [...saved, { article_id: id, title, slug, content, author, tags }];

    saveSavedArticles(user.user_id, updated);
    setRefreshKey((current) => current + 1);
    toast.success(isSaved ? "Bookmark removed" : "Saved to bookmarks", {
      description: isSaved ? "This article was removed from your saved items." : "This article is now saved for later.",
    });
  };

  const toggleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!user) {
      toast.error("Sign in to like articles.");
      return;
    }

    const liked = loadLikedArticles(user.user_id);
    const alreadyLiked = liked.some((article) => article.article_id === id);
    const currentArticle = { article_id: id, title, slug, content, author, tags };
    const updated = alreadyLiked
      ? liked.filter((article) => article.article_id !== id)
      : [...liked, currentArticle];

    saveLikedArticles(user.user_id, updated);
    saveLikedArticleIds(user.user_id, updated.map((article) => article.article_id));
    setRefreshKey((current) => current + 1);

    toast.success(alreadyLiked ? "Like removed" : "Article liked", {
      description: alreadyLiked ? "You unliked this article." : "Thanks for liking this article.",
    });
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-hidden border border-border/80 bg-card hover:bg-accent/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-violet-500/30 flex flex-col justify-between h-full"
    >
      {/* Top subtle highlight gradient on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <Badge 
              variant="secondary" 
              key={tag}
              className="text-[10px] font-semibold tracking-wider bg-violet-100/50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 hover:bg-violet-200 border-none transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <CardTitle className="line-clamp-2 text-xl font-bold tracking-tight text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200 leading-snug">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-6">
        <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed font-light">
          {content}
        </p>
      </CardContent>

      <CardFooter className="border-t border-border/50 pt-4 mt-auto bg-muted/20 px-6 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-violet-500" />
              <span>By</span>
              <span className="font-semibold text-foreground">{author}</span>
            </div>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              2m read
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={isLiked ? "secondary" : "ghost"}
              onClick={toggleLike}
              className="gap-2"
            >
              <Heart className={`transition-colors ${isLiked ? "text-rose-500" : "text-muted-foreground"}`} />
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={isBookmarked ? "secondary" : "ghost"}
              onClick={handleBookmark}
              className="gap-2"
            >
              <Bookmark className={`transition-colors ${isBookmarked ? "text-violet-600" : "text-muted-foreground"}`} />
              {isBookmarked ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
        {isSending && (
          <span className="inline-flex h-2 w-2 rounded-full bg-violet-600 animate-ping" title="Registering telemetry" />
        )}
      </CardFooter>
    </Card>
  );
}
