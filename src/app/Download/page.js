import React from "react";
import { authorization } from "../hoc/auth";
import { redirect } from "next/navigation";
import DownloadForm from "./DownloadForm";
export default async function Sharelist() {
  const token = await authorization();
  console.log("role",token.role)

  if (token.role !== "admin") {
    redirect("/");
  }


  return (
    <div>
      <DownloadForm token={token}/>
    </div>
  );
}
