import { getServerDB } from '@database/server';
import { trips, feedEvents, users, searchIndex } from '@database/server';
import type { GraphQLContext } from '../types';
import { generateWaypointsForDestination } from '../utils/waypointsGenerator';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { incrementTrendingEntity, incrementTrendingTopic } from '../utilities/trending';
import { enqueueEmbeddingJob } from '../utilities/embeddings';
import { createTripAI } from '../utilities/ai';

interface CreateTripInput {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers: number;
  preferences?: string;
  accommodation?: string;
}

export const createTrip = async (
  _: any,
  { input }: { input: CreateTripInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Normalize optional fields
  const description = input.preferences?.trim();
  const destination = input.destination?.trim();
  const accommodation = input.accommodation ?? 'hotel';

  let userLocation: string | undefined;
  if (description) {
    const locationMatch = description.match(/Current Location:\s*([^\n]+)/i);
    if (locationMatch?.[1]) {
      userLocation = locationMatch[1].trim();
    }
  }

  // Validate input - only description and travelers are required
  if (!description || description.length < 10) {
    throw new Error('Trip description is required and must be at least 10 characters');
  }

  const travelers = input.travelers ?? 1;
  if (!travelers || travelers < 1) {
    throw new Error('Number of travelers must be at least 1');
  }

  // Generate AI-powered trip using Cloudflare Workers AI
  let aiReasoning: string;
  let itineraryData: any[];
  let coordinatesData: any;
  let waypoints: any[];
  
  try {
    const ai = createTripAI(context.env);
    
    // Step 1: Analyze preferences
    console.log('Starting AI trip generation...');
    const analysis = await ai.analyzePreferences({
      destination,
      preferences: description,
      budget: input.budget,
      travelers,
      startDate: input.startDate,
      endDate: input.endDate,
      accommodation,
      userLocation,
    });
    
    // Step 2: Generate itinerary
    const itinerary = await ai.generateItinerary(
      {
        destination,
        preferences: description,
        budget: input.budget,
        travelers,
        startDate: input.startDate,
        endDate: input.endDate,
        accommodation,
        userLocation,
      },
      analysis
    );
    
    aiReasoning = itinerary.aiReasoning;
    itineraryData = itinerary.days;
    
    // Step 3: Get coordinates (AI-based geocoding)
    if (destination) {
      const geoData = await ai.geocodeDestination(destination);
      coordinatesData = geoData.coordinates;
    } else {
      coordinatesData = { latitude: 0, longitude: 0 };
    }
    
    // Generate waypoints for the trip route
    waypoints = generateWaypointsForDestination(destination || itinerary.destination);
    
    console.log('AI trip generation complete:', {
      days: itineraryData.length,
      destination: itinerary.destination,
      style: analysis.travelStyle
    });
  } catch (aiError) {
    // Fallback to simple data if AI fails
    console.error('AI generation failed, using fallback:', aiError);
    aiReasoning = `Based on your preferences for ${description}, I've created a trip plan to ${destination || 'your destination'}.`;
    itineraryData = [
    {
      day: 1,
      title: 'Arrival & Exploration',
      activities: ['Check into accommodation', 'Local orientation walk', 'Welcome dinner'],
    },
    {
      day: 2,
      title: 'Main Attractions',
      activities: ['Visit top landmarks', 'Cultural experience', 'Local cuisine tasting'],
    },
  ];
    coordinatesData = { latitude: 35.6762, longitude: 139.6503 };
    waypoints = generateWaypointsForDestination(destination);
  }

  try {
    // Insert trip
    const metadataPayload = userLocation ? { userLocation } : undefined;

    const result = await db
      .insert(trips)
      .values({
        userId,
        title: destination || 'Untitled Trip',
        destination: destination || 'Untitled Trip',
        startDate: input.startDate,
        endDate: input.endDate,
        budget: input.budget != null ? Math.round(Number(input.budget)) : null,
        travelers,
        preferences: description,
        accommodation,
        status: 'pending',
        aiReasoning,
        itinerary: JSON.stringify(itineraryData),
        coordinates: JSON.stringify(coordinatesData),
        waypoints: JSON.stringify(waypoints),
        aiGenerated: true,
        metadata: metadataPayload ? JSON.stringify(metadataPayload) : null,
      })
      .returning()
      .get();

    // Trigger workflow for trip creation notifications
    try {
      const workflowInstance = await context.env.TRIP_CREATION_WORKFLOW.create({
        id: `trip-${result.id}`,
        params: {
          tripId: result.id.toString(),
          userId,
          destination: destination || undefined,
          startDate: input.startDate || undefined,
          endDate: input.endDate || undefined,
          budget: input.budget ?? undefined,
          travelers,
          accommodation,
          preferences: description,
          userLocation,
        },
      });
      console.log('Trip creation workflow started:', workflowInstance.id);
    } catch (workflowError: any) {
      // Log workflow error but don't fail the mutation
      console.error('Failed to start trip creation workflow:', workflowError);
    }

    // Publish feed event for trip creation (PUBLIC in Phase 1)
    try {
      // Ensure we can resolve actor
      const actor = await db.select().from(users).where(eq(users.id, userId)).get();
      await db
        .insert(feedEvents)
        .values({
          entityType: 'TRIP',
          entityId: result.id,
          actorId: userId,
          verb: 'CREATED',
          topics: JSON.stringify([]),
          visibility: 'PUBLIC',
        })
        .run();
      // Upsert search index (lexical MVP) and trending increments
      try {
        const title = result.destination || 'Trip';
        const tokens = [result.destination || '', result.preferences || ''].join(' ').toLowerCase();
        const existing = await db
          .select()
          .from(searchIndex)
          .where(sql`${searchIndex.entityType} = 'TRIP' AND ${searchIndex.entityId} = ${result.id}`)
          .get();
        if (existing) {
          await db
            .update(searchIndex)
            .set({
              title,
              text: result.preferences || null,
              tags: JSON.stringify([]),
              tokens,
              updatedAt: new Date().toISOString(),
            })
            .where(sql`${searchIndex.id} = ${existing.id}`)
            .run();
        } else {
          await db
            .insert(searchIndex)
            .values({
              entityType: 'TRIP',
              entityId: result.id,
              title,
              text: result.preferences || null,
              tags: JSON.stringify([]),
              tokens,
            })
            .run();
        }
        await incrementTrendingEntity(context.env, 'TRIP');
        if (result.destination) {
          await incrementTrendingTopic(context.env, result.destination.toLowerCase());
        }
      } catch (_) {
        // ignore errors
      }
      // Upsert search index (lexical MVP)
      try {
        const title = result.destination || 'Trip';
        const tokens = [result.destination || '', result.preferences || ''].join(' ').toLowerCase();
        const existing = await db
          .select()
          .from(searchIndex)
          .where(sql`${searchIndex.entityType} = 'TRIP' AND ${searchIndex.entityId} = ${result.id}`)
          .get();
        if (existing) {
          await db
            .update(searchIndex)
            .set({
              title,
              text: result.preferences || null,
              tags: JSON.stringify([]),
              tokens,
              updatedAt: new Date().toISOString(),
            })
            .where(sql`${searchIndex.id} = ${existing.id}`)
            .run();
        } else {
          await db
            .insert(searchIndex)
            .values({
              entityType: 'TRIP',
              entityId: result.id,
              title,
              text: result.preferences || null,
              tags: JSON.stringify([]),
              tokens,
            })
            .run();
        }
      } catch (e) {
        console.error('searchIndex upsert failed for TRIP', e);
      }
      context.publish('FEED_NEW_EVENTS', {
        feedNewEvents: [
          {
            id: result.id,
            entityType: 'TRIP',
            entityId: result.id,
            verb: 'CREATED',
            actor: actor
              ? {
                  id: actor.id,
                  name: actor.name,
                  username: actor.username,
                  email: actor.email,
                  phone: actor.phone,
                  avatar: actor.avatar,
                  createdAt: actor.createdAt,
                }
              : { id: userId, name: '', username: '', createdAt: new Date().toISOString() },
            entity: { __typename: 'Trip', ...result },
            topics: [],
            visibility: 'PUBLIC',
            createdAt: result.createdAt,
          },
        ],
      });
    } catch (e) {
      console.error('Failed to publish feed event for createTrip', e);
    }

    // Enqueue embedding job
    try {
      const text = [result.destination || '', result.preferences || ''].join(' ').trim();
      if (text) {
        await enqueueEmbeddingJob(context.env, {
          entityType: 'TRIP',
          entityId: result.id,
          text,
          lang: 'auto',
          model: '@cf/baai/bge-m3',
        });
      }
    } catch (e) {
      console.warn('enqueueEmbeddingJob failed for TRIP', e);
    }

    return {
      ...result,
      itinerary: JSON.parse(result.itinerary || '[]'),
      coordinates: JSON.parse(result.coordinates || '{}'),
      waypoints: JSON.parse(result.waypoints || '[]'),
    };
  } catch (error: any) {
    // Log internal error details for observability without leaking to client
    console.error('createTrip failed', {
      userId,
      destination,
      hasDates: Boolean(input.startDate || input.endDate),
      travelers,
      error: error?.stack || String(error),
    });
    // Return a client-facing error key used by the app i18n layer
    throw new Error('plan.form.errors.generateFailed');
  }
};

