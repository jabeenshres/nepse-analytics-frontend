import React from "react";
import UserTable from "./userTable";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { users_endpoint } from "../config/endpoint";
import { requireFeature, authHeaders, getToken } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Sharelist() {
  const me = await requireFeature("users");
  const token = await getToken();
  const headers = await authHeaders();

  let data = [];

  try {
    const response = await axios.get(`${BASE_URL}${users_endpoint}`, { headers });
    data = response.data;
  } catch (err) {
    if (err.response?.status === 403 || err.response?.status === 401) {
      redirect("/");
    }
  }

  return (
    <div>
      <UserTable datas={data} username={me?.username || token?.username} />
    </div>
  );
}
