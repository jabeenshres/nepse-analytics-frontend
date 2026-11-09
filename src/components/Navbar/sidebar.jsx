"use server"
import React from "react";
import Navbar from "./navbar";
import { getMe } from "@/app/lib/auth";

export default async function Sidebar() {
  // The backend owns access rules; the sidebar only renders what /me/ allows.
  const me = await getMe();

  return (
    <Navbar
      role={me?.role || "not-login"}
      username={me?.username || ""}
      features={me?.features || []}
    />
  );
}
