/**
 * Cloudflare Worker Entry Point
 * This file combines resolver exports and worker configuration
 */

import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  handleSubscriptions,
  createWsConnectionPoolClass,
  createDefaultPublishableContext,
  DefaultPublishableContext,
} from 'graphql-workers-subscriptions';
import { createYoga } from 'graphql-yoga';

import { readGraphQLSchema } from '../graphql/schema-loader';
import { Query } from './queries';
import { Mutation } from './mutations';
import { Subscription } from './subscriptions';
import { Env } from './types';
import { APP_VERSION } from './version';

// Define __DEV__ for worker (Cloudflare Workers don't have NODE_ENV)
// In production, this will be false; in development, it can be true
// eslint-disable-next-line no-var
var __DEV__: boolean = false;

// Import assets (types are declared in worker/assets.d.ts and worker/html.d.ts)
import landingPageHTML from './landing.html';
import favicon16 from './assets/favicon-16.png';
import favicon32 from './assets/favicon-32.png';
import favicon192 from './assets/favicon-192.png';
import logo64 from './assets/logo-64.png';
import logo200 from './assets/logo-200.png';

// ============================================================================
// Resolver Exports
// ============================================================================

export const resolvers = {
  Query,
  Mutation,
  Subscription,
  PostRelatedEntity: {
    __resolveType(obj: any) {
      // Determine the type based on the object properties
      // Trips have 'destination' and 'status'
      if (obj.destination !== undefined || obj.status !== undefined) {
        return 'Trip';
      }
      // Tours have 'title' and 'category'
      if (obj.title !== undefined || obj.category !== undefined) {
        return 'Tour';
      }
      // Places have 'name' and 'type'
      if (obj.name !== undefined && obj.type !== undefined) {
        return 'Place';
      }
      // Fallback - try to determine from __typename if present
      return obj.__typename || 'Trip';
    },
  },
};

// Re-export types for external use (if needed)
export type { Env, ResolverContext } from './types';

// ============================================================================
// GraphQL Schema
// ============================================================================

export const schema = makeExecutableSchema<DefaultPublishableContext<Env>>({
  typeDefs: readGraphQLSchema(),
  resolvers,
});

// ============================================================================
// Worker Configuration
// ============================================================================

const settings = {
  schema,
  wsConnectionPool: (env: Env) => env.SUBSCRIPTION_POOL,
  subscriptionsDb: (env: Env) => env.DB,
};

// ============================================================================
// GraphQL Yoga Server
// ============================================================================

const yoga = createYoga<DefaultPublishableContext<Env> & { userId?: string }>({
  schema,
  graphiql: {
    subscriptionsProtocol: 'WS',
  },
  landingPage: false,
  plugins: [
    {
      onRequest: ({ request, url }) => {
        console.log(`GraphQL Request: ${request.method} ${url.pathname}`);
      },
    },
    {
      onResult: ({ result, args }: any) => {
        // Log GraphQL errors for observability in production
        const errors = (result as any)?.errors;
        if (errors && Array.isArray(errors) && errors.length > 0) {
          try {
            const operationName = (args as any)?.operationName || 'unknown';
            console.error('GraphQL Error', {
              operationName,
              errors: errors.map((e: any) => ({ message: e.message, path: e.path })),
            });
          } catch (_) {
            // no-op
          }
        }
      },
    },
    {
      // Cleanup old subscriptions periodically (only on WebSocket upgrade requests)
      onRequest: async ({ request, env }: any) => {
        // Only cleanup on WebSocket upgrade requests (subscription connections)
        const upgradeHeader = request.headers.get('upgrade');
        if (upgradeHeader?.toLowerCase() === 'websocket') {
          try {
            // Aggressive cleanup to prevent UNIQUE constraint violations
            // Clean up subscriptions older than 30 minutes, inactive, or expired
            // This prevents conflicts when reconnecting with the same subscription ID
            const db = env.DB;
            
            // Clean up old/inactive/expired subscriptions
            const cleanupResult = await db.exec(`
              DELETE FROM subscriptions 
              WHERE is_active = 0 
              OR (expires_at IS NOT NULL AND expires_at < datetime('now'))
              OR (created_at < datetime('now', '-30 minutes'))
            `);
            
            if (__DEV__ && cleanupResult.meta.changes > 0) {
              console.log(`🧹 Cleaned up ${cleanupResult.meta.changes} old subscriptions`);
            }
          } catch (error) {
            // Log but don't fail requests if cleanup fails
            console.warn('Failed to cleanup subscriptions:', error);
          }
        }
      },
    },
  ],
  maskedErrors: false, // Show actual error messages instead of "Unexpected error"
  context: async ({ request, env, executionCtx }) => {
    let userId: string | undefined;

    // Try to get userId from Authorization Bearer token
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Validate token by looking it up in KV storage
      // Token format: stored in KV as `token:${token}` -> JSON string with userId and deviceId
      // Tokens are generated during login/registration and stored with TTL (7 days)
      try {
        const tokenData = await env.KV?.get(`token:${token}`);
        if (tokenData) {
          const parsed = JSON.parse(tokenData);
          if (parsed && typeof parsed.userId === 'string') {
            userId = parsed.userId; // Extract userId from token data
          } else {
            console.warn('Invalid token format: missing userId');
          }
        }
      } catch (error) {
        // Token not found or invalid JSON format - authentication fails
        console.warn('Token validation error:', error);
      }
    }

    // Note: Authentication is JWT token-based only via Authorization Bearer header
    // No other authentication methods are supported (x-user-id header removed for security)

    // Compose default publishable context and add userId
    const base = createDefaultPublishableContext({ env, executionCtx, ...settings });
    return { ...base, userId };
  },
});

// ============================================================================
// Request Handler
// ============================================================================

const baseFetch = (
  request: Request,
  env: Env,
  executionCtx: ExecutionContext // ExecutionContext is a global type in Cloudflare Workers
) =>
  yoga.handleRequest(
    request,
    createDefaultPublishableContext({
      env,
      executionCtx,
      ...settings,
    })
  );

const subscriptionsFetch = handleSubscriptions({
  fetch: baseFetch,
  ...settings,
});

// Wrapper to handle subscription errors gracefully
// The graphql-workers-subscriptions library may try to insert subscriptions
// with IDs that already exist (e.g., on reconnection). We catch these errors,
// clean up the duplicate subscription, and allow the connection to proceed.
const wrappedSubscriptionsFetch = async (
  request: Request,
  env: Env,
  executionCtx: ExecutionContext
): Promise<Response> => {
  try {
    return await subscriptionsFetch(request, env, executionCtx);
  } catch (error: any) {
    // Handle UNIQUE constraint violations on subscriptions table
    // This can happen when reconnecting WebSocket - the subscription ID already exists
    const errorMessage = error?.message || error?.cause?.message || '';
    const isUniqueConstraintError = errorMessage.includes('UNIQUE constraint failed: subscriptions.id');
    
    if (isUniqueConstraintError) {
      // Try to clean up the duplicate subscription and retry
      try {
        const upgradeHeader = request.headers.get('upgrade');
        if (upgradeHeader?.toLowerCase() === 'websocket') {
          // For WebSocket connections, try to delete any inactive subscriptions
          // This might help with the next retry
          const db = env.DB;
          await db.exec(`
            DELETE FROM subscriptions 
            WHERE is_active = 0 
            OR (created_at < datetime('now', '-5 minutes'))
          `);
          
          if (__DEV__) {
            console.warn(
              '[Subscription] Duplicate subscription ID detected. Cleaned up inactive subscriptions and continuing...'
            );
          }
          
          // Retry the request after cleanup
          // The library should handle the retry, but if it doesn't, we'll let the error propagate
          return await subscriptionsFetch(request, env, executionCtx);
        }
      } catch (retryError) {
        // If retry fails, log and continue with original error
        if (__DEV__) {
          console.warn('[Subscription] Retry after cleanup failed:', retryError);
        }
      }
    }
    
    // Re-throw the error if we couldn't handle it
    throw error;
  }
};

// Serve landing page at root, GraphQL at /graphql
const fetch = async (
  request: Request,
  env: Env,
  executionCtx: ExecutionContext // ExecutionContext is a global type in Cloudflare Workers
) => {
  const url = new URL(request.url);
  
  // Favicon routes
  if (url.pathname === '/favicon.ico') {
    return new Response(favicon32, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=86400',
      },
    });
  }
  if (url.pathname === '/favicon-16.png') {
    return new Response(favicon16, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=86400',
      },
    });
  }
  if (url.pathname === '/favicon-32.png') {
    return new Response(favicon32, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=86400',
      },
    });
  }
  if (url.pathname === '/favicon-192.png') {
    return new Response(favicon192, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=86400',
      },
    });
  }
  
  // Serve static logo assets
  if (url.pathname === '/assets/logo-64.png') {
    return new Response(logo64, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=86400',
      },
    });
  }
  if (url.pathname === '/assets/logo-200.png') {
    return new Response(logo200, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=86400',
      },
    });
  }
  
  // Landing page at root
  if (url.pathname === '/' || url.pathname === '') {
    // Replace version placeholders in landing page HTML with actual version
    const version = APP_VERSION;
    const htmlWithVersion = landingPageHTML
      .replace(/{{VERSION}}/g, `v${version}`)
      .replace(/{{VERSION_PLAIN}}/g, version);
    
    return new Response(htmlWithVersion, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  }
  
 

  // GraphQL endpoint and subscriptions
  return wrappedSubscriptionsFetch(request, env, executionCtx);
};

// ============================================================================
// Cloudflare Worker Exports
// ============================================================================

export default { fetch };

export const SubscriptionPool = createWsConnectionPoolClass(settings);

// ============================================================================
// Workflow Exports
// ============================================================================

export { TripCreationWorkflow } from './workflows/tripCreationWorkflow';
export { TripUpdateWorkflow } from './workflows/tripUpdateWorkflow';
