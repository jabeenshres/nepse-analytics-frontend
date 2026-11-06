"use client";
import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiX,
  FiCalendar,
  FiAlertTriangle,
  FiInfo,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
} from "react-icons/fi";
import dynamic from "next/dynamic";

const BrokerBarChart = dynamic(
  () => import("../../components/BrokerBarChart/brokerBarChart"),
  { ssr: false, loading: () => <div className="skeleton h-80 w-full" /> }
);

const SORT_OPTIONS = [
  { value: "net", label: "Net quantity" },
  { value: "bought", label: "Quantity bought" },
  { value: "sold", label: "Quantity sold" },
  { value: "broker", label: "Broker number" },
];

const LIMIT_OPTIONS = ["15", "25", "50", "100"];

const formatNumber = (value) => {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("en-NP");
};

const formatAmount = (value) => {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("en-NP", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatSigned = (value) => {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  return `${n > 0 ? "+" : ""}${n.toLocaleString("en-NP")}`;
};

/**
 * Column definitions for the sortable broker table.
 * `align` right keeps the numeric columns scannable.
 */
const COLUMNS = [
  { key: "broker", label: "Broker", align: "left", sortValue: (b) => b.broker },
  { key: "bought_qty", label: "Bought Qty", align: "right", sortValue: (b) => b.bought_qty },
  { key: "sold_qty", label: "Sold Qty", align: "right", sortValue: (b) => b.sold_qty },
  {
    key: "net_qty",
    label: "Net Qty",
    align: "right",
    hint: "Net activity inside the selected range only.",
    sortValue: (b) => Math.abs(b.net_qty),
  },
  {
    key: "estimated_holding_qty",
    label: "Est. Holding*",
    align: "right",
    hint:
      "Cumulative net position as of the range end date. Includes all prior " +
      "history, so on a single-day range it still reflects earlier days.",
    sortValue: (b) => (b.estimated_holding_qty === null ? -1 : Math.abs(b.estimated_holding_qty)),
  },
  { key: "share_pct", label: "Share", align: "right", sortValue: (b) => b.share_pct },
  { key: "position", label: "Position", align: "left", sortValue: (b) => b.net_qty },
];

const RELIABILITY_STYLE = {
  full: { className: "signal-buy", label: "Estimate reliable" },
  partial: { className: "alert-watch", label: "Estimate partial" },
  none: { className: "signal-hold", label: "Not available" },
};

export default function BrokerHoldingsClient({
  data,
  error,
  initialSymbol,
  initialStartDate = "",
  initialEndDate = "",
  initialSortBy = "net",
  initialMinNetQty = "0",
  initialExcludeSelfTrades = true,
  initialLimit = "50",
}) {
  const router = useRouter();

  const [searchSymbol, setSearchSymbol] = useState(initialSymbol || "");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  // The server orders rows by its own `sort_by`; header clicks then re-order the
  // returned rows locally without another round trip. `net_qty` is the default
  // key because the server's default `sort_by=net` orders by absolute net.
  const [sortKey, setSortKey] = useState("net_qty");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedBroker, setExpandedBroker] = useState(null);

  const debounceRef = useRef(null);

  // Build the query string from the current control state, dropping empty values
  // so the backend keeps applying its own latest-available-data defaults.
  const buildQuery = (overrides = {}) => {
    const params = new URLSearchParams();
    const symbol = overrides.symbol !== undefined ? overrides.symbol : searchSymbol;
    const sDate = overrides.startDate !== undefined ? overrides.startDate : startDate;
    const eDate = overrides.endDate !== undefined ? overrides.endDate : endDate;

    if (symbol && symbol.trim()) params.set("symbol", symbol.trim().toUpperCase());
    if (sDate) params.set("start_date", sDate);
    if (eDate) params.set("end_date", eDate);
    if (overrides.sort_by !== undefined) params.set("sort_by", overrides.sort_by);
    if (overrides.min_net_qty !== undefined) params.set("min_net_qty", overrides.min_net_qty);
    if (overrides.exclude_self_trades !== undefined)
      params.set("exclude_self_trades", overrides.exclude_self_trades);
    if (overrides.limit !== undefined) params.set("limit", overrides.limit);

    return params.toString();
  };

  const push = (query) => router.push(`/BrokerHoldings?${query}`);

  const handleSearch = () => {
    if (!searchSymbol.trim()) return;
    push(buildQuery({ symbol: searchSymbol.trim().toUpperCase() }));
  };

  const clearSymbol = () => {
    setSearchSymbol("");
    push(buildQuery({ symbol: "" }));
  };

  // Debounced control changes, following the same pattern as TopStocksClient so
  // dragging a date input does not fire a request per intermediate value.
  const handleDebouncedChange = (field, value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      push(buildQuery({ [field]: value }));
    }, 500);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    handleDebouncedChange("start_date", e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    handleDebouncedChange("end_date", e.target.value);
  };

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
    push(buildQuery({ start_date: "", end_date: "" }));
  };

  const handleSortByChange = (e) => push(buildQuery({ sort_by: e.target.value }));
  const handleMinNetChange = (e) => push(buildQuery({ min_net_qty: e.target.value || "0" }));
  const handleLimitChange = (e) => push(buildQuery({ limit: e.target.value }));
  const handleSelfTradesChange = (e) =>
    push(buildQuery({ exclude_self_trades: e.target.checked ? "true" : "false" }));

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Client-side re-sorting of the returned rows. The server already orders by
  // its own `sort_by`; this lets header clicks re-order without a round trip.
  const sortedBrokers = useMemo(() => {
    const rows = [...(data?.brokers || [])];
    const column = COLUMNS.find((c) => c.key === sortKey);
    if (!column) return rows;
    const sign = sortDirection === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      const av = column.sortValue(a);
      const bv = column.sortValue(b);
      if (av === bv) return a.broker - b.broker;
      return av > bv ? sign : -sign;
    });
    return rows;
  }, [data, sortKey, sortDirection]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const summary = data?.summary;
  const coverage = data?.coverage;
  const baseline = data?.baseline;
  const reliability = RELIABILITY_STYLE[baseline?.reliability] || RELIABILITY_STYLE.none;
  const truncated = summary && summary.brokers_matched > summary.brokers_reported;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <FiUsers className="w-7 h-7" />
            Broker Holdings
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Per-broker bought, sold and net activity from the NEPSE floorsheet
          </p>
        </div>
        {data && !data.message && (
          <span className={reliability.className}>{reliability.label}</span>
        )}
      </div>

      {/* Controls */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Symbol */}
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Symbol (e.g., KKHC, SIFC)"
              aria-label="Stock symbol"
              className="input-field pl-10 uppercase"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className="btn-primary">
            Load
          </button>
          {searchSymbol && (
            <button onClick={clearSymbol} className="btn-secondary flex items-center gap-2">
              <FiX className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          {/* Start date */}
          <div className="flex-1 min-w-[180px]">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)] mb-1">
              <FiCalendar className="w-4 h-4" />
              Start Date
            </label>
            <input
              type="date"
              aria-label="Start date"
              value={startDate}
              onChange={handleStartDateChange}
              className="input-field"
            />
          </div>

          {/* End date */}
          <div className="flex-1 min-w-[180px]">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)] mb-1">
              <FiCalendar className="w-4 h-4" />
              End Date
            </label>
            <input
              type="date"
              aria-label="End date"
              value={endDate}
              onChange={handleEndDateChange}
              className="input-field"
            />
          </div>

          {(startDate || endDate) && (
            <button onClick={clearDates} className="btn-secondary flex items-center gap-2">
              <FiX className="w-4 h-4" />
              Use latest data
            </button>
          )}

          {/* Sort by */}
          <div className="min-w-[170px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)] mb-1">
              Sort By
            </label>
            <select
              value={initialSortBy}
              onChange={handleSortByChange}
              aria-label="Sort brokers by"
              className="input-field"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Min net qty */}
          <div className="min-w-[140px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)] mb-1">
              Min Net Qty
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={initialMinNetQty}
              onChange={handleMinNetChange}
              aria-label="Minimum absolute net quantity"
              className="input-field number-mono"
            />
          </div>

          {/* Limit */}
          <div className="min-w-[110px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)] mb-1">
              Show
            </label>
            <select
              value={initialLimit}
              onChange={handleLimitChange}
              aria-label="Maximum brokers"
              className="input-field"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  Top {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Self trades */}
        <label className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] cursor-pointer">
          <input
            type="checkbox"
            checked={initialExcludeSelfTrades}
            onChange={handleSelfTradesChange}
            className="w-4 h-4"
          />
          Exclude self-trades (buyer = seller)
        </label>
      </div>

      {/* Error */}
      {error && (
        <div
          className="card p-4 flex items-start gap-3"
          style={{
            borderColor: "var(--color-danger)",
            background: "var(--color-danger-bg)",
          }}
        >
          <FiAlertTriangle
            className="w-5 h-5 mt-0.5 shrink-0"
            style={{ color: "var(--color-danger)" }}
          />
          <div>
            <p className="font-semibold" style={{ color: "var(--color-danger)" }}>
              Could not load broker holdings
            </p>
            <p className="text-sm text-[var(--foreground-secondary)]">{error}</p>
          </div>
        </div>
      )}

      {data?.message && (
        <div className="card p-6 flex items-start gap-3">
          <FiInfo className="w-5 h-5 mt-0.5 shrink-0 text-[var(--foreground-secondary)]" />
          <div>
            <p className="font-semibold">{data.symbol}</p>
            <p className="text-sm text-[var(--foreground-secondary)]">{data.message}</p>
          </div>
        </div>
      )}

      {data && !data.message && (
        <>
          {/* Coverage + reliability banner. This is the most important element on
              the page: it is the honesty guarantee for the numbers below. */}
          <div
            className="card p-4"
            style={{
              borderColor: coverage.coverage_pct < 100 ? "var(--color-warning)" : "var(--color-success)",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <FiBarChart2 className="w-5 h-5" />
                <span className="font-semibold">
                  {data.symbol} · {data.security_name}
                </span>
              </div>
              <span className="text-sm number-mono text-[var(--foreground-secondary)]">
                {data.date_range.start} → {data.date_range.end}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[var(--foreground-muted)]">Data coverage</p>
                <p className="font-semibold number-mono">
                  {coverage.trading_days_with_data}/{coverage.trading_days_expected} days (
                  {coverage.coverage_pct}%)
                </p>
              </div>
              <div>
                <p className="text-[var(--foreground-muted)]">Prior history for baseline</p>
                <p className="font-semibold number-mono">
                  {baseline.available_days} days
                  {baseline.first_data_date ? ` from ${baseline.first_data_date}` : ""}
                </p>
              </div>
              <div>
                <p className="text-[var(--foreground-muted)]">Holdings estimate</p>
                <p className="font-semibold">{reliability.label}</p>
              </div>
            </div>

            {baseline.description && (
              <p className="mt-3 text-xs text-[var(--foreground-muted)]">
                * Est. Holding = prior history before {data?.date_range?.start} plus
                net activity in range, as of {data?.date_range?.end}. It is a
                cumulative position, not range-only activity, so a single-day range
                still includes earlier days.
              </p>
            )}

            {coverage.warnings?.map((warning, i) => (
              <p
                key={i}
                className="mt-3 text-sm flex items-start gap-2"
                style={{ color: "var(--color-warning)" }}
              >
                <FiAlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{warning}</span>
              </p>
            ))}

            {coverage.missing_days?.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-[var(--foreground-secondary)]">
                  {coverage.missing_days.length} trading day
                  {coverage.missing_days.length === 1 ? "" : "s"} without floorsheet data
                </summary>
                <p className="mt-2 text-xs number-mono text-[var(--foreground-muted)]">
                  {coverage.missing_days.join(", ")}
                </p>
              </details>
            )}
          </div>

          {/* Summary cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <p className="stat-label">Total Bought</p>
              <p className="stat-value number-mono">{formatNumber(summary.total_bought_qty)}</p>
              <p className="stat-change price-up">
                <FiTrendingUp className="w-4 h-4" />
                Rs. {formatAmount(summary.total_bought_amount)}
              </p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Total Sold</p>
              <p className="stat-value number-mono">{formatNumber(summary.total_sold_qty)}</p>
              <p className="stat-change price-down">
                <FiTrendingDown className="w-4 h-4" />
                Rs. {formatAmount(summary.total_sold_amount)}
              </p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Market Net</p>
              <p
                className={`stat-value number-mono ${
                  summary.net_qty > 0 ? "price-up" : summary.net_qty < 0 ? "price-down" : ""
                }`}
              >
                {formatSigned(summary.net_qty)}
              </p>
              <p className="stat-change text-[var(--foreground-muted)]">
                {summary.total_trades.toLocaleString("en-NP")} trades
              </p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Brokers Active</p>
              <p className="stat-value number-mono">{summary.brokers_matched}</p>
              <p className="stat-change text-[var(--foreground-muted)]">
                {summary.unique_buyers} buyers · {summary.unique_sellers} sellers
              </p>
            </div>
          </div>

          {/* Top movers */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Top Accumulator
              </p>
              {summary.top_accumulator ? (
                <>
                  <p className="text-xl font-bold number-mono mt-1 price-up">
                    Broker {summary.top_accumulator.broker}
                  </p>
                  <p className="text-sm number-mono text-[var(--foreground-secondary)]">
                    {formatSigned(summary.top_accumulator.net_qty)} qty
                  </p>
                </>
              ) : (
                <p className="text-sm text-[var(--foreground-muted)] mt-1">—</p>
              )}
            </div>

            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Top Distributor
              </p>
              {summary.top_distributor ? (
                <>
                  <p className="text-xl font-bold number-mono mt-1 price-down">
                    Broker {summary.top_distributor.broker}
                  </p>
                  <p className="text-sm number-mono text-[var(--foreground-secondary)]">
                    {formatSigned(summary.top_distributor.net_qty)} qty
                  </p>
                </>
              ) : (
                <p className="text-sm text-[var(--foreground-muted)] mt-1">—</p>
              )}
            </div>

            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Concentration (HHI)
              </p>
              <p className="text-xl font-bold number-mono mt-1">
                {summary.concentration.hhi}
              </p>
              <p className="text-sm text-[var(--foreground-secondary)]">
                {summary.concentration.interpretation}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h2 className="text-lg font-semibold">Top 15 Brokers — Bought vs Sold</h2>
              <span className="text-xs text-[var(--foreground-muted)]">
                Self-trades {summary.self_trades_excluded ? "excluded" : "included"} (
                {summary.self_trade_qty_pct}% of quantity)
              </span>
            </div>
            <BrokerBarChart brokers={data.brokers} maxBrokers={15} />
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold">Broker Breakdown</h2>
              <span className="text-sm text-[var(--foreground-secondary)]">
                Showing {data.brokers.length} of {summary.brokers_matched} brokers
                {truncated ? " (sorted by server, limited)" : ""}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        className={col.align === "right" ? "text-right" : ""}
                        title={col.hint}
                      >
                        <button
                          onClick={() => toggleSort(col.key)}
                          className="inline-flex items-center gap-1 hover:text-[var(--foreground)]"
                        >
                          {col.label}
                          {sortKey === col.key &&
                            (sortDirection === "asc" ? (
                              <FiChevronUp className="w-3 h-3" />
                            ) : (
                              <FiChevronDown className="w-3 h-3" />
                            ))}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedBrokers.map((b) => {
                    const isExpanded = expandedBroker === b.broker;
                    const maxAbsDay = Math.max(
                      1,
                      ...b.daily_net.map((p) => Math.abs(p.net_qty))
                    );
                    return (
                      <Fragment key={b.broker}>
                      <tr
                        className="cursor-pointer"
                        onClick={() => setExpandedBroker(isExpanded ? null : b.broker)}
                      >
                        <td>
                          <span className="font-semibold number-mono">Broker {b.broker}</span>
                          <p className="text-xs text-[var(--foreground-muted)]">
                            {b.buy_count} buys · {b.sell_count} sells
                          </p>
                        </td>
                        <td className="text-right number-mono price-up">
                          {formatNumber(b.bought_qty)}
                          <p className="text-xs text-[var(--foreground-muted)]">
                            Rs. {formatAmount(b.bought_amount)}
                          </p>
                        </td>
                        <td className="text-right number-mono price-down">
                          {formatNumber(b.sold_qty)}
                          <p className="text-xs text-[var(--foreground-muted)]">
                            Rs. {formatAmount(b.sold_amount)}
                          </p>
                        </td>
                        <td className="text-right">
                          <span
                            className={`font-semibold number-mono ${
                              b.net_qty > 0 ? "price-up" : b.net_qty < 0 ? "price-down" : ""
                            }`}
                          >
                            {formatSigned(b.net_qty)}
                          </span>
                        </td>
                        <td className="text-right number-mono">
                          {b.estimated_holding_qty !== null ? (
                            <>
                              {formatSigned(b.estimated_holding_qty)}
                              <p className="text-xs text-[var(--foreground-muted)]">
                                from {formatSigned(b.baseline_qty)}
                              </p>
                            </>
                          ) : (
                            <span
                              className="text-[var(--foreground-muted)]"
                              title="No floorsheet history exists before the start of this range"
                            >
                              n/a
                            </span>
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="progress-bar w-16">
                              <div
                                className="progress-fill"
                                style={{ width: `${Math.min(b.share_pct, 100)}%` }}
                              />
                            </div>
                            <span className="number-mono text-xs w-12 text-right">
                              {b.share_pct}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={b.net_qty > 0 ? "badge-gain" : "badge-loss"}>
                            {b.position === "ACCUMULATING" ? (
                              <FiTrendingUp className="w-4 h-4" />
                            ) : (
                              <FiTrendingDown className="w-4 h-4" />
                            )}
                            {b.position === "ACCUMULATING" ? "Accum" : "Distrib"}
                          </span>
                        </td>
                      </tr>

                      {/* Per-broker daily drill-down */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={COLUMNS.length}
                            className="bg-[var(--background-tertiary)]"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)] mb-3">
                              Broker {b.broker} — daily net quantity
                            </p>
                            <div className="space-y-1 max-h-72 overflow-y-auto pr-2">
                              {b.daily_net.map((point) => (
                                <div
                                  key={point.date}
                                  className="flex items-center gap-3 text-xs"
                                >
                                  <span className="number-mono w-24 shrink-0 text-[var(--foreground-secondary)]">
                                    {point.date}
                                  </span>
                                  <div className="flex-1 flex items-center">
                                    <div
                                      className="h-2 rounded-full"
                                      style={{
                                        width: `${(Math.abs(point.net_qty) / maxAbsDay) * 100}%`,
                                        marginLeft: point.net_qty < 0 ? "auto" : 0,
                                        background:
                                          point.net_qty > 0
                                            ? "var(--color-success)"
                                            : point.net_qty < 0
                                            ? "var(--color-danger)"
                                            : "var(--border-color)",
                                      }}
                                    />
                                  </div>
                                  <span
                                    className={`number-mono w-24 shrink-0 text-right font-semibold ${
                                      point.net_qty > 0
                                        ? "price-up"
                                        : point.net_qty < 0
                                        ? "price-down"
                                        : ""
                                    }`}
                                  >
                                    {formatSigned(point.net_qty)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {sortedBrokers.length === 0 && (
              <p className="px-6 py-8 text-center text-[var(--foreground-muted)]">
                No broker activity matched these filters.
              </p>
            )}
          </div>

          {/* Notes */}
          {data.notes?.length > 0 && (
            <div className="card p-4 space-y-1">
              {data.notes.map((note, i) => (
                <p
                  key={i}
                  className="text-xs text-[var(--foreground-muted)] flex items-start gap-2"
                >
                  <FiInfo className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{note}</span>
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
