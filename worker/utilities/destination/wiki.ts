/**
 * Wikipedia REST API integration for destination facts
 * No API key required
 */

import type { Env } from '../../types';
import type { WikiSummary, DestinationFacts } from './types';

const WIKIPEDIA_BASE = 'https://en.wikipedia.org/api/rest_v1';

/**
 * Fetch Wikipedia summary for a destination
 */
export async function fetchWikipediaSummary(
  env: Env,
  destination: string
): Promise<WikiSummary | null> {
  try {
    const title = encodeURIComponent(destination);
    const url = `${WIKIPEDIA_BASE}/page/summary/${title}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
      },
    });
    
    if (!response.ok) {
      // Try with "City" suffix
      const cityTitle = encodeURIComponent(`${destination} (city)`);
      const cityUrl = `${WIKIPEDIA_BASE}/page/summary/${cityTitle}`;
      const cityResponse = await fetch(cityUrl, {
        headers: {
          'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
        },
      });
      
      if (!cityResponse.ok) {
        return null;
      }
      
      const cityData = await cityResponse.json();
      return parseWikiResponse(cityData);
    }
    
    const data = await response.json();
    return parseWikiResponse(data);
  } catch (error) {
    console.warn('[Wiki] Failed to fetch Wikipedia summary:', error);
    return null;
  }
}

/**
 * Parse Wikipedia API response
 */
function parseWikiResponse(data: any): WikiSummary {
  return {
    title: data.title || '',
    extract: data.extract || '',
    description: data.description,
    coordinates: data.coordinates ? {
      lat: data.coordinates.lat,
      lon: data.coordinates.lon,
    } : undefined,
  };
}

/**
 * Extract destination facts from Wikipedia
 * Returns partial facts that can be merged with other sources
 */
export async function fetchWikipediaFacts(
  env: Env,
  destination: string,
  _country?: string
): Promise<Partial<DestinationFacts>> {
  const wiki = await fetchWikipediaSummary(env, destination);
  
  if (!wiki) {
    return {};
  }
  
  const facts: Partial<DestinationFacts> = {};
  
  // Extract city/country from title or description
  if (wiki.title) {
    // Try to extract city name (remove common suffixes)
    const cityMatch = wiki.title.match(/^([^,]+)/);
    if (cityMatch) {
      facts.city = cityMatch[1].trim();
    }
  }
  
  // Use coordinates if available
  if (wiki.coordinates) {
    facts.coordinates = {
      lat: wiki.coordinates.lat,
      lon: wiki.coordinates.lon,
    };
  }
  
  // Extract population from extract text if available
  const populationMatch = wiki.extract.match(/population[:\s]+([0-9,]+)/i);
  if (populationMatch) {
    const popStr = populationMatch[1].replace(/,/g, '');
    const pop = parseInt(popStr, 10);
    if (!isNaN(pop)) {
      facts.population = pop;
    }
  }
  
  return facts;
}

