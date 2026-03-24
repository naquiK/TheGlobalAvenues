import { ArrowRight, CalendarDays, Clock3, Euro, Flame, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const spotlightProgram = {
  title: 'AI Business Summer School',
  city: 'Rennes, France',
  fee: 'Between EUR 1,250 and EUR 3,500',
  deadline: 'April 10, 2026',
  description:
    'These summer opportunities allow students to study in France, gain practical skills, experience life in Rennes, and discover our learning environment.',
};

const shortCourses = [
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
];

export default function SummerSchoolHighlightSection() {
  const spotlightRef = useScrollAnimation({ y: 22, duration: 620 });
  const titlePrefix = spotlightProgram.title.replace('Summer School', '').trim();

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          ref={spotlightRef}
          className="summer-highlight-shell relative overflow-hidden rounded-[32px] border border-[#E3C7B2] bg-[linear-gradient(112deg,#FFF8F3_0%,#F8F1FF_44%,#FFF3E8_100%)] p-6 shadow-[0_26px_62px_rgba(20,14,45,0.14)] dark:border-[#4A3A85] dark:bg-[linear-gradient(112deg,#1A1432_0%,#120D24_54%,#24140E_100%)] sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/12 blur-3xl dark:bg-primary/16" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-accent/14 blur-3xl dark:bg-accent/14" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/portfolio/mjm-graphic-design"
                className="summer-hot-blink-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]"
              >
                <Flame className="h-3.5 w-3.5" />
                New
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:border-white/20 dark:bg-white/10 dark:text-white">
                Program Highlight
              </div>
              <div className="inline-flex items-center rounded-full border border-[#FFAE81]/50 bg-[linear-gradient(94deg,rgba(255,236,224,0.82)_0%,rgba(255,246,208,0.82)_100%)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#C95A2C] dark:border-[#C17854]/35 dark:bg-[linear-gradient(94deg,rgba(59,34,28,0.72)_0%,rgba(63,49,28,0.66)_100%)] dark:text-[#F2B795]">
                New Opportunity 2026
              </div>
            </div>
            <div className="summer-highlight-ribbon mt-4" aria-hidden="true" />

            <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Summer School 2026
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                  {titlePrefix}{' '}
                  <span className="summer-highlight-emphasis">Summer School</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {spotlightProgram.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {spotlightProgram.city}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                    <Euro className="h-4 w-4 text-primary" />
                    {spotlightProgram.fee}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                    <Clock3 className="h-4 w-4 text-primary" />
                    Apply by {spotlightProgram.deadline}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E6CEBF] bg-[linear-gradient(145deg,rgba(255,255,255,0.86)_0%,rgba(250,245,255,0.88)_58%,rgba(255,240,230,0.84)_100%)] p-5 shadow-[0_16px_34px_rgba(20,14,45,0.1)] dark:border-[#4A3A85] dark:bg-[linear-gradient(150deg,rgba(26,20,52,0.94)_0%,rgba(17,13,35,0.96)_58%,rgba(33,19,14,0.86)_100%)] dark:shadow-[0_18px_34px_rgba(6,4,16,0.52)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Quick Info
                </p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">SUMMER SCHOOL</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Flexible short-format modules designed for international exposure and practical classroom outcomes.
                </p>

                <div className="mt-5 space-y-2.5 text-sm">
                  <p className="rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-foreground dark:border-white/15 dark:bg-white/[0.08]">
                    Location: Rennes, France
                  </p>
                  <p className="rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-foreground dark:border-white/15 dark:bg-white/[0.08]">
                    AI Business: fee range based on number of courses selected
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Link
                    to="/portfolio/mjm-graphic-design"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_52%,#E8521A_100%)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(45,27,105,0.3)] dark:shadow-[0_10px_24px_rgba(10,8,22,0.35)]"
                  >
                    View University Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/collaborate"
                    className="inline-flex items-center justify-center rounded-xl border border-primary/30 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 dark:border-[#5A469E] dark:bg-[#1B1436] dark:text-[#EAE4FF] dark:hover:bg-[#241A49]"
                  >
                    Request Guidance
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-7 border-t border-border/50 pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {shortCourses.map((course) => (
                  <article
                    key={course.title}
                    className="rounded-2xl border border-[#D8D1EF] bg-[linear-gradient(150deg,#FFFFFF_0%,#F9F6FF_100%)] p-5 shadow-[0_14px_32px_rgba(16,12,40,0.08)] transition-transform duration-300 hover:-translate-y-1 dark:border-[#4C3B88] dark:bg-[linear-gradient(150deg,#1B1435_0%,#120D24_100%)]"
                  >
                    <span className="mb-3 block h-[2px] w-14 rounded-full bg-[linear-gradient(90deg,#FF7F50_0%,#FFC84E_100%)] opacity-80" aria-hidden="true" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Short Course</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight text-foreground">{course.title}</h3>

                    <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2.5">
                        <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{course.dates}</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Euro className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{course.fee}</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>Apply by {course.deadline}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
