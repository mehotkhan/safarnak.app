// Mutation resolvers index
// Exports all mutation resolvers

import { addMessage } from './addMessage';
// Legacy password-based register/login removed in favor of biometric auth
import { requestChallenge } from './requestChallenge';
import { registerUser } from './registerUser';
import { loginUser } from './loginUser';
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

// Placeholder resolvers for bookmarks
const bookmarkTour = async () => true;
const bookmarkPlace = async () => true;

export const Mutation = {
  addMessage,
  requestChallenge,
  registerUser,
  loginUser,
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
};

// Re-export individual resolvers
export { addMessage, requestChallenge, registerUser, loginUser, createTrip, updateTrip, deleteTrip, createTour, updateTour, deleteTour, createPlace, updatePlace, deletePlace, createLocation, updateLocation, deleteLocation, bookTour, createPost, createComment, createReaction, deleteReaction, bookmarkPost, bookmarkTour, bookmarkPlace, revokeDevice };
