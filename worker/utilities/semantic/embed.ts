/**
 * Embedding utilities for semantic search
 * Uses BGE-M3 for multilingual, 1024-dim embeddings
 */

import type { Env } from '../../types';
import { AI_MODELS } from '../ai/models';

/**
 * Generate embedding for text using BGE-M3
 * Supports 100+ languages including Farsi/Persian
 * Returns 1024-dimensional vector for Vectorize indexing
 */
export async function embedText(
  env: Env,
  text: string
): Promise<number[]> {
  try {
    const embedding: any = await env.AI.run(AI_MODELS.EMBEDDINGS as any, { text });
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

/**
 * Rerank search results by relevance to query
 * Uses BGE Reranker for improved precision on top-N results
 */
export async function rerankResults(
  env: Env,
  query: string,
  documents: string[],
  topK: number = 10
): Promise<Array<{ index: number; score: number }>> {
  try {
    if (documents.length === 0) return [];
    
    const response: any = await env.AI.run(AI_MODELS.RERANKER as any, {
      query,
      documents: documents.slice(0, 50), // Limit to 50 docs for performance
    });
    
    // Extract scores and sort by relevance
    const scores = response?.scores || response?.data || [];
    const ranked = scores
      .map((score: number, index: number) => ({ index, score }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, topK);
    
    return ranked;
  } catch (error) {
    console.error('[Embed] Reranking failed:', error);
    // Return original order if reranking fails
    return documents.slice(0, topK).map((_, index) => ({ index, score: 1 - index * 0.01 }));
  }
}

