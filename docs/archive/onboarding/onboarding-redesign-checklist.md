# Onboarding & User Tiers Redesign Checklist

This checklist guides the redesign of the onboarding flow and introduction of user tiers (guest → member → pro) on top of the existing `useAuth` hook.

**Key Principle**: We are NOT modifying `useAuth` core logic. We're wrapping it with better UX flows and tier management.

---

## 📋 Pre-Implementation Checklist

### Phase 0: GraphQL Schema Updates (Backend First)

- [x] **Add user verification fields to GraphQL schema** (`graphql/schema.graphql`)
  - [x] Add `emailVerified: Boolean` to `User` type
  - [x] Add `phoneVerified: Boolean` to `User` type  
  - [x] Add `hasActiveSubscription: Boolean` to `User` type
  - [x] Add `subscriptionExpiresAt: String` (optional) to `User` type
  - [x] Add mutations for verification:
    - [x] `requestPhoneVerification(phone: String!): Boolean!`
    - [x] `verifyPhone(code: String!): Boolean!`
    - [x] `requestEmailVerification(email: String!): Boolean!`
    - [x] `verifyEmail(code: String!): Boolean!`
  - [ ] Run `yarn codegen` after schema changes (⚠️ **TODO: Run this command manually**)

---

## 🎯 Phase 1: Core Infrastructure

### 1.1 Create `useUserLevel` Hook

- [x] **Create** `ui/hooks/useUserLevel.ts`
  - [x] Export `UserLevel` type: `'guest' | 'member' | 'pro'`
  - [x] Implement hook that reads from `state.auth.user`
  - [x] Derive level based on:
    - `hasActiveSubscription === true` → `'pro'`
    - `emailVerified === true && phoneVerified === true` → `'member'`
    - Otherwise → `'guest'`
  - [x] Handle null/undefined user gracefully (return `'guest'`)

**File to create:**
```typescript
// ui/hooks/useUserLevel.ts
import { useAppSelector } from '@state/hooks';

export type UserLevel = 'guest' | 'member' | 'pro';

export const useUserLevel = (): UserLevel => {
  const user = useAppSelector((state) => state.auth.user);
  
  if (!user) return 'guest';
  
  // Type assertion needed until GraphQL schema is updated
  const userWithTiers = user as any;
  
  if (userWithTiers?.hasActiveSubscription) return 'pro';
  if (userWithTiers?.emailVerified && userWithTiers?.phoneVerified) return 'member';
  return 'guest';
};
```

---

## 🚀 Phase 2: Onboarding Flow Redesign

### 2.1 Restructure Onboarding Routes

- [x] **Create** `app/(auth)/onboarding/` directory
- [x] **Create** `app/(auth)/onboarding/_layout.tsx`
  - [x] Stack navigator for onboarding screens
  - [x] Hide header for all screens

- [x] **Rename/Move** existing `app/(auth)/welcome.tsx` → `app/(auth)/onboarding/intro.tsx`
  - [x] Keep existing slide functionality (PagerView)
  - [x] Update slides to focus on value proposition (not auth)
  - [x] Update "Skip" button → navigate to `/(auth)/onboarding/welcome`
  - [x] Update "Get Started" (last slide) → navigate to `/(auth)/onboarding/welcome`
  - [x] Remove direct navigation to register/login

- [x] **Create** `app/(auth)/onboarding/welcome.tsx` (NEW - replaces old welcome logic)
  - [x] Load `storedUsername` via `useAuth().loadStoredUsername()` on mount
  - [x] Show logo + tagline
  - [x] Show hero card with sample AI trip preview
  - [x] Show 3 value props (AI, social, offline) as cards
  - [x] **Three action buttons:**
    1. **Primary: "Start with AI Trip"**
       - If `storedUsername` exists → call `loginAndValidate(username)` → navigate to `/(app)/(trips)/new` (or AI trip wizard)
       - If no `storedUsername` → show dialog:
         - Option A: "Let Safarnak choose a username" → generate random username → `registerUser(randomUsername)` → navigate to AI trip wizard
         - Option B: "Let me pick a username" → navigate to `/(auth)/auth-username`
    2. **Secondary: "Just look around"**
       - Generate random username → `registerUser(randomUsername)` (silent, guest mode)
       - Navigate to `/(app)/(home)` (main tabs)
    3. **Text link: "I already have a username"**
       - Navigate to `/(auth)/auth-username`

- [x] **Create** `app/(auth)/auth-username.tsx` (NEW - dedicated username entry)
  - [x] Title: "Login with your Safarnak username"
  - [x] Username input field
  - [x] "Continue" button
  - [x] On submit → call `useAuth().loginAndValidate(username)`
  - [x] On success → navigate to `/(app)/(home)`
  - [x] Show error messages from `useAuth().error`

- [x] **Update** `app/(auth)/_layout.tsx`
  - [x] Add `onboarding` route group
  - [x] Add `auth-username` screen
  - [x] Keep existing `login` and `register` routes (for direct access if needed)

### 2.2 Update Root Auth Flow

- [x] **Update** `AuthWrapper.tsx` initial route logic
  - [x] Check for stored username + token on app boot
  - [x] If no username AND no token → redirect to `/(auth)/onboarding/intro`
  - [x] If has token → go directly to `/(app)` (main tabs)
  - [x] If has username but no token → redirect to `/(auth)/onboarding/welcome` (show login prompt)

- [ ] **Update** `app/(auth)/login.tsx` (if keeping for direct access)
  - [ ] Keep existing functionality
  - [ ] Add link to "New to Safarnak? Start onboarding" → `/(auth)/onboarding/intro`

---

## 👤 Phase 3: Profile Screen Enhancements

### 3.1 Update Profile Header

- [x] **Update** `app/(app)/(me)/index.tsx`
  - [x] Import `useUserLevel` hook
  - [x] Get `userLevel` from hook
  - [x] Add badge/chip next to username showing:
    - `'guest'` → "Guest" badge (gray/neutral)
    - `'member'` → "Member" badge (blue/primary)
    - `'pro'` → "Pro" badge (gold/premium)
  - [x] Style badge appropriately (small, rounded, colored background)

### 3.2 Add Upgrade Cards

- [x] **Add Guest → Member Upgrade Card** (in `app/(app)/(me)/index.tsx`)
  - [x] Show only if `userLevel === 'guest'`
  - [x] Card design:
    - Title: "Complete your account" / "Secure your Safarnak account"
    - Text: "Add phone and email to protect your trips and enable notifications."
    - Button: "Complete profile" → navigate to `/(app)/(me)/complete-account`
  - [x] Place after profile header, before stats row

- [x] **Add Member → Pro Upgrade Card** (in `app/(app)/(me)/index.tsx`)
  - [x] Show only if `userLevel === 'member'`
  - [x] Card design:
    - Title: "Upgrade to Safarnak Pro"
    - Text: "Get more AI planning, priority features, and more."
    - Button: "See plans" → navigate to `/(app)/(me)/subscription`
  - [x] Place after profile header, before stats row

---

## 📱 Phase 4: Complete Account Flow (Phone + Email Verification)

### 4.1 Create Complete Account Screen

- [x] **Create** `app/(app)/(me)/complete-account.tsx`
  - [x] Title: "Complete your Safarnak account"
  - [x] Brief explanation text
  - [x] **Two-step form:**
    - **Step 1: Phone Verification**
      - Phone input (international format, default region from locale)
      - "Send verification code" button
      - After sending → show OTP input field
      - "Verify phone" button
    - **Step 2: Email Verification**
      - Email input
      - "Send verification code" button
      - After sending → show code input field
      - "Verify email" button
  - [x] Progress indicator (Step 1 of 2, Step 2 of 2)
  - [x] Success state after both verified
  - [x] Call `refetchMe()` after verification to update Redux/Apollo cache
  - [x] Navigate back to profile on success

- [x] **Add GraphQL mutations** (mutations already in schema, using placeholder calls with TODO comments):
  - [x] `useRequestPhoneVerificationMutation` (placeholder with TODO)
  - [x] `useVerifyPhoneMutation` (placeholder with TODO)
  - [x] `useRequestEmailVerificationMutation` (placeholder with TODO)
  - [x] `useVerifyEmailMutation` (placeholder with TODO)
  - [ ] Run `yarn codegen` after backend implements mutations (⚠️ **TODO: Run this command when backend is ready**)

- [x] **Update** `app/(app)/(me)/_layout.tsx`
  - [x] Add `complete-account` route to Stack

### 4.2 Implementation Notes

- [x] Use placeholder mutations if backend not ready (with TODO comments)
- [x] Show loading states during verification
- [x] Handle errors gracefully (invalid code, network errors)
- [x] Auto-advance to next step after successful verification
- [x] Store verification state in component state (not Redux)

---

## 💎 Phase 5: Subscription Screen Enhancement

### 5.1 Update Existing Subscription Screen

- [x] **Update** `app/(app)/(me)/subscription.tsx` (already exists)
  - [x] Import `useUserLevel` hook
  - [x] Get `userLevel` from hook
  - [x] **If `userLevel === 'pro'`:**
    - Show "You are Pro" status
    - Display subscription expiry date (from `user.subscriptionExpiresAt`)
    - Show "Manage subscription" button (future: cancel/renew)
  - [x] **If `userLevel !== 'pro'`:**
    - Show list of Pro benefits:
      - More AI trip generations
      - Priority support
      - Advanced features
      - etc.
    - Show pricing (if available)
    - Button: "Subscribe with Tron wallet" (or "Coming soon" if not ready)
    - Future: Connect to Tron/Web3 payment flow

---

## 🔄 Phase 6: App Boot Flow Updates

### 6.1 Update AuthWrapper or Root Layout

- [x] **Review** `ui/auth/AuthWrapper.tsx` (or equivalent)
  - [x] Ensure it handles new onboarding flow
  - [x] Check redirect logic:
    - No username → `/(auth)/onboarding/intro`
    - Has username + token → `/(app)` (main tabs)
    - Has username but no token → `/(auth)/onboarding/welcome`

- [x] **Test** app boot scenarios (verified logic):
  - [x] First launch (no stored data) → redirects to `/(auth)/onboarding/intro`
  - [x] Returning guest (has username + token) → redirects to `/(app)/(home)`
  - [x] Logged out user (has username, no token) → redirects to `/(auth)/onboarding/welcome`
  - [x] Already authenticated user → redirects to `/(app)/(home)`

---

## 🎨 Phase 7: UI/UX Polish

### 7.1 Translations

- [x] **Add translations** to `locales/en/translation.json`:
  - [x] `onboarding.welcome.*` (welcome screen text)
  - [x] `auth.username.*` (username entry screen)
  - [x] `profile.tiers.guest`, `profile.tiers.member`, `profile.tiers.pro`
  - [x] `profile.upgrade.guestToMember.*` (upgrade card text)
  - [x] `profile.upgrade.memberToPro.*` (upgrade card text)
  - [x] `profile.completeAccount.*` (complete account screen)
  - [x] `subscription.proStatus.*` (pro status card)
  - [x] `subscription.cta.*` (subscribe CTA)
  - [x] `login.backToOnboarding` (back link)
  - [x] `register.backToOnboarding` (back link)

- [x] **Add translations** to `locales/fa/translation.json` (same keys)

### 7.2 Styling

- [x] **Style user level badges** (guest/member/pro)
  - [x] Use consistent colors (gray/blue/gold)
  - [x] Small, rounded, readable
  - [x] Dark mode compatible

- [x] **Style upgrade cards**
  - [x] Card design with shadow/elevation
  - [x] Clear CTA buttons
  - [x] Responsive layout

- [x] **Style onboarding screens**
  - [x] Consistent with existing design system
  - [x] NativeWind classes (no inline styles)
  - [x] Dark mode support

---

## 🧪 Phase 8: Testing & Validation

### 8.1 Manual Testing

- [ ] **Test onboarding flow:**
  - [ ] First-time user sees intro slides
  - [ ] Can skip intro → goes to welcome
  - [ ] "Start with AI Trip" → generates username → registers → goes to AI trip wizard
  - [ ] "Just look around" → generates username → registers → goes to main app
  - [ ] "I already have a username" → goes to username entry → login → main app

- [ ] **Test returning user:**
  - [ ] App boot with stored username + token → goes directly to main app
  - [ ] Profile shows correct user level badge
  - [ ] Upgrade cards show/hide based on level

- [ ] **Test profile upgrades:**
  - [ ] Guest sees "Complete account" card
  - [ ] Clicking card → goes to complete-account screen
  - [ ] Phone verification flow works
  - [ ] Email verification flow works
  - [ ] After both verified → profile shows "Member" badge
  - [ ] Member sees "Upgrade to Pro" card
  - [ ] Subscription screen shows correct state

- [ ] **Test edge cases:**
  - [ ] Network errors during verification
  - [ ] Invalid verification codes
  - [ ] Biometric auth failures
  - [ ] Username already taken (registration)

### 8.2 Code Quality

- [ ] **Run linter:** `yarn lint`
- [ ] **Fix any linting errors**
- [ ] **Run type check:** `npx tsc --noEmit`
- [ ] **Fix any type errors**
- [ ] **Test on Android:** `yarn android`
- [ ] **Test on iOS** (if available)

---

## 📝 Phase 9: Documentation & Cleanup

### 9.1 Code Comments

- [ ] **Add JSDoc comments** to:
  - [ ] `useUserLevel` hook
  - [ ] New onboarding screens
  - [ ] Upgrade card components
  - [ ] Verification flow components

### 9.2 Update README

- [ ] **Update** `README.md` or project docs:
  - [ ] Document new onboarding flow
  - [ ] Document user tiers (guest/member/pro)
  - [ ] Document upgrade paths

### 9.3 Cleanup

- [ ] **Remove** any unused code from old welcome screen
- [ ] **Remove** any temporary test code
- [ ] **Archive** old welcome screen if keeping for reference

---

## 🚨 Critical Notes

1. **DO NOT modify `useAuth` hook** - it stays as-is. Only use its exported functions.

2. **GraphQL Schema First** - Backend must add `emailVerified`, `phoneVerified`, `hasActiveSubscription` fields before client can fully work.

3. **Type Safety** - Use type assertions (`as any`) for user fields until GraphQL schema is updated, then remove after `yarn codegen`.

4. **Path Aliases** - Always use path aliases (`@hooks`, `@api`, `@state`, etc.) - never relative imports.

5. **NativeWind Styling** - Use Tailwind classes via `className`, not inline styles.

6. **Translations** - All user-facing text must be in translation files (English + Persian).

---

## ✅ Completion Checklist

- [ ] All Phase 0 items (GraphQL schema updates)
- [ ] All Phase 1 items (useUserLevel hook)
- [ ] All Phase 2 items (onboarding flow)
- [ ] All Phase 3 items (profile enhancements)
- [ ] All Phase 4 items (complete account flow)
- [ ] All Phase 5 items (subscription screen)
- [ ] All Phase 6 items (app boot flow)
- [ ] All Phase 7 items (UI/UX polish)
- [ ] All Phase 8 items (testing)
- [ ] All Phase 9 items (documentation)

---

## 🎯 Quick Start for Cursor

**Priority order for implementation:**

1. **Phase 0** (Backend) - Add GraphQL fields + mutations → `yarn codegen`
2. **Phase 1** - Create `useUserLevel` hook
3. **Phase 2.1** - Create onboarding route structure
4. **Phase 2.2** - Create welcome screen with 3 actions
5. **Phase 3** - Update profile with badges + upgrade cards
6. **Phase 4** - Create complete-account screen (can use placeholder mutations)
7. **Phase 5** - Update subscription screen
8. **Phase 6** - Update app boot flow
9. **Phase 7-9** - Polish, test, document

**Estimated time:** 2-3 days for full implementation (assuming backend is ready).

---

## 📚 Reference Files

- `ui/hooks/useAuth.ts` - Core auth hook (DO NOT MODIFY)
- `app/(auth)/welcome.tsx` - Current welcome screen (to be refactored)
- `app/(app)/(me)/index.tsx` - Profile screen (to be enhanced)
- `app/(app)/(me)/subscription.tsx` - Subscription screen (to be enhanced)
- `graphql/schema.graphql` - GraphQL schema (needs updates)
- `app/_layout.tsx` - Root layout (may need boot flow updates)

---

**Last Updated:** 2024-12-19
**Status:** Ready for implementation

