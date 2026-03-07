import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { portfolioData } from '../data/portfolioData';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const logo =
    'https://theglobalavenues.com/wp-content/uploads/2024/04/Transparent_png-e1722253623779-1536x398.png';

  const mainMenuItems = [
    { label: 'Home', path: '/' },
    { label: 'Who We Are', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src={logo} alt="Logo" className="h-12 md:h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-1" ref={dropdownRef}>
            
            {/* Home + Who we are */}
            {mainMenuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md ${
                  isActive(item.path)
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Portfolio Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setOpenDropdown('portfolio')}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2 rounded-md hover:bg-primary/5"
              >
                Our Portfolio
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {openDropdown === 'portfolio' && (
                <div
                  className="absolute left-0 mt-2 w-96 bg-background border border-border rounded-xl shadow-xl animate-fade-in-down"
                  onMouseEnter={() => setOpenDropdown('portfolio')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
                    <h3 className="text-lg font-bold">Our Universities</h3>
                    <p className="text-sm text-white/80">
                      Explore partner institutions worldwide
                    </p>
                  </div>

                  <div className="p-4 max-h-96 overflow-y-auto">
                    {portfolioData.map((portfolio) => (
                      <Link
                        key={portfolio.id}
                        to={`/portfolio/${portfolio.id}`}
                        className="block p-3 rounded-lg hover:bg-primary/10 transition-all"
                      >
                        <h4 className="font-semibold">{portfolio.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {portfolio.country}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-border px-6 py-3 bg-muted/20">
                    <Link
                      to="/portfolio"
                      className="text-sm font-medium text-primary"
                    >
                      View All Universities →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Offerings Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setOpenDropdown('offer')}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary flex items-center gap-2 rounded-md hover:bg-primary/5"
              >
                Offerings
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {openDropdown === 'offer' && (
                <div
                  className="absolute left-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-xl"
                  onMouseEnter={() => setOpenDropdown('offer')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
                    <h3 className="text-lg font-bold">Programs</h3>
                  </div>

                  <div className="p-4 space-y-2">
                    <Link to="/what-we-offer" className="block p-2 hover:bg-muted rounded">
                      All Programs
                    </Link>
                    <Link to="/education-program/fulltime-degree/undergraduate" className="block p-2 hover:bg-muted rounded">
                      Full Time Degree
                    </Link>
                    <Link to="/education-program/online-program/undergraduate" className="block p-2 hover:bg-muted rounded">
                      Online Program
                    </Link>
                    <Link to="/education-program/vocational-courses/undergraduate" className="block p-2 hover:bg-muted rounded">
                      Vocational Courses
                    </Link>
                    <Link to="/education-program/internship-abroad/undergraduate" className="block p-2 hover:bg-muted rounded">
                      Internship Abroad
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* News Blog */}
            <Link
              to="/news-blog"
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isActive('/news-blog')
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              News & Blog
            </Link>

            {/* Gallery */}
            <Link
              to="/gallery"
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isActive('/gallery')
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Gallery
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            <Link
              to="/collaborate"
              className="hidden sm:inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              Connect Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-4 py-2">Home</Link>
            <Link to="/about" className="block px-4 py-2">Who We Are</Link>
            <Link to="/portfolio" className="block px-4 py-2">Our Portfolio</Link>
            <Link to="/what-we-offer" className="block px-4 py-2">Offerings</Link>
            <Link to="/news-blog" className="block px-4 py-2">News & Blog</Link>
            <Link to="/gallery" className="block px-4 py-2">Gallery</Link>
          </nav>
        )}
      </div>
    </header>
  );
}