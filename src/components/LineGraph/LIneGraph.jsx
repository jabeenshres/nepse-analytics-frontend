"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineGraph = ({ data }) => {
  if (!data) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#94a3b8",
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Actual vs Predicted Prices",
        color: "#f1f5f9",
        font: {
          size: 18,
          weight: "600",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: Rs. ${context.parsed.y?.toFixed(2) || "N/A"}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          callback: function(value) {
            return "Rs. " + value.toFixed(0);
          },
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
      },
      line: {
        tension: 0.3,
        borderWidth: 2,
      },
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor,
      backgroundColor: dataset.borderColor + "20",
      pointBackgroundColor: dataset.borderColor,
      pointBorderColor: "#0a0e1a",
      pointBorderWidth: 2,
      fill: index === 0,
    })),
  };

  return (
    <div className="w-full h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LineGraph;
