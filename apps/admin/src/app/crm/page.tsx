"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Search, RefreshCw } from "lucide-react";
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 flex overflow-hidden">
          {/* LEFT INBOX DRAWER (320px) */}
          <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 p-4 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Support Queue ({tickets.length})
              </span>
              <button onClick={fetchTickets} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-1.5">
              {["All", "NEW", "IN_PROGRESS", "RESOLVED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                    statusFilter === st
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {tickets.map((t) => {
                const isSelected = selectedTicket?.ticketId === t.ticketId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5",
                      isSelected
                        ? "bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900 shadow-xs"
                        : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn("text-xs font-mono font-bold", isSelected ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-slate-100")}>{t.ticketId}</span>
                      <span className={cn(
                        "text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border",
                        isSelected
                          ? "bg-emerald-800 dark:bg-emerald-200 text-emerald-100 dark:text-emerald-900 border-emerald-700 dark:border-emerald-300"
                          : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      )}>
                        {t.status}
                      </span>
                    </div>
                    <div className={cn("text-xs font-semibold truncate", isSelected ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-slate-100")}>{t.subject}</div>
                    <div className={cn("flex items-center justify-between text-[11px]", isSelected ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400")}>
                      <span>{t.customerName}</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* MAIN TICKET WORKSPACE & CUSTOMER DETAILS PANEL */}
          <section className="flex-1 flex min-w-0 bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {selectedTicket ? (
              <div className="flex-1 flex overflow-hidden">
                {/* Center Conversation Stream */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {/* Ticket Banner */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                        {selectedTicket.category}
                      </span>
                      <span className="text-xs font-semibold uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800 font-mono">
                        {selectedTicket.priority} Priority
                      </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{selectedTicket.subject}</h1>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Customer: {selectedTicket.customerName} ({selectedTicket.customerEmail}) • Ticket ID: {selectedTicket.ticketId}
                    </div>
                  </div>

                  {/* Timeline */}
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
                <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-6 overflow-y-auto shrink-0 hidden xl:block">
                  <CRMCustomerSidebar
                    ticket={selectedTicket}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-sans">
                Select a ticket from the left queue to view details and compose replies.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
