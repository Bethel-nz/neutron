'use client';

import * as React from 'react';
import { Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type LayoutType } from '@/store/use-layout-preference';
import { useSortPreference } from '@/store/use-sort-preference';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookmarks } from '@/lib/query-client';
import { BookmarkCard } from './bookmark-card';
import { groupBookmarksByDate } from './utils';
import { LoadingCard } from './loading-card';
import type { Bookmark } from '@/types';
import Masonry from 'react-masonry-css';
import { useActiveGroup } from '@/hooks/use-active-group';

const breakpointColumns = {
  default: 4,
  1536: 3, // 2xl
  1280: 3, // xl
  1024: 2, // lg
  768: 2, // md
  640: 1, // sm
};

interface BookmarksListProps {
  layout: LayoutType;
  searchQuery: string;
}

export function BookmarksList({ layout, searchQuery }: BookmarksListProps) {
  const { activeGroup } = useActiveGroup();
  const { data: bookmarks = [], isLoading } = useBookmarks(activeGroup?.id);
  const { direction } = useSortPreference();
  const [showEmpty, setShowEmpty] = React.useState(false);
  const [pendingBookmarks, setPendingBookmarks] = React.useState<Bookmark[]>(
    []
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmpty(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // These useMemo calls MUST come before any conditional returns
  const sortedAndFilteredBookmarks = React.useMemo(() => {
    if (!bookmarks) return [];
    const sorted = bookmarks.sort((a, b) => {
      const dateA = new Date(a.createdAt!).getTime();
      const dateB = new Date(b.createdAt!).getTime();
      return direction === 'desc' ? dateB - dateA : dateA - dateB;
    });

    if (!searchQuery) return sorted;

    const lowerQuery = searchQuery.toLowerCase();
    return sorted.filter(
      (bookmark) =>
        (bookmark.content?.toLowerCase() || '').includes(lowerQuery) ||
        (bookmark.url?.toLowerCase() || '').includes(lowerQuery)
    );
  }, [bookmarks, searchQuery, direction]);

  const groupedBookmarks = React.useMemo(() => {
    return groupBookmarksByDate(sortedAndFilteredBookmarks);
  }, [sortedAndFilteredBookmarks]);

  if (isLoading) return LoadingState(isLoading, layout);

  // Empty state
  if (!bookmarks || (bookmarks.length === 0 && showEmpty)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col items-center justify-center py-12 text-center'
      >
        <Box className='h-12 w-12 text-muted-foreground mb-4' />
        <h3 className='text-lg font-medium mb-2'>No bookmarks yet</h3>
        <p className='text-sm text-muted-foreground max-w-sm'>
          Start by pasting a URL or typing some text in the search bar above
        </p>
      </motion.div>
    );
  }

  return (
    <div className='space-y-8'>
      <AnimatePresence mode='wait' initial={false}>
        {groupedBookmarks.map(([date, dateBookmarks]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='space-y-4'
          >
            <h2 className='text-sm font-medium text-muted-foreground'>
              {date}
            </h2>
            {layout === 'grid' ? (
              <Masonry
                breakpointCols={breakpointColumns}
                className='flex w-auto -ml-4'
                columnClassName='pl-4 bg-clip-padding'
              >
                {dateBookmarks.map((bookmark) => (
                  <div key={bookmark.id} className='mb-4'>
                    <BookmarkCard bookmark={bookmark} layout='grid' />
                  </div>
                ))}
              </Masonry>
            ) : (
              <div className='space-y-4'>
                {dateBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    layout='list'
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {pendingBookmarks.length > 0 && (
        <div
          className={cn(
            'grid gap-4',
            layout === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          )}
        >
          {pendingBookmarks.map((bookmark) => (
            <LoadingCard
              key={bookmark.id}
              layout={layout}
              isUrl={bookmark.type === 'webpage'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const LoadingState = (isLoading: boolean, layout?: LayoutType) => {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'w-full bg-card transition-all',
              layout === 'grid' ? 'h-40' : 'h-24',
              'rounded-lg'
            )}
          />
        ))}
      </div>
    );
  }
};
