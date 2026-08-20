"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Save,
  CheckCircle2,
  Layers,
  Sliders,
  Maximize2,
  Minimize2,
  Sparkles,
  RotateCcw,
  LayoutDashboard,
  Menu,
  Radio,
  Newspaper
} from "lucide-react";
import { CMSPageItem } from "./PageManagerModal";

interface VisualStudioHeaderProps {
  pages: CMSPageItem[];
  activePage: CMSPageItem;
  setActivePage: (page: CMSPageItem) => void;
  viewportMode: "desktop" | "tablet" | "mobile" | "responsive" | "2k" | "4k";
  setViewportMode: (mode: "desktop" | "tablet" | "mobile" | "responsive" | "2k" | "4k") => void;
  isLeftOpen: boolean;
  setIsLeftOpen: (open: boolean) => void;
  isRightOpen: boolean;
  setIsRightOpen: (open: boolean) => void;
  isAiOpen?: boolean;
  setIsAiOpen?: (open: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  isSaving: boolean;
  isSavedSuccess: boolean;
  targetEnv: "production" | "local";
  setTargetEnv?: (env: "production" | "local") => void;
  onPublishAll: () => Promise<void>;
  onRefreshCanvas: () => void;
  onPopoutWindow: () => void;
  onResetDefaults?: () => Promise<void>;
  onOpenBannerManager?: () => void;
  onOpenBlogManager?: () => void;
}

export function VisualStudioHeader({
  pages,
  activePage,
  setActivePage,
  viewportMode,
  setViewportMode,
  isLeftOpen,
  setIsLeftOpen,
  isRightOpen,
  setIsRightOpen,
  isAiOpen = false,
  setIsAiOpen,
  isFullscreen,
  setIsFullscreen,
  isSidebarOpen = false,
  setIsSidebarOpen,
  isSaving,
  isSavedSuccess,
  onPublishAll,
  onRefreshCanvas,
  onPopoutWindow,
  onResetDefaults,
  onOpenBannerManager,
  onOpenBlogManager,
}: VisualStudioHeaderProps) {

  // Native F11 / Browser Fullscreen Trigger
  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Sync state with native browser fullscreen events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [setIsFullscreen]);

  return (
    <header className="bg-[#040D24]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-3 sm:px-4 py-1 flex items-center justify-between gap-2 shadow-2xl z-30 select-none text-[#F8FAFC] h-12 shrink-0 w-full overflow-x-auto overflow-y-hidden no-scrollbar whitespace-nowrap">
      {/* ═══ Left: Navigation, Fullscreen & Page Selector ═══ */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Toggle Admin Sidebar */}
        {setIsSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
              isSidebarOpen
                ? "bg-cyan-500/20 text-[#00f0ff] border-cyan-400"
                : "bg-[#01040D] border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-400"
            }`}
            title="Toggle Admin Sidebar Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#01040D] border border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-400 text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
          title="Back to Admin Dashboard"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>

        {/* Fullscreen Trigger */}
        <button
          onClick={toggleNativeFullscreen}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            isFullscreen
              ? "bg-[#00f0ff] text-black border-[#00f0ff] shadow-lg shadow-cyan-500/30 font-black"
              : "bg-[#01040D] border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400"
          }`}
          title="Toggle Fullscreen Mode (Press F11 for Full Laptop Screen)"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? "Exit" : "Full Screen [F11]"}</span>
        </button>

        {/* Blocks Drawer Toggle */}
        <button
          onClick={() => setIsLeftOpen(!isLeftOpen)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            isLeftOpen
              ? "bg-cyan-500/20 text-[#00f0ff] border-cyan-400"
              : "bg-[#01040D] border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-400"
          }`}
          title="Toggle Content Blocks Drawer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Blocks</span>
        </button>

        {/* Page Select */}
        <select
          value={activePage.id}
          onChange={(e) => {
            const found = pages.find((p) => p.id === e.target.value);
            if (found) setActivePage(found);
          }}
          className="bg-[#01040D] border border-cyan-500/30 rounded-xl px-2 py-1.5 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00f0ff] cursor-pointer shrink-0 max-w-[150px] truncate"
        >
          {pages.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#040D24] text-white">
              {p.title} ({p.slug})
            </option>
          ))}
        </select>
      </div>

      {/* ═══ Center: Responsive Device Presets + Dedicated Studio Modals ═══ */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Add Banner Button */}
        {onOpenBannerManager && (
          <button
            onClick={onOpenBannerManager}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#01040D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
            title="Manage Announcement Banners"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>✦ Add Banner</span>
          </button>
        )}

        {/* Add Blog Button */}
        {onOpenBlogManager && (
          <button
            onClick={onOpenBlogManager}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#01040D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
            title="Manage Blog Articles & Dispatches"
          >
            <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
            <span>✦ Add Blog</span>
          </button>
        )}

        <div className="flex items-center bg-[#01040D] border border-cyan-500/30 rounded-xl p-0.5 shadow-inner shrink-0">
          <button
            onClick={() => setViewportMode("desktop")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              viewportMode === "desktop"
                ? "bg-[#00f0ff] text-black shadow-md shadow-cyan-500/30 font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="Desktop Mode (100% Width)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Desktop</span>
          </button>

          <button
            onClick={() => setViewportMode("tablet")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              viewportMode === "tablet"
                ? "bg-[#00f0ff] text-black shadow-md shadow-cyan-500/30 font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tablet Mode (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tablet</span>
          </button>

          <button
            onClick={() => setViewportMode("mobile")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              viewportMode === "mobile"
                ? "bg-[#00f0ff] text-black shadow-md shadow-cyan-500/30 font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="Mobile Mode (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* ═══ Right: Actions, Gemini AI Copilot, Inspector Toggle, Save ═══ */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Quick Actions Toolstrip */}
        <div className="flex items-center bg-[#01040D] border border-cyan-500/30 rounded-xl p-0.5 shadow-inner shrink-0">
          {onResetDefaults && (
            <button
              onClick={onResetDefaults}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
              title="Reset all blocks to Dragon Studios defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onRefreshCanvas}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            title="Reload live website canvas"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPopoutWindow}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            title="Open live website in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PROMINENT GEMINI AI BUTTON */}
        <button
          onClick={() => setIsAiOpen?.(!isAiOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-heading font-black tracking-wider uppercase transition-all cursor-pointer shadow-lg shrink-0 ${
            isAiOpen
              ? "bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 text-black border-[#00f0ff] shadow-cyan-500/50 scale-105"
              : "bg-gradient-to-r from-blue-900/70 via-[#040D24] to-blue-900/70 border-cyan-400/50 text-[#00f0ff] hover:border-cyan-300 hover:text-white shadow-cyan-500/20"
          }`}
          title="Open Google Gemini AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
          <span>✦ GEMINI AI</span>
        </button>

        {/* Inspector Toggle */}
        <button
          onClick={() => setIsRightOpen(!isRightOpen)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            isRightOpen
              ? "bg-cyan-500/20 text-[#00f0ff] border-cyan-400"
              : "bg-[#01040D] border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-400"
          }`}
          title="Toggle Property Inspector"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inspector</span>
        </button>

        {/* Save & Publish Button */}
        <button
          onClick={onPublishAll}
          disabled={isSaving}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black text-xs font-heading font-black tracking-wider uppercase shadow-lg shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>SAVING...</span>
            </>
          ) : isSavedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              <span>SAVED!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>SAVE & PUBLISH</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
