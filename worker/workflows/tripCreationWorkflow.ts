/**
 * Trip Creation Workflow
 * Executes a 4-step workflow when a trip is created and sends notifications via WebSocket
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import type { Env } from '../types';
import { publishNotification } from '../utilities/publishNotification';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
// Persian text is now generated inline in notifications
import { generateRandomTripData } from '../utilities/randomTripGenerator';

interface TripCreationParams {
  tripId: string;
  userId: string;
  destination?: string;
  preferences?: string;
}

export class TripCreationWorkflow extends WorkflowEntrypoint<Env, TripCreationParams> {
  override async run(event: WorkflowEvent<TripCreationParams>, step: WorkflowStep): Promise<void> {
    const { tripId, userId, destination, preferences } = event.payload;

    // Step 1: Initialize trip processing
    await step.do('Step 1: Initialize trip processing', async () => {
      const notification = {
        id: `${tripId}-step-1`,
        type: 'trip',
        title: 'شروع سفر',
        message: `سفر شما به ${destination || 'مقصد انتخاب شده'} در حال پردازش است...`,
        step: 1,
        totalSteps: 4,
        tripId,
        userId,
        createdAt: new Date().toISOString(),
      };

      // Publish notification via GraphQL subscription
      // Use workflow's execution context
      await publishNotification(this.env, 'NEW_ALERTS', { newAlerts: notification }, this.ctx);

      return { status: 'initialized' };
    });

    // Wait 2 seconds
    await step.sleep('Wait 2 seconds', '2 seconds');

    // Step 2: Processing itinerary
    await step.do('Step 2: Processing itinerary', async () => {
      const notification = {
        id: `${tripId}-step-2`,
        type: 'trip',
        title: 'تولید برنامه سفر',
        message: 'در حال ایجاد برنامه سفر شخصی‌سازی شده برای شما...',
        step: 2,
        totalSteps: 4,
        tripId,
        userId,
        createdAt: new Date().toISOString(),
      };

      console.log(`[Workflow] Step 2: Publishing notification for trip ${tripId}`, notification);
      
      await publishNotification(this.env, 'NEW_ALERTS', { newAlerts: notification }, this.ctx);

      return { status: 'itinerary_processing' };
    });

    // Wait 2 seconds
    await step.sleep('Wait 2 seconds', '2 seconds');

    // Step 3: Optimizing recommendations
    await step.do('Step 3: Optimizing recommendations', async () => {
      const notification = {
        id: `${tripId}-step-3`,
        type: 'trip',
        title: 'بهینه‌سازی توصیه‌ها',
        message: 'در حال بهینه‌سازی توصیه‌ها برای سفر شما...',
        step: 3,
        totalSteps: 4,
        tripId,
        userId,
        createdAt: new Date().toISOString(),
      };

      console.log(`[Workflow] Step 3: Publishing notification for trip ${tripId}`, notification);
      
      await publishNotification(this.env, 'NEW_ALERTS', { newAlerts: notification }, this.ctx);

      return { status: 'optimizing' };
    });

    // Wait 2 seconds
    await step.sleep('Wait 2 seconds', '2 seconds');

    // Step 4: Generate complete trip and mark as ready
    await step.do('Step 4: Generate complete trip', async () => {
      const db = getServerDB(this.env.DB);
      
      // Generate complete random trip data
      const tripData = generateRandomTripData(preferences);
      
      // Update trip with complete data
      const updateData: any = {
        title: tripData.title,
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        budget: tripData.budget,
        travelers: tripData.travelers,
        accommodation: tripData.accommodation,
        preferences: tripData.preferences,
        aiReasoning: tripData.aiReasoning,
        itinerary: JSON.stringify(tripData.itinerary),
        coordinates: JSON.stringify(tripData.coordinates),
        status: tripData.status,
        updatedAt: new Date().toISOString(),
      };

      await db
        .update(trips)
        .set(updateData)
        .where(eq(trips.id, tripId))
        .run();

      // Send final notification
      const notification = {
        id: `${tripId}-step-4`,
        type: 'trip',
        title: 'سفر آماده است!',
        message: `سفر شما به ${tripData.destination} آماده است! اکنون می‌توانید جزئیات کامل را مشاهده کنید.`,
        step: 4,
        totalSteps: 4,
        tripId,
        userId,
        createdAt: new Date().toISOString(),
      };

      console.log(`[Workflow] Step 4: Publishing notification for trip ${tripId}`, notification);
      
      await publishNotification(this.env, 'NEW_ALERTS', { newAlerts: notification }, this.ctx);

      return { status: 'completed', destination: tripData.destination };
    });
  }
}

