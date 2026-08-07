"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  LifeBuoy, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  BookOpen, 
  Send, 
  User, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface TicketMessageItem {
  id: string;
  sender: string;
  senderName: string;
  message: string;
  createdAt: string;
}

interface TicketItem {
  id: string;
  ticketId: string;
  category: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  estimatedResponse?: string;
  createdAt: string;
  messages?: TicketMessageItem[];
}

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  helpful: number;
  views: number;
}

export default function CustomerAccountPage() {
  const [profile, setProfile] = useState<{
    name?: string;
    email?: string;
    language?: string;
    timezone?: string;
  }>({});

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  // Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formCategory, setFormCategory] = useState("Technical Support");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formPriority, setFormPriority] = useState("NORMAL");
  const [submitting, setSubmitting] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Reply State
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // View Mode
  const [viewMode, setViewMode] = useState<"tickets" | "kb" | "profile">("tickets");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomerData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account?email=player@dragonstudios.com");
      const data = await res.json();
      if (data.success) {
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.tickets)) {
          setTickets(data.tickets);
          if (data.tickets.length > 0 && !selectedTicket) {
            setSelectedTicket(data.tickets[0]);
          }
        }
        if (Array.isArray(data.knowledgeBase)) setKnowledgeBase(data.knowledgeBase);
      }
    } catch (e) {
      console.error("Error fetching customer portal data", e);
    } finally {
      setLoading(false);
    }
  }, [selectedTicket]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchCustomerData();
    });
    return () => { isMounted = false; };
  }, [fetchCustomerData]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_ticket",
          name: profile.name || "Customer Player",
          email: profile.email || "player@dragonstudios.com",
          category: formCategory,
          subject: formSubject,
          message: formMessage,
          priority: formPriority,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreateSuccess(true);
        setFormSubject("");
        setFormMessage("");
        setShowCreateModal(false);
        setTimeout(() => setCreateSuccess(false), 3000);
        fetchCustomerData();
      }
    } catch (err) {
      console.error("Create ticket error", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply_ticket",
          ticketId: selectedTicket.ticketId,
          name: profile.name || "Customer Player",
          replyMessage: replyText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyText("");
        fetchCustomerData();
      }
    } catch (err) {
      console.error("Send reply error", err);
    } finally {
      setSendingReply(false);
    }
  };

  const filteredKb = knowledgeBase.filter((art) =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 mt-16 font-mono text-xs">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 bg-gradient-to-r from-red-950/30 via-black to-purple-950/20">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#df5033] flex items-center gap-2">
              <Sparkles className="size-4" /> DRAGON STUDIOS SELF-SERVICE PORTAL
            </span>
            <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl font-heading">
              WELCOME BACK, {profile.name || "PLAYER"}!
            </h1>
            <p className="text-muted-foreground text-xs font-sans">
              Manage your support tickets, communication channels, and self-service help resources directly connected to Dragon CRM.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={fetchCustomerData} variant="outline" size="sm" className="rounded-xl text-xs gap-2 border-white/20">
              <RefreshCw className="size-3.5 text-[#df5033]" />
              <span>REFRESH DATA</span>
            </Button>
            <Button onClick={() => setShowCreateModal(true)} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
              <Plus className="size-3.5" />
              <span>CREATE TICKET</span>
            </Button>
          </div>
        </div>

        {createSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-2">
            <CheckCircle2 className="size-4" /> YOUR SUPPORT TICKET HAS BEEN PERSISTED AND DISPATCHED TO DRAGON CRM
          </div>
        )}

        {/* Telemetry Strip */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] font-bold block">OPEN TICKETS</span>
            <span className="text-2xl font-black text-emerald-400 block">
              {tickets.filter((t) => t.status !== "CLOSED").length}
            </span>
          </div>
          <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL SUBMISSIONS</span>
            <span className="text-2xl font-black text-white block">{tickets.length}</span>
          </div>
          <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] font-bold block">SLA RESPONSE TIME</span>
            <span className="text-2xl font-black text-sky-400 block">&lt; 12 HOURS</span>
          </div>
          <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] font-bold block">HELP ARTICLES VIEWED</span>
            <span className="text-2xl font-black text-purple-400 block">4,540</span>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
          {[
            { id: "tickets" as const, label: "My Support Tickets", icon: LifeBuoy },
            { id: "kb" as const, label: "Self-Service Knowledge Base", icon: BookOpen },
            { id: "profile" as const, label: "Profile & Preferences", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border shrink-0 font-mono",
                  isSelected
                    ? "bg-[#df5033] text-white border-[#df5033] shadow-lg shadow-[#df5033]/20"
                    : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Content */}
        {viewMode === "tickets" && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Ticket List */}
            <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-white/15 space-y-4">
              <span className="text-xs font-bold uppercase text-white flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-2">
                  <LifeBuoy className="size-4 text-[#df5033]" />
                  <span>SUPPORT TICKETS ({tickets.length})</span>
                </span>
              </span>

              {loading ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#df5033]" />
                  Loading CRM support tickets...
                </div>
              ) : tickets.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                  <p>No active support tickets found.</p>
                  <Button onClick={() => setShowCreateModal(true)} variant="outline" size="sm">
                    Create First Ticket
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {tickets.map((t) => {
                    const isSelected = selectedTicket?.ticketId === t.ticketId;
                    return (
                      <div
                        key={t.ticketId}
                        onClick={() => setSelectedTicket(t)}
                        className={cn(
                          "p-4 rounded-2xl border transition-all cursor-pointer space-y-2",
                          isSelected
                            ? "bg-[#df5033]/15 border-[#df5033]/50 text-white"
                            : "bg-black/40 border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#df5033] font-mono text-[11px]">{t.ticketId}</span>
                          <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 font-bold text-[9px] uppercase">
                            {t.status}
                          </span>
                        </div>
                        <strong className="text-white font-sans text-xs block font-semibold truncate">{t.subject}</strong>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{t.category}</span>
                          <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ticket Thread Inspector */}
            <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 flex flex-col justify-between min-h-[500px]">
              {selectedTicket ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Ticket Header & Status Timeline */}
                  <div className="space-y-4 border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#df5033]">{selectedTicket.ticketId}</span>
                        <h2 className="text-xl font-bold text-white font-sans">{selectedTicket.subject}</h2>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-bold text-xs">
                        {selectedTicket.status}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground overflow-x-auto">
                      {["CREATED", "ASSIGNED", "INVESTIGATING", "WAITING REPLY", "RESOLVED"].map((st, i) => (
                        <React.Fragment key={st}>
                          <span className={cn("px-2 py-0.5 rounded-full border", i === 0 || selectedTicket.status === st ? "bg-[#df5033]/20 text-[#df5033] border-[#df5033]/40" : "bg-white/5 border-white/5")}>
                            {st}
                          </span>
                          {i < 4 && <ArrowRight className="size-2 text-muted-foreground shrink-0" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Thread Messages */}
                  <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2">
                    {/* Original Message */}
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <strong className="text-white font-sans">{profile.name || "Customer"}</strong>
                        <span className="text-muted-foreground">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">{selectedTicket.message}</p>
                    </div>

                    {/* Replies */}
                    {selectedTicket.messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "p-4 rounded-2xl border space-y-1",
                          msg.sender === "ADMIN"
                            ? "bg-[#df5033]/10 border-[#df5033]/30 text-white ml-4"
                            : "bg-black/60 border-white/10 text-muted-foreground mr-4"
                        )}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <strong className={msg.sender === "ADMIN" ? "text-[#df5033] font-sans" : "text-white font-sans"}>
                            {msg.senderName} {msg.sender === "ADMIN" && "(Dragon Support)"}
                          </strong>
                          <span className="text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs font-sans text-white/90">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="pt-4 border-t border-white/10 flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Type your reply message..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 rounded-xl bg-black/60 px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#df5033]"
                    />
                    <Button type="submit" disabled={sendingReply} variant="solidRed" size="sm" className="gap-2 shrink-0">
                      {sendingReply ? <RefreshCw className="size-4 animate-spin" /> : <Send className="size-4" />}
                      <span>SEND REPLY</span>
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="py-20 text-center text-muted-foreground text-xs">
                  Select a support ticket on the left to view conversation thread.
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === "kb" && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <BookOpen className="size-4 text-[#df5033]" />
                <span>SELF-SERVICE HELP CENTER & KNOWLEDGE BASE</span>
              </span>

              <div className="relative w-full sm:w-64">
                <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-black/60 pl-9 pr-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#df5033]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredKb.map((art) => (
                <div key={art.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 hover:border-white/20 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#df5033] block">{art.category}</span>
                  <h3 className="text-sm font-bold text-white font-sans">{art.title}</h3>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-white/5 pt-2">
                    <span>{art.helpful} users found helpful</span>
                    <span>{art.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <MessageSquare className="size-4 text-[#df5033]" />
                <span>SUBMIT CRM SUPPORT REQUEST</span>
              </span>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">CATEGORY</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#df5033]"
                >
                  <option value="Technical Support">Technical Support</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Billing & Purchases">Billing & Purchases</option>
                  <option value="Account Security">Account Security</option>
                  <option value="Partnership Request">Partnership Request</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">PRIORITY</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#df5033]"
                >
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">SUBJECT</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue or inquiry..."
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#df5033]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">DESCRIPTION</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed description of your request..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#df5033]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" onClick={() => setShowCreateModal(false)} variant="outline" size="sm">
                  CANCEL
                </Button>
                <Button type="submit" disabled={submitting} variant="solidRed" size="sm" className="gap-2">
                  {submitting ? <RefreshCw className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                  <span>SUBMIT TO CRM</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
