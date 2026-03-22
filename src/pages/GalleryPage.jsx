import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon, X } from 'lucide-react';
import { getGallery } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';

const GRID_IMAGE_SIZES = '(min-width: 1280px) 360px, (min-width: 1024px) 32vw, (min-width: 768px) 48vw, 96vw';

const FALLBACK_GALLERY_RESPONSE = [
  {
    category: 'Highlights',
    local: true,
    images: [
      { image: '/videos/hero-poster.jpg', caption: 'Institution Partnership Highlights' },
      { image: '/videos/hero-poster.jpg', caption: 'Delegations and Industry Events' },
      { image: '/videos/hero-poster.jpg', caption: 'Global University Network' },
    ],
  },
];

const PARTNER_UNIVERSITY_GALLERY_RESPONSE = [
  {
    category: 'Partner Universities',
    local: true,
    images: [
      {
        image: '/gallery/partners/iau-rak-campus.webp',
        thumbnail: '/gallery/partners/iau-rak-campus.webp',
        caption: 'International American University - RAK Campus',
      },
      {
        image: '/gallery/partners/icn-business-school.jpg',
        thumbnail: '/gallery/partners/icn-business-school-thumb.jpg',
        srcSet: [
          { src: '/gallery/partners/icn-business-school-thumb.jpg', width: 640 },
          { src: '/gallery/partners/icn-business-school.jpg', width: 1180 },
        ],
        sizes: GRID_IMAGE_SIZES,
        caption: 'ICN Business School',
      },
      {
        image: '/gallery/partners/fh-kufstein.jpg',
        thumbnail: '/gallery/partners/fh-kufstein-thumb.jpg',
        srcSet: [
          { src: '/gallery/partners/fh-kufstein-thumb.jpg', width: 640 },
          { src: '/gallery/partners/fh-kufstein.jpg', width: 1200 },
        ],
        sizes: GRID_IMAGE_SIZES,
        caption: 'FH Kufstein University of Applied Sciences',
      },
      {
        image: '/gallery/partners/kes-college.jpg',
        thumbnail: '/gallery/partners/kes-college-thumb.jpg',
        srcSet: [
          { src: '/gallery/partners/kes-college-thumb.jpg', width: 640 },
          { src: '/gallery/partners/kes-college.jpg', width: 1916 },
        ],
        sizes: GRID_IMAGE_SIZES,
        caption: 'KES College',
      },
      {
        image: '/gallery/partners/university-of-nicosia.jpg',
        thumbnail: '/gallery/partners/university-of-nicosia-thumb.jpg',
        srcSet: [
          { src: '/gallery/partners/university-of-nicosia-thumb.jpg', width: 640 },
          { src: '/gallery/partners/university-of-nicosia.jpg', width: 800 },
        ],
        sizes: GRID_IMAGE_SIZES,
        caption: 'University of Nicosia',
      },
      {
        image: '/gallery/partners/epitech.webp',
        thumbnail: '/gallery/partners/epitech.webp',
        caption: 'Epitech',
      },
    ],
  },
];

const normalizeCategoryKey = (label) =>
  String(label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const mergeGallerySources = (...sources) =>
  sources.flatMap((source) => (Array.isArray(source) ? source : []));

const resolveGalleryAsset = (path, useLocalAsset = false) => {
  if (!path) return '';
  if (useLocalAsset) return String(path);
  return resolveMediaUrl(path);
};

const buildGalleryModel = (rawData) => {
  const items = [];
  const uniqueCategories = new Map();
  const seenImages = new Set();

  (Array.isArray(rawData) ? rawData : []).forEach((categoryBlock, blockIndex) => {
    const label = categoryBlock?.category || `Category ${blockIndex + 1}`;
    const key = normalizeCategoryKey(label) || `category-${blockIndex + 1}`;

    if (!uniqueCategories.has(key)) {
      uniqueCategories.set(key, { key, label });
    }

    (Array.isArray(categoryBlock?.images) ? categoryBlock.images : []).forEach((imageItem, imageIndex) => {
      const useLocalAsset = Boolean(categoryBlock?.local || imageItem?.local);
      const image = resolveGalleryAsset(imageItem?.image, useLocalAsset);
      const thumbnail = resolveGalleryAsset(imageItem?.thumbnail || imageItem?.image, useLocalAsset);
      const srcSet = Array.isArray(imageItem?.srcSet)
        ? imageItem.srcSet
            .filter((source) => source?.src && source?.width)
            .map((source) => {
              const sourceIsLocal = useLocalAsset || Boolean(source?.local);
              return `${resolveGalleryAsset(source.src, sourceIsLocal)} ${source.width}w`;
            })
            .join(', ')
        : '';
      const sizes = imageItem?.sizes || GRID_IMAGE_SIZES;
      if (!image || seenImages.has(`${key}:${image}`)) return;
      seenImages.add(`${key}:${image}`);

      items.push({
        id: `${key}-${imageIndex}`,
        type: 'image',
        title: imageItem?.caption || label,
        image,
        thumbnail,
        srcSet,
        sizes,
        categoryKey: key,
        categoryLabel: label,
      });
    });
  });

  return {
    items,
    categories: [{ key: 'all', label: 'All' }, ...Array.from(uniqueCategories.values())],
  };
};

const DEFAULT_GALLERY_MODEL = buildGalleryModel(
  mergeGallerySources(FALLBACK_GALLERY_RESPONSE, PARTNER_UNIVERSITY_GALLERY_RESPONSE)
);

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [galleryItems, setGalleryItems] = useState(DEFAULT_GALLERY_MODEL.items);
  const [categories, setCategories] = useState(DEFAULT_GALLERY_MODEL.categories);
  const isLoading = false;

  useEffect(() => {
    const controller = new AbortController();

    const loadGallery = async () => {
      try {
        const data = await getGallery({ signal: controller.signal });
        const mapped = buildGalleryModel(mergeGallerySources(data, PARTNER_UNIVERSITY_GALLERY_RESPONSE));

        if (mapped.items.length > 0) {
          setGalleryItems(mapped.items);
          setCategories(mapped.categories);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Keep local fallback content already in state when the API is unavailable.
        }
      }
    };

    loadGallery();

    return () => controller.abort();
  }, []);

  const filteredItems = useMemo(() => {
    if (filterType === 'all') return galleryItems;
    return galleryItems.filter((item) => item.categoryKey === filterType);
  }, [filterType, galleryItems]);

  const selectedImage = selectedIndex === null ? null : filteredItems[selectedIndex] || null;

  useEffect(() => {
    if (selectedIndex === null) return;
    if (filteredItems.length === 0) {
      setSelectedIndex(null);
      return;
    }
    if (!filteredItems[selectedIndex]) {
      setSelectedIndex(0);
    }
  }, [filteredItems, selectedIndex]);

  useEffect(() => {
    if (selectedImage === null || typeof document === 'undefined') return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedImage]);

  useEffect(() => {
    if (selectedImage === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
      }
      if (event.key === 'ArrowLeft' && filteredItems.length > 0) {
        setSelectedIndex((current) => {
          if (current === null) return 0;
          return (current - 1 + filteredItems.length) % filteredItems.length;
        });
      }
      if (event.key === 'ArrowRight' && filteredItems.length > 0) {
        setSelectedIndex((current) => {
          if (current === null) return 0;
          return (current + 1) % filteredItems.length;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredItems]);

  const goToPreviousImage = () => {
    if (filteredItems.length === 0) return;
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return (current - 1 + filteredItems.length) % filteredItems.length;
    });
  };

  const goToNextImage = () => {
    if (filteredItems.length === 0) return;
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return (current + 1) % filteredItems.length;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      <section className="relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(83,64,176,0.22),transparent)]" />
        <motion.div
          className="mx-auto max-w-7xl rounded-[30px] border border-border/60 bg-gradient-to-br from-primary/10 via-background/95 to-accent/10 px-6 py-10 shadow-[0_24px_70px_rgba(18,14,40,0.18)] backdrop-blur-sm sm:px-8 sm:py-12 lg:px-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:border-white/20 dark:bg-white/10 dark:text-white">
              <ImageIcon className="h-3.5 w-3.5" />
              Visual Stories
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Gallery
              <span className="block bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_40%,#8B63E5_60%,#E8521A_100%)] bg-clip-text text-transparent">
                Moments & Milestones
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore partnership events, global delegations, and institutional collaborations that shape our
              international education network.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <span className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                {galleryItems.length} visual highlights
              </span>
              <span className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                {Math.max(categories.length - 1, 0)} categories
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm backdrop-blur-sm sm:p-5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Browse by category
          </p>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.key}
                onClick={() => setFilterType(cat.key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  filterType === cat.key
                    ? 'bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(45,27,105,0.22)]'
                    : 'border border-border bg-muted/70 text-foreground hover:border-primary/40 hover:bg-primary/10'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {isLoading && (
          <motion.div
            className="rounded-2xl border border-border/70 bg-muted/20 py-14 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-muted-foreground">Loading gallery...</p>
          </motion.div>
        )}

        {!isLoading && (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="group relative h-[320px] cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-sm transition-all duration-300 hover:border-primary/45 hover:shadow-[0_18px_46px_rgba(20,14,45,0.22)]"
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => item.type === 'image' && setSelectedIndex(index)}
              >
                <motion.img
                  src={item.thumbnail || item.image}
                  srcSet={item.srcSet || undefined}
                  sizes={item.sizes || GRID_IMAGE_SIZES}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  onError={(event) => {
                    const target = event.currentTarget;
                    if (target.dataset.fallbackApplied === 'true') return;
                    target.dataset.fallbackApplied = 'true';
                    target.src = item.image;
                    target.removeAttribute('srcset');
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#070513]/95 via-[#070513]/35 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">{item.categoryLabel}</p>
                    <h3 className="mt-2 line-clamp-2 text-xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>

                <div className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                  {item.categoryLabel}
                </div>

                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  View
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <motion.div
            className="rounded-2xl border border-border/70 bg-muted/20 py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-muted-foreground">No items found in this category</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              className="relative w-full max-w-6xl"
              initial={{ scale: 0.9, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ duration: 0.22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute right-3 top-3 z-20 rounded-full border border-white/35 bg-black/45 p-2 text-white transition-colors hover:bg-black/65"
                type="button"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>

              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/35 bg-black/45 p-2 text-white transition-colors hover:bg-black/65 sm:left-4"
                    type="button"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/35 bg-black/45 p-2 text-white transition-colors hover:bg-black/65 sm:right-4"
                    type="button"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="max-h-[74vh] w-full rounded-2xl border border-white/15 object-contain bg-black/20"
              />

              <div className="mt-4 flex flex-col items-center justify-between gap-2 rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-center text-white sm:flex-row sm:text-left">
                <div>
                  <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
                  <p className="text-sm text-white/75">{selectedImage.categoryLabel}</p>
                </div>
                <p className="text-sm font-medium text-white/80">
                  {selectedIndex + 1} / {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
