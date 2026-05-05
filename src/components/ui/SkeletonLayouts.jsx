const lineWidthClass = ['w-full', 'w-11/12', 'w-4/5', 'w-2/3'];

function Line({ className = 'h-3 w-full rounded-full' }) {
  return <div className={`skeleton-line ${className}`} />;
}

function Circle({ className = 'h-10 w-10' }) {
  return <div className={`skeleton-card rounded-full ${className}`} />;
}

function Card({ children, className = '' }) {
  return (
    <div className={`skeleton-card rounded-2xl border border-border/50 p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeadingSkeleton({ align = 'center', className = '' }) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`} aria-hidden="true">
      <Line className={`${centered ? 'mx-auto' : ''} h-8 w-40 rounded-full`} />
      <Line className={`${centered ? 'mx-auto' : ''} mt-5 h-9 w-3/4 rounded-xl`} />
      <Line className={`${centered ? 'mx-auto' : ''} mt-4 h-3 w-full rounded-full`} />
      <Line className={`${centered ? 'mx-auto' : ''} mt-2 h-3 w-4/5 rounded-full`} />
    </div>
  );
}

export function HeroPanelSkeleton({ className = '' }) {
  return (
    <section className={`px-4 py-20 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="skeleton-surface mx-auto max-w-7xl rounded-[30px] border border-border/60 p-8 sm:p-10 lg:p-12">
        <div className="mx-auto max-w-4xl text-center">
          <Line className="mx-auto h-8 w-44 rounded-full" />
          <Line className="mx-auto mt-6 h-12 w-4/5 rounded-2xl" />
          <Line className="mx-auto mt-4 h-9 w-3/5 rounded-2xl" />
          <div className="mx-auto mt-7 max-w-3xl space-y-3">
            <Line />
            <Line className="h-3 w-11/12 rounded-full" />
            <Line className="mx-auto h-3 w-3/4 rounded-full" />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Line key={`hero-chip-${index + 1}`} className="h-10 w-36 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsGridSkeleton({ count = 4, className = '' }) {
  return (
    <section className={`px-4 py-12 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={`stats-skeleton-${index + 1}`} className="p-6 text-center">
            <Line className="mx-auto h-9 w-20 rounded-xl" />
            <Line className="mx-auto mt-4 h-3 w-28 rounded-full" />
          </Card>
        ))}
      </div>
    </section>
  );
}

export function SplitContentSkeleton({ className = '' }) {
  return (
    <section className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <Line className="h-8 w-40 rounded-full" />
          <Line className="h-10 w-4/5 rounded-xl" />
          <Line className="h-10 w-2/3 rounded-xl" />
          {lineWidthClass.map((width) => (
            <Line key={width} className={`h-3 ${width} rounded-full`} />
          ))}
        </div>
        <Card className="min-h-[280px] p-7">
          <div className="flex items-center gap-3">
            <Circle className="h-12 w-12" />
            <div className="flex-1 space-y-3">
              <Line className="h-3 w-32 rounded-full" />
              <Line className="h-6 w-48 rounded-xl" />
            </div>
          </div>
          <div className="mt-7 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`split-row-${index + 1}`} className="flex items-center gap-3">
                <Circle className="h-5 w-5" />
                <Line className="h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

export function CardGridSkeleton({
  count = 6,
  columns = 'md:grid-cols-2 lg:grid-cols-3',
  image = false,
  showHeading = true,
  className = '',
}) {
  return (
    <section className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        {showHeading ? <SectionHeadingSkeleton className="mb-10" /> : null}
        <div className={`grid grid-cols-1 gap-6 ${columns}`}>
          {Array.from({ length: count }).map((_, index) => (
            <Card key={`card-grid-skeleton-${index + 1}`} className="p-0">
              {image ? <div className="skeleton-card h-48 rounded-t-2xl" /> : null}
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <Circle />
                  <Line className="h-6 w-20 rounded-full" />
                </div>
                <Line className="mt-5 h-6 w-4/5 rounded-xl" />
                <Line className="mt-4 h-3 w-full rounded-full" />
                <Line className="mt-2 h-3 w-5/6 rounded-full" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Line className="h-16 rounded-xl" />
                  <Line className="h-16 rounded-xl" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProfileGridSkeleton({ count = 7, className = '' }) {
  return (
    <section className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-6xl">
        <SectionHeadingSkeleton className="mb-12" />
        <div className="grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-4">
          {Array.from({ length: count }).map((_, index) => (
            <Card
              key={`profile-skeleton-${index + 1}`}
              className={index < 2 ? 'lg:col-span-2' : ''}
            >
              <div className="flex gap-4">
                <div className="skeleton-card h-24 w-24 flex-shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <Line className="h-6 w-4/5 rounded-xl" />
                  <Line className="mt-3 h-4 w-2/3 rounded-full" />
                  <Line className="mt-5 h-3 w-full rounded-full" />
                  <Line className="mt-2 h-3 w-5/6 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AccreditationSkeleton({ className = '' }) {
  return (
    <section className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-6xl">
        <SectionHeadingSkeleton className="mb-12" />
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={`accreditation-skeleton-${index + 1}`} className="rounded-[34px] p-5">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
                <Card className="min-h-[300px]">
                  <div className="flex items-center gap-3">
                    <Circle className="h-12 w-12" />
                    <div className="flex-1 space-y-3">
                      <Line className="h-3 w-32 rounded-full" />
                      <Line className="h-6 w-44 rounded-xl" />
                    </div>
                  </div>
                  <Line className="mt-8 h-[150px] rounded-2xl" />
                </Card>
                <Card className="min-h-[300px]">
                  <div className="space-y-4">
                    <Line />
                    <Line className="h-3 w-11/12 rounded-full" />
                    <Line className="h-3 w-5/6 rounded-full" />
                    <Line className="mt-8 h-3 w-full rounded-full" />
                    <Line className="h-3 w-4/5 rounded-full" />
                  </div>
                </Card>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="h-72" />
          <Card className="h-72" />
        </div>
      </div>
    </section>
  );
}

export function FormContactSkeleton({ className = '' }) {
  return (
    <section className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <Line className="h-8 w-64 rounded-xl" />
          <Line className="mt-4 h-3 w-4/5 rounded-full" />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`form-field-${index + 1}`}>
                <Line className="h-4 w-24 rounded-full" />
                <Line className="mt-2 h-12 rounded-xl" />
              </div>
            ))}
          </div>
          <Line className="mt-5 h-36 rounded-xl" />
          <Line className="mt-5 h-12 rounded-xl" />
        </Card>
        <div className="space-y-5 lg:col-span-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`contact-card-${index + 1}`}>
              <div className="flex gap-3">
                <Circle />
                <div className="flex-1 space-y-3">
                  <Line className="h-3 w-28 rounded-full" />
                  <Line className="h-5 w-3/4 rounded-xl" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessSkeleton({ count = 3, className = '' }) {
  return (
    <section className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        <SectionHeadingSkeleton className="mb-10" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <Card key={`process-skeleton-${index + 1}`}>
              <div className="flex items-center justify-between">
                <Circle className="h-12 w-12" />
                <Line className="h-5 w-10 rounded-full" />
              </div>
              <Line className="mt-6 h-6 w-2/3 rounded-xl" />
              <Line className="mt-4 h-3 w-full rounded-full" />
              <Line className="mt-2 h-3 w-4/5 rounded-full" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticleGridSkeleton({ count = 6, featured = false, className = '' }) {
  return (
    <section className={`px-4 py-12 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        {featured ? <SectionHeadingSkeleton align="left" className="mb-8" /> : null}
        <div className={`grid grid-cols-1 gap-8 ${featured ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {Array.from({ length: count }).map((_, index) => (
            <Card key={`article-skeleton-${index + 1}`} className="overflow-hidden p-0">
              <div className="skeleton-card h-56 rounded-t-2xl" />
              <div className="p-6">
                <Line className="h-7 w-24 rounded-full" />
                <Line className="mt-5 h-6 w-full rounded-xl" />
                <Line className="mt-3 h-3 w-full rounded-full" />
                <Line className="mt-2 h-3 w-5/6 rounded-full" />
                <div className="mt-6 flex justify-between gap-4 border-t border-border/50 pt-4">
                  <Line className="h-4 w-28 rounded-full" />
                  <Line className="h-4 w-20 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GalleryGridSkeleton({ count = 6, withFilters = true, className = '' }) {
  return (
    <section className={`px-4 py-12 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        {withFilters ? (
          <Card className="mb-8">
            <Line className="h-4 w-44 rounded-full" />
            <div className="mt-4 flex flex-wrap gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Line key={`gallery-filter-${index + 1}`} className="h-10 w-32 rounded-full" />
              ))}
            </div>
          </Card>
        ) : null}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <Card key={`gallery-skeleton-${index + 1}`} className="overflow-hidden p-0">
              <div className="skeleton-card h-60 rounded-t-2xl" />
              <div className="p-4">
                <Line className="h-4 w-full rounded-full" />
                <Line className="mt-2 h-4 w-3/4 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrackListSkeleton({ count = 5, className = '' }) {
  return (
    <section className={`px-4 py-10 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        <SectionHeadingSkeleton align="left" className="mb-8" />
        <div className="space-y-5">
          {Array.from({ length: count }).map((_, index) => (
            <Card key={`track-skeleton-${index + 1}`} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex max-w-3xl flex-1 gap-4">
                  <Circle className="h-12 w-12" />
                  <div className="flex-1">
                    <Line className="h-7 w-64 rounded-xl" />
                    <Line className="mt-4 h-3 w-full rounded-full" />
                    <Line className="mt-2 h-3 w-4/5 rounded-full" />
                  </div>
                </div>
                <Line className="h-11 w-40 rounded-xl" />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Line className="h-36 rounded-xl" />
                <Line className="h-36 rounded-xl" />
                <Line className="h-36 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DetailSkeleton({ className = '' }) {
  return (
    <div className={`min-h-screen bg-background px-4 pb-20 pt-24 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        <Line className="mb-8 h-10 w-44 rounded-full" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="skeleton-card h-[420px] rounded-2xl" />
          </div>
          <Card className="min-h-[420px]">
            <Line className="h-8 w-4/5 rounded-xl" />
            <Line className="mt-4 h-3 w-full rounded-full" />
            <Line className="mt-2 h-3 w-5/6 rounded-full" />
            <div className="mt-8 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Line key={`detail-stat-${index + 1}`} className="h-20 rounded-xl" />
              ))}
            </div>
          </Card>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="h-72" />
          <Card className="h-72" />
        </div>
      </div>
    </div>
  );
}

export function CtaSkeleton({ className = '' }) {
  return (
    <section className={`px-4 py-10 sm:px-6 lg:px-8 ${className}`} aria-hidden="true">
      <div className="skeleton-surface mx-auto max-w-7xl rounded-[32px] border border-border/60 p-8 sm:p-10">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Line className="h-4 w-44 rounded-full" />
            <Line className="mt-4 h-8 w-3/4 rounded-xl" />
            <Line className="mt-4 h-3 w-full max-w-2xl rounded-full" />
            <Line className="mt-2 h-3 w-4/5 max-w-xl rounded-full" />
          </div>
          <Line className="h-12 w-44 rounded-xl" />
        </div>
      </div>
    </section>
  );
}
