"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { VisualStudioHeader } from "@/components/cms/VisualStudioHeader";
import { VisualStudioCanvas } from "@/components/cms/VisualStudioCanvas";
import { VisualStudioLeftSidebar } from "@/components/cms/VisualStudioLeftSidebar";
import { VisualStudioInspector } from "@/components/cms/VisualStudioInspector";
import { GeminiAICopilot } from "@/components/cms/GeminiAICopilot";
import { CMSBannerManagerModal } from "@/components/cms/CMSBannerManagerModal";
import { CMSBlogManagerModal } from "@/components/cms/CMSBlogManagerModal";
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

export default function CleanDragonStudioCMSPage() {
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

  // Form & Inspector State
  const [editContent, setEditContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Full Screen Review Studio Mode
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Layout: Left & Right Drawers & Gemini AI Copilot
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile" | "responsive" | "2k" | "4k">("desktop");
  const [zoomLevel] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

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
          updatedBy: "Executive Owner",
        }),
      });

      const data = await res.json();
      if (data.success && data.block) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);

        setBlocks((prev) =>
          prev.map((b) => (b.key === data.block.key ? { ...b, ...data.block } : b))
        );
        setSelectedBlock((prev) => (prev ? { ...prev, ...data.block } : null));

        // Real-time Broadcast to Live Website
        if (typeof window !== "undefined") {
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
        }

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

  // Add Block Handler
  const handleAddBlock = async (newBlock: { key: string; category: string; label: string; type: string; content: string }) => {
    try {
      const res = await fetch("/api/cms/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBlock,
          draftContent: newBlock.content,
          isPublished: true,
          updatedBy: "Executive Owner",
        }),
      });
      const data = await res.json();
      if (data.success && data.block) {
        setBlocks((prev) => [data.block, ...prev.filter((b) => b.key !== data.block.key)]);
        setSelectedBlock(data.block);
        setEditContent(data.block.content);
        setIsRightOpen(true);
        fetchBlocks();
      }
    } catch (e) {
      console.error("Add block error", e);
    }
  };

  // Delete Block Handler
  const handleDeleteBlock = async (key: string) => {
    try {
      const res = await fetch(`/api/cms/blocks?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBlocks((prev) => prev.filter((b) => b.key !== key));
        if (selectedBlock?.key === key) {
          setSelectedBlock(null);
          setIsRightOpen(false);
        }
      }
    } catch (e) {
      console.error("Delete block error", e);
    }
  };

  // Save Banner Handler
  const handleSaveBanner = async (key: string, content: string, label?: string) => {
    try {
      const res = await fetch("/api/cms/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          category: "Hero",
          label: label || key,
          type: "text",
          content,
          draftContent: content,
          isPublished: true,
          updatedBy: "Banner Studio",
        }),
      });
      const data = await res.json();
      if (data.success && data.block) {
        setBlocks((prev) => [data.block, ...prev.filter((b) => b.key !== data.block.key)]);
        if (typeof window !== "undefined") {
          try {
            const bc = new BroadcastChannel("dragon_cms_live_sync");
            bc.postMessage({
              type: "DRAGON_CMS_REALTIME_SYNC",
              key: data.block.key,
              content: data.block.content,
              status: "saved",
            });
            bc.close();
          } catch {}
        }
        fetchBlocks();
      }
    } catch (e) {
      console.error("Save banner error", e);
    }
  };

  // 1-Click AI Apply to Website & Neon DB
  const handleApplyAiContent = async (key: string, newContent: string) => {
    const target = blocks.find((b) => b.key === key) || selectedBlock;
    if (!target) return;

    setEditContent(newContent);
    setSelectedBlock((prev) => (prev ? { ...prev, content: newContent } : null));

    // Save directly to Neon DB
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
          updatedBy: "Gemini AI Studio Engine",
        }),
      });

      // Broadcast live to canvas
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

  // Reset all blocks to default seeds
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

  const handlePopoutWindow = () => {
    window.open(`https://dragongamingstudios.vercel.app${activePage.slug}?editor=true`, "_blank");
  };

  return (
    <div className="flex h-screen w-screen bg-[#01040D] text-[#F8FAFC] font-sans overflow-hidden select-none">
      {/* Optional Collapsible Sidebar Overlay */}
      {isSidebarOpen && !isFullscreen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 h-full bg-[#040D24] border-r border-cyan-500/30 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-[#01040D] overflow-hidden">
        {/* Studio Header */}
        <VisualStudioHeader
          pages={pages}
          activePage={activePage}
          setActivePage={setActivePage}
          viewportMode={viewportMode}
          setViewportMode={setViewportMode}
          isLeftOpen={isLeftOpen}
          setIsLeftOpen={setIsLeftOpen}
          isRightOpen={isRightOpen}
          setIsRightOpen={setIsRightOpen}
          isAiOpen={isAiOpen}
          setIsAiOpen={setIsAiOpen}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isSaving={saving}
          isSavedSuccess={savedSuccess}
          targetEnv="production"
          setTargetEnv={() => {}}
          onPublishAll={async () => {
            await handleSaveBlock(true);
          }}
          onRefreshCanvas={() => setRefreshKey((k) => k + 1)}
          onPopoutWindow={handlePopoutWindow}
          onResetDefaults={handleResetDefaults}
          onOpenBannerManager={() => setIsBannerModalOpen(true)}
          onOpenBlogManager={() => setIsBlogModalOpen(true)}
        />

        {/* 100% Edge-to-Edge Canvas Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left: Collapsible Blocks Drawer */}
          <VisualStudioLeftSidebar
            isOpen={isLeftOpen}
            blocks={blocks}
            selectedBlock={selectedBlock}
            onSelectBlock={handleSelectBlock}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddBlock={handleAddBlock}
            onDeleteBlock={handleDeleteBlock}
          />

          {/* Center: Full Height & Width Live Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden relative bg-[#020614]">
            <VisualStudioCanvas
              viewportMode={viewportMode}
              zoomLevel={zoomLevel}
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

          {/* Right: Floating Slide-Over Property Inspector */}
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

          {/* ✦ GOD-LEVEL GEMINI AI COPILOT DRAWER ✦ */}
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

          {/* ✦ Dedicated Banner Manager Modal ✦ */}
          <CMSBannerManagerModal
            isOpen={isBannerModalOpen}
            onClose={() => setIsBannerModalOpen(false)}
            onSaveBanner={handleSaveBanner}
            currentBanners={blocks}
          />

          {/* ✦ Dedicated Blog & News Manager Modal ✦ */}
          <CMSBlogManagerModal
            isOpen={isBlogModalOpen}
            onClose={() => setIsBlogModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
