/**
 * Client Schema Export for Drizzle Kit
 * 
 * Exports clientSchema as 'schema' for drizzle-kit migrations.
 * This file is used by drizzle.config.client.ts to generate client migrations.
 */

import {
  cachedUsers,
  cachedProfiles,
  cachedTrips,
  cachedTripParticipants,
  cachedTripDays,
  cachedTripItems,
  cachedPlaces,
  cachedMessages,
  cachedConversations,
  cachedConversationMembers,
  cachedChatMessages,
  localConversationKeys,
  pendingMutations,
  syncMetadata,
  apolloCacheEntries,
  cachedMapTiles,
} from './schema';

// Export schema for drizzle-kit migrations (client tables only)
export const schema = {
  cachedUsers,
  cachedProfiles,
  cachedTrips,
  cachedTripParticipants,
  cachedTripDays,
  cachedTripItems,
  cachedPlaces,
  cachedMessages,
  cachedConversations,
  cachedConversationMembers,
  cachedChatMessages,
  localConversationKeys,
  pendingMutations,
  syncMetadata,
  apolloCacheEntries,
  cachedMapTiles,
};
