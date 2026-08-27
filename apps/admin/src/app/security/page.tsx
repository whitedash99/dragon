"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";

interface SecurityPosture {
  score?: number;
  maxScore?: number;
  warnings?: string[];
  components?: { name: string; status: string; passed: boolean; points: number; explanation: string }[];
}

interface SecurityTelemetry {
  activeSessions?: number;
  passkeysCount?: number;
  failedLogins?: number;
}

interface AuditLogRecord {
  id: string;
  action: string;
  user: string;
  details: string;
  ip: string;
  time: string;
}

interface TrustedDevice {
  id: string;
  userName: string;
  userEmail: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastUsedAt: string;
}

export default function SecurityPage() {
  const [posture, setPosture] = useState<SecurityPosture>({});
  const [telemetry, setTelemetry] = useState<SecurityTelemetry>({});
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<"posture" | "audits" | "devices">("posture");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const fetchSecurity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security");
      const data = await res.json();
      if (data.success) {
        setPosture(data.posture || {});
        setTelemetry(data.telemetry || {});
        setAuditLogs(data.auditLogs || []);
        setTrustedDevices(data.trustedDevices || []);
      }
    } catch (e) {
      console.error("Fetch security error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecurity();
  }, [fetchSecurity]);

  const handleTriggerBackup = async () => {
    setBackingUp(true);
    setBackupSuccess(false);
    try {
      const res = await fetch("/api/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createSnapshot" }),
      });
      const data = await res.json();
      if (data.success) {
        setBackupSuccess(true);
        fetchSecurity();
        setTimeout(() => setBackupSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Snapshot error", err);
    } finally {
      setBackingUp(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (categoryFilter === "ALL") return true;
    if (categoryFilter === "AUTH") return log.action.includes("LOGIN") || log.action.includes("PASSKEY") || log.action.includes("GOOGLE");
    if (categoryFilter === "USER_MANAGEMENT") return log.action.includes("USER") || log.action.includes("ROLE") || log.action.includes("SESSION");
    if (categoryFilter === "INVITATION") return log.action.includes("INVITATION") || log.action.includes("APPLICATION");
    if (categoryFilter === "CMS") return log.action.includes("CMS") || log.action.includes("BLOCK");
    return true;
  });

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400/80 uppercase tracking-wider mb-1">
                Dragon Security Governance
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Security Posture & Controls</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/secrets">
                <button className="px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border border-cyan-500/30 bg-[#03091D] text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer">
                  <KeyRound className="size-3.5 text-cyan-400" />
                  <span>Dragon Secrets Vault</span>
                  <ArrowUpRight className="size-3" />
                </button>
              </Link>
              <button
                onClick={handleTriggerBackup}
                disabled={backingUp}
                className="px-4 py-2 rounded-xl text-xs font-mono font-black flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {backingUp ? <RefreshCw className="size-3.5 animate-spin" /> : <Database className="size-3.5" />}
                <span>Snapshot DB Record</span>
              </button>
            </div>
          </div>

          {backupSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              <span>PostgreSQL Snapshot record committed to Audit Trail.</span>
            </div>
          )}

          {/* Real Metrics Grid */}
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            <GlassStat
              label="Security Score"
              value={`${posture.score ?? 0} / ${posture.maxScore ?? 100}`}
              icon={ShieldCheck}
              trend="Audit Validated"
            />
            <GlassStat
              label="Active HTTP Sessions"
              value={telemetry.activeSessions ?? 0}
              icon={Activity}
              trend="Live DIP Tokens"
            />
            <GlassStat
              label="Hardware Passkeys"
              value={telemetry.passkeysCount ?? 0}
              icon={Smartphone}
              trend="Registered"
            />
            <GlassStat
              label="Failed Auth Events"
              value={telemetry.failedLogins ?? 0}
              icon={ShieldAlert}
              trend="Rate Guarded"
              trendPositive={telemetry.failedLogins === 0}
            />
          </div>

          {/* View Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-4">
            {[
              { id: "posture" as const, label: "Security Posture Breakdown", icon: ShieldCheck },
              { id: "audits" as const, label: "Audit Log Trail", icon: Activity },
              { id: "devices" as const, label: "Trusted Devices", icon: Smartphone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border cursor-pointer",
                    isSelected
                      ? "bg-cyan-500/25 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                      : "bg-[#03091D] text-slate-400 border-cyan-500/20 hover:text-white hover:border-cyan-500/40"
                  )}
                >
                  <Icon className="size-3.5 text-cyan-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SECURITY POSTURE BREAKDOWN */}
          {viewMode === "posture" && (
            <div className="space-y-6">
              {/* Warnings Box */}
              {posture.warnings && posture.warnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 space-y-2 text-xs font-mono">
                  <div className="font-bold flex items-center gap-2 text-amber-300">
                    <AlertTriangle className="size-4 text-amber-400" />
                    <span>Active Posture Warnings</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-200">
                    {posture.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Component Cards */}
              <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                <div className="border-b border-cyan-500/20 pb-3">
                  <h3 className="font-bold text-white font-mono uppercase tracking-wider text-sm">Deterministic Security Controls</h3>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">Explains how your security score is computed based on active controls.</p>
                </div>

                <div className="divide-y divide-cyan-500/15 text-xs font-mono">
                  {posture.components?.map((c, idx) => (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{c.name}</span>
                          <GlassBadge variant={c.passed ? "published" : "warning"}>
                            {c.status}
                          </GlassBadge>
                        </div>
                        <p className="text-slate-400 text-[11px] font-sans">{c.explanation}</p>
                      </div>
                      <span className="font-bold text-cyan-300 font-mono shrink-0 sm:text-right">
                        +{c.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB 2: AUDIT LOG TRAIL */}
          {viewMode === "audits" && (
            <GlassCard className="p-6 space-y-6 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
                <div>
                  <h3 className="font-bold text-white font-mono uppercase tracking-wider text-sm flex items-center gap-2">
                    <Activity className="size-4 text-cyan-400" />
                    <span>Real PostgreSQL Audit Events ({filteredLogs.length})</span>
                  </h3>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">Immutable audit trail recorded directly in database.</p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono">
                  {["ALL", "AUTH", "USER_MANAGEMENT", "INVITATION", "CMS"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer",
                        categoryFilter === cat ? "bg-cyan-500/30 border border-cyan-400 text-cyan-200" : "bg-[#02050E] border border-cyan-500/20 text-slate-400 hover:text-white"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 font-mono">
                {loading ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    <RefreshCw className="size-4 animate-spin mx-auto mb-2 text-cyan-400" />
                    Loading audit trail from Neon PostgreSQL...
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    No security events recorded.
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.action}</span>
                          <span className="text-[10px] text-cyan-400">by {log.user}</span>
                        </div>
                        <p className="text-slate-300 text-xs font-sans">{log.details}</p>
                      </div>
                      <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                        <div>{log.ip}</div>
                        <div>{log.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          )}

          {/* TAB 3: TRUSTED DEVICES */}
          {viewMode === "devices" && (
            <GlassCard className="p-6 space-y-6 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
              <div className="border-b border-cyan-500/20 pb-4">
                <h3 className="font-bold text-white font-mono uppercase tracking-wider text-sm flex items-center gap-2">
                  <Smartphone className="size-4 text-cyan-400" />
                  <span>Trusted Hardware Devices ({trustedDevices.length})</span>
                </h3>
                <p className="text-slate-400 text-xs font-mono mt-0.5">Hardware fingerprints registered and trusted by staff accounts.</p>
              </div>

              <div className="space-y-3 font-mono">
                {loading ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    Loading device records...
                  </div>
                ) : trustedDevices.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    No trusted hardware devices registered yet.
                  </div>
                ) : (
                  trustedDevices.map((d) => (
                    <div key={d.id} className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{d.userName} ({d.userEmail})</div>
                        <div className="text-[11px] text-slate-400">{d.browser} · {d.os}</div>
                      </div>
                      <div className="text-right text-[10px] text-slate-400 font-mono">
                        <div>IP: {d.ipAddress}</div>
                        <div>Last Used: {new Date(d.lastUsedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          )}
        </main>
      </div>
    </div>
  );
}
