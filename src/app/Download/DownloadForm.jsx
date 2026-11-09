"use client";

import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { stock_fetch_endpoint } from "@/app/config/endpoint";
import { FiDownload, FiCalendar, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

export default function DownloadForm({ token }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState({ type: "", text: "" });
  const [stats, setStats] = useState(null);

  const handleFetchData = async () => {
    if (!dateFrom || !dateTo) {
      setLoadMessage({ type: "error", text: "Please select both start and end dates." });
      return;
    }

    try {
      setLoading(true);
      setLoadMessage({ type: "info", text: "Fetching data from Nepal Stock Exchange..." });
      setStats(null);

      const response = await axios.post(
        `${BASE_URL}${stock_fetch_endpoint}`,
        { 
          date_from: dateFrom, 
          date_to: dateTo 
        },
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );

      setStats(response.data.statistics);
      setLoadMessage({ type: "success", text: response.data.message || "Data loaded successfully!" });
    } catch (error) {
      console.error("Failed to load data:", error);
      setLoadMessage({ 
        type: "error", 
        text: error.response?.data?.error || "Failed to load data. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const getMessageStyle = (type) => {
    const styles = {
      success: "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]",
      error: "bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger)]",
      info: "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]",
    };
    return styles[type] || styles.info;
  };

  const getMessageIcon = (type) => {
    if (type === "success") return <FiCheckCircle className="w-5 h-5" />;
    if (type === "error") return <FiAlertCircle className="w-5 h-5" />;
    return <FiLoader className="w-5 h-5 animate-spin" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FiDownload className="w-7 h-7 text-[var(--color-accent)]" />
          Data Management
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Fetch stock data from Nepal Stock Exchange
        </p>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card p-8 text-center">
            <FiLoader className="w-12 h-12 text-[var(--color-accent)] animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold">Processing...</p>
            <p className="text-[var(--foreground-muted)]">This may take a few minutes</p>
          </div>
        </div>
      )}

      <div className="grid max-w-2xl gap-6">
        {/* Fetch Stock Data Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
              <FiDownload className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Fetch Stock Data</h2>
              <p className="text-sm text-[var(--foreground-muted)]">Download from Nepal Stock Exchange</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--foreground-secondary)]">
                Start Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--foreground-secondary)]">
                End Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button
              onClick={handleFetchData}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiDownload className="w-5 h-5" />
              Fetch Data
            </button>

            {loadMessage.text && (
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${getMessageStyle(loadMessage.type)}`}>
                {getMessageIcon(loadMessage.type)}
                <span className="text-sm">{loadMessage.text}</span>
              </div>
            )}

            {stats && (
              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <h3 className="font-semibold text-sm">Statistics</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded bg-[var(--background-secondary)]">
                    <span className="text-[var(--foreground-muted)]">Total Dates:</span>
                    <span className="ml-2 font-semibold">{stats.total_dates}</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--background-secondary)]">
                    <span className="text-[var(--foreground-muted)]">Processed:</span>
                    <span className="ml-2 font-semibold price-up">{stats.dates_processed}</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--background-secondary)]">
                    <span className="text-[var(--foreground-muted)]">Skipped:</span>
                    <span className="ml-2 font-semibold">{stats.dates_skipped}</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--background-secondary)]">
                    <span className="text-[var(--foreground-muted)]">Failed:</span>
                    <span className="ml-2 font-semibold price-down">{stats.dates_failed}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card p-6 border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5">
        <h3 className="font-semibold text-[var(--color-accent)] mb-2">How It Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--foreground-secondary)]">
          <li>Fetch stock data from Nepal Stock Exchange for your desired date range</li>
          <li>The system will download and store the data, skipping dates that already exist</li>
          <li>Stored data is displayed on the dashboard and individual stock pages</li>
        </ol>
      </div>
    </div>
  );
}
