"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Globe2, CheckCircle2, Copy, ShieldCheck } from "lucide-react";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";

interface DomainRecord {
  domain: string;
  type: string;
  status: string;
  dnsVerified: boolean;
  sslActive: boolean;
}

const DOMAINS_LIST: DomainRecord[] = [
  {
    domain: "dragonstudios.com",
    type: "Primary Apex Domain",
    status: "VERIFIED",
    dnsVerified: true,
    sslActive: true,
  },
  {
    domain: "admin.dragonstudios.com",
    type: "Admin Subdomain",
    status: "VERIFIED",
    dnsVerified: true,
    sslActive: true,
  },
  {
    domain: "api.dragonstudios.com",
    type: "DIP API Gateway",
    status: "VERIFIED",
    dnsVerified: true,
    sslActive: true,
  },
];

export default function DomainsPage() {
  const [copiedTxt, setCopiedTxt] = useState(false);

  const handleCopyDNS = () => {
    navigator.clipboard.writeText("dragon-verification=dip-auth-key-0x982a17f");
    setCopiedTxt(true);
    setTimeout(() => setCopiedTxt(false), 2000);
  };

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
                <Globe2 className="size-3.5 text-cyan-400" />
                <span>Dragon Domain Ownership & DNS Association</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Custom Domains & DNS Verification</h1>
            </div>
          </div>

          <GlassCard className="p-6 space-y-6 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Verified Organization Domains ({DOMAINS_LIST.length})</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Authoritative DNS TXT verification records for email delivery and SSO mappings.</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {DOMAINS_LIST.map((d) => (
                <div key={d.domain} className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-500/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono text-sm">{d.domain}</span>
                      <GlassBadge variant="published">
                        {d.status}
                      </GlassBadge>
                    </div>
                    <p className="text-slate-400 text-[11px] font-mono">{d.type}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="size-3.5 text-emerald-400" /> DNS TXT Verified
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck className="size-3.5 text-emerald-400" /> SSL Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* DNS Instructions Card */}
            <div className="p-5 rounded-xl bg-[#02050E] border border-cyan-500/30 space-y-3 font-mono">
              <div className="font-bold text-cyan-400 text-xs uppercase tracking-wider">DNS Verification Record for New Subdomains</div>
              <div className="flex items-center justify-between bg-[#03091D] p-3 rounded-lg border border-cyan-500/20 text-xs text-slate-200">
                <code className="text-cyan-300">TXT dragon-verification=dip-auth-key-0x982a17f</code>
                <button
                  onClick={handleCopyDNS}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[11px] font-bold font-mono flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Copy className="size-3" /> {copiedTxt ? "Copied!" : "Copy TXT"}
                </button>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
