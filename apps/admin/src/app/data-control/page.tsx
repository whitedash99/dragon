"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  Database,
  ShieldAlert,
  Activity,
  BarChart3,
  Archive,
  Download,
  Trash2,
  Search,
  RefreshCw,
  Lock,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Key,
  Users,
  Briefcase,
  LifeBuoy,
  FileText,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface OverviewData {
  totalUsers: number | null;
  activeUsers: number | null;
  teamMembers: number | null;
  careerApplications: number | null;
  contactTickets: number | null;
  supportTickets: number | null;
  cmsRecords: number | null;
  games: number | null;
  websiteEvents: number | null;
  analyticsSessions: number | null;
  auditEvents: number | null;
  activeSessions: number | null;
  pendingInvitations: number | null;
}

interface InventoryItem {
  id: string;
  dataset: string;
  description: string;
  records: number;
  oldestRecord: string | null;
  newestRecord: string | null;
  retentionPolicy: string;
  deletionCapability: "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "RESTRICTED";
  exportCapability: boolean;
  archiveCapability: boolean;
}

interface RetentionItem {
  dataset: string;
  policy: string;
  eligibleForPurge: number;
  status: string;
}

interface ActivityItem {
  id: string;
  action: string;
  actorEmail: string;
  resource: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  entityId: string;
  createdAt: string;
}

export default function OwnerDataCommandCenterPage() {
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "inventory" | "retention" | "exports" | "deletion" | "activity" | "search"
  >("overview");

  // Data states
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{
    telemetry?: Record<string, unknown>;
    eventCounts?: Record<string, number>;
    popularPages?: Record<string, number>;
    recentEvents?: { id: string; event: string; category: string; userEmail: string; ipAddress?: string; createdAt: string }[];
  }>({});
  const [analyticsRange, setAnalyticsRange] = useState("30d");

  // Inspector & Modal States
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Deletion Modal State
  const [deletionModal, setDeletionModal] = useState<{
    isOpen: boolean;
    level: "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
    subsystem: string;
    targetName: string;
    expectedPhrase: string;
    affectedEstimate: string;
  }>({
    isOpen: false,
    level: "LEVEL_1",
    subsystem: "",
    targetName: "",
    expectedPhrase: "",
    affectedEstimate: "",
  });

  const [typedPhrase, setTypedPhrase] = useState("");
  const [deletionPassword, setDeletionPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deletionResult, setDeletionResult] = useState<{ success: boolean; message: string } | null>(null);

  // Export State
  const [exportDataset, setExportDataset] = useState("Users");
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Fetch Overview Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewRes, inventoryRes, retentionRes, activityRes] = await Promise.all([
        fetch("/api/data-control/overview"),
        fetch("/api/data-control/inventory"),
        fetch("/api/data-control/retention"),
        fetch("/api/data-control/activity"),
      ]);

      if (overviewRes.status === 403 || overviewRes.status === 401) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      if (overviewRes.ok) {
        const d = await overviewRes.json();
        if (d.data) setOverview(d.data);
      }
      if (inventoryRes.ok) {
        const d = await inventoryRes.json();
        if (d.inventory) setInventory(d.inventory);
      }
      if (retentionRes.ok) {
        const d = await retentionRes.json();
        if (d.retentionPolicies) setRetentionPolicies(d.retentionPolicies);
      }
      if (activityRes.ok) {
        const d = await activityRes.json();
        if (d.activity) setActivity(d.activity);
      }
    } catch (e) {
      console.error("Data control fetch error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Analytics Data
  const fetchAnalytics = useCallback(async (range: string) => {
    try {
      const res = await fetch(`/api/data-control/analytics?range=${range}`);
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (e) {
      console.error("Analytics fetch error", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === "analytics") {
      fetchAnalytics(analyticsRange);
    }
  }, [activeTab, analyticsRange, fetchAnalytics]);

  // Execute Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/data-control/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch (e) {
      console.error("Search error", e);
    } finally {
      setSearching(false);
    }
  };

  // Execute Export
  const handleExport = async () => {
    setExporting(true);
    setExportSuccess(null);
    try {
      const res = await fetch("/api/data-control/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset: exportDataset, format: exportFormat }),
      });

      if (exportFormat === "csv" && res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dragon_${exportDataset}_export_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setExportSuccess(`CSV export for [${exportDataset}] downloaded cleanly.`);
      } else if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data.records, null, 2)], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dragon_${exportDataset}_export_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setExportSuccess(`JSON export for [${exportDataset}] (${data.records.length} records) downloaded cleanly.`);
      }
    } catch (e) {
      console.error("Export error", e);
    } finally {
      setExporting(false);
    }
  };

  // Execute Purge/Deletion Operation
  const handleExecuteDeletion = async () => {
    setDeleting(true);
    setDeletionResult(null);

    try {
      const res = await fetch("/api/data-control/deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationLevel: deletionModal.level,
          subsystem: deletionModal.subsystem,
          confirmationPhrase: typedPhrase,
          password: deletionPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setDeletionResult({
          success: true,
          message: data.summary || `Deletion operation [${deletionModal.subsystem}] executed cleanly. ${data.affectedCount} record(s) purged.`,
        });
        fetchData();
      } else {
        setDeletionResult({
          success: false,
          message: data.error || "Deletion operation failed.",
        });
      }
    } catch (e) {
      setDeletionResult({
        success: false,
        message: e instanceof Error ? e.message : "Network error during deletion execution.",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Helper for rendering values or NOT AVAILABLE
  const renderMetric = (val: number | null | undefined) => {
    if (val === null || val === undefined) {
      return <span className="text-xs font-mono text-rose-500 font-bold tracking-wider">NOT AVAILABLE</span>;
    }
    return <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-slate-100">{val.toLocaleString()}</span>;
  };

  if (accessDenied) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans select-none items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="size-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">HTTP 403 — ACCESS DENIED</h1>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              The Owner Data Command Center (/data-control) requires an authenticated session with a protected OWNER role identity.
            </p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-500 text-left space-y-1">
            <div>Server Authorization Enforcement: ACTIVE</div>
            <div>Identity Check: Failed or Insufficient Privilege</div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all border border-slate-700"
          >
            <span>Return to Executive Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 text-[11px] text-purple-700 dark:text-purple-300 font-semibold font-mono">
                  <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
                  <span>OWNER DATA COMMAND CENTER</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Enterprise Data Governance & Control Console
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authoritative control room to inspect, retain, export, purge, and verify Dragon Studios application datasets.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
                >
                  <RefreshCw className={cn("size-3.5 text-slate-500", loading && "animate-spin")} />
                  <span>Sync Database</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
              {[
                { id: "overview", label: "Overview", icon: Layers },
                { id: "analytics", label: "Website Analytics", icon: BarChart3 },
                { id: "inventory", label: "Data Inventory", icon: Database },
                { id: "retention", label: "Retention Center", icon: Clock },
                { id: "exports", label: "Export Center", icon: Download },
                { id: "deletion", label: "Deletion Center", icon: Trash2 },
                { id: "activity", label: "Owner Activity", icon: Activity },
                { id: "search", label: "Data Search", icon: Search },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
                    activeTab === id
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Database className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Real Neon PostgreSQL Metrics Stream
                </h2>
                <span className="text-[11px] font-mono text-slate-400">Server-Authoritative</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Total Users</span>
                    <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>{renderMetric(overview?.totalUsers)}</div>
                  <div className="text-[11px] text-slate-400">Database user accounts</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Active Users</span>
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>{renderMetric(overview?.activeUsers)}</div>
                  <div className="text-[11px] text-slate-400">Non-deleted active identities</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Team Workforce</span>
                    <Briefcase className="size-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>{renderMetric(overview?.teamMembers)}</div>
                  <div className="text-[11px] text-slate-400">Staff members & Executives</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Career Applications</span>
                    <FileText className="size-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>{renderMetric(overview?.careerApplications)}</div>
                  <div className="text-[11px] text-slate-400">Recruitment submissions</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Public Contact Tickets</span>
                    <LifeBuoy className="size-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>{renderMetric(overview?.contactTickets)}</div>
                  <div className="text-[11px] text-slate-400">Website support requests</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Admin Support Desk</span>
                    <LifeBuoy className="size-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>{renderMetric(overview?.supportTickets)}</div>
                  <div className="text-[11px] text-slate-400">CRM tickets & replies</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>CMS Content Records</span>
                    <Layers className="size-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>{renderMetric(overview?.cmsRecords)}</div>
                  <div className="text-[11px] text-slate-400">Pages & section blocks</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Website Events</span>
                    <Activity className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>{renderMetric(overview?.websiteEvents)}</div>
                  <div className="text-[11px] text-slate-400">Analytics events pipeline</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Audit Events</span>
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>{renderMetric(overview?.auditEvents)}</div>
                  <div className="text-[11px] text-slate-400">Immutable security audit logs</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Active Sessions</span>
                    <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>{renderMetric(overview?.activeSessions)}</div>
                  <div className="text-[11px] text-slate-400">Unexpired admin cookies</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Pending Invitations</span>
                    <Key className="size-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>{renderMetric(overview?.pendingInvitations)}</div>
                  <div className="text-[11px] text-slate-400">Unconsumed token keys</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBSITE ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <BarChart3 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Real Public Website Intelligence Pipeline
                </h2>

                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs">
                  {["today", "7d", "30d", "90d", "1y"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setAnalyticsRange(r)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg uppercase font-mono font-semibold transition-all",
                        analyticsRange === r
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Stream Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tracked Events</div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                    {Number(analyticsData.telemetry?.totalEvents || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Page Views</div>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {Number(analyticsData.telemetry?.pageViews || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Contact Submissions</div>
                  <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 font-mono">
                    {Number(analyticsData.telemetry?.contactSubmissions || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Career Applications</div>
                  <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                    {Number(analyticsData.telemetry?.careerApplications || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Event Breakdown & Stream */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                  Recent Analytics Event Stream (Neon PostgreSQL)
                </h3>

                {(!analyticsData.recentEvents || analyticsData.recentEvents.length === 0) ? (
                  <div className="py-12 text-center text-xs font-mono text-slate-400">
                    No website analytics recorded yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {analyticsData.recentEvents.map((evt) => (
                      <div key={evt.id} className="py-3 flex items-center justify-between gap-4 font-mono">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                              {evt.event}
                            </span>
                            <span>{evt.category}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">{evt.userEmail} • IP: {evt.ipAddress}</div>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(evt.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DATA INVENTORY */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Database className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Prisma ORM Dataset Inventory & Capabilities
                </h2>
                <span className="text-[11px] font-mono text-slate-400">{inventory.length} Datasets Inspected</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedInventory(item)}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <span>{item.dataset}</span>
                        <ChevronRight className="size-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.records.toLocaleString()} records
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Policy: {item.retentionPolicy}</span>
                      <span className={cn("px-2 py-0.5 rounded font-semibold", item.deletionCapability === "RESTRICTED" ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600" : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600")}>
                        {item.deletionCapability}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RETENTION CENTER */}
          {activeTab === "retention" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Retention Policy & Expired Purge Center
                </h2>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {retentionPolicies.map((pol) => (
                    <div key={pol.dataset} className="py-4 flex items-center justify-between gap-4 font-mono">
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{pol.dataset}</div>
                        <div className="text-slate-500">Policy: {pol.policy}</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{pol.eligibleForPurge.toLocaleString()} Purgable</div>
                          <div className="text-[10px] text-slate-400">{pol.status}</div>
                        </div>

                        {pol.eligibleForPurge > 0 && (
                          <button
                            onClick={() => {
                              setDeletionModal({
                                isOpen: true,
                                level: "LEVEL_1",
                                subsystem: pol.dataset === "Sessions" ? "Sessions" : pol.dataset,
                                targetName: `Retention Purge for ${pol.dataset}`,
                                expectedPhrase: "PURGE EXPIRED",
                                affectedEstimate: `${pol.eligibleForPurge} expired records`,
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-all shadow-xs"
                          >
                            Purge Expired
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORT CENTER */}
          {activeTab === "exports" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Download className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Authorized Dataset Export Center (CSV / JSON)
                </h2>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-xl mx-auto space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100">Select Dataset for Export</label>
                  <select
                    value={exportDataset}
                    onChange={(e) => setExportDataset(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
                  >
                    <option value="Users">Users (Workforce & Identities)</option>
                    <option value="TeamApplications">Team Applications (Recruitment)</option>
                    <option value="ContactTickets">Contact Tickets (Public Support)</option>
                    <option value="Tickets">Support Desk Tickets</option>
                    <option value="AuditLogs">Audit Logs (Immutable History)</option>
                    <option value="AnalyticsEvents">Analytics Events (Website Traffic)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100">Format</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExportFormat("json")}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2",
                        exportFormat === "json"
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      )}
                    >
                      <FileText className="size-4" /> JSON Format
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportFormat("csv")}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2",
                        exportFormat === "csv"
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      )}
                    >
                      <FileSpreadsheet className="size-4" /> CSV Format
                    </button>
                  </div>
                </div>

                {exportSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    {exportSuccess}
                  </div>
                )}

                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  <span>{exporting ? "Generating Export..." : "Execute Authorized Export"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: DELETION CENTER */}
          {activeTab === "deletion" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-2">
                  <Trash2 className="size-4 text-rose-500" />
                  Nuclear Data Operations & Destructive Subsystem Controls
                </h2>
              </div>

              {/* Security Root Protection Warning */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs space-y-2">
                <div className="font-bold flex items-center gap-2 text-sm">
                  <ShieldAlert className="size-4" />
                  Security Root Protection Active
                </div>
                <p className="leading-relaxed">
                  Protected Owner accounts (<span className="font-mono">isProtected = true</span>), security configurations, and immutable audit logs can NEVER be deleted by any deletion operation. Attempts to purge protected records are strictly rejected server-side.
                </p>
              </div>

              {/* Subsystem Operations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    subsystem: "PURGE_ANALYTICS",
                    name: "Purge Website Analytics",
                    level: "LEVEL_2",
                    desc: "Deletes all historical website event streams and analytics session records.",
                    phrase: "PURGE ANALYTICS",
                    estimate: "All AnalyticsEvents & AnalyticsSessions",
                  },
                  {
                    subsystem: "PURGE_CUSTOMER_DATA",
                    name: "Purge Customer Support Data",
                    level: "LEVEL_2",
                    desc: "Deletes all inbound contact tickets, support desk tickets, and agent message replies.",
                    phrase: "DELETE CUSTOMER DATA",
                    estimate: "All ContactTickets, Tickets & TicketMessages",
                  },
                  {
                    subsystem: "PURGE_RECRUITMENT_DATA",
                    name: "Purge Recruitment & Application Data",
                    level: "LEVEL_2",
                    desc: "Deletes all candidate career applications, resume URLs, and unaccepted recruitment keys.",
                    phrase: "DELETE RECRUITMENT DATA",
                    estimate: "All TeamApplications & unaccepted TeamInvitations",
                  },
                  {
                    subsystem: "PURGE_CONTENT_DATA",
                    name: "Purge CMS Revision Snapshots",
                    level: "LEVEL_2",
                    desc: "Deletes historical CMS block revision snapshots. Active pages & published games remain intact.",
                    phrase: "DELETE CONTENT DATA",
                    estimate: "All ContentRevisions",
                  },
                ].map((op) => (
                  <div key={op.subsystem} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{op.name}</div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold">
                        {op.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{op.desc}</p>
                    <button
                      onClick={() => {
                        setTypedPhrase("");
                        setDeletionPassword("");
                        setDeletionResult(null);
                        setDeletionModal({
                          isOpen: true,
                          level: op.level as "LEVEL_2",
                          subsystem: op.subsystem,
                          targetName: op.name,
                          expectedPhrase: op.phrase,
                          affectedEstimate: op.estimate,
                        });
                      }}
                      className="w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs"
                    >
                      Initiate Subsystem Purge
                    </button>
                  </div>
                ))}
              </div>

              {/* LEVEL 3 NUCLEAR FULL PURGE CARD */}
              <div className="p-8 rounded-3xl bg-rose-950/20 border border-rose-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-black text-lg text-rose-500 flex items-center gap-2 tracking-tight">
                      <AlertTriangle className="size-5" />
                      FULL APPLICATION DATA PURGE (NUCLEAR LEVEL 3)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      Purges all non-essential application datasets (analytics, tickets, recruitment apps, revisions, and non-owner workforce accounts). Protected Owner accounts and security infrastructure remain untouched.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setTypedPhrase("");
                      setDeletionPassword("");
                      setDeletionResult(null);
                      setDeletionModal({
                        isOpen: true,
                        level: "LEVEL_3",
                        subsystem: "FULL_APPLICATION_DATA_PURGE",
                        targetName: "Full Application Data Purge",
                        expectedPhrase: "PURGE ALL DRAGON DATA",
                        affectedEstimate: "All non-owner database records across all subsystems",
                      });
                    }}
                    className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all shadow-lg shrink-0"
                  >
                    Execute Nuclear Purge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: OWNER ACTIVITY */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Activity className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Owner Security Timeline & Audit Trail
                </h2>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                {activity.length === 0 ? (
                  <div className="py-12 text-center text-xs font-mono text-slate-400">
                    No data control activity events logged yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {activity.map((act) => (
                      <div key={act.id} className="py-3 flex items-center justify-between gap-4 font-mono">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                              {act.action}
                            </span>
                            <span>{act.actorEmail}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">{act.details}</div>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(act.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: DATA SEARCH */}
          {activeTab === "search" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Search className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Global Owner Data Search
                </h2>
              </div>

              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by email, application number, ticket ID, or user ID..."
                  className="flex-1 h-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none shadow-xs"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="h-12 px-6 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs"
                >
                  {searching ? "Searching..." : "Search Datasets"}
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {searchResults.map((res) => (
                      <div key={res.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono">
                              {res.type}
                            </span>
                            <span>{res.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{res.subtitle}</div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(res.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* DATASET INSPECTION MODAL */}
      {selectedInventory && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Database className="size-5 text-emerald-600 dark:text-emerald-400" />
                <span>Dataset Inspector: {selectedInventory.dataset}</span>
              </div>
              <button onClick={() => setSelectedInventory(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {selectedInventory.description}
              </p>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80">
                  <div className="text-slate-400 text-[10px]">Record Count</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">{selectedInventory.records.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80">
                  <div className="text-slate-400 text-[10px]">Retention Policy</div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-0.5">{selectedInventory.retentionPolicy}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80">
                  <div className="text-slate-400 text-[10px]">Oldest Record</div>
                  <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">{selectedInventory.oldestRecord ? new Date(selectedInventory.oldestRecord).toLocaleDateString() : "N/A"}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80">
                  <div className="text-slate-400 text-[10px]">Newest Record</div>
                  <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">{selectedInventory.newestRecord ? new Date(selectedInventory.newestRecord).toLocaleDateString() : "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETION CONFIRMATION MODAL */}
      {deletionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-rose-500/40 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="font-extrabold text-base text-rose-500 flex items-center gap-2">
                <AlertTriangle className="size-5" />
                <span>Confirm Destructive Operation</span>
              </div>
              <button onClick={() => setDeletionModal({ ...deletionModal, isOpen: false })} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 space-y-1">
                <div className="font-bold">{deletionModal.targetName} ({deletionModal.level})</div>
                <div className="font-mono text-[11px]">Affected Scope: {deletionModal.affectedEstimate}</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Type confirmation phrase to proceed: <span className="font-mono text-rose-500 font-extrabold">{deletionModal.expectedPhrase}</span>
                </label>
                <input
                  type="text"
                  value={typedPhrase}
                  onChange={(e) => setTypedPhrase(e.target.value)}
                  placeholder={deletionModal.expectedPhrase}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Re-enter Account Password (Fresh Auth)
                </label>
                <input
                  type="password"
                  value={deletionPassword}
                  onChange={(e) => setDeletionPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
                />
              </div>

              {deletionResult && (
                <div className={cn("p-3 rounded-xl border text-xs font-medium", deletionResult.success ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300")}>
                  {deletionResult.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setDeletionModal({ ...deletionModal, isOpen: false })}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeletion}
                disabled={deleting || typedPhrase.trim().toUpperCase() !== deletionModal.expectedPhrase.toUpperCase()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                <span>{deleting ? "Executing Purge..." : "Confirm & Execute Purge"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
