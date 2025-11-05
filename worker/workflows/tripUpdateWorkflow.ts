/**
 * Trip Update Workflow
 * Executes a workflow when a trip is updated via AI chat and sends notifications via WebSocket
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import type { Env } from '../types';
import { publishNotification } from '../utilities/publishNotification';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import { generateRandomTripData } from '../utilities/randomTripGenerator';

interface TripUpdateParams {
  tripId: string;
  userId: string;
  userMessage: string;
  destination?: string;
}

export class TripUpdateWorkflow extends WorkflowEntrypoint<Env, TripUpdateParams> {
  override async run(event: WorkflowEvent<TripUpdateParams>, step: WorkflowStep): Promise<void> {
    const { tripId, userId, userMessage, destination } = event.payload;

    // Step 1: Acknowledge user request
    await step.do('Step 1: Acknowledge user request', async () => {
      const notification = {
        id: `${tripId}-update-step-1`,
        type: 'trip',
        title: 'در حال پردازش درخواست شما',
        message: `در حال بررسی درخواست شما: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"`,
        step: 1,
        totalSteps: 3,
        tripId,
        userId,
        createdAt: new Date().toISOString(),
      };

      const tripUpdate = {
        id: `${tripId}-update-step-1`,
        tripId,
        type: 'workflow',
        title: 'در حال پردازش درخواست شما',
        message: `در حال بررسی درخواست شما: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"`,
        step: 1,
        totalSteps: 3,
        status: 'processing',
        data: JSON.stringify({ status: 'acknowledged', userMessage }),
        createdAt: new Date().toISOString(),
      };

      await Promise.all([
        publishNotification(this.env, 'NEW_ALERTS', { newAlerts: notification }, this.ctx),
        publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx),
      ]);

      return { status: 'acknowledged' };
    });

    // Wait 1 second
    await step.sleep('Wait 1 second', '1 second');

    // Step 2: Processing AI updates
    await step.do('Step 2: Processing AI updates', async () => {
      const notification = {
        id: `${tripId}-update-step-2`,
        type: 'trip',
        title: 'به‌روزرسانی سفر',
        message: 'در حال به‌روزرسانی سفر بر اساس درخواست شما...',
        step: 2,
        totalSteps: 3,
        tripId,
        userId,
        createdAt: new Date().toISOString(),
      };

      const tripUpdate = {
        id: `${tripId}-update-step-2`,
        tripId,
        type: 'workflow',
        title: 'به‌روزرسانی سفر',
        message: 'در حال به‌روزرسانی سفر بر اساس درخواست شما...',
        step: 2,
        totalSteps: 3,
        status: 'processing',
        data: JSON.stringify({ status: 'updating', userMessage }),
        createdAt: new Date().toISOString(),
      };

      await Promise.all([
        publishNotification(this.env, 'NEW_ALERTS', { newAlerts: notification }, this.ctx),
        publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx),
      ]);

      return { status: 'updating' };
    });

    // Wait 2 seconds
    await step.sleep('Wait 2 seconds', '2 seconds');

    // Step 3: Complete update and mark as ready
    await step.do('Step 3: Complete update', async () => {
      const db = getServerDB(this.env.DB);
      
      // Get current trip
      const currentTrip = await db
        .select()
        .from(trips)
        .where(eq(trips.id, tripId))
        .get();

      if (!currentTrip) {
        throw new Error('Trip not found');
      }

      // Generate updated trip data based on user message
      // In a real implementation, this would call an AI service to understand the request
      // For now, we'll update the trip with new data
      const tripData = generateRandomTripData(userMessage);
      
      // Update trip with new data
      const updateData: any = {
        title: tripData.title || currentTrip.title,
        destination: tripData.destination || currentTrip.destination,
        startDate: tripData.startDate || currentTrip.startDate,
        endDate: tripData.endDate || currentTrip.endDate,
        budget: tripData.budget || currentTrip.budget,
        travelers: tripData.travelers || currentTrip.travelers,
        accommodation: tripData.accommodation || currentTrip.accommodation,
        preferences: tripData.preferences || currentTrip.preferences,
        aiReasoning: tripData.aiReasoning || currentTrip.aiReasoning,
        itinerary: JSON.stringify(tripData.itinerary),
        coordinates: JSON.stringify(tripData.coordinates),
        status: 'ready',
        updatedAt: new Date().toISOString(),
      };

      await db
        .update(trips)
        .set(updateData)
        .where(eq(trips.id, tripId))
        .run();

      // Send final notification
      const notification = {
        id: `${tripId}-update-step-3`,
        type: 'trip',
        title: 'سفر به‌روزرسانی شد!',
        message: `سفر شما بر اساس درخواست شما به‌روزرسانی شد!`,
        step: 3,
        totalSteps: 3,
        tripId,
        userId,
        createdAt: new Date().toISOString(),
      };

      const tripUpdate = {
        id: `${tripId}-update-step-3`,
        tripId,
        type: 'workflow',
        title: 'سفر به‌روزرسانی شد!',
        message: `سفر شما بر اساس درخواست شما به‌روزرسانی شد!`,
        step: 3,
        totalSteps: 3,
        status: 'completed',
        data: JSON.stringify({ status: 'completed', userMessage }),
        createdAt: new Date().toISOString(),
      };

      await Promise.all([
        publishNotification(this.env, 'NEW_ALERTS', { newAlerts: notification }, this.ctx),
        publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx),
      ]);

      return { status: 'completed' };
    });
  }
}

