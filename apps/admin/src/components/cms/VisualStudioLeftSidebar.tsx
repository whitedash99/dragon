import React, { useState } from "react";
import { Layers, LayoutGrid, Palette, Image as ImageIcon, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DigitalAssetsPanel } from "./DigitalAssetsPanel";

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
  setSelectedCategory: (cat: string) => void;
}

export function VisualStudioLeftSidebar({
  isOpen,
  blocks,
  selectedBlock,
  onSelectBlock,
  categories,
  selectedCategory,
  setSelectedCategory,
}: VisualStudioLeftSidebarProps) {
  const [tab, setTab] = useState<"tree" | "library" | "tokens" | "media">("tree");

  if (!isOpen) return null;

  const componentLibrary = [
    { title: "Hero Section", category: "Hero", type: "hero", desc: "Cinematic headline with CTA buttons" },
    { title: "Games Showcase", category: "Games", type: "games", desc: "AAA Game catalog grid & specs" },
    { title: "Studio Features", category: "Studio", type: "features", desc: "3D Graphics engine telemetry" },
    { title: "Testimonials & Reviews", category: "Community", type: "testimonials", desc: "Player quote carousel" },
    { title: "FAQ Accordion", category: "Support", type: "faq", desc: "Expandable questions & answers" },
    { title: "Newsletter Signup", category: "Forms", type: "forms", desc: "Subscriber email form" },
  ];

  return (
    <div className="w-80 bg-slate-900/95 backdrop-blur-2xl border-r border-white/10 flex flex-col h-full shrink-0 select-none text-xs">
      {/* Top Sidebar Tab Controls */}
      <div className="flex items-center justify-around border-b border-white/10 p-2 bg-slate-950/60">
        <button
          onClick={() => setTab("tree")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "tree" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Website Structure Tree"
        >
          <Layers className="w-3.5 h-3.5" /> Tree
        </button>

        <button
          onClick={() => setTab("library")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "library" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Drag and Drop Component Library"
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Library
        </button>

        <button
          onClick={() => setTab("tokens")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "tokens" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Global Design Tokens"
        >
          <Palette className="w-3.5 h-3.5" /> Tokens
        </button>

        <button
          onClick={() => setTab("media")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "media" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Digital Assets Manager (DAM)"
        >
          <ImageIcon className="w-3.5 h-3.5" /> Assets
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === "tree" && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white font-semibold"
                      : "bg-slate-950/60 border border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tree Structure Nodes */}
            <div className="space-y-1.5">
              {blocks.map((b) => {
                const isSelected = selectedBlock?.key === b.key;
                return (
                  <div
                    key={b.id}
                    onClick={() => onSelectBlock(b)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-purple-600/20 border-purple-500/60 text-white shadow-lg shadow-purple-950/40"
                        : "bg-slate-955 border-white/5 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <GripVertical className="w-3.5 h-3.5 text-slate-500 shrink-0 cursor-grab" />
                      <div className="truncate">
                        <div className="font-semibold text-xs truncate">{b.label || b.key}</div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">{b.key}</div>
                      </div>
                    </div>

                    <Badge variant={b.isPublished ? "purple" : "outline"} size="sm">
                      {b.isPublished ? "Live" : "Draft"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "library" && (
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Drag & Drop Components
            </div>
            {componentLibrary.map((comp) => (
              <div
                key={comp.type}
                className="p-3 bg-slate-955 border border-white/10 rounded-xl hover:border-purple-500/50 cursor-grab transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{comp.title}</span>
                  <Badge variant="cyan" size="sm">{comp.category}</Badge>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{comp.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "tokens" && (
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Global Brand Tokens
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 block">Primary Palette</span>
              <div className="grid grid-cols-4 gap-2">
                <div className="h-9 rounded-lg bg-purple-600 border border-white/10 flex items-center justify-center text-[9px] font-mono text-white">#9333ea</div>
                <div className="h-9 rounded-lg bg-pink-500 border border-white/10 flex items-center justify-center text-[9px] font-mono text-white">#ec4899</div>
                <div className="h-9 rounded-lg bg-cyan-400 border border-white/10 flex items-center justify-center text-[9px] font-mono text-slate-950 font-bold">#22d3ee</div>
                <div className="h-9 rounded-lg bg-rose-500 border border-white/10 flex items-center justify-center text-[9px] font-mono text-white">#f43f5e</div>
              </div>
            </div>

            {/* Typography Tokens */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 block">Typography Tokens</span>
              <div className="p-3 bg-slate-955 border border-white/10 rounded-xl space-y-1.5 font-mono text-[11px]">
                <div className="text-purple-300">--font-sans: &quot;Geist Sans&quot;</div>
                <div className="text-pink-300">--font-header: &quot;Rajdhani&quot;</div>
                <div className="text-cyan-300">--font-mono: &quot;Geist Mono&quot;</div>
              </div>
            </div>
          </div>
        )}

        {tab === "media" && (
          <DigitalAssetsPanel onInsertAsset={(assetUrl) => console.log("Inserted media asset:", assetUrl)} />
        )}
      </div>
    </div>
  );
}
