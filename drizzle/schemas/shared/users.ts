import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Base users table - contains only the core fields that both client and server need
// This is the minimal shared schema
export const usersBase = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
});

// For backward compatibility, export as 'users' for now
// This will be refactored to use usersBase in the future
export const users = usersBase;
