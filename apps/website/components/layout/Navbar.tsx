"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Gamepad2,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  Users,
  Download
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { DragonLogo } from "@/components/ui/dragon-logo";

export function Navbar() {
  const pathname = usePathname();
  const sessionState = useSession();
  const session = sessionState?.data;
  const status = sessionState?.status;
  const { isScrolled } = useScroll();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [hasCookieSession, setHasCookieSession] = useState(false);
  const [customUser, setCustomUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;

      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setHasCookieSession(true);
            setCustomUser(data.user);
          }
        })
        .catch(() => {});
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const isUserAuthenticated = (status === "authenticated" && !!session?.user) || hasCookieSession;
  const activeUser = session?.user || customUser;

  const publicNavLinks = [
    { label: "HOME", href: "/" },
    { label: "GAMES", href: "/games" },
    { label: "DOWNLOADS", href: "/downloads" },
    { label: "CAREERS", href: "/careers" },
    { label: "COMMUNITY", href: "/community" },
    { label: "CONTACT", href: "/contact" },
  ];

  const portalNavLinks = [
    { label: "LIBRARY", href: "/dashboard", icon: Gamepad2 },
    { label: "DOWNLOADS", href: "/downloads", icon: Download },
    { label: "PROFILE", href: "/profile", icon: User },
    { label: "SETTINGS", href: "/settings", icon: Settings },
    { label: "COMMUNITY", href: "/community", icon: Users },
  ];

  const navLinks = isUserAuthenticated ? portalNavLinks : publicNavLinks;

  const handleSignOut = async () => {
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});
    signOut({ callbackUrl: "/" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out border-b border-cyan-500/20",
        isScrolled
          ? "bg-[#01040D]/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
          : "bg-[#01040D]/75 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1540px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* ═══ Left: Apex Dragon Logo ═══ */}
        <Link href={isUserAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group shrink-0 mr-4 sm:mr-8">
          <DragonLogo textVariant="gaming" size="sm" showIcon={true} />
        </Link>

        {/* ═══ Center: Navigation Links ═══ */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-black uppercase tracking-[0.18em] font-heading">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors py-2 relative flex items-center gap-1.5",
                  isActive ? "text-cyan-400 font-extrabold" : "text-slate-300 hover:text-cyan-300"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_12px_#00f0ff]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ═══ Right: Clean Sign In & Join Now Actions ═══ */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* User Auth Portal */}
          <div className="hidden items-center gap-2.5 lg:flex">
            {isUserAuthenticated && activeUser ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-[#040D24] border border-cyan-500/40 hover:border-cyan-300 transition-all text-xs font-semibold text-white shadow-xl shadow-blue-950/40 cursor-pointer"
                >
                  <div className="relative">
                    <div className="size-7 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs font-heading">
                      {(activeUser.name || activeUser.email || "U")[0].toUpperCase()}
                    </div>
                  </div>
                  <span className="max-w-[110px] truncate text-slate-200 font-mono font-bold">
                    {activeUser.name || activeUser.email?.split("@")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#040A18]/98 border border-cyan-500/30 rounded-2xl shadow-2xl backdrop-blur-2xl p-2 hidden group-hover:block z-50 text-xs font-sans">
                  <div className="px-3 py-2 border-b border-white/10 text-slate-400 font-mono text-[10px] truncate">
                    {activeUser.email}
                  </div>
                  <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors font-medium">
                    <User className="size-3.5 text-cyan-400" />
                    <span>Player Profile</span>
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors font-medium">
                    <Gamepad2 className="size-3.5 text-cyan-400" />
                    <span>My Game Library</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors font-medium">
                    <Settings className="size-3.5 text-cyan-400" />
                    <span>Account Settings</span>
                  </Link>
                  <Link href="/track-ticket" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors font-medium">
                    <ShieldCheck className="size-3.5 text-cyan-400" />
                    <span>Support Tickets</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors font-semibold border-t border-white/10 mt-1 cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs px-4 border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/20 hover:text-white font-mono font-bold"
                  asChild
                >
                  <Link href="/login">SIGN IN</Link>
                </Button>

                <Button
                  variant="glow"
                  size="sm"
                  className="rounded-xl text-xs px-4 font-mono font-bold"
                  asChild
                >
                  <Link href="/register">JOIN NOW</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#040D24] border border-cyan-500/20 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isMobileOpen} onClose={handleCloseMobile} />
    </header>
  );
}
