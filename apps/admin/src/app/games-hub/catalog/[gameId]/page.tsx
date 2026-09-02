"use client";

import React, { useState } from "react";
import {
  Gamepad2,
  Layers,
  Users,
  Trophy,
  Award,
  Film,
  Upload,
  Activity,
  Shield,
  Clock,
  ArrowLeft,
  Save,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function GameManagementConsolePage() {
  const params = useParams();
  const gameId = (params?.gameId as string) || "uncharted-drive-beyond";

  const [activeTab, setActiveTab] = useState("overview");
  const [title, setTitle] = useState("Uncharted Drive: Beyond");
  const [slug, setSlug] = useState("uncharted-drive-beyond");
  const [genre, setGenre] = useState("Racing / Open World");
  const [status, setStatus] = useState("PUBLISHED");
  const [engine, setEngine] = useState("Dragon Core 3D (WebGL / WebGPU)");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Gamepad2 },
    { id: "levels", label: "Levels & Worlds", icon: Layers },
    { id: "players", label: "Players", icon: Users },
    { id: "leaderboards", label: "Leaderboards", icon: Trophy },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "media", label: "Media & Keyart", icon: Film },
    { id: "releases", label: "Releases", icon: Upload },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "anti-cheat", label: "Anti-Cheat", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/games-hub/catalog"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Game Catalog</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              GAME CONSOLE
            </span>
            <span className="text-xs text-slate-400 font-mono">• {gameId}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            {title}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive game administration console, engine parameters, progression curves, and build pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`https://dragongamingstudios.vercel.app/games/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <span>Public Game Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saved ? "Saved Successfully!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.08] overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-indigo-500 text-white bg-indigo-500/[0.04]"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Core Game Metadata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Game Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Slug Identifier</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Genre & Category</label>
                <input
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Engine Specification</label>
                <input
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Production Status
              </h2>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Live in Production (v1.0.4)</span>
              </div>
              <p className="text-xs text-slate-400">
                Active worldwide on PC (.exe), Android (.apk), and Web (WebGL).
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "levels" && (
        <div className="p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Configured Game Stages (5 Worlds)
          </h2>
          <p className="text-xs text-slate-400">
            Stages 1 to 5 are active in production. Jump to the Level Manager to balance target scores.
          </p>
          <Link
            href="/games-hub/levels"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Level Manager</span>
          </Link>
        </div>
      )}

      {activeTab !== "overview" && activeTab !== "levels" && (
        <div className="p-8 text-center rounded-xl bg-[#0F172A] border border-white/[0.08] text-xs text-slate-400 space-y-3">
          <Activity className="w-8 h-8 text-indigo-400 mx-auto" />
          <p className="font-medium text-white">Section {activeTab.toUpperCase()} active for {title}.</p>
          <p className="text-[11px] text-slate-500">Connected to shared PostgreSQL database cluster.</p>
        </div>
      )}
    </div>
  );
}
