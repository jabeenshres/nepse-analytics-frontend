import Homedesign from "./homedesign";
import { SERVER_BASE_URL } from "../config/constraints";
import { stock_latest_endpoint, top_stocks_endpoint, indices_list_endpoint, indices_data_endpoint } from "../config/endpoint";
import axios from "axios";
import { requireFeature, authHeaders } from "@/app/lib/auth";

export default async function Homee() {
  const me = await requireFeature("dashboard");
  const username = me?.username || "Guest";
  const headers = await authHeaders();

  let gainer = { results: [] };
  let looser = { results: [] };
  let topStocks = { stocks: [] };
  let indices = { indices: [] };
  let nepseIndex = null;

  // Fetch everything in parallel; one failing call must not block the rest.
  // (Sequential awaits made the dashboard pay the sum of five round trips.)
  const requests = [
    axios.get(`${SERVER_BASE_URL}${stock_latest_endpoint}?gainer=1&page_size=5&stock_type=stock`, { headers, timeout: 8000 }),
    axios.get(`${SERVER_BASE_URL}${stock_latest_endpoint}?gainer=0&page_size=5&stock_type=stock`, { headers, timeout: 8000 }),
    axios.get(`${SERVER_BASE_URL}${top_stocks_endpoint}?limit=6&min_score=40&stock_type=stock`, { headers, timeout: 8000 }),
    axios.get(`${SERVER_BASE_URL}${indices_list_endpoint}`, { headers, timeout: 8000 }),
    axios.get(`${SERVER_BASE_URL}${indices_data_endpoint}?index_id=58&limit=1`, { headers, timeout: 8000 }),
  ];

  const [gainerRes, looserRes, topStocksRes, indicesRes, nepseRes] =
    await Promise.allSettled(requests);

  if (gainerRes.status === "fulfilled") gainer = gainerRes.value.data;
  else console.error("Error fetching gainers:", gainerRes.reason?.message);

  if (looserRes.status === "fulfilled") looser = looserRes.value.data;
  else console.error("Error fetching losers:", looserRes.reason?.message);

  if (topStocksRes.status === "fulfilled") topStocks = topStocksRes.value.data;
  else console.error("Error fetching top stocks:", topStocksRes.reason?.message);

  if (indicesRes.status === "fulfilled") indices = indicesRes.value.data;
  else console.error("Error fetching indices:", indicesRes.reason?.message);

  if (nepseRes.status === "fulfilled" && nepseRes.value.data?.data?.length > 0) {
    nepseIndex = nepseRes.value.data.data[0];
  } else if (nepseRes.status === "rejected") {
    console.error("Error fetching NEPSE index:", nepseRes.reason?.message);
  }

  return (
    <Homedesign 
      username={username} 
      gainer={gainer} 
      looser={looser} 
      topStocks={topStocks}
      indices={indices}
      nepseIndex={nepseIndex}
    />
  );
}
