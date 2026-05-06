import { useEffect, useRef, useState } from 'react';

const resolveTransform = ({ x, y, scale }) => {
  const translateX = x ? ` translateX(${x}px)` : '';
  const translateY = y ? ` translateY(${y}px)` : '';
  const scaleValue = scale !== 1 ? ` scale(${scale})` : '';
  return `${translateX}${translateY}${scaleValue}`.trim() || 'none';
};

const isReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const isSmallScreen = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

const getViewportHeight = () =>
  window.innerHeight || document.documentElement.clientHeight || 0;

const isNearViewport = (element, offset = 160) => {
  const viewportHeight = getViewportHeight();
  if (!viewportHeight) return false;

  const rect = element.getBoundingClientRect();
  return rect.top <= viewportHeight + offset && rect.bottom >= -offset;
};

export default function useScrollAnimationObserver(options = {}) {
  const ref = useRef(null);
  const {
    delay = 0,
    duration = 600,
    y = 28,
    x = 0,
    scale = 1,
    once = true,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const prefersReduced = isReducedMotion();
    const mobile = isSmallScreen();

    const resolvedDelay = mobile ? 0 : delay;
    const resolvedDuration = mobile ? 400 : duration;
    const resolvedX = mobile ? 0 : x;
    const resolvedY = mobile ? 0 : y;
    const resolvedScale = mobile ? 1 : scale;

    if (prefersReduced) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.transition = 'none';
      return undefined;
    }

    const previousTransition = element.style.transition;
    const previousTransitionDelay = element.style.transitionDelay;
    const initialTransform = resolveTransform({ x: resolvedX, y: resolvedY, scale: resolvedScale });
    const transitionValue = mobile
      ? `opacity ${resolvedDuration}ms ease-out`
      : `opacity ${resolvedDuration}ms ease-out, transform ${resolvedDuration}ms ease-out`;

    element.style.opacity = '0';
    element.style.transform = initialTransform;
    element.style.transition = transitionValue;
    element.style.transitionDelay = `${resolvedDelay}ms`;

    let observer;
    let rafId = 0;
    let restoreTimer = 0;
    let hasRevealed = false;

    const cleanupRevealWatchers = () => {
      observer?.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      window.removeEventListener('scroll', scheduleVisibilityCheck);
      window.removeEventListener('resize', scheduleVisibilityCheck);
    };

    const reveal = ({ immediate = false } = {}) => {
      if (hasRevealed) return;
      hasRevealed = true;

      if (immediate) {
        element.style.transitionDelay = '0ms';
      }
      element.style.opacity = '1';
      element.style.transform = 'translateX(0) translateY(0) scale(1)';

      if (once) {
        cleanupRevealWatchers();
        restoreTimer = window.setTimeout(() => {
          element.style.transition = previousTransition;
          element.style.transitionDelay = previousTransitionDelay;
        }, resolvedDuration + resolvedDelay + 50);
      }
    };

    function checkVisibility() {
      rafId = 0;
      if (isNearViewport(element, mobile ? 260 : 220)) {
        reveal({ immediate: true });
      }
    }

    function scheduleVisibilityCheck() {
      if (hasRevealed || rafId) return;
      rafId = window.requestAnimationFrame(checkVisibility);
    }

    if (typeof IntersectionObserver === 'undefined') {
      reveal();
      return () => {
        if (restoreTimer) window.clearTimeout(restoreTimer);
      };
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
        }
      },
      {
        rootMargin: mobile ? '220px 0px 220px 0px' : '180px 0px 180px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(element);
    window.addEventListener('scroll', scheduleVisibilityCheck, { passive: true });
    window.addEventListener('resize', scheduleVisibilityCheck);
    scheduleVisibilityCheck();

    return () => {
      cleanupRevealWatchers();
      if (restoreTimer) window.clearTimeout(restoreTimer);
    };
  }, [delay, duration, y, x, scale, once]);

  return ref;
}

export function useScrollAnimation() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let observer;
    let rafId = 0;
    let revealed = false;

    const reveal = () => {
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
      if (ref.current && isNearViewport(ref.current, 180)) {
        reveal();
      }
    };

    function scheduleVisibilityCheck() {
      if (revealed || rafId) return;
      rafId = window.requestAnimationFrame(checkVisibility);
    }

    if (typeof IntersectionObserver === 'undefined') {
      reveal();
      return undefined;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
        }
      },
      {
        threshold: 0.01,
        rootMargin: '160px 0px 160px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    window.addEventListener('scroll', scheduleVisibilityCheck, { passive: true });
    window.addEventListener('resize', scheduleVisibilityCheck);
    scheduleVisibilityCheck();

    return () => {
      observer.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', scheduleVisibilityCheck);
      window.removeEventListener('resize', scheduleVisibilityCheck);
    };
  }, []);

  return [ref, isVisible];
}
