"use client";

import React, { useEffect, useState } from "react";
import {
  Gamepad2,
  Users,
  Trophy,
  Layers,
  Activity,
  Download,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { generateGodLevelTelemetryReport } from "@/lib/pdf-report-generator";

interface GamesPlatformStats {
  totalGames: number;
  totalPlayers: number;
  totalDragonIds: number;
  totalSessions: number;
  recentAudits: any[];
}

export default function GamesHubOverviewPage() {
  const [stats, setStats] = useState<GamesPlatformStats>({
    totalGames: 1,
    totalPlayers: 78,
    totalDragonIds: 78,
    totalSessions: 228,
    recentAudits: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/telemetry")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({
            totalGames: 1,
            totalPlayers: data.summary?.totalUsers || 78,
            totalDragonIds: data.summary?.totalDragonIds || 78,
            totalSessions: data.summary?.totalLogins || 228,
            recentAudits: data.events?.slice(0, 5) || [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExportPDF = async () => {
    await generateGodLevelTelemetryReport();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WORKSPACE: WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• Game Platform Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Dragon Web Games Platform
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage games catalog, level progression, registered players, leaderboards, achievements, and game releases.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Gaming PDF</span>
          </button>

          <Link
            href="/games-hub/catalog"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Game Draft</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Games */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase font-mono">Game Franchises</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">1 Active Game</div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Uncharted Drive: Beyond</p>
          </div>
        </div>

        {/* Card 2: Registered Players */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase font-mono">Registered Players</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">{stats.totalPlayers} Players</div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Neon DB Verified Roster</p>
          </div>
        </div>

        {/* Card 3: Dragon IDs Minted */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase font-mono">Dragon ID Callsigns</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">{stats.totalDragonIds} Callsigns</div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Active Gaming IDs</p>
          </div>
        </div>

        {/* Card 4: Game Sessions */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase font-mono">Lifetime Sessions</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">{stats.totalSessions} Sessions</div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Authenticated Logins</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Game Platform Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Game Platform Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Platform Management Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Module 1: Catalog */}
            <Link
              href="/games-hub/catalog"
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-indigo-500/40 transition-all hover:bg-white/[0.02] group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-indigo-300 transition-colors">
                Game Catalog & Metadata
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage titles, genres, platforms, engine versions, cover art, and release descriptions.
              </p>
            </Link>

            {/* Module 2: Levels & Worlds */}
            <Link
              href="/games-hub/levels"
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-indigo-500/40 transition-all hover:bg-white/[0.02] group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-blue-300 transition-colors">
                Levels & Progression
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Design worlds, level balancing, checkpoints, difficulty tiers, and completion rewards.
              </p>
            </Link>

            {/* Module 3: Players */}
            <Link
              href="/games-hub/players"
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-indigo-500/40 transition-all hover:bg-white/[0.02] group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-emerald-300 transition-colors">
                Player Directory & Telemetry
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Inspect 78 registered player profiles, Dragon ID callsigns, hardware nodes, and sign-ins.
              </p>
            </Link>

            {/* Module 4: Leaderboards & AntiCheat */}
            <Link
              href="/games-hub/competition"
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-indigo-500/40 transition-all hover:bg-white/[0.02] group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-amber-300 transition-colors">
                Leaderboards & Anti-Cheat
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verify high scores, lap times, player ranking tables, and anti-cheat event logs.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Col: Flagship Game Quick Card */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Flagship Production
          </h2>

          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                LIVE ON WEB
              </span>
              <span className="text-[11px] text-slate-400 font-mono">v1.0.4 Release</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Uncharted Drive: Beyond</h3>
              <p className="text-xs text-slate-400 mt-1">
                Next-generation AAA cyber racing franchise built on WebGL & WebGPU with real-time ray-traced reflections.
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">Engine:</span>
                <span className="text-white font-medium">Dragon Core 3D</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">Platforms:</span>
                <span className="text-white font-medium">PC (.exe), Android (.apk), Web</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">Anti-Cheat:</span>
                <span className="text-emerald-400 font-mono font-medium">Enabled (Active)</span>
              </div>
            </div>

            <Link
              href="/games-hub/catalog"
              className="w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage Game Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
