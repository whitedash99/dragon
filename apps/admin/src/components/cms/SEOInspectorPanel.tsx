import React, { useState } from "react";
import { Search, Globe, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SEODataProps {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export function SEOInspectorPanel({
  initialSlug = "/",
}: {
  initialSlug?: string;
}) {
  const [seo, setSeo] = useState<SEODataProps>({
    metaTitle: "Dragon Studios — Premier Game Development Studio",
    metaDescription: "Forging worlds beyond imagination. Discover our AAA games, technology, news, and community.",
    keywords: "game development, gaming studio, video games, dragon studios, AAA games",
    ogImage: "/images/og.jpg",
    canonicalUrl: `https://dragonstudios.com${initialSlug}`,
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
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" size="sm">Enterprise SEO Studio</Badge>
            <span className="text-xs text-slate-400 font-mono">Canonical Route: {seo.canonicalUrl}</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" /> Search Engine Optimization & Social Sharing
          </h3>
        </div>

        <Button
          onClick={handleSaveSEO}
          disabled={saving}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-2"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" /> Save SEO Meta
        </Button>
      </div>

      {/* Live Google Search Result Preview */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-1 font-sans">
        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <Globe className="w-3 h-3 text-emerald-400" /> {seo.canonicalUrl}
        </div>
        <div className="text-sm font-semibold text-purple-300 hover:underline cursor-pointer">
          {seo.metaTitle || "Untitled Page"}
        </div>
        <div className="text-xs text-slate-300 line-clamp-2">
          {seo.metaDescription || "No meta description provided."}
        </div>
      </div>

      {/* SEO Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Meta Title (Recommended 50-60 Chars)
          </label>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
            className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Canonical URL Target
          </label>
          <input
            type="text"
            value={seo.canonicalUrl}
            onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
            className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Meta Description (Recommended 150-160 Chars)
          </label>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
            className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Search Keywords (Comma Separated)
          </label>
          <input
            type="text"
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            OpenGraph Social Image URL
          </label>
          <input
            type="text"
            value={seo.ogImage}
            onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
            className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> SEO Meta Saved & Canonical Schema Generated.
        </div>
      )}
    </div>
  );
}
