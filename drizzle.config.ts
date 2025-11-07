import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Use server.ts which exports serverSchema as 'schema' (server tables only)
  // This ensures migrations only include server tables, excluding client-only cached tables
  schema: './database/server.ts',
  out: './migrations', // Server-only migrations (Cloudflare D1)
  dialect: 'sqlite',
  verbose: true,
  strict: true,
});
