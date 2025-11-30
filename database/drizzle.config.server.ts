import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Use server.ts which exports serverSchema as 'schema' (server tables only)
  // This ensures migrations only include server tables, excluding client-only cached tables
  schema: './database/server.ts', // Relative to project root (where command is run)
  out: './migrations/server', // Server-only migrations (Cloudflare D1) - relative to project root
  dialect: 'sqlite',
  verbose: true,
  strict: true,
});

