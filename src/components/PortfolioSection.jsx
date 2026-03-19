import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PortfolioDisplay from './PortfolioDisplay';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function PortfolioSection() {
  const headerRef = useScrollAnimation({ y: 20, duration: 600 });
  const gridRef = useScrollAnimation({ y: 20, duration: 600, delay: 200 });
  const ctaRef = useScrollAnimation({ y: 20, duration: 600, delay: 400 });

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="section-kicker-classic mb-3 sm:mb-4">
            Featured Opportunities
          </div>
          <h2 className="section-title-classic mb-3 sm:mb-4">
            Our Featured <span className="section-title-classic-accent">Portfolio</span>
          </h2>
          <p className="section-subtitle-classic px-2">
            Discover top universities and educational institutions we partner with. Each offers unique opportunities for global education and career advancement.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div
          ref={gridRef}
          className="overflow-hidden"
        >
          <PortfolioDisplay limit={10} />
        </div>

        {/* CTA Section */}
        <div
          ref={ctaRef}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-all duration-300 group"
          >
            Explore All Universities
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-3 sm:mt-4">
            Browse our complete portfolio of 100+ partner institutions worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
