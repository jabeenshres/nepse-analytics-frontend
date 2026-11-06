export default function BrokerHoldingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 bg-[var(--background-tertiary)] rounded w-72 mb-2"></div>
        <div className="h-4 bg-[var(--background-tertiary)] rounded w-96"></div>
      </div>

      {/* Controls Skeleton */}
      <div className="card p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-[var(--background-tertiary)] rounded"></div>
          <div className="h-10 bg-[var(--background-tertiary)] rounded w-20"></div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <div className="h-3 bg-[var(--background-tertiary)] rounded w-20 mb-2"></div>
            <div className="h-10 bg-[var(--background-tertiary)] rounded"></div>
          </div>
          <div className="flex-1 min-w-[180px]">
            <div className="h-3 bg-[var(--background-tertiary)] rounded w-20 mb-2"></div>
            <div className="h-10 bg-[var(--background-tertiary)] rounded"></div>
          </div>
          <div className="min-w-[170px]">
            <div className="h-3 bg-[var(--background-tertiary)] rounded w-16 mb-2"></div>
            <div className="h-10 bg-[var(--background-tertiary)] rounded"></div>
          </div>
          <div className="min-w-[140px]">
            <div className="h-3 bg-[var(--background-tertiary)] rounded w-20 mb-2"></div>
            <div className="h-10 bg-[var(--background-tertiary)] rounded"></div>
          </div>
        </div>
      </div>

      {/* Coverage Banner Skeleton */}
      <div className="card p-4">
        <div className="h-5 bg-[var(--background-tertiary)] rounded w-80 mb-4"></div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-[var(--background-tertiary)] rounded w-28 mb-2"></div>
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-36"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6">
            <div className="h-3 bg-[var(--background-tertiary)] rounded w-24 mb-3"></div>
            <div className="h-7 bg-[var(--background-tertiary)] rounded w-32 mb-3"></div>
            <div className="h-3 bg-[var(--background-tertiary)] rounded w-28"></div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="card p-6">
        <div className="h-5 bg-[var(--background-tertiary)] rounded w-56 mb-4"></div>
        <div className="skeleton h-80 w-full"></div>
      </div>

      {/* Table Skeleton */}
      <div className="card p-6 space-y-3">
        <div className="h-5 bg-[var(--background-tertiary)] rounded w-48 mb-4"></div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-[var(--background-tertiary)] rounded flex-1"></div>
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-20"></div>
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-20"></div>
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-20"></div>
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-6 right-6 bg-[var(--background-secondary)] px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-[var(--foreground-secondary)]">
          Loading broker holdings...
        </span>
      </div>
    </div>
  );
}
