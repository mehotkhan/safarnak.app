/**
 * Type declaration for importing image assets in Cloudflare Workers
 * Wrangler treats Data files as ArrayBuffer
 */

declare module '*.png' {
  const content: ArrayBuffer;
  export default content;
}

declare module '*.jpg' {
  const content: ArrayBuffer;
  export default content;
}

declare module '*.jpeg' {
  const content: ArrayBuffer;
  export default content;
}

declare module '*.webp' {
  const content: ArrayBuffer;
  export default content;
}

