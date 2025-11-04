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
    
    // Store notification in database if it's an alert
    if (topic === 'NEW_ALERTS' && payload.newAlerts) {
      const alert = payload.newAlerts;
      try {
        const db = getServerDB(env.DB);
        
        // Store alert data in the notifications table
        // The alert object contains all the fields we need
        const notificationData = {
          id: alert.id || createId(),
          userId: alert.userId,
          type: alert.type,
          data: JSON.stringify({
            title: alert.title,
            message: alert.message,
            step: alert.step,
            totalSteps: alert.totalSteps,
            tripId: alert.tripId,
            read: alert.read || false,
          }),
          read: alert.read || false,
          createdAt: alert.createdAt || new Date().toISOString(),
        };

        await db.insert(notifications).values(notificationData).run();
        console.log(`[publishNotification] Stored notification in database: ${notificationData.id}`);
      } catch (dbError: any) {
        // Log database error but don't fail the publish
        console.error(`[publishNotification] Error storing notification in database:`, dbError);
      }
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

