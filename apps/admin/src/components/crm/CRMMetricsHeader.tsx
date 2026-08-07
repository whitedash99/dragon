import React from "react";
import { Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <Card variant="gradient" className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Ticket className="w-16 h-16 text-purple-400" />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Total Tickets</span>
            <Badge variant="purple" size="sm">Active SLA</Badge>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{telemetry.totalTickets}</div>
          <p className="text-[11px] text-slate-400 mt-1">Cross-channel customer requests</p>
        </CardContent>
      </Card>

      <Card variant="glass" className="relative overflow-hidden group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Open Tickets</span>
            <Badge variant="cyan" size="sm">Queue</Badge>
          </div>
          <div className="text-3xl font-black text-cyan-400 tracking-tight">{telemetry.openTickets}</div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting agent response</p>
        </CardContent>
      </Card>

      <Card variant="glass" className="relative overflow-hidden group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Urgent SLA</span>
            <Badge variant="danger" size="sm">High Priority</Badge>
          </div>
          <div className="text-3xl font-black text-rose-400 tracking-tight">{telemetry.urgentTickets}</div>
          <p className="text-[11px] text-slate-400 mt-1">Requires immediate action</p>
        </CardContent>
      </Card>

      <Card variant="glass" className="relative overflow-hidden group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Avg SLA Speed</span>
            <Badge variant="success" size="sm">{telemetry.avgResponseSla}</Badge>
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight">{telemetry.resolvedTickets}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total resolved successfully</p>
        </CardContent>
      </Card>
    </div>
  );
}
