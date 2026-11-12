import { NextResponse } from "next/server";

const BASE_URL =
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://127.0.0.1:8000/";
const COOKIE_NAME = "token";

/**
 * Refresh the access token and rewrite the httpOnly cookie.
 *
 * Middleware already refreshes on navigation, but this route gives client-side code a
 * way to recover from a 401 without a full page redirect.
 */
export async function POST(request) {
  const raw = request.cookies.get(COOKIE_NAME)?.value;

  let token;
  try {
    token = raw ? JSON.parse(raw) : null;
  } catch {
    token = null;
  }

  if (!token?.refresh) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const response = await fetch(`${BASE_URL}api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: token.refresh }),
  }).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }

  const data = await response.json();
  const updated = { ...token, access: data.access };

  const nextResponse = NextResponse.json({ ok: true });
  nextResponse.cookies.set(COOKIE_NAME, JSON.stringify(updated), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return nextResponse;
}
