"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Upload, 
  Image as ImageIcon, 
  Search, 
  Copy, 
  Trash2, 
  Check, 
  RefreshCw, 
  FileText, 
  Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface MediaItem {
  id: string;
  name: string;
  size: string;
  type: string;
  category: string;
  url: string;
  altText?: string;
  dimensions?: string;
  createdAt: string;
}

export default function MediaPage() {
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [telemetry, setTelemetry] = useState({
    totalFiles: 0,
    storageUsage: "1.4 GB / 100 GB",
    imagesCount: 0,
    videosCount: 0,
    docsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload Form State
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType] = useState("PNG");
  const [fileCategory, setFileCategory] = useState("Images");

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?category=${encodeURIComponent(selectedCategory)}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.assets)) {
        setAssets(data.assets);
        if (data.telemetry) setTelemetry(data.telemetry);
      }
    } catch (e) {
      console.error("Error fetching media assets", e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchAssets();
    });
    return () => { isMounted = false; };
  }, [fetchAssets]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      fetchAssets();
    } catch (e) {
      console.error("Delete asset error", e);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !fileUrl) return;

    setUploading(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fileName.trim(),
          url: fileUrl.trim(),
          type: fileType,
          category: fileCategory,
          size: "2.4 MB",
          dimensions: "1920x1080",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFileName("");
        setFileUrl("");
        fetchAssets();
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                DIGITAL ASSET MANAGEMENT (DAM)
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                MEDIA & ASSET LIBRARY
              </h1>
            </div>

            <Button onClick={fetchAssets} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
              <RefreshCw className="size-3.5 text-[#ff1e4b]" />
              <span>REFRESH MEDIA STREAM</span>
            </Button>
          </div>

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL ASSETS</span>
              <span className="text-2xl font-black text-white block">{telemetry.totalFiles}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">STORAGE USAGE</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.storageUsage}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">IMAGE ASSETS</span>
              <span className="text-2xl font-black text-[#ff1e4b] block">{telemetry.imagesCount}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">VIDEO / DOC ASSETS</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.videosCount + telemetry.docsCount}</span>
            </div>
          </div>

          {/* Upload Form Modal Box */}
          <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-4">
            <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
              <Upload className="size-4 text-[#ff1e4b]" />
              <span>REGISTER NEW DIGITAL ASSET</span>
            </span>

            <form onSubmit={handleAddAsset} className="grid gap-4 sm:grid-cols-12 items-end">
              <div className="sm:col-span-4 space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">ASSET FILE NAME</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. hero_banner_embers.png"
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">URL / STORAGE PATH</label>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="/images/hero_banner_embers.png"
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">CATEGORY</label>
                <select
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                >
                  <option value="Images">Images</option>
                  <option value="Videos">Videos</option>
                  <option value="Documents">Documents</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" disabled={uploading} variant="solidRed" size="md" className="w-full justify-center text-xs gap-2">
                  {uploading ? <RefreshCw className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  <span>REGISTER</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {["All", "Images", "Videos", "Documents", "Audio"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border shrink-0",
                    selectedCategory === cat ? "bg-[#ff1e4b] text-white border-[#ff1e4b]" : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="w-full rounded-xl bg-black/60 px-3 py-1.5 pl-9 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
              />
            </div>
          </div>

          {/* Assets Grid */}
          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
              Loading PostgreSQL media assets...
            </div>
          ) : assets.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              No media assets registered in selected category.
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {assets.map((asset) => (
                <div key={asset.id} className="rounded-2xl glass-panel p-4 border border-white/15 space-y-3 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="h-32 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                      {asset.category === "Videos" ? (
                        <Film className="size-10 text-purple-400/40" />
                      ) : asset.category === "Documents" ? (
                        <FileText className="size-10 text-sky-400/40" />
                      ) : (
                        <ImageIcon className="size-10 text-[#ff1e4b]/40" />
                      )}
                      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[9px] text-white font-bold">
                        {asset.type}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white truncate" title={asset.name}>{asset.name}</h4>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                        <span>{asset.size}</span>
                        <span>{asset.dimensions || "1920x1080"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-1">
                    <button
                      onClick={() => handleCopyUrl(asset.url, asset.id)}
                      className="flex-1 rounded-lg bg-white/5 hover:bg-white/10 p-1.5 text-[10px] text-white font-bold flex items-center justify-center gap-1 border border-white/5"
                    >
                      {copiedId === asset.id ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3 text-[#ff1e4b]" />}
                      <span>{copiedId === asset.id ? "COPIED" : "COPY URL"}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
