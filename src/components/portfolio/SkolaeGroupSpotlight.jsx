import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Building2,
  ChevronRight,
  Clapperboard,
  Globe,
  GraduationCap,
  Languages,
  Mail,
  Newspaper,
  Phone,
  Plane,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { SITE_CONFIG } from '../../config';
import {
  skolaeGroup,
  skolaeHighlights,
  skolaeOtherSchools,
  skolaePathways,
  skolaeSchools,
} from '../../data/skolaeGroupData';

const OTHER_SCHOOL_GROUP_ICONS = {
  business: Briefcase,
  media: Newspaper,
  film: Clapperboard,
};

const otherSchoolCount = skolaeOtherSchools.reduce((total, group) => total + group.schools.length, 0);

const HIGHLIGHT_ICONS = {
  global: Plane,
  'design-project': Sparkles,
};

const formatNumber = (value) => Math.round(value).toLocaleString('en-US');

function CountUpStat({ value, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return undefined;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(display)}
      {suffix}
    </span>
  );
}

function SchoolLogoChip({ src, alt, className = '' }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl border border-[#1A1033]/10 bg-white shadow-[0_8px_20px_rgba(16,24,40,0.1)] ${className}`}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="max-h-full w-auto max-w-full object-contain" />
    </span>
  );
}

function SpotlightTile({ children, className = '', ...props }) {
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <button
      type="button"
      onPointerMove={handlePointerMove}
      className={`group/tile relative overflow-hidden text-left ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
        style={{
          background:
            'radial-gradient(180px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(232, 82, 26, 0.16), transparent 70%)',
        }}
      />
      {children}
    </button>
  );
}

export default function SkolaeGroupSpotlight() {
  const [activeKey, setActiveKey] = useState(skolaeSchools[0].key);
  const explorerRef = useRef(null);
  const tabRefs = useRef({});
  const prefersReducedMotion = useReducedMotion();
  const activeSchool = skolaeSchools.find((school) => school.key === activeKey) || skolaeSchools[0];
  const marqueeLogos = skolaeSchools.flatMap((school) => [
    { src: school.logo, alt: `${school.name} logo` },
    ...(school.secondaryLogo ? [{ src: school.secondaryLogo, alt: 'EFET Photo logo' }] : []),
  ]);
  const phone = SITE_CONFIG.contact.phone?.[0];

  const selectSchool = (key, { scroll = false, focus = false } = {}) => {
    setActiveKey(key);
    if (focus) tabRefs.current[key]?.focus();
    if (scroll) {
      explorerRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const handleTabKeyDown = (event, index) => {
    const lastIndex = skolaeSchools.length - 1;
    const moves = {
      ArrowDown: index === lastIndex ? 0 : index + 1,
      ArrowRight: index === lastIndex ? 0 : index + 1,
      ArrowUp: index === 0 ? lastIndex : index - 1,
      ArrowLeft: index === 0 ? lastIndex : index - 1,
      Home: 0,
      End: lastIndex,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    selectSchool(skolaeSchools[moves[event.key]].key, { focus: true });
  };

  return (
    <motion.section
      aria-labelledby="skolae-spotlight-heading"
      className="mb-16 overflow-hidden rounded-[2rem] border border-[#E4DDF5] bg-[#FBFAFF] shadow-[0_30px_80px_rgba(26,16,51,0.14)] dark:border-white/10 dark:bg-[#110D1F]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero band */}
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0D0A1A_0%,#1A1033_48%,#2D1B69_100%)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(120deg,black_10%,transparent_75%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#E8521A]/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#5340B0]/40 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm">
                <BadgeCheck className="h-3.5 w-3.5 text-[#F57C46]" />
                Group Partner
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                <GraduationCap className="h-3.5 w-3.5" />
                Study in France
              </span>
            </div>

            <img
              src={skolaeGroup.logoWhite}
              alt="SKOLAE logo"
              width="240"
              height="68"
              className="mt-6 h-10 w-auto sm:h-12"
            />

            <h3
              id="skolae-spotlight-heading"
              className="mt-5 max-w-xl font-heading text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]"
            >
              One network.{' '}
              <span className="bg-[linear-gradient(95deg,#F57C46_0%,#E8521A_45%,#C9BFFF_100%)] bg-clip-text text-transparent">
                Specialised French schools.
              </span>
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{skolaeGroup.description}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => selectSchool(activeKey, { scroll: true })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8521A] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F57C46]"
              >
                Explore the schools
                <ChevronRight className="h-4 w-4" />
              </button>
              <Link
                to="/collaborate"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Talk to our team
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {skolaeGroup.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur-sm ${
                  index === 0
                    ? 'col-span-2 row-span-2 flex flex-col justify-end bg-[linear-gradient(150deg,rgba(232,82,26,0.32)_0%,rgba(255,255,255,0.06)_70%)] sm:col-span-2 sm:p-6'
                    : ''
                } ${index === skolaeGroup.stats.length - 1 ? 'sm:col-span-2' : ''}`}
              >
                <dd
                  className={`font-heading font-bold leading-none ${
                    index === 0 ? 'text-5xl sm:text-6xl' : 'text-2xl sm:text-3xl'
                  }`}
                >
                  <CountUpStat value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className={`mt-2 text-white/70 ${index === 0 ? 'text-sm' : 'text-xs'}`}>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Official logo marquee */}
      <div className="border-b border-[#E4DDF5] bg-white/70 py-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max gap-4 hover:[animation-play-state:paused] motion-safe:animate-[skolaeMarquee_32s_linear_infinite]">
            {[...marqueeLogos, ...marqueeLogos].map((logo, index) => (
              <SchoolLogoChip
                key={`${logo.src}-${index}`}
                src={logo.src}
                alt={index < marqueeLogos.length ? logo.alt : ''}
                className="h-14 w-36 flex-shrink-0 px-4 py-2.5"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-12 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        {/* School explorer */}
        <div ref={explorerRef} className="scroll-mt-36">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8521A]">01 · School explorer</p>
              <h4 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Featured schools &amp; programmes
              </h4>
            </div>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#E8521A]" />
                In-demand field
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Languages className="h-3.5 w-3.5 text-[#5340B0] dark:text-[#A899E8]" />
                Taught in English
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)]">
            <div
              role="tablist"
              aria-label="SKOLAE schools"
              aria-orientation="vertical"
              className="-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-2 sm:scroll-px-8 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {skolaeSchools.map((school, index) => {
                const isActive = school.key === activeKey;
                return (
                  <button
                    key={school.key}
                    ref={(node) => {
                      tabRefs.current[school.key] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`skolae-tab-${school.key}`}
                    aria-selected={isActive}
                    aria-controls="skolae-school-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectSchool(school.key)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={`relative flex min-w-[15.5rem] snap-start items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8521A]/60 lg:min-w-0 ${
                      isActive
                        ? 'border-transparent'
                        : 'border-[#E4DDF5] bg-white/60 hover:border-[#5340B0]/30 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="skolae-active-tab"
                        className="absolute inset-0 rounded-2xl border border-[#5340B0]/25 bg-white shadow-[0_14px_30px_rgba(45,27,105,0.14)] dark:border-white/20 dark:bg-white/[0.09]"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      >
                        <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#E8521A]" />
                      </motion.span>
                    )}
                    <span
                      className={`relative w-6 flex-shrink-0 font-heading text-sm font-bold tabular-nums ${
                        isActive ? 'text-[#E8521A]' : 'text-muted-foreground'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <SchoolLogoChip src={school.logo} alt="" className="relative h-11 w-16 flex-shrink-0 p-1.5" />
                    <span className="relative min-w-0">
                      <span className="block truncate text-sm font-bold text-foreground">{school.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{school.focus}</span>
                    </span>
                  </button>
                );
              })}
              <div className="mt-auto hidden rounded-2xl border border-dashed border-[#5340B0]/30 bg-[#F5F3FF]/70 p-4 dark:border-white/15 dark:bg-white/[0.03] lg:block">
                <p className="text-sm font-semibold text-foreground">Not sure which school fits?</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Share your marks and career goals with our team and we&apos;ll help you shortlist the right SKOLAE programme.
                </p>
                <Link
                  to="/collaborate"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#E8521A] hover:text-[#2D1B69] dark:hover:text-white"
                >
                  Talk to our team
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div
              id="skolae-school-panel"
              role="tabpanel"
              aria-labelledby={`skolae-tab-${activeSchool.key}`}
              className="min-w-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={activeSchool.key}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="overflow-hidden rounded-3xl border border-[#E4DDF5] bg-white shadow-[0_20px_50px_rgba(26,16,51,0.1)] dark:border-white/10 dark:bg-[#17122A]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-[16/8]">
                    <img
                      src={activeSchool.cover}
                      alt={activeSchool.coverAlt}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,10,26,0.45)_0%,rgba(13,10,26,0)_35%,rgba(13,10,26,0.85)_100%)]" />
                    <div className="absolute left-4 right-4 top-4 hidden flex-wrap gap-1.5 sm:flex">
                      {activeSchool.facts.map((fact) => (
                        <span
                          key={fact}
                          className="rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md"
                        >
                          {fact}
                        </span>
                      ))}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                      <SchoolLogoChip
                        src={activeSchool.logo}
                        alt={`${activeSchool.name} logo`}
                        className="h-14 w-24 flex-shrink-0 p-2 sm:h-16 sm:w-28"
                      />
                      {activeSchool.secondaryLogo && (
                        <SchoolLogoChip
                          src={activeSchool.secondaryLogo}
                          alt="EFET Photo logo"
                          className="h-14 w-24 flex-shrink-0 p-2 sm:h-16 sm:w-28"
                        />
                      )}
                      <div className="min-w-0 pb-0.5 text-white">
                        <p className="truncate font-heading text-xl font-bold sm:text-2xl">{activeSchool.name}</p>
                        <p className="truncate text-xs text-white/80 sm:text-sm">{activeSchool.fullName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex flex-wrap gap-1.5 sm:hidden">
                      {activeSchool.facts.map((fact) => (
                        <span
                          key={fact}
                          className="rounded-full bg-[#F5F3FF] px-2.5 py-1 text-[11px] font-semibold text-[#2D1B69] dark:bg-white/10 dark:text-white/85"
                        >
                          {fact}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{activeSchool.summary}</p>

                    <ol className="mt-5 divide-y divide-[#EEE9FA] rounded-2xl border border-[#EEE9FA] dark:divide-white/10 dark:border-white/10">
                      {activeSchool.programs.map((program, index) => (
                        <li key={program.title} className="flex items-start gap-3 px-4 py-3">
                          <span className="mt-0.5 w-6 flex-shrink-0 font-heading text-xs font-bold tabular-nums text-[#5340B0] dark:text-[#A899E8]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-snug text-foreground">{program.title}</p>
                            {program.officialName && (
                              <p className="mt-0.5 text-xs italic text-muted-foreground">{program.officialName}</p>
                            )}
                            <p className="mt-0.5 text-xs text-muted-foreground">{program.level}</p>
                          </div>
                          <span className="flex flex-shrink-0 items-center gap-1.5 pt-0.5">
                            {program.inDemand && (
                              <TrendingUp className="h-4 w-4 text-[#E8521A]" aria-label="In-demand field" />
                            )}
                            {program.english && (
                              <Languages
                                className="h-4 w-4 text-[#5340B0] dark:text-[#A899E8]"
                                aria-label="Taught in English"
                              />
                            )}
                          </span>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                      <a
                        href={activeSchool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2D1B69] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5340B0]"
                      >
                        Official website
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                      <Link
                        to="/collaborate"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2D1B69]/20 px-4 py-2.5 text-sm font-semibold text-[#2D1B69] transition-colors hover:border-[#E8521A]/50 hover:text-[#E8521A] dark:border-white/20 dark:text-white"
                      >
                        Ask us about {activeSchool.name}
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-[#E4DDF5] bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  Also in the SKOLAE network
                </p>
                <h5 className="mt-1 font-heading text-xl font-bold text-foreground">
                  {otherSchoolCount} more specialised schools
                </h5>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-right">
                Many run as work-study (alternance) programmes. Ask us whether one suits your plans before applying.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
              {skolaeOtherSchools.map((group) => {
                const GroupIcon = OTHER_SCHOOL_GROUP_ICONS[group.key] || Building2;
                return (
                  <section key={group.key} aria-label={group.title}>
                    <h6 className="flex items-center gap-2 border-b border-[#E4DDF5] pb-2.5 text-sm font-semibold text-foreground dark:border-white/10">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEF0E7] text-[#E8521A] dark:bg-[#E8521A]/15">
                        <GroupIcon className="h-3.5 w-3.5" />
                      </span>
                      {group.title}
                    </h6>
                    <ul>
                      {group.schools.map((school) => (
                        <li key={school.name}>
                          <a
                            href={school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/school flex items-center justify-between gap-3 border-b border-[#F0ECFA] py-2.5 last:border-b-0 dark:border-white/[0.06]"
                          >
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-foreground transition-colors group-hover/school:text-[#E8521A]">
                                {school.name}
                              </span>
                              <span className="block text-xs text-muted-foreground">{school.focus}</span>
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4 flex-shrink-0 text-muted-foreground/50 transition-all group-hover/school:-translate-y-0.5 group-hover/school:translate-x-0.5 group-hover/school:text-[#E8521A]"
                              aria-hidden="true"
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pathways + highlights */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8521A]">02 · Career pathways</p>
            <h4 className="mt-1 font-heading text-2xl font-bold text-foreground">Fields in demand</h4>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {skolaePathways.map((pathway) => {
                const school = skolaeSchools.find((item) => item.key === pathway.schoolKey);
                return (
                  <SpotlightTile
                    key={pathway.field}
                    onClick={() => selectSchool(pathway.schoolKey, { scroll: true })}
                    aria-label={`${pathway.field}: view ${school?.name} programmes`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#E4DDF5] bg-white px-4 py-3.5 transition-colors hover:border-[#E8521A]/35 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <span className="relative text-sm font-semibold text-foreground">{pathway.field}</span>
                    <span className="relative inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#F5F3FF] px-2.5 py-1 text-[11px] font-bold text-[#2D1B69] transition-colors group-hover/tile:bg-[#2D1B69] group-hover/tile:text-white dark:bg-white/10 dark:text-white">
                      {school?.shortName}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </SpotlightTile>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:pt-12">
            {skolaeHighlights.map((highlight) => {
              const HighlightIcon = HIGHLIGHT_ICONS[highlight.key] || Globe;
              return (
                <article
                  key={highlight.key}
                  className="flex flex-1 items-start gap-3 rounded-2xl border border-[#E4DDF5] bg-[linear-gradient(140deg,#FFFFFF_0%,#FFF5EE_100%)] p-5 dark:border-white/10 dark:bg-[linear-gradient(140deg,rgba(255,255,255,0.05)_0%,rgba(232,82,26,0.08)_100%)]"
                >
                  <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#E8521A] text-white shadow-[0_10px_22px_rgba(232,82,26,0.3)]">
                    <HighlightIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{highlight.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{highlight.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-3xl bg-[linear-gradient(110deg,#E8521A_0%,#5340B0_55%,#2D1B69_100%)] p-[1.5px]">
          <div className="flex flex-col gap-5 rounded-[calc(1.5rem-1.5px)] bg-[#0D0A1A] p-5 text-white sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <img src={skolaeGroup.logoWhite} alt="" aria-hidden="true" className="h-9 w-auto flex-shrink-0 self-start sm:self-center" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  {skolaeGroup.contact.label}
                </p>
                <div className="mt-2 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
                  <a
                    href={`mailto:${skolaeGroup.contact.email}`}
                    className="inline-flex min-w-0 items-center gap-2 font-semibold transition-colors hover:text-[#F57C46]"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="[overflow-wrap:anywhere]">{skolaeGroup.contact.email}</span>
                  </a>
                  <a
                    href={skolaeGroup.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold transition-colors hover:text-[#F57C46]"
                  >
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    {skolaeGroup.contact.websiteLabel}
                  </a>
                </div>
                {phone && (
                  <>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      The Global Avenues: application support
                    </p>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#F57C46]"
                    >
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      {phone}
                    </a>
                  </>
                )}
              </div>
            </div>
            <Link
              to="/collaborate"
              className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E8521A] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F57C46]"
            >
              Connect With Our Team
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
