"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import CandlestickChart from "@/components/CandleStick/candlestick";
import LineGraph from "@/components/LineChart/LineChart";

const ShareDataDisplay = ({ sharedata }) => {
  // console.log("Sharedata:", sharedata);

  const validatedata = sharedata.data;
  const initialvisible = 3;
  const [visibleCount, setVisibleCount] = useState(initialvisible);
  const [lineGraphData, setLineGraphData] = useState();

  const [activeTab, setActiveTab] = useState("candlestick");

  useEffect(() => {
    if (sharedata?.data?.length) {
      const labels = [];
      const actualData = [];
      const ltsmPredictedData = [];
      const rfPredictedData = [];

      // Loop through the data to arrange today's data and yesterday's predictions
      for (let i = 1; i < sharedata.data.length; i++) {
        // Start from 1 to ensure we are pairing with previous day's data
        const currentShare = sharedata.data[i];
        const previousShare = sharedata.data[i - 1];

        // Skip null entries and ensure valid data points
        if (
          !currentShare ||
          currentShare.close_price === null ||
          previousShare.LTSM_predicted_close_price === null
        )
          continue;

        // Add labels and data points: current day's actual price and previous day's prediction
        labels.unshift(currentShare.date || "Unknown Date");
        actualData.unshift(currentShare.close_price);
        ltsmPredictedData.unshift(
          previousShare.LTSM_predicted_close_price ?? null
        ); // Yesterday's LSTM prediction
        rfPredictedData.unshift(previousShare.RF_predicted_close_price ?? null); // Yesterday's RF prediction
      }

      const formattedData = {
        labels,
        datasets: [
          {
            label: "Actual Data",
            data: actualData,
            borderColor: "green",
            fill: false,
          },
          {
            label: "LSTM Predictions",
            data: ltsmPredictedData,
            borderColor: "blue",
            fill: false,
          },
          {
            label: "RF Predictions",
            data: rfPredictedData,
            borderColor: "orange",
            fill: false,
          },
        ],
      };

      setLineGraphData(formattedData);
    }
  }, [sharedata]);

  console.log("data", lineGraphData);

  // Candle stick data for the chart
  const StockCandle = validatedata.map((item) => ({
    x: new Date(item.date),
    y: [item.open_price, item.high_price, item.low_price, item.close_price],
  }));

  //prediction handling function
  const handlePredict = async () => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <div className="p-4">
        {/* Stock Details */}
        <div className=" flex justify-between mb-6 p-4 border rounded-lg shadow-lg bg-gray-100">
          <h1 className="text-3xl font-bold mb-2">
            {sharedata.security_name} ({sharedata.symbol})
          </h1>
          <button className="bg-blue-700 rounded-full hover:bg-blue-500 text-white font-bold py-2 px-4 rounded ">
            <Link
              href="../Sharelist"
              className="flex flex-row items-center gap-2 mr-20 text-lg font-bold"
            >
              <FaArrowLeft />
              Back To ShareList
            </Link>
          </button>
        </div>
      {/* block options  */}
      
      {/* Stock Details Tab */}
      <div className="container mx-auto my-4 p-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === "candlestick" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("candlestick")}>
            Candlestick Chart
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "prediction" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("prediction")}>
            Prediction Graph
          </button>
        </div>
      </div>
      {/* general block  */}
      {activeTab=="candlestick" && <div>

        {/* Stock Trading Data */}
        <h2 className="text-2xl font-bold mb-4">Stock Trading Data</h2>
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
              <th className="px-4 py-2">LTSM Prediction</th>
              <th className="px-4 py-2">RF Prediction</th>
            </tr>
          </thead>
          <tbody>
            {validatedata.slice(0, visibleCount).map((entry) => (
              <tr
                key={entry.id}
                className={`border-b font-mono text-black bg-gray-300 cursor-pointer`}
              >
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">{entry.open_price}</td>
                <td className="px-4 py-2">{entry.high_price}</td>
                <td className="px-4 py-2">{entry.low_price}</td>
                <td className="px-4 py-2">{entry.close_price}</td>
                <td className="px-4 py-2">{entry.total_traded_quantity}</td>
                <td className="px-4 py-2">{entry.market_capitalization}</td>
                <td className="px-4 py-2">
                  {entry.LTSM_predicted_close_price}
                </td>
                <td className="px-4 py-2">{entry.RF_predicted_close_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4 space-x-4">
          {visibleCount < validatedata.length && (
            <div className="text-center mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition"
                onClick={() => setVisibleCount(visibleCount + 5)}
              >
            
                {/* Increase visible count by 5 */}
                See More
              </button>
            </div>
          )}
          {visibleCount > initialvisible && (
            <div className="text-center mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition"
                onClick={() => setVisibleCount(initialvisible)}
              >
                
                {/* Reset visible count to initial value */}
                See Less
              </button>
            </div>
          )}
        </div>

        {/* Stock Candlestick Chart */}
        <div className="mt-20">
          <CandlestickChart data={StockCandle} />
        </div>
      </div>}

      {/* prediction block  */}
      {activeTab =="prediction"&&<div>
        <div className="mt-4 flex px-4 justify-center">
          <LineGraph data={lineGraphData} />
        </div>
        <div>
          <table className="table-auto w-full bg-gray-200 text-left border-collapse mt-2">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Metric</th>
                <th className="px-4 py-2">LSTM</th>
                <th className="px-4 py-2">Random Forest</th>
                <th className="px-4 py-2">Overall LSTM</th>
                <th className="px-4 py-2">Overall RF</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`border-b font-mono text-black bg-gray-300 cursor-pointer`}
              >
                <td className="px-4 py-2">Mean Absolute Error</td>
                <td className="px-4 py-2">
                  {sharedata.LTSM_Mean_Absolute_Error}
                </td>
                <td className="px-4 py-2">
                  {sharedata.RF_Mean_Absolute_Error}
                </td>
                <td className="px-4 py-2">
                  {sharedata.Overall_LTSM_Mean_Absolute_Error}
                </td>
                <td className="px-4 py-2">
                  {sharedata.Overall_RF_Mean_Absolute_Error}
                </td>
              </tr>
              <tr
                className={`border-b font-mono text-black bg-gray-300 cursor-pointer`}
              >
                <td className="px-4 py-2">R-Square</td>
                <td className="px-4 py-2">{sharedata.LTSM_R_Square}</td>
                <td className="px-4 py-2">{sharedata.RF_R_Square}</td>
                <td className="px-4 py-2">{sharedata.Overall_LTSM_R_Square}</td>
                <td className="px-4 py-2">{sharedata.Overall_RF_R_Square}</td>
              </tr>
              <tr
                className={`border-b font-mono text-black bg-gray-300 cursor-pointer`}
              >
                <td className="px-4 py-2">Tomorrow Prediction</td>
                <td className="px-4 py-2">
                  {sharedata.data[0]?.LTSM_predicted_close_price}
                </td>
                <td className="px-4 py-2">
                  {sharedata.data[0]?.RF_predicted_close_price}
                </td>
                <td className="px-4 py-2">N/A</td>
                <td className="px-4 py-2">N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
};

export default ShareDataDisplay;