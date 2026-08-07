"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Play, Clock, Gamepad2, ArrowRight } from "lucide-react";
import { RecommendationEngineService } from "@/lib/ai/recommendationEngine";
import { Button } from "@/components/ui/button";

export function PersonalizedModules() {
  const recommendations = RecommendationEngineService.getPersonalizedRecommendations(["Action RPG", "Racing"]);
  const becauseYouPlayed = RecommendationEngineService.getBecauseYouPlayed("embers-of-valyria");

  return (
    <section className="container-site relative z-10 py-12 space-y-12">
      {/* Recommended For You Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-dragon-400">
              <Sparkles className="size-3.5 text-neon-purple" />
              <span>Personalized Picks</span>
            </div>
            <h2 className="mt-1 text-3xl font-black uppercase text-white">
              Recommended For You
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((g) => (
            <div
              key={g.id}
              className="rounded-3xl glass-heavy p-8 border border-white/15 flex flex-col justify-between overflow-hidden relative group hover:border-white/30 transition-all"
            >
              <div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                  {g.genre}
                </span>

                <h3 className="text-2xl font-black text-white mt-4">{g.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{g.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-dragon-300">{g.status}</span>
                <Button variant="glow" size="sm" className="rounded-full gap-2 text-xs" asChild>
                  <Link href={`/games/${g.slug}`}>
                    <Play className="size-3 fill-current" />
                    <span>Play Title</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
