// Mutation resolver for register
// Handles user registration with password hashing and token generation

import { eq } from 'drizzle-orm';
import { getServerDB } from '@database/server';
import { users } from '@database/server';
import { ResolverContext } from '../types';
import { hashPassword, generateToken } from '../utilities/auth/password';

interface RegisterArgs {
  username: string;
  password: string;
}

export const register = async (
  _parent: unknown,
  { username, password }: RegisterArgs,
  context: ResolverContext
) => {
  try {
    const db = getServerDB(context.env.DB);

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

    // Store token in KV for validation (key: token:${token}, value: userId UUID)
    // Token expires after 30 days
    try {
      await context.env.KV?.put(`token:${token}`, userId, {
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
    console.error('Registration error:', error);
    
    // Re-throw the error to be handled by GraphQL
    throw error;
  }
};
