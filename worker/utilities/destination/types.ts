/**
 * Shared TypeScript interfaces for destination data
 * Used across all destination research modules
 * 
 * Data flows from external APIs → DestinationData → AI Planner
 */

// ============================================================================
// CORE DESTINATION DATA (Fed to AI Planner)
// ============================================================================

/**
 * Complete destination data for trip planning
 * Built from external APIs, cached in KV, fed to AI
 */
export interface DestinationData {
  id: string;                  // Slug like "paris-fr"
  name: string;                // Display name
  country: string;
  center: { lat: number; lon: number };

  // From Wikivoyage/Wikipedia
  summary: string;
  neighborhoods?: string[];
  travelGuide?: {
    seeDo?: string;
    eat?: string;
    sleep?: string;
  };

  // From OpenTripMap + Geoapify
  attractions: Attraction[];
  foodSpots: FoodSpot[];
  restaurants?: Restaurant[]; // Legacy alias for foodSpots

  // From Open-Meteo
  forecast?: {
    days: ForecastDay[];
    timezone?: string;
  };

  // Metadata
  facts: DestinationFacts;
  fetchedAt: string;           // ISO timestamp
  cacheKey: string;            // KV cache key
}

/**
 * Attraction/POI from external APIs
 * Supports both new (lat/lon/kind) and legacy (coords/type) formats
 */
export interface Attraction {
  id: string;                  // OpenTripMap xid or Geoapify place_id
  name: string;
  
  // New format (preferred)
  kind?: string;               // museum, viewpoint, park, historic, etc.
  lat?: number;
  lon?: number;
  shortDescription?: string;   // From Wikivoyage/OTM
  importance?: number;         // 1-7 from OpenTripMap
  imageUrl?: string;
  
  // Legacy format (backward compatibility)
  type?: 'historical' | 'museum' | 'park' | 'religious' | 'entertainment' | 'shopping' | 'nature' | 'viewpoint' | 'art' | 'attraction';
  coords?: { lat: number; lon: number };
  cost?: number;
  duration?: number;
  tags?: string[];
  description?: string;
  
  // Shared fields
  rating?: number;
  address?: string;
  website?: string;
  openingHours?: string;
}

/**
 * Food spot (restaurant, cafe, bar) from external APIs
 */
export interface FoodSpot {
  id: string;
  name: string;
  category: string;            // restaurant, cafe, bar, fast_food
  lat: number;
  lon: number;
  cuisine?: string;
  priceLevel?: number;         // 1-4
  rating?: number;
  address?: string;
  website?: string;
  openingHours?: string;
}

/**
 * Daily weather forecast
 */
export interface ForecastDay {
  date: string;                // YYYY-MM-DD
  tempMin: number;             // Celsius
  tempMax: number;             // Celsius
  rainChance?: number;         // 0-100%
  weatherCode?: number;        // WMO code
  description?: string;        // "Sunny", "Rainy", etc.
}

/**
 * Destination facts and metadata
 */
export interface DestinationFacts {
  city: string;
  country: string;
  coordinates: { lat: number; lon: number };
  timezone?: string;
  currency?: string;
  language?: string;
  avgCost?: {
    budget: number;  // USD per day
    mid: number;
    luxury: number;
  };
  bestMonths?: string[];
  climate?: string;
  population?: number;
}

// ============================================================================
// LEGACY TYPES (For backward compatibility)
// ============================================================================

/**
 * @deprecated Use Attraction instead
 */
export interface LegacyAttraction {
  id: string;
  name: string;
  type: 'historical' | 'museum' | 'park' | 'religious' | 'entertainment' | 'shopping' | 'nature' | 'viewpoint' | 'art' | 'attraction';
  coords: { lat: number; lon: number };
  rating: number;
  cost: number;
  hours?: string;
  duration: number;
  tags: string[];
  description?: string;
  address?: string;
  website?: string;
  phone?: string;
}

/**
 * @deprecated Use FoodSpot instead
 */
export interface Restaurant {
  id: string;
  name: string;
  coords: { lat: number; lon: number };
  cuisine: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  specialties: string[];
  hours?: string;
  address?: string;
  phone?: string;
  website?: string;
}

/**
 * Transport information
 */
export interface TransportInfo {
  airport?: string;
  metro: boolean;
  taxi: {
    avgCost: number;
    apps: string[];
  };
  bus: {
    avgCost: number;
  };
  bike?: {
    available: boolean;
    cost: number;
  };
}

/**
 * @deprecated Use DestinationData instead
 */
export interface LegacyDestinationData {
  facts: DestinationFacts & { fetchedAt: string };
  attractions: LegacyAttraction[];
  restaurants: Restaurant[];
  transport: TransportInfo;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface GeocodeResult {
  coords: { lat: number; lon: number };
  address: string;
  raw: any;
}

export interface WikiSummary {
  title: string;
  extract: string;
  description?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Convert new Attraction to legacy format
 */
export function attractionToLegacy(attr: Attraction): LegacyAttraction {
  const kind = attr.kind || attr.type || 'attraction';
  const lat = attr.lat ?? attr.coords?.lat ?? 0;
  const lon = attr.lon ?? attr.coords?.lon ?? 0;
  
  return {
    id: attr.id,
    name: attr.name,
    type: mapKindToType(kind),
    coords: { lat, lon },
    rating: attr.rating || 4.0,
    cost: attr.cost || 0,
    duration: attr.duration || 60,
    tags: attr.tags || [kind],
    description: attr.shortDescription || attr.description,
    address: attr.address,
    website: attr.website,
  };
}

/**
 * Convert new FoodSpot to legacy Restaurant
 */
export function foodSpotToLegacy(spot: FoodSpot): Restaurant {
  return {
    id: spot.id,
    name: spot.name,
    coords: { lat: spot.lat, lon: spot.lon },
    cuisine: spot.cuisine || 'local',
    priceRange: priceLevelToRange(spot.priceLevel),
    rating: spot.rating || 4.0,
    specialties: [],
    address: spot.address,
    website: spot.website,
  };
}

/**
 * Map OTM kind to legacy type
 */
function mapKindToType(kind: string): LegacyAttraction['type'] {
  const kindLower = kind.toLowerCase();
  if (kindLower.includes('museum')) return 'museum';
  if (kindLower.includes('historic') || kindLower.includes('monument')) return 'historical';
  if (kindLower.includes('park') || kindLower.includes('garden')) return 'park';
  if (kindLower.includes('church') || kindLower.includes('mosque') || kindLower.includes('temple')) return 'religious';
  if (kindLower.includes('viewpoint')) return 'viewpoint';
  if (kindLower.includes('art') || kindLower.includes('gallery')) return 'art';
  if (kindLower.includes('shop') || kindLower.includes('market')) return 'shopping';
  if (kindLower.includes('nature') || kindLower.includes('beach')) return 'nature';
  return 'attraction';
}

/**
 * Convert price level to range
 */
function priceLevelToRange(level?: number): '$' | '$$' | '$$$' | '$$$$' {
  if (!level) return '$$';
  if (level <= 1) return '$';
  if (level <= 2) return '$$';
  if (level <= 3) return '$$$';
  return '$$$$';
}
