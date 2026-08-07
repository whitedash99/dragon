"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { History, X, Minimize2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VisualStudioHeader } from "@/components/cms/VisualStudioHeader";
import { VisualStudioCanvas } from "@/components/cms/VisualStudioCanvas";
import { VisualStudioLeftSidebar } from "@/components/cms/VisualStudioLeftSidebar";
import { VisualStudioInspector } from "@/components/cms/VisualStudioInspector";
import { SEOInspectorPanel } from "@/components/cms/SEOInspectorPanel";
import { TextDictionaryManager } from "@/components/cms/TextDictionaryManager";
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

interface Revision {
  id: string;
  blockKey: string;
  version: number;
  content: string;
  changedBy: string;
  createdAt: string;
}

export default function ResizableFigmaStudioPage() {
  const [pages, setPages] = useState<CMSPageItem[]>([
    { id: "1", title: "Home Page", slug: "/", status: "PUBLISHED", category: "General", updatedAt: "Just now" },
    { id: "2", title: "Games Catalog", slug: "/games", status: "PUBLISHED", category: "Games", updatedAt: "2 mins ago" },
    { id: "3", title: "Dragon Studio Tech", slug: "/studio", status: "PUBLISHED", category: "Studio", updatedAt: "10 mins ago" },
    { id: "4", title: "Downloads Launcher", slug: "/downloads", status: "PUBLISHED", category: "Downloads", updatedAt: "1 hour ago" },
    { id: "5", title: "Community Forums", slug: "/community", status: "PUBLISHED", category: "Community", updatedAt: "Yesterday" },
    { id: "6", title: "Contact Support", slug: "/contact", status: "PUBLISHED", category: "Support", updatedAt: "Yesterday" },
    { id: "7", title: "Careers & Hiring", slug: "/careers", status: "PUBLISHED", category: "Company", updatedAt: "Yesterday" },
    { id: "8", title: "News & Press", slug: "/news", status: "PUBLISHED", category: "News", updatedAt: "Yesterday" },
  ]);

  const [activePage, setActivePage] = useState<CMSPageItem>(pages[0]);
  const [pageManagerOpen, setPageManagerOpen] = useState(false);
  const [blocks, setBlocks] = useState<CMSBlock[]>([]);
  const [categories] = useState<string[]>(["All", "Hero", "Games", "Studio", "News", "Footer", "General"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBlock, setSelectedBlock] = useState<CMSBlock | null>(null);

  // Form & Inspector State
  const [editContent, setEditContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Studio Viewport & Layout State
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile" | "responsive" | "2k" | "4k">("desktop");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRulers, setShowRulers] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMaximizedCanvas, setIsMaximizedCanvas] = useState(false);

  // View Mode Tabs
  const [viewTab, setViewTab] = useState<"visual" | "dictionary" | "seo">("visual");
  const [refreshKey, setRefreshKey] = useState(0);

  // Revision History State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Auto-collapse sidebars on Canvas Maximize toggle
  useEffect(() => {
    if (isMaximizedCanvas) {
      setIsLeftOpen(false);
      setIsRightOpen(false);
    } else {
      setIsLeftOpen(true);
      setIsRightOpen(true);
    }
  }, [isMaximizedCanvas]);

  // Keyboard Shortcuts (F11 Fullscreen, Esc Exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

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
  };

  const handleSaveBlock = async (shouldRefreshCanvas = false) => {
    if (!selectedBlock) return;
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
          content: editContent,
          isPublished,
          updatedBy: "Dragon Studio Admin",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
        fetchBlocks();
        if (shouldRefreshCanvas) {
          setRefreshKey((prev) => prev + 1);
        }
      }
    } catch (e) {
      console.error("Save block error", e);
    } finally {
      setSaving(false);
    }
  };

  const handlePopoutWindow = () => {
    const targetUrl = `http://localhost:3000${activePage.slug}`;
    window.open(targetUrl, "_blank", "width=1440,height=900,menubar=no,toolbar=no");
  };

  const fetchRevisions = async () => {
    if (!selectedBlock) return;
    setLoadingHistory(true);
    setHistoryOpen(true);
    try {
      const res = await fetch(`/api/cms/history?blockKey=${encodeURIComponent(selectedBlock.key)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.revisions)) {
        setRevisions(data.revisions);
      }
    } catch (e) {
      console.error("Fetch revisions error", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Page CRUD handlers
  const handleAddPage = (title: string, slug: string) => {
    const newPage: CMSPageItem = {
      id: String(Date.now()),
      title,
      slug,
      status: "DRAFT",
      category: "Custom",
      updatedAt: "Just now",
    };
    setPages((prev) => [...prev, newPage]);
    setActivePage(newPage);
  };

  const handleDuplicatePage = (id: string) => {
    const target = pages.find((p) => p.id === id);
    if (!target) return;
    const duplicated: CMSPageItem = {
      id: String(Date.now()),
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy`,
      status: "DRAFT",
      category: target.category,
      updatedAt: "Just now",
    };
    setPages((prev) => [...prev, duplicated]);
  };

  const handleDeletePage = (id: string) => {
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((p) => p.id !== id));
    if (activePage.id === id) {
      setActivePage(pages[0]);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Fullscreen Portal Mode Overlay */}
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col w-screen h-screen">
          {/* Top Fullscreen Control Bar */}
          <div className="bg-slate-900/90 border-b border-white/10 px-6 py-2.5 flex items-center justify-between z-30">
            <div className="flex items-center gap-3">
              <Badge variant="purple" size="sm">Fullscreen Mode (Press Esc to exit)</Badge>
              <span className="text-xs font-mono text-slate-300">Target Route: {activePage.slug}</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handlePopoutWindow}
                variant="outline"
                className="text-xs border-white/10 text-slate-300 hover:bg-white/5"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Dual Monitor Pop-Out
              </Button>

              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-950/40"
              >
                <Minimize2 className="w-4 h-4" /> Return to Studio Editor
              </button>
            </div>
          </div>

          {/* Fullscreen Live Canvas */}
          <div className="flex-1 w-full h-full">
            <VisualStudioCanvas
              viewportMode={viewportMode}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              showRulers={showRulers}
              showGrid={showGrid}
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
                handleSaveBlock(false);
              }}
              onSelectBlockFromCanvas={(key, text) => {
                const found = blocks.find((b) => b.key === key);
                if (found) {
                  handleSelectBlock(found);
                } else if (selectedBlock && selectedBlock.key === key) {
                  setEditContent(text);
                }
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />

            {/* Top Floating Studio Header */}
            <VisualStudioHeader
              viewportMode={viewportMode}
              setViewportMode={setViewportMode}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              showRulers={showRulers}
              setShowRulers={setShowRulers}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              isLeftOpen={isLeftOpen}
              setIsLeftOpen={setIsLeftOpen}
              isRightOpen={isRightOpen}
              setIsRightOpen={setIsRightOpen}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              isMaximizedCanvas={isMaximizedCanvas}
              setIsMaximizedCanvas={setIsMaximizedCanvas}
              activePageTitle={activePage.title}
              activePageSlug={activePage.slug}
              isSaving={saving}
              isSavedSuccess={savedSuccess}
              onPublishAll={() => handleSaveBlock(true)}
              onRefreshCanvas={() => setRefreshKey((p) => p + 1)}
              onPopoutWindow={handlePopoutWindow}
              onOpenPageManager={() => setPageManagerOpen(true)}
            />

            {/* Studio View Selector Bar */}
            <div className="bg-slate-900/60 border-b border-white/5 px-6 py-1.5 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewTab("visual")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewTab === "visual"
                      ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Figma / Webflow Live Viewport Studio
                </button>

                <button
                  onClick={() => setViewTab("dictionary")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewTab === "dictionary"
                      ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Universal Text Dictionary & AI
                </button>

                <button
                  onClick={() => setViewTab("seo")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewTab === "seo"
                      ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  SEO & Social Metadata
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">Page Target:</span>
                <select
                  value={activePage.id}
                  onChange={(e) => {
                    const found = pages.find((p) => p.id === e.target.value);
                    if (found) setActivePage(found);
                  }}
                  className="px-2.5 py-1 bg-slate-950/80 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500/50"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.slug})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Studio Workspace */}
            <main className="flex-1 flex overflow-hidden relative">
              {viewTab === "visual" ? (
                <div className="flex-1 flex w-full h-full">
                  {/* Left Studio Sidebar Drawer */}
                  <VisualStudioLeftSidebar
                    isOpen={isLeftOpen}
                    blocks={blocks}
                    selectedBlock={selectedBlock}
                    onSelectBlock={handleSelectBlock}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />

                  {/* Center Resizable Live Viewport Canvas */}
                  <VisualStudioCanvas
                    viewportMode={viewportMode}
                    zoomLevel={zoomLevel}
                    setZoomLevel={setZoomLevel}
                    showRulers={showRulers}
                    showGrid={showGrid}
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
                      handleSaveBlock(false);
                    }}
                    onSelectBlockFromCanvas={(key, text) => {
                      const found = blocks.find((b) => b.key === key);
                      if (found) {
                        handleSelectBlock(found);
                      } else if (selectedBlock && selectedBlock.key === key) {
                        setEditContent(text);
                      }
                    }}
                  />

                  {/* Right Figma/Webflow Style Inspector */}
                  <VisualStudioInspector
                    isOpen={isRightOpen}
                    selectedBlock={selectedBlock}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    isPublished={isPublished}
                    setIsPublished={setIsPublished}
                    onSaveBlock={handleSaveBlock}
                    onOpenHistory={fetchRevisions}
                    saving={saving}
                  />
                </div>
              ) : viewTab === "dictionary" ? (
                <div className="flex-1 p-6 overflow-y-auto">
                  <TextDictionaryManager />
                </div>
              ) : (
                <div className="flex-1 p-6 overflow-y-auto">
                  <SEOInspectorPanel initialSlug={activePage.slug} />
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {/* Page Manager Modal */}
      <PageManagerModal
        isOpen={pageManagerOpen}
        onClose={() => setPageManagerOpen(false)}
        pages={pages}
        onAddPage={handleAddPage}
        onDuplicatePage={handleDuplicatePage}
        onDeletePage={handleDeletePage}
        onReorderPages={(updatedPages) => setPages(updatedPages)}
      />

      {/* Revision History Modal Drawer */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" /> Revision History Log
                </h3>
                <span className="text-[10px] font-mono text-purple-300">
                  Block Key: {selectedBlock?.key}
                </span>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingHistory ? (
              <div className="p-6 text-center text-slate-400">Loading audit history...</div>
            ) : revisions.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No previous revisions logged for this block element.</div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {revisions.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple" size="sm">Version {rev.version}</Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono truncate">
                      {rev.content}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Changed by: {rev.changedBy}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
