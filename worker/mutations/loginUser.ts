import { getServerDB, users, challenges, devices } from '@database/server';
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
  {
    username,
    signature,
    deviceId,
    publicKey,
  }: {
    username: string;
    signature: string;
    deviceId: string;
    publicKey?: string;
  },
  context: GraphQLContext
): Promise<LoginUserResult> => {
  try {
    if (!username || !signature || !deviceId) {
      throw new Error('Username, signature, and deviceId are required');
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
      throw new Error(
        'No valid challenge found. Please request a challenge first.'
      );
    }

    // Check if challenge has expired
    if (challenge.expiresAt < now) {
      throw new Error('Challenge has expired. Please request a new challenge.');
    }

    // Find device by deviceId and userId
    const device = await db
      .select()
      .from(devices)
      .where(and(eq(devices.deviceId, deviceId), eq(devices.userId, user.id)))
      .get();

    let devicePublicKey: string;

    if (!device) {
      // New device login - publicKey is required
      if (!publicKey) {
        throw new Error(
          'Device not found. publicKey is required for new device login.'
        );
      }
      devicePublicKey = publicKey;

      // Verify signature with the provided publicKey
      const isValidSignature = await verifySignature(
        challenge.nonce,
        signature,
        devicePublicKey
      );
      if (!isValidSignature) {
        throw new Error('Invalid signature');
      }

      // Create new device entry
      await db.insert(devices).values({
        userId: user.id,
        deviceId,
        publicKey: devicePublicKey,
        type: null, // Can be set later if needed
      });
    } else {
      // Existing device - use stored publicKey
      devicePublicKey = device.publicKey;

      // Verify the signature against the device's public key
      const isValidSignature = await verifySignature(
        challenge.nonce,
        signature,
        devicePublicKey
      );
      if (!isValidSignature) {
        throw new Error('Invalid signature');
      }

      // Update device lastSeen timestamp
      await db
        .update(devices)
        .set({ lastSeen: new Date().toISOString() })
        .where(eq(devices.id, device.id));
    }

    // Mark challenge as used
    await db
      .update(challenges)
      .set({ used: true })
      .where(eq(challenges.id, challenge.id));

    // Generate token and store in KV with TTL (7 days)
    // Store both userId and deviceId for device-specific token management
    const token = await generateToken(user.id, user.username);
    try {
      const tokenData = JSON.stringify({
        userId: user.id,
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
      console.warn('[loginUser] Warning: Failed to store token in KV', kvError);
    }

    console.log('[loginUser] ✅ User logged in successfully:', {
      userId: user.id,
      username: user.username,
      deviceId,
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

