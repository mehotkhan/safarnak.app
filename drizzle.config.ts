import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './database/schema.ts', // Unified schema (server tables only exported as 'schema')
  out: './migrations', // Server-only migrations (Cloudflare D1)
  dialect: 'sqlite',
  verbose: true,
  strict: true,
});
