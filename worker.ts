import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  handleSubscriptions,
  createWsConnectionPoolClass,
  DefaultPublishableContext,
  createDefaultPublishableContext,
} from 'graphql-workers-subscriptions';
import { createYoga } from 'graphql-yoga';

// Import GraphQL schema and resolvers
import { typeDefs } from './graphql/schema';
import { resolvers } from './resolvers';

export interface Env {
  DB: D1Database;
  SUBSCRIPTION_POOL: DurableObjectNamespace;
}

export const schema = makeExecutableSchema<DefaultPublishableContext<Env>>({
  typeDefs,
  resolvers,
});

// ============================================================================
// GraphQL Yoga Server Configuration
// ============================================================================

const settings = {
  schema,
  wsConnectionPool: (env: Env) => env.SUBSCRIPTION_POOL,
  subscriptionsDb: (env: Env) => env.DB,
};

const yoga = createYoga<DefaultPublishableContext<Env>>({
  schema,
  graphiql: {
    subscriptionsProtocol: 'WS',
  },
});

// ============================================================================
// Request Handler Setup
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

const fetch = handleSubscriptions({
  fetch: baseFetch,
  ...settings,
});

// ============================================================================
// Cloudflare Worker Exports
// ============================================================================

export default { fetch };

export const SubscriptionPool = createWsConnectionPoolClass(settings);
