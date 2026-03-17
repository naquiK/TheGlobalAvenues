import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';

export default function PortfolioDisplay({ limit = 10 }) {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(5);

  useEffect(() => {
    setPortfolios(portfolioData.slice(0, limit));
    setIsLoading(false);
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

  // Auto-rotate through items
  useEffect(() => {
    if (portfolios.length <= itemsPerRow) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = portfolios.length - itemsPerRow;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [portfolios.length, itemsPerRow]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const maxIndex = portfolios.length - itemsPerRow;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = portfolios.length - itemsPerRow;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const visiblePortfolios = portfolios.slice(currentIndex, currentIndex + itemsPerRow);
  const hasMultipleRows = portfolios.length > itemsPerRow;

  const cardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.4 } },
    hover: { y: -8, transition: { duration: 0.3 } }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(itemsPerRow)].map((_, i) => (
          <div key={i} className="bg-muted rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Carousel Container */}
      <div className="relative">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <AnimatePresence mode="wait">
            {visiblePortfolios.map((portfolio) => (
              <motion.div
                key={`${currentIndex}-${portfolio.id}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
                className="group cursor-pointer"
              >
                <Link to={`/portfolio/${portfolio.slug || portfolio.id}`} className="block h-full">
                  <div className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    {/* Image Container */}
                    <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
                      <img
                        src={portfolio.image}
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-end justify-start p-3 sm:p-4">
                        <span className="text-white text-xs font-semibold bg-primary px-3 py-1 rounded-full">
                          {portfolio.country}
                        </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 p-3 sm:p-5 flex flex-col">
                      {/* Title */}
                      <h3 className="font-bold text-base sm:text-lg text-foreground mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {portfolio.title}
                      </h3>

                      {/* Category */}
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-1">
                        {portfolio.category}
                      </p>

                      {/* Stats */}
                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Users className="w-3 sm:w-4 h-3 sm:h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{(portfolio.studentsPlaced / 1000).toFixed(1)}k</span> Students
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Award className="w-3 sm:w-4 h-3 sm:h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{portfolio.programs}</span> Programs
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{portfolio.successRate}%</span> Success
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
                        {portfolio.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm group-hover:gap-3 transition-all duration-300">
                        Learn More
                        <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Arrows - Only show if multiple items */}
        {hasMultipleRows && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 sm:-translate-x-16 lg:-translate-x-20 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-all duration-300 z-10 hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 sm:translate-x-16 lg:translate-x-20 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-all duration-300 z-10 hover:scale-110"
              aria-label="Next"
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
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-6 sm:w-8'
                  : 'bg-muted hover:bg-primary/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
