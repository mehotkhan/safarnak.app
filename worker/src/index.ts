import { makeExecutableSchema } from '@graphql-tools/schema';
import { createYoga } from 'graphql-yoga';
import {
  handleSubscriptions,
  createWsConnectionPoolClass,
  subscribe,
  DefaultPublishableContext,
  createDefaultPublishableContext,
} from 'graphql-workers-subscriptions';
import { drizzle } from 'drizzle-orm/d1';
import { messages, users } from '@drizzle/schemas/worker';
import { eq } from 'drizzle-orm';
import { typeDefs } from '@graphql/schema/schema';

export interface Env {
  DB: D1Database;
  SUBSCRIPTION_POOL: DurableObjectNamespace;
}

// Password hashing utilities using Cloudflare Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Use PBKDF2 for password hashing (more secure than SHA-256)
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256'
    },
    key,
    256 // 256 bits = 32 bytes
  );
  
  // Combine salt and hash for storage
  const combined = new Uint8Array(salt.length + derivedBits.byteLength);
  combined.set(salt);
  combined.set(new Uint8Array(derivedBits), salt.length);
  
  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Decode the stored hash
    const combined = new Uint8Array(
      atob(hashedPassword).split('').map(char => char.charCodeAt(0))
    );
    
    // Extract salt (first 16 bytes) and hash (remaining bytes)
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    const key = await crypto.subtle.importKey(
      'raw',
      data,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    const derivedHash = new Uint8Array(derivedBits);
    
    // Timing-safe comparison
    if (storedHash.length !== derivedHash.length) return false;
    let result = 0;
    for (let i = 0; i < storedHash.length; i++) {
      result |= storedHash[i] ^ derivedHash[i];
    }
    return result === 0;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

async function generateToken(userId: number, username: string): Promise<string> {
  const data = new TextEncoder().encode(`${userId}-${username}-${Date.now()}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const schema = makeExecutableSchema<DefaultPublishableContext<Env>>({
  typeDefs,
  resolvers: {
    Query: {
      getMessages: async (_parent, _args, context) => {
        const db = drizzle(context.env.DB);
        return await db.select().from(messages).all();
      },
      me: async (_parent, _args, context) => {
        // This would need JWT token validation in a real implementation
        // For now, we'll return null as we don't have auth middleware
        return null;
      },
    },
    Mutation: {
      addMessage: async (_parent, { content }, context) => {
        const db = drizzle(context.env.DB);
        const id = crypto.randomUUID();
        await db.insert(messages).values({ id, content }).run();
        const newMsg = await db.select().from(messages).where(eq(messages.id, id)).get();

        context.publish('NEW_MESSAGES', { newMessages: newMsg });

        return newMsg;
      },
      register: async (_parent, { username, password }, context) => {
        const db = drizzle(context.env.DB);
        
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
        if (existingUser) {
          throw new Error('User with this username already exists');
        }

        // Hash password using PBKDF2
        const passwordHash = await hashPassword(password);
        
        // Generate user ID
        const userId = Math.floor(Math.random() * 1000000);
        
        // Insert user
        await db.insert(users).values({
          id: userId,
          name: username, // Use username as name for simplicity
          username,
          passwordHash,
        }).run();

        // Get the created user
        const user = await db.select().from(users).where(eq(users.id, userId)).get();
        
        if (!user) {
          throw new Error('Failed to create user');
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
      },
      login: async (_parent, { username, password }, context) => {
        const db = drizzle(context.env.DB);
        
        // Find user by username
        const user = await db.select().from(users).where(eq(users.username, username)).get();
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
      },
    },
    Subscription: {
      newMessages: {
        subscribe: subscribe('NEW_MESSAGES'),
      },
    },
  },
});

const settings = {
  schema,
  wsConnectionPool: (env: Env) => env.SUBSCRIPTION_POOL,
  subscriptionsDb: (env: Env) => env.DB,
};

const yoga = createYoga<DefaultPublishableContext<Env>>({
  schema,
  graphiql: {
    subscriptionsProtocol: 'WS',
  },
});

const baseFetch = (request: Request, env: Env, executionCtx: ExecutionContext) =>
  yoga.handleRequest(
    request,
    createDefaultPublishableContext({
      env,
      executionCtx,
      ...settings,
    })
  );

const fetch = handleSubscriptions({
  fetch: baseFetch,
  ...settings,
});

export default { fetch };

export const SubscriptionPool = createWsConnectionPoolClass(settings);