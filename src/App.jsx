
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { HomeContentProvider } from './context/HomeContentContext';
import { Header } from './components/Header';
import { ScrollRestoration } from './components/ScrollRestoration';
import PageLoader from './components/ui/PageLoader';
import RouteTransitionLoader from './components/ui/RouteTransitionLoader';

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const PortfolioDetailPage = lazy(() => import('./pages/PortfolioDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CollaboratePage = lazy(() => import('./pages/CollaboratePage'));
const UniversitiesPage = lazy(() => import('./pages/UniversitiesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const GalleryCollectionPage = lazy(() => import('./pages/GalleryCollectionPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));
const NewsVlogPage = lazy(() => import('./pages/NewsVlogPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const EducationProgramPage = lazy(() => import('./pages/EducationProgramPage'));
const WhatWeOfferPage = lazy(() => import('./pages/WhatWeOfferPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Footer = lazy(() =>
  import('./components/Footer').then((module) => ({ default: module.Footer }))
);
const FloatingContactButton = lazy(() =>
  import('./components/FloatingContactButton').then((module) => ({
    default: module.FloatingContactButton,
  }))
);

function FooterFallback() {
  return (
    <div className="h-[360px] border-t border-border/50 bg-muted/20 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`footer-fallback-${index + 1}`} className="space-y-3">
            <div className="h-5 w-28 rounded bg-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-muted/80 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-muted/80 animate-pulse" />
            <div className="h-3 w-4/6 rounded bg-muted/80 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingButtonFallback() {
  return (
    <div className="fixed bottom-4 right-4 z-30 h-14 w-14 rounded-full bg-muted animate-pulse" />
  );
}

function App() {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <RouteTransitionLoader />
        <ScrollRestoration />
        <Header />
        <main className="flex-grow">
          <Suspense
            fallback={
              <PageLoader />
            }
          >
            <Routes>
              <Route
                path="/"
                element={(
                  <HomeContentProvider>
                    <HomePage />
                  </HomeContentProvider>
                )}
              />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/collaborate" element={<CollaboratePage />} />
              <Route path="/universities" element={<UniversitiesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/gallery/collection/:collectionSlug" element={<GalleryCollectionPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/news-blog" element={<NewsVlogPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/what-we-offer" element={<WhatWeOfferPage />} />
              <Route path="/education-program" element={<Navigate to="/what-we-offer" replace />} />
              <Route
                path="/education-program/:programType/:degreeLevel"
                element={<EducationProgramPage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Suspense fallback={<FooterFallback />}>
          <Footer />
        </Suspense>
        <Suspense fallback={<FloatingButtonFallback />}>
          <FloatingContactButton />
        </Suspense>
      </div>
    </SettingsProvider>
  );
}

export default App;
