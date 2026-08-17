import React from "react";
import { cn } from "@/lib/utils/cn";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No items found",
  description = "There are currently no items matching your request.",
  icon: Icon = FolderOpen,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
