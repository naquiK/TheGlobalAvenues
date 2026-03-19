import { useEffect, useState } from 'react';
import { BookOpenCheck, ChevronLeft, ChevronRight, Globe2, GraduationCap, Rocket } from 'lucide-react';
import useScrollAnimation, { useScrollAnimation as useVisibility } from '../hooks/useScrollAnimation';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=800&fit=crop&q=80',
    title: 'Global University Network',
    description: 'Connect with over 500+ prestigious universities across 50+ countries worldwide.',
    icon: Globe2,
    chip: 'Global Reach',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop&q=80',
    title: 'Expert Student Support',
    description: 'Dedicated mentors guiding you through every step of your international education journey.',
    icon: GraduationCap,
    chip: 'Mentor-Led',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&q=80',
    title: 'Diverse Learning Programs',
    description: 'Explore thousands of academic programs tailored to your goals and aspirations.',
    icon: BookOpenCheck,
    chip: 'Program Depth',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop&q=80',
    title: 'Career Pathways',
    description: 'Transform your future with world-class education and career opportunities.',
    icon: Rocket,
    chip: 'Career Outcomes',
  },
];

export default function ImageCarousel() {
  const [visibilityRef, isVisible] = useVisibility();
  const headingRef = useScrollAnimation({ y: 20, duration: 600 });
  const contentRef = useScrollAnimation({ y: 24, duration: 600, delay: 120 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );

  useEffect(() => {
    if (!autoPlay) return undefined;

    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5800);

    return () => window.clearInterval(interval);
  }, [autoPlay]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const updateMobileState = (event) => {
      setIsMobile(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMobileState);
      return () => mediaQuery.removeEventListener('change', updateMobileState);
    }

    mediaQuery.addListener(updateMobileState);
    return () => mediaQuery.removeListener(updateMobileState);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  const activeSlide = slides[currentSlide];
  const ActiveIcon = activeSlide.icon;

  return (
    <section
      ref={visibilityRef}
      className="relative -mt-px overflow-hidden bg-transparent px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div
          ref={headingRef}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="section-title-classic mb-5">
            Why <span className="section-title-classic-accent">Choose Us</span>
          </h2>
          <p className="section-subtitle-classic">
            Explore the key aspects that make us your perfect education partner
          </p>
        </div>

        <div ref={contentRef} className="relative">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-7">
            <article className="relative overflow-hidden rounded-3xl border border-border bg-white/85 shadow-[0_18px_36px_rgba(18,12,45,0.1)] dark:border-[#2B2354] dark:bg-[#15112B] dark:shadow-[0_22px_48px_rgba(0,0,0,0.55)]">
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out"
                style={{
                  transform: isMobile ? 'scale(1)' : isVisible ? 'scale(1.02)' : 'scale(1.06)',
                }}
              />
              <div className="absolute inset-0 bg-black/40 dark:bg-black/55" />

              <div className="relative flex min-h-[300px] flex-col justify-end p-6 text-white sm:min-h-[360px] sm:p-8 lg:min-h-[440px]">
                <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                  <ActiveIcon className="h-4 w-4" />
                  {activeSlide.chip}
                </div>

                <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">{activeSlide.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base lg:text-lg">
                  {activeSlide.description}
                </p>
              </div>
            </article>

            <div className="space-y-4">
              {slides.map((slide, index) => {
                const Icon = slide.icon;
                const isActive = index === currentSlide;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5 ${
                      isActive
                        ? 'border-primary/70 bg-primary/5 shadow-[0_16px_34px_rgba(33,25,84,0.16)] dark:bg-white/5'
                        : 'border-border bg-white/80 shadow-sm hover:-translate-y-0.5 hover:border-primary/45 hover:bg-white dark:border-[#2B2354] dark:bg-[#15112B] dark:hover:border-white/30'
                    }`}
                    aria-label={`Show ${slide.title}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                          isActive
                            ? 'border-primary/40 bg-primary/10 text-primary'
                            : 'border-border bg-white text-primary dark:border-[#2B2354] dark:bg-[#1C1634] dark:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {slide.chip}
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-foreground sm:text-xl">{slide.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">{slide.description}</p>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 flex-shrink-0 ${
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="order-2 flex items-center gap-2 sm:order-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-10 bg-gradient-to-r from-primary to-accent'
                      : 'w-2.5 bg-primary/25 hover:bg-primary/45 dark:bg-white/20 dark:hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="order-1 flex items-center gap-2 sm:order-2">
              <button
                onClick={prevSlide}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-white/70 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/18"
                aria-label="Previous"
                type="button"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-white/70 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/18"
                aria-label="Next"
                type="button"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
