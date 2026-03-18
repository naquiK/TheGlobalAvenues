
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollRestoration } from './components/ScrollRestoration';

// Pages
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CollaboratePage from './pages/CollaboratePage';
import UniversitiesPage from './pages/UniversitiesPage';
import GalleryPage from './pages/GalleryPage';
import PartnersPage from './pages/PartnersPage';
import NewsVlogPage from './pages/NewsVlogPage';
import NewsDetailPage from './pages/NewsDetailPage';
import EducationProgramPage from './pages/EducationProgramPage';
import WhatWeOfferPage from './pages/WhatWeOfferPage';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <ScrollRestoration />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
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
            <Route path="/education-program/:programType/:degreeLevel" element={<EducationProgramPage />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}

export default App;
