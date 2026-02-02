export default function StockDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-10 bg-[var(--background-tertiary)] rounded w-32"></div>

      {/* Stock Header Skeleton */}
      <div className="card p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="h-10 bg-[var(--background-tertiary)] rounded w-24 mb-2"></div>
            <div className="h-5 bg-[var(--background-tertiary)] rounded w-64"></div>
          </div>
          <div className="text-right">
            <div className="h-10 bg-[var(--background-tertiary)] rounded w-32 mb-2"></div>
            <div className="h-6 bg-[var(--background-tertiary)] rounded w-20"></div>
          </div>
        </div>

        {/* Price Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-16 mb-2"></div>
              <div className="h-6 bg-[var(--background-tertiary)] rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="card p-6">
        <div className="h-6 bg-[var(--background-tertiary)] rounded w-32 mb-4"></div>
        <div className="h-80 bg-[var(--background-tertiary)] rounded"></div>
      </div>

      {/* Additional Info Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="h-6 bg-[var(--background-tertiary)] rounded w-40 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-[var(--border-color)]">
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-24"></div>
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-20"></div>
            </div>
          ))}
        </div>
        <div className="card p-6">
          <div className="h-6 bg-[var(--background-tertiary)] rounded w-36 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-[var(--border-color)]">
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-28"></div>
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-6 right-6 bg-[var(--background-secondary)] px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-[var(--foreground-secondary)]">Loading stock details...</span>
      </div>
    </div>
  );
}
