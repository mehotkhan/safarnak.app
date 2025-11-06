import { getServerDB, users } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

export const checkUsernameAvailability = async (
  _: unknown,
  { username }: { username: string },
  context: GraphQLContext
): Promise<boolean> => {
  try {
    if (!username || username.trim().length === 0) {
      throw new Error('Username is required');
    }

    const trimmedUsername = username.trim();

    // Username validation - allow UTF-8 (Persian, Arabic, etc.)
    if (trimmedUsername.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (trimmedUsername.length > 30) {
      throw new Error('Username must be at most 30 characters');
    }

    // Allow UTF-8 characters, dots, underscores, and hyphens
    // No special validation needed - allow any Unicode characters

    const db = getServerDB(context.env.DB);
    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, trimmedUsername))
      .get();

    // Return true if username is available (not found)
    const isAvailable = !existingUser;

    console.log('[checkUsernameAvailability]', {
      username: trimmedUsername,
      isAvailable,
    });

    return isAvailable;
  } catch (error) {
    console.error('[checkUsernameAvailability] Error:', error);
    throw error;
  }
};

