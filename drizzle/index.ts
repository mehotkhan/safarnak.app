/**
 * Drizzle Database - Main Exports
 * 
 * Unified exports for all Drizzle functionality:
 * - Schema definitions (base, server, client)
 * - Client database utilities (db, sync, stats)
 */

// Export all schemas
export * from './schema';

// Export client utilities
export { getLocalDB, schema as clientSchema, syncApolloToDrizzle, getDatabaseStats, getPendingMutationsDetails, formatTimestamp } from './client';
export type { DatabaseStats, EntityStats } from './client';
