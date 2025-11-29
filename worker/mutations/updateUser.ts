// Mutation resolver for updateUser
// Handles user profile updates including avatar upload to R2
// After Phase 11.4: Updates users table (username, email) and profiles table (displayName, phone, avatarUrl)

import { getServerDB, users, profiles } from '@database/server';
import { eq } from 'drizzle-orm';
import type { GraphQLContext } from '../types';

interface UpdateUserInput {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarBase64?: string;
  avatarMimeType?: string;
}

export const updateUser = async (
  _parent: unknown,
  { input }: { input: UpdateUserInput },
  context: GraphQLContext
) => {
  try {
    const userId = context.userId;
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const db = getServerDB(context.env.DB);

    // Fetch current user and profile
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!currentUser) {
      throw new Error('User not found');
    }

    const currentProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .get();

    // Prepare update data for users table (username, email only)
    const userUpdateData: Partial<typeof users.$inferInsert> = {};

    // Update username if provided
    if (input.username !== undefined) {
      const newUsername = input.username.trim();
      if (newUsername.length === 0) {
        throw new Error('Username cannot be empty');
      }

      // Check if username is already taken by another user
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, newUsername))
        .get();

      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username is already taken');
      }

      userUpdateData.username = newUsername;
    }

    // Update email if provided
    if (input.email !== undefined) {
      const newEmail = input.email.trim() || null;
      
      if (newEmail) {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
          throw new Error('Invalid email format');
        }

        // Check if email is already taken by another user
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, newEmail))
          .get();

        if (existingUser && existingUser.id !== userId) {
          throw new Error('Email is already taken');
        }
      }

      userUpdateData.email = newEmail;
    }

    // Prepare update data for profiles table (displayName, phone, avatarUrl)
    const profileUpdateData: Partial<typeof profiles.$inferInsert> = {};

    // Update displayName (from name input) if provided
    if (input.name !== undefined) {
      if (input.name.trim().length === 0) {
        throw new Error('Name cannot be empty');
      }
      profileUpdateData.displayName = input.name.trim();
    }

    // Update phone if provided
    if (input.phone !== undefined) {
      profileUpdateData.phone = input.phone.trim() || null;
    }

    // Handle avatar upload to R2 if provided
    if (input.avatarBase64 && input.avatarMimeType) {
      try {
        // Clean base64 data (remove data URI prefix if present)
        let base64Data = input.avatarBase64.trim();
        if (base64Data.includes(',')) {
          // If it contains a comma, it's a data URI - extract just the base64 part
          base64Data = base64Data.split(',')[1];
        }
        
        // Validate base64
        if (!base64Data || base64Data.length === 0) {
          throw new Error('Invalid base64 data: empty or missing');
        }

        // Decode base64 to binary
        let imageBuffer: Uint8Array;
        try {
          imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        } catch (decodeError) {
          console.error('[updateUser] Base64 decode error:', decodeError);
          throw new Error('Invalid base64 data: failed to decode');
        }

        // Validate buffer size (max 10MB for avatars)
        if (imageBuffer.length > 10 * 1024 * 1024) {
          throw new Error('Avatar file too large: maximum 10MB allowed');
        }

        // Determine file extension from MIME type
        const mimeToExt: Record<string, string> = {
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          'image/png': 'png',
          'image/gif': 'gif',
          'image/webp': 'webp',
        };

        const ext = mimeToExt[input.avatarMimeType.toLowerCase()] || 'jpg';
        const r2Key = `avatars/user-${userId}.${ext}`;

        console.log('[updateUser] Uploading avatar to R2:', {
          r2Key,
          mimeType: input.avatarMimeType,
          size: imageBuffer.length,
          userId,
        });

        // Upload to R2
        const uploadResult = await context.env.R2.put(r2Key, imageBuffer, {
          httpMetadata: {
            contentType: input.avatarMimeType,
          },
          customMetadata: {
            userId: userId,
            uploadedAt: new Date().toISOString(),
          },
        });

        if (!uploadResult) {
          throw new Error('R2 upload returned null');
        }

        // Construct avatar URL using worker route
        // The R2 key already includes 'avatars/' prefix, so use it directly
        // IMPORTANT: Use the same base URL as the GraphQL client to ensure mobile devices can access avatars
        let baseUrl = 'https://safarnak.app';
        try {
          // Priority 1: Extract base URL from GRAPHQL_URL environment variable (most reliable for mobile clients)
          // This ensures avatar URLs use the same host/IP that the client is configured to use
          if ((context.env as any).GRAPHQL_URL) {
            try {
              const graphqlUrl = new URL((context.env as any).GRAPHQL_URL);
              // Remove /graphql path, keep just the origin (e.g., http://192.168.1.51:8787)
              baseUrl = graphqlUrl.origin;
            } catch (e) {
              console.warn('[updateUser] Failed to parse GRAPHQL_URL:', e);
            }
          }
          
          // Priority 2: Try to get the Host header (only if not localhost/127.0.0.1)
          // Skip localhost/127.0.0.1 as mobile devices can't access them
          if (baseUrl === 'https://safarnak.app' && (context as any).request?.headers) {
            const hostHeader = (context as any).request.headers.get('host');
            if (hostHeader && 
                hostHeader !== '0.0.0.0' && 
                !hostHeader.includes('0.0.0.0') &&
                hostHeader !== 'localhost' &&
                !hostHeader.includes('localhost') &&
                hostHeader !== '127.0.0.1' &&
                !hostHeader.includes('127.0.0.1')) {
              const protocol = (context as any).request.url?.startsWith('https://') ? 'https' : 'http';
              baseUrl = `${protocol}://${hostHeader}`;
            }
          }
          
          // Priority 3: Extract from request URL (only if not localhost/127.0.0.1)
          if (baseUrl === 'https://safarnak.app' && (context as any).request?.url) {
            const requestUrl = new URL((context as any).request.url);
            const hostname = requestUrl.hostname;
            const port = requestUrl.port;
            
            // Skip localhost/127.0.0.1 as mobile devices can't access them
            if (hostname && 
                hostname !== '0.0.0.0' && 
                hostname !== 'localhost' && 
                hostname !== '127.0.0.1') {
              baseUrl = `${requestUrl.protocol}//${hostname}${port ? `:${port}` : ''}`;
            }
          }
          
          // Priority 4: Fallback to WORKER_URL if available
          if (baseUrl === 'https://safarnak.app' && (context.env as any).WORKER_URL) {
            baseUrl = (context.env as any).WORKER_URL;
          }
        } catch (error) {
          console.warn('[updateUser] Could not determine base URL, using default:', error);
        }
        // r2Key already includes 'avatars/' prefix, so use it directly
        const avatarUrl = `${baseUrl}/${r2Key}`;

        console.log('[updateUser] Avatar uploaded successfully:', {
          r2Key,
          avatarUrl,
        });
        
        profileUpdateData.avatarUrl = avatarUrl;

        // Delete old avatar if it exists and is different
        const oldAvatarUrl = currentProfile?.avatarUrl;
        if (oldAvatarUrl && oldAvatarUrl !== avatarUrl) {
          try {
            // Extract key from old URL (handle both worker route and direct R2 URLs)
            let oldKey: string | null = null;
            if (oldAvatarUrl.includes('/avatars/')) {
              const oldUrlParts = oldAvatarUrl.split('/avatars/');
              if (oldUrlParts.length > 1) {
                oldKey = `avatars/${oldUrlParts[1]}`;
              }
            } else {
              // Fallback: try to extract from any URL format
              const oldUrlParts = oldAvatarUrl.split('/');
              const lastPart = oldUrlParts[oldUrlParts.length - 1];
              if (lastPart && lastPart.startsWith('user-')) {
                oldKey = `avatars/${lastPart}`;
              }
            }
            
            if (oldKey && oldKey !== r2Key) {
              console.log('[updateUser] Deleting old avatar:', oldKey);
              await context.env.R2.delete(oldKey);
            }
          } catch (error) {
            console.warn('[updateUser] Failed to delete old avatar:', error);
            // Continue even if deletion fails
          }
        }
      } catch (error) {
        console.error('[updateUser] Avatar upload error:', error);
        throw new Error('Failed to upload avatar: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }

    // Update users table if needed
    if (Object.keys(userUpdateData).length > 0) {
      userUpdateData.updatedAt = new Date().toISOString();
      
      await db
        .update(users)
        .set(userUpdateData)
        .where(eq(users.id, userId));
    }

    // Update or create profiles table if needed
    if (Object.keys(profileUpdateData).length > 0) {
      profileUpdateData.updatedAt = new Date().toISOString();
      
      if (currentProfile) {
        // Update existing profile
        await db
          .update(profiles)
          .set(profileUpdateData)
          .where(eq(profiles.userId, userId));
      } else {
        // Create new profile if it doesn't exist
        await db.insert(profiles).values({
          userId,
          ...profileUpdateData,
          isActive: true,
        });
      }
    }

    // Fetch updated user and profile
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    const updatedProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .get();

    // Return combined data matching GraphQL User type
    return {
      id: updatedUser.id,
      name: updatedProfile?.displayName || updatedUser.username, // Fallback to username if no profile
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedProfile?.phone || null,
      avatar: updatedProfile?.avatarUrl || null,
      publicKey: updatedUser.publicKey,
      createdAt: updatedUser.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('[updateUser] Error:', error);
    throw error instanceof Error ? error : new Error('Failed to update user');
  }
};

