// Mutation resolvers index
// Exports all mutation resolvers

import { addMessage } from './addMessage';
import { register } from './register';
import { login } from './login';
import { createTrip } from './createTrip';
import { updateTrip, deleteTrip } from './updateTrip';

// Placeholder resolvers for bookmarks
const bookmarkTour = async () => true;
const bookmarkPlace = async () => true;

export const Mutation = {
  addMessage,
  register,
  login,
  createTrip,
  updateTrip,
  deleteTrip,
  bookmarkTour,
  bookmarkPlace,
};

// Re-export individual resolvers
export { addMessage, register, login, createTrip, updateTrip, deleteTrip, bookmarkTour, bookmarkPlace };
