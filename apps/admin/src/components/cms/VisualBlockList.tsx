import React from "react";
import { GripVertical, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface VisualBlockListProps {
  blocks: CMSBlock[];
  selectedBlock: CMSBlock | null;
  onSelectBlock: (block: CMSBlock) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export function VisualBlockList({
  blocks,
  selectedBlock,
  onSelectBlock,
  categories,
  selectedCategory,
  setSelectedCategory,
}: VisualBlockListProps) {
  return (
    <div className="w-72 bg-slate-900/90 backdrop-blur-xl border-r border-white/10 p-4 space-y-4 text-xs shrink-0 max-h-[840px] overflow-y-auto">
      {/* Navigation Header */}
      <div className="border-b border-white/5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> Page Structure ({blocks.length})
          </span>
          <Badge variant="purple" size="sm">Tree</Badge>
        </div>

        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c} Blocks</option>
          ))}
        </select>
      </div>

      {/* Block List */}
      <div className="space-y-2">
        {blocks.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-[11px]">No section blocks found.</div>
        ) : (
          blocks.map((b) => {
            const isSelected = selectedBlock?.key === b.key;
            return (
              <div
                key={b.id}
                onClick={() => onSelectBlock(b)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? "bg-purple-950/50 border-purple-500/50 shadow-md shadow-purple-950/40 text-white"
                    : "bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/15 hover:bg-slate-900/50"
                }`}
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-600 shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs truncate">{b.label || b.key}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{b.key}</div>
                </div>
                <Badge variant={b.isPublished ? "success" : "default"} size="sm">
                  {b.isPublished ? "Live" : "Draft"}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
