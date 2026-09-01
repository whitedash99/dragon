"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  Activity,
  Users,
  KeyRound,
  Smartphone,
  Globe,
  RefreshCw,
  Search,
  Filter,
  Download,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Laptop,
  Tablet,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Radio,
  Eye,
  Copy,
  Check,
  Layers,
  Sparkles,
  Server,
  Fingerprint,
  Calendar,
  MapPin,
  Lock,
  ArrowUpRight,
  FileText
} from "lucide-react";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";
import { generateGodLevelTelemetryReport, openOfficialPdfReport } from "@/lib/pdf-report-generator";

interface TelemetryEvent {
  id: string;
  action: string;
  category: "SIGN_UP" | "SIGN_IN" | "DRAGON_ID" | "DEVICE" | "SECURITY" | "ONBOARDING";
  user: {
    id: string;
    name: string;
    email: string;
    dragonId: string | null;
    image: string | null;
    role: string;
    status: string;
    gamerTag: string;
    primaryTitle: string;
    bannerTheme: string;
    loginCount: number;
    createdAt: string;
    lastLogin: string | null;
  };
  device: {
    browser: string;
    os: string;
    deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
    trusted: boolean;
    ipAddress: string;
    rawUserAgent?: string;
  };
  location: string;
  details: string;
  createdAt: string;
}

interface PlayerDossier {
  id: string;
  name: string;
  email: string;
  dragonId: string | null;
  image: string | null;
  role: string;
  status: string;
  provider: string;
  department: string;
  loginCount: number;
  emailVerified: string | null;
  createdAt: string;
  lastLogin: string;
  gamerTag: string;
  primaryTitle: string;
  bannerTheme: string;
  hasCompletedWelcome: boolean;
  hasCompletedDragonId: boolean;
  country: string;
  devices: Array<{
    id: string;
    deviceId: string;
    browser: string;
    os: string;
    deviceType: string;
    ipAddress: string;
    country: string;
    trusted: boolean;
    lastUsedAt: string;
  }>;
  sessions: Array<{
    id: string;
    sessionToken: string;
    ipAddress: string;
    userAgent: string;
    expiresAt: string;
    createdAt: string;
  }>;
}

interface TelemetrySummary {
  totalUsers: number;
  totalLogins: number;
  totalDragonIds: number;
  totalActiveDevices: number;
  signInsLast24h: number;
  osCounts: Record<string, number>;
  browserCounts: Record<string, number>;
  countryCounts: Record<string, number>;
  actionCounts: Record<string, number>;
}

export default function TelemetryPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const [summary, setSummary] = useState<TelemetrySummary>({
    totalUsers: 0,
    totalLogins: 0,
    totalDragonIds: 0,
    totalActiveDevices: 0,
    signInsLast24h: 0,
    osCounts: {},
    browserCounts: {},
    countryCounts: {},
    actionCounts: {},
  });

  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [players, setPlayers] = useState<PlayerDossier[]>([]);

  // Navigation & Search State
  const [activeTab, setActiveTab] = useState<"FEED" | "PLAYERS" | "DEVICES">("FEED");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState<"ALL" | "TODAY" | "24H" | "7D">("ALL");

  // Selected Player for Modal Inspection
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDossier | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTelemetry = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/telemetry`);
      const data = await res.json();

      if (data.success) {
        setSummary(data.summary);
        setEvents(data.events || []);
        setPlayers(data.players || []);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial Load & Auto-Refresh Interval
  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 10000); // 10s live pulse
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTelemetry]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Events based on time, category, and instant search
  const filteredEvents = useMemo(() => {
    let result = events;

    // 1. Time filter
    if (timeFilter !== "ALL") {
      const now = Date.now();
      const msLimit =
        timeFilter === "TODAY"
          ? 24 * 60 * 60 * 1000
          : timeFilter === "24H"
          ? 24 * 60 * 60 * 1000
          : 7 * 24 * 60 * 60 * 1000;

      result = result.filter((e) => {
        const eventTime = new Date(e.createdAt).getTime();
        return now - eventTime <= msLimit;
      });
    }

    // 2. Category filter
    if (categoryFilter !== "ALL") {
      result = result.filter((e) => e.category === categoryFilter || e.action === categoryFilter);
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((e) => {
        return (
          e.user.email.toLowerCase().includes(q) ||
          e.user.name.toLowerCase().includes(q) ||
          (e.user.dragonId && e.user.dragonId.toLowerCase().includes(q)) ||
          e.device.ipAddress.includes(q) ||
          e.device.os.toLowerCase().includes(q) ||
          e.device.browser.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [events, timeFilter, categoryFilter, searchQuery]);

  // Filtered Players based on instant search
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players;
    const q = searchQuery.toLowerCase().trim();
    return players.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.dragonId && p.dragonId.toLowerCase().includes(q)) ||
        p.gamerTag.toLowerCase().includes(q) ||
        p.devices.some((d) => d.ipAddress.includes(q) || d.browser.toLowerCase().includes(q) || d.os.toLowerCase().includes(q))
      );
    });
  }, [players, searchQuery]);

  // Export to Official PDF Report (God-Level Multi-Page Report with Direct Download)
  const [exportingPdf, setExportingPdf] = useState(false);
  const handleExportPDF = async () => {
    try {
      setExportingPdf(true);
      await generateGodLevelTelemetryReport({ summary, events, players });
    } catch (e) {
      console.error("PDF export error:", e);
    } finally {
      setExportingPdf(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = "Event ID,Action,User Name,Email,Dragon ID,OS,Browser,IP Address,Location,Timestamp\n";
    const rows = filteredEvents
      .map(
        (e) =>
          `"${e.id}","${e.action}","${e.user.name}","${e.user.email}","${e.user.dragonId || "N/A"}","${e.device.os}","${e.device.browser}","${e.device.ipAddress}","${e.location}","${e.createdAt}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dragon_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDeviceIcon = (type: string) => {
    if (type === "Mobile") return <Smartphone className="size-3.5 text-cyan-400" />;
    if (type === "Tablet") return <Tablet className="size-3.5 text-purple-400" />;
    return <Laptop className="size-3.5 text-cyan-300" />;
  };

  const getActionBadge = (category: string, action: string) => {
    if (category === "SIGN_UP") {
      return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">✦ NEW SIGN-UP</span>;
    }
    if (category === "DRAGON_ID") {
      return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">🔑 DRAGON ID MINTED</span>;
    }
    if (category === "ONBOARDING") {
      return <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">🎬 CINEMATIC COMPLETED</span>;
    }
    if (category === "DEVICE") {
      return <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">📱 DEVICE REGISTERED</span>;
    }
    return <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold">⚡ GOOGLE SIGN-IN</span>;
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400/80 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Radio className="size-3.5 text-emerald-400 animate-pulse" />
                <span>PostgreSQL Live Access Telemetry</span>
                {lastSyncTime && (
                  <span className="text-[11px] text-slate-400 font-normal">· Synced at {lastSyncTime}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-heading">
                Live Sign-Ins & User Access Intelligence
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Real-time tracking of every login, sign-up, Dragon ID creation, connected device, IP, and location.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  autoRefresh
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-[#03091D] border-slate-700 text-slate-400"
                }`}
              >
                <div className={`size-2 rounded-full ${autoRefresh ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
                <span>{autoRefresh ? "Live Pulse (10s)" : "Pulse Paused"}</span>
              </button>

              <button
                type="button"
                onClick={fetchTelemetry}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer active:scale-95"
              >
                <RefreshCw className={`size-3.5 text-cyan-400 ${refreshing ? "animate-spin" : ""}`} />
                <span>Sync Now</span>
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/50 text-xs font-mono font-bold text-cyan-200 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer active:scale-95"
                title="Generate Official Dragon Gaming Studios PDF Telemetry Report"
              >
                <FileText className="size-3.5 text-cyan-400" />
                <span>EXPORT PDF REPORT</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-200 transition-all shadow-md cursor-pointer"
                title="Export current filtered view to CSV"
              >
                <Download className="size-3.5 text-cyan-400" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* 5 Top Telemetry Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <GlassCard className="p-4 bg-[#03091D]/90 border border-cyan-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>TOTAL PLAYERS</span>
                <Users className="size-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-heading">{summary.totalUsers}</div>
              <div className="text-[11px] text-cyan-300/80 mt-1 flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-400" />
                <span>Active in PostgreSQL</span>
              </div>
            </GlassCard>

            <GlassCard className="p-4 bg-[#03091D]/90 border border-amber-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>DRAGON IDs</span>
                <KeyRound className="size-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300 font-heading">{summary.totalDragonIds}</div>
              <div className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-1">
                <span>✦ Minted & Verified</span>
              </div>
            </GlassCard>

            <GlassCard className="p-4 bg-[#03091D]/90 border border-purple-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>TOTAL LOGINS</span>
                <Zap className="size-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-300 font-heading">{summary.totalLogins}</div>
              <div className="text-[11px] text-purple-400/80 mt-1">Lifetime Sessions</div>
            </GlassCard>

            <GlassCard className="p-4 bg-[#03091D]/90 border border-cyan-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>HARDWARE DEVICES</span>
                <Smartphone className="size-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-heading">{summary.totalActiveDevices}</div>
              <div className="text-[11px] text-cyan-300/80 mt-1">Fingerprinted Nodes</div>
            </GlassCard>

            <GlassCard className="p-4 bg-[#03091D]/90 border border-emerald-500/30 col-span-2 lg:col-span-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>SIGN-INS (24H)</span>
                <Clock className="size-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-300 font-heading">{summary.signInsLast24h}</div>
              <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Auth Traffic</span>
              </div>
            </GlassCard>
          </div>

          {/* Quick Hardware & OS Intelligence Row */}
          <div className="p-3.5 rounded-2xl bg-[#03091D]/70 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-1">OS NODES:</span>
              {Object.entries(summary.osCounts).length === 0 ? (
                <span className="text-slate-500 text-[11px]">Collecting OS data...</span>
              ) : (
                Object.entries(summary.osCounts).map(([os, count]) => (
                  <span key={os} className="px-2 py-0.5 rounded-md bg-[#02050E] border border-cyan-500/30 text-cyan-200 text-[11px]">
                    {os} ({count})
                  </span>
                ))
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-1">BROWSERS:</span>
              {Object.entries(summary.browserCounts).length === 0 ? (
                <span className="text-slate-500 text-[11px]">Collecting browser data...</span>
              ) : (
                Object.entries(summary.browserCounts).map(([browser, count]) => (
                  <span key={browser} className="px-2 py-0.5 rounded-md bg-[#02050E] border border-purple-500/30 text-purple-200 text-[11px]">
                    {browser} ({count})
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Navigation Tabs & Interactive Search / Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
            {/* View Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#03091D] border border-cyan-500/30">
              <button
                type="button"
                onClick={() => setActiveTab("FEED")}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "FEED"
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Activity className="size-3.5" />
                <span>Live Event Feed ({filteredEvents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("PLAYERS")}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "PLAYERS"
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="size-3.5" />
                <span>Player Directory ({filteredPlayers.length})</span>
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, email, Dragon ID, IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#03091D] border border-cyan-500/30 focus:border-cyan-400 text-xs font-mono text-white placeholder:text-slate-500 outline-none transition-all"
                />
              </div>

              {activeTab === "FEED" && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#03091D] border border-cyan-500/30 text-xs font-mono text-cyan-300 outline-none cursor-pointer"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="SIGN_IN">Google Sign-Ins</option>
                  <option value="SIGN_UP">New Sign-Ups</option>
                  <option value="DRAGON_ID">Dragon ID Minted</option>
                  <option value="ONBOARDING">Welcome Completed</option>
                  <option value="DEVICE">Device Connects</option>
                </select>
              )}
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: LIVE EVENT FEED                                            */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "FEED" && (
            <GlassCard className="p-4 sm:p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
              {loading ? (
                <div className="py-20 text-center text-slate-400 text-xs font-mono space-y-3">
                  <RefreshCw className="size-6 text-cyan-400 animate-spin mx-auto" />
                  <p>Querying real-time PostgreSQL authentication logs...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="py-20 text-center text-slate-500 text-xs font-mono space-y-2">
                  <Activity className="size-8 text-slate-600 mx-auto" />
                  <p>No authentication events match your filter criteria.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((e) => (
                    <div
                      key={e.id}
                      className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 hover:border-cyan-500/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                    >
                      {/* Left: User Identity Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative size-11 rounded-xl overflow-hidden bg-cyan-950/60 border border-cyan-500/40 shrink-0 flex items-center justify-center">
                          {e.user.image ? (
                            <Image src={e.user.image} alt={e.user.name} fill className="object-cover" />
                          ) : (
                            <Users className="size-5 text-cyan-400" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-white text-sm font-heading truncate">{e.user.name}</span>
                            {getActionBadge(e.category, e.action)}
                            {e.user.dragonId ? (
                              <span
                                onClick={() => handleCopy(e.user.dragonId!, e.id)}
                                className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-500/30 transition-all"
                                title="Click to copy Dragon ID"
                              >
                                <span>{e.user.dragonId}</span>
                                {copiedId === e.id ? <Check className="size-2.5 text-emerald-400" /> : <Copy className="size-2.5 text-amber-400" />}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono">
                                No Dragon ID Yet
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span className="text-cyan-200 font-mono">{e.user.email}</span>
                            <span>•</span>
                            <span className="text-[11px] text-slate-400 font-mono">Logins: {e.user.loginCount}</span>
                            <span>•</span>
                            <span className="text-[11px] text-slate-400">{e.details}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Device & Location Chips */}
                      <div className="flex flex-wrap items-center gap-2 lg:shrink-0 text-xs font-mono">
                        {/* Device Chip */}
                        <div className="px-2.5 py-1 rounded-lg bg-[#03091D] border border-cyan-500/30 text-slate-300 flex items-center gap-1.5">
                          {getDeviceIcon(e.device.deviceType)}
                          <span>{e.device.os}</span>
                          <span className="text-slate-500">/</span>
                          <span className="text-cyan-300">{e.device.browser}</span>
                        </div>

                        {/* IP & Location Chip */}
                        <div className="px-2.5 py-1 rounded-lg bg-[#03091D] border border-purple-500/30 text-purple-200 flex items-center gap-1.5">
                          <Globe className="size-3.5 text-purple-400" />
                          <span>{e.device.ipAddress}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-300">{e.location}</span>
                        </div>

                        {/* Timestamp */}
                        <div className="px-2.5 py-1 rounded-lg bg-black/40 text-slate-400 text-[11px] flex items-center gap-1">
                          <Clock className="size-3 text-slate-500" />
                          <span>{new Date(e.createdAt).toLocaleString()}</span>
                        </div>

                        {/* Inspect Player Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const found = players.find((p) => p.email === e.user.email || p.id === e.user.id);
                            if (found) setSelectedPlayer(found);
                          }}
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 transition-all cursor-pointer"
                          title="Inspect Full Player Dossier"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: COMPLETE PLAYER DIRECTORY                                   */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "PLAYERS" && (
            <div className="space-y-4">
              {filteredPlayers.length === 0 ? (
                <GlassCard className="p-12 text-center text-slate-500 text-xs font-mono">
                  No registered players match your search criteria.
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlayers.map((p) => (
                    <GlassCard
                      key={p.id}
                      className="p-5 bg-[#03091D]/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all space-y-4 relative overflow-hidden group shadow-lg"
                    >
                      {/* Top Bar: User Badge & Dragon ID */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 rounded-2xl overflow-hidden bg-cyan-950/60 border-2 border-cyan-400/50 shadow-md shrink-0">
                            {p.image ? (
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            ) : (
                              <Users className="size-6 text-cyan-300 m-auto mt-2.5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold text-white text-base font-heading truncate">{p.name}</h3>
                            <div className="text-xs text-cyan-300 font-mono truncate">{p.email}</div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                          {p.role}
                        </span>
                      </div>

                      {/* Middle: Dragon ID & Gaming Identity */}
                      <div className="p-3 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">DRAGON ID:</span>
                          {p.dragonId ? (
                            <span
                              onClick={() => handleCopy(p.dragonId!, p.id)}
                              className="font-bold text-amber-300 font-mono flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <span>{p.dragonId}</span>
                              {copiedId === p.id ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3 text-amber-400" />}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Pending Setup</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">GAMERTAG:</span>
                          <span className="text-cyan-200 font-bold font-mono">@{p.gamerTag}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">TITLE:</span>
                          <span className="text-amber-200/90 text-[11px] font-mono">{p.primaryTitle}</span>
                        </div>
                      </div>

                      {/* Devices & Telemetry summary */}
                      <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                        <div className="flex items-center justify-between">
                          <span>Total Logins:</span>
                          <span className="text-white font-bold">{p.loginCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Registered Devices:</span>
                          <span className="text-cyan-300 font-bold">{p.devices.length} hardware nodes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Last Active:</span>
                          <span className="text-slate-300">{new Date(p.lastLogin).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Inspect Dossier Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedPlayer(p)}
                        className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Eye className="size-3.5" />
                        <span>Inspect Full Security Dossier</span>
                      </button>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* PLAYER SECURITY & DEVICE DOSSIER MODAL                             */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {selectedPlayer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
              <GlassCard className="max-w-2xl w-full p-6 sm:p-8 bg-[#03091D] border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(0,229,255,0.25)] space-y-6 relative max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-cyan-500/20 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 rounded-2xl overflow-hidden bg-cyan-950 border-2 border-cyan-400 shadow-lg shrink-0">
                      {selectedPlayer.image ? (
                        <Image src={selectedPlayer.image} alt={selectedPlayer.name} fill className="object-cover" />
                      ) : (
                        <Users className="size-8 text-cyan-400 m-auto mt-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-white font-heading">{selectedPlayer.name}</h2>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                          {selectedPlayer.role}
                        </span>
                      </div>
                      <p className="text-xs text-cyan-300 font-mono">{selectedPlayer.email}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Database ID: {selectedPlayer.id}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPlayer(null)}
                    className="size-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Identity & Dragon ID Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <div className="text-slate-400 text-[11px]">DRAGON ID:</div>
                    <div className="text-base font-black text-amber-300">
                      {selectedPlayer.dragonId || "Not Forged Yet"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <div className="text-slate-400 text-[11px]">GAMERTAG & TITLE:</div>
                    <div className="text-sm font-bold text-cyan-200">
                      @{selectedPlayer.gamerTag} · {selectedPlayer.primaryTitle}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <div className="text-slate-400 text-[11px]">ACCOUNT STATUS:</div>
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-400" />
                      <span>{selectedPlayer.status} · Google Verified</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <div className="text-slate-400 text-[11px]">LIFETIME LOGINS:</div>
                    <div className="text-sm font-bold text-purple-300">
                      {selectedPlayer.loginCount} successful sign-ins
                    </div>
                  </div>
                </div>

                {/* Connected Hardware Devices */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Smartphone className="size-3.5 text-cyan-400" />
                    <span>Registered Hardware Devices ({selectedPlayer.devices.length})</span>
                  </h4>

                  {selectedPlayer.devices.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#02050E] text-slate-500 text-xs font-mono text-center">
                      No explicit hardware devices registered.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedPlayer.devices.map((d) => (
                        <div key={d.id} className="p-3 rounded-xl bg-[#02050E] border border-cyan-500/20 flex items-center justify-between text-xs font-mono">
                          <div className="space-y-0.5">
                            <div className="font-bold text-white flex items-center gap-2">
                              {getDeviceIcon(d.deviceType)}
                              <span>{d.os} · {d.browser}</span>
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px]">TRUSTED</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">IP: {d.ipAddress} · {d.country}</div>
                          </div>
                          <div className="text-slate-500 text-[10px]">
                            Last seen: {new Date(d.lastUsedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Sessions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Lock className="size-3.5 text-purple-400" />
                    <span>Active Session Tokens ({selectedPlayer.sessions.length})</span>
                  </h4>

                  {selectedPlayer.sessions.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#02050E] text-slate-500 text-xs font-mono text-center">
                      No active long-lived database sessions found.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedPlayer.sessions.map((s) => (
                        <div key={s.id} className="p-3 rounded-xl bg-[#02050E] border border-purple-500/20 flex items-center justify-between text-xs font-mono">
                          <div className="space-y-0.5">
                            <div className="font-mono text-cyan-300 truncate max-w-xs">{s.sessionToken}</div>
                            <div className="text-slate-400 text-[11px]">IP: {s.ipAddress} · Agent: {s.userAgent}</div>
                          </div>
                          <div className="text-emerald-400 text-[10px]">Active</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Close Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPlayer(null)}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#02040A] font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Close Dossier
                  </button>
                </div>
              </GlassCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
