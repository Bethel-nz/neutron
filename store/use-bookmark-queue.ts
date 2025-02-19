import {
  createBookmark,
  deleteBookmark,
  updateBookmark,
} from '@/actions/bookmarks';
import { queryClient } from '@/query.client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QueuedBookmark {
  id: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount?: number;
  groupId?: string;
}

interface BookmarkQueueStore {
  queue: QueuedBookmark[];
  isProcessing: boolean;
  isCheckingConnectivity: boolean;
  addToQueue: (bookmark: Omit<QueuedBookmark, 'timestamp'>) => void;
  removeFromQueue: (id: string) => void;
  processQueue: () => Promise<void>;
  retryFailedOperations: () => Promise<void>;
  checkConnectivity: () => Promise<boolean>;
}

const MAX_RETRIES = 3;
const CONNECTIVITY_CHECK_URL = 'https://jsonplaceholder.typicode.com/posts/1';

/**
 * Checks both navigator.onLine and makes a test API call
 * to ensure we have actual internet connectivity
 */
const checkInternetConnectivity = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(CONNECTIVITY_CHECK_URL, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Connectivity check failed:', error);
    return false;
  }
};

/**
 * Note: This is a basic queue system that utilizes zustand persist to queue each data you pass in
 * this feels like i over did it but i couldnt find any way to implement a sync system without having to go through a log of stress
 */
export const useBookmarkQueue = create<BookmarkQueueStore>()(
  persist(
    (set, get) => ({
      queue: [],
      isProcessing: false,
      isCheckingConnectivity: false,
      addToQueue: (bookmark) => {
        set((state) => ({
          queue: [...state.queue, { ...bookmark, timestamp: Date.now() }],
        }));
      },
      removeFromQueue: (id) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        }));
      },
      checkConnectivity: async () => {
        const state = get();
        if (state.isCheckingConnectivity) return false;

        set({ isCheckingConnectivity: true });
        try {
          return await checkInternetConnectivity();
        } finally {
          set({ isCheckingConnectivity: false });
        }
      },
      processQueue: async () => {
        const state = get();
        if (state.isProcessing || state.queue.length === 0) return;

        // Check connectivity before processing
        const isConnected = await state.checkConnectivity();
        if (!isConnected) {
          console.log('No internet connection, skipping queue processing');
          return;
        }

        set({ isProcessing: true });

        try {
          const { queue } = state;
          for (const item of queue) {
            try {
              switch (item.action) {
                case 'create':
                  await createBookmark(item.data);
                  break;
                case 'update':
                  await updateBookmark(item.id, item.data);
                  break;
                case 'delete':
                  await deleteBookmark(item.id);
                  break;
              }

              // Invalidate queries after successful operation
              if (item.groupId) {
                queryClient.invalidateQueries({
                  queryKey: ['bookmarks', item.groupId],
                });
              }

              get().removeFromQueue(item.id);
            } catch (error) {
              console.error('Failed to process queue item:', error);
              // Update retry count
              set((state) => ({
                queue: state.queue.map((qItem) =>
                  qItem.id === item.id
                    ? {
                        ...qItem,
                        retryCount: (qItem.retryCount || 0) + 1,
                      }
                    : qItem
                ),
              }));
            }
          }
        } finally {
          set({ isProcessing: false });
        }
      },
      retryFailedOperations: async () => {
        const { queue } = get();
        const failedItems = queue.filter(
          (item) => (item.retryCount || 0) < MAX_RETRIES
        );

        if (failedItems.length > 0) {
          await get().processQueue();
        }
      },
    }),
    {
      name: 'bookmark-queue',
      partialize: (state) => ({
        queue: state.queue.filter(
          (item) => (item.retryCount || 0) < MAX_RETRIES
        ),
      }),
    }
  )
);
