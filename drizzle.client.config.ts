import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './database/client-migrations.ts',
  out: './migrations/client',
  dialect: 'sqlite',
  driver: 'expo',
  verbose: true,
  strict: true,
});


