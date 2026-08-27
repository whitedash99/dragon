"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, Key, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RoleDef {
  name: string;
  rank: number;
  isProtected?: boolean;
  description: string;
  permissions: string[];
}

const ROLES_MATRIX: RoleDef[] = [
  {
    name: "OWNER",
    rank: 1,
    isProtected: true,
    description: "Supreme Executive Governance & Platform Ownership. Immutable.",
    permissions: ["ALL_PRIVILEGES", "IAM_MUTATION", "SECRETS_VAULT", "SECURITY_GOVERNANCE", "RECRUITMENT_APPROVE", "CRM_DISPATCH", "CMS_PUBLISH"],
  },
  {
    name: "ADMIN",
    rank: 2,
    description: "Operational System Administration & Team Management.",
    permissions: ["IAM_MUTATION", "SECRETS_READ", "RECRUITMENT_APPROVE", "CRM_DISPATCH", "CMS_PUBLISH"],
  },
  {
    name: "DEVELOPER",
    rank: 3,
    description: "Engineering & Technical Infrastructure Access.",
    permissions: ["CMS_DRAFT", "CMS_PUBLISH", "SECRETS_READ", "DEV_HUB"],
  },
  {
    name: "SUPPORT",
    rank: 4,
    description: "Customer Support Desk & Ticket Resolution.",
    permissions: ["CRM_DISPATCH", "CRM_READ"],
  },
  {
    name: "EDITOR",
    rank: 5,
    description: "Content Management & Studio Publishing.",
    permissions: ["CMS_DRAFT", "CMS_PUBLISH"],
  },
];

export default function AccessPage() {
  const [selectedRole, setSelectedRole] = useState<RoleDef>(ROLES_MATRIX[0]);

  return (
    <div className="flex min-h-screen bg-[#02040A] text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 scrollbar-thin scrollbar-thumb-cyan-500/20 font-mono">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="size-3.5 text-cyan-400" />
                <span>Dragon Authorization Matrix & Privilege Hierarchy</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-heading">
                Access Control & RBAC Matrix
              </h1>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <ShieldCheck className="size-4 text-cyan-400" />
              <span>Privilege Escalation Guard Active</span>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Roles List */}
            <div className="bg-[#03091D]/90 border border-cyan-500/25 rounded-2xl p-5 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">System Role Tiers</h2>
              <div className="space-y-2">
                {ROLES_MATRIX.map((r) => {
                  const isSelected = selectedRole.name === r.name;
                  return (
                    <div
                      key={r.name}
                      onClick={() => setSelectedRole(r)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all space-y-1",
                        isSelected
                          ? "bg-cyan-500/25 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                          : "bg-[#02050E] border-cyan-500/20 hover:border-cyan-500/40 text-slate-300"
                      )}
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-xs text-white">{r.name}</span>
                        {r.isProtected && (
                          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold border bg-cyan-500/20 text-cyan-300 border-cyan-400/40">
                            PROTECTED
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-slate-400 line-clamp-2">
                        {r.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Role Permissions Inspector */}
            <div className="lg:col-span-2 bg-[#03091D]/90 border border-cyan-500/25 rounded-2xl p-6 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2 font-heading">
                    <span>{selectedRole.name} Role Specifications</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedRole.description}</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-[#02050E] rounded-xl border border-cyan-500/30 font-bold text-cyan-300">
                  Rank #{selectedRole.rank}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Granted Authorization Entitlements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRole.permissions.map((perm) => (
                    <div key={perm} className="p-3.5 rounded-xl bg-[#02050E] border border-cyan-500/25 text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
