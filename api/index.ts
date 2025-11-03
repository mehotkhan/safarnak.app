/**
 * API Exports
 * 
 * Main entry point for all API-related modules including:
 * - Enhanced auto-generated GraphQL hooks (with automatic Drizzle sync)
 * - Apollo client
 * - Utilities
 * 
 * Usage:
 *   import { useMeQuery, useGetTripsQuery, useLoginMutation, client } from '@api';
 * 
 * All hooks automatically sync Apollo cache → Drizzle for offline support.
 * No manual sync needed!
 */

// Enhanced GraphQL hooks with automatic Drizzle sync
// These are the ONLY hooks you should use - they auto-sync to Drizzle
export {
  useMeQuery,
  useGetTripsQuery,
  useGetTripQuery,
  useGetMessagesQuery,
  useLoginMutation,
  useRegisterMutation,
  useAddMessageMutation,
  useCreateTripMutation,
} from './enhanced-hooks';

// Export lazy queries, suspense queries, and all types
export {
  useMeLazyQuery,
  useMeSuspenseQuery,
  useGetTripsLazyQuery,
  useGetTripsSuspenseQuery,
  useGetTripLazyQuery,
  useGetTripSuspenseQuery,
  useGetMessagesLazyQuery,
  useGetMessagesSuspenseQuery,
} from './hooks';

// Export all types
export type * from './types';
export type * from './hooks';

// Apollo client & SQLite storage (merged into client.ts)
export { client, sqliteStorage } from './client';

// Utilities, types, and logout (all merged into utils.ts)
export * from './utils';
