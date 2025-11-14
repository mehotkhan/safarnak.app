/**
 * Trip Creation Workflow (Intelligent Pipeline)
 * 
 * New architecture:
 * - Research destination (cache-first, real data from OSM + AI)
 * - Validate feasibility (budget, dates, reachability)
 * - Generate itinerary (semantic matching + AI synthesis)
 * - Save with real coordinates and waypoints
 * 
 * Reduced to 4 steps, ~10-15s total
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import type { Env } from '../types';
import { publishNotification } from '../utilities/publishNotification';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import { orchestrateTripPlanning } from '../utilities/tripOrchestrator';

interface TripCreationParams {
  tripId: string;
  userId: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers?: number;
  preferences?: string;
  accommodation?: string;
  userLocation?: string;
  lang?: string;
}

export class TripCreationWorkflow extends WorkflowEntrypoint<Env, TripCreationParams> {
  override async run(event: WorkflowEvent<TripCreationParams>, step: WorkflowStep): Promise<void> {
    const { 
        tripId,
      userId: _userId, 
      destination, 
      startDate,
      endDate,
      budget,
      travelers,
      preferences,
      accommodation: _accommodation,
      userLocation,
      lang,
    } = event.payload;

    // Small initial delay to allow subscription to connect
    await step.sleep('Connection delay', '0.5 seconds');

    // ========================================================================
    // STEP 1: Research Destination (Cache-First)
    // ========================================================================
    await step.do('Step 1: Research', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', { 
        tripUpdates: {
        id: `${tripId}-step-1`,
        tripId,
        type: 'workflow',
          title: 'تحقیق مقصد',
          message: `جمع‌آوری اطلاعات واقعی درباره ${destination || 'مقصد'}...`,
        step: 1,
          totalSteps: 4,
        status: 'processing',
          data: JSON.stringify({ status: 'research', destination }),
        createdAt: new Date().toISOString(),
        }
      }, this.ctx);
    });

    await step.sleep('Research delay', '1 second');

    // ========================================================================
    // STEP 2: Validate & Match (Intelligent Pipeline)
    // ========================================================================
    await step.do('Step 2: Validate', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
        id: `${tripId}-step-2`,
        tripId,
        type: 'workflow',
          title: 'اعتبارسنجی',
          message: 'بررسی امکان‌پذیری سفر و تطبیق با ترجیحات...',
        step: 2,
          totalSteps: 4,
        status: 'processing',
          data: JSON.stringify({ status: 'validation' }),
        createdAt: new Date().toISOString(),
        }
      }, this.ctx);
    });

    await step.sleep('Validation delay', '1 second');

    // ========================================================================
    // STEP 3: Generate Intelligent Itinerary
    // ========================================================================
    const tripResult = await step.do('Step 3: Generate', async () => {
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
        id: `${tripId}-step-3`,
        tripId,
        type: 'workflow',
          title: 'ساخت برنامه سفر',
          message: 'ایجاد برنامه سفر شخصی‌سازی شده با مکان‌های واقعی...',
        step: 3,
          totalSteps: 4,
        status: 'processing',
          data: JSON.stringify({ status: 'generation' }),
        createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      // Calculate duration
      const calculateDuration = (start?: string, end?: string): number => {
        if (!start || !end) return 7;
        try {
          const s = new Date(start);
          const e = new Date(end);
          const diff = Math.abs(e.getTime() - s.getTime());
          return Math.max(1, Math.min(30, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1));
        } catch {
          return 7;
        }
      };

      // Run intelligent orchestrator
      const result = await orchestrateTripPlanning(this.env, {
        destination: destination || 'Unknown',
        startDate,
        endDate,
        duration: calculateDuration(startDate, endDate),
        budget,
        travelers: travelers || 1,
        preferences: preferences || '',
        userLocation,
        lang,
      });

      if (!result.success || !result.trip) {
        // Log error but don't throw - let user see the error
        console.error('[Workflow] Orchestrator failed:', result.error);
        
        // Notify user of error
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-error`,
            tripId,
            type: 'workflow',
            title: 'خطا در ساخت سفر',
            message: result.error || 'متأسفانه نتوانستیم سفر شما را ایجاد کنیم. لطفاً دوباره تلاش کنید.',
            step: 3,
            totalSteps: 4,
            status: 'error',
            data: JSON.stringify({ error: result.error, warnings: result.warnings }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
        
        throw new Error(result.error || 'Trip generation failed');
      }

      console.log('✅ Intelligent trip generated:', result.trip.days.length, 'days');
      
      // Show warnings to user if any
      if (result.warnings && result.warnings.length > 0) {
        await publishNotification(this.env, 'TRIP_UPDATE', {
          tripUpdates: {
            id: `${tripId}-warnings`,
            tripId,
            type: 'workflow',
            title: 'هشدارها',
            message: result.warnings.join(', '),
            step: 3,
            totalSteps: 4,
            status: 'processing',
            data: JSON.stringify({ warnings: result.warnings }),
            createdAt: new Date().toISOString(),
          }
        }, this.ctx);
      }

      return { trip: result.trip, warnings: result.warnings };
    });

    await step.sleep('Generation complete', '1 second');

    // ========================================================================
    // STEP 4: Final Save & Notify
    // ========================================================================
    await step.do('Step 4: Save', async () => {
      const db = getServerDB(this.env.DB);
      
      const { trip } = tripResult;
      
      const updateData: any = {
        title: trip.title,
        destination: trip.destination,
        aiReasoning: trip.aiReasoning,
        itinerary: JSON.stringify(trip.days),
        coordinates: JSON.stringify(trip.coordinates),
        waypoints: JSON.stringify(trip.waypoints),
        budget: trip.estimatedBudget?.total || budget || null,
        status: 'ready',
        updatedAt: new Date().toISOString(),
        metadata: JSON.stringify(trip.metadata),
      };

      await db.update(trips).set(updateData).where(eq(trips.id, tripId)).run();

      // Final notification
      await publishNotification(this.env, 'TRIP_UPDATE', {
        tripUpdates: {
          id: `${tripId}-step-4`,
        tripId,
        type: 'workflow',
        title: 'سفر آماده است!',
          message: `${trip.destination} - ${trip.days.length} روز - با مکان‌های واقعی و تأیید شده`,
          step: 4,
          totalSteps: 4,
        status: 'completed',
          data: JSON.stringify({ 
            status: 'completed', 
            destination: trip.destination, 
            days: trip.days.length,
            waypoints: trip.waypoints.length,
          }),
        createdAt: new Date().toISOString(),
        }
      }, this.ctx);

      console.log('✅ Intelligent trip workflow complete:', tripId, trip.destination);

      return { status: 'completed' };
    });
  }
}
