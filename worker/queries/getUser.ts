// Query resolver for getUser
// Handles retrieving user information by ID
// After Phase 11.4: Joins users and profiles tables

import { getServerDB, users, profiles } from '@database/server';
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

    // Fetch profile
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .get();

    console.log('[getUser] Retrieved user:', {
      id: user.id,
      username: user.username,
      hasProfile: !!profile,
    });

    // Return combined data matching GraphQL User type
    return {
      id: user.id,
      name: profile?.displayName || user.username, // Fallback to username if no profile
      username: user.username,
      avatar: profile?.avatarUrl || null,
      createdAt: user.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('[getUser] Error:', error);
    return null;
  }
};

