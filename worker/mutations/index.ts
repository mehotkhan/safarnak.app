// Mutation resolvers index
// Exports all mutation resolvers

import { addMessage } from './addMessage';
import { register } from './register';
import { login } from './login';

export const Mutation = {
  addMessage,
  register,
  login,
};

// Re-export individual resolvers
export { addMessage, register, login };
