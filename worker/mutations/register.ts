// Mutation resolver for register
// Handles user registration with password hashing and token generation

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import { users } from '../../drizzle/schema';
import { ResolverContext } from '../types';
import { hashPassword, generateToken } from '../utilities/utils';

interface RegisterArgs {
  username: string;
  password: string;
}

export const register = async (
  _parent: unknown,
  { username, password }: RegisterArgs,
  context: ResolverContext
) => {
  const db = drizzle(context.env.DB);

  // Validate input
  if (!username || username.trim().length === 0) {
    throw new Error('Username is required');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();

  if (existingUser) {
    throw new Error('User with this username already exists');
  }

  // Hash password using PBKDF2
  const passwordHash = await hashPassword(password);

  // Insert user
  const result = await db
    .insert(users)
    .values({
      name: username,
      username,
      passwordHash,
      email: null,
      phone: null,
      avatar: null,
      isActive: true,
    })
    .returning({ id: users.id })
    .get();

  if (!result) {
    throw new Error('Failed to create user');
  }

  const userId = result.id;

  // Get the created user
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) {
    throw new Error('Failed to retrieve created user');
  }

  // Generate secure token
  const token = await generateToken(userId, username);

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
