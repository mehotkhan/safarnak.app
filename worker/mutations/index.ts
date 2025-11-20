// Mutation resolvers index
// Exports all mutation resolvers

import { addMessage } from './addMessage';
// Legacy password-based register/login removed in favor of biometric auth
import { requestChallenge } from './requestChallenge';
import { registerUser } from './registerUser';
import { loginUser } from './loginUser';
import { updateUser } from './updateUser';
import { createTrip } from './createTrip';
import { updateTrip, deleteTrip } from './updateTrip';
import { createTour } from './createTour';
import { updateTour } from './updateTour';
import { deleteTour } from './deleteTour';
import { createPlace } from './createPlace';
import { updatePlace } from './updatePlace';
import { deletePlace } from './deletePlace';
import { createLocation, updateLocation, deleteLocation } from './updateLocation';
import { bookTour } from './bookTour';
import { createPost } from './createPost';
import { createComment } from './createComment';
import { createReaction } from './createReaction';
import { deleteReaction } from './deleteReaction';
import { bookmarkPost } from './bookmarkPost';
import { revokeDevice } from './revokeDevice';
import { updateFeedPreferences } from './updateFeedPreferences';
import { followUser } from './followUser';
import { unfollowUser } from './unfollowUser';
import { addToCloseFriends } from './addToCloseFriends';
import { removeFromCloseFriends } from './removeFromCloseFriends';
import { generateAvatar } from './generateAvatar';

// Placeholder resolvers for bookmarks
const bookmarkTour = async () => true;
const bookmarkPlace = async () => true;

export const Mutation = {
  addMessage,
  requestChallenge,
  registerUser,
  loginUser,
  updateUser,
  createTrip,
  updateTrip,
  deleteTrip,
  createTour,
  updateTour,
  deleteTour,
  createPlace,
  updatePlace,
  deletePlace,
  createLocation,
  updateLocation,
  deleteLocation,
  bookTour,
  createPost,
  createComment,
  createReaction,
  deleteReaction,
  bookmarkPost,
  bookmarkTour,
  bookmarkPlace,
  revokeDevice,
  updateFeedPreferences,
  followUser,
  unfollowUser,
  addToCloseFriends,
  removeFromCloseFriends,
  generateAvatar,
};

// Re-export individual resolvers
export { addMessage, requestChallenge, registerUser, loginUser, updateUser, createTrip, updateTrip, deleteTrip, createTour, updateTour, deleteTour, createPlace, updatePlace, deletePlace, createLocation, updateLocation, deleteLocation, bookTour, createPost, createComment, createReaction, deleteReaction, bookmarkPost, bookmarkTour, bookmarkPlace, revokeDevice, updateFeedPreferences, followUser, unfollowUser, addToCloseFriends, removeFromCloseFriends, generateAvatar };
