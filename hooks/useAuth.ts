import { useState, useCallback } from 'react';
import {
  useCheckUsernameLazyQuery,
  useRequestChallengeMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
} from '@api';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { ethers } from 'ethers';
import QuickCrypto from 'react-native-quick-crypto';
// Ensure crypto.getRandomValues is available in RN
// Safe to import multiple times; no-ops after first
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('react-native-get-random-values');

// GraphQL operations are imported from auto-generated hooks

// ============================================================================
// TYPES
// ============================================================================

export interface AuthResult {
  publicKey?: string;
  username?: string;
  signature?: string;
  recoveredAddress?: string;
  user?: {
    id: string;
    name: string;
    username: string;
    createdAt: string;
  };
  token?: string;
}

// ============================================================================
// useAuth Hook
// ============================================================================

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // GraphQL hooks (auto-generated)
  const [runCheckUsernameAvailability] = useCheckUsernameLazyQuery();
  const [requestChallengeMutation] = useRequestChallengeMutation();
  const [registerMutation] = useRegisterUserMutation();
  const [loginMutation] = useLoginUserMutation();

  // Load stored username on init
  const loadStoredUsername = useCallback(async (): Promise<string | null> => {
    try {
      const username = await SecureStore.getItemAsync('username');
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
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
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

  // Sign message with private key (biometric unlocked)
  const signMessage = useCallback(async (message: string): Promise<string> => {
    const authResult = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to sign',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });

    if (!authResult.success) {
      throw new Error(`Authentication failed: ${authResult.error}`);
    }

    const privateKey = await SecureStore.getItemAsync('privateKey', {
      requireAuthentication: true,
      authenticationPrompt: 'Access keys',
    });

    if (!privateKey) {
      throw new Error('No private key found');
    }

    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);

    // Sign the message directly (ethers.signMessage handles hashing internally)
    const signature = await wallet.signMessage(message);

    console.log('[useAuth] Signed message:', {
      message: message.substring(0, 16) + '...',
      signature: signature.substring(0, 16) + '...',
      walletAddress: wallet.address,
    });

    return signature;
  }, []);

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

        // Get device information for logging
        const deviceInfo = {
          modelName: Device.modelName,
          brand: Device.brand,
          osName: Device.osName,
        };
        console.log('[useAuth] Device info:', deviceInfo);

        // Create a cryptographically secure random wallet compatible with RN
        // Use react-native-quick-crypto to generate 32 random bytes for private key
        const toHex = (bytes: Uint8Array) =>
          '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

        let wallet: ethers.Wallet | null = null;
        for (let attempt = 0; attempt < 5; attempt++) {
          const rand = QuickCrypto.randomBytes(32);
          try {
            const candidate = new ethers.Wallet(toHex(rand));
            wallet = candidate;
            break;
          } catch {
            // Try again if invalid key (extremely rare)
          }
        }
        if (!wallet) {
          throw new Error('Failed to generate secure key. Please try again.');
        }
        const privateKey = wallet.privateKey;
        const publicKeyAddress = wallet.address;

        console.log('[useAuth] Generated wallet address:', publicKeyAddress);

        // Store private key securely with biometric protection
        const authResult = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Enroll biometrics for registration',
          fallbackLabel: 'Use Passcode',
          disableDeviceFallback: false,
        });

        if (!authResult.success) {
          throw new Error(`Enrollment failed: ${authResult.error}`);
        }

        await SecureStore.setItemAsync('privateKey', privateKey, {
          requireAuthentication: true,
          authenticationPrompt: 'Authenticate to store keys',
        });

        console.log('[useAuth] Private key stored securely');

        // Request challenge from backend
        const { data: challengeData } = await requestChallengeMutation({
          variables: { username, isRegister: true },
        });

        const nonce = challengeData?.requestChallenge;
        if (!nonce) {
          throw new Error('Failed to get challenge from server');
        }

        console.log('[useAuth] Challenge received, signing...');

        // Sign the nonce
        const signature = await signMessage(nonce);

        // Register user on backend
        const { data: regData } = await registerMutation({
          variables: { username, publicKey: publicKeyAddress, signature },
        });

        if (!regData?.registerUser) {
          throw new Error('Registration failed');
        }

        const { user, token } = regData.registerUser;

        // Store JWT token and username
        await SecureStore.setItemAsync('jwtToken', token);
        await SecureStore.setItemAsync('username', username);

        setStoredUsername(username);
        setPublicKey(publicKeyAddress);
        setIsAuthenticated(true);
        setError(null);

        console.log('[useAuth] ✅ Registration successful!', {
          userId: user.id,
          username: user.username,
          publicKey: publicKeyAddress,
        });

        return { publicKey: publicKeyAddress, username, user, token };
      } catch (err: any) {
        const errorMessage = err.message || 'Registration failed';
        console.error('[useAuth] Registration error:', errorMessage, err);
        setError(errorMessage);
        return null;
      }
    },
    [checkBiometrics, runCheckUsernameAvailability, requestChallengeMutation, registerMutation, signMessage]
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

        // Request challenge from backend
        const { data: challengeData } = await requestChallengeMutation({
          variables: { username, isRegister: false },
        });

        const nonce = challengeData?.requestChallenge;
        if (!nonce) {
          throw new Error('Failed to get challenge from server');
        }

        console.log('[useAuth] Challenge received, signing...');

        // Sign the nonce
        const signature = await signMessage(nonce);

        // Login user on backend
        const { data: loginData } = await loginMutation({
          variables: { username, signature },
        });

        if (!loginData?.loginUser) {
          throw new Error('Login failed');
        }

        const { user, token } = loginData.loginUser;

        // Store JWT token
        await SecureStore.setItemAsync('jwtToken', token);

        setIsAuthenticated(true);
        setError(null);

        console.log('[useAuth] ✅ Login successful!', {
          userId: user.id,
          username: user.username,
        });

        return { signature, user, token };
      } catch (err: any) {
        const errorMessage = err.message || 'Login failed';
        console.error('[useAuth] Login error:', errorMessage, err);
        setError(errorMessage);
        return null;
      }
    },
    [checkBiometrics, requestChallengeMutation, loginMutation, signMessage]
  );

  // Logout / Cancel
  const logout = useCallback(async () => {
    try {
      console.log('[useAuth] Logging out...');
      await LocalAuthentication.cancelAuthenticate();
      await SecureStore.deleteItemAsync('jwtToken');
      setIsAuthenticated(false);
      setPublicKey(null);
      console.log('[useAuth] Logout successful');
    } catch (err: any) {
      console.error('[useAuth] Logout error:', err);
    }
  }, []);

  // Clear all stored data (for testing/reset)
  const clearStoredData = useCallback(async () => {
    try {
      console.log('[useAuth] Clearing all stored data...');
      await SecureStore.deleteItemAsync('username');
      await SecureStore.deleteItemAsync('privateKey');
      await SecureStore.deleteItemAsync('jwtToken');
      setStoredUsername(null);
      setPublicKey(null);
      setIsAuthenticated(false);
      setError(null);
      console.log('[useAuth] All stored data cleared');
    } catch (err: any) {
      console.error('[useAuth] Failed to clear stored data:', err);
    }
  }, []);

  return {
    isAuthenticated,
    storedUsername,
    publicKey,
    error,
    registerUser,
    loginAndValidate,
    logout,
    checkBiometrics,
    loadStoredUsername,
    clearStoredData,
  };
};
