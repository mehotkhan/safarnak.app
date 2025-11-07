/**
 * Client-side cryptographic utilities for biometric authentication
 * Uses react-native-quick-crypto for key pair generation and signing
 * 
 * Key pair format: ECDSA P-256 (ES256)
 * - Public key: JWK format (JSON Web Key)
 * - Private key: JWK format (stored in Redux + AsyncStorage)
 * - Signatures: Base64-encoded DER format
 */

import QuickCrypto from 'react-native-quick-crypto';

// Polyfill Buffer for react-native-quick-crypto
// react-native-quick-crypto requires Buffer to be available globally
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (typeof global.Buffer === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.Buffer = require('buffer').Buffer;
}

// Ensure crypto.getRandomValues is available
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('react-native-get-random-values');

/**
 * Generate a new ECDSA P-256 key pair for device authentication
 * @returns Promise resolving to { publicKey: string, privateKey: string }
 *          where both keys are in JWK (JSON Web Key) format as JSON strings
 */
export async function generateKeyPair(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  try {
    // Generate ECDSA P-256 key pair
    const keyPair = await QuickCrypto.webcrypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256', // secp256r1
      },
      true, // extractable
      ['sign', 'verify'] // key usages
    );

    // Type assertion: generateKey returns CryptoKeyPair for ECDSA
    // react-native-quick-crypto has its own CryptoKey type, so we use any to avoid type conflicts
    const { publicKey, privateKey } = keyPair as any;

    // Export keys to JWK format (JSON Web Key)
    const publicKeyJwk = (await QuickCrypto.webcrypto.subtle.exportKey(
      'jwk',
      publicKey as any
    )) as any; // Type assertion: exportKey returns JWK for 'jwk' format
    const privateKeyJwk = (await QuickCrypto.webcrypto.subtle.exportKey(
      'jwk',
      privateKey as any
    )) as any; // Type assertion: exportKey returns JWK for 'jwk' format

    // Log the exported JWK for debugging
    console.log('[crypto] Exported public key JWK:', JSON.stringify(publicKeyJwk, null, 2));

    // Sanitize public key JWK - ensure it only contains public key fields
    // ECDSA P-256 public key should have: kty, crv, x, y
    // Also fix base64url encoding issues (remove trailing periods)
    let x = String(publicKeyJwk.x || '').trim();
    let y = String(publicKeyJwk.y || '').trim();
    
    // Remove trailing periods (invalid in base64url)
    if (x.endsWith('.')) {
      x = x.slice(0, -1);
    }
    if (y.endsWith('.')) {
      y = y.slice(0, -1);
    }

    const sanitizedPublicKeyJwk = {
      kty: String(publicKeyJwk.kty || ''),
      crv: String(publicKeyJwk.crv || ''),
      x: x,
      y: y,
    };

    // Strict validation: all fields must be non-empty strings
    if (typeof sanitizedPublicKeyJwk.kty !== 'string' || sanitizedPublicKeyJwk.kty.length === 0) {
      console.error('[crypto] Invalid public key JWK: kty must be a non-empty string', {
        original: publicKeyJwk,
        sanitized: sanitizedPublicKeyJwk,
      });
      throw new Error('Failed to export public key: invalid kty field');
    }
    if (typeof sanitizedPublicKeyJwk.crv !== 'string' || sanitizedPublicKeyJwk.crv.length === 0) {
      console.error('[crypto] Invalid public key JWK: crv must be a non-empty string', {
        original: publicKeyJwk,
        sanitized: sanitizedPublicKeyJwk,
      });
      throw new Error('Failed to export public key: invalid crv field');
    }
    if (typeof sanitizedPublicKeyJwk.x !== 'string' || sanitizedPublicKeyJwk.x.length === 0) {
      console.error('[crypto] Invalid public key JWK: x coordinate must be a non-empty string', {
        original: publicKeyJwk,
        sanitized: sanitizedPublicKeyJwk,
        xType: typeof sanitizedPublicKeyJwk.x,
        xValue: sanitizedPublicKeyJwk.x,
      });
      throw new Error('Failed to export public key: invalid x coordinate');
    }
    if (typeof sanitizedPublicKeyJwk.y !== 'string' || sanitizedPublicKeyJwk.y.length === 0) {
      console.error('[crypto] Invalid public key JWK: y coordinate must be a non-empty string', {
        original: publicKeyJwk,
        sanitized: sanitizedPublicKeyJwk,
        yType: typeof sanitizedPublicKeyJwk.y,
        yValue: sanitizedPublicKeyJwk.y,
      });
      throw new Error('Failed to export public key: invalid y coordinate');
    }

    // Log sanitized JWK for debugging
    console.log('[crypto] Sanitized public key JWK:', JSON.stringify(sanitizedPublicKeyJwk, null, 2));

    // Convert to JSON strings for storage
    return {
      publicKey: JSON.stringify(sanitizedPublicKeyJwk),
      privateKey: JSON.stringify(privateKeyJwk),
    };
  } catch (error) {
    console.error('[crypto] Failed to generate key pair:', error);
    throw new Error('Failed to generate key pair: ' + (error as Error).message);
  }
}

/**
 * Sign a message using a private key (JWK format)
 * @param message - The message to sign (typically a challenge nonce)
 * @param privateKeyJwk - Private key in JWK format (JSON string)
 * @returns Base64-encoded signature (DER format)
 */
export async function signMessage(
  message: string,
  privateKeyJwk: string
): Promise<string> {
  try {
    // Parse private key from JWK
    const privateKeyData = JSON.parse(privateKeyJwk);
    const privateKey = await QuickCrypto.webcrypto.subtle.importKey(
      'jwk',
      privateKeyData,
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      false, // not extractable
      ['sign'] // key usage
    );

    // Encode message as UTF-8
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);

    // Sign the message
    const signature = await QuickCrypto.webcrypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-256',
      },
      privateKey,
      messageData
    );

    // Convert signature to base64 string
    const signatureArray = Array.from(new Uint8Array(signature));
    const signatureBase64 = btoa(
      String.fromCharCode.apply(null, signatureArray as any)
    );

    return signatureBase64;
  } catch (error) {
    console.error('[crypto] Failed to sign message:', error);
    throw new Error('Failed to sign message: ' + (error as Error).message);
  }
}

/**
 * Generate a unique device ID (UUID v4)
 * @returns UUID string
 */
export function generateDeviceId(): string {
  // Generate UUID v4 using crypto.getRandomValues
  const array = new Uint8Array(16);
  QuickCrypto.getRandomValues(array);

  // Set version (4) and variant bits
  array[6] = (array[6] & 0x0f) | 0x40; // Version 4
  array[8] = (array[8] & 0x3f) | 0x80; // Variant 10

  // Convert to UUID string format
  const hex = Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

