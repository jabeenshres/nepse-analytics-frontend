"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiZap, FiTarget, FiTrendingUp, FiActivity, FiSearch, FiArrowRight, FiAlertCircle, FiX, FiFilter, FiCalendar } from "react-icons/fi";

const STOCK_TYPES = [
  { value: "stock", label: "Stocks", color: "var(--color-accent)" },
  { value: "mutual_fund", label: "Mutual Funds", color: "var(--color-success)" },
  { value: "debenture", label: "Debentures", color: "var(--color-warning)" },
  { value: "all", label: "All Types", color: "var(--foreground-secondary)" },
];

export default function TopStocksClient({ topStocks, breakoutWatchlist, accumulationAlerts, singleStock, initialSymbol, initialStockType = "stock", initialDate = "" }) {
  const router = useRouter();
  const [searchSymbol, setSearchSymbol] = useState(initialSymbol || "");
  const [activeTab, setActiveTab] = useState("top");
  const [stockType, setStockType] = useState(initialStockType);
  const [analysisDate, setAnalysisDate] = useState(initialDate || "");

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return parseFloat(price).toLocaleString("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getAlertBadge = (level) => {
    const badges = {
      STRONG_BUY_SIGNAL: "signal-strong-buy",
      BUY_SIGNAL: "signal-buy",
      WATCH_CLOSELY: "alert-watch",
      MONITOR: "signal-hold",
      high: "signal-strong-buy",
      medium: "alert-watch",
    };
    return badges[level] || "signal-hold";
  };

  const buildQueryString = (updates = {}) => {
    const params = new URLSearchParams();
    const finalStockType = updates.stockType !== undefined ? updates.stockType : stockType;
    const finalDate = updates.date !== undefined ? updates.date : analysisDate;
    const finalSymbol = updates.symbol !== undefined ? updates.symbol : searchSymbol;
    
    if (finalStockType) params.set("stock_type", finalStockType);
    if (finalDate) params.set("date", finalDate);
    if (finalSymbol) params.set("symbol", finalSymbol);
    
    return params.toString();
  };

  const handleSearch = () => {
    if (searchSymbol.trim()) {
      const query = buildQueryString({ symbol: searchSymbol.trim().toUpperCase() });
      router.push(`/TopStocks?${query}`);
    }
  };

  const clearSearch = () => {
    setSearchSymbol("");
    const query = buildQueryString({ symbol: "" });
    router.push(`/TopStocks?${query}`);
  };

  const handleStockTypeChange = (newType) => {
    setStockType(newType);
    const query = buildQueryString({ stockType: newType });
    router.push(`/TopStocks?${query}`);
  };

  const dateChangeTimeoutRef = useRef(null);
  
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setAnalysisDate(newDate); // Update UI immediately
    
    // Debounce the actual API call to prevent too many rapid requests
    if (dateChangeTimeoutRef.current) {
      clearTimeout(dateChangeTimeoutRef.current);
    }
    
    dateChangeTimeoutRef.current = setTimeout(() => {
      const query = buildQueryString({ date: newDate });
      router.push(`/TopStocks?${query}`);
    }, 500); // Wait 500ms after user stops changing date
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dateChangeTimeoutRef.current) {
        clearTimeout(dateChangeTimeoutRef.current);
      }
    };
  }, []);

  const clearDate = () => {
    setAnalysisDate("");
    const query = buildQueryString({ date: "" });
    router.push(`/TopStocks?${query}`);
  };

  const tabs = [
    { id: "top", label: "Top Stocks", icon: FiZap, count: topStocks?.stocks?.length },
    { id: "breakout", label: "Breakout Watch", icon: FiTarget, count: breakoutWatchlist?.watchlist?.length },
    { id: "accumulation", label: "Accumulation Alerts", icon: FiAlertCircle, count: accumulationAlerts?.alerts?.length },
  ];

  // Single Stock View
  if (singleStock?.stock) {
    const stock = singleStock.stock;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={clearSearch} className="btn-secondary flex items-center gap-2">
            <FiX className="w-4 h-4" />
            Back to List
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">{stock.symbol}</h1>
              <p className="text-[var(--foreground-muted)]">{stock.security_name}</p>
            </div>
            <div className="text-right">
              <span className={getAlertBadge(stock.alert_level)}>{stock.alert_level?.replace(/_/g, " ")}</span>
              <p className="text-2xl font-bold mt-2 number-mono">Score: {stock.combined_score}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="stat-label">Current Price</div>
              <div className="stat-value number-mono">Rs. {formatPrice(stock.current_price)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Max Volume Ratio</div>
              <div className="stat-value number-mono">{stock.key_metrics?.max_volume_ratio?.toFixed(1)}x</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Unusual Days</div>
              <div className="stat-value number-mono">{stock.key_metrics?.unusual_days_count}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Distance to Resistance</div>
              <div className="stat-value number-mono">{stock.key_metrics?.distance_to_resistance?.toFixed(1)}%</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="card p-4">
              <h4 className="font-semibold mb-2 text-[var(--color-success)]">Accumulation Score</h4>
              <div className="text-3xl font-bold">{stock.score_breakdown?.accumulation || 0}</div>
              <div className="progress-bar mt-2">
                <div className="progress-fill bg-[var(--color-success)]" style={{ width: `${(stock.score_breakdown?.accumulation / 35) * 100}%` }} />
              </div>
            </div>
            <div className="card p-4">
              <h4 className="font-semibold mb-2 text-[var(--color-accent)]">Breakout Readiness</h4>
              <div className="text-3xl font-bold">{stock.score_breakdown?.breakout_readiness || 0}</div>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: `${(stock.score_breakdown?.breakout_readiness / 35) * 100}%` }} />
              </div>
            </div>
            <div className="card p-4">
              <h4 className="font-semibold mb-2 text-[var(--color-warning)]">Momentum</h4>
              <div className="text-3xl font-bold">{stock.score_breakdown?.momentum || 0}</div>
              <div className="progress-bar mt-2">
                <div className="progress-fill bg-[var(--color-warning)]" style={{ width: `${(stock.score_breakdown?.momentum / 30) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">Summary</h4>
            <p className="text-[var(--foreground-secondary)]">{stock.summary}</p>
          </div>

          {stock.signals && (
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {stock.signals.accumulation?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-[var(--color-success)]">Accumulation Signals</h4>
                  <ul className="space-y-1">
                    {stock.signals.accumulation.map((sig, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <FiActivity className="w-3 h-3 text-[var(--color-success)]" />
                        {sig}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {stock.signals.breakout?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-[var(--color-accent)]">Breakout Signals</h4>
                  <ul className="space-y-1">
                    {stock.signals.breakout.map((sig, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <FiTarget className="w-3 h-3 text-[var(--color-accent)]" />
                        {sig}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {stock.signals.momentum?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-[var(--color-warning)]">Momentum Signals</h4>
                  <ul className="space-y-1">
                    {stock.signals.momentum.map((sig, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <FiTrendingUp className="w-3 h-3 text-[var(--color-warning)]" />
                        {sig}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {stock.key_metrics && (
            <div>
              <h4 className="font-semibold mb-3">Key Levels</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="card p-4">
                  <div className="text-sm text-[var(--foreground-muted)]">Support</div>
                  <div className="text-lg font-bold number-mono price-up">Rs. {formatPrice(stock.key_metrics.support)}</div>
                </div>
                <div className="card p-4">
                  <div className="text-sm text-[var(--foreground-muted)]">SMA 20</div>
                  <div className="text-lg font-bold number-mono">Rs. {formatPrice(stock.key_metrics.sma_20)}</div>
                </div>
                <div className="card p-4">
                  <div className="text-sm text-[var(--foreground-muted)]">Resistance</div>
                  <div className="text-lg font-bold number-mono price-down">Rs. {formatPrice(stock.key_metrics.resistance)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FiZap className="w-7 h-7 text-[var(--color-warning)]" />
            Top Stocks to Watch
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Stocks showing unusual activity and potential breakout patterns
            {analysisDate && (
              <span className="ml-2 text-[var(--color-accent)]">
                • Analysis Date: {new Date(analysisDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-medium">Analysis Date:</span>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <input
              type="date"
              value={analysisDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]} // Can't select future dates
              className="input-field flex-1"
            />
            {analysisDate && (
              <button
                onClick={clearDate}
                className="btn-secondary flex items-center gap-2"
                title="Clear date filter"
              >
                <FiX className="w-4 h-4" />
                Today
              </button>
            )}
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">
            {analysisDate 
              ? "Viewing historical analysis based on data up to selected date"
              : "Viewing latest analysis (current date)"}
          </div>
        </div>
      </div>

      {/* Stock Type Filter */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-medium">Security Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STOCK_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleStockTypeChange(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  stockType === type.value
                    ? "text-white"
                    : "text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)]"
                }`}
                style={{
                  backgroundColor: stockType === type.value ? type.color : "var(--background-secondary)",
                  border: `1px solid ${stockType === type.value ? type.color : "var(--border-color)"}`,
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Search by symbol (e.g., NABIL, AKJCL)"
              className="input-field pl-10 uppercase"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className="btn-primary">
            Analyze
          </button>
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
              {tab.count > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-[var(--background-tertiary)] text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "top" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {topStocks?.stocks?.length > 0 ? (
            topStocks.stocks.map((stock, index) => (
              <div
                key={stock.symbol}
                className="card-hover p-5 cursor-pointer"
                onClick={() => router.push(`/TopStocks?symbol=${stock.symbol}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{stock.symbol}</h3>
                    <p className="text-sm text-[var(--foreground-muted)] truncate max-w-[180px]">
                      {stock.security_name}
                    </p>
                  </div>
                  <span className={getAlertBadge(stock.alert_level)}>
                    {stock.alert_level?.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold number-mono">Rs. {formatPrice(stock.current_price)}</span>
                  <span className="text-lg font-bold px-3 py-1 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                    {stock.combined_score}
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground-secondary)] mb-3">{stock.summary}</p>
                <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                  <span>Vol: {stock.key_metrics?.max_volume_ratio?.toFixed(1)}x</span>
                  <span className="flex items-center gap-1">
                    View Details <FiArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full card p-12 text-center">
              <FiZap className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
              <h3 className="text-lg font-semibold mb-2">No {STOCK_TYPES.find(t => t.value === stockType)?.label} Found</h3>
              <p className="text-[var(--foreground-muted)]">
                Try selecting a different security type or adjusting your filters
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "breakout" && (
        <div className="card overflow-hidden">
          {breakoutWatchlist?.watchlist?.length > 0 ? (
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Resistance</th>
                  <th className="text-right">Support</th>
                  <th className="text-right">Volume Ratio</th>
                  <th className="text-right">Score</th>
                  <th>Signals</th>
                </tr>
              </thead>
              <tbody>
                {breakoutWatchlist.watchlist.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="cursor-pointer"
                    onClick={() => router.push(`/TopStocks?symbol=${stock.symbol}`)}
                  >
                    <td className="font-semibold">{stock.symbol}</td>
                    <td className="text-[var(--foreground-secondary)] truncate max-w-[150px]">{stock.security_name}</td>
                    <td className="text-right number-mono">{formatPrice(stock.current_price)}</td>
                    <td className="text-right number-mono price-down">{formatPrice(stock.resistance)}</td>
                    <td className="text-right number-mono price-up">{formatPrice(stock.support)}</td>
                    <td className="text-right number-mono">{stock.volume_ratio?.toFixed(2)}x</td>
                    <td className="text-right font-semibold">{stock.breakout_score}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {stock.signals?.slice(0, 2).map((sig, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 rounded bg-[var(--background-tertiary)]">
                            {sig}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <FiTarget className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
              <h3 className="text-lg font-semibold mb-2">No Breakout Candidates</h3>
              <p className="text-[var(--foreground-muted)]">
                No {STOCK_TYPES.find(t => t.value === stockType)?.label.toLowerCase()} showing breakout patterns currently
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "accumulation" && (
        <div className="space-y-4">
          {accumulationAlerts?.alerts?.length > 0 ? (
            accumulationAlerts.alerts.map((alert) => (
              <div
                key={alert.symbol}
                className="card-hover p-5 cursor-pointer"
                onClick={() => router.push(`/TopStocks?symbol=${alert.symbol}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{alert.symbol}</h3>
                      <span className={getAlertBadge(alert.alert_level)}>{alert.alert_level}</span>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)]">{alert.security_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold number-mono">Rs. {formatPrice(alert.current_price)}</span>
                    <p className="text-sm text-[var(--foreground-muted)]">Score: {alert.score}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--foreground-secondary)] mt-3">{alert.message}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-[var(--foreground-muted)]">
                  <span>Vol Ratio: {alert.max_volume_ratio?.toFixed(2)}x</span>
                  <span>Unusual Days: {alert.unusual_days_count}</span>
                  <span>Avg Price Change: {alert.avg_price_change?.toFixed(2)}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center">
              <FiAlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
              <h3 className="text-lg font-semibold mb-2">No Accumulation Alerts</h3>
              <p className="text-[var(--foreground-muted)]">
                No {STOCK_TYPES.find(t => t.value === stockType)?.label.toLowerCase()} showing accumulation patterns currently
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
