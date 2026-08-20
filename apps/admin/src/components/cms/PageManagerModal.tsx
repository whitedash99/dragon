import React, { useState } from "react";
import { FileText, Plus, Copy, Trash2, X, MoveUp, MoveDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CMSPageItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  updatedAt: string;
}

interface PageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: CMSPageItem[];
  activePage?: CMSPageItem;
  onSelectPage?: (page: CMSPageItem) => void;
  onAddPage: (title: string, slug: string) => void;
  onDuplicatePage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onReorderPages?: (pages: CMSPageItem[]) => void;
}

export function PageManagerModal({
  isOpen,
  onClose,
  pages: initialPages,
  activePage,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
}: PageManagerModalProps) {
  const [pagesList, setPagesList] = useState<CMSPageItem[]>(initialPages);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) return;
    onAddPage(newTitle, newSlug.startsWith("/") ? newSlug : `/${newSlug}`);
    setNewTitle("");
    setNewSlug("");
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#07111F] border border-cyan-500/30 rounded-2xl w-full max-w-xl p-6 space-y-4 text-xs shadow-2xl text-[#F8FAFC]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00f0ff]" />
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
              Website Routes & Pages
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-mono text-[11px]">{pagesList.length} Active Website Routes</span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#19C7FF] text-black font-heading font-black text-xs uppercase shadow-md shadow-cyan-500/30 flex items-center gap-1 hover:scale-105 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Page
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="p-3 bg-[#030712] border border-cyan-500/20 rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Page Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Careers"
                  className="w-full px-2.5 py-1.5 bg-[#07111F] border border-cyan-500/30 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. /careers"
                  className="w-full px-2.5 py-1.5 bg-[#07111F] border border-cyan-500/30 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={() => setShowAddForm(false)} variant="outline" className="text-xs border-slate-800 text-slate-300">
                Cancel
              </Button>
              <button type="submit" className="px-3 py-1.5 bg-[#00f0ff] text-black font-bold rounded-lg text-xs">
                Create Route
              </button>
            </div>
          </form>
        )}

        {/* Page List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {pagesList.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectPage?.(p);
                onClose();
              }}
              className="p-3 bg-[#030712] border border-cyan-500/20 rounded-xl flex items-center justify-between hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <div>
                  <div className="font-heading font-black text-white text-xs group-hover:text-cyan-300">{p.title}</div>
                  <div className="text-[10px] font-mono text-slate-400">{p.slug}</div>
                </div>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                  {p.status}
                </span>

                <button onClick={() => onDuplicatePage(p.id)} className="p-1 text-slate-400 hover:text-white" title="Duplicate Page">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDeletePage(p.id)} className="p-1 text-rose-400 hover:text-rose-300" title="Delete Page">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
