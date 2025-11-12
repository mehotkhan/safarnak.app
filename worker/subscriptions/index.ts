// Subscription resolvers index
// Exports all subscription resolvers

import { newMessages } from './newMessages';
import { newAlerts } from './newAlerts';
import { tripUpdates } from './tripUpdates';
import { feedNewEvents } from './feedNewEvents';

export const Subscription = {
  newMessages,
  newAlerts,
  tripUpdates,
  feedNewEvents,
};

// Re-export individual resolvers
export { newMessages, newAlerts, tripUpdates, feedNewEvents };
