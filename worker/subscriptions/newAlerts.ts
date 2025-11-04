// Subscription resolver for newAlerts
// Handles real-time alert/notification subscriptions

import { subscribe } from 'graphql-workers-subscriptions';

export const newAlerts = {
  subscribe: subscribe('NEW_ALERTS'),
};

