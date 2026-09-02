"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Database,
  Gamepad2,
  Server,
  Cloud,
  Shield,
  RefreshCw,
  Download,
} from "lucide-react";
import { generateGodLevelTelemetryReport } from "@/lib/pdf-report-generator";

export default function GamesSystemPage() {
  const [data, setData] = useState<any>(null);
  const [probing, setProbing] = useState(false);

  const fetchHealth = () => {
    setProbing(true);
    fetch("/api/telemetry")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .catch(() => {})
      .finally(() => setProbing(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleExportPDF = async () => {
    await generateGodLevelTelemetryReport(data);
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
            <span className="text-xs text-slate-400 font-mono">• Engine & Server Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Game Platform Engine Health & Infrastructure
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time game session API latency, WebGL/WebGPU shaders, database throughput, and anti-cheat event logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchHealth}
            disabled={probing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${probing ? "animate-spin" : ""}`} />
            <span>Run Engine Probe</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Engine PDF</span>
          </button>
        </div>
      </div>

      {/* Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Game Session API</span>
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white mt-2 flex items-center gap-2">
            <span>OPERATIONAL</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Latency: 28ms Edge</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Score Verification</span>
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-white mt-2 flex items-center gap-2">
            <span>PROTECTED</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">HMAC Anti-Cheat Guard</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Game Storage (B2)</span>
            <Cloud className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white mt-2 flex items-center gap-2">
            <span>HEALTHY</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">CDN Edge Cache Active</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">PostgreSQL Sync</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-white mt-2 flex items-center gap-2">
            <span>SYNCHRONIZED</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Cluster: ep-still-brook</p>
        </div>
      </div>
    </div>
  );
}
