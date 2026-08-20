"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Plus, Newspaper, Check, Trash2, Edit3, Calendar, Clock } from "lucide-react";

interface ArticleItem {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  author: string;
  readTime: string;
  featured: boolean;
}

interface CMSBlogManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CMSBlogManagerModal({ isOpen, onClose }: CMSBlogManagerModalProps) {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tag, setTag] = useState("Studio News");
  const [author, setAuthor] = useState("Dragon Studios Editorial");
  const [readTime, setReadTime] = useState("4 min read");
  const [featured, setFeatured] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setArticles(data.articles);
      }
    } catch (e) {
      console.error("Fetch articles error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchArticles();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGeminiGenerateArticle = async () => {
    setAiGenerating(true);
    const promptText =
      aiPrompt ||
      "Generate an exciting studio announcement about the new Dragon Slayer 3D engine physics and multi-branch melee combat update.";

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cms_rewrite",
          prompt: `You are writing a gaming studio blog dispatch. Title and Excerpt based on: "${promptText}". Format response as:
TITLE: <punchy headline>
EXCERPT: <2-3 sentence overview>`,
        }),
      });
      const data = await res.json();
      const text = data.result || data.completion;
      if (text) {
        const titleMatch = text.match(/TITLE:\s*(.+)/i);
        const excerptMatch = text.match(/EXCERPT:\s*([\s\S]+)/i);

        if (titleMatch && titleMatch[1]) {
          setTitle(titleMatch[1].replace(/[*#"]/g, "").trim());
        }
        if (excerptMatch && excerptMatch[1]) {
          setExcerpt(excerptMatch[1].replace(/[*#"]/g, "").trim());
        }
      }
    } catch {
      setTitle("DRAGON SLAYER 3D: ADVANCED MELEE COMBAT OVERHAUL");
      setExcerpt("Experience ultra-fluid swordplay, aerial dragon mounting, and 14ms edge-synchronized multiplayer netcode.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsPublishing(true);
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          tag,
          author,
          readTime,
          featured,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Article published to Neon PostgreSQL successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
        setTitle("");
        setExcerpt("");
        fetchArticles();
      }
    } catch (e) {
      console.error("Create article failed", e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteArticle = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this article from Neon PostgreSQL?")) return;

    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error("Delete article error", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-3xl bg-[#040D24] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Newspaper className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg uppercase tracking-wider">
                CMS Blog & News Studio
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Draft, generate with Gemini AI, and publish articles directly to the website.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#020718] border border-cyan-500/30 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Gemini AI Article Prompter */}
        <div className="p-4 rounded-2xl bg-[#020718] border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold uppercase text-cyan-300">
                ✦ Gemini AI Article Generator
              </span>
            </div>
            <button
              type="button"
              onClick={handleGeminiGenerateArticle}
              disabled={aiGenerating}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-mono font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{aiGenerating ? "Drafting..." : "Generate Article"}</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Topic (e.g. Announcing Dragon Studios 120 FPS high-refresh mobile test build)..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#01040D] border border-cyan-500/20 text-xs text-white placeholder-slate-500 font-sans focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Create Article Form */}
        <form onSubmit={handleCreateArticle} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
                Article Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DRAGON STUDIOS EXPANDS WITH NEW ENGINE ARCHITECTURE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white font-sans focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
                Category Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="Studio News">Studio News</option>
                <option value="Dev Dispatch">Dev Dispatch</option>
                <option value="Patch Notes">Patch Notes</option>
                <option value="Tech Deep Dive">Tech Deep Dive</option>
                <option value="Community">Community</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
              Article Excerpt / Summary
            </label>
            <textarea
              required
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Enter article synopsis..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white font-sans placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded bg-[#01040D] border-cyan-500/40 text-cyan-400 focus:ring-0"
                />
                <span className="text-xs font-mono text-slate-300">Featured Article</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isPublishing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Check className="size-4" />
                <span>{isPublishing ? "Publishing..." : "Publish Article Live"}</span>
              </button>
            </div>
          </div>

          {successMsg && (
            <p className="text-xs font-mono text-emerald-400 text-center font-bold">
              {successMsg}
            </p>
          )}
        </form>

        {/* Existing Articles in Neon DB */}
        <div className="pt-4 border-t border-cyan-500/20 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Articles in Neon Database ({articles.length}):
          </span>

          {loading ? (
            <div className="py-6 text-center font-mono text-xs text-slate-500">
              Loading articles from Neon...
            </div>
          ) : articles.length === 0 ? (
            <div className="py-6 text-center font-mono text-xs text-slate-500">
              No articles found in database. Create your first article above!
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {articles.map((a) => (
                <div
                  key={a.id || a.slug}
                  className="p-3 rounded-2xl bg-[#01040D] border border-cyan-500/20 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[9px] font-bold">
                        {a.tag}
                      </span>
                      {a.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[9px] font-bold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-xs text-white truncate">
                      {a.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(a.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                    title="Delete Article"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
