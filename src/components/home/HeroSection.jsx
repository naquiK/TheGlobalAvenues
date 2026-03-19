import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';

const statCards = [
  { value: '31+', label: 'University Partners' },
  { value: '10K+', label: 'Students Guided' },
  { value: '95%', label: 'Visa Success Rate' },
];

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
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const sourceRef = useRef(null);
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
    const source = sourceRef.current;

    if (!section || !video || !source) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const dataSrc = source.dataset.src;
        if (dataSrc && !source.src) {
          source.src = dataSrc;
          video.load();
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
          }
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

    const handleTimeUpdate = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      // Restart just before the end to avoid visible blank/gray frame between loops.
      if (video.duration - video.currentTime <= 0.08) {
        video.currentTime = 0.03;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
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
          src="/videos/hero-poster.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster="/videos/hero-poster.png"
            onLoadedData={() => {
              setIsVideoReady(true);
              const playPromise = videoRef.current?.play();
              if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
              }
            }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source ref={sourceRef} data-src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(to right, rgba(13,10,26,0.58) 0%, rgba(13,10,26,0.36) 60%, rgba(13,10,26,0.12) 100%)'
            : 'linear-gradient(to right, rgba(20,15,42,0.58) 0%, rgba(20,15,42,0.34) 46%, rgba(20,15,42,0.1) 78%, rgba(20,15,42,0) 100%)',
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
          <div className="max-w-3xl">
            <span
              className="inline-flex rounded-full border border-brand-orange/60 bg-[#140F2A]/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FF7A3D] sm:text-xs dark:border-brand-orange/30 dark:bg-brand-orange/15 dark:text-brand-orange"
              style={{ animation: heroAnimation('fadeDown', 500, 0), opacity: heroOpacity }}
            >
              {'\u{1F30D}'} India's Trusted Global Education Partner
            </span>

            <h1
              className="mt-6 font-heading text-[36px] font-bold leading-[1.1] text-white sm:text-[44px] lg:text-[60px]"
              style={{
                textShadow: isDark
                  ? '0 6px 24px rgba(13,10,26,0.45)'
                  : '0 8px 30px rgba(8,5,20,0.46)',
              }}
            >
              <span className="block" style={{ animation: heroAnimation('fadeUp', 700, 100), opacity: heroOpacity }}>
                Your Dream University.
              </span>
              <span className="block" style={{ animation: heroAnimation('fadeUp', 700, 200), opacity: heroOpacity }}>
                Our Proven Pathway.
              </span>
            </h1>

            <p
              className={`mt-6 max-w-lg text-base leading-7 sm:text-[18px] ${
                isDark ? 'text-white/70' : 'text-white/88'
              }`}
              style={{
                animation: heroAnimation('fadeUp', 600, 300),
                opacity: heroOpacity,
                textShadow: isDark ? 'none' : '0 3px 16px rgba(6,4,16,0.38)',
              }}
            >
              We connect ambitious Indian students with world-class universities across 9
              countries {'\u2014'} from application to visa, every step guided.
            </p>

            <div
              className="mt-8 flex flex-col gap-4 sm:flex-row"
              style={{ animation: heroAnimation('fadeUp', 600, 400), opacity: heroOpacity }}
            >
              <Link
                to="/collaborate"
                className="rounded-xl bg-brand-orange px-6 py-4 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,82,26,0.4)]"
              >
                Start Your Journey
              </Link>
              <Link
                to="/about"
                className="rounded-xl border border-white/45 bg-white/14 px-6 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 ease-out hover:bg-white/22 dark:border-white/30 dark:bg-white/5 dark:hover:bg-white/10"
              >
                Watch Our Story
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
