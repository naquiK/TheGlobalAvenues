import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackNavButton from '../components/ui/BackNavButton';
import { getGalleryCollectionBySlug } from '../data/galleryCollectionsData';
import Seo from '../components/seo/Seo';
import LazySection from '../components/ui/LazySection';
import { GalleryGridSkeleton } from '../components/ui/SkeletonLayouts';

const FALLBACK_IMAGE = '/videos/hero-poster.jpg';
const SWIPE_THRESHOLD_PX = 50;

export default function GalleryCollectionPage() {
  const { collectionSlug } = useParams();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const touchStartX = useRef(null);

  const collection = useMemo(
    () => getGalleryCollectionBySlug(String(collectionSlug || '')),
    [collectionSlug]
  );

  const photos = useMemo(
    () =>
      Array.isArray(collection?.photos)
        ? collection.photos
            .filter((photo) => photo && typeof photo.src === 'string')
            .map((photo) => ({
              ...photo,
              caption: typeof photo.caption === 'string' && photo.caption.trim() ? photo.caption : 'Gallery image',
            }))
        : [],
    [collection]
  );

  const selectedPhoto = selectedIndex === null ? null : photos[selectedIndex] || null;

  const handleImageError = (event) => {
    if (event.currentTarget.src.endsWith(FALLBACK_IMAGE)) return;
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  useEffect(() => {
    if (!selectedPhoto || typeof document === 'undefined') return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPhoto]);

  useEffect(() => {
    if (selectedIndex === null) return;
    if (photos.length === 0) {
      setSelectedIndex(null);
      return;
    }
    if (!photos[selectedIndex]) {
      setSelectedIndex(0);
    }
  }, [photos, selectedIndex]);

  useEffect(() => {
    if (selectedPhoto === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
      }
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) => {
          if (current === null) return 0;
          return (current - 1 + photos.length) % photos.length;
        });
      }
      if (event.key === 'ArrowRight') {
        setSelectedIndex((current) => {
          if (current === null) return 0;
          return (current + 1) % photos.length;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos.length, selectedPhoto]);

  const goPrevious = () => {
    if (photos.length === 0) return;
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return (current - 1 + photos.length) % photos.length;
    });
  };

  const goNext = () => {
    if (photos.length === 0) return;
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return (current + 1) % photos.length;
    });
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches?.[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const touchEndX = event.changedTouches?.[0]?.clientX ?? touchStartX.current;
    const deltaX = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX > 0) goPrevious();
    if (deltaX < 0) goNext();
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-background px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <Seo
          title="Gallery Collection Not Found"
          description="The requested gallery collection is currently unavailable."
          path={`/gallery/collection/${collectionSlug || ''}`}
          noindex
        />
        <div className="mx-auto max-w-4xl">
          <BackNavButton label="Back to Gallery" onClick={() => navigate('/gallery')} className="mb-8" />
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-10 text-center">
            <h1 className="text-3xl font-bold text-foreground">Collection Not Found</h1>
            <p className="mt-3 text-muted-foreground">This gallery collection is not available right now.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <Seo
        title={`${collection.title} - Gallery`}
        description={collection.description || `Browse photos from ${collection.title}.`}
        path={`/gallery/collection/${collection.slug}`}
        image={photos[0]?.src || FALLBACK_IMAGE}
        keywords={['gallery collection', collection.category, collection.title]}
      />
      <div className="mx-auto max-w-7xl">
        <BackNavButton label="Back to Gallery" onClick={() => navigate('/gallery')} className="mb-8" />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[30px] border border-border/70 bg-[linear-gradient(140deg,rgba(45,27,105,0.1)_0%,rgba(255,255,255,0.97)_50%,rgba(232,82,26,0.1)_100%)] p-6 shadow-[0_24px_68px_rgba(20,14,45,0.16)] dark:bg-[linear-gradient(140deg,rgba(45,27,105,0.36)_0%,rgba(14,10,28,0.97)_50%,rgba(232,82,26,0.16)_100%)] sm:p-8 lg:p-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <ImageIcon className="h-3.5 w-3.5" />
            {collection.category}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            {collection.title}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {collection.description}
          </p>
          <p className="mt-3 text-sm font-medium text-muted-foreground">{photos.length} photos in this collection</p>
        </motion.section>

        <LazySection fallback={<GalleryGridSkeleton count={6} withFilters={false} />}>
        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.length === 0 && (
            <div className="col-span-full rounded-2xl border border-border/70 bg-muted/20 py-12 text-center">
              <p className="text-base text-muted-foreground">No photos are available in this collection yet.</p>
            </div>
          )}

          {photos.map((photo, index) => (
            <motion.button
              key={`${photo.src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_18px_42px_rgba(17,15,43,0.2)]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: index * 0.04 }}
            >
              <div className="relative h-60 overflow-hidden sm:h-64">
                <img
                  src={photo.thumbnail || photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,11,24,0.12)_20%,rgba(7,8,18,0.84)_100%)]" />
                <p className="absolute bottom-4 left-4 right-4 line-clamp-2 text-sm font-semibold text-white">
                  {photo.caption}
                </p>
              </div>
            </motion.button>
          ))}
        </section>
        </LazySection>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${collection.title} image viewer`}
          >
            <motion.div
              className="relative flex max-h-[92vh] w-full max-w-6xl flex-col"
              initial={{ scale: 0.94, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="absolute right-3 top-3 z-20 rounded-full border border-white/40 bg-black/45 p-2 text-white transition-colors hover:bg-black/65"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrevious}
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-black/45 p-2 text-white transition-colors hover:bg-black/65 sm:left-4"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-black/45 p-2 text-white transition-colors hover:bg-black/65 sm:right-4"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.caption}
                loading="eager"
                decoding="async"
                onError={handleImageError}
                className="max-h-[62vh] w-full rounded-2xl border border-white/20 bg-black/20 object-contain sm:max-h-[72vh]"
              />

              <div className="mt-3 overflow-y-auto rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white">
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedPhoto.caption}</h3>
                    <p className="text-sm text-white/75">
                      {collection.title} - {collection.category}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-white/80">
                    {selectedIndex + 1} / {photos.length}
                  </p>
                </div>

                {photos.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {photos.map((photo, index) => (
                      <button
                        key={`${photo.src}-thumb-${index}`}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                          selectedIndex === index ? 'border-white' : 'border-white/30'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      >
                        <img
                          src={photo.thumbnail || photo.src}
                          alt={photo.caption}
                          loading="lazy"
                          onError={handleImageError}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
