// Query resolver for me
// Handles retrieving current user information

import { getServerDB, users } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

export const me = async (
  _parent: unknown,
  _args: unknown,
  context: GraphQLContext
) => {
  try {
    // Get userId from context (set by auth middleware in worker/index.ts)
    const userId = context.userId;

    if (!userId) {
      console.log('[me] No authenticated user');
      return null;
    }

    const db = getServerDB(context.env.DB);

    // Fetch user by ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user) {
      console.log('[me] User not found:', userId);
      return null;
    }

    console.log('[me] Retrieved user:', {
      id: user.id,
      username: user.username,
    });

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      publicKey: user.publicKey,
      createdAt: user.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('[me] Error:', error);
    return null;
  }
};
