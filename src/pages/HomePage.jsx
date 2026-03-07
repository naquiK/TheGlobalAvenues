import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import ImageCarousel from '../components/ImageCarousel';
import { Services } from '../components/Services';
import { Contact } from '../components/Contact';
import { Testimonials } from '../components/Testimonials';
import { PortfolioPreview } from '../components/PortfolioPreview';
import PortfolioSection from '../components/PortfolioSection';
import EducationSpotlight from '../components/EducationSpotlight';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="pt-16">
      <Hero />
      <ImageCarousel />
      {/* <EducationSpotlight /> */}
      <Services />
      <PortfolioSection />
      <Testimonials />
      <Contact />
    </div>
  );
}
