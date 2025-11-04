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
import landingPageHTML from './landing.html';

// Import logo assets
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
  executionCtx: ExecutionContext
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
const fetch = async (request: Request, env: Env, executionCtx: ExecutionContext) => {
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
    return new Response(landingPageHTML, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  }
  
  // Release notes endpoint backed by GitHub Releases + Compare API
  if (url.pathname.startsWith('/releases')) {
    const repo = (env as any).GITHUB_REPO || 'mehotkhan/safarnak.app';
    const ghHeaders: Record<string, string> = {
      'accept': 'application/vnd.github+json',
      'user-agent': 'safarnak-worker',
    };
    const token = (env as any).GITHUB_TOKEN as string | undefined;
    if (token) ghHeaders['authorization'] = `Bearer ${token}`;

    try {
      // fetch latest two releases to compute range
      const relRes = await globalThis.fetch(`https://api.github.com/repos/${repo}/releases?per_page=2`, { headers: ghHeaders });
      if (!relRes.ok) throw new Error(`releases http ${relRes.status}`);
      const releases: any[] = await relRes.json();
      const latest = releases[0];
      const previous = releases[1];
      const latestTag = latest?.tag_name;
      const previousTag = previous?.tag_name;

      let commits: any[] = [];
      if (latestTag && previousTag) {
        const cmpRes = await globalThis.fetch(`https://api.github.com/repos/${repo}/compare/${previousTag}...${latestTag}` , { headers: ghHeaders });
        if (cmpRes.ok) {
          const cmp: any = await cmpRes.json();
          commits = (cmp.commits || []).map((c: any) => ({
            sha: c.sha?.slice(0, 7),
            message: c.commit?.message || '',
            author: c.commit?.author?.name || c.author?.login || 'unknown',
            date: c.commit?.author?.date,
          }));
        }
      }

      const payload = {
        version: latest?.tag_name || null,
        name: latest?.name || null,
        createdAt: latest?.created_at || null,
        publishedAt: latest?.published_at || null,
        body: latest?.body || '',
        previous: previous?.tag_name || null,
        commits,
      };
      return new Response(JSON.stringify(payload), { headers: { 'content-type': 'application/json; charset=utf-8' } });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: 'Failed to fetch release info', details: String(e?.message || e) }), { status: 502, headers: { 'content-type': 'application/json; charset=utf-8' } });
    }
  }

  // GraphQL endpoint and subscriptions
  return subscriptionsFetch(request, env, executionCtx);
};

// ============================================================================
// Cloudflare Worker Exports
// ============================================================================

export default { fetch };

export const SubscriptionPool = createWsConnectionPoolClass(settings);
