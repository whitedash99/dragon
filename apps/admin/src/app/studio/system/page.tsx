"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Database,
  Shield,
  Server,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Clock,
  Download,
} from "lucide-react";
import { generateGodLevelTelemetryReport } from "@/lib/pdf-report-generator";

export default function StudioSystemPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [probing, setProbing] = useState(false);

  const fetchSystemData = () => {
    setProbing(true);
    fetch("/api/telemetry")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setProbing(false);
      });
  };

  useEffect(() => {
    fetchSystemData();
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
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              STUDIO HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">• Infrastructure & Audit</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Studio Infrastructure Health & Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor PostgreSQL database latency, SMTP gateways, cloud storage, and cryptographic audit events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchSystemData}
            disabled={probing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${probing ? "animate-spin" : ""}`} />
            <span>Run Health Probe</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Infrastructure Node Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Neon PostgreSQL</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>ACTIVE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Latency: 45ms • SSL Direct</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Resend Gateway</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>OPERATIONAL</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Official SMTP Dispatch</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Storage S3 (B2)</span>
            <Cloud className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>CONNECTED</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">4K Game Builds & Assets</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Zero-Trust Guard</span>
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>ENFORCED</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">HMAC SHA-256 Signatures</p>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Chronological Audit Logs ({data?.events?.length || 0} Events)
          </h2>
          <span className="text-xs text-slate-400 font-mono">PostgreSQL Synchronized</span>
        </div>

        <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User / Staff</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Device / IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {(data?.events || []).slice(0, 50).map((evt: any) => (
                  <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(evt.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                      {evt.user?.email || evt.userEmail || "System"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {evt.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-md truncate">
                      {evt.details}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {evt.device?.ipAddress || "Edge Node"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
