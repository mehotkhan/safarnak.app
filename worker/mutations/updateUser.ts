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
        // Decode base64 image
        const base64Data = input.avatarBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

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

        // Upload to R2
        await context.env.R2.put(r2Key, imageBuffer, {
          httpMetadata: {
            contentType: input.avatarMimeType,
          },
          customMetadata: {
            userId: userId,
            uploadedAt: new Date().toISOString(),
          },
        });

        // Construct R2 URL
        // For public R2 buckets, use the public URL pattern
        // For custom domains, configure R2_CUSTOM_DOMAIN env var
        // Default pattern: https://<account-id>.r2.cloudflarestorage.com/<bucket-name>/<key>
        // Or use a custom domain if configured
        const r2CustomDomain = (context.env as any).R2_CUSTOM_DOMAIN;
        const avatarUrl = r2CustomDomain 
          ? `https://${r2CustomDomain}/${r2Key}`
          : `https://r2.safarnak.app/${r2Key}`; // Placeholder - configure your R2 public URL or custom domain
        
        updateData.avatar = avatarUrl;

        // Delete old avatar if it exists and is different
        if (currentUser.avatar && currentUser.avatar !== avatarUrl) {
          try {
            // Extract key from old URL
            const oldUrlParts = currentUser.avatar.split('/');
            const oldKey = oldUrlParts[oldUrlParts.length - 1];
            if (oldKey.startsWith('user-') && oldKey !== `user-${userId}.${ext}`) {
              await context.env.R2.delete(`avatars/${oldKey}`);
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

