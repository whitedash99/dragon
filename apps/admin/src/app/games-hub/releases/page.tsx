"use client";

import React, { useState } from "react";
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Plus,
  Upload,
  Server,
  Sparkles,
  Download,
} from "lucide-react";

interface GameRelease {
  id: string;
  game: string;
  version: string;
  channel: "PRODUCTION" | "STAGING" | "NIGHTLY";
  status: "ACTIVE" | "ARCHIVED" | "ROLLED_BACK";
  buildHash: string;
  releasedAt: string;
  notes: string;
}

const INITIAL_RELEASES: GameRelease[] = [
  {
    id: "1",
    game: "Uncharted Drive: Beyond",
    version: "v1.0.4",
    channel: "PRODUCTION",
    status: "ACTIVE",
    buildHash: "sha256:7f9a1b2c3d4e5f...",
    releasedAt: "2026-09-01 19:30",
    notes: "Official AAA public release. Ray-tracing pipeline optimizations and mobile touch controller updates.",
  },
  {
    id: "2",
    game: "Uncharted Drive: Beyond",
    version: "v1.0.3",
    channel: "PRODUCTION",
    status: "ARCHIVED",
    buildHash: "sha256:8b4c2e1a9f0d3e...",
    releasedAt: "2026-08-28 14:00",
    notes: "Stage 5 event horizon stability and anti-cheat packet verification engine.",
  },
  {
    id: "3",
    game: "Uncharted Drive: Beyond",
    version: "v1.0.2",
    channel: "STAGING",
    status: "ARCHIVED",
    buildHash: "sha256:1a2b3c4d5e6f7a...",
    releasedAt: "2026-08-24 11:20",
    notes: "Initial closed beta build with WebGPU rendering fallback.",
  },
];

export default function GamesReleasesPage() {
  const [releases, setReleases] = useState<GameRelease[]>(INITIAL_RELEASES);
  const [rollingBack, setRollingBack] = useState<string | null>(null);

  const handleRollback = (id: string, version: string) => {
    if (confirm(`Are you sure you want to rollback to build ${version}? This requires executive approval.`)) {
      setRollingBack(id);
      setTimeout(() => {
        setRollingBack(null);
        alert(`Build ${version} staged for production rollback.`);
      }, 1500);
    }
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
            <span className="text-xs text-slate-400 font-mono">• Releases & Deployments</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Game Version Deployments & Rollbacks
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage builds, inspect deployment status, manage release notes, and execute safe 1-click rollbacks.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 w-fit">
          <Upload className="w-3.5 h-3.5" />
          <span>Stage New Game Build</span>
        </button>
      </div>

      {/* Releases List */}
      <div className="space-y-4">
        {releases.map((rel) => (
          <div
            key={rel.id}
            className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-white/20 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white">{rel.version}</h3>
                <span className="text-xs text-indigo-400 font-mono">{rel.game}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {rel.channel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {rel.status === "ACTIVE" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ACTIVE IN PRODUCTION</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleRollback(rel.id, rel.version)}
                    disabled={rollingBack === rel.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${rollingBack === rel.id ? "animate-spin" : ""}`} />
                    <span>Rollback To This Build</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400">{rel.notes}</p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-500">
              <span>SHA-256: {rel.buildHash}</span>
              <span>Released: {rel.releasedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
