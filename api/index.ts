// Main API exports
// Central entry point for all API operations

// Client configuration
export { client } from './client';

// Query hooks
export * from './queries';

// Mutation hooks
export * from './mutations';

// Subscription hooks
export * from './subscriptions';

// API-specific types
export * from './api-types';

// Utilities
export * from './utilities';

// Re-export base GraphQL types for convenience
export type { AuthPayload, Message, User } from './types';
