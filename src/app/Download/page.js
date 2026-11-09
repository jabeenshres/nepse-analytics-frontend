import React from "react";
import DownloadForm from "./DownloadForm";
import { requireFeature, getToken } from "@/app/lib/auth";

export default async function Download() {
  // Access is defined in accounts/access_config.py, not here.
  const me = await requireFeature("download");
  const token = await getToken();

  return (
    <div>
      <DownloadForm token={token || { username: me.username }} />
    </div>
  );
}
