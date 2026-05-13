import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_PROGRESS_START_EVENT = 'tga:route-progress-start';
const MIN_VISIBLE_MS = 380;
const COMPLETE_VISIBLE_MS = 180;

export default function RouteTransitionLoader() {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const visibleSinceRef = useRef(0);
  const hideTimerRef = useRef(null);
  const completeTimerRef = useRef(null);
  const [progressState, setProgressState] = useState('idle');

  const clearTimers = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (completeTimerRef.current) {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  };

  const startProgress = () => {
    clearTimers();
    visibleSinceRef.current = window.performance?.now?.() || Date.now();
    setProgressState('loading');
  };

  const completeProgress = () => {
    const now = window.performance?.now?.() || Date.now();
    const elapsed = now - visibleSinceRef.current;
    const waitMs = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    clearTimers();
    completeTimerRef.current = window.setTimeout(() => {
      setProgressState('complete');
      hideTimerRef.current = window.setTimeout(() => {
        setProgressState('idle');
      }, COMPLETE_VISIBLE_MS);
    }, waitMs);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    if (progressState === 'idle') {
      startProgress();
    }
    completeProgress();

    return undefined;
    // `progressState` is intentionally omitted so location changes control completion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  useEffect(() => {
    const shouldStartFromAnchor = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return false;
      }

      const anchor = event.target?.closest?.('a[href]');
      if (!anchor || anchor.hasAttribute('download')) return false;
      const target = anchor.getAttribute('target');
      if (target && target !== '_self') return false;

      let targetUrl;
      try {
        targetUrl = new URL(anchor.href, window.location.href);
      } catch {
        return false;
      }

      if (targetUrl.origin !== window.location.origin) return false;

      const currentPath = `${window.location.pathname}${window.location.search}`;
      const nextPath = `${targetUrl.pathname}${targetUrl.search}`;
      return currentPath !== nextPath;
    };

    const handleClick = (event) => {
      if (shouldStartFromAnchor(event)) {
        startProgress();
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    const handleExplicitStart = () => {
      startProgress();
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener(ROUTE_PROGRESS_START_EVENT, handleExplicitStart);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(ROUTE_PROGRESS_START_EVENT, handleExplicitStart);
      clearTimers();
    };
    // Stable enough for global listeners; state changes should not rebind handlers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (progressState === 'idle') {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[70] h-1 overflow-hidden bg-transparent"
      aria-hidden="true"
    >
      <div
        className={`route-loader-bar h-full w-full ${
          progressState === 'complete' ? 'route-loader-bar--complete' : ''
        }`}
      />
    </div>
  );
}
