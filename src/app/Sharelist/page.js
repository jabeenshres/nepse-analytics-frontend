import React from "react";
import FetchTable from "./fetchtable";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { stock_latest_endpoint } from "../config/endpoint";
import Pagination from "@/components/Pagination/pagination";
import { requireFeature, authHeaders } from "@/app/lib/auth";

export default async function Sharelist({ searchParams }) {
  await requireFeature("sharelist");
  const headers = await authHeaders();
  const searchparam = await searchParams;
  const search = searchparam?.search || "";
  const gainer = searchparam?.gainer || "";
  const page = parseInt(searchparam?.page || "1", 10);
  const date = searchparam?.date || "";
  const stockType = searchparam?.stock_type || "stock"; // Default to regular stocks

  let results = [];
  let count = 0;
  let totalPages = 1;

  try {
    // Build the query string with stock_type filter
    let url = `${BASE_URL}${stock_latest_endpoint}?page=${page}&stock_type=${stockType}`;
    if (search) url += `&search=${search}`;
    if (gainer) url += `&gainer=${gainer}`;
    if (date) url += `&date=${date}`;

    const { data } = await axios.get(url, { headers });
    results = data.results || [];
    count = data.count || 0;
    
    // Calculate total pages
    const pageSize = results.length || 20;
    totalPages = Math.ceil(count / pageSize) || 1;
  } catch (err) {
    console.error("Error fetching stock list:", err.message);
  }

  return (
    <div className="space-y-6">
      <FetchTable 
        datas={results} 
        searchTerm={search} 
        gainer={gainer} 
        date={date} 
        stockType={stockType}
      />
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
