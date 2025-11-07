// Mutation resolver for revokeDevice
// Revokes a device's token and optionally deletes the device entry

import { getServerDB, devices } from '@database/server';
import { eq, and } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

export const revokeDevice = async (
  _: unknown,
  { deviceId }: { deviceId: string },
  context: GraphQLContext
): Promise<boolean> => {
  try {
    // Get userId from context (set by auth middleware in worker/index.ts)
    const userId = context.userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    if (!deviceId) {
      throw new Error('Device ID is required');
    }

    const db = getServerDB(context.env.DB);

    // Verify the device belongs to the user
    const device = await db
      .select()
      .from(devices)
      .where(and(eq(devices.deviceId, deviceId), eq(devices.userId, userId)))
      .get();

    if (!device) {
      throw new Error('Device not found or does not belong to user');
    }

    // Revoke the device's token by deleting it from KV
    try {
      // Get the token for this device
      const token = await context.env.KV?.get(`device:${deviceId}:token`);
      if (token) {
        // Delete the token from KV
        await context.env.KV?.delete(`token:${token}`);
        // Delete the device token mapping
        await context.env.KV?.delete(`device:${deviceId}:token`);
      }
    } catch (kvError) {
      console.warn('[revokeDevice] Warning: Failed to revoke token in KV', kvError);
      // Continue even if KV deletion fails - we'll still delete the device entry
    }

    // Delete the device entry from database
    await db
      .delete(devices)
      .where(and(eq(devices.deviceId, deviceId), eq(devices.userId, userId)));

    console.log('[revokeDevice] ✅ Device revoked successfully:', {
      userId,
      deviceId,
    });

    return true;
  } catch (error) {
    console.error('[revokeDevice] Error:', error);
    throw error;
  }
};

