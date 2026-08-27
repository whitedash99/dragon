"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Gamepad2,
  Download,
  Users,
  Briefcase,
  Headphones,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Home,
  LogIn,
  UserPlus,
  Settings,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { useSession, signOut } from "next-auth/react";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { DiscordIcon, XIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { Youtube } from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const sessionState = useSession();
  const session = sessionState?.data;
  const isAuth = !!session?.user;
  const user = session?.user;

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // ESC key listener
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

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch {}
    signOut({ callbackUrl: "/" });
  };

  const primaryDrawerLinks = [
    { label: "Home", href: "/", icon: Home, color: "text-cyan-400" },
    { label: "Games Catalog", href: "/games", icon: Gamepad2, color: "text-blue-400" },
    { label: "Downloads Hub", href: "/downloads", icon: Download, color: "text-amber-400" },
    { label: "Community & Guilds", href: "/community", icon: Users, color: "text-purple-400" },
    { label: "News & Dispatches", href: "/news", icon: Newspaper, color: "text-pink-400" },
    { label: "Careers & Openings", href: "/careers", icon: Briefcase, color: "text-rose-400" },
    { label: "Contact & Support", href: "/contact", icon: Headphones, color: "text-teal-400" },
  ];

  const authDrawerLinks = [
    { label: "Player Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-cyan-400" },
    { label: "Player Profile", href: "/profile", icon: Sparkles, color: "text-purple-400" },
    { label: "Account Settings", href: "/settings", icon: Settings, color: "text-blue-400" },
    { label: "Support Tickets", href: "/track-ticket", icon: ShieldCheck, color: "text-teal-400" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020512]/90 backdrop-blur-2xl"
            aria-hidden="true"
          />

          {/* Drawer Container (Right side slide-in) */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[101] flex w-[88%] max-w-sm flex-col justify-between overflow-y-auto border-l border-cyan-500/30 bg-gradient-to-b from-[#050D24] via-[#030818] to-[#020512] p-5 pb-[max(env(safe-area-inset-bottom,24px),24px)] pt-[max(env(safe-area-inset-top,20px),20px)] shadow-[-10px_0_40px_rgba(0,0,0,0.9)] select-none"
          >
            {/* Ambient Lighting Orbs */}
            <div
              aria-hidden="true"
              className="absolute -right-20 top-20 size-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -left-20 bottom-24 size-60 rounded-full bg-purple-600/15 blur-3xl pointer-events-none"
            />

            <div className="space-y-5 relative z-10">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <DragonLogoIcon size="sm" className="shadow-[0_0_15px_rgba(0,229,255,0.4)]" />
                  <div className="flex flex-col">
                    <span className="font-heading font-black text-sm uppercase tracking-wider text-white">
                      DRAGON STUDIOS
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      MOBILE APEX
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex size-11 items-center justify-center rounded-2xl bg-[#050D24] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer active:scale-95 shadow-md"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* User Identity Box */}
              {isAuth && user ? (
                <div className="p-3.5 rounded-2xl bg-[#050D24]/90 border border-purple-500/40 shadow-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-sm font-heading shadow-md">
                      {((user?.name || user?.email || "U")[0] || "U").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate font-heading tracking-wide uppercase">
                        {user.name || "Dragon Player"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                    <Link
                      href="/dashboard"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-500/20 border border-purple-400/40 text-[11px] font-heading font-black uppercase text-purple-300 active:scale-95 transition-transform"
                    >
                      <LayoutDashboard className="size-3.5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 border border-white/15 text-[11px] font-heading font-black uppercase text-slate-300 active:scale-95 transition-transform"
                    >
                      <Settings className="size-3.5" />
                      <span>Settings</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#050D24]/90 border border-cyan-500/30 shadow-lg space-y-2.5">
                  <div className="text-xs font-heading font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-cyan-400" />
                    <span>Join the Dragon Network</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-xs font-heading font-black uppercase text-cyan-300 active:scale-95 transition-transform"
                    >
                      <LogIn className="size-3.5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-xs font-heading font-black uppercase text-white shadow-md active:scale-95 transition-transform"
                    >
                      <UserPlus className="size-3.5" />
                      <span>Join Now</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase px-1 pb-1">
                  Main Navigation
                </div>
                {primaryDrawerLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        try {
                          soundFx?.playClick();
                        } catch {}
                        onClose();
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                        isActive
                          ? "bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                          : "bg-[#050D24]/60 border border-white/5 text-slate-300 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-black/40 border border-white/10 ${link.color}`}>
                          <Icon className="size-4" />
                        </div>
                        <span className="font-heading font-bold text-xs uppercase tracking-wider">
                          {link.label}
                        </span>
                      </div>
                      <ChevronRight className="size-4 text-slate-500" />
                    </Link>
                  );
                })}

                {isAuth && (
                  <>
                    <div className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase px-1 pt-3 pb-1">
                      Player Space
                    </div>
                    {authDrawerLinks.map((link) => {
                      const isActive = pathname === link.href;
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => {
                            try {
                              soundFx?.playClick();
                            } catch {}
                            onClose();
                          }}
                          className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                            isActive
                              ? "bg-purple-500/20 border border-purple-400/40 text-purple-300"
                              : "bg-[#050D24]/60 border border-white/5 text-slate-300 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl bg-black/40 border border-white/10 ${link.color}`}>
                              <Icon className="size-4" />
                            </div>
                            <span className="font-heading font-bold text-xs uppercase tracking-wider">
                              {link.label}
                            </span>
                          </div>
                          <ChevronRight className="size-4 text-slate-500" />
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Footer Actions & Socials */}
            <div className="space-y-4 pt-4 border-t border-white/10 relative z-10">
              {/* Social Channels */}
              <div className="flex items-center justify-around px-2">
                <a
                  href={OFFICIAL_SOCIALS.discord.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl bg-[#050D24] border border-white/10 text-slate-400 hover:text-[#5865F2] hover:border-[#5865F2]/40 transition-all active:scale-95"
                  aria-label="Official Discord"
                >
                  <DiscordIcon className="size-4" />
                </a>
                <a
                  href={OFFICIAL_SOCIALS.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl bg-[#050D24] border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-all active:scale-95"
                  aria-label="Official X"
                >
                  <XIcon className="size-4" />
                </a>
                <a
                  href={OFFICIAL_SOCIALS.youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl bg-[#050D24] border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-400/40 transition-all active:scale-95"
                  aria-label="Official YouTube"
                >
                  <Youtube className="size-4" />
                </a>
                <a
                  href={OFFICIAL_SOCIALS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl bg-[#050D24] border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-400/40 transition-all active:scale-95"
                  aria-label="Official WhatsApp"
                >
                  <WhatsAppIcon className="size-4" />
                </a>
              </div>

              {/* Sign Out Button (if logged in) */}
              {isAuth && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 font-heading font-black text-xs uppercase tracking-wider hover:bg-rose-900/50 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out of Dragon ID</span>
                </button>
              )}

              <div className="text-center font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                DRAGON GAMING STUDIOS • v1.0 AAA MOBILE
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
