// Resolver utilities
// Password hashing and token generation utilities

// Password hashing utilities using Cloudflare Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Use PBKDF2 for password hashing (more secure than SHA-256)
  const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, [
    'deriveBits',
  ]);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256',
    },
    key,
    256 // 256 bits = 32 bytes
  );

  // Combine salt and hash for storage
  const combined = new Uint8Array(salt.length + derivedBits.byteLength);
  combined.set(salt);
  combined.set(new Uint8Array(derivedBits), salt.length);

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
}

// Password verification using PBKDF2
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Decode stored hash
    const combined = new Uint8Array(
      atob(storedHash)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    // Extract salt and hash
    const salt = combined.slice(0, 16);
    const storedHashBytes = combined.slice(16);

    // Derive hash from provided password
    const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, [
      'deriveBits',
    ]);

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      key,
      256
    );

    // Compare hashes
    const derivedHash = new Uint8Array(derivedBits);
    return (
      derivedHash.length === storedHashBytes.length &&
      derivedHash.every((byte, index) => byte === storedHashBytes[index])
    );
  } catch {
    return false;
  }
}

// Token generation utility
export async function generateToken(
  userId: number,
  username: string
): Promise<string> {
  const data = new TextEncoder().encode(`${userId}-${username}-${Date.now()}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
