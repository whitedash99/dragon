"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  Activity,
  Search,
  RefreshCw,
  Filter,
  Eye,
  ShieldCheck,
  X,
  Lock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resource?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export default function AuditPage() {
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.auditLogs)) {
          setAudits(data.auditLogs);
        }
      }
    } catch (e) {
      console.error("Error fetching audit logs", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Filter logs
  const filteredAudits = audits.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      a.action.toLowerCase().includes(q) ||
      (a.userEmail && a.userEmail.toLowerCase().includes(q)) ||
      (a.details && a.details.toLowerCase().includes(q)) ||
      (a.resource && a.resource.toLowerCase().includes(q));

    const matchesAction =
      actionFilter === "ALL" ||
      (actionFilter === "AUTH" && (a.action.includes("LOGIN") || a.action.includes("AUTH") || a.action.includes("SESSION"))) ||
      (actionFilter === "RECRUITMENT" && (a.action.includes("INVITE") || a.action.includes("APPLICATION"))) ||
      (actionFilter === "SECURITY" && (a.action.includes("SECURITY") || a.action.includes("PASSKEY") || a.action.includes("OWNER")));

    return matchesQuery && matchesAction;
  });

  const totalPages = Math.ceil(filteredAudits.length / pageSize) || 1;
  const paginatedAudits = filteredAudits.slice((page - 1) * pageSize, page * pageSize);

  // Mask sensitive strings (tokens, hashes, passwords)
  const maskDetails = (text?: string) => {
    if (!text) return "No additional payload.";
    return text.replace(/(token|secret|password|hash|key)=([a-zA-Z0-9_-]+)/gi, "$1=[REDACTED]");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-[11px] text-sky-800 dark:text-sky-300 font-medium mb-2 w-fit">
                <Activity className="size-3.5 text-sky-600 dark:text-sky-400" />
                <span>System Event Audit Ledger</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Enterprise Audit Center
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-sans">
                Full governance audit trails across DIP identities, sessions, invitations, and administrative actions.
              </p>
            </div>

            <button
              onClick={fetchAuditLogs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
            >
              <RefreshCw className={cn("size-3.5 text-slate-500 dark:text-slate-400", loading && "animate-spin")} />
              <span>Refresh Ledger</span>
            </button>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="size-3.5 text-slate-400 mr-1" />
              {["ALL", "AUTH", "RECRUITMENT", "SECURITY"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActionFilter(cat);
                    setPage(1);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                    actionFilter === cat
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search actor, action, resource..."
                className="w-full rounded-xl bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* Audit Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            {loading ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs font-mono">
                Querying Neon PostgreSQL AuditLogs...
              </div>
            ) : paginatedAudits.length === 0 ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs font-mono">
                No audit log entries found matching criteria.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Timestamp</th>
                    <th className="px-6 py-3.5">Actor</th>
                    <th className="px-6 py-3.5">Action</th>
                    <th className="px-6 py-3.5">Resource</th>
                    <th className="px-6 py-3.5">IP Address</th>
                    <th className="px-6 py-3.5 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {paginatedAudits.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                        {log.userEmail || "System Engine"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                        {log.resource || "DIP"}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                        {log.ipAddress || "127.0.0.1"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedAudit(log)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 transition-colors"
                          title="Inspect Event Payload"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination Controls */}
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <div>
                Showing Page {page} of {totalPages} ({filteredAudits.length} entries)
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Audit Detail Drawer */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-sky-600 dark:text-sky-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base font-mono">Audit Record Inspection</h3>
              </div>
              <button onClick={() => setSelectedAudit(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Record ID:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">{selectedAudit.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Action:</span>
                  <span className="text-sky-600 dark:text-sky-400 font-bold">{selectedAudit.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Actor Identity:</span>
                  <span className="text-slate-900 dark:text-slate-100">{selectedAudit.userEmail || "System Engine"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Resource Target:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedAudit.resource || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">IP Address:</span>
                  <span className="text-slate-600 dark:text-slate-400">{selectedAudit.ipAddress || "127.0.0.1"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Timestamp:</span>
                  <span className="text-slate-600 dark:text-slate-400">{new Date(selectedAudit.createdAt).toUTCString()}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Sanitized Event Payload:</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <Lock className="size-3" /> Credentials Masked
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-100 border border-slate-800 whitespace-pre-wrap font-mono text-[11px] overflow-x-auto">
                  {maskDetails(selectedAudit.details)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
