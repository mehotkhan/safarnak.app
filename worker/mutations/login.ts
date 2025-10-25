// Mutation resolver for login
// Handles user authentication with password verification and token generation

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import { users } from '../../drizzle/schema';
import { ResolverContext } from '../types';
import { verifyPassword, generateToken } from '../utilities/utils';

interface LoginArgs {
  username: string;
  password: string;
}

export const login = async (
  _parent: unknown,
  { username, password }: LoginArgs,
  context: ResolverContext
) => {
  const db = drizzle(context.env.DB);

  // Validate input
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  // Find user by username
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();

  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Verify password using PBKDF2
  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error('Invalid username or password');
  }

  // Generate secure token
  const token = await generateToken(user.id, username);

  return {
    user: {
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    },
    token,
  };
};
