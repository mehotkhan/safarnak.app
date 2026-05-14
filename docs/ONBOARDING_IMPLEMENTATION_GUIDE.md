# Onboarding Implementation Guide - Quick Reference

This guide provides concrete code examples for implementing the onboarding redesign. Use this alongside `ONBOARDING_REDESIGN_CHECKLIST.md`.

---

## 1. useUserLevel Hook Implementation

**File:** `ui/hooks/useUserLevel.ts`

```typescript
import { useAppSelector } from '@state/hooks';

export type UserLevel = 'guest' | 'member' | 'pro';

/**
 * Derives user tier level from Redux auth state
 * - pro: Has active subscription
 * - member: Email and phone verified
 * - guest: Default (no verification or subscription)
 */
export const useUserLevel = (): UserLevel => {
  const user = useAppSelector((state) => state.auth.user);
  
  if (!user) return 'guest';
  
  // Type assertion needed until GraphQL schema includes these fields
  const userWithTiers = user as any;
  
  if (userWithTiers?.hasActiveSubscription) return 'pro';
  if (userWithTiers?.emailVerified && userWithTiers?.phoneVerified) return 'member';
  return 'guest';
};
```

---

## 2. Onboarding Welcome Screen Structure

**File:** `app/(auth)/onboarding/welcome.tsx`

```typescript
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { loadStoredUsername, registerUser, loginAndValidate } = useAuth();
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const existing = await loadStoredUsername();
      setStoredUsername(existing);
    })();
  }, [loadStoredUsername]);

  const generateRandomUsername = (): string => {
    const prefix = 'traveler';
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${random}`;
  };

  const handleStartWithAITrip = async () => {
    if (storedUsername) {
      // Existing user - login and go to AI trip wizard
      setLoading(true);
      const result = await loginAndValidate(storedUsername);
      setLoading(false);
      if (result) {
        router.replace('/(app)/(trips)/new' as any);
      }
    } else {
      // New user - show dialog
      Alert.alert(
        t('onboarding.welcome.chooseUsername') || 'Choose Username',
        t('onboarding.welcome.chooseUsernameMessage') || 'How would you like to proceed?',
        [
          {
            text: t('onboarding.welcome.autoGenerate') || 'Let Safarnak choose',
            onPress: async () => {
              setLoading(true);
              const randomUsername = generateRandomUsername();
              const result = await registerUser(randomUsername);
              setLoading(false);
              if (result) {
                router.replace('/(app)/(trips)/new' as any);
              }
            },
          },
          {
            text: t('onboarding.welcome.chooseMyself') || 'Let me pick',
            onPress: () => router.push('/(auth)/auth-username' as any),
          },
          { text: t('common.cancel') || 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleJustLookAround = async () => {
    setLoading(true);
    const randomUsername = generateRandomUsername();
    const result = await registerUser(randomUsername);
    setLoading(false);
    if (result) {
      router.replace('/(app)/(home)' as any);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Logo + Tagline */}
      <View className="items-center pt-20 pb-8">
        <CustomText weight="bold" className="text-3xl text-black dark:text-white mb-2">
          {t('onboarding.welcome.title') || 'Welcome to Safarnak'}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center px-6">
          {t('onboarding.welcome.subtitle') || 'Plan your perfect trip with AI'}
        </CustomText>
      </View>

      {/* Hero Card - Sample AI Trip Preview */}
      <View className="px-6 mb-8">
        <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
          <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
            {t('onboarding.welcome.heroTitle') || 'AI-Powered Trip Planning'}
          </CustomText>
          <CustomText className="text-sm text-gray-700 dark:text-gray-300">
            {t('onboarding.welcome.heroDescription') || 'Tell us where you want to go, and we\'ll create a personalized itinerary for you.'}
          </CustomText>
        </View>
      </View>

      {/* Value Props */}
      <View className="px-6 mb-8">
        <View className="flex-row justify-around">
          {/* AI Card */}
          <View className="items-center flex-1">
            <CustomText weight="bold" className="text-sm text-black dark:text-white mb-1">
              {t('onboarding.welcome.ai') || 'AI Planning'}
            </CustomText>
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {t('onboarding.welcome.aiDesc') || 'Smart itineraries'}
            </CustomText>
          </View>
          {/* Social Card */}
          <View className="items-center flex-1">
            <CustomText weight="bold" className="text-sm text-black dark:text-white mb-1">
              {t('onboarding.welcome.social') || 'Social'}
            </CustomText>
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {t('onboarding.welcome.socialDesc') || 'Share trips'}
            </CustomText>
          </View>
          {/* Offline Card */}
          <View className="items-center flex-1">
            <CustomText weight="bold" className="text-sm text-black dark:text-white mb-1">
              {t('onboarding.welcome.offline') || 'Offline'}
            </CustomText>
            <CustomText className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {t('onboarding.welcome.offlineDesc') || 'Works offline'}
            </CustomText>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="px-6 flex-1 justify-end pb-8">
        <CustomButton
          title={t('onboarding.welcome.startAITrip') || 'Start with AI Trip'}
          onPress={handleStartWithAITrip}
          loading={loading}
          className="mb-4"
        />
        <CustomButton
          title={t('onboarding.welcome.justLookAround') || 'Just look around'}
          onPress={handleJustLookAround}
          loading={loading}
          variant="outline"
          className="mb-4"
        />
        <TouchableOpacity
          onPress={() => router.push('/(auth)/auth-username' as any)}
          className="items-center py-3"
        >
          <CustomText className="text-sm text-primary">
            {t('onboarding.welcome.haveUsername') || 'I already have a username'}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

## 3. Username Entry Screen

**File:** `app/(auth)/auth-username.tsx`

```typescript
import { useState } from 'react';
import { View, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { InputField } from '@ui/forms';

export default function AuthUsernameScreen() {
  const { t } = useTranslation();
  const { loginAndValidate, error: authError } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!username.trim()) {
      Alert.alert(
        t('auth.username.error') || 'Error',
        t('auth.username.usernameRequired') || 'Username is required'
      );
      return;
    }

    setLoading(true);
    const result = await loginAndValidate(username.trim());
    setLoading(false);

    if (result) {
      router.replace('/(app)/(home)' as any);
    } else if (authError) {
      Alert.alert(
        t('auth.username.error') || 'Error',
        authError
      );
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center px-6">
      <View className="mb-8">
        <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-2">
          {t('auth.username.title') || 'Login with your Safarnak username'}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400">
          {t('auth.username.subtitle') || 'Enter your username to continue'}
        </CustomText>
      </View>

      <InputField
        label={t('auth.username.label') || 'Username'}
        value={username}
        onChangeText={setUsername}
        placeholder={t('auth.username.placeholder') || 'Enter your username'}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={handleContinue}
        editable={!loading}
      />

      {authError && (
        <View className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          <CustomText className="text-sm text-red-600 dark:text-red-400">
            {authError}
          </CustomText>
        </View>
      )}

      <CustomButton
        title={t('auth.username.continue') || 'Continue'}
        onPress={handleContinue}
        loading={loading}
        disabled={!username.trim() || loading}
        className="mt-6"
      />
    </View>
  );
}
```

---

## 4. Profile Header with User Level Badge

**File:** `app/(app)/(me)/index.tsx` (additions to existing file)

```typescript
import { useUserLevel } from '@hooks/useUserLevel';

// Inside component:
const userLevel = useUserLevel();

// In profile header section (after username):
<View className="flex-row items-center justify-center mb-2">
  <CustomText className="text-base text-gray-600 dark:text-gray-400 mr-2">
    @{user?.username || 'guest'}
  </CustomText>
  {/* User Level Badge */}
  <View
    className={`px-2 py-1 rounded-full ${
      userLevel === 'pro'
        ? 'bg-yellow-500/20 border border-yellow-500/50'
        : userLevel === 'member'
        ? 'bg-primary/20 border border-primary/50'
        : 'bg-gray-200 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600'
    }`}
  >
    <CustomText
      className={`text-xs font-semibold ${
        userLevel === 'pro'
          ? 'text-yellow-700 dark:text-yellow-400'
          : userLevel === 'member'
          ? 'text-primary'
          : 'text-gray-600 dark:text-gray-400'
      }`}
    >
      {userLevel === 'pro'
        ? t('profile.tiers.pro') || 'Pro'
        : userLevel === 'member'
        ? t('profile.tiers.member') || 'Member'
        : t('profile.tiers.guest') || 'Guest'}
    </CustomText>
  </View>
</View>
```

---

## 5. Upgrade Cards Component

**File:** `app/(app)/(me)/index.tsx` (additions to existing file)

```typescript
// After profile header, before stats row:

{/* Guest → Member Upgrade Card */}
{userLevel === 'guest' && (
  <View className="mx-6 mb-4 bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
    <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
      {t('profile.upgrade.guestToMember.title') || 'Complete your account'}
    </CustomText>
    <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-4">
      {t('profile.upgrade.guestToMember.description') || 
        'Add phone and email to protect your trips and enable notifications.'}
    </CustomText>
    <TouchableOpacity
      onPress={() => router.push('/(app)/(me)/complete-account' as any)}
      className="bg-primary rounded-lg py-3 px-4 items-center"
      activeOpacity={0.7}
    >
      <CustomText className="text-white font-semibold">
        {t('profile.upgrade.guestToMember.button') || 'Complete profile'}
      </CustomText>
    </TouchableOpacity>
  </View>
)}

{/* Member → Pro Upgrade Card */}
{userLevel === 'member' && (
  <View className="mx-6 mb-4 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
    <CustomText weight="bold" className="text-lg text-black dark:text-white mb-2">
      {t('profile.upgrade.memberToPro.title') || 'Upgrade to Safarnak Pro'}
    </CustomText>
    <CustomText className="text-sm text-gray-700 dark:text-gray-300 mb-4">
      {t('profile.upgrade.memberToPro.description') || 
        'Get more AI planning, priority features, and more.'}
    </CustomText>
    <TouchableOpacity
      onPress={() => router.push('/(app)/(me)/subscription' as any)}
      className="bg-yellow-500 rounded-lg py-3 px-4 items-center"
      activeOpacity={0.7}
    >
      <CustomText className="text-white font-semibold">
        {t('profile.upgrade.memberToPro.button') || 'See plans'}
      </CustomText>
    </TouchableOpacity>
  </View>
)}
```

---

## 6. Complete Account Screen (Phone + Email Verification)

**File:** `app/(app)/(me)/complete-account.tsx`

```typescript
import { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMeQuery } from '@api';
import { CustomText } from '@ui/display';
import { CustomButton } from '@ui/forms';
import { InputField } from '@ui/forms';
import { Ionicons } from '@expo/vector-icons';

type VerificationStep = 'phone' | 'email' | 'complete';

export default function CompleteAccountScreen() {
  const { t } = useTranslation();
  const { refetch: refetchMe } = useMeQuery();
  
  const [step, setStep] = useState<VerificationStep>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with actual GraphQL mutations after schema update
  const handleSendPhoneCode = async () => {
    if (!phone.trim()) {
      Alert.alert(t('profile.completeAccount.error') || 'Error', 
        t('profile.completeAccount.phoneRequired') || 'Phone number is required');
      return;
    }
    setLoading(true);
    // TODO: Call requestPhoneVerification mutation
    // await requestPhoneVerificationMutation({ variables: { phone } });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setPhoneCodeSent(true);
    setLoading(false);
    Alert.alert(t('profile.completeAccount.success') || 'Success',
      t('profile.completeAccount.phoneCodeSent') || 'Verification code sent to your phone');
  };

  const handleVerifyPhone = async () => {
    if (!phoneCode.trim()) {
      Alert.alert(t('profile.completeAccount.error') || 'Error',
        t('profile.completeAccount.codeRequired') || 'Verification code is required');
      return;
    }
    setLoading(true);
    // TODO: Call verifyPhone mutation
    // await verifyPhoneMutation({ variables: { code: phoneCode } });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setLoading(false);
    setStep('email');
    Alert.alert(t('profile.completeAccount.success') || 'Success',
      t('profile.completeAccount.phoneVerified') || 'Phone verified! Now verify your email.');
  };

  const handleSendEmailCode = async () => {
    if (!email.trim()) {
      Alert.alert(t('profile.completeAccount.error') || 'Error',
        t('profile.completeAccount.emailRequired') || 'Email is required');
      return;
    }
    setLoading(true);
    // TODO: Call requestEmailVerification mutation
    // await requestEmailVerificationMutation({ variables: { email } });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setEmailCodeSent(true);
    setLoading(false);
    Alert.alert(t('profile.completeAccount.success') || 'Success',
      t('profile.completeAccount.emailCodeSent') || 'Verification code sent to your email');
  };

  const handleVerifyEmail = async () => {
    if (!emailCode.trim()) {
      Alert.alert(t('profile.completeAccount.error') || 'Error',
        t('profile.completeAccount.codeRequired') || 'Verification code is required');
      return;
    }
    setLoading(true);
    // TODO: Call verifyEmail mutation
    // await verifyEmailMutation({ variables: { code: emailCode } });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setLoading(false);
    setStep('complete');
    await refetchMe(); // Update Redux/Apollo cache
    Alert.alert(
      t('profile.completeAccount.success') || 'Success',
      t('profile.completeAccount.allVerified') || 'Account complete! You are now a Member.',
      [{ text: t('common.ok') || 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-8">
        <CustomText weight="bold" className="text-2xl text-black dark:text-white mb-2">
          {t('profile.completeAccount.title') || 'Complete your Safarnak account'}
        </CustomText>
        <CustomText className="text-base text-gray-600 dark:text-gray-400 mb-8">
          {t('profile.completeAccount.subtitle') || 
            'Add and verify your phone and email to secure your account and enable notifications.'}
        </CustomText>

        {/* Progress Indicator */}
        <View className="flex-row items-center mb-8">
          <View className={`flex-1 h-1 ${step === 'phone' || step === 'email' || step === 'complete' ? 'bg-primary' : 'bg-gray-300'}`} />
          <View className="mx-2 w-8 h-8 rounded-full bg-primary items-center justify-center">
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View className={`flex-1 h-1 ${step === 'email' || step === 'complete' ? 'bg-primary' : 'bg-gray-300'}`} />
          <View className={`mx-2 w-8 h-8 rounded-full items-center justify-center ${
            step === 'email' || step === 'complete' ? 'bg-primary' : 'bg-gray-300'
          }`}>
            {step === 'complete' ? (
              <Ionicons name="checkmark" size={16} color="#fff" />
            ) : (
              <CustomText className="text-white text-xs">2</CustomText>
            )}
          </View>
          <View className={`flex-1 h-1 ${step === 'complete' ? 'bg-primary' : 'bg-gray-300'}`} />
        </View>

        {/* Step 1: Phone Verification */}
        {step === 'phone' && (
          <View>
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-4">
              {t('profile.completeAccount.step1') || 'Step 1: Verify Phone'}
            </CustomText>
            <InputField
              label={t('profile.completeAccount.phoneLabel') || 'Phone Number'}
              value={phone}
              onChangeText={setPhone}
              placeholder={t('profile.completeAccount.phonePlaceholder') || '+1 (555) 123-4567'}
              keyboardType="phone-pad"
              editable={!loading && !phoneCodeSent}
            />
            {!phoneCodeSent ? (
              <CustomButton
                title={t('profile.completeAccount.sendPhoneCode') || 'Send verification code'}
                onPress={handleSendPhoneCode}
                loading={loading}
                className="mt-4"
              />
            ) : (
              <>
                <InputField
                  label={t('profile.completeAccount.phoneCodeLabel') || 'Verification Code'}
                  value={phoneCode}
                  onChangeText={setPhoneCode}
                  placeholder={t('profile.completeAccount.codePlaceholder') || 'Enter code'}
                  keyboardType="number-pad"
                  editable={!loading}
                  className="mt-4"
                />
                <CustomButton
                  title={t('profile.completeAccount.verifyPhone') || 'Verify Phone'}
                  onPress={handleVerifyPhone}
                  loading={loading}
                  className="mt-4"
                />
              </>
            )}
          </View>
        )}

        {/* Step 2: Email Verification */}
        {step === 'email' && (
          <View>
            <CustomText weight="bold" className="text-lg text-black dark:text-white mb-4">
              {t('profile.completeAccount.step2') || 'Step 2: Verify Email'}
            </CustomText>
            <InputField
              label={t('profile.completeAccount.emailLabel') || 'Email Address'}
              value={email}
              onChangeText={setEmail}
              placeholder={t('profile.completeAccount.emailPlaceholder') || 'your@email.com'}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading && !emailCodeSent}
            />
            {!emailCodeSent ? (
              <CustomButton
                title={t('profile.completeAccount.sendEmailCode') || 'Send verification code'}
                onPress={handleSendEmailCode}
                loading={loading}
                className="mt-4"
              />
            ) : (
              <>
                <InputField
                  label={t('profile.completeAccount.emailCodeLabel') || 'Verification Code'}
                  value={emailCode}
                  onChangeText={setEmailCode}
                  placeholder={t('profile.completeAccount.codePlaceholder') || 'Enter code'}
                  keyboardType="default"
                  editable={!loading}
                  className="mt-4"
                />
                <CustomButton
                  title={t('profile.completeAccount.verifyEmail') || 'Verify Email'}
                  onPress={handleVerifyEmail}
                  loading={loading}
                  className="mt-4"
                />
              </>
            )}
          </View>
        )}

        {/* Complete State */}
        {step === 'complete' && (
          <View className="items-center py-8">
            <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            <CustomText weight="bold" className="text-xl text-black dark:text-white mt-4 mb-2">
              {t('profile.completeAccount.completeTitle') || 'Account Complete!'}
            </CustomText>
            <CustomText className="text-base text-gray-600 dark:text-gray-400 text-center">
              {t('profile.completeAccount.completeMessage') || 
                'You are now a Safarnak Member. Enjoy enhanced features!'}
            </CustomText>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
```

---

## 7. Update Auth Layout

**File:** `app/(auth)/_layout.tsx`

```typescript
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name='onboarding' options={{ headerShown: false }} />
      <Stack.Screen name='auth-username' options={{ headerShown: false }} />
      <Stack.Screen name='login' options={{ headerShown: false }} />
      <Stack.Screen name='register' options={{ headerShown: false }} />
    </Stack>
  );
}
```

---

## 8. Update Profile Layout

**File:** `app/(app)/(me)/_layout.tsx` (add to existing Stack)

```typescript
<Stack.Screen
  name="complete-account"
  options={{
    title: t('profile.completeAccount.title') || 'Complete Account',
  }}
/>
```

---

## 9. Translation Keys Reference

Add these to `locales/en/translation.json` and `locales/fa/translation.json`:

```json
{
  "onboarding": {
    "welcome": {
      "title": "Welcome to Safarnak",
      "subtitle": "Plan your perfect trip with AI",
      "heroTitle": "AI-Powered Trip Planning",
      "heroDescription": "Tell us where you want to go, and we'll create a personalized itinerary for you.",
      "ai": "AI Planning",
      "aiDesc": "Smart itineraries",
      "social": "Social",
      "socialDesc": "Share trips",
      "offline": "Offline",
      "offlineDesc": "Works offline",
      "startAITrip": "Start with AI Trip",
      "justLookAround": "Just look around",
      "haveUsername": "I already have a username",
      "chooseUsername": "Choose Username",
      "chooseUsernameMessage": "How would you like to proceed?",
      "autoGenerate": "Let Safarnak choose",
      "chooseMyself": "Let me pick"
    }
  },
  "auth": {
    "username": {
      "title": "Login with your Safarnak username",
      "subtitle": "Enter your username to continue",
      "label": "Username",
      "placeholder": "Enter your username",
      "continue": "Continue",
      "error": "Error",
      "usernameRequired": "Username is required"
    }
  },
  "profile": {
    "tiers": {
      "guest": "Guest",
      "member": "Member",
      "pro": "Pro"
    },
    "upgrade": {
      "guestToMember": {
        "title": "Complete your account",
        "description": "Add phone and email to protect your trips and enable notifications.",
        "button": "Complete profile"
      },
      "memberToPro": {
        "title": "Upgrade to Safarnak Pro",
        "description": "Get more AI planning, priority features, and more.",
        "button": "See plans"
      }
    },
    "completeAccount": {
      "title": "Complete your Safarnak account",
      "subtitle": "Add and verify your phone and email to secure your account and enable notifications.",
      "step1": "Step 1: Verify Phone",
      "step2": "Step 2: Verify Email",
      "phoneLabel": "Phone Number",
      "phonePlaceholder": "+1 (555) 123-4567",
      "phoneCodeLabel": "Verification Code",
      "emailLabel": "Email Address",
      "emailPlaceholder": "your@email.com",
      "emailCodeLabel": "Verification Code",
      "codePlaceholder": "Enter code",
      "sendPhoneCode": "Send verification code",
      "sendEmailCode": "Send verification code",
      "verifyPhone": "Verify Phone",
      "verifyEmail": "Verify Email",
      "phoneCodeSent": "Verification code sent to your phone",
      "emailCodeSent": "Verification code sent to your email",
      "phoneVerified": "Phone verified! Now verify your email.",
      "allVerified": "Account complete! You are now a Member.",
      "completeTitle": "Account Complete!",
      "completeMessage": "You are now a Safarnak Member. Enjoy enhanced features!",
      "error": "Error",
      "phoneRequired": "Phone number is required",
      "emailRequired": "Email is required",
      "codeRequired": "Verification code is required",
      "success": "Success"
    }
  }
}
```

---

## Notes

1. **GraphQL Mutations**: Replace TODO comments with actual mutation calls after schema is updated and `yarn codegen` is run.

2. **Type Safety**: Remove `as any` type assertions after GraphQL schema includes `emailVerified`, `phoneVerified`, `hasActiveSubscription`.

3. **Error Handling**: Add proper error handling for network failures, invalid codes, etc.

4. **Loading States**: All async operations should show loading indicators.

5. **Navigation**: Use `router.replace()` for auth flows (no back button), `router.push()` for profile flows (allows back).

---

**Last Updated:** 2024-12-19

