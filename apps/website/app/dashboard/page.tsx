"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Sparkles,
  Zap,
  Globe,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Search,
  Layers,
  Flame,
  LayoutDashboard,
  Headphones,
  User,
  X,
  Menu,
  RotateCcw,
  MessagesSquare,
  Gamepad2,
  Lock,
  Key,
  Shield,
  ExternalLink
} from "lucide-react";
import { DragonLogo, DragonLogoIcon } from "@/components/ui/dragon-logo";
import {
  PlayerIdentitySetupModal,
  GOD_LEVEL_BANNERS,
  GOD_LEVEL_AVATARS,
} from "@/components/dashboard/PlayerIdentitySetupModal";
import { DragonHeroCommandCenter } from "@/components/dashboard/DragonHeroCommandCenter";
import { DragonIdentityCard } from "@/components/dashboard/DragonIdentityCard";
import { DragonExecutiveMatrix } from "@/components/dashboard/DragonExecutiveMatrix";
import { DragonSignalCenter, SupportTicket } from "@/components/dashboard/DragonSignalCenter";
import { DragonCommunityHub } from "@/components/dashboard/DragonCommunityHub";
import { soundFx } from "@/lib/sound-effects";
import { cn } from "@/lib/cn";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  dragonId?: string;
  dragonKey?: string;
  role: string;
  createdAt: string;
  gamerTag?: string;
  primaryTitle?: string;
  bannerTheme?: string;
  bannerUrl?: string;
  avatar?: string;
  image?: string;
  bio?: string;
  securityScore?: number;
  vaultStatus?: string;
}

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // State Management
  const [activeTab, setActiveTab] = useState<"dashboard" | "identity" | "community" | "support">("dashboard");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userTickets, setUserTickets] = useState<SupportTicket[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Identity Modal State (for manual edits)
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  // Fetch real profile and onboarding state from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      const data = await res.json();
      if (data.success && data.user) {
        // Enforce Server/Client Gate
        const hasCompletedWelcome = data.onboarding?.hasCompletedWelcome ?? false;
        const hasCompletedDragonId = data.onboarding?.hasCompletedDragonId ?? false;

        if (!hasCompletedWelcome) {
          router.replace("/welcome");
          return;
        }

        if (!hasCompletedDragonId) {
          router.replace("/dragon-id/setup");
          return;
        }

        setProfileData({
          ...data.user,
          dragonId: data.dragonId || data.user.dragonId,
          dragonKey: data.dragonKey || data.user.dragonKey || "DRG-KEY-8942-XF92",
          securityScore: data.securityScore || data.user.securityScore || 98,
        });
        if (data.tickets) setUserTickets(data.tickets);
      }
    } catch (e) {
      console.error("Profile fetch error:", e);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    soundFx.playClick();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.warn("Logout endpoint warning:", e);
    }
    await signOut({ callbackUrl: "/login", redirect: false });
    window.location.href = "/login";
  };

  // Resolved Real User Metadata
  const userName = profileData?.name || session?.user?.name || "Dragon Operative";
  const userGamerTag = profileData?.gamerTag || "operative";
  const userEmail = profileData?.email || session?.user?.email || "";
  const userRole = profileData?.role || "OWNER";
  const userTitle = profileData?.primaryTitle || "Dragon Operative";
  const userDragonId = profileData?.dragonId || "DRG-ZDF-9415";
  const userDragonKey = profileData?.dragonKey || "DRG-KEY-8942-XF92";
  const userSecurityScore = profileData?.securityScore || 98;

  const activeAvatar =
    GOD_LEVEL_AVATARS.find(
      (a) =>
        a.id === profileData?.avatar ||
        a.imageSrc === profileData?.image ||
        a.imageSrc === profileData?.avatar
    ) || GOD_LEVEL_AVATARS[0];

  const activeBanner =
    GOD_LEVEL_BANNERS.find((b) => b.id === profileData?.bannerTheme) ||
    GOD_LEVEL_BANNERS[0];

  return (
    <div className="flex h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none relative">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LAYERED MULTI-NEON BACKGROUND ATMOSPHERE                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#02040A]" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#00E5FF]/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[550px] h-[550px] bg-[#7C3CFF]/10 rounded-full blur-[190px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#FF2BD6]/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. AAA FUTURISTIC SIDEBAR (DESKTOP)                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#030714]/95 backdrop-blur-2xl border-r border-cyan-500/25 z-30 shrink-0 select-none shadow-[10px_0_40px_rgba(0,0,0,0.8)]">
        {/* Brand Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-transparent">
          <Link href="/" className="inline-block group" onClick={() => soundFx.playClick()}>
            <DragonLogo size="md" subtitle="COMMAND CENTER" />
          </Link>
        </div>

        {/* Real Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-500/20">
          <div className="space-y-1.5">
            <span className="px-3 text-[10px] font-mono font-black tracking-[0.2em] text-cyan-400/80 uppercase">
              DRAGON OPERATIVE OS
            </span>

            {/* 1. Command Center */}
            <button
              onClick={() => {
                setActiveTab("dashboard");
                soundFx.playClick();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-transparent text-cyan-300 border-l-4 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`size-4 ${activeTab === "dashboard" ? "text-cyan-400" : "text-slate-400"}`} />
                <span>Command Center</span>
              </div>
              <ChevronRight className="size-3.5 opacity-60" />
            </button>

            {/* 2. Personal Dragon ID Vault */}
            <button
              onClick={() => {
                setActiveTab("identity");
                soundFx.playClick();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "identity"
                  ? "bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-transparent text-amber-300 border-l-4 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown className="size-4 text-amber-400" />
                <span>Dragon ID Vault</span>
              </div>
              <Sparkles className="size-3.5 text-amber-400" />
            </button>

            {/* 3. Second Dragon Portal (SSO Pass Link) */}
            <a
              href="/api/auth/sso/launch"
              onClick={() => soundFx.playClick()}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-mono text-xs font-bold uppercase text-purple-300 hover:text-white hover:bg-purple-500/10 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Gamepad2 className="size-4 text-purple-400" />
                <span>Web Games Portal</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-purple-300 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/40">
                SSO
              </span>
            </a>

            {/* 4. Player Signals / Support */}
            <button
              onClick={() => {
                setActiveTab("support");
                soundFx.playClick();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "support"
                  ? "bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-transparent text-amber-300 border-l-4 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Headphones className={`size-4 ${activeTab === "support" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Player Signals</span>
              </div>
              {userTickets.length > 0 && (
                <span className="text-[10px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-400/40">
                  {userTickets.length}
                </span>
              )}
            </button>

            {/* 5. Community Hub */}
            <button
              onClick={() => {
                setActiveTab("community");
                soundFx.playClick();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "community"
                  ? "bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-transparent text-cyan-300 border-l-4 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessagesSquare className={`size-4 ${activeTab === "community" ? "text-cyan-400" : "text-slate-400"}`} />
                <span>Community & Forums</span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
            </button>
          </div>
        </div>

        {/* Visit Public Website Action */}
        <div className="p-4 border-t border-cyan-500/20 space-y-2 bg-[#020510]">
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.25)] transition-all cursor-pointer"
          >
            <Globe className="size-4 text-cyan-400" />
            <span>🌐 VISIT DRAGON WEBSITE</span>
          </Link>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN VIEWPORT & HEADER                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-6 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div className="flex items-center gap-2">
                <DragonLogoIcon size="sm" />
                <span className="font-bold text-white text-sm">DRAGON SYSTEMS</span>
              </div>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {[
                { id: "dashboard" as const, label: "Command Center", icon: LayoutDashboard },
                { id: "identity" as const, label: "Dragon ID Vault", icon: Crown },
                { id: "support" as const, label: "Player Signals", icon: Headphones },
                { id: "community" as const, label: "Community & Forums", icon: MessagesSquare },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileNavOpen(false);
                    soundFx.playClick();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold uppercase transition-all",
                    activeTab === item.id
                      ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                      : "bg-[#03091D] text-slate-400 border border-cyan-500/15"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="size-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="size-4 opacity-50" />
                </button>
              ))}

              <a
                href="/api/auth/sso/launch"
                onClick={() => setIsMobileNavOpen(false)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold uppercase bg-purple-950/40 text-purple-300 border border-purple-500/30"
              >
                <div className="flex items-center gap-3">
                  <Gamepad2 className="size-4 text-purple-400" />
                  <span>Web Games Portal</span>
                </div>
                <ChevronRight className="size-4 opacity-50" />
              </a>
            </div>

            <Link
              href="/"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider"
            >
              <Globe className="size-4" />
              <span>Visit Website</span>
            </Link>
          </div>
        )}

        {/* Topbar Header */}
        <header className="h-16 sm:h-20 bg-[#030714]/90 backdrop-blur-2xl border-b border-cyan-500/20 px-4 sm:px-8 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 cursor-pointer"
            >
              {isMobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono font-black uppercase tracking-wider text-white leading-tight">
                  COMMAND CENTER ACTIVE
                </span>
                <span className="text-[9px] text-cyan-400 font-mono tracking-widest leading-none">
                  SECURE CIPHER VAULT // {userDragonId}
                </span>
              </div>
            </div>
          </div>

          {/* Profile & Controls */}
          <div className="flex items-center gap-3">
            {/* Replay Cinematic Intro Action */}
            <button
              onClick={() => {
                soundFx.playClick();
                router.push("/welcome");
              }}
              title="Replay Cinematic Intro"
              className="p-2 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="size-4 text-cyan-400" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-[#03091D] border border-amber-400/50 hover:border-amber-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                <div className={`relative w-8 h-8 rounded-xl overflow-hidden border ${activeAvatar.borderClass}`}>
                  <Image src={activeAvatar.imageSrc} alt="Avatar" fill className="object-cover" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white font-mono leading-none truncate max-w-[120px]">
                    @{userGamerTag}
                  </div>
                  <div className="text-[9px] text-amber-300 font-mono font-bold leading-tight">
                    {userRole}
                  </div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#03091D] border-2 border-amber-500/40 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 font-mono">
                  <div className="p-2 border-b border-white/10 space-y-1">
                    <div className="text-xs font-bold text-white truncate">{userName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{userEmail}</div>
                    <div className="text-[10px] text-amber-300 font-bold">{userDragonId}</div>
                  </div>

                  <button
                    onClick={() => {
                      setShowIdentityModal(true);
                      setShowUserDropdown(false);
                      soundFx.playClick();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-500/10 font-bold transition-colors cursor-pointer"
                  >
                    <Crown className="size-4 text-amber-400" />
                    <span>Customize Dragon ID</span>
                  </button>

                  <a
                    href="/api/auth/sso/launch"
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-purple-300 hover:bg-purple-500/10 font-bold transition-colors cursor-pointer"
                  >
                    <Gamepad2 className="size-4 text-purple-400" />
                    <span>Launch Web Games</span>
                  </a>

                  <Link
                    href="/"
                    onClick={() => {
                      setShowUserDropdown(false);
                      soundFx.playClick();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-cyan-300 hover:bg-cyan-500/10 font-bold transition-colors"
                  >
                    <Globe className="size-4 text-cyan-400" />
                    <span>Visit Public Website</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 font-bold transition-colors border-t border-white/10 mt-1 cursor-pointer"
                  >
                    <LogOut className="size-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PRIMARY VIEW CONTAINER (ALWAYS SHOWS DRAGON ID & KEY IN FRONT)      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 space-y-10 max-w-[1500px] mx-auto w-full pb-28 lg:pb-16 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {/* TAB 1: COMMAND CENTER (GRAND OVERVIEW) */}
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-in fade-in duration-200">
              {/* 1. HERO COMMAND CENTER: PROMINENT DRAGON ID & PASS KEY IN FRONT */}
              <DragonHeroCommandCenter
                displayName={userName}
                gamerTag={userGamerTag}
                primaryTitle={userTitle}
                avatarSrc={activeAvatar.imageSrc}
                bannerTag={activeBanner.tag}
                dragonId={userDragonId}
                dragonKey={userDragonKey}
                userRole={userRole}
                securityScore={userSecurityScore}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenIdentityModal={() => setShowIdentityModal(true)}
              />

              {/* 2. EXECUTIVE SECURITY & SECOND PORTAL MATRIX */}
              <DragonExecutiveMatrix
                dragonId={userDragonId}
                dragonKey={userDragonKey}
                securityScore={userSecurityScore}
                gamerTag={userGamerTag}
                userRole={userRole}
                ticketCount={userTickets.length}
                onOpenIdentity={() => setShowIdentityModal(true)}
                onOpenSupport={() => setActiveTab("support")}
              />

              {/* 3. FULL DRAGON IDENTITY PASS & PUBLIC SCANNER CARD */}
              {profileData && (
                <DragonIdentityCard
                  user={profileData}
                  onEdit={() => setShowIdentityModal(true)}
                />
              )}
            </div>
          )}

          {/* TAB 2: DRAGON ID VAULT */}
          {activeTab === "identity" && profileData && (
            <div className="animate-in fade-in duration-200">
              <DragonIdentityCard
                user={profileData}
                onEdit={() => setShowIdentityModal(true)}
              />
            </div>
          )}

          {/* TAB 3: COMMUNITY & FORUMS HUB */}
          {activeTab === "community" && (
            <div className="animate-in fade-in duration-200">
              <DragonCommunityHub currentUser={profileData} />
            </div>
          )}

          {/* TAB 4: SUPPORT / PLAYER SIGNALS */}
          {activeTab === "support" && (
            <div className="animate-in fade-in duration-200">
              <DragonSignalCenter
                userEmail={userEmail}
                userName={userName}
                tickets={userTickets}
                onRefreshTickets={fetchProfile}
              />
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* IDENTITY EDIT MODAL                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <PlayerIdentitySetupModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        initialName={userName}
        initialGamerTag={userGamerTag}
        initialTitle={userTitle}
        initialAvatar={profileData?.avatar || "obsidian-lightning-dragon"}
        initialBanner={profileData?.bannerTheme || "lightning-cyan"}
        onSaved={() => {
          fetchProfile();
          setShowIdentityModal(false);
        }}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#02040A] text-cyan-400 font-mono">
          LOADING DRAGON COMMAND CENTER...
        </div>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}
