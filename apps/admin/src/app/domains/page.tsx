"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Globe2, CheckCircle2, Copy, ShieldCheck, RefreshCw } from "lucide-react";

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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 font-sans text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Globe2 className="size-3.5 text-slate-700" />
                <span>Dragon Domain Ownership & DNS Association</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Custom Domains & DNS Verification</h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Verified Organization Domains ({DOMAINS_LIST.length})</h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Authoritative DNS TXT verification records for email delivery and SSO mappings.</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {DOMAINS_LIST.map((d) => (
                <div key={d.domain} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{d.domain}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        {d.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] font-sans">{d.type}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-700">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="size-3.5 text-emerald-600" /> DNS TXT Verified
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <ShieldCheck className="size-3.5 text-emerald-600" /> SSL Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* DNS Instructions Card */}
            <div className="p-5 rounded-xl bg-slate-100 border border-slate-200 space-y-3 font-mono">
              <div className="font-bold text-slate-900 text-xs">DNS Verification Record for New Subdomains</div>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800">
                <code>TXT dragon-verification=dip-auth-key-0x982a17f</code>
                <button
                  onClick={handleCopyDNS}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <Copy className="size-3" /> {copiedTxt ? "Copied!" : "Copy TXT"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
