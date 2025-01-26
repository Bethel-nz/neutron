"use client"

import * as React from "react"
import Masonry from "react-masonry-css"
import { BookmarkCard } from "./bookmark-card"
import type { Bookmark } from "@/types"
import { cn } from "@/lib/utils"

interface BookmarkGridProps {
  bookmarks: Bookmark[]
  className?: string
}

const breakpointColumns = {
  default: 4,
  1536: 3, // 2xl
  1280: 3, // xl
  1024: 2, // lg
  768: 2,  // md
  640: 1,  // sm
}

export function BookmarkGrid({ bookmarks, className }: BookmarkGridProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className={cn("flex w-auto -ml-4", className)}
      columnClassName="pl-4 bg-clip-padding"
    >
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="mb-4">
          <BookmarkCard 
            bookmark={bookmark}
            layout="grid"
          />
        </div>
      ))}
    </Masonry>
  )
} 