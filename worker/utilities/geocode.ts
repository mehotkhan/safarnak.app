/**
 * Deterministic geocoding utilities using OpenStreetMap Nominatim (free)
 * NOTE: Respect Nominatim usage policy. Keep requests low volume and include a descriptive User-Agent.
 */

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  importance?: number;
  class?: string;
  type?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    county?: string;
    country?: string;
  };
};

const USER_AGENT = 'Safarnak/1.0 (+https://safarnak.app; contact=support@safarnak.app)';

export async function geocodeNominatim(query: string, limit = 3): Promise<NominatimResult[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', String(Math.max(1, Math.min(limit, 5))));

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json',
    },
    // GET request
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error(`Nominatim error: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as NominatimResult[];
  return Array.isArray(data) ? data : [];
}

export async function geocodeDestinationCenter(destination: string): Promise<{ latitude: number; longitude: number } | null> {
  const results = await geocodeNominatim(destination, 1);
  const top = results[0];
  if (!top) return null;
  const lat = Number(top.lat);
  const lon = Number(top.lon);
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return { latitude: lat, longitude: lon };
  }
  return null;
}

/**
 * Geocode a place name constrained/scoped to a destination context by appending the destination.
 * Returns best candidate within or near the destination city/town/state when possible.
 */
export async function geocodePlaceInDestination(placeName: string, destination: string): Promise<{ latitude: number; longitude: number; label: string } | null> {
  const scopedQuery = `${placeName}, ${destination}`;
  const results = await geocodeNominatim(scopedQuery, 3);
  if (!results.length) return null;

  // Prefer results whose address mentions the destination name or same state/county
  const destLower = destination.toLowerCase();
  const scored = results
    .map(r => {
      const lat = Number(r.lat);
      const lon = Number(r.lon);
      const good = Number.isFinite(lat) && Number.isFinite(lon);
      const addr = r.address || {};
      const addrStr = [
        addr.city,
        addr.town,
        addr.village,
        addr.municipality,
        addr.state,
        addr.county,
        addr.country,
      ].filter(Boolean).join(' ').toLowerCase();
      let score = (r.importance || 0);
      if (addrStr.includes(destLower)) score += 1.0;
      return { r, lat, lon, good, score };
    })
    .filter(x => x.good)
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best) return null;

  return {
    latitude: best.lat,
    longitude: best.lon,
    label: best.r.display_name || placeName,
  };
}


