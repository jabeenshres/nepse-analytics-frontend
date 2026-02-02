export default function HomeLoading() {
  return (
    <div className="min-h-screen space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="rounded-2xl bg-[var(--background-secondary)] h-48"></div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6">
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-[var(--background-tertiary)] rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Top Stocks Skeleton */}
      <div>
        <div className="h-6 bg-[var(--background-tertiary)] rounded w-48 mb-4"></div>
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex justify-between mb-3">
                <div className="h-5 bg-[var(--background-tertiary)] rounded w-20"></div>
                <div className="h-5 bg-[var(--background-tertiary)] rounded w-24"></div>
              </div>
              <div className="h-8 bg-[var(--background-tertiary)] rounded w-32 mb-2"></div>
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-6 right-6 bg-[var(--background-secondary)] px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-[var(--foreground-secondary)]">Loading dashboard...</span>
      </div>
    </div>
  );
}
