"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Gamepad2, 
  RefreshCw, 
  Search, 
  Check,
  Download,
  Smartphone,
  Monitor,
  Sparkles,
  Layers,
  Flame,
  Zap,
  Compass,
  FileCode2,
  HardDrive,
  UploadCloud,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface GameItem {
  id: string;
  name: string;
  slug: string;
  genre: string;
  status: string;
  releaseDate: string;
  platforms: string;
  description: string;
  isPublished: boolean;
  dimension?: "3D" | "2D";
  engineVersion?: string;
  pcExeUrl?: string;
  pcFileSize?: string;
  mobileApkUrl?: string;
  mobileFileSize?: string;
  bannerUrl?: string;
  createdAt: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [telemetry, setTelemetry] = useState({
    totalGames: 0,
    publishedGames: 0,
    games3dCount: 0,
    games2dCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Insertion Modal & Drawer State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formDimension, setFormDimension] = useState<"3D" | "2D">("3D");
  const [formEngineVersion, setFormEngineVersion] = useState("Dragon 3D Engine");
  const [formGenre, setFormGenre] = useState("3D Action RPG");
  const [formStatus, setFormStatus] = useState("Live Released");
  const [formReleaseDate, setFormReleaseDate] = useState("2026");
  const [formDescription, setFormDescription] = useState("");
  const [formBannerUrl, setFormBannerUrl] = useState("");
  const [formPcExeUrl, setFormPcExeUrl] = useState("");
  const [formPcFileSize, setFormPcFileSize] = useState("650 MB");
  const [formMobileApkUrl, setFormMobileApkUrl] = useState("");
  const [formMobileFileSize, setFormMobileFileSize] = useState("120 MB");
  const [formPublished, setFormPublished] = useState(true);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/games?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.games)) {
        setGames(data.games);
        if (data.telemetry) setTelemetry(data.telemetry);
      }
    } catch (e) {
      console.error("Error fetching games", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchGames();
    });
    return () => { isMounted = false; };
  }, [fetchGames]);

  const handleOpenInsert = () => {
    setEditId(null);
    setFormName("");
    setFormDimension("3D");
    setFormEngineVersion("Dragon 3D Engine");
    setFormGenre("3D Action RPG");
    setFormStatus("Live Released");
    setFormReleaseDate("2026");
    setFormDescription("Original game created by Dragon Studios.");
    setFormBannerUrl("");
    setFormPcExeUrl("https://dragongamingstudios.vercel.app/downloads/DragonGame_PC_Setup.exe");
    setFormPcFileSize("650 MB");
    setFormMobileApkUrl("https://dragongamingstudios.vercel.app/downloads/DragonGame_Android.apk");
    setFormMobileFileSize("120 MB");
    setFormPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (g: GameItem) => {
    setEditId(g.id);
    setFormName(g.name);
    setFormDimension(g.dimension || "3D");
    setFormEngineVersion(g.engineVersion || (g.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"));
    setFormGenre(g.genre);
    setFormStatus(g.status);
    setFormReleaseDate(g.releaseDate);
    setFormDescription(g.description);
    setFormBannerUrl(g.bannerUrl || "");
    setFormPcExeUrl(g.pcExeUrl || "");
    setFormPcFileSize(g.pcFileSize || "650 MB");
    setFormMobileApkUrl(g.mobileApkUrl || "");
    setFormMobileFileSize(g.mobileFileSize || "120 MB");
    setFormPublished(g.isPublished);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          name: formName.trim(),
          dimension: formDimension,
          engineVersion: formDimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine",
          genre: formGenre,
          status: formStatus,
          releaseDate: formReleaseDate,
          platforms: "PC (.exe), Android (.apk)",
          description: formDescription.trim(),
          bannerUrl: formBannerUrl.trim(),
          pcExeUrl: formPcExeUrl.trim(),
          pcFileSize: formPcFileSize.trim(),
          mobileApkUrl: formMobileApkUrl.trim(),
          mobileFileSize: formMobileFileSize.trim(),
          isPublished: formPublished,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchGames();
      } else {
        alert(data.error || "Failed to insert game");
      }
    } catch (err: any) {
      alert(err.message || "Failed to insert game");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the website?`)) return;

    try {
      const res = await fetch(`/api/games?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchGames();
      } else {
        alert(data.error || "Failed to delete game");
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete game");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070A13] text-slate-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Title & Insertion Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 text-black shadow-lg shadow-cyan-500/25">
                  <Gamepad2 className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-heading tracking-tight">
                    INSERT & MANAGE GAMES
                  </h1>
                  <p className="text-xs font-mono text-cyan-400 font-bold">
                    Insert Original 3D & 2D Games into Website • PC (.exe) & Mobile (.apk) Builds
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleOpenInsert}
              className="gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-mono font-black text-xs uppercase tracking-wider px-6 py-6 shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all cursor-pointer"
            >
              <Plus className="size-4 stroke-[3]" />
              <span>INSERT NEW GAME INTO WEBSITE</span>
            </Button>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-[#0B132B]/80 border border-cyan-500/30 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">TOTAL GAMES</span>
              <span className="text-3xl font-black text-white font-mono">{telemetry.totalGames || games.length}</span>
              <span className="text-[10px] text-cyan-400 font-mono block">Dragon Engine Core</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#0B132B]/80 border border-emerald-500/30 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">LIVE ON WEBSITE</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">{telemetry.publishedGames || games.filter(g => g.isPublished).length}</span>
              <span className="text-[10px] text-emerald-300 font-mono block">Public Downloads Active</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#0B132B]/80 border border-purple-500/30 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">3D GAMES</span>
              <span className="text-3xl font-black text-purple-400 font-mono">{telemetry.games3dCount || games.filter(g => g.dimension === "3D").length}</span>
              <span className="text-[10px] text-purple-300 font-mono block">PC .exe & 3D Mobile</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#0B132B]/80 border border-amber-500/30 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">2D GAMES</span>
              <span className="text-3xl font-black text-amber-400 font-mono">{telemetry.games2dCount || games.filter(g => g.dimension === "2D").length}</span>
              <span className="text-[10px] text-amber-300 font-mono block">Platformers & Strategy</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0B132B]/60 p-4 rounded-2xl border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search className="size-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games catalog..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#060D22] border border-cyan-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {["All", "Live Released", "Beta Access", "Early Access", "In Development"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                    statusFilter === st
                      ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25"
                      : "bg-[#060D22] text-slate-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Games Release Catalog Grid */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black uppercase text-white font-heading">
                INSERTED GAMES IN WEBSITE ({games.length})
              </h2>
              <a
                href="https://dragongamingstudios.vercel.app/games"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>View Public Website Games Page</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
                <RefreshCw className="size-4 animate-spin text-cyan-400" />
                <span>Loading games database...</span>
              </div>
            ) : games.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#0B132B]/40 border border-white/10 text-center space-y-4">
                <Gamepad2 className="size-12 text-slate-600 mx-auto" />
                <p className="text-sm font-mono text-slate-400">No games inserted yet.</p>
                <Button onClick={handleOpenInsert} className="rounded-xl bg-cyan-500 text-black font-bold text-xs">
                  Insert Your First Game
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((g) => (
                  <div
                    key={g.id}
                    className="rounded-3xl bg-[#0B132B]/90 border border-cyan-500/30 p-6 space-y-5 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:border-cyan-400 transition-all"
                  >
                    {/* Top Game Card Header */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-black uppercase ${
                            g.dimension === "2D" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                          }`}>
                            {g.dimension || "3D"} GAME
                          </span>
                          <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                            {g.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"}
                          </span>
                        </div>

                        <span className={`size-2.5 rounded-full ${g.isPublished ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-white font-heading uppercase tracking-tight">
                          {g.name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400 block">
                          {g.genre} • {g.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                        {g.description}
                      </p>
                    </div>

                    {/* Build Downloads Section */}
                    <div className="space-y-2 pt-3 border-t border-white/10 font-mono text-xs">
                      <div className="p-2.5 rounded-xl bg-[#060D22] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Monitor className="size-3.5 text-cyan-400" />
                          <span>PC .exe Build</span>
                        </div>
                        <span className="text-[10px] text-cyan-300 font-bold">
                          {g.pcFileSize || "650 MB"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#060D22] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Smartphone className="size-3.5 text-emerald-400" />
                          <span>Mobile .apk Build</span>
                        </div>
                        <span className="text-[10px] text-emerald-300 font-bold">
                          {g.mobileFileSize || "120 MB"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Edit Game</span>
                      </button>

                      <button
                        onClick={() => handleDelete(g.id, g.name)}
                        className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: INSERT NEW GAME INTO WEBSITE MODAL                               */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-cyan-500/40 rounded-3xl w-full max-w-2xl p-6 md:p-8 space-y-6 shadow-2xl font-sans max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <UploadCloud className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base font-heading uppercase">
                    {editId ? "Edit Game In Website" : "Insert New Game Into Website"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Configure 3D/2D game build files, PC (.exe) & Android (.apk) download links
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs font-mono">
              
              {/* 1. Game Title & Dimension */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">GAME TITLE</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Dragon Slayer 3D: Realm of Fire"
                    className="w-full rounded-xl bg-[#060D22] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:border-cyan-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">GAME DIMENSION</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormDimension("3D")}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formDimension === "3D" ? "bg-purple-600 text-white shadow-lg" : "bg-[#060D22] text-slate-400"
                      }`}
                    >
                      3D Game
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormDimension("2D")}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formDimension === "2D" ? "bg-amber-600 text-white shadow-lg" : "bg-[#060D22] text-slate-400"
                      }`}
                    >
                      2D Game
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Genre Selection */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase text-[10px]">GENRE / CATEGORY</label>
                <select
                  value={formGenre}
                  onChange={(e) => setFormGenre(e.target.value)}
                  className="w-full rounded-xl bg-[#060D22] px-3.5 py-2.5 text-xs text-white border border-slate-700 font-bold"
                >
                  <option value="3D Action RPG">3D Action RPG</option>
                  <option value="3D Anti-Gravity Racing">3D Anti-Gravity Racing</option>
                  <option value="2D Action Platformer">2D Action Platformer</option>
                  <option value="2D Fantasy Strategy RPG">2D Fantasy Strategy RPG</option>
                  <option value="3D Sci-Fi Space Odyssey">3D Sci-Fi Space Odyssey</option>
                  <option value="3D Survival Open World">3D Survival Open World</option>
                </select>
              </div>

              {/* 3. PC (.exe) Build Configuration */}
              <div className="p-4 rounded-2xl bg-[#060D22] border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
                  <Monitor className="size-4" />
                  <span>PC Windows Build (.exe)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-400 text-[10px]">PC .EXE DOWNLOAD URL / PATH</label>
                    <input
                      type="url"
                      value={formPcExeUrl}
                      onChange={(e) => setFormPcExeUrl(e.target.value)}
                      placeholder="https://.../DragonGame_PC.exe"
                      className="w-full rounded-xl bg-[#030712] px-3 py-2 text-xs text-white border border-slate-700 focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">PC FILE SIZE</label>
                    <input
                      type="text"
                      value={formPcFileSize}
                      onChange={(e) => setFormPcFileSize(e.target.value)}
                      placeholder="650 MB"
                      className="w-full rounded-xl bg-[#030712] px-3 py-2 text-xs text-white border border-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Mobile (.apk) Build Configuration */}
              <div className="p-4 rounded-2xl bg-[#060D22] border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase">
                  <Smartphone className="size-4" />
                  <span>Android Mobile Build (.apk)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-400 text-[10px]">ANDROID .APK DOWNLOAD URL / PATH</label>
                    <input
                      type="url"
                      value={formMobileApkUrl}
                      onChange={(e) => setFormMobileApkUrl(e.target.value)}
                      placeholder="https://.../DragonGame_Android.apk"
                      className="w-full rounded-xl bg-[#030712] px-3 py-2 text-xs text-white border border-slate-700 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">APK FILE SIZE</label>
                    <input
                      type="text"
                      value={formMobileFileSize}
                      onChange={(e) => setFormMobileFileSize(e.target.value)}
                      placeholder="120 MB"
                      className="w-full rounded-xl bg-[#030712] px-3 py-2 text-xs text-white border border-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Banner Image & Description */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">COVER / BANNER IMAGE URL</label>
                  <input
                    type="url"
                    value={formBannerUrl}
                    onChange={(e) => setFormBannerUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or game artwork URL"
                    className="w-full rounded-xl bg-[#060D22] px-3.5 py-2.5 text-xs text-white border border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">GAME DESCRIPTION & STORY</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter game features, gameplay mechanics, and backstory..."
                    className="w-full rounded-xl bg-[#060D22] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 6. Release Status & Public Publish Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#060D22] border border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="publishToggle"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="size-4 rounded text-cyan-500 bg-black/40 border-slate-600 cursor-pointer"
                  />
                  <label htmlFor="publishToggle" className="text-white font-bold cursor-pointer">
                    Publish immediately to Dragon Studios Website & Downloads
                  </label>
                </div>

                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="rounded-lg bg-[#0B132B] px-3 py-1.5 text-xs text-cyan-300 border border-slate-700 font-bold"
                >
                  <option value="Live Released">Live Released</option>
                  <option value="Beta Access">Beta Access</option>
                  <option value="Early Access">Early Access</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>
              </div>

              {/* Submit Action Buttons */}
              <div className="pt-2 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  <span>{editId ? "UPDATE GAME IN WEBSITE" : "INSERT GAME INTO WEBSITE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
