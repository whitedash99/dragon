"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Gamepad2, 
  Download, 
  Users, 
  Building2, 
  Briefcase, 
  Headphones, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Zap,
  Newspaper,
  Crown,
  Sparkles,
  User,
  LogIn,
  UserPlus
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { useSession, signIn, signOut } from "next-auth/react";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon, XIcon } from "@/components/ui/social-icons";
import { Instagram, Youtube, MessageSquare } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const sessionState = useSession();
  const session = sessionState?.data;
  const isAuth = !!session?.user;

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Auto-close on route change
  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  const navLinks = [
    { label: "PLAYER DASHBOARD", href: "/dashboard", icon: LayoutDashboard, badge: "VIP DECK", color: "text-purple-400" },
    { label: "GAMES CATALOG", href: "/games", icon: Gamepad2, badge: "3D & 2D", color: "text-cyan-400" },
    { label: "NEWS & DISPATCHES", href: "/news", icon: Newspaper, color: "text-blue-400" },
    { label: "COMMUNITY FORUMS", href: "/community", icon: Users, badge: "LIVE", color: "text-amber-400" },
    { label: "CAREERS & TEAM", href: "/careers", icon: Briefcase, badge: "HIRING", color: "text-rose-400" },
    { label: "SUPPORT & HELPDESK", href: "/contact", icon: Headphones, color: "text-teal-400" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999]">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#02050E]/85 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in Drawer from the LEFT SIDE (Left to Right) */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 left-0 z-[1000] flex w-[85%] max-w-sm flex-col justify-between overflow-y-auto border-r border-cyan-500/40 bg-gradient-to-b from-[#060D24] via-[#030716] to-[#02040A] p-5 shadow-[0_0_80px_rgba(0,240,255,0.35)] select-none"
          >
            {/* Background Neon Halo */}
            <div aria-hidden="true" className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div aria-hidden="true" className="absolute -right-20 bottom-20 h-56 w-56 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

            <div className="space-y-5">
              {/* Header */}
              <div className="relative flex items-center justify-between pb-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-2.5">
                  <DragonLogoIcon size="sm" className="shadow-[0_0_15px_rgba(0,240,255,0.5)] border-cyan-400/50" />
                  <div className="flex flex-col">
                    <span className="font-heading font-black text-sm uppercase tracking-wider text-white">
                      DRAGON STUDIOS
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>SYSTEM ONLINE</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex size-9 items-center justify-center rounded-xl bg-[#07132B] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer shadow-md active:scale-90"
                  aria-label="Close menu"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Authenticated User Banner or Quick Sign-in Buttons */}
              <div className="relative">
                {isAuth ? (
                  <div className="p-3.5 rounded-2xl bg-[#07132B]/90 border border-purple-500/40 space-y-2.5 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-sm font-heading shadow-md">
                        {(session?.user?.name || session?.user?.email || "U")[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate font-heading flex items-center gap-1">
                          <span>{session?.user?.name || session?.user?.email?.split("@")[0]}</span>
                          <Crown className="size-3.5 text-yellow-400 shrink-0" />
                        </span>
                        <span className="text-[10px] font-mono text-purple-300 truncate">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={onClose}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 text-white text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-purple-500/30 active:scale-95 transition-all"
                    >
                      <LayoutDashboard className="size-3.5" />
                      <span>OPEN PLAYER DASHBOARD</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Google One-Click Auth */}
                    <button
                      type="button"
                      onClick={() => signIn("google", { callbackUrl: "/dashboard?welcome=true" })}
                      className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs font-mono rounded-xl shadow-lg transition-all border border-slate-200 cursor-pointer active:scale-95"
                    >
                      <svg className="size-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>SIGN IN WITH GOOGLE</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        onClick={onClose}
                        className="py-2.5 px-3 rounded-xl bg-[#07132B] hover:bg-[#0c1f44] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <LogIn className="size-3.5" />
                        <span>Sign In</span>
                      </Link>

                      <Link
                        href="/register"
                        onClick={onClose}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <UserPlus className="size-3.5" />
                        <span>Join Now</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5 pt-2">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 px-3 pb-1">
                  NAVIGATION ECOSYSTEM
                </div>

                {navLinks.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between rounded-2xl px-3.5 py-3 transition-all ${
                        isActive
                          ? "bg-cyan-500/20 text-white font-bold border border-cyan-400/50 shadow-md shadow-cyan-500/20"
                          : "text-slate-300 hover:bg-[#07132B] hover:text-white hover:border-cyan-500/30 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-xl bg-[#040816] border border-white/10 ${item.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="size-4" />
                        </div>
                        <span className="font-heading text-xs font-bold uppercase tracking-wider">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/30">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="size-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer / Socials & Sign Out Section */}
            <div className="pt-4 border-t border-cyan-500/20 space-y-3">
              {/* Verified Broadcast Channels */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  OFFICIAL CHANNELS
                </span>
                <span className="text-[9px] font-mono font-bold text-emerald-400">
                  ● VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                <a
                  href={OFFICIAL_SOCIALS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Channel"
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#07132B] border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-all"
                >
                  <WhatsAppIcon className="size-4" />
                </a>

                <a
                  href={OFFICIAL_SOCIALS.threads.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Threads Official"
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#07132B] border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all"
                >
                  <ThreadsIcon className="size-4" />
                </a>

                <a
                  href={OFFICIAL_SOCIALS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Official"
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#07132B] border border-pink-500/30 text-pink-400 hover:text-white hover:bg-pink-500/20 transition-all"
                >
                  <Instagram className="size-4" />
                </a>

                <a
                  href={OFFICIAL_SOCIALS.youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Official"
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#07132B] border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                >
                  <Youtube className="size-4" />
                </a>

                <a
                  href={OFFICIAL_SOCIALS.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X Official"
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#07132B] border border-white/20 text-white hover:bg-white/10 transition-all"
                >
                  <XIcon className="size-4" />
                </a>

                <a
                  href={OFFICIAL_SOCIALS.reddit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Reddit Official"
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#07132B] border border-orange-500/30 text-orange-400 hover:text-white hover:bg-orange-500/20 transition-all"
                >
                  <MessageSquare className="size-4" />
                </a>
              </div>

              {isAuth ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-950/40 p-3 text-xs font-mono font-bold uppercase tracking-wider text-red-400 hover:bg-red-900/60 border border-red-500/30 transition-all cursor-pointer active:scale-95"
                >
                  <LogOut className="size-4" />
                  <span>SIGN OUT OF DRAGONID</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-[#040816] border border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>TLS 1.3 SECURE</span>
                  <span className="text-emerald-400 font-bold">● 14ms LOW LATENCY</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
