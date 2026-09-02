"use client";

import React, { useEffect, useState } from "react";
import {
  Globe,
  FileText,
  ImageIcon,
  FolderKanban,
  Radio,
  BarChart3,
  Activity,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Download,
} from "lucide-react";
import Link from "next/link";
import { generateGodLevelTelemetryReport } from "@/lib/pdf-report-generator";

interface StudioStats {
  totalPages: number;
  totalMedia: number;
  totalProjects: number;
  totalInquiries: number;
  dbLatencyMs: number;
  recentAudits: any[];
}

export default function StudioOverviewPage() {
  const [stats, setStats] = useState<StudioStats>({
    totalPages: 8,
    totalMedia: 24,
    totalProjects: 3,
    totalInquiries: 0,
    dbLatencyMs: 45,
    recentAudits: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/telemetry")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats((prev) => ({
            ...prev,
            recentAudits: data.events?.slice(0, 5) || [],
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExportPDF = async () => {
    await generateGodLevelTelemetryReport();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              WORKSPACE: STUDIO HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">• Production Main Website</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Dragon Gaming Studio Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Central administration for public website, studio pages, press assets, communications, and roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Studio PDF</span>
          </button>

          <Link
            href="https://dragongamingstudios.vercel.app"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-600/20"
          >
            <span>Visit Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Website Status */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Website Status</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>ONLINE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">dragongamingstudios.vercel.app</p>
          </div>
        </div>

        {/* Card 2: Published Pages */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Public Pages</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">8 Pages</div>
            <p className="text-[11px] text-slate-400 mt-1">Home, About, Careers, News, Press</p>
          </div>
        </div>

        {/* Card 3: Media & Assets */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Brand Assets</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">24 Assets</div>
            <p className="text-[11px] text-slate-400 mt-1">Wallpapers, SVGs, Press Kits</p>
          </div>
        </div>

        {/* Card 4: Database Engine */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">PostgreSQL Engine</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">45ms Latency</div>
            <p className="text-[11px] text-slate-400 mt-1">Neon Cluster (ep-still-brook)</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Management Sections & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Studio Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Studio Management Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Module 1: Content & SEO */}
            <Link
              href="/studio/content"
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-blue-500/40 transition-all hover:bg-white/[0.02] group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-blue-300 transition-colors">
                Pages, Sections & SEO
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage layout blocks, hero banners, site copy, meta tags, and open graph previews.
              </p>
            </Link>

            {/* Module 2: Media Library */}
            <Link
              href="/studio/media"
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-blue-500/40 transition-all hover:bg-white/[0.02] group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-indigo-300 transition-colors">
                Media & Asset Library
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Store and serve 4K studio artworks, brand guidelines, logos, and promotional documents.
              </p>
            </Link>

            {/* Module 3: Projects & Roadmap */}
            <Link
              href="/studio/projects"
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-blue-500/40 transition-all hover:bg-white/[0.02] group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-purple-300 transition-colors">
                Studio Productions & Roadmap
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Track studio game franchises, alpha milestones, release roadmaps, and studio team status.
              </p>
            </Link>

            {/* Module 4: Communications & Support */}
            <Link
              href="/studio/communication"
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-blue-500/40 transition-all hover:bg-white/[0.02] group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-emerald-300 transition-colors">
                Communications & Support
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Process customer contact submissions, support inquiries, and broadcast announcements.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Col: Live Ecosystem Audit Trail */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Live Studio Audit Feed
            </h2>
            <Link href="/studio/system" className="text-xs text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-3">
            {stats.recentAudits.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Connected to PostgreSQL audit pipeline.
              </div>
            ) : (
              stats.recentAudits.map((a: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span className="text-blue-400 font-semibold">{a.action}</span>
                    <span>{new Date(a.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-200 mt-1 line-clamp-1">
                    {a.user?.email || a.userEmail || "System Engine"}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {a.details}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
