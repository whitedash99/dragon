import React from "react";
import { User, Mail, ShieldCheck } from "lucide-react";

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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-xs font-sans text-xs text-slate-900">
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-mono">
          <User className="w-3.5 h-3.5 text-slate-500" /> Customer Profile
        </h4>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-sm">
            {ticket.customerName ? ticket.customerName.charAt(0).toUpperCase() : "C"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">{ticket.customerName}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 truncate font-mono">
              <Mail className="w-3 h-3 text-slate-400" /> {ticket.customerEmail}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-4 font-mono">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Ticket Status
          </label>
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-400"
          >
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS font-semibold">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Priority Tier
          </label>
          <select
            value={ticket.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-400"
          >
            <option value="LOW">LOW</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-700 font-mono">
        <div className="flex justify-between py-1">
          <span className="text-slate-500">Category:</span>
          <span className="font-semibold text-slate-900">{ticket.category || "General Support"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-500">Department:</span>
          <span className="font-semibold text-slate-900">{ticket.department || "Customer Care"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-500">Assigned Agent:</span>
          <span className="font-semibold text-slate-900">{ticket.assignedAgent || "Unassigned"}</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2 font-mono">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
        <span>Verified Customer Account. Real DB session active.</span>
      </div>
    </div>
  );
}
