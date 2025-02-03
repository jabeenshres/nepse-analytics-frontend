"use client";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineGraph = ({ data }) => {
  if (!data?.labels?.length)
    return <p className="text-center mt-4 text-red-500">No Data Available</p>;

  const [visibleLines, setVisibleLines] = useState({
    actualData: true,
    ltsmPredictions: true,
    rfPredictions: true,
  });

  const toggleLineVisibility = (line) => {
    setVisibleLines((prevState) => ({
      ...prevState,
      [line]: !prevState[line],
    }));
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Actual Data",
        data: data.datasets.find((ds) => ds.label === "Actual Data").data,
        borderColor: "green",
        fill: false,
        hidden: !visibleLines.actualData, // Hide line based on state
      },
      {
        label: "LSTM Predictions",
        data: data.datasets.find((ds) => ds.label === "LSTM Predictions").data,
        borderColor: "blue",
        fill: false,
        hidden: !visibleLines.ltsmPredictions, // Hide line based on state
      },
      {
        label: "RF Predictions",
        data: data.datasets.find((ds) => ds.label === "RF Predictions").data,
        borderColor: "orange",
        fill: false,
        hidden: !visibleLines.rfPredictions, // Hide line based on state
      },
    ],
  };

  // Chart options to allow responsiveness
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow it to resize freely
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div>
      <div className="space-y-2">
        <div>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.actualData}
              onChange={() => toggleLineVisibility("actualData")}
              className="mr-2"
            />
            Actual Data
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.ltsmPredictions}
              onChange={() => toggleLineVisibility("ltsmPredictions")}
              className="mr-2"
            />
            LSTM Predictions
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.rfPredictions}
              onChange={() => toggleLineVisibility("rfPredictions")}
              className="mr-2"
            />
            RF Predictions
          </label>
        </div>
      </div>

      {/* Chart container with specific size */}
      <div style={{ width: "70vw", height: "60vh" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineGraph;