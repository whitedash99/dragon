"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Download,
  KeyRound,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
} from "lucide-react";
import { generateGodLevelTelemetryReport } from "@/lib/pdf-report-generator";

export default function GamesPlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPlayers = () => {
    setLoading(true);
    fetch("/api/telemetry")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.players) {
          setPlayers(data.players);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleExportPDF = async () => {
    await generateGodLevelTelemetryReport({ players });
  };

  const filtered = players.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.dragonId && p.dragonId.toLowerCase().includes(q)) ||
      (p.gamerTag && p.gamerTag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• Player Network</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Registered Player Directory & Dragon IDs
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete database roster of all {players.length} registered players, Dragon ID callsigns, hardware devices, and login counts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPlayers}
            disabled={loading}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Refresh Player Roster"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Player Roster PDF</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, Dragon ID, GamerTag..."
          className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Players Table */}
      <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Player & Email</th>
                <th className="py-3 px-4">Dragon ID Callsign</th>
                <th className="py-3 px-4">GamerTag</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Logins</th>
                <th className="py-3 px-4">Primary Device</th>
                <th className="py-3 px-4">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
              {filtered.map((player) => (
                <tr key={player.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-sans font-medium text-white">{player.name || "Player"}</div>
                    <div className="text-[11px] text-slate-400">{player.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-400">
                    {player.dragonId || "PENDING"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    @{player.gamerTag || player.name || "Pilot"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-slate-300">
                      {player.role || "PLAYER"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    {player.loginCount || 1}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {player.devices?.[0]?.os || "Windows 11 / 10"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {player.createdAt ? new Date(player.createdAt).toLocaleDateString() : "2026-08-09"}
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
