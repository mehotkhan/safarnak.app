// Query resolvers index
// Exports all query resolvers

import { getMessages } from './getMessages';
import { me } from './me';
import { getUser } from './getUser';
import { getTrips, getTrip } from './getTrips';
import { getTours, getTour } from './getTours';
import { getPlaces, getPlace } from './getPlaces';
import { getLocations, getLocation } from './getLocations';
import { getPosts } from './getPosts';
import { getPost } from './getPost';
import { getBookmarks } from './getBookmarks';
import { getAlerts } from './getAlerts';
import { checkUsernameAvailability } from './checkUsernameAvailability';
import { getMyDevices } from './getMyDevices';

export const Query = {
  getMessages,
  me,
  getUser,
  getTrips,
  getTrip,
  getTours,
  getTour,
  getPlaces,
  getPlace,
  getLocations,
  getLocation,
  getPosts,
  getPost,
  getBookmarks,
  getAlerts,
  checkUsernameAvailability,
  getMyDevices,
};

// Re-export individual resolvers
export { getMessages, me, getUser, getTrips, getTrip, getTours, getTour, getPlaces, getPlace, getLocations, getLocation, getPosts, getPost, getBookmarks, getAlerts, checkUsernameAvailability, getMyDevices };
