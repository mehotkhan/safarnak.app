// Subscription resolver for tripUpdates
// Handles real-time trip-specific update subscriptions
// Filters by tripId so clients only receive updates for the specific trip they're viewing

import { subscribe } from 'graphql-workers-subscriptions';

export const tripUpdates = {
  subscribe: subscribe('TRIP_UPDATE', {
    filter: async (payload: any, variables: any) => {
      // Only send updates for the specific tripId requested
      const requestedTripId = variables?.tripId;
      const updateTripId = payload?.tripUpdates?.tripId;
      
      if (!requestedTripId || !updateTripId) {
        return;
      }
      
      const matches = updateTripId === requestedTripId;
      
      if (!matches) {
        console.log(`[tripUpdates] Filtering out update: tripId mismatch (requested: ${requestedTripId}, update: ${updateTripId})`);
        return;
      }
      
      // Return the payload if it matches (or undefined to filter it out)
      return payload;
    },
  }),
};

