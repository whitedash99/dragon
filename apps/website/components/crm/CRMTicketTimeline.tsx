import React from "react";
import { MessageSquare, StickyNote, User, ShieldCheck } from "lucide-react";

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
  createdAt: string;
  messages: MessageItem[];
  internalNotes: InternalNoteItem[];
}

export function CRMTicketTimeline({ ticket }: { ticket: TicketItem }) {
  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Initial Ticket Submission Card */}
      <div className="flex gap-4">
        <div className="size-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shrink-0 text-cyan-400 shadow-md">
          <User className="size-5" />
        </div>
        <div className="flex-1 bg-[#040A18]/90 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-black uppercase text-white font-heading tracking-tight">
                {ticket.customerName || "Customer"}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono font-bold uppercase">
                Customer Origin
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Threaded Message History */}
      {ticket.messages && ticket.messages.length > 0 && (
        <div className="space-y-4 pl-4 border-l-2 border-cyan-500/30 ml-5">
          {ticket.messages.map((msg) => {
            const isAdmin = msg.senderType === "ADMIN" || msg.senderType === "AGENT";
            return (
              <div key={msg.id} className="flex gap-4">
                <div
                  className={`size-9 rounded-2xl flex items-center justify-center shrink-0 border text-xs font-bold ${
                    isAdmin
                      ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/30"
                      : "bg-[#020614] border-cyan-500/30 text-cyan-400"
                  }`}
                >
                  {isAdmin ? <ShieldCheck className="size-4" /> : <MessageSquare className="size-4" />}
                </div>
                <div
                  className={`flex-1 rounded-3xl p-5 text-xs border transition-all ${
                    isAdmin
                      ? "bg-[#061430]/95 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                      : "bg-[#040A18]/90 border-cyan-500/20 text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 font-mono border-b border-white/10 pb-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-cyan-300">
                      {msg.senderName} {isAdmin && "• SUPPORT STAFF"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-sm font-sans text-slate-100">{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Internal Staff Notes */}
      {ticket.internalNotes && ticket.internalNotes.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 font-mono">
            <StickyNote className="size-4" /> STAFF INTERNAL AUDIT NOTES
          </div>
          {ticket.internalNotes.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-mono space-y-1">
              <div className="font-bold text-[11px] text-amber-300 uppercase">Author: {n.author}</div>
              <p className="text-slate-200 leading-relaxed font-sans">{n.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
