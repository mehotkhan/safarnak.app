// Subscription resolvers index
// Exports all subscription resolvers

import { newMessages } from './newMessages';
import { newAlerts } from './newAlerts';
import { tripUpdates } from './tripUpdates';

export const Subscription = {
  newMessages,
  newAlerts,
  tripUpdates,
};

// Re-export individual resolvers
export { newMessages, newAlerts, tripUpdates };
