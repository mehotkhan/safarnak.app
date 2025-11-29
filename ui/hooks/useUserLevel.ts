import { useAppSelector } from '@state/hooks';

/**
 * User tier levels in Safarnak
 * - guest: Default tier (username + device keypair + JWT, minimal profile)
 * - member: Guest + verified phone + verified email (can use more server features)
 * - pro: Member + active subscription (premium features)
 */
export type UserLevel = 'guest' | 'member' | 'pro';

/**
 * Derives user tier level from Redux auth state
 * 
 * Logic:
 * - pro: User has active subscription (hasActiveSubscription === true)
 * - member: User has verified both email and phone (emailVerified && phoneVerified)
 * - guest: Default tier (no verification or subscription)
 * 
 * @returns UserLevel - The current user's tier level
 * 
 * @example
 * ```tsx
 * const userLevel = useUserLevel();
 * if (userLevel === 'guest') {
 *   // Show upgrade prompt
 * }
 * ```
 */
export const useUserLevel = (): UserLevel => {
  const user = useAppSelector((state) => state.auth.user);
  
  // If no user, return guest (unauthenticated users are guests)
  if (!user) return 'guest';
  
  // Type assertion needed until GraphQL schema includes these fields
  // After schema update and codegen, these will be properly typed
  const userWithTiers = user as any;
  
  // Check for active subscription first (highest tier)
  if (userWithTiers?.hasActiveSubscription === true) {
    return 'pro';
  }
  
  // Check for verified email and phone (member tier)
  if (
    userWithTiers?.emailVerified === true &&
    userWithTiers?.phoneVerified === true
  ) {
    return 'member';
  }
  
  // Default to guest tier
  return 'guest';
};

