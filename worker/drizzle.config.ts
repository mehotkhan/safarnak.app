import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: '../drizzle/schemas/worker/index.ts',
  out: '../drizzle/migrations/worker',
});