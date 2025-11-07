/**
 * Authentication hook for biometric authentication
 * 
 * Features:
 * - Key pair generation on registration (stored in Redux + AsyncStorage)
 * - Fingerprint validation for login (unlocks access to private key)
 * - Multi-device support (each device has its own key pair)
 * - JWT token and user data stored in Redux + AsyncStorage (no SecureStore)
 */

import { useState, useCallback } from 'react';
import {
  useCheckUsernameLazyQuery,
  useRequestChallengeMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
} from '@api';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { login as loginAction, setDeviceKeyPair } from '@store/slices/authSlice';
import { generateKeyPair, signMessage, generateDeviceId } from './crypto';
import { storeUserData } from '@api/utils';

// Ensure crypto.getRandomValues is available in RN
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('react-native-get-random-values');

// ============================================================================
// TYPES
// ============================================================================

export interface AuthResult {
  user?: {
    id: string;
    name: string;
    username: string;
    createdAt: string;
  };
  token?: string;
}

// Storage keys
const DEVICE_KEY_PAIR_KEY = '@safarnak_device_keypair';
const USERNAME_KEY = '@safarnak_username';

// ============================================================================
// useAuth Hook
// ============================================================================

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { deviceKeyPair } = useAppSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // GraphQL hooks (auto-generated)
  const [runCheckUsernameAvailability] = useCheckUsernameLazyQuery();
  const [requestChallengeMutation] = useRequestChallengeMutation();
  const [registerMutation] = useRegisterUserMutation();
  const [loginMutation] = useLoginUserMutation();

  // Load stored device key pair from AsyncStorage
  const loadDeviceKeyPair = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(DEVICE_KEY_PAIR_KEY);
      if (stored) {
        const keyPair = JSON.parse(stored);
        dispatch(setDeviceKeyPair(keyPair));
        return keyPair;
      }
    } catch (err: any) {
      console.error('[useAuth] Failed to load device key pair:', err);
    }
    return null;
  }, [dispatch]);

  // Load stored username from AsyncStorage
  const loadStoredUsername = useCallback(async (): Promise<string | null> => {
    try {
      const username = await AsyncStorage.getItem(USERNAME_KEY);
      setStoredUsername(username);
      return username;
    } catch (err: any) {
      console.error('[useAuth] Failed to load stored username:', err);
      return null;
    }
  }, []);

  // Check biometric availability
  const checkBiometrics = useCallback(async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      console.log('[useAuth] Biometric check:', {
        hasHardware,
        supportedTypes,
        isEnrolled,
      });

      return hasHardware && supportedTypes.length > 0 && isEnrolled;
    } catch (err: any) {
      console.error('[useAuth] Biometric check failed:', err);
      return false;
    }
  }, []);

  // Authenticate with biometrics (fingerprint/face ID)
  const authenticateWithBiometrics = useCallback(async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (err: any) {
      console.error('[useAuth] Biometric authentication failed:', err);
      return false;
    }
  }, []);

  // Sign message with private key (after biometric unlock)
  const signMessageWithBiometric = useCallback(
    async (message: string): Promise<string> => {
      // First, authenticate with biometrics
      const authenticated = await authenticateWithBiometrics();
      if (!authenticated) {
        throw new Error('Biometric authentication failed or cancelled');
      }

      // Get private key from Redux state
      const keyPair = deviceKeyPair;
      if (!keyPair || !keyPair.privateKey) {
        throw new Error(
          'Device key pair not found. Please register first or restore from storage.'
        );
      }

      // Sign the message
      return await signMessage(message, keyPair.privateKey);
    },
    [deviceKeyPair, authenticateWithBiometrics]
  );

  // Generate and store new key pair (Registration)
  const registerUser = useCallback(
    async (username: string): Promise<AuthResult | null> => {
      try {
        console.log('[useAuth] Starting registration for username:', username);

        if (!username) {
          throw new Error('Username required');
        }

        // Check if username is available
        const { data: availData } = await runCheckUsernameAvailability({
          variables: { username },
        });

        if (!availData?.checkUsernameAvailability) {
          throw new Error('Username is already taken');
        }

        const canUseBiometrics = await checkBiometrics();
        if (!canUseBiometrics) {
          throw new Error('Biometrics not available or not enrolled');
        }

        console.log('[useAuth] Username available, generating key pair...');

        // Generate device ID
        const deviceId = generateDeviceId();

        // Generate key pair
        const { publicKey, privateKey } = await generateKeyPair();

        // Get device information for logging
        const deviceInfo = {
          deviceId,
          modelName: Device.modelName,
          brand: Device.brand,
          osName: Device.osName,
        };
        console.log('[useAuth] Device info:', deviceInfo);

        // Request challenge from backend
        const { data: challengeData } = await requestChallengeMutation({
          variables: { username, isRegister: true },
        });

        const nonce = challengeData?.requestChallenge;
        if (!nonce) {
          throw new Error('Failed to get challenge from server');
        }

        console.log('[useAuth] Challenge received, authenticating with biometrics...');

        // Authenticate with biometrics before signing (required for registration)
        const authenticated = await authenticateWithBiometrics();
        if (!authenticated) {
          throw new Error('Biometric authentication failed or cancelled');
        }

        console.log('[useAuth] Biometric authentication successful, signing challenge...');

        // Sign the challenge with the new private key (after biometric authentication)
        const signature = await signMessage(nonce, privateKey);

        // Register user on backend (sends publicKey, server creates device entry)
        const { data: registerData } = await registerMutation({
          variables: { username, publicKey, signature, deviceId },
        });

        if (!registerData?.registerUser) {
          throw new Error('Registration failed');
        }

        const { user, token } = registerData.registerUser;

        // Store device key pair in Redux and AsyncStorage
        const keyPair = { publicKey, privateKey, deviceId };
        dispatch(setDeviceKeyPair(keyPair));
        await AsyncStorage.setItem(DEVICE_KEY_PAIR_KEY, JSON.stringify(keyPair));

        // Store username
        await AsyncStorage.setItem(USERNAME_KEY, username);

        // Store user data and token in AsyncStorage (via api/utils)
        await storeUserData(user, token);

        // Update Redux state
        dispatch(loginAction({ user, token, deviceKeyPair: keyPair }));

        setStoredUsername(username);
        setIsAuthenticated(true);
        setError(null);

        console.log('[useAuth] ✅ Registration successful!', {
          userId: user.id,
          username: user.username,
          deviceId,
        });

        return { user, token };
      } catch (err: any) {
        const errorMessage = err.message || 'Registration failed';
        console.error('[useAuth] Registration error:', errorMessage, err);
        setError(errorMessage);
        return null;
      }
    },
    [
      checkBiometrics,
      authenticateWithBiometrics,
      runCheckUsernameAvailability,
      requestChallengeMutation,
      registerMutation,
      dispatch,
    ]
  );

  // Login / Validate (Unlock and Sign Data)
  const loginAndValidate = useCallback(
    async (username: string): Promise<AuthResult | null> => {
      try {
        console.log('[useAuth] Starting login for username:', username);

        if (!username) {
          throw new Error('Username required');
        }

        const canUseBiometrics = await checkBiometrics();
        if (!canUseBiometrics) {
          throw new Error('Biometrics not available');
        }

        // Load device key pair if not in Redux
        let keyPair = deviceKeyPair;
        if (!keyPair) {
          keyPair = await loadDeviceKeyPair();
        }

        if (!keyPair || !keyPair.privateKey) {
          throw new Error(
            'Device key pair not found. Please register first or restore from storage.'
          );
        }

        // Request challenge from backend
        const { data: challengeData } = await requestChallengeMutation({
          variables: { username, isRegister: false },
        });

        const nonce = challengeData?.requestChallenge;
        if (!nonce) {
          throw new Error('Failed to get challenge from server');
        }

        console.log('[useAuth] Challenge received, authenticating with biometrics...');

        // Sign the nonce (this will trigger biometric authentication)
        const signature = await signMessageWithBiometric(nonce);

        // Login user on backend (server verifies signature and creates/updates device entry)
        // Send publicKey for new device login (server will check if device exists)
        const { data: loginData } = await loginMutation({
          variables: {
            username,
            signature,
            deviceId: keyPair.deviceId,
            publicKey: keyPair.publicKey, // Send publicKey for potential new device registration
          },
        });

        if (!loginData?.loginUser) {
          throw new Error('Login failed');
        }

        const { user, token } = loginData.loginUser;

        // Store user data and token in AsyncStorage (via api/utils)
        await storeUserData(user, token);

        // Store username
        await AsyncStorage.setItem(USERNAME_KEY, username);

        // Update Redux state
        dispatch(loginAction({ user, token, deviceKeyPair: keyPair }));

        setStoredUsername(username);
        setIsAuthenticated(true);
        setError(null);

        console.log('[useAuth] ✅ Login successful!', {
          userId: user.id,
          username: user.username,
          deviceId: keyPair.deviceId,
        });

        return { user, token };
      } catch (err: any) {
        const errorMessage = err.message || 'Login failed';
        console.error('[useAuth] Login error:', errorMessage, err);
        setError(errorMessage);
        return null;
      }
    },
    [
      checkBiometrics,
      deviceKeyPair,
      loadDeviceKeyPair,
      requestChallengeMutation,
      loginMutation,
      signMessageWithBiometric,
      dispatch,
    ]
  );

  // Logout / Cancel
  const logout = useCallback(async () => {
    try {
      console.log('[useAuth] Logging out...');
      await LocalAuthentication.cancelAuthenticate();
      // Note: We keep device key pair and username for re-login
      // Only clear token and user data (handled by Redux logout action)
      setIsAuthenticated(false);
      setStoredUsername(null);
      // Note: Redux logout is handled by the logout action in authSlice
      console.log('[useAuth] Logout successful');
    } catch (err: any) {
      console.error('[useAuth] Logout error:', err);
    }
  }, []);

  // Clear all stored data (for testing/reset)
  const clearStoredData = useCallback(async () => {
    try {
      console.log('[useAuth] Clearing all stored data...');
      await AsyncStorage.removeItem(USERNAME_KEY);
      await AsyncStorage.removeItem(DEVICE_KEY_PAIR_KEY);
      setStoredUsername(null);
      setIsAuthenticated(false);
      setError(null);
      // Note: Redux state is cleared by logout action
      console.log('[useAuth] All stored data cleared');
    } catch (err: any) {
      console.error('[useAuth] Failed to clear stored data:', err);
    }
  }, []);

  return {
    isAuthenticated,
    storedUsername,
    error,
    registerUser,
    loginAndValidate,
    logout,
    checkBiometrics,
    loadStoredUsername,
    loadDeviceKeyPair,
    clearStoredData,
  };
};
