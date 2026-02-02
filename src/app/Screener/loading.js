export default function ScreenerLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 bg-[var(--background-tertiary)] rounded w-48 mb-2"></div>
        <div className="h-4 bg-[var(--background-tertiary)] rounded w-80"></div>
      </div>

      {/* Stock Type Filter Skeleton */}
      <div className="card p-4">
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-[var(--background-tertiary)] rounded w-28"></div>
          ))}
        </div>
      </div>

      {/* Screener Types Skeleton */}
      <div className="grid md:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="h-5 w-5 bg-[var(--background-tertiary)] rounded mb-2"></div>
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-20 mb-2"></div>
            <div className="h-3 bg-[var(--background-tertiary)] rounded w-full"></div>
          </div>
        ))}
      </div>

      {/* Price Filters Skeleton */}
      <div className="card p-4">
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-[var(--background-tertiary)] rounded"></div>
          <div className="flex-1 h-10 bg-[var(--background-tertiary)] rounded"></div>
          <div className="h-10 bg-[var(--background-tertiary)] rounded w-32"></div>
          <div className="h-10 bg-[var(--background-tertiary)] rounded w-24"></div>
        </div>
      </div>

      {/* Results Summary Skeleton */}
      <div>
        <div className="h-6 bg-[var(--background-tertiary)] rounded w-48 mb-2"></div>
        <div className="h-4 bg-[var(--background-tertiary)] rounded w-64"></div>
      </div>

      {/* Table Skeleton */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              {[...Array(10)].map((_, i) => (
                <th key={i} className="p-4">
                  <div className="h-4 bg-[var(--background-tertiary)] rounded w-16"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-b border-[var(--border-color)]">
                {[...Array(10)].map((_, j) => (
                  <td key={j} className="p-4">
                    <div className="h-4 bg-[var(--background-tertiary)] rounded w-16"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-6 right-6 bg-[var(--background-secondary)] px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-[var(--foreground-secondary)]">Running screener...</span>
      </div>
    </div>
  );
}
