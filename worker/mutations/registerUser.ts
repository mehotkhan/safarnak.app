import { getServerDB, users, challenges, devices } from '@database/server';
import { eq, and } from 'drizzle-orm';
import { verifySignature } from '../utilities/auth/crypto';
import { generateToken } from '../utilities/auth/password';
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
  {
    username,
    publicKey,
    signature,
    deviceId,
  }: {
    username: string;
    publicKey: string;
    signature: string;
    deviceId: string;
  },
  context: GraphQLContext
): Promise<RegisterUserResult> => {
  try {
    if (!username || !publicKey || !signature || !deviceId) {
      throw new Error(
        'Username, publicKey, signature, and deviceId are required'
      );
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
      throw new Error(
        'No valid challenge found. Please request a challenge first.'
      );
    }

    // Check if challenge has expired
    if (challenge.expiresAt < now) {
      throw new Error('Challenge has expired. Please request a new challenge.');
    }

    // Verify the signature using the device's public key
    const isValidSignature = await verifySignature(
      challenge.nonce,
      signature,
      publicKey
    );
    if (!isValidSignature) {
      throw new Error('Invalid signature');
    }

    // Mark challenge as used
    await db
      .update(challenges)
      .set({ used: true })
      .where(eq(challenges.id, challenge.id));

    // Create the user (no publicKey on user - each device has its own)
    const newUser = await db
      .insert(users)
      .values({
        username: trimmedUsername,
        name: trimmedUsername, // Use username as default name
        passwordHash: null, // No password for biometric users
      })
      .returning()
      .get();

    // Create device entry with public key
    await db.insert(devices).values({
      userId: newUser.id,
      deviceId,
      publicKey,
      type: null, // Can be set later if needed
    });

    // Generate token and store in KV with TTL (7 days)
    // Store both userId and deviceId for device-specific token management
    const token = await generateToken(newUser.id, newUser.username);
    try {
      const tokenData = JSON.stringify({
        userId: newUser.id,
        deviceId: deviceId,
      });
      await context.env.KV?.put(`token:${token}`, tokenData, {
        expirationTtl: 60 * 60 * 24 * 7, // 7 days
      });
      // Also store device token mapping for easy revocation
      await context.env.KV?.put(`device:${deviceId}:token`, token, {
        expirationTtl: 60 * 60 * 24 * 7, // 7 days
      });
    } catch (kvError) {
      console.warn(
        '[registerUser] Warning: Failed to store token in KV',
        kvError
      );
    }

    console.log('[registerUser] ✅ User registered successfully:', {
      userId: newUser.id,
      username: newUser.username,
      deviceId,
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

