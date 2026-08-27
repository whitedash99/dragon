"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Plug, CheckCircle2, RefreshCw } from "lucide-react";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";

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
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400/80 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Plug className="size-3.5 text-cyan-400" />
                <span>Dragon Platform Connectors & Webhooks</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Enterprise Service Integrations</h1>
            </div>

            <button
              onClick={fetchIntegrations}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <RefreshCw className={`size-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-16 text-center text-slate-500 text-xs font-mono">
                Querying integrations status...
              </div>
            ) : (
              integrations.map((integ) => (
                <GlassCard key={integ.id} className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-white text-sm">{integ.name}</span>
                    <GlassBadge variant={integ.enabled ? "published" : "draft"}>
                      {integ.status}
                    </GlassBadge>
                  </div>

                  <p className="text-slate-400 text-xs font-mono">
                    Provider: <span className="text-cyan-300 font-semibold">{integ.provider}</span>
                  </p>

                  <div className="pt-3 border-t border-cyan-500/20 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Connection:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-emerald-400" /> Active
                    </span>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
