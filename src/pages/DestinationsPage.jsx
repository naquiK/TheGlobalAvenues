import { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Search, X, CheckCircle2, Globe2, MapPin } from 'lucide-react';
import Seo from '../components/seo/Seo';
import DotGrid from '../components/ui/DotGrid';
import LazySection from '../components/ui/LazySection';
import SectionSkeleton from '../components/ui/SectionSkeleton';
import { destinationRegions } from '../data/destinationsData';

/* ═══════════════════════════════════════════════════════
   ISO FLAG MAP
═══════════════════════════════════════════════════════ */
const ISO = {
  usa:'us',canada:'ca',austria:'at',belgium:'be',bulgaria:'bg',croatia:'hr',
  czechia:'cz',denmark:'dk',estonia:'ee',finland:'fi',france:'fr',germany:'de',
  greece:'gr',hungary:'hu',iceland:'is',italy:'it',latvia:'lv',liechtenstein:'li',
  lithuania:'lt',luxembourg:'lu',malta:'mt',netherlands:'nl',norway:'no',poland:'pl',
  portugal:'pt',romania:'ro',slovakia:'sk',slovenia:'si',spain:'es',sweden:'se',
  switzerland:'ch',uk:'gb',ireland:'ie',cyprus:'cy',albania:'al',serbia:'rs',
  moldova:'md',ukraine:'ua',belarus:'by',turkey:'tr',mauritius:'mu',uae:'ae',
  malaysia:'my',singapore:'sg',vietnam:'vn','hong kong':'hk','south korea':'kr',japan:'jp',
  dubai:'ae','abu dhabi':'ae',sharjah:'ae','ras al khaimah':'ae',
};
const getISO = n => ISO[n.toLowerCase().trim()] || 'un';

const COUNTRY_IMG = {
  usa:'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=700&q=80',
  canada:'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=700&q=80',
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
  slovakia:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Bratislava_Castle_2022.jpg/250px-Bratislava_Castle_2022.jpg',
  slovenia:'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=700&q=80',
  uk:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=700&q=80',
  ireland:'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=700&q=80',
  cyprus:'https://images.unsplash.com/photo-1572204097183-e1ab140342ed?w=700&q=80',
  albania:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Berat_-_Festung_2a_Haupttor.jpg/330px-Berat_-_Festung_2a_Haupttor.jpg',
  serbia:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/%D0%9A%D0%B0%D0%BB%D0%B5%D0%BC%D0%B5%D0%B3%D0%B4%D0%B0%D0%BD%2C_%D1%81%D0%BF%D0%BE%D0%BC%D0%B5%D0%BD%D0%B8%D0%BA_%D0%9F%D0%BE%D0%B1%D1%98%D0%B5%D0%B4%D0%BD%D0%B8%D0%BA%2C_%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D0%B4.jpg/250px-%D0%9A%D0%B0%D0%BB%D0%B5%D0%BC%D0%B5%D0%B3%D0%B4%D0%B0%D0%BD%2C_%D1%81%D0%BF%D0%BE%D0%BC%D0%B5%D0%BD%D0%B8%D0%BA_%D0%9F%D0%BE%D0%B1%D1%98%D0%B5%D0%B4%D0%BD%D0%B8%D0%BA%2C_%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D0%B4.jpg',
  moldova:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Triumphbogen_in_Chi%C8%99in%C4%83u.JPG/250px-Triumphbogen_in_Chi%C8%99in%C4%83u.JPG',
  ukraine:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/%D0%9B%D0%B0%D0%B2%D1%80%D0%B0.jpg/250px-%D0%9B%D0%B0%D0%B2%D1%80%D0%B0.jpg',
  belarus:'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/N%C3%A1rodn%C3%AD_knihovna%2C_Minsk_-_panoramio.jpg/250px-N%C3%A1rodn%C3%AD_knihovna%2C_Minsk_-_panoramio.jpg',
  turkey:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=700&q=80',
  mauritius:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
  uae:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80',
  dubai:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Dubai_Skyline_mit_Burj_Khalifa_%28cropped%29.jpg/330px-Dubai_Skyline_mit_Burj_Khalifa_%28cropped%29.jpg',
  'abu dhabi':'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Abu_dhabi_skylines_2014.jpg/330px-Abu_dhabi_skylines_2014.jpg',
  sharjah:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/View_Of_Sharjah_Corniche.png/250px-View_Of_Sharjah_Corniche.png',
  'ras al khaimah':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Aerial_view_of_RAK_City_from_Al_Qawasim_Corniche_flagpole.jpg/330px-Aerial_view_of_RAK_City_from_Al_Qawasim_Corniche_flagpole.jpg',
  malaysia:'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=700&q=80',
  singapore:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&q=80',
  vietnam:'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&q=80',
  'hong kong':'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=700&q=80',
  'south korea':'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=700&q=80',
  japan:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&q=80',
};
const getImg = n => COUNTRY_IMG[n.toLowerCase()] || null;

/* ═══════════════════════════════════════════════════════
   BUILD DISPLAY REGIONS
═══════════════════════════════════════════════════════ */
const buildDisplayRegions = (regions) => {
  const europeOrder = ['europe-schengen', 'europe-non-schengen'];
  const europeRegions = europeOrder
    .map((key) => regions.find((r) => r.key === key))
    .filter(Boolean);

  if (europeRegions.length === 0) return regions;

  const northAmerica = regions.find((r) => r.key === 'north-america');
  const dubaiSource = regions.find((r) => r.key === 'middle-east');
  const africaSource = regions.find((r) => r.key === 'africa');
  const asiaSource = regions.find((r) => r.key === 'asia-pacific');

  const countryGroups = europeRegions
    .map((region) => ({
      key: region.key,
      label: region.key === 'europe-schengen' ? 'Schengen' : 'Non-Schengen',
      countries: region.countries,
    }))
    .filter((g) => g.countries.length > 0);

  const orderedCountries = countryGroups
    .flatMap((g) => g.countries)
    .sort((a, b) => {
      if (a.name === 'Cyprus') return -1;
      if (b.name === 'Cyprus') return 1;
      return 0;
    });

  const europeRegion = {
    ...europeRegions[0],
    key: 'europe',
    label: 'Europe',
    description: 'Explore Schengen and non-Schengen European study pathways with flexible visa routes, strong academic options, and clear country choices.',
    keyBenefits: ['Schengen mobility', 'Non-Schengen pathways', 'Affordable European options'],
    countries: orderedCountries,
    countryGroups,
  };

  const dubaiRegion = {
    ...(dubaiSource || {}),
    key: 'dubai',
    label: 'UAE',
    description: 'United Arab Emirates pathways with strong career visibility and fast-growing international study options.',
    keyBenefits: ['Regional hub access', 'Fast-growing campuses', 'Professional networks'],
    countries: [
      { name: 'Dubai' },
      { name: 'Abu Dhabi' },
      { name: 'Sharjah' },
      { name: 'Ras Al Khaimah' },
    ],
  };

  const africaSouthEastAsiaRegion = {
    key: 'africa-south-east-asia',
    label: 'Africa & South East Asia',
    description: 'A combined view of emerging African and South East Asian study destinations with practical international options.',
    accent: 'from-[#0E7C86] via-[#2CA6A4] to-[#7AD1C9]',
    marker: 'AS',
    workRights: 'Varies by country',
    averageTuition: 'Country dependent',
    popularIntakes: 'Multiple intakes',
    keyBenefits: ['Emerging markets', 'Affordable study paths', 'Growing global exposure'],
    countries: [...(africaSource?.countries || []), ...(asiaSource?.countries || [])],
  };

  return [europeRegion, dubaiRegion, northAmerica, africaSouthEastAsiaRegion].filter(Boolean);
};

/* ═══════════════════════════════════════════════════════
   REGION CONFIG
═══════════════════════════════════════════════════════ */
const REGION_CFG = {
  europe:                  { img:'/dest-europe.jpg',       tagline:'Schengen & Non-Schengen',   accent:'#3B82F6', gradient:'from-blue-600 to-indigo-700' },
  dubai:                   { img:'/dest-middleeast.jpg',   tagline:'Gulf Study Hubs',            accent:'#F59E0B', gradient:'from-amber-500 to-orange-600' },
  'north-america':         { img:'/dest-northamerica.jpg', tagline:'World-Class Universities',   accent:'#6D57D8', gradient:'from-violet-600 to-purple-700' },
  'africa-south-east-asia':{ img:'/dest-asia.jpg',         tagline:'Emerging Study Destinations',accent:'#10B981', gradient:'from-emerald-500 to-teal-600' },
};

/* ═══════════════════════════════════════════════════════
   ANALOG CLOCK + WORLD CLOCK STRIP
═══════════════════════════════════════════════════════ */
function AnalogClock({ hh, mm, ss, bgImage, isCenter }) {
  const sizeClass = isCenter ? 'h-12 w-12 md:h-14 md:w-14' : 'h-8 w-8 md:h-10 md:w-10';
  const h = parseInt(hh, 10);
  const m = parseInt(mm, 10);
  const s = parseInt(ss, 10);

  const hourDeg   = (h % 12) * 30 + m * 0.5;
  const minuteDeg = m * 6 + s * 0.1;
  const secondDeg = s * 6;

  const hand = (deg, len, width, color) => {
    const rad = (deg - 90) * (Math.PI / 180);
    const x2 = 50 + len * Math.cos(rad);
    const y2 = 50 + len * Math.sin(rad);
    return <line x1="50" y1="50" x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />;
  };

  return (
    <svg viewBox="0 0 100 100" className={`${sizeClass} shrink-0 drop-shadow-sm transition-transform duration-500 hover:rotate-3`}>
      {bgImage ? (
        <g>
          <clipPath id={`cc-${hh}-${mm}`}><circle cx="50" cy="50" r="48" /></clipPath>
          <image href={bgImage} x="0" y="0" height="100" width="100" preserveAspectRatio="xMidYMid slice" clipPath={`url(#cc-${hh}-${mm})`} opacity="0.45" />
          <circle cx="50" cy="50" r="48" className="fill-none stroke-brand-orange/60" strokeWidth="3" />
        </g>
      ) : (
        <circle cx="50" cy="50" r="48" className="fill-background/80 stroke-muted-foreground/30" strokeWidth="2" />
      )}
      {/* Hour marks */}
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180);
        return <line key={i} x1={50 + 38 * Math.cos(a)} y1={50 + 38 * Math.sin(a)} x2={50 + 44 * Math.cos(a)} y2={50 + 44 * Math.sin(a)} className={bgImage ? 'stroke-foreground/60' : 'stroke-muted-foreground/40'} strokeWidth="2" strokeLinecap="round" />;
      })}
      {hand(hourDeg,   22, 4, bgImage ? 'rgba(255,255,255,0.9)' : '#2D1B69')}
      {hand(minuteDeg, 30, 3, bgImage ? 'rgba(255,255,255,0.8)' : '#4C3BA7')}
      {hand(secondDeg, 33, 1.5, '#E8521A')}
      <circle cx="50" cy="50" r="3" fill="#E8521A" />
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
    { name: 'NEW YORK',  tz: 'America/New_York',  bgImage: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=200&q=80', isCenter: false },
    { name: 'LONDON',    tz: 'Europe/London',      bgImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&q=80', isCenter: false },
    { name: 'NEW DELHI', tz: 'Asia/Kolkata',       bgImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&q=80', isCenter: true  },
    { name: 'SINGAPORE', tz: 'Asia/Singapore',     bgImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=200&q=80', isCenter: false },
    { name: 'SYDNEY',    tz: 'Australia/Sydney',   bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80', isCenter: false },
  ];

  return (
    <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="mx-auto max-w-screen-xl px-6 py-5 sm:px-10 lg:px-16">
        {/* Mobile: 3-col grid, Desktop: flex row */}
        <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:justify-between md:gap-3">
          {cities.map((city) => {
            const formatter = new Intl.DateTimeFormat('en-US', {
              timeZone: city.tz,
              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
            });
            const parts = formatter.format(time).split(':');
            const [hh, mm, ss] = parts;
            const ampm = parseInt(hh, 10) >= 12 ? 'PM' : 'AM';
            const h12  = String(parseInt(hh, 10) % 12 || 12).padStart(2, '0');

            const gridPos = city.name === 'NEW YORK'  ? 'col-start-1 row-start-1'
                          : city.name === 'LONDON'    ? 'col-start-3 row-start-1'
                          : city.isCenter             ? 'col-start-2 row-start-2'
                          : city.name === 'SINGAPORE' ? 'col-start-1 row-start-3'
                          : 'col-start-3 row-start-3';

            return (
              <div
                key={city.name}
                className={`${gridPos}
                  ${city.isCenter
                    ? 'border-brand-orange/40 bg-white/10 shadow-[0_16px_34px_rgba(232,82,26,0.12)] scale-105'
                    : 'border-white/15 bg-white/5'}
                  rounded-2xl border p-2.5 backdrop-blur-sm md:min-w-[130px] md:flex-1 md:scale-100`}
              >
                <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-center md:text-left">
                  <AnalogClock hh={hh} mm={mm} ss={ss} bgImage={city.bgImage} isCenter={city.isCenter} />
                  <div className="flex flex-col">
                    <span className={`font-black uppercase tracking-[0.3em] ${city.isCenter ? 'text-[10px] md:text-[11px] text-brand-orange' : 'text-[8px] md:text-[9px] text-white/50'}`}>
                      {city.name}
                    </span>
                    <div className={`flex items-baseline gap-1 font-mono font-bold tracking-widest text-white ${city.isCenter ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
                      <span>{h12}:{mm}</span>
                      <span className={`font-semibold ${city.isCenter ? 'text-[9px] text-brand-orange' : 'text-[8px] text-white/40'}`}>{ampm}</span>
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

/* ═══════════════════════════════════════════════════════
   HERO SECTION  (parallax bg + world clock)
═══════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Background moves slower than scroll → parallax depth
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  // Text fades + lifts gently
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const heroRegions = buildDisplayRegions(destinationRegions);
  const heroCards = heroRegions.map((region) => {
    const cfg = REGION_CFG[region.key] || { img:'/dest-europe.jpg', accent:'#6D57D8', gradient:'from-violet-600 to-purple-700', tagline:'Study Destinations' };
    return { key: region.key, label: region.label, count: region.countries.length, image: cfg.img, accent: cfg.accent, gradient: cfg.gradient, tagline: cfg.tagline };
  });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* ── Parallax Background ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 origin-center will-change-transform"
      >
        <div className="absolute inset-0 scale-[1.15] bg-gradient-to-br from-[#0f0820] via-[#1a0f3a] to-[#0d1b3e]" />
        <div
          className="pointer-events-none absolute inset-0 scale-[1.15] opacity-50"
          style={{ backgroundImage:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(109,87,216,0.6), transparent)' }}
        />
      </motion.div>

      {/* ── Content ── */}
      <div className="relative mx-auto max-w-7xl px-6 pb-0 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        {/* Text block with parallax */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="mb-14 text-center will-change-transform"
        >
          <motion.div
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-md"
          >
            <Globe2 className="h-3.5 w-3.5 text-brand-orange" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Global Destinations</span>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, delay:0.08 }}
            className="text-4xl font-black leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Destinations{' '}
            <span className="bg-[linear-gradient(92deg,#a78bfa,#6D57D8_40%,#E8521A)] bg-clip-text text-transparent">
              We Cater
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
          >
            From historic European cities and premier North American campuses to vibrant Gulf hubs and emerging Asia-Pacific destinations — find your perfect study pathway below.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.24 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/collaborate"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-orange to-[#ff7b38] px-7 py-3.5 text-[12px] font-black uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(232,82,26,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(232,82,26,0.45)]"
            >
              Talk to an Expert
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/universities"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-[12px] font-semibold text-white/85 backdrop-blur-md transition-all hover:border-white/35 hover:bg-white/12 hover:text-white"
            >
              Explore Universities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Destination cards grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {heroCards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.3 + i * 0.07, duration:0.5 }}
              className="group relative overflow-hidden rounded-2xl"
              style={{ minHeight: 200 }}
            >
              <img
                src={card.image} alt={card.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                loading="eager" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
              <div className="absolute left-0 top-0 h-[3px] w-full" style={{ background: card.accent }} />
              <div className="relative flex h-full min-h-[200px] flex-col justify-end p-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/60">{card.tagline}</p>
                  <p className="mt-1 text-base font-black text-white">{card.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── World Clock Strip ── */}
      <WorldClockStrip />
    </section>
  );
}


/* ═══════════════════════════════════════════════════════
   FILTER BAR
═══════════════════════════════════════════════════════ */
function FilterBar({ query, setQuery, tab, setTab }) {
  const TABS = [
    { id:'all',                   label:'All Regions' },
    { id:'europe',                label:'Europe' },
    { id:'dubai',                 label:'UAE' },
    { id:'north-america',         label:'North America' },
    { id:'africa-south-east-asia',label:'Africa & SE Asia' },
  ];

  return (
    <div className="sticky top-16 z-30 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search countries…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-border/70 bg-muted/50 pl-10 pr-10 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50 transition-all focus:border-brand-purple/40 focus:bg-background focus:ring-2 focus:ring-brand-purple/10"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-bold tracking-wide transition-all ${
                  tab === t.id
                    ? 'bg-brand-purple text-white shadow-[0_6px_16px_rgba(45,27,105,0.25)] dark:bg-brand-purple-mid'
                    : 'border border-border/60 text-muted-foreground hover:border-brand-purple/30 hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COUNTRY CARD
═══════════════════════════════════════════════════════ */
function CountryCard({ country, regionKey }) {
  const iso = getISO(country.name);
  const img = getImg(country.name);
  const isPlaceholder = country.name === 'To Be Confirmed';
  const showFlag = regionKey !== 'dubai' && !isPlaceholder;

  return (
    <div
      className="group relative cursor-default select-none overflow-hidden rounded-xl border border-white/10 bg-muted/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-purple/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
      style={{ aspectRatio:'4/3' }}
    >
      {/* Photo background */}
      {img && !isPlaceholder ? (
        <img
          src={img} alt={country.name}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${showFlag ? 'group-hover:scale-95 group-hover:opacity-20' : 'group-hover:scale-110'}`}
          loading="lazy" decoding="async"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
          <span className="text-2xl font-black text-muted-foreground/30">{isPlaceholder ? 'TBC' : country.name.slice(0,2).toUpperCase()}</span>
        </div>
      )}

      {/* Flag (starts as a badge, expands to cover the card on hover) */}
      {showFlag && (
        <div className="absolute left-3.5 top-3.5 h-6 w-9 overflow-hidden rounded-md shadow-md ring-2 ring-white/20 z-10 transition-all duration-500 ease-in-out group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:rounded-xl group-hover:ring-0 group-hover:shadow-none">
          <img
            src={`https://flagcdn.com/w640/${iso}.png`}
            alt={country.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-20 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/35" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-3.5 z-30">
        {/* Name */}
        <div className="transform transition-transform duration-300 group-hover:translate-x-0.5">
          <p className={`font-black leading-tight drop-shadow-md text-[11px] sm:text-[13px] ${isPlaceholder ? 'text-muted-foreground/50' : 'text-white'}`}>
            {country.name}
          </p>
          {country.popularCities?.length > 0 && (
            <p className="mt-1.5 hidden items-center gap-1 text-[9px] text-white/60 sm:flex transition-colors duration-300 group-hover:text-white/80">
              <MapPin className="h-2.5 w-2.5 shrink-0 text-brand-orange" />
              {country.popularCities.slice(0, 2).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   REGION SECTION
═══════════════════════════════════════════════════════ */
function RegionSection({ region, cfg, index }) {
  const isEven = index % 2 === 0;
  const gridCols = region.countries.length <= 4
    ? 'grid-cols-2 sm:grid-cols-4'
    : region.countries.length <= 8
    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';

  return (
    <section
      className={`destinations-region-shell ${isEven ? '' : 'destinations-region-shell--alt'} py-20 sm:py-28 ${isEven ? 'bg-background/96 dark:bg-background/96' : 'bg-muted/8 dark:bg-white/[0.02]'}`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* ── Region Header ── */}
        <div className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          {/* Image */}
          <motion.div
            initial={{ opacity:0, x: isEven ? -24 : 24 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, margin:'-80px' }}
            transition={{ duration:0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={cfg.img} alt={region.label}
                className="h-full w-full object-cover"
                loading="lazy" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating benefits card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
                <p className="mb-3 text-[8px] font-black uppercase tracking-[0.4em] text-white/50">Key Advantages</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {region.keyBenefits?.map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                      <span className="text-[11px] font-semibold text-white/85">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity:0, x: isEven ? 24 : -24 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, margin:'-80px' }}
            transition={{ duration:0.6, delay:0.08 }}
            className="flex w-full flex-col gap-6 lg:w-1/2"
          >
            {/* Accent line + tagline */}
            <div className="flex items-center gap-3">
              <div className="h-[3px] w-10 rounded-full flex-shrink-0" style={{ background: cfg.accent }} />
              <span className="text-[9px] font-black uppercase tracking-[0.45em] text-muted-foreground">{cfg.tagline}</span>
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {region.label}
            </h2>

            <p className="max-w-[50ch] text-base leading-relaxed text-muted-foreground">
              {region.description}
            </p>


            <Link
              to="/collaborate"
              className="group inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-background px-6 py-3 text-[11px] font-black uppercase tracking-wider text-foreground shadow-sm transition-all hover:border-brand-orange hover:text-brand-orange"
            >
              Consult an Expert
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ── Countries Grid ── */}
        <div className="mt-16">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-[3px] w-6 rounded-full" style={{ background: cfg.accent }} />
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-foreground/70">
                {region.countryGroups?.length > 0 ? `${region.label} Countries` : `Destinations in ${region.label}`}
              </p>
            </div>

          </div>

          {region.countryGroups?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {region.countryGroups.map((g) => (
                <span
                  key={g.key}
                  className="rounded-full border border-border/60 bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground"
                >
                  {g.label}
                </span>
              ))}
            </div>
          )}

          <div className={`grid gap-3 sm:gap-4 ${gridCols}`}>
            {region.countries.map((c) => (
              <CountryCard key={c.name} country={c} regionKey={region.key} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SCHENGEN EXPLAINER
═══════════════════════════════════════════════════════ */
function SchengenSection() {
  const cards = [
    {
      id:'schengen', kicker:'Schengen Zone',
      title:'Travel Freely Across 29 Countries',
      accent:'#6D57D8',
      body:'One student visa lets you live, study, and travel across the Schengen area — covering most of continental Europe with a single application process.',
      points:['Borderless travel within the zone','Shared VFS Global application','Wider campus network'],
    },
    {
      id:'non-schengen', kicker:'Non-Schengen Routes',
      title:'Country-Specific Study Pathways',
      accent:'#E8521A',
      body:'UK, Ireland, Cyprus, and other non-Schengen countries each have their own robust visa and post-study pathways — many offering strong English-taught programs.',
      points:['Individual visa per country','Strong post-study work rights','English-medium programs'],
    },
  ];

  return (
    <section className="bg-[linear-gradient(135deg,rgba(45,27,105,0.06),rgba(232,82,26,0.04))] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Europe</span>
          </div>
          <h2 className="text-3xl font-black leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Schengen{' '}
            <span className="bg-[linear-gradient(92deg,#2D1B69,#E8521A)] bg-clip-text text-transparent">
              vs Non-Schengen
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Europe's two visa systems explained in plain terms so you can pick the right route.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-80px' }}
              transition={{ duration:0.5, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-background p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
            >
              <div className="absolute left-0 top-0 h-1 w-full" style={{ background:`linear-gradient(90deg, ${c.accent}, transparent)` }} />
              <span className="inline-block rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-white mb-5" style={{ background: c.accent }}>
                {c.kicker}
              </span>
              <h3 className="text-2xl font-black leading-snug text-foreground sm:text-3xl">{c.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{c.body}</p>
              <ul className="mt-6 space-y-3 border-t border-border/40 pt-5">
                {c.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: c.accent }} />
                    <span className="text-sm font-medium text-foreground/80">{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FINAL CTA
═══════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0820] via-[#1a0f3a] to-[#0d1b3e] py-28 sm:py-36">
      {/* Dot texture */}
      <div className="pointer-events-none absolute inset-0 opacity-25 text-white/30">
        <DotGrid id="cta" />
      </div>
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-purple/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand-orange/15 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6 }}
        >
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">
            Start Your Journey
          </p>
          <h2 className="text-4xl font-black leading-tight tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect<br />
            <span className="bg-[linear-gradient(92deg,#a78bfa,#6D57D8)] bg-clip-text text-transparent">
              Destination
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50">
            Our expert counsellors help you choose the right country, university, and programme — tailored exactly to your goals and budget.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/collaborate"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-orange to-[#ff7b38] px-9 py-5 text-[13px] font-black text-white shadow-[0_12px_36px_rgba(232,82,26,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(232,82,26,0.45)]"
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
            <Link
              to="/universities"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-9 py-5 text-[13px] font-semibold text-white/80 transition-all hover:border-white/40 hover:text-white"
            >
              Browse Universities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => { window.scrollTo({ top:0, behavior:'instant' }); }, []);

  const filteredRegions = useMemo(() => {
    const baseDisplayRegions = buildDisplayRegions(destinationRegions);

    return baseDisplayRegions
      .map(r => {
        let filteredCountries = r.countries;

        if (deferredSearchQuery) {
          const queryLower = deferredSearchQuery.toLowerCase().trim();
          filteredCountries = r.countries.filter(c => {
            if (c.name.toLowerCase().includes(queryLower)) return true;
            if (r.key === 'dubai' && (queryLower === 'uae' || queryLower === 'united arab emirates' || queryLower === 'gulf')) {
              return c.name !== 'To Be Confirmed';
            }
            if (c.popularCities?.some(city => city.toLowerCase().includes(queryLower))) return true;
            return false;
          });
        }

        return {
          ...r,
          countries: filteredCountries
        };
      })
      .filter(r => {
        if (deferredSearchQuery && r.countries.length === 0) return false;
        if (selectedTab !== 'all' && r.key !== selectedTab) return false;
        return true;
      });
  }, [selectedTab, deferredSearchQuery]);

  return (
    <div className="destinations-page-gradient min-h-screen bg-background text-foreground">
      <Seo
        title="Destinations We Cater | The Global Avenues"
        description="Explore study abroad destinations across North America, Europe, Asia Pacific, and Middle East & Africa with The Global Avenues."
        path="/destinations"
        keywords={['study abroad','destinations','schengen','study in europe','study in usa','study in canada','overseas education']}
      />

      {/* Page top offset for fixed header */}
      <div className="pt-16">
        <HeroSection />

        <FilterBar
          query={searchQuery} setQuery={setSearchQuery}
          tab={selectedTab} setTab={setSelectedTab}
        />

        <AnimatePresence mode="wait">
          {filteredRegions.length > 0 ? (
            filteredRegions.map((region, i) => (
              <LazySection
                key={region.key}
                rootMargin="1200px"
                preloadOnIdle
                idleDelay={0}
                fallback={
                  <SectionSkeleton
                    height="h-[900px]"
                    cards={6} rows={4}
                    className="my-0 px-4 sm:px-6 lg:px-16"
                  />
                }
              >
                <RegionSection
                  region={region}
                  cfg={REGION_CFG[region.key] || { img:'/dest-europe.jpg', tagline:'Study Destinations', accent:'#6D57D8' }}
                  index={i}
                  isLast={i === filteredRegions.length - 1}
                />
              </LazySection>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mt-5 text-xl font-black text-foreground">No results for "{searchQuery}"</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try a different country name or reset the filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTab('all'); }}
                className="mt-7 rounded-full bg-brand-orange px-7 py-3 text-xs font-black text-white shadow-[0_8px_24px_rgba(232,82,26,0.3)] transition-all hover:-translate-y-0.5"
              >
                Reset Filters
              </button>
            </div>
          )}
        </AnimatePresence>

        <LazySection
          rootMargin="1200px" preloadOnIdle idleDelay={0}
          fallback={<SectionSkeleton height="h-[520px]" cards={2} rows={3} className="my-0" />}
        >
          <SchengenSection />
        </LazySection>

        <LazySection
          rootMargin="1200px" preloadOnIdle idleDelay={0}
          fallback={<SectionSkeleton height="h-[400px]" cards={2} rows={2} className="my-0" />}
        >
          <FinalCTA />
        </LazySection>
      </div>
    </div>
  );
}
