export default function TopStocksLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 bg-[var(--background-tertiary)] rounded w-64 mb-2"></div>
        <div className="h-4 bg-[var(--background-tertiary)] rounded w-96"></div>
      </div>

      {/* Stock Type Filter Skeleton */}
      <div className="card p-4">
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-[var(--background-tertiary)] rounded w-28"></div>
          ))}
        </div>
      </div>

      {/* Search Skeleton */}
      <div className="card p-4">
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-[var(--background-tertiary)] rounded"></div>
          <div className="h-10 bg-[var(--background-tertiary)] rounded w-24"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-[var(--background-tertiary)] rounded w-36"></div>
        ))}
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-5">
            <div className="flex justify-between mb-3">
              <div>
                <div className="h-5 bg-[var(--background-tertiary)] rounded w-20 mb-2"></div>
                <div className="h-4 bg-[var(--background-tertiary)] rounded w-32"></div>
              </div>
              <div className="h-6 bg-[var(--background-tertiary)] rounded w-28"></div>
            </div>
            <div className="h-8 bg-[var(--background-tertiary)] rounded w-32 mb-3"></div>
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-full mb-2"></div>
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-6 right-6 bg-[var(--background-secondary)] px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-[var(--foreground-secondary)]">Analyzing stocks...</span>
      </div>
    </div>
  );
}
