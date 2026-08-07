import * as React from "react";
import { cn } from "@/lib/cn";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: React.ElementType;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-[1400px]",
};

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, size = "2xl", as: Component = "div", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeClasses[size], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = "Container";
