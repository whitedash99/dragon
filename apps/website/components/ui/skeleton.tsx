import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-[linear-gradient(110deg,rgba(255,255,255,0.05),rgba(255,255,255,0.11),rgba(255,255,255,0.05))] bg-[length:200%_100%]", className)}
      {...props}
    />
  )
}

export { Skeleton }
