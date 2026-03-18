import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { portfolioMenuLabel } from '../config';
import { portfolioData } from '../data/portfolioData';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const { siteConfig } = useSettings();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isPortfolioActive = location.pathname.startsWith('/portfolio');
  const isOfferingActive =
    location.pathname === '/what-we-offer' || location.pathname.startsWith('/education-program');
  const primaryStartItems = siteConfig.navigation.primary.slice(0, 2);
  const primaryEndItems = siteConfig.navigation.primary.slice(2);
  const offeringItems = siteConfig.navigation.offerings;
  const logoSrc = isDark ? siteConfig.company.logo.darkSrc : siteConfig.company.logo.lightSrc;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <img
              src={logoSrc}
              alt={siteConfig.company.logo.alt}
              className="h-12 w-auto sm:h-14 lg:h-16"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex" ref={dropdownRef}>
          {primaryStartItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive(item.path)
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setOpenDropdown('portfolio')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isPortfolioActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-foreground hover:bg-primary/5 hover:text-primary'
              }`}
            >
              {portfolioMenuLabel}
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
            </button>

            {openDropdown === 'portfolio' && (
              <div
                className="absolute left-0 mt-2 w-96 overflow-hidden rounded-xl border border-border bg-background shadow-xl"
                onMouseEnter={() => setOpenDropdown('portfolio')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 text-white">
                  <h3 className="text-lg font-bold">Our Universities</h3>
                  <p className="text-sm text-white/80">Explore partner institutions worldwide</p>
                </div>

                <div className="max-h-96 overflow-y-auto p-4">
                  {portfolioData.map((portfolio) => (
                    <Link
                      key={portfolio.id}
                      to={`/portfolio/${portfolio.slug || portfolio.id}`}
                      className="block rounded-lg p-3 transition-all hover:bg-primary/10"
                    >
                      <h4 className="font-semibold">{portfolio.title}</h4>
                      <p className="text-xs text-muted-foreground">{portfolio.country}</p>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-border bg-muted/20 px-6 py-3">
                  <Link to="/portfolio" className="text-sm font-medium text-primary">
                    View all universities
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setOpenDropdown('offer')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isOfferingActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-foreground hover:bg-primary/5 hover:text-primary'
              }`}
            >
              Offerings
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
            </button>

            {openDropdown === 'offer' && (
              <div
                className="absolute left-0 mt-2 w-80 rounded-xl border border-border bg-background shadow-xl"
                onMouseEnter={() => setOpenDropdown('offer')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 text-white">
                  <h3 className="text-lg font-bold">Programs</h3>
                </div>

                <div className="space-y-2 p-4">
                  {offeringItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block rounded p-2 transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {primaryEndItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive(item.path)
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-muted" type="button">
            {isDark ? (
              <Sun className="h-5 w-5 text-accent" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </button>

          <Link
            to="/collaborate"
            className="hidden rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-secondary sm:inline-block"
          >
            Connect Now
          </Link>

          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg p-2 hover:bg-muted md:hidden"
            type="button"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="space-y-2 px-4 pb-4 md:hidden">
          {primaryStartItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block rounded-lg px-4 py-2 hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={() =>
              setOpenMobileDropdown((value) => (value === 'portfolio' ? null : 'portfolio'))
            }
            className="flex w-full items-center justify-between rounded-lg px-4 py-2 hover:bg-muted"
            type="button"
          >
            {portfolioMenuLabel}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openMobileDropdown === 'portfolio' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMobileDropdown === 'portfolio' && (
            <div className="space-y-1 pl-4">
              {portfolioData.map((portfolio) => (
                <Link
                  key={portfolio.id}
                  to={`/portfolio/${portfolio.slug || portfolio.id}`}
                  className="block rounded px-4 py-2 text-sm hover:bg-primary/10"
                >
                  {portfolio.title}
                </Link>
              ))}
            </div>
          )}

          <button
            onClick={() =>
              setOpenMobileDropdown((value) => (value === 'offer' ? null : 'offer'))
            }
            className="flex w-full items-center justify-between rounded-lg px-4 py-2 hover:bg-muted"
            type="button"
          >
            Offerings
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openMobileDropdown === 'offer' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMobileDropdown === 'offer' && (
            <div className="space-y-1 pl-4">
              {offeringItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block rounded px-4 py-2 text-sm hover:bg-primary/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {primaryEndItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block rounded-lg px-4 py-2 hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/collaborate"
            className="block rounded-lg bg-primary px-4 py-2 text-center text-white"
          >
            Connect Now
          </Link>
        </nav>
      )}
    </header>
  );
}
