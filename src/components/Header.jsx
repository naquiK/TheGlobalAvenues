import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  Compass,
  Globe2,
  GraduationCap,
  LayoutGrid,
  Newspaper,
  Sparkles,
  Users2,
  X,
} from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';
import { portfolioMenuLabel } from '../config';
import { portfolioData } from '../data/portfolioData';
import { getPortfolios } from '../services/portfolioService';
import ThemeToggle from './ui/ThemeToggle';

const portfolioIconMap = {
  Austria: 'AT',
  France: 'FR',
  Estonia: 'EE',
  Cyprus: 'CY',
  USA: 'US',
  Europe: 'EU',
  Grenada: 'GD',
};

const offeringIconMap = {
  '/what-we-offer': LayoutGrid,
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState(portfolioData);
  const { isDark } = useTheme();
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
  const prioritizedPortfolioItems = useMemo(() => {
    const isIcnBusinessSchool = (item = {}) => {
      const slug = String(item.slug || '').toLowerCase();
      const title = String(item.title || item.name || '').toLowerCase();
      return slug === 'icn-business-school' || title.includes('icn business school');
    };
    const shouldStayAtBottom = (item = {}) => {
      const slug = String(item.slug || '').toLowerCase();
      const title = String(item.title || item.name || '').toLowerCase();
      return (
        slug === 'benedictine-university' ||
        slug === 'elmhurst-university' ||
        title.includes('benedictine university') ||
        title.includes('elmhurst university')
      );
    };

    const prioritized = [];
    const regular = [];
    const bottomPinned = [];

    portfolioItems.forEach((item) => {
      if (isIcnBusinessSchool(item)) {
        prioritized.push(item);
      } else if (shouldStayAtBottom(item)) {
        bottomPinned.push(item);
      } else {
        regular.push(item);
      }
    });

    return [...prioritized, ...regular, ...bottomPinned];
  }, [portfolioItems]);

  const getPrimaryIcon = (path) => {
    if (path === '/news-blog') return Newspaper;
    if (path === '/gallery') return Sparkles;
    return LayoutGrid;
  };

  const getOfferingIcon = (path) => {
    if (path.includes('management')) return BookOpen;
    if (path.includes('business')) return Compass;
    if (path.includes('design')) return Sparkles;
    return offeringIconMap[path] || GraduationCap;
  };

  const preloadRoute = (path = '') => {
    if (!path) return;
    if (path === '/') {
      void import('../pages/HomePage');
      return;
    }
    if (path.startsWith('/portfolio/')) {
      void import('../pages/PortfolioDetailPage');
      return;
    }
    if (path.startsWith('/portfolio')) {
      void import('../pages/PortfolioPage');
      return;
    }
    if (path === '/about') {
      void import('../pages/AboutPage');
      return;
    }
    if (path === '/services') {
      void import('../pages/ServicesPage');
      return;
    }
    if (path === '/collaborate') {
      void import('../pages/CollaboratePage');
      return;
    }
    if (path === '/universities') {
      void import('../pages/UniversitiesPage');
      return;
    }
    if (path === '/gallery') {
      void import('../pages/GalleryPage');
      return;
    }
    if (path === '/partners') {
      void import('../pages/PartnersPage');
      return;
    }
    if (path === '/news-blog') {
      void import('../pages/NewsVlogPage');
      return;
    }
    if (path.startsWith('/news/')) {
      void import('../pages/NewsDetailPage');
      return;
    }
    if (path === '/what-we-offer') {
      void import('../pages/WhatWeOfferPage');
      return;
    }
    if (path.startsWith('/education-program')) {
      void import('../pages/EducationProgramPage');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPortfolioMenu = async () => {
      try {
        const result = await getPortfolios({}, 1, 200);
        const list = Array.isArray(result?.data) ? result.data : [];
        if (isMounted && list.length > 0) {
          setPortfolioItems(list);
        }
      } catch (error) {
        if (isMounted) {
          setPortfolioItems(portfolioData);
        }
      }
    };

    loadPortfolioMenu();

    return () => {
      isMounted = false;
    };
  }, []);

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
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-200 ease-out ${
        hasScrolled
          ? 'border-white/20 bg-white/65 shadow-[0_18px_48px_rgba(26,16,51,0.12)] backdrop-blur-xl dark:border-white/8 dark:bg-[#0D0A1A]/70'
          : 'border-white/20 bg-white/70 backdrop-blur-md dark:border-white/8 dark:bg-[#0D0A1A]/75'
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-200 ease-out sm:px-6 lg:px-8 ${
          hasScrolled ? 'h-16' : 'h-20'
        }`}
      >
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="transition-opacity duration-200 ease-out hover:opacity-80"
            onMouseEnter={() => preloadRoute('/')}
          >
            <img
              src={logoSrc}
              alt={siteConfig.company.logo.alt}
              loading="lazy"
              decoding="async"
              className={`w-auto transition-all duration-200 ease-out ${
                hasScrolled ? 'h-10 lg:h-12' : 'h-11 lg:h-14'
              }`}
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" ref={dropdownRef}>
          {primaryStartItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onMouseEnter={() => preloadRoute(item.path)}
              className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''} rounded-full px-4 py-2 text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-brand-purple text-white shadow-[0_10px_24px_rgba(45,27,105,0.22)]'
                  : 'text-foreground hover:bg-brand-purple-light hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseLeave={() => {
              if (openDropdown === 'portfolio') {
                setOpenDropdown(null);
              }
            }}
          >
            <button
              type="button"
              onMouseEnter={() => {
                preloadRoute('/portfolio');
                setOpenDropdown('portfolio');
              }}
              className={`nav-link nav-trigger ${isPortfolioActive ? 'nav-link-active' : ''} group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                isPortfolioActive
                  ? 'bg-brand-purple text-white shadow-[0_10px_24px_rgba(45,27,105,0.22)]'
                  : 'text-foreground hover:bg-brand-purple-light hover:text-primary'
              }`}
            >
              {portfolioMenuLabel}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-[250ms] ease-out ${
                  openDropdown === 'portfolio' ? 'rotate-180' : 'group-hover:rotate-180'
                }`}
              />
            </button>

            {openDropdown === 'portfolio' && (
              <div
                className="absolute left-1/2 top-full hidden w-[26rem] max-w-[calc(50vw-1rem)] -translate-x-1/2 pt-4 lg:block"
                onMouseEnter={() => setOpenDropdown('portfolio')}
              >
                <div className="mega-panel overflow-hidden rounded-2xl border border-brand-purple/10 bg-background/95 shadow-[0_28px_80px_rgba(26,16,51,0.18)] backdrop-blur-xl transition-all duration-200 ease-out">
                  <div className="bg-gradient-to-r from-brand-purple to-brand-purple-mid px-4 py-3.5 text-white">
                    <h3 className="text-lg font-bold">Our Universities</h3>
                    <p className="text-sm text-white/80">Explore partner institutions worldwide</p>
                  </div>

                  <div className="grid max-h-[20rem] grid-cols-1 gap-1.5 overflow-y-auto p-2.5">
                    {prioritizedPortfolioItems.map((portfolio) => (
                      <Link
                        key={portfolio.id}
                        to={`/portfolio/${portfolio.slug || portfolio.id}`}
                        onMouseEnter={() =>
                          preloadRoute(`/portfolio/${portfolio.slug || portfolio.id}`)
                        }
                        className="mega-link group flex items-start gap-2.5 rounded-2xl border border-transparent p-2 transition-all duration-200 ease-out hover:border-brand-orange/20 hover:bg-brand-orange/5"
                      >
                        <div className="mega-link-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-purple-light text-xs font-semibold text-primary transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-brand-orange group-hover:text-white">
                          <span className="leading-none">
                            {portfolioIconMap[portfolio.country] || 'GL'}
                          </span>
                        </div>
                        <div className="mega-link-text">
                          <h4 className="text-sm font-semibold text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                            {portfolio.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">{portfolio.country}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-brand-purple/10 bg-brand-purple-light/45 p-3">
                    <Link
                      to="/portfolio"
                      onMouseEnter={() => preloadRoute('/portfolio')}
                      className="cta-btn flex w-full items-center justify-center rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(232,82,26,0.2)] hover:bg-brand-orange/90"
                    >
                      View all universities
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseLeave={() => {
              if (openDropdown === 'offer') {
                setOpenDropdown(null);
              }
            }}
          >
            <button
              type="button"
              onMouseEnter={() => {
                preloadRoute('/what-we-offer');
                setOpenDropdown('offer');
              }}
              className={`nav-link nav-trigger ${isOfferingActive ? 'nav-link-active' : ''} group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                isOfferingActive
                  ? 'bg-brand-purple text-white shadow-[0_10px_24px_rgba(45,27,105,0.22)]'
                  : 'text-foreground hover:bg-brand-purple-light hover:text-primary'
              }`}
            >
              Offerings
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-[250ms] ease-out ${
                  openDropdown === 'offer' ? 'rotate-180' : 'group-hover:rotate-180'
                }`}
              />
            </button>

            {openDropdown === 'offer' && (
              <div
                className="absolute right-0 top-full hidden w-[24rem] max-w-[calc(50vw-1rem)] pt-4 lg:block"
                onMouseEnter={() => setOpenDropdown('offer')}
              >
                <div className="mega-panel overflow-hidden rounded-2xl border border-brand-purple/10 bg-background/95 shadow-[0_28px_80px_rgba(26,16,51,0.18)] backdrop-blur-xl transition-all duration-200 ease-out">
                  <div className="bg-gradient-to-r from-brand-purple to-brand-purple-mid px-4 py-3.5 text-white">
                    <h3 className="text-lg font-bold">Programs</h3>
                  </div>

                  <div className="grid gap-1.5 p-2.5">
                    {offeringItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onMouseEnter={() => preloadRoute(item.path)}
                        className="mega-link group flex w-full items-center gap-2.5 rounded-2xl border border-transparent px-2.5 py-2.5 transition-all duration-200 ease-out hover:border-brand-orange/20 hover:bg-brand-orange/5"
                      >
                        <div className="mega-link-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-purple-light text-primary transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-brand-orange group-hover:text-white">
                          {(() => {
                            const Icon = getOfferingIcon(item.path);
                            return <Icon className="h-4 w-4" />;
                          })()}
                        </div>
                        <div className="mega-link-text">
                          <p className="text-sm font-medium text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                            {item.label}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {primaryEndItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onMouseEnter={() => preloadRoute(item.path)}
              className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''} rounded-full px-4 py-2 text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-brand-purple text-white shadow-[0_10px_24px_rgba(45,27,105,0.22)]'
                  : 'text-foreground hover:bg-brand-purple-light hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link
            to="/collaborate"
            onMouseEnter={() => preloadRoute('/collaborate')}
            className="cta-btn hidden rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(232,82,26,0.24)] lg:inline-block"
          >
            Connect Now
          </Link>

          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`mobile-menu-button flex rounded-full p-2 text-foreground transition-all duration-200 ease-out hover:bg-brand-purple-light active:scale-95 dark:hover:bg-white/10 lg:hidden ${
              isMenuOpen ? 'is-open' : ''
            }`}
            type="button"
            aria-label="Toggle navigation menu"
          >
            <span className="mobile-menu-bars" aria-hidden="true">
              <span className="mobile-menu-bar" />
              <span className="mobile-menu-bar" />
              <span className="mobile-menu-bar" />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-0 z-40 bg-[#0D0A1A]/45 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="animate-fade-in-right fixed right-0 top-0 z-50 flex h-screen w-full max-w-[320px] flex-col border-l border-brand-purple/10 bg-background/95 px-5 pb-6 pt-5 shadow-[0_28px_80px_rgba(26,16,51,0.22)] backdrop-blur-xl transition-all duration-200 ease-out dark:border-white/12 dark:bg-[#0F0C1E]/96 lg:hidden">
            <div className="mb-5 flex items-center justify-between">
              <Link
                to="/"
                className="transition-opacity duration-200 ease-out hover:opacity-80"
                onMouseEnter={() => preloadRoute('/')}
              >
                <img
                  src={logoSrc}
                  alt={siteConfig.company.logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-auto"
                />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                type="button"
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-purple/20 bg-white/80 text-foreground transition-all duration-200 hover:bg-brand-purple-light active:scale-95 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto">
              {primaryStartItems.map((item, index) => {
                const Icon = getPrimaryIcon(item.path);

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onMouseEnter={() => preloadRoute(item.path)}
                    className={`mobile-drawer-link flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium transition-all duration-200 ease-out ${
                      isActive(item.path)
                        ? 'bg-brand-purple text-white shadow-[0_8px_22px_rgba(45,27,105,0.24)] dark:bg-[#4C3BA7]'
                        : 'text-foreground hover:bg-brand-purple-light active:bg-brand-purple-light/80 dark:hover:bg-white/10 dark:active:bg-white/15'
                    }`}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-purple-light text-primary dark:bg-white/10 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="rounded-2xl border border-brand-purple/15 bg-brand-purple-light/30 px-2 py-2 dark:border-white/12 dark:bg-white/[0.04]">
                <button
                  onClick={() =>
                    setOpenMobileDropdown((value) => (value === 'portfolio' ? null : 'portfolio'))
                  }
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-all duration-200 ease-out hover:bg-brand-purple-light active:bg-brand-purple-light/80 dark:hover:bg-white/10 dark:active:bg-white/15"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-primary dark:bg-white/10 dark:text-white">
                      <Globe2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{portfolioMenuLabel}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ease-out ${
                      openMobileDropdown === 'portfolio' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openMobileDropdown === 'portfolio' && (
                  <div className="space-y-2 px-2 pb-2">
                    {prioritizedPortfolioItems.map((portfolio) => (
                      <Link
                        key={portfolio.id}
                        to={`/portfolio/${portfolio.slug || portfolio.id}`}
                        onMouseEnter={() =>
                          preloadRoute(`/portfolio/${portfolio.slug || portfolio.id}`)
                        }
                        className="mobile-drawer-link flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm transition-all duration-200 ease-out hover:bg-brand-purple-light active:bg-brand-purple-light/80 dark:hover:bg-white/10 dark:active:bg-white/15"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-primary dark:bg-white/10 dark:text-white">
                          <span className="text-sm font-semibold leading-none">
                            {portfolioIconMap[portfolio.country] || 'GL'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{portfolio.title}</p>
                          <p className="text-xs text-muted-foreground">{portfolio.country}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-brand-purple/15 bg-brand-purple-light/30 px-2 py-2 dark:border-white/12 dark:bg-white/[0.04]">
                <button
                  onClick={() =>
                    setOpenMobileDropdown((value) => (value === 'offer' ? null : 'offer'))
                  }
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-all duration-200 ease-out hover:bg-brand-purple-light active:bg-brand-purple-light/80 dark:hover:bg-white/10 dark:active:bg-white/15"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-primary dark:bg-white/10 dark:text-white">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Offerings</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ease-out ${
                      openMobileDropdown === 'offer' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openMobileDropdown === 'offer' && (
                  <div className="space-y-2 px-2 pb-2">
                    {offeringItems.map((item, index) => {
                      const Icon = getOfferingIcon(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onMouseEnter={() => preloadRoute(item.path)}
                          className="mobile-drawer-link flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm transition-all duration-200 ease-out hover:bg-brand-purple-light active:bg-brand-purple-light/80 dark:hover:bg-white/10 dark:active:bg-white/15"
                          style={{ animationDelay: `${index * 40}ms` }}
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-primary dark:bg-white/10 dark:text-white">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-foreground">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {primaryEndItems.map((item, index) => {
                const Icon = getPrimaryIcon(item.path);

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onMouseEnter={() => preloadRoute(item.path)}
                    className={`mobile-drawer-link flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium transition-all duration-200 ease-out ${
                      isActive(item.path)
                        ? 'bg-brand-purple text-white shadow-[0_8px_22px_rgba(45,27,105,0.24)] dark:bg-[#4C3BA7]'
                        : 'text-foreground hover:bg-brand-purple-light active:bg-brand-purple-light/80 dark:hover:bg-white/10 dark:active:bg-white/15'
                    }`}
                    style={{ animationDelay: `${(primaryStartItems.length + index) * 40}ms` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-purple-light text-primary dark:bg-white/10 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-5">
              <Link
                to="/collaborate"
                onMouseEnter={() => preloadRoute('/collaborate')}
                className="cta-btn block rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_16px_36px_rgba(232,82,26,0.28)] active:scale-[0.99]"
              >
                Connect Now
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
