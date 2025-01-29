import React from "react";
import UserTable from "./userTable";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { getCookies } from "@/app/utils/setCookies";
import { users_endpoint } from "../config/endpoint";
import { authorization } from "../hoc/auth";
import { redirect } from "next/navigation";

export default async function Sharelist() {
  const token = await authorization();
  console.log("role",token.role)

  if (token.role !== "admin") {
    redirect("/");
  }

  let data = [];

  try {
    const response = await axios.get(`${BASE_URL}${users_endpoint}`, {
      headers: {
        Authorization: `Bearer ${token.access}`,
      },
    });

    data = response.data;

  } catch (err) {
    if (err.response?.status === 403 || err.response?.status === 401) {
      redirect("/");
    }
  }

  return (
    <div>
      <UserTable datas={data} />
    </div>
  );
}
