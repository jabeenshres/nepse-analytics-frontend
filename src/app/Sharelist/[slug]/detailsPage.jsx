"use client";

import React from "react";
import Candlestick from "@/components/CandleStick/candlestick";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function Detailpage({ data = [] }) {
  // Ensure data is an array
  if (!Array.isArray(data)) {
    console.error("Invalid data format, expected an array:", data);
    data = []; // Fallback to an empty array if it's not valid
  }

  // Prepare candlestick data
  const StockCandle = data.map((item) => ({
    x: new Date(item.date),
    y: [item.open_price, item.high_price, item.low_price, item.close_price],
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-center italic mb-6">
        Stock Overview
      </h1>

      <div className="mb-8 border-b pb-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold font-serif">
            {data.security_name} ({data.symbol})
          </h2>
          <Link
            href="../Sharelist"
            className="flex flex-row items-center gap-2 text-blue-500 hover:text-blue-700 mr-20 text-lg font-bold"
          >
            <FaArrowLeft />
            Back To ShareList
          </Link>
        </div>

        <h3 className="text-xl mt-4 font-bold">Recent Trading Data</h3>
        <table className="table-auto w-full bg-gray-200 text-left border-collapse mt-2">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Open Price</th>
              <th className="px-4 py-2">High Price</th>
              <th className="px-4 py-2">Low Price</th>
              <th className="px-4 py-2">Close Price</th>
              <th className="px-4 py-2">LTP</th>
              <th className="px-4 py-2">Market Cap.</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr
                key={index}
                className={`border-b font-mono ${
                  entry.close_price > entry.open_price
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">{entry.open_price}</td>
                <td className="px-4 py-2">{entry.high_price}</td>
                <td className="px-4 py-2">{entry.low_price}</td>
                <td className="px-4 py-2">{entry.close_price}</td>
                <td className="px-4 py-2">{entry.total_traded_quantity}</td>
                <td className="px-4 py-2">{entry.market_capitalization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-20">
        <Candlestick data={StockCandle} />
      </div>
    </div>
  );
}
