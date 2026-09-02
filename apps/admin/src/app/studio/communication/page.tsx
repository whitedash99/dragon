"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Mail,
  Send,
  LifeBuoy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  MessageSquare,
  Shield,
  User,
} from "lucide-react";

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export default function StudioCommunicationPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementSent, setAnnouncementSent] = useState(false);

  useEffect(() => {
    fetch("/api/crm")
      .then((res) => res.json())
      .then((data) => {
        if (data.tickets) {
          setTickets(data.tickets);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setAnnouncementSent(true);
    setTimeout(() => {
      setAnnouncementSent(false);
      setAnnouncementText("");
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              STUDIO HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">• Dispatch & Inquiries</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Communications, Press & Support Desk
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage incoming player inquiries, media press contacts, official announcements, and studio dispatch.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Form */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Broadcast Announcement</h2>
          </div>
          <p className="text-xs text-slate-400">
            Publish a high-priority banner across the public Dragon Gaming Studio website.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-3">
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              rows={4}
              placeholder="e.g. Uncharted Drive: Beyond 4K Update is now live worldwide..."
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{announcementSent ? "Broadcast Dispatched!" : "Publish Announcement"}</span>
            </button>
          </form>
        </div>

        {/* Support Tickets Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Incoming Inquiries & Support Tickets
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Total: {tickets.length} Inquiries
            </span>
          </div>

          <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto" />
                <p>No open contact tickets in database.</p>
                <p className="text-[11px] text-slate-500">Contact submissions from dragongamingstudios.vercel.app/contact appear here instantly.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 hover:bg-white/[0.02] transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-white text-xs">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>{t.name}</span>
                        <span className="text-slate-500 font-mono text-[11px]">({t.email})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">{t.subject}</div>
                    <p className="text-xs text-slate-400 line-clamp-2">{t.message}</p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Submitted: {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
