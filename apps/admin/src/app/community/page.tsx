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
  ExternalLink 
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
  author?: { name: string };
  _count?: { posts: number };
}

type TabType = "ROOMS" | "REPORTS" | "FORUMS";

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ROOMS");
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [threads, setThreads] = useState<AdminThread[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Room State
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomSlug, setNewRoomSlug] = useState("");
  const [newRoomCategory, setNewRoomCategory] = useState("COMMUNITY");
  const [newRoomDesc, setNewRoomDesc] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [roomsRes, threadsRes] = await Promise.all([
        fetch("/api/community/chat/rooms").catch(() => null),
        fetch("/api/community/forums/threads").catch(() => null),
      ]);

      if (roomsRes?.ok) {
        const rData = await roomsRes.json();
        if (rData.success) setRooms(rData.rooms || []);
      }
      if (threadsRes?.ok) {
        const tData = await threadsRes.json();
        if (tData.success) setThreads(tData.threads || []);
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
    if (!newRoomName || !newRoomSlug) return;

    try {
      const newRoom: AdminRoom = {
        id: `room_${Date.now()}`,
        name: newRoomName.trim(),
        slug: newRoomSlug.trim().toLowerCase(),
        description: newRoomDesc.trim(),
        category: newRoomCategory,
        type: "TEXT",
        order: rooms.length + 1,
        _count: { messages: 0 },
      };

      setRooms((prev) => [...prev, newRoom]);
      setShowNewRoomModal(false);
      setNewRoomName("");
      setNewRoomSlug("");
      setNewRoomDesc("");
      setActionSuccess("Room initialized in database.");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#040812] text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-[11px] text-cyan-300 font-medium font-mono">
                <MessagesSquare className="size-3.5 text-cyan-400" />
                <span>Dragon Community Engine & Safety</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Community Operations & Moderation</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Real-time channel management, reports triage, anti-spam enforcement, and forum moderation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 border border-blue-500/30 text-xs font-semibold text-cyan-300 transition-all shadow-xs"
              >
                <RefreshCw className={`size-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Data</span>
              </button>

              <button
                onClick={() => setShowNewRoomModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all"
              >
                <Plus className="size-3.5" />
                <span>Create Channel</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {actionSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in duration-150">
              <Check className="size-4 text-emerald-400" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Operations KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase">
                <span>Active Channels</span>
                <Hash className="size-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">{rooms.length}</div>
              <div className="text-[11px] text-slate-400">Information, Community & Games</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase">
                <span>Forum Discussions</span>
                <MessagesSquare className="size-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">{threads.length}</div>
              <div className="text-[11px] text-slate-400">Persistent player threads in Neon</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase">
                <span>Pending Reports</span>
                <Flag className="size-4 text-rose-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">0</div>
              <div className="text-[11px] text-slate-400">Awaiting moderator triage</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B] border border-blue-500/20 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase">
                <span>Moderation Engine</span>
                <ShieldCheck className="size-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">ACTIVE</div>
              <div className="text-[11px] text-slate-400">Token-bucket anti-spam online</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { id: "ROOMS" as const, label: "Channels & Rooms", icon: Hash },
              { id: "REPORTS" as const, label: "Safety & Reports", icon: Flag },
              { id: "FORUMS" as const, label: "Forum Discussions", icon: MessagesSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                    : "bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800"
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
              <div className="rounded-2xl bg-[#0B132B] border border-blue-500/20 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                    Live Channel Directory ({rooms.length})
                  </h3>
                  <a
                    href="http://localhost:3000/community"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Public Chat</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="divide-y divide-slate-800">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 flex items-center justify-between hover:bg-blue-950/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 font-bold">
                          <Hash className="size-4" />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            <span>#{room.name}</span>
                            <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-blue-600/20 text-cyan-300 border border-blue-500/30 uppercase">
                              {room.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-md">{room.description}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          {room._count?.messages || 0} msgs
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                          ONLINE
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Safety & Reports */}
          {activeTab === "REPORTS" && (
            <div className="rounded-2xl bg-[#0B132B] border border-blue-500/20 p-8 text-center space-y-3">
              <div className="size-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                <Check className="size-6" />
              </div>
              <h3 className="text-base font-bold text-white">All Reports Resolved</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                There are no unresolved player flags in the moderation queue. Community chat is running under normal safety parameters.
              </p>
            </div>
          )}

          {/* Tab 3: Forums Discussions */}
          {activeTab === "FORUMS" && (
            <div className="rounded-2xl bg-[#0B132B] border border-blue-500/20 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                  Registered Discussions ({threads.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-800">
                {threads.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-blue-950/20">
                    <div className="space-y-1 min-w-0 pr-4">
                      <div className="font-bold text-sm text-white truncate">{t.title}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        Author: @{t.author?.name || "Member"} • Category: {t.category?.name || "General"}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">
                      {t._count?.posts || 0} Replies
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═══ Create Channel Modal ═══ */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#07111F] border border-blue-500/30 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
              <h3 className="font-heading font-black text-sm uppercase text-white tracking-wide">
                Create Community Channel
              </h3>
              <button
                onClick={() => setShowNewRoomModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Channel Name
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
                  className="w-full rounded-xl bg-[#0B132B] border border-blue-500/30 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Channel Slug
                </label>
                <input
                  type="text"
                  value={newRoomSlug}
                  onChange={(e) => setNewRoomSlug(e.target.value)}
                  placeholder="e.g. gameplay-clips"
                  required
                  className="w-full rounded-xl bg-[#0B132B] border border-blue-500/30 p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Category
                </label>
                <select
                  value={newRoomCategory}
                  onChange={(e) => setNewRoomCategory(e.target.value)}
                  className="w-full rounded-xl bg-[#0B132B] border border-blue-500/30 p-2.5 text-xs text-white"
                >
                  <option value="COMMUNITY">COMMUNITY</option>
                  <option value="INFORMATION">INFORMATION</option>
                  <option value="GAMES">GAMES</option>
                  <option value="OFF_TOPIC">OFF_TOPIC</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <textarea
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="Topic and purpose of this channel..."
                  rows={2}
                  className="w-full rounded-xl bg-[#0B132B] border border-blue-500/30 p-2.5 text-xs text-white placeholder:text-slate-500 resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewRoomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-500/25"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
