"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3 | 4 | 5;
  interactive?: boolean;
  shine?: boolean;
}

export const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, level = 2, interactive = false, shine = false, children, ...props }, ref) => {
    const levelClasses = {
      1: "glass-l1 rounded-2xl",
      2: "glass-l2 rounded-2xl",
      3: "glass-l3 rounded-xl",
      4: "glass-l4 rounded-3xl",
      5: "glass-l5-primary rounded-xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          levelClasses[level],
          interactive && "card-3d-interactive cursor-pointer",
          shine && "glass-shine-sweep",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassSurface.displayName = "GlassSurface";
