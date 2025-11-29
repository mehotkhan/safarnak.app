/**
 * Utility function to publish notifications via GraphQL subscriptions
 * This can be called from workflows or other contexts
 * Also stores notifications in the database for querying
 */

import type { Env } from '../types';
import { createDefaultPublishableContext } from 'graphql-workers-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readGraphQLSchema } from '../../graphql/schema-loader';
import { resolvers } from '../index';
import { getServerDB } from '@database/server';
import { notifications } from '@database/server';
import { createId } from '@database/utils';

// ExecutionContext is a global type from Cloudflare Workers runtime
// It's defined in worker-configuration.d.ts

// Create schema for publishing (only needed for publishable context)
const schema = makeExecutableSchema({
  typeDefs: readGraphQLSchema(),
  resolvers,
});

const getSettings = (env: Env) => ({
  schema,
  wsConnectionPool: () => env.SUBSCRIPTION_POOL,
  subscriptionsDb: () => env.DB,
});

/**
 * Publish a notification to subscribers
 * Uses the subscription pool to broadcast messages
 */
export async function publishNotification(
  env: Env,
  topic: string,
  payload: any,
  executionCtx?: ExecutionContext
): Promise<void> {
  try {
    console.log(`[publishNotification] Publishing to topic: ${topic}`, { topic, payload });
    
    // Store notification in database if it's an alert or trip update
    if (topic === 'NEW_ALERTS' && payload.newAlerts) {
      const alert = payload.newAlerts;
      try {
        const db = getServerDB(env.DB);
        
        // Store alert data in the notifications table
        // The alert object contains all the fields we need
        // Use new polymorphic fields (targetType/targetId) if available, otherwise use data JSON
        const notificationData: any = {
          id: alert.id || createId(),
          userId: alert.userId,
          type: alert.type,
          data: JSON.stringify({
            title: alert.title,
            message: alert.message,
            step: alert.step,
            totalSteps: alert.totalSteps,
            tripId: alert.tripId, // Keep for backward compatibility in data JSON
            read: alert.read || false,
          }),
          read: alert.read || false,
          createdAt: alert.createdAt || new Date().toISOString(),
        };
        
        // Add polymorphic fields if available
        if (alert.targetType) {
          notificationData.targetType = alert.targetType;
        }
        if (alert.targetId) {
          notificationData.targetId = alert.targetId;
        } else if (alert.tripId) {
          // Map tripId to targetType/targetId for trip-related notifications
          notificationData.targetType = 'TRIP';
          notificationData.targetId = alert.tripId;
        }
        
        // Add actorId if available
        if (alert.actorId) {
          notificationData.actorId = alert.actorId;
        }

        await db.insert(notifications).values(notificationData).run();
        console.log(`[publishNotification] Stored notification in database: ${notificationData.id}`);
      } catch (dbError: any) {
        // Log database error but don't fail the publish
        console.error(`[publishNotification] Error storing notification in database:`, dbError);
      }
    }
    
    // Handle trip-specific updates (TRIP_UPDATE topic)
    // These are published to trip-specific subscribers but don't need to be stored separately
    // since they're workflow progress updates
    if (topic === 'TRIP_UPDATE' && payload.tripUpdates) {
      console.log(`[publishNotification] Publishing trip update for trip ${payload.tripUpdates.tripId}`);
    }
    
    // Use the provided execution context or create a mock one
    // Workflows provide their own ctx which should work with waitUntil
    const promises: Promise<any>[] = [];
    const ctx: ExecutionContext = executionCtx || {
      waitUntil: (promise: Promise<any>) => {
        promises.push(promise);
      },
      passThroughOnException: () => {},
    } as ExecutionContext;
    
    const context = createDefaultPublishableContext({
      env,
      executionCtx: ctx,
      ...getSettings(env),
    });

    // Publish the notification - this internally uses waitUntil if needed
    context.publish(topic, payload);
    
    // Give the publish operation time to complete
    // The publish might use waitUntil internally, so we wait a bit
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // If we have promises from waitUntil, wait for them
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    
    console.log(`[publishNotification] Published successfully to topic: ${topic}`);
  } catch (error) {
    console.error(`[publishNotification] Error publishing to topic ${topic}:`, error);
    throw error;
  }
}

