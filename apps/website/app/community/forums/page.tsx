"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ThumbsUp, 
  Eye, 
  Check, 
  X, 
  Pin, 
  User,
  Tag,
  Clock,
  Sparkles,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Gamepad2,
  BookOpen,
  Image as ImageIcon,
  Lightbulb,
  AlertTriangle
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useSession, signIn } from "next-auth/react";

interface ForumCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  _count?: { threads: number };
}

interface ForumThreadItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags?: string;
  isPinned: boolean;
  isLocked: boolean;
  viewsCount: number;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color?: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
    image?: string;
    role?: string;
  };
  _count?: {
    posts: number;
    bookmarks: number;
  };
}

export default function CommunityForumsPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<ForumCategoryItem[]>([]);
  const [threads, setThreads] = useState<ForumThreadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Thread Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected thread discussion view
  const [selectedThread, setSelectedThread] = useState<ForumThreadItem | null>(null);
  const [threadPosts, setThreadPosts] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL("/api/community/forums/threads", window.location.origin);
      if (selectedCat !== "all") url.searchParams.set("category", selectedCat);
      if (searchQuery) url.searchParams.set("q", searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
          setThreads(data.threads || []);
          if (data.categories?.length > 0 && !newCategoryId) {
            setNewCategoryId(data.categories[0].id);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch forum threads:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCat, searchQuery, newCategoryId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleOpenThread = async (thread: ForumThreadItem) => {
    setSelectedThread(thread);
    try {
      const res = await fetch(`/api/community/forums/posts?threadId=${thread.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setThreadPosts(data.posts || []);
        }
      }
    } catch (err) {
      console.warn("Failed to load thread posts:", err);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newCategoryId) return;

    setIsSubmitting(true);
    try {
      const tagsArray = newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/community/forums/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: newCategoryId,
          title: newTitle.trim(),
          content: newContent.trim(),
          tags: tagsArray,
        }),
      });

      const data = await res.json();
      if (data.success && data.thread) {
        setThreads((prev) => [data.thread, ...prev]);
        setIsModalOpen(false);
        setNewTitle("");
        setNewContent("");
        setNewTags("");
      }
    } catch (err) {
      console.error("Create thread error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedThread) return;

    setIsReplying(true);
    try {
      const res = await fetch("/api/community/forums/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedThread.id,
          content: replyContent.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.post) {
        setThreadPosts((prev) => [...prev, data.post]);
        setReplyContent("");
      }
    } catch (err) {
      console.error("Create reply error:", err);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24">
        <CommunityNav />

        <section className="container-site relative z-10 my-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
                Community Forums & Dispatches
              </span>
              <h1 className="text-3xl font-heading font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5">
                Player & Developer Discussions
              </h1>
            </div>

            {session?.user ? (
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="glow"
                size="sm"
                className="rounded-full gap-2 text-xs font-bold"
              >
                <Plus className="size-4" />
                <span>Create New Discussion</span>
              </Button>
            ) : (
              <Button
                onClick={() => signIn()}
                variant="glow"
                size="sm"
                className="rounded-full gap-2 text-xs font-bold"
              >
                <User className="size-4" />
                <span>Sign In to Post</span>
              </Button>
            )}
          </div>

          {/* Controls & Search Bar */}
          <div className="rounded-2xl bg-[#07111F]/80 backdrop-blur-xl p-4 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
              <input
                type="text"
                placeholder="Search forum topics, keywords, or build guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-[#0B132B] pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 border border-blue-500/30 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCat("all")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                  selectedCat === "all"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                    : "bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800"
                )}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.slug)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                    selectedCat === cat.slug
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                      : "bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Threads Stream */}
          <div className="grid gap-4">
            {loading ? (
              <div className="p-12 text-center space-y-3">
                <div className="size-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs text-slate-400 font-mono">Loading discussions from Neon DB...</div>
              </div>
            ) : threads.length === 0 ? (
              <div className="rounded-3xl bg-[#07111F]/80 p-12 text-center border border-blue-500/20 space-y-3">
                <div className="size-12 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <MessageSquare className="size-6" />
                </div>
                <h3 className="text-base font-bold text-white">No discussions found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Be the first to start a conversation in this category!
                </p>
              </div>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => handleOpenThread(thread)}
                  className="rounded-2xl bg-[#07111F]/80 backdrop-blur-xl p-5 sm:p-6 border border-blue-500/20 hover:border-cyan-400/50 transition-all cursor-pointer group shadow-lg shadow-black/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {thread.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Pin className="size-3" />
                            <span>PINNED</span>
                          </span>
                        )}
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600/20 text-cyan-300 border border-blue-500/30 uppercase">
                          {thread.category?.name || "General"}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {thread.title}
                      </h3>

                      <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                        {thread.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <User className="size-3.5 text-cyan-400" />
                          <span>{thread.author?.name || "Dragon Insider"}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="size-3.5 text-blue-400" />
                          <span>{thread._count?.posts || 0} Replies</span>
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 p-2 rounded-xl bg-blue-950/40 text-slate-400 group-hover:text-cyan-300 group-hover:bg-blue-600/20 transition-all">
                      <ArrowUpRight className="size-5" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* ═══ Thread Inspection & Reply Drawer Modal ═══ */}
      {selectedThread && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#07111F] border border-blue-500/30 rounded-3xl p-6 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Thread Header */}
            <div className="flex items-start justify-between border-b border-blue-500/20 pb-4 mb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600/20 text-cyan-300 border border-blue-500/30 uppercase">
                  {selectedThread.category?.name}
                </span>
                <h2 className="text-xl font-heading font-black text-white">{selectedThread.title}</h2>
                <div className="text-xs text-slate-400 font-mono">
                  Posted by <strong className="text-cyan-300">@{selectedThread.author?.name}</strong> on{" "}
                  {new Date(selectedThread.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedThread(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Thread Content */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              <div className="p-4 rounded-2xl bg-[#0B132B] border border-blue-500/20 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedThread.content}
              </div>

              {/* Replies Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Discussion Replies ({threadPosts.length})
                </h4>

                {threadPosts.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#0B132B]/50 border border-slate-800 text-center text-xs text-slate-500 font-mono">
                    No replies yet. Share your thoughts below!
                  </div>
                ) : (
                  threadPosts.map((post) => (
                    <div key={post.id} className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-300">@{post.author?.name || "Member"}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 font-sans whitespace-pre-wrap">{post.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleCreateReply} className="mt-4 pt-4 border-t border-blue-500/20 flex gap-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply to this discussion..."
                rows={2}
                maxLength={5000}
                className="flex-1 rounded-2xl bg-[#0B132B] border border-blue-500/30 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none font-sans"
              />
              <button
                type="submit"
                disabled={!replyContent.trim() || isReplying}
                className="px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:opacity-90 disabled:opacity-50"
              >
                {isReplying ? "Posting..." : "Reply"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Create Discussion Modal ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#07111F] border border-blue-500/30 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
              <h3 className="font-heading font-black text-sm uppercase text-white tracking-wide">
                Start New Discussion
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Discussion Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., Embers of Valyria: Stance Parry Frame Data..."
                  required
                  maxLength={150}
                  className="w-full rounded-xl bg-[#0B132B] border border-blue-500/30 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Category
                </label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full rounded-xl bg-[#0B132B] border border-blue-500/30 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Content / Transmission
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details, code snippets, or discussion points..."
                  required
                  rows={4}
                  maxLength={10000}
                  className="w-full rounded-xl bg-[#0B132B] border border-blue-500/30 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Guides, Netcode, FrameData, PC"
                  className="w-full rounded-xl bg-[#0B132B] border border-blue-500/30 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-500/25"
                >
                  {isSubmitting ? "Publishing..." : "Publish Discussion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </SceneBackground>
  );
}
