/**
 * Shared HTTP utilities for external API calls
 * Provides consistent error handling, logging, and retry logic
 */

/**
 * HTTP GET request with JSON response
 * @param url - Full URL to fetch
 * @param init - Optional fetch init options
 * @returns Parsed JSON response
 * @throws Error on non-2xx response
 */
export async function httpGetJson<T>(url: string, init?: RequestInit): Promise<T> {
  const started = Date.now();
  
  const res = await fetch(url, {
    ...init,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
      ...(init?.headers || {}),
    },
  });
  
  const ms = Date.now() - started;

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[HTTP]', res.status, url.substring(0, 100), ms + 'ms', body.slice(0, 500));
    throw new Error(`HTTP ${res.status} for ${url.split('?')[0]}`);
  }

  console.log('[HTTP]', res.status, url.split('?')[0], ms + 'ms');
  return res.json() as Promise<T>;
}

/**
 * HTTP POST request with JSON body and response
 * @param url - Full URL to fetch
 * @param body - Request body (will be JSON stringified)
 * @param headers - Additional headers
 * @returns Parsed JSON response
 * @throws Error on non-2xx response
 */
export async function httpPostJson<T>(
  url: string, 
  body: unknown, 
  headers?: Record<string, string>
): Promise<T> {
  const started = Date.now();
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Safarnak-Travel-App/1.0 (https://safarnak.app)',
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  });
  
  const ms = Date.now() - started;

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[HTTP POST]', res.status, url.substring(0, 100), ms + 'ms', text.slice(0, 500));
    throw new Error(`HTTP ${res.status} for ${url.split('?')[0]}`);
  }

  console.log('[HTTP POST]', res.status, url.split('?')[0], ms + 'ms');
  return res.json() as Promise<T>;
}

/**
 * HTTP GET with retry logic
 * @param url - Full URL to fetch
 * @param retries - Number of retries (default 2)
 * @param delay - Delay between retries in ms (default 1000)
 */
export async function httpGetJsonWithRetry<T>(
  url: string, 
  retries = 2,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await httpGetJson<T>(url);
    } catch (err) {
      lastError = err as Error;
      console.warn(`[HTTP] Retry ${i + 1}/${retries + 1} for ${url.split('?')[0]}`);
      if (i < retries) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  
  throw lastError;
}

