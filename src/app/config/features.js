// Presentation registry for sidebar destinations.
//
// Keys MUST match accounts/access_config.py on the backend. The backend returns the
// keys a user may access; this file only decides how they are displayed. Add a new
// destination here and to the backend FEATURES map to make it configurable.

export const FEATURES = [
  { key: "dashboard", label: "Dashboard", path: "/", icon: "Home", section: "main" },
  { key: "sharelist", label: "Stock Prices", path: "/Sharelist", icon: "Chart", section: "main" },
  { key: "top_stocks", label: "Top Stocks", path: "/TopStocks", icon: "TrendingUp", section: "main" },
  { key: "indices", label: "NEPSE Indices", path: "/Indices", icon: "Globe", section: "main" },
  { key: "screener", label: "Screener", path: "/Screener", icon: "Filter", section: "main" },
  { key: "broker_holdings", label: "Broker Holdings", path: "/BrokerHoldings", icon: "Broker", section: "main" },
  { key: "about", label: "About", path: "/About", icon: "Info", section: "main" },
  { key: "download", label: "Download Data", path: "/Download", icon: "Download", section: "admin" },
  { key: "users", label: "Users", path: "/Users", icon: "Users", section: "admin" },
];

// Routes reachable without a token. Keep in sync with middleware.js.
export const PUBLIC_PATHS = ["/Login", "/Signup", "/About"];

export function isPublicPath(pathname) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function featuresForSidebar(allowedKeys = []) {
  const allowed = new Set(allowedKeys);
  return FEATURES.filter((feature) => allowed.has(feature.key));
}
