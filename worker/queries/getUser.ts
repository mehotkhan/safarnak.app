// Query resolver for getUser
// Handles retrieving user information by ID

import { getServerDB, users } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

export const getUser = async (
  _parent: unknown,
  { id }: { id: string },
  context: GraphQLContext
) => {
  try {
    const db = getServerDB(context.env.DB);

    // Fetch user by ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .get();

    if (!user) {
      console.log('[getUser] User not found:', id);
      return null;
    }

    console.log('[getUser] Retrieved user:', {
      id: user.id,
      username: user.username,
    });

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('[getUser] Error:', error);
    return null;
  }
};

