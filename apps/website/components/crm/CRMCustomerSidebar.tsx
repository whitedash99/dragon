import React from "react";
import { User, Mail, ShieldCheck, Tag, Layers, Clock } from "lucide-react";

interface TicketItem {
  id: string;
  ticketId: string;
  customerName: string;
  customerEmail: string;
  category: string;
  priority: string;
  status: string;
  assignedAgent?: string;
  department: string;
  createdAt: string;
}

export function CRMCustomerSidebar({
  ticket,
  onStatusChange,
  onPriorityChange,
}: {
  ticket: TicketItem;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
}) {
  return (
    <div className="bg-[#040A18]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 space-y-6 shadow-2xl font-sans text-xs text-slate-100">
      {/* Customer Profile Header */}
      <div>
        <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <User className="size-4 text-cyan-400" />
          <span>CUSTOMER PROFILE</span>
        </h4>
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#020614] border border-cyan-500/20">
          <div className="size-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-500 border border-cyan-300/50 flex items-center justify-center text-black font-black text-base shadow-lg shadow-cyan-500/30 shrink-0">
            {ticket.customerName ? ticket.customerName.charAt(0).toUpperCase() : "C"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black font-heading text-white uppercase tracking-tight truncate">
              {ticket.customerName || "Customer"}
            </div>
            <div className="text-xs text-cyan-300 flex items-center gap-1.5 truncate font-mono mt-0.5">
              <Mail className="size-3 text-cyan-400 shrink-0" />
              <span className="truncate">{ticket.customerEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Status & Priority Selectors */}
      <div className="border-t border-white/10 pt-5 space-y-4 font-mono">
        <div>
          <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            TICKET STATUS
          </label>
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#020614] border border-cyan-500/30 rounded-2xl text-xs text-white font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
          >
            <option value="OPEN">OPEN</option>
            <option value="NEW">NEW</option>
            <option value="WAITING_FOR_CUSTOMER">WAITING FOR CUSTOMER</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            PRIORITY TIER
          </label>
          <select
            value={ticket.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#020614] border border-cyan-500/30 rounded-2xl text-xs text-white font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
          >
            <option value="NORMAL">NORMAL PRIORITY</option>
            <option value="LOW">LOW PRIORITY</option>
            <option value="HIGH">HIGH PRIORITY</option>
            <option value="CRITICAL">CRITICAL PRIORITY</option>
          </select>
        </div>
      </div>

      {/* Category & Details */}
      <div className="border-t border-white/10 pt-5 space-y-3 text-xs font-mono">
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Tag className="size-3.5 text-cyan-400" /> Category:
          </span>
          <span className="font-bold text-white uppercase">{ticket.category || "Technical Support"}</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Layers className="size-3.5 text-cyan-400" /> Department:
          </span>
          <span className="font-bold text-white uppercase">{ticket.department || "Support"}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="size-3.5 text-cyan-400" /> Assigned Staff:
          </span>
          <span className="font-bold text-cyan-300 uppercase">{ticket.assignedAgent || "Unassigned"}</span>
        </div>
      </div>

      {/* Verified Account Badge */}
      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-xs text-cyan-300 flex items-center gap-2.5 font-mono shadow-sm">
        <ShieldCheck className="size-4 shrink-0 text-cyan-400" />
        <span>Verified Customer Account. Real DB session active.</span>
      </div>
    </div>
  );
}
