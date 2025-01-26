'use client';

import { useLayoutPreference } from '@/store/use-layout-preference';
import { BookmarksList } from './bookmarks-list';
import { useSearch } from '@/store/use-search';
import { useDebounce } from '@/hooks/usedebounce';
import { useBookmarks } from '@/lib/query-client';
import { BookmarkInput } from './bookmark-input';
import { LayoutControls } from './layout-controls';
import { useSession } from 'next-auth/react';
import { useActiveGroup } from '@/hooks/use-active-group';

export function BookmarksContent() {
  const session = useSession();
  if (!session) return null;

  const { activeGroup } = useActiveGroup();
  const { layout } = useLayoutPreference();
  const { query } = useSearch();
  const debouncedQuery = useDebounce(query, 500);

  if (!activeGroup) return null;

  return (
    <div className='flex flex-col min-h-[calc(100vh-3.5rem)]'>
      <main className='flex-1 container py-6'>
        <div className='flex flex-col gap-6 mb-8'>
          <div className='flex md:items-center justify-between flex-col md:flex-row gap-y-4'>
            <div>
              <h1 className='text-2xl font-semibold tracking-tight'>
                {activeGroup.name}
              </h1>
              <p className='text-sm text-muted-foreground'>
                Your bookmarks in {activeGroup.name}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <BookmarkInput className='w-[400px]' />
              <LayoutControls />
            </div>
          </div>
        </div>

        <hr className='my-4' />

        <BookmarksList layout={layout} searchQuery={debouncedQuery} />
      </main>
    </div>
  );
}
