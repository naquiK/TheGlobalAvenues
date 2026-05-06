import useLazySection from '../../hooks/useLazySection';
import SectionSkeleton from './SectionSkeleton';

export default function LazySection({
  children,
  className = '',
  fallback = null,
  height = 'h-[520px]',
  rootMargin = '900px',
}) {
  const { ref, isVisible } = useLazySection(rootMargin);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback || <SectionSkeleton height={height} />}
    </div>
  );
}
