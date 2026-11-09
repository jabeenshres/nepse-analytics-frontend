import TopStocksClient from "./TopStocksClient";
import { BASE_URL } from "../config/constraints";
import { top_stocks_endpoint, breakout_watchlist_endpoint, accumulation_alerts_endpoint } from "../config/endpoint";
import axios from "axios";
import { requireFeature, authHeaders } from "@/app/lib/auth";

export default async function TopStocksPage({ searchParams }) {
  await requireFeature("top_stocks");
  const headers = await authHeaders();
  const params = await searchParams;
  const symbol = params?.symbol || "";
  const minScore = params?.min_score || "40";
  const limit = params?.limit || "20";
  const stockType = params?.stock_type || "stock"; // Default to regular stocks
  const analysisDate = params?.date || ""; // Date for historical analysis

  let topStocks = { stocks: [] };
  let breakoutWatchlist = { watchlist: [] };
  let accumulationAlerts = { alerts: [] };
  let singleStock = null;

  try {
    if (symbol) {
      // Fetch single stock analysis with date if provided
      let url = `${BASE_URL}${top_stocks_endpoint}?symbol=${symbol}`;
      if (analysisDate) url += `&date=${analysisDate}`;
      const res = await axios.get(url, { headers });
      singleStock = res.data;
    } else {
      // Fetch top stocks list with stock_type and date filters
      let topUrl = `${BASE_URL}${top_stocks_endpoint}?limit=${limit}&min_score=${minScore}&stock_type=${stockType}`;
      if (analysisDate) topUrl += `&date=${analysisDate}`;
      
      let breakoutUrl = `${BASE_URL}${breakout_watchlist_endpoint}?stock_type=${stockType}`;
      if (analysisDate) breakoutUrl += `&date=${analysisDate}`;
      
      let alertsUrl = `${BASE_URL}${accumulation_alerts_endpoint}?alert_level=high&stock_type=${stockType}`;
      if (analysisDate) alertsUrl += `&date=${analysisDate}`;
      
      // Fetch all three in parallel - retry logic in backend handles database locks
      const [topRes, breakoutRes, alertsRes] = await Promise.all([
        axios.get(topUrl, { headers }),
        axios.get(breakoutUrl, { headers }),
        axios.get(alertsUrl, { headers }),
      ]);
      topStocks = topRes.data;
      breakoutWatchlist = breakoutRes.data;
      accumulationAlerts = alertsRes.data;
    }
  } catch (err) {
    console.error("Error fetching top stocks:", err.message);
  }

  return (
    <TopStocksClient 
      topStocks={topStocks}
      breakoutWatchlist={breakoutWatchlist}
      accumulationAlerts={accumulationAlerts}
      singleStock={singleStock}
      initialSymbol={symbol}
      initialStockType={stockType}
      initialDate={analysisDate}
    />
  );
}
