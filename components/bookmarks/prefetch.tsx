'use client'

import { useLayoutEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getBookmarks } from '@/actions/bookmarks'

interface PrefetchProps {
  groupId: string
  children: React.ReactNode
}

export function Prefetch({ groupId, children }: PrefetchProps) {
  const queryClient = useQueryClient()

  useLayoutEffect(() => {
    if (!groupId) return

    // Ensure data is prefetched
    queryClient.prefetchQuery({
      queryKey: ['bookmarks', groupId],
      queryFn: () => getBookmarks(groupId),
    })
  }, [groupId, queryClient])

  return children
} 