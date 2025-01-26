import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookmarks, createBookmark } from '@/actions/bookmarks';
import type { Bookmark, NewBookmark } from '@/types';
import { queryClient } from '@/query.client';
import { useIsOnline } from '@/hooks/useIsOnline';
import { useBookmarkQueue } from '@/store/use-bookmark-queue';
import React from 'react';

export function useBookmarks(groupId: string | undefined) {
  return useQuery({
    queryKey: ['bookmarks', groupId],
    queryFn: () => {
      if (!groupId) return [];
      return getBookmarks(groupId);
    },
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    networkMode: 'offlineFirst',
  });
}

export function useCreateBookmark() {
  const { isOnline } = useIsOnline();
  const { addToQueue, processQueue } = useBookmarkQueue();

  return useMutation({
    mutationFn: async (data: NewBookmark) => {
      if (!isOnline) {
        addToQueue({
          id: crypto.randomUUID(),
          action: 'create',
          data,
          timestamp: Date.now(),
        });
        return null;
      }
      return await createBookmark(data);
    },
    onMutate: async (newBookmark) => {
      await queryClient.cancelQueries({
        queryKey: ['bookmarks', newBookmark.groupId],
      });

      const previous =
        queryClient.getQueryData<Bookmark[]>([
          'bookmarks',
          newBookmark.groupId,
        ]) || [];
      const tempId = `temp-${Date.now()}`;

      const optimisticBookmark: Bookmark = {
        id: tempId,
        description: null,
        type: newBookmark.type ?? 'webpage',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: newBookmark.userId,
        groupId: newBookmark.groupId as string,
        content: newBookmark.content || '',
        url: newBookmark.url || null,
        isFavorite: false,
        syncStatus: isOnline ? 'synced' : 'pending',
      };

      queryClient.setQueryData(
        ['bookmarks', newBookmark.groupId],
        [...previous, optimisticBookmark]
      );

      return { tempId, previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['bookmarks', variables.groupId],
        context?.previous
      );
    },
    onSuccess: async (result, variables, context) => {
      if (!result) return;

      queryClient.setQueryData<Bookmark[]>(
        ['bookmarks', variables.groupId],
        (old) =>
          old?.map((item) =>
            item.id === context?.tempId
              ? {
                  ...item,
                  ...result,
                  id: result.id,
                  syncStatus: 'synced',
                }
              : item
          ) || []
      );

      await processQueue();
    },
  });
}

export function useProcessQueue() {
  const { isOnline } = useIsOnline();
  const { processQueue } = useBookmarkQueue();

  React.useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);
}
