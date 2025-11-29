import { getServerDB } from '@database/server';
import { trips, feedEvents, users, profiles, searchIndex } from '@database/server';
import type { GraphQLContext } from '../types';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { incrementTrendingEntity, incrementTrendingTopic } from '../utilities/trending';
import { enqueueEmbeddingJob } from '../utilities/semantic/embeddings';
// Note: orchestrateTripPlanning is used by TripCreationWorkflow, not directly here

interface CreateTripInput {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers: number;
  preferences?: string;
  accommodation?: string;
  lang?: string;
  // Hosted trip fields
  isHosted?: boolean;
  title?: string;
  location?: string;
  price?: number;
  currency?: string;
  duration?: number;
  durationType?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  shortDescription?: string;
  highlights?: string[];
  inclusions?: string[];
  maxParticipants?: number;
  minParticipants?: number;
  hostIntro?: string;
  joinPolicy?: string;
  imageUrl?: string;
  gallery?: string[];
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  externalBookingUrl?: string;
  coordinates?: { latitude: number; longitude: number };
  waypoints?: Array<{ latitude: number; longitude: number }>;
}

export const createTrip = async (
  _: any,
  { input }: { input: CreateTripInput },
  context: GraphQLContext
) => {
  // Check user activation status
  const { assertActiveUser } = await import('../utilities/auth/assertActiveUser');
  await assertActiveUser(context);

  const db = getServerDB(context.env.DB);
  const userId = context.userId!; // Safe after assertActiveUser

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

  // Smart placeholder: create a lightweight, user-friendly placeholder itinerary
  // while the background workflow generates the real plan.
  const calcDuration = (start?: string, end?: string): number => {
    if (!start || !end) return 5;
    try {
      const s = new Date(start);
      const e = new Date(end);
      const diff = Math.abs(e.getTime() - s.getTime());
      return Math.max(1, Math.min(14, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1));
    } catch {
      return 5;
    }
  };
  const placeholderDuration = calcDuration(input.startDate, input.endDate);
  const placeholderTitle = destination ? `${placeholderDuration}-Day ${destination} (Planning...)` : 'Planning...';
  const makeAct = (time: string, title: string) => `${time} - ${title}`;
  const placeholderDays: Array<{ day: number; title: string; activities: string[] }> = Array.from({ length: placeholderDuration }).map((_, idx) => {
    const dayNum = idx + 1;
    return {
      day: dayNum,
      title: dayNum === 1 ? 'Arrival & Overview (Planning...)' : dayNum === placeholderDuration ? 'Final Day (Planning...)' : `Day ${dayNum} (Planning...)`,
      activities: [
        makeAct('09:00', `Personalized morning plan is being prepared for ${destination || 'your destination'}`),
        makeAct('12:30', `Lunch recommendation is being selected based on your preferences`),
        makeAct('15:00', `Afternoon activities are being optimized for distance and time`),
        makeAct('19:00', `Dinner suggestion is being curated for your budget level`),
      ],
    };
  });
  // Fast path save values
  const aiReasoning: string = 'Generating your personalized trip plan...';
  const itineraryData: any[] = placeholderDays;
  const coordinatesData: any = { latitude: 0, longitude: 0 };
  const waypoints: any[] = [];

  try {
    // Insert trip
    const metadataPayload = (() => {
      const base: Record<string, any> = {};
      if (userLocation) base.userLocation = userLocation;
      if (input.lang) base.language = input.lang;
      return Object.keys(base).length ? base : undefined;
    })();

    // Prepare hosted fields if isHosted is true
    const isHosted = input.isHosted === true;
    const tripValues: any = {
        userId,
      title: input.title || placeholderTitle || destination || 'Untitled Trip',
      destination: destination || input.location || 'Untitled Trip',
        startDate: input.startDate,
        endDate: input.endDate,
        budget: input.budget != null ? Math.round(Number(input.budget)) : null,
        travelers,
      isHosted: isHosted ? 1 : 0,
      preferences: description || input.description,
        accommodation,
        status: 'pending',
        aiReasoning,
        itinerary: JSON.stringify(itineraryData),
      coordinates: input.coordinates ? JSON.stringify(input.coordinates) : JSON.stringify(coordinatesData),
      waypoints: input.waypoints ? JSON.stringify(input.waypoints) : JSON.stringify(waypoints),
      aiGenerated: !isHosted, // Hosted trips are not AI-generated
        metadata: metadataPayload ? JSON.stringify(metadataPayload) : null,
    };

    // Add hosted fields if isHosted is true
    if (isHosted) {
      tripValues.location = input.location || destination;
      tripValues.price = input.price != null ? Math.round(Number(input.price) * 100) : null; // Convert to cents
      tripValues.currency = input.currency || 'USD';
      tripValues.rating = 0;
      tripValues.reviews = 0;
      tripValues.duration = input.duration || placeholderDuration;
      tripValues.durationType = input.durationType || 'days';
      tripValues.category = input.category;
      tripValues.difficulty = input.difficulty || 'easy';
      tripValues.description = input.description || description;
      tripValues.shortDescription = input.shortDescription;
      tripValues.highlights = input.highlights ? JSON.stringify(input.highlights) : null;
      tripValues.inclusions = input.inclusions ? JSON.stringify(input.inclusions) : null;
      tripValues.maxParticipants = input.maxParticipants;
      tripValues.minParticipants = input.minParticipants || 1;
      tripValues.hostIntro = input.hostIntro;
      tripValues.joinPolicy = input.joinPolicy || 'open';
      tripValues.imageUrl = input.imageUrl;
      tripValues.gallery = input.gallery ? JSON.stringify(input.gallery) : null;
      tripValues.tags = input.tags ? JSON.stringify(input.tags) : null;
      tripValues.isActive = input.isActive !== false;
      tripValues.isFeatured = input.isFeatured === true;
      tripValues.externalBookingUrl = input.externalBookingUrl;
    }

    const result = await db
      .insert(trips)
      .values(tripValues)
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
          lang: input.lang || undefined,
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
      const actorProfile = actor ? await db.select().from(profiles).where(eq(profiles.userId, userId)).get() : null;
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
                  name: actorProfile?.displayName || actor.username,
                  username: actor.username,
                  email: actor.email,
                  phone: actorProfile?.phone || null,
                  avatar: actorProfile?.avatarUrl || null,
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

