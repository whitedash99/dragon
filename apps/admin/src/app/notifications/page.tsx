"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Bell, 
  Send, 
  CheckCheck, 
  RefreshCw, 
  Info, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  recipient: string;
  isRead: boolean;
  channel: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [telemetry, setTelemetry] = useState({
    totalNotifications: 0,
    unreadNotifications: 0,
    sentToday: 142,
    deliverySuccessRate: "99.4%",
  });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All");

  // Broadcast Modal Drawer State
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formType, setFormType] = useState("INFO");
  const [formRecipient, setFormRecipient] = useState("All Staff");
  const [formChannel, setFormChannel] = useState("IN_APP");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        if (data.telemetry) setTelemetry(data.telemetry);
      }
    } catch (e) {
      console.error("Error fetching notifications", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchNotifications();
    });
    return () => { isMounted = false; };
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
      fetchNotifications();
    } catch (e) {
      console.error("Mark all read error", e);
    }
  };

  const handleDispatchNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          message: formMessage.trim(),
          type: formType,
          recipient: formRecipient.trim(),
          channel: formChannel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setFormTitle("");
        setFormMessage("");
        fetchNotifications();
      }
    } catch (err) {
      console.error("Dispatch notification error", err);
    } finally {
      setSending(false);
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case "CRITICAL": return <AlertOctagon className="size-4 text-[#ff1e4b]" />;
      case "WARNING": return <AlertTriangle className="size-4 text-amber-400" />;
      case "SUCCESS": return <CheckCircle2 className="size-4 text-emerald-400" />;
      default: return <Info className="size-4 text-sky-400" />;
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
                COMMUNICATION PLATFORM
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                NOTIFICATION DISPATCH CENTER
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleMarkAllRead} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <CheckCheck className="size-3.5 text-emerald-400" />
                <span>MARK ALL READ</span>
              </Button>
              <Button onClick={() => setModalOpen(true)} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Send className="size-3.5" />
                <span>BROADCAST DISPATCH</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Cards Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL NOTIFICATIONS</span>
              <span className="text-2xl font-black text-white block">{telemetry.totalNotifications}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">UNREAD NOTIFICATIONS</span>
              <span className="text-2xl font-black text-[#ff1e4b] block">{telemetry.unreadNotifications}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">DISPATCHED TODAY</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.sentToday}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">DELIVERY SUCCESS RATE</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.deliverySuccessRate}</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {["All", "INFO", "SUCCESS", "WARNING", "CRITICAL"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border shrink-0",
                  typeFilter === type ? "bg-[#ff1e4b] text-white border-[#ff1e4b]" : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Broadcast Drawer Modal */}
          {modalOpen && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-[#ff1e4b]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-[#ff1e4b] flex items-center gap-2">
                  <Send className="size-4" />
                  <span>BROADCAST ENTERPRISE NOTIFICATION</span>
                </span>
                <button onClick={() => setModalOpen(false)} className="text-xs text-muted-foreground hover:text-white">
                  CANCEL
                </button>
              </div>

              <form onSubmit={handleDispatchNotification} className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-6 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">NOTIFICATION TITLE</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Engine Update v5.4 Released"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">SEVERITY TYPE</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  >
                    <option value="INFO">INFO</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">CHANNEL</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  >
                    <option value="IN_APP">IN_APP</option>
                    <option value="EMAIL">EMAIL</option>
                    <option value="DISCORD">DISCORD</option>
                    <option value="SLACK">SLACK</option>
                  </select>
                </div>

                <div className="sm:col-span-12 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">RECIPIENTS</label>
                  <input
                    type="text"
                    value={formRecipient}
                    onChange={(e) => setFormRecipient(e.target.value)}
                    placeholder="All Staff or Engineering Team"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-12 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">MESSAGE CONTENT</label>
                  <textarea
                    rows={3}
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full rounded-xl bg-black/60 p-3 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-12 flex justify-end">
                  <Button type="submit" disabled={sending} variant="solidRed" size="md" className="gap-2">
                    {sending ? <RefreshCw className="size-4 animate-spin" /> : <Check className="size-4" />}
                    <span>DISPATCH NOTIFICATION BROADCAST</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Inbox Feed */}
          <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <Bell className="size-4 text-[#ff1e4b]" />
                <span>INBOX FEED ({notifications.length})</span>
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                Loading PostgreSQL notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                No notifications in inbox.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications
                  .filter((n) => typeFilter === "All" || n.type === typeFilter)
                  .map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex items-start justify-between gap-4",
                        n.isRead ? "bg-black/30 border-white/5 text-muted-foreground" : "bg-black/60 border-white/15 text-white"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">{getBadgeIcon(n.type)}</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-sans text-white">{n.title}</strong>
                            <span className="rounded bg-white/10 px-2 py-0.5 font-bold text-[9px] uppercase text-white">
                              {n.channel}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-muted-foreground block pt-1">Target: {n.recipient}</span>
                        </div>
                      </div>

                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
