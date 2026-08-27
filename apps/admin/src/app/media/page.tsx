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
  Film,
  HardDrive,
  Sparkles,
  ExternalLink,
  Plus,
  X,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassButton, GlassBadge, GlassStat } from "@/components/ui/glass";

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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload Form Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("PNG");
  const [fileCategory, setFileCategory] = useState("Banners");

  const fetchAssets = useCallback(async () => {
    setRefreshing(true);
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
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchAssets();
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
          name: fileName,
          url: fileUrl,
          type: fileType,
          category: fileCategory,
          size: "2.4 MB",
          dimensions: "1920x1080",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUploadModalOpen(false);
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

  const categories = ["All", "Banners", "Thumbnails", "Screenshots", "Documents", "Logos"];

  return (
    <div className="flex h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Dragon Control • Storage & CDN Management
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-heading">
                Media & Digital Asset Library
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                High-resolution artwork, release banners, and Backblaze B2 cloud storage assets.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchAssets}
                className="p-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
                title="Refresh Assets"
              >
                <RefreshCw className={cn("size-4", refreshing && "animate-spin text-cyan-400")} />
              </button>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3CFF] text-[#020617] text-xs font-mono font-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Upload Media Asset</span>
              </button>
            </div>
          </div>

          {/* Storage Telemetry Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStat
              label="Total Assets"
              value={assets.length}
              icon={ImageIcon}
              trend="B2 Cloud Storage"
            />
            <GlassStat
              label="Storage Allocation"
              value="1.4 GB"
              icon={HardDrive}
              trend="100 GB Cap"
            />
            <GlassStat
              label="Asset Categories"
              value={categories.length - 1}
              icon={Filter}
              trend="Organized"
            />
            <GlassStat
              label="CDN Delivery Rate"
              value="100%"
              icon={Sparkles}
              trend="Global Edge Cache"
            />
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="space-y-3 bg-[#03091D]/90 p-4 rounded-2xl border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="size-4 absolute left-3 top-2.5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search media by filename, URL, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1 text-xs font-mono font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer",
                      selectedCategory === cat
                        ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Media Grid */}
          {assets.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-3">
              <div className="size-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <ImageIcon className="size-6" />
              </div>
              <h3 className="text-sm font-mono font-bold text-white">No Media Assets Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
                Upload your first high-resolution game banner or screenshot to Backblaze B2.
              </p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-[#020617] font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Upload Media Asset</span>
              </button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {assets.map((asset) => (
                <div key={asset.id} className="p-3 rounded-2xl bg-[#03091D]/90 border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3 flex flex-col justify-between group hover:border-cyan-400/50 transition-all font-mono">
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#02050E] border border-cyan-500/20">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#02040A]/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[9.5px] font-bold font-mono uppercase shadow-xs">
                          {asset.category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white truncate" title={asset.name}>
                        {asset.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                        <span>{asset.dimensions || "1920x1080"}</span>
                        <span>•</span>
                        <span>{asset.size || "2.4 MB"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <button
                      onClick={() => handleCopyUrl(asset.url, asset.id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="size-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                      title="Delete Asset"
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

      {/* ═══ UPLOAD ASSET MODAL ═══ */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#02040A]/85 backdrop-blur-md animate-in fade-in duration-200 font-mono">
          <div className="bg-[#03091D]/98 border border-cyan-500/35 rounded-3xl w-full max-w-lg shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-gradient-to-b from-cyan-950/25 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                  <Upload className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload Digital Asset</h3>
                  <p className="text-xs text-slate-400">Backblaze B2 & CDN Asset Catalog</p>
                </div>
              </div>

              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Uncharted Drive Key Banner"
                  className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Asset URL / B2 Direct Path *</label>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="e.g. /images/uncharted-drive-banner.png or https://..."
                  className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Category</label>
                  <select
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value)}
                    className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Banners">Banners (16:9)</option>
                    <option value="Thumbnails">Thumbnails (Card / 3:2)</option>
                    <option value="Screenshots">Screenshots</option>
                    <option value="Logos">Logos</option>
                    <option value="Documents">Documents</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Format</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="PNG">PNG Image</option>
                    <option value="JPG">JPG Image</option>
                    <option value="WEBP">WebP Image</option>
                    <option value="ZIP">ZIP Package</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3CFF] text-[#020617] text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {uploading ? <RefreshCw className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                  <span>{uploading ? "Saving..." : "Save Asset"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
