"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Eye, Clock, User } from "lucide-react";

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
  const [isSending, setIsSending] = useState(false);
  const articleUrl = `/feed/${slug}`;

  // Track B: Silent event delivery pipeline monitoring algorithmic behavior
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
          reading_time_seconds: 5 // Default tracking metric
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

  return (
    <Card 
      onClick={handleInteraction} 
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

      <CardFooter className="border-t border-border/50 pt-4 mt-auto text-xs text-muted-foreground bg-muted/20 px-6 py-3 space-y-3">
        <div className="flex items-center gap-1">
          <User className="h-3.5 w-3.5 text-violet-500" />
          By <span className="font-semibold text-foreground ml-1">{author}</span>
        </div>
        
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1 text-[10px]">
            <Clock className="h-3 w-3" /> 2m read
          </span>
          <Link href={articleUrl} className="text-sm font-semibold text-violet-600 hover:text-violet-700">
            Read full article →
          </Link>
        </div>
        {isSending && (
          <span className="inline-flex h-2 w-2 rounded-full bg-violet-600 animate-ping" title="Registering telemetry" />
        )}
      </CardFooter>
    </Card>
  );
}
