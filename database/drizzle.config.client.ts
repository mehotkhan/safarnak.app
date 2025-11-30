import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Use client-schema.ts which exports clientSchema as 'schema' (client cached tables only)
  // This ensures migrations only include client tables, excluding server-only tables
  schema: './database/client-schema.ts', // Relative to project root (where command is run)
  out: './migrations/client', // Client migrations folder (separate from server migrations) - relative to project root
  dialect: 'sqlite',
  driver: 'expo', // Important for Expo SQLite
  verbose: true,
  strict: true,
});

