"use client";

import React, { useState } from "react";
import {
  Rocket,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  Upload,
  Globe,
  GitBranch,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface StudioRelease {
  id: string;
  version: string;
  title: string;
  status: "PUBLISHED" | "APPROVED" | "REVIEW" | "DRAFT";
  target: "MAIN_STUDIO_WEBSITE" | "PRESS_PORTAL" | "CAREERS_PORTAL";
  commitHash: string;
  publishedAt: string;
  author: string;
  notes: string;
}

const INITIAL_STUDIO_RELEASES: StudioRelease[] = [
  {
    id: "1",
    version: "v2.4.0",
    title: "Universal Studio Hub & 4K Media Showcase",
    status: "PUBLISHED",
    target: "MAIN_STUDIO_WEBSITE",
    commitHash: "git:21e48ad",
    publishedAt: "2026-09-02 19:30",
    author: "Tanish Sharma (Lead Architect)",
    notes: "Production deployment of Dragon Gaming Studio Universal Command Center with dual-workspace connectivity and 4K media library.",
  },
  {
    id: "2",
    version: "v2.3.2",
    title: "Contact Gateway & Email Verification Pipeline",
    status: "PUBLISHED",
    target: "MAIN_STUDIO_WEBSITE",
    commitHash: "git:8f19bc4",
    publishedAt: "2026-08-30 14:15",
    author: "Dragon Engineering Staff",
    notes: "Resend SMTP API gateway with HMAC cryptographic validation.",
  },
  {
    id: "3",
    version: "v2.5.0-RC1",
    title: "Careers & Talent Acquisition Portal Update",
    status: "APPROVED",
    target: "CAREERS_PORTAL",
    commitHash: "git:9c21ef8",
    publishedAt: "Scheduled for 2026-09-05",
    author: "Dragon HR & Talent Ops",
    notes: "New interactive applicant tracking pipeline and portfolio previewer.",
  },
];

export default function StudioReleasesPage() {
  const [releases, setReleases] = useState<StudioRelease[]>(INITIAL_STUDIO_RELEASES);
  const [publishing, setPublishing] = useState<string | null>(null);

  const handlePublish = (id: string, version: string) => {
    setPublishing(id);
    setTimeout(() => {
      setPublishing(null);
      setReleases((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "PUBLISHED", publishedAt: "Just now" } : r))
      );
      alert(`Release ${version} published to production successfully.`);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "APPROVED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "REVIEW":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
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
            <span className="text-xs text-slate-400 font-mono">• Release Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Studio Web Releases & Deployments
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage, review, schedule, and publish production updates to the public Dragon Gaming Studio website.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-600/20 w-fit">
          <Plus className="w-3.5 h-3.5" />
          <span>New Studio Release</span>
        </button>
      </div>

      {/* Releases List */}
      <div className="space-y-4">
        {releases.map((rel) => (
          <div
            key={rel.id}
            className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-white/20 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-white">{rel.version}</h2>
                <span className="text-xs text-blue-400 font-mono">{rel.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getStatusBadge(rel.status)}`}>
                  {rel.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {rel.status === "PUBLISHED" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>LIVE IN PRODUCTION</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handlePublish(rel.id, rel.version)}
                    disabled={publishing === rel.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
                  >
                    <Rocket className={`w-3.5 h-3.5 ${publishing === rel.id ? "animate-spin" : ""}`} />
                    <span>Deploy to Production</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400">{rel.notes}</p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                <span>{rel.commitHash} • {rel.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{rel.publishedAt}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
