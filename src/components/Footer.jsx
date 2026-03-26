import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { formatAddress } from '../config';

const SOCIAL_ICON_PATHS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M15 8h3V4h-3c-3.314 0-6 2.686-6 6v2H6v4h3v4h4v-4h3l1-4h-4v-2c0-1.105.895-2 2-2Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M8 11v7M8 8v.01M12 18v-4a3 3 0 0 1 6 0v4M5 18V11M5 6.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M21 12.2c0 2.5-.3 4.2-.7 5.1c-.3.7-.8 1.2-1.5 1.5c-.9.4-3.3.7-6.8.7s-5.9-.3-6.8-.7a2.5 2.5 0 0 1-1.5-1.5C3.3 16.4 3 14.7 3 12.2s.3-4.2.7-5.1c.3-.7.8-1.2 1.5-1.5C6.1 5.2 8.5 5 12 5s5.9.2 6.8.6c.7.3 1.2.8 1.5 1.5c.4.9.7 2.6.7 5.1Z" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M22 5.92c-.74.33-1.53.55-2.36.65a4.14 4.14 0 0 0 1.82-2.28a8.22 8.22 0 0 1-2.61 1A4.1 4.1 0 0 0 11.9 9.03A11.65 11.65 0 0 1 3.46 4.8a4.1 4.1 0 0 0 1.27 5.47a4.07 4.07 0 0 1-1.86-.51v.05a4.11 4.11 0 0 0 3.29 4.03a4.12 4.12 0 0 1-1.85.07a4.11 4.11 0 0 0 3.84 2.85A8.25 8.25 0 0 1 2 18.39A11.64 11.64 0 0 0 8.29 20c7.55 0 11.68-6.26 11.68-11.69c0-.18-.01-.35-.02-.53A8.34 8.34 0 0 0 22 5.92Z" />
    </svg>
  ),
};

const CONTACT_ICON_CLASS = 'h-4 w-4 text-brand-orange';

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CONTACT_ICON_CLASS}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CONTACT_ICON_CLASS}>
      <path d="M6.9 3.8c.34-.34.83-.49 1.3-.4l2.23.42c.58.11 1.03.57 1.13 1.15l.28 1.68c.07.4-.04.81-.31 1.12l-1.3 1.49a14.46 14.46 0 0 0 4.52 4.52l1.49-1.3c.31-.27.72-.38 1.12-.31l1.68.28c.58.1 1.04.55 1.15 1.13l.42 2.23c.09.47-.06.96-.4 1.3l-1 1c-.72.72-1.78 1.03-2.8.82c-2.64-.55-5.08-1.9-7.18-4S5.55 10.6 5 7.96c-.21-1.02.1-2.08.82-2.8l1.08-1.36Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CONTACT_ICON_CLASS}>
      <path d="M12 21s6-5.69 6-11a6 6 0 1 0-12 0c0 5.31 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Footer() {
  const [hovered, setHovered] = useState(false);
  const [activeLogo, setActiveLogo] = useState(null);
  const { siteConfig } = useSettings();
  const links = Object.entries(siteConfig.footerLinks);
  const [firstLinkGroup, secondLinkGroup, thirdLinkGroup] = links;
  const footerLogoSrc = '/logo-footer-white-transparent.png';
  const socialIcons = ['facebook', 'instagram', 'youtube', 'linkedin'];
  const partnerLogos = [
    { src: '/21.jpg', top: '8%', left: '4%', rotate: '-12deg', size: 'h-32 w-32', hotspot: 'h-72 w-72' },
    { src: '/22.jpg', top: '14%', left: '78%', rotate: '8deg', size: 'h-36 w-36', hotspot: 'h-80 w-80' },
    { src: '/23.png', top: '34%', left: '16%', rotate: '-5deg', size: 'h-28 w-28', hotspot: 'h-64 w-64' },
    { src: '/universities/euas-logo.svg', top: '46%', left: '42%', rotate: '3deg', size: 'h-28 w-28', hotspot: 'h-64 w-64' },
    {
      src: '/universities/eit-innoenergy/eit-innoenergy-legacy-logo.jpeg',
      top: '62%',
      left: '50%',
      rotate: '-3deg',
      size: 'h-24 w-24',
      hotspot: 'h-56 w-56',
    },
    {
      src: '/universities/benedictine-university-logo.png',
      top: '26%',
      left: '62%',
      rotate: '-6deg',
      size: 'h-24 w-24',
      hotspot: 'h-56 w-56',
    },
    { src: '/24.png', top: '54%', left: '60%', rotate: '15deg', size: 'h-32 w-32', hotspot: 'h-72 w-72' },
    { src: '/25.png', top: '20%', left: '44%', rotate: '-8deg', size: 'h-32 w-32', hotspot: 'h-72 w-72' },
    {
      src: '/universities/elmhurst-university-logo.png',
      top: '64%',
      left: '84%',
      rotate: '9deg',
      size: 'h-16 w-16',
      hotspot: 'h-40 w-40',
    },
    {
      src: '/universities/st-georges-university-logo.jpg',
      top: '74%',
      left: '38%',
      rotate: '-7deg',
      size: 'h-20 w-20',
      hotspot: 'h-48 w-48',
    },
    { src: '/26.png', top: '68%', left: '22%', rotate: '6deg', size: 'h-36 w-36', hotspot: 'h-80 w-80' },
    { src: '/27.png', top: '38%', left: '84%', rotate: '-10deg', size: 'h-28 w-28', hotspot: 'h-64 w-64' },
    { src: '/28.png', top: '72%', left: '68%', rotate: '12deg', size: 'h-32 w-32', hotspot: 'h-72 w-72' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderLinkGroup = ([title, items]) => (
    <div className="text-center sm:text-left">
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            {item.external ? (
              <a
                href={item.href}
                className="group flex items-center justify-center gap-2 text-sm text-white/60 transition-colors duration-150 hover:text-brand-orange sm:justify-start"
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange" />
                <span>{item.label}</span>
              </a>
            ) : (
              <Link
                to={item.path}
                className="group flex items-center justify-center gap-2 text-sm text-white/60 transition-colors duration-150 hover:text-brand-orange sm:justify-start"
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange" />
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer
      className="footer-fog relative overflow-hidden border-t border-white/8 bg-[#0D0A1A] text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActiveLogo(null);
      }}
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(83,64,176,0.14),transparent_30%),linear-gradient(180deg,rgba(25,18,56,0.42)_0%,rgba(13,10,26,0.06)_42%,rgba(13,10,26,0.2)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[340px] bg-[radial-gradient(ellipse_82%_60%_at_50%_100%,rgba(32,24,66,0.78)_0%,rgba(26,16,51,0.52)_26%,transparent_72%),radial-gradient(ellipse_46%_38%_at_26%_100%,rgba(61,44,118,0.42)_0%,transparent_60%),radial-gradient(ellipse_42%_34%_at_74%_100%,rgba(44,33,92,0.28)_0%,transparent_58%)] opacity-100 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 z-10 hidden overflow-hidden lg:block">
        {partnerLogos.map((logo, index) => (
          <div
            key={`${logo.src}-${logo.top}-${logo.left}`}
            className="pointer-events-auto absolute z-10"
            style={{
              top: logo.top,
              left: logo.left,
              transform: `translate(-50%, -50%) rotate(${logo.rotate})`,
            }}
            onMouseEnter={() => setActiveLogo(index)}
            onMouseLeave={() => setActiveLogo(null)}
          >
            <div className={`${logo.hotspot} flex items-center justify-center`}>
              <img
                src={logo.src}
                alt="University partner placeholder"
                loading="lazy"
                decoding="async"
                className={`${logo.size} object-contain will-change-transform transition-all duration-1000 ease-out ${
                  activeLogo === index
                    ? 'scale-100 opacity-32 blur-0 grayscale saturate-0 brightness-100 contrast-100'
                    : hovered
                      ? 'scale-95 opacity-[0.13] blur-0 grayscale saturate-0 brightness-90 contrast-95'
                      : 'scale-75 opacity-0 blur-md'
                }`}
                style={{
                  transitionDelay: hovered ? `${index * 60}ms` : '0ms',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-20 mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 sm:pb-5 sm:pt-12 lg:px-8 lg:pb-5 lg:pt-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="relative z-20 flex flex-col items-center text-center sm:items-start sm:text-left">
            <img
              src={footerLogoSrc}
              alt={siteConfig.company.logo.alt}
              loading="lazy"
              decoding="async"
              className="h-11 w-auto"
            />
            <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-white/60 sm:max-w-[260px]">
              {siteConfig.company.description}
            </p>

            {socialIcons.length > 0 && (
              <div className="mt-5 flex justify-center gap-3 sm:justify-start">
                {socialIcons.map((key) => {
                  const socialUrl = siteConfig.social?.[key];

                  if (socialUrl) {
                    return (
                      <a
                        key={key}
                        href={socialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:border-brand-orange hover:bg-brand-orange hover:text-white active:-translate-y-0.5 active:scale-110 active:border-brand-orange active:bg-brand-orange active:text-white"
                        aria-label={`Visit our ${key} page`}
                      >
                        {SOCIAL_ICON_PATHS[key]}
                      </a>
                    );
                  }

                  return (
                    <span
                      key={key}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:border-brand-orange hover:bg-brand-orange hover:text-white active:-translate-y-0.5 active:scale-110 active:border-brand-orange active:bg-brand-orange active:text-white"
                      aria-hidden="true"
                    >
                      {SOCIAL_ICON_PATHS[key]}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative z-20 min-w-0">{firstLinkGroup && renderLinkGroup(firstLinkGroup)}</div>

          <div className="relative z-20 min-w-0 space-y-6">
            {secondLinkGroup && renderLinkGroup(secondLinkGroup)}
            {thirdLinkGroup && renderLinkGroup(thirdLinkGroup)}
          </div>

          <div className="relative z-20 text-center sm:text-left">
            <div className="space-y-3.5">
              <div className="flex flex-col items-center gap-2 text-sm text-white/60 sm:flex-row sm:items-start sm:gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-purple/40">
                  <EnvelopeIcon />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">Email</p>
                  <a
                    href={`mailto:${siteConfig.contact.email.general}`}
                    className="break-all text-sm text-white/60 transition-colors duration-150 hover:text-brand-orange"
                  >
                    {siteConfig.contact.email.general}
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-sm text-white/60 sm:flex-row sm:items-start sm:gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-purple/40">
                  <PhoneIcon />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">Phone</p>
                  <a
                    href={`tel:${siteConfig.contact.phone[0].replace(/\s+/g, '')}`}
                    className="break-words text-sm text-white/60 transition-colors duration-150 hover:text-brand-orange"
                  >
                    {siteConfig.contact.phone[0]}
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-sm text-white/60 sm:flex-row sm:items-start sm:gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-purple/40">
                  <MapPinIcon />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">Location</p>
                  <p className="break-words text-sm text-white/60">{formatAddress(siteConfig.contact.address)}</p>
                </div>
              </div>

              <div className="mt-3 border-t border-white/15 pt-3">
                <p className="mb-2 text-sm text-white/60">Certified by:</p>
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition-all duration-150 hover:border-brand-orange/50 hover:text-white">
                    ICEF Certified
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition-all duration-150 hover:border-brand-orange/50 hover:text-white">
                    AIRC Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-4 border-t border-white/8 py-3">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-center text-xs text-white/30 sm:text-left">
              © {siteConfig.company.year} {siteConfig.company.name}. All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-brand-orange hover:bg-brand-orange hover:text-white"
              aria-label="Scroll to top"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="m6 14 6-6 6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
