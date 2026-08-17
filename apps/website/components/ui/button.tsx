"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-xs font-black uppercase tracking-[0.14em] font-heading transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:border-cyan-300 hover:scale-[1.02] active:scale-[0.98]",
        glow:
          "bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.6)] border border-blue-400 hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(59,130,246,0.9)] hover:border-cyan-300 hover:scale-[1.02] active:scale-[0.98]",
        glowOutline:
          "bg-[#060B18] text-white border border-blue-500/80 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-600/20 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] hover:scale-[1.02] active:scale-[0.98]",
        solidRed:
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black tracking-[0.16em] shadow-[0_0_25px_rgba(37,99,235,0.6)] border border-blue-400 hover:from-blue-500 hover:to-cyan-500 hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-red-600/80 text-white border border-red-500/60 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] hover:scale-[1.02] active:scale-[0.98]",
        gold:
          "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-cyan-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-slate-700/80 bg-[#060B18]/80 text-white shadow-sm hover:bg-blue-950/30 hover:border-blue-500/60 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-slate-900/80 text-white border border-slate-800 hover:bg-slate-800 hover:border-blue-500/30 active:scale-[0.98]",
        ghost:
          "hover:bg-blue-950/30 hover:text-cyan-300 text-slate-400",
        link:
          "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300",
        glass:
          "glass-md text-white border border-blue-500/20 hover:bg-blue-600/15 hover:border-blue-500/40 hover:scale-[1.02]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-xl px-4 text-[11px]",
        lg: "h-13 rounded-xl px-8 text-sm tracking-[0.16em]",
        xl: "h-14 rounded-xl px-10 text-base font-black tracking-[0.18em]",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...(props as any)}
        />
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(props as any)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
