import useLazySection from '../../hooks/useLazySection';
import SectionSkeleton from './SectionSkeleton';

export default function LazySection({
  children,
  className = '',
  fallback = null,
  height = 'h-[520px]',
  rootMargin = '900px',
  preloadOnIdle = true,
  idleDelay = 150,
  idleTimeout = 2000,
}) {
  const { ref, isVisible } = useLazySection({
    rootMargin,
    preloadOnIdle,
    idleDelay,
    idleTimeout,
  });

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback || <SectionSkeleton height={height} />}
    </div>
  );
}
