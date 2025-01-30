'use client'
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

function Homedesign({ gainer, looser }) {


  const handleRowClick = (id) => {
    // Redirect to the details page for the selected stock
    redirect(`/Sharelist/${id}`);
  };

  return (
    <div>
      <section className="text-center p-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h1 className="text-4xl font-bold">Stock Market Analysis</h1>
        <p className="mt-2 text-lg">
          insights to make smarter investment decisions.
        </p>
        <button className="mt-5 px-5 py-2 text-lg bg-white text-blue-500 rounded hover:bg-gray-200">
          <Link href="/Sharelist">Explore Trends</Link>
        </button>
      </section>

      <div className="flex flex-row justify-between p-10">
        <table className="table-auto text-left border-collapse">
          <thead>
            <tr>
              <th>Table For Gainers</th>
            </tr>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Symbol</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {gainer.results.map((gain, index) => {
              // Access current and previous close prices
              const currentClosePrice = gain.data[0]?.close_price;
              const previousClosePrice = gain.data[0]?.open_price;

              // Check if both current and previous close prices are available
              const percentageChange =
                currentClosePrice && previousClosePrice
                  ? ((currentClosePrice - previousClosePrice) /
                      previousClosePrice) *
                    100
                  : null; // Handle cases where close prices might be missing

              return (
                <tr
                  key={index}
                  onClick={() => handleRowClick(gain.id)} // Use the custom handleRowClick function
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <th className="border px-4 py-2">{gain.symbol}</th>
                  <th className="border px-4 py-2">{currentClosePrice}</th>
                  <th className="border px-4 py-2">
                    {percentageChange !== null
                      ? percentageChange.toFixed(2)
                      : "N/A"}
                    %
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table className="table-auto text-left border-collapse">
          <thead>
            <tr>
              <th>Table For Losers</th>
            </tr>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Symbol</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {looser.results.map((loss, index) => {
              // Access current and previous close prices
              const currentClosePrice = loss.data[0]?.close_price;
              const previousClosePrice = loss.data[0]?.open_price;

              // Check if both current and previous close prices are available
              const percentageChange =
                currentClosePrice && previousClosePrice
                  ? ((currentClosePrice - previousClosePrice) /
                      previousClosePrice) *
                    100
                  : null; // Handle cases where close prices might be missing

              return (
                <tr
                  key={index}
                  onClick={() => handleRowClick(loss.id)} // Use the custom handleRowClick function
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <th className="border px-4 py-2">{loss.symbol}</th>
                  <th className="border px-4 py-2">{currentClosePrice}</th>
                  <th className="border px-4 py-2">
                    {percentageChange !== null
                      ? percentageChange.toFixed(2)
                      : "N/A"}
                    %
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Homedesign;
