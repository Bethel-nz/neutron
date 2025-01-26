'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground">
          {error.message || "An error occurred while loading your bookmarks"}
        </p>
        <Button
          variant="outline"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </div>
  )
} 