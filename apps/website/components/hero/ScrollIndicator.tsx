"use client";

import { motion } from "framer-motion";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/cn";

interface ScrollIndicatorProps {
  className?: string;
}

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const { isScrolled } = useScroll();

  return (
    <motion.div
      className={cn("flex flex-col items-center gap-2", className)}
      animate={{ opacity: isScrolled ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      aria-hidden="true"
    >
      <div className="h-[26px] w-[16px] rounded-full border border-foreground/30 p-[2px]">
        <motion.div
          className="h-1.5 w-1.5 rounded-full bg-foreground/60 mx-auto"
          animate={{
            y: [0, 8, 0],
            opacity: [1, 0, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-medium">
        Scroll
      </span>
    </motion.div>
  );
}
