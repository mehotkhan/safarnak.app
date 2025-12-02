/**
 * External API Layer
 * 
 * Provides unified access to external services:
 * - OpenTripMap: Attractions and POIs
 * - Wikivoyage: Travel guide content
 * - Open-Meteo: Weather forecasts
 * - OpenRouteService: Routing and directions
 * - Geoapify: Backup POIs and geocoding
 */

// HTTP utilities
export { httpGetJson, httpPostJson, httpGetJsonWithRetry } from './http';

// OpenTripMap - Attractions
export {
  geocodeDestination as otmGeocode,
  listAttractions as otmListAttractions,
  listFoodSpots as otmListFoodSpots,
  getPlaceDetails as otmGetPlaceDetails,
  getPlacesDetails as otmGetPlacesDetails,
  parseKinds,
  getPrimaryKind,
  type OtmPlace,
  type OtmPlaceDetails,
  type OtmGeoname,
} from './opentripmap';

// Wikivoyage / Wikipedia - Travel guides
export {
  getDestinationSummary,
  searchDestination,
  getArticleSections,
  getSectionContent,
  getTravelGuideInfo,
  type PageSummary,
} from './wikivoyage';

// Open-Meteo - Weather
export {
  getDailyForecast,
  getTripWeather,
  getWeatherForDates,
  getWeatherDescription,
  type OpenMeteoForecast,
  type DailyForecast,
  type TripDayWeather,
} from './openmeteo';

// OpenRouteService - Routing
export {
  getRoute,
  getRouteSummary,
  getTravelTimeMinutes,
  getIsochrones,
  calculateDayRoute,
  getMatrix,
  type OrsProfile,
  type OrsRoute,
  type OrsRouteSummary,
  type OrsDirectionsResponse,
  type OrsIsochronesResponse,
} from './openrouteservice';

// Geoapify - Backup POIs
export {
  searchPlaces,
  searchRestaurants,
  searchFoodSpots,
  searchAttractions as geoapifySearchAttractions,
  searchAccommodation,
  geocode as geoapifyGeocode,
  reverseGeocode,
  getPrimaryCategory,
  PLACE_CATEGORIES,
  type GeoapifyFeature,
  type GeoapifyPlacesResponse,
} from './geoapify';

