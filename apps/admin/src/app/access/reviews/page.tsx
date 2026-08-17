"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { CheckSquare, ShieldCheck, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckSquare className="size-3.5 text-slate-700" />
                <span>Executive Governance & Least Privilege Audit</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Periodic Access Reviews</h1>
            </div>

            <button
              onClick={fetchAccessUsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-xs"
            >
              <RefreshCw className={`size-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Access Ledger</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Active Access Review Audit ({users.length})</h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5">&quot;Who still requires this level of access?&quot;</p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400 text-xs font-mono">
                Loading access audit records...
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">User Identity</th>
                    <th className="px-6 py-3.5">Current Role</th>
                    <th className="px-6 py-3.5">Audit Decision</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u) => {
                    const currentDecision = decisions[u.id];
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{u.name || u.email}</div>
                          <div className="text-[11px] text-slate-400 font-sans">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {u.role}
                        </td>
                        <td className="px-6 py-4">
                          {currentDecision ? (
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${currentDecision === "KEEP" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}>
                              DECISION: {currentDecision}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Pending Review</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleSetDecision(u.id, "KEEP")}
                            className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition-all"
                          >
                            KEEP
                          </button>
                          <button
                            onClick={() => handleSetDecision(u.id, "REVOKE")}
                            className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-bold transition-all"
                          >
                            REVOKE
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
