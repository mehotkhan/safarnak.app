import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import { eq } from 'drizzle-orm';

import { getLocalDB } from '@database/client';
import { localConversationKeys } from '@database/schema';
import { createId } from '@database/utils';
import type { DeviceKeyPair } from '@state/slices/authSlice';

const RSA_ALGO = { name: 'RSA-OAEP', hash: 'SHA-256' };
const AES_ALGO = 'AES-GCM';
const AES_KEY_LENGTH = 32;
const GCM_IV_LENGTH = 12;
const subtle = globalThis.crypto?.subtle;

interface StoredConversationKey {
  conversationId: string;
  keyId: string;
  encryptedKey: string;
}

interface DecryptedConversationKey {
  conversationId: string;
  keyId: string;
  material: Uint8Array;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBufferSource = (bytes: Uint8Array): ArrayBuffer =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

function generateKeyMaterial(): Uint8Array {
  const bytes = new Uint8Array(AES_KEY_LENGTH);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function loadLocalKey(conversationId: string): Promise<StoredConversationKey | null> {
  const db = await getLocalDB();
  const record = await db
    .select()
    .from(localConversationKeys)
    .where(eq(localConversationKeys.conversationId, conversationId))
    .get();
  if (!record) return null;
  return {
    conversationId: record.conversationId,
    keyId: record.keyId || record.conversationId,
    encryptedKey: record.encryptedKey,
  };
}

async function importPublicKey(deviceKeyPair: DeviceKeyPair) {
  if (!subtle) {
    throw new Error('SubtleCrypto not available');
  }
  const jwk = JSON.parse(deviceKeyPair.publicKey);
  return subtle.importKey('jwk', jwk, RSA_ALGO, false, ['encrypt']);
}

async function importPrivateKey(deviceKeyPair: DeviceKeyPair) {
  if (!subtle) {
    throw new Error('SubtleCrypto not available');
  }
  const jwk = JSON.parse(deviceKeyPair.privateKey);
  return subtle.importKey('jwk', jwk, RSA_ALGO, false, ['decrypt']);
}

async function encryptSymmetricKey(material: Uint8Array, deviceKeyPair: DeviceKeyPair) {
  if (!subtle) {
    return Buffer.from(material).toString('base64');
  }
  const publicKey = await importPublicKey(deviceKeyPair);
  const encrypted = await subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, toBufferSource(material));
  return Buffer.from(new Uint8Array(encrypted)).toString('base64');
}

async function decryptSymmetricKey(encryptedKey: string, deviceKeyPair: DeviceKeyPair) {
  if (!subtle) {
    return Buffer.from(encryptedKey, 'base64');
  }
  const privateKey = await importPrivateKey(deviceKeyPair);
  const encryptedBytes = Buffer.from(encryptedKey, 'base64');
  const decrypted = await subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedBytes,
  );
  return new Uint8Array(decrypted);
}

async function persistLocalKey(conversationId: string, keyId: string, encryptedKey: string) {
  const db = await getLocalDB();
  const now = Math.floor(Date.now() / 1000);
  await db
    .insert(localConversationKeys)
    .values({
      conversationId,
      keyId,
      encryptedKey,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: localConversationKeys.conversationId,
      set: {
        keyId,
        encryptedKey,
        updatedAt: now,
      },
    });
}

export async function getOrCreateConversationKey(
  conversationId: string,
  deviceKeyPair: DeviceKeyPair,
): Promise<DecryptedConversationKey> {
  const existing = await loadLocalKey(conversationId);
  if (existing) {
    const material = await decryptSymmetricKey(existing.encryptedKey, deviceKeyPair);
    return { conversationId, keyId: existing.keyId, material };
  }

  const material = generateKeyMaterial();
  const keyId = createId();
  const encryptedKey = await encryptSymmetricKey(material, deviceKeyPair);
  await persistLocalKey(conversationId, keyId, encryptedKey);

  return { conversationId, keyId, material };
}

export async function encryptMessage(
  conversationId: string,
  plaintext: string,
  deviceKeyPair: DeviceKeyPair,
) {
  const key = await getOrCreateConversationKey(conversationId, deviceKeyPair);
  if (!subtle) {
    return {
      ciphertext: plaintext,
      ciphertextMeta: {
        keyId: key.keyId,
        scheme: 'PLAIN',
      },
    };
  }
  const rawKey = toBufferSource(key.material);
  const aesKey = await subtle.importKey(
    'raw',
    rawKey,
    { name: AES_ALGO },
    false,
    ['encrypt', 'decrypt'],
  );
  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH));
  const ciphertextBuffer = await subtle.encrypt(
    { name: AES_ALGO, iv },
    aesKey,
    encoder.encode(plaintext),
  );

  return {
    ciphertext: Buffer.from(new Uint8Array(ciphertextBuffer)).toString('base64'),
    ciphertextMeta: {
      keyId: key.keyId,
      scheme: 'AES-GCM',
      iv: Buffer.from(iv).toString('base64'),
    },
  };
}

export async function decryptMessage(
  conversationId: string,
  ciphertext: string,
  meta: any,
  deviceKeyPair: DeviceKeyPair,
) {
  if (!ciphertext) {
    return ciphertext;
  }

  try {
    if (!subtle || meta?.scheme === 'PLAIN' || !meta?.iv) {
      return ciphertext;
    }
    const key = await getOrCreateConversationKey(conversationId, deviceKeyPair);
    const rawKey = toBufferSource(key.material);
    const aesKey = await subtle.importKey(
      'raw',
      rawKey,
      { name: AES_ALGO },
      false,
      ['encrypt', 'decrypt'],
    );
    const iv = Buffer.from(meta.iv, 'base64');
    const cipherBytes = Buffer.from(ciphertext, 'base64');
    const plaintextBuffer = await subtle.decrypt(
      { name: AES_ALGO, iv: new Uint8Array(iv) },
      aesKey,
      cipherBytes,
    );
    return decoder.decode(plaintextBuffer);
  } catch (error) {
    if (__DEV__) {
      console.warn('[conversationKeys] Failed to decrypt message, falling back to ciphertext.', error);
    }
    return ciphertext;
  }
}

