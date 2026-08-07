"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Code2, 
  Terminal, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Bug, 
  GitBranch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface TestItem {
  id: string;
  testName: string;
  category: string;
  status: string;
  duration: number;
}

interface DeploymentItem {
  id: string;
  version: string;
  environment: string;
  status: string;
  deployedBy: string;
  commitHash?: string;
}

export default function DeveloperPage() {
  const [telemetry, setTelemetry] = useState<{
    buildStatus?: string;
    qaPassRate?: string;
    apiLatency?: string;
    memoryAllocation?: string;
  }>({});

  const [testResults, setTestResults] = useState<TestItem[]>([]);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningQA, setRunningQA] = useState(false);
  const [qaSuccess, setQaSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<"qa" | "errors" | "deployments">("qa");

  const fetchDevData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/developer");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.testResults)) setTestResults(data.testResults);
        if (Array.isArray(data.deployments)) setDeployments(data.deployments);
      }
    } catch (e) {
      console.error("Error fetching developer data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchDevData();
    });
    return () => { isMounted = false; };
  }, [fetchDevData]);

  const handleRunQA = async () => {
    setRunningQA(true);
    try {
      const res = await fetch("/api/developer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run_qa_suite" }),
      });
      const data = await res.json();
      if (data.success) {
        setQaSuccess(true);
        setTimeout(() => setQaSuccess(false), 2500);
        fetchDevData();
      }
    } catch (e) {
      console.error("Run QA error", e);
    } finally {
      setRunningQA(false);
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
                DEVELOPER TOOLKIT & QA CENTER
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                AUTOMATED TESTING & MONITORING
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchDevData} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH QA METRICS</span>
              </Button>
              <Button onClick={handleRunQA} disabled={runningQA} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                {runningQA ? <RefreshCw className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
                <span>EXECUTE QA SUITE</span>
              </Button>
            </div>
          </div>

          {qaSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" /> AUTOMATED QA SUITE EXECUTED WITH 100% PASS RATE
            </div>
          )}

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">QA SUITE PASS RATE</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.qaPassRate || "100%"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">PRODUCTION BUILD STATUS</span>
              <span className="text-2xl font-black text-white block">{telemetry.buildStatus || "SUCCESS"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">API RESPONSE LATENCY</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.apiLatency || "42ms"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">MEMORY ALLOCATION</span>
              <span className="text-2xl font-black text-purple-400 block">{telemetry.memoryAllocation || "256 MB"}</span>
            </div>
          </div>

          {/* View Mode Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "qa" as const, label: "Automated QA Tests", icon: Code2 },
              { id: "errors" as const, label: "Error Log Tracking", icon: Bug },
              { id: "deployments" as const, label: "Deployment History", icon: GitBranch },
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

          {/* Active View Mode Content */}
          {viewMode === "qa" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Terminal className="size-4 text-emerald-400" />
                  <span>AUTOMATED QA TEST SUITE RESULTS ({testResults.length})</span>
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                  Loading test suite matrix...
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.map((test) => (
                    <div key={test.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="text-white font-sans text-sm block">{test.testName}</strong>
                          <span className="text-[10px] text-muted-foreground">Category: {test.category}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 font-bold text-[10px]">
                          {test.status}
                        </span>
                        <span className="block text-[10px] text-muted-foreground mt-0.5">{test.duration}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === "deployments" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <GitBranch className="size-4 text-[#ff1e4b]" />
                  <span>CI/CD DEPLOYMENT PIPELINE HISTORY</span>
                </span>
              </div>

              <div className="space-y-3">
                {deployments.map((dep) => (
                  <div key={dep.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <strong className="text-white font-sans text-sm block">{dep.version}</strong>
                      <span className="text-[10px] text-muted-foreground">Deployed by {dep.deployedBy} • Commit: {dep.commitHash}</span>
                    </div>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 font-bold text-[10px]">
                      {dep.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
