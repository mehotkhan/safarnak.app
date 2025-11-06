import { getServerDB, users, challenges } from '@database/server';
import { eq, and } from 'drizzle-orm';
import { verifySignature } from '../utilities/crypto';
import { generateToken } from '../utilities/utils';
import type { GraphQLContext } from '../types';

interface RegisterUserResult {
  user: {
    id: string;
    name: string;
    username: string;
    createdAt: string;
  };
  token: string;
}

export const registerUser = async (
  _: unknown,
  { username, publicKey, signature }: { username: string; publicKey: string; signature: string },
  context: GraphQLContext
): Promise<RegisterUserResult> => {
  try {
    if (!username || !publicKey || !signature) {
      throw new Error('Username, publicKey, and signature are required');
    }

    const trimmedUsername = username.trim();

    const db = getServerDB(context.env.DB);

    // Check if username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, trimmedUsername))
      .get();

    if (existingUser) {
      throw new Error('Username already taken');
    }

    // Get the most recent unused challenge for this username (registration)
    const now = Math.floor(Date.now() / 1000);
    const challenge = await db
      .select()
      .from(challenges)
      .where(
        and(
          eq(challenges.username, trimmedUsername),
          eq(challenges.isRegister, true),
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

    // Verify the signature
    const isValidSignature = verifySignature(challenge.nonce, signature, publicKey);
    if (!isValidSignature) {
      throw new Error('Invalid signature');
    }

    // Mark challenge as used
    await db
      .update(challenges)
      .set({ used: true })
      .where(eq(challenges.id, challenge.id));

    // Create the user
    const newUser = await db
      .insert(users)
      .values({
        username: trimmedUsername,
        name: trimmedUsername, // Use username as default name
        publicKey,
        passwordHash: null, // No password for biometric users
      })
      .returning()
      .get();

    // Generate token and store in KV with TTL (7 days)
    const token = await generateToken(newUser.id, newUser.username);
    try {
      await context.env.KV?.put(`token:${token}`, newUser.id, {
        expirationTtl: 60 * 60 * 24 * 7, // 7 days
      });
    } catch (kvError) {
      console.warn('[registerUser] Warning: Failed to store token in KV', kvError);
    }

    console.log('[registerUser] ✅ User registered successfully:', {
      userId: newUser.id,
      username: newUser.username,
      publicKey: publicKey.substring(0, 16) + '...',
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        createdAt: newUser.createdAt || new Date().toISOString(),
      },
      token,
    };
  } catch (error) {
    console.error('[registerUser] Error:', error);
    throw error;
  }
};

