import React from "react";
import { Ticket } from "lucide-react";

interface TelemetryProps {
  totalTickets: number;
  openTickets: number;
  urgentTickets: number;
  resolvedTickets: number;
  avgResponseSla: string;
}

export function CRMMetricsHeader({ telemetry }: { telemetry: TelemetryProps }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-[#040A18] border border-purple-500/30 rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Ticket className="w-16 h-16 text-purple-400" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">Total Tickets</span>
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">Active SLA</span>
        </div>
        <div className="text-3xl font-black text-white tracking-tight">{telemetry.totalTickets}</div>
        <p className="text-[11px] text-slate-400 mt-1">Cross-channel customer requests</p>
      </div>

      <div className="bg-[#040A18] border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">Open Tickets</span>
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Queue</span>
        </div>
        <div className="text-3xl font-black text-cyan-400 tracking-tight">{telemetry.openTickets}</div>
        <p className="text-[11px] text-slate-400 mt-1">Awaiting agent response</p>
      </div>

      <div className="bg-[#040A18] border border-rose-500/30 rounded-2xl p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">Urgent SLA</span>
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">High Priority</span>
        </div>
        <div className="text-3xl font-black text-rose-400 tracking-tight">{telemetry.urgentTickets}</div>
        <p className="text-[11px] text-slate-400 mt-1">Requires immediate action</p>
      </div>

      <div className="bg-[#040A18] border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">Avg SLA Speed</span>
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">{telemetry.avgResponseSla}</span>
        </div>
        <div className="text-3xl font-black text-emerald-400 tracking-tight">{telemetry.resolvedTickets}</div>
        <p className="text-[11px] text-slate-400 mt-1">Total resolved successfully</p>
      </div>
    </div>
  );
}
