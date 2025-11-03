/**
 * Drizzle Schema - All Table Definitions
 * 
 * Unified schema file containing:
 * - Base tables (shared between server and client)
 * - Server-only extensions (passwordHash, subscriptions, etc.)
 * - Client-only extensions (cached tables with sync metadata)
 * 
 * IMPORTANT:
 * - Use SQLite-compatible types only
 * - IDs match GraphQL ID type (text/string)
 * - Fields match GraphQL schema where applicable
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================================================
// BASE TABLES (Shared between server and client)
// ============================================================================

export const usersBase = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull(),
  email: text('email'),
  phone: text('phone'),
  avatar: text('avatar'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const tripsBase = sqliteTable('trips', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title'),
  destination: text('destination'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budget: real('budget'),
  travelers: integer('travelers').notNull().default(1),
  preferences: text('preferences'),
  accommodation: text('accommodation'),
  status: text('status').notNull().default('in_progress'),
  aiReasoning: text('ai_reasoning'),
  itinerary: text('itinerary'),
  coordinates: text('coordinates'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const toursBase = sqliteTable('tours', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  price: real('price').notNull(),
  rating: real('rating').notNull().default(0),
  reviews: integer('reviews').notNull().default(0),
  duration: integer('duration').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  highlights: text('highlights'),
  inclusions: text('inclusions'),
  maxParticipants: integer('max_participants'),
  difficulty: text('difficulty').notNull().default('easy'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const placesBase = sqliteTable('places', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  distance: real('distance'),
  rating: real('rating').notNull().default(0),
  reviews: integer('reviews').notNull().default(0),
  category: text('category').notNull(),
  isOpen: integer('is_open', { mode: 'boolean' }).notNull().default(true),
  description: text('description').notNull(),
  tips: text('tips'),
  coordinates: text('coordinates').notNull(),
  phone: text('phone'),
  website: text('website'),
  hours: text('hours'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const messagesBase = sqliteTable('messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  userId: text('user_id'),
  type: text('type').default('text'),
  metadata: text('metadata'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// ============================================================================
// SERVER-ONLY TABLES & EXTENSIONS
// ============================================================================

/**
 * Extended users table with server-only fields (passwordHash)
 */
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull(),
  email: text('email'),
  phone: text('phone'),
  avatar: text('avatar'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
  passwordHash: text('password_hash').notNull(), // Server-only
});

/**
 * Server-only tables (not cached on client)
 */
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  connectionId: text('connection_id').notNull(),
  connectionPoolId: text('connection_pool_id').notNull(),
  subscription: text('subscription').notNull(),
  topic: text('topic').notNull(),
  filter: text('filter'),
  userId: text('user_id'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  expiresAt: text('expires_at'),
});

export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique(),
  interests: text('interests'),
  budgetRange: text('budget_range'),
  travelStyle: text('travel_style'),
  preferredDestinations: text('preferred_destinations'),
  dietaryRestrictions: text('dietary_restrictions'),
  embedding: text('embedding'),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// ============================================================================
// CLIENT-ONLY TABLES (Cached tables with sync metadata)
// ============================================================================

export const cachedUsers = sqliteTable('cached_users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull(),
  email: text('email'),
  phone: text('phone'),
  avatar: text('avatar'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
  cachedAt: integer('cached_at').default(sql`(strftime('%s', 'now'))`),
  lastSyncAt: integer('last_sync_at'),
  pending: integer('pending', { mode: 'boolean' }).default(false),
});

export const cachedTrips = sqliteTable('cached_trips', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title'),
  destination: text('destination'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budget: real('budget'),
  travelers: integer('travelers').notNull().default(1),
  preferences: text('preferences'),
  accommodation: text('accommodation'),
  status: text('status').notNull().default('in_progress'),
  aiReasoning: text('ai_reasoning'),
  itinerary: text('itinerary'),
  coordinates: text('coordinates'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
  cachedAt: integer('cached_at').default(sql`(strftime('%s', 'now'))`),
  lastSyncAt: integer('last_sync_at'),
  pending: integer('pending', { mode: 'boolean' }).default(false),
  deletedAt: integer('deleted_at'),
});

export const cachedTours = sqliteTable('cached_tours', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  price: real('price').notNull(),
  rating: real('rating').notNull().default(0),
  reviews: integer('reviews').notNull().default(0),
  duration: integer('duration').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  highlights: text('highlights'),
  inclusions: text('inclusions'),
  maxParticipants: integer('max_participants'),
  difficulty: text('difficulty').notNull().default('easy'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
  cachedAt: integer('cached_at').default(sql`(strftime('%s', 'now'))`),
  lastSyncAt: integer('last_sync_at'),
});

export const cachedPlaces = sqliteTable('cached_places', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  distance: real('distance'),
  rating: real('rating').notNull().default(0),
  reviews: integer('reviews').notNull().default(0),
  category: text('category').notNull(),
  isOpen: integer('is_open', { mode: 'boolean' }).notNull().default(true),
  description: text('description').notNull(),
  tips: text('tips'),
  coordinates: text('coordinates').notNull(),
  phone: text('phone'),
  website: text('website'),
  hours: text('hours'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
  cachedAt: integer('cached_at').default(sql`(strftime('%s', 'now'))`),
  lastSyncAt: integer('last_sync_at'),
});

export const cachedMessages = sqliteTable('cached_messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  userId: text('user_id'),
  type: text('type').default('text'),
  metadata: text('metadata'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  cachedAt: integer('cached_at').default(sql`(strftime('%s', 'now'))`),
  lastSyncAt: integer('last_sync_at'),
  pending: integer('pending', { mode: 'boolean' }).default(false),
});

/**
 * Client-only sync management tables
 */
export const pendingMutations = sqliteTable('pending_mutations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  operationName: text('operation_name').notNull(),
  variables: text('variables').notNull(),
  mutation: text('mutation').notNull(),
  queuedAt: integer('queued_at').default(sql`(strftime('%s', 'now'))`),
  retries: integer('retries').default(0),
  lastError: text('last_error'),
});

export const syncMetadata = sqliteTable('sync_metadata', {
  entityType: text('entity_type').primaryKey(),
  lastSyncAt: integer('last_sync_at'),
  schemaVersion: integer('schema_version').default(1),
});

// ============================================================================
// SCHEMA EXPORTS (for client usage)
// ============================================================================

export const clientSchema = {
  cachedUsers,
  cachedTrips,
  cachedTours,
  cachedPlaces,
  cachedMessages,
  pendingMutations,
  syncMetadata,
};

export const baseSchema = {
  users: usersBase,
  trips: tripsBase,
  tours: toursBase,
  places: placesBase,
  messages: messagesBase,
};

export const serverSchema = {
  users,
  subscriptions,
  userPreferences,
};

