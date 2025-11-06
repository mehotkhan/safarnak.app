/**
 * Cryptographic utilities for biometric authentication
 * Handles signature verification for challenge-response auth
 */

import { ethers } from 'ethers';

/**
 * Generate a random nonce for challenge-response authentication
 */
export function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify signature against message and public key (wallet address)
 * Uses ethers.js for Ethereum-style signature verification
 * 
 * @param message - The message that was signed (typically the nonce)
 * @param signature - The signature to verify
 * @param publicKey - The wallet address (public key)
 * @returns true if signature is valid
 */
export function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // Compare recovered address with expected public key (case-insensitive)
    const isValid = recoveredAddress.toLowerCase() === publicKey.toLowerCase();
    
    console.log('[Crypto] Signature verification:', {
      message: message.substring(0, 16) + '...',
      signature: signature.substring(0, 16) + '...',
      expectedAddress: publicKey,
      recoveredAddress,
      isValid,
    });
    
    return isValid;
  } catch (error) {
    console.error('[Crypto] Signature verification failed:', error);
    return false;
  }
}

/**
 * Hash a message using SHA-256
 * Used for creating message hashes before signing
 */
export async function hashMessage(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

