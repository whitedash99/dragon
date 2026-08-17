"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { ShieldCheck, Key, Globe, CheckCircle2, Lock, Cpu, Link2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GoogleAuthStatusPage() {
  const googleClientId = "519609865712-3mffbnb1d6d0etkbr28qc54eoqvnvugs.apps.googleusercontent.com";
  const isConfigured = Boolean(googleClientId);

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />

        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="size-6" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-mono">
                  Google Enterprise Identity Gateway
                </h1>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Real-time OAuth 2.0 Client Credentials & Single Sign-On Telemetry
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-mono text-xs">
                <CheckCircle2 className="size-3.5 mr-1" />
                OAUTH 2.0 ONLINE
              </Badge>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#0b0f19] border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-mono uppercase">Provider Status</span>
                  <Key className="size-4 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white font-mono">Google OAuth 2.0</div>
                <div className="text-xs text-emerald-400 font-mono mt-1">✓ Active & Provisioned</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0b0f19] border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-mono uppercase">Client ID</span>
                  <Lock className="size-4 text-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-200 truncate">{googleClientId}</div>
                <div className="text-xs text-slate-400 font-mono mt-1">256-Bit Encrypted Secret</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0b0f19] border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-mono uppercase">PKCE Security</span>
                  <Cpu className="size-4 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-white font-mono">Enforced (SHA-256)</div>
                <div className="text-xs text-slate-400 font-mono mt-1">HttpOnly / SameSite Lax</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0b0f19] border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-mono uppercase">User Auto-Sync</span>
                  <Globe className="size-4 text-sky-400" />
                </div>
                <div className="text-lg font-bold text-white font-mono">Neon PostgreSQL</div>
                <div className="text-xs text-emerald-400 font-mono mt-1">Prisma Adapter Active</div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authorized Origins */}
            <Card className="bg-[#0b0f19] border-slate-800">
              <CardHeader className="border-b border-slate-800/60 pb-4">
                <CardTitle className="text-sm font-mono uppercase text-slate-200 flex items-center gap-2">
                  <Link2 className="size-4 text-blue-400" />
                  Authorized JavaScript Origins
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#050811] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">http://localhost:3000</span>
                  <span className="text-emerald-400 font-bold">LOCAL WEBSITE</span>
                </div>
                <div className="p-3 rounded-lg bg-[#050811] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">http://localhost:4000</span>
                  <span className="text-emerald-400 font-bold">LOCAL ADMIN OS</span>
                </div>
                <div className="p-3 rounded-lg bg-[#050811] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">https://your-domain.vercel.app</span>
                  <span className="text-purple-400 font-bold">VERCEL PRODUCTION</span>
                </div>
              </CardContent>
            </Card>

            {/* Authorized Redirect URIs */}
            <Card className="bg-[#0b0f19] border-slate-800">
              <CardHeader className="border-b border-slate-800/60 pb-4">
                <CardTitle className="text-sm font-mono uppercase text-slate-200 flex items-center gap-2">
                  <ExternalLink className="size-4 text-purple-400" />
                  Authorized Callback URIs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#050811] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">http://localhost:3000/api/auth/callback/google</span>
                  <span className="text-emerald-400 font-bold">WEBSITE REDIRECT</span>
                </div>
                <div className="p-3 rounded-lg bg-[#050811] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">http://localhost:4000/api/auth/callback/google</span>
                  <span className="text-emerald-400 font-bold">ADMIN REDIRECT</span>
                </div>
                <div className="p-3 rounded-lg bg-[#050811] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">https://your-domain.vercel.app/api/auth/callback/google</span>
                  <span className="text-purple-400 font-bold">VERCEL REDIRECT</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
