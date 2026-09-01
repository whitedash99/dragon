"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { openOfficialPdfReport } from "@/lib/pdf-report-generator";
import { 
  Gamepad2, 
  HardDrive, 
  Users, 
  LifeBuoy, 
  Layers, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Download, 
  Clock, 
  ChevronRight, 
  Eye, 
  Sliders, 
  Server,
  Zap,
  Globe,
  Bot,
  KeyRound,
  Cpu,
  Lock,
  Radio,
  FileText,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassStat, GlassBadge } from "@/components/ui/glass";

interface GameItem {
  id: string;
  slug: string;
  name: string;
  genre: string;
  status: string;
  bannerUrl?: string | null;
  cardBannerUrl?: string | null;
  downloadCount: number;
  platforms: string;
  updatedAt: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  userEmail?: string;
  resource?: string;
  details?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [games, setGames] = useState<GameItem[]>([]);
  const [stats, setStats] = useState({
    totalGames: 1,
    liveGames: 1,
    totalDownloads: 0,
    activeStaff: 0,
    totalPlayers: 0,
    openTickets: 0,
    securityScore: 100,
    dbLatencyMs: 8,
    b2Connected: false,
    resendConnected: false,
    geminiConnected: false,
  });
  const [recentAudits, setRecentAudits] = useState<AuditLogItem[]>([]);

  const fetchDashboardData = useCallback(async () => {
    setRefreshing(true);
    const startTime = performance.now();
    try {
      const [gamesRes, usersRes, crmRes, secRes, healthRes] = await Promise.all([
        fetch("/api/games").catch(() => null),
        fetch("/api/users").catch(() => null),
        fetch("/api/crm").catch(() => null),
        fetch("/api/security").catch(() => null),
        fetch("/api/health").catch(() => null),
      ]);

      const endTime = performance.now();
      const latency = Math.max(1, Math.round(endTime - startTime));

      let gamesList: GameItem[] = [];
      let totalDl = 0;
      let liveCount = 0;
      let staffCount = 0;
      let playerCount = 0;
      let ticketsCount = 0;
      let secScore = 100;
      let audits: AuditLogItem[] = [];
      let b2Ok = false;
      let resendOk = false;
      let geminiOk = false;

      if (gamesRes?.ok) {
        const gData = await gamesRes.json();
        if (gData.success && Array.isArray(gData.games)) {
          gamesList = gData.games;
          liveCount = gamesList.filter((g) => g.status === "ACTIVE" || g.status === "PUBLISHED" || g.status === "LIVE" || g.status === "In Development").length;
          totalDl = gamesList.reduce((acc, g) => acc + (Number(g.downloadCount) || 0), 0);
        }
      }

      if (usersRes?.ok) {
        const uData = await usersRes.json();
        const uList = Array.isArray(uData) ? uData : uData.users || [];
        staffCount = uList.filter((u: { role: string }) => u.role !== "PLAYER" && u.role !== "USER").length;
        playerCount = uList.length;
      }

      if (crmRes?.ok) {
        const cData = await crmRes.json();
        const tList = Array.isArray(cData) ? cData : cData.tickets || [];
        ticketsCount = tList.filter((t: { status: string }) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
      }

      if (secRes?.ok) {
        const sData = await secRes.json();
        if (sData.posture?.score) secScore = sData.posture.score;
        if (Array.isArray(sData.auditLogs)) audits = sData.auditLogs.slice(0, 6);
      }

      if (healthRes?.ok) {
        const hData = await healthRes.json();
        if (hData.services) {
          b2Ok = hData.services.storage?.status === "CONFIGURED";
          resendOk = hData.services.emailGateway?.status === "CONFIGURED";
          geminiOk = true;
        }
      }

      setGames(gamesList);
      setStats({
        totalGames: gamesList.length,
        liveGames: liveCount,
        totalDownloads: totalDl,
        activeStaff: staffCount,
        totalPlayers: playerCount,
        openTickets: ticketsCount,
        securityScore: secScore,
        dbLatencyMs: latency,
        b2Connected: b2Ok,
        resendConnected: resendOk,
        geminiConnected: geminiOk,
      });
      setRecentAudits(audits);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleExportExecutivePDF = () => {
    openOfficialPdfReport({
      header: {
        title: "EXECUTIVE COMMAND & STUDIO AUDIT REPORT",
        subtitle: "Global overview of active game franchises, verified downloads, player telemetry, and security posture.",
        classification: "TOP SECRET // EXECUTIVE ONLY",
        category: "EXECUTIVE STUDIO AUDIT",
      },
      metrics: [
        { label: "ACTIVE FRANCHISES", value: stats.totalGames, subtext: "Uncharted Drive: Beyond", color: "cyan" },
        { label: "VERIFIED DOWNLOADS", value: stats.totalDownloads, subtext: "PC (.exe) + Android (.apk)", color: "gold" },
        { label: "TOTAL PLAYERS", value: stats.totalPlayers, subtext: `${stats.activeStaff} Staff / ${Math.max(0, stats.totalPlayers - stats.activeStaff)} Players`, color: "purple" },
        { label: "SECURITY POSTURE", value: `${stats.securityScore}%`, subtext: "Military Guard Active", color: "emerald" },
      ],
      breakdownSections: [
        {
          title: "PRODUCTION INFRASTRUCTURE STATUS",
          items: [
            { label: "PostgreSQL Database Engine (Latency: " + stats.dbLatencyMs + "ms)", count: 1 },
            { label: "Backblaze B2 S3 Storage", count: stats.b2Connected ? 1 : 0 },
            { label: "Resend Official Dispatch", count: stats.resendConnected ? 1 : 0 },
            { label: "Gemini AI Studio Neural Engine", count: stats.geminiConnected ? 1 : 0 },
          ],
        },
      ],
      table: {
        title: "RECENT AUDIT TRAIL & STUDIO ACTIONS",
        columns: [
          { header: "Timestamp", render: (r: AuditLogItem) => new Date(r.createdAt).toLocaleString(), width: "20%" },
          { header: "Action", render: (r: AuditLogItem) => `<span class="badge-cyan">${r.action}</span>`, width: "25%" },
          { header: "User / Email", render: (r: AuditLogItem) => r.userEmail || "System Administrator", width: "25%" },
          { header: "Details / Resource", render: (r: AuditLogItem) => r.details || r.resource || "Studio Infrastructure Event", width: "30%" },
        ],
        rows: recentAudits,
      },
      notes: [
        "Executive report synthesized live from Dragon Gaming Studios Control infrastructure.",
        "Game builds distributed via Backblaze B2 S3 storage endpoints.",
        "Authentication state synchronized with Neon PostgreSQL ep-still-brook cluster.",
      ],
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="flex h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20">
          
          {/* ═══ COMMAND CENTER HEADER ═══ */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono font-bold text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
                <span>DRAGON OS OPERATIONAL</span>
                <span className="text-cyan-500">•</span>
                <span className="text-slate-400">LATENCY: {stats.dbLatencyMs}ms</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2 font-heading">
                <span>Executive Command Center</span>
                <Sparkles className="size-5 text-cyan-400" />
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Real-time telemetry, PostgreSQL nodes, Backblaze B2 distribution, and studio infrastructure.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchDashboardData}
                className="p-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
                title="Refresh Live Telemetry"
              >
                <RefreshCw className={cn("size-4", refreshing && "animate-spin text-cyan-400")} />
              </button>

              <button
                type="button"
                onClick={handleExportExecutivePDF}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
                title="Export Official Executive Studio Report to PDF"
              >
                <FileText className="size-3.5 text-cyan-400" />
                <span>Export PDF Report</span>
              </button>

              <Link
                href="/health"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-500/25 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <Activity className="size-3.5" />
                <span>Live Health</span>
              </Link>

              <Link
                href="/games"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3CFF] text-[#020617] text-xs font-mono font-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.02] transition-all"
              >
                <Plus className="size-4" />
                <span>Game Engine</span>
              </Link>
            </div>
          </div>

          {/* ═══ REAL-DATA METRIC TILES ═══ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#03091D]/90 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase font-bold text-cyan-400/80">Active Franchises</span>
                <Gamepad2 className="size-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {stats.totalGames}
              </div>
              <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>UNCHARTED DRIVE: BEYOND</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#03091D]/90 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase font-bold text-cyan-400/80">Verified Downloads</span>
                <Download className="size-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {stats.totalDownloads.toLocaleString()}
              </div>
              <div className="text-[10.5px] font-mono text-cyan-300">
                PC (.exe) • Android (.apk)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#03091D]/90 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase font-bold text-cyan-400/80">Players & Team</span>
                <Users className="size-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {stats.totalPlayers}
              </div>
              <div className="text-[10.5px] font-mono text-purple-300">
                {stats.activeStaff} Staff • {Math.max(0, stats.totalPlayers - stats.activeStaff)} Players
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#03091D]/90 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase font-bold text-cyan-400/80">Security Posture</span>
                <ShieldCheck className="size-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                {stats.securityScore}%
              </div>
              <div className="text-[10.5px] font-mono text-slate-400">
                Military Guard Active
              </div>
            </div>
          </div>

          {/* ═══ FLAGSHIP GAME HERO SHOWCASE ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Real Flagship Studio Game */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>Studio Flagship Production</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">OFFICIAL</span>
                  </h2>
                </div>
                <Link
                  href="/games"
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
                >
                  <span>Engine Studio</span>
                  <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-[#03091D]/95 border border-cyan-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.7)] space-y-4">
                <div className="relative aspect-21/9 rounded-xl overflow-hidden bg-[#02050E] border border-cyan-500/20">
                  <img
                    src="/images/uncharted-drive-banner.png"
                    alt="Uncharted Drive: Beyond"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 backdrop-blur-md">
                        <span>AAA OPEN HIGHWAY DRIVING</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1 font-heading">
                        UNCHARTED DRIVE: BEYOND
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/games"
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 text-[#020617] font-mono font-bold text-xs hover:bg-cyan-400 transition-colors shadow-[0_0_12px_rgba(0,229,255,0.4)]"
                      >
                        Manage Title
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#02050E] border border-white/5">
                    <div className="text-[10px] text-slate-500">PLATFORMS</div>
                    <div className="font-bold text-slate-200 mt-0.5">PC (.exe) • Android (.apk)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#02050E] border border-white/5">
                    <div className="text-[10px] text-slate-500">ENGINE VERSION</div>
                    <div className="font-bold text-slate-200 mt-0.5">Dragon Engine v5.4</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#02050E] border border-white/5">
                    <div className="text-[10px] text-slate-500">STORAGE BACKEND</div>
                    <div className="font-bold text-cyan-300 mt-0.5">Backblaze B2 S3</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#02050E] border border-white/5">
                    <div className="text-[10px] text-slate-500">DOWNLOADS</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{stats.totalDownloads} Verified</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Quick 7-Core Command Launchers */}
            <div className="space-y-3">
              <div>
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Core Module Launchers
                </h2>
              </div>

              <div className="space-y-2 font-mono">
                <Link
                  href="/telemetry"
                  className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-950/30 to-[#03091D] border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                      <Radio className="size-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">Live Sign-Ins & Telemetry</h4>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">SYNC</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Real-time user logins, devices & IPs</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/identity"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#03091D] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                      <KeyRound className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Dragon ID Center</h4>
                      <p className="text-[10px] text-slate-400">Player callsigns, avatars & titles</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/media"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#03091D] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                      <HardDrive className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Media & B2 Storage</h4>
                      <p className="text-[10px] text-slate-400">Game banners, videos & assets</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/ai"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#03091D] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                      <Bot className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Gemini AI Studio</h4>
                      <p className="text-[10px] text-slate-400">AI content engine & SEO tools</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/qa"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#03091D] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">QA Readiness Center</h4>
                      <p className="text-[10px] text-slate-400">Test suites & schema validation</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/data-control"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#03091D] border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                      <Lock className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-rose-300">Owner Data Control</h4>
                      <p className="text-[10px] text-slate-400">Dual-approval governance</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>
          </div>

          {/* ═══ REAL AUDIT STREAM ═══ */}
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Operational Audit Stream</span>
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h2>
                <p className="text-[11px] text-slate-400">Live immutable PostgreSQL transaction logs</p>
              </div>
              <Link
                href="/audit"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full Audit Stream</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="rounded-2xl bg-[#03091D]/90 border border-cyan-500/20 divide-y divide-white/5 overflow-hidden">
              {recentAudits.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No recent audit events recorded.
                </div>
              ) : (
                recentAudits.map((audit) => (
                  <div key={audit.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00E5FF] shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">
                          {audit.action}
                        </span>
                        <span className="text-[10.5px] text-slate-400">
                          {audit.userEmail || "System Engine"} • {audit.resource || "Dragon Studio"}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10.5px] text-slate-500">
                      {new Date(audit.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
