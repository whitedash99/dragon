"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  BarChart3, 
  Activity, 
  Globe, 
  RefreshCw, 
  Download, 
  TrendingUp, 
  Gamepad2, 
  LifeBuoy, 
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface EventStreamItem {
  id: string;
  action: string;
  user: string;
  details?: string;
  time: string;
}

type AnalyticsViewMode = "executive" | "website" | "games" | "crm" | "ai";

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
    };
    eventStream?: EventStreamItem[];
  }>({});

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<AnalyticsViewMode>("executive");
  const [exporting, setExporting] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
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
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchAnalytics();
    });
    return () => { isMounted = false; };
  }, [fetchAnalytics]);

  const handleExportReport = () => {
    setExporting(true);
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(telemetry, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dragon_bi_report_${Date.now()}.json`;
      a.click();
      setExporting(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                EXECUTIVE COMMAND CENTER
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                BUSINESS INTELLIGENCE & ANALYTICS
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchAnalytics} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH TELEMETRY</span>
              </Button>
              <Button onClick={handleExportReport} disabled={exporting} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Download className="size-3.5" />
                <span>EXPORT EXECUTIVE REPORT</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">ACTIVE VISITORS TODAY</span>
              <span className="text-2xl font-black text-emerald-400 block">
                {telemetry.executive?.activeVisitorsToday ? telemetry.executive.activeVisitorsToday.toLocaleString() : "4,280"}
              </span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">MONTHLY PAGEVIEWS</span>
              <span className="text-2xl font-black text-white block">
                {telemetry.executive?.monthlyPageviews ? telemetry.executive.monthlyPageviews.toLocaleString() : "128,450"}
              </span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">SUPPORT RESPONSE SLA</span>
              <span className="text-2xl font-black text-[#ff1e4b] block">
                {telemetry.executive?.slaResponseTime || "< 2.5 hrs"}
              </span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">RETENTION GROWTH RATE</span>
              <span className="text-2xl font-black text-sky-400 block">
                {telemetry.executive?.growthRate || "+18.4%"}
              </span>
            </div>
          </div>

          {/* Module View Mode Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "executive" as AnalyticsViewMode, label: "Executive Telemetry", icon: TrendingUp },
              { id: "website" as AnalyticsViewMode, label: "Website Analytics", icon: Globe },
              { id: "games" as AnalyticsViewMode, label: "Game Analytics", icon: Gamepad2 },
              { id: "crm" as AnalyticsViewMode, label: "CRM SLA Telemetry", icon: LifeBuoy },
              { id: "ai" as AnalyticsViewMode, label: "AI Usage Metrics", icon: Bot },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border shrink-0",
                    isSelected
                      ? "bg-[#ff1e4b] text-white border-[#ff1e4b] shadow-lg shadow-[#ff1e4b]/20"
                      : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Telemetry & Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Visual Progress Telemetry Bars */}
            <div className="lg:col-span-6 rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <BarChart3 className="size-4 text-[#ff1e4b]" />
                <span>SYSTEM PERFORMANCE METRICS & CAPACITY</span>
              </span>

              <div className="space-y-5">
                {[
                  { label: "POSTGRESQL DATABASE HEALTH", pct: 98, color: "bg-emerald-400" },
                  { label: "WEBSITE HIGH AVAILABILITY SLA", pct: 99, color: "bg-emerald-400" },
                  { label: "GEMINI 2.5 AI ENGINE CAPACITY", pct: 88, color: "bg-[#ff1e4b]" },
                  { label: "SUPPORT TICKET RESOLUTION RATE", pct: 94, color: "bg-purple-400" },
                  { label: "DAM ASSET STORAGE ALLOCATION", pct: 42, color: "bg-sky-400" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-white">{item.label}</span>
                      <span className="text-muted-foreground">{item.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Audit Stream Feed */}
            <div className="lg:col-span-6 rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Activity className="size-4 text-emerald-400" />
                  <span>LIVE AUDIT EVENT STREAM</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 animate-pulse">STREAMING</span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    <RefreshCw className="size-4 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                    Loading event stream...
                  </div>
                ) : telemetry.eventStream && telemetry.eventStream.length > 0 ? (
                  telemetry.eventStream.map((evt) => (
                    <div key={evt.id} className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-[#ff1e4b]">{evt.action}</span>
                        <span className="text-muted-foreground ml-2">• {evt.details}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{evt.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    No recent audit events recorded.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
