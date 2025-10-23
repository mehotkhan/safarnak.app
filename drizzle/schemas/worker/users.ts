import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Extended users table for server - includes server-only fields
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});
