"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Sparkles: <Sparkles className="size-4 text-cyan-400" />,
  Cpu: <Cpu className="size-4 text-blue-400" />,
  Zap: <Zap className="size-4 text-purple-400" />,
  BrainCircuit: <BrainCircuit className="size-4 text-cyan-300" />,
  Layers: <Layers className="size-4 text-teal-400" />,
};

import { getClientCmsBlocks } from "@/lib/client-cms-cache";

export default function StudioTech() {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>(engineFeatures[0].id);
  const [cmsText, setCmsText] = useState({
    studioEyebrow: studioStory.eyebrow,
    studioTitle: studioStory.headline,
    studioLead: studioStory.lead,
    studioMission: studioStory.mission,
  });

  useEffect(() => {
    getClientCmsBlocks().then((map) => {
      if (Object.keys(map).length > 0) {
        setCmsText((prev) => ({
          studioEyebrow: map["studio.eyebrow"] || prev.studioEyebrow,
          studioTitle: map["studio.title"] || prev.studioTitle,
          studioLead: map["studio.description"] || map["studio.lead"] || prev.studioLead,
          studioMission: map["studio.mission"] || prev.studioMission,
        }));
      }
    });

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
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-transparent"
    >
      {/* Background Electric Blue & Cyan Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[220px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 bottom-1/4 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[200px]"
      />

      <div className="container-site relative z-10 space-y-12 sm:space-y-16 px-4 sm:px-6">
        {/* ═══ 1. Studio Manifesto Header ═══ */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-center border-b border-white/10 pb-8 sm:pb-12">
          <div className="lg:col-span-7 space-y-3">
            <span data-cms-key="studio.eyebrow" className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
              {cmsText.studioEyebrow}
            </span>
            <h2
              id="studio-tech-heading"
              data-cms-key="studio.title"
              className="text-3xl font-black uppercase tracking-tight sm:text-5xl text-white leading-[0.95] font-heading"
            >
              {cmsText.studioTitle}
            </h2>
            <p data-cms-key="studio.lead" className="text-xs sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl">
              {cmsText.studioLead}
            </p>
          </div>

          {/* Mission Quote Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#070B14]/90 p-6 sm:p-8 border border-blue-500/30 shadow-xl space-y-2.5">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-400 block">
                STUDIO MISSION
              </span>
              <p data-cms-key="studio.mission" className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed italic font-sans">
                &quot;{cmsText.studioMission}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* ═══ 2. Real Architecture Capabilities Grid ═══ */}
        <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, idx) => (
            <div 
              key={stat.id}
              className="rounded-2xl border border-white/10 p-4 sm:p-5 bg-[#070B14]/90 flex items-center gap-3 sm:gap-4 hover:border-cyan-500/40 transition-all shadow-md"
            >
              <div className="rounded-xl bg-blue-600/10 p-2 sm:p-2.5 border border-blue-500/20 shrink-0 text-cyan-400">
                {idx === 0 && <Gamepad2 className="size-4 sm:size-5" />}
                {idx === 1 && <Layers className="size-4 sm:size-5" />}
                {idx === 2 && <Cpu className="size-4 sm:size-5" />}
                {idx === 3 && <Activity className="size-4 sm:size-5" />}
              </div>

              <div>
                <span className="text-lg sm:text-2xl font-black text-white font-mono block leading-none">
                  {stat.prefix}{stat.value}{stat.suffix}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider block mt-1 font-mono truncate">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ 3. Proprietary Dragon Engine Architecture ═══ */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                PROPRIETARY TECH
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase text-white font-heading">
                DRAGON <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">3D & 2D ENGINE</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed font-sans">
              Data-oriented game engine engineered for high frame rates, deterministic physics, and instant cross-platform builds.
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
                      "flex items-center gap-3 rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-300 border text-xs cursor-pointer",
                      isSelected
                        ? "bg-blue-950/40 border-cyan-400 shadow-md text-white font-bold"
                        : "bg-[#070B14]/80 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-white"
                    )}
                  >
                    <div className="rounded-xl bg-cyan-500/10 p-2 border border-cyan-500/30 shrink-0">
                      {iconMap[feature.iconName] || <Cpu className="size-4 text-cyan-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block font-black text-white truncate text-xs sm:text-sm uppercase tracking-wide">{feature.title}</span>
                      <span className="block text-[10px] sm:text-[11px] font-mono text-cyan-300 font-medium">{feature.metric}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Feature Display Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#070B14]/90 border border-blue-500/30 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] sm:text-xs font-mono font-bold text-cyan-300 uppercase">
                    {activeFeature.metric}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                    PROPRIETARY TECH
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight font-heading">
                    {activeFeature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {activeFeature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold">
                    <CheckCircle2 className="size-3.5" />
                    <span>Cross-Platform Ready</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/30 font-bold">
                    <span>Native 120 FPS Target</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
