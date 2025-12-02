/**
 * Wikivoyage / Wikipedia API Client
 * Human-written travel guides under CC BY-SA 4.0
 * 
 * Wikivoyage: Free travel guide (en.wikivoyage.org)
 * Wikipedia: For fallback destination info
 * 
 * No API key required
 */

import { httpGetJson } from './http';

/**
 * Page summary from Wikipedia/Wikivoyage REST API
 */
export interface PageSummary {
  title: string;
  displaytitle?: string;
  pageid?: number;
  extract: string;
  extract_html?: string;
  description?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls?: {
    desktop: { page: string };
    mobile: { page: string };
  };
}

/**
 * Get destination summary from Wikivoyage
 * Falls back to Wikipedia if Wikivoyage has no article
 */
export async function getDestinationSummary(
  destination: string,
  lang = 'en'
): Promise<PageSummary | null> {
  const encoded = encodeURIComponent(destination.replace(/ /g, '_'));

  // Try Wikivoyage first
  try {
    const wikivoyageUrl = `https://${lang}.wikivoyage.org/api/rest_v1/page/summary/${encoded}`;
    const data = await httpGetJson<PageSummary>(wikivoyageUrl);
    
    if (data?.extract) {
      console.log(`[Wikivoyage] Found article for: ${destination}`);
      return data;
    }
  } catch {
    console.log(`[Wikivoyage] No article for: ${destination}, trying Wikipedia`);
  }

  // Fallback to Wikipedia
  try {
    const wikipediaUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
    const data = await httpGetJson<PageSummary>(wikipediaUrl);
    
    if (data?.extract) {
      console.log(`[Wikipedia] Found article for: ${destination}`);
      return data;
    }
  } catch (err) {
    console.warn(`[Wikipedia] No article for: ${destination}`, err);
  }

  return null;
}

/**
 * Search for destination pages
 */
export async function searchDestination(
  query: string,
  lang = 'en',
  limit = 5
): Promise<Array<{ title: string; description?: string }>> {
  const encoded = encodeURIComponent(query);
  
  // Try Wikivoyage first
  try {
    const url = `https://${lang}.wikivoyage.org/w/api.php?` +
      `action=query&list=search&srsearch=${encoded}&srlimit=${limit}&format=json&origin=*`;
    
    const data = await httpGetJson<any>(url);
    const results = data?.query?.search || [];
    
    if (results.length > 0) {
      return results.map((r: any) => ({
        title: r.title,
        description: r.snippet?.replace(/<[^>]*>/g, ''),
      }));
    }
  } catch {
    // Try Wikipedia
  }

  try {
    const url = `https://${lang}.wikipedia.org/w/api.php?` +
      `action=query&list=search&srsearch=${encoded}&srlimit=${limit}&format=json&origin=*`;
    
    const data = await httpGetJson<any>(url);
    const results = data?.query?.search || [];
    
    return results.map((r: any) => ({
      title: r.title,
      description: r.snippet?.replace(/<[^>]*>/g, ''),
    }));
  } catch (err) {
    console.warn('[Wiki Search] Failed for:', query, err);
    return [];
  }
}

/**
 * Get sections/TOC from Wikivoyage article
 * Useful for getting "See", "Do", "Eat", "Sleep" sections
 */
export async function getArticleSections(
  destination: string,
  lang = 'en'
): Promise<Array<{ level: number; line: string; index: string }>> {
  const encoded = encodeURIComponent(destination.replace(/ /g, '_'));
  
  try {
    const url = `https://${lang}.wikivoyage.org/w/api.php?` +
      `action=parse&page=${encoded}&prop=sections&format=json&origin=*`;
    
    const data = await httpGetJson<any>(url);
    return data?.parse?.sections || [];
  } catch (err) {
    console.warn('[Wikivoyage] Get sections failed for:', destination, err);
    return [];
  }
}

/**
 * Get specific section content from Wikivoyage
 * @param sectionIndex - Section index from getArticleSections
 */
export async function getSectionContent(
  destination: string,
  sectionIndex: string,
  lang = 'en'
): Promise<string | null> {
  const encoded = encodeURIComponent(destination.replace(/ /g, '_'));
  
  try {
    const url = `https://${lang}.wikivoyage.org/w/api.php?` +
      `action=parse&page=${encoded}&section=${sectionIndex}&prop=text&format=json&origin=*`;
    
    const data = await httpGetJson<any>(url);
    const html = data?.parse?.text?.['*'] || '';
    
    // Strip HTML tags for plain text
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.warn('[Wikivoyage] Get section content failed:', err);
    return null;
  }
}

/**
 * Extract key travel info from Wikivoyage article
 * Returns info about See, Do, Eat, Sleep sections
 */
export async function getTravelGuideInfo(
  destination: string,
  lang = 'en'
): Promise<{
  summary: string;
  seeDo?: string;
  eat?: string;
  sleep?: string;
}> {
  const summary = await getDestinationSummary(destination, lang);
  const sections = await getArticleSections(destination, lang);
  
  const result: {
    summary: string;
    seeDo?: string;
    eat?: string;
    sleep?: string;
  } = {
    summary: summary?.extract || `Information about ${destination}`,
  };

  // Find and extract key sections
  for (const section of sections) {
    const line = section.line.toLowerCase();
    
    if (line.includes('see') || line.includes('do')) {
      const content = await getSectionContent(destination, section.index, lang);
      if (content) {
        result.seeDo = content.substring(0, 1000); // Limit size
      }
    } else if (line.includes('eat') || line.includes('drink')) {
      const content = await getSectionContent(destination, section.index, lang);
      if (content) {
        result.eat = content.substring(0, 500);
      }
    } else if (line.includes('sleep') || line.includes('stay')) {
      const content = await getSectionContent(destination, section.index, lang);
      if (content) {
        result.sleep = content.substring(0, 500);
      }
    }
  }

  return result;
}

