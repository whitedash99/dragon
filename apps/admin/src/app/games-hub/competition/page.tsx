"use client";

import React, { useState } from "react";
import {
  Trophy,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Search,
  Flame,
  Award,
  Clock,
  Filter,
  Download,
} from "lucide-react";
import { generateGamesLeaderboardPdf } from "@/lib/pdf-report-generator";

interface HighScoreEntry {
  rank: number;
  playerName: string;
  gamerTag: string;
  dragonId: string;
  score: number;
  lapTime: string;
  stage: string;
  verified: boolean;
  timestamp: string;
}

const INITIAL_SCORES: HighScoreEntry[] = [
  { rank: 1, playerName: "Tanish sharma", gamerTag: "whitedash99", dragonId: "DRG-4741-9415", score: 284500, lapTime: "01:14.28", stage: "Stage 5 (Singularity Void)", verified: true, timestamp: "2026-09-01 18:42" },
  { rank: 2, playerName: "Dragon Founder & CEO", gamerTag: "CEO_Prime", dragonId: "DRG-1434-1360", score: 271200, lapTime: "01:16.89", stage: "Stage 5 (Singularity Void)", verified: true, timestamp: "2026-08-31 14:15" },
  { rank: 3, playerName: "devinder sharma", gamerTag: "devwandering", dragonId: "DRG-ZDF-335-7561", score: 245000, lapTime: "01:21.04", stage: "Stage 4 (Quantum Canyon)", verified: true, timestamp: "2026-08-31 12:50" },
  { rank: 4, playerName: "Apex Pilot E2E", gamerTag: "ApexPilot", dragonId: "DRG-5169-4728", score: 210800, lapTime: "01:26.55", stage: "Stage 3 (Quantum Canyon)", verified: true, timestamp: "2026-08-30 09:12" },
  { rank: 5, playerName: "Tanish", gamerTag: "whitedash28", dragonId: "DRG-4234-7751", score: 198400, lapTime: "01:30.12", stage: "Stage 2 (Neon Rush)", verified: true, timestamp: "2026-08-29 16:30" },
];

export default function GamesCompetitionPage() {
  const [scores] = useState<HighScoreEntry[]>(INITIAL_SCORES);

  const handleExportPdf = () => {
    generateGamesLeaderboardPdf(scores);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• Global Leaderboards</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Leaderboards, High Scores & Anti-Cheat
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify high scores, lap times, player ranking tables, and anti-cheat cryptographic verification signatures.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Leaderboard PDF</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Anti-Cheat: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player / GamerTag</th>
                <th className="py-3 px-4">Dragon ID</th>
                <th className="py-3 px-4">High Score</th>
                <th className="py-3 px-4">Lap Time</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
              {scores.map((sc) => (
                <tr key={sc.rank} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {sc.rank === 1 && <span className="text-amber-400">#1 👑</span>}
                    {sc.rank === 2 && <span className="text-slate-300">#2 🥈</span>}
                    {sc.rank === 3 && <span className="text-amber-600">#3 🥉</span>}
                    {sc.rank > 3 && <span>#{sc.rank}</span>}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">
                    <div>{sc.playerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">@{sc.gamerTag}</div>
                  </td>
                  <td className="py-3.5 px-4 text-indigo-400 font-bold">
                    {sc.dragonId}
                  </td>
                  <td className="py-3.5 px-4 text-white font-bold">
                    {sc.score.toLocaleString()} PTS
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400">
                    {sc.lapTime}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {sc.stage}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
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
