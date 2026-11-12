import React from "react";
import axios from "axios";
import ShareDataDisplay from "./detailsPage";
import { SERVER_BASE_URL } from "@/app/config/constraints";
import { stock_detail_endpoint } from "@/app/config/endpoint";
import { requireFeature, authHeaders, getToken } from "@/app/lib/auth";

export default async function Page({ params }) {
  await requireFeature("sharelist");
  const headers = await authHeaders();
  const token = await getToken();

  const { slug } = await params;

  let sharedata = null;

  try {
    const response = await axios.get(`${SERVER_BASE_URL}${stock_detail_endpoint}${slug}/`, { headers, timeout: 8000 });
    sharedata = response.data;
  } catch (error) {
    console.error("Error fetching stock details:", error.message);
    // Return a placeholder if fetch fails
    sharedata = {
      symbol: "ERROR",
      security_name: "Could not load stock data",
      data: [],
    };
  }

  // The analysis panels fetch from the browser, so they need the access token.
  return <ShareDataDisplay sharedata={sharedata} accessToken={token?.access} />;
}
