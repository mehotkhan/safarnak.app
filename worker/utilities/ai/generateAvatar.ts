/**
 * AI Avatar Generation Utility
 * Produces a travel-themed anime/cartoon animal avatar
 */

import type { Env } from '../../types';
import { AI_MODELS } from './models';

export interface GenerateAvatarOptions {
  firstName: string;
  lastName?: string;
  style?: 'professional' | 'casual' | 'artistic' | 'minimalist';
}

// Strong, curated random animals
const ANIMALS = [
  'red panda', 'fox', 'shiba inu', 'penguin', 'owl',
  'cat', 'husky', 'koala', 'sloth', 'parrot',
  'bear cub', 'rabbit', 'wolf pup', 'lion cub'
];

// Travel props to embed travel concept
const TRAVEL_PROPS = [
  'traveler backpack', 'passport', 'camera around neck',
  'map in hand', 'airplane background', 'world map backdrop',
  'travel stickers', 'small travel bag', 'compass', 'sunset travel scene'
];

// Anime/cartoon/mascot styles
const STYLE_MAP: Record<string, string> = {
  professional: 'anime mascot style, clean shading, sharp lineart, expressive face',
  casual: 'cute cartoon style, soft colors, friendly expression',
  artistic: 'stylized anime illustration, vibrant colors, detailed fur texture',
  minimalist: 'simple mascot illustration, clean flat colors, minimal shading',
};

// Pick a random item from array
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export async function generateAvatarImage(
  env: Env,
  { firstName, lastName, style = 'professional' }: GenerateAvatarOptions
): Promise<{ imageBase64: string; mimeType: string }> {

  const fullName = lastName ? `${firstName} ${lastName}` : firstName;

  const randomAnimal = pick(ANIMALS);
  const randomProp = pick(TRAVEL_PROPS);
  const stylePrompt = STYLE_MAP[style] || STYLE_MAP.professional;

  /**
   * 🔥 Core Avatar Prompt
   * Produces anime/cartoon animal face with travel concept
   */
  const prompt = `
    Ultra-cute anime/cartoon portrait of a ${randomAnimal}.
    Travel theme: ${randomProp}.
    Style: ${stylePrompt}.
    Centered mascot-style face, expressive eyes, clean background, soft lighting.
    High quality illustration, 4k detail, vibrant, professional character design.
    Square composition (1:1). No text, no watermark, no letters.
    Friendly, positive vibe, travel mascot for the brand "Safarnak".
  `.trim();

  console.log('[generateAvatar] Prompt:', prompt);

  try {
    const response = await env.AI.run(AI_MODELS.IMAGE_GENERATION as any, {
      prompt,
      num_steps: 20, // Maximum allowed by Cloudflare Workers AI
      guidance: 7.5, // Standard guidance for good quality
      width: 512,
      height: 512,
    });

    // Normalize output to Uint8Array
    let arrayBuffer: ArrayBuffer;

    if (response instanceof ReadableStream) {
      const reader = response.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }

      const total = chunks.reduce((n, c) => n + c.length, 0);
      const combined = new Uint8Array(total);
      let offset = 0;

      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      arrayBuffer = combined.buffer;

    } else if (response && response.body) {
      arrayBuffer = await response.body.arrayBuffer();

    } else if (response instanceof ArrayBuffer) {
      arrayBuffer = response;

    } else if (response?.image) {
      const base64 = response.image.replace(/^data:image\/\w+;base64,/, '');
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      arrayBuffer = bytes.buffer;

    } else {
      arrayBuffer = new Uint8Array(response as any).buffer;
    }

    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const imageBase64 = btoa(binary);

    return {
      imageBase64,
      mimeType: 'image/png',
    };

  } catch (err) {
    console.error('[generateAvatar] AI error:', err);
    throw new Error('Failed to generate avatar');
  }
}
