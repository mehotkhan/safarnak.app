/**
 * UUID Utilities
 * 
 * Optimized UUID generation for each runtime:
 * - Cloudflare Workers: Uses native crypto.randomUUID()
 * - React Native Expo: Uses crypto.getRandomValues() or expo-crypto
 * - Fallback: Pure JS implementation (should rarely be needed)
 */

/**
 * Generate a UUID v4 using the best available method for the current runtime
 * 
 * Priority:
 * 1. crypto.randomUUID() - Native Web Crypto API (Cloudflare Workers, modern browsers/Expo)
 * 2. crypto.getRandomValues() - Web Crypto API with manual UUID construction (Expo, browsers)
 * 3. Math.random() - Fallback only (not cryptographically secure, but works everywhere)
 */
export function createId(): string {
  // ============================================================================
  // Cloudflare Workers & Modern Environments
  // ============================================================================
  // Native crypto.randomUUID() is available in:
  // - Cloudflare Workers (V8 runtime)
  // - Modern browsers (Chrome 92+, Firefox 95+, Safari 15.4+)
  // - Modern React Native/Expo (with crypto polyfill)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (error) {
      // Continue to fallback if randomUUID fails
      if (__DEV__) {
        console.warn('crypto.randomUUID() failed, using fallback:', error);
      }
    }
  }

  // ============================================================================
  // React Native Expo & Browsers with getRandomValues
  // ============================================================================
  // crypto.getRandomValues() is available in:
  // - Cloudflare Workers
  // - React Native (with polyfill)
  // - Expo (via expo-crypto or polyfill)
  // - Modern browsers
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    try {
      // Generate 16 random bytes (128 bits) for UUID v4
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);

      // Set version (4) and variant bits according to RFC 4122
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

      // Convert to UUID string format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
      ].join('-');
    } catch (error) {
      // Continue to fallback if getRandomValues fails
      if (__DEV__) {
        console.warn('crypto.getRandomValues() failed, using fallback:', error);
      }
    }
  }

  // ============================================================================
  // Fallback: Math.random() (Not cryptographically secure)
  // ============================================================================
  // This should rarely be needed, but provides a working fallback
  // Only use if crypto APIs are completely unavailable
  if (__DEV__) {
    console.warn(
      'Using Math.random() fallback for UUID generation. This is not cryptographically secure. ' +
        'Consider adding expo-crypto or a crypto polyfill for better security.'
    );
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validate UUID format (RFC 4122)
 * 
 * @param id - String to validate
 * @returns True if the string is a valid UUID format
 */
export function isValidId(id: string): boolean {
  if (typeof id !== 'string') {
    return false;
  }

  // RFC 4122 UUID format: 8-4-4-4-12 hexadecimal digits
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Check if the current runtime supports secure UUID generation
 * 
 * @returns True if crypto.randomUUID() or crypto.getRandomValues() is available
 */
export function hasSecureUUIDSupport(): boolean {
  return (
    (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ||
    (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function')
  );
}
