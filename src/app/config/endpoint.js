// ============================================
// STOCK DATA API ENDPOINTS
// ============================================

// List all stocks with data
export const stock_list_endpoint = "api/stock-data/";

// Get latest stock data with filters (search, gainer, date)
export const stock_latest_endpoint = "api/stock-data/latest/";

// Stock data entries
export const stock_entries_endpoint = "api/stock-data/entries/";

// Fetch stock data from Nepal Stock Exchange
export const stock_fetch_endpoint = "api/stock-data/fetch/";

// Get structured data for ML training
export const stock_structured_endpoint = "api/stock-data/structured/";

// ============================================
// PREDICTIONS API ENDPOINTS
// ============================================

// Generate predictions using ML models
export const predictions_generate_endpoint = "api/predictions/generate/";

// Add LSTM predictions
export const predictions_lstm_endpoint = "api/predictions/lstm/";

// Add Random Forest predictions
export const predictions_rf_endpoint = "api/predictions/random-forest/";

// ============================================
// TECHNICAL ANALYSIS API ENDPOINTS
// ============================================

// Get technical indicators for a stock
export const analysis_indicators_endpoint = "api/stock-data/analysis/indicators/";

// Get trading signals for a stock
export const analysis_signals_endpoint = "api/stock-data/analysis/signals/";

// Stock screener
export const analysis_screener_endpoint = "api/stock-data/analysis/screener/";

// Backtest strategy
export const analysis_backtest_endpoint = "api/stock-data/analysis/backtest/";

// Backtest results
export const analysis_backtest_results_endpoint = "api/stock-data/analysis/backtest-results/";

// ============================================
// UNUSUAL ACTIVITY DETECTION API ENDPOINTS
// ============================================

// Top stocks to watch (primary endpoint for daily monitoring)
export const top_stocks_endpoint = "api/stock-data/analysis/top-stocks/";

// Unusual activity detector
export const unusual_activity_endpoint = "api/stock-data/analysis/unusual-activity/";

// Accumulation alerts
export const accumulation_alerts_endpoint = "api/stock-data/analysis/accumulation-alerts/";

// Breakout watchlist
export const breakout_watchlist_endpoint = "api/stock-data/analysis/breakout-watchlist/";

// ============================================
// PORTFOLIO MANAGEMENT API ENDPOINTS
// ============================================

// Portfolios CRUD
export const portfolios_endpoint = "api/stock-data/portfolios/";

// Holdings CRUD
export const holdings_endpoint = "api/stock-data/holdings/";

// Trades CRUD
export const trades_endpoint = "api/stock-data/trades/";

// Portfolio performance
export const portfolio_performance_endpoint = "api/stock-data/portfolio-performance/";

// ============================================
// FLOORSHEET DATA API ENDPOINTS
// ============================================

// Upload floorsheet HTML
export const floorsheet_upload_endpoint = "api/stock-data/floorsheet/upload/";

// Scrape floorsheet (Selenium)
export const floorsheet_scrape_endpoint = "api/stock-data/floorsheet/scrape/";

// Get floorsheet data
export const floorsheet_data_endpoint = "api/stock-data/floorsheet/data/";

// Floorsheet analysis
export const floorsheet_analysis_endpoint = "api/stock-data/floorsheet/analysis/";

// Broker activity tracker
export const floorsheet_broker_endpoint = "api/stock-data/floorsheet/broker/";

// Per-broker bought / sold / net holdings for a stock over a date range
export const broker_holdings_endpoint = "api/stock-data/floorsheet/broker-holdings/";

// ============================================
// NEPSE INDICES API ENDPOINTS
// ============================================

// Scrape NEPSE indices
export const indices_scrape_endpoint = "api/stock-data/indices/scrape/";

// Get NEPSE indices data
export const indices_data_endpoint = "api/stock-data/indices/data/";

// NEPSE indices analysis
export const indices_analysis_endpoint = "api/stock-data/indices/analysis/";

// Compare NEPSE indices
export const indices_compare_endpoint = "api/stock-data/indices/compare/";

// List all NEPSE indices
export const indices_list_endpoint = "api/stock-data/indices/list/";

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export const login_endpoint = "api/accounts/token/";
export const register_endpoint = "api/accounts/register/";
export const refresh_token_endpoint = "api/token/refresh/";
export const users_endpoint = "api/accounts/users/";

// ============================================
// LEGACY ENDPOINTS (for backward compatibility)
// ============================================

export const stock_recent_endpoint = "api/stock-data/latest/";
export const stock_detail_endpoint = "api/stock-data/";
export const login = "api/accounts/token/";
export const refresh_token = "api/token/refresh/";
export const load_stock_data_endpoint = "api/stock-data/fetch/";
export const predict_stock_data_endpoint = "api/predictions/generate/";