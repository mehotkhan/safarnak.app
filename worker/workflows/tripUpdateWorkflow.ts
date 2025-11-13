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
import { generateWaypointsForDestination } from '../utils/waypointsGenerator';
import { createTripAI } from '../utilities/ai';

interface TripUpdateParams {
  tripId: string;
  userId: string;
  userMessage: string;
  destination?: string;
}

export class TripUpdateWorkflow extends WorkflowEntrypoint<Env, TripUpdateParams> {
  override async run(event: WorkflowEvent<TripUpdateParams>, step: WorkflowStep): Promise<void> {
    const { tripId, userId: _userId, userMessage, destination: _destination } = event.payload;

    // Step 1: Acknowledge user request
    await step.do('Step 1: Acknowledge user request', async () => {
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

      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx);

      return { status: 'acknowledged' };
    });

    // Wait 1 second
    await step.sleep('Wait 1 second', '1 second');

    // Step 2: Processing AI updates (Real AI processing)
    const aiUpdateResult = await step.do('Step 2: Processing AI updates', async () => {
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

      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx);

      // Fetch current trip
      const db = getServerDB(this.env.DB);
      const currentTrip = await db.select().from(trips).where(eq(trips.id, tripId)).get();
      
      if (!currentTrip) {
        throw new Error('Trip not found');
      }

      // Parse current itinerary
      let currentItinerary;
      try {
        currentItinerary = currentTrip.itinerary ? JSON.parse(currentTrip.itinerary) : [];
      } catch {
        currentItinerary = [];
      }

      // Use AI to understand and process user's update request
      const ai = createTripAI(this.env);
      const updateResult = await ai.updateTrip({
        currentTrip: {
          destination: currentTrip.destination ?? undefined,
          preferences: currentTrip.preferences ?? undefined,
          budget: currentTrip.budget !== null ? currentTrip.budget : undefined,
          travelers: currentTrip.travelers ?? 1,
          itinerary: currentItinerary
        },
        userMessage
      });

      console.log('AI update processed:', updateResult.understood);
      return { status: 'updating', updateResult, currentTrip };
    });

    // Wait 2 seconds
    await step.sleep('Wait 2 seconds', '2 seconds');

    // Step 3: Complete update and mark as ready (Apply AI changes)
    await step.do('Step 3: Complete update', async () => {
      const db = getServerDB(this.env.DB);
      
      const { updateResult, currentTrip } = aiUpdateResult;
      
      // Apply modifications from AI
      const modifications = updateResult.modifications || {};
      const finalDestination = modifications.destination || currentTrip.destination || 'Destination';
      
      // Generate waypoints for the trip route if destination changed
      let waypoints;
      try {
        const currentWaypoints = currentTrip.waypoints ? JSON.parse(currentTrip.waypoints) : [];
        waypoints = modifications.destination 
          ? generateWaypointsForDestination(finalDestination)
          : currentWaypoints;
      } catch {
        waypoints = generateWaypointsForDestination(finalDestination);
      }
      
      // Get updated coordinates if destination changed
      let coordinates;
      try {
        const currentCoords = currentTrip.coordinates ? JSON.parse(currentTrip.coordinates) : { latitude: 0, longitude: 0 };
        
        if (modifications.destination) {
          const ai = createTripAI(this.env);
          const geoData = await ai.geocodeDestination(finalDestination);
          coordinates = geoData.coordinates;
        } else {
          coordinates = currentCoords;
        }
      } catch {
        coordinates = { latitude: 0, longitude: 0 };
      }
      
      // Build update data with AI-generated changes
      const updateData: any = {
        destination: modifications.destination || currentTrip.destination,
        budget: modifications.budget !== undefined && modifications.budget !== null ? modifications.budget : currentTrip.budget,
        travelers: modifications.travelers || currentTrip.travelers,
        preferences: modifications.preferences || currentTrip.preferences,
        aiReasoning: updateResult.aiReasoning,
        itinerary: JSON.stringify(updateResult.updatedItinerary),
        coordinates: JSON.stringify(coordinates),
        waypoints: JSON.stringify(waypoints),
        status: 'ready',
        updatedAt: new Date().toISOString(),
      };

      await db
        .update(trips)
        .set(updateData)
        .where(eq(trips.id, tripId))
        .run();

      // Send final trip update
      const tripUpdate = {
        id: `${tripId}-update-step-3`,
        tripId,
        type: 'workflow',
        title: 'سفر به‌روزرسانی شد!',
        message: `${updateResult.understood} - سفر شما با موفقیت به‌روزرسانی شد!`,
        step: 3,
        totalSteps: 3,
        status: 'completed',
        data: JSON.stringify({ 
          status: 'completed', 
          understood: updateResult.understood,
          modifications: Object.keys(modifications).length
        }),
        createdAt: new Date().toISOString(),
      };

      await publishNotification(this.env, 'TRIP_UPDATE', { tripUpdates: tripUpdate }, this.ctx);

      return { status: 'completed' };
    });
  }
}

