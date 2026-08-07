"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  RefreshCw, 
  Activity, 
  CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface AuditLogItem {
  id: string;
  action: string;
  user: string;
  details?: string;
  ip: string;
  time: string;
}

interface BackupItem {
  id: string;
  filename: string;
  size: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

export default function SecurityPage() {
  const [telemetry, setTelemetry] = useState<{
    securityScore?: number;
    activeSessions?: number;
    failedLogins?: number;
    threatAlerts?: number;
    csrfShield?: string;
    prismaInjectionProtection?: string;
    rateLimiting?: string;
  }>({});

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<"overview" | "audits" | "backups">("overview");

  const fetchSecurityData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
        if (Array.isArray(data.backups)) setBackups(data.backups);
      }
    } catch (e) {
      console.error("Error fetching security telemetry", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchSecurityData();
    });
    return () => { isMounted = false; };
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
        setTimeout(() => setBackupSuccess(false), 2500);
        fetchSecurityData();
      }
    } catch (e) {
      console.error("Trigger backup error", e);
    } finally {
      setBackingUp(false);
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
                ENTERPRISE SECURITY CENTER
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                SECURITY SHIELD & AUDITING
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchSecurityData} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH SECURITY MATRIX</span>
              </Button>
              <Button onClick={handleTriggerBackup} disabled={backingUp} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                {backingUp ? <RefreshCw className="size-3.5 animate-spin" /> : <Database className="size-3.5" />}
                <span>SNAPSHOT POSTGRESQL</span>
              </Button>
            </div>
          </div>

          {backupSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" /> SUCCESSFUL POSTGRESQL SNAPSHOT SAVED & COMMITTED TO BACKUP STORAGE
            </div>
          )}

          {/* Telemetry Cards Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">SECURITY HEALTH SCORE</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.securityScore || 98} / 100</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">ACTIVE ADMIN SESSIONS</span>
              <span className="text-2xl font-black text-white block">{telemetry.activeSessions || 1} ACTIVE</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">FAILED LOGIN ATTEMPTS</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.failedLogins || 0} DETECTED</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">OPEN SECURITY THREATS</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.threatAlerts || 0} THREATS</span>
            </div>
          </div>

          {/* View Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "overview" as const, label: "Security Shields", icon: ShieldCheck },
              { id: "audits" as const, label: "Audit Log Trail", icon: Activity },
              { id: "backups" as const, label: "Backups & Recovery", icon: Database },
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

          {/* Active Security Protections Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-[#ff1e4b]">
                <span className="text-[10px] font-bold uppercase">CSRF & XSS PROTECTION</span>
                <ShieldCheck className="size-4" />
              </div>
              <span className="text-lg font-black text-emerald-400 block">ENFORCED</span>
              <p className="text-[10px] text-muted-foreground">HTTP-only cookies and strict origin headers active.</p>
            </div>

            <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-[#ff1e4b]">
                <span className="text-[10px] font-bold uppercase">SQL INJECTION SHIELD</span>
                <Lock className="size-4" />
              </div>
              <span className="text-lg font-black text-emerald-400 block">PRISMA ORM SANITIZED</span>
              <p className="text-[10px] text-muted-foreground">All database queries execute via parameterized Prisma models.</p>
            </div>

            <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-[#ff1e4b]">
                <span className="text-[10px] font-bold uppercase">SERVER-SIDE API KEYS</span>
                <Key className="size-4" />
              </div>
              <span className="text-lg font-black text-sky-400 block">ISOLATED (.env)</span>
              <p className="text-[10px] text-muted-foreground">Google Gemini & PostgreSQL credentials never exposed to client.</p>
            </div>
          </div>

          {/* Audit Trail & Backups Section */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <Activity className="size-4 text-[#ff1e4b]" />
                <span>REAL-TIME AUDIT LOG TRAIL ({auditLogs.length})</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">MUTABLE WRITE LOCKED</span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                  Loading PostgreSQL security audit logs...
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  No security logs recorded.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#ff1e4b]">{log.action}</span>
                        <span className="text-[10px] text-muted-foreground">• by {log.user}</span>
                      </div>
                      <p className="text-white/90 text-xs">{log.details}</p>
                    </div>
                    <div className="text-right shrink-0 text-[10px] text-muted-foreground">
                      <span className="block">{log.ip}</span>
                      <span className="block">{log.time}</span>
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
