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
 *   import { getLocalDB, syncApolloToDrizzle } from '@database/client';
 *   const db = await getLocalDB();
 */

// Server exports (Cloudflare D1)
export { getServerDB, type ServerDB } from './server';
export {
  // Server tables
  users,
  trips,
  tours,
  messages,
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
  toursRelations,
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
  // Schema objects
  serverSchema,
  schema, // Legacy name for drizzle.config.ts
} from './schema';

// Client exports (Expo SQLite)
export {
  getLocalDB,
  schema as clientDbSchema,
  syncApolloToDrizzle,
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
  cachedTours,
  cachedPlaces,
  cachedMessages,
  pendingMutations,
  syncMetadata,
  // Schema objects
  clientSchema,
} from './schema';

// Utilities
export { createId, isValidId } from './utils';

// Type exports
export * from './types';
