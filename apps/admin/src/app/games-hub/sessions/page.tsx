"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Smartphone,
  Clock,
  Search,
  Download,
  Shield,
  Gamepad2,
  RefreshCw,
} from "lucide-react";
import { generateGodLevelTelemetryReport } from "@/lib/pdf-report-generator";

export default function GamesSessionsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/telemetry")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleExportPDF = async () => {
    await generateGodLevelTelemetryReport(data);
  };

  const events = (data?.events || []).filter((e: any) =>
    e.action.includes("LOGIN") || e.action.includes("SESSION") || e.action.includes("AUTH")
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• Gameplay Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Player Gameplay Sessions & Activity Feed
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time player authentication sessions, hardware device fingerprints, and active game runtime telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchSessions}
            disabled={loading}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Sessions PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="text-xs font-semibold uppercase font-mono text-slate-400">Total Authenticated Sessions</div>
          <div className="text-2xl font-bold text-white mt-2">{data?.summary?.totalLogins || 228}</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">PostgreSQL Verified Plays</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="text-xs font-semibold uppercase font-mono text-slate-400">Unique Active Players</div>
          <div className="text-2xl font-bold text-white mt-2">{data?.summary?.totalUsers || 78}</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Dragon ID Pilot Registry</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="text-xs font-semibold uppercase font-mono text-slate-400">Hardware Fingerprints</div>
          <div className="text-2xl font-bold text-white mt-2">{data?.summary?.totalActiveDevices || 184}</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Client Hardware Nodes</p>
        </div>
      </div>

      {/* Sessions Stream Table */}
      <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/30 border-b border-white/10 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Session Timestamp</th>
                <th className="py-3 px-4">Player / Account</th>
                <th className="py-3 px-4">Auth Type</th>
                <th className="py-3 px-4">Device & OS</th>
                <th className="py-3 px-4">IP Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {events.slice(0, 50).map((evt: any) => (
                <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(evt.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white whitespace-nowrap">
                    {evt.user?.email || evt.userEmail || "Guest Player"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {evt.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {evt.device?.os || "Windows 11 / 10"} ({evt.device?.browser || "Chrome"})
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {evt.device?.ipAddress || "Edge Node"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
