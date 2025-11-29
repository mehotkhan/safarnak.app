// Query resolver for me
// Handles retrieving current user information
// After Phase 11.4: Joins users and profiles tables

import { getServerDB, users, profiles } from '@database/server';
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

    // Fetch profile
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .get();

    console.log('[me] Retrieved user:', {
      id: user.id,
      username: user.username,
      hasProfile: !!profile,
    });

    // Return combined data matching GraphQL User type
    return {
      id: user.id,
      name: profile?.displayName || user.username, // Fallback to username if no profile
      username: user.username,
      email: user.email,
      phone: profile?.phone || null,
      avatar: profile?.avatarUrl || null,
      publicKey: user.publicKey,
      status: user.status || 'active',
      createdAt: user.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('[me] Error:', error);
    return null;
  }
};
