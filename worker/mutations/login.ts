// Mutation resolver for login
// Handles user authentication with password verification and token generation

import { eq } from 'drizzle-orm';
import { getServerDB } from '@database/server';
import { users } from '@database/server';
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
  try {
    const db = getServerDB(context.env.DB);

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

    // Store token in KV for validation (key: token:${token}, value: userId UUID)
    // Token expires after 30 days (optional: can set expiration)
    try {
      await context.env.KV?.put(`token:${token}`, user.id, {
        expirationTtl: 60 * 60 * 24 * 30, // 30 days in seconds
      });
    } catch (error) {
      console.warn('Failed to store token in KV:', error);
      // Continue even if KV storage fails - token is still returned
    }

    return {
      user: {
        id: user.id, // Already a UUID string
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    };
  } catch (error) {
    // Log the error for debugging
    console.error('Login error:', error);
    
    // Re-throw the error to be handled by GraphQL
    throw error;
  }
};
