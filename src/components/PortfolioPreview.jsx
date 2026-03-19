import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getFeaturedPortfolios } from '../services/portfolioService';

export function PortfolioPreview() {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const data = await getFeaturedPortfolios(3);
        setPortfolios(data);
      } catch (error) {
        console.error('Error loading portfolios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolios();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.4 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Success Stories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            Student Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our students have achieved their dreams at world-class universities around the globe
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {portfolios.map((portfolio) => (
              <motion.div
                key={portfolio.id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative h-96 rounded-2xl overflow-hidden bg-muted/30 backdrop-blur-sm border border-border/50 cursor-pointer"
              >
                {/* Image Container */}
                <motion.div
                  className="relative w-full h-full overflow-hidden"
                  variants={imageVariants}
                >
                  <img
                    src={portfolio.image}
                    alt={portfolio.studentName || portfolio.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6"
                    variants={overlayVariants}
                    initial="hidden"
                  >
                    <Link
                      to={`/portfolio/${portfolio.slug || portfolio.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 w-fit"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 to-transparent group-hover:from-black/95">
                  <motion.div
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{portfolio.studentName}</h3>
                    <p className="text-accent font-semibold mb-1">{portfolio.university}</p>
                    <p className="text-white/80 text-sm">{portfolio.program}</p>
                  </motion.div>
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full">
                  {portfolio.country}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/portfolio"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
              Explore All Success Stories
              <motion.span
                className="inline-block"
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
