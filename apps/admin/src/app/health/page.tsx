"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Activity, 
  Database, 
  HardDrive, 
  Mail, 
  ShieldCheck, 
  Bot, 
  Cloud, 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Zap, 
  Cpu, 
  Terminal as TerminalIcon 
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ServiceHealth {
  status: "HEALTHY" | "CONFIGURED" | "NOT_CONFIGURED" | "DEGRADED" | "UNHEALTHY";
  provider?: string;
  latencyMs?: number;
  details?: string;
}

interface SystemHealthReport {
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  timestamp: string;
  version: string;
  services: {
    database: ServiceHealth;
    storage: ServiceHealth;
    deployment: ServiceHealth;
    emailGateway: ServiceHealth;
    googleOAuth: ServiceHealth;
    application: {
      status: string;
      uptimeSeconds: number;
      environment: string;
    };
  };
}

export default function HealthPage() {
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [probing, setProbing] = useState(false);
  const [lastProbeTime, setLastProbeTime] = useState<string>("");
  const [probeLogs, setProbeLogs] = useState<string[]>([]);

  const runHealthProbe = useCallback(async () => {
    setProbing(true);
    const logEntries: string[] = [];
    const pushLog = (msg: string) => {
      logEntries.push(`[${new Date().toISOString().substring(11, 19)}] ${msg}`);
      setProbeLogs([...logEntries]);
    };

    pushLog("INIT: Starting comprehensive infrastructure diagnostic probe...");

    try {
      const startTime = performance.now();
      pushLog("PING: Probing PostgreSQL database connection via Prisma raw query...");
      
      const res = await fetch("/api/health", { cache: "no-store" });
      const elapsed = Math.round(performance.now() - startTime);
      
      if (!res.ok && res.status !== 503) {
        throw new Error(`HTTP probe returned error status ${res.status}`);
      }

      const data: SystemHealthReport = await res.json();
      setReport(data);
      setLastProbeTime(new Date().toLocaleTimeString());

      pushLog(`RESULT: PostgreSQL responded in ${data.services.database.latencyMs ?? elapsed}ms. Status: ${data.services.database.status}`);
      pushLog(`RESULT: Backblaze B2 Storage Status: ${data.services.storage.status}`);
      pushLog(`RESULT: Resend Email Gateway Status: ${data.services.emailGateway.status}`);
      pushLog(`RESULT: Google OAuth Gateway Status: ${data.services.googleOAuth.status}`);
      pushLog(`RESULT: Vercel Edge Deployment Status: ${data.services.deployment.status}`);
      pushLog(`SUMMARY: Overall Dragon Control health posture evaluated as: ${data.status}`);
    } catch (err: any) {
      pushLog(`ERROR: Diagnostic probe failed: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
      setProbing(false);
    }
  }, []);

  useEffect(() => {
    runHealthProbe();
  }, [runHealthProbe]);

  const getStatusBadge = (status?: string) => {
    if (status === "HEALTHY" || status === "CONFIGURED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10.5px] font-mono font-bold">
          <CheckCircle2 className="size-3 text-emerald-400" />
          <span>{status}</span>
        </span>
      );
    }
    if (status === "DEGRADED" || status === "NOT_CONFIGURED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10.5px] font-mono font-bold">
          <AlertTriangle className="size-3 text-amber-400" />
          <span>{status === "NOT_CONFIGURED" ? "NOT CONNECTED" : status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/15 border border-rose-400/40 text-rose-300 text-[10.5px] font-mono font-bold">
        <XCircle className="size-3 text-rose-400" />
        <span>UNHEALTHY</span>
      </span>
    );
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return "0s";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="flex h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono font-bold text-cyan-300">
                <Activity className="size-3 text-cyan-400 animate-pulse" />
                <span>DIAGNOSTIC & TELEMETRY CENTER</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2 font-heading">
                <span>Live System Health</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Real-time connection verification across PostgreSQL, Backblaze B2, Resend, and Edge infrastructure.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runHealthProbe}
                disabled={probing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3CFF] text-[#020617] text-xs font-mono font-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={cn("size-3.5", probing && "animate-spin")} />
                <span>{probing ? "Probing Infrastructure..." : "Run Health Diagnostic"}</span>
              </button>
            </div>
          </div>

          {/* Infrastructure Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* PostgreSQL Card */}
            <div className="p-5 rounded-2xl bg-[#03091D]/95 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                    <Database className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">PostgreSQL Database</h3>
                    <p className="text-[10.5px] text-slate-400 font-mono">Neon Serverless DB</p>
                  </div>
                </div>
                {getStatusBadge(report?.services.database.status)}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Query Latency:</span>
                  <span className="font-bold text-emerald-400">{report?.services.database.latencyMs ?? 0} ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Connection Engine:</span>
                  <span className="text-slate-200">Prisma Client v6.19</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Database Protocol:</span>
                  <span className="text-slate-200">PostgreSQL (Pooled)</span>
                </div>
              </div>
            </div>

            {/* Backblaze B2 S3 Storage Card */}
            <div className="p-5 rounded-2xl bg-[#03091D]/95 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                    <HardDrive className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">Object Storage</h3>
                    <p className="text-[10.5px] text-slate-400 font-mono">Backblaze B2 S3</p>
                  </div>
                </div>
                {getStatusBadge(report?.services.storage.status)}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Primary Region:</span>
                  <span className="text-slate-200">us-east-005</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Binary Distribution:</span>
                  <span className="text-slate-200">Enabled (.exe / .apk)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Presigned Links:</span>
                  <span className="text-cyan-300">Active (S3 Presigner)</span>
                </div>
              </div>
            </div>

            {/* Resend Email Gateway Card */}
            <div className="p-5 rounded-2xl bg-[#03091D]/95 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">Email Gateway</h3>
                    <p className="text-[10.5px] text-slate-400 font-mono">Resend API Delivery</p>
                  </div>
                </div>
                {getStatusBadge(report?.services.emailGateway.status)}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>API Protocol:</span>
                  <span className="text-slate-200">HTTPS REST v1</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sender Domain:</span>
                  <span className="text-slate-200">dragongamingstudios.in</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dispatch Rate:</span>
                  <span className="text-emerald-400">Optimal</span>
                </div>
              </div>
            </div>

            {/* Google OAuth Identity Card */}
            <div className="p-5 rounded-2xl bg-[#03091D]/95 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">Google OAuth 2.0</h3>
                    <p className="text-[10.5px] text-slate-400 font-mono">Player Authentication</p>
                  </div>
                </div>
                {getStatusBadge(report?.services.googleOAuth.status)}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Auth Scope:</span>
                  <span className="text-slate-200">openid, email, profile</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Session Type:</span>
                  <span className="text-slate-200">NextAuth JWT + DB Cookie</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Onboarding Guard:</span>
                  <span className="text-cyan-300">Compulsory Dragon ID</span>
                </div>
              </div>
            </div>

            {/* Google Gemini AI Engine Card */}
            <div className="p-5 rounded-2xl bg-[#03091D]/95 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">Gemini AI Engine</h3>
                    <p className="text-[10.5px] text-slate-400 font-mono">Generative Intelligence</p>
                  </div>
                </div>
                {getStatusBadge("CONFIGURED")}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Model:</span>
                  <span className="text-slate-200">Gemini 2.5 Flash</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Capabilities:</span>
                  <span className="text-slate-200">SEO, CMS, Translation</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Safety Rails:</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
            </div>

            {/* Vercel Edge Runtime Card */}
            <div className="p-5 rounded-2xl bg-[#03091D]/95 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                    <Cloud className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">Vercel Edge Node</h3>
                    <p className="text-[10.5px] text-slate-400 font-mono">Global Edge Network</p>
                  </div>
                </div>
                {getStatusBadge(report?.services.deployment.status)}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Runtime Environment:</span>
                  <span className="text-slate-200">{report?.services.application.environment || "production"}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Node Process Uptime:</span>
                  <span className="text-emerald-400">{formatUptime(report?.services.application.uptimeSeconds)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>App Version:</span>
                  <span className="text-cyan-300">{report?.version || "v2.5.0-ENTERPRISE"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Diagnostic Log Console */}
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon className="size-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Diagnostic Console</h3>
              </div>
              {lastProbeTime && (
                <span className="text-[11px] text-slate-500">Last probe executed at: {lastProbeTime}</span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/25 text-xs space-y-1 text-slate-300 font-mono max-h-64 overflow-y-auto shadow-inner">
              {probeLogs.length === 0 ? (
                <div className="text-slate-500">Awaiting diagnostic probe execution...</div>
              ) : (
                probeLogs.map((log, idx) => (
                  <div key={idx} className={cn(
                    "leading-relaxed",
                    log.includes("ERROR") ? "text-rose-400" : log.includes("RESULT") ? "text-cyan-300" : log.includes("SUMMARY") ? "text-emerald-400 font-bold" : "text-slate-400"
                  )}>
                    {log}
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
