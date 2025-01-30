"use client";

import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { load_stock_data_endpoint } from "@/app/config/endpoint";
import { redirect } from "next/navigation";

export default function DownloadForm({ token }) {
  const [date, setDate] = useState(1);

  const handleClick = async () => {
    try {
      await axios.post(
        `${BASE_URL}${load_stock_data_endpoint}`,
        { date: parseInt(date, 10) },
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      console.log("Data loaded successfully");
    } catch (error) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        redirect("/Login");
      }
      console.error("Failed to load data:", error);
    }
  };

  return (
    <div>
      <input
        type="number"
        name="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleClick}>Load Data</button>
    </div>
  );
}
