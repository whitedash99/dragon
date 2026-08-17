"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Fingerprint, Key, ShieldCheck, Smartphone, RefreshCw, Lock, CheckCircle2, AlertCircle } from "lucide-react";

interface IdentityUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  isProtected?: boolean;
  passkeysCount?: number;
  activeSessionsCount?: number;
  createdAt: string;
}

export default function IdentityPage() {
  const [users, setUsers] = useState<IdentityUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIdentityData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users?role=All");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error("Fetch identity error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdentityData();
  }, [fetchIdentityData]);

  const totalPasskeys = users.reduce((acc, u) => acc + (u.passkeysCount || 0), 0);
  const totalSessions = users.reduce((acc, u) => acc + (u.activeSessionsCount || 0), 0);

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
                <Fingerprint className="size-3.5 text-slate-700 dark:text-slate-300" />
                <span>Dragon Identity Platform (DIP) Architecture</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Identity & Authentication Engine</h1>
            </div>

            <button
              onClick={fetchIdentityData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
            >
              <RefreshCw className={`size-3.5 text-slate-500 dark:text-slate-400 ${loading ? "animate-spin" : ""}`} />
              <span>Sync Identity Ledger</span>
            </button>
          </div>

          {/* Metrics */}
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4 font-mono">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold block">DIP Identities</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 block">{users.length}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold block">Registered Passkeys</span>
              <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 block">{totalPasskeys}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold block">Active Sessions</span>
              <span className="text-3xl font-extrabold text-sky-700 dark:text-sky-400 block">{totalSessions}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold block">SSO & WebAuthn</span>
              <span className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 block">ENFORCED</span>
            </div>
          </div>

          {/* Identity Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Provisioned Staff Identities</h2>
              <span className="text-xs text-slate-400 dark:text-slate-500">PostgreSQL Authoritative State</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs font-mono">
                Loading identity ledger...
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">User Identity</th>
                    <th className="px-6 py-3.5">Role Tier</th>
                    <th className="px-6 py-3.5">Passkeys</th>
                    <th className="px-6 py-3.5">Active Sessions</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{u.name || u.email}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] font-bold font-mono">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-mono">
                        {u.passkeysCount || 0} Registered
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-mono">
                        {u.activeSessionsCount || 0} Session{u.activeSessionsCount === 1 ? "" : "s"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${u.isActive ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800"}`}>
                          {u.isActive ? "ACTIVE" : "SUSPENDED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
