import { useDeferredValue, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  Globe,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { useSettings } from '../context/SettingsContext';
import Seo from '../components/seo/Seo';
import LazySection from '../components/ui/LazySection';
import { CardGridSkeleton } from '../components/ui/SkeletonLayouts';

export default function UniversitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCountry = searchParams.get('country') || 'all';
  const setSelectedCountry = (val) => {
    setSearchParams((prev) => {
      if (val === 'all') {
        prev.delete('country');
      } else {
        prev.set('country', val);
      }
      return prev;
    });
  };
  const [selectedType, setSelectedType] = useState('all');
  const { siteConfig } = useSettings();

  const deferredSearch = useDeferredValue(searchQuery);

  const universities = useMemo(
    () => portfolioData.filter((university) => university?.title && university?.country),
    []
  );

  const countries = useMemo(
    () => ['all', ...new Set(universities.map((item) => item.country).filter(Boolean))],
    [universities]
  );

  const categories = useMemo(
    () => ['all', ...new Set(universities.map((item) => item.category).filter(Boolean))],
    [universities]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();
    const tokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];

    return universities.filter((university) => {
      const matchesCountry = selectedCountry === 'all' || university.country === selectedCountry;
      const matchesType = selectedType === 'all' || university.category === selectedType;

      if (!matchesCountry || !matchesType) {
        return false;
      }

      if (tokens.length === 0) {
        return true;
      }

      const searchableFields = [
        university.title,
        university.country,
        university.category,
        university.description,
        university.details?.location,
        university.details?.intakeWindows,
        Array.isArray(university.details?.specializations)
          ? university.details.specializations.join(' ')
          : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return tokens.every((token) => searchableFields.includes(token));
    });
  }, [deferredSearch, selectedCountry, selectedType, universities]);

  const stats = [
    { icon: Globe, label: 'Partner Universities', value: siteConfig.stats.partnerUniversities },
    { icon: Users, label: 'Students Recruited', value: siteConfig.stats.studentsRecruited },
    { icon: TrendingUp, label: 'Visa Success Rate', value: siteConfig.stats.visaSuccessRate },
  ];

  const activeFilterCount = Number(selectedCountry !== 'all') + Number(selectedType !== 'all');
  const activeFiltersTotal = activeFilterCount + Number(Boolean(searchQuery.trim()));

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedType('all');
  };

  return (
    <div className="collaborate-page-gradient min-h-screen pt-16 text-foreground">
      <Seo
        title="Partner Universities — Browse Global Institutions | The Global Avenues"
        description="Browse partner universities and institutions across Europe, USA, Cyprus, and beyond. Compare programs, explore campus profiles, and discover study abroad opportunities with The Global Avenues."
        path="/universities"
        image="/universities/benedictine-university-hero.jpg"
        keywords={[
          'partner universities',
          'study abroad institutions',
          'international universities',
          'universities in Europe',
          'study in Cyprus',
          'study in France',
          'study in USA',
          'university program comparison',
        ]}
      />

      <section className="collaborate-section-shell px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl text-center">
            <div className="section-kicker-classic mb-5 inline-flex">University Network</div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Partner Universities</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-xl">
              Explore institution profiles, compare program strengths, and discover partner universities across
              Europe, North America, and beyond.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#D8D0EE] bg-[linear-gradient(160deg,#FFFFFF_0%,#F8F5FF_100%)] p-6 text-center shadow-[0_16px_42px_rgba(16,12,40,0.08)] dark:border-[#382B67] dark:bg-[linear-gradient(160deg,#15102B_0%,#100B1F_100%)]"
                >
                  <Icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <p className="mb-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-[#D9D1EF] bg-white/85 p-5 shadow-[0_18px_46px_rgba(16,12,40,0.08)] backdrop-blur-sm dark:border-[#3A2D70] dark:bg-[#120D25]/85 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Search & Filters
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search university, country, category, specialization..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[#D8D2EE] bg-white/90 py-3 pl-12 pr-4 text-sm text-foreground outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground/75 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-[#3A2D70] dark:bg-[#171032]/90"
                />
              </label>

              <select
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className="h-12 w-full rounded-xl border border-[#D8D2EE] bg-white/90 px-4 text-sm text-foreground outline-none transition-all duration-200 ease-out focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-[#3A2D70] dark:bg-[#171032]/90"
              >
                <option value="all">All Countries</option>
                {countries
                  .filter((country) => country !== 'all')
                  .map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
              </select>

              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="h-12 w-full rounded-xl border border-[#D8D2EE] bg-white/90 px-4 text-sm text-foreground outline-none transition-all duration-200 ease-out focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-[#3A2D70] dark:bg-[#171032]/90"
              >
                <option value="all">All Types</option>
                {categories
                  .filter((category) => category !== 'all')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                disabled={activeFiltersTotal === 0}
                className="h-12 rounded-xl border border-[#D8D2EE] bg-white/90 px-5 text-sm font-semibold text-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#3A2D70] dark:bg-[#171032]/90"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> universities
              </p>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                  activeFiltersTotal > 0
                    ? 'border-brand-orange/40 bg-brand-orange/10 text-brand-orange dark:text-brand-orange-light'
                    : 'border-border/60 bg-muted/30 text-muted-foreground'
                }`}
              >
                {activeFiltersTotal > 0 ? (
                  <>
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1.5 text-[11px] font-bold text-white">
                      {activeFiltersTotal}
                    </span>
                    <span>Active Filters</span>
                  </>
                ) : (
                  <span>No Active Filters</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LazySection fallback={<CardGridSkeleton count={6} image showHeading={false} />}>
      <section className="collaborate-section-shell px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((university) => {
                const normalizedSlug = String(university.slug || '').toLowerCase();
                const isLightLogo =
                  normalizedSlug === 'icn-business-school' || normalizedSlug === 'epitech';
                const useContainedHeroImage = normalizedSlug === 'epitech';

                return (
                  <article
                    key={university.id}
                    className="group relative isolate flex h-full overflow-hidden rounded-[26px] border border-[#D8D1EE] bg-[linear-gradient(160deg,#FFFFFF_0%,#F7F4FF_58%,#FFF7F2_100%)] shadow-[0_18px_46px_rgba(16,12,40,0.08)] ring-1 ring-white/70 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-brand-orange/[0.45] hover:shadow-[0_28px_70px_rgba(45,27,105,0.16)] dark:border-[#382C68] dark:bg-[linear-gradient(160deg,#15102B_0%,#120C27_58%,#211025_100%)] dark:ring-white/10"
                  >
                    <div className="relative flex w-full flex-1 flex-col">
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                        <img
                          src={university.image}
                          alt={university.title}
                          loading="lazy"
                          decoding="async"
                          className={`h-full w-full ${
                            useContainedHeroImage ? 'object-contain bg-[#E5E5E5] p-5' : 'object-cover'
                          } transition-transform duration-700 ease-out group-hover:scale-105`}
                        />

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,10,38,0.1)_0%,rgba(16,10,38,0)_34%,rgba(16,10,38,0.72)_100%)] opacity-[0.85] transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="absolute inset-x-0 top-0 h-px bg-white/60" />

                        {university.logo ? (
                          <div
                            className={`absolute left-4 top-4 rounded-2xl border p-2 shadow-[0_12px_26px_rgba(16,12,40,0.18)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105 ${
                              isLightLogo
                                ? 'border-white/30 bg-[#20184A]/[0.88] backdrop-blur-sm'
                                : 'border-white/[0.45] bg-white/95'
                            }`}
                          >
                            <img
                              src={university.logo}
                              alt={`${university.title} logo`}
                              loading="lazy"
                              decoding="async"
                              className={`h-7 w-auto max-w-[5.5rem] object-contain ${
                                isLightLogo ? 'brightness-110 contrast-110' : ''
                              }`}
                            />
                          </div>
                        ) : null}

                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.45] bg-brand-purple px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(45,27,105,0.24)] backdrop-blur-sm">
                            <Globe className="h-3.5 w-3.5" />
                            {university.country}
                          </div>
                          {university.category ? (
                            <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-white/[0.35] bg-white/15 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(16,12,40,0.18)] backdrop-blur-sm">
                              <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate">{university.category}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="relative flex flex-1 flex-col p-6">
                        <h3 className="mb-3 line-clamp-3 text-2xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                          {university.title}
                        </h3>
                        <p className="mb-5 line-clamp-2 text-sm text-muted-foreground">{university.description}</p>

                        <div className="mb-6 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl border border-primary/15 bg-primary/[0.08] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-primary/[0.12] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                            <GraduationCap className="mx-auto mb-2 h-4 w-4 text-primary" />
                            <p className="mb-1 text-2xl font-bold text-primary">{university.programs ?? 'N/A'}</p>
                            <p className="text-xs font-medium text-muted-foreground">Programs</p>
                          </div>
                          <div className="rounded-2xl border border-brand-orange/15 bg-brand-orange/10 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-orange/30 group-hover:bg-brand-orange/[0.14] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                            <BadgeCheck className="mx-auto mb-2 h-4 w-4 text-accent" />
                            <p className="mb-1 text-2xl font-bold text-accent">
                              {university.successRate ? `${university.successRate}%` : 'N/A'}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground">Success</p>
                          </div>
                        </div>

                        <Link
                          to={`/portfolio/${university.slug || university.id}`}
                          className="group/cta mt-auto inline-flex h-12 items-center justify-between rounded-2xl border border-primary/[0.18] bg-white/[0.72] px-4 text-sm font-bold text-primary shadow-[0_12px_28px_rgba(45,27,105,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/[0.45] hover:bg-brand-purple hover:text-white hover:shadow-[0_18px_34px_rgba(45,27,105,0.18)] focus:outline-none focus:ring-2 focus:ring-primary/25 dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-white dark:hover:border-brand-orange/[0.45] dark:hover:bg-brand-orange"
                        >
                          <span>View profile</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange transition-all duration-300 group-hover/cta:translate-x-1 group-hover/cta:bg-white group-hover/cta:text-brand-purple dark:bg-white/[0.12] dark:text-white">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#D9D1EF] bg-white/80 py-20 text-center shadow-[0_16px_42px_rgba(16,12,40,0.08)] dark:border-[#3A2D70] dark:bg-[#120D25]/85">
              <Search className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
              <h3 className="mb-2 text-2xl font-bold text-foreground">No universities found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
      </LazySection>
    </div>
  );
}
