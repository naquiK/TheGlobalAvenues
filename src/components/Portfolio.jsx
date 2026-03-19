import { useState, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { portfolioData } from '../data/portfolioData'
import { useAlternatingSlideAnimation } from '../hooks/useScrollAnimation';

export default function Portfolio() {
  const [portfolios] = useState(portfolioData);
  const containerRef = useRef(null);
  useAlternatingSlideAnimation(containerRef, 0.1);

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-fade-in" style={{ animation: 'fadeInUp 0.8s ease-out forwards', opacity: 0 }}>
          <h2 className="section-heading">Success Stories</h2>
          <p className="section-subheading max-w-3xl mx-auto">
            Showcasing successful placements and partnerships that transformed careers and businesses across industries.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((item, index) => {
            const slideDirection = index % 2 === 0 ? 'scroll-slide-in-left' : 'scroll-slide-in-right'
            return (
            <div
              key={item.id}
              data-slide
              className={`group bg-background border border-border rounded-lg overflow-hidden card-hover card-hover-glow ${slideDirection}`}
              style={{
                opacity: 0
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted image-zoom">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <ExternalLink className="text-primary-foreground transform scale-0 group-hover:scale-100 transition-transform duration-500" size={40} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-secondary font-semibold uppercase tracking-wide mb-2 group-hover:text-primary transition-colors duration-300">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed text-sm">
                  {item.description}
                </p>

                {/* Technologies/Impact */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Key Impact</p>
                  <p className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors duration-300">{item.impact}</p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full group-hover:bg-secondary/10 group-hover:text-secondary transition-all duration-300 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            )
          })}
        </div>

        
      </div>
    </section>
  )
}
