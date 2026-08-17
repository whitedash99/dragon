"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Plug, CheckCircle2, RefreshCw } from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  provider: string;
  status: string;
  enabled: boolean;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && Array.isArray(data.integrations)) {
        setIntegrations(data.integrations);
      }
    } catch (e) {
      console.error("Fetch integrations error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 font-sans text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Plug className="size-3.5 text-slate-700" />
                <span>Dragon Platform Connectors & Webhooks</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Enterprise Service Integrations</h1>
            </div>

            <button
              onClick={fetchIntegrations}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-xs"
            >
              <RefreshCw className={`size-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-16 text-center text-slate-400 text-xs font-mono">
                Querying integrations status...
              </div>
            ) : (
              integrations.map((integ) => (
                <div key={integ.id} className="rounded-2xl bg-white p-6 border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-slate-900 text-sm">{integ.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${integ.enabled ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {integ.status}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs font-sans">
                    Provider: <span className="font-mono font-semibold text-slate-700">{integ.provider}</span>
                  </p>

                  <div className="pt-3 border-t border-slate-100 font-mono text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Connection:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-emerald-600" /> Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
