import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';
import { useHomeContent } from '../../context/HomeContentContext';

const HERO_VIDEO_DEBUG_KEY = 'tga-hero-video-debug';

const shouldDebugHeroVideo = () => {
  if (!import.meta.env.DEV || typeof window === 'undefined') return false;
  const urlEnabled = new URLSearchParams(window.location.search).get('heroVideoDebug') === '1';
  const storageEnabled = window.localStorage.getItem(HERO_VIDEO_DEBUG_KEY) === '1';
  return urlEnabled || storageEnabled;
};

const logHeroVideo = (...args) => {
  if (!shouldDebugHeroVideo()) return;
  console.info('[HeroVideo]', ...args);
};

const getPreferredHeroVideoTier = () => {
  if (typeof window === 'undefined') return '720';

  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const effectiveType = connection?.effectiveType || '';
  const saveData = Boolean(connection?.saveData);
  const isSlowConnection = saveData || effectiveType.includes('2g') || effectiveType.includes('3g');

  if (isSlowConnection) return '720';

  const viewportWidth = window.innerWidth || 0;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const shouldUse1080 = viewportWidth >= 1280 || (viewportWidth >= 1024 && devicePixelRatio >= 1.5);

  return shouldUse1080 ? '1080' : '720';
};

const getVideoSources = (tier = '720') => {
  const safeTier = tier === '1080' ? '1080' : '720';
  return {
    webm: `/videos/hero-${safeTier}.webm`,
    mp4: `/videos/hero-${safeTier}.mp4`,
  };
};

const getSafeInternalPath = (value, fallback) => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.startsWith('/') ? trimmed : fallback;
};

const stripTrailingFullStop = (value, fallback) => {
  const base = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  return base.replace(/[.\u0964]+$/u, '');
};

const countUp = (el, target, duration = 1500) => {
  let start = 0;
  const isPercent = String(target).includes('%');
  const isK = String(target).includes('K');
  const end = parseInt(target, 10);
  const step = end / (duration / 16);

  const timer = window.setInterval(() => {
    start += step;
    if (start >= end) {
      window.clearInterval(timer);
      el.textContent = target;
    } else {
      el.textContent = `${Math.floor(start)}${isPercent ? '%' : isK ? 'K+' : '+'}`;
    }
  }, 16);
};

export default function HeroSection() {
  const { isDark } = useTheme();
  const { homeContent } = useHomeContent();
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const sourceWebmRef = useRef(null);
  const sourceMp4Ref = useRef(null);
  const textRef = useRef(null);
  const fogRef = useRef(null);
  const statsRef = useRef(null);
  const hasCountedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMobileState = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMobileState);
      return () => mediaQuery.removeEventListener('change', updateMobileState);
    }

    mediaQuery.addListener(updateMobileState);
    return () => mediaQuery.removeListener(updateMobileState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateReducedMotion);
      return () => mediaQuery.removeEventListener('change', updateReducedMotion);
    }

    mediaQuery.addListener(updateReducedMotion);
    return () => mediaQuery.removeListener(updateReducedMotion);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const section = sectionRef.current;
    const video = videoRef.current;
    const sourceWebm = sourceWebmRef.current;
    const sourceMp4 = sourceMp4Ref.current;

    if (!section || !video || !sourceWebm || !sourceMp4) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const preferredTier = getPreferredHeroVideoTier();
        const preferredSources = getVideoSources(preferredTier);
        logHeroVideo('Selecting tier', preferredTier, preferredSources);

        if (
          sourceWebm.getAttribute('src') !== preferredSources.webm ||
          sourceMp4.getAttribute('src') !== preferredSources.mp4
        ) {
          sourceWebm.setAttribute('src', preferredSources.webm);
          sourceMp4.setAttribute('src', preferredSources.mp4);
          video.load();
          logHeroVideo('Sources applied + load()', {
            webm: sourceWebm.getAttribute('src'),
            mp4: sourceMp4.getAttribute('src'),
          });
        }

        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch((error) => {
            logHeroVideo('Initial play() blocked', error?.message || error);
          });
        }

        observer.disconnect();
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    // Force critical attributes/properties for consistent autoplay + looping behavior.
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const resumePlayback = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((error) => {
          logHeroVideo('resumePlayback play() blocked', error?.message || error);
        });
      }
    };

    const handlePlaying = () => {
      setIsVideoReady(true);
      logHeroVideo('playing', { src: video.currentSrc, t: video.currentTime.toFixed(2) });
    };
    const handleCanPlay = () => {
      setIsVideoReady(true);
      logHeroVideo('canplay', { src: video.currentSrc, readyState: video.readyState });
      resumePlayback();
    };
    const handleWaiting = () => {
      setIsVideoReady(false);
      logHeroVideo('waiting', { src: video.currentSrc, t: video.currentTime.toFixed(2) });
    };
    const handleEnded = () => {
      // Safety fallback for browsers/devices where `loop` can intermittently fail.
      logHeroVideo('ended fallback triggered');
      video.currentTime = 0;
      resumePlayback();
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isMobile) return undefined;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const offset = Math.max(0, -rect.top);
      const progress = Math.min(offset / 360, 1);

      if (mediaRef.current) {
        mediaRef.current.style.transform = `translate3d(0, ${offset * 0.55}px, 0) scale(1.16)`;
      }

      if (textRef.current) {
        textRef.current.style.transform = `translate3d(0, ${offset * 0.3}px, 0)`;
        textRef.current.style.opacity = `${Math.max(0.28, 1 - progress)}`;
      }

      if (fogRef.current) {
        fogRef.current.style.transform = `translate3d(0, ${offset * 0.38}px, 0) scale(1.12)`;
      }

      if (statsRef.current) {
        statsRef.current.style.transform = `translate3d(0, ${offset * -0.18}px, 0)`;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (isMobile) return undefined;

    const stats = statsRef.current;
    if (!stats) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      stats.querySelectorAll('[data-countup]').forEach((el) => {
        el.textContent = el.dataset.countup || el.textContent;
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasCountedRef.current) return;

        hasCountedRef.current = true;
        stats.querySelectorAll('[data-countup]').forEach((el) => {
          countUp(el, el.dataset.countup || el.textContent);
        });
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(stats);
    return () => observer.disconnect();
  }, [isMobile]);

  const heroAnimation = (name, duration, delay) => {
    if (prefersReducedMotion) {
      return 'none';
    }
    const resolvedDuration = isMobile ? 400 : duration;
    const resolvedDelay = isMobile ? 0 : delay;
    return `${name} ${resolvedDuration}ms ease-out ${resolvedDelay}ms forwards`;
  };

  const heroOpacity = prefersReducedMotion ? 1 : 0;
  const heroSlide = homeContent.hero[0];
  const statCards = [
    { value: '100+', label: 'Partner Universities' },
    { value: '600+', label: 'Active Channel Partners in SAMEA' },
    { value: '4K+', label: 'Students Recruited' },
  ];
  const heroBadge = heroSlide?.badge || "\u{1F30D} India's Trusted Global Education Partner";
  const heroTitleLine1 = stripTrailingFullStop(heroSlide?.titleLine1, 'Expand Your University');
  const heroTitleLine2 = stripTrailingFullStop(heroSlide?.titleLine2, 'Strengthen Your Enrolment Pipeline');
  const heroDescription =
    heroSlide?.description ||
    'We help universities build visibility in India, activate high-quality recruitment channels, and convert demand into sustained enrolment growth.';
  const primaryCtaLabel = heroSlide?.primaryCtaLabel || 'Partner With Us';
  const primaryCtaUrl = getSafeInternalPath(heroSlide?.primaryCtaUrl, '/collaborate');
  const secondaryCtaLabel = heroSlide?.secondaryCtaLabel || 'View Our Network';
  const resolvedSecondaryCtaUrl = getSafeInternalPath(heroSlide?.secondaryCtaUrl, '/portfolio');
  const secondaryCtaUrl =
    resolvedSecondaryCtaUrl === '/about' ? '/portfolio' : resolvedSecondaryCtaUrl;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-transparent text-foreground"
    >
      <div
        ref={mediaRef}
        className="absolute inset-0 scale-[1.08]"
        style={{ willChange: 'transform' }}
      >
        <img
          src="/videos/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          onLoadedData={() => {
            const video = videoRef.current;
            if (!video) return;
            setIsVideoReady(true);
            logHeroVideo('loadeddata', {
              src: video.currentSrc,
              width: video.videoWidth,
              height: video.videoHeight,
            });
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch((error) => {
                logHeroVideo('onLoadedData play() blocked', error?.message || error);
              });
            }
          }}
          onEmptied={() => setIsVideoReady(false)}
          onError={() => {
            const video = videoRef.current;
            const sourceWebm = sourceWebmRef.current;
            const sourceMp4 = sourceMp4Ref.current;
            if (!video || !sourceWebm || !sourceMp4) return;

            const fallbackSources = getVideoSources('720');

            if (
              sourceWebm.getAttribute('src') !== fallbackSources.webm ||
              sourceMp4.getAttribute('src') !== fallbackSources.mp4
            ) {
              logHeroVideo('source error; switching fallback to 720', {
                previous: video.currentSrc,
                fallbackSources,
              });
              sourceWebm.setAttribute('src', fallbackSources.webm);
              sourceMp4.setAttribute('src', fallbackSources.mp4);
              video.load();
              const playPromise = video.play();
              if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch((error) => {
                  logHeroVideo('fallback play() blocked', error?.message || error);
                });
              }
            }
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source ref={sourceWebmRef} type="video/webm" />
          <source ref={sourceMp4Ref} type="video/mp4" />
        </video>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(106deg, rgba(8,6,20,0.84) 0%, rgba(10,8,24,0.56) 52%, rgba(10,8,24,0.2) 100%)'
            : 'linear-gradient(106deg, rgba(12,9,28,0.78) 0%, rgba(15,12,34,0.54) 52%, rgba(15,12,34,0.2) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 85% 65% at 24% 44%, rgba(83,64,176,0.22) 0%, rgba(83,64,176,0.08) 42%, transparent 74%)'
            : 'radial-gradient(ellipse 85% 65% at 24% 44%, rgba(83,64,176,0.18) 0%, rgba(83,64,176,0.08) 42%, transparent 74%)',
        }}
      />

      <div
        ref={fogRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[240px]"
        style={{
          willChange: 'transform',
          background: isDark
            ? 'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(45,27,105,0.24) 0%, transparent 72%)'
            : 'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(123,107,204,0.06) 0%, rgba(232,82,26,0.02) 34%, transparent 76%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[90px]"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(13,10,26,0) 0%, rgba(13,10,26,0.55) 72%, rgba(13,10,26,0.85) 100%)'
            : 'linear-gradient(to bottom, rgba(248,245,255,0) 0%, rgba(248,245,255,0.4) 72%, rgba(248,245,255,0.7) 100%)',
        }}
      />

      <div className="relative z-10 flex min-h-[100dvh] items-center px-4 pb-44 pt-28 sm:px-6 md:pb-40 lg:px-8">
        <div
          ref={textRef}
          className="mx-auto w-full max-w-7xl"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="relative max-w-3xl">
            <span
              className="relative inline-flex rounded-full border border-white/30 bg-[#150F2D]/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFD0B3] sm:text-xs dark:border-white/20 dark:bg-[#140F2A]/55 dark:text-[#FFC29A]"
              style={{ animation: heroAnimation('fadeDown', 500, 0), opacity: heroOpacity }}
            >
              {heroBadge}
            </span>

            <h1
              className="relative mt-6 font-heading text-[36px] font-bold leading-[1.08] text-white sm:text-[44px] lg:text-[60px]"
              style={{
                textShadow: isDark
                  ? '0 6px 24px rgba(13,10,26,0.45)'
                  : '0 8px 30px rgba(8,5,20,0.46)',
              }}
            >
              <span className="block" style={{ animation: heroAnimation('fadeUp', 700, 100), opacity: heroOpacity }}>
                {heroTitleLine1}
              </span>
              <span
                className="block bg-[linear-gradient(95deg,#FFFFFF_0%,#FFE7D8_55%,#FFB57F_100%)] bg-clip-text text-transparent"
                style={{ animation: heroAnimation('fadeUp', 700, 200), opacity: heroOpacity }}
              >
                {heroTitleLine2}
              </span>
            </h1>

            <p
              className="relative mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-[18px]"
              style={{
                animation: heroAnimation('fadeUp', 600, 300),
                opacity: heroOpacity,
                textShadow: '0 3px 16px rgba(6,4,16,0.38)',
              }}
            >
              {heroDescription}
            </p>

            <div
              className="relative mt-8 flex flex-col gap-4 sm:flex-row"
              style={{ animation: heroAnimation('fadeUp', 600, 400), opacity: heroOpacity }}
            >
              <Link
                to={primaryCtaUrl}
                className="rounded-xl bg-[linear-gradient(95deg,#E8521A_0%,#FF7A3D_100%)] px-6 py-4 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(232,82,26,0.42)]"
              >
                {primaryCtaLabel}
              </Link>
              <Link
                to={secondaryCtaUrl}
                className="rounded-xl border border-white/45 bg-white/18 px-6 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 ease-out hover:bg-white/25 dark:border-white/30 dark:bg-white/8 dark:hover:bg-white/14"
              >
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="pointer-events-none absolute inset-x-0 bottom-10 z-10 px-4 sm:px-6 lg:px-8"
        style={{ willChange: 'transform' }}
      >
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {statCards.map((card, index) => (
            <div
              key={card.label}
              className={`relative w-full overflow-hidden rounded-2xl border px-3 py-3 text-center sm:px-5 sm:py-4 ${
                index === statCards.length - 1
                  ? 'col-span-2 mx-auto max-w-[220px] sm:col-span-1 sm:max-w-none'
                  : ''
              } ${
                isDark
                  ? 'border-[#8B7BE8]/28 bg-[#151129]/70 shadow-[0_24px_56px_rgba(5,3,18,0.55)]'
                  : 'border-[#D8D3EB] shadow-[0_16px_34px_rgba(26,16,51,0.18)]'
              }`}
              style={{
                animation: heroAnimation('scaleIn', 500, 500 + index * 80),
                opacity: heroOpacity,
                ...(isDark
                  ? {}
                  : {
                      background:
                        'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(247,242,255,0.95) 56%, rgba(238,231,252,0.93) 100%)',
                      borderColor: 'rgba(183,170,229,0.58)',
                      boxShadow:
                        '0 16px 34px rgba(26,16,51,0.18), inset 0 1px 0 rgba(255,255,255,0.76)',
                    }),
              }}
            >
              {!isDark && (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/95"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-9 left-1/2 h-16 w-32 -translate-x-1/2 rounded-full bg-white/35 blur-xl"
                  />
                </>
              )}
              <p
                className={`font-heading text-2xl font-bold sm:text-[28px] ${
                  isDark ? 'text-white' : 'text-[#1E1440]'
                }`}
                data-countup={card.value}
              >
                {card.value}
              </p>
              <p
                className={`mt-1 text-[10px] font-medium uppercase tracking-[0.2em] sm:text-[11px] sm:tracking-[0.22em] ${
                  isDark ? 'text-[#B8ADDC]' : 'text-[#5F4D98]'
                }`}
              >
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-[#2D1B69]/45 dark:text-white/40"
        style={{ animation: heroAnimation('fadeUp', 400, 800), opacity: heroOpacity }}
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

    </section>
  );
}
