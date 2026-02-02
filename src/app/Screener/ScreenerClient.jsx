"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiFilter, FiTrendingUp, FiTrendingDown, FiActivity, FiBarChart2, FiSearch, FiRefreshCw, FiLayers } from "react-icons/fi";

const STOCK_TYPES = [
  { value: "stock", label: "Stocks" },
  { value: "mutual_fund", label: "Mutual Funds" },
  { value: "debenture", label: "Debentures" },
  { value: "all", label: "All Types" },
];

export default function ScreenerClient({ screenerResults, initialType, initialMinPrice, initialMaxPrice, initialStockType = "stock" }) {
  const router = useRouter();
  const [type, setType] = useState(initialType || "momentum");
  const [minPrice, setMinPrice] = useState(initialMinPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || "");
  const [stockType, setStockType] = useState(initialStockType);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return parseFloat(price).toLocaleString("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const screenerTypes = [
    { id: "momentum", label: "Momentum", description: "Stocks with price above moving averages and rising volume", icon: FiTrendingUp },
    { id: "oversold", label: "Oversold", description: "Stocks with RSI < 30 and/or Stochastic < 20", icon: FiTrendingDown },
    { id: "overbought", label: "Overbought", description: "Stocks with RSI > 70 and/or Stochastic > 80", icon: FiBarChart2 },
    { id: "volume_breakout", label: "Volume Breakout", description: "Stocks with volume > 2x average", icon: FiActivity },
    { id: "trend_following", label: "Trend Following", description: "Stocks in clear uptrend (price > SMA20 > SMA50)", icon: FiFilter },
  ];

  const buildUrl = (updates = {}) => {
    const finalType = updates.type !== undefined ? updates.type : type;
    const finalStockType = updates.stockType !== undefined ? updates.stockType : stockType;
    const finalMinPrice = updates.minPrice !== undefined ? updates.minPrice : minPrice;
    const finalMaxPrice = updates.maxPrice !== undefined ? updates.maxPrice : maxPrice;
    
    let url = `/Screener?type=${finalType}&stock_type=${finalStockType}`;
    if (finalMinPrice) url += `&min_price=${finalMinPrice}`;
    if (finalMaxPrice) url += `&max_price=${finalMaxPrice}`;
    return url;
  };

  const handleSearch = () => {
    router.push(buildUrl());
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    router.push(buildUrl({ type: newType }));
  };

  const handleStockTypeChange = (newStockType) => {
    setStockType(newStockType);
    router.push(buildUrl({ stockType: newStockType }));
  };

  const handleReset = () => {
    setType("momentum");
    setMinPrice("");
    setMaxPrice("");
    setStockType("stock");
    router.push("/Screener?type=momentum&stock_type=stock");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FiFilter className="w-7 h-7 text-[var(--color-accent)]" />
          Stock Screener
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Filter {stockType === "all" ? "securities" : STOCK_TYPES.find(t => t.value === stockType)?.label.toLowerCase()} by technical criteria and find trading opportunities
        </p>
      </div>

      {/* Stock Type Filter */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiLayers className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-medium">Security Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STOCK_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleStockTypeChange(t.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  stockType === t.value
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] border border-[var(--border-color)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Screener Type Selection */}
      <div className="grid md:grid-cols-5 gap-3">
        {screenerTypes.map((screener) => {
          const Icon = screener.icon;
          const isActive = type === screener.id;
          return (
            <button
              key={screener.id}
              onClick={() => handleTypeChange(screener.id)}
              className={`card p-4 text-left transition-all duration-200 ${
                isActive ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10" : "hover:border-[var(--color-accent)]/50"
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isActive ? "text-[var(--color-accent)]" : "text-[var(--foreground-muted)]"}`} />
              <h3 className={`font-semibold text-sm ${isActive ? "text-[var(--color-accent)]" : ""}`}>{screener.label}</h3>
              <p className="text-xs text-[var(--foreground-muted)] mt-1 line-clamp-2">{screener.description}</p>
            </button>
          );
        })}
      </div>

      {/* Price Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-[var(--foreground-muted)] mb-2">Min Price (Rs.)</label>
            <input
              type="number"
              placeholder="0"
              className="input-field"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-[var(--foreground-muted)] mb-2">Max Price (Rs.)</label>
            <input
              type="number"
              placeholder="Any"
              className="input-field"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
            <FiSearch className="w-4 h-4" />
            Apply Filters
          </button>
          <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
            <FiRefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {screenerTypes.find((s) => s.id === type)?.label} {STOCK_TYPES.find(t => t.value === stockType)?.label}
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            Found {screenerResults?.count || screenerResults?.results?.length || 0} {stockType === "all" ? "securities" : STOCK_TYPES.find(t => t.value === stockType)?.label.toLowerCase()} matching criteria
            {screenerResults?.date && ` • Data as of ${screenerResults.date}`}
          </p>
        </div>
      </div>

      {/* Results Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th className="text-right">Close Price</th>
                <th className="text-right">Change %</th>
                <th className="text-right">Volume</th>
                <th className="text-right">Vol Ratio</th>
                <th className="text-right">RSI</th>
                <th className="text-right">SMA 20</th>
                <th className="text-right">SMA 50</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {screenerResults?.results?.length > 0 ? (
                screenerResults.results.map((stock, index) => (
                  <tr
                    key={stock.symbol}
                    className="cursor-pointer"
                    onClick={() => router.push(`/Sharelist/${stock.symbol}`)}
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <td className="font-semibold">{stock.symbol}</td>
                    <td className="text-[var(--foreground-secondary)] truncate max-w-[150px]">{stock.security_name}</td>
                    <td className="text-right number-mono font-semibold">{formatPrice(stock.close_price)}</td>
                    <td className={`text-right number-mono ${stock.change_percent >= 0 ? "price-up" : "price-down"}`}>
                      {stock.change_percent >= 0 ? "+" : ""}{stock.change_percent?.toFixed(2)}%
                    </td>
                    <td className="text-right number-mono">{stock.volume?.toLocaleString()}</td>
                    <td className="text-right number-mono">
                      <span className={stock.volume_ratio > 1.5 ? "text-[var(--color-warning)]" : ""}>
                        {stock.volume_ratio?.toFixed(2)}x
                      </span>
                    </td>
                    <td className="text-right number-mono">
                      <span className={
                        stock.rsi < 30 ? "price-up" : stock.rsi > 70 ? "price-down" : ""
                      }>
                        {stock.rsi?.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-right number-mono">{formatPrice(stock.sma_20)}</td>
                    <td className="text-right number-mono">{formatPrice(stock.sma_50)}</td>
                    <td className="text-right">
                      <span className="px-2 py-1 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-semibold">
                        {stock.score?.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-12">
                    <FiFilter className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
                    <h3 className="text-lg font-semibold mb-2">No {STOCK_TYPES.find(t => t.value === stockType)?.label} Found</h3>
                    <p className="text-[var(--foreground-muted)] mb-4">
                      Try adjusting your filters or selecting a different screener type
                    </p>
                    <button onClick={handleReset} className="btn-primary">
                      Reset Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4">
        <h3 className="font-semibold mb-3">Understanding the Indicators</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-[var(--color-accent)]">RSI (Relative Strength Index)</h4>
            <p className="text-[var(--foreground-muted)]">
              &lt; 30: Oversold (potential buy) • &gt; 70: Overbought (potential sell)
            </p>
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-accent)]">Volume Ratio</h4>
            <p className="text-[var(--foreground-muted)]">
              Current volume compared to average. &gt; 1.5x indicates unusual activity.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-accent)]">SMA (Simple Moving Average)</h4>
            <p className="text-[var(--foreground-muted)]">
              Price above SMA indicates uptrend. SMA20 &gt; SMA50 confirms bullish momentum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
