import { Hero } from '../components/Hero';
import ImageCarousel from '../components/ImageCarousel';
import { Services } from '../components/Services';
import { Contact } from '../components/Contact';
import { Testimonials } from '../components/Testimonials';
import PortfolioSection from '../components/PortfolioSection';

export default function HomePage() {
  return (
    <div className="pt-16">
      <Hero />
      <ImageCarousel />
      <Services />
      <PortfolioSection />
      <Testimonials />
      <Contact />
    </div>
  );
}
