import { getServerDB, challenges } from '@database/server';
import { generateNonce } from '../utilities/crypto';
import type { GraphQLContext } from '../types';

const CHALLENGE_EXPIRY = 5 * 60; // 5 minutes in seconds

export const requestChallenge = async (
  _: unknown,
  { username, isRegister }: { username: string; isRegister: boolean },
  context: GraphQLContext
): Promise<string> => {
  try {
    if (!username || username.trim().length === 0) {
      throw new Error('Username is required');
    }

    const trimmedUsername = username.trim();

    // Generate a random nonce
    const nonce = generateNonce();
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + CHALLENGE_EXPIRY;

    const db = getServerDB(context.env.DB);

    // Store the challenge in the database
    await db.insert(challenges).values({
      username: trimmedUsername,
      nonce,
      isRegister,
      expiresAt,
      used: false,
    });

    console.log('[requestChallenge]', {
      username: trimmedUsername,
      isRegister,
      noncePrefix: nonce.substring(0, 16) + '...',
      expiresAt,
    });

    return nonce;
  } catch (error) {
    console.error('[requestChallenge] Error:', error);
    throw error;
  }
};

