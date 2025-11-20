/**
 * AI Model Configuration (2025)
 * Tuned for Cloudflare Workers AI
 */

export const AI_MODELS = {
  /**
   * FAST TEXT GENERATION / CLASSIFICATION
   * Llama 3.1 8B - fast variant
   */
  TEXT_GENERATION_FAST: '@cf/meta/llama-3.1-8b-instruct-fast',

  /**
   * PRIMARY TEXT GENERATION
   * Llama 3.1 8B FP8 – good balance of quality & cost
   */
  TEXT_GENERATION_PRIMARY: '@cf/meta/llama-3.1-8b-instruct-fp8',

  /**
   * ADVANCED TEXT GENERATION
   * Llama 3.3 70B – high quality, long context, more expensive
   */
  TEXT_GENERATION_ADVANCED: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',

  /**
   * EMBEDDINGS (Vectorize)
   */
  EMBEDDINGS: '@cf/baai/bge-m3',

  /**
   * IMAGE GENERATION (Phase 2)
   */
  IMAGE_GENERATION: '@cf/stabilityai/stable-diffusion-xl-base-1.0',

  /**
   * TRANSLATION
   */
  TRANSLATION: '@cf/meta/m2m100-1.2b',
} as const;

/**
 * Model Selection Strategy by Task
 */
export const MODEL_STRATEGY = {
  // Step 1: Quick preference analysis
  PREFERENCE_ANALYSIS: {
    model: AI_MODELS.TEXT_GENERATION_FAST,
    maxTokens: 384,
    temperature: 0.3, // lower = more stable JSON
    reason: 'Fast, cheap classification + extraction',
  },

  // Step 2: Main itinerary generation
  ITINERARY_GENERATION: {
    model: AI_MODELS.TEXT_GENERATION_ADVANCED,
    maxTokens: 2300, // 70B, 24k ctx, safe margin
    temperature: 0.7,
    reason: 'High-quality multi-day itineraries with long context',
  },

  // Step 3: Recommendations
  RECOMMENDATIONS: {
    model: AI_MODELS.TEXT_GENERATION_PRIMARY,
    maxTokens: 1600,
    temperature: 0.6,
    reason: 'Balanced speed & quality for lists of venues',
  },

  // Step 4: Trip updates / edits in chat
  TRIP_UPDATES: {
    model: AI_MODELS.TEXT_GENERATION_PRIMARY,
    maxTokens: 2200,
    temperature: 0.55,
    reason: 'Stable edits without rewriting everything',
  },

  // Step 5: Geocoding (fallback when no external API)
  GEOCODING: {
    model: AI_MODELS.TEXT_GENERATION_FAST,
    maxTokens: 256,
    temperature: 0.2,
    reason: 'Deterministic coordinates + country/region',
  },
} as const;

/**
 * Helper: Get model config for a task
 */
export function getModelConfig(task: keyof typeof MODEL_STRATEGY) {
  return MODEL_STRATEGY[task];
}

/**
 * Helper: Should use advanced 70B model?
 * Use advanced when:
 * - Long or complex trips
 * - Premium / complex preferences
 */
export function shouldUseAdvancedModel(input: {
  duration?: number;
  budget?: number;
  preferencesLength?: number;
}): boolean {
  const { duration = 7, budget = 1000, preferencesLength = 0 } = input;

  return (
    duration > 5 ||        // long trips need more reasoning
    budget > 3000 ||       // premium trips
    preferencesLength > 200
  );
}

/**
 * Helper: Calculate optimal timeout for workflow step
 */
export function getStepTimeout(step: string): number {
  const timeouts: Record<string, number> = {
    'preference_analysis': 6000,
    'itinerary_generation': 18000,
    'recommendations': 9000,
    'geocoding': 3000,
    'trip_update': 11000,
  };
  return timeouts[step] || 10000;
}

/**
 * Fallback chain if primary model fails
 */
export const FALLBACK_MODELS = {
  [AI_MODELS.TEXT_GENERATION_ADVANCED]: AI_MODELS.TEXT_GENERATION_PRIMARY,
  [AI_MODELS.TEXT_GENERATION_PRIMARY]: AI_MODELS.TEXT_GENERATION_FAST,
} as const;
