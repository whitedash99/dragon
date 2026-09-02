"use client";

import React, { useState } from "react";
import {
  Award,
  Trophy,
  Plus,
  Flame,
  Zap,
  Shield,
  Star,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface AchievementDef {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  rewardXp: number;
  unlockedCount: number;
  icon: string;
}

const INITIAL_ACHIEVEMENTS: AchievementDef[] = [
  { id: "1", code: "FIRST_IGNITION", name: "First Ignition", category: "PROGRESSION", description: "Complete your first race session in Uncharted Drive.", rewardXp: 500, unlockedCount: 78, icon: "Flame" },
  { id: "2", code: "HYPERSONIC_PILOT", name: "Hypersonic Pilot", category: "SPEED", description: "Reach 350 KM/H top speed on Neo Tokyo Highway.", rewardXp: 1500, unlockedCount: 42, icon: "Zap" },
  { id: "3", code: "APEX_DRIFT_KING", name: "Apex Drift King", category: "SKILL", description: "Execute a continuous 5,000-point nitro drift without collision.", rewardXp: 3000, unlockedCount: 18, icon: "Trophy" },
  { id: "4", code: "SINGULARITY_CONQUEROR", name: "Singularity Conqueror", category: "MASTERY", description: "Defeat Stage 5 on Nightmare difficulty.", rewardXp: 10000, unlockedCount: 6, icon: "Star" },
];

export default function GamesAchievementsPage() {
  const [achievements] = useState<AchievementDef[]>(INITIAL_ACHIEVEMENTS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• Achievements & Rewards</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Player Achievements & Reward Badges
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure unlock criteria, player XP rewards, badge definitions, and unlock distribution statistics.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 w-fit">
          <Plus className="w-3.5 h-3.5" />
          <span>New Achievement</span>
        </button>
      </div>

      {/* Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-indigo-500/30 transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{ach.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/5 border border-white/10 text-slate-400">
                  {ach.category}
                </span>
              </div>

              <p className="text-xs text-slate-400">{ach.description}</p>

              <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-slate-400">
                <span className="text-amber-400">+{ach.rewardXp} XP Reward</span>
                <span>Unlocked by {ach.unlockedCount} Players</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
