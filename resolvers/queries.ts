// Query resolvers
// These resolvers handle GraphQL Query operations

import { drizzle } from 'drizzle-orm/d1';
import { DefaultPublishableContext } from 'graphql-workers-subscriptions';

import { messages } from '../drizzle/schema';

export interface QueryEnv {
  DB: D1Database;
  SUBSCRIPTION_POOL: DurableObjectNamespace;
}

export const getMessages = async (
  _parent: unknown,
  _args: unknown,
  context: DefaultPublishableContext<QueryEnv>
) => {
  const db = drizzle(context.env.DB);
  return await db.select().from(messages).all();
};

export const me = async (
  _parent: unknown,
  _args: unknown,
  _context: DefaultPublishableContext<QueryEnv>
) => {
  // This would need JWT token validation in a real implementation
  // For now, we'll return null as we don't have auth middleware
  return null;
};

export const Query = {
  getMessages,
  me,
};
