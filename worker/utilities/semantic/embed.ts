/**
 * Embedding utilities for semantic search
 */

import type { Env } from '../../types';

/**
 * Generate embedding for text using BGE-M3
 */
export async function embedText(
  env: Env,
  text: string
): Promise<number[]> {
  try {
    const embedding: any = await env.AI.run('@cf/baai/bge-m3', { text });
    const vector = embedding?.data?.[0] || embedding?.embedding || [];
    
    if (vector.length === 0) {
      throw new Error('Empty embedding vector');
    }
    
    return vector;
  } catch (error) {
    console.error('[Embed] Failed to generate embedding:', error);
    throw error;
  }
}

