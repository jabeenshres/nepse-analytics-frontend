import React from "react";
import FetchTable from "./fetchtable";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { stock_recent_endpoint } from "../config/endpoint";
import Pagination from "@/components/Pagination/pagination";

export default async function Sharelist({ searchParams }) {
  // const token=await authorization();

  // Extract query parameters
  const searchparam = await searchParams;
  const search = searchparam?.search || "";
  const gainer = searchparam?.gainer || ""; // Optional gainer filter
  const page = parseInt(searchparam?.page || "1", 10);
  const date = searchparam?.date || "";

  // Fetch data with page, search, and gainer parameters
  const { data } = await axios.get(
    `${BASE_URL}${stock_recent_endpoint}?page=${page}&search=${search}&gainer=${gainer}&date=${date}`
  );

  const { results, count } = data;
  const totalPages = Math.ceil(count / results.length);

  return (
    <div>
      <FetchTable datas={results} searchTerm={search} gainer={gainer} />
      <div className="flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
