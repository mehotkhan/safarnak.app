import { InferSelectModel } from 'drizzle-orm';
import {
  users,
  userPreferences,
  trips,
  itineraries,
  plans,
  messages,
  posts,
  comments,
  reactions,
  payments,
  userSubscriptions,
  devices,
  notifications,
  locations,
  places,
  thoughts,
  subscriptions,
} from './schema';

// ============================================================================
// ENUMS
// ============================================================================

export enum SubscriptionTier {
  FREE = 'free',
  MEMBER = 'member',
  PRO = 'pro',
}

export enum TripStatus {
  PLANNED = 'planned',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum DurationType {
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

export enum PostType {
  PLAN = 'plan',
  TRIP = 'trip',
  // TOUR removed - unified into TRIP
}

// ============================================================================
// INFERRED TYPES FROM DRIZZLE SCHEMA
// ============================================================================

export type User = InferSelectModel<typeof users>;

export type UserPreferences = InferSelectModel<typeof userPreferences>;

export type Trip = InferSelectModel<typeof trips>;

export type Itinerary = InferSelectModel<typeof itineraries>;

export type Plan = InferSelectModel<typeof plans>;

// Tour type removed - unified into Trip with isHosted flag

export type Message = InferSelectModel<typeof messages>;

export type Post = InferSelectModel<typeof posts>;

export type Comment = InferSelectModel<typeof comments>;

export type Reaction = InferSelectModel<typeof reactions>;

export type Payment = InferSelectModel<typeof payments>;

export type UserSubscription = InferSelectModel<typeof userSubscriptions>;

export type Device = InferSelectModel<typeof devices>;

export type Notification = InferSelectModel<typeof notifications>;

export type Location = InferSelectModel<typeof locations>;

export type Place = InferSelectModel<typeof places>;

export type Thought = InferSelectModel<typeof thoughts>;

export type GraphQLSubscription = InferSelectModel<typeof subscriptions>;

