/**
 * API Exports
 * 
 * Main entry point for all API-related modules including:
 * - Auto-generated GraphQL hooks
 * - Apollo client (with Drizzle cache storage)
 * - Utilities
 * 
 * Usage:
 *   import { useMeQuery, useGetTripsQuery, useLoginMutation, client } from '@api';
 * 
 * DrizzleCacheStorage automatically syncs Apollo cache → Drizzle structured tables.
 * No manual sync needed!
 */

// Export all auto-generated GraphQL hooks (queries, mutations, subscriptions, lazy, suspense)
export * from './hooks';

// Export all types
export type * from './types';
export type * from './hooks';

// Apollo client (uses DrizzleCacheStorage for persistence)
export { client } from './client';

// Drizzle cache storage (for utilities that need direct access)
export { drizzleCacheStorage, DrizzleCacheStorage } from './cache-storage';

// Utilities, types, and logout
export * from './utils';
