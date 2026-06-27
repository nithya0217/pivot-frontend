"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { loadSavedArticles, saveSavedArticles, SavedArticle } from "@/lib/bookmarks";

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<SavedArticle[]>([]);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    const saved = loadSavedArticles(user.user_id);
    setBookmarks(saved ?? []);
  }, [user]);

  const bookmarkList = Array.isArray(bookmarks) ? bookmarks : [];
  const hasBookmarks = bookmarkList.length > 0;

  const handleRemoveBookmark = (slug: string) => {
    if (!user) return;

    const updated = bookmarks.filter((item) => item.slug !== slug);
    setBookmarks(updated);
    saveSavedArticles(user.user_id, updated);
    toast.success("Bookmark removed", {
      description: "This article was removed from your saved reads.",
    });
  };

  const bookmarkCount = useMemo(() => bookmarks.length, [bookmarks]);

  return (
    <main className="container mx-auto px-6 py-10 max-w-6xl">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Saved Bookmarks</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Your personal reading queue. Articles you bookmarked are stored locally per user session and available while signed in.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-violet-100 px-3 py-1 font-semibold text-violet-700">{bookmarkCount} saved</span>
          <Link href="/feed" className="text-violet-600 hover:underline">
            Back to feed
          </Link>
        </div>
      </div>

      {user ? (
        hasBookmarks ? (
          <div className="grid gap-6 md:grid-cols-2">
            {bookmarkList.map((article) => {
              const tags = Array.isArray(article.tags) && article.tags.length > 0 ? article.tags : ["General"];
              return (
                <Card key={article.slug} className="rounded-3xl border border-border/80 bg-card/95 shadow-sm">
                  <CardHeader className="space-y-4 p-6">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-semibold tracking-wide">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                      <Link href={`/feed/${article.slug}`} className="hover:text-violet-600 transition-colors duration-200">
                        {article.title}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">By {article.author}</p>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6 pt-0 text-sm leading-7 text-foreground">
                    <p className="line-clamp-4">{article.content}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBookmark(article.slug)}
                    >
                      Remove Bookmark
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 p-12 text-center">
            <p className="text-lg font-semibold text-foreground">No bookmarks yet</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Visit the feed and save articles while reading. Bookmarked content appears here.
            </p>
            <div className="mt-6">
              <Link href="/feed">
                <Button size="sm">Browse Feed</Button>
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 p-12 text-center">
          <p className="text-lg font-semibold text-foreground">Sign in to view bookmarks</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Bookmarks are stored locally per user. Sign in to start saving articles.
          </p>
          <div className="mt-6">
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
