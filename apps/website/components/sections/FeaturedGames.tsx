"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Monitor, ChevronRight, Sparkles } from "lucide-react";
import { games } from "@/data/content";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/motion/TiltCard";

export default function FeaturedGames() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [cmsText, setCmsText] = useState({
    eyebrow: "OUR PORTFOLIO",
    title: "IMMERSIVE WORLDS",
    description: "Next-generation gaming experiences engineered for emotional depth, physical reactivity, and unscripted replayability.",
    cta: "EXPLORE ALL GAMES",
  });

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blocks)) {
          const map: Record<string, string> = {};
          data.blocks.forEach((b: any) => { map[b.key] = b.content; });
          setCmsText({
            eyebrow: map["games.eyebrow"] || "OUR PORTFOLIO",
            title: map["games.title"] || "IMMERSIVE WORLDS",
            description: map["games.description"] || "Next-generation gaming experiences engineered for emotional depth, physical reactivity, and unscripted replayability.",
            cta: map["games.cta"] || "EXPLORE ALL GAMES",
          });
        }
      })
      .catch(() => {});
  }, []);

  const filteredGames = activeTab === "all" 
    ? games 
    : games.filter(g => g.status.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <section 
      id="games"
      aria-labelledby="featured-games-heading"
      className="relative py-24 lg:py-36 overflow-hidden bg-[#040812]"
    >
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -left-48 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[180px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -right-48 bottom-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" 
      />

      <div className="container-site relative z-10 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end border-b border-slate-800/80 pb-10">
          <div className="space-y-4 max-w-2xl">
            <span data-cms-key="games.eyebrow" className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
              {cmsText.eyebrow}
            </span>
            <h2 
              id="featured-games-heading"
              data-cms-key="games.title"
              className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-white leading-[0.95]"
            >
              {cmsText.title.includes("WORLDS") || cmsText.title.includes("Worlds") ? (
                <>IMMERSIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">WORLDS</span></>
              ) : (
                cmsText.title
              )}
            </h2>
            <p data-cms-key="games.description" className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              {cmsText.description}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-[#060B18] p-1.5 border border-slate-800 shrink-0 shadow-inner">
            {[
              { id: "all", label: "ALL TITLES" },
              { id: "coming", label: "COMING SOON" },
              { id: "development", label: "IN DEV" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative rounded-xl px-5 py-2.5 text-xs font-heading font-black uppercase tracking-[0.14em] transition-colors duration-300",
                  activeTab === tab.id
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="gameTabIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/40"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Spacious 3-Column Game Showcase Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredGames.slice(0, 3).map((game, index) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TiltCard
                  maxTilt={4}
                  className="h-full group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-500/20 p-8 sm:p-10 transition-all duration-500 hover:border-cyan-400/50 bg-gradient-to-br from-[#0B132B]/90 to-[#060B18]/95 backdrop-blur-md shadow-2xl space-y-8 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)]"
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-500 group-hover:opacity-25",
                      game.palette
                    )}
                  />

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 border border-slate-700">
                      {game.genre}
                    </span>
                    <span className="rounded-full bg-blue-500/15 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 border border-blue-500/30">
                      {game.year}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="relative z-10 space-y-3 my-4">
                    <h3 className="text-3xl font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors leading-none">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-sans">
                      {game.description}
                    </p>
                  </div>

                  {/* Bottom Actions */}
                  <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Monitor className="size-4 text-cyan-400" />
                      <span className="font-bold text-white/90">{game.platforms[0]}</span>
                    </div>

                    <Button variant="default" size="sm" className="rounded-xl px-5 text-xs gap-1.5" asChild>
                      <Link href={`/games/${game.slug}`}>
                        <span>EXPLORE</span>
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All CTA */}
        <div className="pt-6 flex justify-center">
          <Button variant="glowOutline" size="lg" className="rounded-xl gap-2 px-10 text-xs tracking-[0.16em]" asChild>
            <Link href="/games">
              <span>{cmsText.cta}</span>
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
