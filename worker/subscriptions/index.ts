// Subscription resolvers index
// Exports all subscription resolvers

import { newMessages } from './newMessages';
import { newAlerts } from './newAlerts';

export const Subscription = {
  newMessages,
  newAlerts,
};

// Re-export individual resolvers
export { newMessages, newAlerts };
