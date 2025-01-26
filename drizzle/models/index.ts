import { pgTable, text, timestamp, uuid, boolean, pgEnum, primaryKey, integer, varchar, index } from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from "next-auth/adapters"
import { relations, sql } from 'drizzle-orm'

// Enums
export const contentType = pgEnum('content_type', ['article', 'youtube', 'video', 'other'])
export const readStatus = pgEnum('read_status', ['unread', 'reading', 'completed'])

// Users table
export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name'),
	email: text('email').notNull().unique(),
	emailVerified: timestamp('email_verified', { mode: 'date' }),
	image: text('image'),
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow(),
})


export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	})
)


export const accounts = pgTable(
	"account",
	{
		userId: uuid("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
	})
)

// Sessions table for Next-auth
export const sessions = pgTable('session', {
	sessionToken: text('session_token').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
})

// Feels l


export const groups = pgTable('groups', {
	id: uuid('id').defaultRandom().primaryKey().default(sql`gen_random_uuid()`),
	userId: uuid('user_id').notNull().references(() => users.id),
	name: varchar('name', { length: 255 }).notNull().unique(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
	userIdIdx: index('groups_user_id_idx').on(table.userId),
	nameIdx: index('groups_name_idx').on(table.name),
	slugIdx: index('groups_slug_idx').on(table.slug),
	createdAtIdx: index('groups_created_at_idx').on(table.createdAt),
}));

export const bookmarkTypes = pgEnum('bookmark_type', ['webpage', 'file', "article"])


export const bookmarks = pgTable('bookmarks', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').notNull().references(() => users.id),
	groupId: uuid('group_id').references(() => groups.id, {
		onDelete: 'cascade', onUpdate: 'set default'
	}),
	content: text('content'),
	description: text('description').default(''),
	url: text('url'),
	isFavorite: boolean('is_favorite').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	type: bookmarkTypes('type').default('webpage'),
}, (table) => ({
	userIdIdx: index('bookmarks_user_id_idx').on(table.userId),
	groupIdIdx: index('bookmarks_group_id_idx').on(table.groupId),
	typeIdx: index('bookmarks_type_idx').on(table.type),
	createdAtIdx: index('bookmarks_created_at_idx').on(table.createdAt),
	urlIdx: index('bookmarks_url_idx').on(table.url),
	isFavoriteIdx: index('bookmarks_is_favorite_idx').on(table.isFavorite),
}));


// Relationships
export const usersRelations = relations(users, ({ many }) => ({
	groups: many(groups),
	bookmarks: many(bookmarks),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
	user: one(users, {
		fields: [groups.userId],
		references: [users.id],
	}),
	bookmarks: many(bookmarks),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id],
	}),
	group: one(groups, {
		fields: [bookmarks.groupId],
		references: [groups.id],
	}),
}));