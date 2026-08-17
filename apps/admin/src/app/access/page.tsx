"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, Key, Users } from "lucide-react";

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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="size-3.5 text-slate-700 dark:text-slate-300" />
                <span>Dragon Authorization Matrix & Privilege Hierarchy</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Access Control & Role Matrix</h1>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold">
              <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
              <span>Privilege Escalation Guard Active</span>
            </div>
          </div>

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {/* Roles List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">System Role Tiers</h2>
              <div className="space-y-2">
                {ROLES_MATRIX.map((r) => {
                  const isSelected = selectedRole.name === r.name;
                  return (
                    <div
                      key={r.name}
                      onClick={() => setSelectedRole(r)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs font-semibold"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-xs">{r.name}</span>
                        {r.isProtected && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isSelected ? "bg-amber-900 dark:bg-amber-200 text-amber-100 dark:text-amber-900 border-amber-700 dark:border-amber-300" : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"}`}>
                            PROTECTED
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}>
                        {r.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Role Permissions Inspector */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{selectedRole.name} Role Specifications</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">{selectedRole.description}</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                  Rank #{selectedRole.rank}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Granted Authorization Entitlements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRole.permissions.map((perm) => (
                    <div key={perm} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
