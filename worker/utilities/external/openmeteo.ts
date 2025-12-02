/**
 * Open-Meteo Weather API Client
 * Free, open-source weather API - no API key required
 * 
 * Docs: https://open-meteo.com/en/docs
 * Free for non-commercial use
 */

import { httpGetJson } from './http';

const OPENMETEO_BASE = 'https://api.open-meteo.com/v1';

/**
 * Daily forecast data from Open-Meteo
 */
export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max?: number[];
  weathercode?: number[];
  sunrise?: string[];
  sunset?: string[];
  uv_index_max?: number[];
}

/**
 * Open-Meteo forecast response
 */
export interface OpenMeteoForecast {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily: DailyForecast;
  daily_units?: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_probability_max?: string;
  };
}

/**
 * Simplified daily weather for trip planning
 */
export interface TripDayWeather {
  date: string;
  tempMin: number;
  tempMax: number;
  rainChance?: number;
  weatherCode?: number;
  weatherDescription?: string;
}

/**
 * WMO weather codes to descriptions
 */
const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

/**
 * Get weather code description
 */
export function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code] || 'Unknown';
}

/**
 * Get daily weather forecast for coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @param days - Number of forecast days (1-16)
 * @param timezone - Timezone identifier (e.g., "Europe/Paris", "auto")
 */
export async function getDailyForecast(
  lat: number,
  lon: number,
  days = 7,
  timezone = 'auto'
): Promise<OpenMeteoForecast> {
  const url = new URL(`${OPENMETEO_BASE}/forecast`);
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode'
  );
  url.searchParams.set('forecast_days', String(Math.min(days, 16)));
  url.searchParams.set('timezone', timezone);

  return httpGetJson<OpenMeteoForecast>(url.toString());
}

/**
 * Get simplified weather for trip planning
 * Returns array of TripDayWeather objects
 */
export async function getTripWeather(
  lat: number,
  lon: number,
  days = 7,
  timezone = 'auto'
): Promise<TripDayWeather[]> {
  try {
    const forecast = await getDailyForecast(lat, lon, days, timezone);
    const daily = forecast.daily;

    const weather: TripDayWeather[] = [];

    for (let i = 0; i < daily.time.length; i++) {
      weather.push({
        date: daily.time[i],
        tempMin: Math.round(daily.temperature_2m_min[i]),
        tempMax: Math.round(daily.temperature_2m_max[i]),
        rainChance: daily.precipitation_probability_max?.[i],
        weatherCode: daily.weathercode?.[i],
        weatherDescription: daily.weathercode?.[i] 
          ? getWeatherDescription(daily.weathercode[i])
          : undefined,
      });
    }

    return weather;
  } catch (err) {
    console.warn('[Open-Meteo] Get trip weather failed:', err);
    return [];
  }
}

/**
 * Get weather for specific dates (using historical + forecast if needed)
 * For dates in the past, would need Open-Meteo historical API
 * For MVP, we just return forecast for future dates
 */
export async function getWeatherForDates(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
  timezone = 'auto'
): Promise<TripDayWeather[]> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate days from today
  const daysFromToday = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const tripLength = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // If trip is too far in future, return empty (Open-Meteo only has 16 days)
  if (daysFromToday > 16) {
    console.log('[Open-Meteo] Trip too far in future for forecast');
    return [];
  }

  // Get forecast for enough days to cover the trip
  const forecastDays = Math.min(daysFromToday + tripLength, 16);
  const weather = await getTripWeather(lat, lon, forecastDays, timezone);

  // Filter to trip dates
  const startStr = startDate.split('T')[0];
  const endStr = endDate.split('T')[0];

  return weather.filter(w => w.date >= startStr && w.date <= endStr);
}

