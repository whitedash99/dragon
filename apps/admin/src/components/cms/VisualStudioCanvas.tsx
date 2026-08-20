import React, { useRef, useState, useEffect } from "react";

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

interface VisualStudioCanvasProps {
  viewportMode: "desktop" | "tablet" | "mobile" | "responsive" | "2k" | "4k";
  zoomLevel: number;
  setZoomLevel?: (zoom: number) => void;
  showRulers?: boolean;
  showGrid?: boolean;
  activeSlug: string;
  onRefreshKey?: number;
  selectedBlock?: CMSBlock | null;
  targetEnv?: "production" | "local";
  setTargetEnv?: (env: "production" | "local") => void;
  onSaveBlockContent?: (newContent: string) => void;
  onLiveTyping?: (newContent: string) => void;
  onSelectBlockFromCanvas?: (key: string, text: string) => void;
}

export function VisualStudioCanvas({
  viewportMode,
  activeSlug,
  onRefreshKey = 0,
  selectedBlock,
  targetEnv = "production",
  onSaveBlockContent,
  onLiveTyping,
  onSelectBlockFromCanvas,
}: VisualStudioCanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  const isDesktop = viewportMode === "desktop" || viewportMode === "responsive" || viewportMode === "2k" || viewportMode === "4k";
  const rawSlug = activeSlug.startsWith("/") ? activeSlug : `/${activeSlug}`;
  const baseUrl = targetEnv === "production" ? "https://dragongamingstudios.vercel.app" : "http://localhost:3000";
  const targetUrl = `${baseUrl}${rawSlug}${rawSlug.includes("?") ? "&editor=true" : "?editor=true"}`;

  // Forward selected block content update to iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow && selectedBlock) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "DRAGON_CMS_TEXT_UPDATE",
          key: selectedBlock.key,
          content: selectedBlock.content,
        },
        "*"
      );
    }
  }, [selectedBlock?.key, selectedBlock?.content]);

  // Bi-directional postMessage Sync with Iframe Website Canvas
  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      const { type, key, text, content } = event.data || {};
      if (type === "DRAGON_CMS_ELEMENT_SELECTED" && key) {
        onSelectBlockFromCanvas?.(key, text || "");
      } else if (type === "DRAGON_CMS_TEXT_TYPING" && content !== undefined) {
        onLiveTyping?.(content);
      } else if (type === "DRAGON_CMS_SAVE_BLOCK" && content !== undefined) {
        onSaveBlockContent?.(content);
      }
    };

    window.addEventListener("message", handleParentMessage);
    return () => window.removeEventListener("message", handleParentMessage);
  }, [onSaveBlockContent, onLiveTyping, onSelectBlockFromCanvas]);

  return (
    <div className={`relative w-full h-full flex-1 overflow-hidden bg-[#030712] flex flex-col items-center justify-center select-none ${isDesktop ? "p-0" : "p-4 sm:p-6"}`}>
      {isDesktop ? (
        /* ═══ 100% True Edge-to-Edge Desktop & Laptop Screen ═══ */
        <div className="relative w-full h-full bg-[#030712] overflow-hidden flex-1">
          {iframeLoading && (
            <div className="absolute inset-0 z-10 bg-[#030712] flex flex-col items-center justify-center space-y-3">
              <div className="w-9 h-9 rounded-full border-2 border-cyan-400/20 border-t-[#00f0ff] animate-spin" />
              <span className="text-xs font-mono text-cyan-300 tracking-wider">CONNECTING FULL SCREEN STUDIO...</span>
            </div>
          )}

          <iframe
            key={`${targetUrl}-${onRefreshKey}`}
            ref={iframeRef}
            src={targetUrl}
            title="Dragon Studios Live Website"
            onLoad={() => setIframeLoading(false)}
            className="w-full h-full border-0 bg-[#030712] block"
            allow="fullscreen; clipboard-read; clipboard-write;"
          />
        </div>
      ) : (
        /* ═══ Device Mockup Frames for Mobile & Tablet ═══ */
        <div
          className={`relative transition-all duration-300 rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#040812] flex flex-col ${
            viewportMode === "mobile" ? "max-w-[390px] w-full h-[844px]" : "max-w-[820px] w-full h-[1024px]"
          }`}
        >
          {/* Device Top Bezel */}
          <div className="h-8 bg-[#07111F] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-mono text-slate-400">
              {viewportMode === "mobile" ? "iPhone 15 Pro (390 x 844)" : "iPad Air (820 x 1024)"}
            </span>
            <div className="w-12 h-1.5 rounded-full bg-slate-700/60" />
          </div>

          <div className="relative flex-1 w-full h-full bg-[#030712] overflow-hidden">
            {iframeLoading && (
              <div className="absolute inset-0 z-10 bg-[#030712] flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 rounded-full border-2 border-cyan-400/20 border-t-[#00f0ff] animate-spin" />
                <span className="text-[10px] font-mono text-slate-400">Loading device view...</span>
              </div>
            )}

            <iframe
              key={`${targetUrl}-${onRefreshKey}`}
              ref={iframeRef}
              src={targetUrl}
              title="Dragon Studios Device Preview"
              onLoad={() => setIframeLoading(false)}
              className="w-full h-full border-0 bg-[#030712]"
              allow="fullscreen; clipboard-read; clipboard-write;"
            />
          </div>
        </div>
      )}
    </div>
  );
}
