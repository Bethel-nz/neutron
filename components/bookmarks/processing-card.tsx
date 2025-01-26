"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { type LayoutType } from "@/store/use-layout-preference"
import { motion } from "framer-motion"

interface ProcessingCardProps {
  layout: LayoutType
  url: string
}

export function ProcessingCard({ layout, url }: ProcessingCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-card/50 border border-border/50",
        layout === 'grid' 
          ? "h-40"
          : "min-h-[2.5rem] rounded-md"
      )}
    >
      <div className={cn(
        "relative h-full p-4 flex animate-pulse",
        layout === 'grid' 
          ? "flex-col"
          : "flex-row items-center gap-4"
      )}>
        <div className={cn(
          "flex items-center shrink-0",
          layout === 'grid' ? "w-full justify-between" : "flex-col items-start gap-2 w-24"
        )}>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground/50">
              Processing...
            </span>
          </div>
          <time className="text-xs text-muted-foreground/50">
            Just now
          </time>
        </div>

        <div className={cn(
          "flex-1 min-w-0",
          layout === 'grid' ? "mt-4" : ""
        )}>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-muted/50 rounded w-3/4" />
            <div className="h-4 bg-muted/50 rounded w-1/2" />
            <a 
              className="text-xs text-muted-foreground/50 truncate"
            >
              {url}
            </a>
          </div>
        </div>
      </div>
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-primary/20"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2 }}
      />
    </div>
  )
} 