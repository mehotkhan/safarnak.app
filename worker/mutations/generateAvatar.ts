// Mutation resolver for generateAvatar
// Generates an AI avatar image based on user's name and updates their profile

import { getServerDB, users } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';
import { generateAvatarImage } from '../utilities/ai/generateAvatar';

const VALID_STYLES = ['professional', 'casual', 'artistic', 'minimalist'] as const;

const mimeToExt: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

/** --- Helpers ----------------------------------------------------------- */

function resolveStyle(style?: string) {
  if (!style) return 'professional';
  const s = style.toLowerCase();
  return VALID_STYLES.includes(s as any) ? (s as typeof VALID_STYLES[number]) : 'professional';
}

function parseName(name?: string, username?: string) {
  const parts = (name || '').trim().split(/\s+/);
  const firstName = parts[0] || username || 'User';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : undefined;
  return { firstName, lastName };
}

/** Base URL resolution — clean, deterministic */
function resolveBaseUrl(env: any, request: Request | undefined): string {
  // Priority 1: GRAPHQL_URL (always correct for mobile clients)
  // In production, this should be set to the production GraphQL URL
  // e.g., https://safarnak.app/graphql → https://safarnak.app
  const gql = env?.GRAPHQL_URL;
  if (gql) {
    try {
      return new URL(gql).origin;
    } catch {
      // Invalid URL format, continue to next priority
    }
  }

  // Priority 2: request host (works in production - uses actual worker domain)
  // In production, this will be the worker's domain (e.g., safarnak-worker.workers.dev or safarnak.app)
  if (request) {
    try {
      const url = new URL(request.url);
      const host = url.hostname;
      // In production, host will be the actual domain (not localhost)
      if (!['0.0.0.0', 'localhost', '127.0.0.1'].includes(host)) {
        return `${url.protocol}//${host}${url.port ? `:${url.port}` : ''}`;
      }
    } catch {
      // Invalid URL format, continue to next priority
    }
  }

  // Priority 3: WORKER_URL (manual override)
  if (env?.WORKER_URL) return env.WORKER_URL;

  // Fallback to production domain
  return 'https://safarnak.app';
}

async function deleteOldAvatar(env: any, oldUrl: string | null, newKey: string) {
  if (!oldUrl) return;

  let oldKey: string | null = null;
  if (oldUrl.includes('/avatars/')) {
    oldKey = `avatars/${oldUrl.split('/avatars/')[1]}`;
  } else {
    const last = oldUrl.split('/').pop();
    if (last?.startsWith('user-')) oldKey = `avatars/${last}`;
  }

  if (oldKey && oldKey !== newKey) {
    await env.R2.delete(oldKey).catch(() => {
      // Ignore deletion errors (avatar might not exist)
    });
  }
}

/** --- Main Resolver ----------------------------------------------------- */

export const generateAvatar = async (
  _parent: unknown,
  { style }: { style?: string },
  context: GraphQLContext
) => {
  const userId = context.userId;
  if (!userId) throw new Error('Not authenticated');

  const db = getServerDB(context.env.DB);

  const currentUser = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .get();

  if (!currentUser) throw new Error('User not found');

  const { firstName, lastName } = parseName(currentUser.name, currentUser.username);
  const avatarStyle = resolveStyle(style);

  console.log('[generateAvatar] Generating avatar for user:', {
    userId,
    firstName,
    lastName,
    style: avatarStyle,
  });

  // Generate image via AI
  const { imageBase64, mimeType } = await generateAvatarImage(context.env, {
    firstName,
    lastName,
    style: avatarStyle,
  });

  const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
  const ext = mimeToExt[mimeType.toLowerCase()] || 'png';
  const r2Key = `avatars/user-${userId}.${ext}`;

  console.log('[generateAvatar] Uploading generated avatar to R2:', {
    r2Key,
    mimeType,
    size: imageBuffer.length,
  });

  // Upload to R2
  await context.env.R2.put(r2Key, imageBuffer, {
    httpMetadata: { contentType: mimeType },
    customMetadata: {
      userId,
      generated: 'true',
      style: avatarStyle,
      uploadedAt: new Date().toISOString(),
    },
  });

  const baseUrl = resolveBaseUrl(context.env, (context as any).request);
  const avatarUrl = `${baseUrl}/${r2Key}`;

  console.log('[generateAvatar] Constructed avatar URL:', {
    baseUrl,
    r2Key,
    finalUrl: avatarUrl,
  });

  // Delete previous avatar
  await deleteOldAvatar(context.env, currentUser.avatar, r2Key);

  // Update DB
  await db
    .update(users)
    .set({ avatar: avatarUrl, updatedAt: new Date().toISOString() })
    .where(eq(users.id, userId));

  const updated = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .get();

  if (!updated) {
    throw new Error('Failed to retrieve updated user');
  }

  console.log('[generateAvatar] Avatar generated and updated successfully:', {
    userId,
    avatarUrl,
  });

  return {
    id: updated.id,
    name: updated.name,
    username: updated.username,
    email: updated.email,
    phone: updated.phone,
    avatar: updated.avatar,
    publicKey: updated.publicKey,
    createdAt: updated.createdAt || new Date().toISOString(),
  };
};
