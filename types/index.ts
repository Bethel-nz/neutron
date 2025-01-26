import { bookmarks, bookmarkTypes, groups, users } from '@/drizzle/models';

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

export type User = typeof users.$inferSelect;

export type Defined<T> = T extends undefined ? never : T;

export type NewBookmark = typeof bookmarks.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect & {
  id?: string;
  syncStatus?: 'synced' | 'pending' | 'error';
};

export type BookmarkType = (typeof bookmarkTypes.enumValues)[number];
