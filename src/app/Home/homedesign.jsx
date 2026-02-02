"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiTrendingUp, FiTrendingDown, FiArrowRight, FiActivity, FiTarget, FiZap } from "react-icons/fi";

function Homedesign({ username, gainer, looser, topStocks, indices, nepseIndex }) {
  const router = useRouter();

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return parseFloat(price).toLocaleString("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Use percentage_change from API (calculated correctly on backend)
  // Fallback calculation using previous_day_close_price if API doesn't provide it
  const calculateChange = (data) => {
    // First try to use percentage_change from API
    if (data?.percentage_change !== null && data?.percentage_change !== undefined) {
      return parseFloat(data.percentage_change);
    }
    // Fallback: use previous_day_close_price (correct formula)
    if (data?.close_price && data?.previous_day_close_price && data.previous_day_close_price > 0) {
      return ((parseFloat(data.close_price) - parseFloat(data.previous_day_close_price)) / parseFloat(data.previous_day_close_price)) * 100;
    }
    return null;
  };

  const getAlertBadge = (level) => {
    const badges = {
      STRONG_BUY_SIGNAL: "signal-strong-buy",
      BUY_SIGNAL: "signal-buy",
      WATCH_CLOSELY: "alert-watch",
      MONITOR: "signal-hold",
    };
    return badges[level] || "signal-hold";
  };

  // Use nepseIndex prop directly, or fall back to finding it in indices list
  const mainIndex = nepseIndex || indices?.indices?.find((i) => i.index_id === 58);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl mb-8">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative py-12 px-8">
          <div className="max-w-4xl">
            <p className="text-[var(--foreground-secondary)] mb-2">
              {username !== "Guest" ? `Welcome back, ${username}` : "Welcome to SHARE NEPAL"}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Smart Stock Analysis</span>
              <br />
              <span className="text-[var(--foreground)]">for Nepal Stock Exchange</span>
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)] mb-8 max-w-2xl">
              Track market trends, analyze technical indicators, and discover high-potential stocks
              with AI-powered predictions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/Sharelist" className="btn-primary inline-flex items-center gap-2">
                <FiActivity className="w-5 h-5" />
                View All Stocks
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/TopStocks" className="btn-secondary inline-flex items-center gap-2">
                <FiTarget className="w-5 h-5" />
                Top Picks Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="stat-label">NEPSE Index</div>
            <div className="stat-value number-mono">
              {formatPrice(mainIndex?.close || mainIndex?.latest_close)}
            </div>
            <div className={`stat-change ${(mainIndex?.percentage_change || mainIndex?.daily_change_percent || 0) >= 0 ? "price-up" : "price-down"}`}>
              {(mainIndex?.percentage_change || mainIndex?.daily_change_percent || 0) >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              {(mainIndex?.percentage_change || mainIndex?.daily_change_percent || 0).toFixed(2)}%
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Daily Change</div>
            <div className={`stat-value number-mono ${(mainIndex?.absolute_change || mainIndex?.daily_change || 0) >= 0 ? "price-up" : "price-down"}`}>
              {(mainIndex?.absolute_change || mainIndex?.daily_change || 0) >= 0 ? "+" : ""}
              {formatPrice(mainIndex?.absolute_change || mainIndex?.daily_change)}
            </div>
            <div className="stat-change text-[var(--foreground-muted)]">Points</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">52 Week High</div>
            <div className="stat-value number-mono">
              {formatPrice(mainIndex?.fifty_two_weeks_high)}
            </div>
            <div className="stat-change text-[var(--foreground-muted)]">All time range</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">52 Week Low</div>
            <div className="stat-value number-mono">
              {formatPrice(mainIndex?.fifty_two_weeks_low)}
            </div>
            <div className="stat-change text-[var(--foreground-muted)]">All time range</div>
          </div>
        </div>
      </section>

      {/* Top Stocks to Watch */}
      {topStocks?.stocks?.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FiZap className="w-6 h-6 text-[var(--color-warning)]" />
              <h2 className="text-xl font-bold">Top Stocks to Watch</h2>
            </div>
            <Link href="/TopStocks" className="text-[var(--color-accent)] hover:underline flex items-center gap-1">
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topStocks.stocks.slice(0, 6).map((stock, index) => (
              <div
                key={stock.symbol}
                className="card-hover p-4 cursor-pointer"
                onClick={() => router.push(`/TopStocks?symbol=${stock.symbol}`)}
                style={{ animationDelay: `${index * 50}ms` }}
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold number-mono">
                    Rs. {formatPrice(stock.current_price)}
                  </span>
                  <span className="text-sm font-semibold px-2 py-1 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                    Score: {stock.combined_score}
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground-secondary)]">{stock.summary}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gainers and Losers */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Top Gainers */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-success-bg)] flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-[var(--color-success)]" />
              </div>
              <h2 className="text-xl font-bold">Top Gainers</h2>
            </div>
            <Link href="/Sharelist?gainer=1" className="text-[var(--color-accent)] text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {gainer?.results?.slice(0, 5).map((stock, index) => {
              // Use percentage_change from API (already sorted by highest gain)
              const change = stock.percentage_change ?? stock.data?.[0]?.percentage_change ?? calculateChange(stock.data?.[0]);
              return (
                <div
                  key={stock.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--background-tertiary)] cursor-pointer transition-colors"
                  onClick={() => router.push(`/Sharelist/${stock.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-[var(--background-tertiary)] flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{stock.symbol}</p>
                      <p className="text-xs text-[var(--foreground-muted)] truncate max-w-[150px]">
                        {stock.security_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold number-mono">{formatPrice(stock.data?.[0]?.close_price)}</p>
                    {change !== null && (
                      <span className="badge-gain text-xs">
                        <FiTrendingUp className="w-3 h-3" />
                        +{parseFloat(change).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Losers */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-danger-bg)] flex items-center justify-center">
                <FiTrendingDown className="w-5 h-5 text-[var(--color-danger)]" />
              </div>
              <h2 className="text-xl font-bold">Top Losers</h2>
            </div>
            <Link href="/Sharelist?gainer=0" className="text-[var(--color-accent)] text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {looser?.results?.slice(0, 5).map((stock, index) => {
              // Use percentage_change from API (already sorted by biggest loss)
              const change = stock.percentage_change ?? stock.data?.[0]?.percentage_change ?? calculateChange(stock.data?.[0]);
              return (
                <div
                  key={stock.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--background-tertiary)] cursor-pointer transition-colors"
                  onClick={() => router.push(`/Sharelist/${stock.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-[var(--background-tertiary)] flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{stock.symbol}</p>
                      <p className="text-xs text-[var(--foreground-muted)] truncate max-w-[150px]">
                        {stock.security_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold number-mono">{formatPrice(stock.data?.[0]?.close_price)}</p>
                    {change !== null && (
                      <span className="badge-loss text-xs">
                        <FiTrendingDown className="w-3 h-3" />
                        {parseFloat(change).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sector Indices */}
      {indices?.indices?.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Sector Performance</h2>
            <Link href="/Indices" className="text-[var(--color-accent)] hover:underline flex items-center gap-1">
              View All Indices <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {indices.indices.slice(0, 12).map((index) => (
              <div
                key={index.index_id}
                className="card p-4 cursor-pointer hover:border-[var(--color-accent)] transition-colors"
                onClick={() => router.push(`/Indices?id=${index.index_id}`)}
              >
                <p className="text-xs text-[var(--foreground-muted)] truncate mb-1">
                  {index.index_name?.replace(" Index", "").replace(" SubIndex", "")}
                </p>
                <p className="font-bold number-mono">{formatPrice(index.latest_close)}</p>
                <p className={`text-sm font-semibold ${index.daily_change_percent >= 0 ? "price-up" : "price-down"}`}>
                  {index.daily_change_percent >= 0 ? "+" : ""}{index.daily_change_percent?.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/Screener" className="card-hover p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center group-hover:bg-[var(--color-accent)]/30 transition-colors">
              <FiTarget className="w-6 h-6 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Stock Screener</h3>
              <p className="text-sm text-[var(--foreground-muted)]">Filter stocks by technical criteria</p>
            </div>
          </div>
        </Link>
        <Link href="/TopStocks" className="card-hover p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-warning)]/20 flex items-center justify-center group-hover:bg-[var(--color-warning)]/30 transition-colors">
              <FiZap className="w-6 h-6 text-[var(--color-warning)]" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Unusual Activity</h3>
              <p className="text-sm text-[var(--foreground-muted)]">Detect accumulation patterns</p>
            </div>
          </div>
        </Link>
        <Link href="/Indices" className="card-hover p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-success)]/20 flex items-center justify-center group-hover:bg-[var(--color-success)]/30 transition-colors">
              <FiActivity className="w-6 h-6 text-[var(--color-success)]" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Market Indices</h3>
              <p className="text-sm text-[var(--foreground-muted)]">Track all NEPSE indices</p>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}

export default Homedesign;
