"use client";

import React, { useState } from "react";
import {
  ImageIcon,
  Upload,
  Film,
  Download,
  Copy,
  Check,
  Search,
  Gamepad2,
} from "lucide-react";

interface GameMediaItem {
  id: string;
  game: string;
  name: string;
  type: "COVER" | "SCREENSHOT" | "TRAILER" | "BANNER";
  dimensions: string;
  size: string;
  url: string;
}

const INITIAL_GAME_MEDIA: GameMediaItem[] = [
  { id: "1", game: "Uncharted Drive: Beyond", name: "Uncharted_Drive_Master_Cover_4K.webp", type: "COVER", dimensions: "3840 x 2160", size: "3.4 MB", url: "/games/uncharted_drive/cover.webp" },
  { id: "2", game: "Uncharted Drive: Beyond", name: "Neo_Tokyo_Cyber_Highway_InGame.jpg", type: "SCREENSHOT", dimensions: "3840 x 2160", size: "2.1 MB", url: "/games/uncharted_drive/ss1.jpg" },
  { id: "3", game: "Uncharted Drive: Beyond", name: "Quantum_Canyon_Raytracing_4K.jpg", type: "SCREENSHOT", dimensions: "3840 x 2160", size: "2.6 MB", url: "/games/uncharted_drive/ss2.jpg" },
  { id: "4", game: "Uncharted Drive: Beyond", name: "Official_Launch_Trailer_4K_60FPS.mp4", type: "TRAILER", dimensions: "3840 x 2160 (60FPS)", size: "48.2 MB", url: "https://r2.dragongaming.studio/trailer.mp4" },
];

export default function GamesMediaPage() {
  const [media] = useState<GameMediaItem[]>(INITIAL_GAME_MEDIA);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• Game Media & Keyart</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Game Media, Keyart & 4K Trailers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage cover artwork, in-game 4K screenshots, cinematic trailers, and promotional banner assets.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 w-fit">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Game Asset</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-indigo-500/30 transition-all space-y-3"
          >
            <div className="h-40 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-slate-500">
              {item.type === "TRAILER" ? (
                <Film className="w-10 h-10 text-indigo-400/60" />
              ) : (
                <ImageIcon className="w-10 h-10 text-blue-400/60" />
              )}
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-white">{item.name}</h3>
                <div className="text-[11px] text-indigo-400 font-mono mt-0.5">{item.game}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-400 shrink-0">
                {item.type}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono text-slate-400">
              <span>{item.dimensions} • {item.size}</span>

              <button
                onClick={() => handleCopy(item.id, item.url)}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                {copiedId === item.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === item.id ? "Copied" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
