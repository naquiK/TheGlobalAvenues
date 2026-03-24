import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter, Globe, Award } from 'lucide-react';
import { getPortfolios, getCategories, searchPortfolios } from '../services/portfolioService';

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getPortfolios();
        const cats = await getCategories();
        setPortfolios(result.data || result);
        setFilteredPortfolios(result.data || result);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading portfolios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const filterAndSearch = async () => {
      let result = portfolios;

      // Category filter
      if (selectedCategory !== 'All') {
        result = result.filter(p => p.category === selectedCategory);
      }

      // Search filter
      if (searchQuery.trim()) {
        const searchResults = await searchPortfolios(searchQuery);
        result = result.filter(p => searchResults.some(sr => sr.id === p.id));
      }

      setFilteredPortfolios(result);
    };

    filterAndSearch();
  }, [selectedCategory, searchQuery, portfolios]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 animate-glow">
              Our Partner Institutions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
              Global Institutions We Represent
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore universities and institutions we support with market representation, channel partnerships, and enrollment growth.
            </p>
          </motion.div>

          {/* Search and Filter Controls */}
          <motion.div
            className="space-y-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search by institution, country, or focus area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 capitalize ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground scale-105'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Results Count */}
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Showing {filteredPortfolios.length} universit{filteredPortfolios.length !== 1 ? 'ies' : 'y'}
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Portfolio Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-muted rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredPortfolios.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {filteredPortfolios.map((portfolio) => (
                  <motion.div
                    key={portfolio.id}
                    variants={cardVariants}
                    whileHover="hover"
                    exit="exit"
                    className="group relative overflow-hidden rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      <motion.img
                        src={portfolio.image}
                        alt={portfolio.partnerName || portfolio.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />

                      {portfolio.logo && (
                        <div className="absolute top-4 left-4 rounded-xl border border-white/35 bg-white/95 p-1.5 shadow-md">
                          <img
                            src={portfolio.logo}
                            alt={`${portfolio.title} logo`}
                            loading="lazy"
                            decoding="async"
                            className="h-7 w-auto max-w-[5.5rem] object-contain"
                          />
                        </div>
                      )}

                      {/* Overlay Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {portfolio.country}
                      </div>

                      {/* Achievement Badge */}
                      {portfolio.achievement && (
                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-accent/90 text-accent-foreground text-xs font-bold rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {portfolio.achievement}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <motion.div
                      className="p-6"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-foreground mb-2">{portfolio.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{portfolio.description}</p>
                      {portfolio.details?.intakeWindows && (
                        <p className="text-xs text-muted-foreground mb-1">
                          <span className="font-semibold text-foreground">Intakes:</span>{' '}
                          {portfolio.details.intakeWindows}
                        </p>
                      )}
                      {portfolio.contact && (
                        <p className="text-xs text-muted-foreground mb-3">
                          <span className="font-semibold text-foreground">Email:</span> {portfolio.contact}
                        </p>
                      )}

                      {/* View Details Button */}
                      <Link
                        to={`/portfolio/${portfolio.slug || portfolio.id}`}
                        className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm transition-colors duration-300 group/btn"
                      >
                        View Full Profile
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No institutions found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search criteria or filters to find what you're looking for
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
