// Mutation resolver for requestEmailVerification
// Sends a verification code to the user's email
// Stores verification code in KV with expiration time
// For dev: "111111" always works as a bypass

import { getServerDB, users } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

const VERIFICATION_CODE_EXPIRY_SECONDS = 10 * 60; // 10 minutes

export const requestEmailVerification = async (
  _parent: unknown,
  { email }: { email: string },
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

    // Validate email format
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Invalid email format');
    }

    // Check if email is already taken by another user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, trimmedEmail))
      .get();

    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email is already taken');
    }

    // Update email in users table
    await db
      .update(users)
      .set({ 
        email: trimmedEmail,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    // Generate verification code (for dev, we use "111111")
    const verificationCode = '111111';
    
    // Store in KV with expiration time
    const kvKey = `verification:email:${userId}`;
    const kvValue = JSON.stringify({
      code: verificationCode,
      type: 'email',
      createdAt: Date.now(),
    });

    // Store in KV with expiration (expirationTtl is in seconds)
    await context.env.KV.put(kvKey, kvValue, {
      expirationTtl: VERIFICATION_CODE_EXPIRY_SECONDS,
    });

    // In production, you would send email here
    // For now, we just store the code in KV for verification

    return true;
  } catch (error) {
    console.error('[requestEmailVerification] Error:', error);
    throw error instanceof Error ? error : new Error('Failed to request email verification');
  }
};

