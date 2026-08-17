"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { FolderKanban, Image as ImageIcon, Video, FileText, Upload, Search, RefreshCw, CheckCircle2 } from "lucide-react";

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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FolderKanban className="size-3.5 text-slate-700 dark:text-slate-300" />
                <span>Dragon Digital Asset Management (DAM)</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Studio Media & Brand Assets</h1>
            </div>

            <button
              onClick={fetchAssets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
            >
              <RefreshCw className={`size-3.5 text-slate-500 dark:text-slate-400 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Assets</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by filename or URL..."
              className="w-full rounded-xl bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 focus:outline-none shadow-xs font-sans"
            />
          </div>

          {/* Assets Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Stored Asset Files ({filteredAssets.length})</h2>

            {loading ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs font-mono">
                Loading digital assets...
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs font-mono">
                No media assets found in repository.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                    <div className="h-24 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center relative">
                      {asset.type?.includes("image") || asset.url?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={asset.url} alt={asset.name} className="object-cover size-full" />
                      ) : (
                        <FileText className="size-8 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-[11px] font-sans">{asset.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-mono">{asset.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
