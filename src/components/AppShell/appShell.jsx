"use client";

import { usePathname } from "next/navigation";

// Auth screens should be a bare box, not a dashboard page.
const AUTH_ROUTES = new Set(["/Login", "/Signup"]);

/**
 * Decides whether the dashboard chrome (sidebar + content offset) is rendered.
 *
 * The sidebar is passed in as a server-rendered element from the root layout, so it
 * is still built on auth routes; /me/ returns immediately when there is no token.
 */
export default function AppShell({ sidebar, children }) {
  const pathname = usePathname();

  if (AUTH_ROUTES.has(pathname)) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      {sidebar}
      <div className="p-4 sm:ml-64 min-h-screen">{children}</div>
    </>
  );
}
