// Mutation resolver for updateUser
// Handles user profile updates including avatar upload to R2

import { getServerDB, users } from '@database/server';
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

    // Fetch current user
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Prepare update data
    const updateData: Partial<typeof users.$inferInsert> = {};

    // Update name if provided
    if (input.name !== undefined) {
      if (input.name.trim().length === 0) {
        throw new Error('Name cannot be empty');
      }
      updateData.name = input.name.trim();
    }

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

      updateData.username = newUsername;
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

      updateData.email = newEmail;
    }

    // Update phone if provided
    if (input.phone !== undefined) {
      updateData.phone = input.phone.trim() || null;
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
        // The worker serves avatars at /avatars/{key}
        // Use the request URL from context if available
        let baseUrl = 'https://safarnak.app';
        try {
          const request = (context as any).request;
          if (request?.url) {
            const requestUrl = new URL(request.url);
            baseUrl = requestUrl.origin;
          } else if ((context.env as any).WORKER_URL) {
            baseUrl = (context.env as any).WORKER_URL;
          }
        } catch (error) {
          console.warn('[updateUser] Could not determine base URL, using default:', error);
        }
        const avatarUrl = `${baseUrl}/avatars/${r2Key}`;

        console.log('[updateUser] Avatar uploaded successfully:', {
          r2Key,
          avatarUrl,
        });
        
        updateData.avatar = avatarUrl;

        // Delete old avatar if it exists and is different
        if (currentUser.avatar && currentUser.avatar !== avatarUrl) {
          try {
            // Extract key from old URL (handle both worker route and direct R2 URLs)
            let oldKey: string | null = null;
            if (currentUser.avatar.includes('/avatars/')) {
              const oldUrlParts = currentUser.avatar.split('/avatars/');
              if (oldUrlParts.length > 1) {
                oldKey = `avatars/${oldUrlParts[1]}`;
              }
            } else {
              // Fallback: try to extract from any URL format
              const oldUrlParts = currentUser.avatar.split('/');
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

    // Update user in database
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date().toISOString();
      
      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId));
    }

    // Fetch updated user
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      publicKey: updatedUser.publicKey,
      createdAt: updatedUser.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('[updateUser] Error:', error);
    throw error instanceof Error ? error : new Error('Failed to update user');
  }
};

