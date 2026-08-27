"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MessagesSquare,
  Hash,
  Send,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
  Search,
  MessageCircle,
  CheckCircle2,
  Crown,
  ShieldCheck,
  Code,
  Tag,
  ArrowUpRight,
  Flame,
  Radio,
  Eye,
  CornerDownRight,
  User,
  X
} from "lucide-react";
import { cn } from "@/lib/cn";
import { soundFx } from "@/lib/sound-effects";

interface RoomItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
}

interface ThreadItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  category?: { name: string };
  author?: { name: string; email?: string; role?: string; avatar?: string };
  _count?: { posts: number };
}

interface MemberItem {
  clientId: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string | null;
  status: string;
}

interface ChatMsg {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: string;
  };
}

const DASHBOARD_ROOMS: RoomItem[] = [
  { id: "room_general", name: "general", slug: "general", description: "Main player lobby for Dragon Studios gamers.", category: "COMMUNITY" },
  { id: "room_gaming", name: "gaming", slug: "gaming", description: "Highway speed builds, vehicle tuning, and driving chat.", category: "COMMUNITY" },
  { id: "room_clips", name: "gameplay-clips", slug: "gameplay-clips", description: "Share 4K drifting clips and speed records.", category: "COMMUNITY" },
  { id: "room_suggestions", name: "suggestions", slug: "suggestions", description: "Pitch track and car ideas directly to studio devs.", category: "COMMUNITY" },
];

export function DragonCommunityHub({ currentUser }: { currentUser: any }) {
  const [subTab, setSubTab] = useState<"chat" | "forum" | "roster">("chat");

  // Chat State
  const [rooms, setRooms] = useState<RoomItem[]>(DASHBOARD_ROOMS);
  const [activeRoom, setActiveRoom] = useState<RoomItem>(DASHBOARD_ROOMS[0]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Forum State
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [forumLoading, setForumLoading] = useState(false);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [creatingThread, setCreatingThread] = useState(false);

  // Selected Thread View
  const [activeThread, setActiveThread] = useState<ThreadItem | null>(null);
  const [threadPosts, setThreadPosts] = useState<any[]>([]);
  const [replyInput, setReplyInput] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Members State
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  // 1. Fetch Real Chat Messages
  const fetchMessages = useCallback(async () => {
    setChatLoading(true);
    try {
      const res = await fetch(`/api/community/chat/messages?roomId=${activeRoom.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      }
    } catch (e) {
      console.warn("Chat fetch notice:", e);
    } finally {
      setChatLoading(false);
    }
  }, [activeRoom.id]);

  // 2. Fetch Real Forum Threads
  const fetchThreads = useCallback(async () => {
    setForumLoading(true);
    try {
      const res = await fetch("/api/community/forums/threads");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.threads)) {
          setThreads(data.threads);
        }
      }
    } catch (e) {
      console.warn("Forum fetch notice:", e);
    } finally {
      setForumLoading(false);
    }
  }, []);

  // 3. Fetch Real Community Members
  const fetchMembers = useCallback(async () => {
    setMembersLoading(true);
    try {
      const res = await fetch("/api/community/chat/members");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.members)) {
          setMembers(data.members);
        }
      }
    } catch (e) {
      console.warn("Members fetch notice:", e);
    } finally {
      setMembersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subTab === "chat") fetchMessages();
    if (subTab === "forum") fetchThreads();
    if (subTab === "roster") fetchMembers();
  }, [subTab, fetchMessages, fetchThreads, fetchMembers]);

  // Handle Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    soundFx.playClick();
    const text = msgInput.trim();
    setMsgInput("");

    const optimistic: ChatMsg = {
      id: `temp-${Date.now()}`,
      content: text,
      createdAt: new Date().toISOString(),
      user: {
        name: currentUser?.gamerTag || currentUser?.name || currentUser?.email?.split("@")[0] || "Operative",
        email: currentUser?.email,
        role: currentUser?.role || "PLAYER",
      },
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/community/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: activeRoom.id,
          content: text,
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? data.message : m)));
      }
    } catch (err) {
      console.warn("Send message error:", err);
    }
  };

  // Handle Create Forum Thread
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    setCreatingThread(true);
    try {
      const res = await fetch("/api/community/forums/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newThreadTitle.trim(),
          content: newThreadContent.trim(),
          tags: ["Discussion", "Gameplay"],
        }),
      });
      const data = await res.json();
      if (data.success && data.thread) {
        setThreads((prev) => [data.thread, ...prev]);
        setShowNewThreadModal(false);
        setNewThreadTitle("");
        setNewThreadContent("");
      }
    } catch (err) {
      console.warn("Create thread error:", err);
    } finally {
      setCreatingThread(false);
    }
  };

  // Handle View Thread & Replies
  const handleOpenThread = async (thread: ThreadItem) => {
    setActiveThread(thread);
    try {
      const res = await fetch(`/api/community/forums/posts?threadId=${thread.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setThreadPosts(data.posts || []);
      }
    } catch (e) {
      console.warn("Load posts error:", e);
    }
  };

  // Handle Send Forum Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeThread) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/community/forums/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: activeThread.id,
          content: replyInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setThreadPosts((prev) => [...prev, data.post]);
        setReplyInput("");
      }
    } catch (e) {
      console.warn("Reply error:", e);
    } finally {
      setSendingReply(false);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Top Hub Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,229,255,0.15)] relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-[11px] text-cyan-300 font-bold uppercase tracking-wider">
            <Radio className="size-3.5 text-cyan-400 animate-pulse" />
            <span>Dragon Operative Mesh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Community & Forum Hub
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Real-time multi-channel chat, tactical discussions, and operative networking with zero lag.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 relative z-10 flex-wrap">
          {[
            { id: "chat" as const, label: "Live Chat", icon: MessagesSquare },
            { id: "forum" as const, label: "Forums", icon: MessageCircle },
            { id: "roster" as const, label: "Operative Roster", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSubTab(tab.id);
                soundFx.playClick();
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                subTab === tab.id
                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                  : "bg-[#02050E] text-slate-400 hover:text-white border border-cyan-500/20"
              )}
            >
              <tab.icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. LIVE CHAT ARENA TAB                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === "chat" && (
        <div className="grid grid-cols-12 gap-4 h-[600px] max-h-[75vh] rounded-3xl bg-[#03091D]/95 border border-cyan-500/30 overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.15)]">
          {/* Left: Channel Selector */}
          <div className="col-span-12 md:col-span-3 bg-[#02050E] border-r border-cyan-500/20 p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block px-2">
                CHANNELS
              </span>
              <div className="space-y-1">
                {rooms.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRoom(r);
                      soundFx.playClick();
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer",
                      activeRoom.id === r.id
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Hash className="size-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{r.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#03091D] border border-cyan-500/20 space-y-1 text-[11px]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Authenticated As</span>
              <span className="font-bold text-white block truncate">
                @{currentUser?.gamerTag || currentUser?.name || currentUser?.email?.split("@")[0] || "Operative"}
              </span>
            </div>
          </div>

          {/* Center/Right: Chat Stream */}
          <div className="col-span-12 md:col-span-9 flex flex-col justify-between h-full bg-[#02050E]/60 p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Hash className="size-4 text-cyan-400" />
                <span className="font-bold text-sm text-white uppercase">{activeRoom.name}</span>
                <span className="text-xs text-slate-400 font-sans hidden sm:inline">• {activeRoom.description}</span>
              </div>
              <button
                onClick={fetchMessages}
                className="p-1.5 rounded-lg bg-[#02050E] border border-cyan-500/20 text-cyan-400 hover:text-white"
                title="Refresh Chat"
              >
                <RefreshCw className={cn("size-3.5", chatLoading && "animate-spin")} />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin scrollbar-thumb-cyan-500/20">
              {messages.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <MessagesSquare className="size-8 text-cyan-400/40 mx-auto" />
                  <div className="text-xs text-slate-400">No messages in #{activeRoom.name} yet.</div>
                  <div className="text-[11px] text-cyan-400">Be the first operative to post!</div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div className="size-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black text-black text-xs shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                      {(msg.user?.name || msg.user?.email || "P")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          {msg.user?.name || msg.user?.email?.split("@")[0] || "Operative"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed break-words">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Composer */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-cyan-500/20">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder={`Transmit to #${activeRoom.name}...`}
                className="flex-1 rounded-xl bg-[#02050E] border border-cyan-500/30 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="submit"
                disabled={!msgInput.trim() || sendingMsg}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer disabled:opacity-40"
              >
                <Send className="size-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. FORUMS & DISCUSSIONS TAB                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === "forum" && (
        <div className="space-y-4">
          {!activeThread ? (
            <div className="rounded-3xl bg-[#03091D]/90 border border-cyan-500/30 p-6 space-y-4 shadow-[0_0_40px_rgba(0,229,255,0.15)]">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageCircle className="size-4 text-cyan-400" />
                  <span>Tactical Forum Ledger ({threads.length})</span>
                </h3>

                <button
                  onClick={() => setShowNewThreadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.35)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Plus className="size-3.5 text-black" />
                  <span>Start Discussion</span>
                </button>
              </div>

              {forumLoading ? (
                <div className="py-16 text-center text-cyan-400 text-xs animate-pulse">
                  Querying forum threads from PostgreSQL...
                </div>
              ) : threads.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <MessageCircle className="size-8 text-cyan-400/40 mx-auto" />
                  <div className="text-xs text-slate-400">No discussion threads found in database.</div>
                  <div className="text-[11px] text-cyan-400">Click &apos;Start Discussion&apos; to create the first topic!</div>
                </div>
              ) : (
                <div className="divide-y divide-cyan-500/10">
                  {threads.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleOpenThread(t)}
                      className="py-4 flex items-center justify-between hover:bg-cyan-500/5 px-3 rounded-2xl transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0 pr-4">
                        <div className="font-bold text-sm text-white hover:text-cyan-300 transition-colors truncate">
                          {t.title}
                        </div>
                        <div className="text-xs text-slate-400 font-sans line-clamp-1">
                          {t.content}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-0.5">
                          <span>Author: @{t.author?.name || t.author?.email?.split("@")[0] || "Operative"}</span>
                          <span>•</span>
                          <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30">
                          {t._count?.posts || 0} Replies
                        </span>
                        <ArrowUpRight className="size-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Selected Thread Discussion View */
            <div className="rounded-3xl bg-[#03091D]/90 border border-cyan-500/30 p-6 space-y-6 shadow-[0_0_40px_rgba(0,229,255,0.15)]">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <button
                  onClick={() => setActiveThread(null)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-white cursor-pointer font-bold"
                >
                  <span>← Back to All Discussions</span>
                </button>

                <span className="text-xs text-slate-400">
                  {new Date(activeThread.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Main Thread Body */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  {activeThread.title}
                </h3>
                <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                  {activeThread.content}
                </div>
              </div>

              {/* Replies Section */}
              <div className="space-y-3 border-t border-cyan-500/20 pt-4">
                <h4 className="font-bold text-xs text-cyan-400 uppercase tracking-wider">
                  Operative Responses ({threadPosts.length})
                </h4>

                {threadPosts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No replies yet. Be the first to answer!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {threadPosts.map((p) => (
                      <div key={p.id} className="p-3.5 rounded-2xl bg-[#02050E] border border-cyan-500/10 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-cyan-300">
                            @{p.author?.name || p.author?.email?.split("@")[0] || "Operative"}
                          </span>
                          <span className="text-slate-500">
                            {new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">{p.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Write a response..."
                    className="flex-1 rounded-xl bg-[#02050E] border border-cyan-500/30 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!replyInput.trim() || sendingReply}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Reply
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. OPERATIVE ROSTER TAB                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === "roster" && (
        <div className="rounded-3xl bg-[#03091D]/90 border border-cyan-500/30 p-6 space-y-4 shadow-[0_0_40px_rgba(0,229,255,0.15)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="size-4 text-cyan-400" />
              <span>Real Operative Directory ({members.length})</span>
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-cyan-400" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search operative handle..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#02050E] border border-cyan-500/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {membersLoading ? (
            <div className="py-16 text-center text-cyan-400 text-xs animate-pulse">
              Querying operative accounts from PostgreSQL...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No registered operatives found matching search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredMembers.map((m) => {
                const isOwner = m.role === "OWNER" || m.role === "FOUNDER";
                return (
                  <div key={m.userId} className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black text-black text-sm shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                      {(m.name || m.email)[0].toUpperCase()}
                    </div>
                    <div className="truncate flex-1">
                      <div className="font-bold text-white text-xs flex items-center gap-1.5 truncate">
                        <span>{m.name}</span>
                        {isOwner && <Crown className="size-3 text-amber-400 shrink-0" />}
                      </div>
                      <div className="text-[10px] text-cyan-400/80 truncate">{m.department || "Operative"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ Create Forum Thread Modal ═══ */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="font-bold text-white text-sm uppercase">
                Create Discussion Topic
              </span>
              <button onClick={() => setShowNewThreadModal(false)} className="text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-3 text-xs">
              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Topic Title *</label>
                <input
                  type="text"
                  required
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="e.g. Best drift angle on mountain curve 4"
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Discussion Body *</label>
                <textarea
                  required
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  placeholder="Share your vehicle settings, advice, or feedback..."
                  rows={4}
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingThread}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.35)] cursor-pointer"
                >
                  {creatingThread ? "Publishing..." : "Publish Topic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
