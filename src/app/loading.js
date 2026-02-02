export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[var(--color-accent)]/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[var(--color-accent)] rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-[var(--foreground-muted)] animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
