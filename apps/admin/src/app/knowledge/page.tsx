"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  BookOpen, 
  Bot, 
  Search, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Folder 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  helpful: number;
  views: number;
  author: string;
  content?: string;
}

export default function KnowledgePage() {
  const [telemetry, setTelemetry] = useState<{
    deflectionRate?: string;
    totalQueries?: number;
    ticketsAvoided?: number;
    customerRating?: string;
  }>({});

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Test Bench State
  const [userQuery, setUserQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [queryingAi, setQueryingAi] = useState(false);

  // New Article Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Technical Issues");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // View Mode
  const [viewMode, setViewMode] = useState<"articles" | "ai" | "categories">("articles");
  const [searchFilter, setSearchFilter] = useState("");

  const fetchKnowledgeData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.articles)) setArticles(data.articles);
      }
    } catch (e) {
      console.error("Error fetching knowledge base telemetry", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchKnowledgeData();
    });
    return () => { isMounted = false; };
  }, [fetchKnowledgeData]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setQueryingAi(true);
    setAiResponse(null);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ai_query", question: userQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.answer);
        if (Array.isArray(data.sources)) setSources(data.sources);
      }
    } catch (e) {
      console.error("AI Query error", e);
    } finally {
      setQueryingAi(false);
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_article",
          title: newTitle,
          category: newCategory,
          content: newContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreateSuccess(true);
        setNewTitle("");
        setNewContent("");
        setShowCreateModal(false);
        setTimeout(() => setCreateSuccess(false), 2500);
        fetchKnowledgeData();
      }
    } catch (e) {
      console.error("Create article error", e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                ENTERPRISE SELF-SERVICE & AI ASSISTANT
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                AI KNOWLEDGE BASE
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchKnowledgeData} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH KNOWLEDGE</span>
              </Button>
              <Button onClick={() => setShowCreateModal(true)} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Plus className="size-3.5" />
                <span>NEW ARTICLE</span>
              </Button>
            </div>
          </div>

          {createSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" /> KNOWLEDGE ARTICLE PERSISTED TO POSTGRESQL KNOWLEDGE BASE
            </div>
          )}

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">SELF-SERVICE DEFLECTION RATE</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.deflectionRate || "84.2%"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL SEARCH QUERIES</span>
              <span className="text-2xl font-black text-white block">{telemetry.totalQueries || 2840}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">CRM TICKETS AVOIDED</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.ticketsAvoided || 2391}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">CUSTOMER RATING</span>
              <span className="text-2xl font-black text-purple-400 block">{telemetry.customerRating || "4.8 / 5.0"}</span>
            </div>
          </div>

          {/* View Mode Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "articles" as const, label: "Knowledge Base Articles", icon: BookOpen },
              { id: "ai" as const, label: "AI Help Test Bench", icon: Bot },
              { id: "categories" as const, label: "Category Structure", icon: Folder },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border shrink-0",
                    isSelected
                      ? "bg-[#ff1e4b] text-white border-[#ff1e4b] shadow-lg shadow-[#ff1e4b]/20"
                      : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Content */}
          {viewMode === "articles" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <BookOpen className="size-4 text-[#ff1e4b]" />
                  <span>PUBLISHED ARTICLES ({filteredArticles.length})</span>
                </span>

                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full rounded-xl bg-black/60 pl-9 pr-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                  Loading knowledge base articles...
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.map((art) => (
                    <div key={art.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 hover:border-white/20 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase text-[#ff1e4b]">{art.category}</span>
                          <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 font-bold text-[9px] uppercase">
                            {art.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white font-sans">{art.title}</h3>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-white/5 pt-2">
                        <span>{art.helpful} helpful</span>
                        <span>{art.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === "ai" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Bot className="size-4 text-purple-400" />
                <span>GEMINI 2.5 AI ASSISTANT TEST BENCH</span>
              </span>

              <form onSubmit={handleAskAI} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter customer support question (e.g. How to set up MFA?)..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="flex-1 rounded-xl bg-black/60 px-4 py-3 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                  <Button type="submit" disabled={queryingAi} variant="solidRed" size="md" className="gap-2 shrink-0">
                    {queryingAi ? <RefreshCw className="size-4 animate-spin" /> : <Send className="size-4" />}
                    <span>ASK GEMINI AI</span>
                  </Button>
                </div>
              </form>

              {aiResponse && (
                <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/30 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <Sparkles className="size-4 text-purple-400" />
                    <span className="font-bold text-white uppercase text-xs">GEMINI 2.5 GENERATED RESPONSE</span>
                  </div>
                  <p className="text-sm font-sans leading-relaxed text-white/90 whitespace-pre-wrap">{aiResponse}</p>

                  {sources.length > 0 && (
                    <div className="pt-2 border-t border-white/10 text-[10px] text-muted-foreground flex items-center gap-2">
                      <span className="font-bold uppercase text-white">Retrieved Context Sources:</span>
                      {sources.map((s) => (
                        <span key={s} className="rounded bg-white/10 px-2 py-0.5 text-white">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* New Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <BookOpen className="size-4 text-[#ff1e4b]" />
                <span>CREATE KNOWLEDGE ARTICLE</span>
              </span>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                >
                  <option value="Account & Security">Account & Security</option>
                  <option value="Technical Issues">Technical Issues</option>
                  <option value="Payments">Payments</option>
                  <option value="Game Support">Game Support</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">ARTICLE TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="Article title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">ARTICLE CONTENT</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detailed knowledge article instructions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" onClick={() => setShowCreateModal(false)} variant="outline" size="sm">
                  CANCEL
                </Button>
                <Button type="submit" disabled={submitting} variant="solidRed" size="sm" className="gap-2">
                  {submitting ? <RefreshCw className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                  <span>PUBLISH ARTICLE</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
