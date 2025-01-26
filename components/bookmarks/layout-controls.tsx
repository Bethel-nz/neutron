'use client'

import { LayoutGrid, List, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useLayoutPreference, type LayoutType } from "@/store/use-layout-preference"
import { useSortPreference } from "@/store/use-sort-preference"

export function LayoutControls() {
  const { layout, setLayout } = useLayoutPreference()
  const { direction, toggleDirection } = useSortPreference()

  const layouts: { type: LayoutType; icon: typeof LayoutGrid }[] = [
    { type: 'grid', icon: LayoutGrid },
    { type: 'list', icon: List },
  ]

  return (
    <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDirection}
        className="h-9 w-9 shrink-0"
        title={direction === 'desc' ? 'Newest first' : 'Oldest first'}
      >
        <ArrowUpDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          direction === 'desc' ? 'rotate-0' : 'rotate-180'
        )} />
      </Button>
      
      {layouts.map(({ type, icon: Icon }) => (
        <Button
          key={type}
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          onClick={() => setLayout(type)}
        >
          <Icon className="h-4 w-4" />
          {layout === type && (
            <motion.div
              layoutId="activeLayout"
              className="absolute inset-0 bg-white rounded-md"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </Button>
      ))}
    </div>
  )
} 