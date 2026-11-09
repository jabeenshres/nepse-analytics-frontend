import BrokerHoldingsClient from "./BrokerHoldingsClient";
import { BASE_URL } from "../config/constraints";
import { broker_holdings_endpoint } from "../config/endpoint";
import axios from "axios";
import { requireFeature, authHeaders } from "@/app/lib/auth";

const DEFAULT_SYMBOL = "KKHC";

export default async function BrokerHoldingsPage({ searchParams }) {
  await requireFeature("broker_holdings");
  const headers = await authHeaders();
  const params = await searchParams;

  const symbol = (params?.symbol || DEFAULT_SYMBOL).toUpperCase();
  const startDate = params?.start_date || "";
  const endDate = params?.end_date || "";
  const sortBy = params?.sort_by || "net";
  const minNetQty = params?.min_net_qty || "0";
  const excludeSelfTrades = params?.exclude_self_trades || "true";
  const limit = params?.limit || "50";

  let data = null;
  let error = null;

  try {
    // Only forward dates the user actually chose. When omitted, the backend
    // resolves the range to the symbol's latest available floorsheet dates,
    // which matters because floorsheet data lags well behind the current date.
    const query = new URLSearchParams({
      symbol,
      sort_by: sortBy,
      min_net_qty: minNetQty,
      exclude_self_trades: excludeSelfTrades,
      limit,
    });
    if (startDate) query.set("start_date", startDate);
    if (endDate) query.set("end_date", endDate);

    const res = await axios.get(`${BASE_URL}${broker_holdings_endpoint}?${query.toString()}`, { headers });
    data = res.data;
  } catch (err) {
    // Surface the API's own message when it sent one, so a bad symbol or a
    // malformed date reads clearly instead of showing a generic failure.
    error =
      err.response?.data?.error ||
      err.message ||
      "Failed to load broker holdings";
  }

  return (
    <BrokerHoldingsClient
      data={data}
      error={error}
      initialSymbol={symbol}
      initialStartDate={startDate}
      initialEndDate={endDate}
      initialSortBy={sortBy}
      initialMinNetQty={minNetQty}
      initialExcludeSelfTrades={excludeSelfTrades !== "false"}
      initialLimit={limit}
    />
  );
}
