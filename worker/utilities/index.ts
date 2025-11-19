/**
 * Utilities Index
 * Central export point for all utility functions
 * Organized by category: auth, ai, destination, semantic, trip, etc.
 */

// Auth utilities
export { hashPassword, verifyPassword, generateToken } from './auth/password';
export { generateNonce, verifySignature, hashMessage } from './auth/crypto';

// AI utilities
export { generateItineraryFromPreferences } from './ai/generateItinerary';
export { translateItineraryIfNeeded } from './ai/translate';
export { applyTripUpdateWithAI } from './ai/updateTrip';
export type { TripUpdateResult } from './ai/updateTrip';
export type { TripAnalysisInput, TripUpdateInput } from './ai/prompts';

// Destination utilities
export { researchDestination } from './destination';
export type { DestinationData, DestinationFacts, Attraction, Restaurant, TransportInfo } from './destination';
export { geocodeDestinationCenter, geocodePlaceInDestination } from './destination/geo';

// Semantic utilities
export { searchAttractionsByPreferences } from './semantic/searchAttractions';
export { embedText } from './semantic/embed';
export { enqueueEmbeddingJob } from './semantic/embeddings';

// Trip utilities
export { loadTripWithContext } from './trip/loadTrip';
export { appendTripFeedback } from './trip/persistFeedback';
export { validateTripRequest } from './trip/validator';

// Other utilities
export { publishNotification } from './publishNotification';
export { incrementTrendingEntity, incrementTrendingTopic, readTopList } from './trending';
