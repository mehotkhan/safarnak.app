// Mutation resolver for deleteTour
// Handles deleting a tour

import { eq } from 'drizzle-orm';
import { getServerDB, tours } from '@database/server';
import type { GraphQLContext } from '../types';

export const deleteTour = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Check if tour exists
  const existing = await db
    .select()
    .from(tours)
    .where(eq(tours.id, id))
    .get();

  if (!existing) {
    throw new Error('Tour not found');
  }

  try {
    // Delete tour
    await db
      .delete(tours)
      .where(eq(tours.id, id));

    return true;
  } catch (error: any) {
    console.error('[deleteTour] Error:', error);
    throw new Error(`Failed to delete tour: ${error.message}`);
  }
};

