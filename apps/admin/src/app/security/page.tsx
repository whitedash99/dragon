"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Activity, 
  CheckCircle2,
  KeyRound,
  Smartphone,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface PostureComponent {
  name: string;
  status: string;
  passed: boolean;
  points: number;
  explanation: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  user: string;
  details?: string;
  ip: string;
  time: string;
}

interface TrustedDeviceItem {
  id: string;
  userEmail: string;
  userName: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastUsedAt: string;
}

export default function SecurityPage() {
  const [telemetry, setTelemetry] = useState<{
    activeSessions?: number;
    passkeysCount?: number;
    trustedDevicesCount?: number;
    dragonKeysActive?: number;
    failedLogins?: number;
    totalAuditsCount?: number;
  }>({});

  const [posture, setPosture] = useState<{
    score?: number;
    maxScore?: number;
    components?: PostureComponent[];
    warnings?: string[];
    recommendations?: string[];
  }>({});

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"posture" | "audits" | "devices">("posture");

  const fetchSecurityData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (data.posture) setPosture(data.posture);
        if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
        if (Array.isArray(data.trustedDevices)) setTrustedDevices(data.trustedDevices);
      }
    } catch (e) {
      console.error("Error fetching security data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

  const handleTriggerBackup = async () => {
    setBackingUp(true);
    try {
      const res = await fetch("/api/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_backup" }),
      });
      const data = await res.json();
      if (data.success) {
        setBackupSuccess(true);
        setTimeout(() => setBackupSuccess(false), 3000);
        fetchSecurityData();
      }
    } catch (e) {
      console.error("Trigger backup error", e);
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 page-transition-fast"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Dragon Security Governance
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Security Posture & Controls</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/secrets">
                <Button variant="outline" size="sm" className="rounded-xl text-xs gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs">
                  <KeyRound className="size-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Dragon Secrets Vault</span>
                  <ArrowUpRight className="size-3" />
                </Button>
              </Link>
              <Button onClick={handleTriggerBackup} disabled={backingUp} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white border-none shadow-xs">
                {backingUp ? <RefreshCw className="size-3.5 animate-spin" /> : <Database className="size-3.5" />}
                <span>Snapshot DB Record</span>
              </Button>
            </div>
          </div>

          {backupSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>PostgreSQL Snapshot record committed to Audit Trail.</span>
            </div>
          )}

          {/* Real Metrics Grid */}
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold block">Security Score</span>
              <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 block font-mono">{posture.score ?? 0} / {posture.maxScore ?? 100}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold block">Active HTTP Sessions</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 block font-mono">{telemetry.activeSessions ?? 0}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold block">Hardware Passkeys</span>
              <span className="text-3xl font-extrabold text-sky-700 dark:text-sky-400 block font-mono">{telemetry.passkeysCount ?? 0} Registered</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold block">Failed Auth Events</span>
              <span className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 block font-mono">{telemetry.failedLogins ?? 0}</span>
            </div>
          </div>

          {/* View Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
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
                    "px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border",
                    isSelected
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="size-3.5" />
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
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 space-y-2 text-xs">
                  <div className="font-bold flex items-center gap-2 text-amber-900 dark:text-amber-200">
                    <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                    <span>Active Posture Warnings</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-amber-800 dark:text-amber-300">
                    {posture.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Component Cards */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-xs">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Deterministic Security Controls</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Explains how your security score is computed based on active controls.</p>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {posture.components?.map((c, idx) => (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono font-bold border",
                            c.passed ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          )}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] font-sans">{c.explanation}</p>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 font-mono shrink-0 sm:text-right">
                        +{c.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT LOG TRAIL */}
          {viewMode === "audits" && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Activity className="size-4 text-emerald-600" />
                    <span>Real PostgreSQL Audit Events ({filteredLogs.length})</span>
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Immutable audit trail recorded directly in database.</p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono">
                  {["ALL", "AUTH", "USER_MANAGEMENT", "INVITATION", "CMS"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[11px] transition-all",
                        categoryFilter === cat ? "bg-slate-900 text-white font-bold shadow-xs" : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    <RefreshCw className="size-4 animate-spin mx-auto mb-2 text-slate-400" />
                    Loading audit trail from Neon PostgreSQL...
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-mono">
                    No security events recorded.
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{log.action}</span>
                          <span className="text-[10px] text-slate-500">by {log.user}</span>
                        </div>
                        <p className="text-slate-600 text-xs font-sans">{log.details}</p>
                      </div>
                      <div className="text-right shrink-0 text-[10px] text-slate-500 font-mono">
                        <div>{log.ip}</div>
                        <div>{log.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TRUSTED DEVICES */}
          {viewMode === "devices" && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Smartphone className="size-4 text-sky-600" />
                  <span>Trusted Hardware Devices ({trustedDevices.length})</span>
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Hardware fingerprints registered and trusted by staff accounts.</p>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-mono">
                    Loading device records...
                  </div>
                ) : trustedDevices.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-mono">
                    No trusted hardware devices registered yet.
                  </div>
                ) : (
                  trustedDevices.map((d) => (
                    <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-bold text-slate-900">{d.userName} ({d.userEmail})</div>
                        <div className="text-[11px] text-slate-500">{d.browser} · {d.os}</div>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        <div>IP: {d.ipAddress}</div>
                        <div>Last Used: {new Date(d.lastUsedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
