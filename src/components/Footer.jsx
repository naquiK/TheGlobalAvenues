import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ChevronUp, Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { formatAddress } from '../config';

export function Footer() {
  const [ref, isVisible] = useScrollAnimation();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { siteConfig } = useSettings();
  const logoSrc = isDarkMode ? siteConfig.company.logo.darkSrc : siteConfig.company.logo.lightSrc;

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus(''), 3000);
    }
  };

  const links = siteConfig.footerLinks;

  const socialLinks = [
    { key: 'facebook', href: siteConfig.social.facebook, Icon: Facebook },
    { key: 'linkedin', href: siteConfig.social.linkedin, Icon: Linkedin },
    { key: 'instagram', href: siteConfig.social.instagram, Icon: Instagram },
    { key: 'youtube', href: siteConfig.social.youtube, Icon: Youtube },
    { key: 'twitter', href: siteConfig.social.twitter, Icon: Twitter },
    { key: 'whatsapp', href: siteConfig.social.whatsapp, Icon: MessageCircle },
  ].filter(({ href }) => Boolean(href));

  return (
    <footer className={`relative transition-colors duration-300 border-t ${
      isDarkMode 
        ? 'bg-slate-950 border-slate-800' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Newsletter Section */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">Stay Updated</h3>
              <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Subscribe to get the latest updates on universities and programs.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-2 sm:gap-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-400 focus:ring-blue-500' : 'bg-white text-gray-900 placeholder-gray-500 focus:ring-white'} focus:outline-none focus:ring-2`}
                required
              />
              <button 
                type="submit"
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
              >
                Subscribe
              </button>
            </form>
            {subscribeStatus === 'success' && (
              <p className={`col-span-1 sm:col-span-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>✓ Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-6 mb-8 sm:mb-12">
          {/* Brand Section */}
          <div
            ref={ref}
            className={`lg:col-span-1 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="mb-3">
              <img 
                src={logoSrc}
                alt={siteConfig.company.logo.alt}
                className="h-8 sm:h-10 w-auto"
              />
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {siteConfig.company.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map(({ key, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-1.5 sm:p-2 rounded-full transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {Object.entries(links).map(([title, items], index) => (
            <div
              key={title}
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 75}ms` }}
            >
              <h4 className={`font-semibold mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a 
                        href={item.href} 
                        className={`text-xs sm:text-sm transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link 
                        to={item.path} 
                        className={`text-xs sm:text-sm transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className={`hidden sm:grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 py-6 sm:py-8 border-t border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <Mail className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email</p>
              <a
                href={`mailto:${siteConfig.contact.email.general}`}
                className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {siteConfig.contact.email.general}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <Phone className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Phone</p>
              <a
                href={`tel:${siteConfig.contact.phone[0].replace(/\s+/g, '')}`}
                className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {siteConfig.contact.phone[0]}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Location</p>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {formatAddress(siteConfig.contact.address)}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-6 pt-4 sm:pt-6">
          <p className={`text-xs sm:text-sm text-center sm:text-left ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
            © {siteConfig.company.year} {siteConfig.company.name}. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className={`p-2 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'} shadow-lg`}
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
