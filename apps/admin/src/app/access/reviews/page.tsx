"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { CheckSquare, RefreshCw } from "lucide-react";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";

interface AccessUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

export default function AccessReviewsPage() {
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState<Record<string, "KEEP" | "REVOKE">>({});

  const fetchAccessUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users?role=All");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error("Fetch access review users error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccessUsers();
  }, [fetchAccessUsers]);

  const handleSetDecision = (id: string, decision: "KEEP" | "REVOKE") => {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
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
                <CheckSquare className="size-3.5 text-cyan-400" />
                <span>Executive Governance & Least Privilege Audit</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Periodic Access Reviews</h1>
            </div>

            <button
              onClick={fetchAccessUsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <RefreshCw className={`size-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Access Ledger</span>
            </button>
          </div>

          <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Active Access Review Audit ({users.length})</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">&quot;Who still requires this level of access?&quot;</p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 text-xs font-mono">
                Loading access audit records...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-cyan-500/20 bg-[#02050E] text-cyan-400 uppercase text-[11px]">
                    <tr>
                      <th className="px-6 py-3.5">User Identity</th>
                      <th className="px-6 py-3.5">Current Role</th>
                      <th className="px-6 py-3.5">Audit Decision</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/10 text-slate-300">
                    {users.map((u) => {
                      const currentDecision = decisions[u.id];
                      return (
                        <tr key={u.id} className="hover:bg-cyan-500/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{u.name || u.email}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-cyan-300">
                            {u.role}
                          </td>
                          <td className="px-6 py-4">
                            {currentDecision ? (
                              <GlassBadge variant={currentDecision === "KEEP" ? "published" : "critical"}>
                                DECISION: {currentDecision}
                              </GlassBadge>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Pending Review</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleSetDecision(u.id, "KEEP")}
                              className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold font-mono transition-all cursor-pointer"
                            >
                              KEEP
                            </button>
                            <button
                              onClick={() => handleSetDecision(u.id, "REVOKE")}
                              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-[11px] font-bold font-mono transition-all cursor-pointer"
                            >
                              REVOKE
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
