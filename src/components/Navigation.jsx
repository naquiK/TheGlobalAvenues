import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const preloadRoute = (path = '') => {
    if (!path) return
    if (path === '/') {
      void import('../pages/HomePage')
      return
    }
    if (path.startsWith('/portfolio/')) {
      void import('../pages/PortfolioDetailPage')
      return
    }
    if (path.startsWith('/portfolio')) {
      void import('../pages/PortfolioPage')
      return
    }
    if (path === '/about') {
      void import('../pages/AboutPage')
      return
    }
    if (path === '/services') {
      void import('../pages/ServicesPage')
      return
    }
    if (path === '/collaborate') {
      void import('../pages/CollaboratePage')
      return
    }
    if (path === '/universities') {
      void import('../pages/UniversitiesPage')
      return
    }
    if (path === '/gallery') {
      void import('../pages/GalleryPage')
      return
    }
    if (path === '/partners') {
      void import('../pages/PartnersPage')
      return
    }
    if (path === '/news-blog') {
      void import('../pages/NewsVlogPage')
      return
    }
    if (path.startsWith('/news/')) {
      void import('../pages/NewsDetailPage')
      return
    }
    if (path === '/what-we-offer') {
      void import('../pages/WhatWeOfferPage')
      return
    }
    if (path.startsWith('/education-program')) {
      void import('../pages/EducationProgramPage')
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const educationPrograms = [
    {
      id: 'fulltime-degree',
      name: 'Full Time Degree Program',
      path: '/education-program/fulltime-degree/undergraduate'
    },
    {
      id: 'online-program',
      name: 'Online Program',
      path: '/education-program/online-program/undergraduate'
    },
    {
      id: 'vocational-courses',
      name: 'Vocational Courses',
      path: '/education-program/vocational-courses/undergraduate'
    },
    {
      id: 'internship-abroad',
      name: 'Internship Abroad',
      path: '/education-program/internship-abroad/undergraduate'
    },
    {
      id: 'summer-winter-school',
      name: 'Summer/Winter School',
      path: '/education-program/summer-winter-school/undergraduate'
    },
  ]

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold text-primary">
              TGA
            </div>
            <span className="text-xl font-bold hidden sm:inline">The Global Avenues</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onMouseEnter={() => preloadRoute(link.href)}
                className="hover:text-secondary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {/* What We Offer Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-secondary transition-colors font-medium">
                What We Offer
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-64 bg-white text-foreground rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 group-hover:mt-2 z-50">
                <div className="p-3 space-y-1">
                  {educationPrograms.map((program) => (
                    <Link
                      key={program.id}
                      to={program.path}
                      onMouseEnter={() => preloadRoute(program.path)}
                      className="block px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground font-medium transition-colors"
                    >
                      {program.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="btn-secondary">Connect Now</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onMouseEnter={() => preloadRoute(link.href)}
                className="block px-4 py-2 hover:bg-primary-foreground/10 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile What We Offer Dropdown */}
            <div className="px-2 py-2">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'programs' ? null : 'programs')}
                className="w-full text-left px-2 py-2 flex items-center justify-between hover:bg-primary-foreground/10 rounded transition-colors font-medium"
              >
                What We Offer
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openDropdown === 'programs' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openDropdown === 'programs' && (
                <div className="ml-2 mt-2 space-y-1 border-l-2 border-primary-foreground/20">
                  {educationPrograms.map((program) => (
                    <Link
                      key={program.id}
                      to={program.path}
                      onMouseEnter={() => preloadRoute(program.path)}
                      className="block px-4 py-2 text-sm hover:bg-primary-foreground/10 rounded transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      {program.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <button className="w-full btn-secondary mt-4">Connect Now</button>
          </div>
        )}
      </div>
    </nav>
  )
}
