'use client';

import { cn } from '@/lib/utils';
import { stringToGradient } from '@/lib/utils/color';
import { type LayoutType } from '@/store/use-layout-preference';
import type { Bookmark } from '@/types';
import { Box, File, Globe } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { BookmarkActions } from './bookmark-actions';

interface BookmarkCardProps {
  bookmark: Bookmark;
  layout: LayoutType;
}

const MAX_CONTENT_LENGTH = 500;

export const BookmarkCard = React.memo(function BookmarkCard({
  bookmark,
  layout,
}: BookmarkCardProps) {
  if (!bookmark.content || !bookmark.createdAt || !bookmark.type) return null;
  const [faviconError, setFaviconError] = React.useState(false);

  const faviconUrl = React.useMemo(() => {
    if (!bookmark.url || bookmark.type !== 'webpage') return null;
    try {
      const url = new URL(bookmark.url);
      // Try multiple favicon sources
      return {
        sources: [
          `${url.protocol}//${url.hostname}/favicon.ico`,
          `${url.protocol}//${url.hostname}/favicon.png`,
          `https://www.google.com/s2/favicons?domain=${url.hostname}`, // Google's favicon service as fallback
        ],
        hostname: url.hostname,
      };
    } catch {
      return null;
    }
  }, [bookmark.url, bookmark.type]);

  const [currentFaviconIndex, setCurrentFaviconIndex] = React.useState(0);

  const handleFaviconError = () => {
    if (faviconUrl && currentFaviconIndex < faviconUrl.sources.length - 1) {
      // Try next favicon source
      setCurrentFaviconIndex((prev) => prev + 1);
    } else {
      setFaviconError(true);
    }
  };

  const gradient = React.useMemo(
    () => stringToGradient(Object.values(bookmark).join(' ')),
    [bookmark]
  );

  const needsTruncation = bookmark.content.length > MAX_CONTENT_LENGTH;
  const displayContent = needsTruncation
    ? bookmark.content.slice(0, MAX_CONTENT_LENGTH) + '...'
    : bookmark.content;

  const IconComponent = {
    webpage: Globe,
    article: File,
    file: Box,
  }[bookmark.type];

  return (
    <div
      className={cn(
        'group relative bg-card transition-all hover:shadow-md rounded-lg w-full',
        layout === 'grid' ? 'h-full' : 'min-h-[2.5rem]'
      )}
    >
      <div
        className='absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 rounded-lg'
        style={{ background: gradient }}
      />
      <div
        className={cn(
          'relative h-full p-4',
          layout === 'grid' ? 'flex flex-col gap-4' : 'flex flex-row gap-4'
        )}
      >
        <div
          className={cn(
            'flex shrink-0',
            layout === 'grid'
              ? 'w-full flex-row justify-between'
              : 'flex-col justify-start gap-2 w-24'
          )}
        >
          <div
            className={cn(
              'flex gap-2',
              layout === 'grid' ? 'items-center' : 'items-start'
            )}
          >
            <BookmarkActions bookmark={bookmark} />
            <time className='text-xs text-muted-foreground'>
              {new Date(bookmark.createdAt).toLocaleDateString()}
            </time>
          </div>

          <div className='flex items-center gap-2'>
            {bookmark.type === 'webpage' && faviconUrl && !faviconError ? (
              <div className='relative h-4 w-4'>
                <Image
                  src={faviconUrl.sources[currentFaviconIndex]}
                  alt={`${faviconUrl.hostname} favicon`}
                  width={16}
                  height={16}
                  className='rounded-sm'
                  onError={handleFaviconError}
                />
              </div>
            ) : (
              <IconComponent className='h-4 w-4 text-muted-foreground' />
            )}
            <span className='text-xs text-muted-foreground'>
              {bookmark.type}
            </span>
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex flex-col gap-2'>
            <p
              className={cn(
                'text-sm break-words',
                bookmark.syncStatus === 'pending' && 'text-muted-foreground'
              )}
            >
              {displayContent}
            </p>
            {bookmark.url && (
              <a
                href={bookmark.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs text-muted-foreground hover:text-primary truncate'
              >
                {bookmark.url}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
