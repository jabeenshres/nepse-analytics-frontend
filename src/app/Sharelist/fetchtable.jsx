"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiTrendingUp, FiTrendingDown, FiCalendar, FiFilter, FiX, FiLayers } from "react-icons/fi";

const STOCK_TYPES = [
  { value: "stock", label: "Stocks" },
  { value: "mutual_fund", label: "Mutual Funds" },
  { value: "debenture", label: "Debentures" },
  { value: "all", label: "All Types" },
];

export default function FetchTable({
  datas,
  searchTerm: initialSearchTerm,
  gainer: initialGainer,
  date: initialDate,
  stockType: initialStockType = "stock",
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [gainer, setGainer] = useState(initialGainer === "1");
  const [isChecklistChecked, setIsChecklistChecked] = useState(initialGainer === "1" || initialGainer === "0");
  const [selectedDate, setSelectedDate] = useState(initialDate || "");
  const [stockType, setStockType] = useState(initialStockType);
  const router = useRouter();

  const buildQueryString = (updates = {}) => {
    const params = new URLSearchParams();
    
    const finalStockType = updates.stockType !== undefined ? updates.stockType : stockType;
    const finalSearch = updates.search !== undefined ? updates.search : searchTerm;
    const finalDate = updates.date !== undefined ? updates.date : selectedDate;
    const finalGainer = updates.gainer !== undefined ? updates.gainer : (isChecklistChecked ? (gainer ? "1" : "0") : "");
    
    if (finalStockType && finalStockType !== "stock") params.set("stock_type", finalStockType);
    if (finalStockType === "stock") params.set("stock_type", "stock"); // Always include for stocks too
    if (finalSearch) params.set("search", finalSearch);
    if (finalDate) params.set("date", finalDate);
    if (finalGainer) params.set("gainer", finalGainer);
    
    return params.toString();
  };

  const handleSearch = () => {
    const query = buildQueryString({ search: searchTerm });
    router.push(`/Sharelist?${query}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleGainerToggle = (isChecked) => {
    setGainer(isChecked);
    const query = buildQueryString({ gainer: isChecked ? "1" : "0" });
    router.push(`/Sharelist?${query}`);
  };

  const handleChecklistToggle = (isChecked) => {
    setIsChecklistChecked(isChecked);
    if (!isChecked) {
      setGainer(false);
      const params = new URLSearchParams();
      if (stockType) params.set("stock_type", stockType);
      if (searchTerm) params.set("search", searchTerm);
      if (selectedDate) params.set("date", selectedDate);
      router.push(`/Sharelist?${params.toString()}`);
    }
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    const query = buildQueryString({ date: newDate });
    router.push(`/Sharelist?${query}`);
  };

  const handleStockTypeChange = (newType) => {
    setStockType(newType);
    const query = buildQueryString({ stockType: newType });
    router.push(`/Sharelist?${query}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setGainer(false);
    setIsChecklistChecked(false);
    setStockType("stock");
    router.push("/Sharelist?stock_type=stock");
  };

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

  const hasFilters = searchTerm || selectedDate || isChecklistChecked || stockType !== "stock";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Stock Prices</h1>
          <p className="text-[var(--foreground-muted)]">
            View and analyze {stockType === "all" ? "all securities" : STOCK_TYPES.find(t => t.value === stockType)?.label.toLowerCase()} on Nepal Stock Exchange
          </p>
        </div>
      </div>

      {/* Stock Type Filter */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiLayers className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-medium">Security Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STOCK_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleStockTypeChange(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  stockType === type.value
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] border border-[var(--border-color)]"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Other Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Search by symbol or company name..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="input-field pl-10 w-44"
            />
          </div>

          {/* Gainer/Loser Toggle */}
          <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-[var(--background-secondary)]">
            <div className="flex items-center gap-2">
              <FiFilter className="text-[var(--foreground-muted)]" />
              <span className="text-sm">Filter:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecklistChecked}
                  onChange={(e) => handleChecklistToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[var(--background-tertiary)] rounded-full peer peer-checked:bg-[var(--color-accent)] transition-colors">
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${isChecklistChecked ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
              </label>
            </div>

            {isChecklistChecked && (
              <div className="flex items-center gap-2 border-l border-[var(--border-color)] pl-4">
                <span className={`text-sm ${gainer ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                  {gainer ? "Gainers" : "Losers"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gainer}
                    onChange={(e) => handleGainerToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 rounded-full transition-colors ${gainer ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${gainer ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button onClick={handleSearch} className="btn-primary">
            Search
          </button>

          {/* Clear Filters */}
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary flex items-center gap-2">
              <FiX className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company Name</th>
                <th className="text-right">Open</th>
                <th className="text-right">High</th>
                <th className="text-right">Low</th>
                <th className="text-right">Close</th>
                <th className="text-right">LTP</th>
                <th className="text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {datas?.length > 0 ? (
                datas.map((stock, index) => {
                  const data = stock.data?.[0];
                  // Use percentage_change from API (preferred) or calculate from data
                  const change = stock.percentage_change ?? data?.percentage_change ?? calculateChange(data);
                  const isGain = change !== null && change > 0;

                  return (
                    <tr
                      key={stock.id}
                      className={`cursor-pointer ${isGain ? "row-gain" : "row-loss"}`}
                      onClick={() => router.push(`/Sharelist/${stock.id}`)}
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <td>
                        <span className="font-semibold">{stock.symbol}</span>
                      </td>
                      <td>
                        <span className="text-[var(--foreground-secondary)] truncate block max-w-[200px]">
                          {stock.security_name}
                        </span>
                      </td>
                      <td className="text-right number-mono">{formatPrice(data?.open_price)}</td>
                      <td className="text-right number-mono">{formatPrice(data?.high_price)}</td>
                      <td className="text-right number-mono">{formatPrice(data?.low_price)}</td>
                      <td className="text-right number-mono font-semibold">{formatPrice(data?.close_price)}</td>
                      <td className="text-right number-mono">{formatPrice(data?.last_updated_price)}</td>
                      <td className="text-right">
                        {change !== null ? (
                          <span className={`inline-flex items-center gap-1 ${isGain ? "badge-gain" : "badge-loss"}`}>
                            {isGain ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                            {isGain ? "+" : ""}{change.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-[var(--foreground-muted)]">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <FiSearch className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
                    <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                    <p className="text-[var(--foreground-muted)]">
                      Try adjusting your filters or search criteria
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
