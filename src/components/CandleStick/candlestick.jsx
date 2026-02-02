"use client";
import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CandlestickChart = ({ data }) => {
  const options = {
    chart: {
      type: "candlestick",
      toolbar: { 
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: 'zoom'
      },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    title: {
      text: "Price Chart",
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#f1f5f9",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd MMM",
        style: {
          colors: "#94a3b8",
          fontSize: "12px",
        },
        datetimeUTC: false,
      },
      axisBorder: {
        color: "rgba(148, 163, 184, 0.2)",
      },
      axisTicks: {
        color: "rgba(148, 163, 184, 0.2)",
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "12px",
        },
        formatter: (value) => {
          return "Rs. " + value?.toFixed(2);
        },
      },
    },
    grid: {
      borderColor: "rgba(148, 163, 184, 0.1)",
      strokeDashArray: 3,
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981",
          downward: "#ef4444",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    tooltip: {
      theme: "dark",
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
        
        return `
          <div style="padding: 12px; background: #1e293b; border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 8px;">
            <div style="margin-bottom: 8px; color: #94a3b8; font-size: 12px;">
              ${date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
            <div style="display: grid; gap: 4px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #94a3b8;">Open:</span>
                <span style="color: #f1f5f9; font-family: monospace;">Rs. ${o?.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #94a3b8;">High:</span>
                <span style="color: #10b981; font-family: monospace;">Rs. ${h?.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #94a3b8;">Low:</span>
                <span style="color: #ef4444; font-family: monospace;">Rs. ${l?.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #94a3b8;">Close:</span>
                <span style="color: ${c >= o ? '#10b981' : '#ef4444'}; font-family: monospace; font-weight: 600;">Rs. ${c?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        `;
      },
    },
  };

  const series = [
    {
      name: "Price",
      data: data,
    },
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="candlestick" height={400} />
    </div>
  );
};

export default CandlestickChart;
