import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Briefcase,
  Building2,
  Compass,
  GraduationCap,
  Handshake,
  LifeBuoy,
  Megaphone,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const services = [
  {
    icon: Building2,
    title: 'In-Country Representation',
    description:
      'Represent international educational institutions locally and establish their presence in the South Asian market.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Megaphone,
    title: 'Marketing & Promotion',
    description:
      'Expert-driven international student recruitment with targeted marketing and promotion strategies.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Agent Management',
    description:
      'Develop targeted recruitment strategies and provide personalized counseling for prospective students.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Market Research & Analysis',
    description:
      'Conduct comprehensive market research to identify trends and provide strategic recommendations.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Settings,
    title: 'Administrative Services',
    description:
      'Assist with assessment, application, enrollment, visa, immigration, and student support services.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Handshake,
    title: 'Collaboration & Partnerships',
    description:
      'Enhance global reach through strategic collaboration and comprehensive student recruitment services.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

const serviceCardMeta = {
  'In-Country Representation': {
    tag: 'Local Presence',
    outcomes: ['Market Entry', 'Partner Network'],
  },
  'Marketing & Promotion': {
    tag: 'Growth Engine',
    outcomes: ['Lead Capture', 'Brand Lift'],
  },
  'Agent Management': {
    tag: 'Channel Ops',
    outcomes: ['Agent Network', 'Enrollment Ops'],
  },
  'Market Research & Analysis': {
    tag: 'Insight Lab',
    outcomes: ['Trend Mapping', 'Strategy'],
  },
  'Administrative Services': {
    tag: 'Back Office',
    outcomes: ['Compliance', 'Student Care'],
  },
  'Collaboration & Partnerships': {
    tag: 'Alliances',
    outcomes: ['Global Reach', 'Strategic Deals'],
  },
};

const endToEndSupport = [
  {
    title: 'Institutional Support',
    description: 'Complete strategic guidance for universities establishing presence in South Asia',
  },
  {
    title: 'Student Recruitment',
    description: 'Comprehensive student recruitment and admission processing',
  },
  {
    title: 'Visa & Immigration',
    description: 'Expert assistance with visa applications and immigration requirements',
  },
  {
    title: 'Career Guidance',
    description: 'Professional counseling and career path planning for students',
  },
  {
    title: 'Quality Assurance',
    description: 'Transparent processes with ICEF accreditation and industry standards',
  },
  {
    title: 'Continuous Support',
    description: 'Ongoing support throughout the entire student journey',
  },
];

const endToEndModalDetails = {
  'Institutional Support': {
    icon: Building2,
    tag: 'Institution Growth',
    gradient: 'from-[#2B3BA8] via-[#3D56CC] to-[#5A72F4]',
    highlights: [
      'Localized expansion roadmap with market-entry strategy',
      'Representative office setup and channel partner onboarding',
      'Performance tracking dashboards for enrollment pipelines',
    ],
    outcomes: ['Go-to-market', 'Partner Network', 'Enrollment Ops'],
  },
  'Student Recruitment': {
    icon: Users,
    tag: 'Admissions Funnel',
    gradient: 'from-[#2E3FAE] via-[#4361EE] to-[#7A5CFF]',
    highlights: [
      'Segmented campaigns targeting high-intent student profiles',
      'Application-to-offer journey management with SLA tracking',
      'Counselor-guided conversion support for faster decisions',
    ],
    outcomes: ['Lead Quality', 'Faster Conversions', 'Offer-to-Enroll'],
  },
  'Visa & Immigration': {
    icon: ShieldCheck,
    tag: 'Compliance Ready',
    gradient: 'from-[#24567A] via-[#3178A8] to-[#48A6D7]',
    highlights: [
      'Document validation workflows to reduce rejection risks',
      'Country-specific visa guidance with compliance checkpoints',
      'Interview preparation and timeline monitoring end-to-end',
    ],
    outcomes: ['Document Accuracy', 'Higher Approval', 'Timeline Clarity'],
  },
  'Career Guidance': {
    icon: Compass,
    tag: 'Student Direction',
    gradient: 'from-[#5B3A9D] via-[#7A45C4] to-[#A05AF2]',
    highlights: [
      'Program matching based on profile, goals, and budget',
      'Career pathway planning aligned with destination markets',
      'One-on-one advisory for applications and statement strategy',
    ],
    outcomes: ['Program Fit', 'Career Mapping', 'Decision Confidence'],
  },
  'Quality Assurance': {
    icon: GraduationCap,
    tag: 'Process Excellence',
    gradient: 'from-[#225D5A] via-[#2A8A84] to-[#36B2A9]',
    highlights: [
      'Standardized workflows aligned with global education norms',
      'Quality audits across counseling, documentation, and support',
      'Transparent reporting with milestone-based accountability',
    ],
    outcomes: ['Standardized Ops', 'Audit Visibility', 'Quality Delivery'],
  },
  'Continuous Support': {
    icon: LifeBuoy,
    tag: 'Always-On Support',
    gradient: 'from-[#6B3444] via-[#9C425F] to-[#CC5E83]',
    highlights: [
      'Dedicated guidance from inquiry to post-arrival stages',
      'Rapid issue resolution through centralized support channels',
      'Regular progress follow-ups and student wellbeing check-ins',
    ],
    outcomes: ['Faster Resolution', 'Ongoing Guidance', 'Student Success'],
  },
};

const useLockBodyScroll = (isLocked) => {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') {
      return undefined;
    }

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isLocked]);
};

const ModalShell = ({ title, accentClass, isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="max-h-96 w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`sticky top-0 flex items-center justify-between px-8 py-6 text-white ${accentClass}`}>
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-white/20" type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-8">
          {children}
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:bg-secondary"
            type="button"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const UniversitySolutionsModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <motion.div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/55 px-3 py-4 backdrop-blur-[3px] sm:px-6 sm:py-6 lg:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.div
        className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/25 bg-white/95 shadow-[0_30px_80px_rgba(20,16,45,0.38)] backdrop-blur-sm dark:border-[#2B2354] dark:bg-[#0F0C1E]/95 dark:shadow-[0_40px_90px_rgba(5,4,18,0.65)]"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/40 bg-white/70 p-2 text-[#2D1B69] shadow-sm transition-all hover:bg-white dark:border-white/20 dark:bg-[#191230] dark:text-white"
          type="button"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-h-[calc(100dvh-3rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 p-7 sm:p-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:border-white/15 dark:bg-white/10 dark:text-white">
              Comprehensive University Solutions
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Scale international reach with a full-service partner.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We help universities expand in South Asia with localized representation, strategic recruitment,
                and operational support across the entire student journey.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { title: 'Local Presence', detail: 'In-country teams' },
                { title: 'Recruitment Ops', detail: 'Pipeline optimized' },
                { title: 'Compliance Ready', detail: 'Visa support' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/80 bg-muted/40 px-4 py-3 text-sm dark:border-[#2B2354]/80 dark:bg-[#16122D]/70"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 dark:text-white/70">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.detail}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80 dark:text-white/70">
                Key Benefits
              </p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  'In-country representation and market entry execution',
                  'Expert-driven recruitment and targeted marketing support',
                  'Market research with data-backed strategy insights',
                  'Administrative and student support services end-to-end',
                  'Partnership development with trusted agents',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary dark:bg-white/15 dark:text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110"
                type="button"
              >
                Close Overview
              </button>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary/10 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                View Partner Institutions
              </Link>
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/10 p-6 dark:from-[#1B1238] dark:via-[#120C24] dark:to-[#2A1408] sm:min-h-[320px] sm:p-8">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=900&fit=crop&q=80"
                alt="University partnership strategy session"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-90 transition-all duration-500 dark:opacity-80 dark:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="rounded-2xl border border-white/30 bg-white/15 p-4 text-white backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Partnership Snapshot
                </p>
                <p className="mt-2 text-lg font-semibold">Targeted growth plans built with local insight.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Market Entry', value: 'Localized execution' },
                  { label: 'Admissions', value: 'Funnel optimization' },
                  { label: 'Student Care', value: 'Lifecycle support' },
                  { label: 'Brand Lift', value: 'Trusted visibility' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/25 bg-white/10 p-4 text-white backdrop-blur-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
};

const ServiceCardModal = ({ isOpen, onClose, service }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  useLockBodyScroll(isOpen);

  if (!isOpen || !service) {
    return null;
  }

  const meta = serviceCardMeta[service.title] || {
    tag: 'Core Service',
    outcomes: ['Global Reach', 'Student Support'],
  };
  const Icon = service.icon;

  const modalContent = (
    <motion.div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-hidden bg-black/55 px-4 pb-4 pt-24 backdrop-blur-[3px] sm:px-6 sm:pb-6 sm:pt-28 lg:pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-[min(760px,calc(100vw-2rem))] overflow-hidden rounded-3xl p-[1px] sm:max-w-[min(760px,calc(100vw-3rem))]"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-45 blur-[0.6px]`}
        />
        <div className="relative z-10 max-h-[min(82vh,680px)] overflow-y-auto overscroll-contain rounded-3xl border border-[#E6E1F6]/80 bg-[#F5F3FF]/95 p-7 shadow-[0_24px_60px_rgba(45,27,105,0.2)] backdrop-blur-sm dark:border-[#3A2A78] dark:bg-[#1A1033]/95 dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] sm:p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-white/40 bg-white/80 p-2 text-[#2D1B69] shadow-sm transition-all hover:bg-white dark:border-white/20 dark:bg-[#191230] dark:text-white"
            type="button"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="inline-flex items-center rounded-full border border-white/25 bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white shadow-sm dark:border-white/20">
            <span className={`bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
              {meta.tag}
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/25 bg-white/80 text-[#2D1B69] shadow-sm dark:border-white/15 dark:bg-white/10 dark:text-white">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{service.description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {meta.outcomes.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#D9D3F0]/80 bg-white/70 px-3 py-1 text-xs font-medium text-[#2D1B69]/80 dark:border-[#5340B0]/40 dark:bg-[#22164A] dark:text-[#F5F3FF]/80"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80 dark:text-white/70">
              Key Features
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                'Expert professional guidance and support',
                'Comprehensive service delivery',
                'Tailored solutions for your needs',
                'Quality assurance and transparency',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary dark:bg-white/15 dark:text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110"
              type="button"
            >
              Close
            </button>
            <Link
              to="/collaborate"
              className="inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary/10 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
};

const EndToEndModal = ({ isOpen, onClose, item }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  useLockBodyScroll(isOpen);

  if (!isOpen || !item) {
    return null;
  }

  const detail = endToEndModalDetails[item.title] || {
    icon: Briefcase,
    tag: 'Complete Support',
    gradient: 'from-[#2E3FAE] via-[#4361EE] to-[#7A5CFF]',
    highlights: [
      'Professional and experienced team support',
      'Comprehensive service coverage',
      'Quality assurance and best practices',
    ],
    outcomes: ['Reliable Delivery', 'Transparent Process', 'Ongoing Support'],
  };
  const DetailIcon = detail.icon;

  const modalContent = (
    <motion.div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-hidden bg-black/55 px-3 pb-3 pt-24 backdrop-blur-[3px] sm:px-6 sm:pb-6 sm:pt-28 lg:pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-[min(980px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_26px_70px_rgba(16,15,40,0.42)] sm:max-w-[min(980px,calc(100vw-3rem))] dark:border-[#2B2354] dark:bg-[#0F0C1E]"
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg border border-white/30 bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/35 dark:border-white/20 dark:bg-black/30"
          type="button"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100dvh-8rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
            <div className={`relative overflow-hidden bg-gradient-to-br ${detail.gradient} p-6 text-white sm:p-8`}>
              <div className="pointer-events-none absolute -right-14 -top-12 h-40 w-40 rounded-full bg-white/12" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-black/10" />

              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
                  {detail.tag}
                </div>

                <h3 className="text-3xl font-bold leading-tight sm:text-[2rem]">{item.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-white/90">{item.description}</p>

                <div className="mt-7 rounded-2xl border border-white/25 bg-white/12 p-4 backdrop-blur-[2px]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/35">
                      <DetailIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                        Focus Area
                      </p>
                      <p className="mt-1 text-base font-semibold">Strategic execution with measurable outcomes</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {detail.outcomes.map((itemValue) => (
                    <span
                      key={itemValue}
                      className="rounded-full border border-white/35 bg-white/18 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      {itemValue}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 dark:bg-[#0F0C1E]">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">What You Get</p>
                <h4 className="mt-2 text-2xl font-bold text-foreground">Premium Service Scope</h4>
              </div>

              <ul className="space-y-3">
                {detail.highlights.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 rounded-xl border border-border/80 bg-muted/40 px-4 py-3 dark:border-[#2B2354]/80 dark:bg-[#16122D]/65"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary dark:bg-primary/25">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-border/80 bg-background/80 p-4 dark:border-[#2B2354]/80 dark:bg-[#15112B]/80">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">Delivery Model</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Structured planning, expert execution, and continuous optimization throughout the full education journey.
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110"
                type="button"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
};

const EndToEndSupportCard = ({ item, index, onClick }) => {
  const cardRef = useScrollAnimation({ y: 32, duration: 500, delay: index * 80, scale: 0.98 });
  const detail = endToEndModalDetails[item.title] || {
    icon: Briefcase,
    gradient: 'from-[#2D1B69] via-[#5340B0] to-[#E8521A]',
    outcomes: ['Complete Support'],
  };
  const CardIcon = detail.icon;
  const topTag = detail.outcomes?.[0] || 'Complete Support';

  return (
    <div ref={cardRef}>
      <div
        onClick={() => onClick(item)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick(item);
          }
        }}
        role="button"
        tabIndex={0}
        className={`group relative flex cursor-pointer flex-col rounded-2xl border border-border bg-white/85 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md active:-translate-y-1 active:border-primary/50 active:shadow-md dark:border-[#2B2354] dark:bg-[#15112B] ${
          index % 2 === 0 ? 'lg:-translate-y-1' : ''
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:border-white/20 dark:bg-white/10 dark:text-white">
            {topTag}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-primary dark:border-[#2B2354] dark:bg-[#1C1634] dark:text-white">
            <CardIcon className="h-5 w-5" />
          </div>
        </div>

        <h4 className="text-2xl font-semibold leading-tight text-foreground">{item.title}</h4>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {detail.outcomes?.slice(0, 2).map((value) => (
            <span
              key={value}
              className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground dark:border-[#2B2354] dark:bg-[#1C1634]"
            >
              {value}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground dark:border-white/30 dark:text-white dark:group-hover:bg-white/15">
            Learn more
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceGridCard = ({ service, index, onClick }) => {
  const cardRef = useScrollAnimation({ y: 32, duration: 500, delay: index * 80, scale: 0.97 });
  const meta = serviceCardMeta[service.title] || {
    tag: 'Core Service',
    outcomes: ['Global Reach', 'Student Support'],
  };
  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(service)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(service);
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-white/85 p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] hover:border-primary/50 hover:shadow-[0_20px_40px_rgba(45,27,105,0.12)] active:-translate-y-1.5 active:scale-[1.01] active:border-primary/50 active:shadow-[0_20px_40px_rgba(45,27,105,0.12)] dark:border-[#2B2354] dark:bg-[#15112B]"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:border-white/20 dark:bg-white/10 dark:text-white">
          {meta.tag}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-primary transition-all duration-200 ease-out group-hover:rotate-[8deg] group-hover:scale-110 group-hover:bg-[#E8521A] group-hover:text-white group-active:rotate-[8deg] group-active:scale-110 group-active:bg-[#E8521A] group-active:text-white dark:border-[#2B2354] dark:bg-[#1C1634] dark:text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <h3 className="text-2xl font-semibold leading-tight text-foreground">{service.title}</h3>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{service.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {meta.outcomes.map((value) => (
          <span
            key={value}
            className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground dark:border-[#2B2354] dark:bg-[#1C1634]"
          >
            {value}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground dark:border-white/30 dark:text-white dark:group-hover:bg-white/15">
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export function Services() {
  const headerRef = useScrollAnimation({ y: 20, duration: 600 });
  const endRef = useScrollAnimation({ y: 20, duration: 600 });
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEndToEnd, setSelectedEndToEnd] = useState(null);

  return (
    <section id="services" className="relative overflow-hidden bg-transparent px-4 py-20">

      <div className="mx-auto w-full max-w-7xl">
        <div
          ref={headerRef}
          className="mb-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
        >
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm dark:border-white/15 dark:bg-white/10 dark:text-white">
              What We Offer
            </div>
            <div className="mt-4">
              <h2 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
                Comprehensive
                <span className="block">
                  <span className="mx-auto block w-fit bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_38%,#8B63E5_58%,#D26BA8_76%,#E8521A_100%)] bg-clip-text text-transparent lg:mx-0">
                    University
                  </span>
                  <span className="mx-auto block w-fit bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_38%,#8B63E5_58%,#D26BA8_76%,#E8521A_100%)] bg-clip-text text-transparent lg:mx-0">
                    Solutions
                  </span>
                </span>
              </h2>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We provide end-to-end support to help higher education institutions expand their reach and recruit top-tier international students.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <button
                onClick={() => setShowUniversityModal(true)}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                type="button"
              >
                Learn More
              </button>
              <Link
                to="/portfolio"
                className="rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary/10 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                View Portfolio
              </Link>
            </div>

          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/40 bg-white/70 p-3 shadow-[0_30px_60px_rgba(16,12,40,0.18)] dark:border-[#2B2354]/80 dark:bg-[#120C24]/75 dark:shadow-[0_40px_80px_rgba(6,5,20,0.7)]">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=720&fit=crop&q=80"
                  alt="University collaboration"
                  loading="lazy"
                  decoding="async"
                  className="h-[420px] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceGridCard
              key={service.title}
              service={service}
              index={index}
              onClick={setSelectedService}
            />
          ))}
        </div>

        <div className="mt-24 border-t border-border pt-20">
          <div
            ref={endRef}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
              Offering End-to-End Support
            </div>
            <h3 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">
              Complete <span className="section-title-classic-accent">Educational Solutions</span>
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From institutional representation to student success, we provide comprehensive support at every stage of the international education journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {endToEndSupport.map((item, index) => (
              <EndToEndSupportCard
                key={item.title}
                item={item}
                index={index}
                onClick={setSelectedEndToEnd}
              />
            ))}
          </div>
        </div>
      </div>

      <UniversitySolutionsModal
        isOpen={showUniversityModal}
        onClose={() => setShowUniversityModal(false)}
      />
      <ServiceCardModal
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />
      <EndToEndModal
        isOpen={selectedEndToEnd !== null}
        onClose={() => setSelectedEndToEnd(null)}
        item={selectedEndToEnd}
      />
    </section>
  );
}
