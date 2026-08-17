import React, { useRef, useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MiniMapNavigator } from "./MiniMapNavigator";
import { FloatingFormattingToolbar } from "./FloatingFormattingToolbar";
import { FigmaAlignmentGuides } from "./FigmaAlignmentGuides";

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
  showRulers: boolean;
  showGrid: boolean;
  activeSlug: string;
  onRefreshKey: number;
  selectedBlock?: CMSBlock | null;
  onSaveBlockContent?: (newContent: string) => void;
  onLiveTyping?: (newContent: string) => void;
  onSelectBlockFromCanvas?: (key: string, text: string) => void;
}

export function VisualStudioCanvas({
  viewportMode,
  zoomLevel,
  setZoomLevel,
  showRulers,
  showGrid,
  activeSlug,
  onRefreshKey,
  selectedBlock,
  onSaveBlockContent,
  onLiveTyping,
  onSelectBlockFromCanvas,
}: VisualStudioCanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [port, setPort] = useState("3000");

  // Draggable Resizable Width & Height State (Deterministic 1440x900 for SSR match)
  const [canvasWidth, setCanvasWidth] = useState<number>(1440);
  const [canvasHeight, setCanvasHeight] = useState<number>(900);
  const isInitialMount = useRef(true);

  const [isResizingRight, setIsResizingRight] = useState(false);
  const [isResizingBottom, setIsResizingBottom] = useState(false);

  const rawSlug = activeSlug.startsWith("/") ? activeSlug : `/${activeSlug}`;
  const targetUrl = `http://localhost:${port}${rawSlug}${rawSlug.includes("?") ? "&editor=true" : "?editor=true"}`;

  // Load persisted canvas dimensions after initial client mount to guarantee 100% hydration match
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWidth = localStorage.getItem("dragon_studio_canvas_width");
      if (savedWidth) {
        const parsedWidth = parseInt(savedWidth, 10);
        if (!isNaN(parsedWidth) && parsedWidth >= 320) setCanvasWidth(parsedWidth);
      }
      const savedHeight = localStorage.getItem("dragon_studio_canvas_height");
      if (savedHeight) {
        const parsedHeight = parseInt(savedHeight, 10);
        if (!isNaN(parsedHeight) && parsedHeight >= 400) setCanvasHeight(parsedHeight);
      }
    }
  }, []);

  // Sync preset mode changes
  useEffect(() => {
    if (viewportMode === "desktop") setCanvasWidth(1440);
    else if (viewportMode === "2k") setCanvasWidth(2560);
    else if (viewportMode === "4k") setCanvasWidth(3840);
    else if (viewportMode === "tablet") setCanvasWidth(768);
    else if (viewportMode === "mobile") setCanvasWidth(375);
  }, [viewportMode]);

  // Keyboard Shortcuts (Ctrl+Z Undo, Ctrl+Y Redo, Ctrl+D Duplicate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        console.log("Undo action triggered on canvas");
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
        e.preventDefault();
        console.log("Redo action triggered on canvas");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        console.log("Duplicate element triggered on canvas");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Bi-directional postMessage Sync with Iframe Website Canvas
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
  }, [selectedBlock, onSaveBlockContent, onLiveTyping, onSelectBlockFromCanvas]);

  // Persist dimensions to localStorage after initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("dragon_studio_canvas_width", String(canvasWidth));
      localStorage.setItem("dragon_studio_canvas_height", String(canvasHeight));
    }
  }, [canvasWidth, canvasHeight]);

  // Mouse Wheel Zoom Listener (Ctrl + Wheel up to 500%)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !setZoomLevel) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        setZoomLevel(Math.min(5, Math.max(0.25, zoomLevel + delta)));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoomLevel, setZoomLevel]);

  // Handle Right Border Drag Resize
  const handleMouseDownRight = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);

    const startX = e.clientX;
    const startWidth = canvasWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(320, Math.min(3840, startWidth + deltaX * 2));
      setCanvasWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingRight(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Handle Bottom Border Drag Resize
  const handleMouseDownBottom = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingBottom(true);

    const startY = e.clientY;
    const startHeight = canvasHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(400, Math.min(2160, startHeight + deltaY));
      setCanvasHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizingBottom(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-slate-100/90 p-4 flex flex-col items-center justify-start overflow-auto relative min-h-[700px] select-none"
    >
      {/* Top Rulers Line */}
      {showRulers && (
        <div className="w-full h-5 bg-white border-b border-slate-200 flex items-center justify-between px-4 text-[9px] font-mono text-slate-500 mb-2 rounded-lg shadow-xs">
          <span>0px</span>
          <span>375px</span>
          <span>768px</span>
          <span>1440px</span>
          <span>2560px</span>
          <span>3840px</span>
        </div>
      )}

      {/* Canvas Meta Header */}
      <div className="w-full flex items-center justify-between mb-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">Figma & Webflow Visual Canvas</Badge>
          <span className="font-mono text-[11px] text-slate-500">{targetUrl}</span>
          <span className="text-[10px] font-mono text-slate-900 font-semibold">
            ({canvasWidth}px × {canvasHeight}px)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-500 font-mono">Size:</span>
            <input
              type="number"
              value={canvasWidth}
              onChange={(e) => setCanvasWidth(Math.max(320, parseInt(e.target.value || "320", 10)))}
              className="w-16 px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-900 focus:outline-none focus:border-slate-400 text-center"
              title="Canvas Width (px)"
            />
            <span className="text-slate-400">×</span>
            <input
              type="number"
              value={canvasHeight}
              onChange={(e) => setCanvasHeight(Math.max(400, parseInt(e.target.value || "400", 10)))}
              className="w-16 px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-900 focus:outline-none focus:border-slate-400 text-center"
              title="Canvas Height (px)"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-mono">Port:</span>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-14 px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-900 focus:outline-none focus:border-slate-400"
            />
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-900 hover:text-slate-700 transition-colors font-semibold text-xs"
          >
            Open Live Site <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Formatting Toolbar for Selected Element (Docked Cleanly Above Canvas) */}
      {selectedBlock && (
        <FloatingFormattingToolbar
          elementLabel={selectedBlock.label || selectedBlock.key}
          elementKey={selectedBlock.key}
          elementContent={selectedBlock.content}
          onContentChange={(newText) => onSaveBlockContent?.(newText)}
          onBold={() => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({ type: "DRAGON_CMS_EXEC_COMMAND", command: "bold" }, "*");
            } else {
              onSaveBlockContent?.(`**${selectedBlock.content}**`);
            }
          }}
          onItalic={() => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({ type: "DRAGON_CMS_EXEC_COMMAND", command: "italic" }, "*");
            } else {
              onSaveBlockContent?.(`*${selectedBlock.content}*`);
            }
          }}
          onLink={() => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({ type: "DRAGON_CMS_EXEC_COMMAND", command: "createLink", value: "https://" }, "*");
            } else {
              onSaveBlockContent?.(`[${selectedBlock.content}](https://)`);
            }
          }}
          onAlign={(align) => {
            if (iframeRef.current?.contentWindow) {
              const cmd = align === "left" ? "justifyLeft" : align === "center" ? "justifyCenter" : "justifyRight";
              iframeRef.current.contentWindow.postMessage({ type: "DRAGON_CMS_EXEC_COMMAND", command: cmd }, "*");
            }
          }}
          onHeading={() => {
            onSaveBlockContent?.(`# ${selectedBlock.content}`);
          }}
          onDuplicate={() => console.log("Duplicate element:", selectedBlock.key)}
          onDelete={() => console.log("Delete element:", selectedBlock.key)}
          onUndo={() => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({ type: "DRAGON_CMS_EXEC_COMMAND", command: "undo" }, "*");
            }
          }}
          onRedo={() => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({ type: "DRAGON_CMS_EXEC_COMMAND", command: "redo" }, "*");
            }
          }}
          onAiPolish={() => onSaveBlockContent?.(`Forging unprecedented worlds: ${selectedBlock.content}`)}
        />
      )}

      {/* Resizable Canvas Frame */}
      <div
        className="relative transition-all duration-150 rounded-2xl border border-white/15 bg-slate-900/90 shadow-2xl overflow-hidden group"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top center",
        }}
      >
        {/* Figma Alignment & Distance Snapping Guides */}
        <FigmaAlignmentGuides
          isVisible={showGrid}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />

        {/* Device Frame Header Bar */}
        <div className="h-7 bg-slate-900 border-b border-white/10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {canvasWidth >= 3840
              ? "3840 × 2160 (4K UHD Canvas)"
              : canvasWidth >= 2560
              ? "2560 × 1440 (2K QHD Canvas)"
              : canvasWidth >= 1920
              ? "1920 × 1080 (Full HD Canvas)"
              : `${canvasWidth} × ${canvasHeight} (Custom Resizable)`}
          </span>
        </div>

        {/* Real Live Iframe Canvas */}
        <div className="relative w-full h-[calc(100%-1.75rem)]">
          {showGrid && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10" />
          )}

          <iframe
            key={`${targetUrl}-${onRefreshKey}`}
            ref={iframeRef}
            src={targetUrl}
            title="Dragon Studios AAA Visual Experience Studio Canvas"
            className="w-full h-full border-0 bg-slate-950"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>

        {/* Draggable Right Edge Resize Handle */}
        <div
          onMouseDown={handleMouseDownRight}
          className={`absolute top-0 right-0 w-2.5 h-full cursor-ew-resize hover:bg-purple-500/40 transition-colors z-30 ${
            isResizingRight ? "bg-purple-500/60" : "bg-transparent"
          }`}
          title="Drag to resize width"
        />

        {/* Draggable Bottom Edge Resize Handle */}
        <div
          onMouseDown={handleMouseDownBottom}
          className={`absolute bottom-0 left-0 w-full h-2.5 cursor-ns-resize hover:bg-purple-500/40 transition-colors z-30 ${
            isResizingBottom ? "bg-purple-500/60" : "bg-transparent"
          }`}
          title="Drag to resize height"
        />
      </div>

      {/* Mini-Map Viewport Navigator */}
      <MiniMapNavigator
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        zoomLevel={zoomLevel}
        onResetView={() => {
          setCanvasWidth(1440);
          setCanvasHeight(900);
          if (setZoomLevel) setZoomLevel(1);
        }}
      />
    </div>
  );
}
