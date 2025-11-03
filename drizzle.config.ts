import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './database/server-schema.ts', // Only server tables (excludes client cached tables)
  out: './database/migrations',
  dialect: 'sqlite',
  verbose: true,
  strict: true,
});
