"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Zap, 
  Activity, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface HealthCheckItem {
  id: string;
  service: string;
  status: string;
  latency: number;
}

export default function PerformancePage() {
  const [telemetry, setTelemetry] = useState<{
    pageSpeed?: string;
    apiResponseTime?: string;
    dbLatency?: string;
    cacheHitRate?: string;
    cpuUsage?: number;
    memoryUsage?: number;
    diskUsage?: number;
    errorRate?: string;
  }>({});

  const [healthChecks, setHealthChecks] = useState<HealthCheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [flushing, setFlushing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "health" | "cache">("overview");

  const fetchPerfData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/performance");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.healthChecks)) setHealthChecks(data.healthChecks);
      }
    } catch (e) {
      console.error("Error fetching performance telemetry", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchPerfData();
    });
    return () => { isMounted = false; };
  }, [fetchPerfData]);

  const handleAction = async (action: string, label: string) => {
    setFlushing(true);
    try {
      const res = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(label);
        setTimeout(() => setActionSuccess(null), 2500);
        fetchPerfData();
      }
    } catch (e) {
      console.error("Performance action error", e);
    } finally {
      setFlushing(false);
    }
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
                ENTERPRISE SCALABILITY & OPTIMIZATION
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                PERFORMANCE MONITORING
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => handleAction("flush_cache", "SERVER-SIDE CACHE FLUSHED")} disabled={flushing} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className={cn("size-3.5 text-[#ff1e4b]", flushing && "animate-spin")} />
                <span>FLUSH CACHE</span>
              </Button>
              <Button onClick={() => handleAction("optimize_db", "POSTGRESQL INDEXES OPTIMIZED")} disabled={flushing} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Zap className="size-3.5" />
                <span>OPTIMIZE POSTGRESQL</span>
              </Button>
            </div>
          </div>

          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" /> {actionSuccess}
            </div>
          )}

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">PAGE LOAD SPEED</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.pageSpeed || "0.42s"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">API RESPONSE LATENCY</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.apiResponseTime || "38ms"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">DATABASE QUERY TIME</span>
              <span className="text-2xl font-black text-white block">{telemetry.dbLatency || "8ms"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">CACHE HIT RATE</span>
              <span className="text-2xl font-black text-purple-400 block">{telemetry.cacheHitRate || "96.4%"}</span>
            </div>
          </div>

          {/* View Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "overview" as const, label: "Performance Monitors", icon: Zap },
              { id: "health" as const, label: "System Health Checks", icon: Activity },
              { id: "cache" as const, label: "Cache Controls", icon: HardDrive },
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

          {/* System Resource Meters */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6 rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Cpu className="size-4 text-[#ff1e4b]" />
                <span>SERVER HARDWARE CAPACITY METERS</span>
              </span>

              <div className="space-y-5">
                {[
                  { label: "CPU ALLOCATION (node-us-east-1a)", pct: telemetry.cpuUsage || 14.2, color: "bg-emerald-400" },
                  { label: "RAM MEMORY ALLOCATION (32GB)", pct: telemetry.memoryUsage || 38.4, color: "bg-sky-400" },
                  { label: "SSD STORAGE CAPACITY (1TB NVMe)", pct: telemetry.diskUsage || 24.8, color: "bg-purple-400" },
                ].map((m) => (
                  <div key={m.label} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-white">{m.label}</span>
                      <span className="text-muted-foreground">{m.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Checks Status */}
            <div className="lg:col-span-6 rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Activity className="size-4 text-emerald-400" />
                  <span>HIGH AVAILABILITY SERVICE HEALTH</span>
                </span>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    <RefreshCw className="size-4 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                    Checking cluster health...
                  </div>
                ) : (
                  healthChecks.map((hc) => (
                    <div key={hc.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <strong className="text-white font-sans block text-sm">{hc.service}</strong>
                        <span className="text-[10px] text-muted-foreground">Latency: {hc.latency}ms</span>
                      </div>
                      <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 font-bold text-[10px]">
                        {hc.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
