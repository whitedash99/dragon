import React from "react";
import { MessageSquare, StickyNote, User, ShieldCheck } from "lucide-react";
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
  createdAt: string;
  messages: MessageItem[];
  internalNotes: InternalNoteItem[];
}

export function CRMTicketTimeline({ ticket }: { ticket: TicketItem }) {
  return (
    <div className="space-y-6">
      {/* Initial Ticket Submission */}
      <div className="flex gap-4">
        <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
          <User className="w-4 h-4" />
        </div>
        <div className="flex-1 bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{ticket.customerName}</span>
              <Badge variant="cyan" size="sm">Customer Ticket Origin</Badge>
            </div>
            <span className="text-[11px] text-slate-400">
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Threaded Message History */}
      {ticket.messages && ticket.messages.length > 0 && (
        <div className="space-y-4 pl-4 border-l-2 border-purple-500/20 ml-4">
          {ticket.messages.map((msg) => {
            const isAdmin = msg.senderType === "ADMIN";
            return (
              <div key={msg.id} className="flex gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                    isAdmin
                      ? "bg-purple-600/30 border-purple-500/40 text-purple-300"
                      : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                >
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                </div>
                <div
                  className={`flex-1 rounded-2xl p-4 text-sm border ${
                    isAdmin
                      ? "bg-purple-950/30 border-purple-500/30 text-purple-100"
                      : "bg-slate-900/60 border-white/10 text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-white">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-xs leading-relaxed">{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Internal Staff Notes */}
      {ticket.internalNotes && ticket.internalNotes.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <StickyNote className="w-3.5 h-3.5" /> Staff Internal Audit Notes
          </div>
          {ticket.internalNotes.map((n) => (
            <div key={n.id} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <div className="font-semibold text-[11px] text-amber-300 mb-1">Author: {n.author}</div>
              <p>{n.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
