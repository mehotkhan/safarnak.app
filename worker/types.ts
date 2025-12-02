// Shared types for resolvers
// This file contains common types used across all resolvers

import { DefaultPublishableContext } from 'graphql-workers-subscriptions';

/**
 * Cloudflare Worker environment bindings
 */
export interface Env {
  // Cloudflare Services
  DB: D1Database;
  SUBSCRIPTION_POOL: DurableObjectNamespace;
  KV: KVNamespace;           // Key-Value storage for sessions & caches
  R2: R2Bucket;              // Object storage for media
  VECTORIZE: VectorizeIndex; // Vector database for embeddings
  TRENDING_ROLLUP: DurableObjectNamespace; // DO for trending rollups
  TRIP_CREATION_WORKFLOW: Workflow; // Workflow for trip creation notifications
  TRIP_UPDATE_WORKFLOW: Workflow; // Workflow for trip update notifications
  EMBED_QUEUE: Queue<unknown>; // Cloudflare Queue for embedding jobs
  AI: Ai; // Workers AI binding

  // External API Keys
  OPENTRIPMAP_API_KEY: string; // OpenTripMap - POIs/attractions
  ORS_API_KEY: string;         // OpenRouteService - routing/directions (optional)
  // Note: Open-Meteo and Wikivoyage don't need API keys
}

/**
 * GraphQL context type for resolvers
 */
export type ResolverContext = DefaultPublishableContext<Env>;

/**
 * Alias for GraphQL resolver context (for compatibility)
 */
export type GraphQLContext = ResolverContext & {
  userId?: string; // Optional user ID (UUID) from auth token
  deviceId?: string; // Optional device ID derived from token
};

/**
 * Base resolver function type
 */
export type ResolverFn<TArgs = unknown, TResult = unknown> = (
  parent: unknown,
  args: TArgs,
  context: ResolverContext
) => Promise<TResult> | TResult;