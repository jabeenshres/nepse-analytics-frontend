// Server-only authentication helpers.
//
// The access token lives in an httpOnly cookie, so only server components, route
// handlers and server actions can read it. Every data fetch on the server should use
// authHeaders() so the backend can enforce access.
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SERVER_BASE_URL } from "@/app/config/constraints";

export const TOKEN_COOKIE = "token";

/** Parse the token cookie. Returns null when absent or malformed. */
export async function getToken() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Headers for server-side API calls. Empty when there is no token. */
export async function authHeaders() {
  const token = await getToken();
  return token?.access ? { Authorization: `Bearer ${token.access}` } : {};
}

/**
 * Identity + allowed features for the current caller.
 *
 * Cached per request so a page and the sidebar do not make two calls. Returns null
 * when unauthenticated or the backend rejects the token.
 */
export const getMe = cache(async () => {
  const token = await getToken();
  if (!token?.access) return null;

  try {
    const response = await fetch(`${SERVER_BASE_URL}api/accounts/me/`, {
      headers: { Authorization: `Bearer ${token.access}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
});

/** Redirect to the login page unless the caller is authenticated. */
export async function requireAuth() {
  const me = await getMe();
  if (!me) redirect("/Login");
  return me;
}

/**
 * Redirect unless the caller is authenticated AND allowed the given feature.
 * Use the feature keys from src/app/config/features.js.
 */
export async function requireFeature(feature) {
  const me = await getMe();
  if (!me) redirect("/Login");
  if (feature && !(me.features || []).includes(feature)) redirect("/");
  return me;
}
