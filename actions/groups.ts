// app/actions.ts
'use server';

import { auth } from '@/auth';
import drizzle from '@/drizzle';
import { groups } from '@/drizzle/models';
import { Group } from '@/types';
import { eq, desc } from 'drizzle-orm';
import { sleep } from '@/lib/utils';

export async function getGroups(userId: string): Promise<Group[] | []> {
  if (!userId) return [];

  const userGroups = await drizzle.query.groups.findMany({
    where: eq(groups.userId, userId),
    orderBy: (groups, { desc }) => [desc(groups.createdAt)],
  });

  // If no groups exist, create default group
  if (userGroups.length === 0) {
    const [defaultGroup] = await drizzle
      .insert(groups)
      .values({
        userId,
        name: 'bookmarks',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return [defaultGroup];
  }

  return userGroups;
}

export async function newGroup(
  name: string,
  userId: string
): Promise<Group | null> {
  if (!userId) throw new Error('Unauthorized');

  const [group] = await drizzle
    .insert(groups)
    .values({
      userId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return group;
}
