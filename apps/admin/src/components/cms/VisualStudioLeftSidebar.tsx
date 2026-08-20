"use client";

import React, { useState } from "react";
import { Search, Layers, Plus, Trash2, Check, X, Sparkles, Folder } from "lucide-react";

interface CMSBlock {
  id: string;
  key: string;
  category: string;
  label: string;
  type: string;
  content: string;
  draftContent?: string;
  isPublished: boolean;
  version: number;
  updatedBy: string;
  updatedAt: string;
}

interface VisualStudioLeftSidebarProps {
  isOpen: boolean;
  blocks: CMSBlock[];
  selectedBlock: CMSBlock | null;
  onSelectBlock: (block: CMSBlock) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddBlock?: (newBlock: { key: string; category: string; label: string; type: string; content: string }) => Promise<void>;
  onDeleteBlock?: (key: string) => Promise<void>;
}

export function VisualStudioLeftSidebar({
  isOpen,
  blocks,
  selectedBlock,
  onSelectBlock,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddBlock,
  onDeleteBlock,
}: VisualStudioLeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newCategory, setNewCategory] = useState("Hero");
  const [newLabel, setNewLabel] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const filteredBlocks = blocks.filter((b) => {
    const matchesSearch =
      b.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newContent.trim()) return;

    setIsAdding(true);
    try {
      if (onAddBlock) {
        await onAddBlock({
          key: newKey.trim(),
          category: newCategory,
          label: newLabel.trim() || newKey.trim(),
          type: "text",
          content: newContent.trim(),
        });
      }
      setNewKey("");
      setNewLabel("");
      setNewContent("");
      setShowAddModal(false);
    } catch (e) {
      console.error("Create block failed", e);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-80 bg-[#040D24] border-r border-cyan-500/20 flex flex-col h-full shrink-0 select-none text-xs text-[#F8FAFC]">
      {/* ═══ Header & Search ═══ */}
      <div className="p-4 border-b border-cyan-500/20 space-y-3 bg-[#020718]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-heading font-black text-xs text-white uppercase tracking-wider">
              Content Blocks ({filteredBlocks.length})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-mono font-black text-[10px] uppercase tracking-wider flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Plus className="size-3" />
            <span>Add Block</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter sections or keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#01040D] border border-cyan-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-black font-black"
                  : "bg-[#01040D] border border-cyan-500/20 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Blocks List ═══ */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filteredBlocks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            No matching blocks found.
          </div>
        ) : (
          filteredBlocks.map((b) => {
            const isSelected = selectedBlock?.key === b.key;
            return (
              <div
                key={b.key}
                onClick={() => onSelectBlock(b)}
                className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? "bg-[#05153B] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                    : "bg-[#020718] border-cyan-500/15 hover:border-cyan-400/40 hover:bg-[#030B22]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase truncate">
                      {b.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="font-heading font-bold text-xs text-white truncate">
                      {b.label || b.key}
                    </span>
                  </div>

                  {/* Delete Block (Only for non-default or with confirmation) */}
                  {onDeleteBlock && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete content block "${b.key}" from Neon PostgreSQL?`)) {
                          onDeleteBlock(b.key);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer"
                      title="Delete block"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="font-mono text-[10px] text-slate-400 truncate">
                  Key: <span className="text-slate-300">{b.key}</span>
                </div>

                <div className="font-sans text-xs text-slate-300 line-clamp-2 mt-0.5">
                  {b.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ═══ Add New Block Modal ═══ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#040D24] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="size-4 text-cyan-400" />
                <h3 className="font-heading font-black text-sm uppercase tracking-wider">
                  Create Content Block
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
                  Block Key (e.g. hero.announcement)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. games.promo_banner"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Hero">Hero</option>
                  <option value="Games">Games</option>
                  <option value="Studio">Studio</option>
                  <option value="News">News</option>
                  <option value="Footer">Footer</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
                  Human Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Games Promo Banner Text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
                  Initial Content Text
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter initial content..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white placeholder-slate-500 font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="size-3.5" />
                  <span>{isAdding ? "Saving to Neon..." : "Create Block"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
