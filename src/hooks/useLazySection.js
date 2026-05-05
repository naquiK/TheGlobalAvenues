import { useEffect, useRef, useState } from 'react';

const getViewportHeight = () =>
  window.innerHeight || document.documentElement.clientHeight || 0;

const getRootMarginOffset = (rootMargin = '900px') => {
  const match = String(rootMargin).match(/(-?\d+(?:\.\d+)?)px/);
  return match ? Math.max(0, Number(match[1])) : 900;
};

const isNearViewport = (element, offset = 900) => {
  const viewportHeight = getViewportHeight();
  if (!viewportHeight) return false;

  const rect = element.getBoundingClientRect();
  return rect.top <= viewportHeight + offset && rect.bottom >= -offset;
};

export default function useLazySection(options = '900px') {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const {
    rootMargin = '900px',
    preloadOnIdle = true,
    idleDelay = 150,
    idleTimeout = 2000,
  } = typeof options === 'string' ? { rootMargin: options } : options || {};

  useEffect(() => {
    if (isVisible) return undefined;
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    let observer;
    let idleId;
    let idleDelayId;
    let rafId = 0;
    let revealed = false;
    const visibilityOffset = getRootMarginOffset(rootMargin);

    const revealSection = () => {
      if (revealed) return;
      revealed = true;
      setIsVisible(true);
      observer?.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      window.removeEventListener('scroll', scheduleVisibilityCheck);
      window.removeEventListener('resize', scheduleVisibilityCheck);
    };

    const checkVisibility = () => {
      rafId = 0;
      if (ref.current && isNearViewport(ref.current, visibilityOffset)) {
        revealSection();
      }
    };

    function scheduleVisibilityCheck() {
      if (revealed || rafId) return;
      rafId = window.requestAnimationFrame(checkVisibility);
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealSection();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    window.addEventListener('scroll', scheduleVisibilityCheck, { passive: true });
    window.addEventListener('resize', scheduleVisibilityCheck);
    scheduleVisibilityCheck();

    if (preloadOnIdle) {
      idleDelayId = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(revealSection, { timeout: idleTimeout });
        } else {
          revealSection();
        }
      }, idleDelay);
    }

    return () => {
      observer?.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (idleDelayId) window.clearTimeout(idleDelayId);
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener('scroll', scheduleVisibilityCheck);
      window.removeEventListener('resize', scheduleVisibilityCheck);
    };
  }, [idleDelay, idleTimeout, isVisible, preloadOnIdle, rootMargin]);

  return { ref, isVisible };
}
