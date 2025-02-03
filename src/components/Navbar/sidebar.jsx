"use server"
import React from "react";
import { cookies } from "next/headers";
import Navbar from "./navbar";

export default async function Sidebar() {
  const cookieStore = await cookies();

  let role = "user";
  try {
    const token = JSON.parse(cookieStore.get("token")?.value);

    if (token) {
      role = token?.role ?? "user";
    }
  } catch (error) {
    role = "user";
  }
  const handleLogout = () => {
    // Remove token from cookies
    cookieStore.delete("token");

    // Redirect to login page
    router.push("/Login");
  };

  return <Navbar role={role} />;
}
