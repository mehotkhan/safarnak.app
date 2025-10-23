import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: [
    './drizzle/schemas/shared/*.ts',
    './drizzle/schemas/worker/*.ts',
  ],
  out: './drizzle/migrations',
  dialect: 'sqlite',
  // Note: This config is for the full server schema
  // Client configs will reference only their specific schemas
});
