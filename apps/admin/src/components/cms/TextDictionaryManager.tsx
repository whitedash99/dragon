import React, { useState } from "react";
import { Search, Sparkles, Save, CheckCircle2, Globe, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIRewriteModal } from "./AIRewriteModal";

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

interface TextDictionaryManagerProps {
  blocks?: CMSBlock[];
  onRefresh?: () => void;
  onSelectBlock?: (block: CMSBlock) => void;
}

export function TextDictionaryManager({
  blocks = [],
  onRefresh,
  onSelectBlock,
}: TextDictionaryManagerProps) {
  const defaultKeys = [
    { key: "hero.title", category: "Hero", label: "Hero Headline", value: "FORGING WORLDS BEYOND REALITY", isPublished: true },
    { key: "hero.subtitle", category: "Hero", label: "Hero Subtitle", value: "Dragon Studios crafts original 3D & 2D games for PC and Mobile with high-performance gameplay.", isPublished: true },
    { key: "hero.cta_primary", category: "Hero", label: "Primary CTA Button", value: "EXPLORE WORLDS", isPublished: true },
    { key: "hero.cta_secondary", category: "Hero", label: "Secondary CTA Button", value: "ENTER THE STUDIO", isPublished: true },
    { key: "nav.games", category: "Navigation", label: "Menu Games Link", value: "GAMES", isPublished: true },
    { key: "nav.downloads", category: "Navigation", label: "Menu Downloads Link", value: "DOWNLOADS", isPublished: true },
    { key: "nav.studio", category: "Navigation", label: "Menu Studio Link", value: "STUDIO", isPublished: true },
    { key: "nav.community", category: "Navigation", label: "Menu Community Link", value: "COMMUNITY", isPublished: true },
    { key: "nav.contact", category: "Navigation", label: "Menu Contact Link", value: "CONTACT", isPublished: true },
    { key: "footer.tagline", category: "Footer", label: "Footer Tagline", value: "Forging the future of 3D & 2D interactive games and world simulation.", isPublished: true },
  ];

  const [keys, setKeys] = useState(
    blocks.length > 0
      ? blocks.map((b) => ({
          key: b.key,
          category: b.category,
          label: b.label || b.key,
          value: b.content,
          isPublished: b.isPublished,
        }))
      : defaultKeys
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedKey, setSelectedKey] = useState(keys[0] || defaultKeys[0]);
  const [editValue, setEditValue] = useState(keys[0]?.value || "");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories = ["All", "Hero", "Navigation", "Games", "Footer", "Forms", "SEO"];

  const filteredKeys = keys.filter((k) => {
    const matchesCat = selectedCategory === "All" || k.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSelectKey = (item: typeof keys[0]) => {
    setSelectedKey(item);
    setEditValue(item.value);
  };

  const handleSaveTextKey = async () => {
    if (!selectedKey) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cms/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: selectedKey.key,
          category: selectedKey.category,
          label: selectedKey.label,
          type: "text",
          content: editValue,
          isPublished: true,
          updatedBy: "Executive Owner",
        }),
      });

      if (res.ok) {
        setKeys((prev) =>
          prev.map((k) => (k.key === selectedKey.key ? { ...k, value: editValue } : k))
        );
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
        onRefresh?.();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#07111F] border border-cyan-500/20 rounded-2xl p-6 space-y-6 max-w-6xl mx-auto shadow-2xl text-[#F8FAFC]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[#00f0ff] border border-cyan-400/30 text-[10px] font-mono font-bold">
              CENTRALIZED UI STRING REGISTRY
            </span>
            <span className="text-xs text-slate-400 font-mono">100% Website Text Editable</span>
          </div>
          <h2 className="text-xl font-heading font-black text-white tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#00f0ff]" /> Universal Text Dictionary & Translation Manager
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#030712] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" /> AI Polish & Translate
          </button>
          <button
            onClick={handleSaveTextKey}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#19C7FF] text-black font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 hover:scale-105 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "SAVING..." : savedSuccess ? "SAVED LIVE!" : "SAVE TEXT KEY"}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#030712] p-3 rounded-xl border border-cyan-500/20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search text keys (e.g. hero.title, nav.games)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#07111F] border border-cyan-500/30 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#00A8FF] to-[#19C7FF] text-black font-black"
                  : "bg-[#07111F] text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Key List */}
        <div className="lg:col-span-5 bg-[#030712] border border-cyan-500/20 rounded-xl p-3 space-y-2 max-h-[520px] overflow-y-auto">
          {filteredKeys.map((item) => {
            const isSelected = selectedKey?.key === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handleSelectKey(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20"
                    : "bg-[#07111F] border-cyan-500/10 text-slate-300 hover:border-cyan-400/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-[#00f0ff] font-bold">{item.key}</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[9px] font-mono">
                    {item.category}
                  </span>
                </div>
                <div className="font-heading font-black text-xs text-white mb-1">{item.label}</div>
                <div className="text-xs text-slate-400 truncate font-sans">{item.value}</div>
              </div>
            );
          })}
        </div>

        {/* Right Editor Panel */}
        <div className="lg:col-span-7 bg-[#030712] border border-cyan-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono text-[#00f0ff] font-bold">{selectedKey?.key}</span>
              <h3 className="text-base font-heading font-black text-white">{selectedKey?.label}</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
              STATUS: LIVE
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              English (Master Production String)
            </label>
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={6}
              className="w-full p-3 bg-[#07111F] border border-cyan-500/30 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleSaveTextKey}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#19C7FF] text-black font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
            >
              {saving ? "SAVING..." : savedSuccess ? "APPLIED LIVE!" : "SAVE CHANGES"}
            </button>
          </div>
        </div>
      </div>

      <AIRewriteModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentText={editValue}
        onApply={(newText) => {
          setEditValue(newText);
          setIsAiModalOpen(false);
        }}
      />
    </div>
  );
}
