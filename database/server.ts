/**
 * Server Database Adapter
 * 
 * Cloudflare D1 (SQLite) adapter for worker resolvers.
 * Provides a unified interface for server-side database operations.
 * 
 * Usage:
 *   import { getServerDB } from '@database/server';
 *   const db = await getServerDB(context.env.DB);
 */

import { drizzle } from 'drizzle-orm/d1';
import {
  users,
  profiles,
  challenges,
  trips,
  messages,
  subscriptions,
  userPreferences,
  itineraries,
  plans,
  posts,
  comments,
  reactions,
  bookmarks,
  payments,
  bookings,
  userSubscriptions,
  devices,
  notifications,
  locations,
  places,
  thoughts,
  feedEvents,
  feedPreferences,
  searchIndex,
  followEdges,
  closeFriends,
  embeddingsMeta,
  tripParticipants,
  tripCheckins,
  tripDays,
  tripItems,
} from './schema';

/**
 * Server schema (for worker and migrations)
 * Contains only server tables (Cloudflare D1), excluding all client-only cached tables
 */
export const serverSchema = {
  users,
  profiles,
  challenges,
  trips,
  messages,
  subscriptions,
  userPreferences,
  itineraries,
  plans,
  posts,
  comments,
  reactions,
  bookmarks,
  payments,
  bookings,
  userSubscriptions,
  devices,
  notifications,
  locations,
  places,
  thoughts,
  feedEvents,
  feedPreferences,
  searchIndex,
  followEdges,
  closeFriends,
  embeddingsMeta,
  tripParticipants,
  tripCheckins,
  tripDays,
  tripItems,
};

/**
 * Get Drizzle database instance for Cloudflare D1
 * 
 * @param d1 - Cloudflare D1 database instance from context.env.DB
 * @returns Drizzle database instance with server schema
 */
export function getServerDB(d1: D1Database) {
  return drizzle(d1, { schema: serverSchema });
}

/**
 * Type helper for server database instance
 */
export type ServerDB = ReturnType<typeof getServerDB>;

// Export schema for drizzle-kit migrations (server tables only)
export const schema = serverSchema;

// Re-export server schema tables for convenience
export {
  users,
  profiles,
  challenges,
  trips,
  messages,
  subscriptions,
  userPreferences,
  itineraries,
  plans,
  posts,
  comments,
  reactions,
  bookmarks,
  payments,
  bookings,
  userSubscriptions,
  devices,
  notifications,
  locations,
  places,
  thoughts,
  feedEvents,
  feedPreferences,
  searchIndex,
  followEdges,
  closeFriends,
  embeddingsMeta,
  tripParticipants,
  tripCheckins,
} from './schema';

