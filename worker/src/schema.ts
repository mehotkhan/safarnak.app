import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  connectionId: text('connectionId').notNull(),
  connectionPoolId: text('connectionPoolId').notNull(),
  subscription: text('subscription').notNull(),
  topic: text('topic').notNull(),
  filter: text('filter'),
});