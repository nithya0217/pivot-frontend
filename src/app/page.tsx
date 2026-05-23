"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shuffle, ShieldCheck, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-background">
      
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 py-20 max-w-5xl flex flex-col items-center text-center relative z-10">
        
        {/* Intro Badge */}
        <Badge variant="outline" className="mb-6 px-3 py-1 text-xs font-semibold bg-violet-100/50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 border-violet-500/30 flex items-center gap-1.5 rounded-full animate-bounce">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Gen Algorithmic Curation
        </Badge>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-6">
          The Digital Platform <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
            Reframing Perspectives
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-3xl leading-relaxed mb-10">
          Introducing <strong>Pivot</strong>: a publishing space operating on <strong>Track B (Diversity Routing)</strong>. 
          By deploying contrarian routing maps, we intelligently balance opinion clusters, offering readers alternative view angles silently backed by real-time interaction telemetry.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <Link href="/feed">
            <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-[1px] active:translate-y-[1px] active:scale-98 transition-all duration-200">
              Explore Curation Feed
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="h-12 px-8 border-border hover:bg-accent font-semibold transition-all">
              Join as Contributor
            </Button>
          </Link>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <Card className="border border-border/80 bg-card/45 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:border-violet-500/20">
            <CardContent className="pt-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/20 flex items-center justify-center">
                <Shuffle className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-lg">Diversity Routing</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Breaks user polarization patterns by dynamically routing contrarian view points into the discovery layout.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/80 bg-card/45 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:border-violet-500/20">
            <CardContent className="pt-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/20 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-lg">Silent Telemetry</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Subtle background tracking logs reading behaviors seamlessly to train the diversity ranking pipeline without layout blocks.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/80 bg-card/45 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:border-violet-500/20">
            <CardContent className="pt-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-lg">Relational Ingestion</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Structured schemas support tags, slugs, author privileges, and click interaction logging with full FastAPI synchronicity.
              </p>
            </CardContent>
          </Card>

        </div>

      </div>
    </main>
  );
}
