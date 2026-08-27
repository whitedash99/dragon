"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  MessagesSquare, 
  Hash, 
  Flag, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  Check, 
  X, 
  ExternalLink,
  Trash2,
  AlertTriangle,
  UserX
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassStat, GlassButton, GlassBadge } from "@/components/ui/glass";

interface AdminRoom {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  type: string;
  order: number;
  _count?: { messages: number };
}

interface AdminThread {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  category?: { name: string };
  author?: { name: string; email?: string };
  _count?: { posts: number };
}

interface AdminReport {
  id: string;
  targetType: string;
  reason: string;
  details?: string | null;
  status: string;
  createdAt: string;
  reporter?: { name: string; email: string };
  reportedUser?: { id: string; name: string; email: string; status: string } | null;
}

type TabType = "ROOMS" | "REPORTS" | "FORUMS";

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ROOMS");
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [threads, setThreads] = useState<AdminThread[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Room State
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomSlug, setNewRoomSlug] = useState("");
  const [newRoomCategory, setNewRoomCategory] = useState("COMMUNITY");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [roomsRes, threadsRes, reportsRes] = await Promise.all([
        fetch("/api/community/chat/rooms").catch(() => null),
        fetch("/api/community/forums/threads").catch(() => null),
        fetch("/api/community/reports").catch(() => null),
      ]);

      if (roomsRes?.ok) {
        const rData = await roomsRes.json();
        if (rData.success) setRooms(rData.rooms || []);
      }
      if (threadsRes?.ok) {
        const tData = await threadsRes.json();
        if (tData.success) setThreads(tData.threads || []);
      }
      if (reportsRes?.ok) {
        const repData = await reportsRes.json();
        if (repData.success) setReports(repData.reports || []);
      }
    } catch (err) {
      console.warn("Failed to load admin community data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomSlug.trim()) return;
    setCreatingRoom(true);

    try {
      const res = await fetch("/api/community/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRoomName.trim(),
          slug: newRoomSlug.trim().toLowerCase(),
          description: newRoomDesc.trim(),
          category: newRoomCategory,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowNewRoomModal(false);
        setNewRoomName("");
        setNewRoomSlug("");
        setNewRoomDesc("");
        setActionSuccess("Channel room created in PostgreSQL database.");
        setTimeout(() => setActionSuccess(null), 3000);
        fetchData();
      } else {
        alert(data.error || "Failed to create channel.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error creating channel.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleDeleteThread = async (id: string) => {
    if (!confirm("Are you sure you want to delete this forum thread?")) return;
    try {
      const res = await fetch(`/api/community/forums/threads?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActionSuccess("Forum thread deleted.");
        setTimeout(() => setActionSuccess(null), 3000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveReport = async (reportId: string, action: "DISMISS" | "BAN_USER") => {
    try {
      const res = await fetch("/api/community/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      });
      if (res.ok) {
        setActionSuccess(`Report action '${action}' recorded in database.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const pendingReportsCount = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[11px] text-cyan-300 font-bold font-mono">
                <MessagesSquare className="size-3.5 text-cyan-400" />
                <span>Dragon Community Engine & Safety</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Community Operations & Moderation
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Real-time channel management, reports triage, anti-spam enforcement, and forum moderation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                <RefreshCw className={`size-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Live</span>
              </button>

              <button
                onClick={() => setShowNewRoomModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="size-3.5 text-black" />
                <span>Create Channel</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {actionSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in duration-150">
              <Check className="size-4 text-emerald-400" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Operations KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStat
              label="Active Channels"
              value={rooms.length}
              icon={Hash}
              subtext="Chat Channels In DB"
            />
            <GlassStat
              label="Forum Discussions"
              value={threads.length}
              icon={MessagesSquare}
              subtext="Player Threads In DB"
            />
            <GlassStat
              label="Pending Reports"
              value={pendingReportsCount}
              icon={Flag}
              subtext="Safety Moderation Queue"
            />
            <GlassStat
              label="Moderation Engine"
              value="ONLINE"
              icon={ShieldCheck}
              subtext="Anti-Spam & Token Bucket"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3">
            {[
              { id: "ROOMS" as const, label: `Channels (${rooms.length})`, icon: Hash },
              { id: "REPORTS" as const, label: `Safety & Reports (${pendingReportsCount})`, icon: Flag },
              { id: "FORUMS" as const, label: `Forum Discussions (${threads.length})`, icon: MessagesSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer",
                  activeTab === tab.id
                    ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                    : "bg-[#03091D] text-slate-400 hover:text-white border border-cyan-500/20"
                )}
              >
                <tab.icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Channels Management */}
          {activeTab === "ROOMS" && (
            <div className="space-y-4">
              <GlassCard className="bg-[#03091D]/90 border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.15)] font-mono">
                <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-cyan-400">
                    Live Channel Directory ({rooms.length})
                  </h3>
                </div>

                {rooms.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">No channels created yet. Click &apos;Create Channel&apos; to add one.</div>
                ) : (
                  <div className="divide-y divide-cyan-500/10">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        className="p-4 flex items-center justify-between hover:bg-cyan-500/5 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold">
                            <Hash className="size-4" />
                          </div>
                          <div className="truncate">
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              <span>#{room.name}</span>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                                {room.category}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 truncate max-w-md">{room.description || "No description"}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-cyan-400">
                            {room._count?.messages || 0} messages
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                            ACTIVE
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {/* Tab 2: Safety & Reports */}
          {activeTab === "REPORTS" && (
            <GlassCard className="bg-[#03091D]/90 border border-cyan-500/30 p-6 font-mono space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Moderation & Player Reports ({reports.length})</h3>

              {reports.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Check className="size-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">All Reports Resolved</h4>
                  <p className="text-xs text-slate-400">Zero active player flags in the moderation queue.</p>
                </div>
              ) : (
                <div className="divide-y divide-cyan-500/10">
                  {reports.map((rep) => (
                    <div key={rep.id} className="py-3 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="text-rose-400">[{rep.reason}]</span>
                          <span>Target: {rep.targetType}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Reporter: {rep.reporter?.email || "Anonymous"} • Reported: {rep.reportedUser?.email || "Unknown"}
                        </div>
                      </div>

                      {rep.status === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResolveReport(rep.id, "DISMISS")}
                            className="px-3 py-1 bg-[#02050E] border border-cyan-500/30 text-xs text-slate-300 rounded-lg hover:text-white"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleResolveReport(rep.id, "BAN_USER")}
                            className="px-3 py-1 bg-rose-600/30 border border-rose-500/40 text-xs text-rose-300 rounded-lg hover:bg-rose-600 hover:text-white flex items-center gap-1"
                          >
                            <UserX className="size-3" />
                            <span>Ban Offender</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}

          {/* Tab 3: Forums Discussions */}
          {activeTab === "FORUMS" && (
            <GlassCard className="bg-[#03091D]/90 border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.15)] font-mono">
              <div className="p-4 border-b border-cyan-500/20">
                <h3 className="text-xs font-mono font-bold uppercase text-cyan-400">
                  Registered Discussions ({threads.length})
                </h3>
              </div>

              {threads.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No forum threads registered in database yet.</div>
              ) : (
                <div className="divide-y divide-cyan-500/10">
                  {threads.map((t) => (
                    <div key={t.id} className="p-4 flex items-center justify-between hover:bg-cyan-500/5">
                      <div className="space-y-1 min-w-0 pr-4">
                        <div className="font-bold text-sm text-white truncate">{t.title}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          Author: @{t.author?.name || t.author?.email || "Member"} • Category: {t.category?.name || "General"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-cyan-400">
                          {t._count?.posts || 0} Replies
                        </span>
                        <button
                          onClick={() => handleDeleteThread(t.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Thread"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}
        </main>
      </div>

      {/* ═══ Create Channel Modal ═══ */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#03091D] border border-cyan-500/35 rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-sm uppercase text-white tracking-wide">
                Create Community Channel
              </h3>
              <button
                onClick={() => setShowNewRoomModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Channel Name *
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => {
                    setNewRoomName(e.target.value);
                    setNewRoomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  placeholder="e.g. gameplay-clips"
                  required
                  className="w-full rounded-xl bg-[#02050E] border border-cyan-500/30 p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Channel Slug *
                </label>
                <input
                  type="text"
                  value={newRoomSlug}
                  onChange={(e) => setNewRoomSlug(e.target.value)}
                  placeholder="e.g. gameplay-clips"
                  required
                  className="w-full rounded-xl bg-[#02050E] border border-cyan-500/30 p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Category
                </label>
                <select
                  value={newRoomCategory}
                  onChange={(e) => setNewRoomCategory(e.target.value)}
                  className="w-full rounded-xl bg-[#02050E] border border-cyan-500/30 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="COMMUNITY">COMMUNITY</option>
                  <option value="INFORMATION">INFORMATION</option>
                  <option value="GAMES">GAMES</option>
                  <option value="OFF_TOPIC">OFF_TOPIC</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Description
                </label>
                <textarea
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="Topic and purpose of this channel..."
                  rows={2}
                  className="w-full rounded-xl bg-[#02050E] border border-cyan-500/30 p-2.5 text-xs text-white placeholder:text-slate-600 resize-none focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setShowNewRoomModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingRoom}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.35)] cursor-pointer"
                >
                  {creatingRoom ? "Creating..." : "Create Channel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
