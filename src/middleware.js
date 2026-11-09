import { NextResponse } from "next/server";
import { isPublicPath } from "./app/config/features";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000/";
const COOKIE_NAME = "token";

function decodeExpiry(jwt) {
  try {
    const payload = jwt.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function loginRedirect(request) {
  const url = request.nextUrl.clone();
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/Login";
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

async function refreshAccess(refresh) {
  const response = await fetch(`${BASE_URL}api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) return null;
  return response.json();
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Signup is disabled for now. Redirect at the edge so the route never renders.
  if (pathname === "/Signup") {
    const url = request.nextUrl.clone();
    url.pathname = "/Login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const raw = request.cookies.get(COOKIE_NAME)?.value;
  if (!raw) {
    return loginRedirect(request);
  }

  let token;
  try {
    token = JSON.parse(raw);
  } catch {
    return loginRedirect(request);
  }

  const expiresAt = decodeExpiry(token?.access || "");
  const now = Math.floor(Date.now() / 1000);

  // Still valid (with a small clock-skew margin): let it through.
  if (expiresAt && expiresAt - now > 60) {
    return NextResponse.next();
  }

  // Access expired or unreadable: try the refresh token and rewrite the cookie.
  if (token?.refresh) {
    const refreshed = await refreshAccess(token.refresh).catch(() => null);
    if (refreshed?.access) {
      const updated = {
        ...token,
        access: refreshed.access,
        access_expires_at: refreshed.access_expires_at ?? token.access_expires_at,
      };

      // Rewrite the cookie for the browser AND for this render. Setting only the
      // response cookie would leave the current server render reading the expired
      // token from the incoming request.
      const cookieHeader = request.headers.get("cookie") || "";
      const kept = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .filter((part) => part && !part.startsWith(`${COOKIE_NAME}=`));
      kept.push(`${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(updated))}`);

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("cookie", kept.join("; "));

      const response = NextResponse.next({ request: { headers: requestHeaders } });
      response.cookies.set(COOKIE_NAME, JSON.stringify(updated), {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: true,
      });
      return response;
    }
  }

  return loginRedirect(request);
}

export const config = {
  // Skip Next internals, static assets and the auth route handlers.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.ico|images|api/auth).*)",
  ],
};
