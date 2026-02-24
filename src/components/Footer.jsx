import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const [ref, isVisible] = useScrollAnimation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = {
    'Quick Links': [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Services', path: '/services' },
      { label: 'Portfolio', path: '/portfolio' },
    ],
    'Explore': [
      { label: 'Gallery', path: '/gallery' },
      { label: 'Partners', path: '/partners' },
      { label: 'Universities', path: '/universities' },
      { label: 'Collaborate', path: '/collaborate' },
    ],
    'Connect': [
      { label: 'Contact Us', path: '/collaborate' },
      { label: 'Privacy Policy', external: true, href: '#' },
      { label: 'Terms of Service', external: true, href: '#' },
    ],
  };

  return (
    <footer className="bg-background border-t border-border relative">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">Subscribe to get the latest updates on university programs and opportunities.</p>
            </div>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div
            ref={ref}
            className={`lg:col-span-1 transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-[30px]'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TGA</span>
              </div>
              <span className="font-bold text-lg text-foreground">Global Avenues</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for international education and student recruitment across South Asia.
            </p>
          </div>

          {/* Link Sections */}
          {Object.entries(links).map(([title, items], index) => (
            <div
              key={title}
              className={`transition-all duration-1000 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-[30px]'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                        {item.label}
                      </a>
                    ) : (
                      <Link to={item.path} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 The Global Avenues. All rights reserved. | Enabling Global Education Excellence
          </p>

          <button
            onClick={scrollToTop}
            className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-secondary transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
