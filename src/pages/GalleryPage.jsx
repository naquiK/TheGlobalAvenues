import { motion } from 'framer-motion';
import { FolderOpen, ImageIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryCollections } from '../data/galleryCollectionsData';
import Seo from '../components/seo/Seo';
import LazySection from '../components/ui/LazySection';
import { GalleryGridSkeleton } from '../components/ui/SkeletonLayouts';

const ALL_CATEGORIES_KEY = 'all-categories';
const FALLBACK_COVER_IMAGE = '/videos/hero-poster.jpg';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES_KEY);

  const normalizedCollections = useMemo(
    () =>
      galleryCollections
        .filter(
          (collection) =>
            collection &&
            typeof collection.slug === 'string' &&
            typeof collection.title === 'string' &&
            typeof collection.categorySlug === 'string' &&
            typeof collection.category === 'string'
        )
        .map((collection) => {
          const photos = Array.isArray(collection.photos)
            ? collection.photos.filter((photo) => photo && typeof photo.src === 'string')
            : [];

          return {
            ...collection,
            photos,
            coverImage: photos[0]?.thumbnail || photos[0]?.src || FALLBACK_COVER_IMAGE,
          };
        }),
    []
  );

  const categoryFilters = useMemo(() => {
    const categories = Array.from(
      new Map(
        normalizedCollections.map((collection) => [
          collection.categorySlug,
          { slug: collection.categorySlug, name: collection.category },
        ])
      ).values()
    );

    return [{ slug: ALL_CATEGORIES_KEY, name: 'All Categories' }, ...categories];
  }, [normalizedCollections]);

  useEffect(() => {
    if (activeCategory === ALL_CATEGORIES_KEY) return;
    const categoryExists = categoryFilters.some((filter) => filter.slug === activeCategory);
    if (!categoryExists) {
      setActiveCategory(ALL_CATEGORIES_KEY);
    }
  }, [activeCategory, categoryFilters]);

  const filteredCollections = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES_KEY) {
      return normalizedCollections;
    }

    return normalizedCollections.filter((collection) => collection.categorySlug === activeCategory);
  }, [activeCategory, normalizedCollections]);

  const totalPhotos = useMemo(
    () => normalizedCollections.reduce((total, collection) => total + collection.photos.length, 0),
    [normalizedCollections]
  );

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      <Seo
        title="Photo Gallery — Events, Campus Tours & Partner Highlights"
        description="Browse The Global Avenues photo gallery featuring counselling events, international education conferences, university campus showcases, and partner highlights from around the world."
        path="/gallery"
        image="/gallery/collections/conferences/conference-events-2026/conference-cover-team-introduction.jpg"
        keywords={[
          'education gallery',
          'university events photos',
          'partner university photos',
          'education conference gallery',
          'campus showcase images',
          'international education events',
        ]}
      />
      <section className="relative overflow-hidden px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(83,64,176,0.22),transparent)]" />
        <motion.div
          className="mx-auto max-w-7xl rounded-[30px] border border-border/70 bg-[linear-gradient(140deg,rgba(45,27,105,0.09)_0%,rgba(255,255,255,0.97)_50%,rgba(232,82,26,0.1)_100%)] px-6 py-10 shadow-[0_24px_66px_rgba(20,14,45,0.16)] dark:bg-[linear-gradient(140deg,rgba(45,27,105,0.34)_0%,rgba(14,10,28,0.97)_50%,rgba(232,82,26,0.16)_100%)] sm:px-8 lg:px-12"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.48 }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <ImageIcon className="h-3.5 w-3.5" />
              Collection Gallery
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Gallery Collections
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse by category. Open any collection to view all photos with classic left-right lightbox navigation.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <span className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                {normalizedCollections.length} collections
              </span>
              <span className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                {totalPhotos} photos
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      <LazySection fallback={<GalleryGridSkeleton count={6} />}>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur-sm"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Browse by category
          </p>
          <div className="flex flex-wrap gap-2.5">
            {categoryFilters.map((filter, index) => (
              <motion.button
                key={filter.slug}
                type="button"
                onClick={() => setActiveCategory(filter.slug)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === filter.slug
                    ? 'bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(45,27,105,0.24)]'
                    : 'border border-border bg-muted/70 text-foreground hover:border-primary/35 hover:bg-primary/10'
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {filter.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {filteredCollections.length === 0 && (
          <motion.div
            className="rounded-2xl border border-border/70 bg-muted/20 py-14 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg text-muted-foreground">No collections found for this category.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCollections.map((collection, index) => (
            <motion.article
              key={collection.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_45px_rgba(17,15,43,0.22)]"
            >
              <Link to={`/gallery/collection/${collection.slug}`} className="block">
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <img
                    src={collection.coverImage}
                    alt={`${collection.title} cover`}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      if (event.currentTarget.src.endsWith(FALLBACK_COVER_IMAGE)) return;
                      event.currentTarget.src = FALLBACK_COVER_IMAGE;
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,14,30,0.1)_20%,rgba(7,8,18,0.86)_100%)]" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                    {collection.category}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="line-clamp-2 text-xl font-bold text-white">{collection.title}</h2>
                    <p className="mt-1 text-sm text-white/80">{collection.photos.length} photos</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {collection.description || 'Explore this photo collection.'}
                  </p>
                  <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <FolderOpen className="h-3.5 w-3.5" />
                    Open
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
      </LazySection>
    </div>
  );
}
