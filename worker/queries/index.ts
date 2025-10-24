// Query resolvers index
// Exports all query resolvers

import { getMessages } from './getMessages';
import { me } from './me';

export const Query = {
  getMessages,
  me,
};

// Re-export individual resolvers
export { getMessages, me };
