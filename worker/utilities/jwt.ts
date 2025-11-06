/**
 * JWT utilities for Cloudflare Workers
 * Uses Web Crypto API for signing and verification
 */

export interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = 'your-secret-key-change-in-production'; // TODO: Move to environment variable
const JWT_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
  // Add back padding
  const paddedStr = str + '==='.slice((str.length + 3) % 4);
  const decoded = atob(paddedStr.replace(/-/g, '+').replace(/_/g, '/'));
  return decoded;
}

/**
 * Generate JWT token
 */
export async function generateJWT(userId: string, username: string): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    userId,
    username,
    iat: now,
    exp: now + JWT_EXPIRY,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const message = `${headerB64}.${payloadB64}`;

  // Sign using Web Crypto API
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const signatureB64 = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${message}.${signatureB64}`;
}

/**
 * Verify and decode JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const message = `${headerB64}.${payloadB64}`;

    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = Uint8Array.from(base64UrlDecode(signatureB64), (c) =>
      c.charCodeAt(0)
    );
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      encoder.encode(message)
    );

    if (!isValid) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as JWTPayload;

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('[JWT] Verification error:', error);
    return null;
  }
}

/**
 * Extract user ID from authorization header
 */
export async function getUserIdFromToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token);
  return payload?.userId || null;
}

