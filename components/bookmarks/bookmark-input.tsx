'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { useSearch } from '@/store/use-search';
import { useBookmarkActions } from './hooks/use-bookmark-actions';
import { cn } from '@/lib/utils';
import { useActiveGroup } from '@/hooks/use-active-group';

interface BookmarkInputProps {
  className?: string;
}

export function BookmarkInput({ className }: BookmarkInputProps) {
  const { activeGroup } = useActiveGroup();
  const [input, setInput] = React.useState('');
  const { addBookmark, isLoading } = useBookmarkActions(activeGroup?.id);
  const { setQuery } = useSearch();
  const inputRef = React.useRef(input);

  // Keep latest input value in ref to use in async operation
  React.useEffect(() => {
    inputRef.current = input;
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    setInput('');
    setQuery('');

    try {
      await addBookmark(currentInput);
    } catch (error) {
      setInput(currentInput);
      console.error('Failed to add bookmark:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Input
        type='text'
        placeholder={isLoading ? 'Processing...' : 'Add a bookmark...'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='pr-10'
        disabled={isLoading}
      />
      <button
        type='submit'
        className='absolute right-2 top-1/2 -translate-y-1/2'
        disabled={!input.trim() || isLoading}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
        ) : (
          <Plus className='h-4 w-4 text-muted-foreground' />
        )}
      </button>
    </form>
  );
}
