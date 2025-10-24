// Main resolvers index
// Combines all resolver types into a single export

import { Query } from './queries';
import { Mutation } from './mutations';
import { Subscription } from './subscriptions';

export const resolvers = {
  Query,
  Mutation,
  Subscription,
};

// Re-export individual resolvers for direct access
export { Query, getMessages, me } from './queries';
export { Mutation, addMessage, register, login } from './mutations';
export { Subscription, newMessages } from './subscriptions';
export { hashPassword, verifyPassword, generateToken } from './utils';
