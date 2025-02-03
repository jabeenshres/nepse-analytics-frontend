"use client";

import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { load_stock_data_endpoint, predict_stock_data_endpoint } from "@/app/config/endpoint";
import { redirect } from "next/navigation";
import { ImSpinner8 } from "react-icons/im";

export default function DownloadForm({ token }) {
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState("");
  const [predictMessage, setPredictMessage] = useState("");

  const handleClick = async () => {
    const parsedDate = parseInt(date, 10);

    if (isNaN(parsedDate) || !(parsedDate > 0 && parsedDate <= 365)) {
      setLoadMessage("Please enter a valid date between 1 and 365.");
      return;
    }

    try {
      setLoadMessage("Loading data...");
      await axios.post(
        `${BASE_URL}${load_stock_data_endpoint}`,
        { date: parsedDate },
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      setLoadMessage("Data loaded successfully!");
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        redirect("/Login");
      } else {
        setLoadMessage("Failed to load data. Please try again.");
        console.error("Failed to load data:", error);
      }
    }
  };

  const handlePrediction = async () => {
   

    try {
      setLoading(true);
      setPredictMessage("Predicting stock price...");
      await axios.get(
        `${BASE_URL}${predict_stock_data_endpoint}?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      setPredictMessage("Prediction successful!");
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        redirect("/Login");
      } else {
        setPredictMessage("Failed to predict data. Please try again.");
        console.error("Failed to predict data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 gap-10 relative">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ImSpinner8 className="text-white text-6xl animate-spin" />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <label htmlFor="numberInput" className="block text-lg font-semibold mb-2">
          Download NEPSE Data
        </label>
        <input
          type="number"
          id="numberInput"
          min="1"
          max="365"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleClick}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-900"
        >
          Load Data
        </button>
        {loadMessage && <p className="mt-4 text-center text-sm text-gray-700">{loadMessage}</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <label htmlFor="dateInput" className="block text-lg font-semibold mb-2">
          Predict Stock Price
        </label>
        <input
          type="date"
          id="dateInput"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 text-sm rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handlePrediction}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-900"
        >
          Predict
        </button>
        {predictMessage && <p className="mt-4 text-center text-sm text-gray-700">{predictMessage}</p>}
      </div>
    </div>
  );
}
