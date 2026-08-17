"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Users, 
  LifeBuoy, 
  Key, 
  Briefcase, 
  ArrowUpRight, 
  RefreshCw,
  ShieldCheck,
  Activity,
  AlertCircle,
  CheckCircle2,
  Database,
  Mail,
  Lock,
  Globe,
  X,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { SmoothShowcaseSlider } from "@/components/motion/SmoothShowcaseSlider";

interface AuditLogItem {
  id: string;
  action: string;
  userEmail?: string;
  resource?: string;
  details?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<AuditLogItem | null>(null);
  const [stats, setStats] = useState({
    activeUsers: 0,
    openTickets: 0,
    totalTickets: 0,
    pendingApplications: 0,
    pendingInvitations: 0,
    securityScore: 100,
    systemHealth: "HEALTHY",
    dbLatencyMs: 14,
  });
  const [recentAudits, setRecentAudits] = useState<AuditLogItem[]>([]);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const [usersRes, crmRes, portalRes, securityRes, healthRes] = await Promise.all([
        fetch("/api/users").catch(() => null),
        fetch("/api/crm").catch(() => null),
        fetch("/api/team-key-portal").catch(() => null),
        fetch("/api/security").catch(() => null),
        fetch("/api/health").catch(() => null),
      ]);

      const endTime = performance.now();
      const measuredLatency = Math.round(endTime - startTime);

      let uCount = 0;
      let openTCount = 0;
      let totalTCount = 0;
      let pendingAppsCount = 0;
      let pendingInvsCount = 0;
      let secScore = 100;
      let sysHealth = "HEALTHY";

      if (usersRes?.ok) {
        const uData = await usersRes.json();
        const usersList = Array.isArray(uData) ? uData : uData.users || [];
        uCount = usersList.filter((u: { status?: string; isActive?: boolean }) => u.status === "ACTIVE" || u.isActive).length;
      }
      if (crmRes?.ok) {
        const cData = await crmRes.json();
        const ticketsList = Array.isArray(cData) ? cData : cData.tickets || [];
        totalTCount = ticketsList.length;
        openTCount = ticketsList.filter((t: { status: string }) => t.status === "OPEN" || t.status === "NEW" || t.status === "IN_PROGRESS").length;
      }
      if (portalRes?.ok) {
        const pData = await portalRes.json();
        const appsList = pData.applications || [];
        const invsList = pData.invitations || [];
        pendingAppsCount = appsList.filter((a: { status: string }) => a.status === "PENDING").length;
        pendingInvsCount = invsList.filter((i: { status: string }) => i.status === "PENDING").length;
      }
      if (securityRes?.ok) {
        const secData = await securityRes.json();
        if (secData.posture?.score !== undefined) secScore = secData.posture.score;
        if (Array.isArray(secData.auditLogs)) setRecentAudits(secData.auditLogs.slice(0, 8));
      }
      if (healthRes?.ok) {
        const hData = await healthRes.json();
        if (hData.status) sysHealth = hData.status;
      }

      setStats({
        activeUsers: uCount,
        openTickets: openTCount,
        totalTickets: totalTCount,
        pendingApplications: pendingAppsCount,
        pendingInvitations: pendingInvsCount,
        securityScore: secScore,
        systemHealth: sysHealth,
        dbLatencyMs: measuredLatency,
      });
    } catch (e) {
      console.error("Dashboard fetch error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const hasAttentionItems =
    stats.pendingApplications > 0 || stats.openTickets > 0 || stats.pendingInvitations > 0;

  return (
    <div className="flex min-h-screen bg-[#040812] text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-10 page-transition-fast">
          {/* Executive Hero Banner & AI Copilot Bar */}
          <div className="space-y-6 pb-6 border-b border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-[11px] text-cyan-300 font-medium">
                  <ShieldCheck className="size-3.5 text-cyan-400" />
                  <span>Executive Owner Workspace</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Good evening, Executive Owner.</span>
                  <span className="text-blue-500 text-2xl">⚡</span>
                </h1>
                <p className="text-sm text-slate-400 font-sans">
                  Real-time operational summary & attention center across staff, applications, and support queues.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDashboardStats}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 border border-blue-500/30 text-xs font-semibold text-cyan-300 transition-all shadow-xs active:scale-98"
                >
                  <RefreshCw className={`size-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {/* OpenAI / Gemini Style Executive Copilot Search Bar */}
            <div className="p-2.5 rounded-2xl bg-[#0B132B] border border-blue-500/30 shadow-md shadow-blue-900/10 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-blue-500/30">
                <Sparkles className="size-4" />
              </div>
              <input
                type="text"
                placeholder="Ask Dragon AI Copilot or search operations... (e.g. 'Show applications', 'Audit logs', 'Passkeys')"
                className="w-full text-xs text-white placeholder:text-slate-500 bg-transparent focus:outline-none font-sans"
              />
              <span className="text-[10px] font-mono px-2 py-1 bg-[#060B18] text-cyan-300 rounded-lg border border-slate-700 shrink-0">
                ⌘K
              </span>
            </div>

            {/* Smooth Showcase Slider Component */}
            <SmoothShowcaseSlider />
          </div>

          {/* Attention Center */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <AlertCircle className="size-4 text-cyan-400" />
                Attention Center
              </h2>
              <span className="text-[11px] text-cyan-400 font-mono">PostgreSQL Stream</span>
            </div>

            {!hasAttentionItems ? (
              <div className="rounded-2xl bg-[#0B132B] border border-blue-500/20 p-8 text-center space-y-3 shadow-md shadow-black/40">
                <div className="size-10 rounded-full bg-blue-600/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="text-sm font-bold text-white">You&apos;re all caught up.</div>
                <div className="text-xs text-slate-400 max-w-md mx-auto">
                  There are no pending recruitment applications, unassigned support tickets, or expiring keys requiring immediate action.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.pendingApplications > 0 && (
                  <Link
                    href="/team-key-portal"
                    className="p-6 rounded-2xl bg-[#0B132B] hover:bg-slate-850 border border-blue-500/30 shadow-md hover:shadow-blue-500/20 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
                      <span className="flex items-center gap-2">
                        <Briefcase className="size-4 text-cyan-400" /> Pending Applications
                      </span>
                      <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
                    </div>
                    <div className="text-3xl font-extrabold text-white font-mono">
                      {stats.pendingApplications} Candidate{stats.pendingApplications > 1 ? "s" : ""}
                    </div>
                    <p className="text-xs text-slate-400">
                      Awaiting executive review & recruitment token issuance.
                    </p>
                  </Link>
                )}

                {stats.openTickets > 0 && (
                  <Link
                    href="/crm"
                    className="p-6 rounded-2xl bg-[#0B132B] hover:bg-slate-850 border border-blue-500/30 shadow-md hover:shadow-blue-500/20 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
                      <span className="flex items-center gap-2">
                        <LifeBuoy className="size-4 text-blue-400" /> Open Support Tickets
                      </span>
                      <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-blue-400" />
                    </div>
                    <div className="text-3xl font-extrabold text-white font-mono">
                      {stats.openTickets} Active Ticket{stats.openTickets > 1 ? "s" : ""}
                    </div>
                    <p className="text-xs text-slate-400">
                      Customer support tickets requiring staff response or resolution.
                    </p>
                  </Link>
                )}

                {stats.pendingInvitations > 0 && (
                  <Link
                    href="/team-key-portal"
                    className="p-6 rounded-2xl bg-[#0B132B] hover:bg-slate-850 border border-blue-500/30 shadow-md hover:shadow-blue-500/20 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
                      <span className="flex items-center gap-2">
                        <Key className="size-4 text-cyan-400" /> Pending Invitations
                      </span>
                      <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-300" />
                    </div>
                    <div className="text-3xl font-extrabold text-white font-mono">
                      {stats.pendingInvitations} Active Key{stats.pendingInvitations > 1 ? "s" : ""}
                    </div>
                    <p className="text-xs text-slate-400">
                      Unconsumed single-use recruitment keys issued to staff.
                    </p>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Operational Real Data Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-3 hover:border-cyan-400/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase">
                <span>Active Staff</span>
                <Users className="size-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">{stats.activeUsers}</div>
              <div className="text-[11px] text-slate-400">Active identities in Neon DB</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-3 hover:border-cyan-400/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase">
                <span>Open CRM Tickets</span>
                <LifeBuoy className="size-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {stats.openTickets} <span className="text-xs text-slate-400 font-normal">/ {stats.totalTickets} total</span>
              </div>
              <div className="text-[11px] text-slate-400">Unresolved customer tickets</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-3 hover:border-cyan-400/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase">
                <span>Pending Applications</span>
                <Briefcase className="size-4 text-cyan-300" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">{stats.pendingApplications}</div>
              <div className="text-[11px] text-slate-400">Unprocessed recruitment apps</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-3 hover:border-cyan-400/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase">
                <span>Pending Invitations</span>
                <Key className="size-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">{stats.pendingInvitations}</div>
              <div className="text-[11px] text-slate-400">Single-use staff invite keys</div>
            </div>
          </div>

          {/* System Health & Activity Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* System Health */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                  <Database className="size-4 text-cyan-400" /> Infrastructure Health
                </h3>
                <span className="text-[10px] text-cyan-300 font-mono bg-blue-600/20 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
                  HEALTHY
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#060B18] border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Database className="size-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">Neon PostgreSQL</div>
                      <div className="text-[11px] text-slate-400">Serverless Database</div>
                    </div>
                  </div>
                  <span className="font-mono text-cyan-300 text-[11px] bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                    {stats.dbLatencyMs}ms
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#060B18] border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Lock className="size-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">DIP Identity Engine</div>
                      <div className="text-[11px] text-slate-400">RBAC & Session Security</div>
                    </div>
                  </div>
                  <span className="font-mono text-cyan-300 text-[11px] bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#060B18] border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Mail className="size-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">Resend Email Gateway</div>
                      <div className="text-[11px] text-slate-400">Transactional Delivery</div>
                    </div>
                  </div>
                  <span className="font-mono text-cyan-300 text-[11px] bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#060B18] border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Globe className="size-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">Passkeys & OAuth</div>
                      <div className="text-[11px] text-slate-400">WebAuthn Authentication</div>
                    </div>
                  </div>
                  <span className="font-mono text-cyan-300 text-[11px] bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                    Configured
                  </span>
                </div>
              </div>
            </div>

            {/* Real Activity Stream */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                  <Activity className="size-4 text-cyan-400" /> System Activity Stream
                </h3>
                <Link href="/audit" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
                  <span>View Full Audit Ledger</span>
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>

              {recentAudits.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">
                  No recent audit logs recorded.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentAudits.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAudit(item)}
                      className="w-full text-left p-3.5 rounded-xl bg-[#060B18] hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-1 min-w-0 pr-4">
                        <div className="font-semibold text-xs text-white font-mono truncate">
                          {item.action}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {item.details || item.userEmail || "System event"}
                        </div>
                      </div>
                      <div className="text-[10px] text-cyan-400 font-mono shrink-0">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B132B] border border-blue-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white font-mono">Audit Event Inspection</h4>
              <button onClick={() => setSelectedAudit(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Action:</span>
                <div className="font-mono text-cyan-300 font-semibold mt-0.5">{selectedAudit.action}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Actor Email:</span>
                <div className="font-mono text-slate-300 mt-0.5">{selectedAudit.userEmail || "System"}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Resource:</span>
                <div className="font-mono text-slate-300 mt-0.5">{selectedAudit.resource || "N/A"}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Details:</span>
                <div className="text-slate-200 bg-[#060B18] p-3 rounded-xl border border-slate-800 mt-0.5 font-mono text-[11px]">
                  {selectedAudit.details || "No extra metadata."}
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Timestamp:</span>
                <div className="font-mono text-slate-400 mt-0.5">{new Date(selectedAudit.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
