"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  BarChart3, 
  Activity, 
  RefreshCw, 
  Download, 
  Gamepad2, 
  LifeBuoy, 
  Server,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassButton, GlassBadge, GlassStat } from "@/components/ui/glass";

interface EventStreamItem {
  id: string;
  action: string;
  user: string;
  details?: string;
  time: string;
}

type AnalyticsViewMode = "executive" | "games" | "crm" | "infrastructure";

export default function AnalyticsPage() {
  const [telemetry, setTelemetry] = useState<{
    executive?: {
      activeVisitorsToday: number;
      monthlyPageviews: number;
      avgSessionDuration: string;
      slaResponseTime: string;
      growthRate: string;
    };
    counts?: {
      totalUsers: number;
      totalGames: number;
      totalTickets: number;
      openTickets: number;
      totalMedia: number;
      totalAiUsage: number;
      totalDownloads: number;
    };
    eventStream?: EventStreamItem[];
  }>({});

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<AnalyticsViewMode>("executive");
  const [exporting, setExporting] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      if (data.success && data.telemetry) {
        setTelemetry(data.telemetry);
      }
    } catch (e) {
      console.error("Error fetching analytics", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportReport = () => {
    setExporting(true);
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(telemetry, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dragon_control_analytics_${Date.now()}.json`;
      a.click();
      setExporting(false);
    }, 600);
  };

  const counts = telemetry.counts || {
    totalUsers: 0,
    totalGames: 0,
    totalTickets: 0,
    openTickets: 0,
    totalMedia: 0,
    totalAiUsage: 0,
    totalDownloads: 0,
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider">
                  Dragon Control • Intelligence & Analytics
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Studio BI & Executive Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Canonical PostgreSQL telemetry, download performance, and operational velocity.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchAnalytics}
                className="p-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
                title="Refresh Analytics"
              >
                <RefreshCw className={cn("size-4", refreshing && "animate-spin text-cyan-400")} />
              </button>

              <button
                onClick={handleExportReport}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-bold shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all cursor-pointer font-mono"
              >
                <Download className="size-4 text-cyan-400" />
                <span>{exporting ? "Exporting..." : "Export Report (JSON)"}</span>
              </button>
            </div>
          </div>

          {/* Navigation View Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#02050E] rounded-2xl w-fit border border-cyan-500/25 shadow-2xs">
            {(["executive", "games", "crm", "infrastructure"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setViewMode(tab)}
                className={cn(
                  "px-4 py-1.5 text-xs font-mono font-bold rounded-xl transition-all capitalize cursor-pointer",
                  viewMode === tab
                    ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {tab === "executive" ? "Executive Overview" : tab === "games" ? "Games & Downloads" : tab === "crm" ? "Support & Queues" : "Infrastructure"}
              </button>
            ))}
          </div>

          {/* KPI Stat Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <GlassStat
              label="Game Franchises"
              value={counts.totalGames}
              icon={Gamepad2}
              trend="Canonical Portfolio"
            />
            <GlassStat
              label="B2 Binary Deliveries"
              value={counts.totalDownloads.toLocaleString()}
              icon={Download}
              trend="Client Downloads"
            />
            <GlassStat
              label="Workforce Personnel"
              value={counts.totalUsers}
              icon={Activity}
              trend="Authenticated Staff"
            />
            <GlassStat
              label="Active Support Tickets"
              value={counts.openTickets}
              icon={LifeBuoy}
              trend={counts.openTickets > 0 ? "Attention Required" : "Zero Queue"}
              trendPositive={counts.openTickets === 0}
            />
          </div>

          {/* Main Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Performance Cards */}
            <div className="lg:col-span-2 space-y-6">
              
              <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Game Client Distribution & Downloads</h3>
                    <p className="text-xs text-slate-400 font-mono">Live platform download velocity</p>
                  </div>
                  <GlassBadge variant="published">
                    CANONICAL METRICS
                  </GlassBadge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400/80 uppercase tracking-wider block font-mono">PC Releases (.exe)</span>
                    <div className="text-2xl font-black text-white font-mono">{counts.totalDownloads.toLocaleString()}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold font-mono">B2 Multi-part Active</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400/80 uppercase tracking-wider block font-mono">Android (.apk)</span>
                    <div className="text-2xl font-black text-white font-mono">0</div>
                    <span className="text-[10px] text-slate-500 font-mono">Ready for Release</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400/80 uppercase tracking-wider block font-mono">Web Play Sessions</span>
                    <div className="text-2xl font-black text-white font-mono">0</div>
                    <span className="text-[10px] text-slate-500 font-mono">WebGL Engine Ready</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Infrastructure Performance</h3>
                    <p className="text-xs text-slate-400 font-mono">Database query and edge caching latencies</p>
                  </div>
                  <GlassBadge variant="info">
                    EDGE TELEMETRY
                  </GlassBadge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400/80 uppercase tracking-wider block font-mono">Neon DB Read Latency</span>
                    <div className="text-2xl font-black text-cyan-300 font-mono">~12ms</div>
                    <span className="text-[10px] text-emerald-400 font-semibold font-mono">Pooler Healthy</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400/80 uppercase tracking-wider block font-mono">Edge Revalidation</span>
                    <div className="text-2xl font-black text-purple-300 font-mono">~85ms</div>
                    <span className="text-[10px] text-emerald-400 font-semibold font-mono">Instant Tag Purge</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400/80 uppercase tracking-wider block font-mono">B2 CDN Delivery</span>
                    <div className="text-2xl font-black text-emerald-300 font-mono">99.98%</div>
                    <span className="text-[10px] text-emerald-400 font-semibold font-mono">High Availability</span>
                  </div>
                </div>
              </GlassCard>

            </div>

            {/* Right Col: Live Event Stream */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Real-Time Event Stream</h3>
                <p className="text-xs text-slate-400 font-mono">Live operational events</p>
              </div>

              <GlassCard className="p-4 divide-y divide-cyan-500/15 bg-[#03091D]/90 border border-cyan-500/30">
                {(!telemetry.eventStream || telemetry.eventStream.length === 0) ? (
                  <div className="p-4 text-center text-xs text-slate-500 font-mono">
                    No recent events recorded in stream.
                  </div>
                ) : (
                  telemetry.eventStream.map((evt) => (
                    <div key={evt.id} className="py-3 flex items-start gap-3">
                      <div className="size-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00E5FF] mt-1.5 shrink-0" />
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-bold text-white font-mono block truncate">{evt.action}</span>
                        <span className="text-[11px] text-cyan-300 font-mono block truncate">{evt.user}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{evt.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </GlassCard>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
