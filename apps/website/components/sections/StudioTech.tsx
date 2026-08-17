"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Cpu, 
  Sparkles, 
  Zap, 
  BrainCircuit, 
  Layers, 
  Users, 
  Globe, 
  Award, 
  CheckCircle2 
} from "lucide-react";
import { studioStory, engineFeatures, statistics } from "@/data/content";
import { cn } from "@/lib/cn";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="size-5 text-cyan-400" />,
  Cpu: <Cpu className="size-5 text-blue-400" />,
  Zap: <Zap className="size-5 text-sky-400" />,
  BrainCircuit: <BrainCircuit className="size-5 text-cyan-300" />,
  Layers: <Layers className="size-5 text-blue-500" />,
};

export default function StudioTech() {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>(engineFeatures[0].id);
  const [cmsText, setCmsText] = useState({
    studioEyebrow: studioStory.eyebrow,
    studioTitle: studioStory.headline,
    studioLead: studioStory.lead,
    studioMission: studioStory.mission,
  });

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blocks)) {
          const map: Record<string, string> = {};
          data.blocks.forEach((b: any) => { map[b.key] = b.content; });
          setCmsText({
            studioEyebrow: map["studio.eyebrow"] || "THE STUDIO",
            studioTitle: map["studio.title"] || studioStory.headline,
            studioLead: map["studio.lead"] || studioStory.lead,
            studioMission: map["studio.mission"] || studioStory.mission,
          });
        }
      })
      .catch(() => {});
  }, []);

  const activeFeature = engineFeatures.find((f) => f.id === selectedFeatureId) || engineFeatures[0];

  return (
    <section
      id="studio"
      aria-labelledby="studio-tech-heading"
      className="relative py-24 lg:py-36 overflow-hidden bg-[#040812]"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[200px]"
      />

      <div className="container-site relative z-10 space-y-20">
        {/* ═══ 1. Studio Manifesto Header ═══ */}
        <div className="grid gap-12 lg:grid-cols-12 items-center border-b border-slate-800 pb-12">
          <div className="lg:col-span-7 space-y-4">
            <span data-cms-key="studio.eyebrow" className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
              {cmsText.studioEyebrow}
            </span>
            <h2
              id="studio-tech-heading"
              data-cms-key="studio.title"
              className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-white leading-[0.95]"
            >
              {cmsText.studioTitle}
            </h2>
            <p data-cms-key="studio.lead" className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans max-w-xl">
              {cmsText.studioLead}
            </p>
          </div>

          {/* Quick Mission Quote Card */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0B132B]/90 p-8 sm:p-10 border border-blue-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] space-y-3 backdrop-blur-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400 block">
              STUDIO MISSION STATEMENT
            </span>
            <p data-cms-key="studio.mission" className="text-sm sm:text-base font-semibold text-slate-200 leading-relaxed italic font-sans">
              &quot;{cmsText.studioMission}&quot;
            </p>
          </div>
        </div>

        {/* ═══ 2. Statistics Counter Grid ═══ */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, idx) => (
            <div
              key={stat.id}
              className="rounded-2xl border border-blue-500/20 p-6 bg-[#060B18]/90 flex items-center gap-5 hover:border-cyan-400/50 transition-all shadow-xl hover:shadow-[0_0_25px_rgba(37,99,235,0.2)]"
            >
              <div className="rounded-xl bg-blue-600/15 p-3 border border-blue-500/30 shrink-0">
                {idx === 0 && <Users className="size-5 text-cyan-400" />}
                {idx === 1 && <Flame className="size-5 text-blue-400" />}
                {idx === 2 && <Globe className="size-5 text-sky-400" />}
                {idx === 3 && <Award className="size-5 text-cyan-300" />}
              </div>

              <div>
                <span className="text-2xl font-black text-white font-mono block leading-none">
                  {stat.prefix}{stat.value}{stat.suffix}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1.5 font-mono">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ 3. Proprietary Dragon Engine Architecture ═══ */}
        <div className="pt-8 border-t border-slate-800 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                PROPRIETARY ENGINE
              </span>
              <h3 className="text-3xl font-black uppercase text-white sm:text-4xl">
                DRAGON ENGINE ARCHITECTURE
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-sans">
              Data-oriented C++20 engine built to eliminate allocation stalls and power multi-million entity simulations.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Feature Selectors */}
            <div className="lg:col-span-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {engineFeatures.map((feature) => {
                const isSelected = feature.id === selectedFeatureId;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeatureId(feature.id)}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 border text-xs",
                      isSelected
                        ? "bg-blue-600/20 border-cyan-400/60 shadow-xl text-white font-bold"
                        : "bg-[#060B18] border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-white"
                    )}
                  >
                    <div className="rounded-xl bg-blue-500/10 p-2.5 border border-blue-500/20 shrink-0">
                      {iconMap[feature.iconName] || <Cpu className="size-4 text-cyan-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block font-black text-white truncate text-sm uppercase tracking-wide">{feature.title}</span>
                      <span className="block text-[11px] font-mono text-cyan-400">{feature.metric}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feature Active Inspector */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-blue-500/30 p-8 sm:p-12 bg-gradient-to-br from-[#0B132B]/90 to-[#060B18]/95 relative overflow-hidden shadow-2xl space-y-6"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-300 shadow-[0_0_15px_#38bdf8]" />

                  <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-blue-600/20 p-3.5 border border-blue-500/30">
                        {iconMap[activeFeature.iconName]}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 block">
                          {activeFeature.tagline}
                        </span>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">{activeFeature.title}</h4>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#060B18] px-4 py-2 border border-blue-500/30 text-right font-mono">
                      <span className="block text-sm font-black text-cyan-300">{activeFeature.metric}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {activeFeature.description}
                  </p>

                  <div className="pt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                      <span>DirectX 12 Ultimate & Vulkan 1.3 Native</span>
                    </div>
                    <span className="font-bold text-cyan-400">0.00ms STALL</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
