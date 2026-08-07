"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { LifeBuoy, Clock } from "lucide-react";
import { CRMMetricsHeader } from "@/components/crm/CRMMetricsHeader";
import { CRMFilterBar } from "@/components/crm/CRMFilterBar";
import { CRMTicketTimeline } from "@/components/crm/CRMTicketTimeline";
import { CRMCustomerSidebar } from "@/components/crm/CRMCustomerSidebar";
import { CRMTicketComposer } from "@/components/crm/CRMTicketComposer";
import { SkeletonList } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

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
  const [telemetry, setTelemetry] = useState({
    totalTickets: 0,
    openTickets: 0,
    urgentTickets: 0,
    resolvedTickets: 0,
    avgResponseSla: "< 4 Hours",
  });
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
        if (data.telemetry) setTelemetry(data.telemetry);

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
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchTickets();
    });
    return () => { isMounted = false; };
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

  const handleUpdateStatus = async (newStatus: string) => {
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
      fetchTickets();
    } catch (e) {
      console.error("Update status error", e);
    }
  };

  const handleUpdatePriority = async (newPriority: string) => {
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
      fetchTickets();
    } catch (e) {
      console.error("Update priority error", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="purple" size="sm">Enterprise CRM Support Desk</Badge>
                <span className="text-xs text-slate-500 font-mono">v2.4 SLA Active</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <LifeBuoy className="w-6 h-6 text-purple-400" /> Customer Support Center
              </h1>
            </div>
          </div>

          {/* Telemetry Metrics */}
          <CRMMetricsHeader telemetry={telemetry} />

          {/* Search & Filter Bar */}
          <CRMFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onRefresh={fetchTickets}
            loading={loading}
          />

          {/* Main Grid View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Ticket List Drawer */}
            <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Ticket Inbox ({tickets.length})
                </span>
                <span className="text-[10px] text-purple-400 font-mono">Live Sync</span>
              </div>

              {loading ? (
                <SkeletonList count={4} />
              ) : tickets.length === 0 ? (
                <EmptyState
                  title="No Tickets Found"
                  description="No customer inquiries match your current filter or search criteria."
                />
              ) : (
                <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
                  {tickets.map((t) => {
                    const isSelected = selectedTicket?.ticketId === t.ticketId;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-950/40"
                            : "bg-slate-950/40 border-white/5 hover:border-white/15 hover:bg-slate-900/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-white font-mono">{t.ticketId}</span>
                          <Badge
                            variant={
                              t.status === "NEW" ? "purple" : t.status === "IN_PROGRESS" ? "cyan" : "success"
                            }
                            size="sm"
                          >
                            {t.status}
                          </Badge>
                        </div>
                        <div className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                          {t.subject}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{t.customerName}</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ticket Workspace Details */}
            {selectedTicket ? (
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  {/* Timeline & Reply Panel */}
                  <div className="xl:col-span-7 space-y-6">
                    {/* Ticket Title Banner */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="purple" size="sm">{selectedTicket.category || "General"}</Badge>
                        <Badge
                          variant={selectedTicket.priority === "URGENT" ? "danger" : "default"}
                          size="sm"
                        >
                          {selectedTicket.priority} Priority
                        </Badge>
                      </div>
                      <h2 className="text-lg font-bold text-white mb-1">{selectedTicket.subject}</h2>
                      <div className="text-xs text-slate-400 font-mono">
                        Ticket ID: {selectedTicket.ticketId} • Logged via Public Web Portal
                      </div>
                    </div>

                    {/* Threaded Timeline */}
                    <CRMTicketTimeline ticket={selectedTicket} />

                    {/* Response Composer */}
                    <CRMTicketComposer
                      onSendReply={handleSendReply}
                      onAddNote={handleSaveInternalNote}
                      sending={sending}
                      dispatchedSuccess={dispatchedSuccess}
                    />
                  </div>

                  {/* Customer Metadata Drawer */}
                  <div className="xl:col-span-5">
                    <CRMCustomerSidebar
                      ticket={selectedTicket}
                      onStatusChange={handleUpdateStatus}
                      onPriorityChange={handleUpdatePriority}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-8">
                <EmptyState
                  title="Select a Ticket"
                  description="Choose a customer inquiry from the left drawer to inspect timeline history and compose replies."
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
