import type { Config } from 'drizzle-kit'
import { env } from '@/env'

export default {
	schema: './drizzle/schema.ts',
	out: './drizzle/meta_records',
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL as string,
	},
	verbose: true,
	strict: true,
} satisfies Config 