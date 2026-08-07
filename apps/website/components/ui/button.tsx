"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg text-xs font-black uppercase tracking-[0.14em] font-heading transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-dragon-600 via-dragon-500 to-dragon-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] border border-dragon-400/50 hover:shadow-[0_0_30px_rgba(225,29,72,0.7)] hover:border-dragon-300 hover:scale-[1.02] active:scale-[0.98]",
        glow:
          "bg-dragon-600 text-white shadow-[0_0_25px_rgba(225,29,72,0.5)] border border-dragon-400 hover:bg-dragon-500 hover:shadow-[0_0_35px_rgba(225,29,72,0.8)] hover:border-dragon-300 hover:scale-[1.02] active:scale-[0.98]",
        glowOutline:
          "bg-black/60 text-white border border-dragon-500/80 shadow-[0_0_20px_rgba(225,29,72,0.35)] hover:bg-dragon-500/15 hover:border-dragon-400 hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-[1.02] active:scale-[0.98]",
        solidRed:
          "bg-[#ff1e4b] text-white font-black tracking-[0.16em] shadow-[0_0_25px_rgba(255,30,75,0.6)] border border-[#ff4d70] hover:bg-[#ff0033] hover:shadow-[0_0_40px_rgba(255,30,75,0.9)] hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-red-600/80 text-white border border-red-500/60 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] hover:scale-[1.02] active:scale-[0.98]",
        gold:
          "bg-gradient-to-r from-gold-500 to-amber-500 text-black font-black shadow-[0_0_20px_rgba(250,204,21,0.4)] border border-gold-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.7)] hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-white/20 bg-black/40 text-white shadow-sm hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:border-white/25 active:scale-[0.98]",
        ghost:
          "hover:bg-white/10 hover:text-white text-muted-foreground",
        link:
          "text-dragon-400 underline-offset-4 hover:underline hover:text-dragon-300",
        glass:
          "glass-md text-white border border-white/15 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-[11px]",
        lg: "h-13 rounded-lg px-8 text-sm tracking-[0.16em]",
        xl: "h-14 rounded-lg px-10 text-base font-black tracking-[0.18em]",
        icon: "size-10 rounded-lg",
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
