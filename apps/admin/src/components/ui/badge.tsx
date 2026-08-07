import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "purple" | "cyan" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        variant === "default" && "bg-slate-800/80 text-slate-300 border-slate-700",
        variant === "success" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        variant === "warning" && "bg-amber-500/10 text-amber-400 border-amber-500/30",
        variant === "danger" && "bg-rose-500/10 text-rose-400 border-rose-500/30",
        variant === "purple" && "bg-purple-500/10 text-purple-300 border-purple-500/30",
        variant === "cyan" && "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
        variant === "outline" && "bg-transparent text-slate-300 border-white/15",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
