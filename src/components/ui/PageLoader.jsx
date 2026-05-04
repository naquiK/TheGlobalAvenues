export default function PageLoader() {
  return (
    <div className="min-h-screen bg-background px-4 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="h-10 w-64 rounded-xl bg-muted animate-pulse" />
        <div className="h-5 w-full rounded bg-muted/80 animate-pulse" />
        <div className="h-5 w-5/6 rounded bg-muted/80 animate-pulse" />
        <div className="mt-2 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`page-loader-card-${index + 1}`}
              className="h-56 rounded-2xl border border-border/50 bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
