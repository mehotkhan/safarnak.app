// Subscription resolver for newMessages
// Handles real-time message subscriptions

import { subscribe } from 'graphql-workers-subscriptions';

export const newMessages = {
  subscribe: subscribe('NEW_MESSAGES'),
};
