"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Gamepad2, 
  RefreshCw, 
  Search, 
  Download, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  HardDrive, 
  X, 
  ExternalLink, 
  Globe, 
  ArrowUpDown, 
  MoreVertical, 
  AlertCircle,
  FolderPlus,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Zap,
  Eye,
  Layers,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Crown,
  FileText
} from "lucide-react";
import { openOfficialPdfReport } from "@/lib/pdf-report-generator";
import { cn } from "@/lib/utils/cn";
import { GlassSurface, GlassButton, GlassCard, GlassBadge, GlassStat } from "@/components/ui/glass";
import { ReleaseManagerModal } from "@/components/games/ReleaseManagerModal";
import { BannerStudioModal, BannerPresentationConfig } from "@/components/games/BannerStudioModal";

interface GameItem {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  genre: string;
  status: string;
  releaseDate: string;
  developer?: string;
  publisher?: string;
  engine?: string;
  platforms: string;
  description: string;
  fullDescription?: string | null;
  isPublished: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  dimension?: "3D" | "2D";
  engineVersion?: string;
  downloadCount?: number;
  pcExeUrl?: string;
  pcFileSize?: string;
  mobileApkUrl?: string;
  mobileFileSize?: string;
  bannerUrl?: string | null;
  cardBannerUrl?: string | null;
  logoUrl?: string | null;
  heroVideoUrl?: string | null;
  screenshots?: string[];
  requirements?: string | null;
  
  // AI & Presentation
  aiAnalysisStatus?: string;
  aiFocalPoint?: string | null;
  aiDesktopPosition?: string | null;
  aiMobilePosition?: string | null;
  aiCardPosition?: string | null;
  aiTextSafeArea?: string | null;
  aiConfidence?: number | null;
  manualFocalPoint?: string | null;
  manualDesktopPosition?: string | null;
  manualMobilePosition?: string | null;
  manualCardPosition?: string | null;
  presentationMode?: "AUTO" | "MANUAL";
  zoomLevel?: number;
  overlayIntensity?: number;
  textPlacement?: "bottom-left" | "bottom-center" | "center" | "top-left";
  focalPoint?: { x: number; y: number };
  effectiveDesktopPosition?: string;
  effectiveMobilePosition?: string;
  effectiveCardPosition?: string;
  publishedSnapshot?: any;

  // Release telemetry
  latestVersion?: string | null;
  latestReleaseStatus?: string | null;
  latestReleasePlatform?: string | null;
  latestReleaseDate?: string | null;
  releasesCount?: number;
  totalDownloads?: number;
  hasPublishedRelease?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TelemetryStats {
  totalGames: number;
  publishedGames: number;
  draftGames: number;
  totalDownloads: number;
  games3dCount: number;
  games2dCount: number;
}

const WIZARD_STEPS = [
  { id: 1, title: "Identity", desc: "Core game metadata" },
  { id: 2, title: "Visual Assets", desc: "Banners & logos" },
  { id: 3, title: "AI Intelligence", desc: "Gemini Vision analysis" },
  { id: 4, title: "Presentation", desc: "Focal crops & zoom" },
  { id: 5, title: "Platforms", desc: "Targets & specs" },
  { id: 6, title: "Binary Releases", desc: "B2 game files" },
  { id: 7, title: "Live Preview", desc: "Multi-device inspect" },
  { id: 8, title: "Publish", desc: "Atomic sync & cache" },
];

export default function GamesPage() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryStats>({
    totalGames: 0,
    publishedGames: 0,
    draftGames: 0,
    totalDownloads: 0,
    games3dCount: 0,
    games2dCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dimensionFilter, setDimensionFilter] = useState<"ALL" | "3D" | "2D">("ALL");

  // Modals
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedGameForReleases, setSelectedGameForReleases] = useState<GameItem | null>(null);
  const [bannerStudioTarget, setBannerStudioTarget] = useState<GameItem | null>(null);
  const [deleteConfirmGame, setDeleteConfirmGame] = useState<GameItem | null>(null);
  const [rollbackConfirmGame, setRollbackConfirmGame] = useState<GameItem | null>(null);

  // Form state for Wizard
  const [editGameId, setEditGameId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formDimension, setFormDimension] = useState<"3D" | "2D">("3D");
  const [formEngineVersion, setFormEngineVersion] = useState("Dragon 3D Engine v5.4");
  const [formGenre, setFormGenre] = useState("3D Action RPG");
  const [formStatus, setFormStatus] = useState("Live Released");
  const [formReleaseDate, setFormReleaseDate] = useState("2026");
  const [formDeveloper, setFormDeveloper] = useState("Dragon Studios");
  const [formPublisher, setFormPublisher] = useState("Dragon Interactive");
  const [formPlatforms, setFormPlatforms] = useState("PC (.exe), Android (.apk)");
  const [formDescription, setFormDescription] = useState("");
  const [formFullDescription, setFormFullDescription] = useState("");
  const [formBannerUrl, setFormBannerUrl] = useState("");
  const [formCardBannerUrl, setFormCardBannerUrl] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formHeroVideoUrl, setFormHeroVideoUrl] = useState("");
  const [formScreenshots, setFormScreenshots] = useState<string[]>([]);
  const [formRequirements, setFormRequirements] = useState("PC: Windows 10/11 64-bit, 8GB RAM, GTX 1060+ | Mobile: Android 10+, 4GB RAM");
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

  // Presentation & AI Config
  const [formPresentation, setFormPresentation] = useState<BannerPresentationConfig>({
    focalPoint: { x: 0.5, y: 0.5 },
    desktopPosition: "50% 50%",
    tabletPosition: "50% 50%",
    mobilePosition: "50% 50%",
    cardPosition: "50% 50%",
    presentationMode: "AUTO",
    zoomLevel: 1.0,
    overlayIntensity: 0.4,
    textPlacement: "bottom-left",
  });

  const [saving, setSaving] = useState(false);
  const [lastSyncTelemetry, setLastSyncTelemetry] = useState<{ dbMs: number; cacheMs: number; totalMs: number } | null>(null);

  // Fetch games from control plane API
  const fetchGames = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await fetch("/api/games");
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch games catalog`);
      const data = await res.json();
      if (data.success) {
        setGames(data.games || []);
        if (data.telemetry) setTelemetry(data.telemetry);
      } else {
        throw new Error(data.error || "Failed to load games");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error connecting to catalog database");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Open Create Wizard
  const handleOpenCreateModal = () => {
    setEditGameId(null);
    setFormName("");
    setFormSlug("");
    setFormSubtitle("");
    setFormDimension("3D");
    setFormEngineVersion("Dragon 3D Engine v5.4");
    setFormGenre("3D Action RPG");
    setFormStatus("Live Released");
    setFormReleaseDate("2026");
    setFormDeveloper("Dragon Studios");
    setFormPublisher("Dragon Interactive");
    setFormPlatforms("PC (.exe), Android (.apk)");
    setFormDescription("An epic 3D open-world fantasy action RPG built by Dragon Studios.");
    setFormFullDescription("");
    setFormBannerUrl("https://dragongamingstudios.vercel.app/images/games/dragon-slayer.jpg");
    setFormCardBannerUrl("");
    setFormLogoUrl("");
    setFormHeroVideoUrl("");
    setFormScreenshots([]);
    setFormRequirements("PC: Windows 10/11 64-bit, 8GB RAM, GTX 1060+ | Mobile: Android 10+, 4GB RAM");
    setFormPublished(true);
    setFormFeatured(false);
    setFormPresentation({
      focalPoint: { x: 0.5, y: 0.5 },
      desktopPosition: "50% 50%",
      tabletPosition: "50% 50%",
      mobilePosition: "50% 50%",
      cardPosition: "50% 50%",
      presentationMode: "AUTO",
      zoomLevel: 1.0,
      overlayIntensity: 0.4,
      textPlacement: "bottom-left",
    });
    setWizardStep(1);
    setWizardOpen(true);
  };

  // Open Edit Wizard
  const handleOpenEditModal = (game: GameItem) => {
    setEditGameId(game.id);
    setFormName(game.name);
    setFormSlug(game.slug);
    setFormSubtitle(game.subtitle || "");
    setFormDimension(game.dimension || "3D");
    setFormEngineVersion(game.engineVersion || (game.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"));
    setFormGenre(game.genre);
    setFormStatus(game.status);
    setFormReleaseDate(game.releaseDate);
    setFormDeveloper(game.developer || "Dragon Studios");
    setFormPublisher(game.publisher || "Dragon Interactive");
    setFormPlatforms(game.platforms);
    setFormDescription(game.description);
    setFormFullDescription(game.fullDescription || "");
    setFormBannerUrl(game.bannerUrl || "");
    setFormCardBannerUrl(game.cardBannerUrl || "");
    setFormLogoUrl(game.logoUrl || "");
    setFormHeroVideoUrl(game.heroVideoUrl || "");
    setFormScreenshots(game.screenshots || []);
    setFormRequirements(game.requirements || "");
    setFormPublished(game.isPublished);
    setFormFeatured(game.isFeatured || false);
    setFormPresentation({
      focalPoint: game.focalPoint || { x: 0.5, y: 0.5 },
      desktopPosition: game.effectiveDesktopPosition || "50% 50%",
      tabletPosition: game.effectiveDesktopPosition || "50% 50%",
      mobilePosition: game.effectiveMobilePosition || "50% 50%",
      cardPosition: game.effectiveCardPosition || "50% 50%",
      presentationMode: game.presentationMode || "AUTO",
      zoomLevel: game.zoomLevel || 1.0,
      overlayIntensity: game.overlayIntensity ?? 0.4,
      textPlacement: game.textPlacement || "bottom-left",
      aiConfidence: game.aiConfidence || 0.95,
    });
    setWizardStep(1);
    setWizardOpen(true);
  };

  // Save / Publish game
  const handleSaveGame = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editGameId,
          name: formName.trim(),
          slug: formSlug.trim() || undefined,
          subtitle: formSubtitle.trim() || undefined,
          dimension: formDimension,
          engineVersion: formEngineVersion,
          genre: formGenre,
          status: formStatus,
          releaseDate: formReleaseDate,
          developer: formDeveloper,
          publisher: formPublisher,
          platforms: formPlatforms,
          description: formDescription,
          fullDescription: formFullDescription,
          bannerUrl: formBannerUrl.trim() || null,
          cardBannerUrl: formCardBannerUrl.trim() || null,
          logoUrl: formLogoUrl.trim() || null,
          heroVideoUrl: formHeroVideoUrl.trim() || null,
          screenshots: formScreenshots,
          requirements: formRequirements,
          isPublished: formPublished,
          isFeatured: formFeatured,
          // Presentation controls
          presentationMode: formPresentation.presentationMode,
          manualFocalPoint: formPresentation.focalPoint,
          manualDesktopPosition: formPresentation.desktopPosition,
          manualMobilePosition: formPresentation.mobilePosition,
          manualCardPosition: formPresentation.cardPosition,
          zoomLevel: formPresentation.zoomLevel,
          overlayIntensity: formPresentation.overlayIntensity,
          textPlacement: formPresentation.textPlacement,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.telemetry) {
          setLastSyncTelemetry(data.telemetry);
        }
        setWizardOpen(false);
        fetchGames();
      } else {
        alert(data.error || "Failed to publish game update.");
      }
    } catch (err: unknown) {
      alert("Error saving game: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  // Rollback to previous version snapshot
  const handleRollback = async (gameId: string) => {
    try {
      const res = await fetch(`/api/games/${gameId}/rollback`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setRollbackConfirmGame(null);
        if (data.telemetry) setLastSyncTelemetry(data.telemetry);
        fetchGames();
      } else {
        alert(data.error || "Rollback failed.");
      }
    } catch (err: unknown) {
      alert("Rollback exception: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Delete Game
  const handleDeleteGame = async (gameId: string) => {
    try {
      const res = await fetch(`/api/games?id=${encodeURIComponent(gameId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmGame(null);
        fetchGames();
      } else {
        alert(data.error || "Failed to delete game");
      }
    } catch (err: unknown) {
      alert("Error deleting game: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const matchesSearch = !searchQuery || (
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.platforms.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = statusFilter === "All" || (
        statusFilter === "Published" ? g.isPublished :
        statusFilter === "Draft" ? !g.isPublished :
        statusFilter === "Featured" ? g.isFeatured :
        g.status === statusFilter
      );
      const matchesDimension = dimensionFilter === "ALL" || g.dimension === dimensionFilter;
      return matchesSearch && matchesStatus && matchesDimension;
    });
  }, [games, searchQuery, statusFilter, dimensionFilter]);

  const handleExportGamesPDF = () => {
    openOfficialPdfReport({
      header: {
        title: "GAME STUDIO PRODUCTION & RELEASES CATALOG",
        subtitle: "Official audit of all AAA titles, engine binaries, Backblaze B2 distribution channels, and player downloads.",
        classification: "TOP SECRET // EXECUTIVE ONLY",
        category: "GAME STUDIO PRODUCTION AUDIT",
      },
      metrics: [
        { label: "REGISTERED TITLES", value: games.length, subtext: "PostgreSQL Games Catalog", color: "cyan" },
        { label: "PUBLISHED LIVE", value: games.filter((g) => g.isPublished).length, subtext: "Public Website Live", color: "emerald" },
        { label: "TOTAL DOWNLOADS", value: games.reduce((acc, g) => acc + (g.downloadCount || 0), 0), subtext: "Verified Player Installs", color: "gold" },
        { label: "STORAGE BACKEND", value: "Backblaze B2", subtext: "S3 Enterprise Cloud", color: "purple" },
      ],
      table: {
        title: "OFFICIAL STUDIO GAMES PRODUCTION REGISTRY",
        columns: [
          { header: "Game Title", render: (g: GameItem) => `<b>${g.name}</b>`, width: "22%" },
          { header: "Genre", render: (g: GameItem) => `<span class="badge-cyan">${g.genre}</span>`, width: "15%" },
          { header: "Platforms", render: (g: GameItem) => g.platforms || "PC / Android", width: "18%" },
          { header: "Engine", render: (g: GameItem) => g.engineVersion || "Dragon Engine v5.4", width: "18%" },
          { header: "Status", render: (g: GameItem) => g.isPublished ? `<span class="badge-emerald">PUBLISHED</span>` : `<span class="badge-amber">DRAFT</span>`, width: "12%" },
          { header: "Downloads", render: (g: GameItem) => String(g.downloadCount || 0), align: "center", width: "15%" },
        ],
        rows: filteredGames,
      },
      notes: [
        "Uncharted Drive: Beyond is the flagship AAA open-world franchise of Dragon Gaming Studios.",
        "Executable builds (.exe) and mobile packages (.apk) are cryptographically hashed and distributed via Backblaze B2.",
      ],
    });
  };

  return (
    <div className="flex h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Game Studio Engine • Authority Control Plane
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-heading">
                Games Catalog & Publishing Engine
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportGamesPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
                title="Export Games Catalog Report to PDF"
              >
                <FileText className="size-3.5 text-cyan-400" />
                <span>Export PDF Catalog</span>
              </button>

              <button
                onClick={fetchGames}
                className="p-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
                title="Refresh Catalog"
              >
                <RefreshCw className={cn("size-4", refreshing && "animate-spin text-cyan-400")} />
              </button>

              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3CFF] text-[#020617] text-xs font-mono font-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Create Game (8-Step Wizard)</span>
              </button>
            </div>
          </div>

          {/* Measured Performance Telemetry Pill */}
          {lastSyncTelemetry && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-in fade-in">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>
                  <strong>Real Sync Telemetry:</strong> DB write: {lastSyncTelemetry.dbMs}ms · Cache Invalidation: {lastSyncTelemetry.cacheMs}ms · Total Publish: {lastSyncTelemetry.totalMs}ms
                </span>
              </div>
              <button onClick={() => setLastSyncTelemetry(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStat
              label="Total Titles"
              value={telemetry.totalGames}
              icon={Gamepad2}
              trend="+100% canonical"
            />
            <GlassStat
              label="Live Published"
              value={telemetry.publishedGames}
              icon={CheckCircle2}
              trend="Live CDN"
            />
            <GlassStat
              label="3D / 2D Split"
              value={`${telemetry.games3dCount} / ${telemetry.games2dCount}`}
              icon={Layers}
              trend="Active Native"
            />
            <GlassStat
              label="Total Downloads"
              value={telemetry.totalDownloads.toLocaleString()}
              icon={Download}
              trend="B2 Pipeline"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#03091D]/90 p-3 rounded-2xl border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <div className="relative w-full sm:w-80">
              <Search className="size-4 absolute left-3 top-2.5 text-cyan-400" />
              <input
                type="text"
                placeholder="Search games by title, slug, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <div className="flex bg-[#02050E] p-1 rounded-xl border border-cyan-500/20">
                {(["All", "Published", "Draft", "Featured"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer",
                      statusFilter === s ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]" : "text-slate-400 hover:text-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex bg-[#02050E] p-1 rounded-xl border border-cyan-500/20">
                {(["ALL", "3D", "2D"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDimensionFilter(d)}
                    className={cn(
                      "px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer",
                      dimensionFilter === d
                        ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GlassCard key={game.id} className="overflow-hidden flex flex-col group p-0 border border-cyan-500/30 bg-[#03091D]/90 hover:border-cyan-400/60 shadow-[0_4px_25px_rgba(0,0,0,0.7)] transition-all duration-300">
                
                {/* Banner Artwork with responsive focal point */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#02050E]">
                  {game.bannerUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={game.bannerUrl}
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{
                        objectPosition: game.effectiveDesktopPosition || "50% 50%",
                        transform: `scale(${game.zoomLevel || 1.0})`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-500/60 text-xs font-mono">
                      No Artwork
                    </div>
                  )}

                  {/* Dark gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: `rgba(2, 6, 23, ${game.overlayIntensity ?? 0.4})` }}
                  />

                  {/* Status Pills */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <GlassBadge variant={game.isPublished ? "published" : "draft"}>
                      {game.isPublished ? "LIVE" : "DRAFT"}
                    </GlassBadge>
                    {game.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold font-mono text-[10px] flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                        <Crown className="size-3" /> FEATURED
                      </span>
                    )}
                  </div>

                  {/* AI / Manual Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#02050E]/80 backdrop-blur-md text-cyan-300 font-mono text-[10px] border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                      {game.presentationMode === "AUTO" ? "⚡ AI Focal" : "🎛️ Manual Crop"}
                    </span>
                  </div>

                  {/* Bottom title in banner */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-0.5">
                      {game.genre}
                    </span>
                    <h3 className="text-base font-black truncate leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {game.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4 bg-[#03091D]/80">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    {game.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-[#02050E] p-2.5 rounded-xl border border-cyan-500/20">
                    <div>
                      <span className="text-cyan-400/70 block text-[10px] uppercase font-bold">Engine</span>
                      <strong className="text-white font-mono font-bold truncate block">{game.engineVersion || "Dragon 3D Engine"}</strong>
                    </div>
                    <div>
                      <span className="text-cyan-400/70 block text-[10px] uppercase font-bold">Latest Release</span>
                      <strong className="text-white font-mono font-bold truncate block">
                        {game.latestVersion ? `v${game.latestVersion}` : "No Binaries"}
                      </strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setBannerStudioTarget(game)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-cyan-500/30 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.15)]"
                      title="Open Banner Studio"
                    >
                      <Sliders className="size-3.5" />
                      <span>Banner Studio</span>
                    </button>

                    <button
                      onClick={() => setSelectedGameForReleases(game)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-[1.02]"
                      title="Manage B2 Releases"
                    >
                      <HardDrive className="size-3.5" />
                      <span>B2 Releases</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(game)}
                      className="p-2 rounded-xl bg-[#02050E] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-cyan-500/20 transition-colors cursor-pointer"
                      title="Edit Game"
                    >
                      <Edit3 className="size-4" />
                    </button>

                    {game.publishedSnapshot && (
                      <button
                        onClick={() => setRollbackConfirmGame(game)}
                        className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                        title="Rollback to previous snapshot"
                      >
                        <RotateCcw className="size-4" />
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteConfirmGame(game)}
                      className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                      title="Delete Game"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>

      {/* ═══ 8-STAGE GUIDED CREATION / EDITING WIZARD MODAL ═══ */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden">
            
            {/* Wizard Header */}
            <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#02050E]/90 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
                  <Gamepad2 className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight font-mono">
                    {editGameId ? "Edit Game & Visual Configuration" : "New Game Publishing Wizard"}
                  </h2>
                  <p className="text-xs text-cyan-400/70 font-mono">
                    Step {wizardStep} of 8: {WIZARD_STEPS[wizardStep - 1]?.title} — {WIZARD_STEPS[wizardStep - 1]?.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setWizardOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Step Navigation Pill Bar */}
            <div className="px-6 py-2.5 bg-[#02050E] border-b border-cyan-500/20 flex items-center gap-1.5 overflow-x-auto">
              {WIZARD_STEPS.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setWizardStep(step.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer",
                    wizardStep === step.id
                      ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                      : wizardStep > step.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <span>{step.id}.</span>
                  <span>{step.title}</span>
                </button>
              ))}
            </div>

            {/* Step Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#03091D]/90 text-slate-200">
              
              {/* STEP 1: IDENTITY */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-cyan-400/90">Game Title *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => {
                          setFormName(e.target.value);
                          if (!editGameId) {
                            setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                          }
                        }}
                        placeholder="e.g. Dragon Slayer 3D: Realm of Fire"
                        className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-cyan-400/90">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        placeholder="e.g. dragon-slayer-3d"
                        className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-cyan-400/90">Dimension</label>
                      <select
                        value={formDimension}
                        onChange={(e) => {
                          const dim = e.target.value as "3D" | "2D";
                          setFormDimension(dim);
                          setFormEngineVersion(dim === "2D" ? "Dragon 2D Engine v3.1" : "Dragon 3D Engine v5.4");
                        }}
                        className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        <option value="3D">3D Game</option>
                        <option value="2D">2D Game</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-cyan-400/90">Engine</label>
                      <input
                        type="text"
                        value={formEngineVersion}
                        onChange={(e) => setFormEngineVersion(e.target.value)}
                        className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-cyan-400/90">Genre</label>
                      <input
                        type="text"
                        value={formGenre}
                        onChange={(e) => setFormGenre(e.target.value)}
                        placeholder="e.g. 3D Action RPG"
                        className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-cyan-400/90">Short Summary</label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Brief overview displayed on game cards and homepage..."
                      className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: VISUAL ASSETS */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-cyan-400/90">Hero Banner Artwork URL *</label>
                    <input
                      type="url"
                      value={formBannerUrl}
                      onChange={(e) => setFormBannerUrl(e.target.value)}
                      placeholder="https://.../banner.jpg"
                      className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {formBannerUrl && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#02050E] relative border border-cyan-500/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formBannerUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-cyan-400/90">Card Tile Banner URL (Optional)</label>
                      <input
                        type="url"
                        value={formCardBannerUrl}
                        onChange={(e) => setFormCardBannerUrl(e.target.value)}
                        placeholder="https://.../card.jpg"
                        className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-cyan-400/90">Game Logo PNG URL (Optional)</label>
                      <input
                        type="url"
                        value={formLogoUrl}
                        onChange={(e) => setFormLogoUrl(e.target.value)}
                        placeholder="https://.../logo.png"
                        className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 & 4: AI INTELLIGENCE & PRESENTATION */}
              {(wizardStep === 3 || wizardStep === 4) && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/30 text-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 font-mono">
                      <Sparkles className="size-4 text-cyan-400" />
                      <span>Gemini Vision AI Banner Studio</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      You can tune focal crops across Desktop, Tablet, and Mobile devices or run Gemini AI Visual Intelligence right now.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setBannerStudioTarget({
                          id: editGameId || "temp",
                          name: formName || "New Game",
                          slug: formSlug || "new-game",
                          genre: formGenre,
                          status: formStatus,
                          releaseDate: formReleaseDate,
                          platforms: formPlatforms,
                          description: formDescription,
                          isPublished: formPublished,
                          bannerUrl: formBannerUrl,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black font-mono text-xs shadow-[0_0_15px_rgba(0,229,255,0.35)] hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sliders className="size-3.5" />
                      <span>Launch Interactive Banner Studio →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: PLATFORMS & REQUIREMENTS */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-cyan-400/90">Target Platforms</label>
                    <input
                      type="text"
                      value={formPlatforms}
                      onChange={(e) => setFormPlatforms(e.target.value)}
                      placeholder="e.g. PC (.exe), Android (.apk)"
                      className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-cyan-400/90">System Requirements</label>
                    <textarea
                      rows={3}
                      value={formRequirements}
                      onChange={(e) => setFormRequirements(e.target.value)}
                      className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: RELEASES */}
              {wizardStep === 6 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#02050E] border border-cyan-500/30 text-white space-y-3">
                    <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 font-mono">
                      <HardDrive className="size-4 text-cyan-400" />
                      <span>Backblaze B2 Game Binaries</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Manage official production builds (Windows .exe / Android .apk) with chunked SHA-256 validation.
                    </p>
                    {editGameId ? (
                      <button
                        type="button"
                        onClick={() => {
                          const target = games.find((g) => g.id === editGameId);
                          if (target) setSelectedGameForReleases(target);
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:bg-cyan-500/30 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <HardDrive className="size-3.5" />
                        <span>Manage B2 Releases for {formName} →</span>
                      </button>
                    ) : (
                      <p className="text-xs text-amber-300 font-mono font-medium">
                        Please complete Step 8 (Publish) first to generate a canonical Game ID before uploading binary releases.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 7: LIVE PREVIEW */}
              {wizardStep === 7 && (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#02050E] relative border border-cyan-500/30 shadow-[0_0_25px_rgba(0,229,255,0.2)]">
                    {formBannerUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formBannerUrl}
                        alt={formName}
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: formPresentation.desktopPosition,
                          transform: `scale(${formPresentation.zoomLevel})`,
                        }}
                      />
                    )}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundColor: `rgba(2, 6, 23, ${formPresentation.overlayIntensity})` }}
                    />
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{formGenre}</span>
                      <h3 className="text-xl font-black">{formName || "Game Title"}</h3>
                      <p className="text-xs text-slate-300 max-w-md line-clamp-2 mt-1">{formDescription}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: PUBLISH & SYNC */}
              {wizardStep === 8 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-300 font-mono">
                      <ShieldCheck className="size-4" />
                      <span>Ready For Atomic Publication</span>
                    </div>
                    <p className="text-xs text-emerald-300 leading-relaxed font-sans">
                      Publishing writes directly to Neon PostgreSQL and executes instant targeted cache invalidation (<code className="font-mono bg-emerald-500/20 px-1 py-0.5 rounded text-emerald-200">game-{formSlug || "slug"}</code>) on the public website with 0 redeployments required.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold text-cyan-300">
                      <input
                        type="checkbox"
                        checked={formPublished}
                        onChange={(e) => setFormPublished(e.target.checked)}
                        className="rounded border-cyan-500/40 bg-[#02050E] text-cyan-400 size-4"
                      />
                      <span>Make game publicly visible on website</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold text-amber-300">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="rounded border-amber-500/40 bg-[#02050E] text-amber-400 size-4"
                      />
                      <span>Feature in Homepage Showcase</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Footer Controls */}
            <div className="px-6 py-4 border-t border-cyan-500/20 flex items-center justify-between bg-[#02050E]/90 backdrop-blur-xl">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-xl bg-[#03091D] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft className="size-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {wizardStep < 8 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((prev) => Math.min(8, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-mono font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.35)] hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <span>Next: {WIZARD_STEPS[wizardStep]?.title}</span>
                    <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveGame}
                    className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="size-4 animate-spin" /> : <Zap className="size-4" />}
                    <span>{saving ? "Publishing..." : "⚡ Publish to Website Now"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BANNER STUDIO MODAL ═══ */}
      {bannerStudioTarget && (
        <BannerStudioModal
          isOpen={!!bannerStudioTarget}
          onClose={() => setBannerStudioTarget(null)}
          gameTitle={bannerStudioTarget.name}
          gameGenre={bannerStudioTarget.genre}
          bannerUrl={bannerStudioTarget.bannerUrl || ""}
          config={{
            focalPoint: bannerStudioTarget.focalPoint || { x: 0.5, y: 0.5 },
            desktopPosition: bannerStudioTarget.effectiveDesktopPosition || "50% 50%",
            tabletPosition: bannerStudioTarget.effectiveDesktopPosition || "50% 50%",
            mobilePosition: bannerStudioTarget.effectiveMobilePosition || "50% 50%",
            cardPosition: bannerStudioTarget.effectiveCardPosition || "50% 50%",
            presentationMode: bannerStudioTarget.presentationMode || "AUTO",
            zoomLevel: bannerStudioTarget.zoomLevel || 1.0,
            overlayIntensity: bannerStudioTarget.overlayIntensity ?? 0.4,
            textPlacement: bannerStudioTarget.textPlacement || "bottom-left",
            aiConfidence: bannerStudioTarget.aiConfidence || 0.95,
          }}
          onSave={async (updatedConfig) => {
            // Apply presentation config directly to database & website
            try {
              const res = await fetch("/api/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: bannerStudioTarget.id,
                  name: bannerStudioTarget.name,
                  slug: bannerStudioTarget.slug,
                  genre: bannerStudioTarget.genre,
                  status: bannerStudioTarget.status,
                  releaseDate: bannerStudioTarget.releaseDate,
                  platforms: bannerStudioTarget.platforms,
                  description: bannerStudioTarget.description,
                  bannerUrl: bannerStudioTarget.bannerUrl,
                  presentationMode: updatedConfig.presentationMode,
                  manualFocalPoint: updatedConfig.focalPoint,
                  manualDesktopPosition: updatedConfig.desktopPosition,
                  manualMobilePosition: updatedConfig.mobilePosition,
                  manualCardPosition: updatedConfig.cardPosition,
                  zoomLevel: updatedConfig.zoomLevel,
                  overlayIntensity: updatedConfig.overlayIntensity,
                  textPlacement: updatedConfig.textPlacement,
                }),
              });
              const json = await res.json();
              if (json.success) {
                if (json.telemetry) setLastSyncTelemetry(json.telemetry);
                fetchGames();
              }
            } catch (err) {
              console.error("Banner save error:", err);
            }
          }}
        />
      )}

      {/* ═══ B2 RELEASES MODAL ═══ */}
      {selectedGameForReleases && (
        <ReleaseManagerModal
          isOpen={!!selectedGameForReleases}
          onClose={() => {
            setSelectedGameForReleases(null);
            fetchGames();
          }}
          gameId={selectedGameForReleases.id}
          gameName={selectedGameForReleases.name}
          gameSlug={selectedGameForReleases.slug}
        />
      )}

      {/* ═══ ROLLBACK CONFIRMATION MODAL ═══ */}
      {rollbackConfirmGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#03091D] border border-amber-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-in fade-in zoom-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <RotateCcw className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Rollback to Previous Version</h3>
                <p className="text-xs text-amber-400/80 font-mono">Atomic snapshot revert for {rollbackConfirmGame.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              This will restore the previously published state and immediately purge the website cache.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRollbackConfirmGame(null)}
                className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 hover:border-cyan-500/40 text-slate-300 text-xs font-mono font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRollback(rollbackConfirmGame.id)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                Confirm Rollback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
      {deleteConfirmGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#03091D] border border-rose-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_30px_rgba(244,63,94,0.2)] animate-in fade-in zoom-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Delete Game from Catalog</h3>
                <p className="text-xs text-rose-400/80 font-mono">{deleteConfirmGame.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Are you sure you want to permanently delete this game title? This will remove all associated database records and purge the website cache.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmGame(null)}
                className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 hover:border-cyan-500/40 text-slate-300 text-xs font-mono font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteGame(deleteConfirmGame.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                Delete Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
