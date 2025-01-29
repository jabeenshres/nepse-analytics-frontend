"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CandlestickChart = ({ data }) => {
  const options = {
    chart: {
      type: "candlestick",
      toolbar: { show: true },
    },
    title: {
      text: "Stock Candlestick Chart",
      align: "center",
      style:{
        fontSize: "30px",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
      }
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd/MM/yyyy",
      }
    },
  };

  const series = [
    {
      name: "Stock Price",
      data: data, 
    },
  ];

  return <Chart options={options} series={series} type="candlestick" height={350} />;
};

export default CandlestickChart;