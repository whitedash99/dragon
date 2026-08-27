"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { MessageSquare, Mail, Send, CheckCircle2, RefreshCw, Radio, Users, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import { GlassCard, GlassStat } from "@/components/ui/glass";

interface EmailLogItem {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  providerResponse?: string | null;
  createdAt: string;
}

export default function CommunicationPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [targetGroup, setTargetGroup] = useState<"ALL" | "PLAYERS" | "STAFF">("ALL");
  const [sending, setSending] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [telemetry, setTelemetry] = useState({
    totalRegisteredUsers: 0,
    totalStaff: 0,
    totalPlayers: 0,
    totalCount: 0,
    dispatchedCount: 0,
    failedCount: 0,
    deliveryRate: "100%",
    resendStatus: "LIVE_CONNECTED",
  });
  const [emailLogs, setEmailLogs] = useState<EmailLogItem[]>([]);

  const fetchCommunicationData = useCallback(async () => {
    try {
      const res = await fetch("/api/communication");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.telemetry) setTelemetry(data.telemetry);
          if (Array.isArray(data.emailLogs)) setEmailLogs(data.emailLogs);
        }
      }
    } catch (e) {
      console.error("Failed to load communication telemetry:", e);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunicationData();
  }, [fetchCommunicationData]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    setSending(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/communication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "broadcast_dispatch",
          subject: subject.trim(),
          body: body.trim(),
          targetGroup,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({
          type: "success",
          text: `Broadcast successfully dispatched to ${data.totalRecipients || 0} real accounts (${data.dispatched || 0} delivered)!`,
        });
        setSubject("");
        setBody("");
        fetchCommunicationData();
      } else {
        setStatusMsg({
          type: "error",
          text: data.error || "Failed to dispatch broadcast.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider">Dragon Control • Studio Communications</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Announcements & Dispatch Broadcast</h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">Broadcast live announcements to verified database accounts and inspect real delivery logs.</p>
            </div>

            <button
              onClick={fetchCommunicationData}
              className="p-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all cursor-pointer self-start md:self-auto flex items-center gap-2 text-xs"
              title="Refresh Live Data"
            >
              <RefreshCw className="size-3.5 text-cyan-400" />
              <span>Refresh Metrics</span>
            </button>
          </div>

          {/* Real Live Database Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassStat
              label="Real Registered Users"
              value={telemetry.totalRegisteredUsers}
              subtext={`${telemetry.totalPlayers} Players • ${telemetry.totalStaff} Staff`}
              icon={Users}
            />
            <GlassStat
              label="Delivery Gateway"
              value={telemetry.resendStatus === "LIVE_CONNECTED" ? "ONLINE" : "READY"}
              trend={telemetry.deliveryRate}
              trendPositive={true}
              subtext="Real SMTP & Email Logs"
              icon={Radio}
            />
            <GlassStat
              label="Dispatches Processed"
              value={telemetry.totalCount}
              subtext={`${telemetry.dispatchedCount} Dispatched • ${telemetry.failedCount} Failed`}
              icon={MessageSquare}
            />
          </div>

          {/* Broadcast Form */}
          <GlassCard className="p-6 max-w-3xl space-y-5 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Send className="size-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Send Studio Dispatch Broadcast</h3>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">Canonical PostgreSQL Target</span>
            </div>

            {statusMsg && (
              <div className={`p-3.5 border rounded-xl flex items-center gap-2 text-xs font-mono font-bold shadow-lg ${
                statusMsg.type === "success"
                  ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-rose-500/15 border-rose-400/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              }`}>
                {statusMsg.type === "success" ? (
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="size-4 text-rose-400 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-4 font-mono">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-400">Target Audience *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "ALL" as const, label: `All Users (${telemetry.totalRegisteredUsers})` },
                    { id: "PLAYERS" as const, label: `Players (${telemetry.totalPlayers})` },
                    { id: "STAFF" as const, label: `Staff (${telemetry.totalStaff})` },
                  ].map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setTargetGroup(group.id)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        targetGroup === group.id
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                          : "bg-[#02050E] border-cyan-500/20 text-slate-400 hover:text-white"
                      }`}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-400">Broadcast Title / Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Uncharted Drive: Beyond v2.0 Now Live!"
                  className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-400">Dispatch Content *</label>
                <textarea
                  rows={5}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter dispatch notes, game download instructions, changelogs, and updates..."
                  className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {sending ? <RefreshCw className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                <span>{sending ? "Dispatching to Database Accounts..." : "Send Live Broadcast"}</span>
              </button>
            </form>
          </GlassCard>

          {/* Real Dispatch Logs Table */}
          <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Real PostgreSQL Dispatch Logs</h3>
              </div>
              <span className="text-xs text-slate-400">{emailLogs.length} Records</span>
            </div>

            {loadingLogs ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading audit records...</div>
            ) : emailLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No dispatches logged yet. Broadcasts will be recorded here in real-time.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-cyan-500/20 text-cyan-400">
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Gateway Details</th>
                      <th className="py-2.5 px-3">Dispatched At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/10 text-slate-300">
                    {emailLogs.slice(0, 15).map((log) => (
                      <tr key={log.id} className="hover:bg-cyan-500/5 transition-colors">
                        <td className="py-2.5 px-3 text-white font-bold">{log.recipient}</td>
                        <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{log.subject}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === "DISPATCHED"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400 max-w-xs truncate">
                          {log.providerResponse || "Processed"}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
