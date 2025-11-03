// Server schema (integer IDs) - for worker resolvers and migrations
export {
  // Tables
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

// Client schema (text IDs) - for local SQLite cache
export {
  // Cached tables
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

// Client database utilities
export { 
  getLocalDB, 
  schema as clientDbSchema, 
  syncApolloToDrizzle, 
  getDatabaseStats, 
  getPendingMutationsDetails, 
  formatTimestamp 
} from './client';
export type { DatabaseStats, EntityStats } from './client';

// Type and enum exports
export * from './types';

