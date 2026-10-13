import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../config';
import {
  skolaeApplicationSteps,
  skolaeCareerGuide,
  skolaeDeadlineNote,
  skolaeGroup,
  skolaeOtherSchools,
  skolaeSchools,
  skolaeWorthKnowing,
} from '../../data/skolaeGroupData';

const schoolByKey = Object.fromEntries(skolaeSchools.map((school) => [school.key, school]));

// Editorial-style layout: thin rules and typography instead of stacked cards.
const rule = 'border-[#1A1033]/15 dark:border-white/15';
const linkClass =
  'font-semibold text-[#2D1B69] underline decoration-[#E8521A]/60 decoration-2 underline-offset-4 transition-colors hover:text-[#E8521A] hover:decoration-[#E8521A] dark:text-white';

function SchoolLogo({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-9 w-auto max-w-[9rem] object-contain dark:rounded dark:bg-white dark:px-2 dark:py-1"
    />
  );
}

function SchoolSection({ school, index }) {
  const isEven = index % 2 === 0;
  const showLanguage = school.programs.some((program) => program.language);
  const columns = showLanguage
    ? 'sm:grid-cols-[minmax(0,1fr)_13rem_8rem]'
    : 'sm:grid-cols-[minmax(0,1fr)_14rem]';

  return (
    <section
      id={`school-${school.key}`}
      aria-labelledby={`school-${school.key}-title`}
      className={`scroll-mt-32 grid grid-cols-1 gap-x-12 gap-y-8 border-b py-14 lg:grid-cols-12 ${rule}`}
    >
      <figure className={`lg:sticky lg:top-36 lg:col-span-5 lg:self-start ${isEven ? '' : 'lg:order-2 lg:col-start-8'}`}>
        <img
          src={school.photo}
          alt={school.photoAlt}
          loading="lazy"
          decoding="async"
          className={`w-full rounded-sm object-cover ${isEven ? 'aspect-[4/3]' : 'aspect-[4/3] lg:aspect-[4/5]'}`}
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">{school.photoCredit}</figcaption>
      </figure>

      <div className={`min-w-0 lg:col-span-7 ${isEven ? '' : 'lg:order-1 lg:col-span-6 lg:col-start-1'}`}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-serif text-xl italic text-[#E8521A]">{String(index + 1).padStart(2, '0')}</p>
            <h3 id={`school-${school.key}-title`} className="mt-1 font-heading text-3xl font-bold tracking-tight">
              {school.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {school.fullName} · {school.focus}
            </p>
          </div>
          <div className="hidden flex-shrink-0 items-center gap-3 sm:flex">
            <SchoolLogo src={school.logo} alt={`${school.name} logo`} />
            {school.secondaryLogo && <SchoolLogo src={school.secondaryLogo} alt="EFET Photo logo" />}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 sm:hidden">
          <SchoolLogo src={school.logo} alt={`${school.name} logo`} />
          {school.secondaryLogo && <SchoolLogo src={school.secondaryLogo} alt="EFET Photo logo" />}
        </div>

        <p className="mt-4 text-sm font-medium text-foreground/70">{school.facts.join('  ·  ')}</p>
        <p className="mt-4 text-base leading-relaxed text-foreground/85">{school.summary}</p>

        <p className="mt-5 border-l-2 border-[#E8521A] pl-4 text-sm leading-relaxed text-foreground/85">
          <span className="font-semibold text-foreground">A good fit if </span>
          {school.goodFit}
        </p>

        <div className="mt-7">
          <div
            className={`hidden gap-4 border-b pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid ${columns} ${rule}`}
          >
            <span>Programme</span>
            <span>Level</span>
            {showLanguage && <span>Language</span>}
          </div>
          <ul>
            {school.programs.map((program) => (
              <li
                key={program.title}
                className={`grid grid-cols-1 gap-x-4 gap-y-0.5 border-b py-3 text-sm ${columns} ${rule}`}
              >
                <span className="min-w-0">
                  <span className="font-semibold text-foreground">{program.title}</span>
                  {program.note && <span className="block text-xs text-muted-foreground">{program.note}</span>}
                </span>
                <span className="text-muted-foreground">{program.level}</span>
                {showLanguage &&
                  (program.language ? (
                    <span className="font-medium text-[#5340B0] dark:text-[#C9BFFF]">{program.language}</span>
                  ) : (
                    <span className="hidden text-muted-foreground/60 sm:block">Ask us</span>
                  ))}
              </li>
            ))}
          </ul>
          {!showLanguage && (
            <p className="mt-3 text-xs text-muted-foreground">
              {school.name} doesn&apos;t list the teaching language for these programmes. We&apos;ll confirm it for your
              intake.
            </p>
          )}
        </div>

        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={school.website} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {school.name} website ↗
          </a>
          <Link to="/collaborate" className={linkClass}>
            Ask us about {school.name}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function SkolaeGroupProfile() {
  const phone = SITE_CONFIG.contact.phone?.[0];

  return (
    <article className="text-foreground">
      {/* Masthead */}
      <header className={`grid grid-cols-1 gap-8 border-b pb-10 pt-2 lg:grid-cols-12 lg:items-end ${rule}`}>
        <div className="lg:col-span-8">
          <p className="text-sm text-muted-foreground">
            <Link to="/portfolio" className="hover:text-foreground">
              Our Portfolio
            </Link>
            <span className="mx-2">/</span>
            France
            <span className="mx-2">/</span>
            Group partner
          </p>
          <h1 className="mt-5 font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {skolaeGroup.name}
          </h1>
          <p className="mt-5 max-w-2xl font-serif text-2xl leading-snug text-foreground/80 sm:text-[1.9rem]">
            {skolaeGroup.standfirst}
          </p>
        </div>
        <div className="lg:col-span-4 lg:flex lg:justify-end">
          <img src={skolaeGroup.logoDark} alt="SKOLAE logo" width="240" height="68" className="h-10 w-auto dark:hidden sm:h-12" />
          <img
            src={skolaeGroup.logoWhite}
            alt="SKOLAE logo"
            width="240"
            height="68"
            className="hidden h-10 w-auto dark:block sm:h-12"
          />
        </div>
      </header>

      {/* Lead photo */}
      <figure className="mt-10">
        <img
          src={skolaeGroup.hero.src}
          alt={skolaeGroup.hero.alt}
          fetchPriority="high"
          decoding="async"
          className="aspect-[4/3] w-full rounded-sm object-cover sm:aspect-[21/9]"
        />
        <figcaption className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>{skolaeGroup.hero.caption}</span>
          <span>{skolaeGroup.hero.credit}</span>
        </figcaption>
      </figure>

      {/* Intro + facts */}
      <section className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-5 text-lg leading-relaxed text-foreground/85 lg:col-span-7">
          {skolaeGroup.intro.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-[#E8521A]'
                  : ''
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="skolae-glance">
          <h2 id="skolae-glance" className="border-b-2 border-foreground pb-2 font-heading text-sm font-bold uppercase tracking-[0.14em]">
            At a glance
          </h2>
          <dl>
            {skolaeGroup.glance.map((item) => (
              <div key={item.label} className={`flex items-baseline justify-between gap-4 border-b py-2.5 text-sm ${rule}`}>
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="font-semibold tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">{skolaeGroup.glanceSource}</p>
        </aside>
      </section>

      {/* Schools */}
      <section className="mt-20" aria-labelledby="skolae-schools">
        <div className="flex flex-col gap-3 border-b-2 border-foreground pb-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="skolae-schools" className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            The five schools we work with
          </h2>
          <nav aria-label="Jump to a school" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {skolaeSchools.map((school) => (
              <a key={school.key} href={`#school-${school.key}`} className="text-muted-foreground hover:text-[#E8521A]">
                {school.name}
              </a>
            ))}
          </nav>
        </div>

        {skolaeSchools.map((school, index) => (
          <SchoolSection key={school.key} school={school} index={index} />
        ))}

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The group also runs {skolaeOtherSchools.slice(0, -1).join(', ')} and {skolaeOtherSchools.at(-1)}. If one of
          those suits you better, tell us and we'll look into it.
        </p>
      </section>

      {/* Career guide */}
      <section className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12" aria-labelledby="skolae-careers">
        <div className="lg:col-span-4">
          <h2 id="skolae-careers" className="font-heading text-3xl font-bold tracking-tight">
            Not sure where you fit?
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Start from the job you want. This is how we usually match students. The final choice still depends on your
            marks, portfolio and budget.
          </p>
        </div>
        <div className="lg:col-span-8">
          <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 border-b-2 border-foreground pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] sm:grid">
            <span>If you want to work in…</span>
            <span>Look at</span>
          </div>
          <ul>
            {skolaeCareerGuide.map((row) => (
              <li key={row.goal}>
                <a
                  href={`#school-${row.schoolKey}`}
                  className={`group grid grid-cols-1 gap-x-6 gap-y-0.5 border-b py-3 transition-colors hover:bg-[#F5F3FF] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:px-2 dark:hover:bg-white/[0.04] ${rule}`}
                >
                  <span className="font-semibold">{row.goal}</span>
                  <span className="text-sm text-muted-foreground sm:text-base">
                    <span className="text-foreground group-hover:text-[#E8521A]">{schoolByKey[row.schoolKey]?.name}</span>
                    {' · '}
                    {row.programme}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Worth knowing */}
      <section className={`mt-20 grid grid-cols-1 gap-8 border-y py-10 md:grid-cols-2 ${rule}`} aria-label="Worth knowing">
        {skolaeWorthKnowing.map((item) => (
          <p key={item.lead} className="text-base leading-relaxed text-foreground/85">
            <span className="font-serif text-2xl italic text-foreground">{item.lead}</span> {item.text}
          </p>
        ))}
      </section>

      {/* Applying */}
      <section className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12" aria-labelledby="skolae-apply">
        <div className="lg:col-span-4">
          <h2 id="skolae-apply" className="font-heading text-3xl font-bold tracking-tight">
            Applying from India
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The usual route for non-EU students. We'll walk you through each step, from the application to the visa.
          </p>
          <p className="mt-6 border-l-2 border-[#E8521A] bg-[#FEF0E7]/60 px-4 py-3 text-sm leading-relaxed text-foreground/85 dark:bg-[#E8521A]/10">
            {skolaeDeadlineNote}
          </p>
        </div>
        <ol className="lg:col-span-8">
          {skolaeApplicationSteps.map((step, index) => (
            <li
              key={step.title}
              className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b py-5 first:border-t-2 first:border-t-foreground ${rule}`}
            >
              <span className="font-serif text-4xl leading-none text-[#E8521A]">{index + 1}</span>
              <span>
                <span className="block font-semibold">{step.title}</span>
                <span className="mt-1 block leading-relaxed text-muted-foreground">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Contact */}
      <section className="mb-20 mt-20 grid grid-cols-1 gap-8 border-t-2 border-foreground pt-10 lg:grid-cols-12" aria-labelledby="skolae-contact">
        <h2 id="skolae-contact" className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:col-span-5">
          Questions about SKOLAE?
        </h2>
        <div className="lg:col-span-7">
          <p className="text-lg leading-relaxed text-foreground/85">
            For partnerships and admissions, SKOLAE&apos;s South Asia team is at{' '}
            <a href={`mailto:${skolaeGroup.contact.email}`} className={`${linkClass} [overflow-wrap:anywhere]`}>
              {skolaeGroup.contact.email}
            </a>
            .{' '}
            {phone ? (
              <>
                Or talk to us first on{' '}
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className={`${linkClass} whitespace-nowrap`}>
                  {phone}
                </a>{' '}
                and we&apos;ll help you build a shortlist.
              </>
            ) : null}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              to="/collaborate"
              className="inline-flex items-center rounded-md bg-[#2D1B69] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E8521A]"
            >
              Talk to an advisor
            </Link>
            <a href={skolaeGroup.contact.website} target="_blank" rel="noopener noreferrer" className={`text-sm ${linkClass}`}>
              {skolaeGroup.contact.websiteLabel} ↗
            </a>
          </div>
          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{skolaeGroup.checkedNote}</p>
        </div>
      </section>
    </article>
  );
}
