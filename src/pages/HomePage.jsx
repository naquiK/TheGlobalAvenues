import { lazy, Suspense } from 'react';
import SectionSkeleton from '../components/ui/SectionSkeleton';
import useLazySection from '../hooks/useLazySection';

const HeroSection = lazy(() => import('../components/home/HeroSection'));
const UniversityTrustBar = lazy(() => import('../components/home/UniversityTrustBar'));
const SummerSchoolHighlightSection = lazy(() => import('../components/home/SummerSchoolHighlightSection'));
const ImageCarousel = lazy(() => import('../components/ImageCarousel'));
const Services = lazy(() =>
  import('../components/Services').then((module) => ({ default: module.Services }))
);
const Contact = lazy(() =>
  import('../components/Contact').then((module) => ({ default: module.Contact }))
);
const Testimonials = lazy(() =>
  import('../components/Testimonials').then((module) => ({ default: module.Testimonials }))
);
const PortfolioSection = lazy(() => import('../components/PortfolioSection'));
const ENABLE_HOME_TEXTURED_BG = true; // Undo option: set to false if you prefer the previous plain home background.

export default function HomePage() {
  const { ref: carouselRef, isVisible: carouselVisible } = useLazySection();
  const { ref: servicesRef, isVisible: servicesVisible } = useLazySection();
  const { ref: portfolioRef, isVisible: portfolioVisible } = useLazySection();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useLazySection();
  const { ref: contactRef, isVisible: contactVisible } = useLazySection();

  return (
    <div
      className={`home-page-gradient relative pt-16 ${
        ENABLE_HOME_TEXTURED_BG ? 'home-page-gradient--textured' : ''
      }`}
    >
      <Suspense fallback={<SectionSkeleton height="h-screen" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-24" />}>
        <UniversityTrustBar />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-[640px]" />}>
        <SummerSchoolHighlightSection />
      </Suspense>
      <div ref={servicesRef}>
        {servicesVisible ? (
          <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
            <Services />
          </Suspense>
        ) : (
          <SectionSkeleton height="h-[600px]" />
        )}
      </div>
      <div ref={carouselRef}>
        {carouselVisible ? (
          <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
            <ImageCarousel />
          </Suspense>
        ) : (
          <SectionSkeleton height="h-[500px]" />
        )}
      </div>
      <div ref={portfolioRef}>
        {portfolioVisible ? (
          <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
            <PortfolioSection />
          </Suspense>
        ) : (
          <SectionSkeleton height="h-[600px]" />
        )}
      </div>
      <div ref={testimonialsRef}>
        {testimonialsVisible ? (
          <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
            <Testimonials />
          </Suspense>
        ) : (
          <SectionSkeleton height="h-[500px]" />
        )}
      </div>
      <div ref={contactRef}>
        {contactVisible ? (
          <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
            <Contact />
          </Suspense>
        ) : (
          <SectionSkeleton height="h-[600px]" />
        )}
      </div>
    </div>
  );
}
