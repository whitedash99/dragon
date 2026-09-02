"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Trophy,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  Shield,
  Edit2,
} from "lucide-react";

interface LevelItem {
  id: string;
  world: string;
  name: string;
  stageNumber: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | "NIGHTMARE";
  targetScore: number;
  maxTimeSec: number;
  rewardCoins: number;
}

const INITIAL_LEVELS: LevelItem[] = [
  { id: "1", world: "Neo Tokyo Cyber Highway", name: "Midnight Velocity", stageNumber: 1, difficulty: "BEGINNER", targetScore: 10000, maxTimeSec: 120, rewardCoins: 500 },
  { id: "2", world: "Neo Tokyo Cyber Highway", name: "Neon Rush Overdrive", stageNumber: 2, difficulty: "INTERMEDIATE", targetScore: 25000, maxTimeSec: 90, rewardCoins: 1200 },
  { id: "3", world: "Quantum Canyon", name: "Gravity Surge", stageNumber: 3, difficulty: "ADVANCED", targetScore: 50000, maxTimeSec: 75, rewardCoins: 2500 },
  { id: "4", world: "Quantum Canyon", name: "Superluminal Drift", stageNumber: 4, difficulty: "EXPERT", targetScore: 100000, maxTimeSec: 60, rewardCoins: 5000 },
  { id: "5", world: "The Singularity Void", name: "Event Horizon Apex", stageNumber: 5, difficulty: "NIGHTMARE", targetScore: 250000, maxTimeSec: 45, rewardCoins: 10000 },
];

export default function GamesLevelsPage() {
  const [levels] = useState<LevelItem[]>(INITIAL_LEVELS);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "NIGHTMARE":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "EXPERT":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "ADVANCED":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "INTERMEDIATE":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• World Design & Stages</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Level Progression, Worlds & Balancing
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure game stages, difficulty curves, target scores, timer limits, and coin rewards.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 w-fit">
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Stage</span>
        </button>
      </div>

      {/* Levels Table */}
      <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Stage #</th>
                <th className="py-3 px-4">World & Track Name</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Target Score</th>
                <th className="py-3 px-4">Max Time</th>
                <th className="py-3 px-4">Rewards</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {levels.map((lvl) => (
                <tr key={lvl.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-indigo-400 font-bold">
                    Stage {lvl.stageNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{lvl.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{lvl.world}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getDifficultyBadge(lvl.difficulty)}`}>
                      {lvl.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200 font-semibold">
                    {lvl.targetScore.toLocaleString()} PTS
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {lvl.maxTimeSec}s
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-400">
                    +{lvl.rewardCoins} Coins
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
