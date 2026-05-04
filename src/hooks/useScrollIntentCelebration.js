import { useEffect, useRef } from 'react';
import { launchDualSideCelebrationConfetti } from '../utils/effects/celebrationConfetti';

export default function useScrollIntentCelebration({
  enabled = true,
  targetRef,
  threshold = 0.35,
  rootMargin = '0px 0px -8% 0px',
  fire = launchDualSideCelebrationConfetti,
} = {}) {
  const hasFiredRef = useRef(false);
  const hasManualScrollIntentRef = useRef(false);

  useEffect(() => {
    const section = targetRef?.current;
    if (!enabled || !section || typeof window === 'undefined') return undefined;

    hasFiredRef.current = false;
    hasManualScrollIntentRef.current = false;

    const sectionIsReadyForCelebration = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

      return rect.top < viewportHeight * 0.72 && rect.bottom > viewportHeight * 0.24;
    };

    const tryFireCelebration = () => {
      if (hasFiredRef.current || !hasManualScrollIntentRef.current) return;
      if (!sectionIsReadyForCelebration()) return;

      hasFiredRef.current = true;
      fire();
    };

    const markManualScrollIntent = (event) => {
      if (event?.type === 'keydown') {
        const navigationKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
        if (!navigationKeys.has(event.key)) return;
      }

      if (event?.type === 'wheel' && Math.abs(event.deltaY || 0) < 1) return;

      hasManualScrollIntentRef.current = true;
      tryFireCelebration();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tryFireCelebration();
        });
      },
      { threshold, rootMargin }
    );

    window.addEventListener('wheel', markManualScrollIntent, { passive: true });
    window.addEventListener('touchmove', markManualScrollIntent, { passive: true });
    window.addEventListener('keydown', markManualScrollIntent);
    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', markManualScrollIntent);
      window.removeEventListener('touchmove', markManualScrollIntent);
      window.removeEventListener('keydown', markManualScrollIntent);
    };
  }, [enabled, fire, rootMargin, targetRef, threshold]);
}
