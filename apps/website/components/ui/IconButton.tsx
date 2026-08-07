import * as React from "react";
import { Button, type ButtonProps } from "./button";

export interface IconButtonProps extends Omit<ButtonProps, "children" | "size"> {
  icon: React.ReactNode;
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        aria-label={label}
        className={className}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
