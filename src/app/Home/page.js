import Homedesign from "./homedesign";
import { BASE_URL } from "../config/constraints";
import { stock_latest_endpoint, top_stocks_endpoint, indices_list_endpoint, indices_data_endpoint } from "../config/endpoint";
import axios from "axios";
import { cookies } from "next/headers";

export default async function Homee() {
  const cookieStore = await cookies();

  let username = "Guest";
  try {
    const token = JSON.parse(cookieStore.get("token")?.value);
    if (token) {
      username = token?.username ?? "Guest";
    }
  } catch (error) {
    username = "Guest";
  }

  let gainer = { results: [] };
  let looser = { results: [] };
  let topStocks = { stocks: [] };
  let indices = { indices: [] };
  let nepseIndex = null;

  try {
    // Fetch gainers and losers - ONLY regular stocks (stock_type=stock)
    const [gainerRes, looserRes] = await Promise.all([
      axios.get(`${BASE_URL}${stock_latest_endpoint}?gainer=1&page_size=5&stock_type=stock`),
      axios.get(`${BASE_URL}${stock_latest_endpoint}?gainer=0&page_size=5&stock_type=stock`),
    ]);
    gainer = gainerRes.data;
    looser = looserRes.data;
  } catch (err) {
    console.error("Error fetching gainers/losers:", err.message);
  }

  try {
    // Fetch top stocks to watch - ONLY regular stocks (stock_type=stock)
    const topStocksRes = await axios.get(`${BASE_URL}${top_stocks_endpoint}?limit=6&min_score=40&stock_type=stock`);
    topStocks = topStocksRes.data;
  } catch (err) {
    console.error("Error fetching top stocks:", err.message);
  }

  try {
    // Fetch NEPSE indices list
    const indicesRes = await axios.get(`${BASE_URL}${indices_list_endpoint}`);
    indices = indicesRes.data;
  } catch (err) {
    console.error("Error fetching indices:", err.message);
  }

  try {
    // Fetch NEPSE Index (58) latest data directly for more detail
    const nepseRes = await axios.get(`${BASE_URL}${indices_data_endpoint}?index_id=58&limit=1`);
    if (nepseRes.data?.data?.length > 0) {
      nepseIndex = nepseRes.data.data[0];
    }
  } catch (err) {
    console.error("Error fetching NEPSE index:", err.message);
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
