import React from "react";
import UserTable from "./userTable";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { getCookies } from "@/app/utils/setCookies";
import { users_endpoint } from "../config/endpoint";
import { authorization } from "../hoc/auth";


export default async function Sharelist() {
  await authorization();

  
  // Fetch data with page, search, and gainer parameters
  const { data } = await axios.get(
    `${BASE_URL}${users_endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(await getCookies("token")).access}`,
      },
    }
  );


  return (
    <div>
      <UserTable datas={data}/>
    </div>
  );
}
