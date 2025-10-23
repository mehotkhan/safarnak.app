import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '../drizzle/schemas/client/index.ts',
  out: '../drizzle/migrations/client',
  dialect: 'sqlite',
  driver: 'expo',
});
