import { eq } from 'drizzle-orm';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import type { GraphQLContext } from '../types';

interface UpdateTripInput {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers?: number;
  preferences?: string;
  accommodation?: string;
  status?: string;
  aiReasoning?: string;
  itinerary?: string;
  userMessage?: string; // User chat message for AI processing
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
  bookingInstructions?: string;
  imageUrl?: string;
  gallery?: string[];
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  externalBookingUrl?: string;
}

export const updateTrip = async (
  _: any,
  { id, input }: { id: string; input: UpdateTripInput },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Check if trip exists and user owns it
  const existing = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .get();

  if (!existing) {
    throw new Error('Trip not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // If userMessage is provided, trigger workflow for AI processing
  if (input.userMessage && input.userMessage.trim()) {
    try {
      // Set status to pending while processing
      await db
        .update(trips)
        .set({ 
          status: 'pending',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(trips.id, id))
        .run();

      // Trigger workflow for trip update
      const workflowInstance = await context.env.TRIP_UPDATE_WORKFLOW.create({
        id: `trip-update-${id}-${Date.now()}`,
        params: {
          tripId: id.toString(),
          userId,
          userMessage: input.userMessage.trim(),
          destination: existing.destination || undefined,
          lang: input.lang,
        },
      });
      console.log('Trip update workflow started:', workflowInstance.id);
      
      // Return current trip state (will be updated by workflow)
      return {
        ...existing,
        status: 'pending',
        itinerary: existing.itinerary ? JSON.parse(existing.itinerary) : null,
        coordinates: existing.coordinates ? JSON.parse(existing.coordinates) : null,
        waypoints: existing.waypoints ? JSON.parse(existing.waypoints) : null,
      };
    } catch (workflowError: any) {
      // Log workflow error but don't fail the mutation
      console.error('Failed to start trip update workflow:', workflowError);
      // Continue with regular update
    }
  }

  // Build update object (regular update without workflow)
  const updateData: any = {
    updatedAt: new Date().toISOString(),
  };

  if (input.destination) {
    updateData.destination = input.destination;
    // Generate new waypoints when destination changes
    try {
      const { geocodeDestinationCenter } = await import('../utilities/destination/geo');
      const center = await geocodeDestinationCenter(input.destination);
      const wp = center ? [{
        latitude: center.latitude,
        longitude: center.longitude,
        label: input.destination,
      }] : [];
      updateData.waypoints = JSON.stringify(wp);
    } catch {
      updateData.waypoints = JSON.stringify([]);
    }
  }
  if (input.startDate) updateData.startDate = input.startDate;
  if (input.endDate) updateData.endDate = input.endDate;
  if (input.budget !== undefined) updateData.budget = input.budget;
  if (input.travelers) updateData.travelers = input.travelers;
  if (input.preferences) updateData.preferences = input.preferences;
  if (input.accommodation) updateData.accommodation = input.accommodation;
  if (input.status) updateData.status = input.status;
  if (input.aiReasoning) updateData.aiReasoning = input.aiReasoning;
  if (input.itinerary) updateData.itinerary = input.itinerary;
  
  // Handle hosted trip fields
  if (input.isHosted !== undefined) {
    updateData.isHosted = input.isHosted ? 1 : 0;
  }
  if (input.title !== undefined) updateData.title = input.title;
  if (input.location !== undefined) updateData.location = input.location;
  if (input.price !== undefined) updateData.price = Math.round(Number(input.price) * 100); // Convert to cents
  if (input.currency !== undefined) updateData.currency = input.currency;
  if (input.duration !== undefined) updateData.duration = input.duration;
  if (input.durationType !== undefined) updateData.durationType = input.durationType;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.difficulty !== undefined) updateData.difficulty = input.difficulty;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.shortDescription !== undefined) updateData.shortDescription = input.shortDescription;
  if (input.highlights !== undefined) updateData.highlights = JSON.stringify(input.highlights);
  if (input.inclusions !== undefined) updateData.inclusions = JSON.stringify(input.inclusions);
  if (input.maxParticipants !== undefined) updateData.maxParticipants = input.maxParticipants;
  if (input.minParticipants !== undefined) updateData.minParticipants = input.minParticipants;
  if (input.hostIntro !== undefined) updateData.hostIntro = input.hostIntro;
  if (input.joinPolicy !== undefined) updateData.joinPolicy = input.joinPolicy;
  if (input.bookingInstructions !== undefined) updateData.bookingInstructions = input.bookingInstructions;
  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
  if (input.gallery !== undefined) updateData.gallery = JSON.stringify(input.gallery);
  if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);
  if (input.isActive !== undefined) updateData.isActive = input.isActive ? 1 : 0;
  if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured ? 1 : 0;
  if (input.externalBookingUrl !== undefined) updateData.externalBookingUrl = input.externalBookingUrl;

  // Update trip
  const result = await db
    .update(trips)
    .set(updateData)
    .where(eq(trips.id, id))
    .returning()
    .get();

  // Parse JSON fields
  const parsedResult: any = {
    ...result,
    itinerary: result.itinerary ? JSON.parse(result.itinerary) : null,
    coordinates: result.coordinates ? JSON.parse(result.coordinates) : null,
    waypoints: result.waypoints ? JSON.parse(result.waypoints) : null,
  };
  
  // Parse hosted trip JSON fields
  if ((result as any).highlights) {
    parsedResult.highlights = typeof (result as any).highlights === 'string' 
      ? JSON.parse((result as any).highlights) 
      : (result as any).highlights;
  }
  if ((result as any).inclusions) {
    parsedResult.inclusions = typeof (result as any).inclusions === 'string'
      ? JSON.parse((result as any).inclusions)
      : (result as any).inclusions;
  }
  if ((result as any).gallery) {
    parsedResult.gallery = typeof (result as any).gallery === 'string'
      ? JSON.parse((result as any).gallery)
      : (result as any).gallery;
  }
  if ((result as any).tags) {
    parsedResult.tags = typeof (result as any).tags === 'string'
      ? JSON.parse((result as any).tags)
      : (result as any).tags;
  }
  
  // Convert price from cents to dollars and rating from integer to float
  if ((result as any).price) {
    parsedResult.price = (result as any).price / 100;
  }
  if ((result as any).rating) {
    parsedResult.rating = (result as any).rating / 10;
  }
  
  return parsedResult;
};

export const deleteTrip = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Check if trip exists and user owns it
  const existing = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .get();

  if (!existing) {
    throw new Error('Trip not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Delete trip
  await db.delete(trips).where(eq(trips.id, id));

  return true;
};

