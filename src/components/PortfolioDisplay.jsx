import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Landmark, MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getFeaturedPortfolios } from '../services/portfolioService';
import { portfolioData } from '../data/portfolioData';

const getLocalFeaturedPortfolios = (limit) => portfolioData.slice(0, limit);

export default function PortfolioDisplay({ limit = 10 }) {
  const [portfolios, setPortfolios] = useState(() => getLocalFeaturedPortfolios(limit));
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(5);
  const [carouselMetrics, setCarouselMetrics] = useState({ width: 0, gap: 24 });
  const viewportRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadFeatured = async () => {
      const localPortfolios = getLocalFeaturedPortfolios(limit);
      setPortfolios(localPortfolios);
      setIsLoading(localPortfolios.length === 0);
      try {
        const data = await getFeaturedPortfolios(limit);
        if (isMounted) {
          setPortfolios(Array.isArray(data) && data.length > 0 ? data : localPortfolios);
        }
      } catch (error) {
        if (isMounted) {
          setPortfolios(localPortfolios);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  // Set items per row based on screen size
  useEffect(() => {
    const updateItemsPerRow = () => {
      if (window.innerWidth < 640) {
        setItemsPerRow(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerRow(2);
      } else {
        setItemsPerRow(5);
      }
    };

    updateItemsPerRow();
    window.addEventListener('resize', updateItemsPerRow);
    return () => window.removeEventListener('resize', updateItemsPerRow);
  }, []);

  const updateCarouselMetrics = useCallback(() => {
    const width = viewportRef.current?.clientWidth || 0;
    const gap = window.innerWidth < 640 ? 16 : 24;
    setCarouselMetrics((previous) =>
      previous.width === width && previous.gap === gap ? previous : { width, gap }
    );
  }, []);

  useEffect(() => {
    updateCarouselMetrics();
    window.addEventListener('resize', updateCarouselMetrics);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && viewportRef.current) {
      resizeObserver = new ResizeObserver(updateCarouselMetrics);
      resizeObserver.observe(viewportRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateCarouselMetrics);
      resizeObserver?.disconnect();
    };
  }, [updateCarouselMetrics]);

  const maxIndex = Math.max(0, portfolios.length - itemsPerRow);
  const hasMultipleRows = portfolios.length > itemsPerRow;
  const cardWidth =
    carouselMetrics.width > 0
      ? Math.max(0, (carouselMetrics.width - carouselMetrics.gap * (itemsPerRow - 1)) / itemsPerRow)
      : 0;
  const cardStep = cardWidth + carouselMetrics.gap;
  const fallbackBasis =
    itemsPerRow === 1
      ? '100%'
      : `calc((100% - ${(itemsPerRow - 1) * carouselMetrics.gap}px) / ${itemsPerRow})`;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Auto-rotate through items
  useEffect(() => {
    if (portfolios.length <= itemsPerRow) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, portfolios.length, itemsPerRow]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const getInitials = (title = '') =>
    title
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || '')
      .join('');

  const trimMeta = (text = '', maxLength = 38) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(itemsPerRow)].map((_, i) => (
          <div key={i} className="bg-muted rounded-2xl h-[460px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="carousel-scroll-stable w-full">
      {/* Carousel Container */}
      <div className="relative">
        {/* Cards Grid */}
        <div ref={viewportRef} className="overflow-hidden px-1 pb-10 pt-4">
          <div
            className="carousel-motion-track flex items-stretch transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              gap: `${carouselMetrics.gap}px`,
              transform: `translate3d(-${currentIndex * cardStep}px, 0, 0)`,
            }}
          >
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="carousel-motion-card group flex-shrink-0 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2"
                style={{ flexBasis: cardWidth > 0 ? `${cardWidth}px` : fallbackBasis }}
              >
                <Link to={`/portfolio/${portfolio.slug || portfolio.id}`} className="block h-full">
                  <div className="relative flex h-full min-h-[460px] flex-col overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 via-background to-background shadow-[0_20px_45px_-34px_rgba(45,27,105,0.95)] transition-all duration-300 group-hover:border-accent/60 group-hover:shadow-[0_22px_55px_-30px_rgba(232,82,26,0.6)]">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/20 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-accent/30" />
                    <div className="pointer-events-none absolute -left-10 bottom-20 h-24 w-24 rounded-full bg-primary/20 blur-2xl transition-all duration-500 group-hover:scale-125" />

                    {/* Image Container */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-muted">
                      <img
                        src={portfolio.image}
                        alt={portfolio.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 transition-colors duration-300" />
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                          {portfolio.country}
                        </span>
                        {portfolio.details?.founded && (
                          <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                            Est. {portfolio.details.founded}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-end gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/35 bg-white/10 text-sm font-bold text-white backdrop-blur-sm">
                          {getInitials(portfolio.title)}
                        </div>
                        <span className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                          Curated Partner
                        </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        Featured Institution
                      </div>

                      {/* Title */}
                      <h3 className="mb-1 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                        {portfolio.title}
                      </h3>

                      {/* Category */}
                      <p className="mb-4 line-clamp-1 text-sm text-muted-foreground">
                        {portfolio.category}
                      </p>

                      {/* Metadata */}
                      <div className="mb-4 space-y-2 text-xs">
                        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                          <span className="line-clamp-1">{trimMeta(portfolio.details?.location)}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-2 text-muted-foreground">
                          <Landmark className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                          <span className="line-clamp-1">{trimMeta(portfolio.details?.ranking)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
                        {portfolio.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center justify-between border-t border-primary/20 pt-3">
                        <span className="text-sm font-semibold text-primary">View Institute</span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Only show if multiple items */}
        {hasMultipleRows && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/60 bg-primary/95 p-2 text-white shadow-[0_12px_28px_rgba(45,27,105,0.28)] transition-all duration-300 hover:scale-110 hover:bg-primary"
              aria-label="Previous"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/60 bg-primary/95 p-2 text-white shadow-[0_12px_28px_rgba(45,27,105,0.28)] transition-all duration-300 hover:scale-110 hover:bg-primary"
              aria-label="Next"
              type="button"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {hasMultipleRows && (
        <div className="flex justify-center gap-2 mt-8 sm:mt-12">
          {Array.from({ length: portfolios.length - itemsPerRow + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-brand-purple dark:bg-brand-orange'
                  : 'w-2.5 bg-brand-purple/25 hover:bg-brand-purple/45 dark:bg-white/25 dark:hover:bg-white/45'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
