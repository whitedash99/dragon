import React, { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VisualEditorCanvasProps {
  viewportMode: "desktop" | "tablet" | "mobile";
  activeSlug: string;
  onRefreshKey: number;
}

export function VisualEditorCanvas({
  viewportMode,
  activeSlug,
  onRefreshKey,
}: VisualEditorCanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [port, setPort] = useState("3000");

  const targetUrl = `http://localhost:${port}${activeSlug.startsWith("/") ? activeSlug : `/${activeSlug}`}`;

  // Viewport width styling
  const widthClasses = {
    desktop: "w-full max-w-full h-[760px]",
    tablet: "w-[768px] h-[760px]",
    mobile: "w-[375px] h-[760px]",
  };

  return (
    <div className="flex-1 bg-slate-950/80 p-4 lg:p-6 flex flex-col items-center justify-start overflow-auto relative min-h-[600px]">
      {/* Canvas Top Bar */}
      <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">Live Viewport Canvas</Badge>
          <span className="font-mono text-[11px] text-slate-500">{targetUrl}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-mono">Port:</span>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-14 px-2 py-0.5 bg-slate-900 border border-white/10 rounded font-mono text-xs text-purple-300 focus:outline-none focus:border-purple-500"
            />
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors font-semibold"
          >
            Open Site <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className={`transition-all duration-300 rounded-2xl border border-white/15 bg-slate-900/90 shadow-2xl overflow-hidden relative ${widthClasses[viewportMode]}`}
      >
        {/* Device Frame Window Controls */}
        <div className="h-8 bg-slate-900 border-b border-white/10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {viewportMode === "desktop" ? "1920 × 1080 (Responsive)" : viewportMode === "tablet" ? "768 × 1024 (Tablet Portrait)" : "375 × 812 (iPhone 14)"}
          </span>
        </div>

        {/* Real Live Iframe Canvas */}
        <iframe
          key={`${targetUrl}-${onRefreshKey}`}
          ref={iframeRef}
          src={targetUrl}
          title="Dragon Studios Live Website Visual Canvas"
          className="w-full h-[calc(100%-2rem)] border-0 bg-slate-950"
          sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-downloads"
        />
      </div>
    </div>
  );
}
