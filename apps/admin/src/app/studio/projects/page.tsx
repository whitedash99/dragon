"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Sparkles,
  Milestone,
} from "lucide-react";

interface StudioProject {
  id: string;
  name: string;
  codename: string;
  phase: "CONCEPT" | "ALPHA" | "BETA" | "GOLD_MASTER" | "LIVE_OPS";
  targetDate: string;
  lead: string;
  progress: number;
  description: string;
}

const INITIAL_PROJECTS: StudioProject[] = [
  {
    id: "1",
    name: "Uncharted Drive: Beyond",
    codename: "PROJECT_APEX_DRIVE",
    phase: "LIVE_OPS",
    targetDate: "Q3 2026",
    lead: "Tanish Sharma (Founder & CEO)",
    progress: 100,
    description: "Flagship AAA open-world cyber racing franchise. Built with Dragon Core Web Engine.",
  },
  {
    id: "2",
    name: "Project Chimera: Shadow Realm",
    codename: "PROJECT_CHIMERA",
    phase: "BETA",
    targetDate: "Q4 2026",
    lead: "Alex Vance (Lead Engine Architect)",
    progress: 75,
    description: "Next-generation tactical survival stealth action adventure with real-time ray-traced shadows.",
  },
  {
    id: "3",
    name: "Dragon Neural AI Game SDK",
    codename: "PROJECT_NEURAL_SDK",
    phase: "ALPHA",
    targetDate: "Q1 2027",
    lead: "Gemini AI Core Team",
    progress: 40,
    description: "Real-time procedural NPC generation, autonomous dialogue synthesis, and adaptive physics.",
  },
];

export default function StudioProjectsPage() {
  const [projects] = useState<StudioProject[]>(INITIAL_PROJECTS);

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case "LIVE_OPS":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "GOLD_MASTER":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "BETA":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "ALPHA":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              STUDIO HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">• Productions & Roadmap</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Studio Productions & Game Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track major game productions, milestone delivery, development phases, and roadmap timelines.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-600/20 w-fit">
          <Plus className="w-3.5 h-3.5" />
          <span>New Studio Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-white/20 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">{proj.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">[{proj.codename}]</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border ${getPhaseBadge(proj.phase)}`}>
                  {proj.phase}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {proj.targetDate}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Lead: {proj.lead}</span>
                <span className="text-blue-400 font-semibold">{proj.progress}% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 border border-white/5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
