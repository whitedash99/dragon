"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Search, RefreshCw, LifeBuoy, ShieldCheck, Tag, Trash2, CheckCircle } from "lucide-react";
import { CRMTicketTimeline } from "@/components/crm/CRMTicketTimeline";
import { CRMCustomerSidebar } from "@/components/crm/CRMCustomerSidebar";
import { CRMTicketComposer } from "@/components/crm/CRMTicketComposer";
import { cn } from "@/lib/utils/cn";

interface MessageItem {
  id: string;
  senderType: string;
  senderName: string;
  message: string;
  createdAt: string;
}

interface InternalNoteItem {
  id: string;
  author: string;
  note: string;
}

interface TicketItem {
  id: string;
  ticketId: string;
  customerName: string;
  customerEmail: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  assignedAgent?: string;
  department: string;
  lastReplyAt: string;
  createdAt: string;
  messages: MessageItem[];
  internalNotes: InternalNoteItem[];
}

export default function CRMPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [sending, setSending] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crm/tickets?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        if (data.tickets.length > 0) {
          const current = selectedTicket
            ? data.tickets.find((t: TicketItem) => t.ticketId === selectedTicket.ticketId) || data.tickets[0]
            : data.tickets[0];

          setSelectedTicket(current);
        }
      }
    } catch (e) {
      console.error("Error fetching tickets", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, selectedTicket]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSendReply = async (replyText: string) => {
    if (!selectedTicket || !replyText.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/crm/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_reply",
          ticketId: selectedTicket.ticketId,
          message: replyText.trim(),
          adminName: "Dragon Support Agent",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchedSuccess(true);
        setTimeout(() => setDispatchedSuccess(false), 2500);
        fetchTickets();
      }
    } catch (err) {
      console.error("Send reply error", err);
    } finally {
      setSending(false);
    }
  };

  const handleSaveInternalNote = async (noteText: string) => {
    if (!selectedTicket || !noteText.trim()) return;
    setSending(true);
    try {
      await fetch("/api/crm/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_ticket",
          ticketId: selectedTicket.ticketId,
          internalNote: noteText.trim(),
          adminName: "Dragon Support Agent",
        }),
      });
      setDispatchedSuccess(true);
      setTimeout(() => setDispatchedSuccess(false), 2500);
      fetchTickets();
    } catch (e) {
      console.error("Save note error", e);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedTicket) return;
    try {
      await fetch("/api/crm/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_ticket",
          ticketId: selectedTicket.ticketId,
          status: newStatus,
        }),
      });
      setSelectedTicket({ ...selectedTicket, status: newStatus });
      fetchTickets();
    } catch (e) {
      console.error("Status update error", e);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!selectedTicket) return;
    try {
      await fetch("/api/crm/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_ticket",
          ticketId: selectedTicket.ticketId,
          priority: newPriority,
        }),
      });
      setSelectedTicket({ ...selectedTicket, priority: newPriority });
      fetchTickets();
    } catch (e) {
      console.error("Priority update error", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#02050E] text-slate-100 font-sans select-none overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 flex overflow-hidden">
          {/* LEFT INBOX DRAWER (320px) */}
          <aside className="w-80 bg-[#040A18]/95 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col shrink-0 p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="size-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  SUPPORT QUEUE ({tickets.length})
                </span>
              </div>
              <button
                onClick={fetchTickets}
                className="p-1.5 rounded-xl bg-[#020614] border border-cyan-500/30 text-cyan-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh Queue"
              >
                <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {["All", "OPEN", "NEW", "RESOLVED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer",
                    statusFilter === st
                      ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                      : "bg-[#020614] border border-cyan-500/20 text-slate-400 hover:text-white"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {tickets.length === 0 ? (
                <div className="text-center py-12 text-xs font-mono text-slate-500">
                  No tickets found.
                </div>
              ) : (
                tickets.map((t) => {
                  const isSelected = selectedTicket?.ticketId === t.ticketId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all space-y-2 cursor-pointer relative overflow-hidden",
                        isSelected
                          ? "bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-500/30 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                          : "bg-[#020614]/80 border-white/10 hover:border-cyan-500/30 text-slate-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("text-xs font-mono font-black tracking-wider", isSelected ? "text-cyan-300" : "text-white")}>
                          {t.ticketId}
                        </span>
                        <span className={cn(
                          "text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border",
                          t.status === "RESOLVED" || t.status === "CLOSED"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                        )}>
                          {t.status || "OPEN"}
                        </span>
                      </div>
                      <div className="text-xs font-heading font-bold uppercase truncate text-white">
                        {t.subject}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="truncate">{t.customerName}</span>
                        <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* MAIN TICKET WORKSPACE & CUSTOMER DETAILS PANEL */}
          <section className="flex-1 flex min-w-0 bg-[#02050E] overflow-hidden">
            {selectedTicket ? (
              <div className="flex-1 flex overflow-hidden">
                {/* Center Conversation Stream */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 scrollbar-thin">
                  {/* Ticket Banner Header */}
                  <div className="bg-[#040A18]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 space-y-3 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-400/40">
                        {selectedTicket.category || "Technical Support"}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/40">
                        {selectedTicket.priority || "NORMAL"} PRIORITY
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-heading tracking-tight">
                      {selectedTicket.subject}
                    </h1>
                    <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-3">
                      <span>Customer: <strong className="text-white">{selectedTicket.customerName}</strong> ({selectedTicket.customerEmail})</span>
                      <span>•</span>
                      <span>Ticket ID: <strong className="text-cyan-400">{selectedTicket.ticketId}</strong></span>
                    </div>
                  </div>

                  {/* Timeline Stream */}
                  <CRMTicketTimeline ticket={selectedTicket} />

                  {/* Response Composer */}
                  <CRMTicketComposer
                    onSendReply={handleSendReply}
                    onAddNote={handleSaveInternalNote}
                    sending={sending}
                    dispatchedSuccess={dispatchedSuccess}
                  />
                </div>

                {/* Right Context Inspector Panel (320px) */}
                <div className="w-80 border-l border-cyan-500/20 bg-[#020614]/90 p-6 overflow-y-auto shrink-0 hidden xl:block scrollbar-thin">
                  <CRMCustomerSidebar
                    ticket={selectedTicket}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-3">
                <LifeBuoy className="size-10 text-cyan-400/40" />
                <span>Select a ticket from the left queue to view conversation and dispatch replies.</span>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
