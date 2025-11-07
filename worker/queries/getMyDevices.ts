// Query resolver for getMyDevices
// Returns all devices for the authenticated user

import { getServerDB, devices } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

export const getMyDevices = async (
  _parent: unknown,
  _args: unknown,
  context: GraphQLContext
) => {
  try {
    // Get userId from context (set by auth middleware in worker/index.ts)
    const userId = context.userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const db = getServerDB(context.env.DB);

    // Fetch all devices for this user
    const userDevices = await db
      .select()
      .from(devices)
      .where(eq(devices.userId, userId))
      .all();

    console.log('[getMyDevices] Retrieved devices:', {
      userId,
      count: userDevices.length,
    });

    return userDevices.map((device) => ({
      id: device.id,
      deviceId: device.deviceId,
      publicKey: device.publicKey,
      type: device.type,
      lastSeen: device.lastSeen || device.createdAt || new Date().toISOString(),
      createdAt: device.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('[getMyDevices] Error:', error);
    throw error;
  }
};

