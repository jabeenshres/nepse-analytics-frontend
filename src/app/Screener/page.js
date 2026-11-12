import ScreenerClient from "./ScreenerClient";
import { SERVER_BASE_URL } from "../config/constraints";
import { analysis_screener_endpoint } from "../config/endpoint";
import axios from "axios";
import { requireFeature, authHeaders } from "@/app/lib/auth";

export default async function ScreenerPage({ searchParams }) {
  await requireFeature("screener");
  const headers = await authHeaders();
  const params = await searchParams;
  const type = params?.type || "momentum";
  const minPrice = params?.min_price || "";
  const maxPrice = params?.max_price || "";
  const limit = params?.limit || "30";
  const stockType = params?.stock_type || "stock"; // Default to regular stocks

  let screenerResults = { results: [] };

  try {
    let url = `${SERVER_BASE_URL}${analysis_screener_endpoint}?type=${type}&limit=${limit}&stock_type=${stockType}`;
    if (minPrice) url += `&min_price=${minPrice}`;
    if (maxPrice) url += `&max_price=${maxPrice}`;
    
    const res = await axios.get(url, { headers, timeout: 8000 });
    screenerResults = res.data;
  } catch (err) {
    console.error("Error fetching screener:", err.message);
  }

  return (
    <ScreenerClient 
      screenerResults={screenerResults}
      initialType={type}
      initialMinPrice={minPrice}
      initialMaxPrice={maxPrice}
      initialStockType={stockType}
    />
  );
}
