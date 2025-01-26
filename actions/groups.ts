// app/actions.ts
'use server'

import { auth } from '@/auth'
import drizzle from '@/drizzle'
import { groups } from '@/drizzle/models'
import { Group } from '@/types'
import { eq } from 'drizzle-orm'
import {sleep} from "@/lib/utils"

export async function getGroups(userId: string): Promise<Group[] | []> {
	const session = await auth();
	if (!session) return [];

	await sleep()
	const userGroups = await drizzle
		.select()
		.from(groups)
		.where(eq(groups.userId, userId));

	// Proper sorting with type-safe date handling
	const sortedGroups = userGroups.sort((a, b) => {
		
		const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt!);
		const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt!);
		return aDate.getTime() - bDate.getTime();
	});

	// Type-safe way to add isDefault property
	const groupsWithDefault = sortedGroups.map((group, index) => ({
		...group,
		isDefault: index === 0
	})) as (Group & { isDefault: boolean })[];

	return groupsWithDefault;
}

export async function newGroup(name: string, slug: string, userId: string): Promise<Group | null> {
    try {
        const session = await auth();
        if (!session) return null;

        const [newGroup] = await drizzle.insert(groups)
            .values({ name, slug, userId })
            .returning();

        return newGroup as Group;
    } catch (error) {
        console.error('Error creating group:', error);
        return null;
    }
}