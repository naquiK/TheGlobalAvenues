import { useEffect, useRef } from 'react';

const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
const GLOBE_CDN = 'https://unpkg.com/globe.gl@2.32.2/dist/globe.gl.min.js';
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

export function InteractiveGlobe() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) {
      return undefined;
    }

    let cancelled = false;
    let frameId = 0;
    let globe = null;
    let scene = null;
    let ambientLight = null;
    let keyLight = null;
    let rimLight = null;
    let countriesLoaded = false;
    let isDarkMode = document.documentElement.classList.contains('dark');
    let THREERef = null;
    let controls = null;
    let resizeObserver = null;
    let raycaster = null;
    let mouse = null;
    let hoveringMesh = false;
    let pointerDown = false;
    const container = containerRef.current;
    const geoAbortController = new AbortController();
    let viewportSettings = { altitude: 1.55, autoRotateSpeed: 3.0 };
    const isCoarsePointer =
      typeof window.matchMedia === 'function' &&
      (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches);

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

    const handleResize = () => {
      if (!globe || !container) return;
      globe.width(container.clientWidth);
      globe.height(container.clientHeight);

      const nextSettings = getResponsiveSettings();
      const altitudeChanged = Math.abs(nextSettings.altitude - viewportSettings.altitude) > 0.01;

      viewportSettings = nextSettings;
      if (controls) {
        controls.autoRotateSpeed = viewportSettings.autoRotateSpeed;
      }

      if (controls && altitudeChanged) {
        globe.pointOfView({ lat: 30, lng: 40, altitude: viewportSettings.altitude }, 700);
      }
    };

    const handleMouseMove = (event) => {
      if (!mouse) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleMouseLeave = () => {
      if (!mouse) return;
      mouse.x = -2;
      mouse.y = -2;
      hoveringMesh = false;
      pointerDown = false;
      container.style.cursor = 'default';
    };

    const handlePointerDown = () => {
      pointerDown = true;
      if (hoveringMesh) {
        container.style.cursor = 'grabbing';
      }
    };

    const handlePointerUp = () => {
      pointerDown = false;
      container.style.cursor = hoveringMesh ? 'grab' : 'default';
    };

    const animate = () => {
      if (cancelled || !controls || !raycaster || !scene || !globe) return;

      controls.update();

      raycaster.setFromCamera(mouse, globe.camera());
      const intersections = raycaster.intersectObjects(scene.children, true);

      let hoveringGlobe = false;
      for (let index = 0; index < intersections.length; index += 1) {
        if (intersections[index].object.type === 'Mesh') {
          hoveringGlobe = true;
          break;
        }
      }

      hoveringMesh = hoveringGlobe;
      controls.autoRotate = isCoarsePointer ? true : !hoveringGlobe;
      controls.enableRotate = isCoarsePointer ? false : hoveringGlobe;
      container.style.cursor = isCoarsePointer
        ? 'default'
        : hoveringGlobe
          ? (pointerDown ? 'grabbing' : 'grab')
          : 'default';
      frameId = window.requestAnimationFrame(animate);
    };

    const applyTheme = (dark) => {
      if (!globe || !THREERef) return;

      const theme = dark
        ? {
            globeColor: 0x050203,
            shininess: 0.18,
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
            globeColor: 0x444852,
            shininess: 0.08,
            atmosphereColor: '#7e7ab8',
            atmosphereAltitude: 0.09,
            hexColor: 'rgba(20, 20, 26, 0.98)',
            hexAltitude: 0.018,
            hexMargin: 0.25,
            ambientColor: 0x40434c,
            ambientIntensity: 0.2,
            keyColor: 0x8f95a6,
            keyIntensity: 0.12,
            keyPosition: [-6, 6, 4],
            rimColor: 0x6b5aa8,
            rimIntensity: 0.12,
            rimPosition: [-10, 6, -8],
            ringPrimary: '255, 255, 255',
            ringAccent: '255, 210, 140',
            ringAlpha: 1,
            ringScale: 1.2,
            ringSpeed: 1.15,
            ringPeriod: 920,
            ringAltitude: 0.04,
          };

      const material = dark
        ? new THREERef.MeshPhongMaterial({
            color: theme.globeColor,
            shininess: theme.shininess,
            specular: new THREERef.Color(0x1b0b13),
            emissive: new THREERef.Color(0x000000),
            emissiveIntensity: 0.05,
          })
        : new THREERef.MeshLambertMaterial({
            color: theme.globeColor,
            emissive: new THREERef.Color(0x2a2d36),
            emissiveIntensity: 0.12,
          });

      globe
        .showAtmosphere(true)
        .atmosphereColor(theme.atmosphereColor)
        .atmosphereAltitude(theme.atmosphereAltitude)
        .globeMaterial(material);

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
        ambientLight.color = new THREERef.Color(theme.ambientColor);
        ambientLight.intensity = theme.ambientIntensity;
      }
      if (keyLight) {
        keyLight.color = new THREERef.Color(theme.keyColor);
        keyLight.intensity = dark ? theme.keyIntensity : 0;
        keyLight.position.set(...theme.keyPosition);
      }
      if (rimLight) {
        rimLight.color = new THREERef.Color(theme.rimColor);
        rimLight.intensity = dark ? theme.rimIntensity : 0;
        rimLight.position.set(...theme.rimPosition);
      }
    };

    const initializeGlobe = async () => {
      try {
        await loadExternalScript(THREE_CDN);
        await loadExternalScript(GLOBE_CDN);

        if (cancelled) return;

        const THREE = window.THREE;
        const GlobeFactory = window.Globe;

        if (!THREE || !GlobeFactory) return;

        THREERef = THREE;
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
        scene.children = scene.children.filter(
          (child) => !(child instanceof THREE.AmbientLight || child instanceof THREE.DirectionalLight)
        );
        ambientLight = new THREE.AmbientLight(0x4a1525, 3.6);
        keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
        keyLight.position.set(10, 8, 12);
        rimLight = new THREE.DirectionalLight(0x6e1428, 0.35);
        rimLight.position.set(-12, 4, -6);
        scene.add(ambientLight);
        scene.add(keyLight);
        scene.add(rimLight);

        controls = globe.controls();
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = viewportSettings.autoRotateSpeed;

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2(-2, -2);

        if (!isCoarsePointer) {
          container.addEventListener('mousemove', handleMouseMove);
          container.addEventListener('mouseleave', handleMouseLeave);
          container.addEventListener('mousedown', handlePointerDown);
          window.addEventListener('mouseup', handlePointerUp);
        }
        window.addEventListener('resize', handleResize);
        if (typeof window.ResizeObserver === 'function') {
          resizeObserver = new window.ResizeObserver(() => handleResize());
          resizeObserver.observe(container);
        }

        globe.pointOfView({ lat: 30, lng: 40, altitude: viewportSettings.altitude }, 2000);
        window.requestAnimationFrame(() => {
          handleResize();
        });

        const response = await fetch(GEOJSON_URL, { signal: geoAbortController.signal });
        const countries = await response.json();

        if (!cancelled && globe) {
          globe
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.52);
          countriesLoaded = true;
          applyTheme(isDarkMode);
        }

        if (!cancelled) {
          applyTheme(isDarkMode);
          animate();
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to initialize globe:', error);
        }
      }
    };

    initializeGlobe();

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
      geoAbortController.abort();
      themeObserver.disconnect();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousedown', handlePointerDown);
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-visible bg-transparent">
      <div ref={containerRef} className="h-full w-full cursor-default" />
    </div>
  );
}
