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
import { serverSchema } from './schema';

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

// Re-export server schema tables for convenience
export * from './schema';

