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
// Tour mutations removed - use Trip mutations with isHosted flag instead
import { createPlace } from './createPlace';
import { updatePlace } from './updatePlace';
import { deletePlace } from './deletePlace';
import { createLocation, updateLocation, deleteLocation } from './updateLocation';
import { joinTrip } from './joinTrip';
import { cancelTripJoin } from './cancelTripJoin';
import { respondTripJoinRequest } from './respondTripJoinRequest';
import { createPost } from './createPost';
import { createComment } from './createComment';
import { createReaction } from './createReaction';
import { deleteReaction } from './deleteReaction';
import { bookmarkPost } from './bookmarkPost';
import { bookmarkTrip } from './bookmarkTrip';
import { revokeDevice } from './revokeDevice';
import { updateFeedPreferences } from './updateFeedPreferences';
import { followUser } from './followUser';
import { unfollowUser } from './unfollowUser';
import { addToCloseFriends } from './addToCloseFriends';
import { removeFromCloseFriends } from './removeFromCloseFriends';
import { generateAvatar } from './generateAvatar';

// Placeholder resolver for bookmarkPlace
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
  // createTour, updateTour, deleteTour removed
  createPlace,
  updatePlace,
  deletePlace,
  createLocation,
  updateLocation,
  deleteLocation,
  joinTrip,
  cancelTripJoin,
  respondTripJoinRequest,
  createPost,
  createComment,
  createReaction,
  deleteReaction,
  bookmarkPost,
  bookmarkTrip,
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
export { addMessage, requestChallenge, registerUser, loginUser, updateUser, createTrip, updateTrip, deleteTrip, createPlace, updatePlace, deletePlace, createLocation, updateLocation, deleteLocation, joinTrip, cancelTripJoin, respondTripJoinRequest, createPost, createComment, createReaction, deleteReaction, bookmarkPost, bookmarkTrip, bookmarkPlace, revokeDevice, updateFeedPreferences, followUser, unfollowUser, addToCloseFriends, removeFromCloseFriends, generateAvatar };
