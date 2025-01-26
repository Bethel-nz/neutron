import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),
    GITHUB_OPENAI_API_KEY: z
      .string()
      .min(1, 'GITHUB_OPENAI_API_KEY is required for ai summary generation'),
    AUTH_SECRET: z
      .string()
      .min(
        1,
        'AUTH_SECRET is required , generate a random string or with "npx auth secret"'
      ),
  },

  runtimeEnv: process.env,

  emptyStringAsUndefined: true,
});
