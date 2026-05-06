import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  Megaphone,
  Network,
  ShieldCheck,
  Users,
  Workflow,
} from 'lucide-react';
import { educationPrograms } from '../data/educationProgramsData';
import { getOfferings } from '../services/contentApi';
import Seo from '../components/seo/Seo';
import LazySection from '../components/ui/LazySection';
import { CardGridSkeleton, CtaSkeleton, TrackListSkeleton } from '../components/ui/SkeletonLayouts';

const CORE_SERVICES = [
  {
    title: 'In-Country Representation',
    description: 'We represent your university in India and nearby markets with a local team.',
    icon: Building2,
  },
  {
    title: 'Marketing & Promotion',
    description: 'We run city-wise and digital promotion to increase quality student interest.',
    icon: Megaphone,
  },
  {
    title: 'Agent & Counselor Management',
    description: 'We onboard, train, and guide trusted partners with clear quality standards.',
    icon: Network,
  },
  {
    title: 'Market Research & Insights',
    description: 'We share practical market trends, demand signals, and intake-ready suggestions.',
    icon: BarChart3,
  },
  {
    title: 'Admissions Support',
    description: 'We assist with application flow, document readiness, and offer follow-up.',
    icon: ClipboardCheck,
  },
  {
    title: 'Collaboration & Partnerships',
    description: 'We help build long-term collaborations with schools, counselors, and industry bodies.',
    icon: Users,
  },
];

const HOW_WE_WORK = [
  'Understand your market goals and intake priorities.',
  'Build a practical action plan with timelines.',
  'Execute with local team support and weekly tracking.',
  'Improve results through regular review and clear reporting.',
];

const OFFERING_ICON_MAP = {
  'fulltime-degree': Building2,
  'online-program': Megaphone,
  'vocational-courses': Network,
  'internship-abroad': Workflow,
  'summer-winter-school': Users,
};

const BEGIN_GROUP_PARTNER = {
  name: 'Begin Group',
  logo: '/partners/begin-group-logo.png',
};

const parseList = (value) =>
  String(value || '')
    .split(/[,|;/]/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function WhatWeOfferPage() {
  const [apiProgramMap, setApiProgramMap] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    const loadOfferings = async () => {
      try {
        const data = await getOfferings({ signal: controller.signal });
        const offerings = Array.isArray(data) ? data : [];
        if (offerings.length === 0) return;

        const mapped = offerings.reduce((acc, item) => {
          const slug = String(item.slug || '').trim();
          if (!slug) return acc;
          acc[slug] = item;
          return acc;
        }, {});

        if (Object.keys(mapped).length > 0) {
          setApiProgramMap(mapped);
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    };

    loadOfferings();
    return () => controller.abort();
  }, []);

  const mergedPrograms = useMemo(
    () =>
      educationPrograms.map((program) => {
        const apiOffering = apiProgramMap[program.id];
        const apiRegions = parseList(apiOffering?.countries);

        return {
          ...program,
          name: apiOffering?.title || program.name,
          description: apiOffering?.description || program.description,
          regions: apiRegions.length > 0 ? apiRegions : program.regions,
        };
      }),
    [apiProgramMap]
  );

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      <Seo
        title="What We Offer"
        description="Explore The Global Avenues offerings including in-country representation, admissions support, market intelligence, and recruitment partner management."
        path="/what-we-offer"
        image="/videos/hero-poster.jpg"
        keywords={['what we offer', 'education support services', 'international recruitment support']}
      />
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(83,64,176,0.22),transparent)]" />
        <div className="mx-auto max-w-7xl rounded-[30px] border border-border/70 bg-[linear-gradient(140deg,rgba(45,27,105,0.08)_0%,rgba(255,255,255,0.97)_50%,rgba(232,82,26,0.09)_100%)] px-6 py-10 shadow-[0_24px_66px_rgba(20,14,45,0.16)] dark:bg-[linear-gradient(140deg,rgba(45,27,105,0.34)_0%,rgba(14,10,28,0.97)_50%,rgba(232,82,26,0.16)_100%)] sm:px-8 lg:px-12">
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            What We Offer
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We help universities grow in India and nearby markets through local representation, partner management,
            marketing support, and admissions process guidance. Our approach is practical, transparent, and result-focused.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HOW_WE_WORK.map((step) => (
              <div key={step} className="rounded-xl border border-border/70 bg-background/80 p-3 text-sm text-muted-foreground">
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      <LazySection fallback={<CardGridSkeleton count={6} columns="md:grid-cols-2 xl:grid-cols-3" />}>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Core Services</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            These are the main support areas we provide to partner institutions.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {CORE_SERVICES.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.32, delay: index * 0.05 }}
                  className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm"
                >
                  <span className="mb-4 inline-flex rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      </LazySection>

      <LazySection fallback={<TrackListSkeleton count={5} />}>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Service Tracks</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Choose the track that matches your current market stage.
          </p>

          <div className="mt-6 space-y-5">
            {mergedPrograms.map((program, index) => {
              const Icon = OFFERING_ICON_MAP[program.id] || Building2;
              return (
                <motion.article
                  key={program.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  transition={{ duration: 0.34, delay: index * 0.05 }}
                  className="rounded-2xl border border-border/70 bg-background p-6 shadow-sm sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 max-w-3xl">
                      <div className="mb-3 inline-flex rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{program.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {program.description}
                      </p>
                      {program.id === 'summer-winter-school' && (
                        <div className="mt-4 flex max-w-2xl items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
                          <img
                            src={BEGIN_GROUP_PARTNER.logo}
                            alt={`${BEGIN_GROUP_PARTNER.name} logo`}
                            loading="lazy"
                            decoding="async"
                            className="h-7 w-auto rounded-sm bg-white px-1 py-0.5"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                              In partner with Begin Group
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/education-program/${program.id}/undergraduate`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
                    >
                      View Full Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Key Work Areas
                      </p>
                      <ul className="mt-3 space-y-2">
                        {program.modules.map((module) => (
                          <li key={module.title} className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{module.title}:</span> {module.detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        What We Track
                      </p>
                      <ul className="mt-3 space-y-2">
                        {program.kpis.map((kpi) => (
                          <li key={kpi} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{kpi}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Quality & Compliance
                      </p>
                      <ul className="mt-3 space-y-2">
                        {program.complianceFocus.map((point) => (
                          <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {program.regions.map((region) => (
                          <span
                            key={region}
                            className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
      </LazySection>

      <LazySection fallback={<CtaSkeleton />}>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border/70 bg-background p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-3xl font-bold text-foreground">Ready To Plan Your Next Intake?</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Talk to our partnership team. We will share a clear scope, timeline, and execution plan based on your priorities.
          </p>
          <Link
            to="/collaborate"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_55%,#E8521A_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(45,27,105,0.30)] sm:w-auto"
          >
            Connect With Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      </LazySection>
    </div>
  );
}
