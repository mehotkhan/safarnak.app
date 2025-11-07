import { eq } from 'drizzle-orm';
import { getServerDB, reactions } from '@database/server';
import type { GraphQLContext } from '../types';

export const deleteReaction = async (
  _: any,
  { reactionId }: { reactionId: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Verify reaction exists and belongs to user
  const reaction = await db.select().from(reactions).where(eq(reactions.id, reactionId)).get();
  if (!reaction) {
    throw new Error('Reaction not found');
  }

  if (reaction.userId !== userId) {
    throw new Error('Unauthorized: You can only delete your own reactions');
  }

  // Delete reaction
  await db.delete(reactions).where(eq(reactions.id, reactionId));

  return true;
};

