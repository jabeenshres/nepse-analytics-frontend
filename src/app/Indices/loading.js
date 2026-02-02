export default function IndicesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 bg-[var(--background-tertiary)] rounded w-48 mb-2"></div>
        <div className="h-4 bg-[var(--background-tertiary)] rounded w-72"></div>
      </div>

      {/* Main Index Hero Skeleton */}
      <div className="card p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 bg-[var(--background-tertiary)] rounded w-32 mb-3"></div>
            <div className="h-12 bg-[var(--background-tertiary)] rounded w-48 mb-2"></div>
            <div className="h-6 bg-[var(--background-tertiary)] rounded w-24"></div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-[var(--background-tertiary)] rounded w-24 mb-2"></div>
            <div className="h-8 bg-[var(--background-tertiary)] rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-[var(--background-tertiary)] rounded w-32"></div>
        ))}
      </div>

      {/* Indices Grid Skeleton */}
      <div>
        <div className="h-6 bg-[var(--background-tertiary)] rounded w-36 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card p-4">
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-24 mb-3"></div>
              <div className="h-6 bg-[var(--background-tertiary)] rounded w-20 mb-2"></div>
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Indices Skeleton */}
      <div>
        <div className="h-6 bg-[var(--background-tertiary)] rounded w-40 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card p-4">
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-28 mb-3"></div>
              <div className="h-6 bg-[var(--background-tertiary)] rounded w-20 mb-2"></div>
              <div className="h-4 bg-[var(--background-tertiary)] rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-6 right-6 bg-[var(--background-secondary)] px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-[var(--foreground-secondary)]">Loading indices...</span>
      </div>
    </div>
  );
}
