"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace, WORKSPACES, WorkspaceId } from "@/providers/workspace-context";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import {
  Globe,
  Gamepad2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Database,
  Layers,
  Sparkles,
  Lock,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function WorkspaceSelectorPage() {
  const router = useRouter();
  const { switchWorkspace } = useWorkspace();
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelect = (id: WorkspaceId) => {
    switchWorkspace(id, true);
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch {}

    try {
      await signOut({ redirect: false });
    } catch {}

    document.cookie = "dragon_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col justify-between p-6 sm:p-10">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <DragonLogoIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wider uppercase font-mono">
              Dragon Command
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Universal Administration Layer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300 font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Authenticated: {currentUser?.name || "Staff Admin"}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/[0.06] text-xs text-slate-400 hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Selection Area */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12">
        {/* Title and Subtitle */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Single Admin Session • Dual Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Select a workspace
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Choose the product ecosystem you want to manage. You can switch between workspaces at any time without re-authenticating.
          </p>
        </div>

        {/* The Two Primary Workspace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workspace A: Dragon Gaming Studio */}
          <div
            onClick={() => handleSelect("STUDIO_HUB")}
            className="group relative rounded-2xl bg-[#0F172A] border border-white/10 hover:border-blue-500/50 p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer hover:-translate-y-1"
          >
            <div>
              {/* Workspace Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  MAIN STUDIO HUB
                </span>
              </div>

              {/* Workspace Details */}
              <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                Dragon Gaming Studio
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Manage the main Dragon Gaming Studio website, studio content, releases, media assets, company announcements, public pages, and studio infrastructure.
              </p>

              {/* Key Features */}
              <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Website CMS, Layout Blocks & SEO Metadata</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Media Assets, Press Releases & Roadmaps</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Support Inquiries, Dispatch & Studio Health</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect("STUDIO_HUB");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <span>OPEN STUDIO HUB</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Workspace B: Dragon Web Games */}
          <div
            onClick={() => handleSelect("WEB_GAMES")}
            className="group relative rounded-2xl bg-[#0F172A] border border-white/10 hover:border-indigo-500/50 p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer hover:-translate-y-1"
          >
            <div>
              {/* Workspace Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  GAME PLATFORM
                </span>
              </div>

              {/* Workspace Details */}
              <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                Dragon Web Games
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Manage games, game releases, players, game content, game assets, achievements, leaderboards, platform configuration, and game infrastructure.
              </p>

              {/* Key Features */}
              <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Game Catalog, Engines & Release Staging</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Player Accounts, Dragon ID Callsigns & Telemetry</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Live Leaderboards, Anti-Cheat & Achievements</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect("WEB_GAMES");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
              >
                <span>OPEN WEB GAMES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>Shared Core Database: Neon PostgreSQL (ep-still-brook)</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>Security Protocol: DGS-ZERO-TRUST-V2</span>
          <span>© 2026 Dragon Gaming Studios</span>
        </div>
      </footer>
    </div>
  );
}
