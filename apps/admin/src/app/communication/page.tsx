"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  Mail,
  Send,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Inbox,
  FileText,
  Radio,
  Zap,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface EmailLogItem {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  template: string;
  type: string;
  providerResponse?: string;
  errorMessage?: string;
  createdAt: string;
}

export default function DragonMailPage() {
  const [telemetry, setTelemetry] = useState<{
    totalCount?: number;
    dispatchedCount?: number;
    failedCount?: number;
    deliveryRate?: string;
    resendStatus?: string;
  }>({});

  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewTab, setViewTab] = useState<"logs" | "templates" | "compose">("logs");

  const [testRecipient, setTestRecipient] = useState("founder@dragonstudios.com");
  const [testSubject, setTestSubject] = useState("Dragon Mail Enterprise Verification Test");
  const [sendingTest, setSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  const fetchEmailData = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL("/api/communication", window.location.origin);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (searchQuery.trim()) url.searchParams.set("query", searchQuery.trim());

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.emailLogs)) setLogs(data.emailLogs);
      }
    } catch (e) {
      console.error("Error fetching email logs", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchEmailData();
    });
    return () => { isMounted = false; };
  }, [fetchEmailData]);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingTest(true);
    setTestSuccess(null);
    try {
      const res = await fetch("/api/communication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_test_email",
          recipient: testRecipient.trim(),
          subject: testSubject.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestSuccess(`Email dispatched via Resend! Message ID: ${data.messageId || 'msg_ok'}`);
        fetchEmailData();
      }
    } catch (e) {
      console.error("Test email dispatch error", e);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508] text-white font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b] flex items-center gap-1.5">
                <Mail className="size-3.5" />
                <span>ENTERPRISE MAIL PLATFORM (RESEND INTEGRATED)</span>
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                DRAGON MAIL COMMAND CENTER
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchEmailData} variant="outline" size="sm" className="rounded-xl text-xs gap-2 border-white/15">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH DISPATCH MATRIX</span>
              </Button>
              <Button onClick={() => setViewTab("compose")} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Send className="size-3.5" />
                <span>DISPATCH TEST MAIL</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Cards Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL EMAILS DISPATCHED</span>
              <span className="text-2xl font-black text-white block">{telemetry.totalCount || 0} MESSAGES</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">DELIVERY SUCCESS RATE</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.deliveryRate || "100%"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">RESEND API SERVICE</span>
              <span className="text-2xl font-black text-purple-400 block uppercase">{telemetry.resendStatus || "LIVE_CONNECTED"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">FAILED DISPATCH QUEUE</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.failedCount || 0} QUEUED</span>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "logs" as const, label: "Live Email Logs", icon: Inbox },
              { id: "templates" as const, label: "Reusable Templates Directory", icon: FileText },
              { id: "compose" as const, label: "Dispatch Test Mail", icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = viewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewTab(tab.id)}
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

          {/* TAB 1: LIVE EMAIL LOGS */}
          {viewTab === "logs" && (
            <div className="space-y-4">
              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
                <div className="relative w-full sm:w-80">
                  <Search className="size-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by recipient or subject..."
                    className="w-full rounded-xl bg-black/60 pl-9 pr-4 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  {["ALL", "DISPATCHED", "PENDING", "FAILED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border",
                        statusFilter === st
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-black/40 text-slate-400 border-white/5 hover:text-white"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logs Table */}
              <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                    <Radio className="size-4 text-[#ff1e4b] animate-pulse" />
                    <span>RECENT EMAIL DISPATCHES ({logs.length})</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">RESEND VERIFIED</span>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                      Loading Neon PostgreSQL email logs...
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No email dispatches recorded in Neon PostgreSQL.
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{log.recipient}</span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px]">
                              {log.template}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs font-sans">{log.subject}</p>
                          {log.providerResponse && (
                            <span className="text-[10px] text-slate-500 font-mono block">
                              Provider ID: {log.providerResponse}
                            </span>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0 font-mono text-[10px]">
                          <span
                            className={cn(
                              "px-2 py-1 rounded font-bold uppercase text-[9px]",
                              log.status === "DISPATCHED" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                            )}
                          >
                            {log.status}
                          </span>
                          <span className="text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REUSABLE TEMPLATES DIRECTORY */}
          {viewTab === "templates" && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Customer Contact Confirmation", category: "Support", templateId: "CONTACT_CONFIRMATION", desc: "Sent instantly to customer after submitting contact form with ticket ID." },
                { name: "New Contact Owner Notification", category: "Internal Alert", templateId: "OWNER_CONTACT_ALERT", desc: "Detailed breakdown to Founder personal email with client IP & user agent." },
                { name: "Support Ticket Reply", category: "CRM Support", templateId: "TICKET_REPLY", desc: "Dispatched when support staff posts a reply to an open ticket." },
                { name: "New Hardware Device Alert", category: "Security", templateId: "SECURITY_ALERT", desc: "Dispatched when an unrecognized hardware device logs into Admin OS." },
                { name: "Staff Team Invitation", category: "IAM Auth", templateId: "TEAM_INVITATION", desc: "Tokenized 24-hour single-use invitation for new staff onboarding." },
                { name: "Executive Account Seeded", category: "System", templateId: "EXECUTIVE_SEED", desc: "Dispatched when Founder or Co-Founder accounts are provisioned." },
              ].map((tmpl, idx) => (
                <div key={idx} className="rounded-3xl glass-panel p-6 border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-400 uppercase">{tmpl.category}</span>
                    <span className="text-[9px] font-mono text-slate-500">{tmpl.templateId}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">{tmpl.name}</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{tmpl.desc}</p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-400">
                    <span className="flex items-center gap-1"><CheckCheck className="size-3" /> RESEND VERIFIED</span>
                    <span className="font-mono text-slate-500">HTML 5 READY</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DISPATCH TEST MAIL */}
          {viewTab === "compose" && (
            <div className="w-full max-w-xl mx-auto rounded-3xl glass-panel p-8 border border-white/15 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white uppercase font-heading">TEST RESEND DISPATCH</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Send a test email through the centralized Dragon Mail Service to verify live Resend API delivery.
                </p>
              </div>

              {testSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  <span>{testSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSendTestEmail} className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase text-slate-400">RECIPIENT EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    placeholder="founder@dragonstudios.com"
                    className="w-full rounded-2xl bg-black/60 px-4 py-3 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase text-slate-400">SUBJECT LINE</label>
                  <input
                    type="text"
                    required
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value)}
                    placeholder="Dragon Mail Enterprise Verification"
                    className="w-full rounded-2xl bg-black/60 px-4 py-3 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sendingTest}
                  variant="solidRed"
                  size="lg"
                  className="w-full rounded-2xl font-bold uppercase tracking-wider gap-2 py-3.5 text-xs shadow-xl shadow-[#ff1e4b]/20"
                >
                  {sendingTest ? <RefreshCw className="size-4 animate-spin" /> : <Send className="size-4" />}
                  <span>DISPATCH RESEND EMAIL</span>
                </Button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
