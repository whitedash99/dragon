"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Gamepad2,
  Newspaper,
  Users,
  Film,
  BarChart3,
  Calendar,
  Briefcase,
  UserCheck,
  Settings,
  ShieldCheck,
  FileText,
  Palette,
  CreditCard,
  Layers,
  Database,
  Search,
  Moon,
  Sun,
  Maximize2,
  Bell,
  Mail,
  Plus,
  Play,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  User,
  Sparkles,
  Crown,
  Flame,
  Zap,
  Compass,
  CheckCircle2,
  Clock,
  Radio,
  Share2,
  Lock,
  Headphones,
  Sliders,
  DollarSign,
  Download,
  Gift,
  Target,
  Edit3,
  Save,
  RefreshCw,
  ImageIcon,
  MessageSquare,
  Globe,
  LogOut,
  Send,
  Check,
  Menu,
  X,
  Grid,
  ChevronUp,
  PieChart
} from "lucide-react";
import { DragonLogo, DragonLogoIcon } from "@/components/ui/dragon-logo";
import { WelcomeCinematicModal } from "@/components/cinematic/WelcomeCinematicModal";
import {
  PlayerIdentitySetupModal,
  GOD_LEVEL_BANNERS,
  GOD_LEVEL_AVATARS
} from "@/components/dashboard/PlayerIdentitySetupModal";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon, XIcon } from "@/components/ui/social-icons";
import { Instagram, Youtube } from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  gamerTag?: string;
  primaryTitle?: string;
  bannerTheme?: string;
  bannerUrl?: string;
  avatar?: string;
  image?: string;
  bio?: string;
}

interface SupportTicket {
  id: string;
  ticketNumber?: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
}

const BANNER_PRESETS = GOD_LEVEL_BANNERS;

const GAMER_TITLES = [
  "Dragon Slayer",
  "Valyrian Knight",
  "Cyber Mercenary",
  "Void Walker",
  "Grandmaster Strategist",
  "Founding Pioneer",
  "Apex Legend",
];

const DRAGON_STUDIOS_TITLES = [
  {
    id: "dragon-slayer-3d",
    slug: "dragon-slayer-3d",
    title: "Dragon Slayer 3D: Realm of Fire",
    dimension: "3D",
    genre: "3D Action RPG • Open World",
    status: "Live Released",
    version: "v1.2.4 Live",
    playersCount: "PC (.exe) & Android (.apk)",
    engine: "Dragon 3D Engine",
    features: "Dynamic Combat • PC .exe & Mobile .apk",
    size: "650 MB (PC) • 120 MB (APK)",
    pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D_Setup.exe",
    mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D.apk",
    coverColor: "from-red-700 via-[#1c080e] to-[#040814]",
    accentColor: "#ef4444",
    tag: "3D DRAGON GAME",
    icon: Flame,
  },
  {
    id: "cyber-drift-3d",
    slug: "cyber-drift-3d",
    title: "Cyber Drift 3D: Overdrive",
    dimension: "3D",
    genre: "3D Anti-Gravity Racing",
    status: "Live Released",
    version: "v1.1.0 Live",
    playersCount: "PC (.exe) & Android (.apk)",
    engine: "Dragon 3D Engine",
    features: "High Speed Tracks • 120 FPS",
    size: "480 MB (PC) • 95 MB (APK)",
    pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/CyberDrift3D_Setup.exe",
    mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/CyberDrift3D.apk",
    coverColor: "from-cyan-600 via-[#051428] to-[#040814]",
    accentColor: "#00f0ff",
    tag: "3D DRAGON GAME",
    icon: Zap,
  },
  {
    id: "shadow-ninja-2d",
    slug: "shadow-ninja-2d",
    title: "Shadow Ninja 2D",
    dimension: "2D",
    genre: "2D Action Platformer & Boss Battles",
    status: "Live Released",
    version: "v2.0.1 Live",
    playersCount: "PC (.exe) & Android (.apk)",
    engine: "Dragon 2D Engine",
    features: "Fast-Paced Slicing • Touch Controls",
    size: "240 MB (PC) • 65 MB (APK)",
    pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/ShadowNinja2D_Setup.exe",
    mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/ShadowNinja2D.apk",
    coverColor: "from-amber-600 via-[#201405] to-[#040814]",
    accentColor: "#f59e0b",
    tag: "2D DRAGON GAME",
    icon: Target,
  },
  {
    id: "dragon-kingdom-2d",
    slug: "dragon-kingdom-2d",
    title: "Dragon Kingdom Chronicles",
    dimension: "2D",
    genre: "2D Fantasy Strategy RPG",
    status: "Early Access",
    version: "v0.9.0 Beta",
    playersCount: "PC (.exe) & Android (.apk)",
    engine: "Dragon 2D Engine",
    features: "Castle Defense • Hero Collection",
    size: "310 MB (PC) • 80 MB (APK)",
    pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/DragonKingdom_Setup.exe",
    mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/DragonKingdom.apk",
    coverColor: "from-purple-600 via-[#120824] to-[#040814]",
    accentColor: "#a855f7",
    tag: "2D DRAGON GAME",
    icon: Compass,
  },
];

const STUDIO_DISPATCHES = [
  {
    id: "patch-094",
    title: "Embers of Valyria: Beta Patch v0.9.4 & High Drake Raid Released",
    date: "18 May 2026",
    category: "MAJOR UPDATE",
    excerpt: "New endgame raid dungeon, enhanced volumetric ray-traced lighting, and performance optimizations across all GPUs.",
    tag: "PATCH NOTES",
    author: "Dragon Studios Lead Dev",
  },
  {
    id: "neon-drift-tourney",
    title: "Neon Drift Global Alpha Racing Championship Announced",
    date: "14 May 2026",
    category: "COMMUNITY EVENT",
    excerpt: "Registration opens for pilots across all regions. Compete on Neo-Tokyo Mach 5 tracks with real-time telemetry.",
    tag: "SPEEDRUN",
    author: "Studio Director",
  },
  {
    id: "dragon-engine-54",
    title: "Dragon Engine 5.4 Deep Dive: Next-Gen Volumetric Physics",
    date: "08 May 2026",
    category: "ENGINE TECH",
    excerpt: "How our proprietary C++ core achieves real-time dynamic cloth destruction, sub-millisecond particle caching, and cross-platform sync.",
    tag: "TECH DISPATCH",
    author: "Engine Architect",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cachedStr = localStorage.getItem("dragon_user_cache");
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          if (cached && (cached.name || cached.gamerTag)) return cached;
        }
      } catch {}
    }
    return null;
  });

  const [userTickets, setUserTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState("This Month");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // In-App Notifications State
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("ALL");

  // New Support Ticket form state inside dashboard
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSending, setTicketSending] = useState(false);
  const [ticketSentSuccess, setTicketSentSuccess] = useState(false);

  // Profile Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(() => profileData?.name || "");
  const [editGamerTag, setEditGamerTag] = useState(() => profileData?.gamerTag || profileData?.name || "Player");
  const [editTitle, setEditTitle] = useState(() => profileData?.primaryTitle || "Dragon Slayer");
  const [selectedTheme, setSelectedTheme] = useState(() => profileData?.bannerTheme || "valyria-fire");
  const [customBannerUrl, setCustomBannerUrl] = useState(() => profileData?.bannerUrl || "");
  const [editBio, setEditBio] = useState(() => profileData?.bio || "");
  const [saving, setSaving] = useState(false);

  const [gamesList, setGamesList] = useState(DRAGON_STUDIOS_TITLES);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/user/notifications");
      const data = await res.json();
      if (data.success) {
        setNotificationsList(data.notifications || []);
        setUnreadNotificationsCount(data.unreadCount || 0);
        if (data.tickets && Array.isArray(data.tickets)) {
          setUserTickets(data.tickets);
        }
      }
    } catch (e) {
      console.warn("Fetch notifications error:", e);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setUnreadNotificationsCount(0);
      setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error("Mark read error:", e);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.user) {
        setProfileData(data.user);
        setEditName(data.user.name || "");
        setEditGamerTag(data.user.gamerTag || data.user.name || "Player");
        setEditTitle(data.user.primaryTitle || "Dragon Slayer");
        setSelectedTheme(data.user.bannerTheme || "valyria-fire");
        setCustomBannerUrl(data.user.bannerUrl || "");
        setEditBio(data.user.bio || "");

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("dragon_user_cache", JSON.stringify(data.user));
          } catch {}
        }
      }
      if (data.tickets && Array.isArray(data.tickets)) {
        setUserTickets(data.tickets);
      }
    } catch (e) {
      console.error("Fetch profile error", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveGames = async () => {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      if (data.success && Array.isArray(data.games) && data.games.length > 0) {
        setGamesList(
          data.games.map((g: any) => ({
            id: g.slug || g.id,
            slug: g.slug,
            title: g.name || g.title,
            dimension: g.dimension || "3D",
            genre: g.genre,
            status: g.status,
            version: "v1.0 Live",
            playersCount: "Active Players",
            engine: g.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine",
            features: g.description,
            size: `${g.pcFileSize || "650 MB"} (PC) • ${g.mobileFileSize || "120 MB"} (APK)`,
            coverUrl: g.coverUrl || g.bannerUrl,
            downloadUrl: `/games/${g.slug || "download"}`,
          }))
        );
      }
    } catch (e) {
      console.warn("Failed to fetch live games for dashboard:", e);
    }
  };

  useEffect(() => {
    // 0ms Instant Cache Load
    if (typeof window !== "undefined") {
      try {
        const cachedStr = localStorage.getItem("dragon_user_cache");
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          if (cached && (cached.name || cached.gamerTag)) {
            setProfileData(cached);
            setEditName(cached.name || "");
            setEditGamerTag(cached.gamerTag || cached.name || "Player");
            setSelectedTheme(cached.bannerTheme || "valyria-fire");
          }
        }
      } catch {}

      const isWelcomeParam = window.location.search.includes("welcome=true");
      if (isWelcomeParam) {
        setShowWelcomeModal(true);
      }
    }

    fetchProfile();
    fetchLiveGames();
    fetchNotifications();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    document.cookie = "dragon_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          gamerTag: editGamerTag,
          primaryTitle: editTitle,
          bannerTheme: selectedTheme,
          bannerUrl: customBannerUrl,
          bio: editBio,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditOpen(false);
        fetchProfile();
      }
    } catch (e) {
      console.error("Save profile error", e);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setTicketSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: profileData?.email || "player@dragongaming.com",
          category: "GENERAL",
          subject: ticketSubject.trim(),
          message: ticketMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketSentSuccess(true);
        setTicketSubject("");
        setTicketMessage("");
        fetchProfile();
        setTimeout(() => setTicketSentSuccess(false), 5000);
      }
    } catch (e) {
      console.error("Create ticket error", e);
    } finally {
      setTicketSending(false);
    }
  };

  const userName = profileData?.name || editName || "Player";
  const userTag = profileData?.gamerTag || editGamerTag || "DragonWarrior";
  const userRole = profileData?.role || "Supreme Owner";
  const activePreset = BANNER_PRESETS.find((p) => p.id === (profileData?.bannerTheme || selectedTheme)) || BANNER_PRESETS[0];

  const leftNavCategories = [
    {
      title: "MAIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "notifications", label: "Notifications & Inbox", icon: Bell },
        { id: "games", label: "Games Library", icon: Gamepad2 },
        { id: "news", label: "News & Dispatches", icon: Newspaper },
        { id: "community", label: "Community & Forums", icon: Users },
        { id: "media", label: "Media & Wallpapers", icon: Film },
      ],
    },
    {
      title: "ACCOUNT & SETTINGS",
      items: [
        { id: "settings", label: "Account Settings", icon: Settings },
        { id: "support", label: "Support & Helpdesk", icon: Headphones },
      ],
    },
  ];

  const activeBanner = GOD_LEVEL_BANNERS.find((b) => b.id === (profileData?.bannerTheme || selectedTheme)) || GOD_LEVEL_BANNERS[0];
  const activeAvatar = GOD_LEVEL_AVATARS.find((a) => a.imageSrc === profileData?.avatar || a.imageSrc === profileData?.image || a.id === profileData?.avatar) || GOD_LEVEL_AVATARS[0];

  return (
    <div className="min-h-screen bg-[#02050E] text-slate-100 font-sans flex overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      
      {/* 3D Welcome Cinematic Modal (Plays Once) */}
      <WelcomeCinematicModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", "/dashboard");
          }
        }}
        userName={userName}
        userEmail={profileData?.email}
      />

      {/* God-Level Player Identity Setup Modal (Gold & Diamond Banners & Avatars) */}
      <PlayerIdentitySetupModal
        isOpen={isEditOpen || showIdentityModal}
        onClose={() => {
          setIsEditOpen(false);
          setShowIdentityModal(false);
        }}
        initialName={userName}
        initialGamerTag={userTag}
        initialTitle={profileData?.primaryTitle || editTitle}
        initialBanner={profileData?.bannerTheme || selectedTheme}
        initialBio={profileData?.bio || editBio}
        onSaved={(updated) => {
          setProfileData((prev: any) => ({ ...prev, ...updated }));
          if (updated.name) setEditName(updated.name);
          if (updated.gamerTag) setEditGamerTag(updated.gamerTag);
          if (updated.primaryTitle) setEditTitle(updated.primaryTitle);
          if (updated.bannerTheme) setSelectedTheme(updated.bannerTheme);
          if (updated.bio) setEditBio(updated.bio);
          fetchProfile();
        }}
      />

      {/* ========================================================================= */}
      {/* 1. LEFT SIDE PANEL (COMPACT ROCKSTAR/EPIC GAMES STYLE LAUNCHER SIDEBAR)    */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-[#030816] border-r border-cyan-500/20 flex flex-col justify-start shrink-0 hidden lg:flex select-none z-30 h-screen sticky top-0 overflow-y-auto">
        <div className="p-5 space-y-5">
          {/* Logo Brand Header */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex flex-col text-left cursor-pointer group px-1 py-1"
          >
            <span className="font-heading font-black tracking-widest text-white text-xl uppercase leading-none group-hover:text-cyan-400 transition-colors">
              DRAGON
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-[0.25em] leading-none mt-1">
              STUDIOS
            </span>
          </button>

          {/* Navigation Menu */}
          <nav className="space-y-4">
            {leftNavCategories.map((category, catIdx) => (
              <div key={catIdx} className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 px-3 block">
                  {category.title}
                </span>
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        soundFx.playClick();
                      }}
                      className={`w-full group flex items-center justify-between p-2.5 rounded-2xl font-mono text-xs transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/25 font-bold"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-black/25 text-black"
                            : "bg-[#030818] border border-cyan-500/25 text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400"
                        }`}>
                          <Icon className="size-4.5 shrink-0" />
                        </div>
                        <span className="font-heading tracking-wide uppercase text-[11px]">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="size-4 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Compact User Pill Attached Below Navigation (No Empty Gap) */}
          <div className="pt-3 border-t border-cyan-500/20">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-[#060D22] border border-cyan-500/20">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="size-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white text-xs font-heading">
                    {userName[0].toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate font-heading">
                    {userName}
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400 truncate">
                    @{userTag}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                title="Sign Out of Dragon Studios"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT PANEL (DISPLAYS ACTIVE TAB VIEW SEAMLESSLY)                */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP COMPACT HEADER BAR */}
        <header className="sticky top-0 z-20 w-full px-4 sm:px-8 py-3 bg-[#02050E]/90 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 w-full max-w-xl">
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#060D22] text-slate-300 hover:text-white"
            >
              <Menu className="size-5" />
            </button>

            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, dispatches, telemetry..."
                className="w-full pl-11 pr-14 py-2 rounded-2xl bg-[#060D22] border border-cyan-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
              />
              <kbd className="absolute right-3.5 top-2 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-slate-400">
                Ctrl /
              </kbd>
            </div>

            {/* Right Actions & User Executive Menu */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto relative">
              {/* Notification Bell Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotificationDropdown(!showNotificationDropdown);
                    setShowUserDropdown(false);
                    fetchNotifications();
                  }}
                  className="relative p-2 sm:p-2 rounded-2xl bg-[#060D22] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
                  title="In-App Notifications & Support Replies"
                >
                  <Bell className="size-4 text-cyan-400" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-cyan-400 text-black text-[9px] font-mono font-black flex items-center justify-center animate-pulse shadow-[0_0_10px_#00f0ff]">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotificationDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#03091D] border border-cyan-500/30 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-100">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="size-4 text-cyan-400" />
                        <span className="font-heading font-black text-xs uppercase tracking-wider text-white">
                          NOTIFICATIONS ({notificationsList.length})
                        </span>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 underline"
                        >
                          Mark All Read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                      {notificationsList.length === 0 ? (
                        <div className="text-center py-8 text-xs font-mono text-slate-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notificationsList.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                              n.isRead
                                ? "bg-[#02050E]/60 border-white/5 text-slate-400"
                                : "bg-cyan-500/10 border-cyan-500/30 text-white shadow-sm"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider">
                                {n.type || "NOTIFICATION"}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="text-xs font-heading font-bold uppercase text-white leading-snug">
                              {n.title}
                            </h4>
                            <p className="text-[11px] font-sans text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/10 text-center">
                      <button
                        onClick={() => {
                          setActiveTab("notifications");
                          setShowNotificationDropdown(false);
                        }}
                        className="text-xs font-mono font-bold text-cyan-400 hover:text-white uppercase tracking-wider"
                      >
                        VIEW FULL NOTIFICATIONS & INBOX →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsEditOpen(true)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black text-xs font-mono font-black uppercase flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Edit3 className="size-3.5" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>

              {/* User Dropdown Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 pr-2 sm:pr-3 rounded-2xl bg-[#060D22] border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer"
                >
                  <div className={`relative size-7 rounded-xl overflow-hidden border ${activeAvatar.borderClass}`}>
                    <Image
                      src={activeAvatar.imageSrc}
                      alt={userName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {userName}
                  </span>
                  <ChevronDown className="size-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#03091D] border border-cyan-500/30 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 text-xs font-mono">
                      <div className="text-white font-bold truncate">{userName}</div>
                      <div className="text-[10px] text-cyan-400 truncate">@{userTag}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsEditOpen(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 text-xs font-mono transition-colors"
                    >
                      <User className="size-4 text-cyan-400" />
                      <span>Edit DragonID Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("settings");
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 text-xs font-mono transition-colors"
                    >
                      <Settings className="size-4 text-cyan-400" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-mono font-bold transition-colors border-t border-white/10 mt-1"
                    >
                      <LogOut className="size-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Views inside the Dashboard */}
        <main className="p-3.5 sm:p-6 lg:p-10 pb-28 lg:pb-10 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto w-full">
          
          {/* ========================================================================= */}
          {/* VIEW 1: DASHBOARD (HOME)                                                  */}
          {/* ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Full-Width Hero Banner */}
              <section className="w-full">
                
                {/* 3D Holographic DragonID Card Showcase (Full Width AAA Banner) */}
                <div className={`w-full rounded-3xl ${activeBanner.bgClass} p-6 sm:p-8 border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(0,240,255,0.25)] relative overflow-hidden flex flex-col justify-between text-white transition-all`}>
                  <div className="absolute -right-6 -bottom-6 w-64 h-64 opacity-15 pointer-events-none">
                    <DragonLogoIcon size="xl" className="w-full h-full text-white" />
                  </div>

                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Avatar with Glow */}
                      <div className={`relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 ${activeAvatar.borderClass} shadow-2xl shrink-0`}>
                        <Image
                          src={activeAvatar.imageSrc}
                          alt={userName}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute bottom-1 right-1 size-3.5 rounded-full bg-cyan-400 border-2 border-black animate-pulse" />
                      </div>

                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-cyan-400/40 text-[10px] font-mono font-black uppercase text-cyan-300">
                          <activeBanner.icon className="size-3 text-cyan-400" />
                          <span>{activeBanner.tag}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black uppercase text-white font-heading tracking-tight drop-shadow-md">
                          {userName}
                        </h1>
                        <p className="text-xs font-mono text-cyan-200">
                          @{userTag} • <span className="text-emerald-300 font-bold">VIP APEX OPERATIVE</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-black/60 hover:bg-black/80 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
                    >
                      <Edit3 className="size-3.5" />
                      <span>EDIT DRAGONID</span>
                    </button>
                  </div>

                  <div className="pt-6 relative z-10 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setActiveTab("games");
                        soundFx.playClick();
                      }}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all cursor-pointer"
                    >
                      <Gamepad2 className="size-4 stroke-[2.5]" />
                      <span>EXPLORE GAMES</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("games");
                        soundFx.playClick();
                      }}
                      className="px-5 py-3 rounded-xl bg-black/60 hover:bg-black/90 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
                    >
                      <Download className="size-4" />
                      <span>DOWNLOAD CLIENT</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Games Showcase Grid */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Gamepad2 className="size-5 text-cyan-400" />
                    <h2 className="text-lg font-black uppercase text-white font-heading tracking-wider">
                      DRAGON STUDIOS FLAGSHIP GAME LIBRARY
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("games")}
                    className="text-xs font-mono text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    View all games →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {DRAGON_STUDIOS_TITLES.map((game) => {
                    const Icon = game.icon;
                    return (
                      <div
                        key={game.id}
                        className="rounded-3xl bg-[#040A18]/95 border-2 border-white/10 p-6 space-y-5 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:border-cyan-400/60 transition-all"
                      >
                        <div className={`h-40 rounded-2xl bg-gradient-to-tr ${game.coverColor} p-5 flex flex-col justify-between relative overflow-hidden shadow-inner border border-white/10`}>
                          <div className="absolute inset-0 bg-black/25" />
                          <div className="relative z-10 flex justify-between items-start">
                            <span className="px-3 py-1 rounded-xl bg-black/70 text-cyan-300 font-mono text-[10px] font-black uppercase tracking-wider border border-cyan-500/30 backdrop-blur-md">
                              {game.tag}
                            </span>
                            <div className="p-2 rounded-xl bg-black/60 border border-white/10 text-white">
                              <Icon className="size-4" style={{ color: game.accentColor }} />
                            </div>
                          </div>

                          <div className="relative z-10 space-y-0.5">
                            <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase tracking-wider">
                              {game.status} • {game.version}
                            </span>
                            <h3 className="text-lg font-black text-white font-heading uppercase tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                              {game.title}
                            </h3>
                          </div>
                        </div>

                        <div className="space-y-2 font-mono text-xs">
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>Engine:</span>
                            <span className="text-cyan-400 font-bold">{game.engine}</span>
                          </div>
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>Active Telemetry:</span>
                            <span className="text-white font-bold">{game.playersCount}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <Link
                            href={`/games/${game.slug}`}
                            className="py-2.5 rounded-xl bg-[#081226] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold text-center transition-all"
                          >
                            DETAILS
                          </Link>
                          <Link
                            href="/downloads"
                            className="py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs font-mono uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all"
                          >
                            <Play className="size-3.5 fill-black" />
                            <span>LAUNCH →</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: NOTIFICATIONS & SUPPORT INBOX                                       */}
          {/* ========================================================================= */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <Bell className="size-4 animate-pulse" />
                    <span>IN-APP NOTIFICATIONS & SUPPORT TICKETS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-heading">
                    NOTIFICATIONS & MESSAGES DISPATCH
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Real-time track responses from Dragon Studios Admin Support. Emails and in-app alerts sync live.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Mark All Read
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab("support")}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-mono font-black text-xs uppercase shadow-lg shadow-cyan-500/25 cursor-pointer"
                  >
                    + Submit Support Ticket
                  </button>
                </div>
              </div>

              {/* Notification Filters */}
              <div className="flex flex-wrap gap-2">
                {["ALL", "UNREAD", "TICKETS", "SYSTEM"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setNotificationFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      notificationFilter === f
                        ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                        : "bg-[#040D24] border border-cyan-500/20 text-slate-300 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Notification & Ticket Messages Grid */}
              <div className="space-y-4">
                {notificationsList.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-[#040A18] border border-cyan-500/20 text-center space-y-3">
                    <Bell className="size-8 text-cyan-400/50 mx-auto" />
                    <h3 className="text-lg font-bold text-white font-heading uppercase">No Notifications Found</h3>
                    <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
                      You're all caught up! When you submit support tickets or when Dragon Studios staff responds to your inquiries, notifications will appear here live.
                    </p>
                  </div>
                ) : (
                  notificationsList
                    .filter((n) => {
                      if (notificationFilter === "UNREAD") return !n.isRead;
                      if (notificationFilter === "TICKETS") return n.type === "TICKET_CREATED" || n.type === "SUPPORT_REPLY";
                      if (notificationFilter === "SYSTEM") return n.type !== "TICKET_CREATED" && n.type !== "SUPPORT_REPLY";
                      return true;
                    })
                    .map((n) => (
                      <div
                        key={n.id}
                        className={`p-6 rounded-3xl border transition-all space-y-3 relative overflow-hidden ${
                          n.isRead
                            ? "bg-[#040A18]/80 border-white/10 text-slate-300"
                            : "bg-[#061430]/90 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.2)] text-white"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full bg-black/60 border border-cyan-400/40 text-[10px] font-mono font-black uppercase text-cyan-300">
                              {n.type || "ALERT"}
                            </span>
                            {n.ticketId && (
                              <span className="text-xs font-mono font-bold text-cyan-400">
                                [{n.ticketId}]
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-slate-400">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <h3 className="text-lg font-black uppercase font-heading text-white">
                          {n.title}
                        </h3>

                        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-sm font-sans leading-relaxed text-slate-200 whitespace-pre-wrap">
                          {n.message}
                        </div>

                        {n.ticketId && (
                          <div className="flex justify-end pt-1">
                            <Link
                              href={`/support/${n.ticketId}`}
                              className="text-xs font-mono font-bold text-cyan-400 hover:text-white uppercase flex items-center gap-1"
                            >
                              <span>View Full Support Ticket Thread →</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: GAMES LIBRARY (3D & 2D DRAGON GAMES)                              */}
          {/* ========================================================================= */}
          {activeTab === "games" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase text-white font-heading">
                    DRAGON STUDIOS GAMES CATALOG
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Original 3D & 2D games created by Dragon Studios. Direct PC (.exe) & Android (.apk) downloads.
                  </p>
                </div>
                <Link
                  href="/downloads"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-bold font-mono text-xs uppercase w-max"
                >
                  Download Master Launcher
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gamesList.map((g) => (
                  <div key={g.id} className="rounded-3xl bg-[#040A18] border border-cyan-500/30 p-6 space-y-4 shadow-xl flex flex-col justify-between">
                    <div className={`h-44 rounded-2xl bg-gradient-to-tr ${g.coverColor} p-5 flex flex-col justify-between border border-white/10 relative overflow-hidden`}>
                      <div className="flex justify-between items-start">
                        <span className={`px-3 py-1 rounded-xl font-mono text-[10px] font-bold uppercase w-max border ${
                          g.dimension === "2D" ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        }`}>
                          {g.tag}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-black/70 text-cyan-300 text-[10px] font-mono font-bold">
                          {g.engine}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-400 font-mono font-bold block">{g.version} • {g.status}</span>
                        <h3 className="text-xl font-black text-white font-heading uppercase">{g.title}</h3>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs font-mono text-slate-300">
                      <div className="flex justify-between"><span>Genre:</span><span className="text-white font-bold">{g.genre}</span></div>
                      <div className="flex justify-between"><span>Active Community:</span><span className="text-cyan-400 font-bold">{g.playersCount}</span></div>
                      <div className="flex justify-between"><span>File Sizes:</span><span className="text-white font-bold">{g.size}</span></div>
                      <div className="flex justify-between"><span>Features:</span><span className="text-emerald-400 font-bold">{g.features}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <a
                        href={g.pcExeUrl}
                        download
                        className="py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Download className="size-3.5" />
                        <span>PC (.EXE)</span>
                      </a>
                      <a
                        href={g.mobileApkUrl}
                        download
                        className="py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Download className="size-3.5" />
                        <span>MOBILE (.APK)</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: NEWS & DEVELOPER DISPATCHES                                       */}
          {/* ========================================================================= */}
          {activeTab === "news" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase text-white font-heading">
                  OFFICIAL DEVELOPER DISPATCHES & PATCH LOGS
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Direct announcements from the Dragon Studios development team.
                </p>
              </div>

              <div className="space-y-4">
                {STUDIO_DISPATCHES.map((news) => (
                  <div key={news.id} className="p-6 rounded-3xl bg-[#040A18] border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">
                        {news.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{news.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-heading">{news.title}</h3>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{news.excerpt}</p>
                    <div className="flex justify-between items-center pt-2 font-mono text-xs text-slate-400 border-t border-white/5">
                      <span>Author: {news.author}</span>
                      <span className="text-cyan-400 font-bold">Read Full Dispatch →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: COMMUNITY & FORUMS                                                */}
          {/* ========================================================================= */}
          {activeTab === "community" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase text-white font-heading">
                  DRAGON STUDIOS COMMUNITY & FORUM REALMS
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Join discussions, post strategies, find squad members, and follow official transmissions.
                </p>
              </div>

              {/* Verified Official Broadcast Channels */}
              <div className="p-6 rounded-3xl bg-[#030816] border border-cyan-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="size-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      OFFICIAL STUDIO CHANNELS & BROADCASTS
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                    ● 100% VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <a
                    href={OFFICIAL_SOCIALS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#061026] border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/15 transition-all text-center space-y-2 group shadow-md"
                  >
                    <WhatsAppIcon className="size-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono font-bold text-white block">WhatsApp</span>
                    <span className="text-[9px] font-mono text-emerald-400">Channel →</span>
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.threads.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#061026] border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/15 transition-all text-center space-y-2 group shadow-md"
                  >
                    <ThreadsIcon className="size-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono font-bold text-white block">Threads</span>
                    <span className="text-[9px] font-mono text-cyan-400">Feed →</span>
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#061026] border border-pink-500/30 hover:border-pink-400 hover:bg-pink-500/15 transition-all text-center space-y-2 group shadow-md"
                  >
                    <Instagram className="size-6 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono font-bold text-white block">Instagram</span>
                    <span className="text-[9px] font-mono text-pink-400">Verified →</span>
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.youtube.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#061026] border border-red-500/30 hover:border-red-400 hover:bg-red-500/15 transition-all text-center space-y-2 group shadow-md"
                  >
                    <Youtube className="size-6 text-red-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono font-bold text-white block">YouTube</span>
                    <span className="text-[9px] font-mono text-red-400">Trailers →</span>
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.x.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#061026] border border-slate-500/30 hover:border-white hover:bg-white/10 transition-all text-center space-y-2 group shadow-md"
                  >
                    <XIcon className="size-6 text-white group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono font-bold text-white block">X (Twitter)</span>
                    <span className="text-[9px] font-mono text-slate-300">Dispatches →</span>
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.reddit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#061026] border border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/15 transition-all text-center space-y-2 group shadow-md"
                  >
                    <MessageSquare className="size-6 text-orange-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono font-bold text-white block">Reddit Hub</span>
                    <span className="text-[9px] font-mono text-orange-400">Community →</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Official Announcements", desc: "Studio updates & maintenance notices", posts: "420 Topics", icon: Bell },
                  { name: "Embers of Valyria Realm", desc: "Builds, raids, dragon taming guides", posts: "1,840 Topics", icon: Flame },
                  { name: "Neon Drift Racing Club", desc: "Track records, vehicle tuning, tournaments", posts: "950 Topics", icon: Zap },
                  { name: "Aetheria Sci-Fi Exploration", desc: "Galaxy discoveries, ships, lore", posts: "620 Topics", icon: Compass },
                  { name: "Looking For Group (LFG)", desc: "Squad recruitment & clan coordination", posts: "3,410 Topics", icon: Users },
                  { name: "Creator & Media Showcase", desc: "Fan art, video montages, streams", posts: "1,120 Topics", icon: Film },
                ].map((c, idx) => {
                  const Icon = c.icon;
                  return (
                    <div key={idx} className="p-6 rounded-3xl bg-[#040A18] border border-cyan-500/20 hover:border-cyan-400/60 transition-all space-y-3 cursor-pointer">
                      <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 w-max">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="text-base font-bold text-white font-heading">{c.name}</h3>
                      <p className="text-xs text-slate-400 font-sans">{c.desc}</p>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block pt-2">{c.posts}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: MEDIA & WALLPAPERS                                                */}
          {/* ========================================================================= */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase text-white font-heading">
                  OFFICIAL 4K WALLPAPERS & MEDIA ASSETS
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Download high-resolution wallpapers, trailers, and concept art.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {BANNER_PRESETS.map((bp) => (
                  <div key={bp.id} className="rounded-3xl bg-[#040A18] border border-cyan-500/20 overflow-hidden shadow-xl space-y-3 p-4">
                    <div className={`h-48 rounded-2xl ${bp.bgClass} flex items-center justify-center shadow-inner relative`}>
                      <span className="text-white font-heading font-black text-lg uppercase tracking-wider drop-shadow-md">
                        {bp.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-xs font-mono text-slate-300 font-bold">{bp.tag}</span>
                      <button
                        onClick={() => {
                          setSelectedTheme(bp.id);
                          setCustomBannerUrl("");
                          setIsEditOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500 hover:text-black transition-all cursor-pointer"
                      >
                        Set as Banner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: ACCOUNT SETTINGS & PROFILE CUSTOMIZER                             */}
          {/* ========================================================================= */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase text-white font-heading">
                  ACCOUNT PREFERENCES & IDENTITY
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Manage your display name, GamerTag handle, gamer title, and bio.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">DISPLAY NAME</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl bg-[#040A18] px-4 py-3 text-white border border-slate-700 focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">GAMERTAG HANDLE (@)</label>
                  <input
                    type="text"
                    required
                    value={editGamerTag}
                    onChange={(e) => setEditGamerTag(e.target.value)}
                    className="w-full rounded-xl bg-[#040A18] px-4 py-3 text-cyan-300 border border-slate-700 focus:border-cyan-400 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">PRIMARY TITLE</label>
                  <select
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl bg-[#040A18] px-4 py-3 text-amber-300 border border-slate-700 focus:border-cyan-400 font-bold"
                  >
                    {GAMER_TITLES.map((t) => (
                      <option key={t} value={t} className="bg-[#070E1E] text-white">{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">BIO / PLAYER MOTTO</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell other players about your gaming style..."
                    className="w-full rounded-xl bg-[#040A18] px-4 py-3 text-white border border-slate-700 focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
                >
                  {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                  <span>SAVE PREFERENCES</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 7: SUPPORT & HELPDESK TERMINAL                                       */}
          {/* ========================================================================= */}
          {activeTab === "support" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase text-white font-heading">
                  DRAGON STUDIOS HELPDESK & SUPPORT TERMINAL
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Submit inquiries, report technical bugs, or request assistance directly.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Submit New Ticket */}
                <div className="lg:col-span-6 rounded-3xl bg-[#040A18] border border-cyan-500/30 p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white font-heading uppercase">
                    Submit New Support Ticket
                  </h3>

                  {ticketSentSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                      <Check className="size-4" />
                      <span>Ticket submitted successfully! Assigned to our engineer.</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateTicket} className="space-y-4 font-mono text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold uppercase text-[10px]">SUBJECT / ISSUE</label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="e.g., Question regarding Valyria Beta Key"
                        className="w-full rounded-xl bg-[#060D22] px-4 py-3 text-white border border-slate-700 focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold uppercase text-[10px]">DETAILED DESCRIPTION</label>
                      <textarea
                        rows={4}
                        required
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="Describe what happened, error codes, or what assistance you need..."
                        className="w-full rounded-xl bg-[#060D22] px-4 py-3 text-white border border-slate-700 focus:border-cyan-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={ticketSending}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2"
                    >
                      {ticketSending ? <RefreshCw className="size-4 animate-spin" /> : <Send className="size-4" />}
                      <span>SEND SUPPORT INQUIRY</span>
                    </button>
                  </form>
                </div>

                {/* My Active Tickets */}
                <div className="lg:col-span-6 rounded-3xl bg-[#040A18] border border-cyan-500/30 p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white font-heading uppercase">
                    My Active Tickets ({userTickets.length})
                  </h3>

                  <div className="space-y-3 font-mono text-xs">
                    {userTickets.length > 0 ? (
                      userTickets.map((t) => (
                        <div key={t.id} className="p-3.5 rounded-2xl bg-[#060D22] border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-white font-bold block">{t.subject}</span>
                            <span className="text-[10px] text-slate-400">
                              Ticket #{t.ticketNumber || t.id.slice(0, 8)} • {new Date(t.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase">
                            {t.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs text-center py-6">No previous tickets. You have clean standing!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>



      {/* ========================================================================= */}
      {/* 3. GOD-LEVEL MOBILE FLOATING BOTTOM DOCK (< LG SCREENS)                    */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#030716]/98 border-t border-purple-500/30 backdrop-blur-2xl px-3 py-2 shadow-[0_-15px_40px_rgba(0,0,0,0.95)] flex items-center justify-around select-none">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("dashboard");
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "dashboard" && !isMobileDrawerOpen ? "text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === "dashboard" && !isMobileDrawerOpen ? "bg-purple-600/25 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
          }`}>
            <LayoutDashboard className="size-4" />
          </div>
          <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tight">DASHBOARD</span>
        </button>

        {/* Tab 2: Games */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("games");
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "games" && !isMobileDrawerOpen ? "text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === "games" && !isMobileDrawerOpen ? "bg-purple-600/25 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
          }`}>
            <Gamepad2 className="size-4" />
          </div>
          <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tight">GAMES</span>
        </button>

        {/* CENTER ELEVATED DRAGON CREST BUTTON */}
        <div className="-mt-8">
          <button
            type="button"
            onClick={() => setShowWelcomeModal(true)}
            className="size-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-1 shadow-[0_0_30px_rgba(168,85,247,0.8)] active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
            title="Launch 3D Cinematic Showcase"
          >
            <div className="size-full rounded-full bg-[#030612] flex items-center justify-center border border-purple-400/60">
              <DragonLogoIcon size="sm" className="border-none drop-shadow-[0_0_8px_#a855f7]" />
            </div>
          </button>
        </div>

        {/* Tab 4: Telemetry / Analytics */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("telemetry");
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "telemetry" && !isMobileDrawerOpen ? "text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === "telemetry" && !isMobileDrawerOpen ? "bg-purple-600/25 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
          }`}>
            <PieChart className="size-4" />
          </div>
          <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tight">ANALYTICS</span>
        </button>

        {/* Tab 5: Menu / All 12 Tabs */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            isMobileDrawerOpen ? "text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            isMobileDrawerOpen ? "bg-purple-600/25 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
          }`}>
            <Grid className="size-4" />
          </div>
          <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tight">MENU</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. GOD-LEVEL MOBILE 12-TAB SLIDE-UP COMMAND CENTER DRAWER (< LG SCREENS)    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#02050E]/85 backdrop-blur-xl lg:hidden"
              onClick={() => setIsMobileDrawerOpen(false)}
            />

            {/* Slide-Up Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] border-t border-cyan-500/40 bg-gradient-to-b from-[#060D22] via-[#030715] to-[#02040A] p-5 pb-8 max-h-[88vh] overflow-y-auto shadow-[0_0_80px_rgba(0,240,255,0.3)] lg:hidden select-none space-y-5"
            >
              {/* Drawer Pull Notch & Header */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-1.5 rounded-full bg-cyan-500/40" />
                <div className="w-full flex items-center justify-between pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2.5">
                    <DragonLogoIcon size="xs" className="border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                    <div>
                      <span className="font-heading font-black text-sm uppercase tracking-wider text-white block">
                        DRAGON COMMAND DECK
                      </span>
                      <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                        12 OPERATIONAL MODULES
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-xl bg-[#07132B] border border-cyan-500/30 text-slate-300 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* User Profile Card inside Drawer */}
              <div className="p-3.5 rounded-2xl bg-[#07132B]/90 border border-cyan-500/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center font-bold text-white text-sm font-heading">
                    {userName[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate font-heading">
                      {userName}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 truncate">
                      @{userTag} • {userRole.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setIsEditOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold uppercase"
                >
                  Edit
                </button>
              </div>

              {/* 12 Tab Categories */}
              <div className="space-y-4">
                {leftNavCategories.map((category, catIdx) => (
                  <div key={catIdx} className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-2 block">
                      {category.title}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileDrawerOpen(false);
                            }}
                            className={`flex items-center justify-between p-3 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/30"
                                : "bg-[#050D20]/70 border border-cyan-500/20 text-slate-300 hover:text-white hover:bg-cyan-950/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="size-4" />
                              <span>{item.label}</span>
                            </div>
                            {isActive ? (
                              <CheckCircle2 className="size-4 stroke-[2.5]" />
                            ) : (
                              <ChevronRight className="size-3.5 text-slate-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* One-Tap Mobile Sign Out */}
              <div className="pt-2 border-t border-cyan-500/20">
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    handleSignOut();
                  }}
                  className="w-full py-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <LogOut className="size-4" />
                  <span>SIGN OUT OF DRAGONID</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
