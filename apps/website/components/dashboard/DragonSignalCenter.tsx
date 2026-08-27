"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Inbox
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

export interface SupportTicket {
  id: string;
  ticketId?: string;
  name?: string;
  email?: string;
  subject: string;
  message?: string;
  status: string;
  priority?: string;
  category?: string;
  createdAt: string;
}

interface DragonSignalCenterProps {
  tickets: SupportTicket[];
  userEmail: string;
  userName: string;
  onRefreshTickets: () => void;
}

export function DragonSignalCenter({
  tickets,
  userEmail,
  userName,
  onRefreshTickets,
}: DragonSignalCenterProps) {
  const [activeTab, setActiveTab] = useState<"SIGNALS" | "DISPATCH" | "TRACK">("SIGNALS");
  const [category, setCategory] = useState("Technical Support");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [trackInput, setTrackInput] = useState("");
  const [sending, setSending] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    setError(null);
    setCreatedTicketId(null);
    soundFx.playClick();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName || "Dragon Operative",
          email: userEmail || "operative@dragongamingstudios.com",
          category,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch support signal.");
      }

      setCreatedTicketId(data.ticketId);
      setSubject("");
      setMessage("");
      soundFx.playForgeComplete();
      onRefreshTickets();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending signal";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Headphones className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white font-heading tracking-tight">
              DRAGON SUPPORT & COMMUNICATIONS DESK
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Enterprise Technical Dispatch, Live Ticket Tracking & Command Communications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("SIGNALS");
              soundFx.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeTab === "SIGNALS"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            My Tickets ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("DISPATCH");
              soundFx.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeTab === "DISPATCH"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            + New Ticket
          </button>
        </div>
      </div>

      {/* ═══ TAB 1: USER'S TICKETS ═══ */}
      {activeTab === "SIGNALS" && (
        <div className="space-y-4">
          {tickets.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl bg-[#03091D]/90 border border-cyan-500/20 p-5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-400/50 transition-all shadow-lg"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300">
                        {t.ticketId || `#${t.id.slice(0, 8)}`}
                      </span>
                      <span className="text-sm font-black uppercase text-white font-heading tracking-wide">
                        {t.subject}
                      </span>
                    </div>
                    {t.message && (
                      <p className="text-xs text-slate-300 font-sans line-clamp-2">
                        {t.message}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-1">
                      <span>Submitted: {new Date(t.createdAt).toLocaleDateString()}</span>
                      {t.category && <span>• Category: {t.category}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      t.status === "CLOSED" || t.status === "RESOLVED"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
                        : "bg-cyan-500/15 text-cyan-300 border-cyan-400/40 animate-pulse"
                    }`}>
                      {t.status || "OPEN"}
                    </span>

                    {t.ticketId && (
                      <a
                        href={`/support/${t.ticketId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5"
                      >
                        <span>Track Live →</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#020512]/60 border-2 border-dashed border-cyan-500/25 p-10 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30">
                <Inbox className="size-6 text-cyan-400" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-black uppercase text-white font-heading">
                  NO ACTIVE SUPPORT TICKETS
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  You haven&apos;t submitted any support requests yet. Click &quot;+ New Ticket&quot; to contact our team anytime.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB 2: DISPATCH NEW TICKET ═══ */}
      {activeTab === "DISPATCH" && (
        <form
          onSubmit={handleCreateTicket}
          className="rounded-3xl bg-[#03091D]/95 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-2xl space-y-5 max-w-2xl shadow-[0_0_40px_rgba(0,229,255,0.15)]"
        >
          {createdTicketId && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-xs font-mono text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <CheckCircle2 className="size-5 text-emerald-400" />
                <span>Support Ticket Created Successfully!</span>
              </div>
              <p>Reference Ticket ID: <strong className="text-cyan-300">{createdTicketId}</strong></p>
              <p className="text-slate-300">An email notification has been dispatched. Our technical team will review your inquiry and reply very soon.</p>
              <div className="pt-1">
                <a
                  href={`/support/${createdTicketId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-1.5 rounded-lg bg-emerald-400 text-black font-bold uppercase text-[11px]"
                >
                  Track Ticket Online →
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertCircle className="size-4 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-bold">
                Operative Name
              </label>
              <input
                type="text"
                disabled
                value={userName}
                className="w-full rounded-xl bg-black/50 px-4 py-3 text-xs text-slate-300 border border-white/10 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-bold">
                Account Email
              </label>
              <input
                type="text"
                disabled
                value={userEmail}
                className="w-full rounded-xl bg-black/50 px-4 py-3 text-xs text-slate-300 border border-white/10 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-bold">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl bg-[#02050E] px-4 py-3 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="Technical Support">Technical Support (Crash / Launch Issue)</option>
              <option value="Game Bug">Game Bug (UNCHARTED DRIVE: BEYOND physics or visuals)</option>
              <option value="Account & Dragon ID">Account & Dragon ID Profile</option>
              <option value="Feedback">Feedback & Suggestions</option>
              <option value="General Inquiry">General Studio Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-bold">
              Subject Line
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Android APK Install Query / GPU Performance"
              className="w-full rounded-xl bg-[#02050E] px-4 py-3 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-bold">
              Inquiry Details & Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide specific details about your device, OS, or question..."
              className="w-full rounded-xl bg-[#02050E] px-4 py-3 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full sm:w-auto min-h-[44px] px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-mono font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="size-3.5" />
            <span>{sending ? "DISPATCHING TICKET..." : "CREATE SUPPORT TICKET"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
