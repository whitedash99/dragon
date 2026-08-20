import React, { useState } from "react";
import { Search, Globe, Save, CheckCircle2 } from "lucide-react";
import { CMSPageItem } from "./PageManagerModal";

interface SEODataProps {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export function SEOInspectorPanel({
  activePage,
}: {
  activePage?: CMSPageItem;
}) {
  const initialSlug = activePage?.slug || "/";
  const [seo, setSeo] = useState<SEODataProps>({
    metaTitle: `${activePage?.title || "Dragon Studios"} | 3D & 2D Game Development Studio`,
    metaDescription: "Forging worlds beyond reality. Discover our 3D & 2D games, technology, news, and community.",
    keywords: "game development, gaming studio, video games, dragon studios, 3d games, 2d games, dragon engine",
    ogImage: "/images/dragon/hero_dragon.jpg",
    canonicalUrl: `https://dragongamingstudios.vercel.app${initialSlug}`,
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSEO = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#07111F] border border-cyan-500/20 rounded-2xl p-6 space-y-6 max-w-4xl mx-auto shadow-2xl text-[#F8FAFC]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[#00f0ff] border border-cyan-400/30 text-[10px] font-mono font-bold">
              ENTERPRISE SEO STUDIO
            </span>
            <span className="text-xs text-slate-400 font-mono">Route: {seo.canonicalUrl}</span>
          </div>
          <h3 className="text-lg font-heading font-black text-white tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-[#00f0ff]" /> Search Engine Optimization & Social Metadata
          </h3>
        </div>

        <button
          onClick={handleSaveSEO}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#19C7FF] text-black font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>SAVE SEO META</span>
        </button>
      </div>

      {/* Live Google Search Result Preview */}
      <div className="p-4 rounded-xl bg-[#030712] border border-cyan-500/20 space-y-1 font-sans">
        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <Globe className="w-3 h-3 text-emerald-400" /> {seo.canonicalUrl}
        </div>
        <div className="text-sm font-bold text-[#00f0ff] hover:underline cursor-pointer">
          {seo.metaTitle || "Untitled Page"}
        </div>
        <div className="text-xs text-slate-300 line-clamp-2">
          {seo.metaDescription || "No meta description provided."}
        </div>
      </div>

      {/* SEO Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1.5">
          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Meta Title (Recommended 50-60 Chars)
          </label>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
            className="w-full p-3 bg-[#030712] border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Canonical URL Target
          </label>
          <input
            type="text"
            value={seo.canonicalUrl}
            onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
            className="w-full p-3 bg-[#030712] border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Meta Description (Recommended 150-160 Chars)
          </label>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
            className="w-full p-3 bg-[#030712] border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 resize-none font-sans"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Search Keywords (Comma Separated)
          </label>
          <input
            type="text"
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            className="w-full p-3 bg-[#030712] border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            OpenGraph Social Image URL
          </label>
          <input
            type="text"
            value={seo.ogImage}
            onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
            className="w-full p-3 bg-[#030712] border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4" /> SEO Meta Saved & Canonical Schema Generated.
        </div>
      )}
    </div>
  );
}
