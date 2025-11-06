import { getServerDB, users, challenges } from '@database/server';
import { eq, and } from 'drizzle-orm';
import { verifySignature } from '../utilities/crypto';
import { generateToken } from '../utilities/utils';
import type { GraphQLContext } from '../types';

interface LoginUserResult {
  user: {
    id: string;
    name: string;
    username: string;
    createdAt: string;
  };
  token: string;
}

export const loginUser = async (
  _: unknown,
  { username, signature }: { username: string; signature: string },
  context: GraphQLContext
): Promise<LoginUserResult> => {
  try {
    if (!username || !signature) {
      throw new Error('Username and signature are required');
    }

    const trimmedUsername = username.trim();

    const db = getServerDB(context.env.DB);

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, trimmedUsername))
      .get();

    if (!user) {
      throw new Error('Invalid username');
    }

    if (!user.publicKey) {
      throw new Error('User does not have biometric authentication enabled');
    }

    // Get the most recent unused challenge for this username (login)
    const now = Math.floor(Date.now() / 1000);
    const challenge = await db
      .select()
      .from(challenges)
      .where(
        and(
          eq(challenges.username, trimmedUsername),
          eq(challenges.isRegister, false),
          eq(challenges.used, false)
        )
      )
      .orderBy(challenges.createdAt)
      .get();

    if (!challenge) {
      throw new Error('No valid challenge found. Please request a challenge first.');
    }

    // Check if challenge has expired
    if (challenge.expiresAt < now) {
      throw new Error('Challenge has expired. Please request a new challenge.');
    }

    // Verify the signature against the stored public key
    const isValidSignature = verifySignature(challenge.nonce, signature, user.publicKey);
    if (!isValidSignature) {
      throw new Error('Invalid signature');
    }

    // Mark challenge as used
    await db
      .update(challenges)
      .set({ used: true })
      .where(eq(challenges.id, challenge.id));

    // Generate token and store in KV with TTL (7 days)
    const token = await generateToken(user.id, user.username);
    try {
      await context.env.KV?.put(`token:${token}`, user.id, {
        expirationTtl: 60 * 60 * 24 * 7, // 7 days
      });
    } catch (kvError) {
      console.warn('[loginUser] Warning: Failed to store token in KV', kvError);
    }

    console.log('[loginUser] ✅ User logged in successfully:', {
      userId: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        createdAt: user.createdAt || new Date().toISOString(),
      },
      token,
    };
  } catch (error) {
    console.error('[loginUser] Error:', error);
    throw error;
  }
};

