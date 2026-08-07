import React from "react";
import { Sliders, Type, Eye, History } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface VisualInspectorToolbarProps {
  selectedBlock: CMSBlock | null;
  editContent: string;
  setEditContent: (content: string) => void;
  isPublished: boolean;
  setIsPublished: (published: boolean) => void;
  onSaveBlock: () => Promise<void>;
  onOpenHistory: () => void;
  saving: boolean;
}

export function VisualInspectorToolbar({
  selectedBlock,
  editContent,
  setEditContent,
  isPublished,
  setIsPublished,
  onSaveBlock,
  onOpenHistory,
  saving,
}: VisualInspectorToolbarProps) {
  if (!selectedBlock) {
    return (
      <div className="w-80 bg-slate-900/80 backdrop-blur-xl border-l border-white/10 p-5 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
        <Sliders className="w-8 h-8 text-purple-400 opacity-40 mb-1" />
        <p className="font-semibold text-white">Visual Inspector</p>
        <p className="text-slate-400">Select any section or block element to edit text, typography, colors, and layout.</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-900/90 backdrop-blur-xl border-l border-white/10 p-5 space-y-6 overflow-y-auto max-h-[840px] text-xs">
      {/* Header */}
      <div className="border-b border-white/5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <Badge variant="purple" size="sm">{selectedBlock.category}</Badge>
          <span className="text-[10px] font-mono text-slate-400">v{selectedBlock.version}</span>
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">{selectedBlock.label || selectedBlock.key}</h3>
        <span className="text-[10px] font-mono text-purple-400">key: {selectedBlock.key}</span>
      </div>

      {/* Content & Typography Section */}
      <div className="space-y-3">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-purple-400" /> Content & Text
        </label>
        <textarea
          rows={5}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-3 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors font-mono leading-relaxed"
          placeholder="Enter text, heading, or JSON content..."
        />
      </div>

      {/* Publication Controls */}
      <div className="space-y-3 border-t border-white/5 pt-4">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" /> Visibility & Publish State
        </label>
        <div className="flex items-center justify-between bg-slate-950/60 border border-white/10 p-3 rounded-xl">
          <span className="text-slate-300 font-medium">Published Live</span>
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
              isPublished ? "bg-purple-600" : "bg-slate-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isPublished ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Revision History Action */}
      <div className="border-t border-white/5 pt-4">
        <Button
          type="button"
          onClick={onOpenHistory}
          variant="outline"
          className="w-full text-xs border-white/10 text-slate-300 hover:bg-white/5 flex items-center justify-center gap-1.5"
        >
          <History className="w-3.5 h-3.5 text-purple-400" /> Version History Log
        </Button>
      </div>

      {/* Save Action Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={onSaveBlock}
          disabled={saving}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg shadow-purple-900/40"
        >
          {saving ? "Saving Changes..." : "Apply & Save Element"}
        </Button>
      </div>
    </div>
  );
}
