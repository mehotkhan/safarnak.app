import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ============================================================================
// CLEANED UP SCHEMA - Only essential tables for Safarnak travel app
// ============================================================================

// Users table - core user information
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  email: text('email').unique(),
  phone: text('phone'),
  avatar: text('avatar'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Tours table - travel experiences and packages
export const tours = sqliteTable('tours', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  price: integer('price').notNull(), // Price in cents
  currency: text('currency').default('USD'),
  duration: integer('duration'), // Duration in hours
  durationType: text('duration_type').default('hours'), // hours, days, weeks
  location: text('location').notNull(),
  coordinates: text('coordinates'), // JSON: {lat, lng}
  category: text('category'), // adventure, cultural, nature, etc.
  difficulty: text('difficulty').default('easy'), // easy, medium, hard
  maxParticipants: integer('max_participants'),
  minParticipants: integer('min_participants').default(1),
  imageUrl: text('image_url'),
  gallery: text('gallery'), // JSON array of image URLs
  tags: text('tags'), // JSON array of tags
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Messages table - real-time communication
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  type: text('type').default('text'), // text, image, file, system
  metadata: text('metadata'), // JSON for additional data
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

// GraphQL subscriptions management
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  connectionId: text('connection_id').notNull(),
  connectionPoolId: text('connection_pool_id').notNull(),
  subscription: text('subscription').notNull(),
  topic: text('topic').notNull(),
  filter: text('filter'),
  userId: integer('user_id').references(() => users.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  expiresAt: text('expires_at'),
});

// ============================================================================
// RELATIONSHIPS
// ============================================================================

// Define relationships for better type safety
export const usersRelations = {
  messages: messages,
  subscriptions: subscriptions,
};

export const toursRelations = {
  // Tours can be extended later with relationships
};

export const messagesRelations = {
  user: users,
};

export const subscriptionsRelations = {
  user: users,
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export only the essential tables
export const schema = {
  users,
  tours,
  messages,
  subscriptions,
};

// Default export
export default schema;
