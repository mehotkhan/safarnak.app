/**
 * AI Model Configuration (2025)
 * Tuned for Cloudflare Workers AI
 *
 * Architecture:
 * - GEN_SMALL / GEN_LARGE: Core generation tiers (swap implementations later)
 * - Legacy aliases: RESEARCH, ITINERARY_*, TRIP_UPDATE for backwards compatibility
 * - "Research" mostly comes from external APIs now, not LLM
 * - Prepared for Llama 3.3 / future upgrades
 */

import type { Env } from '@worker/types';

// ============================================================================
// MODEL IDENTIFIERS
// ============================================================================

export const AI_MODELS = {
  // -------------------------------------------------------------------------
  // CORE GENERATION TIERS (use these in new code)
  // -------------------------------------------------------------------------

  /** Core generation – small/fast (8B) */
  GEN_SMALL: '@cf/meta/llama-3.1-8b-instruct-fast',

  /** Core generation – large/pro (70B) */
  GEN_LARGE: '@cf/meta/llama-3.1-70b-instruct-fp8-fast',

  // -------------------------------------------------------------------------
  // COMPATIBILITY ALIASES (existing code still compiles)
  // -------------------------------------------------------------------------

  /** Research & summarization (8B) - mostly external APIs now */
  RESEARCH: '@cf/meta/llama-3.1-8b-instruct-fast',

  /** Itinerary generation default (8B) */
  ITINERARY_DEFAULT: '@cf/meta/llama-3.1-8b-instruct-fast',

  /** Itinerary generation pro (70B) */
  ITINERARY_PRO: '@cf/meta/llama-3.1-70b-instruct-fp8-fast',

  /** Trip updates (8B) */
  TRIP_UPDATE: '@cf/meta/llama-3.1-8b-instruct-fast',

  // -------------------------------------------------------------------------
  // SPECIALIZED MODELS
  // -------------------------------------------------------------------------

  /**
   * VALIDATION & LIGHTWEIGHT REASONING
   * IBM Granite 4.0 H Micro - very cheap, optimized for instruction following
   * Perfect for: validation, classification, short summaries
   */
  VALIDATION: '@cf/ibm-granite/granite-4.0-h-micro',

  /**
   * TRANSLATION (non-JSON tasks)
   * M2M100 1.2B - dedicated many-to-many translation model
   * Supports 100+ languages including Farsi
   * Note: For JSON translation, use GEN_SMALL with strict prompts
   */
  TRANSLATION: '@cf/meta/m2m100-1.2b',

  /**
   * LLM-based TRANSLATION (JSON-aware)
   * Use when translating structured JSON to preserve structure
   */
  TRANSLATION_LLM: '@cf/meta/llama-3.1-8b-instruct-fast',

  /**
   * EMBEDDINGS (VECTORIZE)
   * BGE-M3 - multilingual, 1024-dim, strong for retrieval
   */
  EMBEDDINGS: '@cf/baai/bge-m3',

  /**
   * RERANKER (OPTIONAL)
   * BGE Reranker Base - re-order top N results by relevance
   */
  RERANKER: '@cf/baai/bge-reranker-base',

  /**
   * SAFETY/MODERATION (OPTIONAL)
   * Llama Guard 3 - classify content as safe/unsafe
   */
  SAFETY: '@cf/meta/llama-guard-3-8b',

  /**
   * IMAGE GENERATION
   * Stable Diffusion XL - for avatar generation
   */
  IMAGE_GENERATION: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
} as const;

// ============================================================================
// TOKEN CALCULATION CONSTANTS
// ============================================================================

/** Tokens per day for structured JSON itinerary (~120-180 is enough) */
const TOKENS_PER_DAY = 180;

/** Minimum tokens for any itinerary (at least 3-day equivalent) */
const MIN_TOKENS = 900;

/** Maximum tokens to cap latency */
const MAX_TOKENS = 2800;

// ============================================================================
// PARAMETER PRESETS BY TASK
// ============================================================================

export const AI_PRESETS = {
  /**
   * Destination Research
   * Low creativity, stable facts, structured JSON output
   * Note: Most research now comes from external APIs
   */
  researchDestination: {
    temperature: 0.3,
    top_p: 0.9,
    max_tokens: 512,
  },

  /**
   * Trip Validation
   * Very deterministic, short output
   */
  validateTrip: {
    temperature: 0.15,
    top_p: 0.8,
    max_tokens: 256,
  },

  /**
   * Preference Analysis
   * Low creativity for stable extraction
   */
  preferenceAnalysis: {
    temperature: 0.3,
    top_p: 0.9,
    max_tokens: 384,
  },

  /**
   * Itinerary Generation (dynamic based on days)
   * Uses tighter token calculation with TOKENS_PER_DAY
   */
  generateItinerary: (days: number, pro = false) => {
    const target = TOKENS_PER_DAY * Math.max(3, days); // clamp to at least 3 days
    return {
      temperature: pro ? 0.5 : 0.6,
      top_p: 0.9,
      max_tokens: Math.min(MAX_TOKENS, Math.max(MIN_TOKENS, target)),
      stream: false,
    };
  },

  /**
   * Trip Update - MICRO (small, localized edits)
   * "move this POI", "make day 2 lighter"
   */
  updateItineraryMicro: {
    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 1024,
  },

  /**
   * Trip Update - FULL (larger redesigns)
   * "completely redesign trip to be kid-friendly"
   */
  updateItineraryFull: {
    temperature: 0.5,
    top_p: 0.9,
    max_tokens: 2048,
  },

  /**
   * Translation (LLM-based for JSON)
   * Very low temperature for consistent translation
   */
  translateItinerary: {
    temperature: 0.1,
    top_p: 0.9,
    max_tokens: 4096,
  },

  /**
   * Recommendations
   * Moderate creativity for venue suggestions
   */
  recommendations: {
    temperature: 0.6,
    top_p: 0.9,
    max_tokens: 1600,
  },

  /**
   * AI Geocoding (fallback when no external API)
   * Very deterministic for coordinates
   */
  geocoding: {
    temperature: 0.2,
    top_p: 0.8,
    max_tokens: 256,
  },
} as const;

// ============================================================================
// JSON MODE CONFIGURATION
// ============================================================================

/**
 * Tasks that expect strict JSON output
 * Use shouldUseJsonMode() to check before AI calls
 */
export const AI_JSON_TASKS = {
  generateItinerary: true,
  updateItinerary: true,
  translateItinerary: true, // structured days back
  validateTrip: true, // { warnings:[], errors:[] }
  researchDestination: false, // now mostly external APIs
  preferenceAnalysis: true,
  recommendations: true,
} as const;

/**
 * Check if a task should use JSON mode
 */
export function shouldUseJsonMode(task: keyof typeof AI_JSON_TASKS): boolean {
  return !!AI_JSON_TASKS[task];
}

// ============================================================================
// ENVIRONMENT-AWARE TIER SYSTEM
// ============================================================================

export type AiTier = 'dev' | 'standard' | 'pro';

/**
 * Get default AI tier from environment
 * - dev: always 8B (local development)
 * - standard: 8B for most tasks
 * - pro: 70B for complex tasks
 */
export function getDefaultTier(env: Env): AiTier {
  const tierEnv = (env as unknown as Record<string, unknown>).AI_TIER as string | undefined;
  if (tierEnv === 'pro') return 'pro';
  if (tierEnv === 'dev') return 'dev';
  return 'standard';
}

// ============================================================================
// MODEL STRATEGY (derived from presets, no duplication)
// ============================================================================

// Reference presets for strategy entries
const defaultItPreset = AI_PRESETS.generateItinerary(5, false); // 5-day "typical" trip
const proItPreset = AI_PRESETS.generateItinerary(7, true); // 7-day pro trip

export const MODEL_STRATEGY = {
  // Destination research (mostly external APIs now, LLM for synthesis)
  RESEARCH: {
    model: AI_MODELS.RESEARCH,
    maxTokens: AI_PRESETS.researchDestination.max_tokens,
    temperature: AI_PRESETS.researchDestination.temperature,
    top_p: AI_PRESETS.researchDestination.top_p,
    reason: 'Synthesis of external API data (OSM/Wiki)',
  },

  // Validation (lightweight)
  VALIDATION: {
    model: AI_MODELS.VALIDATION,
    maxTokens: AI_PRESETS.validateTrip.max_tokens,
    temperature: AI_PRESETS.validateTrip.temperature,
    top_p: AI_PRESETS.validateTrip.top_p,
    reason: 'Cheap, fast validation and classification',
  },

  // Preference analysis
  PREFERENCE_ANALYSIS: {
    model: AI_MODELS.GEN_SMALL,
    maxTokens: AI_PRESETS.preferenceAnalysis.max_tokens,
    temperature: AI_PRESETS.preferenceAnalysis.temperature,
    top_p: AI_PRESETS.preferenceAnalysis.top_p,
    reason: 'Fast preference extraction and classification',
  },

  // Main itinerary generation (default)
  ITINERARY_GENERATION: {
    model: AI_MODELS.GEN_SMALL,
    maxTokens: defaultItPreset.max_tokens,
    temperature: defaultItPreset.temperature,
    top_p: defaultItPreset.top_p,
    reason: 'Balanced speed & quality for day-by-day planning',
  },

  // Main itinerary generation (pro/high-quality)
  ITINERARY_GENERATION_PRO: {
    model: AI_MODELS.GEN_LARGE,
    maxTokens: proItPreset.max_tokens,
    temperature: proItPreset.temperature,
    top_p: proItPreset.top_p,
    reason: 'High-quality planning for complex/long trips',
  },

  // Recommendations
  RECOMMENDATIONS: {
    model: AI_MODELS.GEN_SMALL,
    maxTokens: AI_PRESETS.recommendations.max_tokens,
    temperature: AI_PRESETS.recommendations.temperature,
    top_p: AI_PRESETS.recommendations.top_p,
    reason: 'Venue and activity recommendations',
  },

  // Trip updates - MICRO (small edits)
  TRIP_UPDATES_MICRO: {
    model: AI_MODELS.TRIP_UPDATE,
    maxTokens: AI_PRESETS.updateItineraryMicro.max_tokens,
    temperature: AI_PRESETS.updateItineraryMicro.temperature,
    top_p: AI_PRESETS.updateItineraryMicro.top_p,
    reason: 'Small, localized itinerary edits',
  },

  // Trip updates - FULL (larger redesigns)
  TRIP_UPDATES_FULL: {
    model: AI_MODELS.TRIP_UPDATE,
    maxTokens: AI_PRESETS.updateItineraryFull.max_tokens,
    temperature: AI_PRESETS.updateItineraryFull.temperature,
    top_p: AI_PRESETS.updateItineraryFull.top_p,
    reason: 'Larger redesigns with user feedback',
  },

  // Legacy alias for backwards compatibility
  TRIP_UPDATES: {
    model: AI_MODELS.TRIP_UPDATE,
    maxTokens: AI_PRESETS.updateItineraryFull.max_tokens,
    temperature: AI_PRESETS.updateItineraryFull.temperature,
    top_p: AI_PRESETS.updateItineraryFull.top_p,
    reason: 'Consistent interpretation of user feedback',
  },

  // Geocoding (fallback when no external API)
  GEOCODING: {
    model: AI_MODELS.RESEARCH,
    maxTokens: AI_PRESETS.geocoding.max_tokens,
    temperature: AI_PRESETS.geocoding.temperature,
    top_p: AI_PRESETS.geocoding.top_p,
    reason: 'Deterministic coordinates + country/region',
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get model config for a task
 */
export function getModelConfig(task: keyof typeof MODEL_STRATEGY) {
  return MODEL_STRATEGY[task];
}

/**
 * Get itinerary generation config with dynamic token calculation
 * Now tier-aware: standard vs pro
 */
export function getItineraryConfig(
  days: number,
  opts?: {
    pro?: boolean;
    tier?: AiTier;
  }
) {
  const tier = opts?.tier ?? 'standard';
  const pro = opts?.pro ?? tier === 'pro';

  const preset = AI_PRESETS.generateItinerary(days, pro);
  return {
    model: pro ? AI_MODELS.GEN_LARGE : AI_MODELS.GEN_SMALL,
    maxTokens: preset.max_tokens,
    temperature: preset.temperature,
    top_p: preset.top_p,
  };
}

/**
 * Get update config based on update type
 */
export function getUpdateConfig(type: 'micro' | 'full' = 'full') {
  const preset =
    type === 'micro' ? AI_PRESETS.updateItineraryMicro : AI_PRESETS.updateItineraryFull;
  return {
    model: AI_MODELS.TRIP_UPDATE,
    maxTokens: preset.max_tokens,
    temperature: preset.temperature,
    top_p: preset.top_p,
  };
}

/**
 * Should use advanced 70B model?
 * Use advanced when:
 * - Long trips (> 5 days, cap at 10 - beyond that split the trip)
 * - Premium / high budget trips (> $2000)
 * - Complex preferences (> 200 chars)
 */
export function shouldUseAdvancedModel(input: {
  duration?: number;
  budget?: number;
  preferencesLength?: number;
}): boolean {
  const { duration = 7, budget = 1000, preferencesLength = 0 } = input;

  // Cap at 10 days - beyond that still use 8B but split the trip
  const effectiveDuration = Math.min(duration, 10);

  return (
    effectiveDuration > 5 || // Long trips need more reasoning
    budget > 2000 || // Premium trips (lowered from 3000)
    preferencesLength > 200 // Complex preferences
  );
}

/**
 * Get optimal timeout for workflow step
 * Now pro-aware for itinerary generation
 */
export function getStepTimeout(step: string, pro = false): number {
  const base: Record<string, number> = {
    research: 8000,
    validation: 4000,
    preference_analysis: 6000,
    itinerary_generation: 15000,
    recommendations: 9000,
    geocoding: 3000,
    trip_update: 10000,
    translation: 10000,
  };

  // Pro itinerary generation needs more time
  if (step === 'itinerary_generation' && pro) return 25000;

  return base[step] || 10000;
}

/**
 * Fallback chain if primary model fails
 * Maps model identifiers to their fallback options
 */
export function getFallbackModel(model: string): string | null {
  const fallbacks: Record<string, string> = {
    // Pro model (70B) falls back to default (8B)
    '@cf/meta/llama-3.1-70b-instruct-fp8-fast': '@cf/meta/llama-3.1-8b-instruct-fast',

    // Default/research (8B) falls back to validation (lightweight)
    '@cf/meta/llama-3.1-8b-instruct-fast': '@cf/ibm-granite/granite-4.0-h-micro',

    // M2M100 translation fails → fallback to LLM with strict JSON prompt
    '@cf/meta/m2m100-1.2b': '@cf/meta/llama-3.1-8b-instruct-fast',
  };
  return fallbacks[model] || null;
}

// ============================================================================
// LOGGING HELPER
// ============================================================================

/**
 * Log AI model usage for debugging and tuning
 * Call this before each AI call to track usage patterns
 */
export function logModelUsage(
  task: StrategyKey | string,
  cfg: { model: string; maxTokens: number; temperature?: number }
): void {
  console.log(
    '[AI]',
    task,
    cfg.model.split('/').pop(), // Just model name, not full path
    `maxTokens=${cfg.maxTokens}`,
    cfg.temperature !== undefined ? `temp=${cfg.temperature}` : ''
  );
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ModelKey = keyof typeof AI_MODELS;
export type StrategyKey = keyof typeof MODEL_STRATEGY;
export type PresetKey = keyof typeof AI_PRESETS;
export type JsonTaskKey = keyof typeof AI_JSON_TASKS;
