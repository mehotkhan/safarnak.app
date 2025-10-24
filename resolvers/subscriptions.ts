// Subscription resolvers
// These resolvers handle GraphQL Subscription operations

import { subscribe } from 'graphql-workers-subscriptions';

export const newMessages = {
  subscribe: subscribe('NEW_MESSAGES'),
};

export const Subscription = {
  newMessages,
};
