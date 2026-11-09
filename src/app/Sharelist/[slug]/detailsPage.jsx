"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FiArrowLeft, FiTrendingUp, FiTrendingDown, FiActivity, FiTarget, FiBarChart2, FiInfo } from "react-icons/fi";
import CandlestickChart from "@/components/CandleStick/candlestick";
import LineGraph from "@/components/LineGraph/LIneGraph";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { analysis_signals_endpoint, analysis_indicators_endpoint } from "@/app/config/endpoint";

const ShareDataDisplay = ({ sharedata, accessToken }) => {
  const validatedata = useMemo(() => sharedata.data || [], [sharedata.data]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [lineGraphData, setLineGraphData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [signals, setSignals] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(false);

  const latestData = validatedata[0];
  const previousData = validatedata[1];

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return parseFloat(price).toLocaleString("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Use percentage_change from API (calculated correctly on backend)
  // Fallback calculation using previous_day_close_price if API doesn't provide it
  const calculateChange = () => {
    // First try to use percentage_change from API
    if (latestData?.percentage_change !== null && latestData?.percentage_change !== undefined) {
      return parseFloat(latestData.percentage_change);
    }
    // Fallback: use previous_day_close_price (correct formula)
    if (latestData?.close_price && latestData?.previous_day_close_price && latestData.previous_day_close_price > 0) {
      return ((parseFloat(latestData.close_price) - parseFloat(latestData.previous_day_close_price)) / parseFloat(latestData.previous_day_close_price)) * 100;
    }
    return null;
  };

  const change = calculateChange();
  const isGain = change !== null && change > 0;

  // Fetch signals and indicators
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      const authConfig = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {};
      try {
        const [signalsRes, indicatorsRes] = await Promise.all([
          axios.get(`${BASE_URL}${analysis_signals_endpoint}?symbol=${sharedata.symbol}`, authConfig),
          axios.get(`${BASE_URL}${analysis_indicators_endpoint}?symbol=${sharedata.symbol}&days=30`, authConfig),
        ]);
        setSignals(signalsRes.data);
        setIndicators(indicatorsRes.data);
      } catch (err) {
        console.error("Error fetching analysis:", err);
      }
      setLoading(false);
    };

    if (sharedata.symbol) {
      fetchAnalysis();
    }
  }, [sharedata.symbol, accessToken]);

  // Prepare line graph data
  useEffect(() => {
    if (validatedata?.length) {
      const labels = [];
      const actualData = [];
      const ltsmPredictedData = [];
      const rfPredictedData = [];

      for (let i = 1; i < validatedata.length && i < 30; i++) {
        const currentShare = validatedata[i];
        const previousShare = validatedata[i - 1];

        if (!currentShare || currentShare.close_price === null) continue;

        labels.unshift(currentShare.date || "Unknown Date");
        actualData.unshift(parseFloat(currentShare.close_price));
        ltsmPredictedData.unshift(previousShare?.LSTM_predicted_close_price ? parseFloat(previousShare.LSTM_predicted_close_price) : null);
        rfPredictedData.unshift(previousShare?.RF_predicted_close_price ? parseFloat(previousShare.RF_predicted_close_price) : null);
      }

      setLineGraphData({
        labels,
        datasets: [
          { label: "Actual Price", data: actualData, borderColor: "#10b981", fill: false },
          { label: "LSTM Prediction", data: ltsmPredictedData, borderColor: "#3b82f6", fill: false },
          { label: "RF Prediction", data: rfPredictedData, borderColor: "#f59e0b", fill: false },
        ],
      });
    }
  }, [validatedata]);

  const StockCandle = validatedata.slice(0, 60).map((item) => ({
    x: new Date(item.date),
    y: [parseFloat(item.open_price), parseFloat(item.high_price), parseFloat(item.low_price), parseFloat(item.close_price)],
  }));

  const getSignalBadge = (recommendation) => {
    const badges = {
      STRONG_BUY: "signal-strong-buy",
      BUY: "signal-buy",
      HOLD: "signal-hold",
      SELL: "signal-sell",
      STRONG_SELL: "signal-strong-sell",
    };
    return badges[recommendation] || "signal-hold";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart2 },
    { id: "chart", label: "Price Chart", icon: FiActivity },
    { id: "prediction", label: "Predictions", icon: FiTarget },
    { id: "technical", label: "Technical Analysis", icon: FiInfo },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/Sharelist" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:underline mb-2">
            <FiArrowLeft className="w-4 h-4" />
            Back to Stock List
          </Link>
          <h1 className="text-3xl font-bold">{sharedata.symbol}</h1>
          <p className="text-[var(--foreground-muted)]">{sharedata.security_name}</p>
        </div>
        {signals && (
          <div className="flex items-center gap-4">
            <span className={getSignalBadge(signals.recommendation)}>
              {signals.recommendation?.replace("_", " ")}
            </span>
            <span className="text-sm text-[var(--foreground-muted)]">
              Signal Strength: {signals.strength}
            </span>
          </div>
        )}
      </div>

      {/* Price Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="stat-label">Current Price</div>
          <div className="stat-value number-mono">Rs. {formatPrice(latestData?.close_price)}</div>
          <div className={`stat-change ${isGain ? "price-up" : "price-down"}`}>
            {isGain ? <FiTrendingUp /> : <FiTrendingDown />}
            {change !== null ? `${isGain ? "+" : ""}${change.toFixed(2)}%` : "N/A"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open</div>
          <div className="stat-value number-mono">{formatPrice(latestData?.open_price)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">High</div>
          <div className="stat-value number-mono price-up">{formatPrice(latestData?.high_price)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low</div>
          <div className="stat-value number-mono price-down">{formatPrice(latestData?.low_price)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Volume</div>
          <div className="stat-value number-mono">{latestData?.total_traded_quantity?.toLocaleString()}</div>
        </div>
      </div>

      {/* 52 Week Range */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--foreground-muted)]">52 Week Range</span>
          <span className="text-sm number-mono">
            {formatPrice(sharedata.fifty_two_weeks_low)} - {formatPrice(sharedata.fifty_two_weeks_high)}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                ((parseFloat(latestData?.close_price) - parseFloat(sharedata.fifty_two_weeks_low)) /
                  (parseFloat(sharedata.fifty_two_weeks_high) - parseFloat(sharedata.fifty_two_weeks_low))) *
                100
              }%`,
            }}
          />
        </div>
      </div>

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

      {/* Tab Content */}
      <div className="card p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Recent Trading Data</h3>
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th className="text-right">Open</th>
                    <th className="text-right">High</th>
                    <th className="text-right">Low</th>
                    <th className="text-right">Close</th>
                    <th className="text-right">Volume</th>
                    <th className="text-right">LSTM Pred.</th>
                    <th className="text-right">RF Pred.</th>
                  </tr>
                </thead>
                <tbody>
                  {validatedata.slice(0, visibleCount).map((entry, idx) => (
                    <tr key={entry.id || idx}>
                      <td>{entry.date}</td>
                      <td className="text-right number-mono">{formatPrice(entry.open_price)}</td>
                      <td className="text-right number-mono">{formatPrice(entry.high_price)}</td>
                      <td className="text-right number-mono">{formatPrice(entry.low_price)}</td>
                      <td className="text-right number-mono font-semibold">{formatPrice(entry.close_price)}</td>
                      <td className="text-right number-mono">{entry.total_traded_quantity?.toLocaleString()}</td>
                      <td className="text-right number-mono text-[var(--chart-blue)]">
                        {formatPrice(entry.LSTM_predicted_close_price)}
                      </td>
                      <td className="text-right number-mono text-[var(--chart-orange)]">
                        {formatPrice(entry.RF_predicted_close_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4">
              {visibleCount < validatedata.length && (
                <button onClick={() => setVisibleCount(visibleCount + 10)} className="btn-secondary">
                  Show More
                </button>
              )}
              {visibleCount > 5 && (
                <button onClick={() => setVisibleCount(5)} className="btn-secondary">
                  Show Less
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "chart" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Candlestick Chart</h3>
            <CandlestickChart data={StockCandle} />
          </div>
        )}

        {activeTab === "prediction" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Prediction Comparison</h3>
              {lineGraphData && <LineGraph data={lineGraphData} />}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-4">
                <h4 className="font-semibold mb-4">Tomorrow&apos;s Prediction</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--foreground-muted)]">LSTM Model</span>
                    <span className="text-xl font-bold number-mono text-[var(--chart-blue)]">
                      Rs. {formatPrice(latestData?.LSTM_predicted_close_price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--foreground-muted)]">Random Forest</span>
                    <span className="text-xl font-bold number-mono text-[var(--chart-orange)]">
                      Rs. {formatPrice(latestData?.RF_predicted_close_price)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h4 className="font-semibold mb-4">Model Performance</h4>
                <div className="overflow-x-auto">
                  <table className="table-modern">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th className="text-right">LSTM</th>
                        <th className="text-right">RF</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Mean Absolute Error</td>
                        <td className="text-right number-mono">{sharedata.LSTM_Mean_Absolute_Error || "N/A"}</td>
                        <td className="text-right number-mono">{sharedata.RF_Mean_Absolute_Error || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>R-Squared</td>
                        <td className="text-right number-mono">{sharedata.LSTM_R_Square || "N/A"}</td>
                        <td className="text-right number-mono">{sharedata.RF_R_Square || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "technical" && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]"></div>
              </div>
            ) : signals ? (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="stat-card">
                    <div className="stat-label">Signal Strength</div>
                    <div className="stat-value">{signals.strength}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Recommendation</div>
                    <div className="stat-value">
                      <span className={getSignalBadge(signals.recommendation)}>
                        {signals.recommendation?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Active Signals</div>
                    <div className="stat-value">{signals.signal_count}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Trading Signals</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {signals.signals?.map((signal, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          signal.strength === "BULLISH"
                            ? "border-[var(--color-success)] bg-[var(--color-success-bg)]"
                            : signal.strength === "BEARISH"
                            ? "border-[var(--color-danger)] bg-[var(--color-danger-bg)]"
                            : "border-[var(--border-color)] bg-[var(--background-secondary)]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{signal.indicator}</span>
                          <span
                            className={`text-xs font-bold ${
                              signal.strength === "BULLISH"
                                ? "text-[var(--color-success)]"
                                : signal.strength === "BEARISH"
                                ? "text-[var(--color-danger)]"
                                : "text-[var(--foreground-muted)]"
                            }`}
                          >
                            {signal.strength}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--foreground-secondary)]">{signal.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {signals.key_levels && (
                  <div>
                    <h4 className="font-semibold mb-4">Key Price Levels</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="card p-4">
                        <div className="text-sm text-[var(--foreground-muted)] mb-1">Support</div>
                        <div className="text-lg font-bold number-mono price-up">
                          Rs. {formatPrice(signals.key_levels.support)}
                        </div>
                      </div>
                      <div className="card p-4">
                        <div className="text-sm text-[var(--foreground-muted)] mb-1">Resistance</div>
                        <div className="text-lg font-bold number-mono price-down">
                          Rs. {formatPrice(signals.key_levels.resistance)}
                        </div>
                      </div>
                      <div className="card p-4">
                        <div className="text-sm text-[var(--foreground-muted)] mb-1">SMA 20</div>
                        <div className="text-lg font-bold number-mono">
                          Rs. {formatPrice(signals.key_levels.sma_20)}
                        </div>
                      </div>
                      <div className="card p-4">
                        <div className="text-sm text-[var(--foreground-muted)] mb-1">SMA 50</div>
                        <div className="text-lg font-bold number-mono">
                          Rs. {formatPrice(signals.key_levels.sma_50)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[var(--foreground-muted)] text-center py-8">
                Technical analysis data not available for this stock.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareDataDisplay;
