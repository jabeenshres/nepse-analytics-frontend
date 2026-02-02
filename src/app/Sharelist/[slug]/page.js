import React from "react";
import axios from "axios";
import ShareDataDisplay from "./detailsPage";
import { BASE_URL } from "@/app/config/constraints";
import { stock_detail_endpoint } from "@/app/config/endpoint";

export default async function Page({ params }) {
  const { slug } = await params;

  let sharedata = null;

  try {
    // Fetch stock details - API is public, no auth required
    const response = await axios.get(`${BASE_URL}${stock_detail_endpoint}${slug}/`);
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

  return <ShareDataDisplay sharedata={sharedata} />;
}
