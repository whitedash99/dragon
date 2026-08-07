"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Gamepad2, ArrowRight } from "lucide-react";
import { RecommendationEngineService } from "@/lib/ai/recommendationEngine";
import { games } from "@/data/content";

export function SmartCollections() {
  const collections = RecommendationEngineService.getSmartCollections();

  return (
    <section className="container-site relative z-10 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-dragon-400">
            <Sparkles className="size-3.5 text-neon-cyan" />
            <span>AI Collections</span>
          </div>
          <h2 className="mt-1 text-3xl font-black uppercase text-white">
            Smart Curated Collections
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {collections.map((col) => {
          const matchedGames = games.filter((g) => col.gameSlugs.includes(g.slug));

          return (
            <div
              key={col.id}
              className="rounded-3xl glass-heavy p-8 border border-white/15 flex flex-col justify-between overflow-hidden relative group hover:border-white/30 transition-all"
            >
              <div className="relative z-10">
                <span className="rounded-full bg-dragon-500/20 px-3 py-1 text-[10px] font-bold text-dragon-300 border border-dragon-500/30 uppercase tracking-widest">
                  {col.badge}
                </span>

                <h3 className="text-2xl font-black text-white mt-4">{col.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{col.subtitle}</p>

                <div className="mt-6 space-y-2">
                  {matchedGames.map((g) => (
                    <Link
                      key={g.id}
                      href={`/games/${g.slug}`}
                      className="flex items-center justify-between rounded-xl bg-black/40 p-3 text-xs font-bold text-white border border-white/5 hover:border-white/20 transition-all group/item"
                    >
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="size-4 text-dragon-400" />
                        <span>{g.title}</span>
                      </div>
                      <ArrowRight className="size-3.5 text-muted-foreground group-hover/item:text-white transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
