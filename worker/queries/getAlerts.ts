// Query resolver for getAlerts
// Handles retrieving all alerts/notifications for the current user

import { eq, desc } from 'drizzle-orm';
import { getServerDB } from '@database/server';
import { notifications } from '@database/server';
import { ResolverContext } from '../types';

export const getAlerts = async (
  _parent: unknown,
  _args: unknown,
  context: ResolverContext
) => {
  // Get userId from context (set by auth middleware)
  // The context is extended with userId in worker/index.ts
  const userId = (context as any).userId;
  
  if (!userId) {
    // If no user is authenticated, return empty array
    return [];
  }

  const db = getServerDB(context.env.DB);

  // Fetch notifications from database for the current user
  // Include new polymorphic fields (actorId, targetType, targetId)
  const dbNotifications = await db
    .select({
      id: notifications.id,
      userId: notifications.userId,
      actorId: notifications.actorId,
      type: notifications.type,
      targetType: notifications.targetType,
      targetId: notifications.targetId,
      data: notifications.data,
      read: notifications.read,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .all();

  // Map database notifications to Alert format
  // The notifications table stores alert data in the 'data' JSON field
  return dbNotifications.map((notification) => {
    let alertData: any = {};
    
    // Parse the data JSON field if it exists
    if (notification.data) {
      try {
        alertData = JSON.parse(notification.data);
      } catch (error) {
        // If parsing fails, use empty object
        console.warn('Failed to parse notification data:', error);
      }
    }

    // Map to Alert format expected by GraphQL schema
    // Use targetType/targetId if available, otherwise fall back to data JSON
    const targetType = notification.targetType || (alertData.tripId ? 'TRIP' : null);
    const targetId = notification.targetId || alertData.tripId || null;
    
    return {
      id: notification.id,
      type: notification.type,
      title: alertData.title || notification.type,
      message: alertData.message || '',
      step: alertData.step || null,
      totalSteps: alertData.totalSteps || null,
      tripId: targetType === 'TRIP' ? targetId : (alertData.tripId || null), // Keep for backward compatibility
      userId: notification.userId,
      actorId: notification.actorId || null, // Include actorId if available
      targetType: targetType, // Include targetType
      targetId: targetId, // Include targetId
      read: notification.read || false,
      createdAt: notification.createdAt,
    };
  });
};

