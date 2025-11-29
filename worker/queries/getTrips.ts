import { eq, desc, and } from 'drizzle-orm';
import { getServerDB } from '@database/server';
import { trips } from '@database/server';
import type { GraphQLContext } from '../types';

export const getTrips = async (
  _: any,
  { status, isHosted }: { status?: string; isHosted?: boolean },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  // Get user ID from context (assuming auth middleware sets this)
  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Build query with filters
  let whereClause: any = eq(trips.userId, userId);
  
  // Add isHosted filter if provided
  if (isHosted !== undefined) {
    const isHostedValue = isHosted ? 1 : 0;
    whereClause = and(eq(trips.userId, userId), eq(trips.isHosted as any, isHostedValue));
  }

  const query = db
    .select()
    .from(trips)
    .where(whereClause)
    .orderBy(desc(trips.createdAt));

  const results = await query.all();

  // Filter by status if provided
  const filteredResults = status
    ? results.filter(trip => trip.status === status)
    : results;

  // Parse JSON fields and coerce numeric fields
  return filteredResults.map(trip => {
    // Normalize budget to number or null
    let budget: number | null = null;
    if (typeof (trip as any).budget === 'number') {
      budget = (trip as any).budget as number;
    } else if ((trip as any).budget != null) {
      const parsed = parseFloat(String((trip as any).budget).replace(/[^\d.]/g, ''));
      budget = Number.isFinite(parsed) ? parsed : null;
    }
    
    // Parse trip result using helper function
    const parsed = parseTripResult(trip);
    parsed.budget = budget;
    
    return parsed;
  });
};

export const getTrip = async (
  _: any,
  { id }: { id: string },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);

  const userId = context.userId;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const result = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .get();

  if (!result) {
    throw new Error('Trip not found');
  }

  // Verify ownership
  if (result.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Parse trip result using helper function
  return parseTripResult(result);
};

// Helper function to parse trip result (used by both getTrips and getTrip)
function parseTripResult(result: any): any {
  const parsedResult: any = {
    ...result,
    itinerary: result.itinerary ? JSON.parse(result.itinerary) : null,
    coordinates: result.coordinates ? JSON.parse(result.coordinates) : null,
    waypoints: result.waypoints ? JSON.parse(result.waypoints) : null,
  };
  
  // Parse hosted trip JSON fields
  if (result.highlights) {
    parsedResult.highlights = typeof result.highlights === 'string' 
      ? JSON.parse(result.highlights) 
      : result.highlights;
  }
  if (result.inclusions) {
    parsedResult.inclusions = typeof result.inclusions === 'string'
      ? JSON.parse(result.inclusions)
      : result.inclusions;
  }
  if (result.gallery) {
    parsedResult.gallery = typeof result.gallery === 'string'
      ? JSON.parse(result.gallery)
      : result.gallery;
  }
  if (result.tags) {
    parsedResult.tags = typeof result.tags === 'string'
      ? JSON.parse(result.tags)
      : result.tags;
  }
  
  // Convert price from cents to dollars and rating from integer to float
  if (result.price) {
    parsedResult.price = result.price / 100;
  }
  if (result.rating) {
    parsedResult.rating = result.rating / 10;
  }
  
  return parsedResult;
}

