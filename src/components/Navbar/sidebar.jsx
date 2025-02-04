"use server"
import React from "react";
import { cookies } from "next/headers";
import Navbar from "./navbar";

export default async function Sidebar() {
  const cookieStore = await cookies();

  let role = "not-login";
  try {
    const token = JSON.parse(cookieStore.get("token")?.value);

    if (token) {
      role = token?.role ?? "not-login";
    }
  } catch (error) {
    role = "not-login";
  }
  
  return <Navbar role={role} />;
}
