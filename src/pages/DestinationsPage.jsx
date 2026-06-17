import { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Search, X, CheckCircle2, Globe2, MapPin } from 'lucide-react';
import Seo from '../components/seo/Seo';
import LazySection from '../components/ui/LazySection';
import SectionSkeleton from '../components/ui/SectionSkeleton';
import { destinationRegions } from '../data/destinationsData';

/* ══════════════════════════════════
   ISO FLAG MAP
══════════════════════════════════ */
const ISO = {
  usa:'us',canada:'ca',austria:'at',belgium:'be',bulgaria:'bg',croatia:'hr',
  czechia:'cz',denmark:'dk',estonia:'ee',finland:'fi',france:'fr',germany:'de',
  greece:'gr',hungary:'hu',iceland:'is',italy:'it',latvia:'lv',liechtenstein:'li',
  lithuania:'lt',luxembourg:'lu',malta:'mt',netherlands:'nl',norway:'no',poland:'pl',
  portugal:'pt',romania:'ro',slovakia:'sk',slovenia:'si',spain:'es',sweden:'se',
  switzerland:'ch',uk:'gb',ireland:'ie',cyprus:'cy',albania:'al',serbia:'rs',
  moldova:'md',ukraine:'ua',belarus:'by',turkey:'tr',mauritius:'mu',uae:'ae',
  malaysia:'my',singapore:'sg',vietnam:'vn','hong kong':'hk','south korea':'kr',japan:'jp',
};
const getISO = n => ISO[n.toLowerCase().trim()] || 'un';

const COUNTRY_IMG = {
  /* North America */
  usa:'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=700&q=80',
  canada:'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=700&q=80',
  /* Europe Schengen */
  france:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=700&q=80',
  germany:'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=700&q=80',
  italy:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=700&q=80',
  spain:'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=700&q=80',
  netherlands:'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=700&q=80',
  portugal:'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=700&q=80',
  sweden:'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=700&q=80',
  norway:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&q=80',
  austria:'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=700&q=80',
  switzerland:'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=700&q=80',
  denmark:'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=700&q=80',
  finland:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=700&q=80',
  poland:'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=700&q=80',
  czechia:'https://images.unsplash.com/photo-1541849546-216549ae216d?w=700&q=80',
  hungary:'https://images.unsplash.com/photo-1541849546-216549ae216d?w=700&q=80',
  greece:'https://images.unsplash.com/photo-1555993539-1732b0258235?w=700&q=80',
  belgium:'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=700&q=80',
  iceland:'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=700&q=80',
  malta:'https://images.unsplash.com/photo-1558882224-dda166733046?w=700&q=80',
  luxembourg:'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=700&q=80',
  bulgaria:'https://images.unsplash.com/photo-1601119479271-21ca92049c81?w=700&q=80',
  croatia:'https://images.unsplash.com/photo-1555990793-da11153b2473?w=700&q=80',
  estonia:'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=700&q=80',
  latvia:'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80',
  liechtenstein:'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=700&q=80',
  lithuania:'https://images.unsplash.com/photo-1578991624414-276ef23a534f?w=700&q=80',
  romania:'https://images.unsplash.com/photo-1555990793-da11153b2473?w=700&q=80',
  slovakia:'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=700&q=80',
  slovenia:'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=700&q=80',
  /* Europe Non-Schengen */
  uk:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=700&q=80',
  ireland:'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=700&q=80',
  cyprus:'https://images.unsplash.com/photo-1572204097183-e1ab140342ed?w=700&q=80',
  albania:'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=700&q=80',
  serbia:'https://images.unsplash.com/photo-1543218024-57a70143c369?w=700&q=80',
  moldova:'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=700&q=80',
  ukraine:'https://images.unsplash.com/photo-1547127796-06bb04e4b315?w=700&q=80',
  belarus:'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=700&q=80',
  turkey:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=700&q=80',
  /* Africa */
  mauritius:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
  /* Middle East */
  uae:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80',
  /* Asia Pacific */
  malaysia:'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=700&q=80',
  singapore:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&q=80',
  vietnam:'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&q=80',
  'hong kong':'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=700&q=80',
  'south korea':'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=700&q=80',
  japan:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&q=80',
};
const getImg = n => COUNTRY_IMG[n.toLowerCase()] || null;

const buildUnsplashSrcSet = (source, widths = [480, 640, 800, 960]) =>
  widths.map((width) => `${source}?w=${width}&q=80 ${width}w`).join(', ');

/* Per-region config */
const REGION_CFG = {
  'north-america': { img:'/dest-northamerica.jpg', emoji:'🌎', tagline:'World-class universities, limitless ambition', accent:'#6D57D8' },
  'europe-schengen': { img:'/dest-europe.jpg', emoji:'🌍', tagline:'One visa — 29 countries, endless discovery', accent:'#3B82F6' },
  'europe-non-schengen': { img:'/dest-europe.jpg', emoji:'🇬🇧', tagline:'Premier English pathways to global careers', accent:'#8B5CF6' },
  'asia-pacific': { img:'/dest-asia.jpg', emoji:'🌏', tagline:'Innovation capitals of the modern world', accent:'#10B981' },
  'middle-east': { img:'/dest-middleeast.jpg', emoji:'✨', tagline:'Tax-free, ultra-modern, globally connected', accent:'#F59E0B' },
  'africa': { img:'/dest-middleeast.jpg', emoji:'🌴', tagline:'Emerging, vibrant, rising in the east', accent:'#EF4444' },
};

/* ══════════════════════════════════
   SVG DOT-GRID BACKGROUND TEXTURE
══════════════════════════════════ */
function DotGrid() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.035] dark:opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="dot-pattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
}

/* ══════════════════════════════════
   LIVE WORLD CLOCKS STRIP
══════════════════════════════════ */
function AnalogClock({ hh, mm, ss, bgImage, isCenter }) {
  const h = parseInt(hh, 10);
  const m = parseInt(mm, 10);
  const s = parseInt(ss, 10);

  const hourAngle = (h % 12) * 30 + m * 0.5;
  const minuteAngle = m * 6 + s * 0.1;
  const secondAngle = s * 6;

  const sizeClass = isCenter ? "h-12 w-12 md:h-14 md:w-14" : "h-8 w-8 md:h-10 w-10";

  return (
    <svg viewBox="0 0 100 100" className={`${sizeClass} shrink-0 drop-shadow-sm transition-transform duration-500 hover:rotate-3`}>
      {/* Clock Face Background */}
      {bgImage ? (
        <g>
          <clipPath id="clock-clip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
          <image href={bgImage} x="0" y="0" height="100" width="100" preserveAspectRatio="xMidYMid slice" clipPath="url(#clock-clip)" opacity="0.45" />
          <circle cx="50" cy="50" r="48" className="fill-none stroke-brand-orange/60" strokeWidth="3" />
        </g>
      ) : (
        <circle cx="50" cy="50" r="48" className="fill-background stroke-border/60" strokeWidth="2" />
      )}
      
      {/* Tick Marks */}
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="6"
          x2="50"
          y2={i % 3 === 0 ? "14" : "11"}
          transform={`rotate(${i * 30} 50 50)`}
          className={bgImage ? "stroke-foreground/60" : "stroke-muted-foreground/30"}
          strokeWidth={i % 3 === 0 ? "2.5" : "1.5"}
          strokeLinecap="round"
        />
      ))}

      {/* Hour Hand */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="28"
        transform={`rotate(${hourAngle} 50 50)`}
        className="stroke-foreground"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Minute Hand */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="16"
        transform={`rotate(${minuteAngle} 50 50)`}
        className="stroke-foreground/80"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Second Hand */}
      <line
        x1="50"
        y1="58"
        x2="50"
        y2="12"
        transform={`rotate(${secondAngle} 50 50)`}
        className="stroke-brand-orange"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Center Dots */}
      <circle cx="50" cy="50" r="3" className="fill-brand-orange" />
      <circle cx="50" cy="50" r="1.5" className="fill-background" />
    </svg>
  );
}

function WorldClockStrip() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { name: 'NEW YORK', tz: 'America/New_York' },
    { name: 'LONDON', tz: 'Europe/London' },
    { name: 'NEW DELHI', tz: 'Asia/Kolkata', isCenter: true, bgImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&q=80' },
    { name: 'SINGAPORE', tz: 'Asia/Singapore' },
    { name: 'SYDNEY', tz: 'Australia/Sydney' },
  ];

  return (
    <div className="border-t border-border/50 bg-muted/20 py-5 backdrop-blur-md">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-3 gap-3 md:flex md:items-center md:justify-between md:gap-4">
        {cities.map((city) => {
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: city.tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          const timeString = formatter.format(time);
          const [hh, mm, ss] = timeString.split(':');

          return (
            <div
              key={city.name}
              className={`${city.name === 'NEW YORK' ? 'col-start-1 row-start-1' : ''} ${city.name === 'LONDON' ? 'col-start-3 row-start-1' : ''} ${city.isCenter ? 'col-start-2 row-start-2 border-brand-orange/30 bg-background/92 shadow-[0_16px_34px_rgba(232,82,26,0.12)] scale-[1.02]' : ''} ${city.name === 'SINGAPORE' ? 'col-start-1 row-start-3' : ''} ${city.name === 'SYDNEY' ? 'col-start-3 row-start-3' : ''} rounded-2xl border border-border/60 bg-background/75 p-3 shadow-[0_12px_28px_rgba(20,14,45,0.05)] backdrop-blur-sm md:min-w-[148px] md:flex-1`}
            >
              <div className="flex flex-col items-center gap-2.5 text-center md:flex-row md:items-center md:justify-center md:text-left">
                <AnalogClock hh={hh} mm={mm} ss={ss} bgImage={city.bgImage} isCenter={city.isCenter} />
                <div className="flex flex-col">
                  <span className={`font-black uppercase tracking-[0.3em] ${city.isCenter ? 'text-[10px] md:text-[11px] text-brand-orange drop-shadow-sm' : 'text-[8px] md:text-[9px] text-muted-foreground'}`}>
                    {city.name}
                  </span>
                  <div className={`flex items-center font-mono font-bold tracking-widest text-foreground ${city.isCenter ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
                    <span>{hh}</span>
                    <span className="mx-0.5 text-brand-orange/60 dark:text-brand-orange/40">:</span>
                    <span>{mm}</span>
                    <span className="mx-0.5 text-brand-orange/60 dark:text-brand-orange/40">:</span>
                    <span className="text-brand-orange tabular-nums">{ss}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   HERO SECTION
   Split: left text | right photo mosaic
══════════════════════════════════ */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const heroPhotos = [
    {
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      srcSet: buildUnsplashSrcSet('https://images.unsplash.com/photo-1502602898657-3e91760cbb34'),
      sizes: '(max-width: 1024px) 50vw, 24vw',
      label: 'Paris',
    },
    {
      src: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&q=80',
      srcSet: buildUnsplashSrcSet('https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2'),
      sizes: '(max-width: 1024px) 50vw, 22vw',
      label: 'New York',
    },
    {
      src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
      srcSet: buildUnsplashSrcSet('https://images.unsplash.com/photo-1525625293386-3f8f99389edd'),
      sizes: '(max-width: 1024px) 50vw, 22vw',
      label: 'Singapore',
    },
    {
      src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      srcSet: buildUnsplashSrcSet('https://images.unsplash.com/photo-1512453979798-5ea266f8880c'),
      sizes: '(max-width: 1024px) 50vw, 22vw',
      label: 'Dubai',
    },
  ];

  return (
    <section ref={ref} className="relative min-h-[88vh] overflow-hidden bg-background">
      {/* Dot grid texture */}
      <div className="pointer-events-none absolute inset-0 text-foreground/50 dark:text-white/70">
        <DotGrid />
      </div>

      {/* Big ambient gradient blob — top left */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full bg-brand-purple/8 blur-[120px] dark:bg-brand-purple/16" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-[380px] w-[480px] rounded-full bg-brand-orange/6 blur-[110px] dark:bg-brand-orange/10" />

      <div className="relative mx-auto grid max-w-screen-xl items-start gap-10 px-4 pt-6 pb-10 sm:gap-12 sm:px-10 sm:pt-8 sm:pb-14 lg:min-h-[88vh] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:px-16 lg:pt-10 lg:pb-16">

        {/* ── LEFT: Text content ── */}
        <div className="order-1 flex flex-col items-start gap-5 text-left sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/15 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-brand-purple shadow-[0_10px_24px_rgba(20,14,45,0.06)] backdrop-blur-md dark:border-brand-purple/30 dark:bg-[#140f24]/70 dark:text-brand-purple-mid">
              <Globe2 className="h-3.5 w-3.5" />
              Global Destinations
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="max-w-[11ch] text-balance font-black leading-[0.9] tracking-[-0.05em] text-[#1a1130] dark:text-white text-[clamp(3rem,7vw,6.4rem)]"
              style={{
                fontFamily:
                  "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif",
              }}
            >
              <span className="block">Where the world</span>
              <span className="block italic text-brand-orange">becomes your campus.</span>
            </h1>
          </motion.div>

          <p className="max-w-xl text-[15px] leading-relaxed text-black/72 dark:text-white/68 sm:text-[16px]">
            Explore top study destinations handpicked for their quality of education, global recognition, and opportunities for international students.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Link
              to="/collaborate"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-brand-orange via-[#ef652d] to-[#ff7b38] px-7 py-4 text-[12px] font-black uppercase tracking-wider text-white shadow-[0_14px_34px_rgba(232,82,26,0.24)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#ff6d31] hover:via-[#f45f23] hover:to-[#ff8848] hover:shadow-[0_18px_42px_rgba(232,82,26,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/35 sm:w-auto"
            >
              Read the Guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
            <Link
              to="/universities"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-white/80 px-7 py-4 text-[12px] font-semibold text-[#2c2251] shadow-[0_10px_24px_rgba(20,14,45,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-purple/25 hover:bg-brand-purple/6 hover:text-[#1a1130] hover:shadow-[0_14px_28px_rgba(69,39,160,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/20 dark:border-white/10 dark:bg-white/6 dark:text-white/78 dark:hover:bg-white/10 sm:w-auto"
            >
              Browse Destinations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ── RIGHT: Photo mosaic ── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.22, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: photoY }}
          className="relative order-2 mx-auto w-full max-w-[540px] lg:order-2 lg:max-w-none"
        >
          {/* 2×2 photo grid */}
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.12fr_0.88fr] lg:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.72 }}
              className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-[#120d25] shadow-[0_22px_48px_rgba(18,12,45,0.14)] dark:border-white/10 lg:min-h-[38rem]"
            >
              <img
                src={heroPhotos[0].src}
                srcSet={heroPhotos[0].srcSet}
                sizes="(max-width: 1024px) 100vw, 30vw"
                alt={heroPhotos[0].label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,20,0.08)_0%,rgba(10,8,20,0.18)_45%,rgba(10,8,20,0.62)_100%)]" />
            </motion.div>

            <div className="grid gap-3 sm:gap-4">
              {heroPhotos.slice(1).map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 + i * 0.08, duration: 0.7 }}
                  className={`group relative overflow-hidden rounded-[1.6rem] border border-black/5 shadow-[0_16px_34px_rgba(18,12,45,0.1)] dark:border-white/10 ${
                    i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={p.src}
                    srcSet={p.srcSet}
                    sizes="(max-width: 1024px) 48vw, 18vw"
                    alt={p.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="eager"
                    decoding="async"
                    fetchPriority="auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-white/90 backdrop-blur-md">
                    {p.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>


        </motion.div>
      </div>

      <WorldClockStrip />
    </section>
  );
}

/* ══════════════════════════════════
   FILTER BAR
══════════════════════════════════ */
function FilterBar({ query, setQuery, tab, setTab }) {
  const TABS = [
    { id:'all', label:'All Regions' },
    { id:'north-america', label:'N. America' },
    { id:'europe', label:'Europe' },
    { id:'asia-pacific', label:'Asia Pacific' },
    { id:'middle-east-africa', label:'M.E. & Africa' },
  ];

  return (
    <div className="relative z-20 border-b border-border/50 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto max-w-screen-xl px-4 py-3 sm:px-6 lg:px-16">
        <div className="rounded-[28px] border border-white/70 bg-white/88 px-3 py-3 shadow-[0_18px_48px_rgba(20,14,45,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0F0B1E]/92">
          <div className="flex flex-col gap-3 lg:gap-4">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/55" />
              <input
                type="text"
                placeholder="Search countries or regions"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 w-full rounded-2xl border border-[#E4DDF3] bg-[#FBFAFF] pl-11 pr-11 text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] transition-all focus:border-brand-purple/35 focus:bg-white focus:ring-2 focus:ring-brand-purple/10 dark:border-white/10 dark:bg-white/6 dark:focus:bg-white/10"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground dark:hover:bg-white/10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-[#E9E2F6] bg-[#F6F3FF] p-1.5 shadow-inner dark:border-white/10 dark:bg-white/5">
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-bold tracking-wide transition-all sm:px-5 ${
                      tab === t.id
                        ? 'bg-brand-purple text-white shadow-[0_10px_20px_rgba(45,27,105,0.22)] dark:bg-brand-purple-mid'
                        : 'text-muted-foreground hover:bg-white/70 hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountryCard({ country }) {
  const iso = getISO(country.name);
  const img = getImg(country.name);

  return (
    <div
      className="group relative cursor-default select-none overflow-hidden rounded-xl border border-border/60 bg-muted/20 sm:rounded-2xl"
      style={{ aspectRatio:'5/4' }}
    >
      {/* Photo */}
      {img ? (
        <img
          src={img}
          alt={country.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          loading="lazy"
          decoding="async"
          onError={e => { e.currentTarget.style.display='none'; }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/30 to-brand-purple-mid/10" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/0" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-2.5 sm:p-3">
        {/* Flag */}
        <div>
          <div className="h-[13px] w-[20px] overflow-hidden rounded-[3px] shadow-md ring-1 ring-white/20 sm:h-[16px] sm:w-[23px]">
            <img
              src={`https://flagcdn.com/w80/${iso}.png`}
              alt={country.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={e => { e.currentTarget.style.display='none'; }}
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <p className="text-[10px] font-black leading-tight text-white drop-shadow-md sm:text-[12px]">
            {country.name}
          </p>
          {country.popularCities?.length > 0 && (
            <p className="mt-0.5 hidden items-center gap-1 text-[9px] text-white/50 sm:flex">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              {country.popularCities.slice(0,2).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   REGION SECTION
══════════════════════════════════ */
function RegionSection({ region, cfg, index, isLast }) {
  const isEven = index % 2 === 0;

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '1px 1280px',
      }}
    >
      {/* Alternating subtle surface background */}
      {!isEven && (
        <div className="absolute inset-0 bg-muted/30 dark:bg-white/[0.02]" />
      )}

      <div className="relative mx-auto max-w-screen-xl px-6 sm:px-10 lg:px-16">
        
        {/* ── 1. Hero Split (Image & Text) ── */}
        <div className={`flex flex-col gap-8 md:gap-12 lg:flex-row lg:items-center lg:gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          {/* Image Column */}
          <div className="order-2 w-full lg:order-none lg:w-1/2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-2xl">
              <div
                className="absolute -right-4 -top-4 z-10 h-32 w-32 rounded-full opacity-60 blur-3xl pointer-events-none"
                style={{ background: cfg.accent }}
              />
              <img
                src={cfg.img}
                alt={region.label}
                className="absolute -top-[15%] left-0 h-[130%] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Glassmorphic Benefits Card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-background/20 p-4 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-black/20 sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.4em] text-foreground/70">
                  Key Advantages
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2.5">
                  {region.keyBenefits.map(b => (
                    <div key={b} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                      <span className="text-[11px] font-medium text-foreground">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="order-1 flex w-full flex-col items-center justify-center gap-6 text-center lg:order-none lg:w-1/2 lg:items-start lg:text-left">
            <div>
              <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
                <div className="h-[3px] w-10 rounded-full" style={{ background: cfg.accent }} />
                <span
                  className="text-[9px] font-black uppercase tracking-[0.45em]"
                  style={{ color: cfg.accent }}
                >
                  {cfg.tagline}
                </span>
              </div>
              <h2
                className="font-black leading-[1.05] tracking-[-0.02em] text-foreground"
                style={{ fontFamily:"'Poppins',sans-serif", fontSize:'clamp(2.25rem, 6vw, 4.5rem)' }}
              >
                {region.label}
              </h2>
              <p className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground lg:mx-0">
                {region.description}
              </p>
            </div>
            <Link
              to="/collaborate"
              className="group mt-2 inline-flex w-fit items-center justify-center gap-3 rounded-full border border-border bg-background px-7 py-4 text-[11px] font-black tracking-wider text-foreground shadow-sm transition-all hover:border-brand-orange hover:text-brand-orange"
            >
              Consult an Expert
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ── 2. Full-Width Destinations Grid ── */}
        <div className="mt-16 w-full sm:mt-24">
          <div className="mb-8 flex flex-col items-center gap-3 border-b border-border/50 pb-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/80">
                Destinations in {region.label}
              </p>
            </div>
            <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-[10px] font-bold text-brand-orange">
              {region.countries.length} Countries
            </span>
          </div>

          <div
            className={`grid gap-2.5 sm:gap-4 ${
              region.countries.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' :
              region.countries.length <= 8 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
              'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
            }`}
          >
            {region.countries.map((c) => (
              <CountryCard key={c.name} country={c} />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative separator between sections */}
      {!isLast && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block h-[1px] w-[calc(100%+1.3px)]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="fill-border/40" />
          </svg>
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════
   SCHENGEN EXPLAINER
   Uses a purple gradient surface — not black
══════════════════════════════════ */
function SchengenSection() {
  const sections = [
    {
      id: 'schengen',
      kicker: '29 Member Countries',
      title: 'Schengen Zone',
      accent: '#6D57D8',
      deck: 'Best when you want one visa and the freedom to move across Europe.',
      bullets: [
        'Borderless travel across the zone',
        'Shared visa process via VFS Global',
      ],
    },
    {
      id: 'non-schengen',
      kicker: 'UK / Ireland / Cyprus / More',
      title: 'Non-Schengen',
      accent: '#E8521A',
      deck: 'Best when you want a focused country plan with English-taught options.',
      bullets: [
        'Separate visa for each country',
        'Strong post-study pathways in selected markets',
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f5efe4] text-[#191324] dark:bg-[#0b0f1a] dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,87,216,0.08),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(232,82,26,0.07),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(109,87,216,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(232,82,26,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.05]">
        <DotGrid />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-20 lg:px-16 lg:py-24">
        <div className="mb-6 flex items-center justify-between border-y border-black/10 py-3 dark:border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-brand-orange">
            Study Abroad Desk
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
            Short guide
          </p>
        </div>

        <div className="max-w-4xl">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.45em] text-black/40 dark:text-white/40">
            Visa guide
          </p>
          <h2
            className="font-serif text-[clamp(2.7rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.04em] text-[#17111f] dark:text-white"
            style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
          >
            Schengen
            <span className="mx-3 text-black/28 dark:text-white/22">vs.</span>
            <span className="block italic text-black/42 dark:text-white/30">Non-Schengen</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/68 dark:text-white/66 sm:text-[16px]">
            Pick the visa model first. It shapes mobility, study rhythm, and the amount of travel flexibility a student gets.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {['One visa, many countries', 'Country-specific approvals', 'Mobility vs. focus'].map((item, index) => (
            <div
              key={item}
              className={`rounded-full border px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.28em] ${
                index === 1
                  ? 'border-brand-orange/30 bg-brand-orange/10 text-brand-orange'
                  : 'border-black/10 bg-white/70 text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {sections.map((section, index) => (
            <motion.article
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative overflow-hidden border border-black/10 bg-[#fff8ee] p-6 shadow-[0_16px_42px_rgba(18,12,34,0.08)] dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="absolute left-0 top-0 h-[3px] w-28" style={{ background: section.accent }} />
              <div className="absolute right-4 top-4 text-[10px] uppercase tracking-[0.35em] text-black/25 dark:text-white/25">
                {String(index + 1).padStart(2, '0')}
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.45em] text-black/40 dark:text-white/40">
                {section.kicker}
              </p>
              <h3
                className="mt-2 font-serif text-4xl leading-[0.95] tracking-[-0.04em] text-[#17111f] dark:text-white"
                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
              >
                {section.title}
              </h3>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-black/68 dark:text-white/68">
                {section.deck}
              </p>

              <div className="mt-5 space-y-3 border-t border-black/10 pt-4 dark:border-white/10">
                {section.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3">
                    <span
                      className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: section.accent }}
                    />
                    <p className="text-[13px] leading-snug text-black/70 dark:text-white/70">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 border-t border-black/10 pt-4 text-center dark:border-white/10">
          <p className="text-[12px] leading-relaxed text-black/55 dark:text-white/55">
            Short version: Schengen favors movement. Non-Schengen favors focus.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   FINAL CTA
   Light/dark aware — uses bg-surface tone
══════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-28 sm:px-10 lg:px-16">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 text-foreground">
        <DotGrid />
      </div>

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-purple/8 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-brand-orange/8 blur-[80px]" />

      <div className="relative mx-auto max-w-screen-xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.45em] text-brand-orange">
              Start Your Journey
            </p>
            <h2
              className="font-black leading-[0.97] tracking-[-0.03em] text-foreground"
              style={{ fontFamily:"'Poppins',sans-serif", fontSize:'clamp(2.5rem,6vw,5.5rem)' }}
            >
              Find your perfect
              <br />
              <span className="text-brand-purple dark:text-brand-purple-mid">destination.</span>
            </h2>
            <p className="mt-5 max-w-[44ch] text-[14px] leading-relaxed text-muted-foreground">
              Our expert counselors help you choose the right country, university,
              and programme tailored to your goals.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
            <Link
              to="/collaborate"
              className="group inline-flex items-center gap-3 rounded-full bg-brand-orange px-9 py-5 text-[13px] font-black text-white shadow-[0_8px_40px_rgba(232,82,26,0.28)] transition-all hover:-translate-y-1 hover:bg-brand-orange-light hover:shadow-[0_16px_50px_rgba(232,82,26,0.38)]"
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
            <Link
              to="/universities"
              className="inline-flex items-center gap-3 rounded-full border border-border px-9 py-5 text-[13px] font-bold text-muted-foreground transition-all hover:border-brand-purple/40 hover:text-foreground"
            >
              Browse Universities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => { window.scrollTo({ top:0, behavior:'instant' }); }, []);

  const filteredRegions = useMemo(() =>
    destinationRegions
      .map(r => ({
        ...r,
        countries: r.countries.filter(c =>
          c.name.toLowerCase().includes(deferredSearchQuery.toLowerCase())
        ),
      }))
      .filter(r => {
        if (deferredSearchQuery && r.countries.length === 0) return false;
        if (selectedTab === 'all') return true;
        if (selectedTab === 'north-america') return r.key === 'north-america';
        if (selectedTab === 'europe') return r.key.startsWith('europe');
        if (selectedTab === 'asia-pacific') return r.key === 'asia-pacific';
        if (selectedTab === 'middle-east-africa') return r.key === 'middle-east' || r.key === 'africa';
        return true;
      }),
  [selectedTab, deferredSearchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <Seo
        title="Study Abroad Destinations | The Global Avenues"
        description="Explore study abroad destinations across North America, Europe, Asia Pacific, and Middle East & Africa with The Global Avenues."
        path="/destinations"
        keywords={['study abroad','destinations','schengen','study in europe','study in usa','study in canada','overseas education']}
      />

      <HeroSection />

      <FilterBar query={searchQuery} setQuery={setSearchQuery} tab={selectedTab} setTab={setSelectedTab} />

      {filteredRegions.length > 0 ? (
        filteredRegions.map((region, i) => (
          <LazySection
            key={region.key}
            rootMargin="1600px"
            preloadOnIdle
            idleDelay={0}
            fallback={
              <SectionSkeleton
                height="h-[1180px]"
                cards={6}
                rows={4}
                className="my-0 px-4 sm:px-6 lg:px-16"
              />
            }
          >
            <RegionSection
              region={region}
              cfg={REGION_CFG[region.key] || { img:'/dest-europe.jpg', emoji:'🌍', tagline:'Explore educational pathways', accent:'#6D57D8' }}
              index={i}
              isLast={i === filteredRegions.length - 1}
            />
          </LazySection>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-36 text-center">
          <p className="text-6xl">🔍</p>
          <h3 className="mt-5 text-xl font-black text-foreground">No results for "{searchQuery}"</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try a different country name or reset the filter.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedTab('all'); }}
            className="mt-7 rounded-full bg-brand-orange px-7 py-3 text-xs font-black text-white"
          >
            Reset Filters
          </button>
        </div>
      )}

      <LazySection
        rootMargin="1600px"
        preloadOnIdle
        idleDelay={0}
        fallback={
          <SectionSkeleton
            height="h-[560px]"
            cards={2}
            rows={3}
            className="my-0 px-4 sm:px-6 lg:px-16"
          />
        }
      >
        <SchengenSection />
      </LazySection>
      <LazySection
        rootMargin="1600px"
        preloadOnIdle
        idleDelay={0}
        fallback={
          <SectionSkeleton
            height="h-[420px]"
            cards={2}
            rows={2}
            className="my-0 px-4 sm:px-6 lg:px-16"
          />
        }
      >
        <FinalCTA />
      </LazySection>
    </div>
  );
}

