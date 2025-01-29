"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const authorization = async () => {
  // Get token from cookie
  const cookieStore = await cookies();

  const Token = cookieStore.get("token");
  console.log("hasToken",Token)

  if (!Token) {
    redirect("/Login");
  }
  return Token?.value;

   
};
