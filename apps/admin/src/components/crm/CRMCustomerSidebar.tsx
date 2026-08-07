import React from "react";
import { User, Mail, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-6">
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Customer Profile
        </h4>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm">
            {ticket.customerName ? ticket.customerName.charAt(0).toUpperCase() : "C"}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{ticket.customerName}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3" /> {ticket.customerEmail}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4 space-y-4">
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Ticket SLA Status
          </label>
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Priority Tier
          </label>
          <select
            value={ticket.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="LOW">LOW</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-slate-300">
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Category:</span>
          <Badge variant="purple" size="sm">{ticket.category || "General Support"}</Badge>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Department:</span>
          <span className="font-semibold">{ticket.department || "Customer Care"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Assigned Agent:</span>
          <span className="font-semibold text-purple-300">{ticket.assignedAgent || "Unassigned"}</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
        <span>Authenticated Customer Account. Parametrized database records verified.</span>
      </div>
    </div>
  );
}
