/**
 * Database Module Exports
 * 
 * Central export point for all database functionality.
 * 
 * SERVER USAGE:
 *   import { getServerDB, users, trips } from '@database/server';
 *   const db = getServerDB(context.env.DB);
 * 
 * CLIENT USAGE:
 *   import { getLocalDB } from '@database/client';
 *   import { drizzleCacheStorage } from '@api'; // Cache storage is in @api
 *   const db = await getLocalDB();
 */

// Server exports (Cloudflare D1)
export { getServerDB, type ServerDB, serverSchema, schema } from './server';
export {
  // Server tables
  users,
  trips,
  messages,
  conversations,
  conversationMembers,
  chatMessages,
  messageReceipts,
  chatInvites,
  subscriptions,
  userPreferences,
  itineraries,
  plans,
  posts,
  comments,
  reactions,
  userSubscriptions,
  payments,
  devices,
  notifications,
  locations,
  places,
  thoughts,
  // Relationships
  usersRelations,
  tripsRelations,
  messagesRelations,
  subscriptionsRelations,
  userPreferencesRelations,
  itinerariesRelations,
  plansRelations,
  postsRelations,
  commentsRelations,
  reactionsRelations,
  paymentsRelations,
  userSubscriptionsRelations,
  devicesRelations,
  notificationsRelations,
  locationsRelations,
  placesRelations,
  thoughtsRelations,
} from './schema';

// Client exports (Expo SQLite)
export {
  getLocalDB,
  schema as clientDbSchema,
  syncApolloToDrizzle, // @deprecated - use DrizzleCacheStorage instead
  getDatabaseStats,
  getPendingMutationsDetails,
  formatTimestamp,
  type DatabaseStats,
  type EntityStats,
} from './client';
export {
  // Client cached tables
  cachedUsers,
  cachedTrips,
  cachedPlaces,
  cachedMessages,
  cachedConversations,
  cachedConversationMembers,
  cachedChatMessages,
  localConversationKeys,
  pendingMutations,
  syncMetadata,
  apolloCacheEntries,
  // Schema objects
  clientSchema,
} from './schema';

// Utilities
export { createId, isValidId } from './utils';

// Type exports
export * from './types';
