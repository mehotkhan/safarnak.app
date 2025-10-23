import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Client-specific users table - extends the base with client-only fields
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  // Add client-specific fields here when needed
  // Example: lastSyncAt, offlineData, etc.
});

// Client-specific tables
export const clientTables = {
  // Add client-specific tables here when needed
  // Example: local cache tables, offline sync tables, etc.
};
