"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ThumbsUp, 
  Eye, 
  Check, 
  X, 
  Save, 
  Pin, 
  User 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { forumThreads, ForumThread } from "@/data/communityData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function CommunityForumsPage() {
  const [threads, setThreads] = useState<ForumThread[]>(forumThreads);
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ForumThread["category"]>("General");
  const [excerpt, setExcerpt] = useState("");

  const filteredThreads = threads.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(query.toLowerCase()) || t.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCat === "All" || t.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleUpvote = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likesCount: t.likesCount + 1 } : t))
    );
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    const newThread: ForumThread = {
      id: `th-${Date.now()}`,
      slug: "new-discussion-thread",
      title,
      category,
      author: {
        name: "Kaelen Voss",
        avatar: "KV",
        role: "Insiders Elite",
      },
      excerpt,
      repliesCount: 0,
      likesCount: 1,
      viewsCount: 12,
      timestamp: "Just now",
    };
    setThreads([newThread, ...threads]);
    setIsModalOpen(false);
    setTitle("");
    setExcerpt("");
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <CommunityNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12">
        <section className="container-site relative z-10">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                Community Forums & Dispatches
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5">
                Player Discussions
              </h1>
            </div>

            <Button onClick={() => setIsModalOpen(true)} variant="glow" size="sm" className="rounded-full gap-2 text-xs">
              <Plus className="size-4" />
              <span>Create New Discussion</span>
            </Button>
          </div>

          {/* Controls Bar */}
          <div className="rounded-2xl glass-heavy p-4 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search forum threads by title or topic..."
                className="w-full rounded-xl bg-black/40 px-3.5 py-2.5 pl-10 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {["All", "General", "Embers of Valyria", "Neon Drift", "Blacksite Zero", "Chronos Protocol", "Engine Dev"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
                    selectedCat === cat ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Forum Threads List */}
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className="rounded-3xl glass-heavy p-6 border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/25 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {thread.pinned && (
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Pin className="size-3" />
                        <span>PINNED</span>
                      </span>
                    )}
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/10">
                      {thread.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white hover:text-dragon-300 transition-colors cursor-pointer">
                    {thread.title}
                  </h2>

                  <p className="text-xs text-muted-foreground leading-relaxed">{thread.excerpt}</p>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-dragon-400 to-neon-purple text-xs font-bold text-white">
                      {thread.author.avatar}
                    </div>
                    <div>
                      <span className="block font-bold text-white text-xs">{thread.author.name}</span>
                      <span className="text-[10px] text-dragon-400 font-mono">{thread.author.role}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => handleUpvote(thread.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white hover:bg-white/10 transition-colors border border-white/5 mb-1"
                    >
                      <ThumbsUp className="size-3.5 text-dragon-400" />
                      <span>{thread.likesCount}</span>
                    </button>
                    <span className="block text-[10px] font-mono text-muted-foreground">{thread.repliesCount} replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* New Discussion Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl glass-heavy p-8 border border-white/20"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-5" />
              </button>

              <h2 className="text-2xl font-black uppercase text-white">Start New Discussion</h2>
              <p className="text-xs text-muted-foreground mt-1">Post a topic or question to the Dragon Studios community.</p>

              <form onSubmit={handleCreateThread} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Thread Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Discussion title..."
                    className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none focus:border-dragon-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none"
                  >
                    <option value="General">General Discussion</option>
                    <option value="Embers of Valyria">Embers of Valyria</option>
                    <option value="Neon Drift">Neon Drift: Overdrive</option>
                    <option value="Blacksite Zero">Blacksite Zero</option>
                    <option value="Chronos Protocol">Chronos Protocol</option>
                    <option value="Engine Dev">Dragon Engine Dev</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Content / Excerpt</label>
                  <textarea
                    rows={4}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Share your thoughts, strategies, or questions..."
                    className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none focus:border-dragon-400"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <Button type="button" onClick={() => setIsModalOpen(false)} variant="ghost" size="sm">
                    Cancel
                  </Button>
                  <Button type="submit" variant="glow" size="sm" className="rounded-full gap-2">
                    <Save className="size-3.5" />
                    <span>Post Thread</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </SceneBackground>
  );
}
