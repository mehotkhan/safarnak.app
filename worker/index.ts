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

// Redirect root path to GraphQL endpoint for convenience
const fetch = async (request: Request, env: Env, executionCtx: ExecutionContext) => {
  const url = new URL(request.url);
  // Simple release notes JSON endpoint served from bundled files
  if (url.pathname.startsWith('/releases')) {
    const parts = url.pathname.split('/').filter(Boolean); // ["releases", "<version>|latest"]
    const target = parts[1] || 'latest';
    try {
      // Use import.meta to load bundled JSON at build-time
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const data = await (async () => {
        if (target === 'latest') {
          // @ts-ignore - JSON import provided by bundler
          return (await import('./releases/latest.json')).default || (await import('./releases/latest.json'));
        }
        // @ts-ignore - JSON import provided by bundler
        return (await import(`./releases/${target}.json`)).default || (await import(`./releases/${target}.json`));
      })();
      return new Response(JSON.stringify(data), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Release notes not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }
  }
  if (url.pathname === '/' || url.pathname === '') {
    return Response.redirect(url.origin + '/graphql', 302);
  }

  return subscriptionsFetch(request, env, executionCtx);
};

// ============================================================================
// Cloudflare Worker Exports
// ============================================================================

export default { fetch };

export const SubscriptionPool = createWsConnectionPoolClass(settings);
