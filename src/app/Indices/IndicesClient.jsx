"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiGlobe, FiTrendingUp, FiTrendingDown, FiActivity, FiBarChart2, FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function IndicesClient({ indicesList, selectedAnalysis, comparison, initialSelectedId }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return parseFloat(price).toLocaleString("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatLargeNumber = (num) => {
    if (!num) return "N/A";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toLocaleString();
  };

  const mainIndex = indicesList?.indices?.find((i) => i.index_id === 58);

  // Group indices by category
  const categorizedIndices = {
    "Main Indices": indicesList?.indices?.filter((i) => [58, 57, 62, 63].includes(i.index_id)) || [],
    "Sector Indices": indicesList?.indices?.filter((i) => ![58, 57, 62, 63].includes(i.index_id)) || [],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiGlobe },
    { id: "comparison", label: "Comparison", icon: FiBarChart2 },
    { id: "details", label: "Detailed Analysis", icon: FiActivity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FiGlobe className="w-7 h-7 text-[var(--color-accent)]" />
          NEPSE Indices
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Track all market indices and sector performance
        </p>
      </div>

      {/* Main Index Hero */}
      {mainIndex && (
        <div className="card p-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: mainIndex.daily_change_percent >= 0
                ? "linear-gradient(135deg, var(--color-success) 0%, transparent 70%)"
                : "linear-gradient(135deg, var(--color-danger) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--foreground-muted)] mb-1">Main Index</p>
                <h2 className="text-3xl font-bold">{mainIndex.index_name}</h2>
                <p className="text-sm text-[var(--foreground-muted)]">Last updated: {mainIndex.latest_date}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold number-mono">{formatPrice(mainIndex.latest_close)}</div>
                <div className={`flex items-center justify-end gap-2 mt-2 ${mainIndex.daily_change_percent >= 0 ? "price-up" : "price-down"}`}>
                  {mainIndex.daily_change_percent >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                  <span className="text-xl font-semibold">
                    {mainIndex.daily_change >= 0 ? "+" : ""}{formatPrice(mainIndex.daily_change)}
                  </span>
                  <span className={`${mainIndex.daily_change_percent >= 0 ? "badge-gain" : "badge-loss"}`}>
                    {mainIndex.daily_change_percent >= 0 ? "+" : ""}{mainIndex.daily_change_percent?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-group">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-item flex items-center gap-2 ${activeTab === tab.id ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {Object.entries(categorizedIndices).map(([category, indices]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {indices.map((index) => (
                  <div
                    key={index.index_id}
                    className="card-hover p-4 cursor-pointer"
                    onClick={() => router.push(`/Indices?id=${index.index_id}`)}
                  >
                    <p className="text-sm text-[var(--foreground-muted)] truncate mb-1">
                      {index.index_name?.replace(" Index", "").replace(" SubIndex", "")}
                    </p>
                    <p className="text-xl font-bold number-mono">{formatPrice(index.latest_close)}</p>
                    <div className={`flex items-center gap-1 mt-1 text-sm font-semibold ${index.daily_change_percent >= 0 ? "price-up" : "price-down"}`}>
                      {index.daily_change_percent >= 0 ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                      {index.daily_change_percent >= 0 ? "+" : ""}{index.daily_change_percent?.toFixed(2)}%
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)] mt-2">
                      {index.record_count} records
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === "comparison" && comparison && (
        <div className="card overflow-hidden">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Index</th>
                <th className="text-right">Current</th>
                <th className="text-right">Daily Change</th>
                <th className="text-right">Period Return</th>
                <th className="text-right">Positive Days</th>
                <th className="text-right">52W High</th>
                <th className="text-right">52W Low</th>
              </tr>
            </thead>
            <tbody>
              {comparison?.comparison?.map((index) => (
                <tr
                  key={index.index_id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/Indices?id=${index.index_id}`)}
                >
                  <td className="font-semibold">{index.index_name?.replace(" Index", "").replace(" SubIndex", "")}</td>
                  <td className="text-right number-mono">{formatPrice(index.current_close)}</td>
                  <td className={`text-right number-mono ${index.daily_change_percent >= 0 ? "price-up" : "price-down"}`}>
                    {index.daily_change_percent >= 0 ? "+" : ""}{index.daily_change_percent?.toFixed(2)}%
                  </td>
                  <td className={`text-right ${index.period_return_percent >= 0 ? "price-up" : "price-down"}`}>
                    <span className={index.period_return_percent >= 0 ? "badge-gain" : "badge-loss"}>
                      {index.period_return_percent >= 0 ? "+" : ""}{index.period_return_percent?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-right">{index.positive_days_ratio?.toFixed(1)}%</td>
                  <td className="text-right number-mono">{formatPrice(index["52_week_high"])}</td>
                  <td className="text-right number-mono">{formatPrice(index["52_week_low"])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Analysis Tab */}
      {activeTab === "details" && (
        <div>
          {selectedAnalysis ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedAnalysis.index_name}</h3>
                <button onClick={() => router.push("/Indices")} className="btn-secondary">
                  View All Indices
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="stat-card">
                  <div className="stat-label">Current Close</div>
                  <div className="stat-value number-mono">{formatPrice(selectedAnalysis.current?.close)}</div>
                  <div className={`stat-change ${selectedAnalysis.current?.daily_change_percent >= 0 ? "price-up" : "price-down"}`}>
                    {selectedAnalysis.current?.daily_change_percent >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    {selectedAnalysis.current?.daily_change_percent?.toFixed(2)}%
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Period Return</div>
                  <div className={`stat-value ${selectedAnalysis.statistics?.period_return_percent >= 0 ? "price-up" : "price-down"}`}>
                    {selectedAnalysis.statistics?.period_return_percent >= 0 ? "+" : ""}{selectedAnalysis.statistics?.period_return_percent?.toFixed(2)}%
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Avg Daily Volume</div>
                  <div className="stat-value number-mono">{formatLargeNumber(selectedAnalysis.volume_analysis?.avg_daily_volume)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Turnover</div>
                  <div className="stat-value number-mono">{formatLargeNumber(selectedAnalysis.volume_analysis?.total_turnover)}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h4 className="font-semibold mb-4">Price Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Average Close</span>
                      <span className="number-mono font-semibold">{formatPrice(selectedAnalysis.statistics?.avg_close)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Max Close</span>
                      <span className="number-mono font-semibold price-up">{formatPrice(selectedAnalysis.statistics?.max_close)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Min Close</span>
                      <span className="number-mono font-semibold price-down">{formatPrice(selectedAnalysis.statistics?.min_close)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Max Daily Gain</span>
                      <span className="number-mono font-semibold price-up">+{selectedAnalysis.statistics?.max_daily_gain_percent?.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Max Daily Loss</span>
                      <span className="number-mono font-semibold price-down">{selectedAnalysis.statistics?.max_daily_loss_percent?.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h4 className="font-semibold mb-4">Market Sentiment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Positive Days</span>
                      <span className="font-semibold price-up">{selectedAnalysis.market_sentiment?.positive_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Negative Days</span>
                      <span className="font-semibold price-down">{selectedAnalysis.market_sentiment?.negative_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Unchanged Days</span>
                      <span className="font-semibold">{selectedAnalysis.market_sentiment?.unchanged_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Positive Ratio</span>
                      <span className="font-semibold">{selectedAnalysis.market_sentiment?.positive_ratio?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Trend</span>
                      <span className={`font-semibold capitalize ${selectedAnalysis.market_sentiment?.trend === "uptrend" ? "price-up" : "price-down"}`}>
                        {selectedAnalysis.market_sentiment?.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h4 className="font-semibold mb-4">52 Week Position</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Low: {formatPrice(selectedAnalysis.fifty_two_weeks?.low)}</span>
                  <span className="text-sm">High: {formatPrice(selectedAnalysis.fifty_two_weeks?.high)}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${100 - Math.abs(selectedAnalysis.fifty_two_weeks?.distance_from_high_percent || 0)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-[var(--foreground-muted)]">
                  <span>{selectedAnalysis.fifty_two_weeks?.distance_from_low_percent?.toFixed(1)}% above low</span>
                  <span>{Math.abs(selectedAnalysis.fifty_two_weeks?.distance_from_high_percent || 0).toFixed(1)}% below high</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FiActivity className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
              <h3 className="text-lg font-semibold mb-2">Select an Index</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Click on any index from the Overview tab to view detailed analysis
              </p>
              <button onClick={() => setActiveTab("overview")} className="btn-primary">
                View Indices
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
