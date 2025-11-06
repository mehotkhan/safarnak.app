// Mutation resolvers index
// Exports all mutation resolvers

import { addMessage } from './addMessage';
// Legacy password-based register/login removed in favor of biometric auth
import { requestChallenge } from './requestChallenge';
import { registerUser } from './registerUser';
import { loginUser } from './loginUser';
import { createTrip } from './createTrip';
import { updateTrip, deleteTrip } from './updateTrip';

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
  bookmarkTour,
  bookmarkPlace,
};

// Re-export individual resolvers
export { addMessage, requestChallenge, registerUser, loginUser, createTrip, updateTrip, deleteTrip, bookmarkTour, bookmarkPlace };
