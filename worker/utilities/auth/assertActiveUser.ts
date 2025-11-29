import { getServerDB, users } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../../types';

/**
 * Asserts that the authenticated user has active status
 * Throws an error if user is not authenticated or not active
 */
export async function assertActiveUser(context: GraphQLContext): Promise<void> {
  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const db = getServerDB(context.env.DB);
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) {
    throw new Error('User not found');
  }

  if (user.status !== 'active') {
    throw new Error('FORBIDDEN_INACTIVE_USER: User account is not active. Please complete your profile activation.');
  }
}

