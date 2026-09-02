"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Clock,
  Search,
  Globe,
  Eye,
  Sliders,
  Download,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { generateStudioContentPdf } from "@/lib/pdf-report-generator";

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "PUBLISHED" | "DRAFT" | "REVIEW";
  updatedAt: string;
  sectionsCount: number;
}

const INITIAL_PAGES: CMSPage[] = [
  { id: "1", title: "Official Homepage", slug: "/", category: "Core", status: "PUBLISHED", updatedAt: "2026-09-01", sectionsCount: 6 },
  { id: "2", title: "About Studio & Vision", slug: "/studio", category: "Company", status: "PUBLISHED", updatedAt: "2026-08-30", sectionsCount: 4 },
  { id: "3", title: "Games & Franchise Portal", slug: "/games", category: "Gaming", status: "PUBLISHED", updatedAt: "2026-09-01", sectionsCount: 5 },
  { id: "4", title: "Careers & Recruitment", slug: "/careers", category: "Recruitment", status: "PUBLISHED", updatedAt: "2026-08-28", sectionsCount: 3 },
  { id: "5", title: "News & Studio Dispatches", slug: "/news", category: "Editorial", status: "PUBLISHED", updatedAt: "2026-08-31", sectionsCount: 4 },
  { id: "6", title: "Press Kit & Brand Assets", slug: "/press", category: "Media", status: "PUBLISHED", updatedAt: "2026-08-25", sectionsCount: 3 },
  { id: "7", title: "Support & Contact Desk", slug: "/contact", category: "Support", status: "PUBLISHED", updatedAt: "2026-08-29", sectionsCount: 2 },
  { id: "8", title: "Privacy Policy & Terms", slug: "/privacy", category: "Legal", status: "PUBLISHED", updatedAt: "2026-08-20", sectionsCount: 2 },
];

export default function StudioContentPage() {
  const [pages, setPages] = useState<CMSPage[]>(INITIAL_PAGES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredPages = pages.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleExportPdf = () => {
    generateStudioContentPdf(pages);
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
            <span className="text-xs text-slate-400 font-mono">• CMS & SEO Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Studio Pages & Content Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage public website pages, layout sections, SEO metadata, and published content blocks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Pages PDF</span>
          </button>

          <Link
            href="/cms/blocks"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-600/20 w-fit"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Layout Block Builder</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages or routes..."
            className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["ALL", "Core", "Company", "Gaming", "Editorial", "Support", "Legal"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                  : "bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Page Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sections</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div>{page.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{page.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300">
                      {page.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {page.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {page.sectionsCount} Sections
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {page.updatedAt}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`https://dragongamingstudios.vercel.app${page.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/cms/blocks"
                        className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-blue-400 transition-colors"
                        title="Edit Sections"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
