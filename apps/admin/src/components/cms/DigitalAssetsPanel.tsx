import React, { useState } from "react";
import { Image as ImageIcon, Film, Search, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Asset {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
  size: string;
}

interface DigitalAssetsPanelProps {
  onInsertAsset?: (assetUrl: string) => void;
  onSelectAsset?: (assetUrl: string) => void;
}

export function DigitalAssetsPanel({ onInsertAsset, onSelectAsset }: DigitalAssetsPanelProps) {
  const [query, setQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const handleChoose = (url: string) => {
    setSelectedAsset(url);
    if (onSelectAsset) onSelectAsset(url);
    if (onInsertAsset) onInsertAsset(url);
  };

  const assets: Asset[] = [
    { id: "1", name: "Dragon Hero Cyberpunk Banner", type: "image", url: "/images/hero-banner.jpg", size: "2.4 MB" },
    { id: "2", name: "Nebula Cinematic Trailer Loop", type: "video", url: "/videos/trailer-loop.mp4", size: "14.8 MB" },
    { id: "3", name: "Dragon Studio Emblem Badge", type: "image", url: "/images/logo-badge.png", size: "480 KB" },
    { id: "4", name: "Cyber Armor Game Poster", type: "image", url: "/images/poster-1.jpg", size: "3.1 MB" },
  ];

  const filtered = assets.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-4 space-y-4 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-white text-sm">Digital Asset Manager (DAM)</span>
        </div>
        <Badge variant="purple" size="sm">Figma Assets</Badge>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search images, videos, banners..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset.url)}
            className={`p-2.5 bg-slate-950/80 border rounded-xl cursor-pointer transition-all space-y-1.5 ${
              selectedAsset === asset.url ? "border-purple-500 bg-purple-950/20" : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="h-16 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              {asset.type === "image" ? (
                <ImageIcon className="w-6 h-6 text-purple-400 opacity-60" />
              ) : (
                <Film className="w-6 h-6 text-cyan-400 opacity-60" />
              )}
              {selectedAsset === asset.url && (
                <div className="absolute top-1 right-1 bg-purple-600 rounded-full p-0.5 text-white">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="font-semibold text-slate-200 truncate">{asset.name}</div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{asset.type.toUpperCase()}</span>
              <span>{asset.size}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedAsset && (
        <button
          onClick={() => handleChoose(selectedAsset)}
          className="w-full py-2 bg-[#00f0ff] hover:bg-cyan-300 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/30"
        >
          <Plus className="w-3.5 h-3.5" /> Insert Selected Asset
        </button>
      )}
    </div>
  );
}
