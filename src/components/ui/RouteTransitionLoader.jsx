import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MIN_VISIBLE_MS = 420;

export default function RouteTransitionLoader() {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    setIsVisible(true);
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, MIN_VISIBLE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[70] h-1 overflow-hidden bg-transparent"
      aria-hidden="true"
    >
      <div className="route-loader-bar h-full w-full" />
    </div>
  );
}
