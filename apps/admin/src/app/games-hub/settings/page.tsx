"use client";

import React, { useState } from "react";
import {
  Settings,
  Gamepad2,
  Save,
  CheckCircle2,
  Shield,
  Server,
  Zap,
} from "lucide-react";

export default function GamesSettingsPage() {
  const [platformName, setPlatformName] = useState("Dragon Web Games");
  const [maxScoreRateLimit, setMaxScoreRateLimit] = useState("60");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            <span className="text-xs text-slate-400 font-mono">• Engine Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Game Platform Configuration & Runtime Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage global runtime limits, leaderboards update intervals, and game engine server parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 w-fit"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saved ? "Saved Successfully!" : "Save Platform Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Platform Identity</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase">Platform Legal Title</label>
              <input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase">Score Rate Limit (Seconds)</label>
              <input
                value={maxScoreRateLimit}
                onChange={(e) => setMaxScoreRateLimit(e.target.value)}
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Security & RBAC Enforcement</h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">HMAC Score Validation:</span>
              <span className="text-emerald-400 font-mono font-semibold">ENFORCED</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Dragon ID Verification:</span>
              <span className="text-emerald-400 font-mono font-semibold">REQUIRED</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Cross-Workspace Sandbox:</span>
              <span className="text-emerald-400 font-mono font-semibold">ACTIVE (403 Isolated)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
