"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Rocket, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  Cloud, 
  Server 
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassButton, GlassBadge } from "@/components/ui/glass";

interface DeploymentItem {
  id: string;
  app: string;
  environment: string;
  status: string;
  url?: string;
  commit?: string;
  branch?: string;
  updatedAt: string;
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState<string>("Vercel");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const fetchDeployments = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/deployments");
      const data = await res.json();
      if (data.success) {
        setConnected(data.connected);
        setProvider(data.provider || "Vercel");
        setMessage(data.message || "");
        if (Array.isArray(data.deployments)) {
          setDeployments(data.deployments);
        }
      }
    } catch (e) {
      console.error("Error fetching deployments", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const handleTriggerDeploy = async () => {
    if (!confirm("Are you sure you want to trigger a manual production deployment?")) return;
    setDeploying(true);
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "production" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Deployment triggered successfully: " + (data.message || "Pipeline active"));
        fetchDeployments();
      } else {
        alert(data.error || "Deployment failed to trigger");
      }
    } catch (err) {
      alert("Error triggering deployment: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("size-2 rounded-full", connected ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" : "bg-amber-500")} />
                <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider">
                  Dragon Control • {connected ? "Production Cloud Fleet" : "Deployment Center"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Vercel Deployments & Edge Infrastructure
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Live micro-frontends, serverless API routes, and deployment pipelines.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchDeployments}
                className="p-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
                title="Refresh Deployments"
              >
                <RefreshCw className={cn("size-4", refreshing && "animate-spin text-cyan-400")} />
              </button>

              {connected && (
                <button
                  onClick={handleTriggerDeploy}
                  disabled={deploying}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs font-mono shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Rocket className={cn("size-4", deploying && "animate-spin")} />
                  <span>{deploying ? "Deploying..." : "Trigger Deployment"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Connection Status Card */}
          {!connected ? (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3 shadow-[0_0_20px_rgba(245,158,11,0.15)] font-mono">
              <AlertCircle className="size-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold block text-sm text-amber-300">Deployment Provider Not Connected</span>
                <p className="text-amber-200/80 leading-relaxed font-sans">
                  {message || "Set VERCEL_TOKEN and VERCEL_PROJECT_ID or VERCEL_DEPLOY_HOOK_URL in environment variables to enable direct deployment management and live build logs from Dragon Control."}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)] text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4.5 text-emerald-400" />
                <span className="font-bold">Provider Connected: {provider}</span>
              </div>
              <span className="text-[11px] text-emerald-300">Production Fleet Active</span>
            </div>
          )}

          {/* Live Micro-Frontends & Apps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <GlassBadge variant="published">
                    Production
                  </GlassBadge>
                  <h3 className="text-base font-bold text-white font-mono">Dragon Studios Public Website</h3>
                  <code className="text-xs font-mono text-cyan-300 block">dragongamingstudios.vercel.app</code>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
                  <CheckCircle2 className="size-4" />
                  <span>ONLINE</span>
                </div>
              </div>

              <div className="p-3 bg-[#02050E] rounded-xl border border-cyan-500/20 text-xs text-slate-300 font-mono">
                <span className="text-cyan-400/70 text-[10px] block uppercase font-bold">CANONICAL DESTINATION:</span>
                <span className="font-medium">Production Public Gaming Presentation Plane</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">Target: Vercel Edge</span>
                <a
                  href="https://dragongamingstudios.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-cyan-300 hover:text-white flex items-center gap-1"
                >
                  <span>Launch Website</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <GlassBadge variant="info">
                    Control Plane
                  </GlassBadge>
                  <h3 className="text-base font-bold text-white font-mono">Dragon Control Admin OS</h3>
                  <code className="text-xs font-mono text-cyan-300 block">localhost:4000 / Production</code>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
                  <CheckCircle2 className="size-4" />
                  <span>ACTIVE</span>
                </div>
              </div>

              <div className="p-3 bg-[#02050E] rounded-xl border border-cyan-500/20 text-xs text-slate-300 font-mono">
                <span className="text-cyan-400/70 text-[10px] block uppercase font-bold">OPERATIONAL SCOPE:</span>
                <span className="font-medium">Studio Control Plane & Content Management</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">Target: Next.js Runtime</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span>Current Active Session</span>
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Deployment History Table */}
          {deployments.length > 0 && (
            <div className="space-y-3 pt-4">
              <h2 className="text-base font-bold text-white font-mono">Deployment History & Releases</h2>
              <div className="rounded-2xl border border-cyan-500/30 bg-[#03091D]/90 overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.7)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#02050E] text-cyan-400 font-mono uppercase tracking-wider text-[10px] border-b border-cyan-500/20">
                      <tr>
                        <th className="px-4 py-3">Environment</th>
                        <th className="px-4 py-3">Application</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Release Details</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10">
                      {deployments.map((d) => (
                        <tr key={d.id} className="hover:bg-cyan-500/5">
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#02050E] text-cyan-300 border border-cyan-500/20">
                              {d.environment}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-white">{d.app}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                              <CheckCircle2 className="size-3.5" />
                              <span>{d.status}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-300">{d.commit || "Production Build"}</td>
                          <td className="px-4 py-3 text-slate-400">{d.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
