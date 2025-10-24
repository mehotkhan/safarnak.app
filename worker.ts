import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  handleSubscriptions,
  createWsConnectionPoolClass,
  subscribe,
  DefaultPublishableContext,
  createDefaultPublishableContext,
} from 'graphql-workers-subscriptions';
import { createYoga } from 'graphql-yoga';

import { typeDefs } from './graphql/schema';
import { resolvers } from './resolvers';

export interface Env {
  DB: D1Database;
  SUBSCRIPTION_POOL: DurableObjectNamespace;
}

export const schema = makeExecutableSchema<DefaultPublishableContext<Env>>({
  typeDefs,
  resolvers: {
    ...resolvers,
    Subscription: {
      newMessages: {
        subscribe: subscribe('NEW_MESSAGES'),
      },
    },
  },
});

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

export default { fetch };

export const SubscriptionPool = createWsConnectionPoolClass(settings);
