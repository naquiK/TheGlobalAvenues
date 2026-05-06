import { lazy, Suspense } from 'react';
import SectionSkeleton from '../components/ui/SectionSkeleton';
import useLazySection from '../hooks/useLazySection';
import Seo from '../components/seo/Seo';
import { SITE_URL } from '../seo/siteMeta';
import {
  CardGridSkeleton,
  FormContactSkeleton,
  GalleryGridSkeleton,
  HeroPanelSkeleton,
  ProcessSkeleton,
} from '../components/ui/SkeletonLayouts';

const HeroSection = lazy(() => import('../components/home/HeroSection'));
const UniversityTrustBar = lazy(() => import('../components/home/UniversityTrustBar'));
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

const HOME_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Global Avenues',
    url: `${SITE_URL}/`,
  },
];

export default function HomePage() {
  const { ref: carouselRef, isVisible: carouselVisible } = useLazySection();
  const { ref: servicesRef, isVisible: servicesVisible } = useLazySection();
  const { ref: portfolioRef, isVisible: portfolioVisible } = useLazySection();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useLazySection();
  const { ref: contactRef, isVisible: contactVisible } = useLazySection();

  return (
    <>
      <Seo
        title="Global Education Partnerships and Student Recruitment"
        description="Partner with The Global Avenues for international education consulting, university market entry strategy, and measurable enrollment growth support."
        path="/"
        image="/videos/hero-poster.jpg"
        keywords={[
          'international education consulting',
          'university partnerships',
          'student recruitment',
          'admissions support',
          'The Global Avenues',
        ]}
        jsonLd={HOME_SCHEMA}
      />
      <div
        className={`home-page-gradient relative pt-16 ${
          ENABLE_HOME_TEXTURED_BG ? 'home-page-gradient--textured' : ''
        }`}
      >
        <Suspense fallback={<HeroPanelSkeleton className="min-h-screen" />}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-24" cards={0} rows={1} />}>
          <UniversityTrustBar />
        </Suspense>
        <div ref={servicesRef}>
          {servicesVisible ? (
            <Suspense fallback={<CardGridSkeleton count={6} columns="md:grid-cols-2 lg:grid-cols-3" />}>
              <Services />
            </Suspense>
          ) : (
            <CardGridSkeleton count={6} columns="md:grid-cols-2 lg:grid-cols-3" />
          )}
        </div>
        <div ref={carouselRef}>
          {carouselVisible ? (
            <Suspense fallback={<GalleryGridSkeleton count={4} withFilters={false} />}>
              <ImageCarousel />
            </Suspense>
          ) : (
            <GalleryGridSkeleton count={4} withFilters={false} />
          )}
        </div>
        <div ref={portfolioRef}>
          {portfolioVisible ? (
            <Suspense fallback={<CardGridSkeleton count={6} image />}>
              <PortfolioSection />
            </Suspense>
          ) : (
            <CardGridSkeleton count={6} image />
          )}
        </div>
        <div ref={testimonialsRef}>
          {testimonialsVisible ? (
            <Suspense fallback={<ProcessSkeleton count={4} />}>
              <Testimonials />
            </Suspense>
          ) : (
            <ProcessSkeleton count={4} />
          )}
        </div>
        <div ref={contactRef}>
          {contactVisible ? (
            <Suspense fallback={<FormContactSkeleton />}>
              <Contact />
            </Suspense>
          ) : (
            <FormContactSkeleton />
          )}
        </div>
      </div>
    </>
  );
}
