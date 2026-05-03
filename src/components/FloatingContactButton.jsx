import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, MessageSquareText, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const accentClasses = [
  'border-[#DDD4F2] bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(247,243,255,0.94)_100%)] dark:border-[#3E316F] dark:bg-[linear-gradient(160deg,rgba(22,17,42,0.96)_0%,rgba(17,13,33,0.96)_100%)]',
  'border-[#F0D8CE] bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(255,244,238,0.96)_100%)] dark:border-[#5B3328] dark:bg-[linear-gradient(160deg,rgba(34,18,14,0.96)_0%,rgba(23,13,11,0.96)_100%)]',
];
const contactAvatarFallbacks = {
  neetu: '/team/neetu-verma-gupta.webp',
  deepshikha: '/team/deepshikha-chauhan.webp',
};

function sanitizePhoneNumber(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function buildWhatsAppLink(phone, message) {
  const normalizedPhone = sanitizePhoneNumber(phone);
  if (!normalizedPhone) return '#';

  const url = new URL(`https://wa.me/${normalizedPhone}`);
  if (message) {
    url.searchParams.set('text', message);
  }

  return url.toString();
}

export function FloatingContactButton() {
  const { siteConfig } = useSettings();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const contacts = useMemo(() => {
    const configuredContacts =
      Array.isArray(siteConfig.quickWhatsappContacts) && siteConfig.quickWhatsappContacts.length > 0
        ? siteConfig.quickWhatsappContacts
        : [
            {
              name: 'Neetu',
              role: 'Director',
              phone: siteConfig.contact?.phone?.[1] || '+91 93198 31133',
            },
            {
              name: 'Deepshikha',
              role: 'International Recruitment Head',
              phone: siteConfig.contact?.phone?.[2] || '+91 97178 01133',
            },
          ];

    return configuredContacts.map((contact, index) => ({
      ...contact,
      avatar:
        contact.avatar ||
        contactAvatarFallbacks[String(contact.name || '').trim().toLowerCase()] ||
        '',
      href: buildWhatsAppLink(
        contact.whatsappNumber || contact.phone,
        contact.prefilledMessage ||
          `Hello ${contact.name}, I would like to connect with The Global Avenues.`
      ),
      accentClass: accentClasses[index % accentClasses.length],
    }));
  }, [siteConfig]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (contacts.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed z-40 flex flex-col items-end"
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      {isOpen ? (
        <div
          id="floating-contact-panel"
          className="floating-contact-panel pointer-events-auto mb-3 w-[min(22rem,calc(100vw-1.5rem))] rounded-[30px] border border-white/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.82)_0%,rgba(245,243,255,0.72)_45%,rgba(254,240,231,0.9)_100%)] p-[1px] shadow-[0_28px_80px_rgba(16,12,40,0.22)] backdrop-blur-xl dark:border-white/12 dark:bg-[linear-gradient(145deg,rgba(31,22,60,0.94)_0%,rgba(17,13,33,0.96)_55%,rgba(43,24,16,0.94)_100%)]"
        >
          <div className="relative overflow-hidden rounded-[28px] bg-white/92 p-4 dark:bg-[#100C20]/92 sm:p-5">
            <div className="absolute -right-8 top-0 h-24 w-24 rounded-full bg-brand-orange/12 blur-3xl dark:bg-brand-orange/18" />
            <div className="absolute -left-6 bottom-1 h-24 w-24 rounded-full bg-primary/14 blur-3xl dark:bg-brand-purple-mid/18" />
            <div className="relative">
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <a
                    key={`${contact.name}-${contact.phone}`}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={`floating-contact-card group flex items-center gap-3 rounded-[22px] border p-3 shadow-[0_16px_34px_rgba(16,12,40,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(16,12,40,0.16)] ${contact.accentClass}`}
                  >
                    <div className="floating-contact-card__icon relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:border-white/15 dark:bg-white/10 dark:text-white">
                      {contact.avatar ? (
                        <img
                          src={contact.avatar}
                          alt={`${contact.name} profile`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MessageSquareText className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-foreground">{contact.name}</p>
                      <p className="text-sm text-primary dark:text-brand-orange-light">{contact.role}</p>
                    </div>
                    <div className="floating-contact-card__arrow flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-white/75 text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-white dark:border-white/12 dark:bg-white/8 dark:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="floating-contact-panel"
        aria-label={isOpen ? 'Close WhatsApp contact menu' : 'Open WhatsApp contact menu'}
        onClick={() => setIsOpen((open) => !open)}
        className="floating-contact-fab pointer-events-auto group relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-[linear-gradient(135deg,#2D1B69_0%,#5B45C6_54%,#E8521A_100%)] text-white shadow-[0_20px_40px_rgba(45,27,105,0.32)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_24px_52px_rgba(45,27,105,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:border-white/12"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_46%,rgba(255,255,255,0.08)_100%)] opacity-80" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/12 text-white shadow-[0_10px_24px_rgba(16,12,40,0.22)]">
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <span className="relative flex h-9 w-9 items-center justify-center">
              <MessageSquareText className="h-5 w-5" />
            </span>
          )}
        </span>
      </button>
    </div>
  );
}

export default FloatingContactButton;
