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

// Simple SVG favicon (brand circle with S) - using primary color
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0077be"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="url(#g)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#fff" font-weight="700">س</text>
</svg>`;

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

const yoga = createYoga<DefaultPublishableContext<Env> & { userId?: number }>({
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
    // Derive userId from header (client sends x-user-id).
    const userIdHeader = request.headers.get('x-user-id');
    const userId = userIdHeader ? parseInt(userIdHeader, 10) : undefined;

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
  
  // Favicon
  if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
    return new Response(faviconSvg, {
      headers: {
        'content-type': 'image/svg+xml; charset=utf-8',
        'cache-control': 'public, max-age=86400',
      },
    });
  }
  
  // Serve static assets (images)
  if (url.pathname.startsWith('/assets/')) {
    try {
      const assetPath = url.pathname.replace('/assets/', '');
      // In Cloudflare Workers, we need to import assets at build time
      // For now, we'll use a fetch to R2 or serve from external URL
      // For local dev, we can embed or use a CDN
      return new Response(null, { status: 404 });
    } catch (_) {
      return new Response(null, { status: 404 });
    }
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
