// Resolver utilities
// Password hashing and token generation utilities using Web Crypto API

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const HASH_LENGTH = 256; // bits

/**
 * Hash a password using PBKDF2
 * @param password - Plain text password to hash
 * @returns Base64 encoded salt + hash
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Import password as key material
  const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, [
    'deriveBits',
  ]);

  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  // Derive hash using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    HASH_LENGTH
  );

  // Combine salt and hash for storage
  const combined = new Uint8Array(salt.length + derivedBits.byteLength);
  combined.set(salt);
  combined.set(new Uint8Array(derivedBits), salt.length);

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...Array.from(combined)));
}

/**
 * Verify a password against a stored hash
 * @param password - Plain text password to verify
 * @param storedHash - Base64 encoded salt + hash from database
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Decode stored hash from base64
    const combined = new Uint8Array(
      atob(storedHash)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    // Extract salt and hash
    const salt = combined.slice(0, SALT_LENGTH);
    const storedHashBytes = combined.slice(SALT_LENGTH);

    // Import password as key material
    const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, [
      'deriveBits',
    ]);

    // Derive hash from provided password
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      key,
      HASH_LENGTH
    );

    // Compare hashes using constant-time comparison
    const derivedHash = new Uint8Array(derivedBits);

    if (derivedHash.length !== storedHashBytes.length) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    let result = 0;
    for (let i = 0; i < derivedHash.length; i++) {
      const storedByte = storedHashBytes[i];
      if (storedByte !== undefined) {
        result |= (derivedHash[i] ?? 0) ^ (storedByte as number);
      } else {
        // If byte is undefined, consider it a mismatch

        result |= (derivedHash[i] ?? 0) ^ 0xff;
      }
    }

    return result === 0;
  } catch {
    return false;
  }
}

/**
 * Generate a secure authentication token
 * @param userId - User ID (UUID string)
 * @param username - Username
 * @returns Hex-encoded SHA-256 hash token
 */
export async function generateToken(
  userId: string,
  username: string
): Promise<string> {
  const timestamp = Date.now();
  const data = new TextEncoder().encode(`${userId}-${username}-${timestamp}`);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);

  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
