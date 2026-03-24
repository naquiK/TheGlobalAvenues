import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Trophy,
  Star,
  Globe,
  ChevronRight,
  Mail,
  ExternalLink,
  CalendarDays,
  Clock3,
  FileText,
  Flame,
  Rocket,
} from 'lucide-react';
import { getPortfolioById, getPortfolios } from '../services/portfolioService';
import { getUniversityDetail } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';
import BackNavButton from '../components/ui/BackNavButton';

const MJM_SUMMER_SCHOOL_HIGHLIGHT = {
  city: 'Rennes, France',
  description:
    'These summer opportunities allow students to study in France, gain practical skills, experience life in Rennes, and discover our learning environment.',
  aiBusiness: {
    title: 'AI Business Summer School',
    fee: 'Between EUR 1,250 and EUR 3,500',
    deadline: 'April 10, 2026',
  },
  tracks: [
    {
      title: 'Digital Marketing and Branding',
      dates: 'June 1 - June 12, 2026',
      fee: 'EUR 1,640',
      deadline: 'April 30, 2026',
    },
    {
      title: 'Sustainable Business',
      dates: 'June 23 - July 3, 2026',
      fee: 'EUR 1,640',
      deadline: 'April 30, 2026',
    },
    {
      title: 'Cross-Cultural Management',
      dates: 'July 20 - July 29, 2026',
      fee: 'EUR 1,640',
      deadline: 'April 30, 2026',
    },
  ],
};
const MJM_TRACK_CARD_THEME_CLASSES = [
  'border-[#D9D0F7] bg-[linear-gradient(145deg,rgba(255,243,236,0.95)_0%,rgba(247,242,255,0.96)_52%,rgba(236,245,255,0.95)_100%)] dark:border-[#4D3E82] dark:bg-[linear-gradient(145deg,rgba(29,23,56,0.82)_0%,rgba(25,20,48,0.88)_52%,rgba(22,25,44,0.84)_100%)]',
  'border-[#D3E0FF] bg-[linear-gradient(145deg,rgba(239,249,255,0.95)_0%,rgba(247,242,255,0.95)_56%,rgba(255,242,226,0.94)_100%)] dark:border-[#42557F] dark:bg-[linear-gradient(145deg,rgba(20,33,46,0.78)_0%,rgba(28,22,56,0.86)_55%,rgba(40,27,30,0.74)_100%)]',
  'border-[#F2D4DC] bg-[linear-gradient(145deg,rgba(255,240,244,0.94)_0%,rgba(243,243,255,0.96)_52%,rgba(255,246,225,0.95)_100%)] dark:border-[#5A4574] dark:bg-[linear-gradient(145deg,rgba(39,23,44,0.76)_0%,rgba(28,24,58,0.86)_55%,rgba(44,29,24,0.74)_100%)]',
];

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mjmSpotlightRef = useRef(null);
  const mjmConfettiFiredInViewRef = useRef(false);

  const mapUniversityToPortfolio = (data) => {
    if (!data || !data.university) return null;
    const university = data.university;
    const specializations = (data.specializations || [])
      .map((item) => item.title)
      .filter(Boolean);
    const highlights = (data.benefits || [])
      .map((item) => item.title)
      .filter(Boolean);
    const programs = data.programs || [];
    const experiences = (data.experiences || []).map((item) => ({
      name: item.student_name,
      program: item.program,
      quote: item.review,
      location: university.city || university.country,
      rating: Number(item.rating) || 5,
      photo: item.photo ? resolveMediaUrl(item.photo) : '',
    }));

    const mappedDetails = {
      location: [university.city, university.country].filter(Boolean).join(', '),
    };

    if (specializations.length > 0) {
      mappedDetails.specializations = specializations;
    }

    if (programs.length > 0) {
      mappedDetails.programs = programs;
    }

    if (experiences.length > 0) {
      mappedDetails.studentTestimonials = experiences;
    }

    const mapped = {
      id: university.id,
      slug: university.slug,
      title: university.name,
      country: university.country,
      image: resolveMediaUrl(university.logo),
      logo: resolveMediaUrl(university.logo),
      contact: university.email || university.contact_email || '',
      website: university.website || university.link || '',
      description: university.description,
      programs: programs.length || undefined,
      details: mappedDetails,
    };

    if (highlights.length > 0) {
      mapped.highlights = highlights;
    }

    return mapped;
  };

  const mergePortfolioData = (base, override) => {
    if (!base) return override;
    if (!override) return base;
    return {
      ...base,
      ...override,
      image: override.image || base.image,
      logo: override.logo || base.logo,
      highlights: override.highlights && override.highlights.length > 0 ? override.highlights : base.highlights,
      details: {
        ...(base.details || {}),
        ...(override.details || {}),
      },
    };
  };

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const localData = await getPortfolioById(id);
        const detailSlug = localData?.slug || id;
        let apiPortfolio = null;

        try {
          const apiData = await getUniversityDetail(detailSlug, { signal: controller.signal });
          apiPortfolio = mapUniversityToPortfolio(apiData);
        } catch (error) {
          if (error.name !== 'AbortError') {
            apiPortfolio = null;
          }
        }

        const merged = mergePortfolioData(localData, apiPortfolio);

        if (isActive) {
          setPortfolio(merged || apiPortfolio || localData);
          const all = await getPortfolios();
          setAllPortfolios(all.data || all);
        }
      } catch (error) {
        if (isActive) {
          console.error('Error loading portfolio:', error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [id]);

  const normalizedSlug = String(portfolio?.slug || '').toLowerCase();
  const normalizedTitle = String(portfolio?.title || '').toLowerCase();
  const isMjmGraphicDesignProfile =
    normalizedSlug === 'mjm-graphic-design' || normalizedTitle.includes('mjm graphic design');

  useEffect(() => {
    const section = mjmSpotlightRef.current;
    if (!isMjmGraphicDesignProfile || !section || typeof window === 'undefined') return undefined;

    const fireMjmPopper = () => {
      confetti({
        angle: 55,
        spread: 80,
        particleCount: 120,
        startVelocity: 45,
        gravity: 1.2,
        ticks: 280,
        origin: { x: 0.0, y: 1.0 },
        colors: ['#FFD700', '#FF69B4', '#00FFFF', '#ADFF2F', '#FF6347', '#ffffff'],
        disableForReducedMotion: true,
      });

      window.setTimeout(() => {
        confetti({
          angle: 125,
          spread: 80,
          particleCount: 120,
          startVelocity: 45,
          gravity: 1.2,
          ticks: 280,
          origin: { x: 1.0, y: 1.0 },
          colors: ['#FFD700', '#FF69B4', '#00FFFF', '#ADFF2F', '#FF6347', '#ffffff'],
          disableForReducedMotion: true,
        });
      }, 150);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (mjmConfettiFiredInViewRef.current) return;
            mjmConfettiFiredInViewRef.current = true;
            fireMjmPopper();
            return;
          }

          mjmConfettiFiredInViewRef.current = false;
        });
      },
      { threshold: 0.25, rootMargin: '0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isMjmGraphicDesignProfile]);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
        <BackNavButton label="Back to Portfolio" onClick={() => navigate('/portfolio')} />
      </div>
    );
  }

  // Get related portfolios
  const relatedPortfolios = allPortfolios
    .filter(p => p.id !== portfolio.id && p.category === portfolio.category)
    .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Back Button */}
      <motion.div
        className="sticky top-16 z-40 border-b border-border/70 bg-background/70 px-4 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 sm:px-6 lg:px-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <BackNavButton label="Back to Portfolio" onClick={() => navigate('/portfolio')} />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Image Section */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 h-96 sm:h-[500px]">
              <motion.img
                src={portfolio.image}
                alt={portfolio.partnerName || portfolio.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />

              {portfolio.logo && (
                <motion.div
                  className="absolute top-6 right-6 rounded-xl border border-white/35 bg-white/95 p-2 shadow-lg"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                >
                  <img
                    src={portfolio.logo}
                    alt={`${portfolio.title} logo`}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-auto max-w-[8.5rem] object-contain"
                  />
                </motion.div>
              )}

              {/* Achievement Badge */}
              {portfolio.achievement && (
                <motion.div
                  className="absolute top-6 left-6 px-4 py-2 bg-primary/95 text-primary-foreground rounded-lg font-bold"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {portfolio.achievement}
                </motion.div>
              )}

              {/* Country Badge */}
              <motion.div
                className="absolute bottom-6 right-6 px-4 py-2 bg-accent/95 text-accent-foreground rounded-lg font-bold flex items-center gap-2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MapPin className="w-4 h-4" />
                {portfolio.country}
              </motion.div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="space-y-4"
            variants={itemVariants}
          >
            {/* University Title */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/30 rounded-xl p-6">
              <p className="text-muted-foreground text-sm font-medium mb-2">Institution</p>
              <h1 className="text-3xl font-bold text-foreground mb-2">{portfolio.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>{portfolio.country}</span>
              </div>
            </div>

            {(portfolio.website || portfolio.contact) && (
              <motion.div
                className="bg-muted/40 border border-border/50 rounded-xl p-4 space-y-3"
                whileHover={{ translateY: -2 }}
              >
                {portfolio.contact && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${portfolio.contact}`} className="text-primary hover:underline">
                      {portfolio.contact}
                    </a>
                  </div>
                )}
                {portfolio.website && (
                  <a
                    href={portfolio.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary transition-colors"
                  >
                    Visit Official Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            )}

            {/* Location & Ranking */}
            <motion.div
              className="bg-muted/40 border border-border/50 rounded-xl p-6"
              whileHover={{ translateY: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <p className="text-muted-foreground text-sm font-medium">Location</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{portfolio.details?.location}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-secondary" />
                    <p className="text-muted-foreground text-sm font-medium">Ranking</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{portfolio.details?.ranking}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Description Section */}
        <motion.div
          className="bg-muted/20 border border-border/50 rounded-2xl p-8 mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">About This University</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {portfolio.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
            <div>
              <h4 className="font-bold text-foreground mb-2">Specializations</h4>
              <ul className="space-y-2">
                {portfolio.details?.specializations?.map((spec) => (
                  <li key={spec} className="text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">Program Information</h4>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="font-semibold">Average Tuition:</span> {portfolio.details?.avgTuition}</p>
                <p><span className="font-semibold">Scholarships:</span> {portfolio.details?.scholarshipAvailable ? 'Available' : 'Not Available'}</p>
                {portfolio.details?.intakeWindows && (
                  <p className="flex items-start gap-2">
                    <CalendarDays className="w-4 h-4 mt-0.5 text-primary" />
                    <span><span className="font-semibold">Intakes:</span> {portfolio.details.intakeWindows}</span>
                  </p>
                )}
                {portfolio.details?.programDuration && (
                  <p className="flex items-start gap-2">
                    <Clock3 className="w-4 h-4 mt-0.5 text-primary" />
                    <span><span className="font-semibold">Typical Duration:</span> {portfolio.details.programDuration}</span>
                  </p>
                )}
                {Array.isArray(portfolio.details?.campusLocations) &&
                  portfolio.details.campusLocations.length > 0 && (
                    <p>
                      <span className="font-semibold">Campus:</span>{' '}
                      {portfolio.details.campusLocations.join(', ')}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </motion.div>

        {isMjmGraphicDesignProfile && (
          <motion.div
            ref={mjmSpotlightRef}
            className="relative mb-16 overflow-hidden rounded-3xl border border-[#D5C9F1] bg-[linear-gradient(118deg,#FFF5EE_0%,#F7F0FF_36%,#EAF3FF_72%,#FFF1D9_100%)] p-6 shadow-[0_30px_74px_rgba(16,12,40,0.18)] dark:border-[#352B62] dark:bg-[linear-gradient(118deg,#1B1731_0%,#17142B_38%,#152131_70%,#211A29_100%)] sm:p-8"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-primary/20 blur-3xl dark:bg-primary/18" />
            <div className="pointer-events-none absolute -left-24 top-24 h-52 w-52 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-400/10" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-accent/25 blur-3xl dark:bg-accent/14" />

            <div className="relative z-10">
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB088]/50 bg-[linear-gradient(92deg,rgba(255,226,210,0.95)_0%,rgba(255,244,204,0.94)_100%)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_8px_20px_rgba(217,91,35,0.16)] dark:border-[#F57C46]/35 dark:bg-[linear-gradient(92deg,rgba(51,26,20,0.8)_0%,rgba(66,43,20,0.74)_100%)]">
                  <Flame className="h-3.5 w-3.5 text-[#E74C1A] dark:text-[#FFC4A2]" />
                  <span className="summer-school-new-blink">New</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:border-white/25 dark:bg-white/10 dark:text-white">
                  <Rocket className="h-3.5 w-3.5" />
                  Live Cohort 2026
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  Summer School Spotlight
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    MJM Graphic Design
                  </p>
                  <h3 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                    SUMMER SCHOOL | {MJM_SUMMER_SCHOOL_HIGHLIGHT.city}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {MJM_SUMMER_SCHOOL_HIGHLIGHT.description}
                  </p>

                  <div className="mt-6 rounded-2xl border border-[#D8CDEE] bg-[linear-gradient(145deg,rgba(255,255,255,0.82)_0%,rgba(247,243,255,0.88)_54%,rgba(255,236,224,0.82)_100%)] p-5 shadow-[0_14px_34px_rgba(25,18,53,0.08)] dark:border-[#443A6E] dark:bg-[linear-gradient(145deg,rgba(28,22,52,0.84)_0%,rgba(18,15,37,0.9)_54%,rgba(30,23,42,0.82)_100%)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Featured Program
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold text-foreground">
                      {MJM_SUMMER_SCHOOL_HIGHLIGHT.aiBusiness.title}
                    </h4>
                    <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2.5">
                        <span className="font-semibold text-foreground">Course Fees:</span>
                        <span>{MJM_SUMMER_SCHOOL_HIGHLIGHT.aiBusiness.fee}</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="font-semibold text-foreground">Deadline to Apply:</span>
                        <span>{MJM_SUMMER_SCHOOL_HIGHLIGHT.aiBusiness.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {MJM_SUMMER_SCHOOL_HIGHLIGHT.tracks.map((track, index) => (
                    <article
                      key={track.title}
                      className={`rounded-2xl border p-4 shadow-[0_14px_30px_rgba(16,12,40,0.1)] backdrop-blur-sm dark:shadow-[0_16px_34px_rgba(6,5,14,0.42)] ${MJM_TRACK_CARD_THEME_CLASSES[index % MJM_TRACK_CARD_THEME_CLASSES.length]}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Track</p>
                      <h4 className="mt-1 text-lg font-semibold leading-tight text-foreground">{track.title}</h4>
                      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                        <p>
                          <span className="font-semibold text-foreground">Dates:</span> {track.dates}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Course Fee:</span> {track.fee}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Deadline:</span> {track.deadline}
                        </p>
                      </div>
                    </article>
                  ))}

                  <div className="pt-1">
                    <motion.button
                      className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_52%,#E8521A_100%)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(45,27,105,0.3)]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/collaborate')}
                      type="button"
                    >
                      Enquire About Summer School
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {Array.isArray(portfolio.details?.documentsRequired) &&
          portfolio.details.documentsRequired.length > 0 && (
            <motion.div
              className="bg-muted/20 border border-border/50 rounded-2xl p-8 mb-16"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Admission Documents Snapshot
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {portfolio.details.documentsRequired.map((doc) => (
                  <div
                    key={doc}
                    className="rounded-lg border border-border/50 bg-background/70 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {doc}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        {/* Highlights Section */}
        {portfolio.highlights && portfolio.highlights.length > 0 && (
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">Why Choose {portfolio.title}?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ translateY: -4 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-foreground font-medium">{highlight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Specializations Tags */}
        <motion.div
          className="mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Specializations</h3>
          <div className="flex flex-wrap gap-3">
            {portfolio.details?.specializations?.map((spec, index) => (
              <motion.div
                key={spec}
                className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {spec}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        {portfolio.details?.studentTestimonials && portfolio.details.studentTestimonials.length > 0 && (
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">Partner Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.details.studentTestimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-background to-muted/20 border border-border/50 rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ translateY: -4 }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({
                        length: Math.min(5, Math.max(1, Number(testimonial.rating) || 5)),
                      }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    
                    <p className="text-foreground italic mb-4">"{testimonial.quote}"</p>
                    
                    <div className="border-t border-border/30 pt-4">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.program}</p>
                      <p className="text-xs text-muted-foreground">From {testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 mb-16 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Partner with {portfolio.title}?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Partner with us to strengthen your visibility and recruitment outcomes for institutions like {portfolio.title} across key markets.
          </p>
          <motion.button
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/collaborate')}
            type="button"
          >
            Connect with Our Advisors
          </motion.button>
        </motion.div>

        {/* Related Portfolios */}
        {relatedPortfolios.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-3xl font-bold text-foreground mb-8">Other Universities in {portfolio.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPortfolios.map((related, index) => (
                <motion.div
                  key={related.id}
                  className="bg-muted/30 border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
                  variants={itemVariants}
                  whileHover={{ translateY: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={related.image}
                      alt={related.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-foreground mb-2">{related.title}</h4>
                    <p className="text-primary font-semibold text-sm mb-1">{related.country}</p>
                    <p className="text-muted-foreground text-sm mb-4">{related.description}</p>
                    <Link
                      to={`/portfolio/${related.slug || related.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-secondary text-sm font-semibold group/link"
                    >
                      View University
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
