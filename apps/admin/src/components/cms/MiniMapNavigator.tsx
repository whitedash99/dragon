import React from "react";
import { Compass, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MiniMapNavigatorProps {
  canvasWidth: number;
  canvasHeight: number;
  zoomLevel: number;
  onResetView: () => void;
}

export function MiniMapNavigator({
  canvasWidth,
  canvasHeight,
  zoomLevel,
  onResetView,
}: MiniMapNavigatorProps) {
  return (
    <div className="absolute bottom-4 right-4 z-40 bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-2xl space-y-2 select-none text-xs w-48">
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>Canvas Navigator</span>
        </div>
        <button
          onClick={onResetView}
          className="text-slate-400 hover:text-white transition-colors"
          title="Reset Zoom & View"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Mini Viewport Representation */}
      <div className="h-16 bg-slate-955 border border-white/10 rounded-lg relative flex items-center justify-center p-1 overflow-hidden">
        <div
          className="bg-purple-600/30 border border-purple-500/60 rounded flex items-center justify-center text-[9px] font-mono text-purple-200 transition-all"
          style={{
            width: `${Math.min(100, (canvasWidth / 3840) * 100)}%`,
            height: `${Math.min(100, (canvasHeight / 2160) * 100)}%`,
          }}
        >
          {canvasWidth}×{canvasHeight}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
        <Badge variant="purple" size="sm">
          {canvasWidth >= 3840 ? "4K UHD" : canvasWidth >= 2560 ? "2K QHD" : canvasWidth >= 1920 ? "FHD" : "Custom"}
        </Badge>
      </div>
    </div>
  );
}
