/**
 * Shared TypeScript interfaces for destination data
 * Used across all destination research modules
 */

export interface DestinationFacts {
  city: string;
  country: string;
  coordinates: { lat: number; lon: number };
  timezone: string;
  currency: string;
  language: string;
  avgCost: {
    budget: number;  // USD per day
    mid: number;
    luxury: number;
  };
  bestMonths: string[];
  climate: string;
  population?: number;
  fetchedAt: string;
}

export interface Attraction {
  id: string;
  name: string;
  type: 'historical' | 'museum' | 'park' | 'religious' | 'entertainment' | 'shopping' | 'nature';
  coords: { lat: number; lon: number };
  rating: number;
  cost: number; // USD
  hours?: string;
  duration: number; // minutes
  tags: string[];
  description?: string;
  address?: string;
  website?: string;
  phone?: string;
}

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

export interface DestinationData {
  facts: DestinationFacts;
  attractions: Attraction[];
  restaurants: Restaurant[];
  transport: TransportInfo;
}

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

