/**
 * Cryptographic utilities for biometric authentication
 * Handles signature verification for challenge-response auth using ECDSA P-256
 * 
 * Uses Web Crypto API (available in Cloudflare Workers) for signature verification
 */

/**
 * Generate a random nonce for challenge-response authentication
 */
export function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify ECDSA P-256 signature against message and public key (JWK format)
 * 
 * @param message - The message that was signed (typically the nonce)
 * @param signature - Base64-encoded signature (DER format)
 * @param publicKeyJwk - Public key in JWK format (JSON string)
 * @returns true if signature is valid, false otherwise
 */
export async function verifySignature(
  message: string,
  signature: string,
  publicKeyJwk: string
): Promise<boolean> {
  try {
    // Parse public key from JWK
    let publicKeyData: any;
    try {
      publicKeyData = JSON.parse(publicKeyJwk);
    } catch (parseError) {
      console.error('[Crypto] Failed to parse JWK JSON:', parseError, 'Raw JWK:', publicKeyJwk);
      return false;
    }

    // Log the received JWK for debugging
    console.log('[Crypto] Received JWK:', JSON.stringify(publicKeyData, null, 2));

    // Validate JWK structure for ECDSA P-256
    if (!publicKeyData.kty || publicKeyData.kty !== 'EC') {
      console.error('[Crypto] Invalid JWK: kty must be "EC"', publicKeyData);
      return false;
    }
    if (!publicKeyData.crv || publicKeyData.crv !== 'P-256') {
      console.error('[Crypto] Invalid JWK: crv must be "P-256"', publicKeyData);
      return false;
    }
    // Strict validation: x and y must be non-empty strings (not "undefined" or "null")
    if (typeof publicKeyData.x !== 'string' || publicKeyData.x.length === 0 || publicKeyData.x === 'undefined' || publicKeyData.x === 'null') {
      console.error('[Crypto] Invalid JWK: x coordinate must be a non-empty string', {
        hasX: !!publicKeyData.x,
        xType: typeof publicKeyData.x,
        xValue: publicKeyData.x,
        fullData: publicKeyData,
      });
      return false;
    }
    if (typeof publicKeyData.y !== 'string' || publicKeyData.y.length === 0 || publicKeyData.y === 'undefined' || publicKeyData.y === 'null') {
      console.error('[Crypto] Invalid JWK: y coordinate must be a non-empty string', {
        hasY: !!publicKeyData.y,
        yType: typeof publicKeyData.y,
        yValue: publicKeyData.y,
        fullData: publicKeyData,
      });
      return false;
    }

    // Sanitize and fix base64url encoding
    // Remove trailing periods and ensure proper base64url format
    let x = String(publicKeyData.x).trim();
    let y = String(publicKeyData.y).trim();
    
    // Remove trailing periods (invalid in base64url)
    if (x.endsWith('.')) {
      x = x.slice(0, -1);
    }
    if (y.endsWith('.')) {
      y = y.slice(0, -1);
    }

    // Create a clean plain object for JWK
    const sanitizedPublicKeyData = {
      kty: String(publicKeyData.kty),
      crv: String(publicKeyData.crv),
      x: x,
      y: y,
    };

    // Log sanitized JWK for debugging
    console.log('[Crypto] Sanitized JWK:', JSON.stringify(sanitizedPublicKeyData, null, 2));

    // Ensure it's a plain object by recreating it
    const cleanJwk = JSON.parse(JSON.stringify(sanitizedPublicKeyData));

    // Import public key
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      cleanJwk,
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      false, // not extractable
      ['verify'] // key usage
    );

    // Decode signature from base64
    const signatureBytes = Uint8Array.from(
      atob(signature),
      (c) => c.charCodeAt(0)
    );

    // Encode message as UTF-8
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: 'SHA-256',
      },
      publicKey,
      signatureBytes,
      messageData
    );

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

