import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './database/drizzle.ts',
  out: './database/migrations',
  dialect: 'sqlite',
  verbose: true,
  strict: true,
});
