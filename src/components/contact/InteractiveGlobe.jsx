import { useEffect, useRef } from 'react';

const GLOBE_CDN = 'https://unpkg.com/globe.gl@2.45.3/dist/globe.gl.min.js';
const GEOJSON_URL =
  'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

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

let countryFeaturesPromise = null;

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-external-script="${src}"]`);

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }

      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.externalScript = src;

    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true }
    );
    script.addEventListener('error', reject, { once: true });

    document.head.appendChild(script);
  });
}

function loadCountryFeatures() {
  if (!countryFeaturesPromise) {
    countryFeaturesPromise = fetch(GEOJSON_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Country data failed with ${response.status}`);
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
    let initTimer = 0;
    let idlePauseTimer = 0;
    let pointerDown = false;
    const container = containerRef.current;
    let viewportSettings = { altitude: 1.55, autoRotateSpeed: 3.0 };
    const isCoarsePointer =
      typeof window.matchMedia === 'function' &&
      (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches);
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    container.style.touchAction = isCoarsePointer ? 'pan-y' : 'auto';
    container.style.pointerEvents = isCoarsePointer ? 'none' : 'auto';

    const getResponsiveSettings = () => {
      const width = container?.clientWidth || window.innerWidth;

      if (width < 430) {
        return { altitude: 2.28, autoRotateSpeed: 2.2 };
      }
      if (width < 768) {
        return { altitude: 2.0, autoRotateSpeed: 2.45 };
      }
      if (width < 1024) {
        return { altitude: 1.74, autoRotateSpeed: 2.7 };
      }
      return { altitude: 1.55, autoRotateSpeed: 3.0 };
    };

    const setAutoRotate = (enabled) => {
      if (!controls || prefersReducedMotion) return;
      controls.autoRotate = enabled;
    };

    const pauseWhenIdle = () => {
      if (idlePauseTimer) {
        window.clearTimeout(idlePauseTimer);
      }
      idlePauseTimer = window.setTimeout(() => {
        globe?.pauseAnimation?.();
      }, 180);
    };

    const handleMouseEnter = () => {
      if (!controls) return;
      globe?.resumeAnimation?.();
      setAutoRotate(false);
      controls.enableRotate = true;
      container.style.cursor = pointerDown ? 'grabbing' : 'grab';
    };

    const handleMouseLeave = () => {
      pointerDown = false;
      setAutoRotate(false);
      if (controls) {
        controls.enableRotate = false;
      }
      container.style.cursor = 'default';
      pauseWhenIdle();
    };

    const handlePointerDown = () => {
      pointerDown = true;
      globe?.resumeAnimation?.();
      container.style.cursor = 'grabbing';
    };

    const handlePointerUp = () => {
      pointerDown = false;
      if (controls?.enableRotate && !isCoarsePointer) {
        container.style.cursor = 'grab';
      }
      if (!controls?.enableRotate) {
        pauseWhenIdle();
      }
    };

    const handleResize = () => {
      if (!globe || !container) return;

      const renderer = globe.renderer?.();
      if (renderer) {
        renderer.setPixelRatio(1);
      }

      globe.width(container.clientWidth);
      globe.height(container.clientHeight);

      const nextSettings = getResponsiveSettings();
      const altitudeChanged = Math.abs(nextSettings.altitude - viewportSettings.altitude) > 0.01;

      viewportSettings = nextSettings;
      if (controls) {
        controls.autoRotateSpeed = viewportSettings.autoRotateSpeed;
      }

      if (controls && altitudeChanged) {
        globe.resumeAnimation?.();
        globe.pointOfView({ lat: 30, lng: 40, altitude: viewportSettings.altitude }, 0);
        pauseWhenIdle();
      }
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
        .ringMaxRadius((location) => location.radius * theme.ringScale)
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

    const initializeGlobe = async () => {
      try {
        await loadExternalScript(GLOBE_CDN);

        if (cancelled) return;

        const GlobeFactory = window.Globe;

        if (!GlobeFactory) return;

        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
        if (!gl) {
          console.warn('Globe skipped: WebGL not available.');
          return;
        }
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) {
          ext.loseContext();
        }

        viewportSettings = getResponsiveSettings();
        globe = GlobeFactory()(container)
          .backgroundColor('rgba(0,0,0,0)')
          .showGlobe(true)
          .ringsData(LOCATIONS)
          .ringMaxRadius((location) => location.radius * 0.72)
          .ringPropagationSpeed(1.75)
          .ringRepeatPeriod(780);

        handleResize();

        scene = globe.scene();
        ambientLight = scene.children.find((child) => child.type === 'AmbientLight') || null;
        const directionalLights = scene.children.filter((child) => child.type === 'DirectionalLight');
        keyLight = directionalLights[0] || null;
        rimLight = directionalLights[1] || null;

        controls = globe.controls();
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.autoRotate = false;
        controls.autoRotateSpeed = viewportSettings.autoRotateSpeed;

        if (!isCoarsePointer) {
          container.addEventListener('mouseenter', handleMouseEnter);
          container.addEventListener('mouseleave', handleMouseLeave);
          container.addEventListener('mousedown', handlePointerDown);
          window.addEventListener('mouseup', handlePointerUp);
        }
        window.addEventListener('resize', handleResize);

        globe.pointOfView({ lat: 30, lng: 40, altitude: viewportSettings.altitude }, 0);
        applyTheme(isDarkMode);
        window.requestAnimationFrame(() => {
          handleResize();
          pauseWhenIdle();
        });

        try {
          const countryFeatures = await loadCountryFeatures();

          if (!cancelled && globe) {
            globe
              .hexPolygonsData(countryFeatures)
              .hexPolygonResolution(3)
              .hexPolygonMargin(isDarkMode ? 0.52 : 0.25);
            countriesLoaded = true;
            applyTheme(isDarkMode);
            pauseWhenIdle();
          }
        } catch (error) {
          if (!cancelled) {
            console.warn('Globe country dots skipped:', error.message || error);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Globe visual skipped:', error.message || error);
        }
      }
    };

    initTimer = window.setTimeout(initializeGlobe, 0);

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
      if (initTimer) {
        window.clearTimeout(initTimer);
      }
      if (idlePauseTimer) {
        window.clearTimeout(idlePauseTimer);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousedown', handlePointerDown);

      if (globe) {
        try {
          globe.pauseAnimation?.();
          const renderer = globe.renderer();
          if (renderer) {
            renderer.dispose();
          }
        } catch {
          // Renderer may already be disposed.
        }

        if (scene) {
          scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((mat) => mat.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
        }

        globe._destructor?.();
      }

      ambientLight = null;
      keyLight = null;
      rimLight = null;
      scene = null;
      globe = null;
      controls = null;

      container.replaceChildren();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-visible bg-transparent">
      <div ref={containerRef} className="h-full w-full cursor-default" />
    </div>
  );
}
