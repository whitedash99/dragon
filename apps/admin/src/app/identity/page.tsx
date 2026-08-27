"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  KeyRound, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Crown, 
  Flame, 
  Eye, 
  ExternalLink 
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DragonIdPlayer {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  isProtected?: boolean;
  avatar?: string;
  profile?: {
    dragonId?: string;
    tagline?: string;
    title?: string;
    level?: number;
    avatarUrl?: string;
    bannerUrl?: string;
    hasCompletedWelcome?: boolean;
    hasForgedDragonId?: boolean;
  } | null;
  passkeysCount?: number;
  activeSessionsCount?: number;
  createdAt: string;
}

export default function DragonIdPage() {
  const [users, setUsers] = useState<DragonIdPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "FORGED" | "PENDING">("ALL");

  const fetchIdentityData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users?role=All");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error("Fetch identity error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdentityData();
  }, [fetchIdentityData]);

  const filteredUsers = users.filter((u) => {
    const handle = (u.profile?.dragonId || u.name || "").toLowerCase();
    const email = u.email.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || handle.includes(q) || email.includes(q);

    if (filterType === "FORGED") {
      return matchesSearch && (u.profile?.hasForgedDragonId || !!u.profile?.dragonId);
    }
    if (filterType === "PENDING") {
      return matchesSearch && (!u.profile?.hasForgedDragonId && !u.profile?.dragonId);
    }
    return matchesSearch;
  });

  const forgedCount = users.filter((u) => u.profile?.hasForgedDragonId || !!u.profile?.dragonId).length;
  const pendingCount = users.length - forgedCount;

  return (
    <div className="flex min-h-screen bg-[#02040A] text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 scrollbar-thin scrollbar-thumb-cyan-500/20 font-mono">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
                <span>Dragon ID Universal Identity Protocol (DIP)</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-heading">
                Dragon ID Command Center
              </h1>
            </div>

            <button
              onClick={fetchIdentityData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#03091D] hover:bg-cyan-500/15 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={cn("size-3.5", loading && "animate-spin text-cyan-400")} />
              <span>Sync Identity Ledger</span>
            </button>
          </div>

          {/* Metrics */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 font-mono">
            <div className="bg-[#03091D]/90 border border-cyan-500/25 p-4 rounded-2xl space-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-cyan-400/80 uppercase text-[11px] font-bold block">Total Accounts</span>
              <span className="text-2xl font-black text-white block">{users.length}</span>
              <span className="text-[10px] text-slate-500">PostgreSQL Identities</span>
            </div>
            <div className="bg-[#03091D]/90 border border-cyan-500/25 p-4 rounded-2xl space-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-emerald-400 uppercase text-[11px] font-bold block">Forged Dragon IDs</span>
              <span className="text-2xl font-black text-emerald-400 block">{forgedCount}</span>
              <span className="text-[10px] text-slate-500">Active Player Call Signs</span>
            </div>
            <div className="bg-[#03091D]/90 border border-cyan-500/25 p-4 rounded-2xl space-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-amber-400 uppercase text-[11px] font-bold block">Pending Onboarding</span>
              <span className="text-2xl font-black text-amber-400 block">{pendingCount}</span>
              <span className="text-[10px] text-slate-500">Gate: /welcome $\rightarrow$ /dragon-id/setup</span>
            </div>
            <div className="bg-[#03091D]/90 border border-cyan-500/25 p-4 rounded-2xl space-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-purple-400 uppercase text-[11px] font-bold block">Flagship Title</span>
              <span className="text-sm font-black text-cyan-300 block truncate">UNCHARTED DRIVE</span>
              <span className="text-[10px] text-emerald-400">Canonical Integration</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#03091D]/90 p-4 rounded-2xl border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-1.5">
              {(["ALL", "FORGED", "PENDING"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    filterType === f
                      ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {f === "ALL" ? "All Accounts" : f === "FORGED" ? "Forged IDs" : "Pending Setup"}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Dragon ID, email, or name..."
                className="w-full pl-9 pr-4 py-2 bg-[#02050E] border border-cyan-500/30 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
              />
            </div>
          </div>

          {/* Identity Cards Grid */}
          {loading ? (
            <div className="py-16 text-center text-cyan-400 text-xs font-mono animate-pulse">
              Syncing Dragon ID ledger from PostgreSQL...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs font-mono">
              No matching Dragon ID records found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => {
                const dragonId = user.profile?.dragonId || user.name || "UNREGISTERED";
                const isForged = Boolean(user.profile?.hasForgedDragonId || user.profile?.dragonId);
                const title = user.profile?.title || (user.role === "OWNER" ? "Grand Master" : "Recruit");
                const level = user.profile?.level || (user.role === "OWNER" ? 99 : 1);
                const avatar = user.profile?.avatarUrl || user.avatar || "/images/avatars/cyber-samurai.png";
                const banner = user.profile?.bannerUrl || "/images/uncharted-drive-banner.png";

                return (
                  <div
                    key={user.id}
                    className="p-4 rounded-2xl bg-[#03091D]/95 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3 relative overflow-hidden group hover:border-cyan-400/50 transition-all"
                  >
                    {/* Banner backdrop preview */}
                    <div className="h-16 -mx-4 -mt-4 relative overflow-hidden bg-[#02050E] border-b border-cyan-500/20">
                      <img
                        src={banner}
                        alt="Profile Banner"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#03091D] via-transparent to-transparent" />
                      <div className="absolute top-2 right-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border backdrop-blur-md",
                          isForged ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40" : "bg-amber-500/20 text-amber-300 border-amber-400/40"
                        )}>
                          {isForged ? "DRAGON ID FORGED" : "PENDING ONBOARDING"}
                        </span>
                      </div>
                    </div>

                    {/* Avatar and Call Sign */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative size-12 rounded-xl overflow-hidden bg-[#02050E] border border-cyan-500/40 shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                        <img
                          src={avatar}
                          alt={dragonId}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 font-bold text-sm text-white truncate">
                          <span className="text-cyan-400">@</span>
                          <span className="truncate">{dragonId}</span>
                          {user.role === "OWNER" && <Crown className="size-3.5 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10.5px]">
                      <div className="p-2 rounded-xl bg-[#02050E] border border-white/5">
                        <div className="text-[9px] text-slate-500">PLAYER TITLE</div>
                        <div className="font-bold text-slate-200 truncate mt-0.5">{title}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#02050E] border border-white/5">
                        <div className="text-[9px] text-slate-500">EXPERIENCE TIER</div>
                        <div className="font-bold text-cyan-300 mt-0.5 flex items-center gap-1">
                          <Flame className="size-3 text-cyan-400" />
                          <span>LVL {level}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
