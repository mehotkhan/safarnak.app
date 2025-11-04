// Query resolver for getMessages
// Handles retrieving all messages from the database

import { getServerDB } from '@database/server';
import { messages } from '@database/server';
import { ResolverContext } from '../types';

export const getMessages = async (
  _parent: unknown,
  _args: unknown,
  context: ResolverContext
) => {
  const db = getServerDB(context.env.DB);
  return await db.select().from(messages).all();
};
