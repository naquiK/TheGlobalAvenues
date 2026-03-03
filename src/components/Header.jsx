import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { portfolioData, categories, partnerCompanies } from '../data/portfolioData';


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const logo = 'https://theglobalavenues.com/wp-content/uploads/2024/04/Transparent_png-e1722253623779-1536x398.png';

  const mainMenuItems = [
    { label: 'Home', path: '/' },
    { label: 'Who We Are', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'News & Blog', path: '/news-blog' },
    { label: 'Partners', path: '/partners' },
    { label: 'Gallery', path: '/gallery' },
  ];

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
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
          {/* Logo: keeps aspect ratio and avoids shrinking on smaller screens */}
          <div className="flex-shrink-0">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src={logo} alt="Logo" className="h-12 md:h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-1" ref={dropdownRef}>
            {mainMenuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md ${isActive(item.path)
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
                Portfolio
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {(openDropdown === 'portfolio') && (
                <div
                  className="absolute left-0 mt-2 w-96 bg-background border border-border rounded-xl shadow-xl animate-fade-in-down origin-top overflow-hidden"
                  onMouseEnter={() => setOpenDropdown('portfolio')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
                    <h3 className="text-lg font-bold">Our Universities</h3>
                    <p className="text-sm text-white/80 mt-1">Explore 9+ partner institutions worldwide</p>
                  </div>

                  {/* Grid Layout */}
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {portfolioData.map((portfolio) => (
                        <Link
                          key={portfolio.id}
                          to={`/portfolio/${portfolio.id}`}
                          className="group/item p-3 rounded-lg hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground group-hover/item:text-primary transition-colors">{portfolio.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{portfolio.country}</p>
                              <p className="text-xs text-accent mt-1 font-medium">{portfolio.studentsPlaced}+ Students</p>
                            </div>
                            <div className="text-right ml-2">
                              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                                {portfolio.programs} Programs
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="border-t border-border px-6 py-3 bg-muted/20">
                    <Link to="/portfolio" className="text-sm font-medium text-primary hover:text-secondary transition-colors">
                      View All Universities →
                    </Link>
                  </div>
                </div>
              )}
            </div>


          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            <Link
              to="/collaborate"
              className="hidden sm:inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 font-medium text-sm"
            >
              Connect Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 animate-fade-in-down">
            {/* show logo at top of mobile menu for branding */}

            {mainMenuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition-colors text-sm ${isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Portfolio Dropdown */}
            <button
              onClick={() => setOpenMobileDropdown(openMobileDropdown === 'portfolio' ? null : 'portfolio')}
              className="w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors flex items-center justify-between text-sm"
            >
              Portfolio
              <ChevronDown className={`w-4 h-4 transition-transform ${openMobileDropdown === 'portfolio' ? 'rotate-180' : ''}`} />
            </button>
            {openMobileDropdown === 'portfolio' && (
              <div className="pl-4 space-y-1">
                {portfolioData.map((portfolio) => (
                  <Link
                    key={portfolio.id}
                    to={`/portfolio/${portfolio.id}`}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-md transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenMobileDropdown(null);
                    }}
                  >
                    {portfolio.title}
                  </Link>
                ))}
              </div>
            )}



            <Link
              to="/collaborate"
              className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center font-medium text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Connect Now
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
