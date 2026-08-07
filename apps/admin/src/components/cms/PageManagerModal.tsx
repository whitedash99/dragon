import React, { useState } from "react";
import { FileText, Plus, Copy, Trash2, X, MoveUp, MoveDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  onAddPage: (title: string, slug: string) => void;
  onDuplicatePage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onReorderPages: (pages: CMSPageItem[]) => void;
}

export function PageManagerModal({
  isOpen,
  onClose,
  pages: initialPages,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onReorderPages,
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

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...pagesList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setPagesList(updated);
    onReorderPages(updated);
  };

  const moveDown = (index: number) => {
    if (index === pagesList.length - 1) return;
    const updated = [...pagesList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setPagesList(updated);
    onReorderPages(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-xl p-6 space-y-4 text-xs shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Dragon Studio Page Manager</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-mono text-[11px]">{pagesList.length} Active Website Routes</span>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add New Page
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="p-3 bg-slate-955 border border-white/10 rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">Page Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Careers"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. /careers"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={() => setShowAddForm(false)} variant="outline" className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white text-xs">
                Create Route
              </Button>
            </div>
          </form>
        )}

        {/* Page List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {pagesList.map((p, idx) => (
            <div
              key={p.id}
              className="p-3 bg-slate-955 border border-white/10 rounded-xl flex items-center justify-between hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-xs">{p.title}</div>
                  <div className="text-[10px] font-mono text-slate-400">{p.slug}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={p.status === "PUBLISHED" ? "purple" : "outline"} size="sm">
                  {p.status}
                </Badge>

                {/* Reorder buttons */}
                <button onClick={() => moveUp(idx)} className="p-1 text-slate-400 hover:text-white" title="Move Up">
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => moveDown(idx)} className="p-1 text-slate-400 hover:text-white" title="Move Down">
                  <MoveDown className="w-3.5 h-3.5" />
                </button>

                {/* Duplicate & Delete */}
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
