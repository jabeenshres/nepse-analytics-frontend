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
        redirect("/");
      }
      console.error("Failed to load data:", error);
    }
  };

  const validateInput = () => {
    let input = document.getElementById("numberInput").value;
    let errorMessage = document.getElementById("errorMessage");
    let downloadBtn = document.getElementById("downloadBtn");

    if (input >= 1 && input <= 365) {
      errorMessage.classList.add("hidden");
      downloadBtn.classList.remove("opacity-50", "cursor-not-allowed");
      downloadBtn.disabled = false;
    } else {
      errorMessage.classList.remove("hidden");
      downloadBtn.classList.add("opacity-50", "cursor-not-allowed");
      downloadBtn.disabled = true;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <label for="numberInput" class="block text-lg font-semibold mb-2">Download NEPSE data</label>
        <input
          type="number"
          id="numberInput"
          min="1"
          max="365"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleClick} class="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-900" >Load Data</button>
      </div>
    </div>
  );
}
