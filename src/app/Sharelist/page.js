import React from "react";
import FetchTable from "./fetchtable";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { getCookies } from "@/app/utils/setCookies";
import { stock_recent_endpoint } from "../config/endpoint";
import { authorization } from "../hoc/auth";
import Pagination from "@/components/Pagination/pagination";

export default async function Sharelist({ searchParams }) {
  await authorization();

  // Extract query parameters
  const searchparam = await searchParams
  const search = searchparam?.search || "";
  const gainer = searchparam?.gainer || ""; // Optional gainer filter
  const page = parseInt(searchparam?.page || "1", 10);

  // Fetch data with page, search, and gainer parameters
  const { data } = await axios.get(
    `${BASE_URL}${stock_recent_endpoint}?page=${page}&search=${search}&gainer=${gainer}`,
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(await getCookies("token")).access}`,
      },
    }
  );

  const { results, count } = data;
  const totalPages = Math.ceil(count / results.length);

  return (
    <div>
      <FetchTable datas={results} searchTerm={search} gainer={gainer} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
