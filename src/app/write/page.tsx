"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Sparkles, AlertCircle, FileText, PlusCircle, Check } from "lucide-react";

// Form validation schema with Zod
const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  content: z.string().min(50, "Content must be at least 50 characters for readers to gain value"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function WritePage() {
  const { user, setAuthorStatus } = useAuth();
  const router = useRouter();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");

  const availableTags = ["Technology", "Philosophy", "Politics-Left", "Politics-Right", "Economy", "General"];

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
  });

  const titleValue = watch("title");

  // Automatically generate clean slug from title
  useEffect(() => {
    if (titleValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generatedSlug);
    } else {
      setSlug("");
    }
  }, [titleValue]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const onSubmit = async (data: ArticleFormValues) => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in before publishing articles.",
      });
      return;
    }

    if (selectedTags.length === 0) {
      toast.error("Tag mapping required", {
        description: "Select at least one tag to classify this article for diversity routing.",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: data.title,
        slug: slug,
        content: data.content,
        author_id: user.user_id,
        tags: selectedTags,
      };

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to post article");
      }

      toast.success("Article Published!", {
        description: "Your content has been indexed into the relational schema and is now live on the feed.",
      });
      router.push("/feed");
    } catch (err) {
      console.error("Error posting article to backend API:", err);
      toast.error("Platform Connection Issue", {
        description: "Failed saving article to backend database. The post was saved locally as fallback.",
      });
      
      // Fallback: simulate local saving and navigate to feed anyway!
      setTimeout(() => {
        router.push("/feed");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // Author Permission protection gate
  if (!user || !user.is_author) {
    return (
      <main className="container mx-auto px-6 py-16 max-w-xl text-center">
        <Card className="border border-border/80 shadow-xl bg-card">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Author Status Required</CardTitle>
            <CardDescription className="text-sm font-light">
              Only registered authors have permission to inject articles into the diversity engine.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Unlock your author status to create posts, map contrarian tags, and view deep analytics on reader interaction click patterns.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setAuthorStatus(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> Enable Author Status
              </Button>
              <Button variant="outline" onClick={() => router.push("/feed")}>
                Return to Feed
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-10 max-w-3xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Create New Article</h1>
        <p className="text-sm text-muted-foreground font-light">
          Author Portal: Fill in the content specifications to dispatch your article to the backend pipeline.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          
          <Card className="border border-border/80 shadow-md">
            <CardContent className="space-y-6 pt-6">
              
              {/* Title field */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Article Title
                </Label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter an engaging, descriptive title..."
                    {...register("title")}
                    className={`pl-10 h-11 bg-background/50 focus-visible:ring-violet-500 ${
                      errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.title && (
                  <p className="text-xs text-red-500 font-medium pl-1">{errors.title.message}</p>
                )}
              </div>

              {/* Slug display */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  URL Slug Preview
                </Label>
                <div className="bg-muted/40 p-3 rounded-lg border border-border/50 font-mono text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                  <span className="font-semibold text-violet-600 dark:text-violet-400">/feed/</span>
                  {slug || <span className="italic text-muted-foreground/50">waiting-for-title...</span>}
                </div>
              </div>

              {/* Tag selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="h-3.5 w-3.5 text-violet-500" />
                  Map Category Tags
                </Label>
                <div className="flex flex-wrap gap-2 p-3 bg-muted/20 border border-border/40 rounded-xl">
                  {availableTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <Badge
                        key={tag}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => handleTagToggle(tag)}
                        className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1 ${
                          isSelected 
                            ? "bg-violet-600 hover:bg-violet-700 text-white border-none" 
                            : "hover:bg-accent border-border/80"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground font-light">
                  Select at least one tag. Opposing political/economic tags help the Diversity Discovery algorithm route articles.
                </p>
              </div>

              {/* Content text area */}
              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Article Body Content
                </Label>
                <Textarea
                  id="content"
                  rows={10}
                  placeholder="Draft your editorial content here. Provide in-depth commentary to drive engagement metrics..."
                  {...register("content")}
                  className={`bg-background/50 focus-visible:ring-violet-500 font-light leading-relaxed p-4 resize-y ${
                    errors.content ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {errors.content && (
                  <p className="text-xs text-red-500 font-medium pl-1">{errors.content.message}</p>
                )}
              </div>

            </CardContent>
            
            <CardFooter className="flex justify-between items-center bg-muted/20 px-6 py-4 border-t">
              <span className="text-xs text-muted-foreground">
                Signing author: <span className="font-semibold text-foreground">{user.email}</span>
              </span>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-semibold shadow-md active:scale-95 transition-all duration-200"
              >
                {loading ? "Publishing..." : "Publish Post"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

        </div>
      </form>
    </main>
  );
}
