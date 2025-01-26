import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { Auth_URL } from "@/app/config/constraints";
import { getCookies, setCookies } from "@/app/utils/setCookies";
import {jwtDecode} from "jwt-decode";

// let refreshingToken = false; // Flag to prevent multiple token refreshes

export const RefreshToken = async (token) => {
  try {
    const resp = await axios.post(
      `${BASE_URL}/token/refresh/`,
      {
        refresh: token.refresh,
      },
      {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      }
    );
    const result = resp.data;
    const newToken = {
      ...token,
      access: result.access,
      access_token_expires: result.access_token_expires,
    };

    setCookies("token", JSON.stringify(newToken));
    return result.access;
  } catch (err) {
    throw new Error("Failed to refresh token! Please log in.");
  }
};

export async function createAxiosInstance() {
  const tokenString = await getCookies("token");

  // Parse token and get accessToken if available
  const token = tokenString ? JSON.parse(tokenString) : null;
  const accessToken = token?.access || null;

  // Create an Axios instance
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return instance;
}
