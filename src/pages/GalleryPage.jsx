import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Play, X } from 'lucide-react';
import { getGallery } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([{ key: 'all', label: 'All' }]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const normalizeCategoryKey = (label) =>
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  useEffect(() => {
    const controller = new AbortController();

    const loadGallery = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getGallery({ signal: controller.signal });
        const items = [];
        const uniqueCategories = new Map();

        (data || []).forEach((categoryBlock, blockIndex) => {
          const label = categoryBlock.category || `Category ${blockIndex + 1}`;
          const key = normalizeCategoryKey(label) || `category-${blockIndex + 1}`;
          if (!uniqueCategories.has(key)) {
            uniqueCategories.set(key, { key, label });
          }

          (categoryBlock.images || []).forEach((imageItem, imageIndex) => {
            items.push({
              id: `${key}-${imageIndex}`,
              type: 'image',
              title: imageItem.caption || label,
              image: resolveMediaUrl(imageItem.image),
              categoryKey: key,
              categoryLabel: label,
            });
          });
        });

        setGalleryItems(items);
        setCategories([{ key: 'all', label: 'All' }, ...Array.from(uniqueCategories.values())]);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message || 'Unable to load gallery');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();

    return () => controller.abort();
  }, []);

  const filteredItems = useMemo(() => {
    if (filterType === 'all') return galleryItems;
    return galleryItems.filter((item) => item.categoryKey === filterType);
  }, [filterType, galleryItems]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Our Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore moments from our events, partnerships, and student success stories
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.key}
              onClick={() => setFilterType(cat.key)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 capitalize ${
                filterType === cat.key
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-muted-foreground text-lg">Loading gallery...</p>
          </motion.div>
        )}

        {!isLoading && errorMessage && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-muted-foreground text-lg">{errorMessage}</p>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {!isLoading && !errorMessage && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer h-80 bg-muted"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                onClick={() => item.type === 'image' && setSelectedImage(item)}
              >
                {/* Image */}
                <motion.img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{item.categoryLabel}</p>
                  </div>
                </div>

                {/* Video Badge */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                    <motion.div
                      className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Play className="w-8 h-8 text-white fill-white" />
                    </motion.div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 text-white text-xs rounded-full font-semibold capitalize">
                  {item.categoryLabel}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !errorMessage && filteredItems.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-muted-foreground text-lg">No items found in this category</p>
          </motion.div>
        )}
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative max-w-4xl w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white mb-1">{selectedImage.title}</h3>
              <p className="text-gray-300 capitalize">{selectedImage.category}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
