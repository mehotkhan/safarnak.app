// Query resolvers index
// Exports all query resolvers

import { getMessages } from './getMessages';
import { me } from './me';
import { getTrips, getTrip } from './getTrips';
import { getAlerts } from './getAlerts';

// Placeholder resolvers for tours and places
const getTours = async () => [];
const getTour = async () => null;
const getPlaces = async () => [];
const getPlace = async () => null;

export const Query = {
  getMessages,
  me,
  getTrips,
  getTrip,
  getTours,
  getTour,
  getPlaces,
  getPlace,
  getAlerts,
};

// Re-export individual resolvers
export { getMessages, me, getTrips, getTrip, getTours, getTour, getPlaces, getPlace, getAlerts };
