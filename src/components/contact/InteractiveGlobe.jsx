import { useEffect, useRef } from 'react';

const LOCAL_COUNTRY_DATA_URL = '/vendor/globe-countries.geojson';
const INITIAL_POINT_OF_VIEW = { lat: 30, lng: 40 };

const LOCATIONS = [
  { lat: 20.5937, lng: 78.9629, radius: 5.5, colorRgb: '255, 255, 255' },
  { lat: 35.1856, lng: 33.3823, radius: 2.0, colorRgb: '255, 0, 85' },
  { lat: 46.2276, lng: 2.2137, radius: 2.0, colorRgb: '255, 0, 85' },
  { lat: 51.1657, lng: 10.4515, radius: 2.0, colorRgb: '255, 0, 85' },
  { lat: 51.5074, lng: -0.1278, radius: 2.0, colorRgb: '255, 0, 85' },
  { lat: 39.0902, lng: -95.7129, radius: 2.0, colorRgb: '255, 0, 85' },
  { lat: 56.1304, lng: -106.3468, radius: 2.0, colorRgb: '255, 0, 85' },
  { lat: 36.2048, lng: 138.2529, radius: 2.0, colorRgb: '255, 0, 85' },
  { lat: 61.524, lng: 105.3188, radius: 2.0, colorRgb: '255, 0, 85' },
  { lat: 15.87, lng: 100.9925, radius: 2.0, colorRgb: '255, 0, 85' },
];

let globeModulePromise = null;
let countryFeaturesPromise = null;

const shouldLogDebug = import.meta.env.DEV;

const logDebugWarn = (...args) => {
  if (shouldLogDebug) {
    console.warn(...args);
  }
};

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

function loadCountryFeatures() {
  if (!countryFeaturesPromise) {
    countryFeaturesPromise = fetch(LOCAL_COUNTRY_DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Country data failed with ${response.status} from ${LOCAL_COUNTRY_DATA_URL}`);
        }

        return response.json();
      })
      .then((countries) => countries.features || [])
      .catch((error) => {
        countryFeaturesPromise = null;
        throw error;
      });
  }

  return countryFeaturesPromise;
}

export function InteractiveGlobe() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) {
      return undefined;
    }

    let cancelled = false;
    let globe = null;
    let scene = null;
    let ambientLight = null;
    let keyLight = null;
    let rimLight = null;
    let countriesLoaded = false;
    let isDarkMode = document.documentElement.classList.contains('dark');
    let controls = null;
    let initFrame = 0;
    let resizeFrame = 0;
    let resizeObserver = null;
    let visibilityObserver = null;
    let globeCanvas = null;
    let pointerDown = false;
    let pointerOverGlobe = false;
    let isGlobeVisible = true;
    let lastWidth = 0;
    let lastHeight = 0;
    let viewportSettings = { altitude: 1.55, autoRotateSpeed: 3.35 };
    const container = containerRef.current;
    const isCoarsePointer =
      typeof window.matchMedia === 'function' &&
      (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches);
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    container.style.touchAction = 'auto';
    container.style.pointerEvents = 'auto';

    const getResponsiveSettings = () => {
      const width = container.clientWidth || window.innerWidth;

      if (width < 430) {
        return { altitude: 2.28, autoRotateSpeed: 2.58 };
      }
      if (width < 768) {
        return { altitude: 2.0, autoRotateSpeed: 2.86 };
      }
      if (width < 1024) {
        return { altitude: 1.74, autoRotateSpeed: 3.18 };
      }

      return { altitude: 1.55, autoRotateSpeed: 3.52 };
    };

    const setAutoRotate = (enabled) => {
      if (!controls || prefersReducedMotion) return;

      controls.autoRotate = enabled && isGlobeVisible;
      if (controls.autoRotate) {
        globe?.resumeAnimation?.();
      }
    };

    const isPointerOnGlobe = (event) => {
      const target = globeCanvas || container;
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.46;
      const distance = Math.hypot(x - centerX, y - centerY);

      return distance <= radius;
    };

    const activateGlobeInteraction = () => {
      if (!controls || pointerOverGlobe) return;

      pointerOverGlobe = true;
      globe?.resumeAnimation?.();
      setAutoRotate(false);
      controls.enableRotate = true;

      const cursor = pointerDown ? 'grabbing' : 'grab';
      container.style.cursor = cursor;
      if (globeCanvas) {
        globeCanvas.style.cursor = cursor;
      }
    };

    const deactivateGlobeInteraction = () => {
      if (!controls || pointerDown) return;

      pointerOverGlobe = false;
      controls.enableRotate = false;
      container.style.cursor = 'default';
      if (globeCanvas) {
        globeCanvas.style.cursor = 'default';
      }
      setAutoRotate(true);
    };

    const handlePointerMove = (event) => {
      if (!controls || isCoarsePointer) return;

      if (isPointerOnGlobe(event)) {
        activateGlobeInteraction();
      } else {
        deactivateGlobeInteraction();
      }
    };

    const handlePointerLeave = () => {
      pointerDown = false;
      deactivateGlobeInteraction();
    };

    const handlePointerDown = (event) => {
      if (!isPointerOnGlobe(event)) {
        pointerOverGlobe = false;
        if (controls) {
          controls.enableRotate = false;
        }
        return;
      }

      pointerDown = true;
      pointerOverGlobe = true;
      globe?.resumeAnimation?.();
      setAutoRotate(false);
      if (controls) {
        controls.enableRotate = true;
      }
      container.style.cursor = 'grabbing';
      if (globeCanvas) {
        globeCanvas.style.cursor = 'grabbing';
      }
    };

    const handlePointerUp = (event) => {
      pointerDown = false;

      if (isCoarsePointer) {
        pointerOverGlobe = false;
        if (controls) {
          controls.enableRotate = false;
        }
        container.style.cursor = 'default';
        if (globeCanvas) {
          globeCanvas.style.cursor = 'default';
        }
        setAutoRotate(true);
        return;
      }

      if (event && isPointerOnGlobe(event)) {
        pointerOverGlobe = true;
        if (controls) {
          controls.enableRotate = true;
        }
        container.style.cursor = 'grab';
        if (globeCanvas) {
          globeCanvas.style.cursor = 'grab';
        }
        return;
      }

      pointerOverGlobe = false;
      if (controls) {
        controls.enableRotate = false;
      }
      container.style.cursor = 'default';
      if (globeCanvas) {
        globeCanvas.style.cursor = 'default';
      }
      setAutoRotate(true);
    };

    const syncGlobeSize = () => {
      if (!globe) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      if (width === lastWidth && height === lastHeight) return;

      lastWidth = width;
      lastHeight = height;

      globe.width(width);
      globe.height(height);

      const nextSettings = getResponsiveSettings();
      const altitudeChanged = Math.abs(nextSettings.altitude - viewportSettings.altitude) > 0.01;

      viewportSettings = nextSettings;
      if (controls) {
        controls.autoRotateSpeed = viewportSettings.autoRotateSpeed;
      }

      if (controls && altitudeChanged) {
        globe.resumeAnimation?.();
        globe.pointOfView(
          {
            lat: INITIAL_POINT_OF_VIEW.lat,
            lng: INITIAL_POINT_OF_VIEW.lng,
            altitude: viewportSettings.altitude,
          },
          0
        );
        setAutoRotate(true);
      }
    };

    const scheduleResize = () => {
      if (resizeFrame || cancelled) return;

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        syncGlobeSize();
      });
    };

    const applyTheme = (dark) => {
      if (!globe) return;

      const theme = dark
        ? {
            globeColor: 0x050203,
            shininess: 0.18,
            specularColor: 0x1b0b13,
            emissiveColor: 0x000000,
            emissiveIntensity: 0.05,
            atmosphereColor: '#6e1428',
            atmosphereAltitude: 0.18,
            hexColor: 'rgba(255, 150, 182, 0.64)',
            hexAltitude: 0.007,
            hexMargin: 0.52,
            ambientColor: 0x4a1525,
            ambientIntensity: 3.6,
            keyColor: 0xffffff,
            keyIntensity: 0.6,
            keyPosition: [10, 8, 12],
            rimColor: 0x6e1428,
            rimIntensity: 0.35,
            rimPosition: [-12, 4, -6],
            ringPrimary: '255, 255, 255',
            ringAccent: '255, 0, 85',
            ringAlpha: 1,
            ringScale: 0.72,
            primaryRingScale: 0.72,
            ringSpeed: 1.75,
            ringPeriod: 780,
            ringAltitude: 0.012,
          }
        : {
            globeColor: 0xf4f7ff,
            shininess: 0.12,
            specularColor: 0xc8d2ec,
            emissiveColor: 0xcfd8ec,
            emissiveIntensity: 0.16,
            atmosphereColor: '#7e7ab8',
            atmosphereAltitude: 0.09,
            hexColor: 'rgba(20, 20, 26, 0.94)',
            hexAltitude: 0.014,
            hexMargin: 0.25,
            ambientColor: 0xffffff,
            ambientIntensity: 1.25,
            keyColor: 0xffffff,
            keyIntensity: 0.48,
            keyPosition: [-6, 6, 4],
            rimColor: 0xb8c8ff,
            rimIntensity: 0.18,
            rimPosition: [-10, 6, -8],
            ringPrimary: '232, 92, 18',
            ringAccent: '198, 38, 96',
            ringAlpha: 0.95,
            ringScale: 1.24,
            primaryRingScale: 0.78,
            ringSpeed: 1.16,
            ringPeriod: 900,
            ringAltitude: 0.026,
          };

      const material = globe.globeMaterial?.();
      if (material) {
        material.color?.setHex?.(theme.globeColor);
        material.emissive?.setHex?.(theme.emissiveColor);
        material.specular?.setHex?.(theme.specularColor);
        if ('shininess' in material) {
          material.shininess = theme.shininess;
        }
        if ('emissiveIntensity' in material) {
          material.emissiveIntensity = theme.emissiveIntensity;
        }
        material.needsUpdate = true;
      }

      globe
        .showAtmosphere(true)
        .atmosphereColor(theme.atmosphereColor)
        .atmosphereAltitude(theme.atmosphereAltitude);

      if (countriesLoaded) {
        globe
          .hexPolygonColor(() => theme.hexColor)
          .hexPolygonAltitude(theme.hexAltitude)
          .hexPolygonMargin(theme.hexMargin);
      }

      globe.ringColor((location) => (time) => {
        const rgb = location.colorRgb === '255, 255, 255' ? theme.ringPrimary : theme.ringAccent;
        const fade = Math.max(0, 1 - time * 0.55);
        return `rgba(${rgb}, ${Math.min(1, theme.ringAlpha * fade)})`;
      });

      globe
        .ringMaxRadius((location) => {
          const scale =
            location.colorRgb === '255, 255, 255' ? theme.primaryRingScale : theme.ringScale;
          return location.radius * scale;
        })
        .ringAltitude(theme.ringAltitude)
        .ringPropagationSpeed(theme.ringSpeed)
        .ringRepeatPeriod(theme.ringPeriod);

      if (ambientLight) {
        ambientLight.color?.setHex?.(theme.ambientColor);
        ambientLight.intensity = theme.ambientIntensity;
      }
      if (keyLight) {
        keyLight.color?.setHex?.(theme.keyColor);
        keyLight.intensity = theme.keyIntensity;
        keyLight.position.set(...theme.keyPosition);
      }
      if (rimLight) {
        rimLight.color?.setHex?.(theme.rimColor);
        rimLight.intensity = theme.rimIntensity;
        rimLight.position.set(...theme.rimPosition);
      }
    };

    const countryFeaturesTask = loadCountryFeatures();
    const globeFactoryTask = loadGlobeFactory();

    const initializeGlobe = async () => {
      try {
        const GlobeFactory = await globeFactoryTask;
        if (cancelled) return;

        viewportSettings = getResponsiveSettings();
        globe = GlobeFactory()(container)
          .backgroundColor('rgba(0,0,0,0)')
          .showGlobe(true)
          .ringsData(LOCATIONS)
          .ringMaxRadius((location) => location.radius * 0.72)
          .ringPropagationSpeed(1.75)
          .ringRepeatPeriod(780);

        const renderer = globe.renderer?.();
        if (renderer) {
          renderer.setPixelRatio(1);
          globeCanvas = renderer.domElement || null;
          if (globeCanvas) {
            globeCanvas.style.touchAction = 'none';
            globeCanvas.style.pointerEvents = 'auto';
            globeCanvas.style.cursor = 'default';
          }
        } else {
          throw new Error('Globe renderer failed to initialize.');
        }

        scene = globe.scene?.() || null;
        ambientLight = scene?.children.find((child) => child.type === 'AmbientLight') || null;
        const directionalLights =
          scene?.children.filter((child) => child.type === 'DirectionalLight') || [];
        keyLight = directionalLights[0] || null;
        rimLight = directionalLights[1] || null;

        controls = globe.controls?.() || null;
        if (controls) {
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controls.enablePan = false;
          controls.enableZoom = false;
          controls.enableRotate = false;
          controls.autoRotate = !prefersReducedMotion;
          controls.autoRotateSpeed = viewportSettings.autoRotateSpeed;
        }

        if (globeCanvas) {
          globeCanvas.addEventListener('pointermove', handlePointerMove);
          globeCanvas.addEventListener('pointerleave', handlePointerLeave);
          globeCanvas.addEventListener('pointerdown', handlePointerDown, true);
        }
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(scheduleResize);
          resizeObserver.observe(container);
        } else {
          window.addEventListener('resize', scheduleResize);
        }

        if (typeof IntersectionObserver !== 'undefined') {
          visibilityObserver = new IntersectionObserver(
            ([entry]) => {
              isGlobeVisible = entry.isIntersecting;
              if (isGlobeVisible) {
                setAutoRotate(true);
                globe?.resumeAnimation?.();
                return;
              }

              setAutoRotate(false);
              globe?.pauseAnimation?.();
            },
            { rootMargin: '160px 0px', threshold: 0.01 }
          );
          visibilityObserver.observe(container);
        }

        globe.pointOfView(
          {
            lat: INITIAL_POINT_OF_VIEW.lat,
            lng: INITIAL_POINT_OF_VIEW.lng,
            altitude: viewportSettings.altitude,
          },
          0
        );
        applyTheme(isDarkMode);
        scheduleResize();
        setAutoRotate(true);

        void countryFeaturesTask
          .then((countryFeatures) => {
            if (cancelled || !globe) return;

            globe
              .hexPolygonsData(countryFeatures)
              .hexPolygonResolution(3)
              .hexPolygonMargin(isDarkMode ? 0.52 : 0.25);
            countriesLoaded = true;
            applyTheme(isDarkMode);
            setAutoRotate(true);
          })
          .catch((error) => {
            if (!cancelled) {
              logDebugWarn('Globe country dots skipped:', error.message || error);
            }
          });
      } catch (error) {
        if (error.name !== 'AbortError') {
          logDebugWarn('Globe visual skipped:', error.message || error);
        }
      }
    };

    initFrame = window.requestAnimationFrame(() => {
      initFrame = 0;
      void initializeGlobe();
    });

    const themeObserver = new MutationObserver(() => {
      const nextDark = document.documentElement.classList.contains('dark');
      if (nextDark !== isDarkMode) {
        isDarkMode = nextDark;
        applyTheme(isDarkMode);
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelled = true;
      themeObserver.disconnect();

      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }
      if (initFrame) {
        window.cancelAnimationFrame(initFrame);
      }

      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener('resize', scheduleResize);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      globeCanvas?.removeEventListener('pointermove', handlePointerMove);
      globeCanvas?.removeEventListener('pointerleave', handlePointerLeave);
      globeCanvas?.removeEventListener('pointerdown', handlePointerDown, true);

      if (globe) {
        try {
          globe.pauseAnimation?.();
          controls?.dispose?.();
        } catch {
          // Controls may already be disposed.
        }

        if (scene) {
          scene.traverse((object) => {
            object.geometry?.dispose?.();

            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material?.dispose?.());
            } else {
              object.material?.dispose?.();
            }
          });
        }
      }

      ambientLight = null;
      keyLight = null;
      rimLight = null;
      scene = null;
      globe = null;
      controls = null;
      globeCanvas = null;

      container.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-default overflow-hidden rounded-[inherit] bg-transparent"
    />
  );
}
