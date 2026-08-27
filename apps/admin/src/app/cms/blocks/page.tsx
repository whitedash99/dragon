"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  Layers,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  Check,
  X,
  Edit3,
  Trash2,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassButton, GlassBadge, GlassStat } from "@/components/ui/glass";

interface CMSBlock {
  id: string;
  key: string;
  category: string;
  label: string;
  type: string;
  content: string;
  isPublished: boolean;
  metadata?: Record<string, unknown>;
  updatedAt: string;
}

export default function CMSBlocksPage() {
  const [blocks, setBlocks] = useState<CMSBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DISABLED">("ALL");

  // Telemetry measured state
  const [lastTelemetry, setLastTelemetry] = useState<{
    dbMs: number;
    cacheMs: number;
    totalMs: number;
    timestamp: string;
  } | null>(null);

  // Optimistic toggling feedback
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlock, setEditBlock] = useState<CMSBlock | null>(null);
  const [formKey, setFormKey] = useState("");
  const [formCategory, setFormCategory] = useState("Homepage Layout");
  const [formLabel, setFormLabel] = useState("");
  const [formType, setFormType] = useState("boolean");
  const [formContent, setFormContent] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState<CMSBlock | null>(null);

  const fetchBlocks = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/cms/blocks");
      const data = await res.json();
      if (data.success && Array.isArray(data.blocks)) {
        setBlocks(data.blocks);
      }
    } catch (e) {
      console.error("Error fetching CMS blocks", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleToggleBlock = async (block: CMSBlock) => {
    const nextPublished = !block.isPublished;
    setTogglingKey(block.key);

    // Optimistic UI update
    setBlocks((prev) =>
      prev.map((b) => (b.key === block.key ? { ...b, isPublished: nextPublished } : b))
    );

    try {
      const res = await fetch("/api/cms/blocks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: block.key,
          isPublished: nextPublished,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.telemetry) {
          setLastTelemetry(data.telemetry);
        }
        if (data.block) {
          setBlocks((prev) =>
            prev.map((b) => (b.key === block.key ? data.block : b))
          );
        }
      } else {
        // Rollback on failure
        setBlocks((prev) =>
          prev.map((b) => (b.key === block.key ? { ...b, isPublished: !nextPublished } : b))
        );
        alert(data.error || "Failed to update block state.");
      }
    } catch (err) {
      console.error("Toggle error", err);
      // Rollback
      setBlocks((prev) =>
        prev.map((b) => (b.key === block.key ? { ...b, isPublished: !nextPublished } : b))
      );
      alert("Network error updating block.");
    } finally {
      setTogglingKey(null);
    }
  };

  const handleOpenCreateModal = () => {
    setEditBlock(null);
    setFormKey("");
    setFormCategory("Homepage Layout");
    setFormLabel("");
    setFormType("boolean");
    setFormContent("");
    setFormIsPublished(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (block: CMSBlock) => {
    setEditBlock(block);
    setFormKey(block.key);
    setFormCategory(block.category || "General");
    setFormLabel(block.label || "");
    setFormType(block.type || "text");
    setFormContent(block.content || "");
    setFormIsPublished(block.isPublished);
    setModalOpen(true);
  };

  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editBlock ? "PUT" : "POST";
      const res = await fetch("/api/cms/blocks", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: formKey,
          category: formCategory,
          label: formLabel,
          type: formType,
          content: formContent,
          isPublished: formIsPublished,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.telemetry) {
          setLastTelemetry(data.telemetry);
        }
        setModalOpen(false);
        fetchBlocks();
      } else {
        alert(data.error || "Failed to save block.");
      }
    } catch (err) {
      console.error("Save block error", err);
      alert("Network error saving block.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = async (key: string) => {
    try {
      const res = await fetch(`/api/cms/blocks?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) {
          setLastTelemetry(data.telemetry);
        }
        setDeleteTarget(null);
        fetchBlocks();
      } else {
        alert(data.error || "Failed to delete block.");
      }
    } catch (err) {
      console.error("Delete block error", err);
      alert("Network error deleting block.");
    }
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    blocks.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [blocks]);

  // Filtered block list
  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      const matchesCategory = activeCategory === "ALL" || b.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        b.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && b.isPublished) ||
        (statusFilter === "DISABLED" && !b.isPublished);

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [blocks, activeCategory, searchQuery, statusFilter]);

  const activeCount = blocks.filter((b) => b.isPublished).length;
  const disabledCount = blocks.filter((b) => !b.isPublished).length;

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider">
                  Dragon Control • Layout & Sections Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Content Blocks & Sections Manager
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchBlocks}
                className="p-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
                title="Refresh Blocks"
              >
                <RefreshCw className={cn("size-4", refreshing && "animate-spin text-cyan-400")} />
              </button>

              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="size-4 text-black" />
                <span>Create Block / Section</span>
              </button>
            </div>
          </div>

          {/* Measured Telemetry Banner */}
          {lastTelemetry && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-in fade-in">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>
                  <strong>Real-Time Layout Sync:</strong> DB Update: {lastTelemetry.dbMs}ms · Edge Purge: {lastTelemetry.cacheMs}ms · Total: {lastTelemetry.totalMs}ms
                </span>
              </div>
              <button onClick={() => setLastTelemetry(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStat
              label="Total Sections"
              value={blocks.length}
              icon={LayoutGrid}
              trend="Canonical DB"
            />
            <GlassStat
              label="Active (Live ON)"
              value={activeCount}
              icon={CheckCircle2}
              trend="Visible Online"
            />
            <GlassStat
              label="Disabled (OFF)"
              value={disabledCount}
              icon={XCircle}
              trend="Hidden from Site"
            />
            <GlassStat
              label="Layout Categories"
              value={categories.length - 1}
              icon={Layers}
              trend="Organized"
            />
          </div>

          {/* Filter & Search Toolbar */}
          <div className="space-y-3 bg-[#03091D]/90 p-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="size-4 absolute left-3 top-2.5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search blocks by key, label, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-[#02050E] p-1 rounded-xl border border-cyan-500/20">
                {(["ALL", "ACTIVE", "DISABLED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={cn(
                      "px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer",
                      statusFilter === st ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]" : "text-slate-400 hover:text-white"
                    )}
                  >
                    {st === "ALL" ? "All" : st === "ACTIVE" ? "🟢 Live ON" : "⚪ Disabled OFF"}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-cyan-500/20">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-1 text-xs font-mono font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer",
                    activeCategory === cat
                      ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBlocks.map((block) => {
              const isToggling = togglingKey === block.key;

              return (
                <GlassCard key={block.id} className="p-5 flex flex-col justify-between space-y-4 group bg-[#03091D]/90 border border-cyan-500/30">
                  
                  {/* Card Header: Category Badge & ON/OFF Switch */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#02050E] text-cyan-400 border border-cyan-500/25 font-mono text-[10px] font-bold uppercase tracking-wider">
                        {block.category}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight truncate pt-1 font-mono">
                        {block.label}
                      </h3>
                      <code className="text-[11px] font-mono text-cyan-400/70 block truncate">
                        {block.key}
                      </code>
                    </div>

                    {/* Big Interactive ON / OFF Switch */}
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => handleToggleBlock(block)}
                      className={cn(
                        "relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50",
                        block.isPublished ? "bg-emerald-500" : "bg-slate-700"
                      )}
                      title={block.isPublished ? "Click to disable (Turn OFF)" : "Click to activate (Turn ON)"}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-black",
                          block.isPublished ? "translate-x-6 text-emerald-600" : "translate-x-0 text-slate-800"
                        )}
                      >
                        {isToggling ? (
                          <RefreshCw className="size-3 animate-spin text-slate-500" />
                        ) : block.isPublished ? (
                          <Check className="size-3.5 stroke-[3]" />
                        ) : (
                          <X className="size-3 stroke-[3]" />
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Card Content Preview */}
                  <div className="bg-[#02050E] p-3 rounded-xl border border-cyan-500/20 text-xs text-slate-300 font-mono leading-relaxed line-clamp-3 min-h-[4.5rem]">
                    {block.content || <span className="text-slate-600 italic">No content text specified</span>}
                  </div>

                  {/* Card Footer: Status & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "size-2 rounded-full",
                        block.isPublished ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" : "bg-slate-600"
                      )} />
                      <span className={cn(
                        "font-mono font-bold text-[11px]",
                        block.isPublished ? "text-emerald-400" : "text-slate-500"
                      )}>
                        {block.isPublished ? "LIVE ON" : "DISABLED"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(block)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit Block"
                      >
                        <Edit3 className="size-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(block)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Block"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </main>
      </div>

      {/* ═══ CREATE / EDIT BLOCK MODAL ═══ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden font-mono">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#02050E]/90 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                  <Layers className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {editBlock ? "Edit Content / Section Block" : "Create New Section Block"}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Configure layout visibility, title, and live data
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveBlock} className="flex-1 overflow-y-auto p-6 space-y-4 font-mono">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-cyan-400">Block Key *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editBlock}
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value)}
                    placeholder="e.g. homepage.news"
                    className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 disabled:opacity-50 placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cyan-400">Category *</label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Homepage Layout, Hero, Footer Layout"
                    className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-cyan-400">Human Label *</label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. Latest Dispatches Section"
                    className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cyan-400">Block Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="boolean">Section Layout (ON / OFF Toggle)</option>
                    <option value="text">Single-line Text</option>
                    <option value="textarea">Multi-line Text / Markdown</option>
                    <option value="json">Structured JSON Config</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-cyan-400">Content / Description / Value</label>
                <textarea
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Enter block text content, JSON, or layout description..."
                  className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 placeholder-slate-600"
                />
              </div>

              {/* Status Toggle in Modal */}
              <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/25 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Section Visibility</span>
                  <p className="text-[11px] text-slate-400">
                    When enabled, this block is rendered on the public website.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/25 text-slate-300 text-xs font-mono font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black text-xs font-black font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.35)] hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                  <span>{saving ? "Saving..." : "Save Block & Sync Live"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#03091D] border border-rose-500/35 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(244,63,94,0.2)] font-mono">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Content Block</h3>
                <p className="text-xs text-slate-400">{deleteTarget.label} ({deleteTarget.key})</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Are you sure you want to permanently delete this block? This will remove it from the database and trigger targeted website cache purge.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/25 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBlock(deleteTarget.key)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                Delete Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
