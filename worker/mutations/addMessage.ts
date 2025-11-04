// Mutation resolver for addMessage
// Handles adding new messages to the database and publishing to subscriptions

import { eq } from 'drizzle-orm';
import { getServerDB } from '@database/server';
import { messages } from '@database/server';
import { createId } from '@database/utils';
import { ResolverContext } from '../types';

interface AddMessageArgs {
  content: string;
}

export const addMessage = async (
  _parent: unknown,
  { content }: AddMessageArgs,
  context: ResolverContext
) => {
  const db = getServerDB(context.env.DB);
  const id = createId();

  await db.insert(messages).values({ id, content }).run();

  const newMsg = await db
    .select()
    .from(messages)
    .where(eq(messages.id, id))
    .get();

  if (!newMsg) {
    throw new Error('Failed to create message');
  }

  // Publish to subscriptions
  context.publish('NEW_MESSAGES', { newMessages: newMsg });

  return newMsg;
};
