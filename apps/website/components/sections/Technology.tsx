"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Sparkles, Zap, BrainCircuit, Layers, Activity, CheckCircle2 } from "lucide-react";
import { engineFeatures, EngineFeature } from "@/data/content";
import { cn } from "@/lib/cn";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="size-6 text-neon-purple" />,
  Cpu: <Cpu className="size-6 text-neon-cyan" />,
  Zap: <Zap className="size-6 text-dragon-400" />,
  BrainCircuit: <BrainCircuit className="size-6 text-amber-400" />,
  Layers: <Layers className="size-6 text-emerald-400" />,
};

export default function Technology() {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>(engineFeatures[0].id);

  const activeFeature = engineFeatures.find((f) => f.id === selectedFeatureId) || engineFeatures[0];

  return (
    <section
      id="technology"
      aria-labelledby="tech-section-heading"
      className="relative py-28 lg:py-40 overflow-hidden bg-background"
    >
      {/* Dynamic background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full opacity-15 blur-[200px] transition-all duration-1000"
        style={{ backgroundColor: activeFeature.glowColor }}
      />

      <div className="container-site relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <p className="cinematic-eyebrow">Proprietary Technology</p>

          <h2
            id="tech-section-heading"
            className="mt-6 text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-foreground"
          >
            Dragon <span className="text-gradient">Engine</span>
          </h2>

          <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Built from scratch in C++20 and custom HLSL to eliminate middleware bottlenecks and unlock total artistic control.
          </p>
        </div>

        {/* Feature Grid & Showcase */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left: Feature Selection */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {engineFeatures.map((feature) => {
              const isSelected = feature.id === selectedFeatureId;
              return (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeatureId(feature.id)}
                  className={cn(
                    "group relative flex items-start gap-4 rounded-xl p-5 text-left transition-all duration-300 border",
                    isSelected
                      ? "bg-white/[0.04] border-white/12 shadow-lg shadow-black/20"
                      : "bg-transparent border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02]"
                  )}
                >
                  {/* Active indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeEngineFeatureBar"
                      className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div className="rounded-lg bg-white/[0.04] p-2.5 border border-white/[0.06] shrink-0">
                    {iconMap[feature.iconName] || <Cpu className="size-6 text-primary" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-white truncate">
                        {feature.title}
                      </h3>
                      <span className="text-xs font-black text-dragon-400 shrink-0 font-mono">
                        {feature.metric}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {feature.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Showcase Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl border border-white/[0.08] p-8 sm:p-10 overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01]"
              >
                {/* Top accent line */}
                <div 
                  className={cn("absolute top-0 left-0 right-0 h-px bg-gradient-to-r", activeFeature.gradient)} 
                />

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/[0.06] p-3 border border-white/[0.06]">
                      {iconMap[activeFeature.iconName]}
                    </div>
                    <div>
                      <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">
                        {activeFeature.tagline}
                      </span>
                      <h3 className="text-xl font-black text-white">
                        {activeFeature.title}
                      </h3>
                    </div>
                  </div>

                  <div className="rounded-xl bg-black/40 px-5 py-3 border border-white/[0.06] text-right">
                    <span className="block text-2xl font-black text-dragon-300 font-mono">
                      {activeFeature.metric}
                    </span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      {activeFeature.metricLabel}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* Specs Grid */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 rounded-lg bg-black/25 p-3.5 border border-white/[0.04]">
                    <Activity className="size-4 text-neon-cyan shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-white">DirectX 12 Ultimate & Vulkan 1.3</span>
                      <span className="text-[0.6rem] text-muted-foreground">Native Low-Level Multi-GPU API</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-black/25 p-3.5 border border-white/[0.04]">
                    <CheckCircle2 className="size-4 text-neon-purple shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-white">Cross-Platform Sync</span>
                      <span className="text-[0.6rem] text-muted-foreground">PC, Consoles & High-FPS Handhelds</span>
                    </div>
                  </div>
                </div>

                {/* Bottom callout */}
                <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-white/[0.04] text-xs text-muted-foreground">
                  <span>Engine Architecture</span>
                  <span className="font-mono text-dragon-400 font-bold">0.00ms GC STALL GUARANTEE</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
