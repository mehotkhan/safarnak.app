// Subscription resolvers index
// Exports all subscription resolvers

import { conversationMessages } from './conversationMessages';
import { newAlerts } from './newAlerts';
import { tripUpdates } from './tripUpdates';
import { feedNewEvents } from './feedNewEvents';

export const Subscription = {
  conversationMessages,
  newAlerts,
  tripUpdates,
  feedNewEvents,
};

// Re-export individual resolvers
export { conversationMessages, newAlerts, tripUpdates, feedNewEvents };
