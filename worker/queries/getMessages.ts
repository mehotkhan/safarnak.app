// Query resolver for getMessages
// Handles retrieving all messages from the database

import { drizzle } from 'drizzle-orm/d1';

import { messages } from '@drizzle/schema';
import { ResolverContext } from '../types';

export const getMessages = async (
  _parent: unknown,
  _args: unknown,
  context: ResolverContext
) => {
  const db = drizzle(context.env.DB);
  return await db.select().from(messages).all();
};
