'use server';

import { auth } from '@/auth';
import { bookmarks } from '@/drizzle/models';
import drizzle from '@/drizzle';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { NewBookmark } from '@/types';

export async function getBookmarks(groupId: string) {
  const session = await auth();
  if (!session?.user) return [];

  const userBookmarks = await drizzle
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, session.user.id as string),
        eq(bookmarks.groupId, groupId)
      )
    )
    .orderBy(bookmarks.createdAt);

  return userBookmarks;
}

export async function createBookmark(data: NewBookmark) {
  const session = await auth();
  if (!session?.user) return null;

  try {
    // const validated = bookmarkSchema.parse(data)

    const [newBookmark] = await drizzle
      .insert(bookmarks)
      .values({
        ...data,
        userId: session.user.id as string,
      })
      .returning();
    console.log(newBookmark);
    return newBookmark;
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return null;
  }
}

export async function updateBookmark(id: string, content: string) {
  try {
    // Add your database update logic here
    const updated = await drizzle
      .update(bookmarks)
      .set({ content })
      .where(eq(bookmarks.id, id))
      .returning();

    return { data: updated };
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return { error: 'Failed to update bookmark' };
  }
}

export async function deleteBookmark(id: string) {
  try {
    // Add your database delete logic here
    await drizzle.delete(bookmarks).where(eq(bookmarks.id, id));

    return { success: true };
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return { error: 'Failed to delete bookmark' };
  }
}

export async function toggleFavorite(id: string) {
  const session = await auth();
  if (!session?.user) return false;

  const bookmark = await drizzle.query.bookmarks.findFirst({
    where: and(
      eq(bookmarks.id, id),
      eq(bookmarks.userId, session.user.id as string)
    ),
  });

  if (!bookmark) return false;

  await drizzle
    .update(bookmarks)
    .set({
      isFavorite: !bookmark.isFavorite,
      updatedAt: new Date(),
    })
    .where(
      and(eq(bookmarks.id, id), eq(bookmarks.userId, session.user.id as string))
    );

  return !bookmark.isFavorite;
}
