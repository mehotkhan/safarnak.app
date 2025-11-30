/**
 * Client schema export for Drizzle CLI.
 *
 * This file is intentionally lightweight and avoids importing Expo modules
 * so that we can run Drizzle tooling in a Node environment.
 */

import * as schemaModule from './schema';

const {
  clientSchema,
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
} = schemaModule;

const clientMigrationSchema = {
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

/**
 * Re-export the schema under the `schema` name for Drizzle CLI while also
 * referencing each table explicitly. Some Drizzle tooling walks the object
 * and only picks up tables that are directly accessible on the exported
 * schema, so we provide a fully expanded object here.
 */
export const schema = clientMigrationSchema;

export { clientSchema };

export default {
  schema: clientMigrationSchema,
  clientSchema,
};


