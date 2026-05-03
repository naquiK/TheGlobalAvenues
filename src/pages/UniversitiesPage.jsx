import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Search, SlidersHorizontal, TrendingUp, Users } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { useSettings } from '../context/SettingsContext';
import Seo from '../components/seo/Seo';

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
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
        title="Partner Universities"
        description="Browse partner universities and institutions across Europe and beyond with The Global Avenues."
        path="/universities"
        image="/universities/benedictine-university-hero.jpg"
        keywords={['partner universities', 'study abroad institutions', 'international universities']}
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
                    className="group overflow-hidden rounded-[26px] border border-[#D8D1EE] bg-[linear-gradient(160deg,#FFFFFF_0%,#F8F5FF_100%)] shadow-[0_18px_46px_rgba(16,12,40,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_24px_56px_rgba(16,12,40,0.12)] dark:border-[#382C68] dark:bg-[linear-gradient(160deg,#15102B_0%,#100B1F_100%)]"
                  >
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      <img
                        src={university.image}
                        alt={university.title}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full ${
                          useContainedHeroImage ? 'object-contain bg-[#E5E5E5] p-5' : 'object-cover'
                        }`}
                      />

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,10,38,0)_42%,rgba(16,10,38,0.32)_100%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                      {university.logo ? (
                        <div
                          className={`absolute left-4 top-4 rounded-xl border p-1.5 shadow-md ${
                            isLightLogo
                              ? 'border-white/30 bg-[#20184A]/88 backdrop-blur-sm'
                              : 'border-white/45 bg-white/95'
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

                      <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/45 bg-brand-purple px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(45,27,105,0.24)]">
                        <Globe className="h-3.5 w-3.5" />
                        {university.country}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="mb-3 line-clamp-3 text-2xl font-bold leading-tight text-foreground">
                        {university.title}
                      </h3>
                      <p className="mb-5 line-clamp-2 text-sm text-muted-foreground">{university.description}</p>

                      <div className="mb-6 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-primary/10 p-4 text-center">
                          <p className="mb-1 text-2xl font-bold text-primary">{university.programs ?? 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">Programs</p>
                        </div>
                        <div className="rounded-lg bg-accent/10 p-4 text-center">
                          <p className="mb-1 text-2xl font-bold text-accent">
                            {university.successRate ? `${university.successRate}%` : 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">Success</p>
                        </div>
                      </div>

                      <Link
                        to={`/portfolio/${university.slug || university.id}`}
                        className="inline-flex items-center gap-2 font-semibold text-primary transition-colors duration-300 hover:text-secondary"
                      >
                        View profile
                        <ArrowRight className="h-4 w-4" />
                      </Link>
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
    </div>
  );
}
