import * as React from "react";
import { cn } from "@/lib/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "display" | "h1" | "h2" | "h3" | "h4";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  size?: HeadingSize;
  gradient?: boolean;
  glow?: boolean;
}

const sizeClasses: Record<HeadingSize, string> = {
  display: "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-[0.85]",
  h1: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9]",
  h2: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight",
  h3: "text-2xl sm:text-3xl font-semibold tracking-tight",
  h4: "text-xl sm:text-2xl font-semibold",
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, size, gradient = false, glow = false, children, ...props }, ref) => {
    const Component = `h${level}` as React.ElementType;
    
    let resolvedSize: HeadingSize = "h2";
    if (size) {
      resolvedSize = size;
    } else {
      if (level === 1) resolvedSize = "h1";
      else if (level === 2) resolvedSize = "h2";
      else if (level === 3) resolvedSize = "h3";
      else resolvedSize = "h4";
    }

    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses[resolvedSize],
          gradient && "text-gradient",
          glow && "text-glow-primary",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";
