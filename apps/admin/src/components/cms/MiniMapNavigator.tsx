import React from "react";
import { Compass, RotateCcw } from "lucide-react";

interface MiniMapNavigatorProps {
  canvasWidth: number;
  canvasHeight: number;
  zoomLevel: number;
  onResetZoom: () => void;
}

export function MiniMapNavigator({
  canvasWidth,
  canvasHeight,
  zoomLevel,
  onResetZoom,
}: MiniMapNavigatorProps) {
  return (
    <div className="absolute bottom-6 right-6 z-40 bg-[#07111F]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3 shadow-2xl space-y-2 select-none text-xs w-48 text-[#F8FAFC]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Compass className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Canvas Navigator</span>
        </div>
        <button
          onClick={onResetZoom}
          className="text-slate-400 hover:text-white transition-colors"
          title="Reset Zoom & View"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Mini Viewport Representation */}
      <div className="h-16 bg-[#030712] border border-cyan-500/20 rounded-lg relative flex items-center justify-center p-1 overflow-hidden">
        <div
          className="bg-cyan-500/20 border border-cyan-400/60 rounded flex items-center justify-center text-[9px] font-mono text-[#00f0ff] transition-all font-bold"
          style={{
            width: `${Math.min(100, (canvasWidth / 3840) * 100)}%`,
            height: `${Math.min(100, (canvasHeight / 2160) * 100)}%`,
          }}
        >
          {canvasWidth}×{canvasHeight}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Zoom: <strong className="text-white">{Math.round(zoomLevel * 100)}%</strong></span>
        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[#00f0ff] text-[9px] font-bold">
          {canvasWidth >= 3840 ? "4K UHD" : canvasWidth >= 2560 ? "2K QHD" : canvasWidth >= 1920 ? "1080p" : "Custom"}
        </span>
      </div>
    </div>
  );
}
