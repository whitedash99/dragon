"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Server, 
  Code, 
  Zap, 
  ShieldCheck, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Globe 
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EndpointDoc {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  auth: "PUBLIC" | "SESSION" | "ADMIN";
  rateLimit: string;
}

const API_ENDPOINTS: EndpointDoc[] = [
  {
    path: "/api/health",
    method: "GET",
    description: "Probes PostgreSQL, B2 S3, Resend, and Gemini AI health states",
    auth: "PUBLIC",
    rateLimit: "120 req/min",
  },
  {
    path: "/api/games",
    method: "GET",
    description: "Fetches canonical games catalog, releases, and media metadata",
    auth: "PUBLIC",
    rateLimit: "300 req/min",
  },
  {
    path: "/api/users",
    method: "GET",
    description: "Returns authoritative user ledger and Dragon ID profiles",
    auth: "ADMIN",
    rateLimit: "60 req/min",
  },
  {
    path: "/api/media",
    method: "GET",
    description: "Queries Backblaze B2 digital media library and signed CDN URLs",
    auth: "ADMIN",
    rateLimit: "100 req/min",
  },
  {
    path: "/api/crm/tickets",
    method: "GET",
    description: "Returns customer support tickets and message timelines",
    auth: "ADMIN",
    rateLimit: "60 req/min",
  },
  {
    path: "/api/ai",
    method: "POST",
    description: "Google Gemini 1.5 Flash assistant, copywriter, and SEO synthesizer",
    auth: "ADMIN",
    rateLimit: "30 req/min",
  },
];

export default function ApiPlatformPage() {
  const [testingPath, setTestingPath] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ path: string; status: number; latency: number; data: any } | null>(null);

  const testEndpoint = async (ep: EndpointDoc) => {
    setTestingPath(ep.path);
    const start = performance.now();
    try {
      const res = await fetch(ep.path, { method: ep.method === "POST" ? "POST" : "GET" });
      const latency = Math.round(performance.now() - start);
      const data = await res.json().catch(() => ({}));
      setTestResult({
        path: ep.path,
        status: res.status,
        latency,
        data,
      });
    } catch (e) {
      setTestResult({
        path: ep.path,
        status: 500,
        latency: Math.round(performance.now() - start),
        data: { error: String(e) },
      });
    } finally {
      setTestingPath(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#02040A] text-slate-100 font-sans select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20 font-mono">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Dragon Control • Edge API Platform</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-heading">
                API Platform & Edge Endpoints
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Authoritative REST API endpoints, token authorization, and latency monitors.
              </p>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#03091D]/90 border border-cyan-500/25 p-4 rounded-2xl space-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-cyan-400/80 uppercase text-[11px] font-bold block">API Gateway</span>
              <span className="text-2xl font-black text-emerald-400 block">Healthy</span>
              <span className="text-[10px] text-slate-500">100% Uptime</span>
            </div>
            <div className="bg-[#03091D]/90 border border-cyan-500/25 p-4 rounded-2xl space-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-cyan-400/80 uppercase text-[11px] font-bold block">Avg Latency</span>
              <span className="text-2xl font-black text-cyan-300 block">18ms</span>
              <span className="text-[10px] text-slate-500">Vercel Edge Node</span>
            </div>
            <div className="bg-[#03091D]/90 border border-cyan-500/25 p-4 rounded-2xl space-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-cyan-400/80 uppercase text-[11px] font-bold block">Active Routes</span>
              <span className="text-2xl font-black text-white block">{API_ENDPOINTS.length}</span>
              <span className="text-[10px] text-slate-500">REST v1 Architecture</span>
            </div>
            <div className="bg-[#03091D]/90 border border-cyan-500/25 p-4 rounded-2xl space-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-cyan-400/80 uppercase text-[11px] font-bold block">Security Gate</span>
              <span className="text-2xl font-black text-purple-400 block">ENFORCED</span>
              <span className="text-[10px] text-slate-500">RBAC Token Guard</span>
            </div>
          </div>

          {/* Endpoints Inventory */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code className="size-4 text-cyan-400" />
              <span>Studio Microservices & Edge APIs</span>
            </h2>

            <div className="space-y-3">
              {API_ENDPOINTS.map((ep) => (
                <div
                  key={ep.path}
                  className="p-4 rounded-2xl bg-[#03091D]/90 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-400/50 transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold",
                        ep.method === "GET" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "bg-purple-500/20 text-purple-300 border border-purple-400/40"
                      )}>
                        {ep.method}
                      </span>
                      <span className="text-sm font-bold text-white font-mono">{ep.path}</span>
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-[#02050E] text-slate-400 border border-white/10">
                        {ep.auth}
                      </span>
                      <span className="text-[10px] text-slate-500">{ep.rateLimit}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{ep.description}</p>
                  </div>

                  <button
                    onClick={() => testEndpoint(ep)}
                    disabled={testingPath === ep.path}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#02050E] hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {testingPath === ep.path ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <Play className="size-3.5 fill-current" />
                    )}
                    <span>{testingPath === ep.path ? "Pinging..." : "Test Endpoint"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Test Output Viewer */}
          {testResult && (
            <div className="p-4 rounded-2xl bg-[#03091D]/95 border border-cyan-400/40 shadow-[0_0_25px_rgba(0,229,255,0.2)] space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "size-2 rounded-full",
                    testResult.status === 200 ? "bg-emerald-400 shadow-[0_0_8px_#10B981]" : "bg-amber-400"
                  )} />
                  <span className="font-bold text-white">Live Response: {testResult.path}</span>
                  <span className="text-slate-400 font-mono">({testResult.latency}ms · Status {testResult.status})</span>
                </div>
                <button
                  onClick={() => setTestResult(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-[#010309] text-[10.5px] text-cyan-300 overflow-x-auto max-h-48 scrollbar-thin">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
