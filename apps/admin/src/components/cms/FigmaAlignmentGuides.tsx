import React from "react";

interface FigmaAlignmentGuidesProps {
  isVisible: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

export function FigmaAlignmentGuides({
  isVisible,
  canvasWidth,
  canvasHeight,
}: FigmaAlignmentGuidesProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Center Vertical Alignment Guide */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.8)]">
        <span className="absolute top-4 left-2 text-[9px] font-mono text-cyan-300 bg-slate-900/90 px-1 rounded border border-cyan-500/40">
          Center X ({Math.round(canvasWidth / 2)}px)
        </span>
      </div>

      {/* Center Horizontal Alignment Guide */}
      <div className="absolute left-0 right-0 top-1/2 h-px border-t border-dashed border-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.8)]">
        <span className="absolute left-4 top-2 text-[9px] font-mono text-cyan-300 bg-slate-900/90 px-1 rounded border border-cyan-500/40">
          Center Y ({Math.round(canvasHeight / 2)}px)
        </span>
      </div>

      {/* Padding Grid Snapping Bounds */}
      <div className="absolute inset-8 border border-dashed border-purple-500/30 rounded-xl" />
    </div>
  );
}
