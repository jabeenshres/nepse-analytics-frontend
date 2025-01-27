import React from "react";
import { fetchData } from "../lib/api";
import FetchTable from "./fetchtable";
import { createAxiosInstance } from "../lib/api";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { getCookies } from "@/app/utils/setCookies";
import { stock_recent_endpoint } from "../config/endpoint";
import { authorization } from "../hoc/auth";


export default async function Sharelist() {
  await authorization();
   const data = await axios.get(`${BASE_URL}${stock_recent_endpoint}`,{
    headers: {
      Authorization: `Bearer ${JSON.parse(await getCookies("token")).access}`,
    },
   })  
    return (
        <div>
           <FetchTable datas={data?.data?.results} />
            {/* {data?.data?.results?.map((item, index) => (<div key={index}>{item.symbol}</div>))} */}
        </div>
    );
}