"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Save,
  CheckCircle2,
  Layers,
  Sliders,
  MousePointerClick,
  Maximize2,
  Minimize2,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { VisualStudioCanvas } from "@/components/cms/VisualStudioCanvas";
import { VisualStudioLeftSidebar } from "@/components/cms/VisualStudioLeftSidebar";
import { VisualStudioInspector } from "@/components/cms/VisualStudioInspector";
import { GeminiAICopilot } from "@/components/cms/GeminiAICopilot";
import { CMSPageItem } from "@/components/cms/PageManagerModal";

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

export default function FullscreenDedicatedStudioPage() {
  const [pages] = useState<CMSPageItem[]>([
    { id: "1", title: "Home Page", slug: "/", status: "PUBLISHED", category: "General", updatedAt: "Live" },
    { id: "2", title: "Games Showcase", slug: "/games", status: "PUBLISHED", category: "Games", updatedAt: "Live" },
    { id: "3", title: "Dragon Studio Tech", slug: "/studio", status: "PUBLISHED", category: "Studio", updatedAt: "Live" },
    { id: "4", title: "Downloads Launcher", slug: "/downloads", status: "PUBLISHED", category: "Downloads", updatedAt: "Live" },
    { id: "5", title: "Community Lounge", slug: "/community", status: "PUBLISHED", category: "Community", updatedAt: "Live" },
    { id: "6", title: "Contact Support", slug: "/contact", status: "PUBLISHED", category: "Support", updatedAt: "Live" },
    { id: "7", title: "Careers Center", slug: "/careers", status: "PUBLISHED", category: "Company", updatedAt: "Live" },
    { id: "8", title: "News & Press", slug: "/news", status: "PUBLISHED", category: "News", updatedAt: "Live" },
  ]);

  const [activePage, setActivePage] = useState<CMSPageItem>(pages[0]);
  const [blocks, setBlocks] = useState<CMSBlock[]>([]);
  const [categories] = useState<string[]>(["All", "Hero", "Games", "Studio", "News", "Footer", "General"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBlock, setSelectedBlock] = useState<CMSBlock | null>(null);

  const [editContent, setEditContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile" | "responsive" | "2k" | "4k">("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await fetch(`/api/cms/blocks?category=${encodeURIComponent(selectedCategory)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.blocks)) {
        setBlocks(data.blocks);
        if (data.blocks.length > 0 && !selectedBlock) {
          setSelectedBlock(data.blocks[0]);
          setEditContent(data.blocks[0].content);
          setIsPublished(data.blocks[0].isPublished);
        }
      }
    } catch (e) {
      console.error("Fetch blocks error", e);
    }
  }, [selectedCategory, selectedBlock]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchBlocks();
    });
    return () => { isMounted = false; };
  }, [fetchBlocks]);

  const handleSelectBlock = (b: CMSBlock) => {
    setSelectedBlock(b);
    setEditContent(b.content);
    setIsPublished(b.isPublished);
    setIsRightOpen(true);
  };

  const handleSaveBlock = async (shouldRefreshCanvas = false, overrideContent?: string) => {
    if (!selectedBlock) return;
    const contentToSave = overrideContent !== undefined ? overrideContent : editContent;

    setSaving(true);
    try {
      const res = await fetch("/api/cms/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: selectedBlock.key,
          category: selectedBlock.category,
          label: selectedBlock.label,
          type: selectedBlock.type,
          content: contentToSave,
          draftContent: contentToSave,
          isPublished,
          updatedBy: "Dragon Studio Admin",
        }),
      });

      const data = await res.json();
      if (data.success && data.block) {
        setBlocks((prev) => prev.map((b) => (b.key === data.block.key ? data.block : b)));
        setSelectedBlock(data.block);
        setEditContent(data.block.content);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);

        const payload = {
          type: "DRAGON_CMS_REALTIME_SYNC",
          key: data.block.key,
          content: data.block.content,
          status: "saved",
          timestamp: Date.now(),
        };
        window.postMessage(payload, "*");
        try {
          const bc = new BroadcastChannel("dragon_cms_live_sync");
          bc.postMessage(payload);
          bc.close();
        } catch {}

        if (shouldRefreshCanvas) {
          setRefreshKey((k) => k + 1);
        }
      }
    } catch (e) {
      console.error("Save block error", e);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyAiContent = async (key: string, newContent: string) => {
    const target = blocks.find((b) => b.key === key) || selectedBlock;
    if (!target) return;

    setEditContent(newContent);
    setSelectedBlock((prev) => (prev ? { ...prev, content: newContent } : null));

    try {
      await fetch("/api/cms/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: target.key,
          category: target.category,
          label: target.label,
          type: target.type,
          content: newContent,
          draftContent: newContent,
          isPublished: true,
          updatedBy: "Gemini 2.5 AI Copilot",
        }),
      });

      const payload = {
        type: "DRAGON_CMS_REALTIME_SYNC",
        key: target.key,
        content: newContent,
        status: "saved",
        timestamp: Date.now(),
      };
      window.postMessage(payload, "*");
      try {
        const bc = new BroadcastChannel("dragon_cms_live_sync");
        bc.postMessage(payload);
        bc.close();
      } catch {}

      fetchBlocks();
    } catch (e) {
      console.error("Error applying AI content", e);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm("Are you sure you want to reset all website copy back to the official Dragon Studios default text?")) {
      return;
    }
    try {
      const res = await fetch("/api/cms/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_defaults" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("All website copy has been restored to official default seeds!");
        setRefreshKey((k) => k + 1);
        fetchBlocks();
      }
    } catch (e) {
      console.error("Reset error", e);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#02040A] text-[#F8FAFC] font-sans overflow-hidden select-none">
      {/* ═══ Ultra-Sleek Floating Top HUD (44px) ═══ */}
      <div className="bg-[#050C17]/95 backdrop-blur-xl border-b border-cyan-500/20 px-3 sm:px-5 py-2 flex items-center justify-between gap-3 shadow-2xl z-30 select-none h-12 shrink-0">
        {/* Left: Back & Fullscreen & Page */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cms"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#030712] border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CMS</span>
          </Link>

          <button
            onClick={toggleNativeFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
              isFullscreen
                ? "bg-[#00f0ff] text-black border-[#00f0ff] shadow-lg shadow-cyan-500/30 font-black"
                : "bg-[#030712] border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400"
            }`}
            title="Press F11 for Full Laptop Screen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? "Exit Fullscreen" : "Full Screen [F11]"}</span>
          </button>

          <button
            onClick={() => setIsLeftOpen(!isLeftOpen)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
              isLeftOpen
                ? "bg-cyan-500/20 text-[#00f0ff] border-cyan-400"
                : "bg-[#030712] border-cyan-500/20 text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Blocks</span>
          </button>

          <select
            value={activePage.id}
            onChange={(e) => {
              const found = pages.find((p) => p.id === e.target.value);
              if (found) setActivePage(found);
            }}
            className="bg-[#030712] border border-cyan-500/30 rounded-xl px-2.5 py-1.5 text-white text-xs font-mono font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {pages.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#07111F] text-white">
                {p.title} ({p.slug})
              </option>
            ))}
          </select>
        </div>

        {/* Center: Device Presets & Click-To-Edit Badge */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center bg-[#030712] border border-cyan-500/30 rounded-xl p-0.5 shadow-inner">
            <button
              onClick={() => setViewportMode("desktop")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewportMode === "desktop"
                  ? "bg-[#00f0ff] text-black shadow-md shadow-cyan-500/30 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>100% Full Screen</span>
            </button>

            <button
              onClick={() => setViewportMode("tablet")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewportMode === "tablet"
                  ? "bg-[#00f0ff] text-black shadow-md shadow-cyan-500/30 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>

            <button
              onClick={() => setViewportMode("mobile")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewportMode === "mobile"
                  ? "bg-[#00f0ff] text-black shadow-md shadow-cyan-500/30 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
            <MousePointerClick className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span>Click any text on website to edit</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="p-1.5 rounded-xl bg-[#030712] border border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 transition-all cursor-pointer"
            title="Reset to Official Dragon Studios Copy"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 rounded-xl bg-[#030712] border border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
            title="Refresh Live Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={`https://dragongamingstudios.vercel.app${activePage.slug}?editor=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xl bg-[#030712] border border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* ✦ PROMINENT GEMINI AI BUTTON ✦ */}
          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-heading font-black tracking-wider uppercase transition-all cursor-pointer shadow-lg ${
              isAiOpen
                ? "bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 text-black border-[#00f0ff] shadow-cyan-500/50 scale-105"
                : "bg-gradient-to-r from-blue-900/60 via-[#07111F] to-blue-900/60 border-cyan-400/50 text-[#00f0ff] hover:border-cyan-300 hover:text-white shadow-cyan-500/20"
            }`}
            title="Open Google Gemini AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span>✦ GEMINI AI</span>
          </button>

          <button
            onClick={() => setIsRightOpen(!isRightOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
              isRightOpen
                ? "bg-cyan-500/20 text-[#00f0ff] border-cyan-400"
                : "bg-[#030712] border-cyan-500/20 text-slate-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>

          <button
            onClick={() => handleSaveBlock(true)}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#19C7FF] text-black text-xs font-heading font-black tracking-wider uppercase shadow-lg shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>SAVING...</span>
              </>
            ) : savedSuccess ? (
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
      </div>

      {/* ═══ 100% Screen Edge-to-Edge Canvas ═══ */}
      <div className="flex-1 flex overflow-hidden relative">
        <VisualStudioLeftSidebar
          isOpen={isLeftOpen}
          blocks={blocks}
          selectedBlock={selectedBlock}
          onSelectBlock={handleSelectBlock}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="flex-1 flex flex-col overflow-hidden relative bg-[#030712]">
          <VisualStudioCanvas
            viewportMode={viewportMode}
            zoomLevel={1}
            activeSlug={activePage.slug}
            onRefreshKey={refreshKey}
            selectedBlock={selectedBlock}
            targetEnv="production"
            onLiveTyping={(newContent) => {
              setEditContent(newContent);
              if (selectedBlock) {
                setSelectedBlock((prev) => (prev ? { ...prev, content: newContent } : null));
                try {
                  const bc = new BroadcastChannel("dragon_cms_live_sync");
                  bc.postMessage({
                    type: "DRAGON_CMS_TEXT_UPDATE",
                    key: selectedBlock.key,
                    content: newContent,
                  });
                  bc.close();
                } catch {}
              }
            }}
            onSaveBlockContent={(newContent) => {
              setEditContent(newContent);
              handleSaveBlock(false, newContent);
            }}
            onSelectBlockFromCanvas={(key, text) => {
              const found = blocks.find((b) => b.key === key);
              if (found) {
                handleSelectBlock(found);
              } else if (key) {
                setSelectedBlock({
                  id: String(Date.now()),
                  key,
                  category: "Live Editable",
                  label: key,
                  type: "text",
                  content: text,
                  isPublished: true,
                  version: 1,
                  updatedBy: "Canvas Click",
                  updatedAt: "Just now",
                });
                setEditContent(text);
                setIsRightOpen(true);
              }
            }}
          />
        </div>

        <VisualStudioInspector
          isOpen={isRightOpen}
          onClose={() => setIsRightOpen(false)}
          selectedBlock={selectedBlock}
          editContent={editContent}
          setEditContent={setEditContent}
          isPublished={isPublished}
          setIsPublished={setIsPublished}
          isSaving={saving}
          isSavedSuccess={savedSuccess}
          onSave={handleSaveBlock}
          onLiveTyping={(newContent) => {
            setEditContent(newContent);
            if (selectedBlock) {
              setSelectedBlock((prev) => (prev ? { ...prev, content: newContent } : null));
              try {
                const bc = new BroadcastChannel("dragon_cms_live_sync");
                bc.postMessage({
                  type: "DRAGON_CMS_TEXT_UPDATE",
                  key: selectedBlock.key,
                  content: newContent,
                });
                bc.close();
              } catch {}
            }
          }}
        />

        {/* ✦ GEMINI AI COPILOT ✦ */}
        <GeminiAICopilot
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          blocks={blocks}
          selectedBlock={selectedBlock}
          onSelectBlock={(b) => {
            setSelectedBlock(b);
            setEditContent(b.content);
          }}
          onApplyContent={handleApplyAiContent}
        />
      </div>
    </div>
  );
}
