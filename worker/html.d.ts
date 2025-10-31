/**
 * Type declaration for importing HTML files in Cloudflare Workers
 */

declare module '*.html' {
  const content: string;
  export default content;
}

