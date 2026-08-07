import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-base text-foreground shadow-inner shadow-black/15 transition-[border-color,box-shadow,background-color] outline-none placeholder:text-muted-foreground hover:border-white/20 focus-visible:border-gold-400/65 focus-visible:bg-black/40 focus-visible:ring-3 focus-visible:ring-gold-400/15 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
