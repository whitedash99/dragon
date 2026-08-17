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
      {/* Initial Ticket Submission */}
      <div className="flex gap-4">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-900">
          <User className="w-4 h-4" />
        </div>
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{ticket.customerName}</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-semibold">
                Customer Origin
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Threaded Message History */}
      {ticket.messages && ticket.messages.length > 0 && (
        <div className="space-y-4 pl-4 border-l-2 border-slate-200 ml-4">
          {ticket.messages.map((msg) => {
            const isAdmin = msg.senderType === "ADMIN";
            return (
              <div key={msg.id} className="flex gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                    isAdmin
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                </div>
                <div
                  className={`flex-1 rounded-2xl p-4 text-xs border ${
                    isAdmin
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white border-slate-200 text-slate-800 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="font-bold text-xs">{msg.senderName}</span>
                    <span className="text-[10px] opacity-75">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Internal Staff Notes */}
      {ticket.internalNotes && ticket.internalNotes.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <StickyNote className="w-3.5 h-3.5" /> Staff Internal Audit Notes
          </div>
          {ticket.internalNotes.map((n) => (
            <div key={n.id} className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-mono">
              <div className="font-bold text-[11px] text-amber-800 mb-1">Author: {n.author}</div>
              <p>{n.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
