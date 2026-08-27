"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { FolderKanban, Image as ImageIcon, Video, FileText, Upload, Search, RefreshCw, CheckCircle2 } from "lucide-react";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  createdAt: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success && Array.isArray(data.media)) {
        setAssets(data.media);
      }
    } catch (e) {
      console.error("Fetch media assets error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400/80 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FolderKanban className="size-3.5 text-cyan-400" />
                <span>Dragon Digital Asset Management (DAM)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Studio Media & Brand Assets</h1>
            </div>

            <button
              onClick={fetchAssets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <RefreshCw className={`size-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Assets</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by filename or URL..."
              className="w-full rounded-xl bg-[#02050E] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Assets Grid */}
          <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Stored Asset Files ({filteredAssets.length})</h2>

            {loading ? (
              <div className="py-16 text-center text-slate-500 text-xs font-mono">
                Loading digital assets...
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-mono">
                No media assets found in repository.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-mono">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-2 hover:border-cyan-400/50 transition-all">
                    <div className="flex items-center justify-between">
                      <ImageIcon className="size-4 text-cyan-400" />
                      <span className="text-[10px] text-slate-500 uppercase">{asset.type}</span>
                    </div>
                    <div className="font-bold text-white truncate" title={asset.name}>{asset.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{asset.url}</div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
