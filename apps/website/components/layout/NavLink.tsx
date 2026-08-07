"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export function NavLink({ href, label, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
        isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-primary"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}
