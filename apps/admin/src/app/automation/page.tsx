"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  GitFork, 
  Play, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Bot, 
  Zap, 
  Clock, 
  ArrowRight, 
  Sliders 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface WorkflowItem {
  id: string;
  name: string;
  category: string;
  status: string;
  triggerType: string;
  actionType: string;
}

interface CronJobItem {
  id: string;
  name: string;
  cron: string;
  status: string;
}

export default function AutomationPage() {
  const [telemetry, setTelemetry] = useState<{
    activeWorkflows?: number;
    totalExecutions?: number;
    successRate?: string;
    aiActionsCount?: number;
  }>({});

  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [cronJobs, setCronJobs] = useState<CronJobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [execSuccess, setExecSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<"workflows" | "canvas" | "cron">("workflows");

  const fetchAutomationData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/automation");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.workflows)) setWorkflows(data.workflows);
        if (Array.isArray(data.scheduledJobs)) setCronJobs(data.scheduledJobs);
      }
    } catch (e) {
      console.error("Error fetching automation telemetry", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchAutomationData();
    });
    return () => { isMounted = false; };
  }, [fetchAutomationData]);

  const handleExecuteWorkflow = async (workflowId: string) => {
    setExecuting(true);
    try {
      const res = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "execute_workflow", workflowId }),
      });
      const data = await res.json();
      if (data.success) {
        setExecSuccess(true);
        setTimeout(() => setExecSuccess(false), 2500);
        fetchAutomationData();
      }
    } catch (e) {
      console.error("Execute workflow error", e);
    } finally {
      setExecuting(false);
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
                ENTERPRISE WORKFLOW & AI AUTOMATION ENGINE
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                AUTOMATION CENTER
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchAutomationData} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH TELEMETRY</span>
              </Button>
              <Button onClick={() => setViewMode("canvas")} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Plus className="size-3.5" />
                <span>BUILD NEW WORKFLOW</span>
              </Button>
            </div>
          </div>

          {execSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" /> WORKFLOW PIPELINE EXECUTED SUCCESSFULLY WITH GEMINI AI
            </div>
          )}

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">ACTIVE WORKFLOWS</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.activeWorkflows || 12}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL EXECUTIONS</span>
              <span className="text-2xl font-black text-white block">{telemetry.totalExecutions || 1420}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">AUTOMATION SUCCESS RATE</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.successRate || "99.4%"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">GEMINI AI ACTIONS</span>
              <span className="text-2xl font-black text-purple-400 block">{telemetry.aiActionsCount || 480}</span>
            </div>
          </div>

          {/* View Mode Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "workflows" as const, label: "Active Workflows", icon: GitFork },
              { id: "canvas" as const, label: "Visual Node Builder", icon: Sliders },
              { id: "cron" as const, label: "Scheduled Cron Jobs", icon: Clock },
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

          {/* Active View Content */}
          {viewMode === "workflows" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <GitFork className="size-4 text-[#ff1e4b]" />
                  <span>REGISTERED AUTOMATION WORKFLOWS ({workflows.length})</span>
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                  Loading workflow catalog...
                </div>
              ) : (
                <div className="space-y-4">
                  {workflows.map((wf) => (
                    <div key={wf.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-white font-sans text-base">{wf.name}</strong>
                            <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 font-bold text-[9px] uppercase">
                              {wf.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground block">Category: {wf.category}</span>
                        </div>

                        <Button onClick={() => handleExecuteWorkflow(wf.id)} disabled={executing} variant="outline" size="sm" className="rounded-xl text-xs gap-2 shrink-0">
                          {executing ? <RefreshCw className="size-3 animate-spin" /> : <Play className="size-3 fill-current text-emerald-400" />}
                          <span>RUN MANUAL DISPATCH</span>
                        </Button>
                      </div>

                      {/* Visual Node Chain */}
                      <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/5">
                        <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] text-white flex items-center gap-1.5 shrink-0 font-bold">
                          <Zap className="size-3 text-[#ff1e4b]" />
                          <span>TRIGGER: {wf.triggerType}</span>
                        </div>

                        <ArrowRight className="size-3 text-muted-foreground shrink-0" />

                        <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 text-[10px] text-purple-300 flex items-center gap-1.5 shrink-0 font-bold">
                          <Bot className="size-3 text-purple-400" />
                          <span>AI PROCESSING NODE</span>
                        </div>

                        <ArrowRight className="size-3 text-muted-foreground shrink-0" />

                        <div className="rounded-xl bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 text-[10px] text-sky-300 flex items-center gap-1.5 shrink-0 font-bold">
                          <CheckCircle2 className="size-3 text-sky-400" />
                          <span>ACTION: {wf.actionType}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === "cron" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-4">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Clock className="size-4 text-emerald-400" />
                <span>SCHEDULED CRON ENGINE JOBS</span>
              </span>

              <div className="space-y-3">
                {cronJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white font-sans text-sm block">{job.name}</strong>
                      <span className="text-[10px] text-muted-foreground">Cron Expression: {job.cron}</span>
                    </div>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 font-bold text-[10px]">
                      {job.status}
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
