"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const authorization = async () => {
  // Get token from cookie
  const cookieStore = await cookies();

  const hasToken = cookieStore.has("token");
  // const token = hasToken ? cookieStore.get("token").value : null;

  if (!hasToken) {
    redirect("/Login");
  }

  // // Get the expiryDate of access token

  // const accessTokenExpiryDate = JSON.parse(token)?.["access_token_expiration"];
  // const expiryDate = new Date(accessTokenExpiryDate).getTime();

  // // Determine is the token is expired or not
  // const isExpired = Date.now() > expiryDate;

  // if (isExpired) {
  //   redirect("/login");
  // }
};
