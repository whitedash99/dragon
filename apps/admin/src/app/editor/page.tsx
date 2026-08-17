"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  Save,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { VisualStudioCanvas } from "@/components/cms/VisualStudioCanvas";
import { VisualStudioInspector } from "@/components/cms/VisualStudioInspector";
import { PageManagerModal, CMSPageItem } from "@/components/cms/PageManagerModal";

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

export default function EnterpriseLiveEditorStudioPage() {
  const [pages, setPages] = useState<CMSPageItem[]>([
    { id: "1", title: "Home Page", slug: "/", status: "PUBLISHED", category: "General", updatedAt: "Just now" },
    { id: "2", title: "Games Catalog", slug: "/games", status: "PUBLISHED", category: "Games", updatedAt: "2 mins ago" },
    { id: "3", title: "Dragon Studio Tech", slug: "/studio", status: "PUBLISHED", category: "Studio", updatedAt: "10 mins ago" },
    { id: "4", title: "Downloads Launcher", slug: "/downloads", status: "PUBLISHED", category: "Downloads", updatedAt: "1 hour ago" },
    { id: "5", title: "Community Forums", slug: "/community", status: "PUBLISHED", category: "Community", updatedAt: "Yesterday" },
    { id: "6", title: "Contact Support", slug: "/contact", status: "PUBLISHED", category: "Support", updatedAt: "Yesterday" },
  ]);

  const [activePage, setActivePage] = useState<CMSPageItem>(pages[0]);
  const [pageManagerOpen, setPageManagerOpen] = useState(false);

  const [blocks, setBlocks] = useState<CMSBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<CMSBlock | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatusText, setSaveStatusText] = useState<"Saved ✓" | "Saving...">("Saved ✓");

  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile" | "responsive">("desktop");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [leftTab, setLeftTab] = useState<"pages" | "layers">("pages");
  const [isRightOpen] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await fetch("/api/cms/blocks");
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
  }, [selectedBlock]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleSelectBlock = (b: CMSBlock) => {
    setSelectedBlock(b);
    setEditContent(b.content || "");
    setIsPublished(b.isPublished);
  };

  const handleSaveBlock = async (shouldRefreshCanvas = false, overrideContent?: string) => {
    if (!selectedBlock) return;
    const contentToSave = (overrideContent !== undefined ? overrideContent : editContent).trim() || "Start typing...";

    setSaving(true);
    setSaveStatusText("Saving...");
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
          updatedBy: "Dragon Studio Architect",
        }),
      });

      const data = await res.json();
      if (data.success && data.block) {
        setSaveStatusText("Saved ✓");
        setBlocks((prev) => prev.map((b) => (b.key === data.block.key ? { ...b, ...data.block } : b)));
        setSelectedBlock((prev) => (prev ? { ...prev, ...data.block } : null));

        if (shouldRefreshCanvas) setRefreshKey((prev) => prev + 1);
      }
    } catch (e) {
      console.error("Save block error", e);
      setSaveStatusText("Saved ✓");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans select-none overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        {/* STUDIO CONTROL BAR */}
        <header className="h-12 bg-[#121215] border-b border-white/10 px-6 flex items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="font-semibold text-white">Visual Studio</span>
            <span className="text-zinc-500">Editing: {activePage.title}</span>
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
            {[
              { id: "desktop" as const, label: "Desktop", icon: Monitor },
              { id: "tablet" as const, label: "Tablet", icon: Tablet },
              { id: "mobile" as const, label: "Mobile", icon: Smartphone },
            ].map((vp) => {
              const Icon = vp.icon;
              const isSelected = viewportMode === vp.id;
              return (
                <button
                  key={vp.id}
                  onClick={() => setViewportMode(vp.id)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all",
                    isSelected ? "bg-white/15 text-white font-semibold" : "text-zinc-400 hover:text-white"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{vp.label}</span>
                </button>
              );
            })}
          </div>

          {/* Save Action */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-emerald-400 flex items-center gap-1">
              <Check className="size-3.5" /> {saveStatusText}
            </span>

            <button
              onClick={() => handleSaveBlock(true)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all"
            >
              <Save className="size-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE LAYOUT */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* LEFT PANEL */}
          <aside className="w-64 bg-[#0c0c0e] border-r border-white/10 flex flex-col shrink-0">
            <div className="flex items-center border-b border-white/5 px-2 py-2 bg-white/[0.02]">
              {[
                { id: "pages" as const, label: "Pages", icon: Globe },
                { id: "layers" as const, label: "Blocks", icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = leftTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setLeftTab(tab.id)}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium flex items-center justify-center gap-1.5 rounded-lg transition-all",
                      active ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {leftTab === "pages" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-semibold text-zinc-500 uppercase pb-2 border-b border-white/5">
                    <span>Pages</span>
                    <button onClick={() => setPageManagerOpen(true)} className="text-zinc-300 hover:text-white">+ Manage</button>
                  </div>
                  <div className="space-y-1">
                    {pages.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActivePage(p)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all",
                          activePage.id === p.id ? "bg-white/10 border-white/15 text-white font-semibold" : "bg-white/[0.02] border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <div>
                          <div className="font-medium text-white">{p.title}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">{p.slug}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {leftTab === "layers" && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-semibold text-zinc-500 uppercase pb-2 border-b border-white/5">
                    CMS Blocks
                  </div>
                  <div className="space-y-1">
                    {blocks.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectBlock(b)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border text-xs space-y-1 transition-all",
                          selectedBlock?.id === b.id ? "bg-white/10 border-white/15 text-white font-semibold" : "bg-white/[0.02] border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{b.label}</span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500 truncate">{b.key}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* CENTER PREVIEW CANVAS */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative overflow-hidden">
            <VisualStudioCanvas
              viewportMode={viewportMode}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              showRulers={false}
              showGrid={false}
              activeSlug={activePage.slug}
              onRefreshKey={refreshKey}
              selectedBlock={selectedBlock}
              onLiveTyping={(newContent) => {
                setEditContent(newContent);
                if (selectedBlock) {
                  setSelectedBlock((prev) => (prev ? { ...prev, content: newContent } : null));
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
                } else if (selectedBlock && selectedBlock.key === key) {
                  setEditContent(text || "");
                }
              }}
            />
          </main>

          {/* RIGHT PROPERTY INSPECTOR */}
          <VisualStudioInspector
            isOpen={isRightOpen}
            selectedBlock={selectedBlock}
            editContent={editContent}
            setEditContent={setEditContent}
            isPublished={isPublished}
            setIsPublished={setIsPublished}
            onSaveBlock={handleSaveBlock}
            onOpenHistory={() => {}}
            saving={saving}
          />
        </div>
      </div>

      {/* Page Manager Modal */}
      <PageManagerModal
        isOpen={pageManagerOpen}
        onClose={() => setPageManagerOpen(false)}
        pages={pages}
        onAddPage={(title, slug) => {
          const newP: CMSPageItem = { id: String(Date.now()), title, slug, status: "DRAFT", category: "Custom", updatedAt: "Just now" };
          setPages((prev) => [...prev, newP]);
          setActivePage(newP);
        }}
        onDuplicatePage={(id) => {
          const target = pages.find((p) => p.id === id);
          if (!target) return;
          const dup: CMSPageItem = { id: String(Date.now()), title: `${target.title} (Copy)`, slug: `${target.slug}-copy`, status: "DRAFT", category: target.category, updatedAt: "Just now" };
          setPages((prev) => [...prev, dup]);
        }}
        onDeletePage={(id) => {
          if (pages.length <= 1) return;
          setPages((prev) => prev.filter((p) => p.id !== id));
          if (activePage.id === id) setActivePage(pages[0]);
        }}
        onReorderPages={(up) => setPages(up)}
      />
    </div>
  );
}
