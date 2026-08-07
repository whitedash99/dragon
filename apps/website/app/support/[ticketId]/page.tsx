"use client";

import React, { useEffect, useState, useCallback, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Send, 
  MessageSquare, 
  RefreshCw, 
  XCircle, 
  AlertCircle 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface MessageItem {
  id: string;
  sender: "CUSTOMER" | "ADMIN";
  senderName: string;
  message: string;
  createdAt: string;
}

interface TicketData {
  ticketId: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  createdAt: string;
  verifiedAt?: string;
  estimatedResponse: string;
  messages: MessageItem[];
}

function TicketTrackerContent({ ticketId }: { ticketId: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    try {
      const url = token ? `/api/support/${ticketId}?token=${token}` : `/api/support/${ticketId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTicket(data.ticket);
      } else {
        setError(data.error || "Ticket not found.");
      }
    } catch {
      setError("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  }, [ticketId, token]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchTicket();
    });
    return () => { isMounted = false; };
  }, [fetchTicket]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !ticket) return;
    setSending(true);

    try {
      const res = await fetch(`/api/support/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "CUSTOMER",
          senderName: ticket.name,
          message: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyText("");
        fetchTicket();
      }
    } catch (err) {
      console.error("Reply error", err);
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!confirm("Are you sure you want to mark this support ticket as resolved/closed?")) return;
    try {
      const res = await fetch(`/api/support/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "close" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTicket();
      }
    } catch (err) {
      console.error("Close ticket error", err);
    }
  };

  if (loading) {
    return (
      <div className="container-site py-32 max-w-3xl mx-auto text-center">
        <div className="rounded-3xl glass-heavy p-12 border border-white/15">
          <RefreshCw className="size-10 animate-spin text-dragon-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold uppercase text-white">Loading Ticket Specifications...</h1>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container-site py-32 max-w-3xl mx-auto text-center">
        <div className="rounded-3xl glass-heavy p-12 border border-red-500/30">
          <AlertCircle className="size-10 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase text-white">Ticket Not Found</h1>
          <p className="mt-2 text-xs text-muted-foreground">{error || "No support ticket matches the reference ID."}</p>
          <div className="mt-6">
            <Button variant="glow" size="sm" asChild>
              <Link href="/contact">Submit Inquiry</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site relative z-10 py-32 max-w-4xl mx-auto space-y-8">
      {/* ═══ Header Bar ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-dragon-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-dragon-300 border border-dragon-500/30">
              {ticket.ticketId}
            </span>
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
              ticket.status === "CLOSED" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            )}>
              STATUS: {ticket.status}
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">{ticket.subject}</h1>
        </div>

        {ticket.status !== "CLOSED" && (
          <Button
            onClick={handleCloseTicket}
            variant="ghost"
            size="sm"
            className="rounded-full text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border border-white/10"
          >
            <XCircle className="size-4" />
            <span>Close Ticket</span>
          </Button>
        )}
      </div>

      {/* ═══ Ticket Summary Grid ═══ */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl glass-md p-5 border border-white/10">
          <span className="text-[10px] font-mono text-muted-foreground uppercase block">Inquiry Category</span>
          <span className="text-sm font-bold text-white block mt-1">{ticket.category}</span>
        </div>
        <div className="rounded-2xl glass-md p-5 border border-white/10">
          <span className="text-[10px] font-mono text-muted-foreground uppercase block">Priority Level</span>
          <span className="text-sm font-bold text-dragon-400 block mt-1">{ticket.priority}</span>
        </div>
        <div className="rounded-2xl glass-md p-5 border border-white/10">
          <span className="text-[10px] font-mono text-muted-foreground uppercase block">Target SLA Response</span>
          <span className="text-sm font-bold text-emerald-400 font-mono block mt-1">{ticket.estimatedResponse}</span>
        </div>
      </div>

      {/* ═══ Original Message Box ═══ */}
      <div className="rounded-3xl glass-heavy p-6 sm:p-8 border border-white/15 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-dragon-500/20 text-dragon-300 font-bold flex items-center justify-center border border-dragon-500/30">
              {ticket.name[0]}
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{ticket.name}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{ticket.email}</span>
            </div>
          </div>

          <span className="text-[11px] font-mono text-muted-foreground">
            {new Date(ticket.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs text-white/90 leading-relaxed whitespace-pre-wrap">
          {ticket.message}
        </div>
      </div>

      {/* ═══ Messages Thread ═══ */}
      {ticket.messages && ticket.messages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black uppercase text-white tracking-wider flex items-center gap-2">
            <MessageSquare className="size-4 text-dragon-400" />
            <span>Conversation Thread</span>
          </h2>

          {ticket.messages.map((msg) => {
            const isAdmin = msg.sender === "ADMIN";
            return (
              <div
                key={msg.id}
                className={cn(
                  "rounded-2xl p-6 border transition-all space-y-2",
                  isAdmin
                    ? "glass-heavy border-dragon-500/30 bg-dragon-950/20 ml-6"
                    : "glass-md border-white/10 mr-6"
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={cn("font-bold uppercase tracking-wider font-mono", isAdmin ? "text-dragon-300" : "text-white")}>
                    {isAdmin ? "🛡️ Dragon Studios Operations" : msg.senderName}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs font-mono text-white/90 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ Reply Input Form ═══ */}
      {ticket.status !== "CLOSED" ? (
        <form onSubmit={handleSendReply} className="rounded-3xl glass-heavy p-6 border border-white/15 space-y-4">
          <h3 className="text-sm font-bold uppercase text-white tracking-wider">
            Submit Follow-up Reply
          </h3>
          <textarea
            rows={4}
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your response to Dragon Studios operations team..."
            className="w-full rounded-2xl bg-black/60 p-4 text-xs font-mono text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400 resize-y"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-muted-foreground font-mono">
              🔒 No account required • Secure tracking ID
            </span>
            <Button type="submit" disabled={sending} variant="glow" size="sm" className="rounded-full gap-2 text-xs">
              {sending ? "Sending..." : "Send Reply"}
              <Send className="size-3.5" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl glass-sm p-6 border border-white/10 text-center text-xs text-muted-foreground font-mono">
          This ticket has been marked as resolved and closed.
        </div>
      )}
    </div>
  );
}

export default function TicketTrackerPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const resolvedParams = use(params);

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <Suspense fallback={<div className="text-center py-32 text-white">Loading...</div>}>
        <TicketTrackerContent ticketId={resolvedParams.ticketId} />
      </Suspense>
      <Footer />
    </SceneBackground>
  );
}
