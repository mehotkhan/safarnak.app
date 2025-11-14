/**
 * AI Model Configuration
 * 
 * Optimized model selection for each trip planning task
 * Based on Cloudflare Workers AI capabilities and performance characteristics
 */

export const AI_MODELS = {
  /**
   * PRIMARY TEXT GENERATION
   * Best for: Detailed itinerary generation, reasoning, structured outputs
   * Speed: Fast (1-3s)
   * Quality: High
   * Context: 8K tokens
   */
  TEXT_GENERATION_PRIMARY: '@cf/meta/llama-3.1-8b-instruct-fp8',

  /**
   * ADVANCED TEXT GENERATION
   * Best for: Complex reasoning, longer outputs, high-quality responses
   * Speed: Moderate (3-6s)
   * Quality: Very High
   * Context: 32K tokens
   * Use when: Quality > Speed (e.g., detailed multi-day itineraries)
   */
  TEXT_GENERATION_ADVANCED: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',

  /**
   * FAST TEXT GENERATION
   * Best for: Quick analysis, simple classifications
   * Speed: Very Fast (<1s)
   * Quality: Good
   * Use when: Speed > Quality (e.g., quick preference extraction)
   */
  TEXT_GENERATION_FAST: '@cf/meta/llama-3.1-8b-instruct-fp8',

  /**
   * EMBEDDINGS
   * Best for: Semantic search, similarity matching
   * Dimensions: 1024
   * Use for: Finding similar trips, places, recommendations
   */
  EMBEDDINGS: '@cf/baai/bge-m3',

  /**
   * IMAGE GENERATION (Future - Phase 2)
   * Best for: Destination preview images
   * Model: Stable Diffusion XL
   */
  IMAGE_GENERATION: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
  
  /**
   * TRANSLATION
   * Best for: Translating generated itinerary and reasoning to user language
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
    maxTokens: 512,
    temperature: 0.7,
    reason: 'Fast classification and extraction',
  },

  // Step 2: Main itinerary generation
  ITINERARY_GENERATION: {
    model: AI_MODELS.TEXT_GENERATION_ADVANCED, // Use advanced model for quality
    maxTokens: 3072, // Longer output for detailed itineraries
    temperature: 0.8, // Slightly higher for creativity
    reason: 'High-quality detailed planning',
  },

  // Step 3: Recommendations (can be fast)
  RECOMMENDATIONS: {
    model: AI_MODELS.TEXT_GENERATION_PRIMARY,
    maxTokens: 1536,
    temperature: 0.7,
    reason: 'Balanced speed and quality for lists',
  },

  // Step 4: Quick updates and modifications
  TRIP_UPDATES: {
    model: AI_MODELS.TEXT_GENERATION_PRIMARY,
    maxTokens: 3072,
    temperature: 0.65,
    reason: 'Detailed yet responsive updates for user changes',
  },

  // Step 5: Geocoding (simple classification)
  GEOCODING: {
    model: AI_MODELS.TEXT_GENERATION_FAST,
    maxTokens: 256,
    temperature: 0.5, // Lower for more deterministic results
    reason: 'Simple structured output',
  },
} as const;

/**
 * Performance Optimization Settings
 */
export const OPTIMIZATION = {
  // Enable parallel execution for independent tasks
  ENABLE_PARALLEL: true,

  // Timeout per AI request (ms)
  AI_TIMEOUT: 30000,

  // Retry failed requests (with exponential backoff)
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000,

  // Cache common results (destinations, etc.)
  ENABLE_CACHE: true,
  CACHE_TTL: 3600, // 1 hour
} as const;

/**
 * Helper: Get model config for a task
 */
export function getModelConfig(task: keyof typeof MODEL_STRATEGY) {
  return MODEL_STRATEGY[task];
}

/**
 * Helper: Should use advanced model?
 * Use advanced model for:
 * - Trips longer than 5 days
 * - Budget > $3000 (premium trips)
 * - Complex preferences (>200 chars)
 */
export function shouldUseAdvancedModel(input: {
  duration?: number;
  budget?: number;
  preferencesLength?: number;
}): boolean {
  const { duration = 7, budget = 1000, preferencesLength = 0 } = input;

  return (
    duration > 5 ||
    budget > 3000 ||
    preferencesLength > 200
  );
}

/**
 * Helper: Calculate optimal timeout for workflow step
 */
export function getStepTimeout(step: string): number {
  const timeouts: Record<string, number> = {
    'preference_analysis': 5000,
    'itinerary_generation': 15000,
    'recommendations': 8000,
    'geocoding': 3000,
    'trip_update': 10000,
  };
  return timeouts[step] || 10000;
}

/**
 * Model Performance Characteristics
 */
export const MODEL_METRICS = {
  [AI_MODELS.TEXT_GENERATION_PRIMARY]: {
    avgLatency: 2500, // ms
    maxTokensPerSecond: 50,
    costPer1kNeurons: 0.011,
    reliability: 0.98,
  },
  [AI_MODELS.TEXT_GENERATION_ADVANCED]: {
    avgLatency: 4500, // ms
    maxTokensPerSecond: 35,
    costPer1kNeurons: 0.011,
    reliability: 0.99,
  },
  [AI_MODELS.EMBEDDINGS]: {
    avgLatency: 500, // ms
    dimensions: 1024,
    costPer1kNeurons: 0.011,
    reliability: 0.99,
  },
} as const;

/**
 * Fallback chain if primary model fails
 */
export const FALLBACK_MODELS = {
  [AI_MODELS.TEXT_GENERATION_ADVANCED]: AI_MODELS.TEXT_GENERATION_PRIMARY,
  [AI_MODELS.TEXT_GENERATION_PRIMARY]: AI_MODELS.TEXT_GENERATION_FAST,
} as const;

