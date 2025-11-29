// Query resolvers index
// Exports all query resolvers

import { myConversationsResolver, conversationMessagesPageResolver } from '../resolvers/messaging';
import { me } from './me';
import { getUser } from './getUser';
import { getTrips, getTrip } from './getTrips';
// getTours and getTour removed - use getTrips with isHosted filter instead
import { getPlaces, getPlace } from './getPlaces';
import { getLocations, getLocation } from './getLocations';
import { getPosts } from './getPosts';
import { getPost } from './getPost';
import { getBookmarks } from './getBookmarks';
import { getAlerts } from './getAlerts';
import { checkUsernameAvailability } from './checkUsernameAvailability';
import { getMyDevices } from './getMyDevices';
import { getFeed } from './getFeed';
import { getFeedPreferences } from './getFeedPreferences';
import { search, searchSuggest } from './search';
import { getTrending } from './getTrending';
import { isFollowing } from './isFollowing';
import { getFollowers } from './getFollowers';
import { getFollowing } from './getFollowing';
import { searchSemantic } from './searchSemantic';

export const Query = {
  myConversations: myConversationsResolver,
  conversationMessagesPage: conversationMessagesPageResolver,
  me,
  getUser,
  getTrips,
  getTrip,
  // getTours, getTour removed
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
  getFeed,
  getFeedPreferences,
  search,
  searchSuggest,
  getTrending,
  isFollowing,
  getFollowers,
  getFollowing,
  searchSemantic,
};

// Re-export individual resolvers
export {
  myConversationsResolver as myConversations,
  conversationMessagesPageResolver as conversationMessagesPage,
  me,
  getUser,
  getTrips,
  getTrip,
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
  getFeed,
  getFeedPreferences,
  search,
  searchSuggest,
  getTrending,
  isFollowing,
  getFollowers,
  getFollowing,
  searchSemantic,
};
