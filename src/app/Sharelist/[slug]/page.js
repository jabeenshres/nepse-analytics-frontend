import React from "react";
import axios from "axios";
import Detailpage from "./detailsPage";
import { BASE_URL } from "@/app/config/constraints";
import { stock_detail_endpoint } from "@/app/config/endpoint";
import { getCookies } from "@/app/utils/setCookies";
import { authorization } from "@/app/hoc/auth";

export default async function Page({ params }) {
  await authorization()
  const { slug } = await params;

  const data = await axios.get(`${BASE_URL}${stock_detail_endpoint}${slug}`,{
    headers: {
      Authorization: `Bearer ${JSON.parse(await getCookies("token")).access}`,
    },
   })  

  return (
    <div>
      <Detailpage data={data} />
    </div>
  );
}
