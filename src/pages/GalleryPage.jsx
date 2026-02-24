import { motion } from 'framer-motion';
import { useState } from 'react';
import { Play, X } from 'lucide-react';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      title: 'Student Success Event',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      category: 'events'
    },
    {
      id: 2,
      type: 'image',
      title: 'University Partnership Meeting',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      category: 'partnerships'
    },
    {
      id: 3,
      type: 'video',
      title: 'Student Testimonials',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      category: 'testimonials',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 4,
      type: 'image',
      title: 'Campus Visit',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop',
      category: 'campus'
    },
    {
      id: 5,
      type: 'image',
      title: 'Global Conference 2024',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      category: 'events'
    },
    {
      id: 6,
      type: 'video',
      title: 'Student Life Experience',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      category: 'testimonials',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 7,
      type: 'image',
      title: 'Graduation Ceremony',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop',
      category: 'events'
    },
    {
      id: 8,
      type: 'image',
      title: 'International Students Network',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      category: 'partnerships'
    },
    {
      id: 9,
      type: 'video',
      title: 'Scholarship Announcement',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      category: 'events',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
  ];

  const categories = ['all', 'events', 'partnerships', 'testimonials', 'campus'];
  const filteredItems = filterType === 'all' ? galleryItems : galleryItems.filter(item => item.category === filterType);

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
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 capitalize ${
                filterType === cat
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
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
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
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
                {item.category}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
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
