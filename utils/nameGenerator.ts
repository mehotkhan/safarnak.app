import enNamesData from '@locales/en/names.json';
import faNamesData from '@locales/fa/names.json';

/**
 * Generates a random name based on language preference
 * Format: 
 * - English (LTR): [adjective] [animal] (e.g., "brave lion")
 * - Persian (RTL): [animal] [adjective] (e.g., "شیر شجاع")
 * 
 * @param language - 'en' for English, 'fa' for Persian
 * @returns A random name string
 */
export function generateRandomName(language: 'en' | 'fa'): string {
  const isEnglish = language === 'en';
  
  const animals = isEnglish ? enNamesData.animals : faNamesData.animals;
  const adjectives = isEnglish ? enNamesData.adjectives : faNamesData.adjectives;
  
  // Get random adjective and animal
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  
  // Combine them - English: adjective + animal, Persian: animal + adjective
  if (isEnglish) {
    return `${randomAdjective} ${randomAnimal}`;
  } else {
    // Persian (RTL): animal comes first, then adjective
    return `${randomAnimal} ${randomAdjective}`;
  }
}

