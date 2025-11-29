/**
 * Unified Database Schema with UUIDs
 * 
 * Single source of truth for all database table definitions.
 * Uses UUID (text) IDs for consistency across server and client.
 * 
 * SERVER USAGE: Cloudflare D1 (via server.ts adapter)
 * CLIENT USAGE: Expo SQLite (via client.ts adapter)
 * 
 * All IDs are UUIDs (text) - no more integer/string conversions!
 */

import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { createId } from './utils';

// ============================================================================
// SHARED COLUMN DEFINITIONS
// ============================================================================

// Common timestamp columns
const timestampColumns = {
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
};

// Common sync metadata columns (for client cached tables)
const syncMetadataColumns = {
  cachedAt: integer('cached_at').default(sql`(strftime('%s', 'now'))`),
  lastSyncAt: integer('last_sync_at'),
};

const pendingColumn = {
  pending: integer('pending', { mode: 'boolean' }).default(false),
};

// Shared user fields (without ID)
const userFields = {
  name: text('name').notNull(),
  username: text('username').notNull(),
  email: text('email'),
  phone: text('phone'),
  avatar: text('avatar'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
};

// Shared trip fields (without ID and userId)
const tripFields = {
  title: text('title'),
  destination: text('destination'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budget: integer('budget'), // Integer for minor units (cents/rials)
  travelers: integer('travelers').default(1),
  preferences: text('preferences'),
  accommodation: text('accommodation'),
  status: text('status').default('in_progress'), // draft | planned | in_progress | active | past | cancelled
  aiReasoning: text('ai_reasoning'),
  itinerary: text('itinerary'),
  coordinates: text('coordinates'),
  waypoints: text('waypoints'), // JSON array of waypoints for route polyline
  // Hosted trip fields (when isHosted = true)
  isHosted: integer('is_hosted', { mode: 'boolean' }).default(false),
  location: text('location'), // For hosted trips
  price: real('price'), // For hosted trips
  currency: text('currency').default('USD'),
  rating: real('rating').default(0),
  reviews: integer('reviews').default(0),
  duration: integer('duration'),
  durationType: text('duration_type').default('days'),
  category: text('category'),
  difficulty: text('difficulty'),
  description: text('description'), // Full description for hosted trips
  shortDescription: text('short_description'),
  highlights: text('highlights'), // JSON array
  inclusions: text('inclusions'), // JSON array
  maxParticipants: integer('max_participants'),
  minParticipants: integer('min_participants').default(1),
  hostIntro: text('host_intro'),
  joinPolicy: text('join_policy').default('open'), // open, request, invite_only
  bookingInstructions: text('booking_instructions'), // Text describing off-app payment/coordination
  imageUrl: text('image_url'),
  gallery: text('gallery'), // JSON array
  tags: text('tags'), // JSON array
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  externalBookingUrl: text('external_booking_url'),
};

// tourFields removed - unified into tripFields with isHosted flag
// All tour fields are now part of trips table

// Shared place fields (without ID)
const placeFields = {
  name: text('name').notNull(),
  location: text('location').notNull(),
  distance: real('distance'),
  rating: real('rating').default(0),
  reviews: integer('reviews').default(0),
  type: text('type').notNull(),
  isOpen: integer('is_open', { mode: 'boolean' }).default(true),
  description: text('description').notNull(),
  tips: text('tips'),
  coordinates: text('coordinates').notNull(),
  phone: text('phone'),
  website: text('website'),
  hours: text('hours'),
};

// Shared message fields (without ID and userId)
const messageFields = {
  content: text('content').notNull(),
  type: text('type').default('text'),
  metadata: text('metadata'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
};

// ============================================================================
// SERVER TABLES (Cloudflare D1)
// ============================================================================

// Users table - core authentication and identity
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  username: text('username').unique().notNull(), // Handle/username
  email: text('email').unique(),
  passwordHash: text('password_hash'), // Server-only - optional for biometric users
  publicKey: text('public_key'), // For biometric authentication (wallet address or PEM)
  status: text('status').default('active'), // active, suspended, deleted
  ...timestampColumns,
});

// Profiles table - extended user information
export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  displayName: text('display_name'), // Full name (replaces users.name)
  bio: text('bio'), // User bio/description
  avatarUrl: text('avatar_url'), // Avatar URL (replaces users.avatar)
  phone: text('phone'), // Phone number
  homeBase: text('home_base'), // User's home location
  travelStyle: text('travel_style'), // Travel preferences/style
  languages: text('languages'), // JSON array of languages
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  ...timestampColumns,
});

// Challenge-response authentication table for biometric login
export const challenges = sqliteTable('challenges', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  username: text('username').notNull(),
  nonce: text('nonce').notNull(), // Random challenge string
  isRegister: integer('is_register', { mode: 'boolean' }).default(false),
  expiresAt: integer('expires_at').notNull(), // Unix timestamp
  used: integer('used', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  ...tripFields,
  aiGenerated: integer('ai_generated', { mode: 'boolean' }).default(true),
  metadata: text('metadata'),
  ...timestampColumns,
});

// tours table removed - unified into trips table with isHosted flag

// TODO(v3): Replace simple messages with E2E conversation-based schema:
// conversations, conversation_members, messages with conversationId + ciphertext + senderDeviceId.
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  ...messageFields,
  userId: text('user_id').references(() => users.id),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(), // No default - graphql-workers-subscriptions provides its own IDs
  connectionId: text('connectionId').notNull(), // camelCase to match graphql-workers-subscriptions
  connectionPoolId: text('connectionPoolId').notNull(), // camelCase to match graphql-workers-subscriptions
  subscription: text('subscription').notNull(),
  topic: text('topic').notNull(),
  filter: text('filter'),
  userId: text('user_id').references(() => users.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  expiresAt: text('expires_at'),
});

export const userPreferences = sqliteTable('user_preferences', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull().unique(),
  interests: text('interests'),
  budgetRange: text('budget_range'),
  travelStyle: text('travel_style'),
  preferredDestinations: text('preferred_destinations'),
  dietaryRestrictions: text('dietary_restrictions'),
  embedding: text('embedding'),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const itineraries = sqliteTable('itineraries', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tripId: text('trip_id').references(() => trips.id).notNull(),
  day: integer('day').notNull(),
  activities: text('activities'),
  accommodations: text('accommodations'),
  transport: text('transport'),
  notes: text('notes'),
  costEstimate: integer('cost_estimate'),
  ...timestampColumns,
});

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tripId: text('trip_id').references(() => trips.id),
  mapData: text('map_data'),
  details: text('details'),
  aiOutput: text('ai_output'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  content: text('content'),
  attachments: text('attachments'),
  type: text('type'),
  relatedId: text('related_id'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  // Polymorphic target (replaces postId)
  targetType: text('target_type').notNull(), // 'POST' | 'TRIP' | 'PLACE'
  targetId: text('target_id').notNull(),
  // Legacy postId for backward compatibility (deprecated, use targetType/targetId)
  postId: text('post_id').references(() => posts.id),
  userId: text('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const reactions = sqliteTable('reactions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  // Polymorphic target (replaces postId/commentId)
  targetType: text('target_type').notNull(), // 'POST' | 'COMMENT' | 'TRIP' | 'PLACE'
  targetId: text('target_id').notNull(),
  // Legacy fields for backward compatibility (deprecated, use targetType/targetId)
  postId: text('post_id').references(() => posts.id),
  commentId: text('comment_id').references(() => comments.id),
  userId: text('user_id').references(() => users.id).notNull(),
  emoji: text('emoji').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const bookmarks = sqliteTable('bookmarks', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  postId: text('post_id').references(() => posts.id),
  tripId: text('trip_id').references(() => trips.id), // Changed from tourId to tripId
  placeId: text('place_id').references(() => places.id),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const userSubscriptions = sqliteTable('user_subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  tier: text('tier').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  active: integer('active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  tripId: text('trip_id').references(() => trips.id), // Changed from tourId to tripId
  subscriptionId: text('subscription_id').references(() => userSubscriptions.id),
  transactionId: text('transaction_id').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('IRR'),
  status: text('status').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tripId: text('trip_id').references(() => trips.id).notNull(), // Changed from tourId to tripId
  userId: text('user_id').references(() => users.id).notNull(),
  participants: integer('participants').notNull().default(1),
  selectedDate: text('selected_date').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  specialRequests: text('special_requests'),
  totalPrice: real('total_price').notNull(),
  status: text('status').default('pending'),
  ...timestampColumns,
});

export const devices = sqliteTable('devices', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  deviceId: text('device_id').unique().notNull(), // Unique device identifier (e.g., UUID)
  publicKey: text('public_key').notNull(), // Public key for this device (used for signature verification)
  type: text('type'), // Device type (e.g., 'ios', 'android', 'web')
  lastSeen: text('last_seen').default(sql`(CURRENT_TIMESTAMP)`),
  ...timestampColumns,
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(), // recipient
  actorId: text('actor_id').references(() => users.id), // who caused it (nullable)
  type: text('type').notNull(), // e.g. 'like', 'comment', 'trip_update', 'message'
  targetType: text('target_type'), // e.g. 'POST', 'TRIP', 'PLACE', 'MESSAGE'
  targetId: text('target_id'), // id of that target
  data: text('data'), // extra JSON payload for UI
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Feed events (server)
export const feedEvents = sqliteTable('feed_events', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  entityType: text('entity_type').notNull(), // POST/TRIP/TOUR/PLACE/LOCATION
  entityId: text('entity_id').notNull(),
  actorId: text('actor_id').references(() => users.id).notNull(),
  verb: text('verb').notNull(), // CREATED/UPDATED
  topics: text('topics'), // JSON array of strings
  visibility: text('visibility').default('PUBLIC'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  rank: real('rank').default(0),
});

// Feed preferences (server, per user)
export const feedPreferences = sqliteTable('feed_preferences', {
  userId: text('user_id').references(() => users.id).primaryKey(),
  entityTypes: text('entity_types'), // JSON array of EntityType
  topics: text('topics'), // JSON array of strings
  followingOnly: integer('following_only', { mode: 'boolean' }).default(false),
  circleOnly: integer('circle_only', { mode: 'boolean' }).default(false),
  mutedUserIds: text('muted_user_ids'), // JSON array of IDs
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Follow graph
export const followEdges = sqliteTable(
  'follow_edges',
  {
    followerId: text('follower_id').references(() => users.id).notNull(),
    followeeId: text('followee_id').references(() => users.id).notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followeeId] }),
  }),
);

// Close friends
export const closeFriends = sqliteTable(
  'close_friends',
  {
    userId: text('user_id').references(() => users.id).notNull(),
    friendId: text('friend_id').references(() => users.id).notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.friendId] }),
  }),
);

// Search index (server)
export const searchIndex = sqliteTable('search_index', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  title: text('title'),
  text: text('text'),
  tags: text('tags'),
  locationName: text('location_name'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
  lang: text('lang'),
  tokens: text('tokens'),
  trigrams: text('trigrams'),
});

// Embeddings metadata (reference to Vectorize index)
export const embeddingsMeta = sqliteTable('embeddings_meta', {
  id: text('id').primaryKey().$defaultFn(() => createId()), // local meta id
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  vectorId: text('vector_id').notNull(), // id in vector index
  model: text('model').notNull(),
  lang: text('lang'),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const locations = sqliteTable('locations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').unique().notNull(),
  country: text('country').notNull(),
  coordinates: text('coordinates'),
  description: text('description'),
  popularActivities: text('popular_activities'),
  averageCost: integer('average_cost'),
  bestTimeToVisit: text('best_time_to_visit'),
  population: text('population'),
  embedding: text('embedding'),
  imageUrl: text('image_url'),
  ...timestampColumns,
});

export const places = sqliteTable('places', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  ...placeFields,
  locationId: text('location_id').references(() => locations.id),
  price: integer('price'),
  ownerId: text('owner_id').references(() => users.id),
  embedding: text('embedding'),
  imageUrl: text('image_url'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const thoughts = sqliteTable('thoughts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tripId: text('trip_id').references(() => trips.id).notNull(),
  step: text('step').notNull(),
  data: text('data'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// ============================================================================
// TRIP PARTICIPANTS (Phase 11: Unified Trip + Manual Booking, No Payments)
// ============================================================================
// Safarnak does NOT process in-app payments for trips/tours.
// Booking = joinTrip + manual coordination outside the app.
// Payments are only used for subscriptions in separate billing modules.

export const tripParticipants = sqliteTable('trip_participants', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tripId: text('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('MEMBER'), // 'HOST' | 'CO_HOST' | 'MEMBER'
  joinStatus: text('join_status').notNull().default('REQUESTED'), // 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED_BY_USER' | 'CANCELLED_BY_HOST'
  notes: text('notes'), // Free-text notes (e.g., "paid externally", coordination notes)
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// Optional: Trip check-ins (for offline/crypto check-in model)
export const tripCheckins = sqliteTable('trip_checkins', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tripId: text('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  participantId: text('participant_id').notNull().references(() => tripParticipants.id, { onDelete: 'cascade' }),
  sessionId: text('session_id').notNull(), // Unique session identifier
  signedByLeader: text('signed_by_leader').notNull(), // Cryptographic signature from trip leader
  signedByParticipant: text('signed_by_participant').notNull(), // Cryptographic signature from participant
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// ============================================================================
// TRIP ITINERARY STRUCTURE (Phase 11)
// ============================================================================
// Structured itinerary: trip_days → trip_items
// Replaces flat JSON itinerary field for better querying and organization

export const tripDays = sqliteTable('trip_days', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tripId: text('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  dayIndex: integer('day_index').notNull(), // 1, 2, 3... (day number in trip)
  date: text('date'), // ISO date string for this day (optional, can be computed from trip startDate + dayIndex)
  title: text('title'), // e.g., "Day 1: Arrival", "Day 2: Exploring"
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const tripItems = sqliteTable('trip_items', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tripDayId: text('trip_day_id').notNull().references(() => tripDays.id, { onDelete: 'cascade' }),
  placeId: text('place_id').references(() => places.id), // Optional: link to a place
  time: text('time'), // e.g., "09:00", "14:30" (optional)
  title: text('title').notNull(), // e.g., "Breakfast at Cafe", "Visit Museum"
  description: text('description'), // Detailed description
  metadata: text('metadata'), // JSON for additional data (duration, cost, notes, etc.)
  order: integer('order').default(0), // Order within the day
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// ============================================================================
// CLIENT CACHED TABLES (Expo SQLite)
// ============================================================================

export const cachedUsers = sqliteTable('cached_users', {
  id: text('id').primaryKey(),
  ...userFields,
  username: text('username').notNull(),
  ...timestampColumns,
  ...syncMetadataColumns,
  ...pendingColumn,
});

export const cachedTrips = sqliteTable('cached_trips', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  ...tripFields,
  ...timestampColumns,
  ...syncMetadataColumns,
  ...pendingColumn,
  deletedAt: integer('deleted_at'),
});

// cachedTours removed - unified into cachedTrips with isHosted flag

// Cached profiles table (mirrors profiles table from server)
export const cachedProfiles = sqliteTable('cached_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // FK to cachedUsers
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  homeBase: text('home_base'),
  travelStyle: text('travel_style'),
  languages: text('languages'), // JSON array
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  ...timestampColumns,
  ...syncMetadataColumns,
  ...pendingColumn,
});

export const cachedPlaces = sqliteTable('cached_places', {
  id: text('id').primaryKey(),
  ...placeFields,
  ...timestampColumns,
  ...syncMetadataColumns,
});

// Cached trip participants (mirrors tripParticipants table)
export const cachedTripParticipants = sqliteTable('cached_trip_participants', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').notNull(), // FK to cachedTrips
  userId: text('user_id').notNull(), // FK to cachedUsers
  role: text('role').notNull().default('MEMBER'), // 'HOST' | 'CO_HOST' | 'MEMBER'
  joinStatus: text('join_status').notNull().default('REQUESTED'), // 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED_BY_USER' | 'CANCELLED_BY_HOST'
  notes: text('notes'),
  ...timestampColumns,
  ...syncMetadataColumns,
  ...pendingColumn,
});

// Cached trip days (mirrors tripDays table)
export const cachedTripDays = sqliteTable('cached_trip_days', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').notNull(), // FK to cachedTrips
  dayIndex: integer('day_index').notNull(), // 1, 2, 3...
  date: text('date'), // ISO date string
  title: text('title'),
  ...timestampColumns,
  ...syncMetadataColumns,
  ...pendingColumn,
});

// Cached trip items (mirrors tripItems table)
export const cachedTripItems = sqliteTable('cached_trip_items', {
  id: text('id').primaryKey(),
  tripDayId: text('trip_day_id').notNull(), // FK to cachedTripDays
  placeId: text('place_id'), // Optional FK to cachedPlaces
  time: text('time'), // e.g., "09:00"
  title: text('title').notNull(),
  description: text('description'),
  metadata: text('metadata'), // JSON
  order: integer('order').default(0),
  ...timestampColumns,
  ...syncMetadataColumns,
  ...pendingColumn,
});

export const cachedMessages = sqliteTable('cached_messages', {
  id: text('id').primaryKey(),
  ...messageFields,
  userId: text('user_id'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  ...syncMetadataColumns,
  ...pendingColumn,
});

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

// Apollo Cache Entries - Raw normalized cache storage for Apollo Client persistence
export const apolloCacheEntries = sqliteTable('apollo_cache_entries', {
  key: text('key').primaryKey(), // Apollo cache key (e.g., "User:123", "ROOT_QUERY")
  value: text('value').notNull(), // JSON string of normalized cache entry
  entityType: text('entity_type'), // Extracted __typename (null for ROOT_QUERY, etc.)
  entityId: text('entity_id'), // Extracted ID (null for ROOT_QUERY, etc.)
  updatedAt: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
});

// Map tile cache table (client-only)
export const cachedMapTiles = sqliteTable('cached_map_tiles', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  layer: text('layer').notNull(), // 'standard', 'satellite', 'terrain'
  z: integer('z').notNull(), // Zoom level
  x: integer('x').notNull(), // Tile X coordinate
  y: integer('y').notNull(), // Tile Y coordinate
  filePath: text('file_path').notNull(), // Local file path to cached tile
  fileSize: integer('file_size').notNull(), // File size in bytes
  cachedAt: integer('cached_at').default(sql`(strftime('%s', 'now'))`), // When tile was cached
  lastAccessed: integer('last_accessed').default(sql`(strftime('%s', 'now'))`), // Last access time for LRU
});

// ============================================================================
// RELATIONSHIPS
// ============================================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  messages: many(messages),
  subscriptions: many(subscriptions),
  preferences: one(userPreferences),
  trips: many(trips),
  posts: many(posts),
  comments: many(comments),
  reactions: many(reactions),
  payments: many(payments),
  userSubscriptions: many(userSubscriptions),
  devices: many(devices),
  notifications: many(notifications),
  places: many(places),
}));

export const tripsRelations = relations(trips, ({ many, one }) => ({
  user: one(users, { fields: [trips.userId], references: [users.id] }),
  itineraries: many(itineraries),
  plans: many(plans),
  thoughts: many(thoughts),
}));

// toursRelations removed - tours table unified into trips

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.userId], references: [users.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
}));

export const itinerariesRelations = relations(itineraries, ({ one }) => ({
  trip: one(trips, { fields: [itineraries.tripId], references: [trips.id] }),
}));

export const plansRelations = relations(plans, ({ one }) => ({
  trip: one(trips, { fields: [plans.tripId], references: [trips.id] }),
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
  reactions: many(reactions),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  post: one(posts, { fields: [reactions.postId], references: [posts.id] }),
  comment: one(comments, { fields: [reactions.commentId], references: [comments.id] }),
  user: one(users, { fields: [reactions.userId], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  trip: one(trips, { fields: [payments.tripId], references: [trips.id] }), // Changed from tour to trip
  subscription: one(userSubscriptions, { fields: [payments.subscriptionId], references: [userSubscriptions.id] }),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one, many }) => ({
  user: one(users, { fields: [userSubscriptions.userId], references: [users.id] }),
  payments: many(payments),
}));

export const devicesRelations = relations(devices, ({ one }) => ({
  user: one(users, { fields: [devices.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  places: many(places),
}));

export const placesRelations = relations(places, ({ one }) => ({
  location: one(locations, { fields: [places.locationId], references: [locations.id] }),
  owner: one(users, { fields: [places.ownerId], references: [users.id] }),
}));

export const thoughtsRelations = relations(thoughts, ({ one }) => ({
  trip: one(trips, { fields: [thoughts.tripId], references: [trips.id] }),
}));

export const feedEventsRelations = relations(feedEvents, ({ one }) => ({
  actor: one(users, { fields: [feedEvents.actorId], references: [users.id] }),
}));

// ============================================================================
// SCHEMA EXPORTS
// ============================================================================

// Note: serverSchema is now exported from './server.ts' to keep server-related code together
// This file only exports table definitions and clientSchema

// Client schema (for local database)
export const clientSchema = {
  cachedUsers,
  cachedProfiles,
  cachedTrips,
  cachedTripParticipants,
  cachedTripDays,
  cachedTripItems,
  cachedPlaces,
  cachedMessages,
  pendingMutations,
  syncMetadata,
  apolloCacheEntries,
  cachedMapTiles,
};
