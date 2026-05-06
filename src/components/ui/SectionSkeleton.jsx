export default function SectionSkeleton({
  height = 'h-64',
  className = '',
  cards = 3,
  rows = 3,
}) {
  return (
    <div
      className={`skeleton-surface w-full ${height} rounded-2xl border border-border/50 bg-[#F5F3FF] p-5 dark:bg-[#1A1033] max-w-7xl mx-auto my-4 ${className}`}
      aria-hidden="true"
    >
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-3">
          <div className="skeleton-line h-4 w-28 rounded-full" />
          <div className="skeleton-line h-8 w-2/3 max-w-xl rounded-xl" />
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={`section-skeleton-row-${index + 1}`}
              className={`skeleton-line h-3 rounded-full ${index === rows - 1 ? 'w-3/5' : 'w-full max-w-3xl'}`}
            />
          ))}
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={`section-skeleton-card-${index + 1}`}
              className="skeleton-card min-h-28 rounded-xl border border-white/45 dark:border-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
