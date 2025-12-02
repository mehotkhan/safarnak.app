/**
 * AI-based fact synthesis for destination data
 * Fills in fields that APIs can't reliably provide (timezone, currency, cost, climate, etc.)
 */

import type { Env } from '../../types';
import type { DestinationFacts } from './types';
import { AI_MODELS, AI_PRESETS } from '../ai/models';

/**
 * Synthesize destination facts using AI
 * Fills in timezone, currency, language, cost ranges, climate, best months
 */
export async function synthesizeFacts(
  env: Env,
  base: {
    destination: string;
    country?: string;
    wikiExtract?: string;
  }
): Promise<Pick<DestinationFacts, 'timezone' | 'currency' | 'language' | 'avgCost' | 'bestMonths' | 'climate' | 'population'>> {
  try {
    const prompt = `You are a travel expert. Provide factual information about ${base.destination}${base.country ? `, ${base.country}` : ''} in JSON format.

${base.wikiExtract ? `Context: ${base.wikiExtract.substring(0, 500)}\n\n` : ''}

Respond with ONLY valid JSON (no markdown):
{
  "timezone": "timezone identifier (e.g., Asia/Tehran, America/New_York)",
  "currency": "currency code (e.g., USD, IRR, EUR)",
  "language": "primary language name",
  "avgCost": {
    "budget": daily cost in USD for budget travelers,
    "mid": daily cost in USD for mid-range travelers,
    "luxury": daily cost in USD for luxury travelers
  },
  "bestMonths": ["month names when weather is best (e.g., March, April, May)"],
  "climate": "brief climate description (2-3 sentences)",
  "population": approximate population number or null
}`;
    
    const aiResponse: any = await env.AI.run(AI_MODELS.RESEARCH as any, {
      prompt,
      max_tokens: AI_PRESETS.researchDestination.max_tokens,
      temperature: AI_PRESETS.researchDestination.temperature,
    });
    
    const text = typeof aiResponse === 'string' ? aiResponse : 
                 aiResponse?.response || aiResponse?.generated_text || '{}';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const aiData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    
    return {
      timezone: aiData.timezone || 'UTC',
      currency: aiData.currency || 'USD',
      language: aiData.language || 'English',
      avgCost: aiData.avgCost || { budget: 30, mid: 60, luxury: 150 },
      bestMonths: Array.isArray(aiData.bestMonths) ? aiData.bestMonths : [],
      climate: aiData.climate || '',
      population: aiData.population || undefined,
    };
  } catch (error) {
    console.error('[Synthesize] AI synthesis failed:', error);
    // Return safe defaults
    return {
      timezone: 'UTC',
      currency: 'USD',
      language: 'English',
      avgCost: { budget: 30, mid: 60, luxury: 150 },
      bestMonths: [],
      climate: '',
      population: undefined,
    };
  }
}

/**
 * Synthesize transport info using AI
 */
export async function synthesizeTransportInfo(
  env: Env,
  destination: string,
  country?: string
): Promise<{
  airport?: string;
  metro: boolean;
  taxi: { avgCost: number; apps: string[] };
  bus: { avgCost: number };
}> {
  try {
    const prompt = `What are the main transportation options in ${destination}${country ? `, ${country}` : ''}? Respond with JSON only:
{
  "airport": "airport code or null",
  "metro": true/false,
  "taxi": {"avgCost": number in USD, "apps": ["app names"]},
  "bus": {"avgCost": number in USD}
}`;
    
    const aiResponse: any = await env.AI.run(AI_MODELS.RESEARCH as any, {
      prompt,
      max_tokens: AI_PRESETS.researchDestination.max_tokens,
      temperature: AI_PRESETS.researchDestination.temperature,
    });
    
    const text = typeof aiResponse === 'string' ? aiResponse : 
                 aiResponse?.response || aiResponse?.generated_text || '{}';
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    
    return {
      airport: data.airport || undefined,
      metro: data.metro || false,
      taxi: data.taxi || { avgCost: 10, apps: [] },
      bus: data.bus || { avgCost: 2 },
    };
  } catch (error) {
    console.error('[Synthesize] Transport info synthesis failed:', error);
    return {
      metro: false,
      taxi: { avgCost: 10, apps: [] },
      bus: { avgCost: 2 },
    };
  }
}

