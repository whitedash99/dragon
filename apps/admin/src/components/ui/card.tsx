import React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "outline";
}

export function Card({
  className,
  variant = "glass",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variant === "glass" && "bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40",
        variant === "gradient" && "bg-gradient-to-br from-purple-900/30 via-slate-900/80 to-slate-950/90 border border-purple-500/20 shadow-2xl shadow-purple-950/50",
        variant === "outline" && "border border-white/15 bg-slate-950/40",
        variant === "default" && "bg-slate-900 border border-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-3 flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-400 font-medium", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0 flex items-center border-t border-white/5 mt-4 pt-4", className)} {...props}>
      {children}
    </div>
  );
}
