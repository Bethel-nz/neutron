'use client';

import { deleteBookmark, updateBookmark } from '@/actions/bookmarks';
import {
  FloatingActionPanelButton,
  FloatingActionPanelContent,
  FloatingActionPanelForm,
  FloatingActionPanelRoot,
  FloatingActionPanelTextarea,
  FloatingActionPanelTrigger,
} from '@/components/ui/floating-action-panel';
import { queryClient } from '@/query.client';
import type { Bookmark } from '@/types';
import { Copy, MoreVertical, Pencil, Trash } from 'lucide-react';
import * as React from 'react';
import { startTransition, useActionState } from 'react';
import { toast } from 'sonner';

interface BookmarkActionsProps {
  bookmark: Bookmark;
}

export function BookmarkActions({ bookmark }: BookmarkActionsProps) {
  const [editError, editAction, isEditPending] = useActionState(
    async (_: null | string, formData: FormData) => {
      const content = formData.get('content') as string;
      const result = await updateBookmark(bookmark.id, content);
      if (result?.error) {
        toast.error(result.error);
        return result.error;
      }
      toast.success('Bookmark updated');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      return null;
    },
    null
  );

  const [panelMode, setPanelMode] = React.useState<'actions' | 'note'>(
    'actions'
  );

  const [, deleteAction, isDeletePending] = useActionState(async () => {
    try {
      const result = await deleteBookmark(bookmark.id);
      if (result?.error) {
        toast.error(result.error);
        return result.error;
      }
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark deleted');
      return null;
    } catch (error) {
      toast.error('Failed to delete bookmark');
      return 'Failed to delete bookmark';
    }
  }, null);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      startTransition(() => {
        deleteAction();
      });
    }
  };

  const handleShare = () => {
    const textToCopy = bookmark.url || bookmark.content;
    if (!textToCopy) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success(
          `${bookmark.url ? 'URL' : 'Content'} copied to clipboard`
        );
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <FloatingActionPanelRoot>
      {({ mode }) => (
        <>
          <FloatingActionPanelTrigger
            mode={panelMode}
            className='h-8 w-8 shrink-0 flex items-center justify-center relative z-10'
          >
            <MoreVertical className='h-4 w-4 block md:hidden group-hover:block' />
          </FloatingActionPanelTrigger>

          <FloatingActionPanelContent className='z-50'>
            {mode === 'actions' ? (
              <div className='space-y-1 p-2 relative'>
                {bookmark.type === 'article' && (
                  <FloatingActionPanelButton
                    onClick={() => setPanelMode('note')}
                    className='w-full flex items-center gap-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 px-2 py-1.5 rounded-md'
                  >
                    <Pencil className='h-4 w-4' />
                    <span>Edit Content</span>
                  </FloatingActionPanelButton>
                )}
                <FloatingActionPanelButton
                  onClick={handleDelete}
                  disabled={isDeletePending}
                  className='w-full flex items-center gap-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 px-2 py-1.5 rounded-md text-destructive'
                >
                  <Trash className='h-4 w-4' />
                  <span>{isDeletePending ? 'Deleting...' : 'Delete'}</span>
                </FloatingActionPanelButton>
                <FloatingActionPanelButton
                  onClick={handleShare}
                  className='w-full flex items-center gap-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 px-2 py-1.5 rounded-md'
                >
                  <Copy className='h-4 w-4' />
                  <span>Copy {bookmark.url ? 'URL' : 'Content'}</span>
                </FloatingActionPanelButton>
              </div>
            ) : (
              <FloatingActionPanelForm
                onSubmit={(content) => {
                  const formData = new FormData();
                  formData.append('content', content);
                  startTransition(() => {
                    editAction(formData);
                  });
                  setPanelMode('actions');
                }}
                className='p-2 min-w-[300px] relative'
              >
                <FloatingActionPanelTextarea
                  className='mb-2 h-24 w-full p-2 rounded-md border'
                  id='bookmark-content'
                  defaultValue={bookmark.content || ''}
                  disabled={isEditPending}
                />
                <div className='flex justify-between'>
                  <button
                    type='button'
                    onClick={() => setPanelMode('actions')}
                    className='flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800'
                    disabled={isEditPending}
                  >
                    {isEditPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                {editError && (
                  <p className='text-sm text-destructive mt-2'>{editError}</p>
                )}
              </FloatingActionPanelForm>
            )}
          </FloatingActionPanelContent>
        </>
      )}
    </FloatingActionPanelRoot>
  );
}
