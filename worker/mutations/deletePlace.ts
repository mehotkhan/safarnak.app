// Mutation resolver for deletePlace
// Handles deleting a place

import { eq } from 'drizzle-orm';
import { getServerDB, places } from '@database/server';
import type { GraphQLContext } from '../types';

export const deletePlace = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Check if place exists
  const existing = await db
    .select()
    .from(places)
    .where(eq(places.id, id))
    .get();

  if (!existing) {
    throw new Error('Place not found');
  }

  try {
    // Delete place
    await db
      .delete(places)
      .where(eq(places.id, id));

    return true;
  } catch (error: any) {
    console.error('[deletePlace] Error:', error);
    throw new Error(`Failed to delete place: ${error.message}`);
  }
};

