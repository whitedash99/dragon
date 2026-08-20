"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Sparkles, 
  Zap, 
  BrainCircuit, 
  Layers, 
  Gamepad2, 
  Activity, 
  CheckCircle2 
} from "lucide-react";
import { studioStory, engineFeatures, statistics } from "@/data/content";
import { cn } from "@/lib/cn";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="size-4 sm:size-5 text-cyan-400" />,
  Cpu: <Cpu className="size-4 sm:size-5 text-blue-400" />,
  Zap: <Zap className="size-4 sm:size-5 text-sky-400" />,
  BrainCircuit: <BrainCircuit className="size-4 sm:size-5 text-cyan-300" />,
  Layers: <Layers className="size-4 sm:size-5 text-blue-500" />,
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
    fetch("/api/cms/blocks")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blocks)) {
          const map: Record<string, string> = {};
          data.blocks.forEach((b: any) => { map[b.key] = b.content; });
          setCmsText((prev) => ({
            studioEyebrow: map["studio.eyebrow"] || prev.studioEyebrow,
            studioTitle: map["studio.title"] || prev.studioTitle,
            studioLead: map["studio.description"] || map["studio.lead"] || prev.studioLead,
            studioMission: map["studio.mission"] || prev.studioMission,
          }));
        }
      })
      .catch(() => {});

    const handleSync = (event: MessageEvent) => {
      const { type, key, content } = event.data || {};
      if (
        (type === "DRAGON_CMS_TEXT_UPDATE" ||
         type === "DRAGON_CMS_REALTIME_SYNC" ||
         type === "DRAGON_CMS_TEXT_TYPING") &&
        key && content !== undefined
      ) {
        setCmsText((prev) => {
          if (key === "studio.eyebrow") return { ...prev, studioEyebrow: content };
          if (key === "studio.title") return { ...prev, studioTitle: content };
          if (key === "studio.description" || key === "studio.lead") return { ...prev, studioLead: content };
          if (key === "studio.mission") return { ...prev, studioMission: content };
          return prev;
        });
      }
    };

    window.addEventListener("message", handleSync);
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("dragon_cms_live_sync");
      bc.addEventListener("message", handleSync);
    } catch {}

    return () => {
      window.removeEventListener("message", handleSync);
      if (bc) {
        bc.removeEventListener("message", handleSync);
        bc.close();
      }
    };
  }, []);

  const activeFeature = engineFeatures.find((f) => f.id === selectedFeatureId) || engineFeatures[0];

  return (
    <section
      id="studio"
      aria-labelledby="studio-tech-heading"
      className="relative py-14 sm:py-24 lg:py-36 overflow-hidden bg-[#040812]"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[200px]"
      />

      <div className="container-site relative z-10 space-y-12 sm:space-y-20 px-4 sm:px-6">
        {/* ═══ 1. Studio Manifesto Header ═══ */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-center border-b border-slate-800 pb-8 sm:pb-12">
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <span data-cms-key="studio.eyebrow" className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
              {cmsText.studioEyebrow}
            </span>
            <h2
              id="studio-tech-heading"
              data-cms-key="studio.title"
              className="text-3xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-white leading-[0.95]"
            >
              {cmsText.studioTitle}
            </h2>
            <p data-cms-key="studio.lead" className="text-xs sm:text-base text-slate-400 leading-relaxed font-sans max-w-xl">
              {cmsText.studioLead}
            </p>
          </div>

          {/* Quick Mission Quote Card */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0B132B]/90 p-5 sm:p-8 lg:p-10 border border-blue-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] space-y-2 sm:space-y-3 backdrop-blur-xl">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400 block">
              STUDIO MISSION STATEMENT
            </span>
            <p data-cms-key="studio.mission" className="text-xs sm:text-base font-semibold text-slate-200 leading-relaxed italic font-sans">
              &quot;{cmsText.studioMission}&quot;
            </p>
          </div>
        </div>

        {/* ═══ 2. Statistics Counter Grid (2x2 on Mobile) ═══ */}
        <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, idx) => (
            <div
              key={stat.id}
              className="rounded-2xl border border-blue-500/20 p-4 sm:p-6 bg-[#060B18]/90 flex items-center gap-3 sm:gap-5 hover:border-cyan-400/50 transition-all shadow-xl hover:shadow-[0_0_25px_rgba(37,99,235,0.2)]"
            >
              <div className="rounded-xl bg-blue-600/15 p-2 sm:p-3 border border-blue-500/30 shrink-0">
                {idx === 0 && <Gamepad2 className="size-4 sm:size-5 text-cyan-400" />}
                {idx === 1 && <Layers className="size-4 sm:size-5 text-blue-400" />}
                {idx === 2 && <Cpu className="size-4 sm:size-5 text-sky-400" />}
                {idx === 3 && <Activity className="size-4 sm:size-5 text-emerald-400" />}
              </div>

              <div>
                <span className="text-xl sm:text-2xl font-black text-white font-mono block leading-none">
                  {stat.prefix}{stat.value}{stat.suffix}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1 font-mono truncate">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ 3. Proprietary Dragon Engine Architecture ═══ */}
        <div className="pt-6 sm:pt-8 border-t border-slate-800 space-y-8 sm:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                PROPRIETARY TECH
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase text-white">
                DRAGON 3D & 2D ENGINE
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-sans">
              Data-oriented engine built to deliver high frame rates, deterministic physics, and instant cross-platform builds.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 items-start">
            {/* Feature Selectors */}
            <div className="lg:col-span-5 grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              {engineFeatures.map((feature) => {
                const isSelected = feature.id === selectedFeatureId;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeatureId(feature.id)}
                    className={cn(
                      "flex items-center gap-3 sm:gap-4 rounded-2xl p-3 sm:p-4 text-left transition-all duration-300 border text-xs cursor-pointer active:scale-95",
                      isSelected
                        ? "bg-blue-600/20 border-cyan-400/60 shadow-xl text-white font-bold"
                        : "bg-[#060B18] border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-white"
                    )}
                  >
                    <div className="rounded-xl bg-blue-500/10 p-2 sm:p-2.5 border border-blue-500/20 shrink-0">
                      {iconMap[feature.iconName] || <Cpu className="size-4 text-cyan-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block font-black text-white truncate text-xs sm:text-sm uppercase tracking-wide">{feature.title}</span>
                      <span className="block text-[10px] sm:text-[11px] font-mono text-cyan-400">{feature.metric}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Feature Display Card */}
            <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#0B132B]/90 via-[#070D1E]/95 to-[#040812] border border-cyan-500/30 p-5 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-4 sm:space-y-6">
              <div aria-hidden="true" className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
              
              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] sm:text-xs font-mono font-bold text-cyan-300 uppercase">
                  {activeFeature.metric}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase">
                  100% PROPRIETARY
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <h4 className="text-xl sm:text-3xl font-black uppercase text-white tracking-tight font-heading">
                  {activeFeature.title}
                </h4>
                <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-sans">
                  {activeFeature.description}
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold">
                  <CheckCircle2 className="size-3.5" />
                  <span>Cross-Platform Ready</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-cyan-300 bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-500/30 font-bold">
                  <span>Native 120 FPS Target</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
