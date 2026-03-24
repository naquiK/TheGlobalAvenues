
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { HomeContentProvider } from './context/HomeContentContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollRestoration } from './components/ScrollRestoration';
import PageLoader from './components/ui/PageLoader';

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const PortfolioDetailPage = lazy(() => import('./pages/PortfolioDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CollaboratePage = lazy(() => import('./pages/CollaboratePage'));
const UniversitiesPage = lazy(() => import('./pages/UniversitiesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));
const NewsVlogPage = lazy(() => import('./pages/NewsVlogPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const EducationProgramPage = lazy(() => import('./pages/EducationProgramPage'));
const WhatWeOfferPage = lazy(() => import('./pages/WhatWeOfferPage'));

function App() {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
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
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/news-blog" element={<NewsVlogPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/what-we-offer" element={<WhatWeOfferPage />} />
              <Route path="/education-program" element={<Navigate to="/what-we-offer" replace />} />
              <Route
                path="/education-program/:programType/:degreeLevel"
                element={<EducationProgramPage />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </SettingsProvider>
  );
}

export default App;
