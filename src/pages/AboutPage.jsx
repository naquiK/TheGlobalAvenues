import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  CheckCircle,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import useLazySection from '../hooks/useLazySection';
import {
  AccreditationSkeleton,
  CardGridSkeleton,
  ProfileGridSkeleton,
} from '../components/ui/SkeletonLayouts';
import Seo from '../components/seo/Seo';
import { SITE_URL } from '../seo/siteMeta';

const ProfileCard = memo(function ProfileCard({ member, featured }) {
  const cardRef = useScrollAnimation({ y: 24, duration: 600, delay: featured ? 0 : 80 });
  const [hasImageError, setHasImageError] = useState(!member.image);
  const initials = useMemo(
    () =>
      member.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
    [member.name]
  );

  return (
    <div ref={cardRef} className={`relative h-full ${featured ? 'lg:col-span-2' : ''}`}>
      <div className="group relative h-full rounded-[30px] bg-gradient-to-br from-primary/35 via-white/80 to-accent/35 p-[1px] shadow-[0_30px_80px_rgba(13,10,26,0.16)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_34px_90px_rgba(45,27,105,0.22)] dark:from-[#3A2A78]/80 dark:via-[#0D0A1A] dark:to-[#3A2A78]/70 dark:hover:shadow-[0_34px_90px_rgba(232,82,26,0.16)]">
        <div className="pointer-events-none absolute -inset-1 rounded-[32px] bg-gradient-to-br from-primary/18 via-transparent to-brand-orange/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white/90 p-6 shadow-inner dark:bg-[#0F0B1E]/90">
          <div className="absolute -right-14 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-100 dark:bg-brand-orange/10" />
          <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-orange/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 blur-lg opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100" />
              {hasImageError ? (
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#2D1B69_0%,#5B45C6_58%,#E8521A_100%)] text-lg font-bold text-white ring-1 ring-white/60 transition-transform duration-500 group-hover:scale-105 dark:ring-white/10">
                  {initials}
                </div>
              ) : (
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  onError={() => setHasImageError(true)}
                  className="relative h-20 w-20 rounded-2xl object-cover ring-1 ring-white/60 transition-transform duration-500 group-hover:scale-105 dark:ring-white/10"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">
                Team
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">{member.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{member.role}</p>
            </div>
          </div>
          <div className="mt-5 flex h-full flex-col justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition-all duration-300 group-hover:border-primary/35 group-hover:bg-primary group-hover:text-white dark:border-white/20 dark:bg-white/10 dark:text-white">
              {featured ? 'Leadership' : 'Specialist'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

const ValueCard = ({ item, index }) => {
  const cardRef = useScrollAnimation({ y: 20, duration: 500, delay: index * 80, scale: 0.98 });
  const Icon = item.icon;

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(21,14,44,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_26px_60px_rgba(21,14,44,0.14)] dark:border-[#2B2354] dark:bg-[#0F0B1E]/80"
    >
      <div className="absolute -right-10 -top-12 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 ease-out group-hover:rotate-6 group-hover:scale-110 dark:border-white/15 dark:bg-white/10 dark:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
    </div>
  );
};

export default function AboutPage() {
  const ICEF_ACCOUNT_ID = '5944';
  const ICEF_DIRECTORY_URL = 'https://www.icef.com/ias-directory/';
  const PIER_DIRECTORY_URL = 'https://connect.pierapps.com/agencies/46631';
  const badgeRef = useRef(null);
  const [isBadgeReady, setIsBadgeReady] = useState(false);
  const [showBadgeFallback, setShowBadgeFallback] = useState(false);
  const [badgeRetryKey, setBadgeRetryKey] = useState(0);
  const { ref: valuesRef, isVisible: valuesVisible } = useLazySection();
  const { ref: teamRef, isVisible: teamVisible } = useLazySection();
  const { ref: accreditationRef, isVisible: accreditationVisible } = useLazySection();

  useEffect(() => {
    if (!accreditationVisible || !badgeRef.current) {
      return undefined;
    }

    setIsBadgeReady(false);
    setShowBadgeFallback(false);
    let mounted = true;
    let checkTimer;
    let stopTimer;
    let observer;
    let hasResolved = false;
    const scriptSrc = 'https://www-cdn.icef.com/scripts/iasbadgeid.js';

    const checkBadge = () => {
      if (!mounted || !badgeRef.current) return;
      const hasBadgeContent =
        badgeRef.current.children.length > 0 || badgeRef.current.textContent.trim().length > 0;
      if (hasBadgeContent) {
        hasResolved = true;
        setIsBadgeReady(true);
        setShowBadgeFallback(false);
        if (checkTimer) window.clearInterval(checkTimer);
        if (stopTimer) window.clearTimeout(stopTimer);
      }
    };

    badgeRef.current.replaceChildren();
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      window.setTimeout(checkBadge, 350);
    };
    script.onerror = () => {
      if (!mounted) return;
      setIsBadgeReady(false);
    };
    document.body.appendChild(script);
    checkTimer = window.setInterval(checkBadge, 600);
    observer = new MutationObserver(checkBadge);
    observer.observe(badgeRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    stopTimer = window.setTimeout(() => {
      window.clearInterval(checkTimer);
      if (!mounted) return;
      if (!badgeRef.current) return;
      const hasBadgeContent =
        badgeRef.current.children.length > 0 || badgeRef.current.textContent.trim().length > 0;
      if (!hasResolved && !hasBadgeContent) {
        setShowBadgeFallback(true);
      }
    }, 30000);

    return () => {
      mounted = false;
      if (checkTimer) window.clearInterval(checkTimer);
      if (stopTimer) window.clearTimeout(stopTimer);
      if (observer) observer.disconnect();
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [accreditationVisible, badgeRetryKey]);

  const values = useMemo(
    () => [
      {
        icon: Target,
        title: 'Our Mission',
        description:
          'Uphold integrity, transparency, and execution excellence while delivering tailored growth strategies for every institution partner.',
      },
      {
        icon: Globe,
        title: 'Our Vision',
        description:
          'Consistently enhance our role as trusted partner for universities through strong relationships, collaborative efforts, and innovative strategies.',
      },
      {
        icon: Heart,
        title: 'Partner Centric',
        description:
          'Every decision is guided by institutional success and sustainable impact in the global education landscape.',
      },
      {
        icon: Shield,
        title: 'Quality Assurance',
        description:
          'ICEF accredited organization with transparent processes and professional ethical standards.',
      },
    ],
    []
  );

  const team = useMemo(
    () => [
      {
        name: 'Neetu Verma Gupta',
        role: 'Director',
        image: '/team/neetu-verma-gupta.webp',
        bio: 'Visionary leader with extensive experience in international education partnerships and institutional development',
      },
      {
        name: 'Deepshikha Chauhan',
        role: 'International Recruitment Head',
        image: '/team/deepshikha-chauhan.webp',
        bio: 'Strategic recruitment expert overseeing institutional partnerships and high-impact enrollment campaigns',
      },
      {
        name: 'Shabana Azmi',
        role: 'International Recruitment',
        image: '/team/shabana-azmi.webp',
        bio: 'Experienced recruitment professional with strong focus on international market mobility and university relations',
      },
      {
        name: 'Ambar Johar',
        role: 'Admissions Coordinator',
        image: '/team/ambar-johar.webp',
        bio: 'Efficient coordinator ensuring smooth application processing and institutional onboarding workflows',
      },
      {
        name: 'Suraj Kumar Soni',
        role: 'Admissions Coordinator',
        image: '/team/suraj-kumar-soni.webp',
        bio: 'Dedicated professional managing admissions workflows, documentation quality, and partner compliance',
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { number: '12+', label: 'Years of Experience' },
      { number: '100+', label: 'Partner Universities' },
      { number: '600+', label: 'Active Channel Partners in SAMEA' },
      { number: '4K+', label: 'Students Recruited' },
    ],
    []
  );

  const heroRef = useScrollAnimation({ y: 20, duration: 600 });
  const statsRef = useScrollAnimation({ y: 20, duration: 600, delay: 120 });
  const storyRef = useScrollAnimation({ y: 20, duration: 600 });
  const promiseRef = useScrollAnimation({ y: 20, duration: 600, delay: 120 });

  return (
    <div className="about-page-gradient min-h-screen pt-16 text-foreground">
      <Seo
        title="About The Global Avenues — Mission, Team & ICEF Accreditation"
        description="Discover The Global Avenues — an ICEF & PIER certified education consultancy with 12+ years of experience. Meet our leadership team and learn how we help universities grow across India and South Asia."
        path="/about"
        image="/team/neetu-verma-gupta.webp"
        keywords={[
          'about The Global Avenues',
          'international education partner India',
          'ICEF accredited agency',
          'PIER certified education consultant',
          'university recruitment team',
          'education consultancy India',
          'Neetu Verma Gupta',
          'global education partnerships',
        ]}
        jsonLd={[{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
          ],
        }]}
      />
      <section className="about-section-shell px-4 py-20 sm:px-6 lg:px-8">
        <div ref={heroRef} className="relative mx-auto max-w-5xl text-center">
          <div className="section-kicker-classic mb-5 inline-flex">KNOW US BETTER</div>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-5xl">
            Empowering Global Education With
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-purple to-brand-orange">
              Trusted Partnerships
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            The Global Avenues is a trusted name in the international education industry. We specialize in
            partnering with institutions seeking to establish and grow their presence in the Indian subcontinent,
            building their brand from the ground up and positioning them as recognized names in the region.
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            Our core mission is to create impactful collaborations that connect global institutions with trusted
            networks in India. We facilitate institutional partnerships, admissions operations, and recruitment
            visibility with a strong emphasis on transparency, innovation, and long-term
            impact.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]">
            <span className="rounded-full border border-border/60 bg-white/75 px-4 py-2 text-primary/80 dark:border-white/30 dark:bg-white/12 dark:text-white">
              ICEF Accredited
            </span>
            <span className="rounded-full border border-border/60 bg-white/75 px-4 py-2 text-primary/80 dark:border-white/30 dark:bg-white/12 dark:text-white">
              Global University Network
            </span>
            <span className="rounded-full border border-border/60 bg-white/75 px-4 py-2 text-primary/80 dark:border-white/30 dark:bg-white/12 dark:text-white">
              Partner First
            </span>
          </div>
        </div>
      </section>

      <section className="about-section-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div ref={statsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-white/80 p-5 text-center shadow-[0_16px_40px_rgba(16,12,40,0.08)] dark:border-[#2B2354] dark:bg-[#0F0B1E]/80"
              >
                <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.number}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div ref={storyRef}>
            <div className="section-kicker-classic mb-4">Our Story</div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Building pathways that connect ambition with opportunity.
            </h2>
            <p className="mt-5 text-base text-muted-foreground">
              We act as a strategic bridge between universities and the Indian market ecosystem, bringing tailored
              market intelligence, recruitment expertise, and cultural insight to every partnership.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              With deep relationships across institutions, counselors, and industry networks, our team crafts outcomes
              that are measurable, sustainable, and rooted in trust.
            </p>
          </div>
          <div ref={promiseRef} className="rounded-3xl border border-border/60 bg-muted/30 p-8 shadow-[0_20px_60px_rgba(18,12,45,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Our Promise</p>
                <h3 className="text-xl font-semibold text-foreground">What partners receive</h3>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                'Localized market entry strategy and brand positioning',
                'Recruitment pipeline management with transparent reporting',
                'Application conversion journeys backed by experienced advisors',
                'Long-term partnership support with measurable outcomes',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div ref={valuesRef}>
        {valuesVisible ? (
          <section className="about-section-shell px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <div className="section-kicker-classic mb-4 inline-flex">Core Values</div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">The principles guiding every action</h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Everything we do is rooted in these fundamentals, shaping how we build trust and deliver results.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {values.map((item, index) => (
                  <ValueCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <CardGridSkeleton count={4} columns="md:grid-cols-2 lg:grid-cols-4" />
        )}
      </div>

      <div ref={teamRef}>
        {teamVisible ? (
          <section className="about-section-shell px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <div className="section-kicker-classic mb-4 inline-flex">Leadership & Team</div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Meet the experts behind the mission</h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Expert professionals dedicated to supporting institutions and partners with care and precision.
                </p>
              </div>

              <div className="mt-12 grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-4">
                {team.map((member, index) => (
                  <ProfileCard key={member.name} member={member} featured={index < 2} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <ProfileGridSkeleton />
        )}
      </div>

      <div ref={accreditationRef}>
        {accreditationVisible ? (
          <section className="about-section-shell px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <div className="section-kicker-classic mb-4 inline-flex">Recognition</div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Accreditation & Memberships</h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Industry recognition that reinforces our commitment to quality and trusted partnerships.
                </p>
              </div>

              <div className="mt-12 space-y-8">
                <article className="rounded-[34px] border border-[#DAD2F1] bg-[linear-gradient(145deg,rgba(255,255,255,0.72)_0%,rgba(248,245,255,0.8)_46%,rgba(247,241,255,0.72)_100%)] p-[1px] shadow-[0_26px_70px_rgba(16,12,40,0.12)] dark:border-[#2F2658] dark:bg-[linear-gradient(145deg,rgba(28,20,52,0.9)_0%,rgba(17,13,34,0.94)_100%)]">
                  <div className="rounded-[32px] bg-white/66 p-4 backdrop-blur-sm dark:bg-[#120D25]/70 sm:p-5">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:gap-7">
                      <div className="rounded-3xl border border-[#DDD7F2] bg-[linear-gradient(160deg,#FFFFFF_0%,#F9F6FF_52%,#F3F7FF_100%)] p-6 shadow-[0_24px_70px_rgba(16,12,40,0.12)] dark:border-[#2B2354] dark:bg-[linear-gradient(160deg,#140F28_0%,#0E0A1E_55%,#181133_100%)] sm:p-8">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Accreditation</p>
                            <h3 className="text-xl font-semibold text-foreground">ICEF Certified</h3>
                          </div>
                        </div>
                        <div className="mt-6 flex min-h-[160px] items-center justify-center rounded-2xl border border-[#DAD3F0] bg-[#F6F4FD] p-4 dark:border-[#3A2E72] dark:bg-[#17122D] sm:min-h-[180px] sm:p-6">
                          <div className="relative flex h-[112px] w-full max-w-[300px] items-center justify-center overflow-hidden rounded-xl border border-[#D3CBEA] bg-white p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-[#43337C] dark:bg-[#1A1435] sm:h-[120px] sm:max-w-[320px]">
                            {!isBadgeReady && !showBadgeFallback ? (
                              <div className="w-full max-w-[220px] space-y-3" aria-hidden="true">
                                <div className="skeleton-line mx-auto h-4 w-36 rounded-full" />
                                <div className="skeleton-line mx-auto h-9 w-44 rounded-xl" />
                              </div>
                            ) : null}
                            {showBadgeFallback ? (
                              <div className="absolute inset-2 z-20 flex flex-col items-center justify-center gap-3 rounded-xl border border-[#D3CBEA] bg-white/96 px-3 py-3 dark:border-[#43337C] dark:bg-[#1A1435]/96 sm:px-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowBadgeFallback(false);
                                    setIsBadgeReady(false);
                                    setBadgeRetryKey((value) => value + 1);
                                  }}
                                  className="inline-flex w-full max-w-[220px] items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-all duration-200 hover:bg-primary hover:text-white sm:text-xs"
                                >
                                  Retry Badge
                                </button>
                                <a
                                  href={ICEF_DIRECTORY_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-all duration-200 hover:bg-primary hover:text-white sm:text-xs"
                                >
                                  <span className="truncate">Search IAS Code {ICEF_ACCOUNT_ID}</span>
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            ) : null}
                            <span
                              ref={badgeRef}
                              id="iasBadge"
                              data-account-id={ICEF_ACCOUNT_ID}
                              className={`relative z-10 block max-w-full origin-center scale-[0.66] transition-opacity duration-300 sm:scale-[0.72] ${isBadgeReady ? 'opacity-100' : 'opacity-0'}`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-3xl border border-[#DBD4F0] bg-white/80 p-6 shadow-[0_18px_55px_rgba(16,12,40,0.1)] dark:border-[#352B61] dark:bg-[#16102B]/82 sm:p-8">
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-3xl dark:bg-brand-purple-mid/18" />
                        <div className="relative space-y-4 text-sm leading-relaxed text-muted-foreground">
                          <p>
                            ICEF&apos;s quality assurance framework is widely recognized as a professional benchmark across the
                            international education sector and helps institutions identify accredited agencies with confidence.
                          </p>
                          <p>
                            This status confirms that The Global Avenues has undergone structured screening for operational
                            quality, ethical standards, and responsible recruitment practices.
                          </p>
                          <p>
                            It reinforces our commitment to building long-term institutional partnerships through transparency,
                            accountability, and consistent service delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="rounded-[34px] border border-[#DAD2F1] bg-[linear-gradient(145deg,rgba(255,255,255,0.72)_0%,rgba(248,245,255,0.8)_46%,rgba(247,241,255,0.72)_100%)] p-[1px] shadow-[0_26px_70px_rgba(16,12,40,0.12)] dark:border-[#2F2658] dark:bg-[linear-gradient(145deg,rgba(28,20,52,0.9)_0%,rgba(17,13,34,0.94)_100%)]">
                  <div className="rounded-[32px] bg-white/66 p-4 backdrop-blur-sm dark:bg-[#120D25]/70 sm:p-5">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:gap-7">
                      <div className="rounded-3xl border border-[#DDD7F2] bg-[linear-gradient(160deg,#FFFFFF_0%,#F9F6FF_52%,#F3F7FF_100%)] p-6 shadow-[0_24px_70px_rgba(16,12,40,0.12)] dark:border-[#2B2354] dark:bg-[linear-gradient(160deg,#140F28_0%,#0E0A1E_55%,#181133_100%)] sm:p-8">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Accreditation</p>
                            <h3 className="text-xl font-semibold text-foreground">PIER Certified</h3>
                          </div>
                        </div>
                        <div className="mt-6 flex min-h-[160px] items-center justify-center rounded-2xl border border-[#DAD3F0] bg-[#F6F4FD] p-4 dark:border-[#3A2E72] dark:bg-[#17122D] sm:min-h-[180px] sm:p-6">
                          <div className="flex h-[112px] w-full max-w-[300px] flex-col items-center justify-center rounded-xl border border-[#C6D7DF] bg-white px-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-[#35556A] dark:bg-[#132231] sm:h-[120px] sm:max-w-[320px]">
                            <p className="text-[32px] font-extrabold uppercase leading-none tracking-[0.18em] text-[#0B5E86] dark:text-[#5FB6E0] sm:text-[38px]">
                              PIER
                            </p>
                            <p className="mt-1 max-w-[240px] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#174E69] dark:text-[#9ED5F0]">
                              Professional International Education Resources
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <a
                            href={PIER_DIRECTORY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-all duration-200 hover:bg-primary hover:text-white sm:text-xs"
                          >
                            <span className="truncate">View Verified Profile</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-3xl border border-[#DBD4F0] bg-white/80 p-6 shadow-[0_18px_55px_rgba(16,12,40,0.1)] dark:border-[#352B61] dark:bg-[#16102B]/82 sm:p-8">
                        <div className="absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-brand-orange/10 blur-3xl dark:bg-brand-orange/16" />
                        <div className="relative space-y-4 text-sm leading-relaxed text-muted-foreground">
                          <p>
                            PIER certification provides an additional layer of external verification through our official PIER
                            Connect agency listing, including identity and profile transparency.
                          </p>
                          <p>
                            This helps universities and partners complete due diligence more efficiently by referencing a
                            trusted third-party directory before collaboration.
                          </p>
                          <p>
                            Together, our ICEF and PIER credentials strengthen confidence in our processes and support
                            compliant, quality-focused, and institution-first engagement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div className="rounded-3xl border border-[#DDD7F2] bg-[linear-gradient(160deg,#FFFFFF_0%,#F9F6FF_52%,#F3F7FF_100%)] p-8 shadow-[0_24px_70px_rgba(16,12,40,0.12)] dark:border-[#2B2354] dark:bg-[linear-gradient(160deg,#140F28_0%,#0E0A1E_55%,#181133_100%)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Membership</p>
                      <h3 className="text-xl font-semibold text-foreground">NET24</h3>
                    </div>
                  </div>
                  <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-[#DAD3F0] bg-[#F6F4FD] p-6 dark:border-[#3A2E72] dark:bg-[#17122D]">
                    <div className="h-[112px] w-full max-w-[320px] overflow-hidden rounded-xl border border-[#D3CBEA] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-[#43337C] dark:bg-[#1A1435] sm:h-[120px]">
                      <img
                        src="/memberships/net24-logo.jpeg"
                        alt="NET24 membership logo"
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full scale-[1.08] object-cover object-center"
                      />
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground">
                    NET24 connects educational institutions with reputable recruitment agencies through its
                    advanced online platform (NET24Apply) and a series of impactful B2B events, including conferences
                    and workshops.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#DDD7F2] bg-[linear-gradient(160deg,#FFFFFF_0%,#F9F6FF_52%,#F3F7FF_100%)] p-8 shadow-[0_24px_70px_rgba(16,12,40,0.12)] dark:border-[#2B2354] dark:bg-[linear-gradient(160deg,#140F28_0%,#0E0A1E_55%,#181133_100%)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Membership</p>
                      <h3 className="text-xl font-semibold text-foreground">EAIE</h3>
                    </div>
                  </div>
                  <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-[#DAD3F0] bg-[#F6F4FD] p-6 dark:border-[#3A2E72] dark:bg-[#17122D]">
                    <div className="h-[112px] w-full max-w-[320px] overflow-hidden rounded-xl border border-[#BDD2C5] bg-white dark:border-[#3F6552] dark:bg-[#1D352A] sm:h-[120px]">
                      <img
                        src="/memberships/eaie-logo.png"
                        alt="EAIE membership logo"
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full scale-[1.22] object-cover object-center"
                      />
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground">
                    The European Association for International Education (EAIE) is a member-led, non-profit
                    organization founded in 1989 that serves as a European center for expertise, networking, and
                    resources in international higher education.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                  { icon: Zap, label: 'Operational Excellence' },
                  { icon: Shield, label: 'Ethical Practices' },
                  { icon: Heart, label: 'Partner Success' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-5 py-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <AccreditationSkeleton />
        )}
      </div>
    </div>
  );
}
