// Shared types for resolvers
// This file contains common types used across all resolvers

import { DefaultPublishableContext } from 'graphql-workers-subscriptions';

/**
 * Cloudflare Worker environment bindings
 */
export interface Env {
  DB: D1Database;
  SUBSCRIPTION_POOL: DurableObjectNamespace;
}

/**
 * GraphQL context type for resolvers
 */
export type ResolverContext = DefaultPublishableContext<Env>;

/**
 * Base resolver function type
 */
export type ResolverFn<TArgs = unknown, TResult = unknown> = (
  parent: unknown,
  args: TArgs,
  context: ResolverContext
) => Promise<TResult> | TResult;
