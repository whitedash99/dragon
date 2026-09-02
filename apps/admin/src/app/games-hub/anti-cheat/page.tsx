"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Search,
  CheckCircle2,
  RefreshCw,
  Download,
} from "lucide-react";

interface AntiCheatLog {
  id: string;
  dragonId: string;
  playerName: string;
  game: string;
  action: string;
  status: "VERIFIED" | "FLAGGED" | "CLEARED";
  hash: string;
  timestamp: string;
}

const INITIAL_LOGS: AntiCheatLog[] = [
  { id: "1", dragonId: "DRG-4741-9415", playerName: "Tanish sharma", game: "Uncharted Drive", action: "Lap 5 Velocity Validation", status: "VERIFIED", hash: "sha256:7f9a1b2c3d...", timestamp: "2026-09-01 18:42" },
  { id: "2", dragonId: "DRG-1434-1360", playerName: "Dragon Founder & CEO", game: "Uncharted Drive", action: "Score Packet Signature Check", status: "VERIFIED", hash: "sha256:8b4c2e1a9f...", timestamp: "2026-08-31 14:15" },
  { id: "3", dragonId: "DRG-ZDF-335-7561", playerName: "devinder sharma", game: "Uncharted Drive", action: "Hardware Clock Synchronization", status: "VERIFIED", hash: "sha256:1a2b3c4d5e...", timestamp: "2026-08-31 12:50" },
  { id: "4", dragonId: "DRG-5169-4728", playerName: "Apex Pilot E2E", game: "Uncharted Drive", action: "Physics Delta Bound Verification", status: "VERIFIED", hash: "sha256:3c4d5e6f7a...", timestamp: "2026-08-30 09:12" },
];

export default function GamesAntiCheatPage() {
  const [logs] = useState<AntiCheatLog[]>(INITIAL_LOGS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• Anti-Cheat Security</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Anti-Cheat & Cryptographic Verification
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time physics delta checks, packet HMAC signatures, score validity guards, and suspicious activity logs.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Kernel & Packet Guard: ACTIVE</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="text-xs font-semibold uppercase font-mono text-slate-400">Score Packet Integrity</div>
          <div className="text-xl font-bold text-emerald-400 mt-2">100% VERIFIED</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Zero Signature Mismatches</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="text-xs font-semibold uppercase font-mono text-slate-400">Physics Speed Clamping</div>
          <div className="text-xl font-bold text-white mt-2">ENFORCED</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Max 400 KM/H Limit Validated</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="text-xs font-semibold uppercase font-mono text-slate-400">Flagged Anomalies</div>
          <div className="text-xl font-bold text-white mt-2">0 FLAGGED</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Clean Competitive Roster</p>
        </div>
      </div>

      {/* Verification Logs Table */}
      <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/30 border-b border-white/10 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Player / Account</th>
                <th className="py-3 px-4">Dragon ID</th>
                <th className="py-3 px-4">Security Check</th>
                <th className="py-3 px-4">HMAC Signature</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{l.timestamp}</td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">{l.playerName}</td>
                  <td className="py-3.5 px-4 text-indigo-400 font-bold">{l.dragonId}</td>
                  <td className="py-3.5 px-4 text-slate-200">{l.action}</td>
                  <td className="py-3.5 px-4 text-slate-500">{l.hash}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{l.status}</span>
                    </span>
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
