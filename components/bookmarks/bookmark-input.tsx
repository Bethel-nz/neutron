'use client';

import { Input } from '@/components/ui/input';
import { useActiveGroup } from '@/hooks/use-active-group';
import { cn } from '@/lib/utils';
import { useSearch } from '@/store/use-search';
import { Loader2, Plus } from 'lucide-react';
import * as React from 'react';
import { useBookmarkActions } from './hooks/use-bookmark-actions';

interface BookmarkInputProps {
  className?: string;
}

export function BookmarkInput({ className }: BookmarkInputProps) {
  const { activeGroup } = useActiveGroup();
  const [input, setInput] = React.useState('');
  const { addBookmark, isLoading } = useBookmarkActions(activeGroup?.id);
  const { setQuery } = useSearch();
  const inputRef = React.useRef(input);

  React.useEffect(() => {
    inputRef.current = input;
  }, [input]);

  const formatContent = (content: string) => {
    try {
      new URL(content);
      return content;
    } catch {
      return content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('\n');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    setInput('');
    setQuery('');

    try {
      const formattedContent = formatContent(currentInput);
      await addBookmark(formattedContent);
    } catch (error) {
      setInput(currentInput);
      console.error('Failed to add bookmark:', error);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    setInput(pastedText); // This will preserve the formatting
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Input
        type='text'
        placeholder={isLoading ? 'Processing...' : 'Add a bookmark...'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPaste={handlePaste}
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
