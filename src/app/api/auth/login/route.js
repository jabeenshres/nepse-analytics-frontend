import { NextResponse } from "next/server";

import { SERVER_BASE_URL } from "@/app/config/constraints";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // matches the backend refresh lifetime
const BACKEND_TIMEOUT_MS = 10000;

// Very small, per-process brute-force guard. nginx's login limit only covers
// direct /api/accounts/token/ calls; this route reaches Django over loopback.
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map();

function clientKey(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key) {
  const now = Date.now();

  // Keep the map from growing forever on a long-running process.
  if (attempts.size > 1000) {
    for (const [k, v] of attempts) {
      if (now - v.start > ATTEMPT_WINDOW_MS) attempts.delete(k);
    }
  }

  const entry = attempts.get(key);
  if (!entry || now - entry.start > ATTEMPT_WINDOW_MS) {
    attempts.set(key, { start: now, count: 1 });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

/**
 * Same-origin login.
 *
 * The browser posts here instead of to the public API domain:
 * - no CORS preflight,
 * - the httpOnly cookie is set on this response,
 * - the client can then do a hard navigation with the cookie already applied.
 */
export async function POST(request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in a few minutes.", code: "rate_limited" },
      { status: 429 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body.", code: "bad_request" },
      { status: 400 }
    );
  }

  const username = typeof payload?.username === "string" ? payload.username.trim() : "";
  const password = typeof payload?.password === "string" ? payload.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required.", code: "missing_credentials" },
      { status: 400 }
    );
  }

  let upstream;
  try {
    upstream = await fetch(`${SERVER_BASE_URL}api/accounts/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
    });
  } catch {
    return NextResponse.json(
      { error: "Login service is unavailable. Please try again.", code: "upstream_unreachable" },
      { status: 502 }
    );
  }

  if (upstream.status === 401) {
    return NextResponse.json(
      { error: "Invalid username or password.", code: "invalid_credentials" },
      { status: 401 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Login service error. Please try again.", code: "upstream_error" },
      { status: 502 }
    );
  }

  let token;
  try {
    token = await upstream.json();
  } catch {
    return NextResponse.json(
      { error: "Login service returned an invalid response.", code: "invalid_upstream_response" },
      { status: 502 }
    );
  }

  if (!token?.access) {
    return NextResponse.json(
      { error: "Login service returned an invalid response.", code: "invalid_upstream_response" },
      { status: 502 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, JSON.stringify(token), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
