"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { ShieldCheck, Key, Globe, CheckCircle2, Lock } from "lucide-react";
import { GlassCard, GlassStat, GlassBadge } from "@/components/ui/glass";

export default function GoogleAuthStatusPage() {
  const googleClientId = "519609865712-3mffbnb1d6d0etkbr28qc54eoqvnvugs.apps.googleusercontent.com";

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
                  Dragon Control • Authentication & Identity
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Google Enterprise Identity Gateway
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                OAuth 2.0 client credentials, staff single sign-on, and token verification telemetry.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <GlassBadge variant="published">
                OAUTH 2.0 PROVISIONED
              </GlassBadge>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStat label="Provider" value="Google OAuth" icon={Key} trend="Production Active" />
            <GlassStat label="Redirect URI" value="Auth.js v5" icon={Globe} trend="Standard Callback" />
            <GlassStat label="Token Encryption" value="AES-256" icon={Lock} trend="Encrypted Cookies" />
            <GlassStat label="Single Sign-On" value="Enforced" icon={ShieldCheck} trend="Studio Staff" />
          </div>

          <GlassCard className="p-6 space-y-4 max-w-3xl bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">OAuth 2.0 Production Credentials</h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-cyan-400 font-bold block">Client ID:</span>
                <code className="p-2.5 bg-[#02050E] border border-cyan-500/25 rounded-xl text-slate-200 font-mono block break-all">
                  {googleClientId}
                </code>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-cyan-400 font-bold block">Authorized Callback URL:</span>
                <code className="p-2.5 bg-[#02050E] border border-cyan-500/25 rounded-xl text-cyan-300 font-mono block">
                  https://dragoncontrol.vercel.app/api/auth/callback/google
                </code>
              </div>
            </div>
          </GlassCard>

        </main>
      </div>
    </div>
  );
}
