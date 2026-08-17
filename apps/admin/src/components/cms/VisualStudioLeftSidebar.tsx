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
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none text-xs text-slate-900">
      {/* Top Sidebar Tab Controls */}
      <div className="flex items-center justify-around border-b border-slate-100 p-2 bg-slate-50">
        <button
          onClick={() => setTab("tree")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "tree" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
          title="Website Structure Tree"
        >
          <Layers className="w-3.5 h-3.5" /> Tree
        </button>

        <button
          onClick={() => setTab("library")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "library" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
          title="Drag and Drop Component Library"
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Library
        </button>

        <button
          onClick={() => setTab("tokens")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "tokens" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
          title="Global Design Tokens"
        >
          <Palette className="w-3.5 h-3.5" /> Tokens
        </button>

        <button
          onClick={() => setTab("media")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "media" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
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
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tree Structure Nodes */}
            <div className="space-y-1.5 font-mono">
              {blocks.map((b) => {
                const isSelected = selectedBlock?.key === b.key;
                return (
                  <div
                    key={b.id}
                    onClick={() => onSelectBlock(b)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <GripVertical className="w-3.5 h-3.5 opacity-50 shrink-0 cursor-grab" />
                      <div className="truncate">
                        <div className="font-bold text-xs truncate">{b.label || b.key}</div>
                        <div className="text-[10px] opacity-75 truncate">{b.key}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${b.isPublished ? (isSelected ? "bg-emerald-800 text-emerald-100 border-emerald-700" : "bg-emerald-50 text-emerald-800 border-emerald-200") : (isSelected ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-200 text-slate-700 border-slate-300")}`}>
                      {b.isPublished ? "Live" : "Draft"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "library" && (
          <div className="space-y-3 font-mono">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Drag & Drop Components
            </div>
            {componentLibrary.map((comp) => (
              <div
                key={comp.type}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-400 cursor-grab transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{comp.title}</span>
                  <Badge variant="cyan" size="sm">{comp.category}</Badge>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug font-sans">{comp.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "tokens" && (
          <div className="space-y-4 font-mono">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Global Brand Tokens
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Primary Palette</span>
              <div className="grid grid-cols-4 gap-2">
                <div className="h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[9px] font-mono text-white font-bold">#0f172a</div>
                <div className="h-9 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center text-[9px] font-mono text-white font-bold">#334155</div>
                <div className="h-9 rounded-lg bg-sky-600 border border-sky-500 flex items-center justify-center text-[9px] font-mono text-white font-bold">#0284c7</div>
                <div className="h-9 rounded-lg bg-emerald-600 border border-emerald-500 flex items-center justify-center text-[9px] font-mono text-white font-bold">#059669</div>
              </div>
            </div>

            {/* Typography Tokens */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Typography Tokens</span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-900 font-semibold">--font-sans: &quot;Geist Sans&quot;</div>
                <div className="text-slate-700">--font-header: &quot;Rajdhani&quot;</div>
                <div className="text-sky-700 font-semibold">--font-mono: &quot;Geist Mono&quot;</div>
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
