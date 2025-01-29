"use server";

import { cookies } from "next/headers";

/**
 * Get the value of a cookie by name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie or null if not found.
 */
export const getCookies = async (name) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || null;
};

/**
 * Set a cookie with a specified name, value, and options.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Additional options for the cookie.
 */
export const setCookies = async (name, value, options) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: name,
    value: value,
    httpOnly: true, // Prevent client-side JavaScript access
    path: "/", // Scope the cookie to the entire domain
    sameSite: "strict", // Prevent cross-site access by default
    secure: true, //Ensures the cookie is sent only over HTTPS connections for added security.
    ...options, // Merge additional options
  });
};

/**
 * Remove a cookie by name.
 * @param name - The name of the cookie to delete.
 */
export const removeCookies = async (name) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};

/**
 * Check a cookie by name.
 * @param name - The name of the cookie to delete.
 */
export const hasCookies = async (name) => {
  const cookieStore = await cookies();
  return cookieStore.has(name);
};

