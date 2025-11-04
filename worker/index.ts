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
            // Clean up subscriptions older than 1 hour or inactive connections
            // Use a more aggressive cleanup to prevent constraint violations
            const db = env.DB;
            const result = await db.exec(`
              DELETE FROM subscriptions 
              WHERE is_active = 0 
              OR (expires_at IS NOT NULL AND expires_at < datetime('now'))
              OR (created_at < datetime('now', '-1 hour'))
            `);
            if (__DEV__ && result.meta.changes > 0) {
              console.log(`🧹 Cleaned up ${result.meta.changes} old subscriptions`);
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
      // Token format: stored in KV as `token:${token}` -> userId (UUID string)
      try {
        const storedUserId = await env.KV?.get(`token:${token}`);
        if (storedUserId) {
          userId = storedUserId; // Already a UUID string, no parsing needed
        }
      } catch (error) {
        console.warn('Token validation error:', error);
      }
    }

    // Fallback: Try x-user-id header (for backward compatibility or direct access)
    if (!userId) {
      const userIdHeader = request.headers.get('x-user-id');
      if (userIdHeader) {
        userId = userIdHeader; // Already a UUID string
      }
    }

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
  return subscriptionsFetch(request, env, executionCtx);
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
