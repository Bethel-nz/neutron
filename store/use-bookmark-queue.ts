import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NewBookmark } from '@/types';
import {
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from '@/actions/bookmarks';

interface QueuedBookmark {
  id: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

interface BookmarkQueueStore {
  queue: QueuedBookmark[];
  addToQueue: (bookmark: QueuedBookmark) => void;
  removeFromQueue: (id: string) => void;
  processQueue: () => Promise<void>;
}

/**
 * Note: This is a basic queue system that utilizes zustand persist to queue each data you pass in
 * this feels like i over did it but i couldnt find any way to implement a sync system without having to go through a log of stress
 */
export const useBookmarkQueue = create<BookmarkQueueStore>()(
  persist(
    (set, get) => ({
      queue: [],
      addToQueue: (bookmark) => {
        set((state) => ({ queue: [...state.queue, bookmark] }));
      },
      removeFromQueue: (id) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        }));
      },
      processQueue: async () => {
        const { queue } = get();
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
            get().removeFromQueue(item.id);
          } catch (error) {
            console.error('Failed to process queue item:', error);
          }
        }
      },
    }),
    {
      name: 'bookmark-queue',
    }
  )
);
