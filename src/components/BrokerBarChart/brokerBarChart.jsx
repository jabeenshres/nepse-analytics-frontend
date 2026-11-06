"use client";
import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/**
 * Grouped horizontal bar chart comparing quantity bought vs sold per broker.
 *
 * Negative net positions are visible rather than clamped: a broker that sold more
 * than it bought is a real distributing signal, so its bars simply point in the
 * opposite direction on the shared axis.
 *
 * @param {Array} brokers      Broker records from the broker-holdings endpoint.
 * @param {number} maxBrokers  How many brokers to plot.
 */
const BrokerBarChart = ({ brokers = [], maxBrokers = 15 }) => {
  const rows = [...brokers]
    .sort((a, b) => Math.abs(b.net_qty) - Math.abs(a.net_qty))
    .slice(0, maxBrokers);

  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      animations: {
        enabled: true,
        speed: 500,
      },
      fontFamily: "inherit",
    },
    colors: ["#10b981", "#ef4444"],
    plotOptions: {
      bar: {
        horizontal: true,
        grouped: true,
        barHeight: "70%",
        borderRadius: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "13px",
      markers: { size: 5 },
    },
    xaxis: {
      categories: rows.map((b) => `Broker ${b.broker}`),
      labels: {
        formatter: (value) => Math.abs(value) >= 1000
          ? `${(Math.abs(value) / 1000).toFixed(1)}k`
          : String(Math.abs(value)),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      borderColor: "rgba(148, 163, 184, 0.1)",
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "dark",
      // `shared` and `intersect` are mutually exclusive in ApexCharts and it
      // throws if both end up true. This chart supplies a fully custom tooltip
      // body, so `shared` buys nothing here: `shared: false` with
      // `intersect: true` shows it when a bar is actually hovered and keeps the
      // config valid regardless of the library's default for `shared`.
      shared: false,
      intersect: true,
      custom: ({ series, dataPointIndex, w }) => {
        const broker = rows[dataPointIndex];
        if (!broker) return "";
        return `
          <div style="padding: 12px; background: #1e293b; border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 8px;">
            <div style="margin-bottom: 8px; color: #f1f5f9; font-size: 13px; font-weight: 600;">
              Broker ${broker.broker}
            </div>
            <div style="display: grid; gap: 4px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #94a3b8;">Bought:</span>
                <span style="color: #10b981; font-family: monospace;">${broker.bought_qty?.toLocaleString("en-NP")}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #94a3b8;">Sold:</span>
                <span style="color: #ef4444; font-family: monospace;">${broker.sold_qty?.toLocaleString("en-NP")}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #94a3b8;">Net:</span>
                <span style="color: ${broker.net_qty >= 0 ? "#10b981" : "#ef4444"}; font-family: monospace; font-weight: 600;">
                  ${broker.net_qty?.toLocaleString("en-NP")}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #94a3b8;">Share of activity:</span>
                <span style="color: #f1f5f9; font-family: monospace;">${broker.share_pct}%</span>
              </div>
            </div>
          </div>
        `;
      },
    },
  };

  const series = [
    {
      name: "Bought",
      data: rows.map((b) => b.bought_qty || 0),
    },
    {
      name: "Sold",
      // Negated so the two series mirror each other around zero: bought bars
      // extend right of the axis and sold bars extend left, which makes each
      // broker's net position readable at a glance.
      data: rows.map((b) => -(b.sold_qty || 0)),
    },
  ];

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--foreground-muted)]">
        No broker activity to chart for this range.
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={Math.max(320, rows.length * 34 + 90)}
      />
    </div>
  );
};

export default BrokerBarChart;
