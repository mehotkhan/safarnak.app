// Shared types for resolvers
// This file contains common types used across all resolvers

import { DefaultPublishableContext } from 'graphql-workers-subscriptions';

/**
 * Cloudflare Worker environment bindings
 */
export interface Env {
  DB: D1Database;
  SUBSCRIPTION_POOL: DurableObjectNamespace;
  KV: KVNamespace;           // Key-Value storage for sessions & caches
  R2: R2Bucket;              // Object storage for media
  VECTORIZE: VectorizeIndex; // Vector database for embeddings
}

/**
 * GraphQL context type for resolvers
 */
export type ResolverContext = DefaultPublishableContext<Env>;

/**
 * Alias for GraphQL resolver context (for compatibility)
 */
export type GraphQLContext = ResolverContext & {
  userId?: number; // Optional user ID from auth token
};

/**
 * Base resolver function type
 */
export type ResolverFn<TArgs = unknown, TResult = unknown> = (
  parent: unknown,
  args: TArgs,
  context: ResolverContext
) => Promise<TResult> | TResult;