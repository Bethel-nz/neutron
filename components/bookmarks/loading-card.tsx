"use client"

import * as React from "react"
import { Globe, File } from "lucide-react"
import { cn } from "@/lib/utils"
import { type LayoutType } from "@/store/use-layout-preference"

interface LoadingCardProps {
  layout: LayoutType
  isUrl?: boolean
}

export function LoadingCard({ layout, isUrl = true }: LoadingCardProps) {
  return (
    <div 
      className={cn(
        "group relative bg-card transition-all animate-pulse",
        layout === 'grid' 
          ? "h-40"
          : "min-h-[2.5rem] rounded-md"
      )}
    >
      <div className={cn(
        "relative h-full p-4 flex",
        layout === 'grid' 
          ? "flex-col"
          : "flex-row items-center gap-4"
      )}>
        <div className={cn(
          "flex items-center shrink-0",
          layout === 'grid' ? "w-full justify-between" : "flex-col items-start gap-2 w-24"
        )}>
          <div className="flex items-center gap-2">
            {isUrl ? <Globe className="h-4 w-4 text-muted-foreground" /> : <File className="h-4 w-4 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">
              {isUrl ? 'webpage' : 'article'}
            </span>
          </div>
          <time className="text-xs text-muted-foreground">
            Just now
          </time>
        </div>

        <div className={cn(
          "flex-1 min-w-0",
          layout === 'grid' ? "mt-4" : ""
        )}>
          <div className="flex items-start justify-between gap-4">
            <div className="w-full h-4 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
} 