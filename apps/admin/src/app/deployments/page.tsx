"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Cloud, 
  GitCommit, 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  Server, 
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface DeploymentItem {
  id: string;
  version: string;
  branch: string;
  commit: string;
  status: string;
  deployedBy: string;
  createdAt: string;
}

interface DomainItem {
  name: string;
  domain: string;
  port: string;
  status: string;
}

export default function DeploymentsPage() {
  const [telemetry, setTelemetry] = useState<{
    productionStatus?: string;
    activeVersion?: string;
    liveDomains?: number;
    pipelineStatus?: string;
  }>({});

  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<"pipeline" | "domains" | "health">("pipeline");

  const fetchDeployData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/deployments");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.domains)) setDomains(data.domains);
        if (Array.isArray(data.cloudDeployments)) setDeployments(data.cloudDeployments);
      }
    } catch (e) {
      console.error("Error fetching deployment data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchDeployData();
    });
    return () => { isMounted = false; };
  }, [fetchDeployData]);

  const handleTriggerDeploy = async () => {
    setDeploying(true);
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "trigger_deploy" }),
      });
      const data = await res.json();
      if (data.success) {
        setDeploySuccess(true);
        setTimeout(() => setDeploySuccess(false), 2500);
        fetchDeployData();
      }
    } catch (e) {
      console.error("Trigger deploy error", e);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                PRODUCTION DEPLOYMENT & CLOUD INFRASTRUCTURE
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                CLOUD DEPLOYMENT CONSOLE
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchDeployData} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH PIPELINE</span>
              </Button>
              <Button onClick={handleTriggerDeploy} disabled={deploying} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                {deploying ? <RefreshCw className="size-3.5 animate-spin" /> : <Cloud className="size-3.5" />}
                <span>DEPLOY TO PRODUCTION</span>
              </Button>
            </div>
          </div>

          {deploySuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" /> PRODUCTION BUILD & DEPLOYMENT PIPELINE COMPLETED CLEANLY
            </div>
          )}

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">PRODUCTION STATUS</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.productionStatus || "ONLINE"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">ACTIVE ENGINE VERSION</span>
              <span className="text-2xl font-black text-white block">{telemetry.activeVersion || "v2.5.0-ENTERPRISE"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">REGISTERED DOMAINS</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.liveDomains || 3} ACTIVE</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">CI/CD PIPELINE STATUS</span>
              <span className="text-2xl font-black text-purple-400 block">{telemetry.pipelineStatus || "HEALTHY"}</span>
            </div>
          </div>

          {/* View Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "pipeline" as const, label: "Deployments & Pipelines", icon: Cloud },
              { id: "domains" as const, label: "Domain Infrastructure", icon: Globe },
              { id: "health" as const, label: "Production Health Check", icon: Server },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border shrink-0",
                    isSelected
                      ? "bg-[#ff1e4b] text-white border-[#ff1e4b] shadow-lg shadow-[#ff1e4b]/20"
                      : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Domain Infrastructure Grid */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-4">
            <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Globe className="size-4 text-[#ff1e4b]" />
              <span>LIVE ENTERPRISE DOMAIN ROUTING TABLE</span>
            </span>

            <div className="grid gap-4 sm:grid-cols-3">
              {domains.map((dom) => (
                <div key={dom.domain} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[10px] font-bold uppercase">{dom.name}</span>
                    <ArrowUpRight className="size-3.5 text-[#ff1e4b]" />
                  </div>
                  <strong className="text-sm font-sans text-white block truncate">{dom.domain}</strong>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Port: :{dom.port}</span>
                    <span className="text-emerald-400 font-bold">{dom.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployments History Grid */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <GitCommit className="size-4 text-emerald-400" />
                <span>PRODUCTION BUILD DEPLOYMENT LOG ({deployments.length})</span>
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                Loading production deployment logs...
              </div>
            ) : (
              <div className="space-y-3">
                {deployments.map((dep) => (
                  <div key={dep.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-sans text-sm">{dep.version}</strong>
                        <span className="rounded bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white">
                          {dep.branch} ({dep.commit})
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block">Deployed by {dep.deployedBy}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 font-bold text-[10px]">
                        {dep.status}
                      </span>
                      <span className="block text-[10px] text-muted-foreground mt-0.5">
                        {new Date(dep.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
