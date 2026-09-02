"use client";

import React, { useState } from "react";
import {
  ImageIcon,
  Upload,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  FileCode,
  Film,
  FileText,
  Trash2,
} from "lucide-react";

interface MediaAsset {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO" | "VECTOR" | "DOCUMENT";
  dimensions: string;
  size: string;
  url: string;
  updatedAt: string;
}

const INITIAL_MEDIA: MediaAsset[] = [
  { id: "1", name: "Dragon_Master_Brand_Logo_4K.png", type: "IMAGE", dimensions: "3840 x 2160", size: "4.2 MB", url: "/brand/logo_master.png", updatedAt: "2026-08-31" },
  { id: "2", name: "Studio_Emblem_Vector.svg", type: "VECTOR", dimensions: "Vector SVG", size: "18 KB", url: "/icon.svg", updatedAt: "2026-08-25" },
  { id: "3", name: "Uncharted_Drive_Hero_Keyart.webp", type: "IMAGE", dimensions: "3840 x 2160", size: "2.8 MB", url: "/games/uncharted_drive/hero.webp", updatedAt: "2026-09-01" },
  { id: "4", name: "Dragon_Cinematic_Intro_1080p.mp4", type: "VIDEO", dimensions: "1920 x 1080", size: "18.4 MB", url: "https://r2.dragongaming.studio/intro.mp4", updatedAt: "2026-08-29" },
  { id: "5", name: "DGS_Official_Press_Kit_2026.pdf", type: "DOCUMENT", dimensions: "12 Pages", size: "3.1 MB", url: "/docs/press_kit_2026.pdf", updatedAt: "2026-08-20" },
  { id: "6", name: "Studio_Cyber_Banner_Wide.jpg", type: "IMAGE", dimensions: "2560 x 1440", size: "1.9 MB", url: "/assets/banner.jpg", updatedAt: "2026-08-28" },
];

import { generateStudioMediaPdf } from "@/lib/pdf-report-generator";

export default function StudioMediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("ALL");

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "ALL" || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleExportPdf = () => {
    generateStudioMediaPdf(media);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              STUDIO HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">• Asset Storage & CDN</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Studio Media & Brand Asset Library
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Store, catalog, and serve official 4K studio artworks, brand guidelines, logos, trailers, and press documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Media PDF</span>
          </button>

          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-600/20 w-fit">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Studio Asset</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files..."
            className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["ALL", "IMAGE", "VIDEO", "VECTOR", "DOCUMENT"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedType === t
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                  : "bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-white/20 p-4 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="h-32 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-slate-500 mb-3 overflow-hidden">
                {item.type === "IMAGE" && <ImageIcon className="w-8 h-8 text-blue-400/60" />}
                {item.type === "VIDEO" && <Film className="w-8 h-8 text-purple-400/60" />}
                {item.type === "VECTOR" && <FileCode className="w-8 h-8 text-emerald-400/60" />}
                {item.type === "DOCUMENT" && <FileText className="w-8 h-8 text-amber-400/60" />}
              </div>

              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-semibold text-white truncate" title={item.name}>
                  {item.name}
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-slate-400 shrink-0">
                  {item.type}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-2">
                <span>{item.dimensions}</span>
                <span>•</span>
                <span>{item.size}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">{item.updatedAt}</span>

              <button
                onClick={() => handleCopy(item.id, item.url)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300 transition-colors"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
