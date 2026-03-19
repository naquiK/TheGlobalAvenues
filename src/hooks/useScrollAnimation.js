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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        element.style.opacity = '1';
        element.style.transform = 'translateX(0) translateY(0) scale(1)';

        if (once) {
          observer.disconnect();
          window.setTimeout(() => {
            element.style.transition = previousTransition;
            element.style.transitionDelay = previousTransitionDelay;
          }, resolvedDuration + resolvedDelay + 50);
        }
      },
      { rootMargin: '-60px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, duration, y, x, scale, once]);

  return ref;
}

export function useScrollAnimation() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}
