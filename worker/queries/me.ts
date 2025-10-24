// Query resolver for me
// Handles retrieving current user information

import { ResolverContext } from '../types';

export const me = async (
  _parent: unknown,
  _args: unknown,
  _context: ResolverContext
) => {
  // TODO: Implement JWT token validation
  // For now, we return null as we don't have auth middleware yet
  return null;
};
