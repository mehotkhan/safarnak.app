import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Use the unified schema so drizzle-kit can see all sqliteTable definitions.
  // Client DB will get both server and cached tables, which is safe for offline cache.
  schema: './database/schema.ts', // Relative to project root (where command is run)
  out: './migrations/client', // Client migrations folder (separate from server migrations) - relative to project root
  dialect: 'sqlite',
  driver: 'expo', // Important for Expo SQLite
  verbose: true,
  strict: true,
});

