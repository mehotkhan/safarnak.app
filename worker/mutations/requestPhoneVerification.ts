// Mutation resolver for requestPhoneVerification
// Sends a verification code to the user's phone
// Stores verification code in KV with expiration time
// For dev: "111111" always works as a bypass

import { getServerDB, users, profiles } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

const VERIFICATION_CODE_EXPIRY_SECONDS = 10 * 60; // 10 minutes
const DEV_BYPASS_CODE = '111111';

export const requestPhoneVerification = async (
  _parent: unknown,
  { phone }: { phone: string },
  context: GraphQLContext
): Promise<boolean> => {
  try {
    const userId = context.userId;
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const db = getServerDB(context.env.DB);

    // Get user and profile
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user) {
      throw new Error('User not found');
    }

    // Validate phone format (basic validation)
    const trimmedPhone = phone.trim();
    if (!trimmedPhone || trimmedPhone.length < 10) {
      throw new Error('Invalid phone number format');
    }

    // Update phone in profile
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .get();

    if (profile) {
      await db
        .update(profiles)
        .set({ phone: trimmedPhone, updatedAt: new Date().toISOString() })
        .where(eq(profiles.userId, userId));
    } else {
      await db.insert(profiles).values({
        userId,
        phone: trimmedPhone,
        isActive: true,
      });
    }

    // Generate verification code (for dev, we use the bypass code)
    const verificationCode = DEV_BYPASS_CODE;
    
    // Store in KV with expiration time
    const kvKey = `verification:phone:${userId}`;
    const kvValue = JSON.stringify({
      code: verificationCode,
      type: 'phone',
      createdAt: Date.now(),
    });

    // Store in KV with expiration (expirationTtl is in seconds)
    await context.env.KV.put(kvKey, kvValue, {
      expirationTtl: VERIFICATION_CODE_EXPIRY_SECONDS,
    });

    // In production, you would send SMS here
    // For now, we just store the code in KV for verification

    return true;
  } catch (error) {
    console.error('[requestPhoneVerification] Error:', error);
    throw error instanceof Error ? error : new Error('Failed to request phone verification');
  }
};

