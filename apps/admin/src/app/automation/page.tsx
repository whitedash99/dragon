"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Cpu, 
  Workflow, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Plus, 
  RefreshCw 
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassButton, GlassBadge, GlassStat } from "@/components/ui/glass";

export default function AutomationPage() {
  const [workflows] = useState([
    {
      id: "wf-1",
      name: "AI Banner Analysis Pipeline",
      trigger: "On Game Artwork Upload",
      action: "Execute Gemini Vision 2.5 Flash & Save Safe Areas",
      status: "ACTIVE",
    },
    {
      id: "wf-2",
      name: "Targeted Edge Cache Revalidation",
      trigger: "On Game / Block Update",
      action: "Purge Next.js Tags ['games', 'cms-blocks'] at Edge",
      status: "ACTIVE",
    },
    {
      id: "wf-3",
      name: "Backblaze B2 Checksum Verification",
      trigger: "On Binary Release Upload",
      action: "Validate SHA-256 Hashing & Update Release Status",
      status: "ACTIVE",
    },
  ]);

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider">
                  Dragon Control • Workflows & Automations
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Studio Automation Pipelines
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Automated publishing triggers, AI asset analyzers, and B2 integrity webhooks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {workflows.map((wf) => (
              <GlassCard key={wf.id} className="p-5 space-y-3 flex flex-col justify-between bg-[#03091D]/90 border border-cyan-500/30">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase border border-cyan-500/30">
                      TRIGGER
                    </span>
                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 font-mono">
                      <CheckCircle2 className="size-3.5" />
                      <span>{wf.status}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-mono">{wf.name}</h3>
                  <div className="p-3 bg-[#02050E] rounded-xl border border-cyan-500/20 space-y-1 text-xs font-mono">
                    <span className="text-[10px] text-cyan-400/70 block uppercase font-bold">WHEN: {wf.trigger}</span>
                    <span className="text-slate-300 font-medium">{wf.action}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Engine: Serverless</span>
                  <span className="text-cyan-300 font-bold cursor-pointer hover:underline">Active Pipeline →</span>
                </div>
              </GlassCard>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
