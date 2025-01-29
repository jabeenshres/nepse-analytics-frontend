import React from "react";
import axios from "axios";
import ShareDataDisplay from "./detailsPage";
import { BASE_URL } from "@/app/config/constraints";
import { stock_detail_endpoint } from "@/app/config/endpoint";
import { getCookies } from "@/app/utils/setCookies";
import { authorization } from "@/app/hoc/auth";

export default async function Page({ params }) {
  await authorization();

  const {slug} = await params;

  // Fetch stock details
  const response = await axios.get(
    `${BASE_URL}${stock_detail_endpoint}${slug}/`,
    {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(await getCookies("token")).access
        }`,
      },
    }
  );
  // console.log(response.data);

  
  return <ShareDataDisplay sharedata={response.data} />;
}
