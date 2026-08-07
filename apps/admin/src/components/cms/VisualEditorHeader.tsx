import React from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, Save, Globe, Eye, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VisualEditorHeaderProps {
  viewportMode: "desktop" | "tablet" | "mobile";
  setViewportMode: (mode: "desktop" | "tablet" | "mobile") => void;
  activePageTitle: string;
  activePageSlug: string;
  isSaving: boolean;
  isSavedSuccess: boolean;
  onPublishAll: () => Promise<void>;
  onRefreshCanvas: () => void;
  isPreviewOnly: boolean;
  setIsPreviewOnly: (preview: boolean) => void;
}

export function VisualEditorHeader({
  viewportMode,
  setViewportMode,
  activePageTitle,
  activePageSlug,
  isSaving,
  isSavedSuccess,
  onPublishAll,
  onRefreshCanvas,
  isPreviewOnly,
  setIsPreviewOnly,
}: VisualEditorHeaderProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xl">
      {/* Left: Active Page Info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">{activePageTitle}</span>
            <Badge variant="purple" size="sm">Visual Studio</Badge>
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Globe className="w-3 h-3 text-cyan-400" /> {activePageSlug}
          </div>
        </div>
      </div>

      {/* Center: Device Viewport Switcher */}
      <div className="flex items-center justify-center gap-1 bg-slate-950/60 border border-white/10 p-1 rounded-xl mx-auto md:mx-0">
        <button
          onClick={() => setViewportMode("desktop")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewportMode === "desktop"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
              : "text-slate-400 hover:text-white"
          }`}
          title="Desktop Landscape (100%)"
        >
          <Monitor className="w-3.5 h-3.5" /> Desktop
        </button>
        <button
          onClick={() => setViewportMode("tablet")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewportMode === "tablet"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
              : "text-slate-400 hover:text-white"
          }`}
          title="Tablet Viewport (768px)"
        >
          <Tablet className="w-3.5 h-3.5" /> Tablet
        </button>
        <button
          onClick={() => setViewportMode("mobile")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewportMode === "mobile"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
              : "text-slate-400 hover:text-white"
          }`}
          title="Mobile Portrait (375px)"
        >
          <Smartphone className="w-3.5 h-3.5" /> Mobile
        </button>
      </div>

      {/* Right: Autosave Status & Publish Action */}
      <div className="flex items-center justify-end gap-2">
        {isSavedSuccess ? (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        ) : isSaving ? (
          <span className="text-xs text-purple-300 font-semibold flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
          </span>
        ) : null}

        <Button
          onClick={() => setIsPreviewOnly(!isPreviewOnly)}
          variant="outline"
          className={`text-xs border-white/10 ${isPreviewOnly ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "text-slate-300 hover:bg-white/5"}`}
        >
          <Eye className="w-3.5 h-3.5 mr-1" /> {isPreviewOnly ? "Edit Mode" : "Preview"}
        </Button>

        <Button
          onClick={onRefreshCanvas}
          variant="outline"
          className="text-xs border-white/10 text-slate-300 hover:bg-white/5"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync
        </Button>

        <Button
          onClick={onPublishAll}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 shadow-lg shadow-purple-900/40"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" /> Publish All Changes
        </Button>
      </div>
    </div>
  );
}
