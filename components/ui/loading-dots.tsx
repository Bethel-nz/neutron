import { cn } from "@/lib/utils"

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("space-x-0.5 ml-1", className)}>
      <span className="inline-flex animate-[loading_1.4s_ease-in-out_infinite] rounded-full">
        .
      </span>
      <span className="inline-flex animate-[loading_1.4s_ease-in-out_0.2s_infinite] rounded-full">
        .
      </span>
      <span className="inline-flex animate-[loading_1.4s_ease-in-out_0.4s_infinite] rounded-full">
        .
      </span>
    </span>
  )
} 