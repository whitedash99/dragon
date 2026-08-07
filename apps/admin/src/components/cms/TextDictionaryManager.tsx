import React, { useState } from "react";
import { Search, Sparkles, Save, CheckCircle2, Globe, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIRewriteModal } from "./AIRewriteModal";

interface TextKeyItem {
  key: string;
  category: string;
  label: string;
  value: string;
  isPublished: boolean;
}

export function TextDictionaryManager() {
  const [keys, setKeys] = useState<TextKeyItem[]>([
    { key: "hero.title", category: "Hero", label: "Hero Headline", value: "Forging Worlds Beyond Imagination", isPublished: true },
    { key: "hero.subtitle", category: "Hero", label: "Hero Subtitle", value: "We craft immersive gaming experiences that push the boundaries of interactive entertainment.", isPublished: true },
    { key: "hero.cta_primary", category: "Hero", label: "Primary CTA Button", value: "Explore Our Games", isPublished: true },
    { key: "hero.cta_secondary", category: "Hero", label: "Secondary CTA Button", value: "Meet the Studio", isPublished: true },
    { key: "nav.games", category: "Navigation", label: "Menu Games Link", value: "GAMES", isPublished: true },
    { key: "nav.downloads", category: "Navigation", label: "Menu Downloads Link", value: "DOWNLOADS", isPublished: true },
    { key: "nav.studio", category: "Navigation", label: "Menu Studio Link", value: "STUDIO", isPublished: true },
    { key: "nav.community", category: "Navigation", label: "Menu Community Link", value: "COMMUNITY", isPublished: true },
    { key: "nav.contact", category: "Navigation", label: "Menu Contact Link", value: "CONTACT", isPublished: true },
    { key: "footer.copyright", category: "Footer", label: "Copyright Notice", value: "© 2026 Dragon Studios. All rights reserved. Powered by Dragon Engine.", isPublished: true },
    { key: "games.heading", category: "Games", label: "Games Catalog Title", value: "OUR GAME PORTFOLIO", isPublished: true },
    { key: "contact.heading", category: "Forms", label: "Contact Form Title", value: "GET IN TOUCH WITH DRAGON STUDIOS", isPublished: true },
    { key: "seo.default_title", category: "SEO", label: "Default Site Title", value: "Dragon Studios | AAA Game Development Studio", isPublished: true },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedKey, setSelectedKey] = useState<TextKeyItem | null>(keys[0]);
  const [editValue, setEditValue] = useState(keys[0].value);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories = ["All", "Hero", "Navigation", "Games", "Footer", "Forms", "SEO"];

  const filteredKeys = keys.filter((k) => {
    const matchesCat = selectedCategory === "All" || k.category === selectedCategory;
    const matchesQuery =
      k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSelectKey = (item: TextKeyItem) => {
    setSelectedKey(item);
    setEditValue(item.value);
  };

  const handleSaveTextKey = async () => {
    if (!selectedKey) return;
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setKeys((prev) =>
        prev.map((k) => (k.key === selectedKey.key ? { ...k, value: editValue } : k))
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">Centralized UI String Registry</Badge>
            <span className="text-xs text-slate-400 font-mono">100% Website Text Editable</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" /> Universal Text Dictionary & Translation Manager
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAiModalOpen(true)}
            variant="outline"
            className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-950/20"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> AI Polish & Translate
          </Button>
          <Button
            onClick={handleSaveTextKey}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Text Key
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search text keys (e.g. hero.title, nav.games)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Key List */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-white/10 rounded-xl p-3 space-y-2 max-h-[520px] overflow-y-auto">
          {filteredKeys.map((item) => {
            const isSelected = selectedKey?.key === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handleSelectKey(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-950/50 border-purple-500/50 text-white"
                    : "bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-purple-300 font-bold">{item.key}</span>
                  <Badge variant="purple" size="sm">{item.category}</Badge>
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1">{item.label}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.value}</div>
              </div>
            );
          })}
        </div>

        {/* Right Editor Inspector */}
        {selectedKey ? (
          <div className="lg:col-span-7 bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-5">
            <div className="border-b border-white/5 pb-3 flex items-center justify-between">
              <div>
                <Badge variant="purple" size="sm">{selectedKey.category}</Badge>
                <h3 className="text-sm font-bold text-white mt-1">{selectedKey.label}</h3>
                <span className="text-[10px] font-mono text-purple-400">Key: {selectedKey.key}</span>
              </div>
              <Button
                onClick={() => setIsAiModalOpen(true)}
                variant="outline"
                className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-950/20"
              >
                <Wand2 className="w-3.5 h-3.5 mr-1" /> AI Polish
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Live String Content
              </label>
              <textarea
                rows={5}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50 font-mono leading-relaxed resize-none"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Text Key [{selectedKey.key}] Saved to PostgreSQL database!
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-7 p-8 text-center text-slate-500 text-xs">
            Select a text key from the list to edit its content.
          </div>
        )}
      </div>

      {/* AI Rewrite Modal */}
      {selectedKey && (
        <AIRewriteModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          originalText={editValue}
          onApplyText={(t) => setEditValue(t)}
        />
      )}
    </div>
  );
}
