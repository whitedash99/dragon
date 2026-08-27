"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Code, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  ExternalLink, 
  Server 
} from "lucide-react";
import { GlassCard, GlassButton, GlassBadge, GlassStat } from "@/components/ui/glass";

export default function DeveloperPage() {
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
                  Dragon Control • Developer Platform & APIs
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Developer SDKs & Platform Endpoints
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Prisma client schema, Neon PostgreSQL connection pool, and public REST API routes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Canonical API Endpoints</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-[#02050E] rounded-xl border border-cyan-500/20 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <span className="text-white">/api/games</span>
                  <span className="text-slate-400">Public Catalog</span>
                </div>
                <div className="p-2.5 bg-[#02050E] rounded-xl border border-cyan-500/20 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <span className="text-white">/api/games/[slug]</span>
                  <span className="text-slate-400">Game Details</span>
                </div>
                <div className="p-2.5 bg-[#02050E] rounded-xl border border-cyan-500/20 flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">POST</span>
                  <span className="text-white">/api/revalidate</span>
                  <span className="text-slate-400">Targeted Purge</span>
                </div>
                <div className="p-2.5 bg-[#02050E] rounded-xl border border-cyan-500/20 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <span className="text-white">/api/cms/blocks</span>
                  <span className="text-slate-400">Layout Sections</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Studio Database Architecture</h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-2 border-b border-cyan-500/15">
                  <span className="text-slate-400">ORM & Driver</span>
                  <span className="font-bold text-white">Prisma Client v6.19.3</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cyan-500/15">
                  <span className="text-slate-400">Shared Schema</span>
                  <span className="font-bold text-cyan-300">packages/shared-db</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cyan-500/15">
                  <span className="text-slate-400">Serverless Host</span>
                  <span className="font-bold text-white">Neon PostgreSQL</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Authentication Layer</span>
                  <span className="font-bold text-emerald-400">Auth.js & RBAC Enforced</span>
                </div>
              </div>
            </GlassCard>
          </div>

        </main>
      </div>
    </div>
  );
}
