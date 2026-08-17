import React from "react";
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Grid, Move, Save, RefreshCw, Sparkles, Layers, Sliders, Maximize2, ExternalLink, Tv, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VisualStudioHeaderProps {
  viewportMode: "desktop" | "tablet" | "mobile" | "responsive" | "2k" | "4k";
  setViewportMode: (mode: "desktop" | "tablet" | "mobile" | "responsive" | "2k" | "4k") => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  showRulers: boolean;
  setShowRulers: (show: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  isLeftOpen: boolean;
  setIsLeftOpen: (open: boolean) => void;
  isRightOpen: boolean;
  setIsRightOpen: (open: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (full: boolean) => void;
  isMaximizedCanvas: boolean;
  setIsMaximizedCanvas: (max: boolean) => void;
  activePageTitle: string;
  activePageSlug: string;
  isSaving: boolean;
  isSavedSuccess: boolean;
  onPublishAll: () => Promise<void>;
  onRefreshCanvas: () => void;
  onPopoutWindow: () => void;
  onOpenPageManager?: () => void;
}

export function VisualStudioHeader({
  viewportMode,
  setViewportMode,
  zoomLevel,
  setZoomLevel,
  showRulers,
  setShowRulers,
  showGrid,
  setShowGrid,
  isLeftOpen,
  setIsLeftOpen,
  isRightOpen,
  setIsRightOpen,
  isFullscreen,
  setIsFullscreen,
  isMaximizedCanvas,
  setIsMaximizedCanvas,
  activePageTitle,
  activePageSlug,
  isSaving,
  isSavedSuccess,
  onPublishAll,
  onRefreshCanvas,
  onPopoutWindow,
  onOpenPageManager,
}: VisualStudioHeaderProps) {
  const zoomOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5];

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xs z-30 select-none text-slate-900">
      {/* Left: Sidebar Toggle & Page Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsLeftOpen(!isLeftOpen)}
          className={`p-2 rounded-xl border transition-all ${
            isLeftOpen
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"
          }`}
          title="Toggle Left Studio Drawer (Tree & Library)"
        >
          <Layers className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900 tracking-tight">{activePageTitle}</span>
              <Badge variant="purple" size="sm">Studio Pro</Badge>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{activePageSlug}</span>
          </div>
        </div>

        {onOpenPageManager && (
          <Button
            onClick={onOpenPageManager}
            variant="outline"
            className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 px-2.5 py-1"
            title="Manage Website Routes & Pages"
          >
            <Globe className="w-3.5 h-3.5 mr-1" /> Pages
          </Button>
        )}
      </div>

      {/* Center: Device Viewport Switcher & Extended Zoom Controls */}
      <div className="flex items-center gap-3">
        {/* Device Viewport Buttons */}
        <div className="flex items-center bg-slate-50 border border-slate-200 p-1 rounded-xl font-mono">
          <button
            onClick={() => setViewportMode("desktop")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewportMode === "desktop" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Full HD (1920px)"
          >
            <Monitor className="w-3.5 h-3.5" /> 1920
          </button>

          <button
            onClick={() => setViewportMode("2k")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewportMode === "2k" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
            title="2K QHD (2560px)"
          >
            <Tv className="w-3.5 h-3.5" /> 2K
          </button>

          <button
            onClick={() => setViewportMode("4k")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewportMode === "4k" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
            title="4K UHD (3840px)"
          >
            <Tv className="w-3.5 h-3.5" /> 4K
          </button>

          <button
            onClick={() => setViewportMode("tablet")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewportMode === "tablet" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Tablet Viewport (768px)"
          >
            <Tablet className="w-3.5 h-3.5" /> 768
          </button>

          <button
            onClick={() => setViewportMode("mobile")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewportMode === "mobile" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Mobile Viewport (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" /> 375
          </button>
        </div>

        {/* Extended Zoom Selector & Quick Percentage Pills */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl font-mono">
          <button
            onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))}
            className="text-slate-500 hover:text-slate-900 p-1"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 border-r border-slate-200 pr-1.5">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((p) => (
              <button
                key={p}
                onClick={() => setZoomLevel(p)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  zoomLevel === p
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
                title={`Set Zoom to ${Math.round(p * 100)}%`}
              >
                {Math.round(p * 100)}%
              </button>
            ))}
          </div>

          <select
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="bg-transparent text-xs font-mono font-bold text-slate-900 focus:outline-none cursor-pointer px-1"
          >
            {zoomOptions.map((z) => (
              <option key={z} value={z} className="bg-white text-slate-900 font-mono">
                {Math.round(z * 100)}%
              </option>
            ))}
          </select>

          <button
            onClick={() => setZoomLevel(Math.min(5, zoomLevel + 0.25))}
            className="text-slate-500 hover:text-slate-900 p-1"
            title="Zoom In (up to 500%)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Canvas Maximize (95-100%) Button */}
        <button
          onClick={() => setIsMaximizedCanvas(!isMaximizedCanvas)}
          className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all font-mono ${
            isMaximizedCanvas ? "bg-slate-900 text-white border-slate-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
          }`}
          title="Maximize Canvas Area (95-100% Window Width)"
        >
          <Maximize2 className="w-3.5 h-3.5" /> {isMaximizedCanvas ? "Restore" : "Maximize"}
        </button>

        {/* Overlays & Fullscreen Toggles */}
        <div className="flex items-center gap-1 font-mono">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              showGrid ? "bg-slate-900 text-white border-slate-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"
            }`}
            title="Toggle Pixel Grid Guides"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowRulers(!showRulers)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              showRulers ? "bg-slate-900 text-white border-slate-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"
            }`}
            title="Toggle Workspace Rulers"
          >
            <Move className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
              isFullscreen ? "bg-slate-900 text-white border-slate-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
            title="Full Screen Preview Studio (F11)"
          >
            F11
          </button>
        </div>
      </div>

      {/* Right: Dual Monitor Launch, AutoSave & Inspector Toggle */}
      <div className="flex items-center gap-2 font-mono">
        {isSavedSuccess ? (
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <Save className="w-3.5 h-3.5 text-emerald-600" /> Saved
          </span>
        ) : isSaving ? (
          <span className="text-xs text-slate-700 font-bold flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
          </span>
        ) : null}

        <Button
          onClick={onPopoutWindow}
          variant="outline"
          className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 px-2.5 py-1 font-mono font-semibold"
          title="Open Dual Monitor Live Preview Window"
        >
          <ExternalLink className="w-3.5 h-3.5 mr-1 text-slate-500" /> Dual Monitor
        </Button>

        <Button
          onClick={onRefreshCanvas}
          variant="outline"
          className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 px-2.5 py-1 font-mono font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync
        </Button>

        <Button
          onClick={onPublishAll}
          disabled={isSaving}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-1 font-bold shadow-xs"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" /> Publish All
        </Button>

        <button
          onClick={() => setIsRightOpen(!isRightOpen)}
          className={`p-2 rounded-xl border transition-all ${
            isRightOpen
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"
          }`}
          title="Toggle Right Inspector Panel"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
