// Query resolvers index
// Exports all query resolvers

import { getMessages } from './getMessages';
import { me } from './me';
import { getTrips, getTrip } from './getTrips';
import { getTours, getTour } from './getTours';
import { getPlaces, getPlace } from './getPlaces';
import { getPosts } from './getPosts';
import { getPost } from './getPost';
import { getBookmarks } from './getBookmarks';
import { getAlerts } from './getAlerts';
import { checkUsernameAvailability } from './checkUsernameAvailability';
import { getMyDevices } from './getMyDevices';

export const Query = {
  getMessages,
  me,
  getTrips,
  getTrip,
  getTours,
  getTour,
  getPlaces,
  getPlace,
  getPosts,
  getPost,
  getBookmarks,
  getAlerts,
  checkUsernameAvailability,
  getMyDevices,
};

// Re-export individual resolvers
export { getMessages, me, getTrips, getTrip, getTours, getTour, getPlaces, getPlace, getPosts, getPost, getBookmarks, getAlerts, checkUsernameAvailability, getMyDevices };
