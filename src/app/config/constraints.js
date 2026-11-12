// Browser-facing API origin. Used by client components only.
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Server-side API origin. On the VPS both apps run on the same machine, so
// calling the public domain from a server component adds DNS + TLS + nginx
// round trips for every fetch. Set API_INTERNAL_URL=http://127.0.0.1:8000/.
// It is intentionally NOT prefixed with NEXT_PUBLIC_ so it never reaches the browser.
export const SERVER_BASE_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_BASE_URL;
