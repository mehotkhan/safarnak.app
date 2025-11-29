// Mutation resolver for verifyPhone
// Verifies the phone verification code and marks phone as verified
// Reads from KV and clears it after verification
// For dev: "111111" always works as a bypass

import { getServerDB, users } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

const DEV_BYPASS_CODE = '111111';

export const verifyPhone = async (
  _parent: unknown,
  { code }: { code: string },
  context: GraphQLContext
): Promise<boolean> => {
  try {
    const userId = context.userId;
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const db = getServerDB(context.env.DB);

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user) {
      throw new Error('User not found');
    }

    const trimmedCode = code.trim();

    // Dev bypass: always accept "111111"
    if (trimmedCode === DEV_BYPASS_CODE) {
      // Mark phone as verified
      await db
        .update(users)
        .set({ 
          phoneVerified: true,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, userId));
      return true;
    }

    // Get stored verification code from KV
    const kvKey = `verification:phone:${userId}`;
    const storedValue = await context.env.KV.get(kvKey);
    
    if (!storedValue) {
      throw new Error('No verification code found. Please request a new code.');
    }

    // Parse stored data
    const stored = JSON.parse(storedValue);

    // Verify code
    if (trimmedCode !== stored.code) {
      throw new Error('Invalid verification code');
    }

    // Mark phone as verified in users table
    await db
      .update(users)
      .set({ 
        phoneVerified: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    // Delete the verification code from KV
    await context.env.KV.delete(kvKey);

    return true;
  } catch (error) {
    console.error('[verifyPhone] Error:', error);
    throw error instanceof Error ? error : new Error('Failed to verify phone');
  }
};

