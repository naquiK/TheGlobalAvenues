import { useEffect, useRef } from 'react';

const GLOBE_MARKERS = [
  { lat: 37.0902, lng: -95.7129, name: 'USA', code: 'us' },
  { lat: 56.1304, lng: -106.3468, name: 'Canada', code: 'ca' },
  { lat: 55.3781, lng: -3.4360, name: 'UK', code: 'gb' },
  { lat: 53.4129, lng: -8.2439, name: 'Ireland', code: 'ie' },
  { lat: 46.2276, lng: 2.2137, name: 'France', code: 'fr' },
  { lat: 47.5162, lng: 14.5501, name: 'Austria', code: 'at' },
  { lat: 58.5953, lng: 25.0136, name: 'Estonia', code: 'ee' },
  { lat: 35.1264, lng: 33.4299, name: 'Cyprus', code: 'cy' },
  { lat: 23.4241, lng: 53.8478, name: 'UAE', code: 'ae' },
  { lat: 1.3521, lng: 103.8198, name: 'Singapore', code: 'sg' },
  { lat: -20.3484, lng: 57.5522, name: 'Mauritius', code: 'mu' },
  { lat: 36.2048, lng: 138.2529, name: 'Japan', code: 'jp' },
];

let globeModulePromise = null;

function loadGlobeFactory() {
  if (!globeModulePromise) {
    globeModulePromise = import('globe.gl')
      .then((module) => module.default || module)
      .catch((error) => {
        globeModulePromise = null;
        throw error;
      });
  }
  return globeModulePromise;
}

export default function EnvironmentGlobe() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) {
      return undefined;
    }

    let cancelled = false;
    let globe = null;
    let controls = null;
    let resizeObserver = null;
    let visibilityObserver = null;
    let isGlobeVisible = true;
    let currentFrame = 0;

    const container = containerRef.current;

    const initializeGlobe = async () => {
      try {
        const GlobeFactory = await loadGlobeFactory();
        if (cancelled) return;

        globe = GlobeFactory()(container)
          .backgroundColor('rgba(0,0,0,0)')
          .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
          .showGlobe(true)
          .showAtmosphere(true)
          .atmosphereColor('#2ca6a4')
          .atmosphereAltitude(0.15);

        // Customize materials for environment look
        const material = globe.globeMaterial();
        if (material) {
          material.shininess = 0.2;
          material.needsUpdate = true;
        }

        // Add floating HTML markers (flags & names)
        globe
          .htmlElementsData(GLOBE_MARKERS)
          .htmlElement((d) => {
            const el = document.createElement('div');
            el.className = 'select-none pointer-events-auto';
            el.innerHTML = `
              <div class="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-[#0e2c2b]/85 px-3 py-1.5 text-[10px] font-bold text-[#e6fbf9] shadow-[0_8px_24px_rgba(44,166,164,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-emerald-400 hover:bg-[#0e2c2b]">
                <img src="https://flagcdn.com/w40/${d.code}.png" class="h-3.5 w-5 rounded object-cover shadow-sm" alt="${d.name}" />
                <span>${d.name}</span>
              </div>
            `;
            // Redirect to pre-filtered universities page on marker click
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              window.location.href = `/universities?country=${encodeURIComponent(d.name)}`;
            });
            return el;
          });

        const renderer = globe.renderer();
        if (renderer) {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }

        controls = globe.controls();
        if (controls) {
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controls.enablePan = false;
          controls.enableZoom = false;
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1.8; // Relaxed speed
        }

        // Set initial camera view focused near central hub
        globe.pointOfView({ lat: 25, lng: 30, altitude: 1.8 }, 0);

        // Resize handler
        const handleResize = () => {
          if (!globe || !container) return;
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (width > 0 && height > 0) {
            globe.width(width).height(height);
          }
        };

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(handleResize);
          resizeObserver.observe(container);
        } else {
          window.addEventListener('resize', handleResize);
        }

        // Visibility handler
        if (typeof IntersectionObserver !== 'undefined') {
          visibilityObserver = new IntersectionObserver(
            ([entry]) => {
              isGlobeVisible = entry.isIntersecting;
              if (isGlobeVisible) {
                if (controls) controls.autoRotate = true;
                globe.resumeAnimation();
              } else {
                if (controls) controls.autoRotate = false;
                globe.pauseAnimation();
              }
            },
            { threshold: 0.1 }
          );
          visibilityObserver.observe(container);
        }

        handleResize();

      } catch (error) {
        console.warn('Failed to load environment 3D globe:', error);
      }
    };

    initializeGlobe();

    return () => {
      cancelled = true;
      if (resizeObserver) resizeObserver.disconnect();
      if (visibilityObserver) visibilityObserver.disconnect();
      if (currentFrame) window.cancelAnimationFrame(currentFrame);

      if (globe) {
        try {
          globe.pauseAnimation();
          controls?.dispose();
        } catch (e) {
          // already disposed
        }
      }
      container.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden rounded-[inherit] bg-transparent"
    />
  );
}
