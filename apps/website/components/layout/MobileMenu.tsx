"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import { navigation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-hidden border-l border-white/12 bg-[linear-gradient(145deg,rgba(29,18,20,0.99),rgba(7,7,9,0.99)_42%)] p-6 shadow-[-30px_0_100px_rgba(0,0,0,0.45)] sm:max-w-md"
          >
            <div aria-hidden="true" className="absolute -right-24 top-20 h-64 w-64 rounded-full bg-dragon-500/15 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <span className="cinematic-eyebrow">Navigation</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="relative mt-12 flex flex-col space-y-2">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    ref={i === 0 ? firstLinkRef : null}
                    href={item.href}
                    className="group flex items-center justify-between border-b border-white/8 py-4 font-heading text-3xl font-bold uppercase tracking-tight text-foreground transition-colors hover:border-dragon-400/50 hover:text-dragon-300 sm:text-4xl"
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="relative mt-auto flex flex-col gap-3 border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-[0.65rem] font-mono font-bold uppercase tracking-[0.18em] text-gold-400"><Sparkles className="size-3" /> Enter the realm</p>
              <Button variant="glass" className="w-full" size="lg" asChild>
                <Link href="/login" onClick={onClose}>Sign In</Link>
              </Button>
              <Button variant="glow" className="w-full" size="lg" asChild>
                <Link href="/register" onClick={onClose}>Create Account</Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
