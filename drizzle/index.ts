"server-only"

import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleClient } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { env } from '@/env';

const sql = neon(env.DATABASE_URL);
const drizzle = drizzleClient({ client: sql, schema: schema });

export default drizzle;
