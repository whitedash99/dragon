import * as React from "react";
import { cn } from "@/lib/cn";
import { Container, type ContainerSize } from "./Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  withContainer?: boolean;
  containerSize?: ContainerSize;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, withContainer = false, containerSize = "2xl", ...props }, ref) => {
    const content = withContainer ? (
      <Container size={containerSize}>{children}</Container>
    ) : (
      children
    );

    return (
      <section ref={ref} className={cn("py-20 lg:py-32", className)} {...props}>
        {content}
      </section>
    );
  }
);

Section.displayName = "Section";
