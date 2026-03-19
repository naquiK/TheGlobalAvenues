import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const getNavigationType = () => {
  if (typeof performance === 'undefined') return 'navigate';
  const entries = performance.getEntriesByType?.('navigation');
  if (entries && entries.length > 0) {
    return entries[0].type;
  }

  if (performance.navigation) {
    if (performance.navigation.type === 1) return 'reload';
    if (performance.navigation.type === 2) return 'back_forward';
  }

  return 'navigate';
};

export function ScrollRestoration() {
  const { pathname, search } = useLocation();
  const isFirstRender = useRef(true);
  const navigationType = useRef(getNavigationType());

  useEffect(() => {
    const key = `scroll-pos:${pathname}${search}`;
    let rafId = 0;
    const shouldRestore = navigationType.current === 'reload' && isFirstRender.current;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const restorePosition = () => {
      if (shouldRestore) {
        const saved = sessionStorage.getItem(key);
        if (saved) {
          const y = Number(saved);
          if (!Number.isNaN(y)) {
            const applyScroll = () => window.scrollTo({ top: y, left: 0, behavior: 'auto' });
            let attempts = 0;
            const maxAttempts = 12;
            const tryRestore = () => {
              applyScroll();
              attempts += 1;
              const canReach =
                document.documentElement.scrollHeight >= y + window.innerHeight * 0.3;
              if (!canReach && attempts < maxAttempts) {
                window.setTimeout(tryRestore, 80);
              }
            };

            requestAnimationFrame(tryRestore);
            window.addEventListener('load', applyScroll, { once: true });
            return;
          }
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    const savePosition = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        sessionStorage.setItem(key, String(window.scrollY));
        rafId = 0;
      });
    };

    const saveNow = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveNow();
      }
    };

    restorePosition();
    isFirstRender.current = false;
    window.addEventListener('scroll', savePosition, { passive: true });
    window.addEventListener('beforeunload', saveNow);
    window.addEventListener('pagehide', saveNow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', savePosition);
      window.removeEventListener('beforeunload', saveNow);
      window.removeEventListener('pagehide', saveNow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, search]);

  return null;
}
