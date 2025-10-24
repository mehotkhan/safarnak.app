// Mutation resolvers
// These resolvers handle GraphQL Mutation operations

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { DefaultPublishableContext } from 'graphql-workers-subscriptions';

import { messages, users } from '../drizzle/schema';
import { hashPassword, verifyPassword, generateToken } from './utils';

export interface MutationEnv {
  DB: D1Database;
  SUBSCRIPTION_POOL: DurableObjectNamespace;
}

export const addMessage = async (
  _parent: unknown,
  { content }: { content: string },
  context: DefaultPublishableContext<MutationEnv>
) => {
  const db = drizzle(context.env.DB);
  const id = crypto.randomUUID();
  await db.insert(messages).values({ id, content }).run();
  const newMsg = await db
    .select()
    .from(messages)
    .where(eq(messages.id, id))
    .get();

  context.publish('NEW_MESSAGES', { newMessages: newMsg });

  return newMsg;
};

export const register = async (
  _parent: unknown,
  { username, password }: { username: string; password: string },
  context: DefaultPublishableContext<MutationEnv>
) => {
  const db = drizzle(context.env.DB);

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

  // Insert user (ID will be auto-generated)
  const result = await db
    .insert(users)
    .values({
      name: username, // Use username as name for simplicity
      username,
      passwordHash,
      email: null, // Optional field
      phone: null, // Optional field
      avatar: null, // Optional field
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

export const login = async (
  _parent: unknown,
  { username, password }: { username: string; password: string },
  context: DefaultPublishableContext<MutationEnv>
) => {
  const db = drizzle(context.env.DB);

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

export const Mutation = {
  addMessage,
  register,
  login,
};
